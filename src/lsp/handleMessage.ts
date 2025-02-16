import { State } from "../analysis/state";
import { Logger, MessageLogger } from "../logging/loggers";
import { encodeMessage } from "../rpc_utilities/parsing";
import { ClientMessage } from "./messageTypes/generic";
import {
  DidChangeNotification,
  isDidChangeNotification,
} from "./messageTypes/specific/didChange";
import {
  DidOpenNotification,
  isDidOpenNotification,
} from "./messageTypes/specific/didOpen";
import {
  HoverRequest,
  HoverResponse,
  isHoverRequest,
} from "./messageTypes/specific/hover";
import {
  InitializeRequest,
  initializeResponse,
  isInitializeRequest,
} from "./messageTypes/specific/init";

export const handleMessage = (
  msg: ClientMessage,
  state: State,
  messageLogger: MessageLogger,
) => {
  const messageHandlingLogger = new Logger("message-handling.log");

  switch (msg.method) {
    case "initialize": {
      if (isInitializeRequest(msg)) {
        handleInitRequest(msg, messageHandlingLogger, messageLogger);
      } else {
        messageHandlingLogger.error(
          "Received message with method 'initialize' but the message structure did not match",
        );
      }
      break;
    }
    case "initialized": {
      messageHandlingLogger.info("Client completed handshake!");
      break;
    }
    case "textDocument/didOpen": {
      if (isDidOpenNotification(msg)) {
        handleDidOpenNotification(msg, state, messageHandlingLogger);
      } else {
        messageHandlingLogger.error(
          "Received message with method 'textDocument/didOpen' but the message structure did not match",
        );
      }
      break;
    }
    case "textDocument/didChange": {
      if (isDidChangeNotification(msg)) {
        handleDidChangeNotification(msg, state, messageHandlingLogger);
      } else {
        messageHandlingLogger.error(
          "Received message with method 'textDocument/didChange' but the message structure did not match",
        );
      }
      break;
    }
    case "textDocument/hover": {
      if (isHoverRequest(msg)) {
        handleHoverRequest(msg, state, messageHandlingLogger, messageLogger);
      } else {
        messageHandlingLogger.error(
          "Received message with method 'textDocument/hover' but the message structure did not match",
        );
      }
      break;
    }

    default:
      messageHandlingLogger.warn(
        `Do not know how to handle messages with method ${msg.method}.`,
      );
      break;
  }
};

const handleInitRequest = (
  initRequest: InitializeRequest,
  messageHandlingLogger: Logger,
  messageLogger: MessageLogger,
): void => {
  messageHandlingLogger.info(
    `Received initialization request from ${initRequest.params.clientInfo?.name} ${initRequest.params.clientInfo?.version}. Replying...`,
  );
  const response: initializeResponse = {
    result: {
      capabilities: {
        textDocumentSync: 1,
        hoverProvider: true,
        //CompletionProvider: map[string]any{},
        //DefinitionProvider: true,
        //CodeActionProvider: true,
      },
      serverInfo: {
        name: "accelerator-lsp",
        version: "0.1.0",
      },
    },
    jsonrpc: "2.0",
    id: initRequest.id,
  };
  const encoded = encodeMessage(response);
  process.stdout.write(encoded);
  messageLogger.logMessage(response, "sent");
  messageHandlingLogger.info(
    `Replied to initialization request from ${initRequest.params.clientInfo?.name} ${initRequest.params.clientInfo?.version}`,
  );
};

const handleDidOpenNotification = (
  didOpenNotification: DidOpenNotification,
  state: State,
  messageHandlingLogger: Logger,
): void => {
  const docInfo = didOpenNotification.params.textDocument;
  messageHandlingLogger.info(
    `Client opened file ${docInfo.uri} written in language "${docInfo.languageId}". This is version ${docInfo.version} of the document`,
  );
  state.update(docInfo.uri, docInfo.text);
};

const handleDidChangeNotification = (
  didChangeNotification: DidChangeNotification,
  state: State,
  messageHandlingLogger: Logger,
): void => {
  const params = didChangeNotification.params;
  if (params.contentChanges.length === 0) {
    return;
  }
  messageHandlingLogger.info(
    `The document ${params.textDocument.uri} has changed to version ${params.textDocument.version}\n\n`,
  );
  params.contentChanges.forEach((change) => {
    state.update(params.textDocument.uri, change.text);
  });
};

const handleHoverRequest = (
  hoverRequest: HoverRequest,
  state: State,
  messageHandlingLogger: Logger,
  messageLogger: MessageLogger,
): void => {
  // TODO: Log the actual word the client is requesting info about.
  messageHandlingLogger.info(`Received hover request from client. Replying...`);
  const hoverInfo: string | undefined = state.provideHoverInfo(
    hoverRequest.params.textDocument.uri,
    hoverRequest.params.position,
  );
  const response: HoverResponse = {
    jsonrpc: "2.0",
    id: hoverRequest.id,
    result: hoverInfo ? { contents: hoverInfo } : null,
  };
  const encoded = encodeMessage(response);
  process.stdout.write(encoded);
  messageHandlingLogger.info(
    `Replied to hover request with "${response.result ? response.result.contents : "null"}"`,
  );
  messageLogger.logMessage(response, "sent");
};
