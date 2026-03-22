// Hide text targets immediately to prevent flash before GSAP sets initial state
(function () {
  const s = document.createElement("style");
  s.textContent = "[text-body],[text-heading]{visibility:hidden}";
  document.head.appendChild(s);
})();

// ============================================
// Init — only runs each module if elements exist
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Inquiry Atelier script connected");

  gsap.registerPlugin(ScrollTrigger);

  // Lenis
  if (typeof Lenis !== "undefined") {
    initLenis();
    console.log("✅ Lenis: init");
  } else {
    console.warn("⚠️ Lenis: not found (script not loaded?)");
  }

  // Images
  if (document.querySelector(".img")) {
    initImageAnimations();
    console.log("✅ Image animations: init");
  } else {
    console.log("— Image animations: no .img elements found, skipped");
  }

  // Testimonials
  if (document.querySelector("[data-testimonial-wrap]")) {
    initLineRevealTestimonials();
    console.log("✅ Testimonials: init");
  } else {
    console.log("— Testimonials: no [data-testimonial-wrap] found, skipped");
  }

  // Lines
  if (document.querySelector(".line-bot, .line-top, .line-straight, .line-left, .left-right")) {
    initLineAnimations();
    console.log("✅ Line animations: init");
  } else {
    console.log("— Line animations: no line elements found, skipped");
  }

  // Text
  if (typeof SplitText !== "undefined" && document.querySelector("[text-body], [text-heading]")) {
    initTextAnimations();
    console.log("✅ Text animations: init");
  } else {
    if (typeof SplitText === "undefined") console.warn("⚠️ Text animations: SplitText not loaded");
    else console.log("— Text animations: no [text-body] or [text-heading] found, skipped");
  }

  // Animated grid
  if (document.querySelector("[data-animated-grid]")) {
    initAnimatedGrid();
    console.log("✅ Animated grid: init");
  } else {
    console.log("— Animated grid: no [data-animated-grid] found, skipped");
  }

  // Form modal
  if (document.querySelector("[form-open]")) {
    initFormModal();
    console.log("✅ Form modal: init");
  } else {
    console.warn("⚠️ Form modal: no [form-open] element found — check your HTML attributes");
  }
});

// ============================================
// Shared
// ============================================

function createEase(name) {
  return typeof CustomEase !== "undefined"
    ? CustomEase.create(name, "M0,0 C0.16,0 0.3,1 1,1")
    : "expo.out";
}

// ============================================
// Lenis smooth scroll
// ============================================

function initLenis() {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

// ============================================
// Image reveal + parallax (.img)
// ============================================

function initImageAnimations() {
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
}

// ============================================
// Testimonial slider ([data-testimonial-wrap])
// ============================================

function initLineRevealTestimonials() {
  const wraps = document.querySelectorAll("[data-testimonial-wrap]");
  if (!wraps.length) return;

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
        if (!isInView || isAnimating) { startAutoplay(); return; }
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

    slides.forEach((_, i) => setSlideState(i, i === activeIndex));
    updateCounter();

    gsap.matchMedia().add(
      { reduce: "(prefers-reduced-motion: reduce)" },
      (context) => { reduceMotion = context.conditions.reduce; }
    );

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
                clipPath: isActive ? "circle(50% at 50% 50%)" : "circle(0% at 50% 50%)",
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
        tl.to(outgoingSlide.item, { autoAlpha: 0, duration: 0.4, ease: "power2" }, 0)
          .fromTo(incomingSlide.item, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2" }, 0);
        return;
      }

      const outgoingLines = outgoingSlide.getLines();
      const incomingLines = incomingSlide.getLines();

      gsap.set(incomingSlide.item, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(incomingLines, { yPercent: 110 });
      if (incomingSlide.image) gsap.set(incomingSlide.image, { clipPath: "circle(0% at 50% 50%)" });
      if (outgoingSlide.image) gsap.set(outgoingSlide.image, { clipPath: "circle(50% at 50% 50%)" });

      tl.to(outgoingLines, { yPercent: -110, duration: 0.6, ease: "power4.inOut", stagger: { amount: 0.25 } }, 0);
      if (outgoingSlide.image) {
        tl.to(outgoingSlide.image, { clipPath: "circle(0% at 50% 50%)", duration: 0.6, ease: "power4.inOut" }, 0);
      }
      tl.to(incomingLines, { yPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { amount: 0.4 } }, ">-=0.3");
      if (incomingSlide.image) {
        tl.to(incomingSlide.image, { clipPath: "circle(50% at 50% 50%)", duration: 0.75, ease: "power4.inOut" }, "<");
      }
      tl.set(outgoingSlide.item, { autoAlpha: 0 }, ">");
    }

    startAutoplay();

    if (btnNext) btnNext.addEventListener("click", () => { resetAutoplay(); goTo((activeIndex + 1) % slides.length); });
    if (btnPrev) btnPrev.addEventListener("click", () => { resetAutoplay(); goTo((activeIndex - 1 + slides.length) % slides.length); });

    function onKeyDown(e) {
      if (!isInView) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); resetAutoplay(); goTo((activeIndex + 1) % slides.length); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); resetAutoplay(); goTo((activeIndex - 1 + slides.length) % slides.length); }
    }

    window.addEventListener("keydown", onKeyDown);

    ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      onEnter:      () => { isInView = true;  resumeAutoplay(); },
      onEnterBack:  () => { isInView = true;  resumeAutoplay(); },
      onLeave:      () => { isInView = false; pauseAutoplay(); },
      onLeaveBack:  () => { isInView = false; pauseAutoplay(); },
    });
  });
}

// ============================================
// Line draw animations (.line-bot .line-top etc)
// ============================================

function initLineAnimations() {
  const ease = createEase("quaglioLine");
  const duration = 2;
  const stagger = 0.09;

  const widthEls  = gsap.utils.toArray(".line-bot, .line-top");
  const heightEls = gsap.utils.toArray(".line-straight, .line-left, .left-right");

  gsap.set(widthEls,  { width: "0%" });
  gsap.set(heightEls, { height: "0%" });

  function bindGroup(els, prop) {
    els.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter() {
          gsap.to(el, { [prop]: "100%", duration, ease, delay: i * stagger });
        },
      });
    });
  }

  bindGroup(widthEls,  "width");
  bindGroup(heightEls, "height");
}

// ============================================
// Text animations ([text-body] [text-heading])
// ============================================

function initTextAnimations() {
  const ease = createEase("quaglioText");

  gsap.utils.toArray("[text-body]").forEach((el) => {
    const split = SplitText.create(el, {
      type: "lines,words",
      mask: "lines",
      linesClass: "text-line",
      autoSplit: true,
    });

    gsap.set(split.lines, { yPercent: 108, rotation: 2, transformOrigin: "left bottom" });
    el.style.visibility = "";

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter() {
        gsap.to(split.lines, { yPercent: 0, rotation: 0, duration: 1.0, ease, stagger: 0.07 });
      },
    });
  });

  gsap.utils.toArray("[text-heading]").forEach((el) => {
    const split = SplitText.create(el, {
      type: "chars,words",
      mask: "chars",
      charsClass: "text-char",
      autoSplit: true,
    });

    gsap.set(split.chars, { yPercent: 110 });
    el.style.visibility = "";

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter() {
        gsap.to(split.chars, { yPercent: 0, duration: 0.9, ease, stagger: 0.03 });
      },
    });
  });
}

// ============================================
// Grid animation ([data-animated-grid])
// ============================================

function initAnimatedGrid() {
  const grid = document.querySelector("[data-animated-grid]");
  const cols = document.querySelectorAll("[data-animated-grid-col]");
  const toggles = document.querySelectorAll("[data-animated-grid-toggle]");

  if (!grid || !cols.length) return;

  const storageKey = "animatedGridState";
  let isOpen = localStorage.getItem(storageKey) === "open";

  gsap.set(grid, { display: "block" });

  if (isOpen) {
    gsap.set(cols, { yPercent: 0 });
  } else {
    gsap.set(cols, { yPercent: 100 });
  }

  function openGrid() {
    isOpen = true;
    localStorage.setItem(storageKey, "open");
    gsap.fromTo(cols, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "expo.inOut", stagger: { each: 0.03, from: "start" }, overwrite: true });
  }

  function closeGrid() {
    isOpen = false;
    localStorage.setItem(storageKey, "closed");
    gsap.fromTo(cols, { yPercent: 0 }, { yPercent: -100, duration: 1, ease: "expo.inOut", stagger: { each: 0.03, from: "start" }, overwrite: true });
  }

  function toggleGrid() {
    if (isOpen) closeGrid();
    else openGrid();
  }

  function isTypingContext(e) {
    const el = e.target;
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  }

  toggles.forEach((btn) => {
    btn.addEventListener("click", (e) => { e.preventDefault(); toggleGrid(); });
  });

  window.addEventListener("keydown", (e) => {
    if (isTypingContext(e)) return;
    if (!(e.shiftKey && (e.key || "").toLowerCase() === "g")) return;
    e.preventDefault();
    toggleGrid();
  });
}

// ============================================
// Form modal ([form-open] / [form-wrap])
// ============================================

function initFormModal() {
  const openers = document.querySelectorAll("[form-open]");
  const wrap    = document.querySelector("[form-wrap]");
  if (!wrap) return;

  const inner = wrap.querySelector("[form-inner]");
  const bg    = wrap.querySelector("[form-bg]");
  if (!inner) { console.error("❌ Form modal: [form-inner] not found inside [form-wrap]"); return; }
  if (!bg)    { console.error("❌ Form modal: [form-bg] not found inside [form-wrap]"); return; }

  gsap.set(wrap,  { display: "none" });
  gsap.set(bg,    { autoAlpha: 0 });
  gsap.set(inner, { x: "100%" });

  function openForm() {
    gsap.set(wrap, { display: "flex" });
    const tl = gsap.timeline();
    tl.to(bg, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0)
      .to(inner, { x: "0%", duration: 0.65, ease: "power3.out" }, "-=0.15");
  }

  function closeForm() {
    const tl = gsap.timeline({
      onComplete: () => gsap.set(wrap, { display: "none" }),
    });
    tl.to(inner, { x: "100%", duration: 0.5, ease: "power3.in" }, 0)
      .to(bg, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.1);
  }

  openers.forEach((el) => el.addEventListener("click", openForm));
  bg.addEventListener("click", closeForm);
}
