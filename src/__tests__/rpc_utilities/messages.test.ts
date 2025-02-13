import { RequestMessage, MessageQueue } from "../../rpc_utilities/messages";

describe("MessageQueue", () => {
  let exampleQueue: MessageQueue;
  let exampleMessage1: RequestMessage;
  let exampleMessage2: RequestMessage;
  let exampleMessage3: RequestMessage;

  beforeEach(() => {
    exampleQueue = new MessageQueue();
    exampleMessage1 = {
      id: 1,
      method: "textDocument/completion",
      jsonrpc: "2.0",
    };
    exampleMessage2 = {
      id: 2,
      method: "textDocument/hover",
      jsonrpc: "2.0",
    };
    exampleMessage3 = {
      id: 3,
      method: "textDocument/signatureHelp",
      jsonrpc: "2.0",
    };
  });

  test("should enqueue messages correctly", () => {
    exampleQueue.enqueue(exampleMessage1);
    exampleQueue.enqueue(exampleMessage2);

    expect(exampleQueue.size()).toBe(2);
    expect(exampleQueue.peek()).toBe(exampleMessage1);
  });

  test("should dequeue messages correctly", () => {
    exampleQueue.enqueue(exampleMessage1);
    exampleQueue.enqueue(exampleMessage2);
    exampleQueue.enqueue(exampleMessage3);

    const dequeuedMessage = exampleQueue.dequeue();
    expect(dequeuedMessage).toBe(exampleMessage1);

    expect(exampleQueue.size()).toBe(2);
    expect(exampleQueue.peek()).toBe(exampleMessage2);
  });

  test("should return undefined when dequeuing from an empty queue", () => {
    const dequeuedMessage = exampleQueue.dequeue();
    expect(dequeuedMessage).toBeUndefined();
  });

  test("should check if the queue is empty", () => {
    expect(exampleQueue.isEmpty()).toBe(true);

    exampleQueue.enqueue(exampleMessage1);
    expect(exampleQueue.isEmpty()).toBe(false);
  });

  test("should peek at the first message in the queue", () => {
    exampleQueue.enqueue(exampleMessage1);
    exampleQueue.enqueue(exampleMessage2);

    const peekedMessage = exampleQueue.peek();
    expect(peekedMessage).toBe(exampleMessage1);
  });

  test("should return undefined when peeking at an empty queue", () => {
    const peekedMessage = exampleQueue.peek();
    expect(peekedMessage).toBeUndefined();
  });

  test("should return the correct size of the queue", () => {
    expect(exampleQueue.size()).toBe(0);

    exampleQueue.enqueue(exampleMessage1);
    exampleQueue.enqueue(exampleMessage2);
    expect(exampleQueue.size()).toBe(2);

    exampleQueue.dequeue();
    expect(exampleQueue.size()).toBe(1);
  });
});
