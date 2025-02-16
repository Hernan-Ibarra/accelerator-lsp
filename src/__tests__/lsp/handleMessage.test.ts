import { handleMessage } from "../../lsp/handleMessage";

describe("Message Handling", () => {
  test("handleMessage", () => {});
});

//describe("Parsing Utilities", () => {
//  test("Parse Message", () => {
//    const exampleMessage = {
//      id: 54,
//      method: "textDocument/completion",
//      jsonrpc: "2.0",
//    };
//    const exampleMessageBytes = Buffer.from(
//      JSON.stringify(exampleMessage),
//      "utf8",
//    );
//    const parsed = parseMessage(exampleMessageBytes);
//
//    expect(parsed).toStrictEqual(exampleMessage);
//  });
//
//  test("Get Content Lenght", () => {
//    const content =
//      '{"id":1,"method":"textDocument/completion","jsonrpc":"2.0"}';
//    const contentBytes = Buffer.from(content);
//    const receivedBytes = Buffer.from(
//      `Content-Length: ${contentBytes.length}\r\n\r\n${content}`,
//    );
//
//    const attempt: AttemptToGetContentLength = getContentLength(receivedBytes);
//
//    expect(attempt).toStrictEqual({
//      wasSuccesful: true,
//      result: contentBytes.length,
//      contentBytes: contentBytes,
//    });
//  });
//
//  test("Encode message", () => {
//    const exampleMessage: ResponseMessage = {
//      id: 1,
//      jsonrpc: "2.0",
//    };
//
//    const encoded = encodeMessage(exampleMessage);
//
//    expect(encoded).toStrictEqual(
//      Buffer.from('Content-Length: 24\r\n\r\n{"id":1,"jsonrpc":"2.0"}', "utf8"),
//    );
//  });
//
//  test("Decode stdin", () => {
//    const exampleMessage1: RequestMessage = {
//      jsonrpc: "2.0",
//      method: "textDocument/completion",
//      id: 1,
//    };
//    const exampleMessage2: RequestMessage = {
//      jsonrpc: "2.0",
//      method: "textDocument/completion",
//      id: 2,
//    };
//    const exampleMessage3: RequestMessage = {
//      jsonrpc: "2.0",
//      method: "textDocument/completion",
//      id: 3,
//    };
//
//    const exampleMessageBytes1 = encodeMessage(exampleMessage1);
//    const exampleMessageBytes2 = encodeMessage(exampleMessage2);
//    const exampleMessageBytes3 = encodeMessage(exampleMessage3);
//
//    expect(exampleMessageBytes1.length).toBe(81);
//    expect(exampleMessageBytes2.length).toBe(81);
//    expect(exampleMessageBytes3.length).toBe(81);
//
//    const allBytes = Buffer.concat([
//      exampleMessageBytes1,
//      exampleMessageBytes2,
//      exampleMessageBytes3,
//    ]);
//
//    const mockStdin = mstdin();
//    const queue: MessageQueue = new MessageQueue();
//    const emitter: EventEmitter = new EventEmitter();
//
//    decodeStdin(queue, emitter);
//
//    let messagesReceived = 0;
//    emitter.on("messageEnqueued", () => {
//      ++messagesReceived;
//    });
//
//    mockStdin.send(allBytes.subarray(0, 50));
//    expect(messagesReceived).toBe(0);
//    expect(queue.isEmpty()).toBe(true);
//
//    mockStdin.send(allBytes.subarray(50, 100));
//    expect(messagesReceived).toBe(1);
//    expect(queue.size()).toBe(1);
//    expect(queue.dequeue()).toStrictEqual(exampleMessage1);
//    expect(queue.size()).toBe(0);
//
//    mockStdin.send(allBytes.subarray(100, 81 + 81));
//    expect(messagesReceived).toBe(2);
//    expect(queue.size()).toBe(1);
//    expect(queue.dequeue()).toStrictEqual(exampleMessage2);
//    expect(queue.size()).toBe(0);
//
//    mockStdin.send(allBytes.subarray(81 + 81));
//    expect(messagesReceived).toBe(3);
//    expect(queue.size()).toBe(1);
//    expect(queue.dequeue()).toStrictEqual(exampleMessage3);
//    expect(queue.size()).toBe(0);
//  });
//});
