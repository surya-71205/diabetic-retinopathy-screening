import { DRStage } from '../types';

/**
 * Procedural Generator for Clinical Retinal Fundus & Grad-CAM XAI Images.
 * Produces crisp, authentic-looking medical retinal images via deterministic SVG Data URIs.
 * This guarantees 100% offline reliability, crisp retina visual fidelity, and exact lesion placement.
 */

export function generateRetinalFundusSvg(stage: DRStage, eye: 'OD' | 'OS' = 'OD'): string {
  const isOD = eye === 'OD'; // Right eye: optic disc on nasal (left side of image for right eye)
  const discX = isOD ? 280 : 520;
  const discY = 400;
  const maculaX = isOD ? 460 : 340;
  const maculaY = 410;

  // Lesions according to stage
  let lesionsSvg = '';
  if (stage === 'Mild NPDR') {
    // A few microaneurysms
    lesionsSvg = `
      <!-- Microaneurysms -->
      <circle cx="${maculaX + 60}" cy="${maculaY - 50}" r="3.5" fill="#881337" opacity="0.9" />
      <circle cx="${maculaX - 45}" cy="${maculaY + 70}" r="3" fill="#881337" opacity="0.85" />
      <circle cx="${discX + 110}" cy="${discY + 80}" r="4" fill="#9f1239" opacity="0.9" />
      <circle cx="${maculaX + 80}" cy="${maculaY + 40}" r="3" fill="#881337" opacity="0.8" />
    `;
  } else if (stage === 'Moderate NPDR') {
    // Microaneurysms + dot hemorrhages + hard exudates
    lesionsSvg = `
      <!-- Dot and blot hemorrhages -->
      <ellipse cx="${maculaX + 70}" cy="${maculaY - 60}" rx="6" ry="5" fill="#7f1d1d" opacity="0.92" />
      <ellipse cx="${maculaX - 60}" cy="${maculaY + 50}" rx="7" ry="4" fill="#881337" opacity="0.9" />
      <ellipse cx="${discX + 140}" cy="${discY - 80}" rx="5" ry="6" fill="#7f1d1d" opacity="0.88" />
      <circle cx="${maculaX + 40}" cy="${maculaY + 85}" r="4" fill="#9f1239" opacity="0.9" />
      <circle cx="${maculaX - 90}" cy="${maculaY - 30}" r="4.5" fill="#881337" opacity="0.85" />
      
      <!-- Hard exudates (lipid deposits) -->
      <circle cx="${maculaX + 50}" cy="${maculaY - 20}" r="3" fill="#fef08a" opacity="0.95" />
      <circle cx="${maculaX + 62}" cy="${maculaY - 15}" r="3.5" fill="#fef08a" opacity="0.95" />
      <circle cx="${maculaX + 56}" cy="${maculaY - 8}" r="2.5" fill="#fef9c3" opacity="0.95" />
      <circle cx="${maculaX + 75}" cy="${maculaY - 25}" r="3" fill="#fef08a" opacity="0.9" />
      <circle cx="${maculaX - 30}" cy="${maculaY - 70}" r="3.5" fill="#fef08a" opacity="0.9" />
    `;
  } else if (stage === 'Severe NPDR') {
    // Hemorrhages in 4 quadrants + cotton-wool spots + extensive exudates
    lesionsSvg = `
      <!-- Extensive blot hemorrhages -->
      <ellipse cx="${maculaX + 80}" cy="${maculaY - 90}" rx="10" ry="8" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${maculaX - 80}" cy="${maculaY - 90}" rx="9" ry="7" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${maculaX + 90}" cy="${maculaY + 80}" rx="11" ry="8" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${maculaX - 90}" cy="${maculaY + 85}" rx="12" ry="9" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${discX + 90}" cy="${discY + 120}" rx="8" ry="6" fill="#881337" opacity="0.9" />
      <ellipse cx="${discX + 60}" cy="${discY - 130}" rx="9" ry="7" fill="#7f1d1d" opacity="0.9" />
      <circle cx="${maculaX}" cy="${maculaY + 50}" r="5" fill="#9f1239" opacity="0.9" />
      
      <!-- Cotton-wool spots (infarcts) -->
      <ellipse cx="${maculaX - 40}" cy="${maculaY - 60}" rx="12" ry="8" fill="#f8fafc" opacity="0.75" filter="url(#cws-blur)" />
      <ellipse cx="${discX + 80}" cy="${discY - 60}" rx="14" ry="9" fill="#f8fafc" opacity="0.7" filter="url(#cws-blur)" />
      <ellipse cx="${maculaX + 50}" cy="${maculaY + 45}" rx="10" ry="7" fill="#f8fafc" opacity="0.65" filter="url(#cws-blur)" />
      
      <!-- Hard exudates -->
      <circle cx="${maculaX + 40}" cy="${maculaY - 30}" r="3.5" fill="#fef08a" opacity="0.95" />
      <circle cx="${maculaX + 48}" cy="${maculaY - 36}" r="4" fill="#fef08a" opacity="0.95" />
      <circle cx="${maculaX + 35}" cy="${maculaY - 42}" r="3" fill="#fef9c3" opacity="0.95" />
    `;
  } else if (stage === 'PDR') {
    // Neovascularization + massive hemorrhages + vitreal traction
    lesionsSvg = `
      <!-- Neovascularization at the disc (NVD) -->
      <path d="M ${discX} ${discY} Q ${discX - 25} ${discY - 40} ${discX - 40} ${discY - 70} T ${discX - 60} ${discY - 100}" stroke="#991b1b" stroke-width="2" fill="none" opacity="0.95" />
      <path d="M ${discX} ${discY} Q ${discX + 15} ${discY - 45} ${discX + 35} ${discY - 80} T ${discX + 45} ${discY - 110}" stroke="#b91c1c" stroke-width="2" fill="none" opacity="0.9" />
      <path d="M ${discX} ${discY} Q ${discX - 30} ${discY + 30} ${discX - 50} ${discY + 70}" stroke="#991b1b" stroke-width="1.8" fill="none" opacity="0.9" />
      <!-- Extensive preretinal & flame/blot hemorrhages -->
      <path d="M ${maculaX - 20} ${maculaY + 60} Q ${maculaX + 40} ${maculaY + 80} ${maculaX + 80} ${maculaY + 50} Z" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${maculaX - 100}" cy="${maculaY - 80}" rx="15" ry="11" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${maculaX + 100}" cy="${maculaY - 100}" rx="14" ry="10" fill="#7f1d1d" opacity="0.95" />
      <ellipse cx="${discX + 80}" cy="${discY + 110}" rx="16" ry="12" fill="#7f1d1d" opacity="0.95" />
      <!-- Fibrous proliferation band -->
      <path d="M ${discX - 10} ${discY - 20} Q ${discX + 60} ${discY - 60} ${maculaX} ${maculaY - 50}" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" filter="url(#cws-blur)" />
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <radialGradient id="fundus-base" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#b45309" />
          <stop offset="45%" stop-color="#9a3412" />
          <stop offset="75%" stop-color="#7c2d12" />
          <stop offset="96%" stop-color="#431407" />
          <stop offset="100%" stop-color="#1c0702" />
        </radialGradient>
        <radialGradient id="optic-disc" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="60%" stop-color="#fed7aa" />
          <stop offset="90%" stop-color="#fb923c" />
          <stop offset="100%" stop-color="#c2410c" />
        </radialGradient>
        <radialGradient id="macula-fovea" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#451a03" stop-opacity="0.9" />
          <stop offset="70%" stop-color="#7c2d12" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#9a3412" stop-opacity="0" />
        </radialGradient>
        <filter id="cws-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id="aperture-clip">
          <circle cx="400" cy="400" r="375" />
        </clipPath>
      </defs>

      <!-- Black surrounding mask -->
      <rect width="800" height="800" fill="#09090b" />

      <!-- Fundus Interior -->
      <g clip-path="url(#aperture-clip)">
        <circle cx="400" cy="400" r="375" fill="url(#fundus-base)" />

        <!-- Choroidal background texture simulation -->
        <circle cx="380" cy="420" r="300" fill="#ea580c" opacity="0.15" />
        <circle cx="420" cy="370" r="280" fill="#c2410c" opacity="0.2" />

        <!-- Optic Disc -->
        <ellipse cx="${discX}" cy="${discY}" rx="42" ry="48" fill="url(#optic-disc)" />
        <ellipse cx="${discX + (isOD ? -4 : 4)}" cy="${discY}" rx="20" ry="24" fill="#fef9c3" opacity="0.8" />

        <!-- Macula and Fovea Centralis -->
        <circle cx="${maculaX}" cy="${maculaY}" r="65" fill="url(#macula-fovea)" />
        <circle cx="${maculaX}" cy="${maculaY}" r="6" fill="#260e04" opacity="0.85" />

        <!-- Retinal Vascular Arcades -->
        <!-- Superior Temporal Arcade -->
        <path d="M ${discX} ${discY - 10} C ${discX + (isOD ? 80 : -80)} ${discY - 140}, ${maculaX} ${discY - 210}, ${maculaX + (isOD ? 140 : -140)} ${discY - 190} S ${maculaX + (isOD ? 260 : -260)} ${discY - 120}, ${maculaX + (isOD ? 290 : -290)} ${discY - 60}" 
              stroke="#581c87" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.8" />
        <path d="M ${discX} ${discY - 10} C ${discX + (isOD ? 80 : -80)} ${discY - 140}, ${maculaX} ${discY - 210}, ${maculaX + (isOD ? 140 : -140)} ${discY - 190} S ${maculaX + (isOD ? 260 : -260)} ${discY - 120}, ${maculaX + (isOD ? 290 : -290)} ${discY - 60}" 
              stroke="#7f1d1d" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9" />

        <!-- Superior Arteriole (parallel, narrower, lighter red) -->
        <path d="M ${discX + 5} ${discY - 12} C ${discX + (isOD ? 70 : -70)} ${discY - 130}, ${maculaX - 10} ${discY - 190}, ${maculaX + (isOD ? 120 : -120)} ${discY - 170}" 
              stroke="#991b1b" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.95" />

        <!-- Inferior Temporal Arcade -->
        <path d="M ${discX} ${discY + 10} C ${discX + (isOD ? 80 : -80)} ${discY + 140}, ${maculaX} ${discY + 210}, ${maculaX + (isOD ? 140 : -140)} ${discY + 190} S ${maculaX + (isOD ? 260 : -260)} ${discY + 120}, ${maculaX + (isOD ? 280 : -280)} ${discY + 50}" 
              stroke="#581c87" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.8" />
        <path d="M ${discX} ${discY + 10} C ${discX + (isOD ? 80 : -80)} ${discY + 140}, ${maculaX} ${discY + 210}, ${maculaX + (isOD ? 140 : -140)} ${discY + 190} S ${maculaX + (isOD ? 260 : -260)} ${discY + 120}, ${maculaX + (isOD ? 280 : -280)} ${discY + 50}" 
              stroke="#7f1d1d" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9" />

        <!-- Inferior Arteriole -->
        <path d="M ${discX + 5} ${discY + 12} C ${discX + (isOD ? 75 : -75)} ${discY + 125}, ${maculaX - 10} ${discY + 185}, ${maculaX + (isOD ? 125 : -125)} ${discY + 165}" 
              stroke="#991b1b" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.95" />

        <!-- Nasal vessels -->
        <path d="M ${discX - (isOD ? 15 : -15)} ${discY} C ${discX - (isOD ? 90 : -90)} ${discY - 90}, ${discX - (isOD ? 170 : -170)} ${discY - 120}, ${discX - (isOD ? 230 : -230)} ${discY - 140}" 
              stroke="#7f1d1d" stroke-width="4.5" fill="none" opacity="0.85" />
        <path d="M ${discX - (isOD ? 15 : -15)} ${discY} C ${discX - (isOD ? 90 : -90)} ${discY + 90}, ${discX - (isOD ? 170 : -170)} ${discY + 120}, ${discX - (isOD ? 230 : -230)} ${discY + 140}" 
              stroke="#7f1d1d" stroke-width="4.5" fill="none" opacity="0.85" />

        <!-- Small macular venules -->
        <path d="M ${discX + (isOD ? 25 : -25)} ${discY} Q ${maculaX - (isOD ? 40 : -40)} ${discY - 20} ${maculaX - (isOD ? 25 : -25)} ${maculaY - 10}" 
              stroke="#881337" stroke-width="2" fill="none" opacity="0.75" />

        <!-- DR Specific Lesions -->
        ${lesionsSvg}

        <!-- Aperture vignette border -->
        <circle cx="400" cy="400" r="375" fill="none" stroke="#09090b" stroke-width="16" opacity="0.85" />
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Procedural Generator for Explainability / Attention Grad-CAM Heatmap.
 * Corresponds directly with the DR stage and regions of high neural attention.
 */
export function generateXaiHeatmapSvg(stage: DRStage, eye: 'OD' | 'OS' = 'OD'): string {
  const isOD = eye === 'OD';
  const discX = isOD ? 280 : 520;
  const discY = 400;
  const maculaX = isOD ? 460 : 340;
  const maculaY = 410;

  // Saliency hotspots
  let hotspotsSvg = '';
  if (stage === 'No DR') {
    // Model attends primarily to normal vascular integrity and optic disc
    hotspotsSvg = `
      <circle cx="${discX}" cy="${discY}" r="60" fill="url(#heat-cyan)" opacity="0.5" />
      <circle cx="${maculaX}" cy="${maculaY}" r="70" fill="url(#heat-cyan)" opacity="0.4" />
      <path d="M ${discX} ${discY} Q ${maculaX} ${discY - 160} ${maculaX + 100} ${discY - 150}" stroke="url(#heat-green)" stroke-width="40" fill="none" opacity="0.3" filter="url(#heat-blur)" />
    `;
  } else if (stage === 'Mild NPDR') {
    // Focused attention on microaneurysms
    hotspotsSvg = `
      <circle cx="${maculaX + 60}" cy="${maculaY - 50}" r="45" fill="url(#heat-red)" opacity="0.85" filter="url(#heat-blur)" />
      <circle cx="${maculaX - 45}" cy="${maculaY + 70}" r="38" fill="url(#heat-orange)" opacity="0.8" filter="url(#heat-blur)" />
      <circle cx="${discX + 110}" cy="${discY + 80}" r="42" fill="url(#heat-orange)" opacity="0.8" filter="url(#heat-blur)" />
    `;
  } else if (stage === 'Moderate NPDR') {
    // Significant attention over exudates and blot hemorrhages
    hotspotsSvg = `
      <circle cx="${maculaX + 60}" cy="${maculaY - 20}" r="65" fill="url(#heat-red)" opacity="0.9" filter="url(#heat-blur)" />
      <circle cx="${maculaX - 60}" cy="${maculaY + 50}" r="55" fill="url(#heat-red)" opacity="0.88" filter="url(#heat-blur)" />
      <circle cx="${maculaX + 70}" cy="${maculaY - 60}" r="50" fill="url(#heat-orange)" opacity="0.85" filter="url(#heat-blur)" />
      <circle cx="${discX + 140}" cy="${discY - 80}" r="48" fill="url(#heat-yellow)" opacity="0.8" filter="url(#heat-blur)" />
    `;
  } else if (stage === 'Severe NPDR') {
    // Widespread high-saliency in 4 quadrants
    hotspotsSvg = `
      <ellipse cx="${maculaX + 80}" cy="${maculaY - 90}" rx="80" ry="65" fill="url(#heat-red)" opacity="0.95" filter="url(#heat-blur)" />
      <ellipse cx="${maculaX - 80}" cy="${maculaY - 90}" rx="75" ry="60" fill="url(#heat-red)" opacity="0.92" filter="url(#heat-blur)" />
      <ellipse cx="${maculaX + 90}" cy="${maculaY + 80}" rx="85" ry="70" fill="url(#heat-red)" opacity="0.94" filter="url(#heat-blur)" />
      <ellipse cx="${maculaX - 90}" cy="${maculaY + 85}" rx="85" ry="70" fill="url(#heat-red)" opacity="0.95" filter="url(#heat-blur)" />
      <circle cx="${maculaX - 40}" cy="${maculaY - 60}" r="60" fill="url(#heat-orange)" opacity="0.88" filter="url(#heat-blur)" />
      <circle cx="${discX + 80}" cy="${discY - 60}" r="65" fill="url(#heat-orange)" opacity="0.88" filter="url(#heat-blur)" />
    `;
  } else if (stage === 'PDR') {
    // Intense disc neovascularization cluster & pre-retinal traction
    hotspotsSvg = `
      <ellipse cx="${discX}" cy="${discY - 30}" rx="90" ry="100" fill="url(#heat-red)" opacity="0.98" filter="url(#heat-blur)" />
      <ellipse cx="${maculaX + 30}" cy="${maculaY + 60}" rx="85" ry="75" fill="url(#heat-red)" opacity="0.95" filter="url(#heat-blur)" />
      <circle cx="${maculaX - 100}" cy="${maculaY - 80}" r="70" fill="url(#heat-orange)" opacity="0.9" filter="url(#heat-blur)" />
      <circle cx="${discX + 80}" cy="${discY + 110}" r="75" fill="url(#heat-orange)" opacity="0.9" filter="url(#heat-blur)" />
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <radialGradient id="heat-red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#dc2626" stop-opacity="0.95" />
          <stop offset="40%" stop-color="#ea580c" stop-opacity="0.85" />
          <stop offset="70%" stop-color="#eab308" stop-opacity="0.65" />
          <stop offset="95%" stop-color="#22c55e" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="heat-orange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#eab308" stop-opacity="0.7" />
          <stop offset="85%" stop-color="#22c55e" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="heat-yellow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#eab308" stop-opacity="0.8" />
          <stop offset="60%" stop-color="#22c55e" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="heat-cyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.6" />
          <stop offset="60%" stop-color="#0284c7" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0" />
        </radialGradient>
        <filter id="heat-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <clipPath id="xai-aperture">
          <circle cx="400" cy="400" r="375" />
        </clipPath>
      </defs>

      <!-- Background: dark blue baseline saliency map -->
      <rect width="800" height="800" fill="#030712" />

      <g clip-path="url(#xai-aperture)">
        <!-- Baseline low activation field -->
        <circle cx="400" cy="400" r="375" fill="#0f172a" opacity="0.9" />
        <circle cx="400" cy="400" r="330" fill="#0369a1" opacity="0.25" filter="url(#heat-blur)" />

        <!-- Grad-CAM Neural Attention Hotspots -->
        ${hotspotsSvg}

        <!-- Aperture Border -->
        <circle cx="400" cy="400" r="375" fill="none" stroke="#030712" stroke-width="16" opacity="0.9" />
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
