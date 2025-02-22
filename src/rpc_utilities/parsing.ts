import { EventEmitter } from "events";
import {
  ClientMessage,
  isClientMessage,
  ServerMessage,
} from "../lsp/messageTypes/generic";
import { MessageQueue } from "../lsp/messageQueue";
import { Logger } from "../logging/loggers";

interface StreamState {
  unprocessedBytes: Buffer;
  numberOfBytesExpected?: number;
}
export const decodeStdin = (
  queue: MessageQueue,
  emitter: EventEmitter,
): void => {
  const streamState: StreamState = {
    unprocessedBytes: Buffer.alloc(0),
  };

  const rawLogger: Logger = new Logger("raw.log");

  process.stdin.on("data", (input: Buffer) => {
    rawLogger.log(input.toString("utf8"));
    handleData(input, streamState, queue, emitter);
  });
};

const handleData = (
  input: Buffer,
  streamState: StreamState,
  queue: MessageQueue,
  emitter: EventEmitter,
) => {
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

  const parsedMessage = parseMessage(bytesToProcess.subarray(0, contentLength));

  if (parsedMessage !== undefined) {
    queue.enqueue(parsedMessage);
    emitter.emit("messageEnqueued");
  }

  streamState.unprocessedBytes = bytesToProcess.subarray(contentLength);
  streamState.numberOfBytesExpected = undefined;

  handleData(Buffer.alloc(0), streamState, queue, emitter);
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

export const parseMessage = (
  contentBytes: Buffer,
): ClientMessage | undefined => {
  const parsingLogger = new Logger("parsing.log");

  let content;
  try {
    content = JSON.parse(contentBytes.toString("utf8"));
  } catch {
    parsingLogger.error("Could not parse bytes");
    return;
  }

  if (isClientMessage(content)) {
    parsingLogger.info(`Succesfully parsed client message: ${content.method}`);
    return content;
  } else {
    parsingLogger.error(
      "The bytes were parsed but they did not look like a client message",
    );
    return;
  }
};

export const encodeMessage = (msg: ServerMessage): Buffer => {
  const content = JSON.stringify(msg);
  const contentBytes = Buffer.from(content, "utf8");

  const header = `Content-Length: ${contentBytes.length}`;
  const headerBytes = Buffer.from(header, "utf8");

  const separatingBytes = Buffer.from("\r\n\r\n", "utf8");

  return Buffer.concat([headerBytes, separatingBytes, contentBytes]);
};
