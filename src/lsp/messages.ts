export interface Message {
  jsonrpc: "2.0";
}

export interface RequestMessage extends Message {
  id: number | string;
  method: string;
  params?: object;
}

export type InitializeParams = {
  clientInfo?: {
    name: string;
    version?: string;
  };
};

export type InitializeRequest = {
  method: "initialize";
  params: InitializeParams;
} & RequestMessage;

export interface ResponseMessage extends Message {
  id: number | string | null;
  result?: object;
  //error?: ResponseError
}

export type initializeResponse = ResponseMessage & {
  result: InitializeResult;
};

export interface InitializeResult {
  //capabilities: ServerCapabilities;
  capabilities: object;
  serverInfo: ServerInfo;
}

export interface ServerCapabilities {
  textDocumentSync: number;
  hoverProvider: boolean;
  definitionProvider: boolean;
  codeActionProvider: boolean;
  //completionProvider: Record<string,any>;
}
interface ServerInfo {
  name: string;
  version: string;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: object;
}

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
