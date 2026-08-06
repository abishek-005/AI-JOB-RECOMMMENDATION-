"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import gsap from 'gsap';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ filename: string; extracted_text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  // GSAP Float + Glow hover on card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -6,
        scale: 1.01,
        boxShadow: 'var(--shadow-card-hover)',
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: 'var(--shadow-card)',
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // GSAP inner upload zone glow
  useEffect(() => {
    const zone = uploadZoneRef.current;
    if (!zone) return;

    const handleEnter = () => {
      gsap.to(zone, {
        boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(zone, {
        boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
        borderColor: 'var(--border-dashed)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    zone.addEventListener('mouseenter', handleEnter);
    zone.addEventListener('mouseleave', handleLeave);

    return () => {
      zone.removeEventListener('mouseenter', handleEnter);
      zone.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to upload resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Is the backend running?');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      ref={cardRef} 
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl transition-colors"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)', transition: 'background 0.4s ease, border-color 0.4s ease' }}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Upload Your Resume</h2>
        <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>We&apos;ll parse and structure your details, extracting core skills.</p>
      </div>

      {/* Upload Zone */}
      <div 
        ref={uploadZoneRef}
        className="relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden min-h-[200px]"
        style={{ borderColor: 'var(--border-dashed)', background: 'var(--bg-input)' }}
      >
        {/* Loading Scanner Animation */}
        {isUploading && (
          <>
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: 'var(--bg-card)', opacity: 0.85 }}>
              <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              <span className="text-xs font-bold text-blue-500 tracking-wider animate-pulse">Scanning Profile...</span>
            </div>
          </>
        )}

        <UploadCloud className="w-12 h-12 mb-4" style={{ color: 'var(--text-muted)' }} />
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md text-xs">
          Select PDF File
          <input
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </label>
        {file && !isUploading && (
          <div className="mt-4 flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <FileText className="w-4 h-4 text-blue-500" />
            <span>{file.name}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
            !file || isUploading
              ? 'cursor-not-allowed opacity-40'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
          }`}
          style={(!file || isUploading) ? { background: 'var(--border-card)', color: 'var(--text-muted)' } : {}}
        >
          {isUploading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <div className="flex items-center space-x-2 text-emerald-500 mb-3">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm">Analysis Complete</h3>
          </div>
          <div className="rounded-xl p-5 max-h-60 overflow-y-auto" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
            <p className="text-xs mb-2 uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>Extracted Text Preview</p>
            <p className="text-sm whitespace-pre-wrap font-mono leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {result.extracted_text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
