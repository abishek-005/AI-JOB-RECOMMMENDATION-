"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, UploadCloud, Cpu, Map } from 'lucide-react';
import gsap from 'gsap';

export default function GuidePage() {
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
            How to use CareerAI
          </h1>
          <p className="mt-2 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A quick 3-step guide to discovering your ideal career path.
          </p>
        </div>

        {/* Guide Steps */}
        <div className="space-y-6 max-w-2xl mx-auto mb-16">
          
          {/* Step 1 */}
          <div className="anim-in card-lift-glow hover-glow-blue p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Step 1: Upload Your Resume</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Navigate to the Analyzer dashboard and upload your current resume in PDF format. Make sure it contains your projects, skills, and experience so our AI has enough data to work with.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="anim-in card-lift-glow hover-glow-indigo p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Step 2: AI Analysis</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Click 'Analyze Resume'. Our Deep Learning engine will parse your text, generate semantic embeddings, and predict the Top 5 job roles that perfectly match your true skill profile.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="anim-in card-lift-glow hover-glow-purple p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <Map className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Step 3: Get Your Roadmap</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Review your predicted roles and select the one you want to pursue. We will generate a customized upskilling roadmap complete with GitHub repos and YouTube tutorials to fill your skill gaps.
              </p>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="anim-in text-center">
          <Link
            href="/analyzer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <span>Go to Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}
