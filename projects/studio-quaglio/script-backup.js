// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
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

CustomEase.create("osmo", "0.625, 0.05, 0, 1");
gsap.defaults({ ease: "osmo", duration: durationDefault });



// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;
  
  // Runs once on first load
  if (has('.preloader'))                    initPreloader();
  if (has('[data-theme-nav="true"]'))       initNavAnimation();
  if (has('[data-button-animate-chars]'))   initButtonCharacterStagger();
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
    // Runs after enter animation completes
  if (has('[split-heading]:not([hero]), [split-body]:not([hero]), [reveal-block]')) initSplitTextAndReveal();
  if (has('[data-hero-parallax]'))                initHeroParallax();
  if (has('[data-parallax="trigger"]'))           initGlobalParallax();
  if (has('[data-swiper-group="1"] .swiper'))     initTestimonialSlider();
  if (has('[data-swiper-group="2"]'))             initSwiperSlider();
  if (has('[data-accordion-css-init]'))           initAccordionCSS();
  if (has('[data-draggable-marquee-init]'))       initDraggableMarquee();
  
  
  if(hasLenis){
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
  if(hasScrollTrigger){
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

  if (hasSplitText) {
    lazyEach("SplitHe