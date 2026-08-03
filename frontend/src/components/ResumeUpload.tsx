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

  // GSAP Smooth Floating Card Hover Animation (replacing 3D tilt)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -6,
        scale: 1.01,
        boxShadow: '0 20px 35px -10px rgba(59, 130, 246, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.04)',
        borderColor: 'rgba(147, 197, 253, 0.8)',
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        borderColor: 'rgba(226, 232, 240, 1)',
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

  // GSAP hover glow on inner upload zone
  useEffect(() => {
    const zone = uploadZoneRef.current;
    if (!zone) return;

    const handleEnter = () => {
      gsap.to(zone, {
        boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        backgroundColor: 'rgba(240, 246, 255, 0.9)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(zone, {
        boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
        borderColor: 'rgba(203, 213, 225, 1)',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
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
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
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
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-slate-200 transition-colors"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Upload Your Resume</h2>
        <p className="text-slate-500 mt-1.5 text-xs font-medium">We&apos;ll parse and structure your details, extracting core skills.</p>
      </div>

      {/* Upload Zone */}
      <div 
        ref={uploadZoneRef}
        className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 transition-all duration-300 overflow-hidden min-h-[200px]"
      >
        {/* Loading Scanner Animation */}
        {isUploading && (
          <>
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10" />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              <span className="text-xs font-bold text-blue-700 tracking-wider animate-pulse">Scanning Profile...</span>
            </div>
          </>
        )}

        <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
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
          <div className="mt-4 flex items-center space-x-2 text-xs text-slate-700 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
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
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
          }`}
        >
          {isUploading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <div className="flex items-center space-x-2 text-emerald-600 mb-3">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm">Analysis Complete</h3>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-h-60 overflow-y-auto">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">Extracted Text Preview</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
              {result.extracted_text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
