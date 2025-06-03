// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add fade-in class to elements that should animate
document.querySelectorAll('.service-card, .portfolio-item, .about-content, .contact-form').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Individual Star Particles
const starsContainer = document.querySelector('.stars-container');
const STAR_COUNT = 250; // Increased from 80 to 200
const STAR_RADIUS = 80; // Increased radius for better visibility
let starsArray = [];

function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

function createStars() {
    starsArray = [];
    starsContainer.innerHTML = '';
    const rect = starsContainer.getBoundingClientRect();
    
    // Create multiple layers of stars for depth effect
    for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position within container
        const x = randomBetween(0, rect.width);
        const y = randomBetween(0, rect.height);
        
        // Random size variation
        const size = randomBetween(1.5, 3);
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity for depth
        const opacity = randomBetween(0.3, 0.7);
        star.style.opacity = opacity;
        
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        starsContainer.appendChild(star);
        starsArray.push({el: star, x, y});
    }
}

function handleMouseMove(e) {
    const rect = starsContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    starsArray.forEach(star => {
        const dx = star.x - mouseX;
        const dy = star.y - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < STAR_RADIUS) {
            star.el.classList.add('lightning');
            // Add glow effect based on distance
            const intensity = 1 - (dist / STAR_RADIUS);
            star.el.style.filter = `brightness(${1 + intensity * 2}) drop-shadow(0 0 ${intensity * 8}px #fff)`;
        } else {
            star.el.classList.remove('lightning');
            star.el.style.filter = '';
        }
    });
}

// Recreate stars on window resize
window.addEventListener('resize', createStars);
starsContainer.addEventListener('mousemove', handleMouseMove);
createStars(); 

// --------------------------------------------------------------------------------------------------


// scroll image comp 

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const img = card.querySelector('img');
        let isHovering = false;
        let animationFrame;
        let startTime;
        const scrollSpeed = 150; // pixels per second
        let currentScroll = 0;
        let targetScroll = 0;
        let lastTimestamp = 0;
        
        function animateScroll(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            if (isHovering) {
                const imgHeight = img.offsetHeight;
                const containerHeight = card.querySelector('.image-container').offsetHeight;
                const maxScroll = imgHeight - containerHeight;
                
                if (currentScroll < maxScroll) {
                    currentScroll += (scrollSpeed * elapsed) / 1000; // Convert to seconds
                    if (currentScroll > maxScroll) currentScroll = maxScroll;
                }
            } else {
                if (currentScroll > 0) {
                    currentScroll -= (scrollSpeed * elapsed) / 1000;
                    if (currentScroll < 0) currentScroll = 0;
                }
            }
            
            img.style.transform = `translateY(-${currentScroll}px)`;
            
            if ((isHovering && currentScroll < targetScroll) || (!isHovering && currentScroll > 0)) {
                animationFrame = requestAnimationFrame(animateScroll);
            }
        }
        
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            const imgHeight = img.offsetHeight;
            const containerHeight = card.querySelector('.image-container').offsetHeight;
            targetScroll = imgHeight - containerHeight;
            lastTimestamp = 0;
            animationFrame = requestAnimationFrame(animateScroll);
        });
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            targetScroll = 0;
            lastTimestamp = 0;
            animationFrame = requestAnimationFrame(animateScroll);
        });
    });
}); 



// name 

const nameText = "Muhammad Hassan";
  const nameEl = document.getElementById("name");
  let i = 0;

  function typeLetter() {
    if (i < nameText.length) {
      nameEl.textContent += nameText.charAt(i);
      i++;
      setTimeout(typeLetter, 100); // delay between letters (ms)
    }
  }

  // Start typing animation
  typeLetter();