import { RequestMessage, ResponseMessage } from "../generic";

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
  textDocumentSync: number;
  hoverProvider: boolean;
  //definitionProvider: boolean;
  //codeActionProvider: boolean;
  //completionProvider: Record<string,any>;
}

interface ServerInfo {
  name: string;
  version: string;
}
