import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

function readUtf8(path) {
  return fs.readFileSync(new URL(path, import.meta.url), "utf8");
}

test("arquivos essenciais existem e estão linkados", () => {
  const indexHtml = readUtf8("../index.html");
  const pagamentoHtml = readUtf8("../pagamento.html");
  const scriptJs = readUtf8("../script.js");
  const pagamentoJs = readUtf8("../pagamento.js");

  assert.match(indexHtml, /<script\s+src="script\.js"\s*>/);
  assert.match(pagamentoHtml, /<script\s+src="pagamento\.js"\s*>/);
  assert.match(pagamentoHtml, /<link\s+rel="stylesheet"\s+href="pagamento\.css"\s*>/);

  // Fluxo principal: checkout envia carrinho via querystring "cart"
  assert.match(scriptJs, /pagamento\.html\?cart=/);

  // Após finalizar, deve limpar o carrinho salvo
  assert.match(pagamentoJs, /localStorage\.removeItem\(['"]cart['"]\)/);
});

