import { join, resolve } from "./deps";
import { platform } from "os";

const POSIX_HOME = "HOME";

export function cachedir(): string {
  const os = platform();

  const deno = process.env.DENO_DIR;

  if (deno) return resolve(deno);

  let home: string | undefined;
  let path: string;
  switch (os) {
    case "linux": {
      const xdg = process.env.XDG_CACHE_HOME;
      home = xdg ?? process.env[POSIX_HOME];
      path = xdg ? "deno" : join(".cache", "deno");
      break;
    }
    case "darwin":
      home = process.env[POSIX_HOME];
      path = join("Library", "Caches", "deno");
      break;

    case "win32":
      home = process.env.LOCALAPPDATA;
      home = home ?? process.env.USERPROFILE;
      path = "deno";
      break;
  }

  path = home ? path : ".deno";
  if (!home) return path;
  return resolve(join(home, path));
}

export function tmpdir(): string {
  const os = platform();

  let tmp = process.env.TMPDIR ?? process.env.TEMP ?? process.env.TMP;
  if (tmp) return resolve(tmp);

  switch (os) {
    case "linux":
    case "darwin":
      return resolve("/tmp");
    case "win32":
      return resolve(
        join(process.env.HOMEDRIVE ?? process.env.SYSTEMDRIVE ?? "C:", "TEMP"),
      );
  }
}
