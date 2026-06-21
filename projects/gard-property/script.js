// Client: [Client Name]
// Project: [Project Name]
// Description: [Description]

// ─── ALWAYS-ON SETUP ────────────────────────────────────────────────────────

gsap.registerPlugin(SplitText, ScrollTrigger, CustomEase);

CustomEase.create('reveal', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create("osmo", "M0,0 C0.625,0.05 0,1 1,1");
CustomEase.create("energy", "M0,0 C0.32,0.72 0,1 1,1");
CustomEase.create("smooth", "M0,0 C0.38,0.005 0.215,1 1,1");
CustomEase.create("punch", "M0,0 C0.19,1 0.22,1 1,1");
CustomEase.create("relaxed", "M0,0 C0.7,0 0.3,1 1,1");
CustomEase.create("expo.inOut", "M0,0 C0.87,0 0.13,1 1,1");
CustomEase.create("jump", "M0,0 C0.35,1.5 0.6,1 1,1");
CustomEase.create("pop", "M0,0 C0.17,0.67 0.3,1.33 1,1");

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// ─── INIT ────────────────────────────────────────────────────────────────────
// Each init is guarded — only runs if its trigger element exists on the page.

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-example]'))             initExample();
  if (document.querySelector('[proj-item-wrap]'))           initProjItemHover();
  if (document.querySelector('.hamburger_5_wrap'))          initHamburgerMenu();
  if (document.querySelector('.second_nav'))                initNav();
  if (document.querySelector('[data-button-animate-chars]')) initButtonCharacterStagger();
  if (document.querySelector('[data-parallax="trigger"]'))  initGlobalParallax();
  if (document.querySelector('.cursor'))                    initDynamicCustomTextCursor();
  if (document.querySelector('[data-footer-parallax]'))     initFooterParallax();
  if (document.querySelector('[data-sticky-feature-wrap]')) initStickyFeatures();
  if (document.querySelector('.primary-item'))              initDetailSystem();
  if (document.querySelector('[data-form-validate]'))       initBasicFormValidation();

});


// ─── FUNCTIONS ───────────────────────────────────────────────────────────────

// EXAMPLE //
function initExample() {
  // ...
}

// PROJECT ITEM HOVER //
function initProjItemHover() {
  document.querySelectorAll('[proj-item-wrap]').forEach((wrap) => {
    const img = wrap.querySelector('[proj-img]');
    const line = wrap.querySelector('[proj-line]');

    const tl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: 'smooth' } });
    if (img)  tl.fromTo(img,  { scale: 1 },        { scale: 1.05 }, 0);
    if (line) tl.fromTo(line, { width: '0%' },     { width: '100%' }, 0);

    wrap.addEventListener('mouseenter', () => tl.play());
    wrap.addEventListener('mouseleave', () => tl.reverse());
  });
}

// HAMBURGER MENU //
function initHamburgerMenu() {
  const hamburgers = document.querySelectorAll('.hamburger_5_wrap');

  hamburgers.forEach((hamburger) => {
    hamburger.addEventListener('click', () => {
      const navParent = hamburger.closest('.first_nav, .second_nav');
      if (!navParent) return;

      const isActive = hamburger.classList.toggle('is-active');

      if (!navParent.dataset.originalThemeChecked) {
        navParent.dataset.hadDarkTheme = navParent.classList.contains('u-theme-dark');
        navParent.dataset.originalThemeChecked = 'true';
      }

      if (isActive) {
        navParent.classList.add('u-theme-dark');
        document.body.style.overflow = 'hidden';
      } else {
        if (navParent.dataset.hadDarkTheme === 'true') {
          navParent.classList.add('u-theme-dark');
        } else {
          navParent.classList.remove('u-theme-dark');
        }
        document.body.style.overflow = '';
      }
    });
  });
}

// NAV //
function initNav() {
  const secondNav = document.querySelector('.second_nav');
  if (!secondNav) return;

  const heroSection = document.querySelector('[hero-section]');
  const secondSection = document.querySelector('[second-section]');

  gsap.set(secondNav, { yPercent: -110, autoAlpha: 0, overwrite: true });
  gsap.set(secondNav, { autoAlpha: 1 });
  secondNav.style.visibility = 'visible';

  const showSecondNav = () =>
    gsap.to(secondNav, { yPercent: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });

  const hideSecondNav = () =>
    gsap.to(secondNav, { yPercent: -110, duration: 0.6, ease: 'power3.in', overwrite: 'auto' });

  if (secondSection) {
    ScrollTrigger.create({
      trigger: secondSection,
      start: 'top top',
      onEnter: showSecondNav,
      onEnterBack: showSecondNav,
    });
  }

  if (heroSection) {
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      onEnter: hideSecondNav,
      onEnterBack: hideSecondNav,
    });
  }

  const setNavTheme = (isDarkSection) => {
    secondNav.classList.remove('u-theme-dark', 'u-theme-light');
    secondNav.classList.add(isDarkSection ? 'u-theme-light' : 'u-theme-dark');
  };

  document.querySelectorAll('.u-theme-dark, .u-theme-light').forEach((section) => {
    if (section === heroSection) return;

    const isDarkSection = section.classList.contains('u-theme-dark');

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      onEnter: () => setNavTheme(isDarkSection),
      onEnterBack: () => setNavTheme(isDarkSection),
    });
  });

  ScrollTrigger.refresh();
}

// BUTTON ANIMATION //
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01;
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach((button) => {
    const text = button.textContent;
    button.innerHTML = '';

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      if (char === ' ') {
        span.style.whiteSpace = 'pre';
      }

      button.appendChild(span);
    });
  });
}

// GLOBAL PARALLAX //
function initGlobalParallax() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: '(max-width:479px)',
      isMobileLandscape: '(max-width:767px)',
      isTablet: '(max-width:991px)',
      isDesktop: '(min-width:992px)',
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions;

      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
          const disable = trigger.getAttribute('data-parallax-disable');

          if (
            (disable === 'mobile' && isMobile) ||
            (disable === 'mobileLandscape' && isMobileLandscape) ||
            (disable === 'tablet' && isTablet)
          ) {
            return;
          }

          const target = trigger.querySelector('[data-parallax="target"]') || trigger;
          const direction = trigger.getAttribute('data-parallax-direction') || 'vertical';
          const prop = direction === 'horizontal' ? 'xPercent' : 'yPercent';

          const scrubAttr = trigger.getAttribute('data-parallax-scrub');
          const scrub = scrubAttr ? parseFloat(scrubAttr) : true;

          const startAttr = trigger.getAttribute('data-parallax-start');
          const startVal = startAttr !== null ? parseFloat(startAttr) : 20;

          const endAttr = trigger.getAttribute('data-parallax-end');
          const endVal = endAttr !== null ? parseFloat(endAttr) : -20;

          const scrollStartRaw =
            trigger.getAttribute('data-parallax-scroll-start') || 'top bottom';
          const scrollStart = `clamp(${scrollStartRaw})`;

          const scrollEndRaw =
            trigger.getAttribute('data-parallax-scroll-end') || 'bottom top';
          const scrollEnd = `clamp(${scrollEndRaw})`;

          gsap.fromTo(
            target,
            { [prop]: startVal },
            {
              [prop]: endVal,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: scrollStart,
                end: scrollEnd,
                scrub,
              },
            }
          );
        });
      });

      return () => ctx.revert();
    }
  );
}

// CURSOR //
function initDynamicCustomTextCursor() {
  const cursorItem = document.querySelector('.cursor');
  const cursorParagraph = cursorItem.querySelector('p');

  const targets = document.querySelectorAll('[data-cursor]');

  const xOffset = 6;
  const yOffset = 140;

  let currentTarget = null;
  let lastText = '';

  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  const xTo = gsap.quickTo(cursorItem, 'x', { ease: 'power3' });
  const yTo = gsap.quickTo(cursorItem, 'y', { ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    const scrollY = window.scrollY;
    const cursorX = e.clientX;
    const cursorY = e.clientY + scrollY;

    if (currentTarget) {
      const newText = currentTarget.getAttribute('data-cursor');
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    }

    gsap.to(cursorItem, {
      xPercent: xOffset,
      yPercent: yOffset,
      duration: 0.9,
      ease: 'power3',
    });

    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  targets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      currentTarget = target;

      const newText = target.getAttribute('data-cursor');
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    });
  });
}

// FOOTER PARALLAX //
function initFooterParallax() {
  document.querySelectorAll('[data-footer-parallax]').forEach((el) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'clamp(top bottom)',
        end: 'clamp(top top)',
        scrub: true,
      },
    });

    const inner = el.querySelector('[data-footer-parallax-inner]');
    const dark = el.querySelector('[data-footer-parallax-dark]');

    if (inner) {
      tl.from(inner, { yPercent: -25, ease: 'linear' });
    }

    if (dark) {
      tl.from(dark, { opacity: 0.5, ease: 'linear' }, '<');
    }
  });
}

// STICKY FEATURES //
function initStickyFeatures(root) {
  const wraps = Array.from((root || document).querySelectorAll('[data-sticky-feature-wrap]'));
  if (!wraps.length) return;

  wraps.forEach((w) => {
    const visualWraps = Array.from(w.querySelectorAll('[data-sticky-feature-visual-wrap]'));
    const items = Array.from(w.querySelectorAll('[data-sticky-feature-item]'));
    const progressBar = w.querySelector('[data-sticky-feature-progress]');

    if (visualWraps.length !== items.length) {
      console.warn('[initStickyFeatures] visualWraps and items count do not match:', {
        visualWraps: visualWraps.length,
        items: items.length,
        wrap: w,
      });
    }

    const count = Math.min(visualWraps.length, items.length);
    if (count < 1) return;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = rm ? 0.01 : 0.75; // If user prefers reduced motion, reduce duration
    const EASE = 'power4.inOut';
    const SCROLL_AMOUNT = 0.9; // % of scroll used for step transitions

    const getTexts = (el) => Array.from(el.querySelectorAll('[data-sticky-feature-text]'));

    if (visualWraps[0]) gsap.set(visualWraps[0], { clipPath: 'inset(0% round 0em)' });
    gsap.set(items[0], { autoAlpha: 1 });

    let currentIndex = 0;

    // Transition Function
    function transition(fromIndex, toIndex) {
      if (fromIndex === toIndex) return;
      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

      if (fromIndex < toIndex) {
        tl.to(visualWraps[toIndex], {
          clipPath: 'inset(0% round 0em)',
          duration: DURATION,
          ease: EASE,
        }, 0);
      } else {
        tl.to(visualWraps[fromIndex], {
          clipPath: 'inset(50% round 0em)',
          duration: DURATION,
          ease: EASE,
        }, 0);
      }
      animateOut(items[fromIndex]);
      animateIn(items[toIndex]);
    }

    // Fade out text content items
    function animateOut(itemEl) {
      const texts = getTexts(itemEl);
      gsap.to(texts, {
        autoAlpha: 0,
        y: -30,
        ease: 'power4.out',
        duration: 0.4,
        onComplete: () => gsap.set(itemEl, { autoAlpha: 0 }),
      });
    }

    // Reveal incoming text content items
    function animateIn(itemEl) {
      const texts = getTexts(itemEl);
      gsap.set(itemEl, { autoAlpha: 1 });
      gsap.fromTo(texts, {
        autoAlpha: 0,
        y: 30,
      }, {
        autoAlpha: 1,
        y: 0,
        ease: 'power4.out',
        duration: DURATION,
        stagger: 0.1,
      });
    }

    const steps = Math.max(1, count - 1);

    ScrollTrigger.create({
      trigger: w,
      start: 'center center',
      end: () => `+=${steps * 100}%`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = Math.min(self.progress, SCROLL_AMOUNT) / SCROLL_AMOUNT;
        let idx = Math.floor(p * steps + 1e-6);
        idx = Math.max(0, Math.min(steps, idx));

        gsap.to(progressBar, {
          scaleX: p,
          ease: 'none',
        });

        if (idx !== currentIndex) {
          transition(currentIndex, idx);
          currentIndex = idx;
        }
      },
    });
  });
}

// DETAIL SYSTEM //
function initDetailSystem() {
  console.log('✅ Detail system initializing...');

  const primaryItems = document.querySelectorAll('.primary-item');
  const detailItems = document.querySelectorAll('.detail-item');

  console.log('Primary items found:', primaryItems.length);
  console.log('Detail items found:', detailItems.length);

  if (!primaryItems.length || !detailItems.length) {
    console.warn('❌ Missing primary or detail items.');
    return;
  }

  primaryItems.forEach((primary) => {
    primary.addEventListener('click', () => {
      const slug = primary.getAttribute('data-detail-id');

      console.log('🖱 Clicked slug:', slug);

      if (!slug) {
        console.warn('⚠ No slug found.');
        return;
      }

      const matchingDetail = document.querySelector(
        `.detail-item[data-detail-id="${slug}"]`
      );

      if (!matchingDetail) {
        console.warn('❌ No matching detail found.');
        return;
      }

      // Remove active from ALL details
      detailItems.forEach((item) => {
        item.classList.remove('is-active');
      });

      // Add active to matching detail
      matchingDetail.classList.add('is-active');

      console.log('✨ Activated detail:', slug);
    });
  });

  console.log('🚀 Detail system ready.');
}

// FORM VALIDATION //
function initBasicFormValidation() {
  const forms = document.querySelectorAll('[data-form-validate]');

  forms.forEach((form) => {
    const fields = form.querySelectorAll('[data-validate] input, [data-validate] textarea');
    const submitButtonDiv = form.querySelector('[data-submit]'); // The div wrapping the submit button
    const submitInput = submitButtonDiv.querySelector('input[type="submit"]'); // The actual submit button

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest('[data-validate]'); // Get the parent div
      const minLength = field.getAttribute('min');
      const maxLength = field.getAttribute('max');
      const type = field.getAttribute('type');
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== '') {
        parent.classList.add('is--filled');
      } else {
        parent.classList.remove('is--filled');
      }

      // Validation logic for min and max length
      if (minLength && field.value.length < minLength) {
        isValid = false;
      }

      if (maxLength && field.value.length > maxLength) {
        isValid = false;
      }

      // Validation logic for email input type
      if (type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove('is--error');
        parent.classList.add('is--success');
      } else {
        parent.classList.remove('is--success');
        parent.classList.add('is--error');
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener('input', function () {
        validateField(field);
      });
    };

    // Function to validate and start live validation for all fields, focusing on the first field with an error
    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) {
          firstInvalidField = field; // Track the first invalid field
        }
        if (!valid) {
          allValid = false;
        }
        startLiveValidation(field); // Start live validation for all fields
      });

      // If there is an invalid field, focus on the first one
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    };

    // Anti-spam: Check if form was filled too quickly
    const isSpam = () => {
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - formLoadTime) / 1000; // Convert milliseconds to seconds
      return timeDifference < 5; // Return true if form is filled within 5 seconds
    };

    // Handle clicking the custom submit button
    submitButtonDiv.addEventListener('click', function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert('Form submitted too quickly. Please try again.');
          return; // Stop form submission
        }
        submitInput.click(); // Simulate a click on the <input type="submit">
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert('Form submitted too quickly. Please try again.');
            return; // Stop form submission
          }
          submitInput.click(); // Trigger our custom form submission
        }
      }
    });
  });
}
