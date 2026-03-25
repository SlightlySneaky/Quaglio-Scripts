// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tickx
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);


// NAV ANIMATION //
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


// SPLIT TEXT + REVEAL BLOCK ANIMATIONS
// ------------------------------------
document.addEventListener("DOMContentLoaded", () => {
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

  function initSplitTextAndReveal() {
    const ctx = gsap.context(() => {

      // ---------- HEADINGS: split by characters ----------
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

          // mask container
          gsap.set(heading, { overflow: "hidden", position: "relative" });

          // start state of chars
          gsap.set(split.chars, {
            yPercent: 120,
            autoAlpha: 0
          });

          const tl = gsap.timeline(
            isLoadAnim
              ? {} // page load, no ScrollTrigger
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
            stagger: {
              each: 0.02, // slight offset per char
              from: "start"
            },
            delay: delayAttr
          });
        });

        // ---------- BODY: split by lines ----------
        const bodies = document.querySelectorAll("[split-body]");
        bodies.forEach((body) => {
          const delayAttr = parseFloat(body.getAttribute("data-split-delay")) || 0.1;
          const isLoadAnim = body.getAttribute("data-split-load") === "true";

          const split = new SplitText(body, {
            type: "lines",
            linesClass: "is-split-line"
          });

          // mask container
          gsap.set(body, { overflow: "hidden", position: "relative" });

          // start state for each line
          gsap.set(split.lines, {
            yPercent: 120,
            autoAlpha: 0
          });

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
            stagger: {
              each: 0.08, // line by line
              from: "start"
            },
            delay: delayAttr
          });
        });
      }

      // ---------- REVEAL BLOCKS: clip-path mask ----------
      const blocks = document.querySelectorAll("[reveal-block]");
      blocks.forEach((block) => {
        const delayAttr = parseFloat(block.getAttribute("data-reveal-delay")) || 0.2;
        const isLoadAnim = block.getAttribute("data-reveal-load") === "true";

        // starting clip mask (hidden from the right)
        gsap.set(block, {
          clipPath: "inset(0 100% 0 0)", // top right bottom left
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

  initSplitTextAndReveal();
});

// initalise all functions
