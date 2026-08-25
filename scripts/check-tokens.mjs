/**
 * Fails if `design-tokens.json` and `src/tokens.css` have drifted.
 *
 * The JSON is what tools read (Apature Gate points `tokens.source` at it); the
 * CSS is what the browser reads. A token that exists in one and not the other,
 * or whose value differs, means a review is grounded on something the page does
 * not actually use.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const GROUPS = {
  color: (path) => `--color-${path.join("-")}`,
  space: (path) => `--space-${path.join("-")}`,
  radius: (path) => `--radius-${path.join("-")}`,
  text: (path) => `--text-${path.join("-")}`,
  target: (path) => `--target-${path.join("-")}`,
};

function flatten(node, path, out) {
  if (node && typeof node === "object" && "$value" in node) {
    out.push({ path, value: String(node.$value) });
    return;
  }
  for (const [key, child] of Object.entries(node ?? {})) {
    if (key.startsWith("$")) continue;
    flatten(child, [...path, key], out);
  }
}

const tokens = JSON.parse(await readFile(resolve(root, "design-tokens.json"), "utf8"));
const css = await readFile(resolve(root, "src/tokens.css"), "utf8");

const declared = new Map();
for (const match of css.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)) {
  if (!declared.has(match[1])) declared.set(match[1], match[2].trim());
}

const problems = [];
for (const [group, name] of Object.entries(GROUPS)) {
  const flat = [];
  flatten(tokens[group], [], flat);
  for (const { path, value } of flat) {
    const variable = name(path);
    if (!declared.has(variable)) {
      problems.push(`${variable} is in design-tokens.json but not in src/tokens.css`);
      continue;
    }
    const actual = declared.get(variable);
    if (actual.toLowerCase() !== value.toLowerCase()) {
      problems.push(`${variable}: tokens.css says "${actual}", design-tokens.json says "${value}"`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Design tokens are out of sync (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Design tokens in sync (${declared.size} CSS custom properties declared).`);
