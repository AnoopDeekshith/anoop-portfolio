import fs from "node:fs";
import path from "node:path";

/** True if `src` (e.g. "/images/x.jpg") exists in this app's /public folder. */
export function publicFileExists(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}
