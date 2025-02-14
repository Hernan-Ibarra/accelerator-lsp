interface Message {
  jsonrpc: "2.0";
}

export interface RequestMessage extends Message {
  id: number | string;
  method: string;
  params?: object;
}

export interface ResponseMessage extends Message {
  id: number | string | null;
  result?: object;
  //error?: ResponseError
}

export interface NotificationMessage extends Message {
  method: string;
  params?: object;
}

export type ClientMessage = RequestMessage | NotificationMessage;
export type ServerMessage = ResponseMessage | NotificationMessage;
