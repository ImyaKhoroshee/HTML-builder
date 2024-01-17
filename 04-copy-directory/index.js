const { readdir, copyFile, stat, rm, mkdir } = require("node:fs/promises");
const path = require("path");

async function copyDir(source, destination) {
  /* force means not to consider errors as dir may not exist */
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination);

  const dirContent = await readdir(source);

  dirContent.forEach(async (contentName) => {
    const destContentPath = path.join(destination, contentName);
    const srcContentPath = path.join(source, contentName);

    const fileData = await stat(srcContentPath);

    if (fileData.isDirectory()) {
      await mkdir(destContentPath, { recursive: true });
      await copyDir(srcContentPath, destContentPath);
    } else {
      await copyFile(srcContentPath, destContentPath);
    }
  });
}

const sourcePath = path.join(__dirname, "files");
const destinationPath = path.join(__dirname, "files-copy");
copyDir(sourcePath, destinationPath);


