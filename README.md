# accelerator-lsp

This is a language server I built for ~~educational~~ recreational purposes.

## LSP: what is it?

In short, the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) is a way for text editors and IDEs (clients) to communicate with language servers. The client might inform the server of changes in the document, and the server will usually reply with completion suggestions, diagnostics, inlay hints, among many other things.

This repository is the server side. You can, in theory, connect it to any editor/IDE you like. I have tested it only in Neovim, though.

## Instructions

<!--TODO: Add instructions on how to connect to Neovim-->
<!--TODO: Add instructions on how to build, use, and test-->
You will have to find out on how your editor/IDE connects to language servers on your own.

## Additional Resources

- [Building an LSP from Scratch](https://www.youtube.com/watch?v=YsdlcQoHqPY). This video inspired this project.
- [LSP Specifications](https://microsoft.github.io/language-server-protocol/specifications/specification-current). The documentation is actually pretty good!
- [Why LSP?](https://matklad.github.io/2022/04/25/why-lsp.html) and [LSP could have been better](https://matklad.github.io/2023/10/12/lsp-could-have-been-better.html). Interesting takes on LSP by [matklad](https://matklad.github.io/about.html).
- [LSP-AI](https://github.com/SilasMarvin/lsp-ai). An interesting alternative to technology like Copilot. (Maybe even the future of AI-assisted coding?).
