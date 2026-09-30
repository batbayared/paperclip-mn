import { parse, type ParserPlugin } from "@babel/parser";
import traverseImport from "@babel/traverse";
import * as babelTypes from "@babel/types";
import MagicString, { type SourceMap } from "magic-string";

// @babel/traverse ба @babel/types нь CJS: Node-ын ESM interop-оор default import нь
// module.exports обьект байж болно. Хоёр тохиолдлыг хоёуланг нь барина.
const traverse = ((traverseImport as unknown as { default?: typeof traverseImport }).default ??
  traverseImport) as typeof traverseImport;
const t = ((babelTypes as unknown as { default?: typeof babelTypes }).default ?? babelTypes) as typeof babelTypes;

export interface ExtractedString {
  key: string;
  file: string;
  line: number;
  plural?: { one: string; other: string };
}

export interface ManualCase {
  file: string;
  line: number;
  reason: "mixed-jsx" | "template-complex";
  snippet: string;
}

export interface TransformOptions {
  attrAllowlist?: readonly string[];
  propAllowlist?: readonly string[];
  brandName?: string;
}

export interface TransformResult {
  code: string;
  map: SourceMap | null;
  strings: ExtractedString[];
  manual: ManualCase[];
  changed: boolean;
}

export const DEFAULT_ATTR_ALLOWLIST: readonly string[] = [
  "title",
  "label",
  "placeholder",
  "description",
  "aria-label",
  "alt",
  "lede",
  "body",
  "detail",
  "tooltip",
  "emptyText",
];
export const DEFAULT_PROP_ALLOWLIST: readonly string[] = DEFAULT_ATTR_ALLOWLIST;

const SKIP_TAGS = new Set(["code", "pre", "kbd", "samp", "style", "script", "Trans", "XoTrans"]);
const TX_SOURCE = "@/i18n/xo";
const TX_IMPORT = `import { tx } from "${TX_SOURCE}";`;
const LETTER = /\p{L}/u;
const BRAND_MEMBER = "BRAND.name";

export function looksLikeCopy(text: string, { jsxText = false }: { jsxText?: boolean } = {}): boolean {
  const trimmed = text.trim();
  if (!LETTER.test(trimmed)) return false;
  if (jsxText) return true;
  if (/^(https?:|mailto:|\/|\.\/|\.\.\/|#)/.test(trimmed)) return false;
  const startsUpper = /^\p{Lu}/u.test(trimmed);
  if (/^[\w$./:-]+$/.test(trimmed) && !startsUpper) return false;
  return startsUpper || /\s/.test(trimmed) || /[.?!…:]$/.test(trimmed);
}

interface Ctx {
  code: string;
  file: string;
  s: MagicString;
  strings: ExtractedString[];
  manual: ManualCase[];
  handled: WeakSet<babelTypes.Node>;
  edits: number;
  attrAllow: Set<string>;
  propAllow: Set<string>;
  brandRe: RegExp;
}

type Piece =
  | { kind: "text"; text: string; start: number; end: number; line: number }
  | { kind: "simple"; node: babelTypes.Expression; src: string; start: number; end: number; line: number };

function parseSource(code: string, filePath: string) {
  const plugins: ParserPlugin[] = filePath.endsWith(".tsx") ? ["typescript", "jsx"] : ["typescript"];
  return parse(code, { sourceType: "module", plugins });
}

// Babel-ийн cleanJSXElementLiteralChild алгоритм: JSX текстийн мөр хоорондын
// зайг React-ийн харуулдаг хэлбэрт хувиргана.
function cleanJsxText(raw: string): string {
  const lines = raw.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/[^ \t]/.test(lines[i])) lastNonEmptyLine = i;
  }
  let out = "";
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/\t/g, " ");
    if (i !== 0) line = line.replace(/^ +/, "");
    if (i !== lines.length - 1) line = line.replace(/ +$/, "");
    if (!line) continue;
    if (i !== lastNonEmptyLine) line += " ";
    out += line;
  }
  return out;
}

function lineOf(node: babelTypes.Node): number {
  return node.loc?.start.line ?? 0;
}

function span(node: babelTypes.Node): { start: number; end: number } {
  return { start: node.start ?? 0, end: node.end ?? 0 };
}

function srcOf(ctx: Ctx, node: babelTypes.Node): string {
  const { start, end } = span(node);
  return ctx.code.slice(start, end);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSimpleExpr(node: babelTypes.Node): boolean {
  if (t.isIdentifier(node) || t.isThisExpression(node)) return true;
  if ((t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && !node.computed && t.isIdentifier(node.property)) {
    return isSimpleExpr(node.object);
  }
  return false;
}

function nameOf(node: babelTypes.Expression): string {
  if (t.isIdentifier(node)) return node.name;
  if ((t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && t.isIdentifier(node.property)) {
    return node.property.name;
  }
  return "value";
}

class Vars {
  private readonly byName = new Map<string, string>();
  private readonly bySrc = new Map<string, string>();

  reserve(name: string, src: string): string {
    const existing = this.bySrc.get(src);
    if (existing) return existing;
    let candidate = name;
    let n = 2;
    while (this.byName.has(candidate)) candidate = `${name}${n++}`;
    this.byName.set(candidate, src);
    this.bySrc.set(src, candidate);
    return candidate;
  }

  nameFor(node: babelTypes.Expression, src: string): string {
    return this.reserve(nameOf(node), src);
  }

  format(): string {
    if (this.byName.size === 0) return "";
    const parts = [...this.byName].map(([name, src]) => (name === src ? name : `${name}: ${src}`));
    return `, { ${parts.join(", ")} }`;
  }
}

function toKey(ctx: Ctx, text: string): string {
  return text.replace(ctx.brandRe, "{{brand}}").replace(/\s+/g, " ").trim();
}

function record(ctx: Ctx, key: string, line: number, plural?: { one: string; other: string }): void {
  ctx.strings.push(plural ? { key, file: ctx.file, line, plural } : { key, file: ctx.file, line });
}

function snippetOf(source: string): string {
  const first = source.split(/\r?\n/)[0].trim();
  return first.length <= 120 ? first : `${first.slice(0, 117)}...`;
}

function transformStringLiteral(ctx: Ctx, node: babelTypes.StringLiteral, wrapJsx: boolean): void {
  if (ctx.handled.has(node) || !looksLikeCopy(node.value)) return;
  ctx.handled.add(node);
  const key = toKey(ctx, node.value);
  const call = `tx(${JSON.stringify(key)})`;
  const { start, end } = span(node);
  ctx.s.update(start, end, wrapJsx ? `{${call}}` : call);
  ctx.edits++;
  record(ctx, key, lineOf(node));
}

function transformExpression(ctx: Ctx, node: babelTypes.Node | null | undefined): void {
  if (!node) return;
  if (t.isStringLiteral(node)) {
    transformStringLiteral(ctx, node, false);
    return;
  }
  if (t.isTemplateLiteral(node)) {
    transformTemplate(ctx, node);
    return;
  }
  if (t.isConditionalExpression(node)) {
    transformExpression(ctx, node.consequent);
    transformExpression(ctx, node.alternate);
    return;
  }
  if (t.isLogicalExpression(node)) {
    transformExpression(ctx, node.right);
    return;
  }
  if (
    t.isTSAsExpression(node) ||
    t.isTSSatisfiesExpression(node) ||
    t.isTSNonNullExpression(node) ||
    t.isParenthesizedExpression(node)
  ) {
    transformExpression(ctx, node.expression);
    return;
  }
  if (t.isJSXExpressionContainer(node) && !t.isJSXEmptyExpression(node.expression)) {
    transformExpression(ctx, node.expression);
  }
}

// `n === 1 ? "event" : "events"` хэлбэрийг таньж one/other хосыг буцаана.
function matchPlural(ctx: Ctx, expr: babelTypes.Node): { countExpr: string; one: string; other: string } | null {
  if (!t.isConditionalExpression(expr)) return null;
  const { test, consequent, alternate } = expr;
  if (!t.isBinaryExpression(test)) return null;
  if (!["===", "!==", "==", "!="].includes(test.operator)) return null;
  if (!t.isStringLiteral(consequent) || !t.isStringLiteral(alternate)) return null;
  const { left, right } = test;
  let countNode: babelTypes.Expression | null = null;
  if (t.isNumericLiteral(left) && left.value === 1 && t.isExpression(right) && isSimpleExpr(right)) countNode = right;
  else if (t.isNumericLiteral(right) && right.value === 1 && t.isExpression(left) && isSimpleExpr(left)) countNode = left;
  if (!countNode) return null;
  const equals = test.operator === "===" || test.operator === "==";
  return {
    countExpr: srcOf(ctx, countNode),
    one: equals ? consequent.value : alternate.value,
    other: equals ? alternate.value : consequent.value,
  };
}

function templateComplex(ctx: Ctx, node: babelTypes.TemplateLiteral): void {
  ctx.manual.push({ file: ctx.file, line: lineOf(node), reason: "template-complex", snippet: snippetOf(srcOf(ctx, node)) });
}

function transformTemplate(ctx: Ctx, node: babelTypes.TemplateLiteral): void {
  if (ctx.handled.has(node)) return;
  const chunkOf = (q: babelTypes.TemplateElement) => q.value.cooked ?? q.value.raw;
  if (!node.quasis.some((q) => LETTER.test(chunkOf(q)))) return;
  ctx.handled.add(node);

  // 1-р давталт: тоолуурын хувьсагчийг ол (нэгээс олон өөр тоолуур → гараар).
  let countExpr: string | null = null;
  for (const expr of node.expressions) {
    const plural = matchPlural(ctx, expr);
    if (!plural) continue;
    if (countExpr !== null && countExpr !== plural.countExpr) {
      templateComplex(ctx, node);
      return;
    }
    countExpr = plural.countExpr;
  }
  const vars = new Vars();
  if (countExpr !== null) vars.reserve("count", countExpr);

  // 2-р давталт: one/other түлхүүрийг угсарна.
  let one = "";
  let other = "";
  for (let i = 0; i < node.quasis.length; i++) {
    const chunk = chunkOf(node.quasis[i]);
    one += chunk;
    other += chunk;
    const expr = node.expressions[i];
    if (!expr) continue;
    const plural = matchPlural(ctx, expr);
    if (plural) {
      one += plural.one;
      other += plural.other;
      continue;
    }
    const src = srcOf(ctx, expr);
    if (src === BRAND_MEMBER) {
      one += "{{brand}}";
      other += "{{brand}}";
      continue;
    }
    if (src === countExpr) {
      one += "{{count}}";
      other += "{{count}}";
      continue;
    }
    if (t.isExpression(expr) && isSimpleExpr(expr)) {
      const placeholder = `{{${vars.nameFor(expr, src)}}}`;
      one += placeholder;
      other += placeholder;
      continue;
    }
    templateComplex(ctx, node);
    return;
  }

  const oneKey = toKey(ctx, one);
  const otherKey = toKey(ctx, other);
  const { start, end } = span(node);
  ctx.s.update(start, end, `tx(${JSON.stringify(oneKey)}${vars.format()})`);
  ctx.edits++;
  record(ctx, oneKey, lineOf(node), countExpr !== null ? { one: oneKey, other: otherKey } : undefined);
}

function collectRuns(
  ctx: Ctx,
  children: babelTypes.Node[],
): { runs: Piece[][]; complex: babelTypes.JSXExpressionContainer[] } {
  const runs: Piece[][] = [];
  const complex: babelTypes.JSXExpressionContainer[] = [];
  let run: Piece[] = [];
  const flush = () => {
    if (run.length > 0) runs.push(run);
    run = [];
  };
  for (const child of children) {
    if (t.isJSXText(child)) {
      const text = cleanJsxText(child.value);
      if (text) run.push({ kind: "text", text, ...span(child), line: lineOf(child) });
      continue;
    }
    if (t.isJSXExpressionContainer(child)) {
      const expr = child.expression;
      if (t.isJSXEmptyExpression(expr)) continue;
      if (t.isStringLiteral(expr)) {
        ctx.handled.add(expr);
        run.push({ kind: "text", text: expr.value, ...span(child), line: lineOf(child) });
        continue;
      }
      if (t.isTemplateLiteral(expr) && expr.expressions.length === 0) {
        ctx.handled.add(expr);
        const text = expr.quasis.map((q) => q.value.cooked ?? q.value.raw).join("");
        run.push({ kind: "text", text, ...span(child), line: lineOf(child) });
        continue;
      }
      if (isSimpleExpr(expr)) {
        run.push({ kind: "simple", node: expr, src: srcOf(ctx, expr), ...span(child), line: lineOf(child) });
        continue;
      }
      flush();
      complex.push(child);
      continue;
    }
    flush();
  }
  flush();
  return { runs, complex };
}

function isCopyRun(run: Piece[]): boolean {
  return run.some((piece) => piece.kind === "text" && LETTER.test(piece.text));
}

function tagNameOf(node: babelTypes.JSXElement): string {
  const name = node.openingElement.name;
  if (t.isJSXIdentifier(name)) return name.name;
  if (t.isJSXNamespacedName(name)) return `${name.namespace.name}:${name.name.name}`;
  const parts: string[] = [];
  let current: babelTypes.JSXMemberExpression | babelTypes.JSXIdentifier = name;
  while (t.isJSXMemberExpression(current)) {
    parts.unshift(current.property.name);
    current = current.object;
  }
  parts.unshift(current.name);
  return parts.join(".");
}

function elementHasCopy(node: babelTypes.JSXElement | babelTypes.JSXFragment): boolean {
  if (t.isJSXElement(node) && SKIP_TAGS.has(tagNameOf(node))) return false;
  for (const child of node.children) {
    if (t.isJSXText(child)) {
      if (LETTER.test(cleanJsxText(child.value))) return true;
      continue;
    }
    if (t.isJSXExpressionContainer(child)) {
      const expr = child.expression;
      if (t.isStringLiteral(expr) && LETTER.test(expr.value)) return true;
      if (t.isTemplateLiteral(expr) && expr.quasis.some((q) => LETTER.test(q.value.cooked ?? q.value.raw))) return true;
      continue;
    }
    if ((t.isJSXElement(child) || t.isJSXFragment(child)) && elementHasCopy(child)) return true;
  }
  return false;
}

function replaceRun(ctx: Ctx, run: Piece[]): void {
  const vars = new Vars();
  let joined = "";
  for (const piece of run) {
    if (piece.kind === "text") {
      joined += piece.text;
    } else if (piece.src === BRAND_MEMBER) {
      joined += "{{brand}}";
    } else {
      joined += `{{${vars.nameFor(piece.node, piece.src)}}}`;
    }
  }
  const key = toKey(ctx, joined);
  const leading = /^\s/.test(joined) ? '{" "}' : "";
  const trailing = /\s$/.test(joined) ? '{" "}' : "";
  const first = run[0];
  const last = run[run.length - 1];
  ctx.s.update(first.start, last.end, `${leading}{tx(${JSON.stringify(key)}${vars.format()})}${trailing}`);
  ctx.edits++;
  record(ctx, key, first.line);
}

function processChildren(ctx: Ctx, node: babelTypes.JSXElement | babelTypes.JSXFragment, skip: () => void): void {
  const { runs, complex } = collectRuns(ctx, node.children);
  const copyRuns = runs.filter(isCopyRun);
  if (copyRuns.length > 0) {
    const mixed = node.children.some(
      (child) => (t.isJSXElement(child) || t.isJSXFragment(child)) && elementHasCopy(child),
    );
    if (mixed) {
      ctx.manual.push({ file: ctx.file, line: lineOf(node), reason: "mixed-jsx", snippet: snippetOf(srcOf(ctx, node)) });
      skip();
      return;
    }
    for (const run of copyRuns) replaceRun(ctx, run);
  }
  for (const container of complex) transformExpression(ctx, container.expression);
}

function harvestXoTrans(ctx: Ctx, node: babelTypes.JSXElement): void {
  for (const attr of node.openingElement.attributes) {
    if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name, { name: "i18nKey" })) continue;
    if (t.isStringLiteral(attr.value)) record(ctx, attr.value.value, lineOf(attr));
  }
}

function visitElement(ctx: Ctx, node: babelTypes.JSXElement | babelTypes.JSXFragment, skip: () => void): void {
  if (t.isJSXElement(node)) {
    const tag = tagNameOf(node);
    if (tag === "XoTrans") {
      harvestXoTrans(ctx, node);
      skip();
      return;
    }
    if (SKIP_TAGS.has(tag)) {
      skip();
      return;
    }
  }
  processChildren(ctx, node, skip);
}

export function transformSource(code: string, filePath: string, options: TransformOptions = {}): TransformResult {
  const ctx: Ctx = {
    code,
    file: filePath,
    s: new MagicString(code),
    strings: [],
    manual: [],
    handled: new WeakSet(),
    edits: 0,
    attrAllow: new Set(options.attrAllowlist ?? DEFAULT_ATTR_ALLOWLIST),
    propAllow: new Set(options.propAllowlist ?? DEFAULT_PROP_ALLOWLIST),
    brandRe: new RegExp(`\\b${escapeRegExp(options.brandName ?? "Paperclip")}\\b`, "g"),
  };
  let lastImportEnd = 0;
  let hasTxImport = false;

  traverse(parseSource(code, filePath), {
    ImportDeclaration(path) {
      lastImportEnd = Math.max(lastImportEnd, path.node.end ?? 0);
      const importsTx = path.node.specifiers.some(
        (spec) => t.isImportSpecifier(spec) && t.isIdentifier(spec.imported, { name: "tx" }),
      );
      if (path.node.source.value === TX_SOURCE && importsTx) hasTxImport = true;
    },
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (t.isIdentifier(callee, { name: "tx" }) && t.isStringLiteral(args[0])) {
        ctx.handled.add(args[0]);
        record(ctx, args[0].value, lineOf(args[0]));
      }
    },
    JSXElement(path) {
      visitElement(ctx, path.node, () => path.skip());
    },
    JSXFragment(path) {
      visitElement(ctx, path.node, () => path.skip());
    },
    JSXAttribute(path) {
      const { name, value } = path.node;
      if (!t.isJSXIdentifier(name) || !ctx.attrAllow.has(name.name) || !value) return;
      if (t.isStringLiteral(value)) transformStringLiteral(ctx, value, true);
      else if (t.isJSXExpressionContainer(value)) transformExpression(ctx, value.expression);
    },
    ObjectProperty(path) {
      const { key, value, computed, shorthand } = path.node;
      if (computed || shorthand) return;
      const name = t.isIdentifier(key) ? key.name : t.isStringLiteral(key) ? key.value : null;
      if (name === null || !ctx.propAllow.has(name)) return;
      transformExpression(ctx, value);
    },
  });

  const changed = ctx.edits > 0;
  if (changed && !hasTxImport) {
    if (lastImportEnd > 0) ctx.s.appendLeft(lastImportEnd, `\n${TX_IMPORT}`);
    else ctx.s.prepend(`${TX_IMPORT}\n`);
  }
  return {
    code: changed ? ctx.s.toString() : code,
    map: changed ? ctx.s.generateMap({ hires: true, source: filePath, includeContent: true }) : null,
    strings: ctx.strings,
    manual: ctx.manual,
    changed,
  };
}

// Трансформ хийгдээгүй файлуудаас гараар бичсэн tx("…") ба XoTrans i18nKey түлхүүрийг цуглуулна.
export function harvestExplicitKeys(code: string, filePath: string): ExtractedString[] {
  const strings: ExtractedString[] = [];
  traverse(parseSource(code, filePath), {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (t.isIdentifier(callee, { name: "tx" }) && t.isStringLiteral(args[0])) {
        strings.push({ key: args[0].value, file: filePath, line: lineOf(args[0]) });
      }
    },
    JSXOpeningElement(path) {
      if (!t.isJSXIdentifier(path.node.name, { name: "XoTrans" })) return;
      for (const attr of path.node.attributes) {
        if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: "i18nKey" }) && t.isStringLiteral(attr.value)) {
          strings.push({ key: attr.value.value, file: filePath, line: lineOf(attr) });
        }
      }
    },
  });
  return strings;
}
