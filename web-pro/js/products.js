// products.js - handles loading products and rendering on home page
import { loadProducts } from './storage.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

// Render product cards inside #productGrid
export function renderProducts(filters = {}){
  const { category = null, search = '', navFilter = null } = filters;
  const products = loadProducts();
  const grid = document.getElementById('productGrid');
  const resultCount = document.getElementById('resultCount');
  if(!grid) return;

  let list = [...products];

  // Handle navigation filters (Deals, Electronics, Fashion)
  if(navFilter === 'deals'){
    // Show products with high ratings (4.5+) as deals
    list = list.filter(p => (p.rating || 0) >= 4.5);
  } else if(navFilter === 'electronics'){
    // Show electronics categories: Mobiles, Audio, Wearables, Appliances
    const electronicsCategories = ['Mobiles', 'Audio', 'Wearables', 'Appliances'];
    list = list.filter(p => electronicsCategories.includes(p.category));
  } else if(navFilter === 'fashion'){
    // Show Fashion category products
    list = list.filter(p => (p.category || '').toLowerCase() === 'fashion');
  }

  if(category){
    list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }

  if(search){
    const term = search.toLowerCase();
    list = list.filter(p => {
      const haystack = `${p.name} ${p.category || ''} ${p.description || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }

  // Update page title based on filter
  const toolbarTitle = document.querySelector('.product-toolbar h2');
  const toolbarEyebrow = document.querySelector('.product-toolbar .eyebrow');
  
  if(navFilter === 'deals'){
    if(toolbarEyebrow) toolbarEyebrow.textContent = 'Special offers';
    if(toolbarTitle) toolbarTitle.textContent = 'Festive deals';
  } else if(navFilter === 'electronics'){
    if(toolbarEyebrow) toolbarEyebrow.textContent = 'Tech & gadgets';
    if(toolbarTitle) toolbarTitle.textContent = 'Electronics';
  } else if(navFilter === 'fashion'){
    if(toolbarEyebrow) toolbarEyebrow.textContent = 'Style & trends';
    if(toolbarTitle) toolbarTitle.textContent = 'Fashion';
  } else {
    if(toolbarEyebrow) toolbarEyebrow.textContent = 'Curated for you';
    if(toolbarTitle) toolbarTitle.textContent = 'Top picks';
  }

  if(resultCount){
    resultCount.textContent = list.length
      ? `${list.length} product${list.length === 1 ? '' : 's'} found`
      : 'No products found';
  }

  if(list.length === 0){
    grid.innerHTML = '<div class="empty-state">No matching products. Try another search or category.</div>';
    return;
  }

  grid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card__media">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${p.category}</p>
        <h3 class="product-title">${p.name}</h3>
        <div class="product-price">${currencyFormatter.format(p.price)}</div>
        <div class="product-meta">
          <span class="product-rating">⭐ ${p.rating || '4.0'}</span>
        </div>
      </div>
      <div class="product-card__actions">
        <button class="btn btn-secondary" data-id="${p.id}">View details</button>
      </div>
    `;

    card.querySelector('button')?.addEventListener('click', (event)=>{
      event.stopPropagation();
      window.location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    });

    card.addEventListener('click', ()=>{
      window.location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    });

    grid.appendChild(card);
  });
}

// Render categories list
export function renderCategories(onSelect){
  const products = loadProducts();
  const cats = Array.from(new Set(products.map(p=>p.category))).sort();
  const ul = document.getElementById('categoryList');
  if(!ul) return;
  ul.innerHTML = '';
  const categories = [''];
  categories.push(...cats);

  categories.forEach(cat=>{
    const li = document.createElement('li');
    const label = cat || 'All products';
    li.innerHTML = `<a href="#" data-cat="${cat}">${label}</a>`;
    ul.appendChild(li);
  });

  ul.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    e.preventDefault();
    const selected = a.dataset.cat || '';
    ul.querySelectorAll('a').forEach(link => link.classList.toggle('active', link === a));
    if(typeof onSelect === 'function'){
      onSelect(selected || null);
    }
  });

  const first = ul.querySelector('a');
  if(first){
    first.classList.add('active');
  }
}
