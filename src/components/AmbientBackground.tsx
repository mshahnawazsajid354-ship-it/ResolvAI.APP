import React, { useEffect, useRef } from 'react';

interface AmbientBackgroundProps {
  theme: 'light' | 'dark';
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ theme }) => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth lerp follow for fluid cursor tracking
    const updatePosition = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--cursor-x', `${currentX}px`);
        spotlightRef.current.style.setProperty('--cursor-y', `${currentY}px`);
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
    >
      {/* 1. Deep Midnight Blue & Black Moving Ambient Gradient (Dark) / Neutral Flat (Light) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Slow drifting organic orb 1 */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] animate-pulse duration-10000"
          style={{
            background: theme === 'dark' 
              ? 'radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 70%, transparent 100%)' 
              : 'none',
          }}
        />

        {/* Slow drifting royal navy orb 2 */}
        <div 
          className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full blur-[140px] animate-pulse duration-7000"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.5) 60%, transparent 100%)'
              : 'none',
          }}
        />

        {/* Ocean midnight blue / soft azure accent at the bottom */}
        <div 
          className="absolute -bottom-[25%] left-[20%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full blur-[150px]"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(23, 37, 84, 0.4) 0%, rgba(2, 6, 23, 0.95) 70%, transparent 100%)'
              : 'none',
          }}
        />
      </div>

      {/* 2. Interactive Cursor Reactive Spotlight (Soft <= 6% glow in Light) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(650px circle at var(--cursor-x, 50vw) var(--cursor-y, 50vh), rgba(29, 78, 216, 0.22), rgba(15, 23, 42, 0.08) 50%, transparent 75%)'
            : 'radial-gradient(600px circle at var(--cursor-x, 50vw) var(--cursor-y, 50vh), rgba(37, 99, 235, 0.05), rgba(147, 197, 253, 0.02) 45%, transparent 70%)',
        }}
      />

      {/* 3. Subtle Vignette Grid Texture (Hidden in Light Mode) */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#020617_1px,transparent_1px)] [background-size:24px_24px] ${
          theme === 'dark' ? 'opacity-[0.035]' : 'opacity-0'
        }`}
      />
    </div>
  );
};
