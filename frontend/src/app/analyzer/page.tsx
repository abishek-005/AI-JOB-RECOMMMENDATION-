"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ResumeUpload from '@/components/ResumeUpload';
import gsap from 'gsap';

export default function AnalyzerPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide-up entrance for all elements
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

        {/* Header */}
        <div className="text-center mb-10 anim-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Resume Analysis Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
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
