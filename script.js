/**
 * ============================================================================
 * CINEMATIC LUXURY WEDDING INVITATION — JAVASCRIPT ENGINE
 * Ahmad & Sarah | 25 December 2026
 * Pure Front-End Visual & Interactive Experience
 * ============================================================================
 */

/* ============================================================================
   1. EDITABLE WEDDING CONFIGURATION
   Centralized parameters for seamless customization.
   ============================================================================ */
const WEDDING_CONFIG = {
  groomName: "محمد",
  brideName: "نور",
  groomNameEn: "Mohamed",
  brideNameEn: "Nour",
  dateArabic: "الأحد، 4 أكتوبر 2026",
  hijriDateArabic: "22 ربيع الأول 1448 هـ",
  timeArabic: "8:00 مساءً",
  venueName: "قاعة ريتال فيو",
  venueSubName: "نادي المعلمين — البحر الأعظم",
  venueAddress: "شارع البحر الأعظم، الجيزة — قاعات السرايا",
  googleMapsUrl: "https://maps.app.goo.gl/dYpVEPK7u5eKUrrQ9",
  // Target countdown timestamp: Oct 4, 2026 20:00:00 GMT+0300
  targetCountdownDate: new Date("2026-10-04T20:00:00+03:00").getTime(),
};

document.addEventListener("DOMContentLoaded", () => {
  initLenisAndGSAP();
  initAmbientCanvas();
  initAudioSystem();
  initOpeningIntro();
  initHeroParallax();
  initAstrolabeAnimations();
  initCountdownTimer();
  initCinematicMoment();
  initVisualRsvpForm();
  initBackToTop();
});

/* ============================================================================
   2. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER SYNC
   ============================================================================ */
let lenisInstance = null;

function initLenisAndGSAP() {
  // Check if Lenis is loaded
  if (typeof Lenis !== "undefined") {
    lenisInstance = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2.0,
      infinite: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      lenisInstance.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
}

/* ============================================================================
   3. ATMOSPHERIC CANVAS: GOLDEN PARTICLES, STARDUST & PETALS
   ============================================================================ */
let canvasBurstTrigger = null;

function initAmbientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      resizeFrame = null;
    });
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Particle sets
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 24 : 50;

  // Golden embers and petals
  class Particle {
    constructor(isTemporary = false, x = null, y = null) {
      this.isTemporary = isTemporary;
      this.reset(x, y);
    }

    reset(x = null, y = null) {
      this.x = x !== null ? x : Math.random() * width;
      this.y = y !== null ? y : Math.random() * height;
      this.type = Math.random() > 0.75 ? "petal" : "ember";

      if (this.type === "petal") {
        this.size = Math.random() * 4 + 3;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = Math.random() * 0.8 + 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.4 + 0.25;
        this.color = "rgba(215, 160, 150, ";
      } else {
        this.size = Math.random() * 2.2 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 0.6 - 0.2; // floats upward gently
        this.opacity = Math.random() * 0.7 + 0.3;
        this.color = Math.random() > 0.5 ? "rgba(197, 155, 39, " : "rgba(167, 124, 25, ";
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinkleVal = Math.random() * Math.PI;
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.type === "petal") {
        this.rotation += this.rotationSpeed;
        if (this.y > height + 20) {
          if (this.isTemporary) return false;
          this.y = -20;
          this.x = Math.random() * width;
        }
      } else {
        this.twinkleVal += this.twinkleSpeed;
        this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkleVal));
        if (this.y < -20) {
          if (this.isTemporary) return false;
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }

      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;

      return true;
    }

    draw() {
      if (this.type === "petal") {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color + this.opacity + ")";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const op = this.currentOpacity || this.opacity;
        ctx.fillStyle = this.color + op + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Temporary burst particles for celebrations
  const burstParticles = [];

  canvasBurstTrigger = function (originX, originY, count = 60) {
    for (let i = 0; i < count; i++) {
      const p = new Particle(true, originX, originY);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.size = Math.random() * 3 + 1.5;
      p.opacity = 1;
      p.decay = Math.random() * 0.015 + 0.008;
      burstParticles.push(p);
    }
  };

  let animationFrame = null;
  let isVisible = true;

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !animationFrame) animate();
  });
  visibilityObserver.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isVisible = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = null;
    } else {
      isVisible = true;
      if (!animationFrame) animate();
    }
  });

  function animate() {
    if (!isVisible) {
      animationFrame = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vx *= 0.96;
      bp.vy *= 0.96;
      bp.opacity -= bp.decay;

      if (bp.opacity <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(244, 227, 178, ${bp.opacity})`;
      ctx.beginPath();
      ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================================
   3.1. AUDIO CONTROLLER: BACKGROUND MUSIC & ROYAL SEAL TRIGGER
   ============================================================================ */
let weddingAudio = null;
let audioToggleBtn = null;
let audioStatusText = null;
let audioFloatingWidget = null;
let isAudioPlaying = false;

function initAudioSystem() {
  weddingAudio = document.getElementById("wedding-audio");
  audioToggleBtn = document.getElementById("audio-toggle-btn");
  audioStatusText = document.getElementById("audio-status-text");
  audioFloatingWidget = document.getElementById("audio-control");

  if (!weddingAudio || !audioToggleBtn) return;

  // Set gentle ambient background volume
  weddingAudio.volume = 0.8;

  // Toggle button click listener
  audioToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWeddingMusic();
  });

  // Keep state in sync with native audio events
  weddingAudio.addEventListener("play", () => {
    isAudioPlaying = true;
    updateAudioUI(true);
  });

  weddingAudio.addEventListener("pause", () => {
    isAudioPlaying = false;
    updateAudioUI(false);
  });

  weddingAudio.addEventListener("ended", () => {
    weddingAudio.currentTime = 0;
    weddingAudio.play().catch(() => {});
  });

  // If the user refreshed or already opened the page
  if (!document.body.classList.contains("loading-locked")) {
    showAudioWidget();
  }
}

function showAudioWidget() {
  if (audioFloatingWidget) {
    audioFloatingWidget.classList.add("widget-visible");
  }
}

function playWeddingMusic() {
  if (!weddingAudio) return;

  showAudioWidget();

  const playPromise = weddingAudio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isAudioPlaying = true;
        updateAudioUI(true);
      })
      .catch((err) => {
        console.warn("Audio playback delayed or blocked by browser policy:", err);
        isAudioPlaying = false;
        updateAudioUI(false);
      });
  }
}

function pauseWeddingMusic() {
  if (!weddingAudio) return;
  weddingAudio.pause();
  isAudioPlaying = false;
  updateAudioUI(false);
}

function toggleWeddingMusic() {
  if (!weddingAudio) return;
  if (weddingAudio.paused) {
    playWeddingMusic();
  } else {
    pauseWeddingMusic();
  }
}

function updateAudioUI(playing) {
  if (!audioToggleBtn) return;

  if (playing) {
    audioToggleBtn.classList.remove("is-paused");
    audioToggleBtn.classList.add("is-playing");
    audioToggleBtn.setAttribute("aria-pressed", "true");
    audioToggleBtn.setAttribute("aria-label", "إيقاف الموسيقى");
    audioToggleBtn.setAttribute("title", "إيقاف الموسيقى");
  } else {
    audioToggleBtn.classList.remove("is-playing");
    audioToggleBtn.classList.add("is-paused");
    audioToggleBtn.setAttribute("aria-pressed", "false");
    audioToggleBtn.setAttribute("aria-label", "تشغيل الموسيقى");
    audioToggleBtn.setAttribute("title", "تشغيل الموسيقى");
  }
}

/* ============================================================================
   4. SCENE 0: CINEMATIC OPENING & CURTAIN REVEAL
   ============================================================================ */
function initOpeningIntro() {
  const introEl = document.getElementById("cinematic-intro");
  const enterBtn = document.getElementById("btn-enter-experience");

  if (!introEl || !enterBtn) return;

  enterBtn.addEventListener("click", () => {
    // 1. Play background wedding music upon clicking the invitation seal
    playWeddingMusic();
    showAudioWidget();

    // 2. Open curtains with high-end audio-visual drama
    introEl.classList.add("opened");

    if (canvasBurstTrigger) {
      canvasBurstTrigger(window.innerWidth / 2, window.innerHeight / 2, 70);
    }

    // Smoothly start hero entrance animation in harmony with curtains opening
    setTimeout(() => {
      triggerHeroEntrance();
    }, 250);

    setTimeout(() => {
      introEl.classList.add("revealed");
      document.body.classList.remove("loading-locked");
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 1300);
  });
}

function triggerHeroEntrance() {
  const heroContent = document.getElementById("hero-content");
  if (!heroContent) return;

  // Make visible now that curtains are parting
  heroContent.style.visibility = "visible";

  if (typeof gsap === "undefined") {
    heroContent.style.opacity = "1";
    heroContent.style.transform = "none";
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    ".hero-bg-layer",
    { scale: 1.07 },
    { scale: 1, duration: 2 }
  )
    .to(
      heroContent,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.3,
      },
      "-=1.7"
    )
    .fromTo(
      ".royal-crest",
      { opacity: 0, y: -15, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9 },
      "-=1.0"
    )
    .fromTo(
      ".hero-header-tag",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.8"
    )
    .fromTo(
      ".hero-name",
      { opacity: 0, y: 20, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.18, duration: 1.1 },
      "-=0.6"
    )
    .fromTo(
      ".hero-divider-knot",
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.8 },
      "-=0.8"
    )
    .fromTo(
      ".hero-subtext",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(
      ".hero-quran-verse",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(
      ".hero-cta-wrapper",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.5"
    );
}

/* ============================================================================
   5. HERO MOUSE PARALLAX
   ============================================================================ */
function initHeroParallax() {
  const heroSection = document.getElementById("hero");
  const heroBg = document.getElementById("hero-bg");
  const heroContent = document.getElementById("hero-content");

  if (!heroSection || !heroBg || !heroContent) return;

  let parallaxFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  function updateParallax() {
    parallaxFrame = null;
    if (window.innerWidth < 992) return;

    const deltaX = (pointerX - window.innerWidth / 2) / (window.innerWidth / 2);
    const deltaY = (pointerY - window.innerHeight / 2) / (window.innerHeight / 2);

    heroBg.style.transform = `translate3d(${deltaX * -15}px, ${deltaY * -12}px, 0) scale(1.04)`;
    heroContent.style.transform = `translate3d(${deltaX * 10}px, ${deltaY * 8}px, 0)`;
  }

  heroSection.addEventListener("mousemove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
  });

  heroSection.addEventListener("mouseleave", () => {
    heroBg.style.transform = `scale(1) translate(0px, 0px)`;
    heroContent.style.transform = `translate(0px, 0px)`;
  });

  // Smooth scroll explore button
  const exploreBtn = document.getElementById("btn-hero-explore");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("details");
      if (target) {
        if (lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -25, duration: 0.75 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }
}

/* ============================================================================
   6. SCENE 2: ARTISTIC ASTROLABE DETAILS
   ============================================================================ */
function initAstrolabeAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Reveal timeline for celestial cards on scroll without jumping/flashing
  gsap.fromTo(
    ".celestial-card",
    { opacity: 0, y: 35 },
    {
      scrollTrigger: {
        trigger: "#astrolabe-composition",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      stagger: 0.18,
      duration: 1,
      ease: "power2.out",
      immediateRender: false,
    }
  );

  gsap.fromTo(
    ".center-medallion",
    { opacity: 0, scale: 0.75, rotation: -20 },
    {
      scrollTrigger: {
        trigger: "#astrolabe-composition",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "back.out(1.5)",
      immediateRender: false,
    }
  );
}

/* ============================================================================
   7. SCENE 3: CINEMATIC COUNTDOWN TIMER
   ============================================================================ */
function initCountdownTimer() {
  const daysEl = document.getElementById("count-days");
  const hoursEl = document.getElementById("count-hours");
  const minutesEl = document.getElementById("count-minutes");
  const secondsEl = document.getElementById("count-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.targetCountdownDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format with leading zeroes
    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);

  // GSAP scroll trigger for countdown without jumping/flashing
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.fromTo(
      ".countdown-unit-box",
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: "#countdown-timer",
          start: "top 88%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power2.out",
        immediateRender: false,
      }
    );
  }
}

/* ============================================================================
   9. SCENE 6: SPECIAL CINEMATIC MOMENT
   ============================================================================ */
function initCinematicMoment() {
  const orb = document.getElementById("moment-orb");
  const revealedCard = document.getElementById("moment-revealed-card");
  const preText = document.getElementById("moment-pre-text");

  if (!orb || !revealedCard) return;

  orb.addEventListener("click", () => {
    // Burst golden particles from the orb
    const rect = orb.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (canvasBurstTrigger) {
      canvasBurstTrigger(centerX, centerY, 90);
    }

    // Animate orb transition
    if (typeof gsap !== "undefined") {
      gsap.to(orb, {
        scale: 1.3,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          orb.style.display = "none";
          if (preText) preText.style.display = "none";
          revealedCard.classList.add("active");
          revealedCard.setAttribute("aria-hidden", "false");

          gsap.fromTo(
            revealedCard,
            { scale: 0.85, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
          );
        },
      });
    } else {
      orb.style.display = "none";
      if (preText) preText.style.display = "none";
      revealedCard.classList.add("active");
    }
  });

  // Accessible keyboard trigger
  orb.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      orb.click();
    }
  });
}

/* ============================================================================
   10. SCENE 7: RSVP SECTION (CONNECTED VIA WEB3FORMS)
   Submits guest confirmation to couple's email via Web3Forms API.
   ============================================================================ */
function initVisualRsvpForm() {
  const form = document.getElementById("rsvp-form");
  const successScreen = document.getElementById("rsvp-success-screen");
  const resetBtn = document.getElementById("btn-reset-demo");
  const submitBtn = document.getElementById("btn-submit-rsvp");
  const submitLabel = document.getElementById("btn-rsvp-label");
  const statusMsg = document.getElementById("rsvp-status-message");
  const optionPills = document.querySelectorAll(".attendance-pill-option");

  // Radio button selection visual pill state
  optionPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      optionPills.forEach((p) => p.classList.remove("selected"));
      pill.classList.add("selected");
      const radio = pill.querySelector("input[type='radio']");
      if (radio) radio.checked = true;
    });
  });

  if (!form || !successScreen) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("guest-name");
    const phoneInput = document.getElementById("guest-phone");

    // Simple visual validation
    if (nameInput && !nameInput.value.trim()) {
      nameInput.focus();
      return;
    }
    if (phoneInput && !phoneInput.value.trim()) {
      phoneInput.focus();
      return;
    }

    // Set button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = "جاري إرسال تأكيدك... ✨";
    }
    if (statusMsg) {
      statusMsg.style.display = "none";
      statusMsg.textContent = "";
    }

    try {
      const formData = new FormData(form);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        // Trigger golden particles fountain over the form
        const rect = form.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;

        if (canvasBurstTrigger) {
          canvasBurstTrigger(centerX, centerY, 80);
        }

        // Animate transition into confirmation card
        if (typeof gsap !== "undefined") {
          gsap.to(form, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
              form.style.display = "none";
              successScreen.classList.add("active");
              successScreen.setAttribute("aria-hidden", "false");

              gsap.fromTo(
                successScreen,
                { opacity: 0, scale: 0.92, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" }
              );
            },
          });
        } else {
          form.style.display = "none";
          successScreen.classList.add("active");
          successScreen.setAttribute("aria-hidden", "false");
        }
      } else {
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#D9534F";
          statusMsg.textContent = result.message || "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = "تأكيد الرد والتسجيل ✨";
        }
      }
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      // Fallback: If network issue, show polite notice
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#D9534F";
        statusMsg.textContent = "تعذر الاتصال بالشبكة، يرجى التحقق من اتصال الإنترنت والمحاولة ثانية.";
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = "تأكيد الرد والتسجيل ✨";
      }
    }
  });

  // Reset button to test or submit another response
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      successScreen.classList.remove("active");
      successScreen.setAttribute("aria-hidden", "true");
      form.style.display = "block";
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = "تأكيد الرد والتسجيل ✨";
      }

      // Reset selection
      optionPills.forEach((p) => p.classList.remove("selected"));
      const defaultOpt = document.getElementById("opt-attending");
      if (defaultOpt) defaultOpt.classList.add("selected");

      if (typeof gsap !== "undefined") {
        gsap.to(form, { opacity: 1, y: 0, duration: 0.5 });
      }
    });
  }
}

/* ============================================================================
   11. BACK TO TOP BUTTON
   ============================================================================ */
function initBackToTop() {
  const btn = document.getElementById("btn-back-to-top");
  if (btn) {
    btn.addEventListener("click", () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 0.75 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Universal snappy smooth scroll for all internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenisInstance) {
            lenisInstance.scrollTo(targetEl, { offset: -25, duration: 0.75 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    });
  });
}
