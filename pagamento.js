// Variáveis globais
let cartItems = [];
let totalAmount = 0;

// Recupera os dados do carrinho da URL
function loadCartData() {
    const urlParams = new URLSearchParams(window.location.search);
    const cartData = urlParams.get('cart');
    
    if (cartData) {
        try {
            cartItems = JSON.parse(decodeURIComponent(cartData));
            displayCartItems();
            calculateTotal();
        } catch (error) {
            console.error('Erro ao carregar dados do carrinho:', error);
            showError('Erro ao carregar dados do carrinho');
        }
    } else {
        // Fallback para o formato antigo (item único)
        const itemName = urlParams.get('item');
        const itemPrice = urlParams.get('preco');
        
        if (itemName && itemPrice) {
            cartItems = [{
                name: itemName,
                price: parseFloat(itemPrice),
                quantity: 1,
                id: Date.now()
            }];
            displayCartItems();
            calculateTotal();
        } else {
            showError('Nenhum item encontrado no carrinho');
        }
    }
}

// Exibe os itens do carrinho
function displayCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = '';

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const itemTotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
        
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=50&h=50&fit=crop" 
                     alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">Quantidade: ${item.quantity}</div>
                </div>
            </div>
            <div class="cart-item-price">R$ ${itemTotal}</div>
        `;
        
        cartItemsList.appendChild(itemElement);
    });
}

// Calcula o total
function calculateTotal() {
    totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalValor').textContent = `R$ ${totalAmount.toFixed(2).replace('.', ',')}`;
}

// Manipula a troca de métodos de pagamento
function setupPaymentMethods() {
    const metodoBtns = document.querySelectorAll('.metodo-btn');
    const pixContainer = document.querySelector('.pix-container');
    const formPagamento = document.querySelector('.form-pagamento');

    metodoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            metodoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.metodo === 'pix') {
                pixContainer.classList.add('active');
                formPagamento.style.display = 'none';
            } else {
                pixContainer.classList.remove('active');
                formPagamento.style.display = 'grid';
            }
        });
    });
}

// Função para copiar o código PIX
function copiarCodigoPix() {
    const codigoPix = document.getElementById('codigo-pix').textContent;
    navigator.clipboard.writeText(codigoPix).then(() => {
        showNotification('Código PIX copiado com sucesso!');
    }).catch(() => {
        showNotification('Erro ao copiar código PIX', 'error');
    });
}

// Validação de formulário
function validateForm() {
    const requiredFields = [
        'customerName', 'customerPhone', 'deliveryAddress',
        'cardName', 'cardNumber', 'cardExpiry', 'cardCvv'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showError(`Por favor, preencha o campo ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }

    // Validação básica do cartão
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        showError('Número do cartão inválido');
        return false;
    }

    const cvv = document.getElementById('cardCvv').value;
    if (cvv.length < 3 || cvv.length > 4) {
        showError('CVV inválido');
        return false;
    }

    return true;
}

// Manipula o envio do formulário
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successMessage = document.getElementById('successMessage');

    // Mostrar loading
    submitBtn.disabled = true;
    loadingSpinner.style.display = 'inline-block';
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

    // Simular processamento
    setTimeout(() => {
        // Esconder formulário e mostrar sucesso
        document.querySelector('.form-pagamento').style.display = 'none';
        document.querySelector('.pix-container').style.display = 'none';
        document.querySelector('.metodos-pagamento').style.display = 'none';
        successMessage.style.display = 'block';

        // Limpar carrinho do localStorage
        localStorage.removeItem('cart');

        // Redirecionar após 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
}

// Máscaras de input
function setupInputMasks() {
    // Máscara para telefone
    const phoneInput = document.getElementById('customerPhone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            e.target.value = value;
        }
    });

    // Máscara para número do cartão
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    // Máscara para data de validade
    const expiryInput = document.getElementById('cardExpiry');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
            e.target.value = value;
        }
    });

    // Máscara para CVV
    const cvvInput = document.getElementById('cardCvv');
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Funções de notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showError(message) {
    showNotification(message, 'error');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadCartData();
    setupPaymentMethods();
    setupInputMasks();
    
    document.getElementById('paymentForm').addEventListener('submit', handleFormSubmit);
});
