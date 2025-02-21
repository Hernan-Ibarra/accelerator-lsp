import { ClientMessage, RequestMessage, ResponseMessage } from "../generic";
import { TextDocumentIdentifier } from "./didChange";
import { Position } from "./hover";

export type CodeActionRequest = {
  method: "textDocument/codeAction";
  params: CodeActionParams;
} & RequestMessage;

interface CodeActionParams {
  textDocument: TextDocumentIdentifier;
  range: Range;
  context: CodeActionContext;
}

export interface Range {
  start: Position;
  end: Position;
}

interface CodeActionContext {
  diagnostics: Diagnostic[];
}

export interface Diagnostic {
  range: Range;
  severity?: 1 | 2 | 3 | 4;
  source?: string;
  message: string;
}

export type CodeActionResponse = ResponseMessage & {
  result: CodeAction[] | null;
};

export interface CodeAction {
  title: string;
  edit?: WorkspaceEdit;
}

interface WorkspaceEdit {
  changes?: { [uri: string]: TextEdit[] };
}

interface TextEdit {
  range: Range;
  newText: string;
}

// TODO: Massive todo here.
export const isCodeActionRequest = (
  msg: ClientMessage,
): msg is CodeActionRequest => {
  return true;
};
