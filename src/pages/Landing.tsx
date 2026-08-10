import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import './Landing.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Content — video bg is global in Layout */}
      <div className="landing-hero container fade-in-up">
        <span className="text-label-caps hero-kicker">HH GOA 2026</span>
        <h1 className="text-display-lg hero-title">FRAMEINGOA</h1>
        <h2 className="text-headline-md hero-subtitle">Create Your Goa Story</h2>
        
        <div className="landing-actions">
          <Button onClick={() => navigate('/identity')} className="hero-cta">
            <span>CREATE YOUR FRAME</span>
            <span className="material-symbols-outlined cta-icon">arrow_forward</span>
          </Button>
        </div>
        
        <div className="landing-secondary-actions fade-in-up" style={{ animationDelay: '0.6s', marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button variant="ghost" onClick={() => navigate('/gallery')} className="text-body-md" style={{ color: 'rgba(214, 227, 255, 0.8)' }}>
            Explore Gallery
          </Button>
          <Button variant="ghost" onClick={() => navigate('/about')} className="text-body-md" style={{ color: 'rgba(214, 227, 255, 0.8)' }}>
            About HH Goa 2026
          </Button>
        </div>
      </div>
    </div>
  );
};
