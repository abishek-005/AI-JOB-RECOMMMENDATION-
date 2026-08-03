"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Target, Sparkles, BookOpen, Cpu, Briefcase } from 'lucide-react';
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

      // Card hover lift effect
      const cards = document.querySelectorAll('.hover-card');
      cards.forEach((card) => {
        const onEnter = () => {
          gsap.to(card, { y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', duration: 0.3, ease: 'power2.out' });
        };
        const onLeave = () => {
          gsap.to(card, { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', duration: 0.3, ease: 'power2.out' });
        };
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-8 anim-in">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-16 anim-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About CareerAI
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Empowering candidates with semantic career recommendations and roadmaps.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          
          {/* Why */}
          <div className="anim-in hover-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between cursor-default">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Why Was It Made?</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Traditional job boards rely on keyword matching, ignoring context. We use deep learning to semantically understand your resume and match you to the right roles.
              </p>
            </div>
            <div className="mt-4 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Semantic Matching
            </div>
          </div>

          {/* Who */}
          <div className="anim-in hover-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between cursor-default">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Who is it Made For?</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Built for freshers and grad students who need transparent feedback on their profile and concrete steps to stand out in the job market.
              </p>
            </div>
            <div className="mt-4 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Student Focused
            </div>
          </div>

          {/* Novelty */}
          <div id="novelty" className="anim-in hover-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between cursor-default scroll-mt-20">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Our Novelty</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We analyze skill gaps and generate a personalized roadmap with real-world resources — live GitHub repos, YouTube tutorials, and documentation links.
              </p>
            </div>
            <div className="mt-4 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
              Career Roadmaps
            </div>
          </div>

        </div>

        {/* System Flow */}
        <div className="anim-in bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">System Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <BookOpen className="w-5 h-5 mx-auto text-blue-500 mb-2" />
              <h4 className="font-semibold text-xs text-slate-800">1. Parse PDF</h4>
              <p className="text-[10px] text-slate-400 mt-1">Clean text extraction</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Cpu className="w-5 h-5 mx-auto text-indigo-500 mb-2" />
              <h4 className="font-semibold text-xs text-slate-800">2. BERT Embed</h4>
              <p className="text-[10px] text-slate-400 mt-1">Semantic profile vector</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Briefcase className="w-5 h-5 mx-auto text-purple-500 mb-2" />
              <h4 className="font-semibold text-xs text-slate-800">3. MLP Classify</h4>
              <p className="text-[10px] text-slate-400 mt-1">Top 5 job prediction</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Sparkles className="w-5 h-5 mx-auto text-amber-500 mb-2" />
              <h4 className="font-semibold text-xs text-slate-800">4. RAG Roadmap</h4>
              <p className="text-[10px] text-slate-400 mt-1">GitHub & YouTube</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
