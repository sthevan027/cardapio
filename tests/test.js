const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('index.html', 'utf8');
assert(index.includes('<section class="hero">'), 'index.html deve ter secao hero');
assert(index.includes('class="menu-item"'), 'index.html deve ter itens de menu');

const pagamento = fs.readFileSync('pagamento.html', 'utf8');
assert(pagamento.includes('pagamento.css'), 'pagamento.html deve referenciar pagamento.css');

console.log('All tests passed.');
