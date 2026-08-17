/**
 * DATUM — Architectural Spatial Compiler
 * Frontend Interactive Controller & SVG Vector Drawing Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorTelemetry();
  initHeroLineDrawing();
  initLayerToggles();
  initSandboxCompiler();
  initHeroCompilerInteractions();
});

/* ==========================================================================
   1. CURSOR DRAFTING TELEMETRY (IMPERIAL FEET & INCHES)
   Updates X/Y CAD coordinate readout in navigation bar based on mouse position
   ========================================================================== */
function initCursorTelemetry() {
  const coordDisplay = document.getElementById('cursor-coords');
  if (!coordDisplay) return;

  window.addEventListener('mousemove', (e) => {
    // Map screen coordinate to architectural imperial grid (0 to 48 ft X, 0 to 32 ft Y)
    const totalFeetX = (e.clientX / window.innerWidth) * 48.0;
    const totalFeetY = (e.clientY / window.innerHeight) * 32.0;
    
    const ftX = Math.floor(totalFeetX);
    const inX = Math.floor((totalFeetX - ftX) * 12);
    
    const ftY = Math.floor(totalFeetY);
    const inY = Math.floor((totalFeetY - ftY) * 12);
    
    coordDisplay.textContent = `X: ${ftX}'-${inX}" | Y: ${ftY}'-${inY}"`;
  });
}

/* ==========================================================================
   2. HERO BLUEPRINT LINE-DRAWING ENGINE
   Manages sequenced stroke-dashoffset pen tracing & status telemetry
   ========================================================================== */
function initHeroLineDrawing() {
  const heroSvg = document.getElementById('hero-svg');
  const replayBtn = document.getElementById('replay-draw-btn');
  const toggleDimsBtn = document.getElementById('toggle-dims-btn');
  const statusCaption = document.getElementById('drawing-step-caption');
  const pulseDot = document.getElementById('draw-pulse-tag');

  if (!heroSvg) return;

  let animationTimeout;
  const statusSteps = [
    { delay: 100, text: 'PARSING GEOMETRIC BOUNDS [16x14ft]...' },
    { delay: 600, text: 'PLOTTING NORTH & EAST STRUCTURAL WALLS...' },
    { delay: 1600, text: 'SOLVING SOUTH & WEST WALL OPENINGS...' },
    { delay: 2500, text: 'INSERTING WINDOW SILLS & GLAZING...' },
    { delay: 2900, text: 'CALCULATING 90° DOOR CLEARANCE ARCS...' },
    { delay: 3400, text: 'PLACING FURNITURE FIXTURES & BED...' },
    { delay: 4500, text: 'GENERATING PARAMETRIC DIMENSION STRINGS...' },
    { delay: 5200, text: 'COMPILATION COMPLETE // 0 ERRORS' }
  ];

  function runSequenceTelemetry() {
    statusSteps.forEach(({ delay, text }) => {
      setTimeout(() => {
        if (statusCaption) statusCaption.textContent = text;
      }, delay);
    });

    setTimeout(() => {
      if (pulseDot) pulseDot.style.opacity = '0.85';
    }, 5500);
  }

  function triggerRedraw() {
    clearTimeout(animationTimeout);
    heroSvg.classList.remove('drawing-active', 'drawn-complete');
    
    // Force DOM Reflow to restart CSS animations cleanly
    void heroSvg.offsetWidth;
    
    heroSvg.classList.add('drawing-active');
    runSequenceTelemetry();

    animationTimeout = setTimeout(() => {
      heroSvg.classList.add('drawn-complete');
    }, 5600);
  }

  // Initial draw
  triggerRedraw();

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      triggerRedraw();
    });
  }

  // Toggle Dimensions Annotation Layer
  if (toggleDimsBtn) {
    let dimsVisible = true;
    toggleDimsBtn.addEventListener('click', () => {
      dimsVisible = !dimsVisible;
      const annotLayer = document.getElementById('svg-annotations-layer');
      if (annotLayer) {
        annotLayer.style.display = dimsVisible ? 'block' : 'none';
      }
      toggleDimsBtn.classList.toggle('active', dimsVisible);
      toggleDimsBtn.querySelector('span').textContent = dimsVisible ? 'DIMS: ON' : 'DIMS: OFF';
    });
  }
}

/* ==========================================================================
   3. ACTIVE LAYER CONTROLS
   Allows user to isolate individual architectural layers
   ========================================================================== */
function initLayerToggles() {
  const layerButtons = document.querySelectorAll('.layer-toggle-btn');
  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const layerName = btn.getAttribute('data-layer');
      const targetLayer = document.getElementById(`svg-${layerName}-layer`);
      
      const isActive = btn.classList.toggle('active');
      const checkSpan = btn.querySelector('.btn-check');
      if (checkSpan) {
        checkSpan.textContent = isActive ? '■' : '□';
      }

      if (targetLayer) {
        targetLayer.style.display = isActive ? 'block' : 'none';
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE BENCHMARK SANDBOX COMPILER
   Dynamically renders architectural blueprints for various room types (Imperial)
   ========================================================================== */
const PLAN_DATASETS = {
  bedroom: {
    name: 'PRIMARY_BEDROOM_SUITE.DXF',
    area: '224 SQ FT',
    doors: '2 UNITS',
    windows: '2 BAYS',
    scale: 'SCALE: 1/4" = 1\'-0"',
    svgMarkup: `
      <!-- Grid -->
      <g stroke="#2a2e38" stroke-width="0.5" stroke-dasharray="2 4">
        <line x1="50" y1="40" x2="550" y2="40"/><line x1="50" y1="150" x2="550" y2="150"/><line x1="50" y1="260" x2="550" y2="260"/><line x1="50" y1="370" x2="550" y2="370"/>
        <line x1="90" y1="30" x2="90" y2="420"/><line x1="230" y1="30" x2="230" y2="420"/><line x1="370" y1="30" x2="370" y2="420"/><line x1="510" y1="30" x2="510" y2="420"/>
      </g>
      <!-- Walls -->
      <path d="M 90 70 L 230 70 M 370 70 L 510 70 M 510 70 L 510 390 M 510 390 L 260 390 M 190 390 L 140 390 M 90 390 L 90 230 M 90 160 L 90 70" stroke="#eef1f5" stroke-width="3" fill="none"/>
      <path d="M 100 80 L 230 80 M 370 80 L 500 80 M 500 80 L 500 380 M 500 380 L 260 380 M 190 380 L 140 380 M 100 380 L 100 230 M 100 160 L 100 80" stroke="#7fb3d5" stroke-width="0.75" fill="none"/>
      <!-- Window North -->
      <line x1="230" y1="75" x2="370" y2="75" stroke="#7fb3d5" stroke-width="1.5"/>
      <line x1="230" y1="70" x2="370" y2="70" stroke="#7fb3d5" stroke-width="0.75"/>
      <line x1="230" y1="80" x2="370" y2="80" stroke="#7fb3d5" stroke-width="0.75"/>
      <!-- Window SW -->
      <line x1="90" y1="385" x2="140" y2="385" stroke="#7fb3d5" stroke-width="1.5"/>
      <!-- Doors -->
      <line x1="190" y1="390" x2="190" y2="330" stroke="#eef1f5" stroke-width="2"/>
      <path d="M 190 330 A 60 60 0 0 1 250 390" stroke="#7fb3d5" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
      <line x1="90" y1="160" x2="150" y2="160" stroke="#eef1f5" stroke-width="2"/>
      <path d="M 150 160 A 60 60 0 0 1 90 220" stroke="#7fb3d5" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
      <!-- Furniture: Bed -->
      <rect x="235" y="80" width="130" height="150" stroke="#eef1f5" stroke-width="1.5" fill="none"/>
      <rect x="245" y="95" width="50" height="30" rx="2" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <rect x="305" y="95" width="50" height="30" rx="2" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <!-- Nightstands -->
      <rect x="185" y="80" width="40" height="35" stroke="#eef1f5" stroke-width="1" fill="none"/>
      <rect x="375" y="80" width="40" height="35" stroke="#eef1f5" stroke-width="1" fill="none"/>
      <!-- Reading Chair (Simplified Standard Architectural Top-Down Symbol) -->
      <g transform="translate(130, 335) rotate(-45)">
        <rect x="-14" y="-14" width="28" height="28" rx="4" stroke="#eef1f5" stroke-width="1.5" fill="#14161c"/>
        <path d="M -12 -6 Q 0 -14 12 -6" stroke="#7fb3d5" stroke-width="1.5" fill="none"/>
      </g>
      <!-- Dimensions (Strict Imperial without brackets) -->
      <line x1="90" y1="48" x2="510" y2="48" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="270" y="38" width="60" height="18" fill="#14161c"/>
      <text x="300" y="51" fill="#7fb3d5" font-family="JetBrains Mono" font-size="10" text-anchor="middle">16'-0"</text>
      <line x1="535" y1="70" x2="535" y2="390" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="525" y="215" width="20" height="40" fill="#14161c"/>
      <text x="535" y="235" fill="#7fb3d5" font-family="JetBrains Mono" font-size="10" text-anchor="middle" transform="rotate(90 535 235)">14'-0"</text>
      <!-- Tag -->
      <rect x="250" y="300" width="100" height="32" fill="#1c1f27" stroke="#2a2e38" stroke-width="1"/>
      <text x="300" y="315" fill="#eef1f5" font-family="JetBrains Mono" font-size="9" font-weight="700" text-anchor="middle">PRIMARY BEDROOM</text>
      <text x="300" y="326" fill="#7fb3d5" font-family="JetBrains Mono" font-size="8" text-anchor="middle">224 SQ FT</text>
      <!-- Graphic Scale Bar -->
      <g class="graphic-scale-bar" transform="translate(360, 415)">
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="8" x="65" y="-4" text-anchor="middle">SCALE: 1/4" = 1'-0"</text>
        <rect x="0" y="0" width="18" height="3" fill="#7fb3d5" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="18" y="0" width="18" height="3" fill="#14161c" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="36" y="0" width="36" height="3" fill="#7fb3d5" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="72" y="0" width="58" height="3" fill="#14161c" stroke="#7fb3d5" stroke-width="0.5"/>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="0" y="11" text-anchor="middle">0</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="18" y="11" text-anchor="middle">1'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="36" y="11" text-anchor="middle">2'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="72" y="11" text-anchor="middle">4'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="130" y="11" text-anchor="middle">8'</text>
      </g>
    `
  },
  studio: {
    name: 'URBAN_STUDIO_GALLEY_KITCHEN.DXF',
    area: '432 SQ FT',
    doors: '2 UNITS',
    windows: '3 BAYS',
    scale: 'SCALE: 1/4" = 1\'-0"',
    svgMarkup: `
      <!-- Grid -->
      <g stroke="#2a2e38" stroke-width="0.5" stroke-dasharray="2 4">
        <line x1="40" y1="40" x2="560" y2="40"/><line x1="40" y1="200" x2="560" y2="200"/><line x1="40" y1="380" x2="560" y2="380"/>
        <line x1="60" y1="30" x2="60" y2="420"/><line x1="300" y1="30" x2="300" y2="420"/><line x1="540" y1="30" x2="540" y2="420"/>
      </g>
      <!-- Outer Perimeter 24x18ft -->
      <path d="M 60 60 L 540 60 L 540 380 L 160 380 M 90 380 L 60 380 L 60 60" stroke="#eef1f5" stroke-width="3" fill="none"/>
      <path d="M 70 70 L 530 70 L 530 370 L 160 370 M 90 370 L 70 370 L 70 70" stroke="#7fb3d5" stroke-width="0.75" fill="none"/>
      <!-- North Windows (Triple Bay) -->
      <line x1="160" y1="65" x2="440" y2="65" stroke="#7fb3d5" stroke-width="1.5"/>
      <line x1="250" y1="60" x2="250" y2="70" stroke="#7fb3d5" stroke-width="1"/>
      <line x1="350" y1="60" x2="350" y2="70" stroke="#7fb3d5" stroke-width="1"/>
      <!-- Entry Door -->
      <line x1="90" y1="380" x2="90" y2="315" stroke="#eef1f5" stroke-width="2"/>
      <path d="M 90 315 A 65 65 0 0 1 155 380" stroke="#7fb3d5" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
      <!-- Galley Kitchen Counter (West Wall) -->
      <rect x="70" y="70" width="50" height="200" stroke="#eef1f5" stroke-width="1.5" fill="none"/>
      <circle cx="95" cy="110" r="12" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <circle cx="95" cy="140" r="12" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <rect x="75" y="190" width="40" height="30" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <!-- Kitchen Island Bar -->
      <rect x="160" y="100" width="30" height="140" stroke="#eef1f5" stroke-width="1.25" fill="none"/>
      <circle cx="205" cy="125" r="7" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <circle cx="205" cy="165" r="7" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <circle cx="205" cy="205" r="7" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <!-- Living Zone: Sofa & Coffee Table -->
      <rect x="340" y="240" width="140" height="45" rx="3" stroke="#eef1f5" stroke-width="1.5" fill="none"/>
      <rect x="370" y="300" width="80" height="35" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <!-- Bed Sleeping Nook (East Wall) -->
      <rect x="400" y="70" width="130" height="120" stroke="#eef1f5" stroke-width="1.5" fill="none"/>
      <line x1="400" y1="85" x2="530" y2="85" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="415" y="90" width="45" height="25" rx="2" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <rect x="470" y="90" width="45" height="25" rx="2" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <!-- Acoustic Partition Screen -->
      <line x1="390" y1="70" x2="390" y2="170" stroke="#e8a33d" stroke-width="1.5" stroke-dasharray="4 2"/>
      <!-- Dimensions (Strict Imperial without brackets) -->
      <line x1="60" y1="42" x2="540" y2="42" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="270" y="32" width="60" height="18" fill="#14161c"/>
      <text x="300" y="45" fill="#7fb3d5" font-family="JetBrains Mono" font-size="10" text-anchor="middle">24'-0"</text>
      <line x1="558" y1="60" x2="558" y2="380" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="548" y="205" width="20" height="40" fill="#14161c"/>
      <text x="558" y="225" fill="#7fb3d5" font-family="JetBrains Mono" font-size="10" text-anchor="middle" transform="rotate(90 558 225)">18'-0"</text>
      <!-- Zone Labels -->
      <text x="105" y="285" fill="#7fb3d5" font-family="JetBrains Mono" font-size="8">KITCHEN</text>
      <text x="440" y="205" fill="#7fb3d5" font-family="JetBrains Mono" font-size="8">SLEEP ALCOVE</text>
      <text x="390" y="355" fill="#7fb3d5" font-family="JetBrains Mono" font-size="8">LIVING ZONE</text>
      <!-- Graphic Scale Bar -->
      <g class="graphic-scale-bar" transform="translate(360, 415)">
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="8" x="65" y="-4" text-anchor="middle">SCALE: 1/4" = 1'-0"</text>
        <rect x="0" y="0" width="18" height="3" fill="#7fb3d5" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="18" y="0" width="18" height="3" fill="#14161c" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="36" y="0" width="36" height="3" fill="#7fb3d5" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="72" y="0" width="58" height="3" fill="#14161c" stroke="#7fb3d5" stroke-width="0.5"/>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="0" y="11" text-anchor="middle">0</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="18" y="11" text-anchor="middle">1'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="36" y="11" text-anchor="middle">2'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="72" y="11" text-anchor="middle">4'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="130" y="11" text-anchor="middle">8'</text>
      </g>
    `
  },
  office: {
    name: 'EXECUTIVE_CORNER_OFFICE.DXF',
    area: '320 SQ FT',
    doors: '1 UNIT',
    windows: '4 BAYS',
    scale: 'SCALE: 1/4" = 1\'-0"',
    svgMarkup: `
      <!-- Grid -->
      <g stroke="#2a2e38" stroke-width="0.5" stroke-dasharray="2 4">
        <line x1="50" y1="50" x2="550" y2="50"/><line x1="50" y1="220" x2="550" y2="220"/><line x1="50" y1="380" x2="550" y2="380"/>
        <line x1="80" y1="30" x2="80" y2="410"/><line x1="300" y1="30" x2="300" y2="410"/><line x1="520" y1="30" x2="520" y2="410"/>
      </g>
      <!-- Walls 20x16ft with Clean Corner Glazing Junction -->
      <!-- Solid North Wall section -->
      <path d="M 80 60 L 220 60" stroke="#eef1f5" stroke-width="3" fill="none"/>
      <path d="M 90 70 L 220 70" stroke="#7fb3d5" stroke-width="0.75" fill="none"/>
      <!-- Solid East Wall section -->
      <path d="M 520 250 L 520 380" stroke="#eef1f5" stroke-width="3" fill="none"/>
      <path d="M 510 250 L 510 370" stroke="#7fb3d5" stroke-width="0.75" fill="none"/>
      <!-- Solid South Wall with Entry Door Opening -->
      <path d="M 520 380 L 160 380 M 90 380 L 80 380" stroke="#eef1f5" stroke-width="3" fill="none"/>
      <path d="M 510 370 L 160 370 M 90 370 L 90 370" stroke="#7fb3d5" stroke-width="0.75" fill="none"/>
      <!-- Solid West Wall -->
      <path d="M 80 380 L 80 60" stroke="#eef1f5" stroke-width="3" fill="none"/>
      <path d="M 90 370 L 90 70" stroke="#7fb3d5" stroke-width="0.75" fill="none"/>

      <!-- Continuous Corner Curtain Wall (North: 220 to 520, East: 60 to 250) -->
      <line x1="220" y1="65" x2="520" y2="65" stroke="#7fb3d5" stroke-width="1.5"/>
      <line x1="220" y1="60" x2="520" y2="60" stroke="#7fb3d5" stroke-width="0.75"/>
      <line x1="220" y1="70" x2="510" y2="70" stroke="#7fb3d5" stroke-width="0.75"/>
      <line x1="515" y1="65" x2="515" y2="250" stroke="#7fb3d5" stroke-width="1.5"/>
      <line x1="520" y1="65" x2="520" y2="250" stroke="#7fb3d5" stroke-width="0.75"/>
      <line x1="510" y1="70" x2="510" y2="250" stroke="#7fb3d5" stroke-width="0.75"/>
      <!-- Corner Mullion Post -->
      <rect x="510" y="60" width="10" height="10" fill="#1c1f27" stroke="#7fb3d5" stroke-width="1"/>
      <line x1="320" y1="60" x2="320" y2="70" stroke="#7fb3d5" stroke-width="1"/>
      <line x1="420" y1="60" x2="420" y2="70" stroke="#7fb3d5" stroke-width="1"/>
      <line x1="510" y1="155" x2="520" y2="155" stroke="#7fb3d5" stroke-width="1"/>

      <!-- Executive Desk (L-Shape) -->
      <path d="M 330 110 L 470 110 L 470 230 L 420 230 L 420 160 L 330 160 Z" stroke="#eef1f5" stroke-width="1.5" fill="none"/>
      
      <!-- Executive Swivel Task Chair (Standard Architectural Top-Down Symbol) -->
      <g transform="translate(375, 135)">
        <rect x="-14" y="-14" width="28" height="28" rx="4" stroke="#eef1f5" stroke-width="1.5" fill="#14161c"/>
        <path d="M -12 -6 Q 0 -14 12 -6" stroke="#7fb3d5" stroke-width="1.5" fill="none"/>
        <line x1="-14" y1="2" x2="-8" y2="2" stroke="#7fb3d5" stroke-width="1"/>
        <line x1="8" y1="2" x2="14" y2="2" stroke="#7fb3d5" stroke-width="1"/>
      </g>
      
      <!-- Guest Chairs Facing Desk -->
      <g transform="translate(350, 195) rotate(180)">
        <rect x="-11" y="-11" width="22" height="22" rx="3" stroke="#7fb3d5" stroke-width="1.2" fill="#14161c"/>
        <path d="M -9 -5 Q 0 -11 9 -5" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      </g>
      <g transform="translate(400, 195) rotate(180)">
        <rect x="-11" y="-11" width="22" height="22" rx="3" stroke="#7fb3d5" stroke-width="1.2" fill="#14161c"/>
        <path d="M -9 -5 Q 0 -11 9 -5" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      </g>
      <!-- Conference Round Table (West side) -->
      <circle cx="190" cy="220" r="38" stroke="#eef1f5" stroke-width="1.5" fill="none"/>
      <circle cx="190" cy="170" r="8" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <circle cx="190" cy="270" r="8" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <circle cx="140" cy="220" r="8" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <circle cx="240" cy="220" r="8" stroke="#7fb3d5" stroke-width="1" fill="none"/>
      <!-- Storage Credenza (South-West) -->
      <rect x="90" y="320" width="120" height="30" stroke="#eef1f5" stroke-width="1.25" fill="none"/>
      <line x1="150" y1="320" x2="150" y2="350" stroke="#7fb3d5" stroke-width="1"/>
      <!-- Door -->
      <line x1="90" y1="380" x2="90" y2="310" stroke="#eef1f5" stroke-width="2"/>
      <path d="M 90 310 A 70 70 0 0 1 160 380" stroke="#7fb3d5" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
      <!-- Dimensions (Strict Imperial without brackets) -->
      <line x1="80" y1="42" x2="520" y2="42" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="270" y="32" width="60" height="18" fill="#14161c"/>
      <text x="300" y="45" fill="#7fb3d5" font-family="JetBrains Mono" font-size="10" text-anchor="middle">20'-0"</text>
      <line x1="538" y1="60" x2="538" y2="380" stroke="#7fb3d5" stroke-width="1"/>
      <rect x="528" y="205" width="20" height="40" fill="#14161c"/>
      <text x="538" y="225" fill="#7fb3d5" font-family="JetBrains Mono" font-size="10" text-anchor="middle" transform="rotate(90 538 225)">16'-0"</text>
      <!-- Title Box -->
      <rect x="250" y="320" width="120" height="30" fill="#1c1f27" stroke="#2a2e38" stroke-width="1"/>
      <text x="310" y="334" fill="#eef1f5" font-family="JetBrains Mono" font-size="9" font-weight="700" text-anchor="middle">EXEC CORNER OFFICE</text>
      <text x="310" y="344" fill="#7fb3d5" font-family="JetBrains Mono" font-size="8" text-anchor="middle">320 SQ FT [IBC 1004]</text>
      <!-- Graphic Scale Bar -->
      <g class="graphic-scale-bar" transform="translate(360, 415)">
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="8" x="65" y="-4" text-anchor="middle">SCALE: 1/4" = 1'-0"</text>
        <rect x="0" y="0" width="18" height="3" fill="#7fb3d5" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="18" y="0" width="18" height="3" fill="#14161c" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="36" y="0" width="36" height="3" fill="#7fb3d5" stroke="#7fb3d5" stroke-width="0.5"/>
        <rect x="72" y="0" width="58" height="3" fill="#14161c" stroke="#7fb3d5" stroke-width="0.5"/>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="0" y="11" text-anchor="middle">0</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="18" y="11" text-anchor="middle">1'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="36" y="11" text-anchor="middle">2'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="72" y="11" text-anchor="middle">4'</text>
        <text fill="#7fb3d5" font-family="JetBrains Mono" font-size="7" x="130" y="11" text-anchor="middle">8'</text>
      </g>
    `
  }
};

function initSandboxCompiler() {
  const sandboxSvg = document.getElementById('sandbox-svg');
  const planName = document.getElementById('viewer-plan-name');
  const statArea = document.getElementById('stat-area');
  const statDoors = document.getElementById('stat-doors');
  const statWindows = document.getElementById('stat-windows');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const customCompileBtn = document.getElementById('custom-compile-btn');
  const customInput = document.getElementById('custom-input-field');

  if (!sandboxSvg) return;

  function loadPlan(key) {
    const data = PLAN_DATASETS[key] || PLAN_DATASETS.bedroom;
    sandboxSvg.innerHTML = data.svgMarkup;
    if (planName) planName.textContent = data.name;
    if (statArea) statArea.textContent = data.area;
    if (statDoors) statDoors.textContent = data.doors;
    if (statWindows) statWindows.textContent = data.windows;
  }

  // Load default plan
  loadPlan('bedroom');

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.getAttribute('data-preset');
      loadPlan(presetKey);
    });
  });

  if (customCompileBtn && customInput) {
    customCompileBtn.addEventListener('click', () => {
      const val = customInput.value.trim();
      if (!val) {
        customInput.focus();
        return;
      }
      
      presetBtns.forEach(b => b.classList.remove('active'));
      
      // Simulate live spatial compiler solving custom prompt
      const words = val.toLowerCase();
      let matchedKey = 'bedroom';
      if (words.includes('studio') || words.includes('kitchen') || words.includes('living')) {
        matchedKey = 'studio';
      } else if (words.includes('office') || words.includes('desk') || words.includes('conference')) {
        matchedKey = 'office';
      }

      loadPlan(matchedKey);
      if (planName) planName.textContent = 'CUSTOM_USER_COMPILED_LAYOUT.DXF';
    });
  }

  // Viewport Zoom & Export Tools
  let currentZoom = 1;
  const zoomInBtn = document.getElementById('tool-zoom-in');
  const zoomOutBtn = document.getElementById('tool-zoom-out');
  const resetBtn = document.getElementById('tool-reset');
  const exportBtn = document.getElementById('tool-export');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      currentZoom = Math.min(currentZoom + 0.15, 1.6);
      sandboxSvg.style.transform = `scale(${currentZoom})`;
      sandboxSvg.style.transformOrigin = 'center center';
      sandboxSvg.style.transition = 'transform 0.2s ease';
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      currentZoom = Math.max(currentZoom - 0.15, 0.7);
      sandboxSvg.style.transform = `scale(${currentZoom})`;
      sandboxSvg.style.transformOrigin = 'center center';
      sandboxSvg.style.transition = 'transform 0.2s ease';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentZoom = 1;
      sandboxSvg.style.transform = 'scale(1)';
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const originalText = exportBtn.textContent;
      exportBtn.textContent = 'SAVED';
      exportBtn.style.borderColor = 'var(--accent-action)';
      exportBtn.style.color = 'var(--accent-action)';
      
      setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.style.borderColor = '';
        exportBtn.style.color = '';
      }, 1500);
    });
  }
}

/* ==========================================================================
   5. HERO COMPILER INTERACTIONS & KEYBOARD SHORTCUTS
   ========================================================================== */
function initHeroCompilerInteractions() {
  const compileBtn = document.getElementById('hero-compile-btn');
  const engineStatus = document.getElementById('engine-status');
  const replayBtn = document.getElementById('replay-draw-btn');

  function triggerCompileAction() {
    if (engineStatus) {
      engineStatus.textContent = 'COMPILING AST CONSTRAINTS...';
      engineStatus.style.color = 'var(--accent-action)';
      
      setTimeout(() => {
        engineStatus.textContent = 'SYSTEM READY // CONSTRAINTS: 14/14 RESOLVED';
        engineStatus.style.color = '';
      }, 1200);
    }

    if (replayBtn) {
      replayBtn.click();
    }
  }

  if (compileBtn) {
    compileBtn.addEventListener('click', triggerCompileAction);
  }

  // Keyboard shortcut [Return / Enter] when inside prompt card
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || document.activeElement === compileBtn)) {
      triggerCompileAction();
    }
  });
}
