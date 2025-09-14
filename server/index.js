/**
 * PhoLight Server
 * WebSocket server for real-time communication between host and audience devices
 * Handles password management, participant counting, and message routing
 */

const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Server configuration
const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Start HTTP server
const server = app.listen(PORT, HOST, () => {
  console.log(`PhoLight server running at http://${HOST}:${PORT}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Client management
const clients = [];
let participantCount = 0;

// Password management system
let currentPassword = '';
let passwordExpiry = null;
const PASSWORD_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate a secure, human-readable password
 * Uses adjective + noun + 3-digit number format for easy sharing
 * @returns {string} Generated password
 */
function generateSecurePassword() {
  const adjectives = ['Happy', 'Bright', 'Cool', 'Wild', 'Fun', 'Epic', 'Amazing', 'Awesome', 'Super', 'Magic'];
  const nouns = ['Party', 'Light', 'Show', 'Night', 'Dance', 'Beat', 'Wave', 'Glow', 'Spark', 'Flash'];
  const numbers = Math.floor(Math.random() * 900) + 100; // 100-999
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective}${noun}${numbers}`;
}

/**
 * Initialize password on server start
 * Sets password and expiry time
 */
function initializePassword() {
  currentPassword = generateSecurePassword();
  passwordExpiry = Date.now() + PASSWORD_DURATION;
  console.log('🔑 Generated new host password:', currentPassword);
  console.log('⏰ Password expires at:', new Date(passwordExpiry).toLocaleString());
}

/**
 * Validate password against current password
 * Checks if password matches and hasn't expired
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validatePassword(password) {
  if (!password || password !== currentPassword) {
    return false;
  }
  
  // Check if password has expired
  if (Date.now() > passwordExpiry) {
    console.log('🔑 Password expired, generating new one');
    initializePassword();
    return false;
  }
  
  return true;
}

/**
 * Generate new password (for logout/refresh)
 * @returns {string} New password
 */
function generateNewPassword() {
  initializePassword();
  return currentPassword;
}

// Initialize password on server start
initializePassword();

/**
 * Handle new WebSocket connections
 * Manages client connections, authentication, and message routing
 */
wss.on('connection', (ws) => {
  ws.isHost = false; // Default to audience client
  clients.push(ws);
  console.log('Client connected, total:', clients.length);
  
  // Send updated participant count to all clients
  broadcastParticipantCount();

  /**
   * Handle incoming WebSocket messages
   * Routes different message types to appropriate handlers
   */
  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch (e) { return; }

    // Handle host login with password validation
    if (data.type === 'host-login') {
      const password = data.password;
      console.log('Login attempt with password:', password ? '***' : 'empty');
      
      if (validatePassword(password)) {
        ws.isHost = true;
        ws.send(JSON.stringify({ 
          type: 'login-success',
          message: 'Login successful'
        }));
        console.log('✅ Host login successful');
      } else {
        ws.send(JSON.stringify({ 
          type: 'login-error',
          message: 'Invalid or expired password'
        }));
        console.log('❌ Host login failed - invalid password');
      }
      return;
    }

    // Handle password request from clients
    if (data.type === 'request-password') {
      ws.send(JSON.stringify({ 
        type: 'password-response',
        password: currentPassword
      }));
      console.log('🔑 Password sent to client');
      return;
    }

    // Handle host logout
    if (data.type === 'host-logout') {
      if (ws.isHost) {
        ws.isHost = false;
        const newPassword = generateNewPassword();
        ws.send(JSON.stringify({ 
          type: 'logout-success',
          newPassword: newPassword
        }));
        console.log('🚪 Host logged out, new password generated:', newPassword);
      }
      return;
    }

    // Legacy host identification (for backward compatibility)
    if (data.type === 'set-host') {
      ws.isHost = true;
      console.log('A host is set');
      return;
    }

    // Host sends color → forward to all audience clients (not host)
    if (data.type === 'host-color' && data.color) {
      const modeKey = data.mode || 'static'; // Default to static mode
      console.log('Executed Sent button', data.color, 'mode:', modeKey);

      clients.forEach(c => {
        if (!c.isHost && c.readyState === ws.OPEN) {
          c.send(JSON.stringify({ type: 'host-color', color: data.color, mode: modeKey }));
          console.log('Sent color to client:', data.color, 'mode:', modeKey);
        }
      });
    }

    // Host sends effect → forward to all audience clients (not host)
    if (data.type === 'host-effect' && data.effect && data.color) {
      console.log('Host effect:', data.effect, 'with color:', data.color);

      clients.forEach(c => {
        if (!c.isHost && c.readyState === ws.OPEN) {
          c.send(JSON.stringify({ 
            type: 'host-effect', 
            effect: data.effect, 
            color: data.color 
          }));
          console.log('Sent effect to client:', data.effect, 'color:', data.color);
        }
      });
    }
  });

  /**
   * Handle client disconnection
   * Removes client from list and updates participant count
   */
  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index !== -1) clients.splice(index, 1);
    console.log('Client disconnected, total:', clients.length);
    
    // Send updated participant count to all clients
    broadcastParticipantCount();
  });
});

/**
 * Broadcast participant count to all connected clients
 * Only counts audience clients (excludes host) as participants
 */
function broadcastParticipantCount() {
  // Count only non-host clients as participants
  const nonHostClients = clients.filter(client => !client.isHost);
  const message = JSON.stringify({
    type: 'participant-count',
    count: nonHostClients.length
  });
  
  clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

