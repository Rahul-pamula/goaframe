# FrameInGoa - Design System

## 1. Source of Truth
The visual design strictly follows the "Cinematic Horizon" system provided in the Stitch export. We must **not** invent a new visual style.

## 2. Aesthetics & Vibe
- **Atmospheric Depth:** Large, soft background blurs, simulating environmental light.
- **Editorial Typography:** High-contrast serif headlines paired with ultra-clean, technical sans-serif labels.
- **Translucent Layering:** Glassmorphism with Backdrop blurs and semi-transparent surface containers.
- **Cinematic Framing:** Subtle glows and generous whitespace to spotlight the frame artwork.
- **Landing Page:** A full-screen coastal/ocean video or shader background, creating a cinematic sunset atmosphere with a premium overlay.

## 3. Color Palette
Based on a deep nocturnal navy (`#041329`) base:
- **Surface / Background:** Deep Ocean Blue (`#041329`, `#010e24`, `#112036`)
- **Primary / Sunset Glow:** Soft desaturated peach / amber (`#ffdbc9`, `#ffb68d`)
- **Secondary / Sea Foam:** Muted teal (`#9ed1bd`, `#1d4f40`)
- **Text (On-Surface):** Soft whites and creams (`#d6e3ff`, `#ddc1b3`)

## 4. Typography
- **Display / Headlines:** Playfair Display (Serif) - Authoritative, elegant, used for storytelling.
- **Body / Functional:** Manrope (Sans-serif) - Clean, technical, highly readable.
- **Label Caps:** Manrope, 12px, bold, uppercase with `0.15em` letter spacing for a luxury, editorial brand feel.

## 5. UI Components
- **Buttons:**
  - Primary: Pill-shaped, solid Primary color. Scales down to 95% on click.
  - Ghost/Outline: Transparent with 1px border.
- **Cards (Frame Selection):**
  - Radius: 12px (`rounded-xl`). Internal media uses 8px.
  - States: Subtly scale up (1.02x) on hover. Active state gets a 2px Primary border.
- **Glows & Borders:**
  - Avoid heavy traditional shadows.
  - Use 1px "ghost borders" (`on-surface/5`).
  - Active elements use `shadow-primary/20` glows.

## 6. Implementation Notes
- The Stitch export heavily relies on Tailwind CSS with a custom configuration.
- We will integrate these precise color, typography, and spacing tokens into our CSS architecture.
