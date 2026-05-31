// Hide text targets before GSAP sets initial state
(function () {
  const s = document.createElement("style");
  s.textContent = "[split-heading][hero],[split-body][hero]{visibility:hidden}";
  document.head.appendChild(s);
})();

// ============================================
// EASES
// Rule: all animations must use one of these named eases.
// Default: "osmo". Do not use GSAP built-in eases (power, expo, etc.).
// ============================================
gsap.registerPlugin(CustomEase);
CustomEase.create("reveal",    "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("osmo",      "M0,0 C0.625,0.05 0,1 1,1");
CustomEase.create("energy",    "M0,0 C0.32,0.72 0,1 1,1");
CustomEase.create("smooth",    "M0,0 C0.38,0.005 0.215,1 1,1");
CustomEase.create("punch",     "M0,0 C0.19,1 0.22,1 1,1");
CustomEase.create("relaxed",   "M0,0 C0.7,0 0.3,1 1,1");
CustomEase.create("expo.inOut","M0,0 C0.87,0 0.13,1 1,1");
CustomEase.create("jump",      "M0,0 C0.35,1.5 0.6,1 1,1");
CustomEase.create("pop",       "M0,0 C0.17,0.67 0.3,1.33 1,1");

// ============================================
// SHARED
// ============================================
function createEase(name) {
  return typeof CustomEase !== "undefined"
    ? CustomEase.create(name, "M0,0 C0.625,0.05 0,1 1,1")
    : "osmo";
}

// ============================================
// LENIS
// ============================================
gsap.registerPlugin(ScrollTrigger, Observer);
ScrollTrigger.config({ ignoreMobileResize: true });

if (document.readyState === 'complete') ScrollTrigger.refresh();
else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });


// ============================================
// INIT
// ============================================
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

function initAllScripts() {
  // Global, lightweight — safe to run right away.
  safeInit("AccordionCSS",    '[data-accordion-css-init]', initAccordionCSS);
  safeInit("HeroParallax",    '[data-hero-parallax]',      initHeroParallax);

  // Per-component — built when that section approaches the viewport.
  lazyOnce("GlobalParallax",    '[data-parallax="trigger"]',     initGlobalParallax);
  lazyOnce("TestimonialSlider", '[data-swiper-group="1"]',       initTestimonialSlider);
  // lazyOnce("StickyTitleScroll", '[data-sticky-title="wrap"]',  initStickyTitleScroll);
  lazyOnce("DraggableMarquee",  '[data-draggable-marquee-init]', initDraggableMarquee);
  lazyOnce("ButtonCharStagger", '[data-button-animate-chars]',   initButtonCharacterStagger);
  // lazyOnce("FormModal",         '[form-wrap]',                 initFormModal);
  lazyOnce("SwiperSlider",      '[data-swiper-group="2"]',       initSwiperSlider);

  // Per-element WebGL — safeInit so hero instances start before scroll.
  safeInit("MetalShader", '[data-metal]', () =>
    document.querySelectorAll('[data-metal]').forEach(initMetalShader)
  );
}

function bootStudioQuaglio() {
  if (typeof Lenis !== "undefined") initLenis();

  safeInit("Preloader",          '.preloader',              initPreloader);
  safeInit("NavAnimation",       '[data-theme-nav="true"]', initNavAnimation);
  safeInit("SplitTextAndReveal", '[split-heading]:not([hero]), [split-body]:not([hero]), [reveal-block]', initSplitTextAndReveal);
}

// Run immediately if the DOM is already parsed (the script may be injected
// asynchronously, after DOMContentLoaded has already fired).
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootStudioQuaglio);
} else {
  bootStudioQuaglio();
}


// ============================================
// LENIS
// ============================================
function initLenis() {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}


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
    window.setTimeout(initAllScripts, 0);
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


// TIMEZONE NAV
// ============================================
(() => {
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
})();


// SVG FILL LOOP
// ============================================
(() => {
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

  function init() {
    getAnimatedSvgs().forEach(svg => {
      if (svg.__fillLoopStarted) return;
      svg.__fillLoopStarted = true;
      loopSvg(svg);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  new MutationObserver(() => init()).observe(document.body, { childList: true, subtree: false });
})();


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

/*
// CHART JS 
// ============================================

(function() {
  let chartInstance = null;
  
  function colourFor(score) {
    if (score <= 1) return '#C8342B';
    if (score <= 3) return '#E87A3A';
    return '#4A9E5C';
  }
  
  function renderResults() {
    const resultStep = document.querySelector('[sf-step="result"]');
    if (!resultStep) return;
    if (window.getComputedStyle(resultStep).display === 'none') return;
    
    const getScore = (name) => {
      const el = document.querySelector('[data-score-holder="' + name + '"]');
      return el ? parseInt(el.textContent, 10) || 0 : 0;
    };
    
    const scores = {
      total:      getScore('total'),
      reputation: getScore('reputation'),
      buyer:      getScore('buyer'),
      proof:      getScore('proof'),
      inbound:    getScore('inbound')
    };
    
    const pct = {
      total:      Math.round((scores.total / 16) * 100),
      reputation: Math.round((scores.reputation / 4) * 100),
      buyer:      Math.round((scores.buyer / 4) * 100),
      proof:      Math.round((scores.proof / 4) * 100),
      inbound:    Math.round((scores.inbound / 4) * 100)
    };
    
    const centreEl = resultStep.querySelector('.chart-total-pct');
    if (centreEl) centreEl.textContent = pct.total + '%';
    
    ['reputation', 'buyer', 'proof', 'inbound'].forEach(cat => {
      const el = resultStep.querySelector('[data-category="' + cat + '"]');
      if (el) el.textContent = pct[cat] + '%';
    });
    
    const canvas = resultStep.querySelector('.result-donut');
    if (!canvas || typeof Chart === 'undefined') return;
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Reputation vs Reality', 'Buyer Recognition', 'Proof & Credibility', 'Inbound Quality'],
        datasets: [{
          data: [pct.reputation, pct.buyer, pct.proof, pct.inbound],
          backgroundColor: [
            colourFor(scores.reputation),
            colourFor(scores.buyer),
            colourFor(scores.proof),
            colourFor(scores.inbound)
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ctx.label + ': ' + ctx.parsed + '%' }
          }
        }
      }
    });
  }
  
  function startWatching() {
    const resultStep = document.querySelector('[sf-step="result"]');
    if (!resultStep) {
      setTimeout(startWatching, 200);
      return;
    }
    
    const observer = new MutationObserver(() => {
      clearTimeout(window._resultRenderTimer);
      window._resultRenderTimer = setTimeout(renderResults, 300);
    });
    
    observer.observe(resultStep, { attributes: true, attributeFilter: ['style', 'class'] });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWatching);
  } else {
    startWatching();
  }
})();
*/

// Form modal ([form-open] / [form-wrap])
// ============================================
/*
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
    tl.to(bg, { autoAlpha: 1, duration: 0.5, ease: "osmo" }, 0)
      .to(inner, { x: "0%", duration: 0.65, ease: "osmo" }, "-=0.15");
  }

  function closeForm() {
    const tl = gsap.timeline({
      onComplete: () => gsap.set(wrap, { autoAlpha: 0, pointerEvents: "none" }),
    });
    tl.to(inner, { x: "100%", duration: 0.5, ease: "energy" }, 0)
      .to(bg, { autoAlpha: 0, duration: 0.4, ease: "energy" }, 0.1);
  }

  openers.forEach((el) => el.addEventListener("click", openForm));
  closers.forEach((el) => el.addEventListener("click", closeForm));
  bg.addEventListener("click", closeForm);

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
*/


// ============================================
// METAL SHADER
// Usage: add data-metal (or data-metal="gold" / "bronze" / "silver" / "dark")
//        to any div in Webflow. The canvas overlays the element; set the div
//        to position:relative (or leave it — the script handles it).
// ============================================
function initMetalShader(el) {
  // Port of the "Plasma" effect from metal.jakubantalik.com: four sine bands
  // warped by a simplex-noise FBM field, mapped through a 5-stop colour palette.
  const VERT = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2  u_resolution;
    uniform float u_time;
    uniform vec3  u_color1, u_color2, u_color3, u_color4, u_color5;
    uniform float u_intensity, u_scale, u_direction, u_distortion, u_complexity;
    uniform float u_vignette, u_vigOpacity, u_blur, u_shaderOpacity;

    vec3 mod289(vec3 x)   { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x)  { return mod289((x * 34.0 + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
      i = mod289v2(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m; m = m * m;
      vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x_) - 0.5;
      vec3 ox = floor(x_ + 0.5);
      vec3 a0 = x_ - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p, float oct) {
      float val = 0.0, amp = 0.5;
      int n = int(oct);
      for (int i = 0; i < 7; i++) {
        if (i >= n) break;
        val += amp * snoise(p);
        p *= 2.0; amp *= 0.5;
      }
      return val;
    }

    float nfbm(vec2 p) { return fbm(p, 3.0 + u_complexity * 4.0); }

    vec3 palette(float t) {
      t = clamp(t, 0.0, 1.0);
      t = t * t * (3.0 - 2.0 * t);
      float k = 64.0;
      float w1 = exp(-k * t * t);
      float w2 = exp(-k * (t - 0.25) * (t - 0.25));
      float w3 = exp(-k * (t - 0.5)  * (t - 0.5));
      float w4 = exp(-k * (t - 0.75) * (t - 0.75));
      float w5 = exp(-k * (t - 1.0)  * (t - 1.0));
      float total = w1 + w2 + w3 + w4 + w5 + 0.0001;
      return (u_color1 * w1 + u_color2 * w2 + u_color3 * w3 +
              u_color4 * w4 + u_color5 * w5) / total;
    }

    vec2 warp(vec2 p, float t) {
      float str = u_distortion * 2.0;
      return vec2(
        nfbm(p + vec2(t * 0.1, 0.0)),
        nfbm(p + vec2(0.0, t * 0.12) + 5.0)
      ) * str;
    }

    vec3 computeEffect(vec2 uv, float aspect, float t) {
      vec2 p = (uv - 0.5) * u_scale;
      p.x *= aspect;
      p += vec2(cos(u_direction), sin(u_direction)) * t * 0.15;
      float freq = 3.0 + u_complexity * 8.0;
      float val = 0.0;
      val += sin(p.x * freq + t);
      val += sin(p.y * freq + t * 1.3);
      val += sin((p.x + p.y) * freq * 0.7 + t * 0.7);
      val += sin(length(p) * freq * 0.8 - t * 1.5);
      vec2 w = warp(p, t);
      val += (w.x + w.y) * u_distortion;
      val = val * 0.2 * u_intensity + 0.5;
      return palette(clamp(val, 0.0, 1.0));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float aspect = u_resolution.x / u_resolution.y;
      float t = u_time;

      vec3 col;
      if (u_blur < 0.01) {
        col = computeEffect(uv, aspect, t);
      } else {
        float r = u_blur * 0.02;
        col  = computeEffect(uv,                 aspect, t) * 0.4;
        col += computeEffect(uv + vec2( r, 0.0), aspect, t) * 0.15;
        col += computeEffect(uv + vec2(-r, 0.0), aspect, t) * 0.15;
        col += computeEffect(uv + vec2(0.0,  r), aspect, t) * 0.15;
        col += computeEffect(uv + vec2(0.0, -r), aspect, t) * 0.15;
      }

      col = pow(col, vec3(1.3));

      float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
      float vigPx = 40.0 / min(u_resolution.x, u_resolution.y);
      float vigRange = vigPx * (1.0 + u_vignette * 3.0);
      float vig = edgeDist * edgeDist / (vigRange * vigRange);
      vig = smoothstep(0.0, 1.0, vig);
      col *= mix(1.0, vig, u_vignette * u_vigOpacity);

      gl_FragColor = vec4(col, u_shaderOpacity);
    }
  `;

  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }

  // Faithful preset values pulled from the reference site (dark mode).
  const PRESETS = {
    chromatic: { colors: ["#000000","#aae8ff","#c5fe9e","#f7888d","#0d0d0d"], intensity: 2, scale: 1.6, direction: 80, distortion: 0.3, complexity: 0.68, vignette: 0.26, vigOpacity: 0.6, blur: 1, shaderOpacity: 1,    speed: 1.2 },
    silver:    { colors: ["#000000","#dedede","#747270","#e5e5e5","#0d0d0d"], intensity: 2, scale: 2.5, direction: 80, distortion: 0.3, complexity: 0.68, vignette: 0.26, vigOpacity: 0.6, blur: 1, shaderOpacity: 0.88, speed: 1.2 },
    gold:      { colors: ["#000000","#ffffff","#ffffff","#f7d488","#0d0d0d"], intensity: 2, scale: 2.5, direction: 80, distortion: 0.3, complexity: 0.68, vignette: 0.26, vigOpacity: 0.6, blur: 1, shaderOpacity: 0.92, speed: 1   },
  };
  PRESETS.chrome = PRESETS.silver; // alias

  const preset   = PRESETS[el.dataset.metal] || PRESETS.chromatic;
  const borderPx = parseInt(el.getAttribute("data-metal-border") || "0") || 0;
  const isBorder = borderPx > 0;

  const canvas = document.createElement("canvas");
  if (isBorder) {
    // Metal fills a rectangle borderPx larger than the element on every side,
    // then a centered hole the exact size of the element is masked out, so only
    // a borderPx-wide metallic rim around the outside edge remains visible. No
    // backing element or background colour needed — the centre stays transparent.
    const hole = `linear-gradient(#000 0 0) center / calc(100% - ${borderPx * 2}px) calc(100% - ${borderPx * 2}px) no-repeat`;
    const full = `linear-gradient(#000 0 0) 0 0 / 100% 100% no-repeat`;
    canvas.style.cssText =
      `position:absolute;inset:-${borderPx}px;pointer-events:none;z-index:-1;` +
      `-webkit-mask:${full},${hole};-webkit-mask-composite:xor;` +
      `mask:${full},${hole};mask-composite:exclude;`;
  } else {
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";
  }
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  if (isBorder) {
    el.style.width = "fit-content";
    // Match the element's rounded corners so the rim follows a pill / radius.
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    if (radius) canvas.style.borderRadius = (radius + borderPx) + "px";
  }
  el.prepend(canvas);

  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
  if (!gl) return;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const u    = (name) => gl.getUniformLocation(prog, name);
  const uTime = u("u_time");
  const uRes  = u("u_resolution");

  gl.uniform3fv(u("u_color1"), hexToRgb(preset.colors[0]));
  gl.uniform3fv(u("u_color2"), hexToRgb(preset.colors[1]));
  gl.uniform3fv(u("u_color3"), hexToRgb(preset.colors[2]));
  gl.uniform3fv(u("u_color4"), hexToRgb(preset.colors[3]));
  gl.uniform3fv(u("u_color5"), hexToRgb(preset.colors[4]));
  gl.uniform1f(u("u_intensity"),     preset.intensity);
  gl.uniform1f(u("u_scale"),         preset.scale);
  gl.uniform1f(u("u_direction"),     preset.direction * Math.PI / 180);
  gl.uniform1f(u("u_distortion"),    preset.distortion);
  gl.uniform1f(u("u_complexity"),    preset.complexity);
  gl.uniform1f(u("u_vignette"),      preset.vignette);
  gl.uniform1f(u("u_vigOpacity"),    preset.vigOpacity);
  gl.uniform1f(u("u_blur"),          preset.blur);
  gl.uniform1f(u("u_shaderOpacity"), preset.shaderOpacity);

  const dpr = Math.min(devicePixelRatio, 2);
  const ro = new ResizeObserver(() => {
    canvas.width  = (el.offsetWidth  + borderPx * 2) * dpr;
    canvas.height = (el.offsetHeight + borderPx * 2) * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  });
  ro.observe(el);

  const t0 = performance.now();
  let raf = null;

  function tick() {
    gl.uniform1f(uTime, (performance.now() - t0) / 1000 * preset.speed);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(tick);
  }

  // Pause RAF when the canvas scrolls out of view.
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { if (!raf) tick(); }
    else { cancelAnimationFrame(raf); raf = null; }
  });
  io.observe(canvas);
}