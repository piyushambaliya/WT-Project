// admin.js - handles admin dashboard and add/edit product functionality
import { loadProducts, saveProducts, uid } from './storage.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

// Only allow access if isAdmin flag is set
if(window.location.pathname.includes('/admin') && !localStorage.getItem('isAdmin')){
  // Redirect to login if not admin
  window.location.href = '../login.html';
}

// Render product table in admin dashboard
function renderTable(){
  const products = loadProducts();
  const tbody = document.querySelector('#productTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';

  if(products.length === 0){
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="6" class="muted">No products yet. Use "Add product" to get started.</td>`;
    tbody.appendChild(emptyRow);
    return;
  }

  products.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><img src="${p.image}" alt="${p.name}" /></td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${currencyFormatter.format(p.price)}</td>
      <td>
        <button class="edit" data-id="${p.id}">Edit</button>
        <button class="delete" data-id="${p.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.delete').forEach(btn=> btn.addEventListener('click', ()=>{
    const id = btn.dataset.id;
    const products = loadProducts();
    const idx = products.findIndex(x=>x.id===id);
    if(idx>-1){
      products.splice(idx,1);
      saveProducts(products);
      renderTable();
    }
  }));

  document.querySelectorAll('.edit').forEach(btn=> btn.addEventListener('click', ()=>{
    const id = btn.dataset.id;
    window.location.href = `add-product.html?id=${encodeURIComponent(id)}`;
  }));
}

// Handle add/edit product form on add-product.html
function handleForm(){
  const form = document.getElementById('productForm');
  if(!form) return;

  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');
  if(editId){
    const products = loadProducts(); const p = products.find(x=>x.id===editId);
    if(p){ document.getElementById('image').value = p.image || ''; document.getElementById('name').value = p.name || ''; document.getElementById('price').value = p.price || ''; document.getElementById('category').value = p.category || ''; document.getElementById('description').value = p.description || ''; }
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const image = document.getElementById('image').value.trim();
    const name = document.getElementById('name').value.trim();
    const price = Number(document.getElementById('price').value) || 0;
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();

    if(!image || !name || !category){ alert('Image, name and category are required'); return; }

    const products = loadProducts();
    if(editId){
      // update
      const idx = products.findIndex(x=>x.id===editId);
      if(idx>-1){ products[idx] = { ...products[idx], image, name, price, category, description }; saveProducts(products); window.location.href = 'admin.html'; }
    }else{
      const product = { id: uid(), image, name, price, category, description, rating:4.0 };
      products.push(product); saveProducts(products); window.location.href = 'admin.html';
    }
  });
}

function initLogout(){
  const btn = document.getElementById('logoutBtn');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    localStorage.removeItem('isAdmin');
    window.location.href = '../login.html';
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderTable();
  handleForm();
  initLogout();
});

export { renderTable };
