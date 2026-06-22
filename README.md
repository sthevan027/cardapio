# Cardápio Online

![Status](https://img.shields.io/badge/status-estudo%2Fdesafio-blue)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)

Este repositório contém uma versão estática de um cardápio digital. Para fazer o deploy no Netlify siga estes passos:

1. Em **Build settings**, deixe o campo **Build command** vazio (não há processo de build).
2. Em **Publish directory**, indique a raiz do projeto (o mesmo diretório onde está `index.html`).
3. Após o deploy, acesse a URL fornecida pelo Netlify. Caso veja a mensagem *"Site not found"*, verifique se o diretório publicado está correto e se `index.html` está presente.

A aplicação possui apenas arquivos estáticos (`index.html`, `pagamento.html`, `style.css` e `script.js`); portanto, basta que o Netlify aponte para o diretório onde eles estão.
# 🍔 Cardápio Online - Lanchonete Delícia

Um cardápio digital moderno e responsivo para lanchonetes, com funcionalidades avançadas de e-commerce.

## ✨ Funcionalidades

### 🛒 Carrinho de Compras
- **Carrinho flutuante** com sidebar deslizante
- **Controle de quantidade** para cada item
- **Persistência de dados** usando localStorage
- **Cálculo automático** do total
- **Remoção de itens** individual

### 🔍 Sistema de Busca
- **Busca em tempo real** por nome do produto
- **Filtros dinâmicos** que atualizam a visualização
- **Interface intuitiva** com barra de busca expansível

### 🎨 Tema Escuro/Claro
- **Toggle de tema** com ícone dinâmico
- **Persistência** da preferência do usuário
- **Transições suaves** entre os temas
- **Design consistente** em ambos os modos

### 📱 Modal de Produtos
- **Visualização detalhada** de cada produto
- **Seleção de quantidade** antes de adicionar ao carrinho
- **Imagens em alta qualidade** para cada item
- **Fechamento intuitivo** (ESC, clique fora, botão X)

### 💳 Sistema de Pagamento
- **Múltiplos métodos** de pagamento (Cartão e PIX)
- **Validação robusta** de formulários
- **Máscaras de input** para melhor UX
- **Feedback visual** durante o processamento
- **Suporte a múltiplos itens** do carrinho

### 📱 Design Responsivo
- **Mobile-first** approach
- **Grid adaptativo** para diferentes tamanhos de tela
- **Navegação otimizada** para dispositivos móveis
- **Touch-friendly** interface

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com CSS Variables e Flexbox/Grid
- **JavaScript ES6+** - Funcionalidades interativas
- **Font Awesome** - Ícones profissionais
- **Google Fonts** - Tipografia elegante

## 📁 Estrutura do Projeto

```
cardapio/
├── index.html          # Página principal do cardápio
├── pagamento.html      # Página de checkout
├── style.css          # Estilos principais
├── pagamento.css      # Estilos específicos da página de pagamento
├── script.js          # JavaScript da aplicação principal
├── pagamento.js       # JavaScript da página de pagamento
└── README.md          # Documentação
```

## 🎯 Melhorias Implementadas

### 1. **Organização do Código**
- **Separação de responsabilidades**: CSS e JavaScript em arquivos externos
- **Modularização**: Cada página tem seus próprios arquivos de estilo e script
- **Manutenibilidade**: Código mais limpo e fácil de manter
- **Performance**: Melhor cache do navegador com arquivos separados

### 2. **Carrinho de Compras Funcional**
- Sistema completo de gerenciamento de itens
- Interface intuitiva com animações
- Persistência de dados entre sessões

### 3. **Experiência do Usuário**
- Animações suaves e feedback visual
- Notificações toast para ações do usuário
- Loading states e transições

### 4. **Acessibilidade**
- Navegação por teclado (ESC para fechar modais)
- Contraste adequado em ambos os temas
- Estrutura semântica HTML

### 5. **Performance**
- Lazy loading de imagens
- Otimização de animações CSS
- Código JavaScript modular

### 6. **Manutenibilidade**
- Código organizado e comentado
- Variáveis CSS para fácil customização
- Funções reutilizáveis

## 🎨 Personalização

### Cores e Temas
O projeto usa CSS Variables para fácil customização:

```css
:root {
    --primary-color: #d4af37;    /* Cor principal */
    --primary-dark: #b8860b;     /* Cor secundária */
    --text-color: #2c1810;       /* Cor do texto */
    --bg-color: #f8f5f2;         /* Cor de fundo */
    --white: #ffffff;            /* Branco */
}
```

### Adicionando Produtos
Para adicionar novos produtos, edite o HTML seguindo a estrutura:

```html
<div class="menu-item" data-category="categoria" data-name="Nome do Produto" data-price="preco">
    <img src="url-da-imagem" alt="Nome do Produto">
    <h3>Nome do Produto</h3>
    <p>Descrição do produto</p>
    <span class="price">R$ preco</span>
    <div class="item-actions">
        <button class="add-to-cart-btn" data-item="Nome do Produto" data-price="preco">
            <i class="fas fa-plus"></i> Adicionar
        </button>
        <button class="view-details-btn" data-item="Nome do Produto" data-price="preco" data-description="Descrição">
            <i class="fas fa-eye"></i> Detalhes
        </button>
    </div>
</div>
```

## 📱 Como Usar

1. **Navegação**: Use o menu superior para navegar entre categorias
2. **Busca**: Clique no ícone de busca para filtrar produtos
3. **Adicionar ao Carrinho**: Clique em "Adicionar" ou "Detalhes" para ver mais informações
4. **Carrinho**: Clique no ícone do carrinho para ver seus itens
5. **Checkout**: Clique em "Finalizar Pedido" para ir ao pagamento
6. **Tema**: Clique no ícone de lua/sol para alternar o tema

## 🌐 GitHub Pages (Deploy Automático)

O projeto está configurado para deploy automático via GitHub Actions.

### ⚠️ Configuração obrigatória (uma vez)

O GitHub Pages **precisa ser habilitado manualmente** no repositório antes do primeiro deploy:

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Pages** (menu lateral)
3. Em **Build and deployment** → **Source**: selecione **GitHub Actions**
4. Salve (não é necessário configurar branch - o workflow cuida disso)

Sem essa configuração, o workflow falhará com erros como "Get Pages site failed" ou "Resource not accessible by integration".

Após o merge na branch `main`, o site será publicado em `https://<seu-usuario>.github.io/<repositorio>/`

## 🔧 Instalação

1. Clone ou baixe o projeto
2. Abra o arquivo `index.html` em um navegador
3. Ou use um servidor local para melhor experiência

### Servidor Local (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Node.js (com http-server)
npx http-server

# PHP
php -S localhost:8000
```

## 🌟 Próximas Melhorias

### **Para Sistema Profissional**
- [ ] **Backend completo** com API REST
- [ ] **Sistema de autenticação** com JWT
- [ ] **Banco de dados** PostgreSQL
- [ ] **Dashboard administrativo** completo
- [ ] **Integração real** com gateways de pagamento
- [ ] **Sistema de notificações** (Email, SMS, Push)
- [ ] **App mobile** nativo
- [ ] **Sistema de entrega** com rastreamento
- [ ] **Analytics e relatórios** avançados
- [ ] **Programa de fidelidade** com pontos
- [ ] **Sistema de avaliações** e feedback
- [ ] **Gestão de estoque** automática
- [ ] **Interface de cozinha** em tempo real
- [ ] **Integrações** com WhatsApp, Google Maps
- [ ] **Compliance** com LGPD e segurança

### **Documentação Detalhada**
- 📋 [Estrutura Backend](backend-structure.md) - Arquitetura completa
- 🏆 [Funcionalidades Profissionais](funcionalidades-profissionais.md) - Lista completa
- 🗺️ [Roadmap de Implementação](roadmap-implementacao.md) - Cronograma detalhado

### **Investimento Estimado**
- **Desenvolvimento**: R$ 75.000 - R$ 125.000
- **Infraestrutura Mensal**: R$ 600 - R$ 1.650
- **Tempo de Desenvolvimento**: 12-16 meses

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

## 👨‍💻 Autor

Desenvolvido como primeiro projeto frontend, demonstrando habilidades em HTML, CSS e JavaScript moderno.

---

**🎉 Obrigado por usar o Cardápio Online da Lanchonete Delícia!**
