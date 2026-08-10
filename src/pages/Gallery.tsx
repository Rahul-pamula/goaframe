import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import './Gallery.css';

interface FrameData {
  id: 'sunset' | 'wave';
  name: string;
  description: string;
  src: string;
}

const FRAMES: FrameData[] = [
  {
    id: 'sunset',
    name: 'SUNSET',
    description: 'Above the Horizon',
    src: `${import.meta.env.BASE_URL}frames/sunset.png`
  },
  {
    id: 'wave',
    name: 'WAVE',
    description: 'Into the Tide',
    src: `${import.meta.env.BASE_URL}frames/wave.png`
  }
];

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [lightboxFrame, setLightboxFrame] = useState<FrameData | null>(null);

  const handleCreate = (id: string) => {
    navigate(`/frames?template=${id}`);
  };

  return (
    <div className="gallery-page container fade-in-up">
      <div className="gallery-hero">
        <h1 className="text-display-lg hero-title" style={{ fontFamily: 'var(--font-serif)' }}>Frame Gallery</h1>
        <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', marginTop: 'var(--spacing-sm)' }}>
          Explore the official HH Goa 2026 identity frames.
        </p>
      </div>

      <div className="gallery-grid">
        {FRAMES.map((frame) => (
          <div key={frame.id} className="gallery-card">
            {/* Reusable FrameArtwork presentation container ensuring identical aspect ratio/containment */}
            <div 
              className="gallery-artwork-container"
              onClick={() => setLightboxFrame(frame)}
            >
              <img src={frame.src} alt={frame.name} className="gallery-artwork" loading="lazy" />
            </div>
            
            <div className="gallery-info">
              <h2 className="text-headline-md gallery-title" style={{ fontFamily: 'var(--font-serif)' }}>{frame.name}</h2>
              <p className="text-body-md gallery-desc">{frame.description}</p>
              <div className="gallery-action">
                <Button onClick={() => handleCreate(frame.id)}>Create This Frame</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxFrame && (
        <div className="lightbox-overlay" onClick={() => setLightboxFrame(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxFrame(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <img src={lightboxFrame.src} alt={lightboxFrame.name} className="lightbox-image" />
          </div>
          <div className="lightbox-actions" onClick={(e) => e.stopPropagation()}>
            <Button onClick={() => handleCreate(lightboxFrame.id)}>CREATE THIS FRAME</Button>
          </div>
        </div>
      )}
    </div>
  );
};
