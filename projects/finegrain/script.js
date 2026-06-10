// -----------------------------------------
// QUAGLIO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(CustomEase);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", e => (reducedMotion = e.matches));
rmMQ.addListener?.(e => (reducedMotion = e.matches));

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("osmo", "M0,0 C0.625,0.05 0,1 1,1");
gsap.defaults({ ease: "osmo", duration: durationDefault });

// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  // Runs once on first load
  // if (has('[data-something]')) initSomething();
  if (document.querySelector('[form-open]')) initFormModal();
  if (document.querySelector('[data-form-validate]')) initSuperformValidation();
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;

  // Runs before the enter animation
  // if (has('[data-something]')) initSomething();
}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  // Runs after enter animation completes
  // if (has('[data-something]')) initSomething();
  if (has('[data-accordion-css-init]')) initAccordionCSS();
  if (has('[data-parallax="trigger"]')) initGlobalParallax();
  if (has('.img')) initImageFadeIns();
  if (has('[data-hero-parallax]')) initHeroParallax();
  if (has('[data-slideshow="wrap"]')) initFadeScaleSlideshows();
  if (has('.team-item')) initTeamHover();
  if (has('[section-dark]') || has('[section-light]')) initNavThemeSwitch();

  if (hasLenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();

  tl.call(() => {
    resetPage(next);
  }, null, 0);

  return tl;
}

function runPageLeaveAnimation(current, next) {

  const tl = gsap.timeline({
    onComplete: () => {
      current.remove();
    }
  })

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    return tl.set(current, { autoAlpha: 0 });
  }

  tl.to(current, {
    autoAlpha: 0,
    ease: "power1.in",
    duration: 0.75,
  }, 0);

  return tl;
}

function runPageEnterAnimation(next) {
  const tl = gsap.timeline();

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady")
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }

  tl.add("startEnter", 0);

  tl.fromTo(next, {
    autoAlpha: 0,
  }, {
    autoAlpha: 1,
    ease: "power1.inOut",
    duration: 1.75,
  }, "startEnter");

  tl.fromTo(next.querySelector('h1'), {
    yPercent: 25,
    autoAlpha: 0,
  }, {
    yPercent: 0,
    autoAlpha: 1,
    ease: "expo.out",
    duration: 2,
  }, "< 0.3");

  tl.add("pageReady");
  tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, null, "pageReady");
  });
}

// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

barba.hooks.beforeEnter(data => {
  // Position new container on top
  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
  });

  if (lenis && typeof lenis.stop === "function") {
    lenis.stop();
  }

  initBeforeEnterFunctions(data.next.container);
  applyThemeFrom(data.next.container);
});

barba.hooks.afterLeave(() => {
  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});

barba.hooks.enter(data => {
  initBarbaNavUpdate(data);
})

barba.hooks.afterEnter(data => {
  // Run page functions
  initAfterEnterFunctions(data.next.container);

  // Settle
  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
});

barba.init({
  debug: true, // Set to 'false' in production
  timeout: 7000,
  preventRunning: true,
  transitions: [
  {
    name: "default",
    sync: true,

    // First load
    async once(data) {
      initOnceFunctions();
      initAfterEnterFunctions(data.next.container);

      return runPageOnceAnimation(data.next.container);
    },

    // Current page leaves
    async leave(data) {
      return runPageLeaveAnimation(data.current.container, data.next.container);
    },

    // New page enters
    async enter(data) {
      return runPageEnterAnimation(data.next.container);
    }
  }],
});

// -----------------------------------------
// GENERIC + HELPERS
// -----------------------------------------

const themeConfig = {
  light: {
    nav: "dark",
    transition: "light"
  },
  dark: {
    nav: "light",
    transition: "dark"
  }
};

function applyThemeFrom(container) {
  const pageTheme = container?.dataset?.pageTheme || "light";
  const config = themeConfig[pageTheme] || themeConfig.light;

  document.body.dataset.pageTheme = pageTheme;
  const transitionEl = document.querySelector('[data-theme-transition]');
  if (transitionEl) {
    transitionEl.dataset.themeTransition = config.transition;
  }

  const nav = document.querySelector('[data-theme-nav]');
  if (nav) {
    nav.dataset.themeNav = config.nav;
  }
}

function initLenis() {
  if (lenis) return; // already created
  if (!hasLenis) return;

  lenis = new Lenis({
    lerp: 0.165,
    wheelMultiplier: 1.25,
  });

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function resetPage(container) {
  window.scrollTo(0, 0);
  gsap.set(container, { clearProps: "position,top,left,right" });

  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }
}

function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

function initBarbaNavUpdate(data) {
  var tpl = document.createElement('template');
  tpl.innerHTML = data.next.html.trim();
  var nextNodes = tpl.content.querySelectorAll('[data-barba-update]');
  var currentNodes = document.querySelectorAll('nav [data-barba-update]');

  currentNodes.forEach(function (curr, index) {
    var next = nextNodes[index];
    if (!next) return;

    // Aria-current sync
    var newStatus = next.getAttribute('aria-current');
    if (newStatus !== null) {
      curr.setAttribute('aria-current', newStatus);
    } else {
      curr.removeAttribute('aria-current');
    }

    // Class list sync
    var newClassList = next.getAttribute('class') || '';
    curr.setAttribute('class', newClassList);
  });
}

// -----------------------------------------
// YOUR FUNCTIONS GO BELOW HERE
// -----------------------------------------
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' :
        'active');

      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((
          sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status',
            'not-active');
        });
      }
    });
  });
}

function initGlobalParallax() {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions

      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
          // Check if this trigger has to be disabled on smaller breakpoints
          const disable = trigger.getAttribute("data-parallax-disable")
          if (
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet)
          ) {
            return
          }

          // Optional: you can target an element inside a trigger if necessary 
          const target = trigger.querySelector('[data-parallax="target"]') || trigger

          // Get the direction value to decide between xPercent or yPercent tween
          const direction = trigger.getAttribute("data-parallax-direction") || "vertical"
          const prop = direction === "horizontal" ? "xPercent" : "yPercent"

          // Get the scrub value, our default is 'true' because that feels nice with Lenis
          const scrubAttr = trigger.getAttribute("data-parallax-scrub")
          const scrub = scrubAttr ? parseFloat(scrubAttr) : true

          // Get the start position in % 
          const startAttr = trigger.getAttribute("data-parallax-start")
          const startVal = startAttr !== null ? parseFloat(startAttr) : 20

          // Get the end position in %
          const endAttr = trigger.getAttribute("data-parallax-end")
          const endVal = endAttr !== null ? parseFloat(endAttr) : -20

          // Get the start value of the ScrollTrigger
          const scrollStartRaw = trigger.getAttribute("data-parallax-scroll-start") ||
            "top bottom"
          const scrollStart = `clamp(${scrollStartRaw})`

          // Get the end value of the ScrollTrigger  
          const scrollEndRaw = trigger.getAttribute("data-parallax-scroll-end") ||
            "bottom top"
          const scrollEnd = `clamp(${scrollEndRaw})`

          gsap.fromTo(
            target, {
              [prop]: startVal
            },
            {
              [prop]: endVal,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: scrollStart,
                end: scrollEnd,
                scrub,
              },
            }
          )
        })
      })

      return () => ctx.revert()
    }
  )
}

function initImageFadeIns(scope = document) {
  const images = scope.querySelectorAll(".img");

  images.forEach((img) => {
    gsap.fromTo(
      img,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1.6, // slower
        ease: "smoothReveal", // custom ease
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });
}

function initHeroParallax() {
  document.querySelectorAll("[data-hero-parallax]").forEach(el => {
    const inner = el.querySelector("[data-hero-parallax-inner]");
    const dark = el.querySelector("[data-hero-parallax-dark]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top top)",
        end: "clamp(bottom top)",
        scrub: true
      }
    });

    if (inner) {
      tl.to(inner, {
        yPercent: 25,
        ease: "linear"
      });
    }

    if (dark) {
      tl.to(dark, {
        opacity: 0.5,
        ease: "linear"
      }, "<");
    }
  });
}

// Form modal ([form-open] / [form-wrap]) — ported from inquiry-atelier
function initFormModal() {
  const openers = document.querySelectorAll("[form-open]");
  const wrap    = document.querySelector("[form-wrap]");
  if (!wrap) return;

  const inner   = wrap.querySelector("[form-inner]");
  const bg      = wrap.querySelector("[form-bg]");
  const closers = wrap.querySelectorAll("[form-close]");
  if (!inner) { console.error("❌ Form modal: [form-inner] not found inside [form-wrap]"); return; }
  if (!bg)    { console.error("❌ Form modal: [form-bg] not found inside [form-wrap]"); return; }

  gsap.set(wrap,  { display: "flex", autoAlpha: 0, pointerEvents: "none" });
  gsap.set(bg,    { autoAlpha: 0 });
  gsap.set(inner, { x: "100%" });

  function openForm() {
    gsap.set(wrap, { autoAlpha: 1, pointerEvents: "auto" });
    const tl = gsap.timeline();
    tl.to(bg, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0)
      .to(inner, { x: "0%", duration: 0.65, ease: "power3.out" }, "-=0.15");
  }

  function closeForm() {
    const tl = gsap.timeline({
      onComplete: () => gsap.set(wrap, { autoAlpha: 0, pointerEvents: "none" }),
    });
    tl.to(inner, { x: "100%", duration: 0.5, ease: "power3.in" }, 0)
      .to(bg, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.1);
  }

  openers.forEach((el) => el.addEventListener("click", openForm));
  closers.forEach((el) => el.addEventListener("click", closeForm));
  bg.addEventListener("click", closeForm);

  // Highlight the selected radio's label
  wrap.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      wrap
        .querySelectorAll(`input[type="radio"][name="${radio.name}"]`)
        .forEach((r) => {
          const text = r.closest("label")?.querySelector(".w-form-label");
          if (text) text.style.color = "";
        });
      const text = radio.closest("label")?.querySelector(".w-form-label");
      if (text) text.style.color = "white";
    });
  });
}

// -----------------------------------------
// SUPERFORM STEP VALIDATION (visual labeling)
// -----------------------------------------
// Superform already BLOCKS advancing when a step has invalid fields — it just
// does it silently. This layer adds the visual feedback: it marks each field's
// wrapper with is--filled / is--error / is--success and focuses the first
// invalid field whenever the user clicks a "Next" (forward sf-goto) or Submit.
// Rules mirror Superform's (required + native type), so the two stay in sync.
//
// Webflow markup contract (add these in the Designer for this to take effect):
//   • [data-form-validate] on the form/step container (the same [sf] element).
//   • [data-validate]      on each field wrapper (e.g. .text_wrap_from).
//   • Optional icons inside a wrapper: .form-field-icon.is--error /
//     .form-field-icon.is--success (toggled via the wrapper's state class).
function initSuperformValidation() {
  const form = document.querySelector('[data-form-validate]');
  if (!form) return;

  // Superform STRIPS the native `required` attribute when it initialises (it
  // tracks required-ness internally and silently blocks the step, but leaves no
  // marker on the field). This script runs before Superform inits, so snapshot
  // required-ness now into data-sf-required while the attribute still exists —
  // otherwise we'd never know which empty fields to flag.
  form.querySelectorAll('input, select, textarea').forEach((f) => {
    if (f.hasAttribute('required')) f.dataset.sfRequired = 'true';
  });

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // A phone is "real" if it contains ONLY digits and the usual separators
  // ( + ( ) - . / and spaces ) and has at least this many actual digits.
  // type="tel" has no native validation, so this is what rejects "call me maybe".
  const PHONE_MIN_DIGITS = 6;
  const isPhone = (v) =>
    /^[\d\s()+\-./]*$/.test(v) && (v.match(/\d/g) || []).length >= PHONE_MIN_DIGITS;

  // Validate one [data-validate] group. Handles three shapes:
  //   • radio/checkbox group  → wrap the inputs in [data-radiocheck-group] (min/max)
  //   • <select>              → invalid if no real option chosen
  //   • input / textarea      → required, email, pattern, min/max length
  // Toggles is--filled / is--error / is--success on the group and returns validity.
  const validateGroup = (group) => {
    const radioGroup = group.querySelector('[data-radiocheck-group]');

    if (radioGroup) {
      const inputs  = radioGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
      const checked = radioGroup.querySelectorAll('input:checked');
      const min = parseInt(radioGroup.getAttribute('min'), 10) || 1;
      const max = parseInt(radioGroup.getAttribute('max'), 10) || inputs.length;
      const isRadio = inputs[0] && inputs[0].type === 'radio';
      const isValid = isRadio
        ? checked.length >= 1
        : checked.length >= min && checked.length <= max;

      group.classList.toggle('is--filled', checked.length > 0);
      group.classList.toggle('is--error', !isValid);
      group.classList.toggle('is--success', isValid);
      return isValid;
    }

    const field = group.querySelector('input, select, textarea');
    if (!field) return true; // nothing to validate in this group

    const value    = field.value.trim();
    const tag      = field.tagName.toLowerCase();
    const type     = (field.getAttribute('type') || tag).toLowerCase();
    const required = field.hasAttribute('required') || field.dataset.sfRequired === 'true';
    const minLen   = parseInt(field.getAttribute('minlength') || field.getAttribute('min'), 10);
    const maxLen   = parseInt(field.getAttribute('maxlength') || field.getAttribute('max'), 10);
    const pattern  = field.getAttribute('pattern'); // native HTML pattern, e.g. phone

    let isValid = true;
    if (tag === 'select') {
      if (value === '' || value === 'disabled' || value === 'null' || value === 'false') isValid = false;
    } else {
      if (required && value === '') isValid = false;
      if (value !== '') {
        if (!isNaN(minLen) && value.length < minLen) isValid = false;
        if (!isNaN(maxLen) && value.length > maxLen) isValid = false;
        if (type === 'email' && !isEmail(value)) isValid = false;
        if (type === 'tel'   && !isPhone(value)) isValid = false;
        // Native pattern is an implicit full-string match, so anchor it.
        if (pattern) {
          try {
            if (!new RegExp('^(?:' + pattern + ')$').test(value)) isValid = false;
          } catch (e) { /* invalid pattern attr — ignore */ }
        }
      }
    }

    group.classList.toggle('is--filled', value !== '');
    group.classList.toggle('is--error', !isValid);
    group.classList.toggle('is--success', isValid && value !== '');
    return isValid;
  };

  // Live re-validation, only switched on once a group has been checked
  // (so untouched fields don't flash red before the user tries to advance).
  const liveBound = new WeakSet();
  const startLive = (group) => {
    if (liveBound.has(group)) return;
    liveBound.add(group);
    group.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input',  () => validateGroup(group));
      el.addEventListener('change', () => validateGroup(group));
    });
  };

  const validateStep = (stepEl) => {
    let allValid = true;
    let firstInvalid = null;
    stepEl.querySelectorAll('[data-validate]').forEach((group) => {
      const ok = validateGroup(group);
      startLive(group);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = group.querySelector('input, select, textarea');
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return allValid;
  };

  // Delegated on the document in the CAPTURE phase: Superform adds/rewrites its
  // own sf-goto buttons after we init (4 → 7 on this form), so binding to each
  // node directly is unreliable. Capture also guarantees we run before
  // Superform's own click handler. We only label — Superform stays the gate.
  const isForward = (el) => {
    const t = (el.getAttribute('sf-goto') || '').toLowerCase();
    return !(t === 'back' || t === 'prev' || t === 'previous' || t.startsWith('-'));
  };

  document.addEventListener('click', (e) => {
    const trigger =
      e.target.closest('[sf-goto]') || e.target.closest('input[type="submit"]');
    if (!trigger || !form.contains(trigger)) return;
    if (trigger.hasAttribute('sf-goto') && !isForward(trigger)) return; // back/prev
    const step = trigger.closest('[sf-step]');
    if (!step) return;
    // Validate synchronously so we can gate the step ourselves. If anything is
    // invalid we block here: Superform never runs, so it can neither advance nor
    // re-render away our error classes. (type="tel" has no native rule, so this
    // is the ONLY thing stopping a non-number phone.) If valid, we let Superform
    // take over and handle the navigation.
    if (!validateStep(step)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
}

function initFadeScaleSlideshows(scope = document) {

  const sliders = scope.querySelectorAll('[data-slideshow="wrap"]');

  sliders.forEach((el) => {

    if (el._sliderInit) return;
    el._sliderInit = true;

    const slides = Array.from(el.querySelectorAll('[data-slideshow="slide"]'));
    if (!slides.length) return;

    const getInner = (slide) =>
      slide.querySelector('[data-slideshow="parallax"]') || slide;

    const hold = parseFloat(el.getAttribute("data-slideshow-duration")) || 2;
    const crossfade = 0.8;
    const overlap = 0.75;
    const scaleAmount = 1.05;

    const fadeInLead = crossfade * overlap;

    slides.forEach((slide, i) => {
      gsap.set(slide, {
        opacity: i === 0 ? 1 : 0,
        zIndex: i === 0 ? 2 : 1
      });

      gsap.set(getInner(slide), {
        scale: 1,
        transformOrigin: "50% 50%"
      });
    });

    let current = 0;

    function startZoom(slide) {

      const inner = getInner(slide);

      if (inner._zoomTween) inner._zoomTween.kill();

      gsap.set(inner, { scale: 1 });

      inner._zoomTween = gsap.to(inner, {
        scale: scaleAmount,
        duration: hold + crossfade,
        ease: "none"
      });

    }

    startZoom(slides[current]);

    function cycle() {

      const fromIndex = current;
      const toIndex = (current + 1) % slides.length;

      const fromSlide = slides[fromIndex];
      const toSlide = slides[toIndex];

      const fromInner = getInner(fromSlide);

      gsap.set(fromSlide, { zIndex: 1 });
      gsap.set(toSlide, { zIndex: 2, opacity: 0 });

      const fadeInStart = Math.max(0, hold - fadeInLead);
      const fadeOutStart = hold;

      gsap.timeline({

          onComplete: () => {

            if (fromInner._zoomTween) {
              fromInner._zoomTween.kill();
              fromInner._zoomTween = null;
            }

            gsap.set(fromInner, { scale: 1 });

            current = toIndex;

            cycle();

          }

        })

        .call(() => startZoom(toSlide), null, fadeInStart)

        .to(toSlide, {
          opacity: 1,
          duration: crossfade,
          ease: "osmo"
        }, fadeInStart)

        .to(fromSlide, {
          opacity: 0,
          duration: crossfade,
          ease: "osmo"
        }, fadeOutStart);

    }

    cycle();

  });

}

// -----------------------------------------
// TEAM HOVER
// -----------------------------------------
function initTeamHover() {
  nextPage.querySelectorAll(".team-item").forEach((item) => {
    const img = item.querySelector(".img-team-top");
    if (!img) return;

    const tl = gsap.timeline({ paused: true })
      .fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1.25, ease: "osmo" });

    item.addEventListener("mouseenter", () => tl.play());
    item.addEventListener("mouseleave", () => tl.reverse());
  });
}

// -----------------------------------------
// NAV THEME SWITCH (scroll-driven)
// -----------------------------------------
// As each section scrolls behind the fixed nav, recolour the nav to stay
// legible against it. Sections opt in with one attribute:
//   • [section-dark]  → white nav text, inverted [nav-logo]
//   • [section-light] → black nav text, un-inverted [nav-logo]
// The active section is whichever one currently sits under the nav line; the
// nav holds its last theme across any gaps (sections with neither attribute).
function initNavThemeSwitch() {
  if (!hasScrollTrigger) return;

  const navWrap = document.querySelector('[nav-wrap]');
  if (!navWrap) return;
  const navLogo = navWrap.querySelector('[nav-logo]') || document.querySelector('[nav-logo]');

  // Ensure the logo has a filter GSAP can tween from (invert(0) = untouched).
  if (navLogo) gsap.set(navLogo, { filter: 'invert(0)' });

  let currentTheme = null;
  const applyTheme = (theme) => {
    if (theme === currentTheme) return; // already there — skip redundant tweens
    currentTheme = theme;
    const isDark = theme === 'dark';

    gsap.to(navWrap, {
      color: isDark ? '#fff' : '#000',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (navLogo) {
      gsap.to(navLogo, {
        filter: isDark ? 'invert(1)' : 'invert(0)',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  // Fire the switch when a section reaches the vertical middle of the nav, so
  // the colour flips as the section visually meets the nav rather than the very
  // top of the viewport.
  const navOffset = Math.round(navWrap.getBoundingClientRect().height / 2) || 0;

  document.querySelectorAll('[section-dark], [section-light]').forEach((section) => {
    const theme = section.hasAttribute('section-dark') ? 'dark' : 'light';

    ScrollTrigger.create({
      trigger: section,
      start: `top top+=${navOffset}`,
      end: `bottom top+=${navOffset}`,
      onToggle: (self) => {
        if (self.isActive) applyTheme(theme);
      },
    });
  });
}

