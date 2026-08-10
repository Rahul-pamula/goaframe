import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import './Layout.css';

export const Layout: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="layout-root">
      {/* ── Global Video Background (all pages) ── */}
      <div className="layout-bg">
        {!reducedMotion ? (
          <video
            ref={videoRef}
            className="layout-bg-video"
            src={`${import.meta.env.BASE_URL}video/ocean-sunset-tiny.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="layout-bg-poster" />
        )}
        {/* Overlay transitions to prevent jarring flashes on navigation */}
        <div 
          className="layout-bg-overlay overlay-landing" 
          style={{ opacity: isLanding ? 1 : 0, pointerEvents: 'none' }}
        />
        <div 
          className="layout-bg-overlay overlay-inner" 
          style={{ opacity: !isLanding ? 1 : 0, pointerEvents: 'none' }}
        />
      </div>

      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
