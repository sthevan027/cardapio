document.addEventListener('DOMContentLoaded', () => {
    // Adiciona evento de clique em todos os botões de pedido
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.parentElement.querySelector('h3').textContent;
            const itemPrice = button.parentElement.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.');
            
            // Redireciona para a página de pagamento encaminhando o nome e o preço do item
            window.location.href = `pagamento.html?item=${encodeURIComponent(itemName)}&preco=${itemPrice}`;
        });
    });

    // Adiciona suavização ao rolar para as seções
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
}); 