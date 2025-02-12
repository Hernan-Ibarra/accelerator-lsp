# accelerator-lsp

This is a language server I built for ~~educational~~ recreational purposes.

## LSP: what is it?

In short, the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) is a way for text editors and IDEs (clients) to communicate with language servers. The client might inform the server of changes in the document, and the server will usually reply with completion suggestions, diagnostics, inlay hints, among many other things.

This repository is the server side. You can, in theory, connect it to any editor/IDE you like. I have tested it only in Neovim, though.

## Getting started

### Build from source

Clone this repository and `cd` into it. Then build the project by running the following on the command line.

```bash
  npm run build
```

### Connecting to a client

You will have to find out on how your favourite editor/IDE connects to language servers on your own. Having said that, the following configuration works for me in Neovim v0.10.3.

```lua
-- Paste this in your init.lua file
vim.api.nvim_create_autocmd({ 'BufEnter', 'BufWinEnter' }, {
  pattern = { '*.accelerator' },
  callback = function()
    -- TODO: Change this to the path to this respository on your machine
    -- Use absolute paths (so no ~ or $HOME) since it may not work otherwise
    local path = 'path/to/the/repo/'
    local command = { 'npm', 'run', '--silent', '--prefix', path, 'start' }

    local client = vim.lsp.start { name = 'accelerator-lsp', cmd = command }

    if not client then
      vim.notify 'there is a problem connecting to the accelerator language server'
      return
    end

    vim.lsp.buf_attach_client(0, client)
    print 'accelerator language server connected!'
  end,
})
```

### Playground

If you don't want to connect to an editor, you can still play with the server. You can start it by running

```bash
  npm run --silent start
```

This will read stdin, waiting for the messages, and will reply via stdout. (The `--silent` flag is important, because otherwise some logs might leak to stdout).

## Features

Will reveal after the presentation ;)

## Additional Resources

- [Building an LSP from Scratch](https://www.youtube.com/watch?v=YsdlcQoHqPY). This video inspired this project.
- [LSP Specifications](https://microsoft.github.io/language-server-protocol/specifications/specification-current). The documentation is actually pretty good!
- [Why LSP?](https://matklad.github.io/2022/04/25/why-lsp.html) and [LSP could have been better](https://matklad.github.io/2023/10/12/lsp-could-have-been-better.html). Interesting takes on LSP by [matklad](https://matklad.github.io/about.html).
- [LSP-AI](https://github.com/SilasMarvin/lsp-ai). An interesting alternative to technology like Copilot. (Maybe even the future of AI-assisted coding?).
