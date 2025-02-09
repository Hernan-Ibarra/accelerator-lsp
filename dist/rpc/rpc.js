"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodeMessage = void 0;
const EncodeMessage = (msg) => {
    const content = JSON.stringify(msg);
    const contentLength = content.length;
    return `Content-Length: ${contentLength}\r\n\r\n${content}`;
};
exports.EncodeMessage = EncodeMessage;
