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

export interface VersionedDocumentIdentifier {
  version: number;
  uri: string;
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

export const isVersionedDocumentIdentifier = (
  textDocument: unknown,
): textDocument is VersionedDocumentIdentifier => {
  if (typeof textDocument !== "object" || textDocument === null) {
    return false;
  }

  if (
    !("version" in textDocument && typeof textDocument.version === "string")
  ) {
    return false;
  }

  if (!("uri" in textDocument && typeof textDocument.uri === "string")) {
    return false;
  }
  return true;
};
