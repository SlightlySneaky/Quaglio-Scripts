// LENIS SETUP //
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {lenis.raf(time * 1000);});
gsap.ticker.lagSmoothing(0);

// IMAGE SCROLL EFFECT //
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".img").forEach((img) => {
  // 1) One-time "reveal" (runs once, no reversing)
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
        toggleActions: "play none none none", // only once
        once: true
      }
    }
  );

  // 2) Continuous parallax (scrubs both directions)
  gsap.to(img, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

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
        if (!isInView || isAnimating) {
          startAutoplay();
          return;
        }
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

    // Set initial state
    slides.forEach((_, i) => setSlideState(i, i === activeIndex));
    updateCounter();

    // Handle reduced motion preference
    gsap.matchMedia().add(
      { reduce: "(prefers-reduced-motion: reduce)" },
      (context) => {
        reduceMotion = context.conditions.reduce;
      }
    );

    // Create SplitText instances
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
        tl.to(outgoingSlide.item, { 
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2"
          }, 0)
          .fromTo(incomingSlide.item, {
            autoAlpha: 0
          }, {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2"
          }, 0);
          
        return;
      }

      const outgoingLines = outgoingSlide.getLines();
      const incomingLines = incomingSlide.getLines();

      gsap.set(incomingSlide.item, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(incomingLines, { yPercent: 110 });
  
      if (incomingSlide.image) gsap.set(incomingSlide.image, { clipPath: "circle(0% at 50% 50%)" });
      if (outgoingSlide.image) gsap.set(outgoingSlide.image, { clipPath: "circle(50% at 50% 50%)" });

      tl.to(outgoingLines, {
        yPercent: -110,
        duration: 0.6,
        ease: "power4.inOut",
        stagger: { amount: 0.25 },
      }, 0);

      if (outgoingSlide.image) {
        tl.to(outgoingSlide.image, {
          clipPath: "circle(0% at 50% 50%)",
          duration: 0.6,
          ease: "power4.inOut",
        }, 0);
      }

      tl.to(incomingLines, {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: { amount: 0.4 },
      }, ">-=0.3");

      if (incomingSlide.image) {
        tl.to(incomingSlide.image, {
          clipPath: "circle(50% at 50% 50%)",
          duration: 0.75,
          ease: "power4.inOut",
        }, "<");
      }

      tl.set(outgoingSlide.item, { autoAlpha: 0 }, ">");
    }
  
    // Start autoplay on the wrap (only works if autoplay is set to 'true')
    startAutoplay();

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        resetAutoplay();
        goTo((activeIndex + 1) % slides.length);
      });
    }
    
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        resetAutoplay();
        goTo((activeIndex - 1 + slides.length) % slides.length);
      });
    }
        
    function onKeyDown(e) {
      if (!isInView) return;
    
      // Don't hijack arrow keys while user is typing.
      const t = e.target;
      const isTypingTarget =
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable);
    
      if (isTypingTarget) return;
    
      if (e.key === "ArrowRight") {
        e.preventDefault();
        resetAutoplay();
        goTo((activeIndex + 1) % slides.length);
      }
    
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        resetAutoplay();
        goTo((activeIndex - 1 + slides.length) % slides.length);
      }
    }
    
    // Listen for left/right arrows
    window.addEventListener("keydown", onKeyDown);
    
    // Enable/disable keyboard + autoplay depending on scroll position
    ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        isInView = true;
        resumeAutoplay();
      },
      onEnterBack: () => {
        isInView = true;
        resumeAutoplay();
      },
      onLeave: () => {
        isInView = false;
        pauseAutoplay();
      },
      onLeaveBack: () => {
        isInView = false;
        pauseAutoplay();
      },
    });
    
  });
}

// ============================================
// Line Draw Animations
// ============================================

function initLineAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Osmo-style ease: fast out, smooth deceleration
  const ease = typeof CustomEase !== "undefined"
    ? CustomEase.create("quaglioLine", "M0,0 C0.16,0 0.3,1 1,1")
    : "expo.out";

  const duration = 2;
  const stagger = 0.09;

  const widthEls  = gsap.utils.toArray(".line-bot, .line-top");
  const heightEls = gsap.utils.toArray(".line-straight, .line-left, .left-right");

  gsap.set(widthEls,  { width: "0%" });
  gsap.set(heightEls, { height: "0%" });

  // Animate a group of elements with stagger when first element enters view
  function bindGroup(els, prop) {
    if (!els.length) return;

    els.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter() {
          gsap.to(el, {
            [prop]: "100%",
            duration,
            ease,
            delay: i * stagger,
          });
        },
      });
    });
  }

  bindGroup(widthEls,  "width");
  bindGroup(heightEls, "height");
}

// Initialize Line Reveal Testimonials
document.addEventListener("DOMContentLoaded", () => {
  initLineRevealTestimonials();
  initLineAnimations();
});