// navigation.js - shared navigation handler for all pages
// Handles navigation links that redirect to index.html with filters

function initGlobalNavigation(){
  const navLinks = document.querySelectorAll('.site-nav a[data-nav]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const navType = link.dataset.nav;
      
      // If we're on index.html, let main.js handle it
      if(window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')){
        // Let main.js handle navigation on home page
        return;
      }
      
      // On other pages, redirect to index.html with hash for filter
      if(navType === 'home'){
        window.location.href = 'index.html';
      } else {
        window.location.href = `index.html#nav=${navType}`;
      }
    });
  });
}

// Handle hash-based navigation when landing on index.html
function handleHashNavigation(){
  if(!window.location.pathname.includes('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')){
    return;
  }
  
  const hash = window.location.hash;
  if(hash && hash.startsWith('#nav=')){
    const navType = hash.replace('#nav=', '');
    const navLink = document.querySelector(`.site-nav a[data-nav="${navType}"]`);
    if(navLink){
      // Wait for DOM to be ready, then trigger click
      setTimeout(() => {
        navLink.click();
      }, 100);
    }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  initGlobalNavigation();
  handleHashNavigation();
});

// Also handle hash changes
window.addEventListener('hashchange', handleHashNavigation);

