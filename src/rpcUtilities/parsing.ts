import { Message, MessageQueue } from "./messages";

export const decodeStdin = (queue: MessageQueue) => {
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

    streamState.unprocessedBytes = bytesToProcess.subarray(contentLength);
    streamState.numberOfBytesExpected = undefined;
  });
};

type AttemptToGetContentLength =
  | {
      wasSuccesful: true;
      result: number;
      contentBytes: Buffer;
    }
  | { wasSuccesful: false };

const getContentLength = (messageBytes: Buffer): AttemptToGetContentLength => {
  const delimiter = Buffer.from("\r\n\r\n", "utf8");
  const index = messageBytes.indexOf(delimiter);

  if (index === -1) {
    return { wasSuccesful: false };
  }

  const headerBytes = messageBytes.subarray(0, index);
  const header = headerBytes.toString("utf8");
  const contentLengthString = header.slice("Content-Length ".length);
  const contentLength = parseInt(contentLengthString);

  return {
    wasSuccesful: true,
    result: contentLength,
    contentBytes: messageBytes.subarray(index),
  };
};

const parseMessage = (contentBytes: Buffer): Message => {
  const content = JSON.parse(contentBytes.toString("utf8"));

  if (typeof content.method !== "string") {
    throw new Error("The 'method' property is missing or is not a string.");
  }

  return content;
};
