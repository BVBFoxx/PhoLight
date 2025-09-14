# 🌈 PhoLight - Interactive Party Light Experience

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/WebSocket-Real--time-blue.svg" alt="WebSocket">
  <img src="https://img.shields.io/badge/PWA-Ready-purple.svg" alt="PWA Ready">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</div>

<br>

<div align="center">
  <h3>🎉 Transform any smartphone into a synchronized party light! 🎉</h3>
  <p>Create amazing light shows with your friends using just their phones and a simple web interface.</p>
</div>

---

## ✨ Features

### 🎨 **Dynamic Color Control**
- **Real-time color picker** with live preview
- **Instant synchronization** across all connected devices
- **Static color mode** for consistent lighting

### 🌈 **Spectacular Effects** (0.5s duration)
- **🌈 Rainbow** - Random colors flashing on all devices
- **💓 Pulse** - Selected color with smooth fade in/out
- **⚡ Strobe** - Intense strobing effect with selected color
- **🌊 Wave** - Color wave moving left to right across screen
- **🕺 Disco** - Random devices light up with selected color (50% chance)
- **🔥 Fire** - Flickering fire effect that starts dark and brightens

### 📱 **Cross-Platform Support**
- **iOS & Android** compatible
- **PWA Ready** - Add to home screen for app-like experience
- **Responsive design** works on all screen sizes
- **QR Code** for easy connection

### 🔒 **Secure & Reliable**
- **Server-side password generation** with 24-hour expiration
- **Real-time participant counting**
- **WebSocket communication** for instant updates
- **Automatic reconnection** handling

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **Modern web browser** (Chrome, Safari, Firefox, Edge)
- **WiFi network** for device synchronization

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BVBFoxx/pholight.git
   cd pholight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Host: `http://localhost:3000/host.html`
   - Audience: `http://localhost:3000/audience.html`

### 🎯 **How to Use**

#### For Hosts:
1. **Open the host interface** (`/host.html`)
2. **Enter the password** (displayed in server terminal)
3. **Choose a color** using the color picker
4. **Send static color** or **select an effect**
5. **Share the QR code** with your audience

#### For Audience:
1. **Scan the QR code** or visit the audience URL
2. **Add to home screen** for best experience (iOS/Android)
3. **Go fullscreen** for immersive party experience
4. **Enjoy the synchronized light show!**

---

## 🏗️ Architecture

### **Client-Side** (`/client/`)
- **`host.html`** - Host control interface
- **`audience.html`** - Audience connection page
- **`index.html`** - Main audience experience
- **`app.js`** - Client-side logic and effects
- **`host.js`** - Host-side logic and controls

### **Server-Side** (`/server/`)
- **`index.js`** - WebSocket server and password management
- **Real-time communication** between host and clients
- **Participant counting** and connection management

### **Styling** (`/client/`)
- **Modern CSS** with gradient animations
- **Responsive design** for all devices
- **Dark theme** optimized for party environments

---

## 🎨 Customization

### **Adding New Effects**
1. **Edit** `client/app.js` in the `lightEffects` object
2. **Add your effect** with 0.5s duration:
   ```javascript
   yourEffect: (color) => {
     stopAllAnimations();
     const startTime = Date.now();
     const duration = 500;
     // Your effect logic here
   }
   ```
3. **Add button** in `client/host.html`
4. **Test** your new effect!

### **Styling Changes**
- **Colors**: Edit CSS variables in `client/host-style.css`
- **Animations**: Modify keyframes and transitions
- **Layout**: Adjust responsive breakpoints

---

## 🔧 Development

### **Running in Development**
```bash
# Start with auto-restart
npm run dev

# Or manually restart server
npm start
```

### **Project Structure**
```
pholight/
├── client/                 # Frontend files
│   ├── host.html          # Host interface
│   ├── audience.html      # Audience landing page
│   ├── index.html         # Main audience experience
│   ├── app.js            # Client-side logic
│   ├── host.js           # Host-side logic
│   └── *.css             # Styling files
├── server/                # Backend files
│   └── index.js          # WebSocket server
├── package.json          # Dependencies
└── README.md            # This file
```

---

## 🌐 Network Setup

### **Local Network**
- **Same WiFi** - All devices must be on the same network
- **Firewall** - Ensure port 3000 is not blocked
- **Router** - Some routers may block WebSocket connections

---

## 📱 Mobile Optimization

### **iOS Devices**
- **Safari** - Best compatibility
- **PWA** - Add to home screen for fullscreen experience
- **Fullscreen** - Automatic fullscreen in web app mode

### **Android Devices**
- **Chrome** - Recommended browser
- **PWA** - Install as app for better performance
- **Fullscreen** - Manual fullscreen button available

---

## 🐛 Troubleshooting

### **Common Issues**

**❌ Can't connect to server**
- Check if server is running on port 3000
- Verify all devices are on same WiFi network
- Check firewall settings

**❌ Effects not working**
- Ensure WebSocket connection is established
- Check browser console for errors
- Try refreshing the page

**❌ QR Code not generating**
- Verify QR code library is loaded
- Check browser compatibility
- Try manual URL entry

**❌ Mobile fullscreen issues**
- Add to home screen (PWA mode)
- Use landscape orientation
- Check browser fullscreen permissions

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Quick Contribution**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **QR Code Generation** - qrcode-generator library
- **WebSocket Communication** - Node.js ws library
- **PWA Support** - Modern web standards
- **Community** - All contributors and users

---

<div align="center">
  <h3>🎉 Ready to light up your party? 🎉</h3>
  <p>Star ⭐ this repo if you love PhoLight!</p>
  
  <br>
  
  <p><strong>Made with ❤️ for amazing party experiences</strong></p>
</div>
