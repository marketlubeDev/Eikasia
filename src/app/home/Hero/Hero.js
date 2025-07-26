"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const logoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseMoveTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const logo = logoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Simplified particle system
    const particles = [];
    const particleCount = 80; // Significantly increased

    class Particle {
      constructor() {
        this.reset();
        this.originalSize = this.size;
        this.isAttracted = false;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.originalSize = this.size;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.originalOpacity = this.opacity;
      }

      update(mouseX, mouseY, isHovering) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = isHovering ? 200 : 120; // Larger range when hovering

        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance;

          if (isHovering) {
            // When hovering, some particles attract, some repel
            if (distance < 50) {
              // Close particles repel strongly
              this.vx -= (dx / distance) * force * 2;
              this.vy -= (dy / distance) * force * 2;
              this.isAttracted = false;
            } else {
              // Distant particles attract
              this.vx += (dx / distance) * force * 0.8;
              this.vy += (dy / distance) * force * 0.8;
              this.isAttracted = true;
            }

            // Increase size and opacity when hovering
            this.size = this.originalSize * (1 + force * 1.5);
            this.opacity = Math.min(1, this.originalOpacity * (1 + force * 2));
          } else {
            // Normal repulsion when not hovering
            this.vx -= (dx / distance) * force * 0.8;
            this.vy -= (dy / distance) * force * 0.8;
            this.isAttracted = false;

            // Slight size increase
            this.size = this.originalSize * (1 + force * 0.5);
            this.opacity = Math.min(1, this.originalOpacity * (1 + force));
          }
        } else {
          // Return to original size and opacity when away from mouse
          this.size += (this.originalSize - this.size) * 0.1;
          this.opacity += (this.originalOpacity - this.opacity) * 0.1;
          this.isAttracted = false;
        }

        // Apply velocity with different damping based on state
        this.x += this.vx;
        this.y += this.vy;

        if (this.isAttracted) {
          this.vx *= 0.85; // Less damping when attracted
          this.vy *= 0.85;
        } else {
          this.vx *= 0.95; // Normal damping
          this.vy *= 0.95;
        }

        // Add subtle random movement
        this.vx += (Math.random() - 0.5) * 0.03;
        this.vy += (Math.random() - 0.5) * 0.03;

        // Boundary wrapping
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Limit velocity
        const maxVel = isHovering ? 8 : 4;
        this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
        this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));
      }

      draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; // Reset alpha
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Track mouse position and hover state
    let particleMouseX = window.innerWidth / 2;
    let particleMouseY = window.innerHeight / 2;
    let isHoveringTitle = false;

    // Simple animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Slightly faster fade for more dynamic trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 255, 255, 1)"; // Full opacity for particles
      particles.forEach((particle) => {
        particle.update(particleMouseX, particleMouseY, isHoveringTitle);
        particle.draw(ctx);
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Split text into letters for animation
    const titleLetters = Array.from(title.children);
    const subtitleLetters = Array.from(subtitle.children);

    // Initial animation for "eikasia"
    gsap.from(titleLetters, {
      y: 100,
      opacity: 0,
      rotateX: -90,
      stagger: 0.05,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
    });

    // Initial animation for "advertising"
    gsap.from(subtitleLetters, {
      y: 30,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.8,
    });

    // Add simple glow to the main title
    gsap.to(title, {
      duration: 1.5,
      textShadow:
        "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
      ease: "power2.out",
      delay: 1,
    });

    // Logo entrance animation
    gsap.fromTo(
      logo,
      {
        opacity: 0,
        scale: 0.3,
        rotation: -180,
        y: -50,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.1,
      }
    );

    // Logo shooting star animation
    gsap.set(logo, {
      x: -200,
      y: -100,
      opacity: 0,
      scale: 0.5,
      rotation: -45,
    });

    // Create shooting star trail effect
    gsap.to(logo, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 2,
      ease: "power3.out",
      delay: 0.5,
    });

    // Add glow effect during shooting star
    gsap.to(logo, {
      filter:
        "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4))",
      duration: 0.8,
      ease: "power2.out",
      delay: 0.5,
    });

    // Fade out the glow after landing
    gsap.to(logo, {
      filter: "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
      duration: 1,
      ease: "power2.out",
      delay: 2.5,
    });

    // Simple natural logo animation
    gsap.fromTo(
      logo,
      {
        opacity: 0,
        scale: 0,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    // Logo hover animations
    const handleLogoMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleLogoMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Enhanced hover effects with particle interaction
    const handleMouseEnter = () => {
      isHoveringTitle = true;
      gsap.to(title, {
        duration: 0.4,
        scale: 1.08,
        textShadow:
          "0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.5), 0 0 80px rgba(255, 255, 255, 0.3)",
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isHoveringTitle = false;
      gsap.to(title, {
        duration: 0.4,
        scale: 1,
        textShadow:
          "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
        ease: "power2.out",
      });
    };

    // Throttled parallax
    const handleMouseMove = (e) => {
      particleMouseX = e.clientX;
      particleMouseY = e.clientY;

      if (mouseMoveTimeoutRef.current) return;

      mouseMoveTimeoutRef.current = setTimeout(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 8;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;

        gsap.set(title, { x: x, y: y });
        mouseMoveTimeoutRef.current = null;
      }, 16);
    };

    // Scroll effect
    const scrollTrigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(title, {
          y: progress * -20,
          opacity: 1 - progress * 0.3,
        });
      },
    });

    // Event listeners
    title.addEventListener("mouseenter", handleMouseEnter);
    title.addEventListener("mouseleave", handleMouseLeave);
    logo.addEventListener("mouseenter", handleLogoMouseEnter);
    logo.addEventListener("mouseleave", handleLogoMouseLeave);
    hero.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }

      title.removeEventListener("mouseenter", handleMouseEnter);
      title.removeEventListener("mouseleave", handleMouseLeave);
      logo.removeEventListener("mouseenter", handleLogoMouseEnter);
      logo.removeEventListener("mouseleave", handleLogoMouseLeave);
      hero.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", setCanvasSize);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute top-8 left-8 z-20 invert">
        <Image
          ref={logoRef}
          src="/logo.svg"
          alt="Eikasia Logo"
          width={100}
          height={40}
          className="cursor-pointer"
        />
      </div>
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
            fontSize: "clamp(5rem, 12vw, 15rem)",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-albra), sans-serif",
            fontStyle: "italic",
            fontWeight: "100",
            textTransform: "lowercase",
            lineHeight: ".5",
            perspective: "400px",
          }}
        >
          {"eikasia".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ transformOrigin: "bottom center" }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="text-center text-gray-400 text-lg tracking-wider"
          style={{
            fontFamily: "var(--font-next), sans-serif",
            textTransform: "lowercase",
            fontSize: "clamp(5rem, 12vw, 7rem)",
          }}
        >
          {"advertising".split("").map((char, i) => (
            <span key={i} className="inline-block">
              {char}
            </span>
          ))}
        </p>

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
