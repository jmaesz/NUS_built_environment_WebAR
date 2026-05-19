# NUS Built Environment — Campus AR

A WebAR experience for NUS Built Environment that lets visitors point their phone camera at selected campus buildings to instantly surface sustainability data — energy use breakdown, green certifications, and building details — with no app download required.

---

## Buildings covered

| Building | Targets | EUI |
|----------|---------|-----|
| SDE4 — School of Design and Environment 4 | 6 image targets | 86 kWh/m²/yr |
| E7 — Engineering Design Innovation Centre | 4 image targets | 116 kWh/m²/yr |

---

## How it works

1. **Image tracking** — MindAR.js detects pre-trained image targets (facade photos) in the live camera feed and anchors A-Frame 3D overlays onto them.
2. **Energy chart** — a Chart.js doughnut panel shows the active building's energy use breakdown (Cooling / Equipment / Lighting).
3. **Thermal highlight** — HSV colour segmentation on the raw camera pixels highlights the building's facade in a thermal-style colourmap. The hue to target is selected based on whichever building MindAR detected last.
4. **Audio narration** — Web Speech API reads a building description aloud with a typewriter caption overlay.
5. **Maps panel** — taps through to Google Maps Street View of the building.

All tracking and processing runs on-device in the browser; no backend or app install required.

---

## Project structure

```
frontend/
  public/
    ar/
      index.html          # Combined SDE4 + E7 AR experience (single page)
      targets-all.mind    # Combined MindAR targets (10 total: SDE4 0–5, E7 6–9)
      image-targets/      # Source images used to train the .mind file
      map_pin.glb         # Animated map pin model
      volume.glb          # Speaker icon model
      trees.glb           # Decorative trees model
    models/               # Individual building GLB models
    bg*.png               # Building reference photos (used in home page marquee + maps panel)
    logo.png              # NUS Built Environment logo
  src/
    pages/
      Home.jsx            # Landing page with building marquee and AR launch button
      Home.css
```

---

## Running locally

```bash
cd frontend
npm install
npm run dev
```

The AR page is a static HTML file at `public/ar/index.html` and is served directly by Vite as a static asset. No build step is needed for the AR itself.

---

## Key dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| MindAR | 1.2.2 | Image target tracking |
| A-Frame | 1.4.2 | 3D scene and AR overlay rendering |
| Chart.js | 4.4.0 | Energy use doughnut chart |
| React + Vite | — | Landing page |

---

## Mind file

`targets-all.mind` was compiled by combining two separate mind files:
- SDE4: 6 targets trained on facade photos of SDE4
- E7: 4 targets trained on facade photos of E7 (with surrounding campus context for richer keypoints)

The combination was done by decoding both files with `@msgpack/msgpack`, concatenating their `dataList` arrays, and re-encoding. SDE4 targets occupy indices 0–5; E7 targets occupy indices 6–9.

---

## Thermal highlight

The highlight uses per-pixel HSV colour segmentation on the live camera feed:

- **SDE4** — teal (`#1abdbd`, hue ≈ 180°), tolerance ±24°
- **E7** — chartreuse (`#ADD129`, hue ≈ 73°), tolerance ±14°

E7's facade colour in the campus 3D model was recoloured from its original tan to chartreuse specifically to create a unique hue gap (60–99°) with no neighbouring buildings, reducing false positives from the colour segmentation.

Matching pixels are recoloured with a `#00e0a0`-based thermal colourmap. Everything else is made transparent, overlaid on the live camera feed via a canvas element.
