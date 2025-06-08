# Cardápio Online

Este repositório contém uma versão estática de um cardápio digital. Para fazer o deploy no Netlify siga estes passos:

1. Em **Build settings**, deixe o campo **Build command** vazio (não há processo de build).
2. Em **Publish directory**, indique a raiz do projeto (o mesmo diretório onde está `index.html`).
3. Após o deploy, acesse a URL fornecida pelo Netlify. Caso veja a mensagem *"Site not found"*, verifique se o diretório publicado está correto e se `index.html` está presente.

A aplicação possui apenas arquivos estáticos (`index.html`, `pagamento.html`, `style.css` e `script.js`); portanto, basta que o Netlify aponte para o diretório onde eles estão.
