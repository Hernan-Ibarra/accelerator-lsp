export class State {
  documents: { [key: string]: string };

  constructor() {
    this.documents = {};
  }

  update(uri: string, text: string) {
    this.documents[uri] = text;
  }
}
