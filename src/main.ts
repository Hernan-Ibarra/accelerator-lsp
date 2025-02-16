import { EventEmitter } from "events";
import { handleMessage } from "./lsp/handleMessage";
import { decodeStdin } from "./rpc_utilities/parsing";
import { MessageLogger } from "./logging/loggers";
import { MessageQueue } from "./lsp/messageQueue";
import { State } from "./analysis/state";

const main = (): void => {
  const parsedMessages = new MessageQueue();
  const queueListener = new EventEmitter();
  const messageLogger = new MessageLogger("message-history.log");
  const state = new State();

  decodeStdin(parsedMessages, queueListener);
  queueListener.on("messageEnqueued", () => {
    while (!parsedMessages.isEmpty()) {
      const msg = parsedMessages.dequeue();
      if (msg) {
        messageLogger.logMessage(msg, "received");
        handleMessage(msg, state, messageLogger);
      }
    }
  });
};

main();
