export interface Message {
  method: string;
}

export class MessageQueue {
  private messages: Message[] = [];

  enqueue(message: Message): void {
    this.messages.push(message);
  }

  dequeue(): Message | undefined {
    return this.messages.shift();
  }

  isEmpty(): boolean {
    return this.messages.length === 0;
  }

  peek(): Message | undefined {
    return !this.isEmpty() ? this.messages[0] : undefined;
  }

  size(): number {
    return this.messages.length;
  }
}
