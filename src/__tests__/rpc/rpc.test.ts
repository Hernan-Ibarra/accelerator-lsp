import { encodeMessage } from "../../rpc/rpc";

interface encodingExample {
  Testing: boolean;
}

test("Encoding works correctly", () => {
  const example: encodingExample = {
    Testing: true
  };
  expect(encodeMessage(example)).toBe("Content-Length: 16\r\n\r\n{\"Testing\":true}");
});
