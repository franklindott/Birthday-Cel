// Audio Elements
const bgMusic1 = document.getElementById('bgMusic1');
const bgMusic2 = document.getElementById('bgMusic2');

// Function to control track switching per page
function playAudioForPage(pageNumber) {
  if (pageNumber === 1 || pageNumber === 2 || pageNumber === 3) {
  
    if (bgMusic2) {
      bgMusic2.pause();
      bgMusic2.currentTime = 0;
    }
    if (bgMusic1 && bgMusic1.paused) {
      bgMusic1.play().catch(err => console.error("Audio 1 playback failed:", err));
    }
  } else if (pageNumber === 4) {
  
    if (bgMusic1) {
      bgMusic1.pause();
      bgMusic1.currentTime = 0;
    }
    if (bgMusic2 && bgMusic2.paused) {
      bgMusic2.play().catch(err => console.error("Audio 2 playback failed:", err));
    }
  }
}

// Handler for Page 1 Click
function handlePage1Click() {
  playAudioForPage(1);
  goToPage(2);
}

// Navigation Handler
function goToPage(pageNumber) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const targetPage = document.getElementById(`page${pageNumber}`);
  if (targetPage) {
    targetPage.classList.add('active');
    popConfetti();

    playAudioForPage(pageNumber);

    if (pageNumber === 3) {
      resetCandles();
      initMicrophone();
    }
  }
}

// Typewriter Effect (Types text and stops)
function typeWriter(element, text, speed = 120) {
  let index = 0;
  element.innerHTML = '';
  
  function type() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Setup Image Upload
function setupImageUpload(frameId, inputId, imgId) {
  const frame = document.getElementById(frameId);
  const input = document.getElementById(inputId);
  const img = document.getElementById(imgId);

  if (frame && input && img) {
    frame.addEventListener('click', (e) => {
      e.stopPropagation();
      input.click();
    });

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { img.src = event.target.result; };
        reader.readAsDataURL(file);
      }
    });
  }
}

setupImageUpload('photoFramePage2', 'imageInput1', 'birthdayPhoto1');
setupImageUpload('photoFramePage3', 'imageInput2', 'birthdayPhoto2');

// Click Floating Emojis
const clickEmojis = ['💖', '🌸', '✨', '💕', '🌷', '🎀'];

document.addEventListener('click', (e) => {
  createFloatingPop(e.clientX, e.clientY);
});

function createFloatingPop(x, y) {
  const pop = document.createElement('div');
  pop.className = 'floating-pop';
  pop.innerText = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;
  document.body.appendChild(pop);

  setTimeout(() => pop.remove(), 1200);
}

document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.2) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1200);
  }
});

// Candle Blowing & Auto-Transition Logic
const cake = document.getElementById('cake');
const flames = document.querySelectorAll('.flame');
const cakeInstruction = document.getElementById('cakeInstruction');
let candlesBlown = false;

function blowOutCandles() {
  if (candlesBlown) return;
  candlesBlown = true;
  
  flames.forEach(flame => flame.classList.add('out'));
  if (cakeInstruction) {
    cakeInstruction.innerText = "✨ Wish made! Redirecting to message... 🎉";
  }
  popConfetti();

  setTimeout(() => {
    goToPage(4);
  }, 1200);
}

function resetCandles() {
  candlesBlown = false;
  flames.forEach(flame => flame.classList.remove('out'));
  
  if (cakeInstruction) {
    cakeInstruction.innerText = "Blow mo malapit sa mic or pindutin mo 'yung cake, pero mas maganda kung i-i-blow mo siya";
  }
}

if (cake) {
  cake.addEventListener('click', (e) => {
    e.stopPropagation();
    blowOutCandles();
  });
}

// Automatic Microphone Detection
let micInitialized = false;

async function initMicrophone() {
  if (micInitialized) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = () => {
      if (candlesBlown) return;
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      for (let i = 0; i < array.length; i++) {
        values += array[i];
      }
      const average = values / array.length;

      if (average > 38) {
        blowOutCandles();
      }
    };
    micInitialized = true;
  } catch (err) {
    // Mic permission rejected or unavailable - fallback to tap
  }
}

// Confetti Effect
function popConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff4757', '#ff6b81', '#74b9ff', '#ffeaa7', '#a29bfe']
    });
  }
}

// Background Balloons Setup
function createBalloons() {
  const container = document.getElementById('balloons');
  if (!container) return;
  const colors = ['#ff758c', '#ff7eb3', '#fecfef', '#a1c4fd', '#ffdde1', '#e84393'];

  for (let i = 0; i < 14; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.animationDuration = `${7 + Math.random() * 5}s`;
    balloon.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(balloon);
  }
}

window.onload = () => {
  createBalloons();
  setTimeout(popConfetti, 500);

  // Start typewriter on Page 1
  const typewriterElem = document.getElementById('typewriterText');
  if (typewriterElem) {
    typeWriter(typewriterElem, "Happy Birthday Cel! 💕", 70);
  }
};