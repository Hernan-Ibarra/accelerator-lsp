// Create a function that reads from stdin and writes to stdout
function processInput(): void {
  const stdin = process.stdin;
  const stdout = process.stdout;

  // Set up to read from stdin
  stdin.setEncoding("utf8");

  // Once the data is received, print it out
  stdin.on("data", (input) => {
    stdout.write(`You typed: ${input}`);
  });

  // Handle EOF (Ctrl+D) for stdin
  stdin.on("end", () => {
    stdout.write("End of input\n");
  });

  stdout.write("Please type something: ");
}

// Call the function
processInput();
