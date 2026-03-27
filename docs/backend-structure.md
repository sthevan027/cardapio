# 🏗️ Estrutura Backend para Sistema Profissional

## 📋 **Tecnologias Recomendadas**

### **Stack Principal**
- **Backend**: Node.js + Express ou Python + Django/FastAPI
- **Banco de Dados**: PostgreSQL ou MongoDB
- **Autenticação**: JWT + bcrypt
- **Upload de Imagens**: AWS S3 ou Cloudinary
- **Pagamentos**: Stripe, Mercado Pago, PagSeguro
- **Notificações**: Firebase Cloud Messaging, Twilio

### **Estrutura de Banco de Dados**

```sql
-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    preparation_time INTEGER, -- em minutos
    allergens TEXT[], -- array de alérgenos
    nutritional_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    delivery_instructions TEXT,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed'),
    estimated_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT
);

-- Tabela de Estoque
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    min_quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Avaliações
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    order_id INTEGER REFERENCES orders(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 **Sistema de Autenticação**

### **Endpoints Necessários**
```javascript
// Autenticação
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password

// Usuários
GET /api/users/profile
PUT /api/users/profile
GET /api/users/orders
```

## 📦 **API de Produtos**

### **Endpoints**
```javascript
// Categorias
GET /api/categories
GET /api/categories/:id
POST /api/categories (admin)
PUT /api/categories/:id (admin)
DELETE /api/categories/:id (admin)

// Produtos
GET /api/products
GET /api/products/:id
GET /api/products/category/:categoryId
POST /api/products (admin)
PUT /api/products/:id (admin)
DELETE /api/products/:id (admin)
```

## 🛒 **API de Pedidos**

### **Endpoints**
```javascript
// Pedidos
POST /api/orders
GET /api/orders
GET /api/orders/:id
PUT /api/orders/:id/status (admin)
GET /api/orders/status/:status (admin)

// Carrinho (temporário)
POST /api/cart/add
GET /api/cart
PUT /api/cart/update
DELETE /api/cart/remove/:itemId
```

## 💳 **Integração de Pagamentos**

### **Stripe Integration**
```javascript
// Pagamentos
POST /api/payments/create-intent
POST /api/payments/confirm
GET /api/payments/:id
POST /api/payments/webhook
```

## 📱 **Sistema de Notificações**

### **Tipos de Notificação**
- **Email**: Confirmação de pedido, status de entrega
- **SMS**: Notificação de entrega, códigos de verificação
- **Push**: Atualizações em tempo real
- **WhatsApp**: Integração com WhatsApp Business API

## 📊 **Sistema de Relatórios**

### **Métricas Importantes**
- Vendas por período
- Produtos mais vendidos
- Tempo médio de entrega
- Satisfação do cliente
- Receita e lucro
- Estoque baixo
- Pedidos cancelados

## 🔧 **Configurações do Sistema**

### **Variáveis de Ambiente**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# File Upload
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=restaurant-images
```

## 🚀 **Deploy e Infraestrutura**

### **Opções de Deploy**
- **Heroku**: Fácil para começar
- **AWS**: Escalável e profissional
- **Google Cloud**: Boa integração
- **DigitalOcean**: Custo-benefício

### **Serviços Necessários**
- **Banco de Dados**: PostgreSQL (AWS RDS, Heroku Postgres)
- **Cache**: Redis (para sessões e cache)
- **Storage**: AWS S3 (para imagens)
- **CDN**: CloudFront (para performance)
- **Monitoramento**: Sentry, LogRocket
