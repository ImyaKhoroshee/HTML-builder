const fs = require("fs");
const path = require("path");
const pathToFile = path.join(__dirname, "text.txt");
const readableStream = fs.createReadStream(pathToFile, "utf-8");

let data = "";

readableStream.on("error", (err) => console.log(err.message));
readableStream.on("data", (chunk) => (data += chunk));
readableStream.on("end", () => console.log(data));