"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, AlertCircle, RefreshCw, Cpu, Briefcase, ChevronDown, ChevronUp, RotateCcw, Info } from 'lucide-react';
import gsap from 'gsap';

interface PredictionResult {
  filename: string;
  extracted_text: string;
  is_eligible?: boolean;
  predicted_roles?: {
    role: string;
    match_score: number;
  }[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showSupportedRoles, setShowSupportedRoles] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const otherRolesRef = useRef<HTMLDivElement>(null);

  // GSAP Float + Glow hover on main card
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

  // Animate Progress Bars when Results load
  useEffect(() => {
    if (result && result.predicted_roles && resultsRef.current) {
      const bars = resultsRef.current.querySelectorAll('.progress-bar-fill');
      
      // Animate the main container fading in
      gsap.from(resultsRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: 'back.out(1.2)'
      });

      // Animate the top 3 progress bars filling up
      bars.forEach((bar, index) => {
        const target = bar.getAttribute('data-target');
        gsap.to(bar, {
          width: `${target}%`,
          duration: 1.2,
          delay: 0.2 + (index * 0.15),
          ease: 'power3.out'
        });
      });
    }
  }, [result]);

  // Animate the dropdown for "Other Categories"
  useEffect(() => {
    if (!otherRolesRef.current) return;
    
    if (showAllCategories) {
      gsap.to(otherRolesRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    } else {
      gsap.to(otherRolesRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, [showAllCategories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
      setShowRawText(false);
      setShowAllCategories(false);
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

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setShowRawText(false);
    setShowAllCategories(false);
  };

  const topRoles = result?.predicted_roles?.slice(0, 3) || [];
  const otherRoles = result?.predicted_roles?.slice(3) || [];

  return (
    <div 
      ref={cardRef} 
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl transition-colors mb-12 relative"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)', transition: 'background 0.4s ease, border-color 0.4s ease' }}
    >
      
      {/* Info Button in Top Right */}
      <button 
        onClick={() => setShowSupportedRoles(!showSupportedRoles)}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-30"
        title="View Supported Roles"
      >
        <Info className="w-5 h-5 text-blue-500" />
      </button>

      {/* Supported Roles Popup */}
      {showSupportedRoles && (
        <div className="absolute top-16 right-6 w-64 p-4 rounded-xl shadow-xl border z-40 anim-in" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
          <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>AI Trained To Predict:</h4>
          <ul className="text-xs space-y-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>AI/ML Engineer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>Backend Developer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>Core Python Developer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>Data Scientist</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>DevOps Engineer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>Frontend Developer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>Java Developer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>Product Manager</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>System Designer</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/><span>UI/UX Designer</span></li>
          </ul>
        </div>
      )}
      
      {/* Title Area - Dynamic based on state */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {result ? 'Analysis Complete' : 'Upload Your Resume'}
        </h2>
        <p className="mt-1.5 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {result 
            ? 'Here are your top AI-predicted career matches based on semantic profiling.' 
            : 'Our PyTorch AI Engine will analyze your semantic profile.'}
        </p>
      </div>

      {/* --- UPLOAD UI (Hidden when result exists) --- */}
      {!result && (
        <div className="anim-in">
          <div 
            ref={uploadZoneRef}
            className="relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden min-h-[200px]"
            style={{ borderColor: 'var(--border-dashed)', background: 'var(--bg-input)' }}
          >
            {isUploading && (
              <>
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: 'var(--bg-card)', opacity: 0.85 }}>
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                  <span className="text-xs font-bold text-blue-500 tracking-wider animate-pulse">Running Neural Network Inference...</span>
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
        </div>
      )}

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* --- RESULTS DASHBOARD OVERLAY --- */}
      {result && (
        <div ref={resultsRef} className="mt-4">
          
          {result.is_eligible === false ? (
            <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center text-center space-y-4 anim-in">
              <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              <h3 className="text-xl font-bold text-red-500">Not Eligible for Target Roles</h3>
              <p className="text-sm text-red-400 font-medium max-w-md leading-relaxed">
                We detected that your background is significantly outside the tech industry. 
                CareerAI currently only matches candidates to specific tech roles like Software Engineering, Data Science, and Design.
              </p>
              <button 
                onClick={resetUpload}
                className="mt-6 flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Upload a Tech Resume</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-md" style={{ color: 'var(--text-primary)' }}>Top 3 Recommended Roles</h3>
                </div>
                
                {/* Start Over Button */}
                <button 
                  onClick={resetUpload}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-blue-500/10 text-blue-500"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </div>

              {/* Top 3 Roles */}
              {topRoles.length > 0 ? (
                <div className="space-y-4">
                  {topRoles.map((role, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 sm:p-5 rounded-xl relative overflow-hidden group transition-all shadow-sm hover:shadow-md"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                          </div>
                          <span className="font-bold text-sm sm:text-base tracking-wide" style={{ color: 'var(--text-primary)' }}>{role.role}</span>
                        </div>
                        <span className="font-extrabold text-lg sm:text-xl text-blue-500">{role.match_score}%</span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
                        <div 
                          className="progress-bar-fill h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" 
                          style={{ width: '0%' }} // GSAP will animate this
                          data-target={role.match_score}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm p-4 rounded-xl" style={{ color: 'var(--text-secondary)', background: 'var(--bg-input)' }}>
                  Could not generate predictions.
                </div>
              )}

              {/* All Categories Dropdown */}
              {otherRoles.length > 0 && (
                <div className="mt-6 border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-card)', background: 'var(--bg-page)' }}>
                  <button 
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="w-full flex justify-between items-center p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>View All Job Categories</span>
                    {showAllCategories ? (
                      <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </button>
                  
                  <div ref={otherRolesRef} className="h-0 opacity-0 overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                    <div className="p-4 pt-0 space-y-3">
                      <div className="h-px w-full mb-3" style={{ background: 'var(--border-card)' }} />
                      {otherRoles.map((role, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{role.role}</span>
                          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{role.match_score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Toggle for Raw Text (Always available if result exists) */}
          <div className="mt-8 flex flex-col items-center">
            <button 
              onClick={() => setShowRawText(!showRawText)}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {showRawText ? 'Hide' : 'Show'} Extracted Raw Text
            </button>
            
            {showRawText && (
              <div className="w-full mt-4 rounded-xl p-5 max-h-60 overflow-y-auto" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)' }}>
                <p className="text-sm whitespace-pre-wrap font-mono leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {result.extracted_text}
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
