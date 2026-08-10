import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { FrameCanvas } from '../components/FrameCanvas';
import { useAppContext } from '../store/AppContext';

export const Frames: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setTemplate } = useAppContext();
  
  // Initialize with query param, then fallback to global state, then 'sunset'
  const queryParams = new URLSearchParams(location.search);
  const initialTemplate = (queryParams.get('template') as 'sunset' | 'wave') || state.template || 'sunset';
  
  const [selectedTemplate, setSelectedTemplate] = useState<'sunset' | 'wave'>(initialTemplate);

  const handleNext = () => {
    setTemplate(selectedTemplate);
    navigate('/adjust');
  };

  return (
    <div className="container fade-in-up page-card">
      <ProgressIndicator currentStep={2} />
      <h2 className="text-headline-md" style={{marginBottom: 'var(--spacing-md)'}}>Select Your Frame</h2>
      
      <div style={{display: 'flex', gap: 'var(--gutter)', flexWrap: 'wrap', marginBottom: 'var(--spacing-lg)'}}>
        <div 
          className="glass-panel" 
          onClick={() => setSelectedTemplate('sunset')}
          style={{flex: 1, minWidth: '300px', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-xl)', cursor: 'pointer', border: `2px solid ${selectedTemplate === 'sunset' ? 'var(--primary)' : 'transparent'}`}}
        >
          <h3 className="text-headline-sm" style={{marginBottom: 'var(--spacing-sm)'}}>SUNSET <span className="text-body-md" style={{color: 'var(--on-surface-variant)', display: 'block'}}>Above the Horizon</span></h3>
          <FrameCanvas template="sunset" userPhoto={state.photo || undefined} name={state.name} role={state.role} email={state.email} builderId={state.builderId} crop={state.crop} zoom={state.zoom} cropPixels={state.cropPixels} />
        </div>
        <div 
          className="glass-panel" 
          onClick={() => setSelectedTemplate('wave')}
          style={{flex: 1, minWidth: '300px', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-xl)', cursor: 'pointer', border: `2px solid ${selectedTemplate === 'wave' ? 'var(--primary)' : 'transparent'}`}}
        >
          <h3 className="text-headline-sm" style={{marginBottom: 'var(--spacing-sm)'}}>WAVE <span className="text-body-md" style={{color: 'var(--on-surface-variant)', display: 'block'}}>Into the Tide</span></h3>
          <FrameCanvas template="wave" userPhoto={state.photo || undefined} name={state.name} role={state.role} email={state.email} builderId={state.builderId} crop={state.crop} zoom={state.zoom} cropPixels={state.cropPixels} />
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button variant="ghost" onClick={() => navigate(-1)}>BACK</Button>
        <Button onClick={handleNext}>NEXT STEP</Button>
      </div>
    </div>
  );
};
