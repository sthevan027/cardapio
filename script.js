// Estado global da aplicação
const appState = {
    cart: [],
    theme: localStorage.getItem('theme') || 'light',
    searchQuery: '',
    currentModalItem: null
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadCartFromStorage();
    updateCartUI();
    applyTheme();
});

// Inicialização da aplicação
function initializeApp() {
    // Aplicar tema salvo
    document.documentElement.setAttribute('data-theme', appState.theme);
    
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        appState.cart = JSON.parse(savedCart);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Carrinho
    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Busca
    document.getElementById('searchToggle').addEventListener('click', toggleSearch);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.querySelector('.search-btn').addEventListener('click', performSearch);

    // Tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // Controles de quantidade no modal
    document.getElementById('decreaseQuantity').addEventListener('click', decreaseQuantity);
    document.getElementById('increaseQuantity').addEventListener('click', increaseQuantity);
    document.getElementById('quantityInput').addEventListener('change', updateQuantity);
    document.getElementById('addToCartModal').addEventListener('click', addToCartFromModal);

    // Botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemName = btn.dataset.item;
            const itemPrice = parseFloat(btn.dataset.price);
            addToCart(itemName, itemPrice, 1);
        });
    });

    // Botões de visualizar detalhes
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemName = btn.dataset.item;
            const itemPrice = parseFloat(btn.dataset.price);
            const description = btn.dataset.description;
            openProductModal(itemName, itemPrice, description);
        });
    });

    // Navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCart();
        }
    });
}

// Funções do carrinho
function addToCart(itemName, price, quantity = 1) {
    const existingItem = appState.cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push({
            name: itemName,
            price: price,
            quantity: quantity,
            id: Date.now() + Math.random()
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showNotification(`${itemName} adicionado ao carrinho!`);
}

function removeFromCart(itemId) {
    appState.cart = appState.cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartUI();
}

function updateCartItemQuantity(itemId, newQuantity) {
    const item = appState.cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Atualizar contador
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar lista de itens
    cartItems.innerHTML = '';
    
    if (appState.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        appState.cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItems.appendChild(cartItem);
        });
    }
    
    // Atualizar total
    const total = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&h=60&fit=crop" alt="${item.name}">
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return div;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function handleCheckout() {
    if (appState.cart.length === 0) {
        showNotification('Adicione itens ao carrinho primeiro!', 'error');
        return;
    }
    
    // Criar string com os itens para passar para a página de pagamento
    const cartData = encodeURIComponent(JSON.stringify(appState.cart));
    window.location.href = `pagamento.html?cart=${cartData}`;
}

// Funções de busca
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    
    if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function handleSearch(e) {
    appState.searchQuery = e.target.value.toLowerCase();
    filterProducts();
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    appState.searchQuery = searchInput.value.toLowerCase();
    filterProducts();
}

function filterProducts() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const itemName = item.dataset.name.toLowerCase();
        const itemCategory = item.dataset.category;
        const matchesSearch = itemName.includes(appState.searchQuery);
        
        if (appState.searchQuery === '' || matchesSearch) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

// Funções do modal
function openProductModal(itemName, price, description) {
    appState.currentModalItem = { name: itemName, price: price, description: description };
    
    document.getElementById('modalProductName').textContent = itemName;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalPrice').textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    document.getElementById('quantityInput').value = 1;
    
    // Definir imagem baseada no nome do item
    const modalImage = document.getElementById('modalImage');
    const imageMap = {
        'X-Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        'X-Bacon': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
        'X-Tudo': 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&h=300&fit=crop',
        'Refrigerante': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
        'Suco Natural': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
        'Sorvete': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
        'Milkshake': 'https://images.unsplash.com/photo-1572490122747-f8b2f820424f?w=400&h=300&fit=crop',
        'Batata Frita': 'https://images.unsplash.com/photo-1632661675196-854f2a727a69?w=400&h=300&fit=crop',
        'Onion Rings': 'https://images.unsplash.com/photo-1622483767028-3f908a8ef908?w=400&h=300&fit=crop'
    };
    
    modalImage.src = imageMap[itemName] || imageMap['X-Burger'];
    modalImage.alt = itemName;
    
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    appState.currentModalItem = null;
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    const currentValue = parseInt(input.value);
    if (currentValue < 10) {
        input.value = currentValue + 1;
    }
}

function updateQuantity() {
    const input = document.getElementById('quantityInput');
    let value = parseInt(input.value);
    
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 10) {
        value = 10;
    }
    
    input.value = value;
}

function addToCartFromModal() {
    if (!appState.currentModalItem) return;
    
    const quantity = parseInt(document.getElementById('quantityInput').value);
    addToCart(appState.currentModalItem.name, appState.currentModalItem.price, quantity);
    closeModal();
}

// Funções de tema
function toggleTheme() {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveThemeToStorage();
    
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = appState.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', appState.theme);
}

// Funções de storage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(appState.cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        appState.cart = JSON.parse(savedCart);
    }
}

function saveThemeToStorage() {
    localStorage.setItem('theme', appState.theme);
}

// Funções utilitárias
function showNotification(message, type = 'success') {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos CSS para animações de notificação
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-cart {
        text-align: center;
        color: #666;
        padding: 2rem;
        font-style: italic;
    }
    
    .remove-item {
        background: #f44336;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .remove-item:hover {
        background: #d32f2f;
        transform: scale(1.1);
    }
`;
document.head.appendChild(notificationStyles); 