// cart.js - renders cart page and allows updating/removing items
import { loadCart, loadProducts, saveCart } from './storage.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

function getCartItems(){
  const cart = loadCart();
  const products = loadProducts();
  return Object.entries(cart).map(([id, qty])=>{
    const product = products.find(item => item.id === id);
    if(!product) return null;
    return {
      ...product,
      quantity: Number(qty) || 1
    };
  }).filter(Boolean);
}

function renderCart(){
  const itemsContainer = document.getElementById('cartItems');
  const summaryContainer = document.getElementById('cartSummary');
  if(!itemsContainer || !summaryContainer) return;

  const items = getCartItems();
  itemsContainer.innerHTML = '';

  if(items.length === 0){
    itemsContainer.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty.</p>
        <a href="index.html" class="btn">Continue shopping</a>
      </div>
    `;
    summaryContainer.innerHTML = '';
    return;
  }

  let subtotal = 0;

  items.forEach(item=>{
    subtotal += item.price * item.quantity;
    const row = document.createElement('article');
    row.className = 'cart-item';
    row.dataset.id = item.id;
    row.innerHTML = `
      <div class="cart-item__media">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="cart-item__info">
        <h3>${item.name}</h3>
        <p class="muted">${item.category}</p>
        <div class="price-row">
          <span>${currencyFormatter.format(item.price)}</span>
        </div>
      </div>
      <div class="cart-item__actions">
        <label>
          Qty
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="qty-input" />
        </label>
        <button data-action="remove" data-id="${item.id}" class="link-btn">Remove</button>
      </div>
    `;
    itemsContainer.appendChild(row);
  });

  const shipping = subtotal >= 3000 ? 0 : 99;
  const total = subtotal + (subtotal ? shipping : 0);

  summaryContainer.innerHTML = `
    <div class="summary-card">
      <h3>Order summary</h3>
      <div class="summary-line"><span>Subtotal</span><span>${currencyFormatter.format(subtotal)}</span></div>
      <div class="summary-line"><span>Shipping</span><span>${subtotal ? (shipping ? currencyFormatter.format(shipping) : 'Free') : currencyFormatter.format(0)}</span></div>
      <div class="summary-line total"><span>Total</span><span>${currencyFormatter.format(total)}</span></div>
      <button id="checkoutBtn" class="btn">Proceed to checkout</button>
    </div>
  `;

  summaryContainer.querySelector('#checkoutBtn')?.addEventListener('click', ()=>{
    alert('Checkout flow is not implemented in this demo.');
  });
}

function handleQuantityChange(event){
  if(!event.target.classList.contains('qty-input')) return;
  const id = event.target.dataset.id;
  const value = Math.max(1, Number(event.target.value) || 1);
  const cart = loadCart();
  cart[id] = value;
  saveCart(cart);
  window.dispatchEvent(new Event('cart-updated'));
  renderCart();
}

function handleRemove(event){
  if(event.target.dataset.action !== 'remove') return;
  const id = event.target.dataset.id;
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  window.dispatchEvent(new Event('cart-updated'));
  renderCart();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCart();
  document.getElementById('cartItems')?.addEventListener('input', handleQuantityChange);
  document.getElementById('cartItems')?.addEventListener('click', handleRemove);
});

window.addEventListener('cart-updated', renderCart);
window.addEventListener('storage', (event)=>{
  if(event.key === 'cart'){
    renderCart();
  }
});
