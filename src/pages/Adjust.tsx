import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { Button } from '../components/Button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { FrameCanvas } from '../components/FrameCanvas';
import { useAppContext } from '../store/AppContext';
import './Adjust.css';

export const Adjust: React.FC = () => {
  const navigate = useNavigate();
  const { state, setCrop, setZoom, setCropPixels } = useAppContext();
  
  const [localCrop, setLocalCrop] = useState(state.crop);
  const [localZoom, setLocalZoom] = useState(state.zoom);
  const [localCropPixels, setLocalCropPixels] = useState<{x:number;y:number;width:number;height:number} | null>(state.cropPixels);

  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setLocalCropPixels(croppedAreaPixels);
  };

  const handleReset = () => {
    setLocalCrop({ x: 0, y: 0 });
    setLocalZoom(1);
    setLocalCropPixels(null);
  };

  const handleConfirm = () => {
    setCrop(localCrop);
    setZoom(localZoom);
    if (localCropPixels) setCropPixels(localCropPixels);
    navigate('/result');
  };

  return (
    <div className="container fade-in-up adjust-page-layout page-card">
      <ProgressIndicator currentStep={3} />
      <h2 className="text-headline-md" style={{marginBottom: 'var(--spacing-md)'}}>Adjust Portrait</h2>
      
      <div className="adjust-workspace">
        {/* Left: pixel-accurate live frame preview */}
        <div className="adjust-frame-preview">
          <p className="text-label-caps" style={{color: 'var(--on-surface-variant)', marginBottom: 'var(--spacing-sm)'}}>
            PREVIEW
          </p>
          <FrameCanvas 
            template={state.template || 'sunset'}
            userPhoto={state.photo || undefined}
            name={state.name}
            role={state.role}
            email={state.email}
            builderId={state.builderId}
            crop={localCrop}
            zoom={localZoom}
            cropPixels={localCropPixels}
          />
        </div>

        {/* Right: controls + dedicated Cropper with explicit px height */}
        <div className="adjust-controls-column">
          <div className="adjust-controls-panel">
            <h3 className="text-headline-sm" style={{marginBottom: 'var(--spacing-sm)'}}>Refine Portrait</h3>
            <p className="text-body-md" style={{color: 'var(--on-surface-variant)', marginBottom: 'var(--spacing-md)'}}>
              Drag to reposition. Pinch or slide to zoom.
            </p>

            {/* Dedicated Cropper with explicit 300px height */}
            {state.photo ? (
              <div className="adjust-cropper-area">
                <Cropper
                  image={state.photo}
                  crop={localCrop}
                  zoom={localZoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setLocalCrop}
                  onZoomChange={setLocalZoom}
                  onCropComplete={handleCropComplete}
                  style={{
                    containerStyle: {
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                    },
                    cropAreaStyle: {
                      border: '3px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.65)',
                    },
                  }}
                />
              </div>
            ) : (
              <div className="adjust-cropper-area adjust-cropper-empty">
                <span className="material-symbols-outlined" style={{fontSize: '48px', color: 'var(--on-surface-variant)'}}>image</span>
                <p className="text-body-md" style={{color: 'var(--on-surface-variant)'}}>No photo uploaded</p>
              </div>
            )}

            <div className="zoom-control" style={{marginTop: 'var(--spacing-md)'}}>
              <span className="material-symbols-outlined">zoom_out</span>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.05" 
                value={localZoom} 
                onChange={(e) => setLocalZoom(Number(e.target.value))}
                className="zoom-slider"
                aria-label="Zoom level"
              />
              <span className="material-symbols-outlined">zoom_in</span>
            </div>

            <Button variant="ghost" onClick={handleReset} style={{marginTop: 'var(--spacing-md)', width: '100%'}}>
              <span className="material-symbols-outlined">restart_alt</span>
              RESET
            </Button>
          </div>
        </div>
      </div>

      <div className="bottom-actions">
        <Button variant="ghost" onClick={() => navigate(-1)}>BACK</Button>
        <Button onClick={handleConfirm}>CONFIRM POSITION</Button>
      </div>
    </div>
  );
};
