// auth.js - handles login form, basic client-side validation, and admin flag
import { uid } from './storage.js';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const form = document.getElementById('loginForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const asAdmin = document.getElementById('asAdmin').checked;

    // Basic validation
    if(!email || !password){
      alert('Please enter email and password');
      return;
    }

    // If admin login is checked, validate credentials strictly
    if(asAdmin){
      if(email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD){
        alert('Invalid admin credentials. Email must be admin@gmail.com and password must be admin123');
        return;
      }
      localStorage.setItem('isAdmin', 'true');
      const user = { id: uid(), email: ADMIN_EMAIL };
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'admin/admin.html';
      return;
    }

    // Regular user login (any email/password allowed)
    const user = { id: uid(), email };
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });
}
