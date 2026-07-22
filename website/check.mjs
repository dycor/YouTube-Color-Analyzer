import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const rootDir = resolve(websiteDir, "..");
const outputDir = join(websiteDir, "dist");
const basePath = "/YouTube-Color-Analyzer";
const origin = "https://dycor.github.io";
const languagePrefixes = ["", "fr", "es", "pt-BR", "zh-CN"];
const pages = ["", "privacy", "support"];
const expectedRoutes = languagePrefixes.flatMap((prefix) =>
  pages.map((page) => [prefix, page].filter(Boolean).join("/")),
);

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const routeUrl = (route) => `${origin}${basePath}/${route ? `${route}/` : ""}`;
const routeFile = (route) => join(outputDir, route, "index.html");

for (const route of expectedRoutes) {
  const file = routeFile(route);
  try {
    await access(file);
  } catch {
    failures.push(`Missing route output: ${route || "/"}`);
    continue;
  }

  const html = await readFile(file, "utf8");
  const canonical = `<link rel="canonical" href="${routeUrl(route)}">`;
  assert(html.includes(canonical), `Incorrect canonical URL: ${route || "/"}`);
  assert(
    (html.match(/rel="alternate" hreflang=/g) ?? []).length === 6,
    `Expected five languages plus x-default: ${route || "/"}`,
  );
  assert(html.includes(`${basePath}/assets/styles.css`), `Missing local CSS: ${route || "/"}`);
  assert(
    !/<script[^>]+src="https?:|<link[^>]+rel="stylesheet"[^>]+href="https?:/i.test(html),
    `Remote dependency: ${route || "/"}`,
  );

  for (const match of html.matchAll(/href="(\/YouTube-Color-Analyzer\/[^"?#]*)"/g)) {
    const href = match[1];
    if (href.startsWith(`${basePath}/assets/`)) continue;
    const relative = href.slice(`${basePath}/`.length).replace(/\/$/, "");
    try {
      await access(routeFile(relative));
    } catch {
      failures.push(`Broken internal link in ${route || "/"}: ${href}`);
    }
  }
}

const indexFiles = [];
const collectIndexFiles = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collectIndexFiles(path);
    else if (entry.name === "index.html") indexFiles.push(path);
  }
};
await collectIndexFiles(outputDir);
assert(indexFiles.length === 15, `Expected 15 localized routes, found ${indexFiles.length}`);

const documentFiles = [
  "PRIVACY.md",
  "PRIVACY.fr.md",
  "PRIVACY.es.md",
  "PRIVACY.pt-BR.md",
  "PRIVACY.zh-CN.md",
  "SUPPORT.md",
  "SUPPORT.fr.md",
  "SUPPORT.es.md",
  "SUPPORT.pt-BR.md",
  "SUPPORT.zh-CN.md",
  "docs/chrome-web-store/DATA_DISCLOSURE.md",
  "docs/chrome-web-store/PRIVACY_PRACTICES.md",
  "docs/chrome-web-store/STORE_LISTING.en.md",
  "docs/chrome-web-store/STORE_LISTING.fr.md",
  "docs/chrome-web-store/STORE_LISTING.es.md",
  "docs/chrome-web-store/STORE_LISTING.pt-BR.md",
  "docs/chrome-web-store/STORE_LISTING.zh-CN.md",
];
const placeholderPattern = /\bTO COMPLETE\b|\bÀ COMPLÉTER\b|待填写|\bPENDIENTE\b|\bA PREENCHER\b|\bÀ traduire\b/i;
for (const relativeFile of documentFiles) {
  const content = await readFile(join(rootDir, relativeFile), "utf8");
  assert(!placeholderPattern.test(content), `Unresolved placeholder: ${relativeFile}`);
  assert(!/\bactiveTab\b/.test(content), `Removed permission still documented: ${relativeFile}`);
}

const css = await readFile(join(outputDir, "assets", "styles.css"), "utf8");
assert(!/url\(\s*["']?https?:/i.test(css), "Remote URL found in CSS");

if (failures.length > 0) {
  throw new Error(`Public website verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Public website verified: 15 routes, local assets, canonical/hreflang links, and publication documents.");
