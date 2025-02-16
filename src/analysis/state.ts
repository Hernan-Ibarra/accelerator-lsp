import { Position } from "../lsp/messageTypes/specific/hover";

export class State {
  documents: { [key: string]: string };

  constructor() {
    this.documents = {};
  }

  update(uri: string, text: string): void {
    this.documents[uri] = text;
  }

  provideHoverInfo(uri: string, pos: Position): string | undefined {
    const doc = this.documents[uri];
    const lines = doc.split("\n");

    if (pos.line < 0 || pos.line >= lines.length) {
      return undefined;
    }

    const line = lines[pos.line];

    if (pos.character < 0 || pos.character >= line.length) {
      return undefined;
    }

    let wordForward = "";
    let wordBackward = "";

    for (let index = pos.character; index < line.length; index++) {
      const char = line[index];
      if (char.trim() === "") {
        break;
      }
      wordForward = wordForward.concat(char);
    }

    for (let index = pos.character - 1; index >= 0; index--) {
      const char = line[index];
      if (char.trim() === "") {
        break;
      }
      wordBackward = char.concat(wordBackward);
    }

    const word = wordBackward.concat(wordForward);

    switch (word) {
      case "VSCode":
        return "Evil";
      case "Accelerator":
        return "A nice class of software engineers, working @THG";
      case "Neovim":
        return "btw";
      case "hello":
        return "Hello from accelerator-lsp!";
      default:
        return undefined;
    }
  }
}
