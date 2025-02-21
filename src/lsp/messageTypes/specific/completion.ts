import { ClientMessage, RequestMessage, ResponseMessage } from "../generic";
import { TextDocumentPositionParams } from "./hover";

export type CompletionRequest = {
  method: "textDocument/completion";
  params: CompletionParams;
} & RequestMessage;

interface CompletionParams extends TextDocumentPositionParams {
  context?: {
    triggerKind: 1 | 2 | 3;
    triggerCharacter?: string;
  };
}

export type CompletionResponse = ResponseMessage & {
  result: CompletionItem[] | null;
};

export interface CompletionItem {
  label: string;
  kind?: number;
  detail?: string;
  documentation?: string;
}

export const isCompletionRequest = (
  msg: ClientMessage,
): msg is CompletionRequest => {
  return true;
};
