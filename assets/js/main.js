/* ============================================================
   CosmicSmiles Dental — main.js
   ============================================================ */

(function () {
  'use strict';

  /* --- 1. HAMBURGER TOGGLE --- */
  var header = document.getElementById('site-header');
  var hamburger = document.getElementById('hamburger');

  if (hamburger && header) {
    hamburger.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link inside it is clicked (mobile)
    var navLinks = document.querySelectorAll('.site-nav a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- 2. SCROLL HEADER SHADOW --- */
  if (header) {
    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  /* --- 3. FAQ ACCORDION --- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isActive = item.classList.contains('active');
      // Close all open items
      faqItems.forEach(function (other) {
        other.classList.remove('active');
      });
      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- 4. BLOG READ-MORE TOGGLE --- */
  var blogPosts = document.querySelectorAll('.blog-post');
  blogPosts.forEach(function (post) {
    var toggle = post.querySelector('.post-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var expanded = post.classList.toggle('expanded');
      toggle.textContent = expanded ? 'Show Less ↑' : 'Read More ↓';
    });
  });


  /* --- 5. HERO SLIDESHOW --- */
  var heroSlides = document.querySelectorAll('.hero__slide');
  if (heroSlides.length > 1) {
    var slideIndex = 0;
    setInterval(function () {
      heroSlides[slideIndex].classList.remove('hero__slide--active');
      slideIndex = (slideIndex + 1) % heroSlides.length;
      heroSlides[slideIndex].classList.add('hero__slide--active');
    }, 5000); // crossfade every 5 seconds
  }


  /* --- 6. iOS RADIO BUTTON FIX --- */
  /* iOS Safari sometimes blocks radio input selection — force it via touch event */
  document.querySelectorAll('.radio-item').forEach(function(item) {
    item.addEventListener('touchend', function(e) {
      e.preventDefault();
      var input = item.querySelector('input[type="radio"]');
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

})();
