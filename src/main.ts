import { EventEmitter } from "events";
import { handleMessage } from "./lsp/handleMessage";
import { MessageQueue } from "./rpc_utilities/messages";
import { decodeStdin } from "./rpc_utilities/parsing";

import fs from "fs";
import path from "path";

class FileLogger {
  private static rootDirectory: string = process.cwd();
  private logFilePath: string;
  private stream: fs.WriteStream;

  constructor(logFileName: string) {
    this.logFilePath = path.join(
      FileLogger.rootDirectory,
      "/logs",
      logFileName,
    );
    this.stream = fs.createWriteStream(this.logFilePath, { flags: "a" });
  }

  log(message: string, level: string = "INFO") {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level}]: ${message}\n`;

    this.stream.write(logMessage);
  }

  info(message: string) {
    this.log(message, "INFO");
  }

  error(message: string) {
    this.log(message, "ERROR");
  }

  warn(message: string) {
    this.log(message, "WARN");
  }

  turnOff() {
    this.stream.close();
  }
}

const main = (): void => {
  const parsedMessages = new MessageQueue();
  const queueListener = new EventEmitter();
  const messageLog = new FileLogger("message-history.txt");

  decodeStdin(parsedMessages, queueListener);
  queueListener.on("messageEnqueued", () => {
    while (!parsedMessages.isEmpty()) {
      const msg = parsedMessages.dequeue();
      if (msg) {
        messageLog.log(`Message Received= ${JSON.stringify(msg)}`);
        handleMessage(msg);
      }
    }
  });
};

main();
