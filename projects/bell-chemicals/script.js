// -----------------------------------------
// QUAGLIO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(CustomEase, ScrollTrigger);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;

// Flags
const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

// Reduced motion
const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", e => (reducedMotion = e.matches));
rmMQ.addListener?.(e => (reducedMotion = e.matches));

// Page-scoped selector helper (container ONLY)
const has = (selector) => !!nextPage.querySelector(selector);

// Defaults
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

  if (document.querySelector(".nav_wrap")) {
    initNavAnimation(lenis);
  }
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;
}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  // Page-scoped effects
  if (has("[data-footer-parallax]")) initFooterParallax();
  if (has(".img_wrap")) initImgParallax();
  if (has("[data-accordion-css-init]")) initAccordionCSS();
  if (has('[data-sticky-title="wrap"]')) initStickyTitleScroll();
  if (has('.marquee-css')) initCSSMarquee();
  if (has('.form-img')) initProcessAccordionImages();
  if (has('.accordion-css__list')) initAccordionImageSync();
  if (has('.c-control_right-list')) initControlSwitcher();
  if (has('.arrow_grow')) initArrowProgressSection();
  if (has('.product_float_wrap')) initProductFloatHover();
  if (has('[data-hero-parallax]')) initHeroParallax();
  if (has('[data-slideshow="wrap"]')) initFadeScaleSlideshows();
  if (has('[data-tally-src]')) initTallyEmbed();

  if (hasLenis) lenis.resize();
  if (hasScrollTrigger) ScrollTrigger.refresh();
}

// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();

  tl.call(() => resetPage(next), null, 0);
  tl.add(createRevealTimeline(next), 0.2);

  return tl;
}

function runPageLeaveAnimation(current) {
  const tl = gsap.timeline({
    onComplete: () => current.remove()
  });

  if (reducedMotion) {
    return tl.set(current, { autoAlpha: 0 });
  }

  tl.to(current, {
    autoAlpha: 0,
    duration: 0.35
  });

  return tl;
}

function runPageEnterAnimation(next) {
  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.call(resetPage, [next]);
    return Promise.resolve();
  }

  tl.add("startEnter", 0.55);

  // Clear fixed positioning and restore scroll early
  tl.call(() => {
    resetPage(next);
  }, null, "startEnter");

  // Fade page container
  tl.fromTo(
    next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 },
    "startEnter"
  );

  // Fade images AFTER container is visible
  const images = next.querySelectorAll(".img_wrap .img");

  if (images.length) {
    tl.set(images, { autoAlpha: 0 }, 0);

    tl.to(
      images,
      {
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity"
      },
      "startEnter+=0.15"
    );
  }

  // Build reveal timeline after position is cleared
  tl.call(() => {
    const revealTl = createRevealTimeline(next);
    revealTl.play();
  }, null, "startEnter+=0.1");

  return new Promise(resolve => {
    tl.call(resolve);
  });
}

function createRevealTimeline(container) {
  const tl = gsap.timeline();

  // -------------------------
  // HEADINGS (Buttery Cascade)
  // -------------------------
  container.querySelectorAll('[data-split="heading"]').forEach(el => {

    // Revert existing split if any
    if (el._split) {
      el._split.revert();
      el._split = null;
    }

    const split = new SplitText(el, { type: "words" });
    el._split = split;

    gsap.set(split.words, {
      yPercent: 110,
      opacity: 0,
      willChange: "transform, opacity"
    });

    tl.to(split.words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.65,
      stagger: {
        each: 0.014 // smooth overlap cascade
      },
      ease: "power4.out",
      clearProps: "all"
    }, 0);
  });

  // -------------------------
  // BODY TEXT
  // -------------------------
  container.querySelectorAll('[data-split="body"]').forEach(el => {

    if (el._split) {
      el._split.revert();
      el._split = null;
    }

    const split = new SplitText(el, { type: "lines" });
    el._split = split;

    gsap.set(split.lines, {
      yPercent: 100,
      opacity: 0
    });

    tl.to(split.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "all"
    }, 0.25);
  });

  // -------------------------
  // BUTTONS + IMAGES
  // -------------------------
  const reveals = container.querySelectorAll(
    '[data-reveal="button"], [data-reveal="image"]'
  );

  if (reveals.length) {
    gsap.set(reveals, { y: 40, opacity: 0 });

    tl.to(reveals, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "all"
    }, 0.35);
  }

  return tl;
}

function initLogoRevealLoader() {
  gsap.registerPlugin(CustomEase, SplitText);

  CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");

  const wrap = document.querySelector("[data-load-wrap]");
  if (!wrap) return;

  const container = wrap.querySelector("[data-load-container]");
  const bg = wrap.querySelector("[data-load-bg]");
  const progressBar = wrap.querySelector("[data-load-progress]");
  const logo = wrap.querySelector("[data-load-logo]");
  const textElements = Array.from(wrap.querySelectorAll("[data-load-text]"));
  const resetTargets = Array.from(
    wrap.querySelectorAll("[data-load-reset]:not([data-load-text])")
  );

  if (!container || !bg || !progressBar || !logo) return;

  const loadTimeline = gsap.timeline({
    defaults: { ease: "loader", duration: 3 }
  });

  loadTimeline
    .set(wrap, { display: "block" })
    .to(progressBar, { scaleX: 1 })
    .to(logo, { clipPath: "inset(0% 0% 0% 0%)" }, "<")
    .to(container, { autoAlpha: 0, duration: 0.5 })
    .to(progressBar, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.5
    }, "<")
    .add("hideContent", "<")
    .to(bg, { yPercent: -101, duration: 1 }, "hideContent")
    .set(wrap, { display: "none" });

  if (resetTargets.length) {
    loadTimeline.set(resetTargets, { autoAlpha: 1 }, 0);
  }

  if (textElements.length >= 2) {
    const firstWord = new SplitText(textElements[0], {
      type: "lines,chars",
      mask: "lines"
    });

    const secondWord = new SplitText(textElements[1], {
      type: "lines,chars",
      mask: "lines"
    });

    gsap.set([firstWord.chars, secondWord.chars], {
      autoAlpha: 0,
      yPercent: 125
    });

    gsap.set(textElements, { autoAlpha: 1 });

    loadTimeline.to(firstWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 }
    }, 0);

    loadTimeline.to(firstWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 }
    }, ">+=0.4");

    loadTimeline.to(secondWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 }
    }, "<");

    loadTimeline.to(secondWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 }
    }, "hideContent-=0.5");
  }

  // 🔓 Properly restore scroll + layout when loader finishes
  loadTimeline.eventCallback("onComplete", () => {

    // Clear fixed positioning Barba may have applied
    const barbaContainer = document.querySelector("[data-barba='container']");
    if (barbaContainer) {
      gsap.set(barbaContainer, {
        clearProps: "position,top,left,right"
      });
    }

    // Restart Lenis
    if (typeof lenis !== "undefined" && lenis) {
      lenis.start();
      lenis.resize();
    }

    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh(true);
    }

    // Optional: re-init split scroll reveal if it exists
    if (typeof initSplitScrollReveal === "function") {
      initSplitScrollReveal();
    }
  });

  return loadTimeline;
}

// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

barba.hooks.beforeEnter(data => {
  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0
  });

  if (lenis?.stop) lenis.stop();

  // Reset mobile menu state so nav scroll animation works on the new page
  if (typeof navResetMenuState === "function") navResetMenuState();

  initBeforeEnterFunctions(data.next.container);
  applyThemeFrom(data.next.container);
});

barba.hooks.afterLeave(() => {
  // Kill ALL page-level ScrollTriggers
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id !== "nav") {
      st.kill();
    }
  });
});

barba.hooks.enter(data => {
  initBarbaNavUpdate(data);
});

barba.hooks.afterEnter(data => {
  console.log("afterEnter - body position:", document.body.style.position);
  console.log("afterEnter - body overflow:", document.body.style.overflow);

  initAfterEnterFunctions(data.next.container);

  if (hasLenis) {
    lenis.resize();
    lenis.start();
    console.log("afterEnter - lenis isStopped:", lenis.isStopped);
  }

  if (hasScrollTrigger) ScrollTrigger.refresh();

  console.log("afterEnter DONE - body position:", document.body.style.position);
  console.log("afterEnter DONE - body overflow:", document.body.style.overflow);
});

barba.init({
  debug: true,
  timeout: 7000,
  preventRunning: true,
  transitions: [
  {
    name: "default",
    sync: true,

    async once(data) {
      initOnceFunctions();

      const isHome = data.next.container.dataset.page === "home";

      if (isHome) {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        const loaderTimeline = initLogoRevealLoader();
        return loaderTimeline;
      }

      return runPageOnceAnimation(data.next.container);
    },

    async leave(data) {
      return runPageLeaveAnimation(data.current.container);
    },

    async enter(data) {
      return runPageEnterAnimation(data.next.container);
    }
  }]
});

// -----------------------------------------
// GENERIC + HELPERS
// -----------------------------------------

const themeConfig = {
  light: { nav: "dark", transition: "light" },
  dark: { nav: "light", transition: "dark" }
};

function applyThemeFrom(container) {
  const navTheme = container?.dataset?.navTheme || "light";

  const nav = document.querySelector(".nav_wrap");
  if (!nav) return;

  // Persist the base theme for this page
  nav.dataset.baseTheme = navTheme;

  // Reset visual state
  nav.classList.remove("u-theme-light", "u-theme-dark");
  nav.classList.add(
    navTheme === "dark" ? "u-theme-dark" : "u-theme-light"
  );
}

function initLenis() {
  if (lenis || !hasLenis) return;

  lenis = new Lenis({
    lerp: 0.165,
    wheelMultiplier: 1.25
  });

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add(time => {
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

function initBarbaNavUpdate(data) {
  const tpl = document.createElement("template");
  tpl.innerHTML = data.next.html.trim();

  const nextNodes = tpl.content.querySelectorAll("[data-barba-update]");
  const currentNodes = document.querySelectorAll("nav [data-barba-update]");

  currentNodes.forEach((curr, index) => {
    const next = nextNodes[index];
    if (!next) return;

    const aria = next.getAttribute("aria-current");
    aria !== null ?
      curr.setAttribute("aria-current", aria) :
      curr.removeAttribute("aria-current");

    curr.setAttribute("class", next.getAttribute("class") || "");
  });
}

// -----------------------------------------
// PAGE-LEVEL EFFECTS
// -----------------------------------------

function initFooterParallax() {
  if (window.matchMedia("(max-width: 991px)").matches) return;

  document.querySelectorAll("[data-footer-parallax]").forEach(el => {
    const inner = el.querySelector("[data-footer-parallax-inner]");
    const dark = el.querySelector("[data-footer-parallax-dark]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(top top)",
        scrub: true
      }
    });

    if (inner) tl.from(inner, { yPercent: -25, ease: "linear" });
    if (dark) tl.from(dark, { opacity: 0.5, ease: "linear" }, "<");
  });
}

function initNavAnimation(lenisInstance) {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("navFast", "0.4, 0, 1, 1");
  CustomEase.create("navSmooth", "0.25, 0.1, 0.25, 1");
  const nav = document.querySelector(".nav_wrap");
  if (!nav) return;
  const logoDefault = nav.querySelector(".nav-logo-default");
  const logoCircle = nav.querySelector(".nav-logo-circle");
  const hamburger = document.querySelector(".hamburrger_wrap");
  const mobLinks = document.querySelectorAll("[mob-link]");
  const getLenis = () => lenisInstance || lenis;
  const getBaseThemeClass = () =>
    nav.dataset.baseTheme === "dark" ? "u-theme-dark" : "u-theme-light";
  let isScrolled = false;
  let isMenuOpen = false;

  const topState = {
    paddingLeft: "0rem",
    paddingRight: "0rem",
    marginTop: "0rem",
    backgroundColor: "transparent",
    backdropFilter: "blur(0px)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  };
  const scrolledState = {
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    marginTop: "1rem",
    backgroundColor: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  };

  // Expose reset so Barba can clear menu state on navigation
  window.navResetMenuState = () => {
    isMenuOpen = false;

    // Kill any in-progress nav animations
    gsap.killTweensOf(nav);
    if (logoDefault) gsap.killTweensOf(logoDefault);
    if (logoCircle) gsap.killTweensOf(logoCircle);

    const navST = ScrollTrigger.getById("nav");
    if (navST) navST.refresh();

    isScrolled = false;
    nav.classList.remove("u-theme-dark", "u-theme-light");
    nav.classList.add(getBaseThemeClass());
    gsap.set(nav, { ...topState, opacity: 1 });
    if (logoDefault) gsap.set(logoDefault, { y: "0rem" });
    if (logoCircle) gsap.set(logoCircle, { y: "5rem" });
  };

  function smoothThemeSwap(themeClass, duration = 0.25) {
    const currentTheme = nav.classList.contains("u-theme-dark") ?
      "u-theme-dark" :
      "u-theme-light";
    if (currentTheme === themeClass) return;
    gsap.to(nav, {
      opacity: 0,
      duration: duration * 0.4,
      ease: "navFast",
      onComplete: () => {
        nav.classList.remove("u-theme-dark", "u-theme-light");
        nav.classList.add(themeClass);
        gsap.to(nav, {
          opacity: 1,
          duration: duration * 0.6,
          ease: "navSmooth",
        });
      },
    });
  }

  function animateNav(state, logoDefaultY, logoCircleY) {
    const isTop = state === topState;
    gsap.killTweensOf([nav, logoDefault, logoCircle]);
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
    tl.to(nav, { boxShadow: state.boxShadow, duration: isTop ? 0.15 : 0.18, ease: "navFast" })
      .to(nav, {
        backgroundColor: state.backgroundColor,
        backdropFilter: state.backdropFilter,
        duration: isTop ? 0.4 : 0.45,
        ease: "navSmooth"
      }, "<0.05")
      .to(nav, {
        paddingLeft: state.paddingLeft,
        paddingRight: state.paddingRight,
        marginTop: state.marginTop,
        duration: isTop ? 0.5 : 0.55,
        ease: "navSmooth"
      }, "<0.1")
      .to(logoDefault, { y: logoDefaultY, duration: isTop ? 0.4 : 0.45, ease: "navSmooth" }, isTop ?
        "<0.1" : "<0.15")
      .to(logoCircle, { y: logoCircleY, duration: isTop ? 0.4 : 0.45, ease: "navSmooth" }, "<");
    return tl;
  }

  // Initial state
  gsap.set(nav, { ...topState, opacity: 1 });
  if (logoDefault) gsap.set(logoDefault, { y: "0rem" });
  if (logoCircle) gsap.set(logoCircle, { y: "5rem" });

  // Scroll animation
  ScrollTrigger.create({
    id: "nav",
    trigger: document.body,
    start: "top -80px",
    onEnter: () => {
      isScrolled = true;
      if (isMenuOpen) return;
      nav.classList.remove("u-theme-dark", "u-theme-light");
      nav.classList.add("u-theme-light");
      animateNav(scrolledState, "-5rem", "0rem");
    },
    onLeaveBack: () => {
      isScrolled = false;
      if (isMenuOpen) return;
      nav.classList.remove("u-theme-dark", "u-theme-light");
      nav.classList.add(getBaseThemeClass());
      animateNav(topState, "0rem", "5rem");
    },
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        // Always force light theme when menu opens
        nav.classList.remove("u-theme-dark", "u-theme-light");
        nav.classList.add("u-theme-light");
        animateNav(topState, "0rem", "5rem");
      } else {
        // Revert to appropriate theme on close
        const targetTheme = isScrolled ? "u-theme-light" : getBaseThemeClass();
        nav.classList.remove("u-theme-dark", "u-theme-light");
        nav.classList.add(targetTheme);
        if (isScrolled) {
          animateNav(scrolledState, "-5rem", "0rem");
        } else {
          gsap.to(nav, { ...topState, duration: 0.3, ease: "navSmooth", overwrite: "auto" });
        }
      }
    });
  }

  // Mobile nav links — force hamburger click to close menu
  mobLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!isMenuOpen || !hamburger) return;
      hamburger.click();
    });
  });
}

function initImgParallax() {
  const wraps = nextPage.querySelectorAll(".img_wrap");
  if (!wraps.length) return;

  const clamp01 = gsap.utils.clamp(0, 1);

  wraps.forEach((wrap) => {
    const img = wrap.querySelector(".img");
    if (!img) return;

    // --- 1) PRE-SET the correct yPercent BEFORE ScrollTrigger animates ---
    const setInitial = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const rect = wrap.getBoundingClientRect();

      // "top bottom"  => startScroll = elementTop - viewportHeight
      const start = (rect.top + scrollY) - window.innerHeight;

      // "bottom top" => endScroll = elementBottom
      const end = (rect.bottom + scrollY);

      const progress = clamp01((scrollY - start) / (end - start));
      gsap.set(img, { yPercent: 10 * progress });
    };

    setInitial(); // important: run immediately

    // --- 2) Create the tween + ScrollTrigger ---
    gsap.to(img, {
      yPercent: 10,
      ease: "none",
      immediateRender: false, // prevents GSAP from forcing a start value again
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,

        // keep it correct on refresh/resizes/fonts/images
        onRefresh: setInitial
      }
    });
  });
}

function initAccordionCSS() {
  const accordions = nextPage.querySelectorAll("[data-accordion-css-init]");
  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    const closeSiblings =
      accordion.getAttribute("data-accordion-close-siblings") === "true";

    accordion.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-accordion-toggle]");
      if (!toggle || !accordion.contains(toggle)) return;

      const item = toggle.closest("[data-accordion-status]");
      if (!item) return;

      const isActive =
        item.getAttribute("data-accordion-status") === "active";

      item.setAttribute(
        "data-accordion-status",
        isActive ? "not-active" : "active"
      );

      if (closeSiblings && !isActive) {
        accordion
          .querySelectorAll('[data-accordion-status="active"]')
          .forEach((sibling) => {
            if (sibling !== item) {
              sibling.setAttribute(
                "data-accordion-status",
                "not-active"
              );
            }
          });
      }
    });
  });
}

function initStickyTitleScroll() {
  const wraps = nextPage.querySelectorAll('[data-sticky-title="wrap"]');
  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const headings = Array.from(
      wrap.querySelectorAll('[data-sticky-title="heading"]')
    );
    if (!headings.length) return;

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true
      }
    });

    const revealDuration = 0.7;
    const fadeOutDuration = 0.7;
    const overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      // Preserve original text for screen readers
      heading.setAttribute("aria-label", heading.textContent);

      const split = new SplitText(heading, { type: "words,chars" });

      // Hide split text from screen readers
      split.words.forEach((word) =>
        word.setAttribute("aria-hidden", "true")
      );

      // Ensure stacked headings are visible
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();

      // Fade / reveal in
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });

      // Fade out all except last heading
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }

      // Slight overlap between headings
      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });
}

function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');

  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list =>
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });

  // Calculate the width and set the animation duration accordingly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}

function initAccordionImageSync() {
  const accordions = document.querySelectorAll("[data-accordion='wrap']");
  if (!accordions.length) return;

  accordions.forEach(wrapper => {
    const list = wrapper.querySelector(".accordion-css__list");
    const imageList = wrapper.querySelector(".acc_img_list");

    if (!list || !imageList) return;

    const accordionItems = list.querySelectorAll(".process-accordion_wrap");
    const images = imageList.querySelectorAll(".acc-img");

    let activeImage = null;

    // Hide all images initially
    gsap.set(images, {
      opacity: 0,
      filter: "blur(12px)",
      pointerEvents: "none"
    });

    // --- FIND DEFAULT ACTIVE ITEM ---
    const defaultActiveItem = list.querySelector(
      '.process-accordion_wrap[data-accordion-status="active"]'
    );

    if (defaultActiveItem) {
      const comboClass = Array.from(defaultActiveItem.classList)
        .find(cls => cls !== "process-accordion_wrap");

      if (comboClass) {
        const defaultImage = imageList.querySelector(`.acc-img.${comboClass}`);
        if (defaultImage) {
          gsap.set(defaultImage, {
            opacity: 1,
            filter: "blur(0px)"
          });
          activeImage = defaultImage;
        }
      }
    }

    // --- CLICK HANDLING ---
    accordionItems.forEach(item => {
      const comboClass = Array.from(item.classList)
        .find(cls => cls !== "process-accordion_wrap");

      if (!comboClass) return;

      item.addEventListener("click", () => {
        const targetImage = imageList.querySelector(`.acc-img.${comboClass}`);
        if (!targetImage || targetImage === activeImage) return;

        const tl = gsap.timeline({
          defaults: {
            duration: 0.6,
            ease: "customEase"
          }
        });

        if (activeImage) {
          tl.to(activeImage, {
            opacity: 0,
            filter: "blur(12px)"
          }, 0);
        }

        tl.to(targetImage, {
          opacity: 1,
          filter: "blur(0px)"
        }, 0);

        activeImage = targetImage;
      });
    });
  });
}

function initControlSwitcher() {
  const listItems = document.querySelectorAll(".c-control_list_item");
  const contentItems = document.querySelectorAll(".c-control_item");

  if (!listItems.length || !contentItems.length) return;

  let activeContent = null;
  let activeTrigger = null;

  // Initial setup
  gsap.set(contentItems, { autoAlpha: 0, position: "absolute" });
  gsap.set(contentItems[0], { autoAlpha: 1 });

  activeContent = contentItems[0];
  activeTrigger = listItems[0];

  // Set initial active colour
  gsap.set(activeTrigger, {
    color: "var(--swatch--brand-500)"
  });

  listItems.forEach(trigger => {
    trigger.addEventListener("click", () => {

      // Prevent re-triggering same item
      if (trigger === activeTrigger) return;

      // Find combo class
      const comboClass = [...trigger.classList].find(
        cls => cls !== "c-control_list_item"
      );

      const targetContent = document.querySelector(
        `.c-control_item.${comboClass}`
      );

      if (!targetContent) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.35 }
      });

      // Fade out current content
      tl.to(activeContent, { autoAlpha: 0 }, 0);

      // Fade in new content
      tl.to(targetContent, { autoAlpha: 1 }, 0);

      // Reset previous trigger colour
      tl.to(activeTrigger, {
        color: "",
        duration: 0.2
      }, 0);

      // Set active trigger colour
      tl.to(trigger, {
        color: "var(--swatch--brand-500)",
        duration: 0.2
      }, 0);

      activeContent = targetContent;
      activeTrigger = trigger;
    });
  });
}

function initArrowProgressSection() {
  const sections = document.querySelectorAll(".c-testing_grid");
  if (!sections.length) return;

  sections.forEach(section => {
    const arrowGrow = section.querySelector(".arrow_grow");
    const arrowFill = section.querySelector(".arrow_fill");

    const items = gsap.utils.toArray([
      section.querySelector(".c-testing_item-1"),
      section.querySelector(".c-testing_item-2"),
      section.querySelector(".c-testing_item-3"),
      section.querySelector(".c-testing_item-4")
    ]).filter(Boolean);

    if (!arrowGrow || !arrowFill || !items.length) return;

    let activationPoints = [];

    function calculateActivationPoints() {
      const growRect = arrowGrow.getBoundingClientRect();

      activationPoints = items.map(item => {
        const itemRect = item.getBoundingClientRect();

        return itemRect.left + itemRect.width / 2 - growRect.left;
      });
    }

    // Initial calculation
    calculateActivationPoints();

    // Recalculate on resize
    window.addEventListener("resize", calculateActivationPoints);

    gsap.to(arrowFill, {
      width: "100%",
      duration: 10,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        once: true
      },
      onUpdate() {
        const fillWidth = arrowFill.getBoundingClientRect().width;

        activationPoints.forEach((point, index) => {
          if (fillWidth >= point) {
            items[index].classList.add("is-active");
          }
        });
      }
    });
  });
}

function initProductFloatHover() {
  document.querySelectorAll(".product_float_wrap").forEach((wrap) => {
    const img = wrap.querySelector(".img_wrap");
    const float = wrap.querySelector(".product_float");

    if (!img || !float) return; // safe guard

    // Initial states
    gsap.set(img, {
      scale: 1,
      filter: "blur(0px)"
    });

    gsap.set(float, {
      opacity: 0,
      filter: "blur(6px)",
      y: 12
    });

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.6,
        ease: "power3.out"
      }
    });

    tl.to(img, {
        scale: 1.1,
        filter: "blur(4px)"
      }, 0)
      .to(float, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.55
      }, 0.05);

    wrap.addEventListener("mouseenter", () => {
      tl.timeScale(1).play();
    });

    wrap.addEventListener("mouseleave", () => {
      tl.timeScale(1).reverse(); // slightly faster reverse feels more natural
    });
  });
}

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

function initTallyEmbed() {
  const tallyIframe = nextPage.querySelector('[data-tally-src]');

  if (!tallyIframe) return;

  if (window.Tally) {
    setTimeout(() => {
      window.Tally.loadEmbeds();
    }, 50);
  }
}
