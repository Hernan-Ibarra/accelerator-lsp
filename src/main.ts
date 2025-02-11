import { EventEmitter } from "events";
import { handleMessage } from "./lsp/handleMessage";
import { MessageQueue } from "./rpc_utilities/messages";
import { decodeStdin } from "./rpc_utilities/parsing";

const main = (): void => {
  const parsedMessages = new MessageQueue();
  const emitter = new EventEmitter();

  decodeStdin(parsedMessages, emitter);
  emitter.on("messageEnqueued", () => {
    while (!parsedMessages.isEmpty()) {
      const msg = parsedMessages.dequeue();
      if (msg) {
        handleMessage(msg);
      }
    }
  });
};

main();
