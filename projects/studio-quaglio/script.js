// ============================================
// LENIS
// ============================================
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);


// ============================================
// INIT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('[data-theme-nav="true"]')) initNavAnimation();
  if (document.querySelector('[split-heading], [split-body], [reveal-block]')) initSplitTextAndReveal();
  if (document.querySelector('.cursor')) initDynamicCustomTextCursor();
});


// ============================================
// NAV ANIMATION
// ============================================
function initNavAnimation() {
  window.addEventListener("load", () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const nav = document.querySelector('[data-theme-nav="true"]');
    if (!nav) {
      console.warn("[ThemeNav] Nav not found. Add data-theme-nav='true' to your nav.");
      return;
    }

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
  });
}


// ============================================
// SPLIT TEXT + REVEAL BLOCK ANIMATIONS
// ============================================
function initSplitTextAndReveal() {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP or ScrollTrigger not found. Split animations not initialized.");
    return;
  }

  const hasSplitText = typeof window.SplitText !== "undefined";
  if (!hasSplitText) {
    console.warn("SplitText plugin not found. [split-heading] / [split-body] animations skipped.");
  }

  gsap.registerPlugin(ScrollTrigger);
  if (hasSplitText) gsap.registerPlugin(SplitText);

  const ctx = gsap.context(() => {

    // ---------- HEADINGS: split by characters ---------- //
    if (hasSplitText) {
      const headings = document.querySelectorAll("[split-heading]");
      headings.forEach((heading) => {
        const delayAttr = parseFloat(heading.getAttribute("data-split-delay")) || 0;
        const isLoadAnim = heading.getAttribute("data-split-load") === "true";

        const split = new SplitText(heading, {
          type: "chars,words",
          charsClass: "is-split-char",
          wordsClass: "is-split-word"
        });

        gsap.set(heading, { overflow: "hidden", position: "relative" });
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
          ease: "power3.out",
          stagger: { each: 0.02, from: "start" },
          delay: delayAttr
        });
      });

      // ---------- BODY: split by lines ---------- //
      const bodies = document.querySelectorAll("[split-body]");
      bodies.forEach((body) => {
        const delayAttr = parseFloat(body.getAttribute("data-split-delay")) || 0.1;
        const isLoadAnim = body.getAttribute("data-split-load") === "true";

        const split = new SplitText(body, {
          type: "lines",
          linesClass: "is-split-line"
        });

        gsap.set(body, { overflow: "hidden", position: "relative" });
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
          ease: "power3.out",
          stagger: { each: 0.08, from: "start" },
          delay: delayAttr
        });
      });
    }

    // ---------- REVEAL BLOCKS: clip-path mask ----------
    const blocks = document.querySelectorAll("[reveal-block]");
    blocks.forEach((block) => {
      const delayAttr = parseFloat(block.getAttribute("data-reveal-delay")) || 0.2;
      const isLoadAnim = block.getAttribute("data-reveal-load") === "true";

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
        ease: "power3.out",
        delay: delayAttr
      });
    });

  });

  return () => ctx.revert();
}


// ============================================
// DYNAMIC CURSOR ANIMATIONS
// ============================================
function initDynamicCustomTextCursor() {
  let cursorItem = document.querySelector(".cursor");
  let cursorParagraph = cursorItem.querySelector("p");
  let targets = document.querySelectorAll("[data-cursor]");
  let xOffset = 6;
  let yOffset = 140;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = '';

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quickTo for a more performative tween on the cursor
  let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  // Get the width of the cursor element including a buffer
  const getCursorEdgeThreshold = () => {
    return cursorItem.offsetWidth + 16; // Cursor width + 16px margin
  };

  window.addEventListener("mousemove", e => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY;

    let xPercent = xOffset;
    let yPercent = yOffset;

    let cursorEdgeThreshold = getCursorEdgeThreshold();
    if (cursorX > windowWidth - cursorEdgeThreshold) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      let newText = currentTarget.getAttribute("data-cursor");
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
        cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    }

    gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  targets.forEach(target => {
    target.addEventListener("mouseenter", () => {
      currentTarget = target;

      let newText = target.getAttribute("data-cursor");
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
        getCursorEdgeThreshold();
      }
    });
  });
}
