// main.js - initializes home page components like product grid and header count
import { renderProducts, renderCategories } from './products.js';

const filters = {
  category: null,
  search: '',
  navFilter: null
};

function initSearch(){
  const searchInput = document.getElementById('searchInput');
  if(!searchInput) return;
  searchInput.addEventListener('input', (event)=>{
    filters.search = event.target.value.trim();
    renderProducts(filters);
  });
}

function initResetFilters(){
  const resetBtn = document.getElementById('resetFilters');
  if(!resetBtn) return;
  resetBtn.addEventListener('click', ()=>{
    filters.category = null;
    filters.search = '';
    filters.navFilter = null;
    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.value = '';
    document.querySelectorAll('#categoryList a').forEach((link, index)=>{
      link.classList.toggle('active', index === 0);
    });
    document.querySelectorAll('.site-nav a').forEach((link)=>{
      link.classList.toggle('active', link.dataset.nav === 'home');
    });
    renderProducts(filters);
  });
}

function initNavigation(){
  const navLinks = document.querySelectorAll('.site-nav a[data-nav]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const navType = link.dataset.nav;
      
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Set navigation filter
      if(navType === 'home'){
        filters.navFilter = null;
      } else {
        filters.navFilter = navType;
      }
      
      // Clear category filter when using nav
      filters.category = null;
      document.querySelectorAll('#categoryList a').forEach((l, index)=>{
        l.classList.toggle('active', index === 0);
      });
      
      // Scroll to products
      const productGrid = document.getElementById('productGrid');
      if(productGrid){
        productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      renderProducts(filters);
    });
  });
  
  // Handle "View deals" link in hero
  const viewDealsLink = document.querySelector('[data-nav="deals"]');
  if(viewDealsLink){
    viewDealsLink.addEventListener('click', (e)=>{
      e.preventDefault();
      const dealsNav = document.querySelector('.site-nav a[data-nav="deals"]');
      if(dealsNav) dealsNav.click();
    });
  }
}

function handleHashOnLoad(){
  const hash = window.location.hash;
  if(hash && hash.startsWith('#nav=')){
    const navType = hash.replace('#nav=', '');
    const navLink = document.querySelector(`.site-nav a[data-nav="${navType}"]`);
    if(navLink){
      filters.navFilter = navType;
      document.querySelectorAll('.site-nav a').forEach(l => l.classList.remove('active'));
      navLink.classList.add('active');
      renderProducts(filters);
    }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCategories((category)=>{
    filters.category = category;
    // Don't override navFilter when category is selected
    renderProducts(filters);
  });
  handleHashOnLoad();
  renderProducts(filters);
  initSearch();
  initResetFilters();
  initNavigation();
  
  // Handle hash changes
  window.addEventListener('hashchange', handleHashOnLoad);
});
