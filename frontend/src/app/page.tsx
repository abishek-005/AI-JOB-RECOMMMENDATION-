"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import gsap from 'gsap';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance slide-up animations
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
            x: e.clientX - 96,
            y: e.clientY - 96,
            duration: 1.0,
            ease: 'power2.out',
          });
        };
        window.addEventListener('mousemove', moveGlow);
      }

      // 3. Magnetic button effect
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

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)] overflow-hidden relative">
      
      {/* Mouse-following glow */}
      <div 
        id="mouse-glow" 
        className="pointer-events-none fixed top-0 left-0 w-48 h-48 rounded-full blur-[80px] opacity-0"
        style={{ background: 'rgba(99, 102, 241, 0.08)' }}
      />

      {/* Apple-style frosted glass navbar */}
      <header className="w-full sticky top-0 z-50 anim-in" style={{ background: 'rgba(245, 245, 247, 0.72)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 h-11 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded flex items-center justify-center font-bold text-white text-[9px]" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              C
            </div>
            <span className="font-semibold text-xs text-slate-800 tracking-tight">CareerAI</span>
          </div>
          <nav className="hidden sm:flex items-center space-x-6 text-[11px] font-normal text-slate-500">
            <Link href="/about" className="hover:text-slate-900 transition-colors">Why CareerAI</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">Novelty</Link>
            <Link href="/analyzer" className="hover:text-slate-900 transition-colors">Analyzer</Link>
          </nav>
          <Link
            href="/analyzer"
            className="text-[10px] px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-3xl text-center my-auto flex flex-col items-center justify-center px-6 py-20">
        <h1 className="anim-in text-4xl sm:text-6xl font-semibold text-slate-900 tracking-tight mb-4 leading-tight">
          Discover Your Ideal<br/>
          <span className="animate-chameleon bg-clip-text text-transparent font-bold">
            Career Path
          </span>
        </h1>
        <p className="anim-in text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
          Upload your resume to extract skills, predict job roles using deep learning, and receive a resource-rich upskilling roadmap.
        </p>

        {/* Compact Apple-style buttons */}
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
      <footer className="w-full text-center text-[10px] text-slate-400 py-6 anim-in" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        Candidate-Centric AI Job Recommendation & Upskilling Platform
      </footer>
    </main>
  );
}
