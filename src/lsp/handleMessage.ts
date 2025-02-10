import { Message } from "../rpcUtilities/messages";

export const handleMessage = (msg: Message) => {
  process.stdout.write("I received your message!");
  process.stdout.write(JSON.stringify(msg));
};
