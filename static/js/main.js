// ==========================================
// 1. FITUR MENU MOBILE (Hamburger)
// ==========================================
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ==========================================
// 2. FITUR NAVBAR SMART SCROLL (Glassmorphism)
// ==========================================
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==========================================
// 3. FITUR SCROLL REVEAL ANIMATION
// ==========================================
const revealElements = document.querySelectorAll('.hero-text-wrapper, .hero-image-wrapper, .about-bio, .about-frame, .stat-box, .exp-item, .skill-list, .project-card-horizontal, .contact-wrapper');

revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    if(el.classList.contains('stat-box')) {
        el.classList.add(`delay-${(index % 3) + 1}`);
    }
});

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); 
        } else {
            if (entry.boundingClientRect.top > 0) {
                entry.target.classList.remove('active'); 
            }
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    scrollObserver.observe(el);
});

// ==========================================
// 4. FITUR SPLASH SCREEN (BENTO PRELOADER)
// ==========================================
document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('bento-preloader');
    const track = document.getElementById('bento-track'); 

    if (preloader && track) {
        const bentoGroup = track.querySelector('.bento-group');
        
        // Kloning 2x agar animasi scroll kanan-ke-kiri tidak putus
        track.appendChild(bentoGroup.cloneNode(true));
        track.appendChild(bentoGroup.cloneNode(true));

        // Animasi loading (4 detik)
        setTimeout(() => {
            preloader.classList.add('hide');
            document.body.style.overflow = 'auto';
            setTimeout(() => { preloader.remove(); }, 1000);
        }, 4000);
    }
});

// ==========================================
// 5. PARALLAX MOUSE EFFECT (AWWWARDS STYLE)
// ==========================================
document.addEventListener('mousemove', (e) => {
    const preloader = document.getElementById('bento-preloader');
    // Efek paralaks hanya aktif saat loading screen tampil
    if (preloader && !preloader.classList.contains('hide')) {
        
        const xPos = (e.clientX / window.innerWidth - 0.5) * -40; 
        const yPos = (e.clientY / window.innerHeight - 0.5) * -40;
        
        document.documentElement.style.setProperty('--px', `${xPos}px`);
        document.documentElement.style.setProperty('--py', `${yPos}px`);
    }
});