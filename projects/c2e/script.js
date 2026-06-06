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
  if (document.querySelector('[data-reveal]'))         initReveal();
  if (document.querySelector('[data-reveal-clip]'))    initRevealClip();
  if (document.querySelector('.img:not(.no-para)'))    initImageParallax();
  if (document.querySelector('[form-open]'))           initFormModal();
  if (document.querySelector('[data-form-validate]'))  initSuperformValidation();
  if (document.querySelector('.nav-wrap'))             initNavTheme();
});


// ─── FUNCTIONS ───────────────────────────────────────────────────────────────

// EXAMPLE //
function initExample() {
  // ...
}

// NAV THEME — add u-theme-light to .nav-wrap past 10% of viewport scroll, remove back at top //
function initNavTheme() {
  const nav = document.querySelector('.nav-wrap');

  ScrollTrigger.create({
    start: () => window.innerHeight * 0.1, // 10% of the viewport scrolled
    end: 'max',
    onToggle: (self) => nav.classList.toggle('u-theme-light', self.isActive)
  });
}

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

// REVEAL — blur + opacity fade-in, split & staggered (lines by default; chars/words/lines via attr value) //
function initReveal() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    // Children of a [data-reveal-fade] are sequenced by their parent — skip here.
    if (el.closest('[data-reveal-fade]')) return;

    const delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;
    const { targets, stagger } = prepReveal(el);

    gsap.to(targets, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'osmo',
      delay,
      stagger: { each: stagger, from: 'start' },
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });
}

// REVEAL CLIP — fade up from blur + opacity, then cascade any nested [data-reveal] children //
function initRevealClip() {
  const STEP = 0.15; // how slightly each nested reveal trails the previous

  document.querySelectorAll('[data-reveal-fade]').forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-reveal-fade-delay')) || 0;

    // Prep nested [data-reveal] children up front so they sit hidden until their turn.
    const children = [...el.querySelectorAll('[data-reveal]')].map(prepReveal);

    gsap.set(el, { autoAlpha: 0, y: '1rem', filter: 'blur(12px)', willChange: 'transform, filter, opacity' });

    const tl = gsap.timeline({
      delay,
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });

    tl.to(el, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'osmo'
    });

    // Parent first, then each child staggered just slightly after the previous.
    children.forEach(({ targets, stagger }) => {
      tl.to(targets, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'osmo',
        stagger: { each: stagger, from: 'start' }
      }, `<${STEP}`);
    });
  });
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
