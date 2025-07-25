"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hero = heroRef.current;
    const title = titleRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Simple particle system (reduced count for performance)
    const particles = [];
    const particleCount = 50; // Increased for better effect

    class Particle {
      constructor() {
        this.reset();
        this.baseX = this.x;
        this.baseY = this.y;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update(mouseX, mouseY) {
        // Mouse interaction - stronger effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200; // Increased range

        if (distance < maxDistance && distance > 0) {
          // Repel particles from mouse (push away effect)
          const force = (maxDistance - distance) / maxDistance;
          const repelStrength = 2.5; // Much stronger force
          this.vx -= (dx / distance) * force * repelStrength;
          this.vy -= (dy / distance) * force * repelStrength;
        }

        // Apply velocity with damping
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92; // Stronger damping
        this.vy *= 0.92;

        // Add small random movement
        this.vx += (Math.random() - 0.5) * 0.05;
        this.vy += (Math.random() - 0.5) * 0.05;

        // Boundary check with wrapping
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Limit maximum velocity
        const maxVel = 5;
        this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
        this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Track mouse position for particles
    let particleMouseX = window.innerWidth / 2;
    let particleMouseY = window.innerHeight / 2;

    // Simple animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; // Slower fade for trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; // Brighter particles
      particles.forEach((particle) => {
        particle.update(particleMouseX, particleMouseY);
        particle.draw(ctx);
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Split text into letters for animation
    const text = title.textContent;
    title.innerHTML = "";

    const letters = text.split("").map((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.transition = "none";
      span.dataset.original = char;
      span.dataset.index = index;
      title.appendChild(span);
      return span;
    });

    // Alternative characters for each letter
    const alternates = {
      E: ["Ξ", "Σ", "€", "Ɛ", "∃", "Є"],
      I: ["Ι", "|", "1", "Ɨ", "ł", "!"],
      K: ["Κ", "Ҡ", "Ќ", "Ҝ", "Ԟ"],
      A: ["Λ", "Δ", "∆", "А", "Ⱥ", "∀"],
      S: ["Ѕ", "$", "§", "Ṡ", "Ş", "Ƨ"],
    };

    // Initial appearance
    gsap.set(letters, {
      opacity: 0,
      scale: 0,
      rotationY: 180,
    });

    gsap.to(letters, {
      duration: 0.8,
      opacity: 1,
      scale: 1,
      rotationY: 0,
      ease: "back.out(1.7)",
      stagger: 0.05,
      delay: 0.2,
    });

    // Add glow to title
    gsap.to(title, {
      duration: 1,
      textShadow:
        "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
      ease: "power2.out",
      delay: 0.5,
    });

    // Ongoing letter flipping animation
    const flipLetter = (letter) => {
      const original = letter.dataset.original;
      const alts = alternates[original] || [original];
      const currentText = letter.textContent;

      // Pick a random alternate (or original)
      const options = [original, ...alts];
      let newChar = options[Math.floor(Math.random() * options.length)];

      // Make sure we pick a different character
      while (newChar === currentText && options.length > 1) {
        newChar = options[Math.floor(Math.random() * options.length)];
      }

      // Flip animation
      gsap.to(letter, {
        duration: 0.3,
        scaleX: 0,
        ease: "power2.in",
        onComplete: () => {
          letter.textContent = newChar;
          gsap.to(letter, {
            duration: 0.3,
            scaleX: 1,
            ease: "power2.out",
          });
        },
      });
    };

    // Start continuous random flipping
    letters.forEach((letter, index) => {
      // Random initial delay
      const startDelay = 2 + Math.random() * 3;

      // Create repeating timeline for each letter
      const tl = gsap.timeline({
        delay: startDelay,
        repeat: -1,
        repeatDelay: 3 + Math.random() * 4,
      });

      tl.add(() => flipLetter(letter));
    });

    // Additional subtle floating animation
    letters.forEach((letter, index) => {
      gsap.to(letter, {
        y: -3,
        duration: 2 + Math.random(),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.1,
      });
    });

    // Simple hover effect
    const handleMouseEnter = () => {
      gsap.to(letters, {
        duration: 0.3,
        scale: 1.1,
        stagger: 0.02,
        ease: "power2.out",
      });
      gsap.to(title, {
        duration: 0.3,
        textShadow:
          "0 0 30px rgba(255, 255, 255, 0.7), 0 0 50px rgba(255, 255, 255, 0.4)",
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(letters, {
        duration: 0.3,
        scale: 1,
        stagger: 0.02,
        ease: "power2.out",
      });
      gsap.to(title, {
        duration: 0.3,
        textShadow:
          "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
        ease: "power2.out",
      });
    };

    // Simple parallax on mouse move
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      // Update particle mouse position
      particleMouseX = e.clientX;
      particleMouseY = e.clientY;

      gsap.to(title, {
        duration: 0.5,
        x: x,
        y: y,
        ease: "power2.out",
      });
    };

    // Simple scroll effect
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(title, {
          y: progress * -50,
          opacity: 1 - progress * 0.5,
        });
      },
    });

    // Event listeners
    title.addEventListener("mouseenter", handleMouseEnter);
    title.addEventListener("mouseleave", handleMouseLeave);
    hero.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      title.removeEventListener("mouseenter", handleMouseEnter);
      title.removeEventListener("mouseleave", handleMouseLeave);
      hero.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-30"
      />

      {/* Main content */}
      <div className="relative z-10">
        <h1
          ref={titleRef}
          className="font-bold text-white text-center cursor-pointer select-none"
          style={{
            fontSize: "clamp(5rem, 12vw, 10rem)",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-albra), sans-serif",
            fontStyle: "italic",
            fontWeight: "100",
          }}
        >
          eikasia
        </h1>

        {/* Simple subtitle */}
        <p className="text-center text-gray-400 mt-6 text-lg tracking-wider opacity-70">
          Imagination Made Reality
        </p>
      </div>

      {/* Subtle gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-50"></div>
      </div>
    </div>
  );
}
