/**
 * DYNAMIC SCROLL ANIMATIONS SYSTEM
 * Advanced scroll-triggered animations with performance optimization
 */

class ScrollAnimations {
  constructor(options = {}) {
    this.options = {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px',
      animationDelay: 80,
      parallaxSpeed: 0.3,
      enableParallax: true,
      enableProgressBar: true,
      enableScrollToTop: true,
      enableStaggeredAnimations: true,
      respectReducedMotion: true,
      ...options
    };

    this.animatedElements = new Set();
    this.parallaxElements = new Set();
    this.scrollDirection = 'down';
    this.lastScrollY = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;

    this.init();
  }

  init() {
    // Check for reduced motion preference
    if (this.options.respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.setupScrollProgressBar();
    this.setupScrollToTopButton();
    this.setupIntersectionObserver();
    this.setupParallaxElements();
    this.setupScrollListeners();
    this.setupResizeListener();
    this.initializeAnimations();
  }

  setupScrollProgressBar() {
    if (!this.options.enableProgressBar) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    this.progressBar = progressBar;
  }

  setupScrollToTopButton() {
    if (!this.options.enableScrollToTop) return;

    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    `;
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    this.scrollToTopBtn = scrollToTopBtn;

    // Add click event
    scrollToTopBtn.addEventListener('click', () => {
      this.scrollToTop();
    });
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          } else if (this.options.enableStaggeredAnimations) {
            this.resetElement(entry.target);
          }
        });
      },
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );
  }

  setupParallaxElements() {
    if (!this.options.enableParallax) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
      this.parallaxElements.add(element);
    });
  }

  setupScrollListeners() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollProgress();
          this.updateScrollToTopButton();
          this.updateParallaxElements();
          this.updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.debounce(() => {
        this.updateParallaxElements();
      }, 250)();
    });
  }

  initializeAnimations() {
    // Find all elements with animation classes
    const animationSelectors = [
      '.scroll-fade-in',
      '.scroll-slide-left',
      '.scroll-slide-right',
      '.scroll-slide-up',
      '.scroll-slide-down',
      '.scroll-scale-in',
      '.scroll-scale-out',
      '.scroll-bounce-in',
      '.scroll-bounce-left',
      '.scroll-bounce-right',
      '.scroll-spin-in',
      '.scroll-spin-reverse',
      '.scroll-flip-horizontal',
      '.scroll-flip-vertical',
      '.scroll-wave-in',
      '.scroll-wave-out',
      '.scroll-elastic-in',
      '.scroll-elastic-out',
      '.scroll-zoom-in',
      '.scroll-zoom-out',
      '.animate-on-scroll'
    ];

    animationSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.animatedElements.add(element);
        this.observer.observe(element);
      });
    });

    // Add animation classes to sections, inputs, and options
    this.enhanceFormElements();
    this.enhanceSections();
  }

  enhanceFormElements() {
    // Enhance all input elements
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      input.classList.add('animated-input');
      
      // Add staggered delay
      if (this.options.enableStaggeredAnimations) {
        const delayClass = `scroll-delay-${Math.min(index + 1, 10)}`;
        input.classList.add(delayClass);
      }

      // Add material design focus/blur animations
      input.addEventListener('focus', () => {
        input.style.transform = 'translateY(-1px) scale(1.01)';
        input.style.boxShadow = 'var(--elevation-2)';
      });

      input.addEventListener('blur', () => {
        input.style.transform = 'translateY(0) scale(1)';
        input.style.boxShadow = 'var(--elevation-1)';
      });
    });

    // Enhance all option elements with material design
    const options = document.querySelectorAll('option');
    options.forEach(option => {
      option.addEventListener('mouseenter', () => {
        option.style.transform = 'translateX(2px)';
        option.style.boxShadow = 'var(--elevation-2)';
      });

      option.addEventListener('mouseleave', () => {
        option.style.transform = 'translateX(0)';
        option.style.boxShadow = 'var(--elevation-1)';
      });
    });
  }

  enhanceSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      section.classList.add('animated-section');
      
      // Add staggered animation classes
      if (this.options.enableStaggeredAnimations) {
        const animationTypes = [
          'scroll-fade-in',
          'scroll-slide-left',
          'scroll-slide-right',
          'scroll-scale-in',
          'scroll-bounce-in',
          'scroll-wave-in'
        ];
        
        const animationType = animationTypes[index % animationTypes.length];
        section.classList.add(animationType);
        
        const delayClass = `scroll-delay-${Math.min(index + 1, 10)}`;
        section.classList.add(delayClass);
      }

      this.animatedElements.add(section);
      this.observer.observe(section);
    });
  }

  animateElement(element) {
    if (element.classList.contains('visible')) return;

    // Use requestAnimationFrame for smoother material design animations
    requestAnimationFrame(() => {
      element.classList.add('visible');
      
      // Add material design elevation for cards
      if (element.classList.contains('card-animated')) {
        element.style.boxShadow = 'var(--elevation-2)';
      }
      
      // Add entrance sound effect (optional)
      this.playEntranceSound();

      // Trigger custom event
      element.dispatchEvent(new CustomEvent('animationStart', {
        detail: { element, animationType: this.getAnimationType(element) }
      }));
    });
  }

  resetElement(element) {
    element.classList.remove('visible');
    
    // Reset material design elevation
    if (element.classList.contains('card-animated')) {
      element.style.boxShadow = 'var(--elevation-1)';
    }
  }

  getAnimationType(element) {
    const classes = element.className.split(' ');
    return classes.find(cls => cls.startsWith('scroll-')) || 'animate-on-scroll';
  }

  updateScrollProgress() {
    if (!this.progressBar) return;

    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  }

  updateScrollToTopButton() {
    if (!this.scrollToTopBtn) return;

    const scrollTop = window.pageYOffset;
    const shouldShow = scrollTop > 300;

    if (shouldShow) {
      this.scrollToTopBtn.classList.add('visible');
    } else {
      this.scrollToTopBtn.classList.remove('visible');
    }
  }

  updateParallaxElements() {
    if (!this.options.enableParallax) return;

    const scrollTop = window.pageYOffset;
    
    this.parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || this.options.parallaxSpeed;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  updateScrollDirection() {
    const currentScrollY = window.pageYOffset;
    
    if (currentScrollY > this.lastScrollY) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }
    
    this.lastScrollY = currentScrollY;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  playEntranceSound() {
    // Optional: Add subtle sound effects
    // This is a placeholder for future sound implementation
  }

  debounce(func, wait) {
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

  // Public methods for external control
  refresh() {
    this.animatedElements.clear();
    this.parallaxElements.clear();
    this.initializeAnimations();
  }

  addElement(element, animationType = 'scroll-fade-in') {
    element.classList.add(animationType);
    this.animatedElements.add(element);
    this.observer.observe(element);
  }

  removeElement(element) {
    this.animatedElements.delete(element);
    this.observer.unobserve(element);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.progressBar) {
      this.progressBar.remove();
    }
    
    if (this.scrollToTopBtn) {
      this.scrollToTopBtn.remove();
    }
  }
}

// Enhanced form interactions
class FormAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupInputAnimations();
    this.setupSelectAnimations();
    this.setupButtonAnimations();
  }

  setupInputAnimations() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Floating label effect
      this.setupFloatingLabel(input);
      
      // Focus animations
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
        this.animateInputFocus(input);
      });
      
      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('focused');
        this.animateInputBlur(input);
      });
      
      // Typing animation
      input.addEventListener('input', () => {
        this.animateTyping(input);
      });
    });
  }

  setupSelectAnimations() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
      select.addEventListener('change', () => {
        this.animateSelectChange(select);
      });
      
      select.addEventListener('focus', () => {
        this.animateSelectFocus(select);
      });
    });
  }

  setupButtonAnimations() {
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.animateButtonClick(button, e);
      });
      
      button.addEventListener('mouseenter', () => {
        this.animateButtonHover(button);
      });
    });
  }

  setupFloatingLabel(input) {
    const label = input.previousElementSibling;
    if (!label || !label.tagName === 'LABEL') return;

    if (input.value) {
      label.classList.add('floating');
    }

    input.addEventListener('focus', () => {
      label.classList.add('floating');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        label.classList.remove('floating');
      }
    });
  }

  animateInputFocus(input) {
    input.style.transform = 'translateY(-2px) scale(1.02)';
    input.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1)';
  }

  animateInputBlur(input) {
    input.style.transform = 'translateY(0) scale(1)';
    input.style.boxShadow = '0 0 0 0px rgba(249, 115, 22, 0.1)';
  }

  animateTyping(input) {
    input.style.transform = 'scale(1.01)';
    setTimeout(() => {
      input.style.transform = 'scale(1)';
    }, 100);
  }

  animateSelectChange(select) {
    select.style.transform = 'scale(1.05)';
    select.style.background = 'linear-gradient(135deg, #f97316, #ea580c)';
    select.style.color = 'white';
    
    setTimeout(() => {
      select.style.transform = 'scale(1)';
      select.style.background = '';
      select.style.color = '';
    }, 200);
  }

  animateSelectFocus(select) {
    select.style.transform = 'translateY(-2px)';
    select.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  }

  animateButtonClick(button, event) {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  animateButtonHover(button) {
    button.style.transform = 'translateY(-3px)';
    button.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
  }
}

// Advanced hover effects
class HoverEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupCardHovers();
    this.setupImageHovers();
    this.setupLinkHovers();
  }

  setupCardHovers() {
    const cards = document.querySelectorAll('.card, .card-animated, [class*="card"]');
    
    cards.forEach(card => {
      card.classList.add('card-animated');
      
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardLeave(card);
      });
    });
  }

  setupImageHovers() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        this.animateImageHover(img);
      });
      
      img.addEventListener('mouseleave', () => {
        this.animateImageLeave(img);
      });
    });
  }

  setupLinkHovers() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.animateLinkHover(link);
      });
    });
  }

  animateCardHover(card) {
    card.style.transform = 'translateY(-10px) scale(1.02)';
    card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
  }

  animateCardLeave(card) {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '';
  }

  animateImageHover(img) {
    img.style.transform = 'scale(1.05)';
    img.style.filter = 'saturate(1.1) contrast(1.05)';
  }

  animateImageLeave(img) {
    img.style.transform = 'scale(1)';
    img.style.filter = '';
  }

  animateLinkHover(link) {
    link.style.transform = 'translateY(-2px)';
    link.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  window.scrollAnimations = new ScrollAnimations({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    animationDelay: 100,
    parallaxSpeed: 0.5,
    enableParallax: true,
    enableProgressBar: true,
    enableScrollToTop: true,
    enableStaggeredAnimations: true,
    respectReducedMotion: true
  });

  // Initialize form animations
  window.formAnimations = new FormAnimations();

  // Initialize hover effects
  window.hoverEffects = new HoverEffects();

  // Add ripple effect CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .floating {
      transform: translateY(-20px) scale(0.8);
      color: #f97316;
    }
    
    .focused {
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScrollAnimations, FormAnimations, HoverEffects };
}
