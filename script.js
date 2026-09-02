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
  groomName: "أحمد",
  brideName: "سارة",
  dateArabic: "الجمعة، 25 ديسمبر 2026",
  hijriDateArabic: "16 رجب 1448 هـ",
  timeArabic: "8:00 مساءً",
  venueName: "قاعة الأحلام",
  venueSubName: "القاعة الكبرى الملكية",
  venueAddress: "طريق الملك عبدالعزيز — بوابة الضيوف الرئيسية",
  googleMapsUrl: "https://maps.google.com/?q=Palace+of+Dreams",
  // Target countdown timestamp: Dec 25, 2026 20:00:00 GMT+0300
  targetCountdownDate: new Date("2026-12-25T20:00:00+03:00").getTime(),
};

document.addEventListener("DOMContentLoaded", () => {
  initLenisAndGSAP();
  initAmbientCanvas();
  initOpeningIntro();
  initHeroParallax();
  initAstrolabeAnimations();
  initCountdownTimer();
  initEditorialGallery();
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
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
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
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Particle sets
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 85;

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
      ctx.save();
      if (this.type === "petal") {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color + this.opacity + ")";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const op = this.currentOpacity || this.opacity;
        ctx.fillStyle = this.color + op + ")";
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
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

  function animate() {
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

      ctx.save();
      ctx.fillStyle = `rgba(244, 227, 178, ${bp.opacity})`;
      ctx.shadowBlur = bp.size * 4;
      ctx.shadowColor = "rgba(212, 175, 55, 1)";
      ctx.beginPath();
      ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================================
   4. SCENE 0: CINEMATIC OPENING & CURTAIN REVEAL
   ============================================================================ */
function initOpeningIntro() {
  const introEl = document.getElementById("cinematic-intro");
  const enterBtn = document.getElementById("btn-enter-experience");

  if (!introEl || !enterBtn) return;

  enterBtn.addEventListener("click", () => {
    // Open curtains with high-end audio-visual drama
    introEl.classList.add("opened");

    if (canvasBurstTrigger) {
      canvasBurstTrigger(window.innerWidth / 2, window.innerHeight / 2, 70);
    }

    setTimeout(() => {
      introEl.classList.add("revealed");
      document.body.classList.remove("loading-locked");

      // Trigger GSAP entrance for Hero Section
      triggerHeroEntrance();
    }, 1200);
  });
}

function triggerHeroEntrance() {
  if (typeof gsap === "undefined") return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    ".hero-bg-layer",
    { scale: 1.12, filter: "brightness(0.3) saturate(1.4)" },
    { scale: 1, filter: "brightness(0.68) saturate(1.15)", duration: 2.2 }
  )
    .fromTo(
      ".royal-crest",
      { opacity: 0, y: -20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1 },
      "-=1.6"
    )
    .fromTo(
      ".hero-header-tag",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=1.2"
    )
    .fromTo(
      ".hero-name",
      { opacity: 0, y: 30, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.25, duration: 1.4 },
      "-=0.9"
    )
    .fromTo(
      ".hero-divider-knot",
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 1 },
      "-=1.1"
    )
    .fromTo(
      ".hero-subtext",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.7"
    )
    .fromTo(
      ".hero-cta-wrapper",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9 },
      "-=0.6"
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

  // Parallax on mousemove (desktop only)
  heroSection.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 992) return;

    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (clientX - centerX) / centerX;
    const deltaY = (clientY - centerY) / centerY;

    heroBg.style.transform = `scale(1.04) translate(${deltaX * -15}px, ${deltaY * -12}px)`;
    heroContent.style.transform = `translate(${deltaX * 10}px, ${deltaY * 8}px)`;
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
          lenisInstance.scrollTo(target, { offset: -30, duration: 1.6 });
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

  // Reveal timeline for celestial cards on scroll
  gsap.from(".celestial-card", {
    scrollTrigger: {
      trigger: "#astrolabe-composition",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 40,
    stagger: 0.2,
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.from(".center-medallion", {
    scrollTrigger: {
      trigger: "#astrolabe-composition",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    scale: 0.7,
    rotation: -25,
    duration: 1.4,
    ease: "back.out(1.5)",
  });
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

  // GSAP scroll trigger for countdown
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.from(".countdown-unit-box", {
      scrollTrigger: {
        trigger: "#countdown-timer",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out",
    });
  }
}

/* ============================================================================
   8. SCENE 5: EDITORIAL GALLERY & 3D TILT & LIGHTBOX
   ============================================================================ */
function initEditorialGallery() {
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  // 3D Tilt on hover for gallery items
  items.forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = (centerY - y) / 12;
      const tiltY = (x - centerX) / 12;

      const inner = item.querySelector(".item-inner");
      if (inner) {
        inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      }
    });

    item.addEventListener("mouseleave", () => {
      const inner = item.querySelector(".item-inner");
      if (inner) {
        inner.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
      }
    });

    // Lightbox click
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.getAttribute("data-caption") || "";

      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "صورة من معرض الزفاف";
        if (lightboxCaption) lightboxCaption.textContent = caption;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close Lightbox
  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Scroll reveals for gallery items
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.from(".gallery-item", {
      scrollTrigger: {
        trigger: "#gallery-grid",
        start: "top 75%",
      },
      opacity: 0,
      y: 40,
      stagger: 0.18,
      duration: 1.1,
      ease: "power2.out",
    });
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
   10. SCENE 7: RSVP SECTION (PURE VISUAL DEMONSTRATION)
   Zero backend, zero database, zero LocalStorage, zero data collection.
   Pure front-end visual celebration.
   ============================================================================ */
function initVisualRsvpForm() {
  const form = document.getElementById("rsvp-form");
  const successScreen = document.getElementById("rsvp-success-screen");
  const resetBtn = document.getElementById("btn-reset-demo");
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

  form.addEventListener("submit", (e) => {
    // PREVENT ALL DEFAULT FORM BEHAVIOR OR REAL NETWORK SUBMISSIONS
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
    }
  });

  // Reset button to test the visual demo again
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      successScreen.classList.remove("active");
      successScreen.setAttribute("aria-hidden", "true");
      form.style.display = "block";
      form.reset();

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
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}
