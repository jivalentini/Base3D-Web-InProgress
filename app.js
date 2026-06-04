/* ===================================================================
   BASE 3D - App.js v3.0 LIMPIO Y ROBUSTO
   Gestión de Carrito | Modal de Productos | Chat Interactivo
   =================================================================== */

// ============ CONSTANTES ============
const STORAGE_KEY = 'base3d_cart';
const BOT_DELAY_MS = 500;

// ============ SELECTORES DEL DOM ============
const DOM = {
  cartToggle: document.getElementById('cartToggle'),
  cartClose: document.getElementById('cartClose'),
  cartSidebar: document.getElementById('cartSidebar'),
  cartOverlay: document.getElementById('cartOverlay'),
  cartItems: document.getElementById('cartItems'),
  cartCount: document.getElementById('cartCount'),
  cartTotal: document.getElementById('cartTotal'),
  sidebarCount: document.getElementById('sidebarCount'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  cartConfirmation: document.getElementById('cartConfirmation'),
  
  productModal: document.getElementById('productModal'),
  modalClose: document.getElementById('modalClose'),
  modalTitle: document.getElementById('modalTitle'),
  modalDescription: document.getElementById('modalDescription'),
  modalMainImage: document.getElementById('modalMainImage'),
  modalPrice: document.getElementById('modalPrice'),
  modalStock: document.getElementById('modalStock'),
  modalSpecs: document.getElementById('modalSpecs'),
  modalThumbnails: document.getElementById('modalThumbnails'),
  modalAddCart: document.getElementById('modalAddCart'),
  
  chatForm: document.getElementById('chatForm'),
  chatInput: document.getElementById('chatInput'),
  chatMessages: document.getElementById('chatMessages')
};

// ============ BASE DE DATOS DE PRODUCTOS ============
const PRODUCTS = {
  'ender3v3': {
    title: 'Impresora Creality Ender 3 V3',
    price: 289990,
    stock: 9,
    description: 'Impresora FDM de última generación con sistema de nivelación automática, estructura robusta y soportes inteligentes. Ideal para proyectos continuos, prototipos técnicos y piezas funcionales con excelente precisión.',
    specs: ['Plataforma calentada 235 x 235 mm', 'Volumen máximo: 235 x 235 x 250 mm', 'Extrusor de accionamiento directo', 'Velocidad: hasta 150 mm/s', 'Precisión de capa: 0.1 mm', 'Tamaño de boquilla: 0.4 mm', 'Voltaje: 110-240V'],
    images: ['https://images.unsplash.com/photo-1587825140708-787e0d3e6d1f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1618220444468-2abfa9da85b7?auto=format&fit=crop&w=800&q=80']
  },
  'filamentopla-negro': {
    title: 'Rollo Filamento PLA Grilon3 (Negro)',
    price: 34500,
    stock: 18,
    description: 'Filamento PLA de alta definición con acabado mate profesional. Excelente adhesión entre capas, bajo encogimiento y muy estable durante la impresión.',
    specs: ['Material: PLA 100% virgen', 'Diámetro: 1.75 mm ± 0.05 mm', 'Peso: 1 kg', 'Temperatura de fusión: 180-210°C', 'Color: Negro mate', 'Temperatura de cama: 20-50°C'],
    images: ['https://images.unsplash.com/photo-1593642532400-2682a8a8fda7?auto=format&fit=crop&w=800&q=80']
  },
  'filamentopetg-cristal': {
    title: 'Rollo Filamento PETG (Cristal)',
    price: 38900,
    stock: 12,
    description: 'PETG transparente de alta resistencia. Combina facilidad de impresión con resistencia térmica y mecánica superior.',
    specs: ['Material: PETG transparente', 'Diámetro: 1.75 mm', 'Peso: 1 kg', 'Temperatura de fusión: 220-250°C', 'Resistencia: Alta', 'Transparencia: >85%'],
    images: ['https://images.unsplash.com/photo-1622320914950-1349b4e0a914?auto=format&fit=crop&w=800&q=80']
  },
  'soporte-auriculares': {
    title: 'Soporte de Auriculares para Escritorio',
    price: 6990,
    stock: 24,
    description: 'Diseño geométrico elegante y minimalista. Estructura estable que mantiene tus auriculares organizados con acabado premium.',
    specs: ['Material: PLA premium', 'Dimensiones: 180 x 150 x 120 mm', 'Peso máximo: 500g', 'Compatibilidad: Over-ear', 'Acabado: Pulido y pintado'],
    images: ['https://images.unsplash.com/photo-1611085583191-a0033a1eb923?auto=format&fit=crop&w=800&q=80']
  },
  'pasacables-set': {
    title: 'Organizador/Pasacables de mesa (Set x4)',
    price: 5490,
    stock: 30,
    description: 'Set de 4 pasacables con acabado minimalista. Diseñados para mantener tu escritorio limpio y los cables organizados.',
    specs: ['Material: TPU flexible', 'Cantidad: 4 piezas', 'Capacidad: Hasta 5 cables por pieza', 'Diámetro de cable: 3-8 mm', 'Dimensiones: 40 x 30 x 15 mm'],
    images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80']
  },
  'sujetacables-magnetico': {
    title: 'Sujetacables magnético para setup gamer',
    price: 3990,
    stock: 20,
    description: 'Clip magnético modular con soporte articulado. Perfecto para tu estación de juego.',
    specs: ['Material: Aleación magnética + PLA', 'Fuerza magnética: 5 kg', 'Rotación: 360°', 'Capacidad: Hasta 10mm de cable'],
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80']
  },
  'soporte-notebook': {
    title: 'Soporte Vertical para Notebook',
    price: 8250,
    stock: 14,
    description: 'Base vertical de diseño moderno para liberar espacio en tu escritorio. Compatible con portátiles de 13" a 17".',
    specs: ['Material: ABS resistente', 'Capacidad: 5 kg', 'Compatibilidad: 13" a 17"', 'Ángulo: 45°', 'Dimensiones: 250 x 200 x 120 mm'],
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80']
  },
  'llavero-trex': {
    title: 'Llavero articulado de T-Rex',
    price: 2490,
    stock: 42,
    description: 'Llavero divertido con diseño articulado inspirado en dinosaurios. Las articulaciones se mueven suavemente.',
    specs: ['Material: PLA+', 'Dimensiones desplegadas: 180 mm', 'Articulaciones: 8 puntos móviles', 'Color: Gris con detalles verdes', 'Incluye: Anilla de metal'],
    images: ['https://images.unsplash.com/photo-1590080876384-c1fba39a0ce8?auto=format&fit=crop&w=800&q=80']
  },
  'llavero-personalizado': {
    title: 'Llavero personalizado con logo',
    price: 3790,
    stock: 28,
    description: 'Llavero exclusivo con logo personalizado. Ideal para regalos corporativos y branding empresarial.',
    specs: ['Material: ABS resistente', 'Tamaño: 50 x 30 x 8 mm', 'Personalización: Grabado a láser', 'Colores: Negro, Blanco, Azul', 'Anilla: Acero inoxidable'],
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80']
  },
  'maceta-nordica': {
    title: 'Maceta geométrica estilo nórdico',
    price: 7450,
    stock: 16,
    description: 'Maceta low poly con diseño moderno y minimalista. Perfecta para cualquier espacio interior.',
    specs: ['Material: PLA biodegradable', 'Estilo: Escandinavo low-poly', 'Diámetro superior: 120 mm', 'Altura: 140 mm', 'Capacidad: 1.5 litros'],
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=800&q=80']
  },
  'soporte-telefono': {
    title: 'Soporte articulado para Teléfono/Tablet',
    price: 5990,
    stock: 18,
    description: 'Soporte ajustable con giro flexible 360°. Compatible con dispositivos de 4" a 10".',
    specs: ['Material: PLA + TPU flexible', 'Compatibilidad: 4" a 10"', 'Rotación: 360° en todos los ejes', 'Capacidad: 1.5 kg', 'Base: Antideslizante'],
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80']
  },
  'stand-joystick': {
    title: 'Stand para Joystick de PS5 / Xbox',
    price: 6250,
    stock: 22,
    description: 'Stand minimalista con diseño ergonómico. Soporte seguro para controles PS5 y Xbox.',
    specs: ['Material: ABS + goma antideslizante', 'Compatibilidad: PS5, Xbox Series', 'Capacidad: Hasta 2 controles', 'Acabado: Negro mate', 'Dimensiones: 200 x 150 x 80 mm'],
    images: ['https://images.unsplash.com/photo-1586227235346-c8950277d2ca?auto=format&fit=crop&w=800&q=80']
  },
  'caja-hexagonal': {
    title: 'Caja organizadora con encastre hexagonal',
    price: 9150,
    stock: 14,
    description: 'Caja modular con sistema de encastre hexagonal. Perfecta para ordenar componentes y accesorios.',
    specs: ['Material: ABS resistente', 'Tamaño: 200 x 200 x 150 mm', 'Compartimentos: 6 hexágonos', 'Sistema: Encastre modular', 'Capacidad total: 15 litros'],
    images: ['https://images.unsplash.com/photo-1617395362961-015e3a2b8b2a?auto=format&fit=crop&w=800&q=80']
  }
};

// ============ RESPUESTAS DEL CHAT BOT ============
const BOT_RESPONSES = {
  diseño: [
    '¡De una! Contame qué tenés en mente para diseñar o pasame las medidas y te cotizo personalizado en CAD.',
    'Los diseños personalizados son nuestro fuerte. ¿Qué proyecto tenés en mente?'
  ],
  archivo: [
    '¡Buenísimo! Compartí tu STL en el formulario de contacto y te paso presupuesto exacto.',
    'Perfecto, recibimos cualquier archivo 3D. Adjuntá el STL y cotizamos.'
  ],
  defecto: [
    'Excelente pregunta. ¿Te gustaría saber más sobre algún producto específico?',
    'En Base 3D trabajamos con PLA, PETG y filamentos premium.',
    'La impresión 3D es increíble. Contame qué querés imprimir.',
    'Tenemos equipos de última generación para tu proyecto.',
    'Los tiempos dependen de la complejidad del diseño.'
  ]
};

// ============ STATE GLOBAL ============
let cart = [];

// ============ INICIALIZACIÓN ============
function init() {
  loadCart();
  setupEventListeners();
  renderCartUI();
  console.log('✓ Base 3D App v3.0 initialized');
}

// ============ 1. GESTIÓN DEL CARRITO ============

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    cart = data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Error cargando carrito:', e);
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('Error guardando carrito:', e);
  }
}

function addToCart(productId) {
  const prod = PRODUCTS[productId];
  if (!prod) {
    console.warn(`Producto no encontrado: ${productId}`);
    return;
  }

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: productId,
      title: prod.title,
      price: prod.price,
      qty: 1
    });
  }

  saveCart();
  renderCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCartUI();
}

function calculateTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function countItems() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

// ============ 2. RENDERIZADO DEL CARRITO ============

function renderCartUI() {
  const count = countItems();
  const total = calculateTotal();

  DOM.cartCount.textContent = count;
  DOM.sidebarCount.textContent = `${count} ${count === 1 ? 'producto' : 'productos'}`;
  DOM.cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;

  if (cart.length === 0) {
    DOM.cartItems.innerHTML = '<p class="cart-empty">Aún no agregaste productos.</p>';
    return;
  }

  DOM.cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <p class="cart-item-title">${item.title}</p>
      <div class="cart-item-meta">
        <span>${item.qty} × $${item.price.toLocaleString('es-AR')}</span>
        <strong>$${(item.price * item.qty).toLocaleString('es-AR')}</strong>
      </div>
      <button class="btn btn-card" style="margin-top: 0.5rem; width: 100%;" onclick="removeFromCart('${item.id}')">
        Quitar
      </button>
    </div>
  `).join('');
}

// ============ 3. GESTIÓN DEL SIDEBAR ============

function toggleCartSidebar() {
  if (DOM.cartSidebar.classList.contains('active')) {
    closeCartSidebar();
  } else {
    openCartSidebar();
  }
}

function openCartSidebar() {
  DOM.cartSidebar.classList.add('active');
  DOM.cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  DOM.cartSidebar.classList.remove('active');
  DOM.cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============ 4. GESTIÓN DEL MODAL ============

function openProductModal(productId) {
  const prod = PRODUCTS[productId];
  if (!prod) {
    console.warn(`Producto no encontrado: ${productId}`);
    return;
  }

  DOM.modalTitle.textContent = prod.title;
  DOM.modalDescription.textContent = prod.description;
  DOM.modalPrice.textContent = `$${prod.price.toLocaleString('es-AR')}`;
  DOM.modalStock.textContent = `Stock: ${prod.stock}`;
  DOM.modalMainImage.src = prod.images[0];

  DOM.modalSpecs.innerHTML = prod.specs.map(s => `<li>${s}</li>`).join('');

  DOM.modalThumbnails.innerHTML = prod.images
    .map((img, i) => `
      <img 
        src="${img}" 
        alt="Imagen ${i + 1}" 
        class="modal-thumbnail ${i === 0 ? 'active' : ''}"
        onclick="switchModalImage(this.src)"
        style="cursor: pointer;"
      >
    `)
    .join('');

  DOM.modalAddCart.onclick = () => {
    addToCart(productId);
    closeProductModal();
    openCartSidebar();
  };

  DOM.productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  DOM.productModal.classList.remove('active');
  document.body.style.overflow = '';
}

function switchModalImage(src) {
  DOM.modalMainImage.src = src;
  document.querySelectorAll('.modal-thumbnail').forEach(t => {
    t.classList.toggle('active', t.src === src);
  });
}

// ============ 5. CHAT INTERACTIVO ============

function getBotReply(msg) {
  const lower = msg.toLowerCase();

  if (lower.includes('diseño') || lower.includes('diseñar') || lower.includes('cad')) {
    return BOT_RESPONSES.diseño[Math.floor(Math.random() * BOT_RESPONSES.diseño.length)];
  }

  if (lower.includes('archivo') || lower.includes('stl') || lower.includes('.stl')) {
    return BOT_RESPONSES.archivo[Math.floor(Math.random() * BOT_RESPONSES.archivo.length)];
  }

  return BOT_RESPONSES.defecto[Math.floor(Math.random() * BOT_RESPONSES.defecto.length)];
}

function addChatMsg(role, text) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.innerHTML = `<p>${text}</p>`;
  DOM.chatMessages.appendChild(msg);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function handleChatForm(e) {
  e.preventDefault();
  const text = DOM.chatInput.value.trim();
  if (!text) return;

  addChatMsg('user', text);
  DOM.chatInput.value = '';

  setTimeout(() => {
    const reply = getBotReply(text);
    addChatMsg('bot', reply);
  }, BOT_DELAY_MS);
}

// ============ 6. EVENT LISTENERS ============

function setupEventListeners() {
  // Carrito sidebar
  DOM.cartToggle?.addEventListener('click', toggleCartSidebar);
  DOM.cartClose?.addEventListener('click', closeCartSidebar);
  DOM.cartOverlay?.addEventListener('click', closeCartSidebar);

  // Modal
  DOM.modalClose?.addEventListener('click', closeProductModal);
  DOM.productModal?.addEventListener('click', (e) => {
    if (e.target === DOM.productModal) closeProductModal();
  });

  // Tarjetas de productos (delegación)
  document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-action') && e.target.dataset.action === 'view-details') {
      const card = e.target.closest('.product-card');
      if (card?.dataset.id) {
        openProductModal(card.dataset.id);
      }
    }
  });

  // Chat
  DOM.chatForm?.addEventListener('submit', handleChatForm);

  // Checkout
  DOM.checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) return;

    DOM.cartConfirmation.hidden = false;
    DOM.cartItems.hidden = true;
    DOM.checkoutBtn.hidden = true;

    setTimeout(() => {
      cart = [];
      saveCart();
      renderCartUI();
      DOM.cartConfirmation.hidden = true;
      DOM.cartItems.hidden = false;
      DOM.checkoutBtn.hidden = false;
      closeCartSidebar();
    }, 3000);
  });

  // ESC cierra todo
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCartSidebar();
    }
  });
}

// ============ EJECUTAR ============
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
