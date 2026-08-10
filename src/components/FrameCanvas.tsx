import React from 'react';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { CroppedPhoto } from './CroppedPhoto';
import './FrameCanvas.css';

interface FrameCanvasProps {
  template: 'sunset' | 'wave';
  userPhoto?: string;
  name: string;
  role: string;
  email: string;
  builderId: string;
  className?: string;
  
  // Cropper props — only used when isAdjusting=true (Adjust page)
  isAdjusting?: boolean;
  crop?: Point;
  zoom?: number;
  onCropChange?: (location: Point) => void;
  onZoomChange?: (zoom: number) => void;
  onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
  // Pixel-accurate crop area from react-easy-crop's onCropComplete callback
  cropPixels?: { x: number; y: number; width: number; height: number } | null;
}

// Shared poster configuration — same for BOTH templates.
// All values are percentages of the poster's own width/height.
// These are calibrated to the 1054×1492 reference artwork.
export const FRAME_CONFIG = {
  // Artwork native resolution (same for both templates)
  width: 1054,
  height: 1492,
  aspectRatio: 1054 / 1492,

  // Portrait circle — calibrated to the empty glowing ring in the new clean artwork.
  // Ring top arc ≈ 4-5% from top, bottom arc ≈ 45-48% from top.
  // Center ≈ 26%, diameter ≈ 43% of height = ~641px = ~61% of width.
  portrait: {
    topPct: 4.5,       // top of circle as % of poster height
    diameterPct: 60,   // circle diameter as % of poster WIDTH
  },

  // Identity mask — set to null/disabled because the new artwork has no baked-in text.
  // The artwork's lower ~40% is naturally dark (sand/ground area) so text is readable.
  mask: {
    topPct: 60,
    heightPct: 0,  // disabled — no mask needed
  },

  // Dynamic identity text — placed in the lower 45% safe zone.
  text: {
    // We no longer use absolute bottom percentages per element.
    // Instead, the entire identity block occupies the bottom 45% and centers its content via Flexbox.
    safeZoneTopPct: 55,
  }
};

export const FrameCanvas: React.FC<FrameCanvasProps> = ({
  template,
  userPhoto,
  name,
  role,
  email,
  builderId,
  className = '',
  isAdjusting = false,
  crop = { x: 0, y: 0 },
  zoom = 1,
  onCropChange,
  onZoomChange,
  onCropComplete,
  cropPixels = null
}) => {
  const bgImage = template === 'sunset' ? `${import.meta.env.BASE_URL}frames/sunset.png` : `${import.meta.env.BASE_URL}frames/wave.png`;
  const cfg = FRAME_CONFIG;

  // Portrait circle geometry (CSS %)
  const portraitLeft = `${(100 - cfg.portrait.diameterPct) / 2}%`;
  const portraitTop = `${cfg.portrait.topPct}%`;
  const portraitSize = `${cfg.portrait.diameterPct}%`;

  return (
    <div
      className={`frame-canvas-container ${className}`}
      style={{ aspectRatio: `${cfg.aspectRatio}` }}
    >
      {/* ── LAYER 1: Immutable Background Artwork ── */}
      <img
        src={bgImage}
        alt={`${template} frame`}
        className="frame-bg"
        draggable={false}
      />

      {/* ── LAYER 2: Portrait Circle — covers reference portrait ── */}
      <div
        className="frame-portrait-ring"
        style={{
          top: portraitTop,
          left: portraitLeft,
          width: portraitSize,
        }}
      >
        {userPhoto ? (
          isAdjusting ? (
            /* Active Cropper — only rendered on the /adjust page */
            <div className="frame-photo-cropper-wrapper">
              <Cropper
                image={userPhoto}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={onCropChange || (() => {})}
                onZoomChange={onZoomChange || (() => {})}
                onCropComplete={onCropComplete || (() => {})}
                style={{
                  containerStyle: {
                    pointerEvents: 'auto',
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                  },
                  cropAreaStyle: { border: 'none', boxShadow: 'none' },
                }}
              />
            </div>
          ) : (
            /* Static preview: use CroppedPhoto canvas for pixel-perfect accuracy */
            <CroppedPhoto
              src={userPhoto}
              cropPixels={cropPixels}
              style={{ width: '100%', height: '100%' }}
            />
          )
        ) : (
          <div className="frame-photo-placeholder" />
        )}
      </div>

      {/* ── LAYER 3: Bottom scrim — subtle gradient for text legibility ── */}
      {/* Artwork shows through; this just ensures contrast at the identity zone */}
      <div
        className="frame-identity-mask"
        style={{
          top: '55%',
          height: '45%',
        }}
      />

      {/* ── LAYER 4: Dynamic Identity Text ── */}
      <div 
        className={`frame-identity-layer theme-${template}`}
        style={{ top: `${cfg.text.safeZoneTopPct}%`, bottom: 0 }}
      >
        <div className="frame-identity-block">
          {/* Name — Kaushan Script, large, expressive */}
          <div className="frame-text-name">
            {name || 'Your Name'}
          </div>

          {/* Role — Montserrat, bold, uppercase in badge */}
          <div className="frame-text-role-badge">
            <span className="role-text">{role || 'Your Role'}</span>
          </div>

          {/* Builder ID — Space Mono, bordered badge */}
          <div className="frame-text-id-badge">
            <span className="id-label">BUILDER ID:</span>
            <span className="id-value">{builderId || 'GOA-HH-XXXXXX'}</span>
          </div>

          {/* Email — Inter */}
          {email && (
            <div className="frame-text-email">
              <svg className="email-icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m2 7 10 8 10-8"/>
              </svg>
              {email}
            </div>
          )}

          {/* Footer — Subtle Inter */}
          <div className="frame-text-footer">
            HH GOA 2026 | #FrameInGoa
          </div>
        </div>
      </div>
    </div>
  );
};
