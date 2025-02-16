import { ClientMessage, NotificationMessage } from "../generic";
import {
  isVersionedDocumentIdentifier,
  VersionedDocumentIdentifier,
} from "./didChange";

export type DidOpenNotification = {
  method: "textDocument/didOpen";
  params: DidOpenTextDocumentParams;
} & NotificationMessage;

interface DidOpenTextDocumentParams {
  textDocument: TextDocumentItem;
}

interface TextDocumentItem extends VersionedDocumentIdentifier {
  languageId: string;
  text: string;
}

export const isDidOpenNotification = (
  msg: ClientMessage,
): msg is DidOpenNotification => {
  if (msg.method !== "textDocument/didOpen") {
    return false;
  }

  if (msg.params === undefined || msg.params === null) {
    return false;
  }

  if (
    !(
      "textDocument" in msg.params &&
      isTextDocumentItem(msg.params.textDocument)
    )
  ) {
    return false;
  }

  return true;
};

const isTextDocumentItem = (
  textDocument: unknown,
): textDocument is TextDocumentItem => {
  if (typeof textDocument !== "object" || textDocument === null) {
    return false;
  }

  if (!isVersionedDocumentIdentifier(textDocument)) {
    return false;
  }

  if (
    !(
      "languageId" in textDocument &&
      typeof textDocument.languageId === "string"
    )
  ) {
    return false;
  }

  if (!("text" in textDocument && typeof textDocument.text === "string")) {
    return false;
  }

  return true;
};
