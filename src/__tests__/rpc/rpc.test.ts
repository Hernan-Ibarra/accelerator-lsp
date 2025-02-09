import { EncodeMessage } from "../../rpc/rpc";

interface EncodingExample {
  Testing: boolean;
}

test("Encoding works correctly", () => {
  const example: EncodingExample = {
    Testing: true
  };
  expect(EncodeMessage(example)).toBe("Content-Length: 16\r\n\r\n{\"Testing\":true}");
});
