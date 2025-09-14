/**
 * PhoLight Client Application
 * Handles audience device functionality including light effects and WebSocket communication
 */

const mode = document.currentScript.dataset.mode;

// Device detection for platform-specific features
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid = /android/i.test(navigator.userAgent);
const isInStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// DOM Elements
const colorDisplay = document.getElementById('color-display');

// iOS Hint - only show on iOS web, not in web app
const iosHint = document.getElementById('ios-hint');
if(isIos && !isInStandalone){
  iosHint.style.display = 'block';
}

// Android Fullscreen Button - only show on Android web, not in web app
let fullscreenBtn;
if(isAndroid && !isInStandalone){
  fullscreenBtn = document.createElement('button');
  fullscreenBtn.id = 'fullscreen-btn';
  fullscreenBtn.innerText = 'Go Fullscreen';
  fullscreenBtn.style.cssText = `
    position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
    padding:10px 20px; font-size:18px; z-index:1000;
    background: linear-gradient(45deg, #ff0080, #8000ff);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);
  `;
  document.body.appendChild(fullscreenBtn);
  fullscreenBtn.addEventListener('click', () => {
    goFullscreen();
    fullscreenBtn.style.display = 'none';
  });
}

/**
 * Request fullscreen mode
 * Cross-browser compatible fullscreen implementation
 */
function goFullscreen() {
  const el = document.documentElement;
  if(el.requestFullscreen) el.requestFullscreen();
  else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if(el.msRequestFullscreen) el.msRequestFullscreen();
}

// WebSocket connection to server
const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

ws.addEventListener('open', () => {
  console.log('Connected to PhoLight server');
  if (mode === 'client') {
    // Register as client
    ws.send(JSON.stringify({ type: 'client-connect' }));
  }
});

ws.addEventListener('close', () => {
  console.log('Disconnected from PhoLight server');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

// Animation control variables
let currentInterval = null;
let currentTimeout = null;

/**
 * Stop all running animations
 * Clears intervals and timeouts, resets display
 */
function stopAllAnimations(){
  if(currentInterval){
    clearInterval(currentInterval);
    currentInterval = null;
  }
  if(currentTimeout){
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  colorDisplay.style.transform = 'scale(1)';
  colorDisplay.style.animation = 'none';
}

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (e.g., "#ff0080")
 * @returns {string} RGB values as string (e.g., "255,0,128")
 */
function hexToRgb(hex){
  hex = hex.replace('#','');
  const bigint = parseInt(hex,16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

/**
 * Light Effects Library
 * All effects run for exactly 0.5 seconds (500ms) for synchronized party experience
 * Each effect takes a color parameter and applies it with specific animation behavior
 */
const lightEffects = {
  /**
   * Static color display
   * @param {string} color - Hex color to display
   */
  static: (color) => {
    stopAllAnimations();
    colorDisplay.style.background = color;
  },
  
  /**
   * Rainbow effect - random colors flashing
   * Shows random HSL colors for 0.5 seconds on all devices
   * @param {string} color - Base color (not used, shows random colors)
   */
  rainbow: (color) => {
    stopAllAnimations();
    // Show random colors for 0.5 seconds
    const startTime = Date.now();
    const duration = 500;
    
    const showRandomColor = () => {
      if (Date.now() - startTime < duration) {
        const randomHue = Math.floor(Math.random() * 360);
        colorDisplay.style.background = `hsl(${randomHue}, 100%, 50%)`;
        currentTimeout = setTimeout(showRandomColor, 50);
      } else {
        colorDisplay.style.background = '#000000';
      }
    };
    showRandomColor();
  },
  
  /**
   * Pulse effect - fade in and out
   * Selected color with smooth fade in/out animation
   * @param {string} color - Hex color to pulse
   */
  pulse: (color) => {
    stopAllAnimations();
    const rgb = hexToRgb(color);
    const startTime = Date.now();
    const duration = 500;
    
    const pulseAnimation = () => {
      if (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        // Fade in and out: 0 -> 1 -> 0
        const intensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
        colorDisplay.style.background = `rgba(${rgb}, ${intensity})`;
        currentTimeout = setTimeout(pulseAnimation, 16); // ~60fps
      } else {
        colorDisplay.style.background = '#000000';
      }
    };
    pulseAnimation();
  },
  
  /**
   * Strobe effect - rapid on/off flashing
   * Selected color strobing rapidly for 0.5 seconds
   * @param {string} color - Hex color to strobe
   */
  strobe: (color) => {
    stopAllAnimations();
    const startTime = Date.now();
    const duration = 500;
    let isOn = true;
    
    const strobeAnimation = () => {
      if (Date.now() - startTime < duration) {
        colorDisplay.style.background = isOn ? color : '#000000';
        isOn = !isOn;
        currentTimeout = setTimeout(strobeAnimation, 100);
      } else {
        colorDisplay.style.background = '#000000';
      }
    };
    strobeAnimation();
  },
  
  /**
   * Wave effect - color wave moving across screen
   * Selected color moves from left to right across the screen
   * @param {string} color - Hex color for the wave
   */
  wave: (color) => {
    stopAllAnimations();
    const rgb = hexToRgb(color);
    const startTime = Date.now();
    const duration = 500;
    
    const waveAnimation = () => {
      if (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        // Move wave from left to right
        const wavePosition = progress * 100;
        const gradient = `linear-gradient(90deg, 
          transparent 0%, 
          transparent ${Math.max(0, wavePosition - 20)}%, 
          rgba(${rgb}, 0.8) ${wavePosition}%, 
          rgba(${rgb}, 0.8) ${Math.min(100, wavePosition + 20)}%, 
          transparent ${Math.min(100, wavePosition + 20)}%, 
          transparent 100%)`;
        colorDisplay.style.background = gradient;
        currentTimeout = setTimeout(waveAnimation, 16); // ~60fps
      } else {
        colorDisplay.style.background = '#000000';
      }
    };
    waveAnimation();
  },
  
  /**
   * Disco effect - random devices light up
   * Only shows on random devices (50% chance) for 0.5 seconds
   * @param {string} color - Hex color to display
   */
  disco: (color) => {
    stopAllAnimations();
    // Only show on random devices (50% chance)
    if (Math.random() < 0.5) {
      const startTime = Date.now();
      const duration = 500;
      
      const discoAnimation = () => {
        if (Date.now() - startTime < duration) {
          colorDisplay.style.background = color;
          currentTimeout = setTimeout(discoAnimation, 50);
        } else {
          colorDisplay.style.background = '#000000';
        }
      };
      discoAnimation();
    } else {
      colorDisplay.style.background = '#000000';
    }
  },
  
  /**
   * Fire effect - flickering like fire
   * Selected color flickers like fire lighting up (starts dark, gets bright)
   * @param {string} color - Hex color for the fire effect
   */
  fire: (color) => {
    stopAllAnimations();
    const rgb = hexToRgb(color);
    const startTime = Date.now();
    const duration = 500;
    
    const fireAnimation = () => {
      if (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        // Fire effect: starts darker, gets brighter quickly
        const baseIntensity = 0.3 + (progress * 0.7); // 0.3 to 1.0
        const flicker = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
        const intensity = baseIntensity * flicker;
        
        const red = Math.floor(parseInt(rgb.split(',')[0]) * intensity);
        const green = Math.floor(parseInt(rgb.split(',')[1]) * intensity * 0.8);
        const blue = Math.floor(parseInt(rgb.split(',')[2]) * intensity * 0.3);
        
        colorDisplay.style.background = `rgb(${red}, ${green}, ${blue})`;
        currentTimeout = setTimeout(fireAnimation, 50);
      } else {
        colorDisplay.style.background = '#000000';
      }
    };
    fireAnimation();
  }
};

/**
 * Set light effect on display
 * @param {string} color - Hex color to display
 * @param {string} effect - Effect name to apply
 */
function setLightEffect(color, effect = 'static'){
  if (lightEffects[effect]) {
    lightEffects[effect](color);
  } else {
    lightEffects.static(color);
  }
}

/**
 * Client message handling
 * Processes WebSocket messages from server
 */
if(mode === 'client'){
  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Handle color updates from host
      if(data.type === 'host-color'){
        console.log('Received color update:', data.color, 'effect:', data.effect);
        setLightEffect(data.color, data.effect || 'static');
      }
      
      // Handle effect commands from host
      if(data.type === 'host-effect'){
        console.log('Received effect:', data.effect, 'with color:', data.color);
        setLightEffect(data.color, data.effect);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Click to go fullscreen for better party experience
  window.addEventListener('click', () => {
    if(!document.fullscreenElement && !document.webkitFullscreenElement){
      goFullscreen();
      if(fullscreenBtn) fullscreenBtn.style.display = 'none';
    }
  });
  
  // Handle orientation change - auto fullscreen after rotation
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if(!document.fullscreenElement && !document.webkitFullscreenElement){
        goFullscreen();
      }
    }, 500);
  });
}