"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMessage = exports.encodeMessage = void 0;
const encodeMessage = (msg) => {
    const content = JSON.stringify(msg);
    const contentLength = content.length;
    return `Content-Length: ${contentLength}\r\n\r\n${content}`;
};
exports.encodeMessage = encodeMessage;
const decodeMessage = (msg) => {
    const separated = msg.split("\r\n\r\n", 2);
    if (separated.length !== 2) {
        throw new Error("There was a problem when splitting the message (maybe the separator wasn't found?)");
    }
    const header = separated[0];
    const content = separated[1];
    const contentLengthString = header.slice("Content-Length ".length);
    const contentLength = parseInt(contentLengthString);
    console.log(content);
    console.log(contentLengthString);
    console.log(contentLength);
    console.log(content.slice(0, contentLength));
    const baseMessage = JSON.parse(content.slice(0, contentLength));
    if (typeof baseMessage.method !== 'string') {
        throw new Error("The 'method' property is missing or is not a string.");
    }
    return baseMessage;
};
exports.decodeMessage = decodeMessage;
