"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');

    // GSAP icon spin
    gsap.fromTo('.theme-icon', { rotate: 0, scale: 0.5 }, { rotate: 360, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="theme-toggle w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {dark ? (
        <Sun className="theme-icon w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="theme-icon w-4 h-4 text-slate-600" />
      )}
    </button>
  );
}
