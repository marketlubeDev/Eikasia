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

    // Enhanced interactive particle system
    const particles = [];
    const particleCount = 300; // Much higher density for better visual impact

    class Particle {
      constructor() {
        this.reset();
        this.originalSize = this.size;
        this.isAttracted = false;
        this.hue = Math.random() * 60; // Blue to cyan range
        this.magneticForce = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.originalSize = this.size;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.originalOpacity = this.opacity;
      }

      update(mouseX, mouseY, isHovering, time) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = isHovering ? 250 : 150;

        // Pulsing effect
        this.pulsePhase += 0.02;
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 1;

        if (distance < interactionRadius && distance > 0) {
          const force = (interactionRadius - distance) / interactionRadius;

          if (isHovering) {
            // Complex magnetic behavior
            if (distance < 60) {
              // Strong repulsion for close particles
              this.vx -= (dx / distance) * force * 3;
              this.vy -= (dy / distance) * force * 3;
              this.magneticForce = -force;
            } else if (distance < 120) {
              // Orbital behavior for mid-range particles
              const angle = Math.atan2(dy, dx);
              this.vx += Math.cos(angle + Math.PI / 2) * force * 1.5;
              this.vy += Math.sin(angle + Math.PI / 2) * force * 1.5;
              this.magneticForce = force * 0.5;
            } else {
              // Gentle attraction for distant particles
              this.vx += (dx / distance) * force * 1.2;
              this.vy += (dy / distance) * force * 1.2;
              this.magneticForce = force;
            }

            // Enhanced visual effects when hovering
            this.size = this.originalSize * (1 + force * 2) * pulse;
            this.opacity = Math.min(1, this.originalOpacity * (1 + force * 3));
            this.hue = 60 + force * 140; // Shift from blue to purple/pink
          } else {
            // Gentle repulsion when not hovering
            this.vx -= (dx / distance) * force * 1.2;
            this.vy -= (dy / distance) * force * 1.2;
            this.magneticForce = -force * 0.3;

            // Moderate size increase
            this.size = this.originalSize * (1 + force * 0.8) * pulse;
            this.opacity = Math.min(
              1,
              this.originalOpacity * (1 + force * 1.5)
            );
            this.hue = force * 40; // Blue to cyan
          }
        } else {
          // Return to original values
          this.size += (this.originalSize * pulse - this.size) * 0.1;
          this.opacity += (this.originalOpacity - this.opacity) * 0.1;
          this.hue += (0 - this.hue) * 0.05;
          this.magneticForce *= 0.95;
        }

        // Apply velocity with magnetic damping
        this.x += this.vx;
        this.y += this.vy;

        // Dynamic damping based on magnetic state
        const damping = this.magneticForce > 0 ? 0.88 : 0.94;
        this.vx *= damping;
        this.vy *= damping;

        // Enhanced random movement
        this.vx += (Math.random() - 0.5) * 0.05;
        this.vy += (Math.random() - 0.5) * 0.05;

        // Smooth boundary wrapping
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;

        // Limit velocity
        const maxVel = isHovering ? 12 : 6;
        this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
        this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));
      }

      draw(ctx, particles, index) {
        // Draw connections to nearby particles
        for (let i = index + 1; i < particles.length; i++) {
          const other = particles[i];
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.3;
            ctx.strokeStyle = `hsla(${
              this.hue + other.hue
            }/2, 70%, 80%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw particle with color
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(
          0,
          `hsla(${this.hue}, 70%, 90%, ${this.opacity})`
        );
        gradient.addColorStop(
          1,
          `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.3})`
        );

        ctx.fillStyle = gradient;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
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

    // Enhanced animation loop with time
    const animate = (time = 0) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Slower fade for connection trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update(particleMouseX, particleMouseY, isHoveringTitle, time);
        particle.draw(ctx, particles, index);
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
