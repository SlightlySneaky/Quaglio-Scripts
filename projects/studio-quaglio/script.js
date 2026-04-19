// Hide text targets before GSAP sets initial state
(function () {
  const s = document.createElement("style");
  s.textContent = "[split-heading][hero],[split-body][hero],[preload-text]{visibility:hidden}[preload-img]{clip-path:inset(100% 0% 0% 0%)}";
  document.head.appendChild(s);
})();

// ============================================
// EASES
// Rule: all animations must use one of these named eases.
// Default: "osmo". Do not use GSAP built-in eases (power, expo, etc.).
// ============================================
gsap.registerPlugin(CustomEase);
CustomEase.create("reveal",    "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("osmo",      "M0,0 C0.625,0.05 0,1 1,1");
CustomEase.create("energy",    "M0,0 C0.32,0.72 0,1 1,1");
CustomEase.create("smooth",    "M0,0 C0.38,0.005 0.215,1 1,1");
CustomEase.create("punch",     "M0,0 C0.19,1 0.22,1 1,1");
CustomEase.create("relaxed",   "M0,0 C0.7,0 0.3,1 1,1");
CustomEase.create("expo.inOut","M0,0 C0.87,0 0.13,1 1,1");
CustomEase.create("jump",      "M0,0 C0.35,1.5 0.6,1 1,1");
CustomEase.create("pop",       "M0,0 C0.17,0.67 0.3,1.33 1,1");

// ============================================
// SHARED
// ============================================
function createEase(name) {
  return typeof CustomEase !== "undefined"
    ? CustomEase.create(name, "M0,0 C0.625,0.05 0,1 1,1")
    : "osmo";
}

// ============================================
// LENIS
// ============================================
gsap.registerPlugin(ScrollTrigger, Observer);
ScrollTrigger.config({ ignoreMobileResize: true });

window.addEventListener('load', () => ScrollTrigger.refresh());


// ============================================
// INIT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Lenis === "undefined") {
    console.warn("⚠️ Lenis: not found (script not loaded?)");
  } else {
    initLenis();
  }

  function safeInit(name, selector, fn) {
    if (selector && !document.querySelector(selector)) return;
    try { fn(); }
    catch (e) { console.error(`❌ ${name} failed:`, e); }
  }

  safeInit("Preloader",            '[preloader-wrap]',                                                                    initPreloader);
  safeInit("NavAnimation",         '[data-theme-nav="true"]',                                                             initNavAnimation);
  safeInit("SplitTextAndReveal",   '[split-heading]:not([hero]), [split-body]:not([hero]), [reveal-block]',               initSplitTextAndReveal);
  safeInit("CustomCursor",         '.cursor',                                                                             initDynamicCustomTextCursor);
  safeInit("BunnyPlayer",          '[data-bunny-player-init]',                                                            initBunnyPlayer);
  safeInit("PlayPauseVideo",       '[data-video="playpause"]',                                                            initPlayPauseVideoScroll);
  safeInit("GlobalParallax",       '[data-parallax="trigger"]',                                                           initGlobalParallax);
  safeInit("TestimonialSlider",    '[data-swiper-group="1"]',                                                            initTestimonialSlider);
  safeInit("StickyTitleScroll",    '[data-sticky-title="wrap"]',                                                          initStickyTitleScroll);
  safeInit("FooterParallax",       '[data-footer-parallax]',                                                              initFooterParallax);
  safeInit("AccordionCSS",         '[data-accordion-css-init]',                                                           initAccordionCSS);
  safeInit("DraggableMarquee",     '[data-draggable-marquee-init]',                                                       initDraggableMarquee);
  safeInit("ButtonCharStagger",    '[data-button-animate-chars]',                                                         initButtonCharacterStagger);
  safeInit("FormModal",            '[form-wrap]',                                                                         initFormModal);
  safeInit("SwiperSlider",         '[data-swiper-group="2"]',                                                             initSwiperSlider);
});


// ============================================
// LENIS
// ============================================
function initLenis() {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}


// ============================================
// PRELOADER ([preloader-wrap])
// ============================================
function initPreloader() {
  const wrap    = document.querySelector("[preloader-wrap]");
  const imgWrap = wrap.querySelector("[preload-img-wrap]");
  const imgs    = imgWrap ? gsap.utils.toArray("[preload-img]", imgWrap) : [];
  const textEl  = wrap.querySelector("[preload-text]");
  const ease    = createEase("quaglioPreload");

  gsap.set(wrap, { display: "flex", autoAlpha: 1 });

  const innerImgs = imgs.map((img) => img.querySelector("[img-item]")).filter(Boolean);

  if (imgs.length) {
    gsap.set(imgs, { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(innerImgs, { scale: 1.05 });
  }

  const tl = gsap.timeline();

  const getDur = (i) => Math.max(0.25, 0.9 * Math.pow(0.72, i));

  tl.to(imgs[0], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease }, 0);
  if (innerImgs[0]) tl.to(innerImgs[0], { scale: 1, duration: 1.0, ease }, "<");

  for (let i = 0; i < imgs.length - 1; i++) {
    const dur = getDur(i);
    tl.to(imgs[i],     { clipPath: "inset(0% 0% 100% 0%)", duration: dur, ease: "expo.inOut" }, ">");
    tl.to(imgs[i + 1], { clipPath: "inset(0% 0% 0% 0%)",   duration: dur, ease },                 "<");
    if (innerImgs[i + 1]) tl.to(innerImgs[i + 1], { scale: 1, duration: dur, ease },              "<");
    tl.set(imgs[i], { display: "none" });
  }

  tl.to(imgs[imgs.length - 1], { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, ">");
  tl.set(imgs, { display: "none" });

  if (textEl && typeof SplitText !== "undefined") {
    const split = SplitText.create(textEl, {
      type: "lines", mask: "lines", maskClass: "line-mask", linesClass: "text-line", autoSplit: true,
    });
    gsap.set(split.lines, { yPercent: 110 });
    textEl.style.visibility = "visible";
    tl.to(split.lines, { yPercent: 0, duration: 0.85, ease, stagger: 0.08 }, ">-=0.4");
  }

  tl.to({}, { duration: 1.2 })
    .to(wrap, {
      autoAlpha: 0,
      duration: 0.7,
      ease: "expo.inOut",
      onComplete() {
        gsap.set(wrap, { display: "none" });
        animateHeroText();
      },
    });
}

function animateHeroText() {
  if (typeof SplitText === "undefined") return;

  const ease = createEase("quaglioHero");

  gsap.utils.toArray("[split-body][hero]").forEach((el) => {
    const split = SplitText.create(el, {
      type: "lines", mask: "lines", maskClass: "line-mask", linesClass: "is-split-line", autoSplit: true,
    });
    gsap.set(split.lines, { yPercent: 120, autoAlpha: 0 });
    el.style.visibility = "visible";
    gsap.to(split.lines, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease, stagger: 0.08 });
  });

  gsap.utils.toArray("[split-heading][hero]").forEach((el) => {
    const split = SplitText.create(el, {
      type: "chars,words", mask: "chars", maskClass: "char-mask", charsClass: "is-split-char", autoSplit: true,
    });
    gsap.set(split.chars, { yPercent: 120, autoAlpha: 0 });
    el.style.visibility = "visible";
    gsap.to(split.chars, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease, stagger: 0.02 });
  });
}


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
      const headings = document.querySelectorAll("[split-heading]:not([hero])");
      headings.forEach((heading) => {
        const delayAttr = parseFloat(heading.getAttribute("data-split-delay")) || 0;
        const isLoadAnim = heading.getAttribute("data-split-load") === "true";

        const split = new SplitText(heading, {
          type: "chars,words",
          mask: "chars",
          maskClass: "char-mask",
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
          ease: "osmo",
          stagger: { each: 0.02, from: "start" },
          delay: delayAttr
        });
      });

      // ---------- BODY: split by lines ---------- //
      const bodies = document.querySelectorAll("[split-body]:not([hero])");
      bodies.forEach((body) => {
        const delayAttr = parseFloat(body.getAttribute("data-split-delay")) || 0.1;
        const isLoadAnim = body.getAttribute("data-split-load") === "true";

        const split = new SplitText(body, {
          type: "lines",
          mask: "lines",
          maskClass: "line-mask",
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
          ease: "osmo",
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
        ease: "osmo",
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
  let xTo = gsap.quickTo(cursorItem, "x", { ease: "osmo" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "osmo" });

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

    gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "osmo" });
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


// ============================================
// VIDEO PLAYER
// ============================================
function initBunnyPlayer() {
  document.querySelectorAll('[data-bunny-player-init]').forEach(function(player) {
    var src = player.getAttribute('data-player-src');
    if (!src) return;

    var video = player.querySelector('video');
    if (!video) return;

    try { video.pause(); } catch(_) {}
    try { video.removeAttribute('src'); video.load(); } catch(_) {}

    // Attribute helpers
    function setStatus(s) {
      if (player.getAttribute('data-player-status') !== s) {
        player.setAttribute('data-player-status', s);
      }
    }
    function setMutedState(v) {
      video.muted = !!v;
      player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
    }
    function setFsAttr(v) { player.setAttribute('data-player-fullscreen', v ? 'true' : 'false'); }
    function setActivated(v) { player.setAttribute('data-player-activated', v ? 'true' : 'false'); }
    if (!player.hasAttribute('data-player-activated')) setActivated(false);

    // Elements
    var timeline = player.querySelector('[data-player-timeline]');
    var progressBar = player.querySelector('[data-player-progress]');
    var bufferedBar = player.querySelector('[data-player-buffered]');
    var handle = player.querySelector('[data-player-timeline-handle]');
    var timeDurationEls = player.querySelectorAll('[data-player-time-duration]');
    var timeProgressEls = player.querySelectorAll('[data-player-time-progress]');

    // Flags
    var updateSize = player.getAttribute('data-player-update-size'); // "true" | "cover" | null
    var lazyMode = player.getAttribute('data-player-lazy');          // "true" | "meta" | null
    var isLazyTrue = lazyMode === 'true';
    var isLazyMeta = lazyMode === 'meta';
    var autoplay = player.getAttribute('data-player-autoplay') === 'true';
    var initialMuted = player.getAttribute('data-player-muted') === 'true';

    // Used to suppress 'ready' flicker when user just pressed play in lazy modes
    var pendingPlay = false;

    // Autoplay forces muted; IO will trigger "fake click"
    if (autoplay) { setMutedState(true); video.loop = true; } else { setMutedState(initialMuted); }

    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
    if (typeof video.disableRemotePlayback !== 'undefined') video.disableRemotePlayback = true;
    if (autoplay) video.autoplay = false;

    var isSafariNative = !!video.canPlayType('application/vnd.apple.mpegurl');
    var canUseHlsJs = !!(window.Hls && Hls.isSupported()) && !isSafariNative;

    // Minimal ratio fetch when requested (and not already handled by lazy meta)
    if (updateSize === 'true' && !isLazyMeta) {
      if (isLazyTrue) {
        // Do nothing: no fetch, no <video> touch when lazy=true
      } else {
        var prev = video.preload;
        video.preload = 'metadata';
        var onMeta2 = function() {
          setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
          video.removeEventListener('loadedmetadata', onMeta2);
          video.preload = prev || '';
        };
        video.addEventListener('loadedmetadata', onMeta2, { once: true });
        video.src = src;
      }
    }

    //  Lazy meta fetch (duration + aspect) without attaching playback
    function fetchMetaOnce() {
      getSourceMeta(src, canUseHlsJs).then(function(meta){
        if (meta.width && meta.height) setBeforeRatio(player, updateSize, meta.width, meta.height);
        if (timeDurationEls.length && isFinite(meta.duration) && meta.duration > 0) {
          setText(timeDurationEls, formatTime(meta.duration));
        }
        readyIfIdle(player, pendingPlay);
      });
    }

    // Attach media only once (for actual playback)
    var isAttached = false;
    var userInteracted = false;
    var lastPauseBy = '';
    function attachMediaOnce() {
      if (isAttached) return;
      isAttached = true;

      if (player._hls) { try { player._hls.destroy(); } catch(_) {} player._hls = null; }

      if (isSafariNative) {
        video.preload = (isLazyTrue || isLazyMeta) ? 'auto' : video.preload;
        video.src = src;
        video.addEventListener('loadedmetadata', function() {
          readyIfIdle(player, pendingPlay);
          if (updateSize === 'true') setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
          if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
        }, { once: true });
      } else if (canUseHlsJs) {
        var hls = new Hls({ maxBufferLength: 10 });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function() { hls.loadSource(src); });
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          readyIfIdle(player, pendingPlay);
          if (updateSize === 'true') {
            var lvls = hls.levels || [];
            var best = bestLevel(lvls);
            if (best && best.width && best.height) setBeforeRatio(player, updateSize, best.width, best.height);
          }
        });
        hls.on(Hls.Events.LEVEL_LOADED, function(e, data) {
          if (data && data.details && isFinite(data.details.totalduration)) {
            if (timeDurationEls.length) setText(timeDurationEls, formatTime(data.details.totalduration));
          }
        });
        player._hls = hls;
      } else {
        video.src = src;
      }
    }

    // Initialize based on lazy mode
    if (isLazyMeta) {
      fetchMetaOnce();
      video.preload = 'none';
    } else if (isLazyTrue) {
      video.preload = 'none';
    } else {
      attachMediaOnce();
    }

    // Toggle play/pause
    function togglePlay() {
      userInteracted = true;
      if (video.paused || video.ended) {
        if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();
        pendingPlay = true;
        lastPauseBy = '';
        setStatus('loading');
        safePlay(video);
      } else {
        lastPauseBy = 'manual';
        video.pause();
      }
    }

    // Toggle mute
    function toggleMute() {
      video.muted = !video.muted;
      player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
    }

    // Fullscreen helpers
    function isFsActive() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
    function enterFullscreen() {
      if (player.requestFullscreen) return player.requestFullscreen();
      if (video.requestFullscreen) return video.requestFullscreen();
      if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen === 'function') return video.webkitEnterFullscreen();
    }
    function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (video.webkitDisplayingFullscreen && typeof video.webkitExitFullscreen === 'function') return video.webkitExitFullscreen();
    }
    function toggleFullscreen() { if (isFsActive() || video.webkitDisplayingFullscreen) exitFullscreen(); else enterFullscreen(); }
    document.addEventListener('fullscreenchange', function() { setFsAttr(isFsActive()); });
    document.addEventListener('webkitfullscreenchange', function() { setFsAttr(isFsActive()); });
    video.addEventListener('webkitbeginfullscreen', function() { setFsAttr(true); });
    video.addEventListener('webkitendfullscreen', function() { setFsAttr(false); });

    // Controls (delegated)
    player.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-player-control]');
      if (!btn || !player.contains(btn)) return;
      var type = btn.getAttribute('data-player-control');
      if (type === 'play' || type === 'pause' || type === 'playpause') togglePlay();
      else if (type === 'mute') toggleMute();
      else if (type === 'fullscreen') toggleFullscreen();
    });

    // Time text (not in rAF)
    function updateTimeTexts() {
      if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
      if (timeProgressEls.length) setText(timeProgressEls, formatTime(video.currentTime));
    }
    video.addEventListener('timeupdate', updateTimeTexts);
    video.addEventListener('loadedmetadata', function(){ updateTimeTexts(); maybeSetRatioFromVideo(player, updateSize, video); });
    video.addEventListener('loadeddata', function(){ maybeSetRatioFromVideo(player, updateSize, video); });
    video.addEventListener('playing', function(){ maybeSetRatioFromVideo(player, updateSize, video); });
    video.addEventListener('durationchange', updateTimeTexts);

    // rAF visuals (progress + handle only)
    var rafId;
    function updateProgressVisuals() {
      if (!video.duration) return;
      var playedPct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + playedPct) + '%)';
      if (handle) handle.style.left = playedPct + '%';
    }
    function loop() {
      updateProgressVisuals();
      if (!video.paused && !video.ended) rafId = requestAnimationFrame(loop);
    }

    // Buffered bar (not in rAF)
    function updateBufferedBar() {
      if (!bufferedBar || !video.duration || !video.buffered.length) return;
      var end = video.buffered.end(video.buffered.length - 1);
      var buffPct = (end / video.duration) * 100;
      bufferedBar.style.transform = 'translateX(' + (-100 + buffPct) + '%)';
    }
    video.addEventListener('progress', updateBufferedBar);
    video.addEventListener('loadedmetadata', updateBufferedBar);
    video.addEventListener('durationchange', updateBufferedBar);

    // Media event wiring
    video.addEventListener('play', function() { setActivated(true); cancelAnimationFrame(rafId); loop(); setStatus('playing'); });
    video.addEventListener('playing', function() { pendingPlay = false; setStatus('playing'); });
    video.addEventListener('pause', function() { pendingPlay = false; cancelAnimationFrame(rafId); updateProgressVisuals(); setStatus('paused'); });
    video.addEventListener('waiting', function() { setStatus('loading'); });
    video.addEventListener('canplay', function() { readyIfIdle(player, pendingPlay); });
    video.addEventListener('ended', function() { pendingPlay = false; cancelAnimationFrame(rafId); updateProgressVisuals(); setStatus('paused'); setActivated(false); });

    // Scrubbing (pointer events)
    if (timeline) {
      var dragging = false, wasPlaying = false, targetTime = 0, lastSeekTs = 0, seekThrottle = 180, rect = null;
      window.addEventListener('resize', function() { if (!dragging) rect = null; });
      function getFractionFromX(x) {
        if (!rect) rect = timeline.getBoundingClientRect();
        var f = (x - rect.left) / rect.width; if (f < 0) f = 0; if (f > 1) f = 1; return f;
      }
      function previewAtFraction(f) {
        if (!video.duration) return;
        var pct = f * 100;
        if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + pct) + '%)';
        if (handle) handle.style.left = pct + '%';
        if (timeProgressEls.length) setText(timeProgressEls, formatTime(f * video.duration));
      }
      function maybeSeek(now) {
        if (!video.duration) return;
        if ((now - lastSeekTs) < seekThrottle) return;
        lastSeekTs = now; video.currentTime = targetTime;
      }
      function onPointerDown(e) {
        if (!video.duration) return;
        dragging = true; wasPlaying = !video.paused && !video.ended; if (wasPlaying) video.pause();
        player.setAttribute('data-timeline-drag', 'true'); rect = timeline.getBoundingClientRect();
        var f = getFractionFromX(e.clientX); targetTime = f * video.duration; previewAtFraction(f); maybeSeek(performance.now());
        timeline.setPointerCapture && timeline.setPointerCapture(e.pointerId);
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        e.preventDefault();
      }
      function onPointerMove(e) {
        if (!dragging) return;
        var f = getFractionFromX(e.clientX); targetTime = f * video.duration; previewAtFraction(f); maybeSeek(performance.now()); e.preventDefault();
      }
      function onPointerUp() {
        if (!dragging) return;
        dragging = false; player.setAttribute('data-timeline-drag', 'false'); rect = null; video.currentTime = targetTime;
        if (wasPlaying) safePlay(video); else { updateProgressVisuals(); updateTimeTexts(); }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      timeline.addEventListener('pointerdown', onPointerDown, { passive: false });
      if (handle) handle.addEventListener('pointerdown', onPointerDown, { passive: false });
    }

    // Hover/idle detection (pointer-based)
    var hoverTimer;
    var hoverHideDelay = 3000;
    function setHover(state) {
      if (player.getAttribute('data-player-hover') !== state) {
        player.setAttribute('data-player-hover', state);
      }
    }
    function scheduleHide() { clearTimeout(hoverTimer); hoverTimer = setTimeout(function() { setHover('idle'); }, hoverHideDelay); }
    function wakeControls() { setHover('active'); scheduleHide(); }
    player.addEventListener('pointerdown', wakeControls);
    document.addEventListener('fullscreenchange', wakeControls);
    document.addEventListener('webkitfullscreenchange', wakeControls);
    var trackingMove = false;
    function onPointerMoveGlobal(e) {
      var r = player.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) wakeControls();
    }
    player.addEventListener('pointerenter', function() {
      wakeControls();
      if (!trackingMove) { trackingMove = true; window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true }); }
    });
    player.addEventListener('pointerleave', function() {
      setHover('idle'); clearTimeout(hoverTimer);
      if (trackingMove) { trackingMove = false; window.removeEventListener('pointermove', onPointerMoveGlobal); }
    });

    // In-view auto play/pause (only when autoplay is true)
    if (autoplay) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var inView = entry.isIntersecting && entry.intersectionRatio > 0;

          if (inView) {
            if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();

            if (video.paused) {
              // we will attempt to play -> show loading until events flip to playing
              lastPauseBy = '';
              pendingPlay = true;
              setStatus('loading');
              safePlay(video);
            } else {
              // already playing; don't flash loading
              setStatus('playing');
            }
          } else {
            if (!video.paused && !video.ended) {
              lastPauseBy = 'io';
              video.pause();
              setStatus('paused'); // keep UI honest while out of view
            }
          }
        });
      }, { threshold: 0.1 });

      io.observe(player);
    }
  });

  // Helper: time/text/meta/ratio utilities
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '00:00';
    var s = Math.floor(sec), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return h > 0 ? (h + ':' + pad2(m) + ':' + pad2(r)) : (pad2(m) + ':' + pad2(r));
  }
  function setText(nodes, text) { nodes.forEach(function(n){ n.textContent = text; }); }

  // Helper: Choose best HLS level by resolution --- */
  function bestLevel(levels) {
    if (!levels || !levels.length) return null;
    return levels.reduce(function(a, b) { return ((b.width||0) > (a.width||0)) ? b : a; }, levels[0]);
  }

  // Helper: Safe programmatic play
  function safePlay(video) {
    var p = video.play();
    if (p && typeof p.then === 'function') p.catch(function(){});
  }

  // Helper: Ready status guard
  function readyIfIdle(player, pendingPlay) {
    if (!pendingPlay &&
        player.getAttribute('data-player-activated') !== 'true' &&
        player.getAttribute('data-player-status') === 'idle') {
      player.setAttribute('data-player-status', 'ready');
    }
  }

  // Helper: Ratio Setter
  function setBeforeRatio(player, updateSize, w, h) {
    if (updateSize !== 'true' || !w || !h) return;
    var before = player.querySelector('[data-player-before]');
    if (!before) return;
    before.style.paddingTop = (h / w * 100) + '%';
  }
  function maybeSetRatioFromVideo(player, updateSize, video) {
    if (updateSize !== 'true') return;
    var before = player.querySelector('[data-player-before]');
    if (!before) return;
    var hasPad = before.style.paddingTop && before.style.paddingTop !== '0%';
    if (!hasPad && video.videoWidth && video.videoHeight) {
      setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
    }
  }

  // Helper: simple URL resolver
  function resolveUrl(base, rel) { try { return new URL(rel, base).toString(); } catch(_) { return rel; } }

  // Helper: Unified meta fetch (hls.js or native fetch)
  function getSourceMeta(src, useHlsJs) {
    return new Promise(function(resolve) {
      if (useHlsJs && window.Hls && Hls.isSupported()) {
        try {
          var tmp = new Hls();
          var out = { width: 0, height: 0, duration: NaN };
          var haveLvls = false, haveDur = false;

          tmp.on(Hls.Events.MANIFEST_PARSED, function(e, data) {
            var lvls = (data && data.levels) || tmp.levels || [];
            var best = bestLevel(lvls);
            if (best && best.width && best.height) { out.width = best.width; out.height = best.height; haveLvls = true; }
          });
          tmp.on(Hls.Events.LEVEL_LOADED, function(e, data) {
            if (data && data.details && isFinite(data.details.totalduration)) { out.duration = data.details.totalduration; haveDur = true; }
          });
          tmp.on(Hls.Events.ERROR, function(){ try { tmp.destroy(); } catch(_) {} resolve(out); });
          tmp.on(Hls.Events.LEVEL_LOADED, function(){ try { tmp.destroy(); } catch(_) {} resolve(out); });

          tmp.loadSource(src);
          return;
        } catch(_) {
          resolve({ width:0, height:0, duration:NaN });
          return;
        }
      }

      function parseMaster(masterText) {
        var lines = masterText.split(/\r?\n/);
        var bestW = 0, bestH = 0, firstMedia = null, lastInf = null;
        for (var i=0;i<lines.length;i++) {
          var line = lines[i];
          if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
            lastInf = line;
          } else if (lastInf && line && line[0] !== '#') {
            if (!firstMedia) firstMedia = line.trim();
            var m = /RESOLUTION=(\d+)x(\d+)/.exec(lastInf);
            if (m) {
              var w = parseInt(m[1],10), h = parseInt(m[2],10);
              if (w > bestW) { bestW = w; bestH = h; }
            }
            lastInf = null;
          }
        }
        return { bestW: bestW, bestH: bestH, media: firstMedia };
      }
      function sumDuration(mediaText) {
        var dur = 0, re = /#EXTINF:([\d.]+)/g, m;
        while ((m = re.exec(mediaText))) dur += parseFloat(m[1]);
        return dur;
      }

      fetch(src, { credentials: 'omit', cache: 'no-store' }).then(function(r){
        if (!r.ok) throw new Error('master');
        return r.text();
      }).then(function(master){
        var info = parseMaster(master);
        if (!info.media) { resolve({ width: info.bestW||0, height: info.bestH||0, duration: NaN }); return; }
        var mediaUrl = resolveUrl(src, info.media);
        return fetch(mediaUrl, { credentials: 'omit', cache: 'no-store' }).then(function(r){
          if (!r.ok) throw new Error('media');
          return r.text();
        }).then(function(mediaText){
          resolve({ width: info.bestW||0, height: info.bestH||0, duration: sumDuration(mediaText) });
        });
      }).catch(function(){ resolve({ width:0, height:0, duration:NaN }); });
    });
  }
}


// ============================================
// PLAY/PAUSE VIDEO ON SCROLL
// ============================================
function initPlayPauseVideoScroll() {
  const videos = gsap.utils.toArray('[data-video="playpause"]');
  videos.forEach(el => {
    const video = el.querySelector('video');
    if (!video) return;
    ScrollTrigger.create({
      trigger: el,
      start: '0% 100%',
      end: '100% 0%',
      onEnter:      () => video.play(),
      onEnterBack:  () => video.play(),
      onLeave:      () => video.pause(),
      onLeaveBack:  () => video.pause(),
    });
  });
}


// ============================================
// GLOBAL PARALLAX
// ============================================
function initGlobalParallax() {
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

          const target    = trigger.querySelector('[data-parallax="target"]') || trigger;
          const direction = trigger.getAttribute("data-parallax-direction") || "vertical";
          const prop      = direction === "horizontal" ? "xPercent" : "yPercent";
          const scrubAttr = trigger.getAttribute("data-parallax-scrub");
          const scrub     = scrubAttr ? parseFloat(scrubAttr) : true;
          const startVal  = trigger.getAttribute("data-parallax-start")  !== null ? parseFloat(trigger.getAttribute("data-parallax-start"))  : 20;
          const endVal    = trigger.getAttribute("data-parallax-end")    !== null ? parseFloat(trigger.getAttribute("data-parallax-end"))    : -20;
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
// TESTIMONIAL SLIDER (Swiper + SplitText)
// ============================================
function initTestimonialSlider() {
  const swiperEl = document.querySelector('[data-swiper-group="1"] .swiper');
  const originalSlideCount = swiperEl
    ? swiperEl.querySelectorAll(".swiper-wrapper > .swiper-slide").length
    : 0;

  const splitCache = new Map();

  function initSplits(slides) {
    slides.forEach(function (slide) {
      if (splitCache.has(slide)) return;
      const quoteEl   = slide.querySelector('[data-split="quote"]');
      const nameEl    = slide.querySelector('[data-split="name"]');
      const roleEl    = slide.querySelector('[data-split="role"]');
      const profileEl = slide.querySelector(".test_profile_wrap");
      const splits    = { profileEl };

      if (quoteEl) {
        splits.quote = new SplitText(quoteEl, { type: "lines,words", mask: "lines", maskClass: "line-mask" });
        gsap.set(quoteEl, { opacity: 1 });
        gsap.set(splits.quote.words, { opacity: 0, y: 30 });
      }
      if (nameEl) {
        splits.name = new SplitText(nameEl, { type: "chars", mask: "chars", maskClass: "char-mask" });
        gsap.set(nameEl, { opacity: 1 });
        gsap.set(splits.name.chars, { opacity: 0, y: 10 });
      }
      if (roleEl) {
        splits.role = new SplitText(roleEl, { type: "words", mask: "words", maskClass: "word-mask" });
        gsap.set(roleEl, { opacity: 1 });
        gsap.set(splits.role.words, { opacity: 0, y: 10 });
      }
      if (profileEl) gsap.set(profileEl, { opacity: 0, y: 20, scale: 0.95 });

      splitCache.set(slide, splits);
    });
  }

  function animateIn(slide) {
    const splits = splitCache.get(slide);
    if (!splits) return;
    const targets = [splits.profileEl, splits.quote?.words, splits.name?.chars, splits.role?.words].filter(Boolean);
    gsap.killTweensOf(targets);
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "osmo" } });
    if (splits.profileEl) tl.fromTo(splits.profileEl, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1 }, 0);
    if (splits.quote)     tl.fromTo(splits.quote.words,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.02 }, 0.05);
    if (splits.name)      tl.fromTo(splits.name.chars,   { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.01 }, "-=0.3");
    if (splits.role)      tl.fromTo(splits.role.words,   { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.03 }, "-=0.3");
  }

  function animateOut(slide) {
    const splits = splitCache.get(slide);
    if (!splits) return;
    const targets = [splits.profileEl, splits.quote?.words, splits.name?.chars, splits.role?.words].filter(Boolean);
    gsap.killTweensOf(targets);
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "energy" } });
    if (splits.role)      tl.to(splits.role.words,  { opacity: 0, y: 10, stagger: { each: 0.03, from: "end" } }, 0);
    if (splits.name)      tl.to(splits.name.chars,   { opacity: 0, y: 10, stagger: { each: 0.01, from: "end" } }, 0.05);
    if (splits.quote)     tl.to(splits.quote.words,  { opacity: 0, y: 30, stagger: { each: 0.02, from: "end" } }, 0.1);
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
// SCROLL TEXT CHANGE
// ============================================
function initStickyTitleScroll() {
  document.querySelectorAll('[data-sticky-title="wrap"]').forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      }
    });
    const revealDuration = 0.7, fadeOutDuration = 0.7, overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      heading.setAttribute("aria-label", heading.textContent);
      const split = new SplitText(heading, { type: "words,chars", mask: "chars", maskClass: "char-mask" });
      split.chars.forEach(char => { if (char.parentElement) char.parentElement.classList.add("char-mask"); });
      split.words.forEach(word => word.setAttribute("aria-hidden", "true"));
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }
      masterTl.add(headingTl, index === 0 ? undefined : `-=${overlapOffset}`);
    });
  });
}


// ============================================
// FOOTER PARALLAX
// ============================================
function initFooterParallax() {
  gsap.matchMedia().add("(min-width: 768px)", () => {
    document.querySelectorAll('[data-footer-parallax]').forEach(el => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: true
        }
      });
      const inner = el.querySelector('[data-footer-parallax-inner]');
      const dark  = el.querySelector('[data-footer-parallax-dark]');
      if (inner) tl.from(inner, { yPercent: -25, ease: 'linear' });
      if (dark)  tl.from(dark,  { opacity: 0.5, ease: 'linear' }, '<');
    });
  });
}


// ============================================
// ACCORDION CSS
// ============================================
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
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
// TIMEZONE NAV
// ============================================
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


// ============================================
// SVG FILL LOOP
// ============================================
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
// DRAGGABLE MARQUEE ([data-draggable-marquee-init])
// ============================================
function initDraggableMarquee() {
  const wrappers = document.querySelectorAll("[data-draggable-marquee-init]");

  const getNumberAttr = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };

  wrappers.forEach((wrapper) => {
    if (wrapper.getAttribute("data-draggable-marquee-init") === "initialized") return;

    const collection = wrapper.querySelector("[data-draggable-marquee-collection]");
    const list = wrapper.querySelector("[data-draggable-marquee-list]");
    if (!collection || !list) return;

    const duration    = getNumberAttr(wrapper, "data-duration", 20);
    const multiplier  = getNumberAttr(wrapper, "data-multiplier", 40);
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
          .to(timeScale, { value: restingDirection, duration: 1.0 });
      }
    });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter:      () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onEnterBack:  () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onLeave:      () => { marqueeLoop.pause(); marqueeObserver.disable(); },
      onLeaveBack:  () => { marqueeLoop.pause(); marqueeObserver.disable(); },
    });

    wrapper.setAttribute("data-draggable-marquee-init", "initialized");
  });
}


// ============================================
// Form modal ([form-open] / [form-wrap])
// ============================================

function initFormModal() {
  const openers = document.querySelectorAll("[form-open]");
  const wrap    = document.querySelector("[form-wrap]");
  if (!wrap) return;

  const inner   = wrap.querySelector("[form-inner]");
  const bg      = wrap.querySelector("[form-bg]");
  const closers = wrap.querySelectorAll("[form-close]");
  if (!inner) { console.error("❌ Form modal: [form-inner] not found inside [form-wrap]"); return; }
  if (!bg)    { console.error("❌ Form modal: [form-bg] not found inside [form-wrap]"); return; }

  console.log(`Form modal elements found — openers: ${openers.length}, wrap:`, wrap, "inner:", inner, "bg:", bg);

  gsap.set(wrap,  { display: "flex", autoAlpha: 0, pointerEvents: "none" });
  gsap.set(bg,    { autoAlpha: 0 });
  gsap.set(inner, { x: "100%" });

  function openForm() {
    console.log("Form modal: open triggered");
    gsap.set(wrap, { autoAlpha: 1, pointerEvents: "auto" });
    const tl = gsap.timeline();
    tl.to(bg, { autoAlpha: 1, duration: 0.5, ease: "osmo" }, 0)
      .to(inner, { x: "0%", duration: 0.65, ease: "osmo" }, "-=0.15");
  }

  function closeForm() {
    const tl = gsap.timeline({
      onComplete: () => gsap.set(wrap, { autoAlpha: 0, pointerEvents: "none" }),
    });
    tl.to(inner, { x: "100%", duration: 0.5, ease: "energy" }, 0)
      .to(bg, { autoAlpha: 0, duration: 0.4, ease: "energy" }, 0.1);
  }

  openers.forEach((el) => el.addEventListener("click", openForm));
  closers.forEach((el) => el.addEventListener("click", closeForm));
  bg.addEventListener("click", closeForm);

  wrap.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      wrap
        .querySelectorAll(`input[type="radio"][name="${radio.name}"]`)
        .forEach((r) => {
          const text = r.closest("label")?.querySelector(".w-form-label");
          if (text) text.style.color = "";
        });
      const text = radio.closest("label")?.querySelector(".w-form-label");
      if (text) text.style.color = "white";
    });
  });
}


// ============================================
// BUTTON CHARACTER STAGGER ([data-button-animate-chars])
// ============================================
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}


// ============================================
// SWIPER SLIDER ([data-swiper-group])
// Uses swiper-2 / swiper-wrapper-2 / swiper-slide-2 classes
// to avoid conflicting with the testimonial swiper
// ============================================
function initSwiperSlider() {
  const cssBezier = "cubic-bezier(0.16, 0, 0.3, 1)";

  const groups = document.querySelectorAll('[data-swiper-group="2"]');
  console.log(`🔵 initSwiperSlider: found ${groups.length} group(s)`);

  groups.forEach((swiperGroup, i) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    console.log(`🔵 Group ${i}: wrap element →`, swiperSliderWrap);
    if (!swiperSliderWrap) {
      console.warn(`⚠️ Group ${i}: no [data-swiper-wrap] found, skipping`);
      return;
    }

    const wrapperEl = swiperSliderWrap.querySelector(".swiper-wrapper-2");
    if (wrapperEl) wrapperEl.classList.add("swiper-wrapper");
    swiperSliderWrap.querySelectorAll(".swiper-slide-2").forEach(s => s.classList.add("swiper-slide"));

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    console.log(`🔵 Group ${i}: prevButton →`, prevButton, `| nextButton →`, nextButton);

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
          console.log(`✅ Group ${i}: Swiper initialized — slides: ${this.slides.length}, loop: ${this.params.loop}`);
          this.wrapperEl.style.transitionTimingFunction = cssBezier;
        },
        setTransition(duration) {
          this.wrapperEl.style.transitionDuration = `${duration}ms`;
          this.wrapperEl.style.transitionTimingFunction = cssBezier;
        },
        error(err) {
          console.error(`❌ Group ${i}: Swiper error →`, err);
        },
      },
    });
  });
}
