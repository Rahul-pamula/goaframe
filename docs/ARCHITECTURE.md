# FrameInGoa - Frontend Architecture

## 1. Tech Stack Overview
- **Core Structure & Logic:** HTML5, modern Vanilla JavaScript / TypeScript (or React if utilizing Vite based on complexity).
- **Styling:** CSS architecture based strictly on the Stitch design system. *Note: Since the Stitch export uses TailwindCSS, we need user confirmation to use Tailwind, otherwise we will translate the design tokens into Vanilla CSS Custom Properties.*
- **Image Processing & Compositing:** HTML5 `<canvas>` API.
- **Build Tool:** Vite (for fast development, modular ES imports, and optimized production builds).

## 2. Module Organization
Since this is a multi-step flow without routing complexities, a Single Page Application (SPA) architecture will be used.

**Key Modules:**
1. **State Manager:** Centralized store to hold:
   - User Identity (Name, Role, Email)
   - Generated Builder ID
   - Selected Frame (SUNSET or WAVE)
   - Uploaded Photo (Data URI or Blob)
   - Crop / Transform data (scale, translateX, translateY)
2. **View Controller:** Handles transitions between the flow steps:
   `Landing -> Identity -> Frame Selection -> Photo Upload -> Adjust -> Result`
3. **Canvas Engine:** 
   - Responsible for rendering the fixed poster artwork as the base layer.
   - Drawing the user's uploaded photo onto the standardized circular mask.
   - Overlaying dynamic text (Name, Role, Builder ID) exactly in the required text regions.
4. **Cropper UI:** A touch/mouse-friendly pan & zoom component built over the canvas to allow users to align their photo.

## 3. Image Compositing Strategy
The final output is a single downloadable image.
- **Layer 0 (Background):** The fixed poster asset (SUNSET or WAVE).
- **Layer 1 (Masked Photo):** The user's photo, scaled and panned based on user input, clipped to a perfect circle at the exact coordinates required by the standard.
- **Layer 2 (Text):** High-res text rendered onto the canvas using the required fonts (Playfair Display / Manrope) for Name, Role, and ID.
- **Export:** `canvas.toDataURL('image/jpeg', 0.95)` triggered on the final step for download.

## 4. Performance & UX Considerations
- **No Loading Screens:** The canvas compositing must happen synchronously or via fast web workers so the "Result" step feels instant.
- **Preloading:** The two high-res frame artwork URLs must be preloaded during the Landing and Identity steps.
- **Responsive:** The UI will scale gracefully down to mobile, adjusting margins and typography per the Design System, while ensuring the Canvas output dimensions remain fixed and high-resolution.
