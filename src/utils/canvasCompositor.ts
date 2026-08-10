import { FRAME_CONFIG } from '../components/FrameCanvas';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // crossOrigin needed for /frames/*.png served from same origin - harmless for data: URLs
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry without crossOrigin (for data: URLs which ignore it anyway)
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = (e) => reject(e);
      img2.src = url;
    };
    img.src = url;
  });
};

/** Converts a canvas to a JPEG Blob reliably across all browsers */
const canvasToBlob = (canvas: HTMLCanvasElement, quality = 0.93): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
      'image/jpeg',
      quality
    );
  });

export const generatePoster = async (state: any): Promise<Blob> => {
  const W = FRAME_CONFIG.width;    // 1054
  const H = FRAME_CONFIG.height;   // 1492
  const cfg = FRAME_CONFIG;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // ── LAYER 1: Background Artwork ───────────────────────────
  const bgUrl = state.template === 'sunset' ? '/frames/sunset.png' : '/frames/wave.png';
  const bgImg = await loadImage(bgUrl);
  ctx.drawImage(bgImg, 0, 0, W, H);

  // ── LAYER 2: Portrait Circle ───────────────────────────────
  if (state.photo) {
    const diamPx = W * (cfg.portrait.diameterPct / 100);
    const portraitX = (W - diamPx) / 2;
    const portraitY = H * (cfg.portrait.topPct / 100);
    const radius = diamPx / 2;
    const cx = portraitX + radius;
    const cy = portraitY + radius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const userImg = await loadImage(state.photo);

    if (state.cropPixels) {
      // Use the precise crop area captured during the Adjust step
      ctx.drawImage(
        userImg,
        state.cropPixels.x,
        state.cropPixels.y,
        state.cropPixels.width,
        state.cropPixels.height,
        portraitX,
        portraitY,
        diamPx,
        diamPx
      );
    } else {
      // Fallback: fit image into circle with zoom/crop approximation
      const zoomFactor = state.zoom || 1;
      const srcSize = Math.min(userImg.naturalWidth, userImg.naturalHeight) / zoomFactor;
      const srcX = (userImg.naturalWidth - srcSize) / 2 - (state.crop?.x || 0);
      const srcY = (userImg.naturalHeight - srcSize) / 2 - (state.crop?.y || 0);
      ctx.drawImage(userImg, srcX, srcY, srcSize, srcSize, portraitX, portraitY, diamPx, diamPx);
    }

    // Ring border
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
  }

  // ── LAYER 3: Bottom scrim for text legibility ──────────────
  // Subtle gradient, not heavy black — artwork shows through
  const scrimTop = H * 0.55;
  const scrimH = H * 0.45;
  const scrimGrad = ctx.createLinearGradient(0, scrimTop, 0, scrimTop + scrimH);
  scrimGrad.addColorStop(0, 'rgba(0,0,0,0)');
  scrimGrad.addColorStop(0.4, 'rgba(0,0,0,0.30)');
  scrimGrad.addColorStop(0.75, 'rgba(0,0,0,0.55)');
  scrimGrad.addColorStop(1, 'rgba(0,0,0,0.70)');
  ctx.fillStyle = scrimGrad;
  ctx.fillRect(0, scrimTop, W, scrimH);

  // ── LAYER 4: Dynamic Identity Text ─────────────────────────
  await document.fonts.ready;

  const isSunset = state.template === 'sunset';
  const textPrimary = isSunset ? '#fffdf0' : '#f0f8ff';
  const textAccent = isSunset ? '#ffb347' : '#00ced1';
  const borderColor = isSunset ? 'rgba(255, 179, 71, 0.6)' : 'rgba(0, 206, 209, 0.6)';

  // Build vertical layout items to calculate total block height
  const items: any[] = [];

  // Name (Kaushan Script)
  items.push({ type: 'name', text: state.name || 'Your Name', height: 130, marginBottom: 25 });

  // Role (Montserrat)
  items.push({ type: 'role', text: (state.role || 'Your Role').toUpperCase(), height: 36, marginBottom: 35 });

  // Builder ID (Space Mono + Badge)
  items.push({ type: 'id', value: state.builderId || 'GOA-HH-XXXXXX', height: 56, marginBottom: 35 });

  // Email (Inter)
  if (state.email) {
    items.push({ type: 'email', text: state.email, height: 26, marginBottom: 45 });
  } else {
    items[items.length - 1].marginBottom += 30; // Extra space if no email
  }

  // Footer (Inter)
  items.push({ type: 'footer', text: 'HH GOA 2026 | #FrameInGoa', height: 22, marginBottom: 0 });

  const totalHeight = items.reduce((sum, item) => sum + item.height + item.marginBottom, 0);
  
  // Safe zone bounds
  const safeZoneTop = H * 0.55;
  const safeZoneHeight = H * 0.45;
  let currentY = safeZoneTop + (safeZoneHeight - totalHeight) / 2;
  const centerX = W / 2;

  // Render items
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (const item of items) {
    if (item.type === 'name') {
      ctx.save();
      ctx.font = `400 130px 'Kaushan Script', cursive`;
      ctx.fillStyle = textPrimary;
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;
      ctx.fillText(item.text, centerX, currentY);
      ctx.restore();
    } 
    else if (item.type === 'role') {
      ctx.save();
      ctx.font = `700 36px 'Montserrat', sans-serif`;
      ctx.fillStyle = textPrimary;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.letterSpacing = '0.15em'; // Optional, might not work on all canvas implementations, but good to add
      
      const textWidth = ctx.measureText(item.text).width;
      // Add manual letter spacing to width approximation if standard canvas doesn't support it
      const approxSpacing = item.text.length * 5; 
      const adjustedWidth = textWidth + approxSpacing;
      
      ctx.fillText(item.text, centerX, currentY);
      
      // Horizontal badge lines
      const lineLen = 40;
      const gap = 30;
      const lineY = currentY + 18;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(centerX - adjustedWidth / 2 - gap - lineLen, lineY);
      ctx.lineTo(centerX - adjustedWidth / 2 - gap, lineY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + adjustedWidth / 2 + gap, lineY);
      ctx.lineTo(centerX + adjustedWidth / 2 + gap + lineLen, lineY);
      ctx.stroke();
      ctx.restore();
    }
    else if (item.type === 'id') {
      ctx.save();
      const label = 'BUILDER ID: ';
      
      ctx.font = `400 28px 'Space Mono', monospace`;
      const labelMetrics = ctx.measureText(label);
      
      ctx.font = `700 28px 'Space Mono', monospace`;
      ctx.letterSpacing = '0.08em';
      const valueMetrics = ctx.measureText(item.value);
      const valueSpacing = item.value.length * 2;
      
      const totalWidth = labelMetrics.width + valueMetrics.width + valueSpacing;
      const padX = 24;
      const badgeW = totalWidth + padX * 2;
      const badgeH = item.height; // 56
      
      // Badge background
      ctx.fillStyle = 'rgba(0, 10, 20, 0.5)';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(centerX - badgeW / 2, currentY, badgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.textBaseline = 'middle';
      const textY = currentY + badgeH / 2 + 2; // slight optical nudge
      
      // Label
      ctx.font = `400 28px 'Space Mono', monospace`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0px';
      ctx.fillText(label, centerX - totalWidth / 2, textY);
      
      // Value
      ctx.font = `700 28px 'Space Mono', monospace`;
      ctx.fillStyle = textAccent;
      // Some browsers don't support letterSpacing in Canvas yet, so we manually position
      ctx.fillText(item.value, centerX - totalWidth / 2 + labelMetrics.width, textY);
      ctx.restore();
    }
    else if (item.type === 'email') {
      ctx.save();
      ctx.font = `400 26px 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(`✉  ${item.text}`, centerX, currentY);
      ctx.restore();
    }
    else if (item.type === 'footer') {
      ctx.save();
      ctx.font = `600 22px 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.letterSpacing = '0.05em';
      ctx.fillText(item.text, centerX, currentY);
      ctx.restore();
    }
    
    currentY += item.height + item.marginBottom;
  }

  // Return as a Blob for reliable download across all browsers
  return canvasToBlob(canvas, 0.93);
};
