import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export function getSdkPath(cwd = process.cwd()) {
  return path.resolve(cwd, "src/generated/sdk.gen.ts");
}

export async function parseApiCalls(sdkPath = getSdkPath()) {
  const content = await readFile(sdkPath, "utf8");
  const lines = content.split(/\r?\n/);
  const entries = [];
  let pendingDoc = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.trim() === "/**") {
      const docLines = [];

      for (i += 1; i < lines.length; i += 1) {
        const docLine = lines[i].trim();

        if (docLine === "*/") {
          break;
        }

        const cleaned = docLine.replace(/^\*\s?/, "").trim();

        if (cleaned.length > 0) {
          docLines.push(cleaned);
        }
      }

      pendingDoc = docLines;
      continue;
    }

    const exportMatch = line.match(
      /^export const (\w+)\s*=.*\.(get|post|put|delete)</,
    );

    if (!exportMatch) {
      continue;
    }

    const [, name, method] = exportMatch;
    let url = "";

    for (let j = i; j < Math.min(i + 20, lines.length); j += 1) {
      const urlMatch = lines[j].match(/^\s*url: '([^']+)'/);

      if (urlMatch) {
        url = urlMatch[1];
        break;
      }
    }

    if (!url) {
      throw new Error(`Could not find URL for ${name}`);
    }

    const [summary = ""] = pendingDoc;

    entries.push({
      method: method.toUpperCase(),
      name,
      summary,
      url,
    });

    pendingDoc = [];
  }

  if (entries.length === 0) {
    throw new Error(`No API calls found in ${sdkPath}`);
  }

  return entries;
}
