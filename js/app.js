// Aplicação Principal e Controles de Demonstração — Casa Tia Rosa

let activeCategory = 'Todos';
let activeSearchQuery = '';
let currentStoryIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderStories();
  renderCategoriesGrid();
  renderProductsGrid();
  renderTestimonials();
  updateCartBadges();
  initDemoSimulator();
});

// Renderizar Stories no estilo Instagram
function renderStories() {
  const container = document.getElementById('storiesContainer');
  if (!container) return;

  container.innerHTML = STORIES_DATA.map((story, idx) => `
    <button onclick="openStoryModal(${idx})" class="story-circle flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none">
      <div class="w-[66px] h-[66px] sm:w-[74px] sm:h-[74px] rounded-full p-[2.5px] bg-gradient-to-tr from-wine via-rose to-sage group-hover:scale-105 transition shadow-sm">
        <div class="w-full h-full rounded-full overflow-hidden border-2 border-white bg-cream">
          <img src="${story.img}" alt="${story.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80';" class="w-full h-full object-cover">
        </div>
      </div>
      <span class="text-[11px] sm:text-xs font-semibold text-ink max-w-[70px] truncate text-center">${story.title}</span>
    </button>
  `).join('');
}

// Modal de visualização de Stories
function openStoryModal(idx) {
  currentStoryIndex = idx;
  const story = STORIES_DATA[idx];
  const modal = document.getElementById('storyModal');
  const img = document.getElementById('storyModalImg');
  const title = document.getElementById('storyModalTitle');
  const text = document.getElementById('storyModalText');

  if (modal && story) {
    if (img) img.src = story.img;
    if (title) title.textContent = story.title;
    if (text) text.textContent = story.content;
    modal.classList.remove('hidden');
  }
}

function closeStoryModal() {
  const modal = document.getElementById('storyModal');
  if (modal) modal.classList.add('hidden');
}

// Categorias principais
function renderCategoriesGrid() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;

  const categories = [
    { name: 'Cama', label: 'Jogos, Edredons & Cobreleitos', count: '4 itens', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sala', label: 'Tapetes, Almofadas & Mantas', count: '2 itens', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80' },
    { name: 'Banho', label: 'Kits Toalhas & Roupões', count: '1 item', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cortinas', label: 'Blackouts & Linho Rústico', count: '1 item', img: 'https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=600&q=80' }
  ];

  container.innerHTML = categories.map(cat => `
    <div onclick="filterByCategory('${cat.name}')" class="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden relative aspect-[1.1] sm:aspect-[0.95] bg-rose/30 shadow-card hover:shadow-hover transition duration-300">
      <img src="${cat.img}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-108 transition duration-500">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div class="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 text-white">
        <span class="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-rose/90">${cat.count}</span>
        <h3 class="serif text-lg sm:text-2xl font-bold leading-tight mt-0.5">${cat.name}</h3>
        <p class="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 mt-0.5">${cat.label}</p>
      </div>
    </div>
  `).join('');
}

// Filtro e Busca de Produtos
function filterByCategory(cat) {
  activeCategory = cat;
  
  // Atualizar botões de filtro
  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    const btnCat = btn.getAttribute('data-category');
    if (btnCat === cat) {
      btn.classList.add('bg-wine', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-muted', 'border-[#EFE4DC]');
    } else {
      btn.classList.remove('bg-wine', 'text-white', 'shadow-sm');
      btn.classList.add('bg-white', 'text-muted', 'border-[#EFE4DC]');
    }
  });

  renderProductsGrid();
  scrollToSection('produtos');
}

function handleSearchInput(e) {
  activeSearchQuery = e.target.value.toLowerCase().trim();
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    if (activeSearchQuery.length > 0) {
      clearBtn.classList.remove('hidden');
      clearBtn.classList.add('flex');
    } else {
      clearBtn.classList.add('hidden');
      clearBtn.classList.remove('flex');
    }
  }
  renderProductsGrid();
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (input) input.value = '';
  if (clearBtn) {
    clearBtn.classList.add('hidden');
    clearBtn.classList.remove('flex');
  }
  activeSearchQuery = '';
  renderProductsGrid();
}

function renderProductsGrid() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productsFoundCount');
  if (!grid) return;

  let filtered = PRODUCTS_DATA.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.cat === activeCategory;
    const matchSearch = !activeSearchQuery || 
      p.name.toLowerCase().includes(activeSearchQuery) || 
      p.description.toLowerCase().includes(activeSearchQuery) ||
      p.cat.toLowerCase().includes(activeSearchQuery);
    return matchCat && matchSearch;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} produto${filtered.length !== 1 ? 's' : ''}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-muted">
        <div class="text-4xl mb-3">🔍</div>
        <h3 class="serif text-2xl text-ink font-semibold">Nenhum produto encontrado</h3>
        <p class="text-sm mt-1">Tente buscar por outro termo ou mude a categoria.</p>
        <button onclick="filterByCategory('Todos')" class="mt-4 bg-wine text-white text-xs font-bold px-5 py-2.5 rounded-full">
          Ver todos os produtos
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product-card bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE4DC] shadow-card flex flex-col justify-between">
      <div>
        <div class="img-zoom relative aspect-square overflow-hidden bg-rose/20 cursor-pointer" onclick="openProductModal(${p.id})">
          <img src="${p.img}" alt="${p.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85';" class="w-full h-full object-cover">
          <span class="absolute top-2 left-2 sm:top-3 sm:left-3 ${p.tagColor} text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
            ${p.tag}
          </span>
          <button onclick="event.stopPropagation(); addToCart(${p.id})" class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-wine shadow-md flex items-center justify-center font-bold text-sm sm:text-lg hover:bg-wine hover:text-white transition" title="Adicionar à sacola">
            +
          </button>
        </div>
        <div class="p-3 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-[9px] sm:text-[10px] uppercase tracking-[.18em] text-sage font-bold">${p.cat}</span>
            <span class="text-[10px] sm:text-[11px] text-muted line-through">${p.oldPrice ? money(p.oldPrice) : ''}</span>
          </div>
          <h3 onclick="openProductModal(${p.id})" class="serif text-sm sm:text-lg font-semibold text-ink mt-1 leading-snug cursor-pointer hover:text-wine transition line-clamp-2">
            ${p.name}
          </h3>
          <p class="text-[11px] sm:text-xs text-muted mt-1 line-clamp-2">${p.description}</p>
        </div>
      </div>
      <div class="p-3 sm:p-5 pt-0">
        <div class="pt-2 sm:pt-3 border-t border-[#F8EFEA] flex items-center justify-between gap-1.5 sm:gap-2">
          <div class="min-w-0">
            <div class="text-wineDark font-bold text-sm sm:text-lg leading-none truncate">${money(p.price)}</div>
            <div class="text-[9px] sm:text-[10px] text-muted font-medium mt-0.5 truncate">${p.installments}</div>
          </div>
          <button onclick="addToCart(${p.id})" class="bg-wine text-white rounded-full px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold hover:bg-wineDark shadow-xs transition shrink-0">
            Comprar
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// Modal de Detalhes do Produto
function openProductModal(id) {
  const prod = PRODUCTS_DATA.find(p => p.id === id);
  if (!prod) return;

  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');

  if (modal && content) {
    content.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6 items-center">
        <div class="rounded-2xl overflow-hidden aspect-square bg-rose/20 shadow-inner">
          <img src="${prod.img}" alt="${prod.name}" class="w-full h-full object-cover">
        </div>
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs uppercase font-bold tracking-widest text-sage">${prod.cat}</span>
            <span class="${prod.tagColor} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">${prod.tag}</span>
          </div>
          <h2 class="serif text-2xl sm:text-3xl text-wineDark font-bold leading-tight">${prod.name}</h2>
          <p class="text-sm text-muted mt-3 leading-relaxed">${prod.description}</p>
          
          <div class="mt-4 p-3 bg-cream rounded-xl border border-[#EFE4DC]">
            <p class="text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Especificações:</p>
            <ul class="text-xs text-muted space-y-1">
              ${prod.details.map(d => `<li class="flex items-center gap-1.5"><span class="text-sage">✓</span> ${d}</li>`).join('')}
            </ul>
          </div>

          <div class="mt-5 flex items-baseline gap-3">
            <span class="serif text-3xl font-bold text-wineDark">${money(prod.price)}</span>
            ${prod.oldPrice ? `<span class="text-sm text-muted line-through">${money(prod.oldPrice)}</span>` : ''}
          </div>
          <p class="text-xs text-muted font-medium mt-0.5">💳 ${prod.installments}</p>

          <div class="mt-6 flex items-center gap-3">
            <div class="flex items-center gap-2 bg-[#FBF7F2] rounded-full p-1.5 border border-[#EFE4DC]">
              <button onclick="decrementModalQty()" class="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm text-ink hover:bg-rose/30">−</button>
              <span id="modalProdQty" class="text-sm font-bold px-2 text-ink">1</span>
              <button onclick="incrementModalQty()" class="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm text-ink hover:bg-rose/30">+</button>
            </div>
            <button onclick="addModalProdToCart(${prod.id})" class="flex-1 bg-wine text-white py-3.5 px-6 rounded-full font-bold text-sm hover:bg-wineDark shadow-md transition flex items-center justify-center gap-2">
              <span>Adicionar à Sacola</span>
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

let modalQty = 1;
function incrementModalQty() {
  modalQty++;
  const el = document.getElementById('modalProdQty');
  if (el) el.textContent = modalQty;
}
function decrementModalQty() {
  if (modalQty > 1) {
    modalQty--;
    const el = document.getElementById('modalProdQty');
    if (el) el.textContent = modalQty;
  }
}
function addModalProdToCart(id) {
  addToCart(id, modalQty);
  modalQty = 1;
  closeProductModal();
  openCart();
}
function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Depoimentos
function renderTestimonials() {
  const container = document.getElementById('testimonialsContainer');
  if (!container) return;

  container.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="bg-white rounded-3xl p-6 border border-[#EFE4DC] shadow-card flex flex-col justify-between">
      <div>
        <div class="text-wine text-sm font-bold">${t.stars}</div>
        <p class="serif italic text-ink mt-3 text-sm leading-relaxed">“${t.comment}”</p>
      </div>
      <div class="mt-4 pt-3 border-t border-[#F8EFEA] flex items-center justify-between text-xs">
        <div>
          <b class="text-ink block">${t.name}</b>
          <span class="text-muted">${t.city}</span>
        </div>
        <span class="text-[10px] text-sage font-bold bg-sage/10 px-2 py-1 rounded-full">${t.item}</span>
      </div>
    </div>
  `).join('');
}

// Navegação e scroll suave
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Toast de feedback
function showToast(msg) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 2400);
}

// Controle do Modo Apresentação / Simulador Mobile
function initDemoSimulator() {
  const btnDesktop = document.getElementById('btnModeDesktop');
  const btnMobile = document.getElementById('btnModeMobile');

  if (btnDesktop && btnMobile) {
    btnDesktop.addEventListener('click', () => {
      document.body.classList.remove('demo-device-mode');
      btnDesktop.classList.add('active');
      btnMobile.classList.remove('active');
      showToast('🖥️ Modo Desktop Ativado');
    });

    btnMobile.addEventListener('click', () => {
      document.body.classList.add('demo-device-mode');
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
      showToast('📱 Modo Simulador Mobile Ativado (Apresentação)');
    });
  }
}
