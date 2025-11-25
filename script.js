// Current slide index
let currentSlide = 0;
const totalSlides = 6;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initSlideNavigation();
    initMagneticCards();
    initParallax();
    initPowerCounter();
    updateProgressBar();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
});

// ========== SLIDE NAVIGATION ==========
function initSlideNavigation() {
    showSlide(0);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    
    // Validate index
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    // Update current slide
    currentSlide = index;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    slides[index].classList.add('active');
    
    // Update progress bar
    updateProgressBar();
    
    // Trigger slide-specific animations
    triggerSlideAnimations(index);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

function handleKeyPress(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        previousSlide();
    }
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressFill.style.width = progress + '%';
}

// ========== PARTICLE SYSTEM ==========
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particleA, indexA) => {
            particles.slice(indexA + 1).forEach(particleB => {
                const dx = particleA.x - particleB.x;
                const dy = particleA.y - particleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particleA.x, particleA.y);
                    ctx.lineTo(particleB.x, particleB.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========== MAGNETIC CARDS ==========
function initMagneticCards() {
    const cards = document.querySelectorAll('.magnetic-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 15;
            const rotateY = -deltaX * 15;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-20px) 
                scale(1.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        });
    });
    
    // Also apply to trust cards and benefit cards
    const trustCards = document.querySelectorAll('.trust-card');
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    [...trustCards, ...benefitCards].forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 8;
            const rotateY = -deltaX * 8;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-10px) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        });
    });
}

// ========== PARALLAX EFFECT ==========
function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // Move slide content slightly
        const content = activeSlide.querySelector('.slide-content, .features-grid, .trust-grid, .tiers-container, .benefits-grid, .thank-you-container');
        if (content) {
            const moveX = mouseX * 20;
            const moveY = mouseY * 20;
            content.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        // Move car image more dramatically
        const carImage = activeSlide.querySelector('.car-image');
        if (carImage) {
            const moveX = mouseX * 40;
            const moveY = mouseY * 40;
            carImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        // Move spotlight
        const spotlight = activeSlide.querySelector('.spotlight');
        if (spotlight) {
            const moveX = 50 + mouseX * 100;
            const moveY = 50 + mouseY * 100;
            spotlight.style.left = moveX + '%';
            spotlight.style.top = moveY + '%';
        }
    });
}

// ========== POWER COUNTER ANIMATION ==========
function initPowerCounter() {
    // This will be triggered when slide 4 becomes active
}

function animatePowerCounter() {
    const counter = document.querySelector('.power-counter');
    if (!counter) return;
    
    const target = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, stepTime);
}

// ========== TRIGGER SLIDE-SPECIFIC ANIMATIONS ==========
function triggerSlideAnimations(slideIndex) {
    switch(slideIndex) {
        case 0: // Slide 1: Grand Opening
            // Stats animation
            animateStats();
            break;
            
        case 1: // Slide 2: Innovation Core
            // Feature cards entrance
            animateFeatureCards();
            break;
            
        case 2: // Slide 3: Trust & Exclusivity
            // Trust cards bounce
            animateTrustCards();
            break;
            
        case 3: // Slide 4: Power & Customization
            // Power counter
            setTimeout(() => {
                animatePowerCounter();
            }, 500);
            break;
            
        case 4: // Slide 5: Partnership & CTA
            // Benefit cards flip
            animateBenefitCards();
            break;
            
        case 5: // Slide 6: Thank You
            // Final animation
            animateThankYou();
            break;
    }
}

// Animate statistics in slide 1
function animateStats() {
    const statNumbers = document.querySelectorAll('#slide1 .stat-number');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.animation = 'none';
            setTimeout(() => {
                stat.style.animation = '';
            }, 10);
        }, index * 200);
    });
}

// Animate feature cards in slide 2
function animateFeatureCards() {
    const cards = document.querySelectorAll('#slide2 .feature-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.8)';
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
    });
}

// Animate trust cards in slide 3
function animateTrustCards() {
    const cards = document.querySelectorAll('#slide3 .trust-card');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = '';
        }, index * 200);
    });
}

// Animate benefit cards in slide 5
function animateBenefitCards() {
    const cards = document.querySelectorAll('#slide5 .benefit-card');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = '';
        }, index * 200);
    });
}

// Animate thank you page
function animateThankYou() {
    const title = document.querySelector('#slide6 .thank-you-title');
    const subtitle = document.querySelector('#slide6 .thank-you-subtitle');
    const message = document.querySelector('#slide6 .thank-you-message');
    
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        setTimeout(() => {
            title.style.transition = 'all 1s ease-out';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(30px)';
        setTimeout(() => {
            subtitle.style.transition = 'all 1s ease-out';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 500);
    }
    
    if (message) {
        message.style.opacity = '0';
        message.style.transform = 'translateY(30px)';
        setTimeout(() => {
            message.style.transition = 'all 1s ease-out';
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 800);
    }
}

// ========== TIER CARDS HOVER EFFECTS ==========
document.addEventListener('DOMContentLoaded', () => {
    const tierCards = document.querySelectorAll('.tier-card');
    
    tierCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

// ========== SMOOTH SCROLL BEHAVIOR ==========
let isScrolling = false;

document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    isScrolling = true;
    
    if (e.deltaY > 0) {
        nextSlide();
    } else {
        previousSlide();
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}, { passive: true });

// ========== TOUCH SUPPORT ==========
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
            previousSlide();
        } else if (deltaX < -50) {
            nextSlide();
        }
    }
    // Vertical swipe
    else {
        if (deltaY > 50) {
            previousSlide();
        } else if (deltaY < -50) {
            nextSlide();
        }
    }
}, { passive: true });

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize parallax for performance
const optimizedParallax = debounce((e) => {
    // Parallax logic here if needed
}, 10);

// ========== AUTO-PLAY (OPTIONAL) ==========
// Uncomment to enable auto-play
// let autoPlayInterval;
// function startAutoPlay() {
//     autoPlayInterval = setInterval(() => {
//         nextSlide();
//     }, 5000);
// }
// setTimeout(startAutoPlay, 2000);
