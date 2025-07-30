// Modern JavaScript für bessere Benutzererfahrung
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Füge einen kleinen Hover-Effekt hinzu
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Lazy Loading für Bilder
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Setze initiale Opazität auf 0
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease-in';
                
                // Wenn das Bild bereits geladen ist, zeige es sofort
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    // Wenn das Bild noch lädt, zeige es nach dem Laden
                    img.addEventListener('load', function() {
                        img.style.opacity = '1';
                    });
                }
                
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        // Setze initiale Opazität auf 0 für alle Bilder
        img.style.opacity = '0';
        imageObserver.observe(img);
    });

    // Smooth Scroll für interne Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Navigation Toggle (falls benötigt)
    const createMobileMenu = () => {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const navMenu = document.querySelector('.nav-menu');
            
            if (sidebar && navMenu) {
                // Füge einen Toggle-Button hinzu
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'mobile-toggle';
                toggleBtn.innerHTML = '☰';
                toggleBtn.style.cssText = `
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 1000;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                `;
                
                document.body.appendChild(toggleBtn);
                
                let isMenuOpen = false;
                
                toggleBtn.addEventListener('click', () => {
                    isMenuOpen = !isMenuOpen;
                    navMenu.style.display = isMenuOpen ? 'flex' : 'none';
                    toggleBtn.innerHTML = isMenuOpen ? '✕' : '☰';
                });
                
                // Initial verstecken auf Mobile
                navMenu.style.display = 'none';
            }
        }
    };

    // Initial Mobile Menu Setup
    createMobileMenu();
    
    // Resize Handler
    window.addEventListener('resize', createMobileMenu);

    // Add loading animation
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.style.opacity = '0';
        welcomeSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            welcomeSection.style.transition = 'all 0.8s ease-out';
            welcomeSection.style.opacity = '1';
            welcomeSection.style.transform = 'translateY(0)';
        }, 100);
    }

    // Keyboard Navigation Support
    document.addEventListener('keydown', function(e) {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentIndex = Array.from(navLinks).findIndex(link => link === document.activeElement);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentIndex <= 0 ? navLinks.length - 1 : currentIndex - 1;
            navLinks[prevIndex].focus();
        }
    });

    // Performance Optimierung: Debounce für Resize Events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createMobileMenu, 250);
    });

    // Accessibility: Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #667eea;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }

    // Lightbox für Bilder
    const createLightbox = () => {
        // Erstelle Lightbox Container
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Event Listeners für Lightbox
        const overlay = lightbox.querySelector('.lightbox-overlay');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');

        // Schließen der Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        overlay.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('click', closeLightbox);

        // ESC Taste zum Schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        // Klick auf Bilder zum Öffnen
        const galleryImages = document.querySelectorAll('.gallery-image, .hero-image, .pricing-image, .info-image');
        galleryImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                
                // Caption aus dem Titel des Gallery-Items oder Alt-Text
                const galleryItem = img.closest('.gallery-item');
                if (galleryItem) {
                    const title = galleryItem.querySelector('.gallery-title');
                    caption.textContent = title ? title.textContent : img.alt;
                } else {
                    caption.textContent = img.alt;
                }
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    };

    // Initialisiere Lightbox
    createLightbox();
}); 