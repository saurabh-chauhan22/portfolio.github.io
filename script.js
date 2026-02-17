// ==========================================
// Modern Portfolio - JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Constants & Variables Selection
  // ==========================================
  const roleButtons = document.querySelectorAll('.role-btn');
  const navbar = document.querySelector('.navbar');
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const typingElement = document.querySelector('.typing-animation');
  const yearElement = document.getElementById('current-year');

  console.log('Initializing Portfolio...', {
    roleButtons: roleButtons.length,
    navbar: !!navbar,
    typing: !!typingElement
  });

  // Typing Animation State
  let currentTypingRole = 'aiml';
  try {
    currentTypingRole = localStorage.getItem('portfolioRole') || 'aiml';
  } catch (e) {
    console.warn('LocalStorage access denied, falling back to default role.', e);
  }
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;
  let typeTimeout; // To track and clear timeout if needed

  const roleSpecificTitles = {
    aiml: [
      'AI/ML Engineer',
      'Gen AI Engineer',
      'Data Engineer'
    ],
    backend: [
      'Software Engineer',
      'Python Developer',
      'Java Developer',
      'Web Developer'
    ]
  };

  // 2. Role Switcher Logic
  // ==========================================
  // Define setRole function
  function setRole(role) {
    console.log('Switching role to:', role);

    // Update localStorage
    try {
      localStorage.setItem('portfolioRole', role);
    } catch (e) {
      console.warn('Unable to save role to LocalStorage', e);
    }
    currentTypingRole = role; // Update typing role state

    // Update button states
    const buttons = document.querySelectorAll('.role-btn');
    buttons.forEach(btn => {
      if (btn.dataset.role === role) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Show/hide role-specific content (exclude role buttons themselves)
    const elements = document.querySelectorAll('[data-role]:not(.role-btn)');
    console.log(`Found ${elements.length} role-specific elements`);

    elements.forEach(el => {
      // Determine if this element is for the selected role
      const isMatch = el.dataset.role === role;

      if (isMatch) {
        el.style.display = ''; // Reset to default (block/flex/etc)

        // Force layout check to ensure transition works
        void el.offsetWidth;

        el.classList.add('visible'); // Make sure it's visible
        el.classList.add('fade-in'); // Ensure animation class is present
      } else {
        el.style.display = 'none';
        el.classList.remove('visible');
      }
    });

    // Update page title
    const titleMap = {
      'aiml': 'Saurabh Chauhan | AI/ML Engineer & Gen AI Engineer',
      'backend': 'Saurabh Chauhan | Backend Engineer & System Architect'
    };
    document.title = titleMap[role] || document.title;

    // Reset and restart typing animation
    resetTypingAnimation(); // Uses local function, ensure it works
  }

  // Expose setRole to global scope so inline onclick works
  window.setRole = setRole;
  window.portfolioSetRole = setRole; // Alias just in case


  // 3. Typing Animation Logic
  // ==========================================
  function resetTypingAnimation() {
    if (typingElement) {
      // Clear existing timeout
      if (typeTimeout) clearTimeout(typeTimeout);

      // Reset state
      typingElement.textContent = '';
      charIndex = 0;
      isDeleting = false;
      roleIndex = 0;

      // Restart animation
      type();
    }
  }

  function type() {
    if (!typingElement) return;

    const roles = roleSpecificTitles[currentTypingRole] || roleSpecificTitles['aiml'];
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    typeTimeout = setTimeout(type, typingSpeed);
  }

  // 4. Input Handling & Event Listeners
  // ==========================================

  // Initialize on page load
  let savedRole = 'aiml';
  try {
    savedRole = localStorage.getItem('portfolioRole') || 'aiml';
  } catch (e) {
    console.warn('LocalStorage access denied during init', e);
  }
  // Ensure we start with a valid role from the list
  const validRole = ['aiml', 'backend'].includes(savedRole) ? savedRole : 'aiml';
  setRole(validRole);

  // Role Button Click Handlers
  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent accidental form submission or navigation
      const role = btn.dataset.role;
      console.log('Role button clicked:', role);
      setRole(role);
    });
  });

  // Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
      });
    });
  }

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for Fade-in Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Footer Year
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  console.log('Portfolio loaded successfully! 🚀');

}); // End DOMContentLoaded

// LinkedIn badge script outside (runs on load)
window.addEventListener('load', () => {
  const script = document.createElement('script');
  script.src = 'https://platform.linkedin.com/badges/js/profile.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
});
