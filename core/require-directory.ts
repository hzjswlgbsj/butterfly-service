import fs from "fs";
import path from "path";
import Router from "koa-router";

function walkSync(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkSync(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

interface ImportDirOptions {
  visit?: (router: Router) => void;
  include?: RegExp;
}

export default async function importDir(
  path: string,
  options: ImportDirOptions
) {
  const fileNames = walkSync(path);
  const importPromises = fileNames
    .filter((file) => file.endsWith(".ts"))
    .filter((file) => !options.include || options.include.test(file))
    .map((file) => import(file));

  const modules = await Promise.all(importPromises);
  for (const m of modules) {
    if (options?.visit) await options.visit(m.default);
  }
}
