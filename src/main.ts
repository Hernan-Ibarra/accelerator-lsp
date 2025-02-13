import { EventEmitter } from "events";
import { handleMessage } from "./lsp/handleMessage";
import { MessageQueue } from "./lsp/messages";
import { decodeStdin } from "./rpc_utilities/parsing";
import { MessageLogger } from "./logging/loggers";

const main = (): void => {
  const parsedMessages = new MessageQueue();
  const queueListener = new EventEmitter();
  const messageLogger = new MessageLogger("message-history.log");

  decodeStdin(parsedMessages, queueListener);
  queueListener.on("messageEnqueued", () => {
    while (!parsedMessages.isEmpty()) {
      const msg = parsedMessages.dequeue();
      if (msg) {
        messageLogger.logMessage(msg, "received");
        handleMessage(msg, messageLogger);
      }
    }
  });
};

main();
