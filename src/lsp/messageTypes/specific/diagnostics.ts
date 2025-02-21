import { NotificationMessage } from "../generic";
import { Diagnostic } from "./codeAction";

export type PublishDiagnosticsNotification = NotificationMessage & {
  method: "textDocument/publishDiagnostics";
  params: PublishDiagnosticsParams;
};

interface PublishDiagnosticsParams {
  uri: string;
  diagnostics: Diagnostic[];
}
