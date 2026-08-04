"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ResumeUpload from '@/components/ResumeUpload';
import ThemeToggle from '@/components/ThemeToggle';
import gsap from 'gsap';

export default function AnalyzerPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.anim-in', {
        opacity: 0,
        y: 30,
        stagger: 0.12,
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

        {/* Header */}
        <div className="text-center mb-10 anim-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Resume Analysis Dashboard
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Upload your resume to extract text, find your best job roles, and build your roadmap.
          </p>
        </div>

        {/* Upload Container */}
        <div className="anim-in">
          <ResumeUpload />
        </div>

      </div>
    </main>
  );
}
