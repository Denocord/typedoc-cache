import { PathLike } from "fs";
import {
  access
} from "fs/promises";

export {
  resolve,
  join,
  extname,
  dirname,
} from "path";

export async function exists(p: PathLike) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

export {
  ensureDir,
  remove,
  readJSON
} from "fs-nextra";

export { createHash } from "crypto";

export { URL } from "url";
export { copyFile, writeFile, lstat } from "fs/promises";
export { Stats } from "fs";
export { default as fetch } from "node-fetch";