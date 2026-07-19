if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Paksa halaman langsung ke kordinat paling atas (0, 0)
window.scrollTo(0, 0);

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
        
        if (bentoGroup) {
            track.appendChild(bentoGroup.cloneNode(true));
            track.appendChild(bentoGroup.cloneNode(true));
        }

        setTimeout(() => {
            preloader.classList.add('hide');
            document.body.style.overflow = 'auto';
            setTimeout(() => { preloader.remove(); }, 1000);
        }, 4000);
    }
});

// ==========================================
// 5. PAKET A: LENIS SMOOTH SCROLL (AWWWARDS TIER)
// ==========================================
// Inisialisasi Lenis dengan tingkat kehalusan khas Apple
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false, // Biarkan sentuhan HP tetap native
    touchMultiplier: 2,
});

// Jalankan animasi Lenis
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// ==========================================
// 6. PAKET A: SCROLL PROGRESS BAR
// ==========================================
const progressBar = document.getElementById('scroll-progress');

// Lenis memiliki built-in event listener untuk memantau scroll
lenis.on('scroll', (e) => {
    if (progressBar) {
        // e.progress mengembalikan nilai dari 0.0 sampai 1.0
        progressBar.style.transform = `scaleX(${e.progress})`;
    }
});


// ==========================================
// 7. PAKET A: CUSTOM CURSOR
// ==========================================
const cursor = document.getElementById('custom-cursor');

if (cursor) {
    // Fungsi menggerakkan kursor
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Deteksi saat kursor menyentuh link, tombol, atau input
    // Deteksi saat kursor menyentuh link, tombol, keahlian, atau tombol close (X)
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .btn-solid, .btn-outline-light, .inspect-close, .skill-badge');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

// ==========================================
// 8.STATISTIK COUNT-UP
// ==========================================
const statsSection = document.querySelector('.about-stats');
const countElements = document.querySelectorAll('.count-up');
let hasCounted = false;

if (statsSection && countElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true; // Kunci agar animasi cuma jalan 1 kali
            
            countElements.forEach(el => {
                const target = +el.getAttribute('data-target') || 0;
                const duration = 2000; // 2 detik animasi
                const start = performance.now();
                
                function updateCount(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Matematika pelambatan ala Apple (ease-out)
                    const easeOut = 1 - Math.pow(1 - Math.min(1, progress), 3); 
                    
                    el.innerText = Math.floor(easeOut * target);
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        el.innerText = target;
                    }
                }
                requestAnimationFrame(updateCount);
            });
        }
    }, { threshold: 0.1 }); // Jalan saat kotak statistik terlihat 50% di layar
    statsObserver.observe(statsSection);
}

// ==========================================
// 9. PAKET B: TIMELINE LINE DRAWING
// ==========================================
const timelineFill = document.getElementById('timeline-fill');
const expList = document.querySelector('.exp-list');

if (timelineFill && expList) {
    // Kita tumpangkan fungsinya di fitur scroll
    window.addEventListener('scroll', () => {
        const rect = expList.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Animasi dimulai saat kotak pengalaman ada di 80% layar bawah
        const start = windowHeight * 0.8; 
        const end = windowHeight * 0.2; 
        
        let progress = (start - rect.top) / (start - end);
        progress = Math.max(0, Math.min(1, progress)); // Batasi 0 s/d 1
        
        // Mengisi warna biru ke bawah
        timelineFill.style.height = `${progress * 100}%`;

        // Menyalakan titik bulat saat garis menyentuhnya
        const expItems = document.querySelectorAll('.exp-item');
        expItems.forEach(item => {
            if (item.getBoundingClientRect().top < windowHeight * 0.6) {
                item.classList.add('active-dot');
            } else {
                item.classList.remove('active-dot');
            }
        });
    });
}

// ==========================================
// 10. PAKET C: MAGNETIC BUTTON
// ==========================================
// ==========================================
// 10. PAKET C: MAGNETIC BUTTON
// ==========================================
const magneticButtons = document.querySelectorAll('.btn-solid, .btn-outline-light, .skill-badge, .inspect-close');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Jarak tarikan magnet
        const distanceX = (x - centerX) * 0.3;
        const distanceY = (y - centerY) * 0.3;
        
        // Menggeser tombol
        btn.style.transform = `translate(${distanceX}px, ${distanceY}px) scale(1.05)`;
    });

    // Sembunyikan kursor kustom saat menyentuh magnet agar tidak menutupi teks
    btn.addEventListener('mouseenter', () => {
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.style.opacity = '0';
    });

    btn.addEventListener('mouseleave', () => {
        // Reset posisi tombol
        btn.style.transform = `translate(0px, 0px) scale(1)`;
        
        // Munculkan lagi kursornya saat keluar dari area tombol
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.style.opacity = '1';
    });
});


// ==========================================
// 11. PAKET C: 3D TILT EFFECT PADA GAMBAR PROYEK
// ==========================================
const projectImages = document.querySelectorAll('.project-img-box');

projectImages.forEach(imgBox => {
    const img = imgBox.querySelector('img');
    
    imgBox.addEventListener('mousemove', (e) => {
        const rect = imgBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Menghitung rotasi X dan Y (Maksimal miring 10 derajat agar elegan)
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Terapkan efek 3D ke gambar
        img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    imgBox.addEventListener('mouseleave', () => {
        // Reset kemiringan saat kursor pergi
        img.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// ==========================================
// 12. POKEMON-STYLE CARD INSPECTION SENSOR
// ==========================================
const inspectModal = document.getElementById('card-inspect-modal');
const inspectImgTarget = document.getElementById('inspect-img-target');
const inspectCard = document.querySelector('.inspect-card');
const inspectGlare = document.querySelector('.inspect-glare');
const closeBtn = document.querySelector('.inspect-close');
const inspectOverlay = document.querySelector('.inspect-overlay');

const clickableImages = document.querySelectorAll('.hero-img, .about-frame img, .project-img-box img');

if (inspectModal) {
    // 1. Fungsi Membuka Modal
    clickableImages.forEach(img => {
        img.addEventListener('click', () => {
            // Pasang sumber foto yang di-klik ke dalam modal
            inspectImgTarget.src = img.src;
            inspectModal.classList.add('active');
            
            // Matikan scroll Lenis dan body sementara
            document.body.style.overflow = 'hidden';
            if(typeof lenis !== 'undefined') lenis.stop(); 
            
            // Reset kemiringan
            inspectCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
            inspectGlare.style.opacity = '0';
        });
    });

    // 2. Fungsi Menutup Modal
    const closeModal = () => {
        inspectModal.classList.remove('active');
        document.body.style.overflow = ''; 
        if(typeof lenis !== 'undefined') lenis.start(); // Nyalakan scroll lagi
        
        // Reset kartu setelah modal hilang
        setTimeout(() => {
            inspectCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }, 400); 
    };

    closeBtn.addEventListener('click', closeModal);
    inspectOverlay.addEventListener('click', closeModal);

    // 3. Sensor 3D 360 Derajat saat kursor bergerak di seluruh layar
    inspectModal.addEventListener('mousemove', (e) => {
        if (!inspectModal.classList.contains('active')) return;
        
        const rect = inspectModal.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Matematika Putaran (Maksimal miring 35 derajat)
        const rotateX = ((y - centerY) / centerY) * -35;
        const rotateY = ((x - centerX) / centerX) * 35;
        
        // Terapkan efek putaran 3D pada kartu
        inspectCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Terapkan pergerakan efek kilauan cahaya (Glare)
        inspectGlare.style.opacity = '1';
        inspectGlare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)`;
    });
    
    // Saat kursor keluar layar, kembalikan ke posisi semula
    inspectModal.addEventListener('mouseleave', () => {
        inspectCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
        inspectGlare.style.opacity = '0';
    });
}

// ==========================================
// 13. STAGGER ANIMATION UNTUK SKILL BADGE
// ==========================================
const skillSection = document.querySelector('.skill-list');
const skillBadges = document.querySelectorAll('.skill-badge');

if (skillSection && skillBadges.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            skillBadges.forEach((badge, index) => {
                // Delay bertahap: tombol 1 (0.1s), tombol 2 (0.2s), dst.
                setTimeout(() => {
                    badge.classList.add('show');
                }, index * 100); 
            });
            skillObserver.disconnect(); // Matikan sensor kalau sudah selesai muncul
        }
    }, { threshold: 0.1 }); // Angka 0.1 agar langsung jalan saat kotaknya nongol dikit
    
    skillObserver.observe(skillSection);
}

// --- MOUSE LIGHT ---
const mouseLight = document.getElementById('mouse-light');
window.addEventListener('mousemove', (e) => {
    mouseLight.style.opacity = '1';
    mouseLight.style.left = e.clientX + 'px';
    mouseLight.style.top = e.clientY + 'px';
});

// --- CINEMATIC ENDING (Level 20) ---
// --- CINEMATIC ENDING (Level 20) ---
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight;
    // Mulai efek transisi hitam lebih awal (300px sebelum mentok bawah)
    const triggerPos = document.body.offsetHeight - 300; 
    
    if (scrollPos > triggerPos) {
        document.body.classList.add('cinematic-mode');
    } else {
        document.body.classList.remove('cinematic-mode');
    }
});

// ==========================================
// MODUL 2: TYPEWRITER, PARALLAX, & BLOCK REVEAL
// ==========================================

// --- 1. EFEK TYPEWRITER HERO ---
document.addEventListener('DOMContentLoaded', () => {
    const typeText = document.querySelector('.typewriter-text');
    const subtitle = document.querySelector('.hero-subtitle');
    const buttons = document.querySelector('.hero-buttons');
    
    // Teks yang ingin diketik
    const kalimat = "Ex Data, Veritas. Inspired by Λόγος.";
    
    if (typeText) {
        let i = 0;
        // Kita mulai ngetik TEPAT setelah loading preloader hilang (4.2 detik)
        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (i < kalimat.length) {
                    typeText.innerHTML += kalimat.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    // Setelah selesai ngetik, munculkan subtitle & tombol
                    if(subtitle) subtitle.classList.add('show-after-typing');
                    if(buttons) buttons.classList.add('show-after-typing');
                }
            }, 80); // Kecepatan ngetik (80ms per huruf)
        }, 4200); 
    }
});

// --- 2. ORNAMEN PARALLAX (Bergerak lawan arah kursor) ---
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.hero-parallax-shape');
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 60; // Kecepatan berbeda tiap ornamen
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// --- 3. BLOCK IMAGE REVEAL (LEVEL 13) ---
// --- 3. BLOCK IMAGE REVEAL (LEVEL 13) - BISA BERULANG ---
const blockTargets = document.querySelectorAll('.hero-image-wrapper, .about-frame, .project-img-box');

if (blockTargets.length > 0) {
    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Munculkan gambar (Buka tirai balok hitam)
                setTimeout(() => {
                    entry.target.classList.add('revealed-block');
                }, 100); 
            } else {
                // RESET: Tutup kembali tirainya secara instan saat gambar keluar dari layar
                // Agar siap dibuka lagi saat pengunjung scroll kembali ke arah gambar ini
                entry.target.classList.remove('revealed-block');
            }
        });
    }, { threshold: 0.15 }); // Aktif saat 15% gambar masuk layar (Lebih responsif)

    blockTargets.forEach(target => blockObserver.observe(target));
}

// ==========================================
// MODUL 3: STICKY LAPTOP IMAGE SWAP
// ==========================================
const laptopImg = document.getElementById('laptop-screen-img');
const projectItems = document.querySelectorAll('.project-scroll-item');

if (laptopImg && projectItems.length > 0) {
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Matikan lampu teks yang lama, Nyalakan teks yang baru masuk layar
                projectItems.forEach(el => el.classList.remove('active'));
                entry.target.classList.add('active');

                // 2. Ambil link gambar dari teks yang sedang aktif
                const newSrc = entry.target.getAttribute('data-image');
                
                // 3. Efek Fade-out lalu Fade-in ganti gambar
                if (laptopImg.src !== newSrc) {
                    laptopImg.style.opacity = '0'; // Redupkan
                    setTimeout(() => {
                        laptopImg.src = newSrc; // Tukar gambar
                        laptopImg.style.opacity = '1'; // Terangkan kembali
                    }, 300); // Sinkron dengan CSS transition 0.4s
                }
            }
        });
    }, { 
        // Aktif saat teks proyek berada tepat di tengah layar (margin atas & bawah dipotong)
        rootMargin: "-40% 0px -40% 0px", 
        threshold: 0 
    });

    projectItems.forEach(item => projectObserver.observe(item));
}

// ==========================================
// MODUL FINAL: ADVANCED CURSOR TEXT SENSOR
// ==========================================
const customCursor = document.getElementById('custom-cursor');
const cursorTextSpan = document.querySelector('.cursor-text');

// Targetkan semua gambar yang bisa di-klik (Hero, Biografi, Proyek Macbook)
const viewTargets = document.querySelectorAll('.hero-image-wrapper, .about-frame, .macbook-screen');

if (customCursor && cursorTextSpan) {
    viewTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            // Ubah cursor jadi biru besar dan beri tulisan VIEW
            customCursor.classList.add('view-mode');
            cursorTextSpan.innerText = 'VIEW';
        });

        target.addEventListener('mouseleave', () => {
            // Kembalikan cursor ke titik kecil semula
            customCursor.classList.remove('view-mode');
            cursorTextSpan.innerText = '';
        });
    });
}

// ==========================================
// SPACE TRANSITION & STAR GENERATOR
// ==========================================
const starsContainer = document.getElementById('stars-container');
const experienceSection = document.getElementById('skills');

if (starsContainer && experienceSection) {
    // 1. Taburkan 100 bintang dengan ukuran & posisi acak
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star-particle');
        
        // Ukuran random (1px sampai 3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Posisi random menyebar di seluruh kontainer
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Kecepatan kelap-kelip random (1 detik - 4 detik)
        star.style.animationDuration = `${Math.random() * 3 + 1}s`;
        
        starsContainer.appendChild(star);
    }

    // 2. Sensor pergerakan Scroll
    const spaceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const title = experienceSection.querySelector('.experience-title');
            
            if (entry.isIntersecting) {
                // Saat masuk area pengalaman: Munculkan bintang perlahan & Ubah judul jadi putih
                starsContainer.classList.add('stars-active');
                if(title) title.classList.add('text-light-mode');
            } else {
                // Saat kembali naik ke atas: Matikan bintang & kembalikan judul ke hitam
                starsContainer.classList.remove('stars-active');
                if(title) title.classList.remove('text-light-mode');
            }
        });
    }, { 
        threshold: 0.25 // Efek menyala saat 25% area ini masuk ke layar 
    });

    spaceObserver.observe(experienceSection);
}