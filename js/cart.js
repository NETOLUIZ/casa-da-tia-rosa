// Gestão da Sacola de Compras — Casa Tia Rosa

let cart = [];
let appliedCoupon = null;
const FREE_SHIPPING_THRESHOLD = 300.00;

// Carregar carrinho salvo se houver
function loadCart() {
  try {
    const saved = localStorage.getItem('tiarosa_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erro ao ler sacola:', e);
  }
}

function saveCart() {
  try {
    localStorage.setItem('tiarosa_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Erro ao salvar sacola:', e);
  }
}

function money(val) {
  return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartDiscount() {
  if (!appliedCoupon) return 0;
  if (appliedCoupon.type === 'percentage') {
    return getCartSubtotal() * (appliedCoupon.value / 100);
  }
  return appliedCoupon.value || 0;
}

function getCartTotal() {
  const total = getCartSubtotal() - getCartDiscount();
  return total > 0 ? total : 0;
}

function addToCart(id, qty = 1) {
  const prod = PRODUCTS_DATA.find(p => p.id === id);
  if (!prod) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...prod, qty });
  }

  saveCart();
  updateCartBadges();
  renderCartDrawer();
  showToast(`Adicionado à sacola: ${prod.name}`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
    showToast('Item removido da sacola');
  }

  saveCart();
  updateCartBadges();
  renderCartDrawer();
  if (typeof updateCheckoutSummary === 'function') {
    updateCheckoutSummary();
  }
}

function removeCartItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartBadges();
  renderCartDrawer();
  showToast('Item removido da sacola');
  if (typeof updateCheckoutSummary === 'function') {
    updateCheckoutSummary();
  }
}

function applyCouponCode() {
  const input = document.getElementById('couponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast('Digite o código do cupom');
    return;
  }

  if (code === 'TIAROSA10' || code === 'BEMVINDO') {
    appliedCoupon = { code, type: 'percentage', value: 10, label: '10% OFF' };
    showToast('✨ Cupom de 10% aplicado com sucesso!');
    renderCartDrawer();
  } else if (code === 'FRETEGRATIS') {
    appliedCoupon = { code, type: 'shipping', value: 0, label: 'Frete Grátis' };
    showToast('✨ Cupom de Frete Grátis aplicado!');
    renderCartDrawer();
  } else {
    showToast('Cupom inválido ou expirado');
  }
}

function removeCoupon() {
  appliedCoupon = null;
  showToast('Cupom removido');
  renderCartDrawer();
}

function updateCartBadges() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.classList.toggle('hidden', count === 0);
  });
}

function renderCartDrawer() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  const itemsContainer = document.getElementById('cartItems');
  const cartSubtitle = document.getElementById('cartSubtitle');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountAmount = document.getElementById('cartDiscountAmount');
  const cartTotalEl = document.getElementById('cartTotal');
  const freeShippingBar = document.getElementById('freeShippingBar');
  const freeShippingText = document.getElementById('freeShippingText');

  if (cartSubtitle) {
    cartSubtitle.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
  }

  // Barra de Frete Grátis
  if (freeShippingBar && freeShippingText) {
    const diff = FREE_SHIPPING_THRESHOLD - subtotal;
    if (diff <= 0) {
      freeShippingBar.style.width = '100%';
      freeShippingText.innerHTML = '🎉 <b>Parabéns!</b> Você ganhou <b>Frete Grátis</b>!';
    } else {
      const percentage = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      freeShippingBar.style.width = `${percentage}%`;
      freeShippingText.innerHTML = `Faltam <b>${money(diff)}</b> para ganhar <b>Frete Grátis</b>`;
    }
  }

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
          <div class="w-20 h-20 rounded-full bg-rose/40 flex items-center justify-center text-wine text-3xl mb-4">
            🧺
          </div>
          <h3 class="serif text-2xl text-ink font-semibold">Sua sacola está vazia</h3>
          <p class="text-sm mt-2 max-w-[240px]">Escolha suas peças favoritas para deixar sua casa ainda mais linda.</p>
          <button onclick="closeCart(); scrollToSection('produtos')" class="mt-6 bg-wine text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-wineDark transition">
            Explorar produtos
          </button>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart.map(item => `
        <div class="flex gap-3.5 bg-white rounded-2xl p-3.5 border border-[#EFE4DC] shadow-sm relative group">
          <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85';" class="w-20 h-20 rounded-xl object-cover shrink-0 bg-rose/20">
          <div class="min-w-0 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-1">
                <p class="font-semibold text-sm text-ink leading-snug line-clamp-2">${item.name}</p>
                <button onclick="removeCartItem(${item.id})" class="text-muted hover:text-red-500 text-lg leading-none p-1 shrink-0" title="Remover">×</button>
              </div>
              <p class="text-wine font-bold text-sm mt-1">${money(item.price)}</p>
            </div>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-[#F8EFEA]">
              <div class="flex items-center gap-2 bg-[#FBF7F2] rounded-full p-1 border border-[#EFE4DC]">
                <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-ink shadow-xs hover:bg-rose/30">−</button>
                <span class="text-xs font-bold px-1.5 text-ink">${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-ink shadow-xs hover:bg-rose/30">+</button>
              </div>
              <span class="text-xs font-bold text-muted">${money(item.price * item.qty)}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  if (cartSubtotalEl) cartSubtotalEl.textContent = money(subtotal);
  if (cartTotalEl) cartTotalEl.textContent = money(total);

  if (cartDiscountRow && cartDiscountAmount) {
    if (appliedCoupon && discount > 0) {
      cartDiscountRow.classList.remove('hidden');
      cartDiscountAmount.textContent = `- ${money(discount)} (${appliedCoupon.label})`;
    } else {
      cartDiscountRow.classList.add('hidden');
    }
  }
}

function openCart() {
  renderCartDrawer();
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    drawer.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.add('hidden');
    drawer.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  }
}
