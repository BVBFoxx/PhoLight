/**
 * PhoLight Host Application
 * Handles host interface functionality including password management, 
 * color control, effects, and WebSocket communication with server
 */

const scriptTag = document.currentScript || document.querySelector('script[data-mode]');
const mode = scriptTag ? scriptTag.dataset.mode : 'host';

// DOM Elements
const passwordInput = document.getElementById('host-password');
const enterHostBtn = document.getElementById('enter-host');
const hostControls = document.getElementById('host-controls');
const loginScreen = document.getElementById('login-screen');
const colorPicker = document.getElementById('color-picker');
const sendColorBtn = document.getElementById('send-color');
const randomColorBtn = document.getElementById('random-color');
const qrCodeEl = document.getElementById('qr-code');
const participantCountEl = document.getElementById('participant-count');
const connectionStatusEl = document.getElementById('connection-status');
const body = document.body;
const logoutBtn = document.getElementById('logout-btn');

// Application state
let isLoggedIn = false;
let currentPassword = '';
let hostUrl = '';
let visitorUrl = '';

/**
 * Log party information to console
 * Displays URLs and password for easy sharing
 */
function logPartyInfo() {
  hostUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}/host.html`;
  visitorUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}/index.html`;
  
  console.log('🎉 PhoLight Party Started! 🎉');
  console.log('================================');
  console.log(`🔑 Host Password: ${currentPassword}`);
  console.log(`🖥️  Host URL: ${hostUrl}`);
  console.log(`📱 Visitor URL: ${visitorUrl}`);
  console.log('================================');
  console.log('Share the visitor URL with your audience!');
}

// WebSocket connection management
let ws;

/**
 * Establish WebSocket connection to server
 * Handles connection, reconnection, and error states
 */
function connectWebSocket() {
  ws = new WebSocket(`ws://${window.location.hostname}:3000`);

  ws.addEventListener('open', () => {
    console.log('Connected to PhoLight server');
    updateConnectionStatus('Connected');
    
    if (mode === 'host' && !isLoggedIn) {
      // Request password from server
      ws.send(JSON.stringify({ type: 'request-password' }));
    }
  });

  ws.addEventListener('close', () => {
    console.log('Disconnected from PhoLight server');
    updateConnectionStatus('Disconnected');
    
    // Try to reconnect after 3 seconds
    setTimeout(() => {
      if (!isLoggedIn) {
        connectWebSocket();
      }
    }, 3000);
  });

  ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    updateConnectionStatus('Error');
  });

  /**
   * Handle incoming WebSocket messages
   * Processes server responses and updates UI accordingly
   */
  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'password-response':
          currentPassword = data.password;
          logPartyInfo();
          break;
          
        case 'login-success':
          console.log('Login successful');
          isLoggedIn = true;
          hostControls.style.display = 'block';
          loginScreen.style.display = 'none';
          logoutBtn.style.display = 'block';
          
          // Generate QR code after successful login
          setTimeout(() => {
            drawQrCode();
          }, 100);
          break;
          
        case 'login-error':
          console.log('Login failed:', data.message);
          showLoginError(data.message || 'Invalid password');
          break;
          
        case 'logout-success':
          console.log('Logout successful, new password generated');
          currentPassword = data.newPassword;
          logPartyInfo();
          break;
          
        case 'participant-count':
          if (participantCountEl) {
            participantCountEl.textContent = data.count || 0;
          }
          break;
          
        case 'host-effect':
          console.log('Effect sent to clients:', data.effect, 'with color:', data.color);
          break;
          
        case 'server-message':
          console.log('Server message:', data.message);
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });
}

/**
 * Update connection status display
 * @param {string} status - Connection status (Connected, Disconnected, Error)
 */
function updateConnectionStatus(status) {
  if (connectionStatusEl) {
    connectionStatusEl.textContent = status;
    connectionStatusEl.className = `stat-number ${status.toLowerCase()}`;
  }
}

/**
 * Show login error message with animation
 * @param {string} message - Error message to display
 */
function showLoginError(message) {
  // Create or update error message
  let errorDiv = document.getElementById('login-error');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'login-error';
    errorDiv.style.cssText = `
      color: #ff4444;
      background: rgba(255, 68, 68, 0.1);
      border: 1px solid rgba(255, 68, 68, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin-top: 15px;
      text-align: center;
      animation: shake 0.5s ease-in-out;
    `;
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
    
    const loginForm = document.querySelector('.login-form');
    loginForm.appendChild(errorDiv);
  }
  
  errorDiv.textContent = message;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (errorDiv) {
      errorDiv.remove();
    }
  }, 5000);
}

/**
 * Generate QR code for audience connection
 * Creates QR code with visitor URL for easy sharing
 */
function drawQrCode() {
  if (!qrCodeEl) return;
  
  // Check if qrcode library is loaded
  if (typeof qrcode === 'undefined') {
    console.error('QRCode library not loaded');
    qrCodeEl.innerHTML = '<p style="color: #ff0080;">QR Code Library Not Loaded</p>';
    return;
  }
  
  const clientUrl = visitorUrl || `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}`;
  console.log('Generating QR code for:', clientUrl);
  
  try {
    const qr = qrcode(0, 'M');
    qr.addData(clientUrl);
    qr.make();
    
    // Create canvas element for QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 200;
    const cellSize = size / qr.getModuleCount();
    
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR code with pink color
    ctx.fillStyle = '#ff0080';
    for (let row = 0; row < qr.getModuleCount(); row++) {
      for (let col = 0; col < qr.getModuleCount(); col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Clear existing content and add canvas
    qrCodeEl.innerHTML = '';
    qrCodeEl.appendChild(canvas);
    console.log('QR Code generated successfully');
  } catch (err) {
    console.error('QR Code generation error:', err);
    qrCodeEl.innerHTML = '<p style="color: #ff0080;">QR Code Error</p>';
  }
}

/**
 * Load QRCode library dynamically
 * @returns {Promise} Promise that resolves when library is loaded
 */
function loadQRCodeLibrary() {
  return new Promise((resolve, reject) => {
    if (typeof qrcode !== 'undefined') {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    script.onload = () => {
      console.log('QRCode library loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load QRCode library');
      reject(new Error('QRCode library failed to load'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Logout functionality
 * Handles host logout and password regeneration
 */
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    hostControls.style.display = 'none';
    loginScreen.style.display = 'flex';
    logoutBtn.style.display = 'none';
    passwordInput.value = '';
    
    // Notify server of logout to generate new password
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'host-logout' }));
    }
  });
}

/**
 * Login functionality
 * Handles host authentication with password validation
 */
if (enterHostBtn && passwordInput) {
  enterHostBtn.addEventListener('click', () => {
    const password = passwordInput.value.trim();
    
    if (!password) {
      showLoginError('Please enter a password!');
      return;
    }
    
    // Send password to server for validation
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'host-login', 
        password: password 
      }));
    } else {
      showLoginError('Connection to server lost. Please refresh the page.');
    }
  });
  
  // Allow Enter key to submit login form
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      enterHostBtn.click();
    }
  });
}

/**
 * Send color functionality
 * Sends selected color to all connected audience devices
 */
if (sendColorBtn && colorPicker) {
  sendColorBtn.addEventListener('click', () => {
    const color = colorPicker.value;
    console.log('Sending color:', color);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'host-color', 
        color: color, 
        mode: 'static' 
      }));
    } else {
      console.log('WebSocket not connected, color not sent');
    }
  });
}

/**
 * Random color functionality
 * Generates random color and updates color picker
 */
if (randomColorBtn && colorPicker) {
  randomColorBtn.addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    colorPicker.value = randomColor;
    
    // Update color preview if it exists
    const colorPreview = document.getElementById('color-preview');
    if (colorPreview) {
      colorPreview.style.backgroundColor = randomColor;
    }
  });
}

/**
 * Effect buttons functionality
 * Handles effect button clicks and sends effects to audience
 */
document.addEventListener('click', (event) => {
  if (event.target.closest('.effect-btn')) {
    const effectBtn = event.target.closest('.effect-btn');
    const effect = effectBtn.dataset.effect;
    const selectedColor = colorPicker.value;
    console.log('Effect selected:', effect, 'with color:', selectedColor);
    
    // Send effect with color to server
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'host-effect', 
        effect: effect,
        color: selectedColor
      }));
    } else {
      console.log('WebSocket not connected, effect not sent');
    }
    
    // Visual feedback for button press
    effectBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      effectBtn.style.transform = '';
    }, 150);
  }
});

/**
 * Initialize color preview and QR code library
 * Sets up color picker preview and loads required libraries
 */
document.addEventListener('DOMContentLoaded', function() {
  const colorPreview = document.getElementById('color-preview');
  if (colorPreview && colorPicker) {
    colorPreview.style.backgroundColor = colorPicker.value;
    
    colorPicker.addEventListener('input', function() {
      colorPreview.style.backgroundColor = this.value;
    });
  }
  
  // Load QRCode library for QR code generation
  loadQRCodeLibrary().catch(error => {
    console.error('Failed to load QRCode library:', error);
  });
});

/**
 * Handle page visibility change
 * Reconnects WebSocket when page becomes visible again
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && mode === 'host') {
    // Reconnect if needed
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      connectWebSocket();
    }
  }
});

// Initialize WebSocket connection on page load
connectWebSocket();