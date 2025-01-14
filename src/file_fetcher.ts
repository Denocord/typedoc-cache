import { CacheError } from "./cache";
import { exists, URL, copyFile, writeFile, fetch } from "./deps";
import { Metadata } from "./file";
import { protocol } from "./helpers";

async function protocolFile(url: URL, path: string): Promise<Metadata> {
  const { pathname } = url;
  try {
    if (!(await exists(pathname))) {
      throw new CacheError(`${pathname} does not exist on the local system.`);
    }
  } catch {
    throw new CacheError(`${pathname} is not valid.`);
  }
  await copyFile(pathname, path);
  return {
    url: url.href,
  };
}

async function protocolHttp(url: URL, path: string): Promise<Metadata> {
  const download = await fetch(url);
  if (!download.ok) throw new CacheError(download.statusText);
  const source = await download.arrayBuffer();
  await writeFile(path, new Uint8Array(source));

  const headers: { [key: string]: string } = {};
  for (const [key, value] of download.headers) {
    headers[key] = value;
  }
  return {
    url: url.href,
    headers,
  };
}

export async function ff(url: URL, path: string): Promise<Metadata> {
  switch (protocol(url.protocol)) {
    case "file":
      return await protocolFile(url, path);

    case "http":
    case "https":
      return await protocolHttp(url, path);

    default:
      throw new CacheError(`unsupported protocol ("${url}")`);
  }
}
