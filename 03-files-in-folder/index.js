const path = require("path");
const { readdir, stat } = require("fs/promises");
const pathToDir = path.join(__dirname, "secret-folder");

async function getFilesfromDir(pathToDir) {
  const dirContent = await readdir(pathToDir);

  dirContent.forEach(async (content) => {
    const pathToFile = path.join(pathToDir, content);
    const fileInfo = await stat(pathToFile);

    if (!fileInfo.isDirectory()) {
      displayFileData(fileInfo.size, pathToFile);
    }
  })
}
const displayFileData = (fileSize, pathToFile) => {
  const sizeInKb = Math.ceil(fileSize / 1024);
  const extention = path.extname(pathToFile).substring(1);
  const basename = path.basename(pathToFile, `.${extention}`);
  console.log(`${basename} - ${extention} - ${sizeInKb}kb`);
}
getFilesfromDir(pathToDir);