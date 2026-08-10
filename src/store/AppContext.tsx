import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AppState {
  name: string;
  role: string;
  email: string;
  photo: string | null;
  crop: { x: number, y: number };
  zoom: number;
  cropPixels: { x: number, y: number, width: number, height: number } | null;
  builderId: string;
  template: 'sunset' | 'wave' | null;
}

interface AppContextType {
  state: AppState;
  setIdentity: (name: string, role: string, email: string, photo: string | null, builderId: string) => void;
  setTemplate: (template: 'sunset' | 'wave') => void;
  setPhoto: (photo: string) => void;
  setCrop: (crop: { x: number, y: number }) => void;
  setZoom: (zoom: number) => void;
  setCropPixels: (pixels: { x: number, y: number, width: number, height: number }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    name: '',
    role: '',
    email: '',
    photo: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    cropPixels: null,
    builderId: '',
    template: null,
  });

  const setIdentity = (name: string, role: string, email: string, photo: string | null, builderId: string) => {
    setState((prev) => ({ ...prev, name, role, email, photo, builderId, crop: {x:0, y:0}, zoom: 1 }));
  };

  const setTemplate = (template: 'sunset' | 'wave') => {
    setState((prev) => ({ ...prev, template }));
  };

  const setPhoto = (photo: string) => {
    setState((prev) => ({ ...prev, photo, crop: {x:0, y:0}, zoom: 1 }));
  };

  const setCrop = (crop: { x: number, y: number }) => {
    setState((prev) => ({ ...prev, crop }));
  };

  const setZoom = (zoom: number) => {
    setState((prev) => ({ ...prev, zoom }));
  };

  const setCropPixels = (cropPixels: { x: number, y: number, width: number, height: number }) => {
    setState((prev) => ({ ...prev, cropPixels }));
  };

  return (
    <AppContext.Provider value={{ state, setIdentity, setTemplate, setPhoto, setCrop, setZoom, setCropPixels }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
