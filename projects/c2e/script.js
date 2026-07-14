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
  if (document.querySelector('[data-example]'))        initExample();
  if (document.querySelector('[preload-bg]'))          initPreload();
  if (document.querySelector('[data-reveal]'))         initReveal();
  if (document.querySelector('[data-reveal-fade]'))    initRevealClip();
  if (document.querySelector('.img:not(.no-para)'))    initImageParallax();
  if (document.querySelector('[form-open]'))           initFormModal();
  if (document.querySelector('[data-form-validate]'))  initSuperformValidation();
  if (document.querySelector('.nav_wrap'))             initNavTheme();
  if (document.querySelector('[data-menu-button]'))    initMenuButton();
  if (document.querySelector('[data-accordion-css-init]')) initAccordionCSS();
  if (document.querySelector('[data-testimonial-wrap]')) initLineRevealTestimonials();
});


// ─── FUNCTIONS ───────────────────────────────────────────────────────────────

// EXAMPLE //
function initExample() {
  // ...
}

// NAV THEME — swap .nav_wrap to the opposite theme past 10% scroll, restore at top //
function initNavTheme() {
  const nav = document.querySelector('.nav_wrap');

  // Whatever theme the nav starts in, the scrolled state is the other one.
  const startTheme  = nav.classList.contains('u-theme-light') ? 'u-theme-light' : 'u-theme-dark';
  const scrollTheme = startTheme === 'u-theme-light' ? 'u-theme-dark' : 'u-theme-light';

  ScrollTrigger.create({
    start: () => window.innerHeight * 0.1, // 10% of the viewport scrolled
    end: 'max',
    onToggle: (self) => {
      nav.classList.toggle(startTheme, !self.isActive);
      nav.classList.toggle(scrollTheme, self.isActive);
    }
  });
}

// MENU BUTTON //
function initMenuButton() {
  const menuButton = document.querySelector("[data-menu-button]");
  const lines = document.querySelectorAll(".menu-button-line");
  const [line1, line2, line3] = lines;
  const nav = document.querySelector('.nav_wrap');

  if (!menuButton || lines.length < 3) return;

  const setNavLight = (force) => {
    if (!nav || nav._isAlwaysLight || !nav._colorTl) return;
    nav._menuForceLight = force;
    if (force) {
      nav._colorTl.play();
    } else {
      nav._colorST && nav._colorST.isActive ? nav._colorTl.play() : nav._colorTl.reverse();
    }
  };

  const menuButtonTl = gsap.timeline({
    defaults: {
      overwrite: "auto",
      ease: "button-ease",
      duration: 0.3
    }
  });

  const menuOpen = () => {
    menuButtonTl.clear()
      .to(line2, { scaleX: 0, opacity: 0 })
      .to(line1, { x: "-1.3em", opacity: 0 }, "<")
      .to(line3, { x: "1.3em", opacity: 0 }, "<")
      .to([line1, line3], { opacity: 0, duration: 0.1 }, "<+=0.2")
      .set(line1, { rotate: -135, y: "-1.3em", scaleX: 0.9 })
      .set(line3, { rotate: 135, y: "-1.4em", scaleX: 0.9 }, "<")
      .to(line1, { opacity: 1, x: "0em", y: "0.5em" })
      .to(line3, { opacity: 1, x: "0em", y: "-0.25em" }, "<+=0.1");
  };

  const menuClose = () => {
    menuButtonTl.clear()
      .to([line1, line2, line3], {
        scaleX: 1,
        rotate: 0,
        x: "0em",
        y: "0em",
        opacity: 1,
        duration: 0.45,
        overwrite: "auto"
      });
  };

  menuButton.addEventListener("click", () => {
    const currentState = menuButton.getAttribute("data-menu-button");
    if (currentState === "burger") {
      menuOpen();
      setNavLight(true);
      menuButton.setAttribute("data-menu-button", "close");
    } else {
      menuClose();
      setNavLight(false);
      menuButton.setAttribute("data-menu-button", "burger");
    }
  });
}

// Shared "reveal-in" tween — the visible end state every reveal animates to.
// Spread it into a tween and add stagger/scrollTrigger as needed.
const REVEAL_IN = { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'osmo' };

// How slightly each nested [data-reveal] trails the previous inside a fade-clip.
const REVEAL_STEP = 0.15;

// Prep a [data-reveal] element: split it, set the hidden start state, and return
// the split targets + per-type stagger so the caller can tween them standalone
// or sequenced inside a parent timeline.
function prepReveal(el) {
  const value = (el.getAttribute('data-reveal') || '').trim().toLowerCase();
  const type = ['chars', 'words', 'lines'].includes(value) ? value : 'lines';

  // Match studio-quaglio's per-type stagger timing.
  const stagger = { chars: 0.01, words: 0.02, lines: 0.08 }[type];

  // Split chars inside words so words wrap as a unit (no stray chars on the next line).
  const splitType = type === 'chars' ? 'chars,words' : type;

  const split = new SplitText(el, { type: splitType, [type]: `reveal-${type}` });
  const targets = split[type];

  gsap.set(targets, { autoAlpha: 0, y: '1rem', filter: 'blur(12px)', willChange: 'transform, filter, opacity' });
  return { targets, stagger };
}

// Prep a [data-reveal-fade] element: set the parent's hidden start state and prep
// its nested [data-reveal] children so they sit hidden until their turn. Returns
// { el, children } for revealFade() to cascade.
function prepRevealFade(el) {
  gsap.set(el, { autoAlpha: 0, y: '1rem', filter: 'blur(12px)', willChange: 'transform, filter, opacity' });
  const children = [...el.querySelectorAll('[data-reveal]')].map(prepReveal);
  return { el, children };
}

// Cascade a prepped fade-clip onto a timeline: parent first, then each nested
// [data-reveal] child staggered just slightly after the previous.
function revealFade(tl, { el, children }, position) {
  tl.to(el, { ...REVEAL_IN }, position);
  children.forEach(({ targets, stagger }) => {
    tl.to(targets, { ...REVEAL_IN, stagger: { each: stagger, from: 'start' } }, `<${REVEAL_STEP}`);
  });
}

// REVEAL — blur + opacity fade-in, split & staggered (lines by default; chars/words/lines via attr value) //
function initReveal() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    // Children of a [data-reveal-fade] are sequenced by their parent — skip here.
    if (el.closest('[data-reveal-fade]')) return;
    // Above-the-fold elements owned by the preload reveal as the cover lifts — skip here.
    if (el.dataset.preloaded) return;

    const delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;
    const { targets, stagger } = prepReveal(el);

    gsap.to(targets, {
      ...REVEAL_IN,
      delay,
      stagger: { each: stagger, from: 'start' },
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });
}

// REVEAL CLIP — fade up from blur + opacity, then cascade any nested [data-reveal] children //
function initRevealClip() {
  document.querySelectorAll('[data-reveal-fade]').forEach((el) => {
    // Above-the-fold elements owned by the preload reveal as the cover lifts — skip here.
    if (el.dataset.preloaded) return;

    const delay = parseFloat(el.getAttribute('data-reveal-fade-delay')) || 0;
    const prepped = prepRevealFade(el);

    const tl = gsap.timeline({
      delay,
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });

    revealFade(tl, prepped);
  });
}

// PRELOAD — wipe the [preload-bg] cover (height 100% → 0%); at the 50% midpoint,
// reveal the hero [data-reveal] / [data-reveal-fade] content in data-load order
// (1..n), each starting just after the previous. Below-the-fold content stays on
// ScrollTrigger. //
function initPreload() {
  const bg = document.querySelector('[preload-bg]');
  if (!bg) return;

  const COVER_DURATION = 1.2;
  const LOAD_STEP = 0.15; // each hero element starts just after the previous

  // Hero elements declare their load order via data-load ("1".."6"). Collect the
  // reveal elements, sort by that order, and flag them so initReveal /
  // initRevealClip skip them (no double-firing behind the cover).
  const heroPreps = [...document.querySelectorAll('[data-load]')]
    .filter((el) => {
      if (el.hasAttribute('data-reveal-fade')) return true;
      if (el.hasAttribute('data-reveal'))      return !el.closest('[data-reveal-fade]');
      return false;
    })
    .sort((a, b) => (parseFloat(a.dataset.load) || 0) - (parseFloat(b.dataset.load) || 0))
    .map((el) => {
      el.dataset.preloaded = 'true';
      return el.hasAttribute('data-reveal-fade')
        ? { type: 'fade',   prepped: prepRevealFade(el) }
        : { type: 'reveal', prepped: prepReveal(el) };
    });

  // Sequence the hero reveals — first at the start, each next just after the previous.
  const revealTl = gsap.timeline();
  heroPreps.forEach(({ type, prepped }, i) => {
    const position = i === 0 ? 0 : `<${LOAD_STEP}`;
    if (type === 'fade') {
      revealFade(revealTl, prepped, position);
    } else {
      const { targets, stagger } = prepped;
      revealTl.to(targets, { ...REVEAL_IN, stagger: { each: stagger, from: 'start' } }, position);
    }
  });

  gsap.set(bg, { height: '100%' });

  const tl = gsap.timeline();
  tl.to(bg, { height: '0%', duration: COVER_DURATION, ease: 'osmo' });
  // Play the hero sequence from the cover's midpoint onward.
  tl.add(revealTl, COVER_DURATION * 0.5);
}

// IMAGE PARALLAX — every .img drifts down ~15%, scrubbed both ways. Skip .no-para //
function initImageParallax() {
  document.querySelectorAll('.img:not(.no-para)').forEach((img) => {
    gsap.fromTo(img,
      { yPercent: -7.5 },
      {
        yPercent: 7.5,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

// Form modal ([form-open] / [form-wrap]) — ported from finegrain
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

// -----------------------------------------
// YOUR FUNCTIONS GO BELOW HERE
// -----------------------------------------

// ACCORDION (CSS-driven) — toggle [data-accordion-status] on click; optional
// single-open mode via [data-accordion-close-siblings="true"]. Styling is left
// to CSS reacting to the status attribute. //
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');

      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}

// TESTIMONIALS — line-masked slider. Outgoing lines wipe up, incoming lines wipe
// in, image clip-path circles out/in. Optional autoplay via
// [data-autoplay="true"] + [data-autoplay-duration] (ms). Arrow keys work while
// the slider is in view. //
function initLineRevealTestimonials() {
  const wraps = document.querySelectorAll("[data-testimonial-wrap]");
  if (!wraps.length) return;

  const imageClipHidden = "circle(0% at 50% 50%)";
  const imageClipVisible = "circle(50% at 50% 50%)";

  wraps.forEach((wrap) => {
    const list = wrap.querySelector("[data-testimonial-list]");
    if (!list) return;

    const items = Array.from(list.querySelectorAll("[data-testimonial-item]"));
    if (!items.length) return;

    const btnPrev = wrap.querySelector("[data-prev]");
    const btnNext = wrap.querySelector("[data-next]");
    const elCurrent = wrap.querySelector("[data-current]");
    const elTotal = wrap.querySelector("[data-total]");

    if (elTotal) elTotal.textContent = String(items.length);

    let activeIndex = items.findIndex((el) => el.classList.contains("is--active"));
    if (activeIndex < 0) activeIndex = 0;

    let isAnimating = false;
    let reduceMotion = false;

    const autoplayEnabled = wrap.getAttribute("data-autoplay") === "true";
    const autoplayDuration = parseInt(wrap.getAttribute("data-autoplay-duration"), 10) || 4000;

    let autoplayCall = null;
    let isInView = true;

    const slides = items.map((item) => ({
      item,
      image: item.querySelector("[data-testimonial-img]"),

      splitTargets: [
        item.querySelector("[data-testimonial-text]"),
        ...item.querySelectorAll("[data-testimonial-split]"),
      ].filter(Boolean),

      splitInstances: [],

      getLines() {
        return this.splitInstances.flatMap((instance) => instance.lines);
      },
    }));

    function setSlideState(slideIndex, isActive) {
      const { item } = slides[slideIndex];
      item.classList.toggle("is--active", isActive);
      item.setAttribute("aria-hidden", String(!isActive));
      gsap.set(item, {
        autoAlpha: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      });
    }

    function updateCounter() {
      if (elCurrent) elCurrent.textContent = String(activeIndex + 1);
    }

    function startAutoplay() {
      if (!autoplayEnabled) return;
      if (autoplayCall) autoplayCall.kill();

      autoplayCall = gsap.delayedCall(autoplayDuration / 1000, () => {
        if (!isInView || isAnimating) {
          startAutoplay();
          return;
        }
        goTo((activeIndex + 1) % slides.length);
        startAutoplay();
      });
    }

    function pauseAutoplay() {
      if (autoplayCall) autoplayCall.pause();
    }

    function resumeAutoplay() {
      if (!autoplayEnabled) return;
      if (!autoplayCall) startAutoplay();
      else autoplayCall.resume();
    }

    function resetAutoplay() {
      if (!autoplayEnabled) return;
      startAutoplay();
    }

    // Set initial state
    slides.forEach((_, i) => setSlideState(i, i === activeIndex));
    updateCounter();

    // Handle reduced motion preference
    gsap.matchMedia().add(
      { reduce: "(prefers-reduced-motion: reduce)" },
      (context) => {
        reduceMotion = context.conditions.reduce;
      }
    );

    // Create SplitText instances
    slides.forEach((slide, slideIndex) => {
      slide.splitInstances = slide.splitTargets.map((el) =>
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "text-line",
          autoSplit: true,
          onSplit(self) {
            if (reduceMotion) return;

            const isActive = slideIndex === activeIndex;
            gsap.set(self.lines, { yPercent: isActive ? 0 : 110 });

            if (slide.image) {
              gsap.set(slide.image, {
                clipPath: isActive ? imageClipVisible : imageClipHidden,
              });
            }
          },
        })
      );
    });

    function goTo(nextIndex) {
      if (isAnimating || nextIndex === activeIndex) return;
      isAnimating = true;

      const outgoingSlide = slides[activeIndex];
      const incomingSlide = slides[nextIndex];

      const tl = gsap.timeline({
        onComplete: () => {
          setSlideState(activeIndex, false);
          setSlideState(nextIndex, true);
          activeIndex = nextIndex;
          updateCounter();
          isAnimating = false;
        },
      });

      if (reduceMotion) {
        tl.to(outgoingSlide.item, {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2"
          }, 0)
          .fromTo(incomingSlide.item, {
            autoAlpha: 0
          }, {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2"
          }, 0);

        return;
      }

      const outgoingLines = outgoingSlide.getLines();
      const incomingLines = incomingSlide.getLines();

      gsap.set(incomingSlide.item, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(incomingLines, { yPercent: 110 });

      if (outgoingSlide.image) gsap.set(outgoingSlide.image, { clipPath: imageClipVisible });

      tl.to(outgoingLines, {
        yPercent: -110,
        duration: 0.6,
        ease: "power4.inOut",
        stagger: { amount: 0.25 },
      }, 0);

      if (outgoingSlide.image) {
        tl.to(outgoingSlide.image, {
          clipPath: imageClipHidden,
          duration: 0.6,
          ease: "power4.inOut",
        }, 0);
      }

      tl.to(incomingLines, {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: { amount: 0.4 },
      }, ">-=0.3");

      if (incomingSlide.image) {
        tl.fromTo(incomingSlide.image, {
          clipPath: imageClipHidden,
        }, {
          clipPath: imageClipVisible,
          duration: 0.75,
          ease: "power4.inOut",
        }, "<");
      }

      tl.set(outgoingSlide.item, { autoAlpha: 0 }, ">");
    }

    // Start autoplay on the wrap (only works if autoplay is set to 'true')
    startAutoplay();

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        resetAutoplay();
        goTo((activeIndex + 1) % slides.length);
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        resetAutoplay();
        goTo((activeIndex - 1 + slides.length) % slides.length);
      });
    }

    function onKeyDown(e) {
      if (!isInView) return;

      // Don't hijack arrow keys while user is typing.
      const t = e.target;
      const isTypingTarget =
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable);

      if (isTypingTarget) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        resetAutoplay();
        goTo((activeIndex + 1) % slides.length);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        resetAutoplay();
        goTo((activeIndex - 1 + slides.length) % slides.length);
      }
    }

    // Listen for left/right arrows
    window.addEventListener("keydown", onKeyDown);

    // Enable/disable keyboard + autoplay depending on scroll position
    ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        isInView = true;
        resumeAutoplay();
      },
      onEnterBack: () => {
        isInView = true;
        resumeAutoplay();
      },
      onLeave: () => {
        isInView = false;
        pauseAutoplay();
      },
      onLeaveBack: () => {
        isInView = false;
        pauseAutoplay();
      },
    });
  });
}
