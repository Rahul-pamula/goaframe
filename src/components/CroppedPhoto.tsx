import React, { useEffect, useRef } from 'react';

interface CroppedPhotoProps {
  src: string;
  cropPixels: { x: number; y: number; width: number; height: number } | null;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an HTML5 canvas showing exactly the cropped region of the source image.
 * This gives a pixel-perfect preview that matches the final downloaded poster.
 */
export const CroppedPhoto: React.FC<CroppedPhotoProps> = ({ src, cropPixels, className, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cropPixels) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0, 0,
        canvas.width,
        canvas.height
      );
    };
    img.src = src;
  }, [src, cropPixels]);

  if (!cropPixels) {
    // Fallback: show the raw photo centered with object-fit cover
    return (
      <img
        src={src}
        alt="User portrait"
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block', ...style }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className={className}
      style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', objectFit: 'cover', ...style }}
    />
  );
};
