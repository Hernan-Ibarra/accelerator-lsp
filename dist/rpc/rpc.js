"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeMessage = void 0;
const encodeMessage = (msg) => {
    const content = JSON.stringify(msg);
    const contentLength = content.length;
    return `Content-Length: ${contentLength}\r\n\r\n${content}`;
};
exports.encodeMessage = encodeMessage;
