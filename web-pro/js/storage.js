// storage.js - helper functions for loading/saving data to localStorage

const SAMPLE_PRODUCTS = [
  { id:'p1', name:'Apex Ultra Smartphone', price:25999, category:'Mobiles', image:'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80', rating:4.5, description:'6.5" AMOLED, 8GB RAM, 256GB storage, 108MP triple camera for stunning shots.' },
  { id:'p2', name:'Nimbus Noise-Canceling Headphones', price:7999, category:'Audio', image:'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=600&q=80', rating:4.4, description:'40h battery, ANC, multipoint connectivity, memory foam cups for all-day comfort.' },
  { id:'p3', name:'PulseFit Pro Smartwatch', price:5999, category:'Wearables', image:'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=600&q=80', rating:4.2, description:'Advanced health tracking, GPS, 5ATM water resistance, 10-day battery life.' },
  { id:'p4', name:'Everhome Velvet Sofa', price:34999, category:'Home & Furniture', image:'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80', rating:4.1, description:'3-seater premium velvet sofa with kiln-dried frame and plush cushions.' },
  { id:'p5', name:'AeroFlow Air Purifier', price:12999, category:'Appliances', image:'https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&w=600&q=80', rating:4.6, description:'HEPA H13 filtration, PM2.5 sensor, smart auto mode, silent operation.' },
  { id:'p6', name:'Voyage 25L Travel Backpack', price:2499, category:'Bags & Luggage', image:'https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=600&q=80', rating:4.3, description:'Water-resistant fabric, padded laptop sleeve, quick-access pockets.' },
  { id:'p7', name:'ProTab Max Tablet', price:18999, category:'Mobiles', image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', rating:4.7, description:'10.5" IPS display, 6GB RAM, 128GB storage, quad speakers, all-day battery life. Perfect for work and entertainment.' },
  { id:'p8', name:'Classic Denim Jacket', price:3499, category:'Fashion', image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', rating:4.5, description:'Premium denim jacket with modern fit, perfect for casual and semi-formal occasions.' },
  { id:'p9', name:'Leather Ankle Boots', price:4999, category:'Fashion', image:'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80', rating:4.6, description:'Genuine leather boots with cushioned insoles, durable sole, and timeless design.' },
  { id:'p10', name:'Silk Scarf Collection', price:1299, category:'Fashion', image:'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?auto=format&fit=crop&w=600&q=80', rating:4.4, description:'Luxurious silk scarves in multiple patterns, perfect accessory for any outfit.' }
];

// Load products array from localStorage. Returns [] if none found.
export function loadProducts(){
  const raw = localStorage.getItem('products');
  try{
    if(!raw){
      saveProducts(SAMPLE_PRODUCTS);
      return [...SAMPLE_PRODUCTS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){
    console.error('Failed to parse products from localStorage', e);
    saveProducts(SAMPLE_PRODUCTS);
    return [...SAMPLE_PRODUCTS];
  }
}

// Save products array to localStorage.
export function saveProducts(products){
  localStorage.setItem('products', JSON.stringify(products));
}

// Load cart object from localStorage. Shape: {productId: quantity}
export function loadCart(){
  const raw = localStorage.getItem('cart');
  try{ return raw ? JSON.parse(raw) : {}; }catch(e){ console.error(e); return {}; }
}

// Save cart to localStorage
export function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }

// Utility to generate unique id for products
export function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
