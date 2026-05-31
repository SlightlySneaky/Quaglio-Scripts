// Hide text targets before GSAP sets initial state
(function () {
  const s = document.createElement("style");
  s.textContent = "[split-heading][hero],[split-body][hero]{visibility:hidden}";
  document.head.appendChild(s);
})();


// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(CustomEase, ScrollTrigger, Observer);

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


// ============================================
// EASES
// Rule: all animations must use one of these named eases.
// Default: "osmo". Do not use GSAP built-in eases (power, expo, etc.).
// ============================================
CustomEase.create("reveal",    "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("osmo",      "M0,0 C0.625,0.05 0,1 1,1");
CustomEase.create("energy",    "M0,0 C0.32,0.72 0,1 1,1");
CustomEase.create("smooth",    "M0,0 C0.38,0.005 0.215,1 1,1");
CustomEase.create("punch",     "M0,0 C0.19,1 0.22,1 1,1");
CustomEase.create("relaxed",   "M0,0 C0.7,0 0.3,1 1,1");
CustomEase.create("expo.inOut","M0,0 C0.87,0 0.13,1 1,1");
CustomEase.create("jump",      "M0,0 C0.35,1.5 0.6,1 1,1");
CustomEase.create("pop",       "M0,0 C0.17,0.67 0.3,1.33 1,1");

gsap.defaults({ ease: "osmo", duration: durationDefault });

ScrollTrigger.config({ ignoreMobileResize: true });

if (document.readyState === "complete") ScrollTrigger.refresh();
else window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });


// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  // Runs once on first load — global, page-persistent behaviour.
  safeInit("Preloader", ".preloader", initPreloader);
  initTimezoneNav();
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;

  // Runs before the enter animation — nothing page-scoped needed here yet.
}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  // Runs after enter animation completes — (re)build every page-scoped script.
  initPageScripts();

  if (hasLenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

// All per-page scripts. Runs on first load and after every Barba enter.
// Safe to query `document`: by the time afterEnter fires, the outgoing
// container has already been removed, so only the new page is in the DOM.
function initPageScripts() {
  // Global, lightweight — safe to run right away.
  safeInit("NavAnimation",       '[data-theme-nav="true"]',   initNavAnimation);
  safeInit("AccordionCSS",       '[data-accordion-css-init]', initAccordionCSS);
  safeInit("HeroParallax",       '[data-hero-parallax]',      initHeroParallax);
  safeInit("SplitTextAndReveal", '[split-heading]:not([hero]), [split-body]:not([hero]), [reveal-block]', initSplitTextAndReveal);
  initSvgFillLoop();

  // Per-component — built when that section approaches the viewport.
  lazyOnce("GlobalParallax",    '[data-parallax="trigger"]',     initGlobalParallax);
  lazyOnce("TestimonialSlider", '[data-swiper-group="1"]',       initTestimonialSlider);
  lazyOnce("DraggableMarquee",  '[data-draggable-marquee-init]', initDraggableMarquee);
  lazyOnce("ButtonCharStagger", '[data-button-animate-chars]',   initButtonCharacterStagger);
  lazyOnce("SwiperSlider",      '[data-swiper-group="2"]',       initSwiperSlider);
}


// -----------------------------------------
// INIT HELPERS
// -----------------------------------------

function safeInit(name, selector, fn) {
  if (selector && !document.querySelector(selector)) return;
  try { fn(); }
  catch {}
}

// Run `fn` once, when the first element matching `selector` nears the viewport.
function lazyOnce(name, selector, fn, rootMargin = "300px 0px") {
  const el = document.querySelector(selector);
  if (!el) return;
  if (!("IntersectionObserver" in window)) {
    try { fn(); } catch {}
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    io.disconnect();
    try { fn(); }
    catch {}
  }, { rootMargin });
  io.observe(el);
}

// Run `perEl(element)` for each match, each one only as it nears the viewport.
// Elements that arrive together are processed one per task, so the main thread
// never blocks long enough to freeze scroll, input or animations.
function lazyEach(name, selector, perEl, rootMargin = "600px 0px") {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const run = (el) => {
    try { perEl(el); }
    catch {}
  };

  if (!("IntersectionObserver" in window)) {
    els.forEach(run);
    return;
  }

  const pending = [];
  let draining = false;
  function drain() {
    if (draining) return;
    draining = true;
    (function step() {
      const el = pending.shift();
      if (!el) { draining = false; return; }
      run(el);
      window.setTimeout(step, 0);
    })();
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      pending.push(entry.target);
    });
    drain();
  }, { rootMargin });

  els.forEach((el) => io.observe(el));
}


// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();

  tl.call(() => {
    resetPage(next)
  }, null, 0);

  return tl;
}

function runPageLeaveAnimation(current, next) {
  const parent = current.parentElement || document.body;
  const transitionWrap = document.querySelector("[data-transition-wrap]");
  const transitionDark = transitionWrap.querySelector("[data-transition-dark]");
  
  // Helper function to prepare transition structure
  const { wrapper } = prepareForTransition(parent, current, next);
  
  const tl = gsap.timeline({
    onComplete: () => {
      wrapper.replaceWith(next);
      gsap.set(next, {clearProps: "all" });
    }
  });
  
  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    return tl.set(current, { autoAlpha: 0 });
  }
  
  tl.set(transitionWrap, {
    zIndex: 2
  });
  
  tl.fromTo(transitionDark, {
    autoAlpha: 0
  },{
    autoAlpha: 0.5,
    duration: 0.9,
  }, 0);  

  tl.to(wrapper, {
    yPercent: 0,
    duration: 0.75,
  }, 0);

  tl.to(wrapper, {
    duration: 0.9,
    clipPath: "inset(0% round 0em)"
  }, "<");
  
  tl.to(current, {
    scale: 1.05,
    duration: 0.9,
    overwrite: "auto"
  }, "<");
  
  tl.set(transitionDark, {
    autoAlpha: 0,
  });
  
  return tl;
}

function runPageEnterAnimation(next){
  const tl = gsap.timeline();
  
  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady")
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }

  tl.add("pageReady");
  tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, null, "pageReady");
  });
}

function prepareForTransition(parent, current, next){

  const scrollY = window.scrollY;

  // Freeze current page in place
  gsap.set(current, {
    position: "fixed",
    top: -scrollY,
    left: 0,
    width: "100%",
    overflow: "hidden"
  });

  // Reset browser scroll so next page starts correctly
  window.scrollTo(0, 0);

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "page-transition__wrapper";

  parent.insertBefore(wrapper, next);
  wrapper.appendChild(next);

  gsap.set(wrapper, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100vh",
    yPercent: 50,
    overflow: "clip",
    zIndex: 5,
    transformStyle: "preserve-3d",
    willChange: "transform, clip-path",
    clipPath: "inset(50% round 3em)",
  });

  return { wrapper };
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
});

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
  debug: false,
  timeout: 7000,
  preventRunning: true,
  transitions: [
    {
      name: "default",
      sync: true,

      // First load
      async once(data) {
        initOnceFunctions();

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
    }
  ],
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
  if (!data || !data.next || !data.next.html) return;

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
// PAGE SCRIPTS
// -----------------------------------------

// ============================================
// PRELOADER (.preloader)
// ============================================
function initPreloader() {
  const wrap = document.querySelector(".preloader");
  if (!wrap) return;

  // Driven by a CSS transition, NOT GSAP: lagSmoothing(0) on the Lenis setup
  // lets the first big tick after page load fast-forward a GSAP timeline to its
  // end (the "flash"). A CSS transition runs on wall-clock time and is immune.
  const DUR  = 0.9;                          // seconds
  const EASE = "cubic-bezier(0.87, 0, 0.13, 1)"; // same curve as the "expo.inOut" ease

  wrap.style.display    = "flex";
  wrap.style.opacity    = "1";
  wrap.style.filter     = "blur(0px)";
  wrap.style.willChange = "opacity, filter";

  function reveal() {
    wrap.style.transition = `opacity ${DUR}s ${EASE}, filter ${DUR}s ${EASE}`;
    requestAnimationFrame(() => {
      wrap.style.opacity = "0";
      wrap.style.filter  = "blur(24px)";
    });
    window.setTimeout(() => {
      wrap.style.display    = "none";
      wrap.style.willChange = "auto";
    }, DUR * 1000 + 50);
  }

  if (document.readyState === "complete") reveal();
  else window.addEventListener("load", reveal, { once: true });
}


// ============================================
// NAV ANIMATION
// ============================================
function initNavAnimation() {
  const runNav = () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const nav = document.querySelector('[data-theme-nav="true"]');
    if (!nav) return;

    const THEME_DARK = "u-theme-dark";
    const THEME_LIGHT = "u-theme-light";

    const getThemeForSection = (section) => {
      if (section.classList.contains(THEME_DARK)) return THEME_DARK;
      if (section.classList.contains(THEME_LIGHT)) return THEME_LIGHT;
      if (section.querySelector(`.${THEME_DARK}`)) return THEME_DARK;
      if (section.querySelector(`.${THEME_LIGHT}`)) return THEME_LIGHT;
      return null;
    };

    const applyNavTheme = (theme) => {
      if (!theme) return;
      nav.classList.remove(THEME_DARK, THEME_LIGHT);
      nav.classList.add(theme);
    };

    const sections = document.querySelectorAll(".section");
    if (!sections.length) return;

    sections.forEach((section) => {
      const theme = getThemeForSection(section);
      if (!theme) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top 5%",
        end: "bottom 5%",
        onEnter: () => applyNavTheme(theme),
        onEnterBack: () => applyNavTheme(theme),
      });
    });

    // Set correct theme on page load
    ScrollTrigger.refresh();
    requestAnimationFrame(() => {
      const y = window.innerHeight * 0.3;
      const active = [...sections].find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      if (active) applyNavTheme(getThemeForSection(active));
    });
  };
  if (document.readyState === "complete") runNav();
  else window.addEventListener("load", runNav, { once: true });
}


// ============================================
// SPLIT TEXT + REVEAL BLOCK ANIMATIONS
// ============================================
function initSplitTextAndReveal() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const hasSplitText = typeof window.SplitText !== "undefined";

  gsap.registerPlugin(ScrollTrigger);
  if (hasSplitText) gsap.registerPlugin(SplitText);

  // ---------- HEADINGS: split by characters ----------
  function setupHeading(heading) {
    const delayAttr  = parseFloat(heading.getAttribute("data-split-delay")) || 0;
    const isLoadAnim = heading.getAttribute("data-split-load") === "true";

    const split = new SplitText(heading, {
      type: "chars,words",
      mask: "chars",
      maskClass: "char-mask",
      charsClass: "is-split-char",
      wordsClass: "is-split-word"
    });

    gsap.set(heading, { overflow: "hidden", position: "relative", autoAlpha: 1 });
    gsap.set(split.chars, { yPercent: 120, autoAlpha: 0 });

    const tl = gsap.timeline(
      isLoadAnim
        ? {}
        : {
            scrollTrigger: {
              trigger: heading,
              start: "clamp(top 80%)",
              toggleActions: "play none none none"
            }
          }
    );

    tl.to(split.chars, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "osmo",
      stagger: { each: 0.01, from: "start" },
      delay: delayAttr
    });
  }

  // ---------- BODY: split by lines ----------
  function setupBody(body) {
    const delayAttr  = parseFloat(body.getAttribute("data-split-delay")) || 0.1;
    const isLoadAnim = body.getAttribute("data-split-load") === "true";

    const split = new SplitText(body, {
      type: "lines",
      mask: "lines",
      maskClass: "line-mask",
      linesClass: "is-split-line"
    });

    gsap.set(body, { overflow: "hidden", position: "relative", autoAlpha: 1 });
    gsap.set(split.lines, { yPercent: 120, autoAlpha: 0 });

    const tl = gsap.timeline(
      isLoadAnim
        ? {}
        : {
            scrollTrigger: {
              trigger: body,
              start: "clamp(top 85%)",
              toggleActions: "play none none none"
            }
          }
    );

    tl.to(split.lines, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: "osmo",
      stagger: { each: 0.08, from: "start" },
      delay: delayAttr
    });
  }

  // ---------- REVEAL BLOCKS: clip-path mask ----------
  function setupRevealBlock(block) {
    const delayAttr  = parseFloat(block.getAttribute("data-reveal-delay")) || 0.2;
    const isLoadAnim = block.getAttribute("data-reveal-load") === "true";

    // Hide nested split text up front so the clip can't reveal it in plain
    // form before its own (separately-observed) split setup has run.
    if (hasSplitText) {
      block.querySelectorAll("[split-heading]:not([hero]), [split-body]:not([hero])").forEach((el) => {
        if (!el.querySelector(".is-split-char, .is-split-line")) {
          gsap.set(el, { autoAlpha: 0 });
        }
      });
    }

    gsap.set(block, {
      clipPath: "inset(0 100% 0 0)",
      willChange: "clip-path"
    });

    const tl = gsap.timeline(
      isLoadAnim
        ? {}
        : {
            scrollTrigger: {
              trigger: block,
              start: "clamp(top 90%)",
              toggleActions: "play none none none"
            }
          }
    );

    tl.to(block, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "osmo",
      delay: delayAttr
    });
  }

  // Build each element only as it nears the viewport — never all at once.
  if (hasSplitText) {
    lazyEach("SplitHeading", "[split-heading]:not([hero])", setupHeading);
    lazyEach("SplitBody",    "[split-body]:not([hero])",    setupBody);
  }
  lazyEach("RevealBlock",    "[reveal-block]",              setupRevealBlock);
}


// ============================================
// GLOBAL PARALLAX
// ============================================
function initGlobalParallax() {
  const mm = gsap.matchMedia();
  mm.add(
    {
      isMobile:          "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet:          "(max-width:991px)",
      isDesktop:         "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions;
      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
          const disable = trigger.getAttribute("data-parallax-disable");
          if (
            (disable === "mobile"          && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet"          && isTablet)
          ) return;

          const target    = trigger.querySelector('[data-parallax="target"]') || trigger;
          const direction = trigger.getAttribute("data-parallax-direction") || "vertical";
          const prop      = direction === "horizontal" ? "xPercent" : "yPercent";
          const scrubAttr = trigger.getAttribute("data-parallax-scrub");
          const scrub     = scrubAttr ? parseFloat(scrubAttr) : true;
          const startVal  = trigger.getAttribute("data-parallax-start")  !== null ? parseFloat(trigger.getAttribute("data-parallax-start"))  : 20;
          const endVal    = trigger.getAttribute("data-parallax-end")    !== null ? parseFloat(trigger.getAttribute("data-parallax-end"))    : -20;
          const scrollStart = `clamp(${trigger.getAttribute("data-parallax-scroll-start") || "top bottom"})`;
          const scrollEnd   = `clamp(${trigger.getAttribute("data-parallax-scroll-end")   || "bottom top"})`;

          gsap.fromTo(target, { [prop]: startVal }, {
            [prop]: endVal,
            ease: "none",
            scrollTrigger: { trigger, start: scrollStart, end: scrollEnd, scrub },
          });
        });
      });
      return () => ctx.revert();
    }
  );
}


// ============================================
// HERO PARALLAX ([data-hero-parallax])
// ============================================
function initHeroParallax() {
  if (window.matchMedia("(max-width: 991px)").matches) return;

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


// ============================================
// TESTIMONIAL SLIDER (Swiper + SplitText)
// ============================================
function initTestimonialSlider() {
  const swiperEl = document.querySelector('[data-swiper-group="1"] .swiper');
  const originalSlideCount = swiperEl
    ? swiperEl.querySelectorAll(".swiper-wrapper > .swiper-slide").length
    : 0;

  const splitCache = new Map();

  function initSplits(slides) {
    slides.forEach(function (slide) {
      if (splitCache.has(slide)) return;
      const quoteEl   = slide.querySelector('[data-split="quote"]');
      const nameEl    = slide.querySelector('[data-split="name"]');
      const roleEl    = slide.querySelector('[data-split="role"]');
      const profileEl = slide.querySelector(".test_profile_wrap");
      const splits    = { profileEl };

      if (quoteEl) {
        splits.quote = new SplitText(quoteEl, { type: "lines,words", mask: "lines", maskClass: "line-mask" });
        gsap.set(quoteEl, { opacity: 1 });
        gsap.set(splits.quote.words, { opacity: 0, y: 30 });
      }
      if (nameEl) {
        splits.name = new SplitText(nameEl, { type: "chars", mask: "chars", maskClass: "char-mask" });
        gsap.set(nameEl, { opacity: 1 });
        gsap.set(splits.name.chars, { opacity: 0, y: 10 });
      }
      if (roleEl) {
        splits.role = new SplitText(roleEl, { type: "words", mask: "words", maskClass: "word-mask" });
        gsap.set(roleEl, { opacity: 1 });
        gsap.set(splits.role.words, { opacity: 0, y: 10 });
      }
      if (profileEl) gsap.set(profileEl, { opacity: 0, y: 20, scale: 0.95 });

      splitCache.set(slide, splits);
    });
  }

  function animateIn(slide) {
    const splits = splitCache.get(slide);
    if (!splits) return;
    const targets = [splits.profileEl, splits.quote?.words, splits.name?.chars, splits.role?.words].filter(Boolean);
    gsap.killTweensOf(targets);
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "osmo" } });
    if (splits.profileEl) tl.fromTo(splits.profileEl, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1 }, 0);
    if (splits.quote)     tl.fromTo(splits.quote.words,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.02 }, 0.05);
    if (splits.name)      tl.fromTo(splits.name.chars,   { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.01 }, "-=0.3");
    if (splits.role)      tl.fromTo(splits.role.words,   { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.03 }, "-=0.3");
  }

  function animateOut(slide) {
    const splits = splitCache.get(slide);
    if (!splits) return;
    const targets = [splits.profileEl, splits.quote?.words, splits.name?.chars, splits.role?.words].filter(Boolean);
    gsap.killTweensOf(targets);
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "energy" } });
    if (splits.role)      tl.to(splits.role.words,  { opacity: 0, y: 10, stagger: { each: 0.03, from: "end" } }, 0);
    if (splits.name)      tl.to(splits.name.chars,   { opacity: 0, y: 10, stagger: { each: 0.01, from: "end" } }, 0.05);
    if (splits.quote)     tl.to(splits.quote.words,  { opacity: 0, y: 30, stagger: { each: 0.02, from: "end" } }, 0.1);
    if (splits.profileEl) tl.to(splits.profileEl,    { opacity: 0, y: 20, scale: 0.95 }, "-=0.2");
  }

  const swiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    loop: true,
    speed: 600,
    on: {
      init: function () {
        initSplits(this.slides);
        animateIn(this.slides[this.activeIndex]);
        const currentEl = document.querySelector("[data-swiper-current]");
        const totalEl   = document.querySelector("[data-swiper-total]");
        if (currentEl && totalEl) { currentEl.textContent = this.realIndex + 1; totalEl.textContent = originalSlideCount; }
      },
      slideChangeTransitionStart: function () {
        const currentEl = document.querySelector("[data-swiper-current]");
        const totalEl   = document.querySelector("[data-swiper-total]");
        if (currentEl && totalEl) { currentEl.textContent = this.realIndex + 1; totalEl.textContent = originalSlideCount; }
        const prevSlide   = this.slides[this.previousIndex];
        const activeSlide = this.slides[this.activeIndex];
        if (prevSlide)   animateOut(prevSlide);
        if (activeSlide) animateIn(activeSlide);
      }
    }
  });

  const nextBtn = document.querySelector(".swiper-navigation__button--next");
  const prevBtn = document.querySelector(".swiper-navigation__button--prev");
  if (nextBtn) nextBtn.addEventListener("click", () => swiper.slideNext());
  if (prevBtn) prevBtn.addEventListener("click", () => swiper.slidePrev());
}


// ============================================
// ACCORDION CSS
// ============================================
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';
    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;
      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return;
      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}


// ============================================
// TIMEZONE NAV (.bne-time)
// ============================================
function initTimezoneNav() {
  const el = document.querySelector(".bne-time");
  if (!el) return;
  function updateTime() {
    el.textContent = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false
    }).format(new Date());
  }
  updateTime();
  setInterval(updateTime, 1000);
}


// ============================================
// SVG FILL LOOP
// ============================================
function initSvgFillLoop() {
  const COLOR       = "rgb(91, 139, 172)";
  const DURATION_MS = 700;
  const STAGGER_MS  = 80;
  const HOLD_MS     = 150;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function isInsideDefs(el) { return !!el.closest("defs"); }

  function getAnimatedSvgs(root = document) {
    return Array.from(root.querySelectorAll("svg"))
      .filter(svg => svg.querySelector('[class*="svg-elem-"]'));
  }

  function getIndex(el) {
    for (const cls of el.classList) {
      const m = cls.match(/^svg-elem-(\d+)$/);
      if (m) return parseInt(m[1], 10);
    }
    return Number.MAX_SAFE_INTEGER;
  }

  function getTargets(svg) {
    return Array.from(svg.querySelectorAll('[class*="svg-elem-"]'))
      .filter(el => !isInsideDefs(el))
      .map(el => ({ el, i: getIndex(el) }))
      .sort((a, b) => a.i - b.i)
      .map(x => x.el);
  }

  function cancelAnimations(targets) {
    targets.forEach(el => el.getAnimations?.().forEach(a => a.cancel()));
  }

  async function animateForward(targets) {
    cancelAnimations(targets);
    targets.forEach(el => el.setAttribute("fill", "transparent"));
    const anims = targets.map((el, idx) =>
      el.animate([{ fill: "transparent" }, { fill: COLOR }], {
        duration: DURATION_MS, delay: idx * STAGGER_MS, easing: "ease-in-out", fill: "forwards"
      })
    );
    try { await anims[anims.length - 1].finished; } catch (e) {}
    await sleep(HOLD_MS);
  }

  async function animateBackward(targets) {
    cancelAnimations(targets);
    targets.forEach(el => el.setAttribute("fill", COLOR));
    const anims = [...targets].reverse().map((el, idx) =>
      el.animate([{ fill: COLOR }, { fill: "transparent" }], {
        duration: DURATION_MS, delay: idx * STAGGER_MS, easing: "ease-in-out", fill: "forwards"
      })
    );
    try { await anims[anims.length - 1].finished; } catch (e) {}
    await sleep(HOLD_MS);
  }

  async function loopSvg(svg) {
    const targets = getTargets(svg);
    if (!targets.length) return;
    while (true) {
      await animateForward(targets);
      await animateBackward(targets);
    }
  }

  getAnimatedSvgs().forEach(svg => {
    if (svg.__fillLoopStarted) return;
    svg.__fillLoopStarted = true;
    loopSvg(svg);
  });
}


// ============================================
// DRAGGABLE MARQUEE ([data-draggable-marquee-init])
// ============================================
function initDraggableMarquee() {
  const wrappers = document.querySelectorAll("[data-draggable-marquee-init]");

  const getNumberAttr = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };

  wrappers.forEach((wrapper) => {
    if (wrapper.getAttribute("data-draggable-marquee-init") === "initialized") return;

    const collection = wrapper.querySelector("[data-draggable-marquee-collection]");
    const list = wrapper.querySelector("[data-draggable-marquee-list]");
    if (!collection || !list) return;

    const duration    = getNumberAttr(wrapper, "data-duration", 20);
    const multiplier  = getNumberAttr(wrapper, "data-multiplier", 40);
    const sensitivity = getNumberAttr(wrapper, "data-sensitivity", 0.01);

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const listWidth    = list.scrollWidth || list.getBoundingClientRect().width;
    if (!wrapperWidth || !listWidth) return;

    const minRequiredWidth = wrapperWidth + listWidth + 2;
    while (collection.scrollWidth < minRequiredWidth) {
      const listClone = list.cloneNode(true);
      listClone.setAttribute("data-draggable-marquee-clone", "");
      listClone.setAttribute("aria-hidden", "true");
      collection.appendChild(listClone);
    }

    const wrapX = gsap.utils.wrap(-listWidth, 0);
    gsap.set(collection, { x: 0 });

    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: "none",
      repeat: -1,
      onReverseComplete: () => marqueeLoop.progress(1),
      modifiers: { x: (x) => wrapX(parseFloat(x)) + "px" },
    });

    const initialDirectionAttr = (wrapper.getAttribute("data-direction") || "left").toLowerCase();
    const baseDirection = initialDirectionAttr === "right" ? -1 : 1;
    const timeScale = { value: baseDirection };

    wrapper.setAttribute("data-direction", baseDirection < 0 ? "right" : "left");
    if (baseDirection < 0) marqueeLoop.progress(1);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
      wrapper.setAttribute("data-direction", timeScale.value < 0 ? "right" : "left");
    }

    applyTimeScale();

    const marqueeObserver = Observer.create({
      target: wrapper,
      type: "pointer,touch",
      preventDefault: true,
      debounce: false,
      onChangeX: (observerEvent) => {
        let velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, observerEvent.velocityX * -sensitivity);
        gsap.killTweensOf(timeScale);
        const restingDirection = velocityTimeScale < 0 ? -1 : 1;
        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true })
          .to(timeScale, { value: restingDirection, duration: 1.0 });
      }
    });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter:      () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onEnterBack:  () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onLeave:      () => { marqueeLoop.pause(); marqueeObserver.disable(); },
      onLeaveBack:  () => { marqueeLoop.pause(); marqueeObserver.disable(); },
    });

    wrapper.setAttribute("data-draggable-marquee-init", "initialized");
  });
}


// ============================================
// BUTTON CHARACTER STAGGER ([data-button-animate-chars])
// ============================================
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}


// ============================================
// SWIPER SLIDER ([data-swiper-group])
// Uses swiper-2 / swiper-wrapper-2 / swiper-slide-2 classes
// to avoid conflicting with the testimonial swiper
// ============================================
function initSwiperSlider() {
  const cssBezier = "cubic-bezier(0.16, 0, 0.3, 1)";

  const groups = document.querySelectorAll('[data-swiper-group="2"]');
  groups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if (!swiperSliderWrap) return;

    const wrapperEl = swiperSliderWrap.querySelector(".swiper-wrapper-2");
    if (wrapperEl) wrapperEl.classList.add("swiper-wrapper");
    swiperSliderWrap.querySelectorAll(".swiper-slide-2").forEach(s => s.classList.add("swiper-slide"));

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");

    new Swiper(swiperSliderWrap, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      grabCursor: true,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      on: {
        init() {
          this.wrapperEl.style.transitionTimingFunction = cssBezier;
        },
        setTransition(duration) {
          this.wrapperEl.style.transitionDuration = `${duration}ms`;
          this.wrapperEl.style.transitionTimingFunction = cssBezier;
        },
      },
    });
  });
}
