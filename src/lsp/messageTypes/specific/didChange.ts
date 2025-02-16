import { ClientMessage, NotificationMessage } from "../generic";

export type DidChangeNotification = {
  method: "textDocument/didChange";
  params: DidChangeDocumentParams;
} & NotificationMessage;

interface DidChangeDocumentParams {
  textDocument: VersionedDocumentIdentifier;
  contentChanges: TextDocumentContentChangeEvent[];
}

interface TextDocumentContentChangeEvent {
  text: string;
}

export interface TextDocumentIdentifier {
  uri: string;
}

export interface VersionedDocumentIdentifier extends TextDocumentIdentifier {
  version: number;
}

export const isDidChangeNotification = (
  msg: ClientMessage,
): msg is DidChangeNotification => {
  if (msg.method !== "textDocument/didChange") {
    return false;
  }

  if (!(msg.params !== undefined && msg.params !== null)) {
    return false;
  }

  if (
    !(
      "contentChanges" in msg.params && Array.isArray(msg.params.contentChanges)
    )
  ) {
    return false;
  }

  msg.params["contentChanges"].forEach((element) => {
    if (typeof element !== "object" || element === null) {
      return false;
    }
    if (!("text" in element && typeof element.text === "string")) {
      return false;
    }
  });

  if (
    !(
      "textDocument" in msg.params &&
      isVersionedDocumentIdentifier(msg.params.textDocument)
    )
  ) {
    return false;
  }

  return true;
};

export const isTextDocumentIdentifier = (
  textDocument: object,
): textDocument is TextDocumentIdentifier => {
  if (!("uri" in textDocument && typeof textDocument.uri === "string")) {
    return false;
  }
  return true;
};

export const isVersionedDocumentIdentifier = (
  textDocument: unknown,
): textDocument is VersionedDocumentIdentifier => {
  if (typeof textDocument !== "object" || textDocument === null) {
    return false;
  }

  if (
    !("version" in textDocument && typeof textDocument.version === "number")
  ) {
    return false;
  }

  if (!isTextDocumentIdentifier(textDocument)) {
    return false;
  }

  return true;
};
