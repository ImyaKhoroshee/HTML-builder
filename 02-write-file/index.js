const fs = require("fs");
const path = require("path");
const process = require("node:process");

const fileStream = fs.createWriteStream(path.resolve(__dirname, "new-file.txt"));

process.stdout.write("Hi, my Reviewer.\nEnter some text, please!\n");

process.stdin.on("data", (data) => {
  if (data.includes("exit")) {
    stopProcess()
  }
  data = data.toString();
  fileStream.write(data);
});

process.on("SIGINT", function () {
  stopProcess()
});

function stopProcess() {
  fileStream.end();
  process.stdout.write("Nice to meet you, bye bye!");
  process.exit();
}



