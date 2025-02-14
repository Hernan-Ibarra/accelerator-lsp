import { NotificationMessage, RequestMessage } from "./messageTypes/generic";

export class MessageQueue {
  private messages: (RequestMessage | NotificationMessage)[] = [];

  enqueue(message: RequestMessage | NotificationMessage): void {
    this.messages.push(message);
  }

  dequeue(): (RequestMessage | NotificationMessage) | undefined {
    return this.messages.shift();
  }

  isEmpty(): boolean {
    return this.messages.length === 0;
  }

  peek(): (RequestMessage | NotificationMessage) | undefined {
    return !this.isEmpty() ? this.messages[0] : undefined;
  }

  size(): number {
    return this.messages.length;
  }
}
