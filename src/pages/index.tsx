import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      constructor() {
        this.x = Math.random() * (canvas?.width ?? window.innerWidth);
        this.y = Math.random() * (canvas?.height ?? window.innerHeight);
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          this.speedX -= (dx / distance) * force * 0.1;
          this.speedY -= (dy / distance) * force * 0.1;
        }
        // Boundaries
        if (this.x < 0 || this.x > (canvas?.width ?? window.innerWidth)) this.speedX *= -1;
        if (this.y < 0 || this.y > (canvas?.height ?? window.innerHeight)) this.speedY *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update(mouseRef.current.x, mouseRef.current.y);
        particle.draw(ctx);
      });

      // Draw connections
      particles.forEach(particle1 => {
        particles.forEach(particle2 => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowLogin(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            recall
          </Link>
          <div className={styles.navLinks}>
            <Link href="/dashboard" className={styles.navLink}>
              dashboard
            </Link>
            <Link href="/review" className={styles.navLink}>
              review
            </Link>
            <button 
              onClick={() => setShowLogin(true)} 
              className={styles.accessButton}
            >
              access
            </button>
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className={styles.modalOverlay}>
          <div ref={modalRef} className={styles.modal}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>
            <div className={styles.modalContent}>
              <h2>Welcome back</h2>
              <form className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <input 
                    type="email" 
                    placeholder="Email"
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    type="password" 
                    placeholder="Password"
                    className={styles.input}
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Sign in
                </button>
              </form>
              <div className={styles.modalFooter}>
                <p>Don't have an account? <button className={styles.textButton}>Sign up</button></p>
                <button className={styles.textButton}>Forgot password?</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Effortless
            <br />
            memorization
          </h1>
          <div className={styles.subtitle}>
            Master anything through the power of spaced repetition.
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/privacy">Privacy</Link>
        <Link href="/about">About</Link>
      </footer>
    </div>
  );
}
