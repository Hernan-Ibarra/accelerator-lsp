import fs from "fs";
import path from "path";
import { ClientMessage, ServerMessage } from "../lsp/messageTypes/generic";

export class Logger {
  protected static rootDirectory: string = process.cwd();
  protected logFilePath: string;
  protected stream: fs.WriteStream;

  constructor(logFileName: string) {
    this.logFilePath = path.join(Logger.rootDirectory, "/logs", logFileName);
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

export class MessageLogger extends Logger {
  constructor(logFileName: string) {
    super(logFileName);

    let isFileEmpty;
    try {
      isFileEmpty = fs.readFileSync(this.logFilePath).length === 0;
    } catch {
      isFileEmpty = true;
    }

    if (isFileEmpty) {
      this.stream.write(
        "<!-- vim:set filetype=markdown foldmethod=indent: -->\n# Message History\n\n",
      );
    } else {
      this.stream.write(
        "\n---\n\n<!-- NOTE: New session detected!-->\n\n---\n\n",
      );
    }
  }

  logMessage(
    message: ServerMessage | ClientMessage,
    sentOrReceived: "sent" | "received",
  ) {
    if (sentOrReceived === "sent") {
      this.log(
        `Message Sent\n\`\`\`json\n${JSON.stringify(message, null, "\t")}\n\`\`\`\n`,
      );
    } else if (sentOrReceived === "received") {
      this.log(
        `Message Received\n\`\`\`json\n${JSON.stringify(message, null, "\t")}\n\`\`\`\n`,
      );
    }
  }
}
