export interface Message {
  jsonrpc: string;
}

export interface RequestMessage extends Message {
  id: number | string;
  method: string;
}

export class MessageQueue {
  private messages: RequestMessage[] = [];

  enqueue(message: RequestMessage): void {
    this.messages.push(message);
  }

  dequeue(): RequestMessage | undefined {
    return this.messages.shift();
  }

  isEmpty(): boolean {
    return this.messages.length === 0;
  }

  peek(): RequestMessage | undefined {
    return !this.isEmpty() ? this.messages[0] : undefined;
  }

  size(): number {
    return this.messages.length;
  }
}
