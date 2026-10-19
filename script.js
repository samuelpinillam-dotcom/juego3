// Sintetizador de Sonidos (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'correct') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }
}

// Algoritmo Fisher-Yates para desordenar elementos aleatoriamente
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generadores de Gráficos en SVG
function getCircleFractionSVG(numer, denom) {
  const cx = 50, cy = 50, r = 38;
  let paths = '';
  for (let i = 0; i < denom; i++) {
    const startAngle = (i * 360 / denom) - 90;
    const endAngle = ((i + 1) * 360 / denom) - 90;
    const x1 = cx + r * Math.cos(Math.PI * startAngle / 180);
    const y1 = cy + r * Math.sin(Math.PI * startAngle / 180);
    const x2 = cx + r * Math.cos(Math.PI * endAngle / 180);
    const y2 = cy + r * Math.sin(Math.PI * endAngle / 180);
    const largeArc = (endAngle - startAngle > 180) ? 1 : 0;
    const fillColor = i < numer ? '#6366f1' : '#334155';
    
    if (denom === 1) {
      paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillColor}" stroke="#f8fafc" stroke-width="2"/>`;
    } else {
      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${fillColor}" stroke="#f8fafc" stroke-width="2"/>`;
    }
  }
  return `<svg viewBox="0 0 100 100" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto drop-shadow">${paths}</svg>`;
}

function getBarFractionSVG(numer, denom) {
  const width = 120, height = 36;
  const cellWidth = width / denom;
  let rects = '';
  for (let i = 0; i < denom; i++) {
    const fillColor = i < numer ? '#10b981' : '#334155';
    rects += `<rect x="${i * cellWidth}" y="0" width="${cellWidth}" height="${height}" fill="${fillColor}" stroke="#f8fafc" stroke-width="2" rx="2"/>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" class="w-28 h-10 sm:w-36 sm:h-12 mx-auto drop-shadow"><g>${rects}</g></svg>`;
}

function getTriangleSVG(type, anglesText = "") {
  let pathD = "M 50 15 L 85 80 L 15 80 Z";
  if (type === 'isosceles') pathD = "M 50 10 L 80 85 L 20 85 Z";
  if (type === 'escaleno') pathD = "M 20 20 L 85 85 L 10 80 Z";
  if (type === 'rectangulo') pathD = "M 20 15 L 85 85 L 20 85 Z";
  if (type === 'obtusangulo') pathD = "M 15 80 L 90 80 L 30 35 Z";

  let textElement = "";
  if (anglesText) {
    textElement = `<text x="50" y="94" font-size="10" font-weight="bold" fill="#f8fafc" text-anchor="middle">${anglesText}</text>`;
  }

  return `
    <svg viewBox="0 0 100 100" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto drop-shadow">
      <path d="${pathD}" fill="#1e293b" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round"/>
      ${textElement}
    </svg>
  `;
}

// CUESTIONARIOS DEL JUEGO
const rawQuestionsLevel1 = [
  {
    q: "¿Qué imagen representa la fracción 1/2?",
    opts: [
      { svg: getCircleFractionSVG(1, 2), correct: true },
      { svg: getCircleFractionSVG(1, 4), correct: false },
      { svg: getCircleFractionSVG(3, 4), correct: false },
      { svg: getCircleFractionSVG(2, 3), correct: false }
    ],
    exp: "1/2 significa 1 parte pintada de 2 partes iguales."
  },
  {
    q: "¿Cuál de estas barras representa la fracción 3/4?",
    opts: [
      { svg: getBarFractionSVG(3, 4), correct: true },
      { svg: getBarFractionSVG(1, 4), correct: false },
      { svg: getBarFractionSVG(2, 4), correct: false },
      { svg: getBarFractionSVG(4, 4), correct: false }
    ],
    exp: "3/4 son 3 casillas pintadas de 4."
  },
  {
    q: "¿Qué gráfico representa 1/3?",
    opts: [
      { svg: getCircleFractionSVG(1, 3), correct: true },
      { svg: getCircleFractionSVG(2, 3), correct: false },
      { svg: getCircleFractionSVG(1, 2), correct: false },
      { svg: getCircleFractionSVG(1, 4), correct: false }
    ],
    exp: "Un tercio es dividir en 3 partes y pintar 1."
  },
  {
    q: "Si divides una figura en 4 partes y pintas 2, ¿cuál es su gráfico?",
    opts: [
      { svg: getCircleFractionSVG(2, 4), correct: true },
      { svg: getCircleFractionSVG(1, 4), correct: false },
      { svg: getCircleFractionSVG(3, 4), correct: false },
      { svg: getCircleFractionSVG(4, 4), correct: false }
    ],
    exp: "2/4 representa 2 partes coloreadas de un total de 4."
  },
  {
    q: "¿Cuál gráfico indica la unidad completa (4/4)?",
    opts: [
      { svg: getBarFractionSVG(4, 4), correct: true },
      { svg: getBarFractionSVG(3, 4), correct: false },
      { svg: getBarFractionSVG(2, 4), correct: false },
      { svg: getBarFractionSVG(1, 4), correct: false }
    ],
    exp: "4/4 significa que las 4 casillas están completamente pintadas."
  },
  {
    q: "¿Qué imagen representa la fracción 2/3?",
    opts: [
      { svg: getCircleFractionSVG(2, 3), correct: true },
      { svg: getCircleFractionSVG(1, 3), correct: false },
      { svg: getCircleFractionSVG(1, 2), correct: false },
      { svg: getCircleFractionSVG(3, 4), correct: false }
    ],
    exp: "2/3 significa tomar 2 partes de 3."
  },
  {
    q: "¿Cuál gráfico representa la menor cantidad pintada?",
    opts: [
      { svg: getBarFractionSVG(1, 4), correct: true },
      { svg: getBarFractionSVG(2, 4), correct: false },
      { svg: getBarFractionSVG(3, 4), correct: false },
      { svg: getBarFractionSVG(4, 4), correct: false }
    ],
    exp: "1/4 es solo una casilla, la cantidad más pequeña."
  },
  {
    q: "Identifica la figura que muestra 3/5 partes pintadas:",
    opts: [
      { svg: getBarFractionSVG(3, 5), correct: true },
      { svg: getBarFractionSVG(1, 5), correct: false },
      { svg: getBarFractionSVG(2, 5), correct: false },
      { svg: getBarFractionSVG(4, 5), correct: false }
    ],
    exp: "3 de las 5 casillas de la barra están pintadas de verde."
  },
  {
    q: "¿Qué gráfico representa 1/6 parte coloreada?",
    opts: [
      { svg: getCircleFractionSVG(1, 6), correct: true },
      { svg: getCircleFractionSVG(2, 6), correct: false },
      { svg: getCircleFractionSVG(3, 6), correct: false },
      { svg: getCircleFractionSVG(5, 6), correct: false }
    ],
    exp: "Está dividido en 6 partes iguales y solo 1 está seleccionada."
  },
  {
    q: "¿Cuál de estos gráficos representa la fracción 5/6?",
    opts: [
      { svg: getBarFractionSVG(5, 6), correct: true },
      { svg: getBarFractionSVG(2, 6), correct: false },
      { svg: getBarFractionSVG(3, 6), correct: false },
      { svg: getBarFractionSVG(1, 6), correct: false }
    ],
    exp: "5 partes pintadas sobre un total de 6 casillas."
  }
];

const rawQuestionsLevel2 = [
  {
    q: "¿Cuál de estas imágenes muestra un triángulo Equilátero?",
    opts: [
      { svg: getTriangleSVG('equilatero', '60° 60° 60°'), correct: true },
      { svg: getTriangleSVG('isosceles', '70° 70° 40°'), correct: false },
      { svg: getTriangleSVG('escaleno', '80° 60° 40°'), correct: false },
      { svg: getTriangleSVG('rectangulo', '90° 45° 45°'), correct: false }
    ],
    exp: "El triángulo equilátero tiene sus tres ángulos de 60°."
  },
  {
    q: "¿Cuál triángulo es Isósceles?",
    opts: [
      { svg: getTriangleSVG('isosceles', '70° 70° 40°'), correct: true },
      { svg: getTriangleSVG('equilatero', '60° 60° 60°'), correct: false },
      { svg: getTriangleSVG('escaleno', '80° 60° 40°'), correct: false },
      { svg: getTriangleSVG('rectangulo', '90° 50° 40°'), correct: false }
    ],
    exp: "El triángulo isósceles tiene dos ángulos exactamente iguales (70° y 70°)."
  },
  {
    q: "¿Cuál corresponde a un triángulo Escaleno?",
    opts: [
      { svg: getTriangleSVG('escaleno', '80° 60° 40°'), correct: true },
      { svg: getTriangleSVG('equilatero', '60° 60° 60°'), correct: false },
      { svg: getTriangleSVG('isosceles', '50° 50° 80°'), correct: false },
      { svg: getTriangleSVG('rectangulo', '90° 45° 45°'), correct: false }
    ],
    exp: "El triángulo escaleno tiene sus 3 ángulos con medidas distintas."
  },
  {
    q: "¿Cuál es un triángulo Rectángulo?",
    opts: [
      { svg: getTriangleSVG('rectangulo', '90° 60° 30°'), correct: true },
      { svg: getTriangleSVG('equilatero', '60° 60° 60°'), correct: false },
      { svg: getTriangleSVG('isosceles', '80° 50° 50°'), correct: false },
      { svg: getTriangleSVG('obtusangulo', '110° 40° 30°'), correct: false }
    ],
    exp: "Un triángulo rectángulo siempre tiene un ángulo de 90°."
  },
  {
    q: "¿Cuánto suman SIEMPRE los tres ángulos internos de cualquier triángulo?",
    graphicSVG: `
      <svg viewBox="0 0 120 70" class="w-32 h-16 mx-auto">
        <path d="M 15 55 L 105 55 L 60 15 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="30" y="50" font-size="9" fill="#f8fafc" font-weight="bold">A</text>
        <text x="90" y="50" font-size="9" fill="#f8fafc" font-weight="bold">B</text>
        <text x="60" y="28" font-size="9" fill="#f8fafc" font-weight="bold">C</text>
        <text x="60" y="65" font-size="9" fill="#38bdf8" font-weight="bold" text-anchor="middle">A + B + C = ¿?</text>
      </svg>
    `,
    opts: [
      { text: "180°", correct: true },
      { text: "90°", correct: false },
      { text: "360°", correct: false },
      { text: "100°", correct: false }
    ],
    exp: "Los 3 ángulos internos de cualquier triángulo siempre suman 180°."
  },
  {
    q: "Si dos ángulos de un triángulo miden 60° y 60°, ¿cuánto mide el tercero?",
    graphicSVG: `
      <svg viewBox="0 0 120 70" class="w-32 h-16 mx-auto">
        <path d="M 20 55 L 100 55 L 60 15 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="32" y="50" font-size="9" fill="#f8fafc" font-weight="bold">60°</text>
        <text x="80" y="50" font-size="9" fill="#f8fafc" font-weight="bold">60°</text>
        <text x="60" y="28" font-size="9" fill="#f8fafc" font-weight="bold">¿?</text>
      </svg>
    `,
    opts: [
      { text: "60°", correct: true },
      { text: "90°", correct: false },
      { text: "45°", correct: false },
      { text: "80°", correct: false }
    ],
    exp: "60° + 60° = 120°. Para llegar a 180° faltan 60°."
  },
  {
    q: "¿Cuál de las figuras es un triángulo Obtusángulo?",
    opts: [
      { svg: getTriangleSVG('obtusangulo', '120° 30° 30°'), correct: true },
      { svg: getTriangleSVG('equilatero', '60° 60° 60°'), correct: false },
      { svg: getTriangleSVG('rectangulo', '90° 45° 45°'), correct: false },
      { svg: getTriangleSVG('isosceles', '70° 70° 40°'), correct: false }
    ],
    exp: "Tiene un ángulo abierto mayor a 90° (120°)."
  },
  {
    q: "Un triángulo tiene un ángulo de 90° y otro de 40°. ¿Cuánto mide el tercero?",
    graphicSVG: `
      <svg viewBox="0 0 120 70" class="w-32 h-16 mx-auto">
        <path d="M 25 15 L 95 55 L 25 55 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="32" y="48" font-size="9" fill="#f8fafc" font-weight="bold">90°</text>
        <text x="75" y="50" font-size="9" fill="#f8fafc" font-weight="bold">40°</text>
        <text x="32" y="28" font-size="9" fill="#f8fafc" font-weight="bold">¿?</text>
      </svg>
    `,
    opts: [
      { text: "50°", correct: true },
      { text: "40°", correct: false },
      { text: "60°", correct: false },
      { text: "90°", correct: false }
    ],
    exp: "90° + 40° = 130°. Le faltan 50° para completar los 180°."
  },
  {
    q: "¿Cuál triángulo es Acutángulo?",
    opts: [
      { svg: getTriangleSVG('equilatero', '70° 60° 50°'), correct: true },
      { svg: getTriangleSVG('rectangulo', '90° 60° 30°'), correct: false },
      { svg: getTriangleSVG('obtusangulo', '100° 50° 30°'), correct: false },
      { svg: getTriangleSVG('rectangulo', '90° 45° 45°'), correct: false }
    ],
    exp: "Sus 3 ángulos (70°, 60° y 50°) son menores a 90°."
  },
  {
    q: "Si un triángulo tiene ángulos de 50°, 60° y 70°, ¿qué tipo de triángulo es?",
    opts: [
      { svg: getTriangleSVG('escaleno', '50° 60° 70°'), correct: true },
      { svg: getTriangleSVG('equilatero', '60° 60° 60°'), correct: false },
      { svg: getTriangleSVG('isosceles', '60° 60° 60°'), correct: false },
      { svg: getTriangleSVG('rectangulo', '90° 45° 45°'), correct: false }
    ],
    exp: "Tener los 3 ángulos diferentes lo convierte en un triángulo Escaleno."
  }
];

const rawQuestionsLevel3 = [
  {
    q: "¿Cuánto es 1.200 dividido en 25?",
    opts: [
      { text: "48", correct: true },
      { text: "42", correct: false },
      { text: "54", correct: false },
      { text: "38", correct: false }
    ],
    exp: "1.200 dividido en 25 es igual a 48."
  },
  {
    q: "¿Cuánto da multiplicar 120 por 15?",
    opts: [
      { text: "1.800", correct: true },
      { text: "1.500", correct: false },
      { text: "2.100", correct: false },
      { text: "1.650", correct: false }
    ],
    exp: "120 multiplicado por 15 da 1.800."
  },
  {
    q: "¿Cuánto es 2.500 dividido en 50?",
    opts: [
      { text: "50", correct: true },
      { text: "40", correct: false },
      { text: "25", correct: false },
      { text: "60", correct: false }
    ],
    exp: "2.500 dividido en 50 es igual a 50."
  },
  {
    q: "¿Cuánto es 15 al cuadrado?",
    opts: [
      { text: "225", correct: true },
      { text: "200", correct: false },
      { text: "150", correct: false },
      { text: "250", correct: false }
    ],
    exp: "15 al cuadrado (15 por 15) es 225."
  },
  {
    q: "¿Cuál es la raíz cuadrada de 400?",
    opts: [
      { text: "20", correct: true },
      { text: "40", correct: false },
      { text: "10", correct: false },
      { text: "30", correct: false }
    ],
    exp: "La raíz cuadrada de 400 es 20, ya que 20 por 20 es 400."
  },
  {
    q: "¿Cuánto resulta de dividir 1.800 entre 40?",
    opts: [
      { text: "45", correct: true },
      { text: "40", correct: false },
      { text: "50", correct: false },
      { text: "35", correct: false }
    ],
    exp: "1.800 dividido entre 40 da como resultado 45."
  },
  {
    q: "¿Cuánto es 20 al cuadrado?",
    opts: [
      { text: "400", correct: true },
      { text: "200", correct: false },
      { text: "800", correct: false },
      { text: "40", correct: false }
    ],
    exp: "20 al cuadrado (20 por 20) es 400."
  },
  {
    q: "¿Cuánto es 3.600 dividido en 60?",
    opts: [
      { text: "60", correct: true },
      { text: "50", correct: false },
      { text: "70", correct: false },
      { text: "600", correct: false }
    ],
    exp: "3.600 dividido en 60 es 60."
  },
  {
    q: "¿Cuál es la raíz cuadrada de 900?",
    opts: [
      { text: "30", correct: true },
      { text: "90", correct: false },
      { text: "300", correct: false },
      { text: "45", correct: false }
    ],
    exp: "La raíz cuadrada de 900 es 30, ya que 30 por 30 es 900."
  },
  {
    q: "¿Cuánto es 1.500 dividido en 30?",
    opts: [
      { text: "50", correct: true },
      { text: "45", correct: false },
      { text: "500", correct: false },
      { text: "30", correct: false }
    ],
    exp: "1.500 dividido en 30 da 50."
  }
];

// ESTADO Y VARIABLES DEL JUEGO
let currentLevel = 1;
let questions = [];
let currentQIndex = 0;
let lives = 3;
let answeredCurrent = false;

// Regresar al Menú Principal
function goToMenu() {
  document.getElementById('menuScreen').classList.remove('hidden');
  document.getElementById('gameplayScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('gameHUD').classList.add('hidden');
}

// Iniciar Nivel
function startLevel(lvl) {
  currentLevel = lvl;
  lives = 3;
  currentQIndex = 0;

  let rawData = [];
  if (lvl === 1) rawData = rawQuestionsLevel1;
  if (lvl === 2) rawData = rawQuestionsLevel2;
  if (lvl === 3) rawData = rawQuestionsLevel3;

  // Desordenar preguntas y opciones aleatoriamente
  questions = shuffleArray(rawData).map(qItem => ({
    ...qItem,
    opts: shuffleArray(qItem.opts)
  }));

  document.getElementById('menuScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('gameplayScreen').classList.remove('hidden');
  document.getElementById('gameplayScreen').classList.add('flex');
  document.getElementById('gameHUD').classList.remove('hidden');

  const badge = document.getElementById('levelBadge');
  if (lvl === 1) {
    badge.innerText = "Nivel 1: Fracciones";
    badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  } else if (lvl === 2) {
    badge.innerText = "Nivel 2: Ángulos y Triángulos";
    badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30";
  } else {
    badge.innerText = "Nivel 3: Divisiones y Potencias";
    badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30";
  }

  updateLivesHUD();
  renderQuestion();
}

function restartCurrentLevel() {
  startLevel(currentLevel);
}

// Actualizar las Vidas en la interfaz (HUD)
function updateLivesHUD() {
  const container = document.getElementById('heartsContainer');
  let heartsHTML = '';
  for (let i = 0; i < 3; i++) {
    if (i < lives) {
      heartsHTML += `<span class="text-rose-500 text-base sm:text-xl transition-transform duration-300 transform scale-110">❤️</span>`;
    } else {
      heartsHTML += `<span class="text-slate-600 text-base sm:text-xl opacity-40">🖤</span>`;
    }
  }
  container.innerHTML = heartsHTML;
}

// Renderizar la pregunta actual
function renderQuestion() {
  answeredCurrent = false;
  document.getElementById('feedbackContainer').classList.add('hidden');
  document.getElementById('feedbackContainer').classList.remove('flex');
  document.getElementById('currentQuestionNum').innerText = currentQIndex + 1;

  const q = questions[currentQIndex];

  document.getElementById('questionText').innerText = q.q;

  const graphicContainer = document.getElementById('questionGraphicContainer');
  const graphicBox = document.getElementById('questionGraphic');
  if (q.graphicSVG) {
    graphicBox.innerHTML = q.graphicSVG;
    graphicContainer.classList.remove('hidden');
    graphicContainer.classList.add('flex');
  } else {
    graphicContainer.classList.add('hidden');
    graphicContainer.classList.remove('flex');
  }

  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';

  q.opts.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = "group relative bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 hover:border-indigo-500/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center transition duration-150 btn-press min-h-[90px] shadow-md";
    btn.onclick = () => selectOption(opt, btn);

    if (opt.svg) {
      btn.innerHTML = `<div class="w-full flex justify-center items-center pointer-events-none">${opt.svg}</div>`;
    } else {
      btn.innerHTML = `<span class="text-base sm:text-xl font-bold text-slate-100 group-hover:text-white pointer-events-none">${opt.text}</span>`;
    }

    optionsGrid.appendChild(btn);
  });
}

// Selección de Opción
function selectOption(selectedOpt, clickedBtn) {
  if (answeredCurrent) return;
  answeredCurrent = true;

  const q = questions[currentQIndex];
  const allButtons = document.getElementById('optionsGrid').children;

  for (let btn of allButtons) {
    btn.classList.remove('hover:bg-slate-700/80', 'hover:border-indigo-500/60', 'btn-press');
    btn.classList.add('cursor-default');
  }

  const feedbackContainer = document.getElementById('feedbackContainer');
  const feedbackHeader = document.getElementById('feedbackHeader');
  const feedbackExplanation = document.getElementById('feedbackExplanation');

  if (selectedOpt.correct) {
    playSound('correct');
    clickedBtn.classList.add('bg-emerald-900/40', 'border-emerald-500', 'ring-2', 'ring-emerald-500/50');
    
    feedbackHeader.className = "flex items-center gap-2 font-bold text-base sm:text-lg text-emerald-400";
    feedbackHeader.innerHTML = `<span>✅</span> <span>¡Correcto! ¡Excelente trabajo!</span>`;
  } else {
    playSound('wrong');
    lives--;
    updateLivesHUD();
    clickedBtn.classList.add('bg-rose-900/40', 'border-rose-500', 'ring-2', 'ring-rose-500/50');

    q.opts.forEach((o, i) => {
      if (o.correct) {
        allButtons[i].classList.add('bg-emerald-900/20', 'border-emerald-500/60');
      }
    });

    feedbackHeader.className = "flex items-center gap-2 font-bold text-base sm:text-lg text-rose-400";
    feedbackHeader.innerHTML = `<span>❌</span> <span>¡Incorrecto! Perdiste 1 vida</span>`;
  }

  feedbackExplanation.innerText = q.exp;
  feedbackContainer.classList.remove('hidden');
  feedbackContainer.classList.add('flex');

  const nextBtn = document.getElementById('nextBtn');
  if (lives <= 0) {
    nextBtn.innerText = "Ver Resultados ➔";
  } else if (currentQIndex === questions.length - 1) {
    nextBtn.innerText = "Finalizar Nivel ➔";
  } else {
    nextBtn.innerText = "Siguiente Pregunta ➔";
  }
}

// Siguiente Pregunta
function nextQuestion() {
  if (lives <= 0 || currentQIndex >= questions.length - 1) {
    showResults();
  } else {
    currentQIndex++;
    renderQuestion();
  }
}

// Pantalla de Resultados
function showResults() {
  document.getElementById('gameplayScreen').classList.add('hidden');
  document.getElementById('gameHUD').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');
  document.getElementById('resultScreen').classList.add('flex');

  const title = document.getElementById('resultTitle');
  const subtitle = document.getElementById('resultSubtitle');
  const icon = document.getElementById('resultIcon');
  const finalScore = document.getElementById('finalScore');
  const finalLives = document.getElementById('finalLives');

  finalScore.innerText = `${currentQIndex + (lives > 0 ? 1 : 0)} / 10`;
  finalLives.innerText = `${lives > 0 ? lives : 0} ❤️`;

  if (lives > 0) {
    icon.innerText = "🏆";
    title.innerText = "¡Nivel Superado!";
    title.className = "text-2xl sm:text-4xl font-extrabold text-emerald-400";
    subtitle.innerText = "¡Felicidades! Completaste este nivel con éxito.";
  } else {
    icon.innerText = "💔";
    title.innerText = "¡Sin Vidas!";
    title.className = "text-2xl sm:text-4xl font-extrabold text-rose-400";
    subtitle.innerText = "Te has quedado sin vidas. ¡Sigue intentando para lograrlo!";
  }
}