export const encodeMessage = (msg: any): string => {
  const content = JSON.stringify(msg);
  const contentLength = content.length;
  return `Content-Length: ${contentLength}\r\n\r\n${content}`;
}
