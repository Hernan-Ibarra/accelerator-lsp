import { RequestMessage } from "./messages";

export const handleMessage = (msg: RequestMessage) => {
  process.stdout.write("I received your message!");
  process.stdout.write(JSON.stringify(msg));
};
