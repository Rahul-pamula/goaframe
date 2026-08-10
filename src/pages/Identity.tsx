import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useAppContext } from '../store/AppContext';
import './Identity.css';

const generateBuilderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GOA-HH-${result}`;
};

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const Identity: React.FC = () => {
  const navigate = useNavigate();
  const { state, setIdentity } = useAppContext();
  
  const [name, setName] = useState(state.name);
  const [role, setRole] = useState(state.role);
  const [email, setEmail] = useState(state.email);
  const [photo, setPhoto] = useState<string | null>(state.photo);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!role.trim()) newErrors.role = 'Role is required';
    if (!email.trim() || !isValidEmail(email)) newErrors.email = 'Valid email is required';
    if (!photo) newErrors.photo = 'Photo is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const builderId = state.builderId || generateBuilderId();
    setIdentity(name.trim(), role.trim(), email.trim(), photo, builderId);
    navigate('/frames');
  };

  return (
    <div className="container fade-in-up page-card" style={{ maxWidth: '600px' }}>
      <ProgressIndicator currentStep={1} />
      <h2 className="text-headline-md" style={{marginBottom: 'var(--spacing-md)'}}>Your Details</h2>
      <div style={{padding: 'var(--spacing-md)', borderRadius: 'var(--radius-xl)'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)'}}>
          
          <label className="text-label-caps" style={{color: 'var(--on-surface-variant)'}}>Name</label>
          <input 
            type="text" 
            placeholder="Rahul Pamula" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{background: 'rgba(0,0,0,0.2)', border: `1px solid ${errors.name ? 'var(--error)' : 'var(--outline-variant)'}`, color: 'white', padding: '12px', borderRadius: 'var(--radius-sm)'}} 
          />
          {errors.name && <span style={{color: 'var(--error)', fontSize: '12px'}}>{errors.name}</span>}
          
          <label className="text-label-caps" style={{color: 'var(--on-surface-variant)', marginTop: 'var(--spacing-sm)'}}>Role / Stack</label>
          <input 
            type="text" 
            placeholder="Frontend Engineer" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{background: 'rgba(0,0,0,0.2)', border: `1px solid ${errors.role ? 'var(--error)' : 'var(--outline-variant)'}`, color: 'white', padding: '12px', borderRadius: 'var(--radius-sm)'}} 
          />
          {errors.role && <span style={{color: 'var(--error)', fontSize: '12px'}}>{errors.role}</span>}

          <label className="text-label-caps" style={{color: 'var(--on-surface-variant)', marginTop: 'var(--spacing-sm)'}}>Email</label>
          <input 
            type="email" 
            placeholder="rahul@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{background: 'rgba(0,0,0,0.2)', border: `1px solid ${errors.email ? 'var(--error)' : 'var(--outline-variant)'}`, color: 'white', padding: '12px', borderRadius: 'var(--radius-sm)'}} 
          />
          {errors.email && <span style={{color: 'var(--error)', fontSize: '12px'}}>{errors.email}</span>}

          <label className="text-label-caps" style={{color: 'var(--on-surface-variant)', marginTop: 'var(--spacing-sm)'}}>Photo</label>
          <div className="file-upload-container" style={{ border: `1px dashed ${errors.photo ? 'var(--error)' : 'var(--outline-variant)'}` }}>
             <input type="file" accept="image/png, image/jpeg, image/heic" onChange={handlePhotoChange} className="file-input" />
             <div className="file-upload-visual">
                {photo ? (
                  <img src={photo} alt="Preview" className="photo-preview" />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--on-surface-variant)' }}>cloud_upload</span>
                )}
             </div>
          </div>
          {errors.photo && <span style={{color: 'var(--error)', fontSize: '12px'}}>{errors.photo}</span>}

        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button variant="ghost" onClick={() => navigate(-1)}>BACK</Button>
          <Button onClick={handleNext}>NEXT STEP</Button>
        </div>
      </div>
    </div>
  );
};
