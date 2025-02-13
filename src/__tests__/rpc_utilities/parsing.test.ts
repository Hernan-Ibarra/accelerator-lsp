import { EventEmitter } from "events";
import { MessageQueue } from "../../lsp/messages";
import {
  AttemptToGetContentLength,
  decodeStdin,
  encodeMessage,
  getContentLength,
  parseMessage,
} from "../../rpc_utilities/parsing";
import { stdin as mstdin } from "mock-stdin";

describe("Parsing Utilities", () => {
  test("Parse Message", () => {
    const exampleMessage = {
      id: 54,
      method: "textDocument/completion",
    };
    const exampleMessageBytes = Buffer.from(
      JSON.stringify(exampleMessage),
      "utf8",
    );
    const parsed = parseMessage(exampleMessageBytes);

    expect(parsed).toStrictEqual(exampleMessage);
  });

  test("Get Content Lenght", () => {
    const content = '{"id":1,"method":"textDocument/completion"}';
    const contentBytes = Buffer.from(content);
    const receivedBytes = Buffer.from(
      `Content-Length: ${contentBytes.length}\r\n\r\n${content}`,
    );

    const attempt: AttemptToGetContentLength = getContentLength(receivedBytes);

    expect(attempt).toStrictEqual({
      wasSuccesful: true,
      result: contentBytes.length,
      contentBytes: contentBytes,
    });
  });

  test("Encode message", () => {
    const exampleMessage = {
      id: 1,
      method: "textDocument/completion",
    };

    const encoded = encodeMessage(exampleMessage);

    expect(encoded).toStrictEqual(
      Buffer.from(
        'Content-Length: 43\r\n\r\n{"id":1,"method":"textDocument/completion"}',
        "utf8",
      ),
    );
  });

  test("Decode stdin", () => {
    const exampleMessage1 = {
      id: 1,
      method: "textDocument/completion",
    };
    const exampleMessage2 = {
      id: 2,
      method: "textDocument/hover",
    };
    const exampleMessage3 = {
      id: 3,
      method: "textDocument/signatureHelp",
    };

    const exampleMessageBytes1 = encodeMessage(exampleMessage1);
    const exampleMessageBytes2 = encodeMessage(exampleMessage2);
    const exampleMessageBytes3 = encodeMessage(exampleMessage3);

    expect(exampleMessageBytes1.length).toBe(65);
    expect(exampleMessageBytes2.length).toBe(60);
    expect(exampleMessageBytes3.length).toBe(68);

    const allBytes = Buffer.concat([
      exampleMessageBytes1,
      exampleMessageBytes2,
      exampleMessageBytes3,
    ]);

    const mockStdin = mstdin();
    const queue: MessageQueue = new MessageQueue();
    const emitter: EventEmitter = new EventEmitter();

    decodeStdin(queue, emitter);

    let messagesReceived = 0;
    emitter.on("messageEnqueued", () => {
      ++messagesReceived;
    });

    mockStdin.send(allBytes.subarray(0, 30));
    expect(messagesReceived).toBe(0);
    expect(queue.isEmpty()).toBe(true);

    mockStdin.send(allBytes.subarray(30, 70));
    expect(messagesReceived).toBe(1);
    expect(queue.size()).toBe(1);
    expect(queue.dequeue()).toStrictEqual(exampleMessage1);
    expect(queue.size()).toBe(0);

    mockStdin.send(allBytes.subarray(70, 65 + 60));
    expect(messagesReceived).toBe(2);
    expect(queue.size()).toBe(1);
    expect(queue.dequeue()).toStrictEqual(exampleMessage2);
    expect(queue.size()).toBe(0);

    mockStdin.send(allBytes.subarray(65 + 60));
    expect(messagesReceived).toBe(3);
    expect(queue.size()).toBe(1);
    expect(queue.dequeue()).toStrictEqual(exampleMessage3);
    expect(queue.size()).toBe(0);
  });
});
