import { parse } from "@babel/parser";
import traverseImport, { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";

// @babel/traverse ба @babel/types нь CJS: transform.ts-тэй ижил default-interop.
const traverse = ((traverseImport as unknown as { default?: typeof traverseImport }).default ??
  traverseImport) as typeof traverseImport;
const t = ((babelTypes as unknown as { default?: typeof babelTypes }).default ?? babelTypes) as typeof babelTypes;

export interface ServerMessage {
  key: string;
  file: string;
  line: number;
}

const HELPERS = new Set([
  "badRequest",
  "unauthorized",
  "forbidden",
  "notFound",
  "conflict",
  "payloadTooLarge",
  "unsupportedMediaType",
  "unprocessable",
  "tooManyRequests",
]);

// Messages the server returns without a literal we can parse: the error
// handler's generic bodies and better-auth's own responses.
export const STATIC_SERVER_MESSAGES: readonly string[] = [
  "Validation error",
  "Internal server error",
  "Unauthorized",
  "Forbidden",
  "Not found",
  "Too many requests",
  "Invalid email or password",
  "User already exists. Use another email.",
  "Password too short",
];

function placeholderName(expr: babelTypes.Node): string {
  if (t.isIdentifier(expr)) return expr.name;
  if (t.isMemberExpression(expr) && t.isIdentifier(expr.property) && !expr.computed) return expr.property.name;
  return "value";
}

// A conditional ("cond ? 'a' : 'b'") yields both branches' messages.
function messagesOf(node: babelTypes.Node | undefined | null): string[] {
  if (node && t.isConditionalExpression(node)) {
    return [...messagesOf(node.consequent), ...messagesOf(node.alternate)];
  }
  const single = messageOf(node);
  return single === null ? [] : [single];
}

function messageOf(node: babelTypes.Node | undefined | null): string | null {
  if (!node) return null;
  if (t.isStringLiteral(node)) return node.value;
  if (t.isTemplateLiteral(node)) {
    let out = "";
    node.quasis.forEach((quasi, index) => {
      out += quasi.value.cooked ?? quasi.value.raw;
      const expr = node.expressions[index];
      if (expr) out += `{{${placeholderName(expr)}}}`;
    });
    return out;
  }
  return null;
}

function isInsideJsonCall(path: NodePath): boolean {
  const call = path.parentPath?.parentPath;
  if (!call || !call.isCallExpression()) return false;
  const callee = call.node.callee;
  return t.isMemberExpression(callee) && t.isIdentifier(callee.property) && callee.property.name === "json";
}

export function extractServerMessages(source: string, file: string): ServerMessage[] {
  const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
  const out: ServerMessage[] = [];
  const isBudgets = file.replace(/\\/g, "/").endsWith("services/budgets.ts");
  const push = (node: babelTypes.Node | undefined | null, line: number | undefined) => {
    for (const key of messagesOf(node)) {
      if (key.trim().length > 0) out.push({ key, file, line: line ?? 0 });
    }
  };

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee) && HELPERS.has(callee.name)) {
        push(path.node.arguments[0] as babelTypes.Node | undefined, path.node.loc?.start.line);
      }
    },
    ObjectProperty(path) {
      const key = path.node.key;
      const name = t.isIdentifier(key) ? key.name : t.isStringLiteral(key) ? key.value : null;
      if (name === "error" && isInsideJsonCall(path)) {
        push(path.node.value, path.node.loc?.start.line);
      } else if (name === "reason" && isBudgets) {
        push(path.node.value, path.node.loc?.start.line);
      }
    },
  });
  return out;
}

export function placeholdersOf(text: string): string[] {
  return [...new Set([...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))].sort();
}
