 // Nav scroll state
 const navbar = document.getElementById('navbar');
 window.addEventListener('scroll', () => {
     navbar.classList.toggle('scrolled', window.scrollY > 60);
 }, { passive: true });

 // Mobile nav toggle
 document.getElementById('navToggle').addEventListener('click', () => {
     const menu = document.getElementById('navMenu');
     menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
 });
 