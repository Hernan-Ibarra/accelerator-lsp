//import { decodeMessage, encodeMessage } from "../../rpc/rpc";

//test("Encoding works correctly", () => {
//  const example: Record<string, boolean> = {
//    Testing: true,
//  };
//  expect(encodeMessage(example)).toBe(
//    'Content-Length: 16\r\n\r\n{"Testing":true}',
//  );
//});
//
//test("Decoding works correctly", () => {
//  const incomingMessage = 'Content-Length: 15\r\n\r\n{"method":"hi"}';
//  const decodedMessage = decodeMessage(incomingMessage);
//  const messageLength = JSON.stringify(decodedMessage).length;
//
//  expect(messageLength).toBe(15);
//  expect(decodedMessage.method).toBe("hi");
//});
