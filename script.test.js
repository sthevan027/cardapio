const { JSDOM } = require('jsdom');

beforeEach(() => {
  const html = `
    <div class="menu-item">
      <h3>X-Burger</h3>
      <span class="price">R$ 15,90</span>
      <button class="order-btn">Pedir</button>
    </div>
  `;
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  global.window = dom.window;
  global.document = dom.window.document;
  require('./script.js');
  // trigger DOMContentLoaded so listeners are attached
  document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
});

afterEach(() => {
  // cleanup the required cache to allow re-requiring script.js if needed
  jest.resetModules();
});

test('clicking order button changes window.location.href', () => {
  const button = document.querySelector('.order-btn');
  button.click();

  const encodedItem = encodeURIComponent('X-Burger');
  const price = '15.90';
  expect(window.location.href).toBe(`http://localhost/pagamento.html?item=${encodedItem}&preco=${price}`);
});
