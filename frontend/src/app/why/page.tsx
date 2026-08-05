"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Target } from 'lucide-react';
import gsap from 'gsap';

export default function WhyPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.anim-in', {
        opacity: 0,
        y: 25,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen p-6 sm:p-12 font-[family-name:var(--font-geist-sans)]" style={{ background: 'var(--bg-page)', transition: 'background 0.4s ease' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-8 anim-in">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-medium transition-colors px-4 py-2 rounded-xl shadow-sm"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-16 anim-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Why CareerAI?
          </h1>
          <p className="mt-2 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            The problem with traditional job boards, and who we built this for.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">
          
          {/* Why */}
          <div className="anim-in card-lift-glow hover-glow-blue p-8 rounded-3xl shadow-sm flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Why Was It Made?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Traditional job boards rely on strict keyword matching, completely ignoring context. If your resume says "built neural networks" but the job asks for "deep learning", you might get filtered out. We use advanced NLP to semantically understand your resume and match you to the right roles based on actual skills and meaning.
              </p>
            </div>
            <div className="mt-6 text-xs font-bold text-blue-500 uppercase tracking-wider">
              Semantic Matching
            </div>
          </div>

          {/* Who */}
          <div className="anim-in card-lift-glow hover-glow-indigo p-8 rounded-3xl shadow-sm flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Who is it Made For?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Built specifically for freshers, graduates, and junior developers who need transparent feedback on their profile. Instead of just getting rejected, we give you concrete steps, resources, and clarity to stand out in a highly competitive job market.
              </p>
            </div>
            <div className="mt-6 text-xs font-bold text-indigo-500 uppercase tracking-wider">
              Student Focused
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
