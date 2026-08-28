// Fluxo de Checkout em 3 Passos — Casa Tia Rosa

let checkoutStep = 1;
let generatedOrderText = '';
const WHATSAPP_STORE_NUMBER = '5588999999999'; // Número demonstrativo da Tia Rosa

function startCheckout() {
  if (cart.length === 0) {
    showToast('Adicione produtos à sacola para continuar');
    return;
  }
  closeCart();
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    goToStep(1);
  }
}

function closeCheckout() {
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function goToStep(step) {
  if (step > 1 && cart.length === 0) return;

  // Validação básica do Passo 2 para ir ao 3
  if (step === 3 && checkoutStep === 2) {
    const name = document.getElementById('checkoutName')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const address = document.getElementById('checkoutAddress')?.value.trim();

    if (!name || !phone || !address) {
      showToast('⚠️ Preencha Nome, WhatsApp e Endereço');
      return;
    }
  }

  checkoutStep = step;

  // Alternar telas de passos
  ['stepScreen1', 'stepScreen2', 'stepScreen3', 'stepSuccess'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('hidden', idx !== (step - 1));
    }
  });

  const successEl = document.getElementById('stepSuccess');
  if (step <= 3 && successEl) {
    successEl.classList.add('hidden');
  }

  // Atualizar indicadores visuais dos círculos de passos
  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById('stepIndicator' + i);
    const label = document.getElementById('stepLabel' + i);
    if (circle) {
      circle.classList.remove('step-active', 'step-done');
      if (i < step) {
        circle.classList.add('step-done');
        circle.innerHTML = '✓';
      } else if (i === step) {
        circle.classList.add('step-active');
        circle.innerHTML = i;
      } else {
        circle.classList.remove('text-white');
        circle.innerHTML = i;
      }
    }
    if (label) {
      if (i <= step) {
        label.classList.add('text-wineDark', 'font-bold');
        label.classList.remove('text-muted');
      } else {
        label.classList.remove('text-wineDark', 'font-bold');
        label.classList.add('text-muted');
      }
    }
  }

  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const summaryContainer = document.getElementById('checkoutItemsReview');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const discountEl = document.getElementById('checkoutDiscount');
  const discountRow = document.getElementById('checkoutDiscountRow');
  const totalEl = document.getElementById('checkoutFinalTotal');
  const step3TotalEl = document.getElementById('step3TotalDisplay');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  if (summaryContainer) {
    summaryContainer.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between gap-3 text-sm py-2 border-b border-[#F5EBE6]">
        <div class="flex items-center gap-3">
          <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85';" class="w-12 h-12 rounded-lg object-cover bg-rose/20">
          <div>
            <p class="font-bold text-ink leading-tight">${item.name}</p>
            <p class="text-xs text-muted">${item.qty}x ${money(item.price)}</p>
          </div>
        </div>
        <span class="font-bold text-wineDark">${money(item.qty * item.price)}</span>
      </div>
    `).join('');
  }

  if (subtotalEl) subtotalEl.textContent = money(subtotal);
  if (totalEl) totalEl.textContent = money(total);
  if (step3TotalEl) step3TotalEl.textContent = money(total);

  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `- ${money(discount)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }
}

function finishOrder() {
  const name = document.getElementById('checkoutName')?.value.trim() || 'Cliente';
  const phone = document.getElementById('checkoutPhone')?.value.trim() || '';
  const address = document.getElementById('checkoutAddress')?.value.trim() || '';
  const city = document.getElementById('checkoutCity')?.value.trim() || 'Minha Cidade';
  const obs = document.getElementById('checkoutObs')?.value.trim() || '';
  const payMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Pix';

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  // Construção elegante da mensagem para WhatsApp
  let itemsListText = cart.map(item => `▪️ ${item.qty}x ${item.name} (${money(item.price * item.qty)})`).join('\n');

  let message = `🌸 *NOVO PEDIDO — CASA TIA ROSA* 🌸\n\n`;
  message += `👤 *Cliente:* ${name}\n`;
  message += `📱 *WhatsApp:* ${phone}\n`;
  message += `📍 *Endereço:* ${address} — ${city}\n\n`;
  message += `🛍️ *ITENS DO PEDIDO:*\n${itemsListText}\n\n`;
  message += `💰 *Subtotal:* ${money(subtotal)}\n`;
  if (discount > 0) {
    message += `🎟️ *Desconto (${appliedCoupon?.label || 'Cupom'}):* - ${money(discount)}\n`;
  }
  message += `✨ *TOTAL FINAL:* ${money(total)}\n`;
  message += `💳 *Forma de Pagamento:* ${payMethod}\n`;
  if (obs) {
    message += `📝 *Observação:* ${obs}\n`;
  }
  message += `\n_Olá Tia Rosa! Gostaria de confirmar meu pedido acima. Como combinamos a entrega?_`;

  generatedOrderText = encodeURIComponent(message);

  // Mostrar tela de sucesso
  ['stepScreen1', 'stepScreen2', 'stepScreen3'].forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });

  const successEl = document.getElementById('stepSuccess');
  if (successEl) {
    successEl.classList.remove('hidden');
  }

  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById('stepIndicator' + i);
    if (circle) {
      circle.classList.remove('step-active');
      circle.classList.add('step-done');
      circle.innerHTML = '✓';
    }
  }

  // Preencher dados na tela de sucesso
  const successOrderNum = document.getElementById('successOrderNumber');
  if (successOrderNum) {
    successOrderNum.textContent = '#' + Math.floor(100000 + Math.random() * 900000);
  }

  // Limpar sacola
  cart = [];
  appliedCoupon = null;
  saveCart();
  updateCartBadges();
}

function openWhatsAppOrder() {
  if (!generatedOrderText) {
    showToast('Nenhum pedido gerado');
    return;
  }
  const url = `https://wa.me/${WHATSAPP_STORE_NUMBER}?text=${generatedOrderText}`;
  window.open(url, '_blank');
}

function copyPixKey() {
  const pixKey = "pix@casadatiarosa.com.br";
  navigator.clipboard.writeText(pixKey).then(() => {
    showToast('✅ Chave Pix copiada com sucesso!');
  }).catch(() => {
    showToast('Chave: pix@casadatiarosa.com.br');
  });
}
