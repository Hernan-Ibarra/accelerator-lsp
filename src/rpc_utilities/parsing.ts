import { EventEmitter } from "events";
import { RequestMessage, MessageQueue } from "../lsp/messages";

export const decodeStdin = (
  queue: MessageQueue,
  emitter: EventEmitter,
): void => {
  interface StreamState {
    unprocessedBytes: Buffer;
    numberOfBytesExpected?: number;
  }

  const streamState: StreamState = {
    unprocessedBytes: Buffer.alloc(0),
  };

  process.stdin.on("data", (input: Buffer) => {
    let bytesToProcess: Buffer = Buffer.concat([
      streamState.unprocessedBytes,
      input,
    ]);
    let contentLength = streamState.numberOfBytesExpected;

    if (!contentLength) {
      const attemptToGetContentLength = getContentLength(bytesToProcess);
      if (attemptToGetContentLength.wasSuccesful) {
        bytesToProcess = attemptToGetContentLength.contentBytes;
        contentLength = attemptToGetContentLength.result;
      } else {
        streamState.unprocessedBytes = bytesToProcess;
        return;
      }
    }

    if (bytesToProcess.length < contentLength) {
      streamState.unprocessedBytes = bytesToProcess;
      streamState.numberOfBytesExpected = contentLength;
      return;
    }

    const parsedMessage = parseMessage(
      bytesToProcess.subarray(0, contentLength),
    );

    queue.enqueue(parsedMessage);
    emitter.emit("messageEnqueued");

    streamState.unprocessedBytes = bytesToProcess.subarray(contentLength);
    streamState.numberOfBytesExpected = undefined;
  });
};

export type AttemptToGetContentLength =
  | {
      wasSuccesful: true;
      result: number;
      contentBytes: Buffer;
    }
  | { wasSuccesful: false };

export const getContentLength = (
  messageBytes: Buffer,
): AttemptToGetContentLength => {
  const delimiter = Buffer.from("\r\n\r\n", "utf8");
  const index = messageBytes.indexOf(delimiter);

  if (index === -1) {
    return { wasSuccesful: false };
  }

  const headerBytes = messageBytes.subarray(0, index);
  const header = headerBytes.toString("utf8");
  const contentLengthString = header.slice("Content-Length: ".length);
  const contentLength = parseInt(contentLengthString);

  return {
    wasSuccesful: true,
    result: contentLength,
    contentBytes: messageBytes.subarray(index + delimiter.length),
  };
};

export const parseMessage = (contentBytes: Buffer): RequestMessage => {
  const content = JSON.parse(contentBytes.toString("utf8"));

  if (typeof content.id !== "number") {
    throw new Error("The 'id' property is missing or is not a number.");
  }

  if (typeof content.method !== "string") {
    throw new Error("The 'method' property is missing or is not a string.");
  }

  return content;
};

export const encodeMessage = (msg: Record<string, unknown>): Buffer => {
  const content = JSON.stringify(msg);
  const contentBytes = Buffer.from(content, "utf8");

  const header = `Content-Length: ${contentBytes.length}`;
  const headerBytes = Buffer.from(header, "utf8");

  const separatingBytes = Buffer.from("\r\n\r\n", "utf8");

  return Buffer.concat([headerBytes, separatingBytes, contentBytes]);
};
