"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen, Cpu, Briefcase } from 'lucide-react';
import gsap from 'gsap';

export default function NoveltyPage() {
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
            Our Novelty
          </h1>
          <p className="mt-2 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            What makes CareerAI different from standard resume parsers?
          </p>
        </div>

        {/* Novelty Card */}
        <div className="anim-in card-lift-glow hover-glow-purple p-8 rounded-3xl shadow-sm max-w-2xl mx-auto mb-16" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>The Career Roadmap Engine</h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            Most tools tell you what you are missing and leave you stranded. CareerAI doesn't just parse your resume — we analyze your skill gaps against your predicted ideal job roles, and generate a personalized, actionable learning roadmap. 
            We use RAG (Retrieval-Augmented Generation) to pull real-world resources like live GitHub repositories, high-quality YouTube tutorials, and official documentation links to help you upskill immediately.
          </p>
          <div className="text-xs font-bold text-purple-500 uppercase tracking-wider">
            Personalized Upskilling
          </div>
        </div>

        {/* System Flow */}
        <div className="anim-in rounded-3xl p-8 shadow-sm max-w-3xl mx-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
          <h2 className="text-xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>Our AI Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <BookOpen className="w-6 h-6 mx-auto text-blue-500 mb-3" />
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>1. Parse PDF</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Clean text extraction</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <Cpu className="w-6 h-6 mx-auto text-indigo-500 mb-3" />
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>2. BERT Embed</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Semantic profile vector</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <Briefcase className="w-6 h-6 mx-auto text-purple-500 mb-3" />
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>3. MLP Classify</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Top job prediction</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <Sparkles className="w-6 h-6 mx-auto text-amber-500 mb-3" />
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>4. RAG Roadmap</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>GitHub & YouTube</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
