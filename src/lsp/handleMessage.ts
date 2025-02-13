import { Logger, MessageLogger } from "../logging/loggers";
import { encodeMessage } from "../rpc_utilities/parsing";
import {
  InitializeRequest,
  initializeResponse,
  NotificationMessage,
  RequestMessage,
} from "./messages";

export const handleMessage = (
  msg: RequestMessage | NotificationMessage,
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
      capabilities: {},
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
