"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../../rpc/rpc");
test("Encoding works correctly", () => {
    const example = {
        Testing: true
    };
    expect((0, rpc_1.encodeMessage)(example)).toBe("Content-Length: 16\r\n\r\n{\"Testing\":true}");
});
test("Decoding works correctly", () => {
    const incomingMessage = "Content-Length: 15\r\n\r\n{\"method\":\"hi\"}";
    const decodedMessage = (0, rpc_1.decodeMessage)(incomingMessage);
    const messageLength = JSON.stringify(decodedMessage).length;
    expect(messageLength).toBe(15);
    expect(decodedMessage.method).toBe("hi");
});
