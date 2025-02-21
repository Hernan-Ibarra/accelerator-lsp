import { ClientMessage, RequestMessage, ResponseMessage } from "../generic";

export type InitializeRequest = {
  method: "initialize";
  params: InitializeParams;
} & RequestMessage;

type InitializeParams = {
  clientInfo?: {
    name: string;
    version?: string;
  };
};

export type initializeResponse = ResponseMessage & {
  result: InitializeResult;
};

interface InitializeResult {
  capabilities: ServerCapabilities;
  serverInfo: ServerInfo;
}

interface ServerCapabilities {
  textDocumentSync?: number;
  hoverProvider?: boolean;
  codeActionProvider?: boolean;
  completionProvider?: {
    triggerCharacters?: string[];
  };
}

interface ServerInfo {
  name: string;
  version: string;
}

export const isInitializeRequest = (
  msg: ClientMessage,
): msg is InitializeRequest => {
  if (!("method" in msg && msg["method"] === "initialize")) {
    return false;
  }

  if (msg["params"] !== undefined) {
    return isInitializeParams(msg["params"]);
  }

  return true;
};

const isInitializeParams = (params: object): params is InitializeParams => {
  if ("clientInfo" in params) {
    const clientInfo = params.clientInfo;
    if (typeof clientInfo !== "object" || clientInfo === null) {
      return false;
    }
    if (!("name" in clientInfo && typeof "name" === "string")) {
      return false;
    }
    if ("version" in clientInfo && typeof clientInfo.version !== "string") {
      return false;
    }
  }

  return true;
};
