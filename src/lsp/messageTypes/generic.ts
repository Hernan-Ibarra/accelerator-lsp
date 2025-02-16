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

export const isClientMessage = (msg: object): msg is ClientMessage => {
  if (!("jsonrpc" in msg && msg["jsonrpc"] === "2.0")) {
    return false;
  }

  if (!("method" in msg && typeof msg["method"] === "string")) {
    return false;
  }

  if (
    "id" in msg &&
    !(typeof msg["id"] === "string" || typeof msg["id"] === "number")
  ) {
    return false;
  }

  if ("params" in msg && typeof msg["params"] !== "object") {
    return false;
  }

  return true;
};
