// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(CustomEase, ScrollTrigger, Observer);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;
let colorflowPreloadIframe = null;

// Resolves when the first-load preloader lifts (or immediately when there's no
// preloader). runPageOnceAnimation awaits this so the page entrance + [data-load]
// reveal play AS the loader lifts, instead of finishing hidden behind it.
let resolvePreloaderDone;
const preloaderDone = new Promise((resolve) => { resolvePreloaderDone = resolve; });

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
// SCROLLTRIGGER SETTLE
// -----------------------------------------
// Re-measure all ScrollTriggers once the page is fully loaded — fonts/images can
// reflow section heights after first paint, and the nav-theme / parallax /
// reveal triggers are first measured early during boot. Without this the nav
// theme can flip at the wrong scroll positions. (See settleScrollTriggers.)
window.addEventListener("load", () => settleScrollTriggers(), { once: true });


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
  initColorflowPrewarm(); // hover-prewarm colorflow before navigation (binds once)
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
  if (document.querySelector('[data-theme-nav]'))           initNavAnimation();
  if (has('[split-heading]:not([hero]), [split-body]:not([hero]), [reveal-block]')) initSplitTextAndReveal();
  if (has('[data-hero-parallax]'))                initHeroParallax();
  if (has('[data-parallax="trigger"]'))           initGlobalParallax();
  if (has('[data-swiper-group="1"] .swiper'))     initTestimonialSlider();
  if (has('[data-swiper-group="2"]'))             initSwiperSlider();
  if (has('[data-accordion-css-init]'))           initAccordionCSS();
  if (has('[data-draggable-marquee-init]'))       initDraggableMarquee();
  if (has('[data-cal-inline]'))                   initCalEmbeds(nextPage);
  if (has('[data-scroll-next-wrap]'))             initScrollToNextPage();


  // Colorflow is faded in by the page-enter animations (runPageOnceAnimation on
  // first load, runPageLeaveAnimation on navigation), not here — so it animates
  // from 0 opacity during the transition instead of popping in afterward.

  if(hasLenis){
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
    // Images in the new container load after this refresh and change heights —
    // re-measure once they're in so scroll-triggers aren't left on a stale,
    // too-short layout (which makes scroll-to-next fire on the first scroll).
    refreshOnImages(nextPage);
  }
}


// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

// [data-load] LOAD ANIMATIONS
// Split into prep (hide) + build (reveal) so a Barba navigation can hide the
// incoming page's elements early — before the transition reveals them — and then
// play the reveal timed to land just before the page transition completes. On
// first load (no leave transition) the two run back-to-back via runLoadAnimations.

// Hide every [data-load] element and stash how it should animate in. Mirrors the
// scroll-path setups: split-heading → chars, split-body → lines, reveal-block →
// clip-path; on mobile / no SplitText, split text reveals as one whole piece.
function prepLoadAnimations(root) {
  const hasSplitText = typeof window.SplitText !== "undefined";
  if (hasSplitText) gsap.registerPlugin(SplitText);

  const canSplit = hasSplitText && splitTextEnabled();
  const loadEls = Array.from((root || document).querySelectorAll("[data-load]"));

  loadEls.forEach(el => {
    el._loadOrder = parseInt(el.getAttribute("data-load"), 10) || 0;

    if (el.hasAttribute("split-heading") && canSplit) {
      const split = new SplitText(el, {
        type: "chars,words",
        mask: "chars",
        maskClass: "char-mask",
        charsClass: "is-split-char",
        wordsClass: "is-split-word"
      });
      gsap.set(el, { overflow: "hidden", position: "relative", autoAlpha: 1 });
      gsap.set(split.chars, { yPercent: 120, autoAlpha: 0 });
      el._loadAnim = { kind: "chars", split };
    } else if (el.hasAttribute("split-body") && canSplit) {
      const split = new SplitText(el, {
        type: "lines",
        mask: "lines",
        maskClass: "line-mask",
        linesClass: "is-split-line"
      });
      gsap.set(el, { overflow: "hidden", position: "relative", autoAlpha: 1 });
      gsap.set(split.lines, { yPercent: 120, autoAlpha: 0 });
      el._loadAnim = { kind: "lines", split };
    } else if (el.hasAttribute("split-heading") || el.hasAttribute("split-body")) {
      // Mobile / no SplitText: reveal the whole text block as one piece.
      gsap.set(el, { autoAlpha: 0, yPercent: 20 });
      el._loadAnim = { kind: "whole" };
    } else if (el.hasAttribute("reveal-block")) {
      // autoAlpha:1 clears the CSS [data-load] opacity:0 — the clip-path does the
      // hiding here, so without this the block would stay invisible after reveal.
      gsap.set(el, { autoAlpha: 1, clipPath: "inset(0 100% 0 0)", willChange: "clip-path" });
      el._loadAnim = { kind: "reveal-block" };
    }
  });

  return loadEls;
}

// Build the reveal timeline from the prepped elements, grouped + ordered by their
// data-load value (same order animates together; groups play in sequence).
function buildLoadAnimationsTimeline(root) {
  const masterTl = gsap.timeline();

  const loadEls = Array.from((root || document).querySelectorAll("[data-load]"))
    .filter(el => el._loadAnim);
  if (!loadEls.length) return masterTl;

  const groups = {};
  loadEls.forEach(el => {
    const order = el._loadOrder || 0;
    (groups[order] = groups[order] || []).push(el);
  });

  // How long after one group STARTS the next group begins. Groups overlap instead
  // of waiting for the previous to finish, so the whole load reads noticeably
  // faster while still cascading in order. Bump up for more spacing, down for tighter.
  const GROUP_OVERLAP = 0.15;

  Object.keys(groups).map(Number).sort((a, b) => a - b).forEach((order, index) => {
    const groupTl = gsap.timeline();

    groups[order].forEach(el => {
      const anim = el._loadAnim;
      if (anim.kind === "chars") {
        groupTl.to(anim.split.chars, {
          yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "osmo",
          stagger: { each: 0.01, from: "start" }
        }, 0);
      } else if (anim.kind === "lines") {
        groupTl.to(anim.split.lines, {
          yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "osmo",
          stagger: { each: 0.08, from: "start" }
        }, 0);
      } else if (anim.kind === "whole") {
        groupTl.to(el, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "osmo" }, 0);
      } else if (anim.kind === "reveal-block") {
        groupTl.to(el, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "osmo" }, 0);
      }
    });

    // First group at 0; each later group starts GROUP_OVERLAP after the previous
    // group's start ("<" = previous insertion's start), so they cascade + overlap.
    masterTl.add(groupTl, index === 0 ? 0 : `<${GROUP_OVERLAP}`);
  });

  return masterTl;
}

// First load: no leave transition to time against, so hide + reveal back-to-back.
function runLoadAnimations(container) {
  prepLoadAnimations(container);
  return buildLoadAnimationsTimeline(container);
}

async function runPageOnceAnimation(next) {
  // Hold the first-load entrance until the preloader lifts — otherwise the
  // colorflow + [data-load] reveal play out behind the loader and the page is
  // already static (and feels unscrollable) by the time it disappears.
  await preloaderDone;

  const tl = gsap.timeline();

  tl.call(() => {
    resetPage(next);
  }, null, 0);

  // Colorflow background is held at opacity 0 during init — fade it in on first load.
  const colorflow = next.querySelector('iframe[src*="colorflow"]');
  if (colorflow) tl.fromTo(colorflow, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "osmo" }, 0);

  // Reveal [data-load] content. The CSS [data-load] opacity:0 hides it until this
  // runs, so without it the page would load blank.
  tl.add(runLoadAnimations(next));

  return tl;
}

function runPageLeaveAnimation(current, next) {

  const tl = gsap.timeline({
    onComplete: () => {
      current.remove();
    }
  });

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    return tl.set(current, { autoAlpha: 0 });
  }

  tl.to(current, {
    autoAlpha: 0,
    ease: "power1.in",
    duration: 0.5,
  }, 0);

  return tl;
}

function runPageEnterAnimation(next){
  const tl = gsap.timeline();

  // Colorflow background is held at opacity 0 by initBeforeEnterFunctions — fade
  // it back in as the new page arrives.
  const colorflow = next.querySelector('iframe[src*="colorflow"]');

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    tl.set(next, { autoAlpha: 1 });
    if (colorflow) gsap.set(colorflow, { opacity: 1 });
    // Skips the reveal timeline, so clear the CSS [data-load] opacity:0 directly.
    gsap.set(next.querySelectorAll("[data-load]"), { autoAlpha: 1 });
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }

  tl.add("startEnter", 0);

  tl.fromTo(next, {
    autoAlpha: 0,
  }, {
    autoAlpha: 1,
    ease: "power1.inOut",
    duration: 0.75,
  }, "startEnter");

  // NOTE: the hero h1 carries data-load, so its entrance is handled by the
  // runLoadAnimations() reveal below (on first load via runPageOnceAnimation,
  // on nav via the .call here). A separate h1 tween here would race that reveal.

  if (colorflow) tl.fromTo(colorflow, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "osmo" }, "startEnter");

  // Kick off the [data-load] reveal independently (a .call, not added to the
  // timeline) so it can finish without delaying pageReady — same as before.
  tl.call(() => runLoadAnimations(next), null, "startEnter");

  tl.add("pageReady");
  tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, null, "pageReady");
  });
}


// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

barba.hooks.before(data => {
  // Fallback preload at transition start, in case a hover didn't prewarm it first
  // (e.g. keyboard nav, or a click without a preceding hover). initColorflowPrewarm
  // sets colorflowPreloadIframe earlier on intent — skip if it's already warming.
  if (colorflowPreloadIframe) return;

  // opacity:0 (not display:none) lets the GPU actually create the WebGL context.
  const parser = new DOMParser();
  const nextDoc = parser.parseFromString(data.next.html, 'text/html');
  const nextColorflow = nextDoc.querySelector('iframe[src*="colorflow"]');

  if (nextColorflow) colorflowPreloadIframe = warmColorflow(nextColorflow.src);
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
      // script now (afterEnter only runs on later navigations) — otherwise none
      // of the per-section scripts initialise on the landing page.
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
    // window.scrollTo doesn't reset Lenis's internal/target scroll, so after
    // navigating (e.g. from the bottom of a page via scroll-to-next) Lenis can
    // keep the previous page's high scroll value. That leaves scroll-triggers
    // mapped near the bottom of the new page — so a tiny scroll completes the
    // scroll-to-next and bounces you back to the top. Force Lenis back to 0.
    lenis.scrollTo(0, { immediate: true, force: true });
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

// Create a hidden, full-screen iframe pointing at a colorflow URL so the browser
// loads its bundle and the GPU builds the WebGL context ahead of time. opacity:0
// (not display:none) is required — display:none won't initialise WebGL. Returns
// the iframe so callers can track/remove it (afterEnter cleans up the active one).
function warmColorflow(src) {
  if (!src) return null;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.setAttribute('aria-hidden', 'true');
  Object.assign(iframe.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '-1',
  });
  document.body.appendChild(iframe);
  return iframe;
}

// Prewarm the colorflow BEFORE the page change: as soon as the user hovers (or
// touches) an internal link, fetch that page's HTML and, if it contains a
// colorflow iframe (e.g. the home page), start warming it — so by the time they
// click and land, its WebGL is already initialising. The barba `before` hook is
// the fallback for when there's no hover. Bound once on the document.
function initColorflowPrewarm() {
  if (window.__cfPrewarmBound) return;
  window.__cfPrewarmBound = true;

  const htmlCache = new Map(); // url -> Promise<string|null>, deduped per URL
  const fetchHtml = (url) => {
    if (!htmlCache.has(url)) {
      htmlCache.set(url, fetch(url, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null));
    }
    return htmlCache.get(url);
  };

  const onIntent = async (e) => {
    if (colorflowPreloadIframe) return; // already warming one — don't stack
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let url;
    try { url = new URL(href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;        // same-origin only
    if (url.pathname === location.pathname) return;     // not the current page

    const html = await fetchHtml(url.href);
    if (!html || colorflowPreloadIframe) return;        // re-check: a click may have warmed it

    const match = html.match(/<iframe[^>]+src=["']([^"']*colorflow[^"']*)["']/i);
    if (match) colorflowPreloadIframe = warmColorflow(match[1]);
  };

  document.addEventListener('pointerover', onIntent, { passive: true });
  document.addEventListener('touchstart', onIntent, { passive: true });
}



// -----------------------------------------
// YOUR FUNCTIONS GO BELOW HERE
// -----------------------------------------

function initWelcomingWordsLoader() {
  const loadingContainer = document.querySelector('[data-loading-container]');
  // No preloader on this page — let the page entrance run straight away.
  if (!loadingContainer) { resolvePreloaderDone(); return; }

  const loadingWords = loadingContainer.querySelector('[data-loading-words]');
  // Malformed loader markup — don't leave the entrance waiting forever.
  if (!loadingWords) { resolvePreloaderDone(); return; }

  const wordsTarget = loadingWords.querySelector('[data-loading-words-target]');
  const words = loadingWords.getAttribute('data-loading-words').split(',').map(w => w.trim());

  const tl = gsap.timeline();

  tl.set(loadingWords, {
    yPercent: 50
  });

  tl.to(loadingWords, {
    opacity: 1,
    yPercent: 0,
    duration: 1,
    ease: "Expo.easeInOut"
  });

  words.forEach(word => {
    tl.call(() => {
      wordsTarget.textContent = word;
    }, null, '+=0.15');
  });

  tl.to(loadingWords, {
    opacity: 0,
    yPercent: -75,
    duration: 0.8,
    ease: "Expo.easeIn"
  });

  tl.to(loadingContainer, {
    autoAlpha: 0,
    duration: 0.6,
    ease: "Power1.easeInOut",
    // Release the page entrance as the loader starts lifting, so the hero
    // animates in underneath the fade rather than after a blank gap.
    onStart: () => resolvePreloaderDone()
  }, "+ -0.2");
}

// Initialize Welcoming Words Loader. Guard for readyState so it still runs (and
// resolves preloaderDone) when the script loads after DOMContentLoaded has fired
// — otherwise runPageOnceAnimation's await would hang and the page never reveals.
if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', initWelcomingWordsLoader);
} else {
  initWelcomingWordsLoader();
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

// Barba doesn't fire window 'load' on navigation, so the incoming page's images
// load AFTER afterEnter's refresh and grow section heights. That leaves
// ScrollTriggers (e.g. scroll-to-next) measured against a shorter, image-less
// layout — so their start sits too high and they can fire on the first scroll.
// Re-refresh once the new container's images are actually in.
function refreshOnImages(scope) {
  if (!hasScrollTrigger) return;
  const imgs = Array.from((scope || document).querySelectorAll('img'));
  const pending = imgs.filter((img) => !img.complete);
  const settle = () => {
    if (hasLenis && lenis) lenis.resize();
    ScrollTrigger.refresh();
  };
  if (!pending.length) { settle(); return; }
  let left = pending.length;
  const done = () => { if (--left <= 0) settle(); };
  pending.forEach((img) => {
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
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
    if (section.classList.contains("u-theme-dark"))  return "u-theme-dark";
    if (section.classList.contains("u-theme-light")) return "u-theme-light";
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
    // [data-load] = animate on page load / transition only (handled by
    // prepLoadAnimations). Never attach a ScrollTrigger to these.
    if (heading.hasAttribute("data-load")) return;
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
    // [data-load] = animate on page load / transition only (handled by
    // prepLoadAnimations). Never attach a ScrollTrigger to these.
    if (body.hasAttribute("data-load")) return;
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
// CAL.COM INLINE EMBEDS (Barba-safe)
// ============================================
// Cal's official snippet runs as an inline <script> inside the page body, but
// Barba swaps page HTML via fetch and does NOT re-execute inline scripts — so on
// every navigation the calendar container arrives empty and "breaks". This moves
// the init into the Barba lifecycle (afterEnter + first load), rebuilding any Cal
// embeds in the incoming page right at the start of every page, once per element.
//
// Webflow markup contract — replace the per-page inline embed with a plain div:
//   <div data-cal-inline
//        data-cal-link="studioquaglio/diagnosis-call"
//        data-cal-namespace="diagnosis-call"
//        style="width:100%;height:100%;overflow:scroll"></div>
// (data-cal-namespace + data-cal-layout are optional; namespace defaults to the
//  cal-link, layout to "month_view".)
function initCalEmbeds(scope) {
  const root = scope || document;
  const containers = root.querySelectorAll('[data-cal-inline]');
  if (!containers.length) return;

  // Cal bootstrap — defines window.Cal and lazy-loads embed.js. Persists across
  // Barba navigations, so it only needs to run once for the whole session. Kept
  // here (not in the page) so it exists even when the first page has no embed.
  if (!window.Cal) {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
  }

  containers.forEach((container) => {
    if (container.__calInit) return; // already built this element
    container.__calInit = true;

    const calLink = container.getAttribute('data-cal-link');
    if (!calLink) { console.warn('Cal embed: [data-cal-inline] is missing data-cal-link', container); return; }

    const namespace = container.getAttribute('data-cal-namespace') || calLink;
    const layout    = container.getAttribute('data-cal-layout') || 'month_view';

    // Cal targets the embed by selector, so make sure each container has an id.
    if (!container.id) container.id = 'cal-inline-' + Math.random().toString(36).slice(2);

    // Build immediately so the calendar is ready at the start of the page.
    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.ns[namespace]("inline", {
      elementOrSelector: "#" + container.id,
      config: { layout: layout, useSlotsViewOnSmallScreen: "true" },
      calLink: calLink,
    });
    Cal.ns[namespace]("ui", { hideEventTypeDetails: false, layout: layout });
  });
}


// ============================================
// SCROLL TO NEXT PAGE
// ============================================
// Scrubbed SVG line-draw tied to scroll; when the path finishes drawing it
// clicks [data-scroll-next-link] to navigate (Barba handles the transition).
// Runs per page via the Barba lifecycle — afterLeave kills its ScrollTrigger and
// afterEnter rebuilds it — so it must NOT be bound to a one-time DOMContentLoaded.
function initScrollToNextPage() {
  const wrap = document.querySelector("[data-scroll-next-wrap]");

  if (!wrap) return;

  const link = wrap.querySelector("[data-scroll-next-link]");
  const path = wrap.querySelector("[data-scroll-next-path]");
  const bg = wrap.querySelector("[data-scroll-next-bg]");
  const overlay = wrap.querySelector("[data-scroll-next-overlay]");

  if (!link || !path) return;

  // ScrollTrigger defaults
  const start = wrap.getAttribute("data-scroll-start") || "top top";
  const end = wrap.getAttribute("data-scroll-end") || "bottom bottom";

  // Prep SVG path for line draw animation
  const pathLength = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });

  const tl = gsap.timeline({
    defaults: {
      ease: "none",
    },
    scrollTrigger: {
      trigger: wrap,
      start,
      end,
      scrub: true,
    },
  });

  tl.to(path, {
    strokeDashoffset: 0,
    onComplete: () => {
      link.click();
    }
  });

  // Optional bg scale
  if (bg) {
    tl.to(bg, { scale: 1.2 }, 0);
  }

 // Optional dark overlay animation
  if (overlay) {
    tl.to(overlay, { opacity: 0.5 }, 0);
  }

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

    // The steady-state speed/direction the marquee returns to (after a hover or a
    // drag flick). Updated by drags so "resume" honours the last flicked direction.
    let restingTimeScale = baseDirection;
    let isHovered = false;

    wrapper.setAttribute("data-direction", baseDirection < 0 ? "right" : "left");
    if (baseDirection < 0) marqueeLoop.progress(1);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
      // Don't flip the direction attribute while paused at 0 — keep the last real
      // direction so CSS tied to data-direction doesn't twitch on hover.
      if (timeScale.value !== 0) {
        wrapper.setAttribute("data-direction", timeScale.value < 0 ? "right" : "left");
      }
    }

    applyTimeScale();

    // Hover: ease the speed down to a full stop, then ease it back up to the
    // resting direction on leave. Tweened (never set) so it always glides — it
    // never snaps to a halt or jumps back to full speed. Mouse-only: touch
    // devices have no hover and use the drag Observer below instead.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) {
      wrapper.addEventListener("mouseenter", () => {
        isHovered = true;
        gsap.killTweensOf(timeScale);
        gsap.to(timeScale, { value: 0, duration: 0.8, ease: "power2.out", onUpdate: applyTimeScale });
      });
      wrapper.addEventListener("mouseleave", () => {
        isHovered = false;
        gsap.killTweensOf(timeScale);
        gsap.to(timeScale, { value: restingTimeScale, duration: 1.5, ease: "power1.inOut", onUpdate: applyTimeScale });
      });
    }

    const marqueeObserver = Observer.create({
      target: wrapper,
      type: "pointer,touch",
      // Lock to the first drag axis so a vertical swipe is ignored here and the
      // page scrolls natively (paired with touch-action: pan-y in the CSS).
      lockAxis: true,
      preventDefault: true,
      debounce: false,
      onChangeX: (observerEvent) => {
        let velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, observerEvent.velocityX * -sensitivity);
        gsap.killTweensOf(timeScale);
        const restingDirection = velocityTimeScale < 0 ? -1 : 1;
        restingTimeScale = restingDirection;
        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true })
          // If the user is still hovering after a flick, settle to a stop; the
          // marquee resumes (toward restingTimeScale) once the mouse leaves.
          .to(timeScale, { value: isHovered ? 0 : restingDirection, duration: 1.0 });
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


// ============================================
// SVG FILL LOOP
// ============================================
// Self-contained: runs on DOMContentLoaded (or immediately) and re-scans via a
// MutationObserver, so it starts early — like the preloader — and keeps running.
// Loops fill in/out across any SVG whose children carry `svg-elem-N` classes.
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


// ============================================
// TIMEZONE NAV (.bne-time)
// ============================================
// Live Brisbane clock in the nav. Runs immediately; the script loads at the end
// of <body> so the nav is already parsed when this looks for .bne-time.
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