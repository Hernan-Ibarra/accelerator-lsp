import { handleMessage } from "./lsp/handleMessage";
import { MessageQueue } from "./rpcUtilities/messages";
import { decodeStdin } from "./rpcUtilities/parsing";

const main = (): void => {
  const parsedMessages = new MessageQueue();

  decodeStdin(parsedMessages);

  while (true) {
    const msg = parsedMessages.dequeue();
    if (msg) {
      handleMessage(msg);
    }
  }
};

main();
