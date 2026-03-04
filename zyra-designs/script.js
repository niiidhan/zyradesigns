// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
            },
            colors: {
                primary: '#11d411',
                brandDark: '#1a1a1a',
                brandSoft: '#fdfbf7',
            },
            borderRadius: {
                'custom': '8px',
            }
        }
    }
}

// Video Testimonial Hover Play
document.querySelectorAll('.video-testimonial-card').forEach(card => {
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => {
        video.play().catch(() => { });
    });
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// Volume Toggle
function toggleTestimonialVolume(e, btn) {
    e.stopPropagation();
    const card = btn.closest('.video-testimonial-card');
    const video = card.querySelector('video');
    const volOn = btn.querySelector('.vol-on');
    const volOff = btn.querySelector('.vol-off');
    const slider = btn.parentElement.querySelector('.vol-range');
    video.muted = !video.muted;
    if (video.muted) {
        volOn.classList.remove('hidden');
        volOff.classList.add('hidden');
    } else {
        volOn.classList.add('hidden');
        volOff.classList.remove('hidden');
        if (slider) video.volume = slider.value / 100;
    }
}

// Volume Slider Adjust
function adjustVolume(e, slider) {
    e.stopPropagation();
    const card = slider.closest('.video-testimonial-card');
    const video = card.querySelector('video');
    const volCtrl = slider.closest('.volume-control');
    const volOn = volCtrl.querySelector('.vol-on');
    const volOff = volCtrl.querySelector('.vol-off');
    video.volume = slider.value / 100;
    if (slider.value == 0) {
        video.muted = true;
        volOn.classList.add('hidden');
        volOff.classList.remove('hidden');
    } else {
        video.muted = false;
        volOn.classList.remove('hidden');
        volOff.classList.add('hidden');
    }
}

// Hide volume slider on mouse leave
document.querySelectorAll('.volume-control').forEach(ctrl => {
    ctrl.addEventListener('mouseleave', () => {
        ctrl.querySelector('.volume-slider-popup').classList.add('hidden');
    });
});

// Scroll Carousel
let videoTestimonialPage = 0;
function scrollVideoTestimonials(dir) {
    const track = document.getElementById('videoTestimonialTrack');
    const cards = track.querySelectorAll('.video-testimonial-card');
    const cardWidth = (cards.length > 0) ? (cards[0].offsetWidth + 20) : 0; // card + gap
    const visibleCards = 4;
    const totalPages = Math.ceil(cards.length / visibleCards);
    videoTestimonialPage = Math.max(0, Math.min(videoTestimonialPage + dir, totalPages - 1));
    track.scrollTo({ left: videoTestimonialPage * cardWidth * visibleCards, behavior: 'smooth' });
    // Update progress
    const progress = document.getElementById('videoTestimonialProgress');
    if (progress) {
        progress.style.width = ((videoTestimonialPage + 1) / totalPages * 100) + '%';
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.hamburger-btn');
    menu.classList.toggle('active');
    btn.classList.toggle('active');

    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.hamburger-btn');
    if (menu) menu.classList.remove('active');
    if (btn) btn.classList.remove('active');
    document.body.style.overflow = '';
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form after close animation
        setTimeout(() => {
            const form = document.getElementById('contactForm');
            const success = document.getElementById('formSuccess');
            if (form) form.style.display = 'block';
            if (success) success.classList.remove('show');
            const innerForm = document.querySelector('#contactForm form');
            if (innerForm) innerForm.reset();
        }, 300);
    }
}

function showToast(message, subtitle = "We'll reach out shortly", type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-message ${type === 'error' ? 'border-red-500' : ''}`;

    const iconColor = type === 'error' ? 'text-red-500' : 'text-primary';
    const iconBg = type === 'error' ? 'bg-red-500/10' : 'bg-primary/10';

    toast.innerHTML = `
        <div class="toast-icon ${iconBg} ${iconColor}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                ${type === 'error'
            ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
            : '<polyline points="20 6 9 17 4 12"></polyline>'}
            </svg>
        </div>
        <div class="flex flex-col">
            <p class="font-bold text-sm tracking-tight">${message}</p>
            ${subtitle ? `<p class="text-[10px] text-gray-400 font-medium">${subtitle}</p>` : ''}
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('active'), 100);

    // Remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

async function submitContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="flex items-center justify-center gap-2">Connecting...</span>';

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyfG00Y0_Qrn5BpiCuFHFLu2EFHn73dP8g_OEAZg6SXXJrRXMQffwcwZOoiomSRnNth/exec';
    const isModal = form.closest('#contactModal');

    // Map keys EXACTLY to what your Code.gs 'JSON.parse' expects
    const payload = {
        name: isModal ? document.getElementById('contactName').value : document.getElementById('name').value,
        email: isModal ? document.getElementById('contactEmail').value : document.getElementById('email').value,
        project: isModal ? 'General Inquiry (Modal)' : document.getElementById('interest').value,
        message: isModal ? document.getElementById('contactMessage').value : document.getElementById('message').value
    };

    try {
        // Since your Code.gs uses JSON.parse(e.postData.contents), 
        // we send a clean JSON string as the body.
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });

        if (isModal) {
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('formSuccess').classList.add('show');
        } else {
            showToast('Inquiry Received Successfully');
            form.reset();
        }
    } catch (error) {
        console.error('Error!', error.message);
        showToast('Submission Problem', 'Check connection & try again', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Modal Event Listeners
const contactModal = document.getElementById('contactModal');
if (contactModal) {
    contactModal.addEventListener('click', function (e) {
        if (e.target === this) closeContactModal();
    });
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeContactModal();
});

// Back to Top button visibility
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
    if (backToTopBtn) {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});

// FAQ Accordion
function toggleFaq(btn) {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    // Close all
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
    // Open clicked if it wasn't already open
    if (!isActive) item.classList.add('active');
}

// Testimonial Carousel Logic
let currentTestimonial = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.testimonial-dot');

function updateSlider() {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentTestimonial);
        if (dots[i]) dots[i].classList.toggle('active', i === currentTestimonial);
    });
}

function changeTestimonial(n) {
    if (slides.length === 0) return;
    currentTestimonial = (currentTestimonial + n + slides.length) % slides.length;
    updateSlider();
}

function goToTestimonial(n) {
    currentTestimonial = n;
    updateSlider();
}

// Auto-play testimonials every 6 seconds
let testimonialInterval = setInterval(() => changeTestimonial(1), 6000);

// Pause auto-play on hover
const sliderContainer = document.getElementById('testimonialSlider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    sliderContainer.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => changeTestimonial(1), 6000);
    });
}

// Counter Animation Logic
const animateCounters = () => {
    const statsElements = document.querySelectorAll('.counter');
    const duration = 2000; // Total time for animation in ms

    statsElements.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const startTime = performance.now();

        const updateCount = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smoother finish
            const easeOutQuad = (t) => t * (2 - t);
            const currentCount = Math.floor(easeOutQuad(progress) * target);

            counter.innerText = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };

        requestAnimationFrame(updateCount);
    });
};

// Scroll Trigger with Intersection Observer
const statsSection = document.getElementById('statsSection');
const revealElements = document.querySelectorAll('.reveal-up');

const observerOptions = {
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'statsSection') {
                animateCounters();
            } else {
                entry.target.classList.add('active');
            }
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

if (statsSection) sectionObserver.observe(statsSection);
revealElements.forEach(el => sectionObserver.observe(el));

// Hero Image Slider Logic
let currentHeroImage = 0;
const heroSlides = document.querySelectorAll('.hero-image-slide');

function rotateHeroImages() {
    if (heroSlides.length === 0) return;
    heroSlides[currentHeroImage].classList.remove('active');
    currentHeroImage = (currentHeroImage + 1) % heroSlides.length;
    heroSlides[currentHeroImage].classList.add('active');
}

if (heroSlides.length > 0) {
    setInterval(rotateHeroImages, 5000);
}

// Word Scroller Logic
const scrollerInner = document.querySelector('.word-scroller-inner');
if (scrollerInner) {
    const words = scrollerInner.children;
    let currentWord = 0;

    function rotateWords() {
        currentWord = (currentWord + 1) % words.length;
        scrollerInner.style.transform = `translateY(-${currentWord * (100 / words.length)}%)`;
    }

    setInterval(rotateWords, 2500);
}
