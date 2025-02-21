import {
  CodeAction,
  Diagnostic,
} from "../lsp/messageTypes/specific/codeAction";
import { CompletionItem } from "../lsp/messageTypes/specific/completion";
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
        char === ";" ||
        char === "."
      ) {
        break;
      }
      wordBackward = char.concat(wordBackward);
    }

    return wordBackward.concat(wordForward);
  }

  update(uri: string, text: string): Diagnostic[] {
    this.documents[uri] = text;
    const doc = this.documents[uri];
    const lines = doc.split("\n");

    const diagnostics: Diagnostic[] = [];

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];
      if (line.includes("VSCode")) {
        const index = line.indexOf("VSCode");
        const diagnostic: Diagnostic = {
          message: 'Did you mean "Neovim"?',
          source: "Trust me bro",
          severity: 2,
          range: {
            start: {
              line: lineNumber,
              character: index,
            },
            end: {
              line: lineNumber,
              character: index + "VSCode".length,
            },
          },
        };
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
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

  provideCompletion(uri: string, pos: Position): CompletionItem[] | null {
    const doc = this.documents[uri];
    const lines = doc.split("\n");

    if (pos.line < 0 || pos.line >= lines.length) {
      return null;
    }

    const line = lines[pos.line];

    if (pos.character < 0 || pos.character > line.length) {
      return null;
    }

    let wordBackward = "";
    for (let index = pos.character; index >= 0; index--) {
      if (index === line.length) {
        continue;
      }

      const char = line[index];
      if (char.trim() === "" || char === ":" || char === "=") {
        break;
      }
      wordBackward = char.concat(wordBackward);
    }

    const regex = /^Accelerator\./;

    if (!regex.test(wordBackward)) {
      return null;
    }

    const accelerators = [
      {
        label: "Anca",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Anca Lumezeanu",
      },

      {
        label: "Annie",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Annie Szeto",
      },

      {
        label: "David",
        kind: 20,
        detail: "Accelerator member",
        documentation: "David Whitlock",
      },

      {
        label: "Ed",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Edward Lord",
      },

      {
        label: "Hernan",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Hernan Gabriel Ibarra Mejia",
      },

      {
        label: "Hettie",
        kind: 20,
        detail: "Accelerator member",
        documentation: "henrietta o'hara-bailey",
      },

      {
        label: "Hugo",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Hugo Mario Frausin Torres",
      },

      {
        label: "Huzayfah",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Huzayfah Patel",
      },

      {
        label: "Jack",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Jack French",
      },

      {
        label: "Jack",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Jack Lawless",
      },

      {
        label: "Creedy",
        kind: 20,
        detail: "Accelerator member",
        documentation: "James Creedy",
      },

      {
        label: "Joseph",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Yu-Yang Lin",
      },

      {
        label: "Mustafa",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Mustafa Kaplan",
      },

      {
        label: "Nier",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Nier Zhang",
      },

      {
        label: "Ozcan",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Ozcan Basdalyanli",
      },

      {
        label: "Rob",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Robert Smith",
      },

      {
        label: "Sarah",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Sarah Shuaibi",
      },

      {
        label: "Scott",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Scott Stirling",
      },

      {
        label: "Shaan",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Shaan Mahal",
      },

      {
        label: "Tadiwa",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Tadiwanashe Dzvoti",
      },

      {
        label: "Yibo",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Yibo Bai",
      },

      {
        label: "Yuhan",
        kind: 20,
        detail: "Accelerator member",
        documentation: "Yuhan Wang",
      },
    ];

    return accelerators;
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
