"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Target, Sparkles, BookOpen, Cpu, Briefcase } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import gsap from 'gsap';

export default function AboutPage() {
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

      // Tilt on hover for cards
      const cards = document.querySelectorAll('.hover-card');
      cards.forEach((card) => {
        const onMove = (e: Event) => {
          const me = e as MouseEvent;
          const el = card as HTMLElement;
          const rect = el.getBoundingClientRect();
          const x = me.clientX - rect.left - rect.width / 2;
          const y = me.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            rotateY: x / 15,
            rotateX: -y / 15,
            transformPerspective: 600,
            boxShadow: 'var(--shadow-card-hover)',
            duration: 0.3,
            ease: 'power2.out',
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            boxShadow: 'var(--shadow-card)',
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen p-6 sm:p-12 font-[family-name:var(--font-geist-sans)]" style={{ background: 'var(--bg-page)', transition: 'background 0.4s ease' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-8 anim-in flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-medium transition-colors px-4 py-2 rounded-xl shadow-sm"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Title */}
        <div className="text-center mb-16 anim-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            About CareerAI
          </h1>
          <p className="mt-2 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Empowering candidates with semantic career recommendations and roadmaps.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          
          {/* Why */}
          <div className="anim-in hover-card p-6 rounded-2xl shadow-sm flex flex-col justify-between cursor-default" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', transformStyle: 'preserve-3d' }}>
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Why Was It Made?</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Traditional job boards rely on keyword matching, ignoring context. We use deep learning to semantically understand your resume and match you to the right roles.
              </p>
            </div>
            <div className="mt-4 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              Semantic Matching
            </div>
          </div>

          {/* Who */}
          <div className="anim-in hover-card p-6 rounded-2xl shadow-sm flex flex-col justify-between cursor-default" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', transformStyle: 'preserve-3d' }}>
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Who is it Made For?</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Built for freshers and grad students who need transparent feedback on their profile and concrete steps to stand out in the job market.
              </p>
            </div>
            <div className="mt-4 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
              Student Focused
            </div>
          </div>

          {/* Novelty */}
          <div id="novelty" className="anim-in hover-card p-6 rounded-2xl shadow-sm flex flex-col justify-between cursor-default scroll-mt-20" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', transformStyle: 'preserve-3d' }}>
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Our Novelty</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                We analyze skill gaps and generate a personalized roadmap with real-world resources — live GitHub repos, YouTube tutorials, and documentation links.
              </p>
            </div>
            <div className="mt-4 text-[10px] font-bold text-purple-500 uppercase tracking-wider">
              Career Roadmaps
            </div>
          </div>

        </div>

        {/* System Flow */}
        <div className="anim-in rounded-2xl p-8 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>System Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <BookOpen className="w-5 h-5 mx-auto text-blue-500 mb-2" />
              <h4 className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>1. Parse PDF</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Clean text extraction</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <Cpu className="w-5 h-5 mx-auto text-indigo-500 mb-2" />
              <h4 className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>2. BERT Embed</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Semantic profile vector</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <Briefcase className="w-5 h-5 mx-auto text-purple-500 mb-2" />
              <h4 className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>3. MLP Classify</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Top 5 job prediction</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
              <Sparkles className="w-5 h-5 mx-auto text-amber-500 mb-2" />
              <h4 className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>4. RAG Roadmap</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>GitHub & YouTube</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
