// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(CustomEase, ScrollTrigger, Observer);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;
let colorflowPreloadIframe = null;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", e => (reducedMotion = e.matches));
rmMQ.addListener?.(e => (reducedMotion = e.matches)); 

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("osmo", "0.625, 0.05, 0, 1");
gsap.defaults({ ease: "osmo", duration: durationDefault });


// -----------------------------------------
// WELCOMING WORDS LOADER — boot gate
// -----------------------------------------
// `pageReady` resolves once every page script has been wired up and
// ScrollTrigger has been refreshed (see the end of initAfterEnterFunctions).
// The welcoming-words overlay keeps itself on top until this resolves, so the
// whole page boots behind the loader and nothing has to initialise while the
// user scrolls.
let _markPageReady = null;
const pageReady = new Promise((resolve) => { _markPageReady = resolve; });
function markPageReady() {
  if (_markPageReady) { _markPageReady(); _markPageReady = null; }
}

// Safety net: never let the overlay hang if something in the boot chain throws.
window.addEventListener("load", () => setTimeout(markPageReady, 2000), { once: true });

// Start the loader before anything else — it shows the overlay immediately and
// only lifts it once both the words have cycled AND the page reports ready.
initWelcomingWordsLoader();


// -----------------------------------------
// MOBILE: SKIP SPLITTEXT
// -----------------------------------------
// On phones, splitting headings/body into chars/words/lines is the slowest part
// of first paint and the per-character motion is barely visible on a small
// screen. Below this breakpoint every text block animates in as ONE piece
// (autoAlpha + a small rise) instead of being split. Adjust the width to taste.
const NO_SPLIT_MQ = window.matchMedia("(max-width: 767px)");
function splitTextEnabled() { return !NO_SPLIT_MQ.matches; }


// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  // Runs once on first load
  if (has('[data-button-animate-chars]'))   initButtonCharacterStagger();
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;

  // Hide colorflow iframe during transition so it loads invisibly in the background
  const colorflowIframe = nextPage.querySelector('iframe[src*="colorflow"]');
  if (colorflowIframe) {
    colorflowIframe.style.transition = 'none';
    colorflowIframe.style.opacity = '0';
  }
}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  // Idempotent per container: Barba runs `once` (not `afterEnter`) on first
  // load and `afterEnter` (not `once`) on every later navigation, so we call
  // this from BOTH — the flag stops it ever running twice for the same page.
  if (nextPage.__sqInit) return;
  nextPage.__sqInit = true;

  // Runs after enter animation completes
  // if (has('[data-something]')) initSomething();
    // Runs after enter animation completes
  if (document.querySelector('[data-theme-nav="true"]'))    initNavAnimation();
  if (has('[split-heading]:not([hero]), [split-body]:not([hero]), [reveal-block]')) initSplitTextAndReveal();
  if (has('[data-hero-parallax]'))                initHeroParallax();
  if (has('[data-parallax="trigger"]'))           initGlobalParallax();
  if (has('[data-swiper-group="1"] .swiper'))     initTestimonialSlider();
  if (has('[data-swiper-group="2"]'))             initSwiperSlider();
  if (has('[data-accordion-css-init]'))           initAccordionCSS();
  if (has('[data-draggable-marquee-init]'))       initDraggableMarquee();


  // Reveal colorflow iframe now that WebGL has had the transition duration to initialise
  const colorflowIframe = nextPage.querySelector('iframe[src*="colorflow"]');
  if (colorflowIframe) colorflowIframe.style.opacity = '1';

  if(hasLenis){
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }

  // Everything for this page is now wired up and positions are measured.
  // Tell the welcoming-words loader it's safe to lift the overlay.
  markPageReady();
}


// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

function runLoadAnimations(container) {
  const hasSplitText = typeof window.SplitText !== "undefined";
  if (hasSplitText) gsap.registerPlugin(SplitText);

  const root = container || document;
  const loadEls = Array.from(root.querySelectorAll("[data-load]"));
  if (!loadEls.length) return gsap.timeline();

  // Group elements by their data-load order value
  const groups = {};
  loadEls.forEach(el => {
    const order = parseInt(el.getAttribute("data-load"), 10) || 0;
    if (!groups[order]) groups[order] = [];
    groups[order].push(el);
  });

  const sortedOrders = Object.keys(groups).map(Number).sort((a, b) => a - b);

  // Set initial hidden states immediately so elements aren't visible before animation
  loadEls.forEach(el => {
    if (hasSplitText && splitTextEnabled() && el.hasAttribute("split-heading")) {
      const split = new SplitText(el, {
        type: "chars,words",
        mask: "chars",
        maskClass: "char-mask",
        charsClass: "is-split-char",
        wordsClass: "is-split-word"
      });
      gsap.set(el, { overflow: "hidden", position: "relative", autoAlpha: 1 });
      gsap.set(split.chars, { yPercent: 120, autoAlpha: 0 });
      el._loadSplit = split;
    } else if (el.hasAttribute("split-heading")) {
      // Mobile / no SplitText: reveal the whole heading as one piece.
      gsap.set(el, { autoAlpha: 0, yPercent: 20 });
    } else if (el.hasAttribute("reveal-block")) {
      gsap.set(el, { clipPath: "inset(0 100% 0 0)", willChange: "clip-path" });
    }
  });

  const masterTl = gsap.timeline();

  sortedOrders.forEach(order => {
    const groupTl = gsap.timeline();

    groups[order].forEach(el => {
      if (el._loadSplit) {
        groupTl.to(el._loadSplit.chars, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "osmo",
          stagger: { each: 0.01, from: "start" }
        }, 0);
      } else if (el.hasAttribute("split-heading")) {
        // Mobile / no SplitText: animate the whole heading in.
        groupTl.to(el, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.8,
          ease: "osmo"
        }, 0);
      } else if (el.hasAttribute("reveal-block")) {
        groupTl.to(el, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "osmo"
        }, 0);
      }
    });

    masterTl.add(groupTl);
  });

  return masterTl;
}

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();

  tl.call(() => {
    resetPage(next)
  }, null, 0);

  tl.add(runLoadAnimations(next));

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

barba.hooks.before(data => {
  // Preload colorflow as early as possible so WebGL has the full transition to initialise.
  // opacity:0 (not display:none) lets the GPU actually create the WebGL context.
  const parser = new DOMParser();
  const nextDoc = parser.parseFromString(data.next.html, 'text/html');
  const nextColorflow = nextDoc.querySelector('iframe[src*="colorflow"]');

  if (nextColorflow) {
    colorflowPreloadIframe = document.createElement('iframe');
    colorflowPreloadIframe.src = nextColorflow.src;
    Object.assign(colorflowPreloadIframe.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '-1',
    });
    document.body.appendChild(colorflowPreloadIframe);
  }
});

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
  if(hasScrollTrigger){
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});

barba.hooks.enter(data => {
  initBarbaNavUpdate(data);
})

barba.hooks.afterEnter(data => {
  // Remove the preload iframe now that the real colorflow in the new container is live
  if (colorflowPreloadIframe) {
    colorflowPreloadIframe.remove();
    colorflowPreloadIframe = null;
  }

  // Run page functions
  initAfterEnterFunctions(data.next.container);

  // Settle
  if(hasLenis){
    lenis.resize();
    lenis.start();
  }

  if(hasScrollTrigger){
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
      
      // First load. Barba does NOT fire afterEnter here, so wire up every page
      // script now — this is what runs behind the welcoming-words overlay and
      // what resolves `pageReady`, so the loader lifts the instant it's done.
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

function resetPage(container){
  window.scrollTo(0, 0);
  gsap.set(container, { clearProps: "position,top,left,right" });
  
  if(hasLenis){
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


// ============================================
// WELCOMING WORDS LOADER ([data-loading-container])
// ============================================
// Runs first, on top of everything. The loader always plays its FULL designed
// animation — intro reveal, then every word in turn, then the outro. Page setup
// happens concurrently behind the overlay; `pageReady` only gates the outro, so
// we never reveal the page before it's wired up. Because the Barba lifecycle
// fix makes setup resolve quickly, `pageReady` is virtually always ready before
// the words finish, so this adds no extra wait — the animation just completes.
async function initWelcomingWordsLoader() {
  const loadingContainer = document.querySelector('[data-loading-container]');
  if (!loadingContainer) { markPageReady(); return; } // no loader on this page

  const loadingWords = loadingContainer.querySelector('[data-loading-words]');
  const wordsTarget  = loadingWords && loadingWords.querySelector('[data-loading-words-target]');
  if (!loadingWords || !wordsTarget) { markPageReady(); return; }

  const words = (loadingWords.getAttribute('data-loading-words') || '')
    .split(',').map((w) => w.trim()).filter(Boolean);

  // Keep the page frozen under the overlay while it boots.
  if (hasLenis && lenis) lenis.stop();

  // Reduced motion: skip the choreography, just hold until the page is ready.
  if (reducedMotion) {
    wordsTarget.textContent = words[words.length - 1] || wordsTarget.textContent;
    await pageReady;
    gsap.set(loadingContainer, { autoAlpha: 0, display: "none" });
    if (hasLenis && lenis) lenis.start();
    settleScrollTriggers();
    return;
  }

  // The preloader is already visible (styled visible-by-default in Webflow), so
  // DON'T reset it here. Setting opacity:0 / yPercent on start yanked the
  // already-shown words to invisible the moment this late-loading script ran —
  // that hard reset after a delay is the abrupt "state change" flash. Instead,
  // pick up from the visible state and just cycle the words, then play the outro.
  const intro = gsap.timeline();
  words.forEach((word) => {
    intro.call(() => { wordsTarget.textContent = word; }, null, '+=0.2');
  });
  if (words.length) intro.to({}, { duration: 0.2 }); // let the last word breathe

  // Let the whole animation finish AND make sure the page is ready to reveal.
  await Promise.all([intro, pageReady]);

  // Lift the overlay.
  if (hasLenis && lenis) lenis.stop();
  await gsap.timeline()
    .to(loadingWords, { opacity: 0, yPercent: -75, duration: 0.8, ease: "Expo.easeIn" })
    .to(loadingContainer, { autoAlpha: 0, duration: 0.6, ease: "Power1.easeInOut" }, "-=0.2");

  loadingContainer.style.display = "none";
  if (hasLenis && lenis) lenis.start();

  // The page is now fully laid out, fonts/images loaded, scroll re-enabled.
  // Recompute every ScrollTrigger's start/end — the nav-theme, parallax and
  // reveal triggers were first measured while the overlay was up and the layout
  // wasn't final, so without this the nav theme flips at the wrong scroll spots.
  settleScrollTriggers();
}

// Re-measure all ScrollTriggers after Lenis has had a frame to settle, then
// re-assert the nav theme for whatever section is currently in view.
function settleScrollTriggers() {
  if (!hasScrollTrigger) return;
  requestAnimationFrame(() => {
    if (hasLenis && lenis) lenis.resize();
    ScrollTrigger.refresh();
  });
}


// ============================================
// NAV ANIMATION
// ============================================
function initNavAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Use [data-theme-nav] not [data-theme-nav="true"] — applyThemeFrom changes
  // the value to "dark"/"light" before this runs, so "true" never matches again
  const nav = document.querySelector('[data-theme-nav]');
  if (!nav) return;

  const getThemeForSection = (section) => {
    if (section.classList.contains("u-theme-dark"))  return "u-theme-light";
    if (section.classList.contains("u-theme-light")) return "u-theme-dark";
    return null;
  };

  const applyNavTheme = (theme) => {
    if (!theme) return;
    nav.classList.remove("u-theme-dark", "u-theme-light");
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
      onEnter:     () => applyNavTheme(theme),
      onEnterBack: () => applyNavTheme(theme),
    });
  });

  ScrollTrigger.refresh();
  requestAnimationFrame(() => {
    const y = window.innerHeight * 0.05;
    const active = [...sections].find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    if (active) applyNavTheme(getThemeForSection(active));
  });
}


// ============================================
// SPLIT TEXT + REVEAL BLOCK ANIMATIONS
// ============================================
function initSplitTextAndReveal() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const hasSplitText = typeof window.SplitText !== "undefined";
  if (hasSplitText) gsap.registerPlugin(SplitText);

  // Mobile / no-SplitText: reveal the whole element as one piece instead of
  // splitting it into chars/words/lines.
  function setupWhole(el, start) {
    const delayAttr  = parseFloat(el.getAttribute("data-split-delay")) || 0;
    const isLoadAnim = el.getAttribute("data-split-load") === "true";

    gsap.set(el, { autoAlpha: 0, yPercent: 20 });

    const tl = gsap.timeline(
      isLoadAnim
        ? {}
        : { scrollTrigger: { trigger: el, start, toggleActions: "play none none none" } }
    );

    tl.to(el, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "osmo", delay: delayAttr });
  }

  function setupHeading(heading) {
    if (!hasSplitText || !splitTextEnabled()) { setupWhole(heading, "clamp(top 80%)"); return; }

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

  function setupBody(body) {
    if (!hasSplitText || !splitTextEnabled()) { setupWhole(body, "clamp(top 85%)"); return; }

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

  function setupRevealBlock(block) {
    const delayAttr  = parseFloat(block.getAttribute("data-reveal-delay")) || 0.2;
    const isLoadAnim = block.getAttribute("data-reveal-load") === "true";

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

  const lazyEach = (selector, perEl, rootMargin = "600px 0px") => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(el => { try { perEl(el); } catch {} }); return; }
    const pending = [];
    let draining = false;
    function drain() {
      if (draining) return;
      draining = true;
      (function step() {
        const el = pending.shift();
        if (!el) { draining = false; return; }
        try { perEl(el); } catch {}
        window.setTimeout(step, 0);
      })();
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (!entry.isIntersecting) return; io.unobserve(entry.target); pending.push(entry.target); });
      drain();
    }, { rootMargin });
    els.forEach((el) => io.observe(el));
  };

  // setupHeading/setupBody handle both the split and whole-element (mobile /
  // no-SplitText) paths themselves, so always observe them.
  lazyEach("[split-heading]:not([hero]):not([data-load])", setupHeading);
  lazyEach("[split-body]:not([hero]):not([data-load])",    setupBody);
  lazyEach("[reveal-block]:not([data-load])", setupRevealBlock);
}


// ============================================
// HERO PARALLAX
// ============================================
function initHeroParallax() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(max-width: 991px)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("[data-hero-parallax]").forEach(el => {
    const inner = el.querySelector("[data-hero-parallax-inner]");
    const dark  = el.querySelector("[data-hero-parallax-dark]");
    if (!inner && !dark) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top top)",
        end: "clamp(bottom top)",
        scrub: true
      }
    });

    if (inner) tl.to(inner, { yPercent: 25, ease: "linear" });
    if (dark)  tl.to(dark,  { opacity: 0.5, ease: "linear" }, "<");
  });
}


// ============================================
// GLOBAL PARALLAX
// ============================================
function initGlobalParallax() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

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

          const target      = trigger.querySelector('[data-parallax="target"]') || trigger;
          const direction   = trigger.getAttribute("data-parallax-direction") || "vertical";
          const prop        = direction === "horizontal" ? "xPercent" : "yPercent";
          const scrubAttr   = trigger.getAttribute("data-parallax-scrub");
          const scrub       = scrubAttr ? parseFloat(scrubAttr) : true;
          const startVal    = trigger.getAttribute("data-parallax-start")  !== null ? parseFloat(trigger.getAttribute("data-parallax-start"))  : 20;
          const endVal      = trigger.getAttribute("data-parallax-end")    !== null ? parseFloat(trigger.getAttribute("data-parallax-end"))    : -20;
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
// TESTIMONIAL SLIDER
// ============================================
function initTestimonialSlider() {
  if (typeof Swiper === "undefined") return;
  if (typeof window.SplitText === "undefined") return;
  if (!window.gsap) return;

  const swiperEl = document.querySelector('[data-swiper-group="1"] .swiper');
  if (!swiperEl) return;

  gsap.registerPlugin(SplitText);

  const originalSlideCount = swiperEl.querySelectorAll(".swiper-wrapper > .swiper-slide").length;
  const splitCache = new Map();

  function initSplits(slides) {
    slides.forEach((slide) => {
      if (splitCache.has(slide)) return;
      const quoteEl   = slide.querySelector('[data-split="quote"]');
      const nameEl    = slide.querySelector('[data-split="name"]');
      const roleEl    = slide.querySelector('[data-split="role"]');
      const profileEl = slide.querySelector(".test_profile_wrap");
      // Keep raw element refs so the animations can fall back to whole-element
      // (mobile / no-SplitText) without splitting.
      const splits    = { profileEl, quoteEl, nameEl, roleEl };
      const doSplit   = (typeof SplitText !== "undefined") && splitTextEnabled();

      if (quoteEl) {
        gsap.set(quoteEl, { opacity: 1 });
        if (doSplit) {
          splits.quote = new SplitText(quoteEl, { type: "lines,words", mask: "lines", maskClass: "line-mask" });
          gsap.set(splits.quote.words, { opacity: 0, y: 30 });
        } else {
          gsap.set(quoteEl, { opacity: 0, y: 30 });
        }
      }
      if (nameEl) {
        gsap.set(nameEl, { opacity: 1 });
        if (doSplit) {
          splits.name = new SplitText(nameEl, { type: "chars", mask: "chars", maskClass: "char-mask" });
          gsap.set(splits.name.chars, { opacity: 0, y: 10 });
        } else {
          gsap.set(nameEl, { opacity: 0, y: 10 });
        }
      }
      if (roleEl) {
        gsap.set(roleEl, { opacity: 1 });
        if (doSplit) {
          splits.role = new SplitText(roleEl, { type: "words", mask: "words", maskClass: "word-mask" });
          gsap.set(splits.role.words, { opacity: 0, y: 10 });
        } else {
          gsap.set(roleEl, { opacity: 0, y: 10 });
        }
      }
      if (profileEl) gsap.set(profileEl, { opacity: 0, y: 20, scale: 0.95 });

      splitCache.set(slide, splits);
    });
  }

  function animateIn(slide) {
    const splits = splitCache.get(slide);
    if (!splits) return;
    // Split targets when available, else the whole element (mobile / no-split).
    const quoteT = splits.quote ? splits.quote.words : splits.quoteEl;
    const nameT  = splits.name  ? splits.name.chars  : splits.nameEl;
    const roleT  = splits.role  ? splits.role.words  : splits.roleEl;
    const targets = [splits.profileEl, quoteT, nameT, roleT].filter(Boolean);
    gsap.killTweensOf(targets);
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "osmo" } });
    if (splits.profileEl) tl.fromTo(splits.profileEl, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1 }, 0);
    if (quoteT) tl.fromTo(quoteT, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.02 }, 0.05);
    if (nameT)  tl.fromTo(nameT,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.01 }, "-=0.3");
    if (roleT)  tl.fromTo(roleT,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.03 }, "-=0.3");
  }

  function animateOut(slide) {
    const splits = splitCache.get(slide);
    if (!splits) return;
    const quoteT = splits.quote ? splits.quote.words : splits.quoteEl;
    const nameT  = splits.name  ? splits.name.chars  : splits.nameEl;
    const roleT  = splits.role  ? splits.role.words  : splits.roleEl;
    const targets = [splits.profileEl, quoteT, nameT, roleT].filter(Boolean);
    gsap.killTweensOf(targets);
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "energy" } });
    if (roleT)  tl.to(roleT,  { opacity: 0, y: 10, stagger: { each: 0.03, from: "end" } }, 0);
    if (nameT)  tl.to(nameT,   { opacity: 0, y: 10, stagger: { each: 0.01, from: "end" } }, 0.05);
    if (quoteT) tl.to(quoteT,  { opacity: 0, y: 30, stagger: { each: 0.02, from: "end" } }, 0.1);
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
  const accordions = document.querySelectorAll('[data-accordion-css-init]');
  if (!accordions.length) return;

  accordions.forEach((accordion) => {
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
// DRAGGABLE MARQUEE
// ============================================
function initDraggableMarquee() {
  if (!window.gsap || !window.ScrollTrigger || !window.Observer) return;

  gsap.registerPlugin(ScrollTrigger, Observer);

  const wrappers = document.querySelectorAll("[data-draggable-marquee-init]");
  if (!wrappers.length) return;

  const getNumberAttr = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };

  wrappers.forEach((wrapper) => {
    if (wrapper.getAttribute("data-draggable-marquee-init") === "initialized") return;

    const collection = wrapper.querySelector("[data-draggable-marquee-collection]");
    const list       = wrapper.querySelector("[data-draggable-marquee-list]");
    if (!collection || !list) return;

    const duration    = getNumberAttr(wrapper, "data-duration",    20);
    const multiplier  = getNumberAttr(wrapper, "data-multiplier",  40);
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
          .to(timeScale, { value: restingDirection,  duration: 1.0 });
      }
    });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter:     () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onEnterBack: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onLeave:     () => { marqueeLoop.pause();  marqueeObserver.disable(); },
      onLeaveBack: () => { marqueeLoop.pause();  marqueeObserver.disable(); },
    });

    wrapper.setAttribute("data-draggable-marquee-init", "initialized");
  });
}


// ============================================
// BUTTON CHARACTER STAGGER
// ============================================
function initButtonCharacterStagger() {
  const buttons = document.querySelectorAll('[data-button-animate-chars]');
  if (!buttons.length) return;

  const offsetIncrement = 0.01;

  buttons.forEach(button => {
    const text = button.textContent;
    button.innerHTML = '';

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;
      if (char === ' ') span.style.whiteSpace = 'pre';
      button.appendChild(span);
    });
  });
}


// ============================================
// SWIPER SLIDER ([data-swiper-group="2"])
// ============================================
function initSwiperSlider() {
  if (typeof Swiper === "undefined") return;

  const groups = document.querySelectorAll('[data-swiper-group="2"]');
  if (!groups.length) return;

  const cssBezier = "cubic-bezier(0.16, 0, 0.3, 1)";

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