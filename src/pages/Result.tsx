import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { FrameCanvas } from '../components/FrameCanvas';
import { useAppContext } from '../store/AppContext';
import { generatePoster } from '../utils/canvasCompositor';
import './Result.css';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { state, setIdentity } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Pre-generate the poster on mount so the download click is synchronous.
  // This prevents Safari from losing the user gesture and ignoring the `download` filename.
  React.useEffect(() => {
    let active = true;
    const prepareDownload = async () => {
      try {
        setIsGenerating(true);
        const blob = await generatePoster(state);
        if (!active) return;
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } catch (err) {
        console.error('Failed to pre-generate poster', err);
        if (active) setError('Could not generate the image. Please try again.');
      } finally {
        if (active) setIsGenerating(false);
      }
    };
    prepareDownload();
    return () => {
      active = false;
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [state]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `FrameInGoa-${state.builderId || 'poster'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    const text = `I'm going to HH Goa 2026! 🌊🌴 Builder ID: ${state.builderId} #FrameInGoa #HackerHouseGoa`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEditAgain = () => navigate('/frames');

  const handleCreateAnother = () => {
    setIdentity('', '', '', null, '');
    navigate('/');
  };

  return (
    <div className="result-page container fade-in-up page-card">
      <ProgressIndicator currentStep={4} />

      <div className="result-layout">
        {/* ── Frame Preview ── */}
        <div className="result-frame-col">
          <FrameCanvas
            template={state.template || 'sunset'}
            userPhoto={state.photo || undefined}
            name={state.name}
            role={state.role}
            email={state.email}
            builderId={state.builderId}
            crop={state.crop}
            zoom={state.zoom}
            cropPixels={state.cropPixels}
          />
        </div>

        {/* ── Identity + Actions ── */}
        <div className="result-info-col">
          <div className="result-identity-card">
            <p className="text-label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
              YOUR DIGITAL LEGACY
            </p>
            <h2 className="text-headline-md result-name">{state.name}</h2>
            <p className="result-role">{state.role}</p>

            <div className="result-id-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <circle cx="9" cy="10" r="2"/>
                <path d="M15 8h2M15 12h2M7 16h10"/>
              </svg>
              <span style={{ color: 'var(--on-surface-variant)' }}>Builder ID:</span>
              <strong style={{ color: '#4dd9f0', letterSpacing: '0.06em' }}>{state.builderId}</strong>
            </div>

            {state.email && (
              <p className="result-email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 8 10-8"/>
                </svg>
                {state.email}
              </p>
            )}
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>
          )}

          <div className="result-actions">
            <Button onClick={handleDownload} disabled={isGenerating || !downloadUrl} className="result-download-btn">
              {isGenerating ? (
                <><span className="material-symbols-outlined spin">progress_activity</span> PREPARING…</>
              ) : (
                <><span className="material-symbols-outlined">download</span> DOWNLOAD JPG</>
              )}
            </Button>

            <Button variant="ghost" onClick={handleShare}>
              <span className="material-symbols-outlined">share</span> SHARE TO X
            </Button>
          </div>

          <div className="result-secondary-actions">
            <Button variant="ghost" onClick={handleEditAgain}>
              <span className="material-symbols-outlined">edit</span> EDIT FRAME
            </Button>
            <Button variant="ghost" onClick={handleCreateAnother}>
              <span className="material-symbols-outlined">add_circle</span> CREATE ANOTHER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
