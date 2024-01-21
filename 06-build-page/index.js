const { readdir, rm, copyFile, mkdir, readFile, writeFile, stat } = require("node:fs/promises");
const path = require("path");

const dirDistPath = path.join(__dirname, "project-dist");
const pathToTemplateFile = path.join(__dirname, "template.html");
const pathToIndexHtml = path.join(dirDistPath, "index.html");
const pathToDirComponents = path.join(__dirname, "components");
const pathToStylesDir = path.join(__dirname, "styles");
const pathToStylesFile = path.join(dirDistPath, "style.css");
const pathToAssets = path.join(__dirname, "assets");
const pathToDistAssets = path.join(dirDistPath, "assets");
makeDist(dirDistPath);

async function makeDist(path) {
  await rm(path, { recursive: true, force: true });
  await mkdir(path);
  makeIndexHtml(pathToTemplateFile, pathToIndexHtml);
  makeStyles(pathToStylesDir, pathToStylesFile);
  copyAssets(pathToAssets, pathToDistAssets);
}

async function makeIndexHtml(source, destination) {
  await copyFile(source, destination);
  changeTemplateTags();
}

async function changeTemplateTags() {

  let originalTemplate = (await readFile(pathToIndexHtml)).toString();
  const dirContents = await readdir(pathToDirComponents);

  for (let i = 0; i < dirContents.length; i += 1) {
    const componentName = path.basename(dirContents[i], path.extname(dirContents[i]));
    const pathToContent = path.join(pathToDirComponents, dirContents[i]);
    const component = (await readFile(pathToContent)).toString();
    originalTemplate = originalTemplate.replace(`{{${componentName}}}`, component);
  }
  await writeFile(pathToIndexHtml, originalTemplate);

}

async function makeStyles(source, destinationFile) {

  await rm(destinationFile, { force: true });

  const styles = [];
  let fileContent = "";

  const dirContents = await readdir(source);

  dirContents.forEach(async (contentName) => {
    const pathToContent = path.join(source, contentName);

    if (path.extname(pathToContent) === ".css") {
      fileContent = await readFile(pathToContent);
      styles.push(fileContent.toString());
      await writeFile(destinationFile, styles.join(" "));
    }
  })
}

async function copyAssets(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination);

  const dirContent = await readdir(source);

  dirContent.forEach(async (contentName) => {
    const destContentPath = path.join(destination, contentName);
    const srcContentPath = path.join(source, contentName);

    const fileData = await stat(srcContentPath);

    if (fileData.isDirectory()) {
      await mkdir(destContentPath, { recursive: true });
      await copyAssets(srcContentPath, destContentPath);
    } else {
      await copyFile(srcContentPath, destContentPath);
    }
  });
}
