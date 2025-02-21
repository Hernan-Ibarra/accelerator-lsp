import { State } from "../analysis/state";
import { Logger, MessageLogger } from "../logging/loggers";
import { encodeMessage } from "../rpc_utilities/parsing";
import { ClientMessage } from "./messageTypes/generic";
import {
  CodeAction,
  CodeActionRequest,
  CodeActionResponse,
  isCodeActionRequest,
} from "./messageTypes/specific/codeAction";
import {
  CompletionItem,
  CompletionRequest,
  CompletionResponse,
  isCompletionRequest,
} from "./messageTypes/specific/completion";
import { PublishDiagnosticsNotification } from "./messageTypes/specific/diagnostics";
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
        handleDidOpenNotification(
          msg,
          state,
          messageLogger,
          messageHandlingLogger,
        );
      } else {
        messageHandlingLogger.error(
          "Received message with method 'textDocument/didOpen' but the message structure did not match",
        );
      }
      break;
    }
    case "textDocument/didChange": {
      if (isDidChangeNotification(msg)) {
        handleDidChangeNotification(
          msg,
          state,
          messageLogger,
          messageHandlingLogger,
        );
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

    case "textDocument/codeAction": {
      if (isCodeActionRequest(msg)) {
        handleCodeActionRequest(
          msg,
          state,
          messageHandlingLogger,
          messageLogger,
        );
      } else {
        messageHandlingLogger.error(
          "Received message with method 'textDocument/codeAction' but the message structure did not match",
        );
      }
      break;
    }

    case "textDocument/completion": {
      if (isCompletionRequest(msg)) {
        handleCompletionRequest(
          msg,
          state,
          messageHandlingLogger,
          messageLogger,
        );
      } else {
        messageHandlingLogger.error(
          "Received message with method 'textDocument/completion' but the message structure did not match",
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
        codeActionProvider: true,
        completionProvider: {
          triggerCharacters: ["."],
        },
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
  messageLogger: MessageLogger,
  messageHandlingLogger: Logger,
): void => {
  const docInfo = didOpenNotification.params.textDocument;
  messageHandlingLogger.info(
    `Client opened file ${docInfo.uri} written in language "${docInfo.languageId}". This is version ${docInfo.version} of the document`,
  );

  const diagnostics = state.update(docInfo.uri, docInfo.text);

  if (diagnostics.length === 0) {
    return;
  }

  const notification: PublishDiagnosticsNotification = {
    jsonrpc: "2.0",
    method: "textDocument/publishDiagnostics",
    params: {
      uri: docInfo.uri,
      diagnostics: diagnostics,
    },
  };
  const encoded = encodeMessage(notification);
  process.stdout.write(encoded);

  messageHandlingLogger.info(`Sent diagnostics`);
  messageLogger.logMessage(notification, "sent");
};

const handleDidChangeNotification = (
  didChangeNotification: DidChangeNotification,
  state: State,
  messageLogger: MessageLogger,
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
    const docInfo = params.textDocument;
    const diagnostics = state.update(docInfo.uri, change.text);

    if (diagnostics.length === 0) {
      return;
    }

    const notification: PublishDiagnosticsNotification = {
      jsonrpc: "2.0",
      method: "textDocument/publishDiagnostics",
      params: {
        uri: docInfo.uri,
        diagnostics: diagnostics,
      },
    };
    const encoded = encodeMessage(notification);
    process.stdout.write(encoded);

    messageHandlingLogger.info(`Sent diagnostics`);
    messageLogger.logMessage(notification, "sent");
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

const handleCodeActionRequest = (
  codeActionRequest: CodeActionRequest,
  state: State,
  messageHandlingLogger: Logger,
  messageLogger: MessageLogger,
): void => {
  messageHandlingLogger.info(
    `Received code action request from client. Replying...`,
  );
  const uri = codeActionRequest.params.textDocument.uri;
  const codeActions: CodeAction[] | undefined = state.provideCodeActions(uri);

  const response: CodeActionResponse = {
    jsonrpc: "2.0",
    id: codeActionRequest.id,
    result: codeActions ? codeActions : null,
  };

  const encoded = encodeMessage(response);
  process.stdout.write(encoded);
  messageHandlingLogger.info(`Replied to code action request`);
  messageLogger.logMessage(response, "sent");
};

const handleCompletionRequest = (
  completionRequest: CompletionRequest,
  state: State,
  messageHandlingLogger: Logger,
  messageLogger: MessageLogger,
): void => {
  messageHandlingLogger.info(
    `Received code action request from client. Replying...`,
  );
  const uri = completionRequest.params.textDocument.uri;
  const completionResult: CompletionItem[] | null = state.provideCompletion(
    uri,
    completionRequest.params.position,
  );

  const response: CompletionResponse = {
    jsonrpc: "2.0",
    id: completionRequest.id,
    result: completionResult,
  };

  const encoded = encodeMessage(response);
  process.stdout.write(encoded);
  messageHandlingLogger.info(`Replied to completion request`);
  messageLogger.logMessage(response, "sent");
};
