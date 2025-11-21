// product-detail.js - shows product information and allows adding to cart
import { loadProducts, loadCart, saveCart } from './storage.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

function getQueryParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

function showToast(message){
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(()=> toast.classList.add('visible'), 10);
  setTimeout(()=>{
    toast.classList.remove('visible');
    setTimeout(()=> toast.remove(), 300);
  }, 2200);
}

function render(){
  const id = getQueryParam('id');
  const products = loadProducts();
  const p = products.find(x=>x.id===id);
  const container = document.getElementById('productDetail');
  if(!container) return;
  if(!p){ container.innerHTML = '<p>Product not found.</p>'; return; }

  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-gallery">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <p class="product-card__category">${p.category}</p>
        <h1>${p.name}</h1>
        <div class="price-row">
          <span class="product-price">${currencyFormatter.format(p.price)}</span>
          <span class="product-rating">⭐ ${p.rating || '4.0'}</span>
        </div>
        <p class="product-description">${p.description || 'Premium product tailored for everyday use.'}</p>
        <div class="qty-control">
          <label for="qty">Quantity</label>
          <input id="qty" type="number" value="1" min="1" />
        </div>
        <div class="product-actions">
          <button id="addToCart" class="btn">Add to cart</button>
          <button id="buyNow" class="btn btn-secondary">Buy now</button>
        </div>
      </div>
    </div>
  `;

  const addToCartBtn = document.getElementById('addToCart');
  const buyNowBtn = document.getElementById('buyNow');

  function persistCart(navigateToCart = false){
    const qty = Math.max(1, Number(document.getElementById('qty').value) || 1);
    const cart = loadCart();
    cart[p.id] = (cart[p.id] || 0) + qty;
    saveCart(cart);
    window.dispatchEvent(new Event('cart-updated'));
    showToast('Item added to cart');
    if(navigateToCart){
      window.location.href = 'cart.html';
    }
  }

  addToCartBtn?.addEventListener('click', ()=> persistCart(false));
  buyNowBtn?.addEventListener('click', ()=> persistCart(true));
}

document.addEventListener('DOMContentLoaded', render);
