const { rm, readdir, readFile, writeFile } = require("node:fs/promises");
const path = require("path");

const pathToDir = path.join(__dirname, "styles");
const pathToDist = path.join(__dirname, "project-dist");
const pathToBundle = path.join(pathToDist, "bundle.css");
makeBundle(pathToDir, pathToBundle);

async function makeBundle(sourceStyles, bundleDestination) {

  await rm(bundleDestination, { force: true });

  const bundleArr = [];
  let fileContent = "";

  const dirContents = await readdir(sourceStyles);

  dirContents.forEach(async (contentName) => {
    const pathToContent = path.join(sourceStyles, contentName);

    if (path.extname(pathToContent) === ".css") {
      fileContent = await readFile(pathToContent);
      bundleArr.push(fileContent.toString());
      await writeFile(bundleDestination, bundleArr.join(" "));
    }
  })
}
