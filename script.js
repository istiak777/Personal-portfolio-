// --- Sound Synthesizer via Web Audio API ---
let soundEnabled = true;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq = 600, duration = 0.08, type = 'sine') {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // AudioContext not allowed before user gesture
    }
}

// Sound Toggle
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

if (soundToggle) {
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        soundToggle.title = soundEnabled ? 'Sound On' : 'Sound Muted';
        if (soundEnabled) playTone(700, 0.1);
    });
}

// Click sounds on interactive elements
document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .tilt-target')) {
        playTone(550, 0.06);
    }
});

// --- Mouse Cursor Glow Tracer ---
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Linear interpolation for smooth trailing
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    if (cursorGlow) {
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// --- 3D Card Tilt on Hover ---
const tiltElements = document.querySelectorAll('.tilt-target');

tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});

// --- Typewriter Effect ---
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    'Software Engineer',
    'Full-Stack Developer',
    'CSE Graduate @ DIU',
    'Competitive Thinker',
    'Algorithm Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeText() {
    if (!typewriterElement) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2200; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before next
    }

    setTimeout(typeText, typeSpeed);
}

document.addEventListener('DOMContentLoaded', typeText);

// --- Mobile Navigation Toggle ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
    });
}

// Close mobile nav when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// --- Scroll Progress Bar & Nav Highlighter & Back to Top ---
const progressBar = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';

    if (backToTopBtn) {
        if (winScroll > 380) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 240)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
            item.classList.add('active');
        }
    });
});

// Back to Top Action
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Live Project Demo Modal Controller ---
const modal = document.getElementById('demo-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalGithub = document.getElementById('modal-github');

function openDemoModal(title, githubUrl, description, tagsArray) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    modalGithub.href = githubUrl;
    
    modalTags.innerHTML = '';
    tagsArray.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = `#${tag}`;
        modalTags.appendChild(span);
    });

    modal.classList.add('active');
    playTone(850, 0.1, 'triangle');
}

function closeDemoModal(e) {
    if (e.target === modal) {
        closeDemoModalDirect();
    }
}

function closeDemoModalDirect() {
    if (modal) {
        modal.classList.remove('active');
        playTone(400, 0.08);
    }
}

// Escape key to close modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeDemoModalDirect();
    }
});

// --- Contact Form Submission Handler ---
function handleFormSubmit() {
    const toast = document.getElementById('form-toast');
    const form = document.getElementById('contact-form');
    if (toast) {
        toast.style.display = 'block';
        playTone(900, 0.15, 'sine');
    }
    if (form) form.reset();
    setTimeout(() => {
        if (toast) toast.style.display = 'none';
    }, 4500);
}

// --- Interactive Particle Physics Background Canvas ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 65;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse repulsion physics
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;

        if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            this.x -= forceDirectionX * force * 3;
            this.y -= forceDirectionY * force * 3;
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 135) {
                const opacity = (1 - distance / 135) * 0.6;
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                ctx.lineWidth = 0.55;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();