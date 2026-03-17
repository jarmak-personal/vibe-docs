/* ============================================================
   NEON GRID — vibe Suite Landing Page Interactive Effects
   Adapted from the shared vibeSpatial theme.
   ============================================================ */
(function () {
  "use strict";

  /* ===========================
     PARTICLE CONSTELLATION
     Multi-color particles — cycles through project colors
     =========================== */
  class ParticleField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -1000, y: -1000 };
      this.running = true;

      /* Project colors: cyan, magenta, purple */
      this.COLORS = [
        { r: 0, g: 229, b: 255 },    /* cyan — vibeProj */
        { r: 255, g: 45, b: 111 },    /* magenta — vibeSpatial */
        { r: 168, g: 85, b: 247 },    /* purple — vibeSpatial-Raster */
      ];

      this.PARTICLE_COUNT = 70;
      this.CONNECT_DIST = 120;
      this.MOUSE_DIST = 160;
      this.SPEED = 0.3;

      this._resize = this.resize.bind(this);
      this._mouseMove = this.onMouseMove.bind(this);
      this._mouseLeave = this.onMouseLeave.bind(this);

      window.addEventListener("resize", this._resize);
      this.canvas.parentElement.addEventListener("mousemove", this._mouseMove);
      this.canvas.parentElement.addEventListener("mouseleave", this._mouseLeave);

      this.resize();
      this.init();
      this.animate();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = rect.width;
      this.h = rect.height;
      this.canvas.width = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.canvas.style.width = this.w + "px";
      this.canvas.style.height = this.h + "px";
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    init() {
      this.particles = [];
      for (let i = 0; i < this.PARTICLE_COUNT; i++) {
        const color = this.COLORS[i % this.COLORS.length];
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * this.SPEED,
          vy: (Math.random() - 0.5) * this.SPEED,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.2,
          color: color,
        });
      }
    }

    onMouseMove(e) {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }

    onMouseLeave() {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    }

    animate() {
      if (!this.running) return;
      requestAnimationFrame(() => this.animate());

      const { ctx, w, h, particles, mouse } = this;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      /* Draw connections — blend colors of connected particles */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.CONNECT_DIST) {
            const alpha = (1 - dist / this.CONNECT_DIST) * 0.12;
            const c = particles[i].color;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        /* Mouse proximity glow */
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < this.MOUSE_DIST) {
          const alpha = (1 - mDist / this.MOUSE_DIST) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(226, 232, 240, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      /* Draw particles */
      for (const p of particles) {
        const c = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.alpha})`;
        ctx.fill();
      }
    }

    destroy() {
      this.running = false;
      window.removeEventListener("resize", this._resize);
      this.canvas.parentElement.removeEventListener("mousemove", this._mouseMove);
      this.canvas.parentElement.removeEventListener("mouseleave", this._mouseLeave);
    }
  }

  /* ===========================
     GLITCH EFFECT
     =========================== */
  class GlitchController {
    constructor(el) {
      this.el = el;
      this.running = true;
      this.schedule();
    }

    trigger() {
      this.el.classList.add("glitch-active");
      setTimeout(() => {
        this.el.classList.remove("glitch-active");
      }, 300);
    }

    schedule() {
      if (!this.running) return;
      const delay = 3000 + Math.random() * 5000;
      setTimeout(() => {
        if (!this.running) return;
        this.trigger();
        this.schedule();
      }, delay);
    }

    destroy() {
      this.running = false;
    }
  }

  /* ===========================
     SCROLL REVEAL
     =========================== */
  function initScrollReveal() {
    const els = document.querySelectorAll(".cp-reveal");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ===========================
     AMBIENT CURSOR GLOW
     =========================== */
  function initCursorGlow(heroEl) {
    if (!heroEl) return;

    const glow = document.createElement("div");
    glow.style.cssText = `
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,229,255,0.05) 0%, rgba(168,85,247,0.03) 40%, transparent 70%);
      pointer-events: none;
      z-index: 1;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    heroEl.appendChild(glow);

    heroEl.addEventListener("mousemove", (e) => {
      const rect = heroEl.getBoundingClientRect();
      glow.style.left = e.clientX - rect.left + "px";
      glow.style.top = e.clientY - rect.top + "px";
      glow.style.opacity = "1";
    });

    heroEl.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });
  }

  /* ===========================
     INITIALIZATION
     =========================== */
  function init() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".cp-reveal").forEach((el) => el.classList.add("visible"));
      return;
    }

    const hero = document.querySelector(".cp-hero");
    if (hero) {
      const canvas = document.createElement("canvas");
      canvas.className = "cp-particles";
      canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;";
      hero.insertBefore(canvas, hero.firstChild);
      new ParticleField(canvas);

      const title = hero.querySelector(".cp-hero-title[data-glitch]");
      if (title) new GlitchController(title);

      initCursorGlow(hero);
    }

    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
