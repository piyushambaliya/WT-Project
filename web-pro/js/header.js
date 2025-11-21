// header.js - shared utilities for site header (cart badge, focus handlers)
import { loadCart } from './storage.js';

let listenersBound = false;

function getCartCount() {
  const cart = loadCart();
  return Object.values(cart).reduce((sum, qty) => sum + Number(qty || 0), 0);
}

export function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.textContent = getCartCount();
}

function bindGlobalListeners() {
  if (listenersBound) return;
  listenersBound = true;

  window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
      updateCartBadge();
    }
  });

  window.addEventListener('cart-updated', updateCartBadge);
}

export function initHeader() {
  updateCartBadge();
  bindGlobalListeners();
}

document.addEventListener('DOMContentLoaded', initHeader);

