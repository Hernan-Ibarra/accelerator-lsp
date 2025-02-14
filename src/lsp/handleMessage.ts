import { Logger, MessageLogger } from "../logging/loggers";
import { encodeMessage } from "../rpc_utilities/parsing";
import { ClientMessage } from "./messageTypes/generic";
import {
  InitializeRequest,
  initializeResponse,
} from "./messageTypes/specific/init";

export const handleMessage = (
  msg: ClientMessage,
  messageLogger: MessageLogger,
) => {
  const messageHandlingLogger = new Logger("message-handling.log");

  switch (msg.method) {
    case "initialize": {
      const initRequest = msg as InitializeRequest;
      handleInitRequest(initRequest, messageHandlingLogger, messageLogger);
      break;
    }

    default:
      break;
  }
};

const handleInitRequest = (
  initRequest: InitializeRequest,
  messageHandlingLogger: Logger,
  messageLogger: MessageLogger,
): void => {
  messageHandlingLogger.info(
    `Connected to: ${initRequest.params.clientInfo?.name} ${initRequest.params.clientInfo?.version}`,
  );
  const response: initializeResponse = {
    result: {
      capabilities: {
        textDocumentSync: 1,
        hoverProvider: true,
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
};
