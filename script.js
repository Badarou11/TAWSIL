/**
 * TAWSIL LOGISTICS - JAVASCRIPT LOGIC
 * Dynamic WhatsApp Redirection, Animations & Interactive Features
 */

// Default Configuration
const TAWSIL_CONFIG = {
  defaultPhone: "22969259173", // Official WhatsApp number for Tawsil Benin
  formattedPhone: "+229 69 25 91 73",
  defaultMessage: "Bonjour Tawsil, je suis e-commerçant et je souhaite des informations sur vos services de stockage et livraison au Bénin."
};

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppButtons();
  initFaqAccordion();
  initNumberCopy();
  initScrollReveal();
  initCounterAnimation();
  initCardTilt();
  initMobileMenu();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById("js-mobile-menu-toggle");
  const drawerOverlay = document.getElementById("js-mobile-drawer");
  const closeBtn = document.getElementById("js-mobile-drawer-close");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !drawerOverlay) return;

  function openDrawer() {
    drawerOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawerOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  
  drawerOverlay.addEventListener("click", (e) => {
    if (e.target === drawerOverlay) closeDrawer();
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener("click", closeDrawer);
  });
}

/**
 * Initialize all WhatsApp CTA Buttons with dynamic URL formatting
 */
function initWhatsAppButtons() {
  const whatsappButtons = document.querySelectorAll(".js-whatsapp-btn");
  
  whatsappButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      
      const customMessage = btn.getAttribute("data-message") || TAWSIL_CONFIG.defaultMessage;
      const targetPhone = btn.getAttribute("data-phone") || TAWSIL_CONFIG.defaultPhone;
      
      const encodedMsg = encodeURIComponent(customMessage);
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");
    });
  });
}

/**
 * FAQ Accordion Toggle
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  
  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const isActive = item.classList.contains("active");
      
      // Close all active items
      document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("active"));
      
      // Toggle current
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

/**
 * Copy WhatsApp number to clipboard with feedback
 */
function initNumberCopy() {
  const copyBtn = document.getElementById("js-copy-number");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(TAWSIL_CONFIG.formattedPhone).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "✓ Numéro copié !";
      copyBtn.style.backgroundColor = "#10b981";
      copyBtn.style.color = "#ffffff";
      
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.backgroundColor = "";
        copyBtn.style.color = "";
      }, 2500);
    });
  });
}

/**
 * Scroll Reveal Animation (AOS alternative via IntersectionObserver)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Animated Statistics Counters
 */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        
        statNumbers.forEach(counter => {
          const target = parseFloat(counter.getAttribute("data-target"));
          const prefix = counter.getAttribute("data-prefix") || "";
          const suffix = counter.getAttribute("data-suffix") || "";
          const decimals = parseInt(counter.getAttribute("data-decimals") || "0");
          
          let current = 0;
          const duration = 2000; // ms
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.innerText = `${prefix}${current.toFixed(decimals)}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById("stats-section");
  if (statsSection) observer.observe(statsSection);
}

/**
 * Interactive 3D Card Tilt Effect on Hover
 */
function initCardTilt() {
  const cards = document.querySelectorAll(".service-card, .testimonial-card");
  
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
      const rotateY = ((x - centerX) / centerX) * 5;  // max 5deg
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}
