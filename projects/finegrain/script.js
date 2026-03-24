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
  // if (has('[data-something]')) initSomething();
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
  if (has('.popup_form')) initFormPopup();
  if (has('[data-slideshow="wrap"]')) initFadeScaleSlideshows();

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

function initFormPopup(container = document) {

  const popup = container.querySelector(".popup_form");
  const popupInner = container.querySelector(".popup_form_inner");

  if (!popup || !popupInner) {
    console.warn("Popup elements not found");
    return;
  }

  // Custom ease
  if (typeof CustomEase !== "undefined" && !gsap.parseEase("popupEase")) {
    CustomEase.create("popupEase", "0.83, 0, 0.17, 1");
  }

  // OPEN
  container.querySelectorAll("[form-popup]").forEach(trigger => {
    trigger.addEventListener("click", () => {

      popup.style.display = "flex";

      gsap.fromTo(popup, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "popupEase" });

      gsap.fromTo(popupInner, { xPercent: 100 }, {
        xPercent: 0,
        duration: 0.5,
        ease: "popupEase"
      });

    });
  });

  // CLOSE
  container.querySelectorAll("[form-close]").forEach(trigger => {
    trigger.addEventListener("click", () => {

      gsap.to(popupInner, {
        xPercent: 100,
        duration: 0.5,
        ease: "popupEase"
      });

      gsap.to(popup, {
        opacity: 0,
        duration: 0.3,
        ease: "popupEase",
        onComplete: () => {
          popup.style.display = "none";
        }
      });

    });
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

