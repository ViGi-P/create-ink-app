"use strict";

const fs = require("node:fs");
const path = require("node:path");

const RELATIVE_SPECIFIER = /^\.{1,2}(?:\/|$)/;

function splitSuffix(specifier) {
  const suffixIndex = specifier.search(/[?#]/);

  if (suffixIndex === -1) {
    return [specifier, ""];
  }

  return [specifier.slice(0, suffixIndex), specifier.slice(suffixIndex)];
}

function rewriteSpecifier(specifier, filename) {
  if (!RELATIVE_SPECIFIER.test(specifier)) {
    return specifier;
  }

  const [request, suffix] = splitSuffix(specifier);
  const extension = path.extname(request);

  if (extension === ".js") {
    return specifier;
  }

  if (extension === ".jsx") {
    return `${request.slice(0, -extension.length)}.js${suffix}`;
  }

  if (extension) {
    return specifier;
  }

  const sourceDirectory = path.dirname(filename);
  const absoluteRequest = path.resolve(sourceDirectory, request);

  if (
    fs.existsSync(`${absoluteRequest}.js`) ||
    fs.existsSync(`${absoluteRequest}.jsx`)
  ) {
    return `${request}.js${suffix}`;
  }

  if (
    fs.existsSync(path.join(absoluteRequest, "index.js")) ||
    fs.existsSync(path.join(absoluteRequest, "index.jsx"))
  ) {
    return `${request}/index.js${suffix}`;
  }

  return specifier;
}

const rewriteEsmImports = ({ types: t }) => ({
  name: "rewrite-esm-imports",
  visitor: {
    "ImportDeclaration|ExportAllDeclaration|ExportNamedDeclaration"(
      nodePath,
      state,
    ) {
      const { source } = nodePath.node;

      if (t.isStringLiteral(source)) {
        source.value = rewriteSpecifier(source.value, state.file.opts.filename);
      }
    },
    CallExpression(nodePath, state) {
      if (!nodePath.get("callee").isImport()) {
        return;
      }

      const [source] = nodePath.node.arguments;

      if (t.isStringLiteral(source)) {
        source.value = rewriteSpecifier(source.value, state.file.opts.filename);
      }
    },
  },
});

module.exports = rewriteEsmImports;
