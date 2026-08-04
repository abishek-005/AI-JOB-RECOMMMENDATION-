"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { DotPattern } from '@/components/DotPattern';
import ThemeToggle from '@/components/ThemeToggle';
import gsap from 'gsap';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance slide-up
      gsap.from('.anim-in', {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 1.0,
        ease: 'power3.out',
      });

      // 2. Mouse-following ambient glow
      const glow = document.getElementById('mouse-glow');
      if (glow) {
        const showGlow = () => {
          gsap.to(glow, { opacity: 1, duration: 0.5 });
          window.removeEventListener('mousemove', showGlow);
        };
        window.addEventListener('mousemove', showGlow);

        const moveGlow = (e: MouseEvent) => {
          gsap.to(glow, {
            x: e.clientX - 150,
            y: e.clientY - 150,
            duration: 1.2,
            ease: 'power2.out',
          });
        };
        window.addEventListener('mousemove', moveGlow);
      }

      // 3. Magnetic buttons
      const magneticBtns = document.querySelectorAll('.magnetic-btn');
      magneticBtns.forEach((btn) => {
        const onMove = (e: Event) => {
          const me = e as MouseEvent;
          const rect = (btn as HTMLElement).getBoundingClientRect();
          const x = me.clientX - rect.left - rect.width / 2;
          const y = me.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
        };
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        };
        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
      });

      // 4. Floating orbs
      gsap.to('.float-orb-1', { y: -20, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.float-orb-2', { y: 15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to('.float-orb-3', { y: -12, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)] overflow-hidden relative" style={{ background: 'var(--bg-page)', transition: 'background 0.4s ease' }}>
      
      {/* Dot Pattern Background — slightly bigger dots */}
      <DotPattern
        width={28}
        height={28}
        cx={2}
        cy={2}
        cr={1.8}
        style={{ fill: 'var(--dot-fill)' }}
      />

      {/* Mouse-following glow */}
      <div 
        id="mouse-glow" 
        className="pointer-events-none fixed top-0 left-0 w-72 h-72 rounded-full opacity-0"
        style={{ background: `radial-gradient(circle, var(--glow-color) 0%, transparent 70%)`, filter: 'blur(30px)' }}
      />

      {/* Floating orbs */}
      <div className="float-orb-1 absolute top-20 right-20 w-32 h-32 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #93c5fd, transparent)' }} />
      <div className="float-orb-2 absolute bottom-32 left-16 w-24 h-24 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
      <div className="float-orb-3 absolute top-40 left-32 w-16 h-16 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #6ee7b7, transparent)' }} />

      {/* ── Frosted Glass Navbar ── */}
      <header className="w-full sticky top-0 z-50 anim-in" style={{ background: 'var(--bg-nav)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: `1px solid var(--border-nav)`, transition: 'background 0.4s ease' }}>
        <div className="max-w-5xl mx-auto px-6 h-11 flex items-center justify-between">
          {/* Text-only brand — no SVG "C" icon */}
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>CareerAI</span>
          
          <nav className="hidden sm:flex items-center space-x-6 text-[11px] font-normal" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/about" className="hover:opacity-80 transition-opacity">Why CareerAI</Link>
            <Link href="/about" className="hover:opacity-80 transition-opacity">Novelty</Link>
            <Link href="/analyzer" className="hover:opacity-80 transition-opacity">Analyzer</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/analyzer"
              className="text-[10px] px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <div className="max-w-3xl text-center my-auto flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <h1 className="anim-in text-4xl sm:text-6xl font-semibold tracking-tight mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
          Discover Your Ideal<br/>
          <span className="animate-chameleon bg-clip-text text-transparent font-bold">
            Career Path
          </span>
        </h1>
        <p className="anim-in text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          Upload your resume to extract skills, predict job roles using deep learning, and receive a resource-rich upskilling roadmap.
        </p>

        <div className="anim-in flex flex-row items-center justify-center gap-3">
          <Link
            href="/analyzer"
            className="magnetic-btn px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 group active:scale-95"
          >
            <span>Analyze Resume</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="magnetic-btn px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Learn more</span>
            <HelpCircle className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] py-6 anim-in relative z-10" style={{ color: 'var(--text-muted)', borderTop: `1px solid var(--footer-border)` }}>
        Candidate-Centric AI Job Recommendation & Upskilling Platform
      </footer>
    </main>
  );
}
