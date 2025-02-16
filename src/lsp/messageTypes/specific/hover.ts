import { ClientMessage, RequestMessage, ResponseMessage } from "../generic";
import { isTextDocumentIdentifier, TextDocumentIdentifier } from "./didChange";

export type HoverRequest = {
  method: "textDocument/hover";
  params: HoverParams;
} & RequestMessage;

interface HoverParams extends TextDocumentPositionParams {}

interface TextDocumentPositionParams {
  textDocument: TextDocumentIdentifier;
  position: Position;
}

export interface Position {
  line: number;
  character: number;
}

export const isHoverRequest = (msg: ClientMessage): msg is HoverRequest => {
  if (!("method" in msg && msg["method"] === "textDocument/hover")) {
    return false;
  }

  if (msg.params !== undefined) {
    return isHoverParams(msg["params"]);
  } else {
    return false;
  }
};

const isTextDocumentPositionParams = (
  params: object,
): params is TextDocumentIdentifier => {
  if (
    !(
      "textDocument" in params &&
      typeof params.textDocument === "object" &&
      params.textDocument !== null &&
      isTextDocumentIdentifier(params.textDocument)
    )
  ) {
    return false;
  }
  if (!("position" in params && isPosition(params.position))) {
    return false;
  }
  return true;
};

const isPosition = (pos: unknown): pos is Position => {
  if (!(typeof pos === "object" && pos !== null)) {
    return false;
  }

  if (!("character" in pos && typeof pos.character === "number")) {
    console.error("7");
    return false;
  }

  if (!("line" in pos && typeof pos.line === "number")) {
    return false;
  }

  return true;
};

const isHoverParams = isTextDocumentPositionParams;

export type HoverResponse = ResponseMessage & {
  result: HoverResult | null;
};

interface HoverResult {
  contents: string;
}
