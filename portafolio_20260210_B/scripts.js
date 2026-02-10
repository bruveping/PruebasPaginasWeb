// --- Comentarios: JS ligero para interactividad ---
// Preloader
document.addEventListener('DOMContentLoaded', function(){
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
    // Simula carga breve para demo
    setTimeout(()=>{
        const p = document.getElementById('preloader');
        if(p){
            p.style.transition = 'opacity .6s ease';
            p.style.opacity = '0';
            setTimeout(()=>p.remove(),700);
        }
    }, 700);
});

// Theme toggle (clara / oscura)
const toggle = document.getElementById('themeToggle');
const root = document.documentElement;
// Recupera preferencia local
const stored = localStorage.getItem('theme');
if(stored === 'light') root.setAttribute('data-theme','light');
if(toggle){
    toggle.addEventListener('click', ()=>{
        const current = root.getAttribute('data-theme');
        if(current === 'light'){
            root.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            root.setAttribute('data-theme','light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Scroll reveal con IntersectionObserver
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.classList.add('is-visible');
            // optional: unobserve for perf
            io.unobserve(e.target);
        }
    });
}, {threshold:0.12});
reveals.forEach(r=>io.observe(r));

// Ajuste para anchors (offset para header sticky) — suavizado
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (ev)=>{
        const href = a.getAttribute('href');
        if(href.length>1){
            ev.preventDefault();
            const el = document.querySelector(href);
            if(el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 70, behavior:'smooth'});
        }
    });
});

// Mejora: pausar iframes fuera de pantalla (ejemplo simple)
const iframes = document.querySelectorAll('iframe');
const iframeObserver = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
        const src = en.target.getAttribute('src');
        if(!en.isIntersecting){
            // remueve autoplay si hubiera (evita uso de resources) — solo ejemplo, no modifica YouTube query
        }
    });
}, {threshold:0});
iframes.forEach(f=>iframeObserver.observe(f));
