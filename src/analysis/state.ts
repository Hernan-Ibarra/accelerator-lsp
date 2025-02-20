import { CodeAction } from "../lsp/messageTypes/specific/codeAction";
import { Position } from "../lsp/messageTypes/specific/hover";

export class State {
  documents: { [key: string]: string };

  constructor() {
    this.documents = {};
  }

  getWordUnderCursor(uri: string, pos: Position) {
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
      if (
        char.trim() === "" ||
        char === ":" ||
        char === "=" ||
        char === '"' ||
        char === ";"
      ) {
        break;
      }
      wordForward = wordForward.concat(char);
    }

    for (let index = pos.character - 1; index >= 0; index--) {
      const char = line[index];
      if (
        char.trim() === "" ||
        char === ":" ||
        char === "=" ||
        char === '"' ||
        char === ";"
      ) {
        break;
      }
      wordBackward = char.concat(wordBackward);
    }

    return wordBackward.concat(wordForward);
  }

  update(uri: string, text: string): void {
    this.documents[uri] = text;
  }

  provideHoverInfo(uri: string, pos: Position): string | undefined {
    const word = this.getWordUnderCursor(uri, pos);

    switch (word) {
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

  provideCodeActions(uri: string): CodeAction[] | undefined {
    const doc = this.documents[uri];
    const regex = new RegExp(`\\bVSCode\\b`, "g");

    const lines = doc.split("\n");

    const lastLineLength = lines[lines.length - 1].length;

    return [
      {
        title: "Censor VSC*de",
        edit: {
          changes: {
            [uri]: [
              {
                range: {
                  start: {
                    line: 0,
                    character: 0,
                  },
                  end: {
                    line: lines.length - 1,
                    character: lastLineLength - 1,
                  },
                },
                newText: doc.replace(regex, "VSC*de"),
              },
            ],
          },
        },
      },
      {
        title: "Replace for a better editor",
        edit: {
          changes: {
            [uri]: [
              {
                range: {
                  start: {
                    line: 0,
                    character: 0,
                  },
                  end: {
                    line: lines.length - 1,
                    character: lastLineLength - 1,
                  },
                },
                newText: doc.replace(regex, "Neovim"),
              },
            ],
          },
        },
      },
    ];
  }
}
