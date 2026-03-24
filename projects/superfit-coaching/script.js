// ─── SAFE DOM READY GUARD ───────────────────────────────────────────────────
// Replaces all DOMContentLoaded listeners — works whether the event
// has already fired (Slater late-inject) or hasn't yet.
function domReady(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
// ─── REGISTER ALL GSAP PLUGINS ONCE ─────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, Draggable);

// ─── LENIS SETUP ─────────────────────────────────────────────────────────────
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ─── CUSTOM EASE ─────────────────────────────────────────────────────────────
CustomEase.create("osmo", "0.22, 1, 0.36, 1");

// ─── IMAGE SCROLL EFFECT ──────────────────────────────────────────────────────
gsap.utils.toArray(".img").forEach((img) => {
  gsap.fromTo(
    img,
    { autoAlpha: 0, scale: 1.05 },
    {
      autoAlpha: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
    }
  );

  gsap.to(img, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// ─── HERO SLIDESHOW ───────────────────────────────────────────────────────────
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
      gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 1 });
      gsap.set(getInner(slide), { scale: 1, transformOrigin: "50% 50%" });
    });

    let current = 0;

    function startZoom(slide) {
      const inner = getInner(slide);
      if (inner._zoomTween) inner._zoomTween.kill();
      gsap.set(inner, { scale: 1 });
      inner._zoomTween = gsap.to(inner, {
        scale: scaleAmount,
        duration: hold + crossfade,
        ease: "none",
      });
    }

    startZoom(slides[current]);

    function cycle() {
      const fromIndex = current;
      const toIndex = (current + 1) % slides.length;
      const fromSlide = slides[fromIndex];
      const toSlide = slides[toIndex];
      const fromInner = getInner(fromSlide);
      const fadeInStart = Math.max(0, hold - fadeInLead);
      const fadeOutStart = hold;

      gsap.set(fromSlide, { zIndex: 1 });
      gsap.set(toSlide, { zIndex: 2, opacity: 0 });

      gsap.timeline({
        onComplete: () => {
          if (fromInner._zoomTween) {
            fromInner._zoomTween.kill();
            fromInner._zoomTween = null;
          }
          gsap.set(fromInner, { scale: 1 });
          current = toIndex;
          cycle();
        },
      })
        .call(() => startZoom(toSlide), null, fadeInStart)
        .to(toSlide, { opacity: 1, duration: crossfade, ease: "osmo" }, fadeInStart)
        .to(fromSlide, { opacity: 0, duration: crossfade, ease: "osmo" }, fadeOutStart);
    }

    cycle();
  });
}

// ─── HERO + FOOTER PARALLAX ───────────────────────────────────────────────────
function initParallax() {
  document.querySelectorAll("[data-hero-parallax]").forEach((el) => {
    const inner = el.querySelector("[data-hero-parallax-inner]");
    const dark = el.querySelector("[data-hero-parallax-dark]");

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });

    if (inner) tl.to(inner, { yPercent: 25, ease: "linear" });
    if (dark) tl.to(dark, { opacity: 0.7, ease: "linear" }, "<");
  });

  document.querySelectorAll("[data-footer-parallax]").forEach((el) => {
    const inner = el.querySelector("[data-footer-parallax-inner]");
    const dark = el.querySelector("[data-footer-parallax-dark]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(top top)",
        scrub: true,
      },
    });

    if (inner) tl.from(inner, { yPercent: -25, ease: "linear" });
    if (dark) tl.from(dark, { opacity: 0.5, ease: "linear" }, "<");
  });
}

// ─── STICKY TITLE SCROLL (PROBLEM SECTION) ────────────────────────────────────
function initStickyTitleScroll() {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');

  wraps.forEach((wrap) => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const revealDuration = 0.7,
      fadeOutDuration = 0.7,
      overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      heading.setAttribute("aria-label", heading.textContent);

      const split = new SplitText(heading, { type: "words,chars" });
      split.words.forEach((word) => word.setAttribute("aria-hidden", "true"));
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration,
      });

      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration,
        });
      }

      masterTl.add(headingTl, index === 0 ? undefined : `-=${overlapOffset}`);
    });
  });
}

// ─── FAQ TOGGLE ───────────────────────────────────────────────────────────────
function initFAQ() {
  const toggles = {
    employer: document.querySelector(".faq_toggle_inner.employer"),
    candidate: document.querySelector(".faq_toggle_inner.candidate"),
  };

  const panels = {
    employer: document.querySelector(".accordion-css.employer"),
    candidate: document.querySelector(".accordion-css.candidate"),
  };

  if (!toggles.employer || !toggles.candidate || !panels.employer || !panels.candidate) {
    console.warn("FAQ: missing toggle or panel elements.");
    return;
  }

  const getItems = (panel) => Array.from(panel.querySelectorAll(":scope > *"));

  let activeKey = toggles.employer.classList.contains("is-active") ? "employer" : "candidate";
  let isAnimating = false;

  function setInitialState(key) {
    const showPanel = panels[key];
    const hidePanel = panels[key === "employer" ? "candidate" : "employer"];

    gsap.set(showPanel, { display: "block", autoAlpha: 1 });
    gsap.set(hidePanel, { display: "none", autoAlpha: 0 });
    gsap.set(getItems(showPanel), { autoAlpha: 1, y: 0 });
    gsap.set(getItems(hidePanel), { autoAlpha: 0, y: 12 });

    toggles.employer.classList.toggle("is-active", key === "employer");
    toggles.candidate.classList.toggle("is-active", key === "candidate");
  }

  setInitialState(activeKey);

  function switchTo(nextKey) {
    if (isAnimating || nextKey === activeKey) return;
    isAnimating = true;

    const prevPanel = panels[activeKey];
    const nextPanel = panels[nextKey];
    const prevItems = getItems(prevPanel);
    const nextItems = getItems(nextPanel);

    toggles[activeKey].classList.remove("is-active");
    toggles[nextKey].classList.add("is-active");

    gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => { activeKey = nextKey; isAnimating = false; },
    })
      .to(prevItems, { autoAlpha: 0, y: -10, duration: 0.25, stagger: 0.03, clearProps: "transform" })
      .set(prevPanel, { display: "none", autoAlpha: 0 })
      .set(nextPanel, { display: "block", autoAlpha: 1 })
      .set(nextItems, { autoAlpha: 0, y: 12 })
      .to(nextItems, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04 }, "+=0.02");
  }

  toggles.employer.addEventListener("click", () => switchTo("employer"));
  toggles.candidate.addEventListener("click", () => switchTo("candidate"));
}

// ─── ACCORDION CSS ────────────────────────────────────────────────────────────
function initAccordionCSS() {
  document.querySelectorAll("[data-accordion-css-init]").forEach((accordion) => {
    const closeSiblings = accordion.getAttribute("data-accordion-close-siblings") === "true";

    accordion.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-accordion-toggle]");
      if (!toggle) return;

      const singleAccordion = toggle.closest("[data-accordion-status]");
      if (!singleAccordion) return;

      const isActive = singleAccordion.getAttribute("data-accordion-status") === "active";
      singleAccordion.setAttribute("data-accordion-status", isActive ? "not-active" : "active");

      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute("data-accordion-status", "not-active");
        });
      }
    });
  });
}

// ─── TESTIMONIAL SWIPER ───────────────────────────────────────────────────────
function initSwiperSlider() {
  document.querySelectorAll("[data-swiper-group]").forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if (!swiperSliderWrap) return;

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");

    new Swiper(swiperSliderWrap, {
      slidesPerView: 1.25,
      speed: 600,
      mousewheel: true,
      grabCursor: true,
      breakpoints: {
        480: { slidesPerView: 1.2 },
        992: { slidesPerView: 3.5 },
      },
      navigation: { nextEl: nextButton, prevEl: prevButton },
      pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
      keyboard: { enabled: true, onlyInViewport: false },
    });
  });
}

// ─── FLICK CARDS ──────────────────────────────────────────────────────────────
function initFlickCards() {
  document.querySelectorAll("[data-flick-cards-init]").forEach((slider) => {
    const list = slider.querySelector("[data-flick-cards-list]");
    const cards = Array.from(list.querySelectorAll("[data-flick-cards-item]"));
    const total = cards.length;

    if (total < 7) {
      console.warn("Flick Cards: needs at least 7 cards.");
      return;
    }

    let activeIndex = 0;
    const sliderWidth = slider.offsetWidth;
    const threshold = 0.1;

    const draggers = [];
    cards.forEach((card) => {
      const dragger = document.createElement("div");
      dragger.setAttribute("data-flick-cards-dragger", "");
      card.appendChild(dragger);
      draggers.push(dragger);
    });

    slider.setAttribute("data-flick-drag-status", "grab");

    function getConfig(i, currentIndex) {
      let diff = i - currentIndex;
      if (diff > total / 2) diff -= total;
      else if (diff < -total / 2) diff += total;

      switch (diff) {
        case 0:  return { x: 0,   y: 0, rot: 0,   s: 1,   o: 1, z: 5 };
        case 1:  return { x: 25,  y: 1, rot: 10,  s: 0.9, o: 1, z: 4 };
        case -1: return { x: -25, y: 1, rot: -10, s: 0.9, o: 1, z: 4 };
        case 2:  return { x: 45,  y: 5, rot: 15,  s: 0.8, o: 1, z: 3 };
        case -2: return { x: -45, y: 5, rot: -15, s: 0.8, o: 1, z: 3 };
        default: {
          const dir = diff > 0 ? 1 : -1;
          return { x: 55 * dir, y: 5, rot: 20 * dir, s: 0.6, o: 0, z: 2 };
        }
      }
    }

    function renderCards(currentIndex) {
      cards.forEach((card, i) => {
        const cfg = getConfig(i, currentIndex);
        const statusMap = { 0: "active", 25: "2-after", "-25": "2-before", 45: "3-after", "-45": "3-before" };
        card.setAttribute("data-flick-cards-item-status", statusMap[cfg.x] || "hidden");
        card.style.zIndex = cfg.z;
        gsap.to(card, {
          duration: 0.6,
          ease: "elastic.out(1.2, 1)",
          xPercent: cfg.x,
          yPercent: cfg.y,
          rotation: cfg.rot,
          scale: cfg.s,
          opacity: cfg.o,
        });
      });
    }

    renderCards(activeIndex);

    let pressClientX = 0, pressClientY = 0;

    Draggable.create(draggers, {
      type: "x",
      edgeResistance: 0.8,
      bounds: { minX: -sliderWidth / 2, maxX: sliderWidth / 2 },
      inertia: false,

      onPress() {
        pressClientX = this.pointerEvent.clientX;
        pressClientY = this.pointerEvent.clientY;
        slider.setAttribute("data-flick-drag-status", "grabbing");
      },

      onDrag() {
        const rawProgress = this.x / sliderWidth;
        const progress = Math.min(1, Math.abs(rawProgress));
        const direction = rawProgress > 0 ? -1 : 1;
        const nextIndex = (activeIndex + direction + total) % total;

        cards.forEach((card, i) => {
          const from = getConfig(i, activeIndex);
          const to = getConfig(i, nextIndex);
          const mix = (p) => from[p] + (to[p] - from[p]) * progress;
          gsap.set(card, { xPercent: mix("x"), yPercent: mix("y"), rotation: mix("rot"), scale: mix("s"), opacity: mix("o") });
        });
      },

      onRelease() {
        slider.setAttribute("data-flick-drag-status", "grab");

        const releaseClientX = this.pointerEvent.clientX;
        const releaseClientY = this.pointerEvent.clientY;
        const dragDistance = Math.hypot(releaseClientX - pressClientX, releaseClientY - pressClientY);
        const raw = this.x / sliderWidth;

        let shift = 0;
        if (raw > threshold) shift = -1;
        else if (raw < -threshold) shift = 1;

        if (shift !== 0) {
          activeIndex = (activeIndex + shift + total) % total;
          renderCards(activeIndex);
        }

        gsap.to(this.target, { x: 0, duration: 0.3, ease: "power1.out" });

        if (dragDistance < 4) {
          this.target.style.pointerEvents = "none";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.elementFromPoint(releaseClientX, releaseClientY);
              if (el) el.dispatchEvent(new MouseEvent("click", { view: window, bubbles: true, cancelable: true }));
              this.target.style.pointerEvents = "auto";
            });
          });
        }
      },
    });
  });
}

// ─── CSS MARQUEE ─────────────────────────────────────────────────────────────
function initCSSMarquee() {
  const pixelsPerSecond = 75;
  const marquees = document.querySelectorAll("[data-css-marquee]");

  marquees.forEach((marquee) => {
    marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
      marquee.appendChild(list.cloneNode(true));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.querySelectorAll("[data-css-marquee-list]").forEach(
        (list) => (list.style.animationPlayState = entry.isIntersecting ? "running" : "paused")
      );
    });
  }, { threshold: 0 });

  marquees.forEach((marquee) => {
    marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
      list.style.animationDuration = list.offsetWidth / pixelsPerSecond + "s";
      list.style.animationPlayState = "paused";
    });
    observer.observe(marquee);
  });
}

// ─── NAV + HAMBURGER ─────────────────────────────────────────────────────────
function initNav() {
  const navWraps = document.querySelector(".nav_wraps");
  const hamWrap = document.querySelector(".ham_wrap");
  if (!navWraps || !hamWrap) return;

  let hamOpen = false;
  let scrollLocked = false;

  window.addEventListener("scroll", () => {
    if (scrollLocked) return;
    const scrollThreshold = document.documentElement.scrollHeight * 0.1;
    if (window.scrollY > scrollThreshold) {
      navWraps.classList.replace("u-theme-dark", "u-theme-light");
    } else {
      navWraps.classList.replace("u-theme-light", "u-theme-dark");
    }
  });

  hamWrap.addEventListener("click", () => {
    hamOpen = !hamOpen;
    if (hamOpen) {
      navWraps.classList.replace("u-theme-dark", "u-theme-light");
      document.body.style.overflow = "hidden";
      scrollLocked = true;
    } else {
      const scrollThreshold = document.documentElement.scrollHeight * 0.1;
      if (window.scrollY <= scrollThreshold) {
        navWraps.classList.replace("u-theme-light", "u-theme-dark");
      }
      document.body.style.overflow = "";
      scrollLocked = false;
    }
  });
}

// PRE LOADER //
function initLogoRevealLoader(){
  gsap.registerPlugin(CustomEase, SplitText);
  CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");

  const wrap = document.querySelector("[data-load-wrap]");
  if (!wrap) return;

  const container = wrap.querySelector("[data-load-container]");
  const bg = wrap.querySelector("[data-load-bg]");
  const progressBar = wrap.querySelector("[data-load-progress]");
  const logo = wrap.querySelector("[data-load-logo]");
  const textElements = Array.from(wrap.querySelectorAll("[data-load-text]"));

  // Reset targets that are * not * split text targets
  const resetTargets = Array.from(
    wrap.querySelectorAll('[data-load-reset]:not([data-load-text])')
  );
  
  // Main loader timeline
  const loadTimeline = gsap.timeline({ 
    defaults: { 
      ease: "loader",
      duration: 3
    }
  })
  .set(wrap,{ display: "block" })
  .to(progressBar, { scaleX: 1 })
  .to(logo, { clipPath:"inset(0% 0% 0% 0%)" }, "<")
  .to(container,{ autoAlpha: 0, duration: 0.5 })
  .to(progressBar,{ scaleX: 0, transformOrigin: "right center", duration: 0.5},"<")
  .add("hideContent", "<")
  .to(bg, { yPercent: -101, duration: 1 },"hideContent")
  .set(wrap,{ display: "none" });
  
  
  // If there are items to hide FOUC for, reset them at the start
  if (resetTargets.length) {
    loadTimeline.set(resetTargets, { autoAlpha: 1 }, 0);
  }
  
  // If there's text items, split them, and add to load timeline
  if (textElements.length >= 2) {
    const firstWord = new SplitText(textElements[0], { type: "lines,chars", mask: "lines" });
    const secondWord = new SplitText(textElements[1], { type: "lines,chars", mask: "lines" });
    
    // Set initial states of the text elements and letters
    gsap.set([firstWord.chars, secondWord.chars], { autoAlpha: 0, yPercent: 125 });
    gsap.set(textElements, { autoAlpha: 1 });

    // first text in
    loadTimeline.to(firstWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 }
    }, 0);

    // first text out while second text in
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

    // second text out
    loadTimeline.to(secondWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 }
    }, "hideContent-=0.5");
  }
}

// Initialize Logo Reveal Loader
document.addEventListener("DOMContentLoaded", () => {
  initLogoRevealLoader();
});

// ─── INIT ALL ─────────────────────────────────────────────────────────────────
domReady(() => {
  initFadeScaleSlideshows();
  initParallax();
  initStickyTitleScroll();
  initFAQ();
  initAccordionCSS();
  initSwiperSlider();
  initFlickCards();
  initCSSMarquee();
  initNav();
});