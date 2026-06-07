/* ============================================================
   BASE 3D — app.js  (Centralizado)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ─────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ──────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href === './' + currentPage)) {
      link.classList.add('active');
    }
  });

  /* ── Mobile hamburger ─────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const isOpen = mobileNav.classList.contains('open');
      if (spans.length === 3) {
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity   = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
      }
    });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  /* ── Cart State ───────────────────────────────────────── */
  let cart = JSON.parse(localStorage.getItem('b3d_cart') || '[]');

  const saveCart = () => localStorage.setItem('b3d_cart', JSON.stringify(cart));

  const updateCartUI = () => {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('visible', count > 0);
    });
    renderCartItems();
  };

  const renderCartItems = () => {
    const body = document.querySelector('.cart-body');
    if (!body) return;
    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Tu carrito está vacío</p>
        </div>`;
      const footer = document.querySelector('.cart-footer');
      if (footer) footer.querySelector('strong') && (footer.querySelector('strong').textContent = '$0');
      return;
    }

    body.innerHTML = cart.map((item, idx) => `
      <div class="cart-item" data-idx="${idx}">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-idx="${idx}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove" data-idx="${idx}">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const totalEl = document.querySelector('.cart-total strong');
    if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-AR');

    body.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const action = btn.dataset.action;
        if (action === 'inc') cart[idx].qty++;
        if (action === 'dec') { cart[idx].qty--; if (cart[idx].qty <= 0) cart.splice(idx, 1); }
        if (action === 'remove') cart.splice(idx, 1);
        saveCart(); updateCartUI();
      });
    });
  };

  window.addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    saveCart(); updateCartUI();
    showToast(`✅ ${product.name} agregado al carrito`);
  };

  /* ── Cart Sidebar ─────────────────────────────────────── */
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartTrigger = document.querySelector('.cart-trigger');
  const cartClose   = document.querySelector('.cart-close');

  const openCart  = () => { cartSidebar?.classList.add('active'); cartOverlay?.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { cartSidebar?.classList.remove('active'); cartOverlay?.classList.remove('active'); document.body.style.overflow = ''; };

  cartTrigger?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  updateCartUI();

  /* ── Product Modal ────────────────────────────────────── */
  const modalOverlay = document.getElementById('product-modal');
  const modalClose   = document.querySelector('.modal-close');

  window.openModal = (data) => {
    if (!modalOverlay) return;
    document.getElementById('modal-emoji').textContent   = data.emoji;
    document.getElementById('modal-cat').textContent     = data.category;
    document.getElementById('modal-name').textContent    = data.name;
    document.getElementById('modal-desc').textContent    = data.desc;
    document.getElementById('modal-price').textContent   = data.price;
    const specsList = document.getElementById('modal-specs');
    specsList.innerHTML = (data.specs || []).map(([k, v]) => `
      <div class="modal-spec-item"><span>${k}</span><span>${v}</span></div>
    `).join('');
    document.getElementById('modal-add-btn').onclick = () => {
      addToCart({ id: data.id, name: data.name, price: data.rawPrice, emoji: data.emoji });
      closeModal();
    };
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => { modalOverlay?.classList.remove('active'); document.body.style.overflow = ''; };
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeCart(); } });

  /* ── Reveal on scroll ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Toast ────────────────────────────────────────────── */
  window.showToast = (msg) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">🛒</span> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  };

  /* ── Contact Form ─────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Mensaje enviado';
        btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Enviar Mensaje';
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1400);
    });
  }

  /* ── Chat Bot ─────────────────────────────────────────── */
  const chatForm    = document.getElementById('chat-form');
  const chatInput   = document.getElementById('chat-input');
  const chatMsgs    = document.getElementById('chat-messages');
  const sendBtn     = document.getElementById('chat-send');

  if (chatForm && chatInput && chatMsgs) {
    const botReplies = {
      'impresora':   '🖨️ Contamos con impresoras FDM y resina de última generación. ¿Buscás algo en particular: uso hogareño, profesional o industrial?',
      'filamento':   '🧵 Tenemos filamentos PLA, PETG, TPU, ABS y especiales como madera o metal. ¿Qué diámetro necesitás, 1.75mm o 2.85mm?',
      'precio':      '💰 Los precios varían según el proyecto. ¡Escribinos a WhatsApp o completá el formulario de contacto para un presupuesto personalizado!',
      'repuesto':    '🔧 Tenemos cama calefaccionada, hotends, extrusores, correas y más. ¿Para qué modelo?',
      'decoracion':  '🎨 Imprimimos figuras decorativas, organizadores, maceteros, lámparas y todo lo que imagines. ¿Tenés un diseño o necesitás que lo diseñemos?',
      'contacto':    '📩 Podés contactarnos en el formulario de la página de Contacto, o directamente vía WhatsApp. ¿Necesitás el link?',
      'envio':       '📦 Hacemos envíos a todo el país por correo o encomienda. También podés retirar en nuestro local en Santa Fe.',
      'pago':        '💳 Aceptamos transferencia, MercadoPago y efectivo. También tenemos financiación en cuotas.',
      'hola':        '👋 ¡Hola! Soy el asistente virtual de Base 3D. ¿En qué te puedo ayudar hoy? Podés preguntarme sobre impresoras, filamentos, precios, envíos o pedidos personalizados.',
      'default':     '🤖 Gracias por tu consulta. Para brindarte la mejor atención, te recomendamos contactarnos directamente vía WhatsApp o el formulario. ¡Estamos para ayudarte!',
    };

    const getReply = (msg) => {
      const lower = msg.toLowerCase();
      for (const [key, reply] of Object.entries(botReplies)) {
        if (lower.includes(key)) return reply;
      }
      return botReplies['default'];
    };

    const now = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    const appendMsg = (text, type) => {
      const div = document.createElement('div');
      div.className = `msg ${type}`;
      const avatar = type === 'bot'
        ? `<div class="msg-avatar">B3D</div>`
        : `<div class="msg-avatar">👤</div>`;
      div.innerHTML = `
        ${avatar}
        <div>
          <div class="msg-bubble">${text}</div>
          <div class="msg-time">${now()}</div>
        </div>`;
      chatMsgs.appendChild(div);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    };

    const showTyping = () => {
      const div = document.createElement('div');
      div.className = 'msg bot';
      div.id = 'typing-msg';
      div.innerHTML = `
        <div class="msg-avatar">B3D</div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>`;
      chatMsgs.appendChild(div);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    };

    const removeTyping = () => { document.getElementById('typing-msg')?.remove(); };

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      appendMsg(text, 'user');
      chatInput.value = '';
      chatInput.style.height = 'auto';
      showTyping();
      setTimeout(() => {
        removeTyping();
        appendMsg(getReply(text), 'bot');
      }, 900 + Math.random() * 600);
    };

    sendBtn?.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = chatInput.scrollHeight + 'px';
    });

    document.querySelectorAll('.quick-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        chatInput.value = btn.textContent;
        sendMessage();
      });
    });
  }

  /* ── Product Filter ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        // Show/hide individual cards
        document.querySelectorAll('.product-card').forEach(card => {
          const cat = card.dataset.category || '';
          card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
        });

        // Show/hide entire product-block sections
        document.querySelectorAll('.products-block').forEach(block => {
          if (filter === 'all') {
            block.style.display = '';
          } else {
            const hasMatch = block.querySelector(`.product-card[data-category="${filter}"]`);
            block.style.display = hasMatch ? '' : 'none';
          }
        });

        // Show/hide the "Máquinas & Insumos" / "Productos Impresos" separators
        document.querySelectorAll('.section-separator').forEach(sep => {
          sep.style.display = filter === 'all' ? '' : 'none';
        });
      });
    });
  }

  /* ── Smooth anchor scroll for dropdown links ──────────── */
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        e.preventDefault();
        const target = document.querySelector(url.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ── Cart checkout placeholder ────────────────────────── */
  document.querySelector('.cart-checkout')?.addEventListener('click', () => {
    if (cart.length === 0) { showToast('⚠️ Tu carrito está vacío'); return; }
    showToast('🚀 Redirigiendo a WhatsApp con tu pedido…');
    const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
    const msg = encodeURIComponent(`Hola! Quiero hacer un pedido desde Base 3D:\n${items}`);
    setTimeout(() => window.open(`https://wa.me/5493425000000?text=${msg}`, '_blank'), 1200);
  });

});
