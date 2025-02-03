import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useRouter } from 'next/router';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const router = useRouter();

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle authentication
    // For now, we'll just redirect
    router.push('/dashboard');
  };

  const handleSocialSignIn = (provider: string) => {
    // Here you would handle social auth
    // For now, we'll just redirect
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            recall
          </Link>
          <button 
            onClick={() => setShowLogin(true)} 
            className={styles.accessButton}
          >
            access
          </button>
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
              <form className={styles.loginForm} onSubmit={handleSignIn}>
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

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <div className={styles.socialLogins}>
                <button 
                  className={styles.socialButton}
                  onClick={() => handleSocialSignIn('google')}
                >
                  <svg className={styles.socialIcon} viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button 
                  className={styles.socialButton}
                  onClick={() => handleSocialSignIn('microsoft')}
                >
                  <svg className={styles.socialIcon} viewBox="0 0 24 24">
                    <path d="M21.436 0H2.564C1.147 0 0 1.147 0 2.564v18.872C0 22.853 1.147 24 2.564 24h18.872C22.853 24 24 22.853 24 21.436V2.564C24 1.147 22.853 0 21.436 0zM16 6h-2c-.69 0-1 .81-1 1.5V9h3v3h-3v8h-3v-8H7V9h3V7.5c0-2.485 1.235-4.5 4-4.5h2v3z" fill="#0078D4"/>
                  </svg>
                  Continue with Microsoft
                </button>

                <button 
                  className={styles.socialButton}
                  onClick={() => handleSocialSignIn('apple')}
                >
                  <svg className={styles.socialIcon} viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#000000"/>
                  </svg>
                  Continue with Apple
                </button>
              </div>

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
