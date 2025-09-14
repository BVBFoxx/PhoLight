# 🤝 Contributing to PhoLight

Thank you for your interest in contributing to PhoLight! This document provides guidelines and information for contributors.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#-contributing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Reporting](#-issue-reporting)
- [Feature Requests](#-feature-requests)
- [Code Style](#-code-style)
- [Testing](#-testing)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct:

- **Be respectful** and inclusive
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and different skill levels
- **Be collaborative** and help others learn
- **Be professional** in all interactions

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project maintainers.

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18+ installed
- **Git** for version control
- **Modern web browser** for testing
- **Code editor** (VS Code recommended)
- **Basic understanding** of JavaScript, HTML, CSS

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/BVBFoxx/pholight.git
   cd pholight
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/BVBFoxx/pholight.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm start
   ```

---

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

#### 🐛 **Bug Fixes**
- Fix existing issues
- Improve error handling
- Resolve compatibility problems

#### ✨ **New Features**
- Add new light effects
- Improve user interface
- Add new functionality

#### 📚 **Documentation**
- Improve README
- Add code comments
- Create tutorials

#### 🎨 **Design & UI**
- Improve visual design
- Add animations
- Enhance user experience

#### 🔧 **Code Quality**
- Refactor code
- Improve performance
- Add tests

### Before You Start

1. **Check existing issues** - Avoid duplicate work
2. **Discuss major changes** - Open an issue first
3. **Read the codebase** - Understand the architecture
4. **Test thoroughly** - Ensure your changes work

---

## 🔄 Pull Request Process

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add comments where necessary
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the GitHub PR template
   - Provide clear description
   - Link related issues

### PR Requirements

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** for UI changes
- **Testing instructions** for reviewers
- **No breaking changes** without discussion

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on different devices/browsers
4. **Approval** from at least one maintainer
5. **Merge** after approval

---

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** - Check if already reported
2. **Check documentation** - Ensure it's not user error
3. **Test latest version** - Verify issue still exists

### Creating a Good Issue

Use the issue template and include:

- **Clear title** describing the problem
- **Detailed description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, device)
- **Screenshots** if applicable
- **Error messages** if any

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

---

## 💡 Feature Requests

### Suggesting Features

1. **Check existing issues** - Avoid duplicates
2. **Use feature request template**
3. **Provide clear use case**
4. **Explain the benefit**
5. **Consider implementation complexity**

### Feature Request Template

```markdown
## Feature Request

**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context about the feature request.
```

---

## 🎨 Code Style

### JavaScript

- **Use ES6+ features** when appropriate
- **Consistent indentation** (2 spaces)
- **Meaningful variable names**
- **Comment complex logic**
- **Use const/let** instead of var

```javascript
// Good
const lightEffects = {
  rainbow: (color) => {
    // Implementation
  }
};

// Bad
var lightEffects = {
  rainbow: function(color) {
    // Implementation
  }
};
```

### HTML

- **Semantic HTML** elements
- **Consistent indentation** (2 spaces)
- **Accessible markup**
- **Clean structure**

```html
<!-- Good -->
<button class="effect-btn" data-effect="rainbow">
  <span class="effect-icon">🌈</span>
  <span class="effect-name">Rainbow</span>
</button>

<!-- Bad -->
<button onclick="doRainbow()">Rainbow</button>
```

### CSS

- **BEM methodology** for class names
- **Consistent spacing** and formatting
- **Mobile-first** responsive design
- **Use CSS variables** for colors

```css
/* Good */
.effect-btn {
  padding: 15px 20px;
  border-radius: 10px;
  background: var(--primary-color);
}

.effect-btn:hover {
  transform: translateY(-2px);
}

/* Bad */
.btn {
  padding: 15px 20px;
  border-radius: 10px;
  background: #ff0080;
}
```

---

## 🧪 Testing

### Testing Your Changes

1. **Manual testing** on different devices
2. **Cross-browser testing** (Chrome, Safari, Firefox)
3. **Mobile testing** (iOS, Android)
4. **Network testing** (different WiFi conditions)
5. **Performance testing** (multiple clients)

### Test Checklist

- [ ] **Host interface** works correctly
- [ ] **Audience connection** works
- [ ] **All effects** function properly
- [ ] **QR code** generates correctly
- [ ] **Mobile experience** is smooth
- [ ] **No console errors**
- [ ] **Responsive design** works
- [ ] **PWA features** work

### Testing Commands

```bash
# Start server
npm start

# Test on different devices
# Use your local IP address
# http://YOUR_IP:3000
```

---

## 📁 Project Structure

Understanding the codebase:

```
pholight/
├── client/                 # Frontend
│   ├── host.html          # Host interface
│   ├── audience.html      # Audience landing
│   ├── index.html         # Main experience
│   ├── app.js            # Client logic
│   ├── host.js           # Host logic
│   └── *.css             # Styling
├── server/                # Backend
│   └── index.js          # WebSocket server
├── package.json          # Dependencies
├── README.md            # Documentation
└── CONTRIBUTING.md      # This file
```

### Key Files

- **`server/index.js`** - WebSocket server, password management
- **`client/app.js`** - Client-side effects and WebSocket handling
- **`client/host.js`** - Host interface logic
- **`client/host.html`** - Host control interface
- **`client/index.html`** - Main audience experience

---

## 🎯 Areas for Contribution

### High Priority

- **New light effects** - Creative and engaging effects
- **Performance optimization** - Better performance with many clients
- **Mobile improvements** - Better mobile experience
- **Accessibility** - Better accessibility features

### Medium Priority

- **UI/UX improvements** - Better user interface
- **Documentation** - Better documentation and tutorials
- **Testing** - Automated testing setup
- **Error handling** - Better error messages and recovery

### Low Priority

- **Code refactoring** - Clean up existing code
- **Styling improvements** - Visual enhancements
- **Minor bug fixes** - Small issues and improvements

---

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Comments** - Code review discussions

### Questions?

- **Read the documentation** first
- **Search existing issues** for similar problems
- **Ask specific questions** with clear context
- **Be patient** - maintainers are volunteers

---

## 🙏 Recognition

### Contributors

All contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

### Types of Recognition

- **Code contributions** - Bug fixes, features, improvements
- **Documentation** - README, tutorials, guides
- **Design** - UI/UX improvements, graphics
- **Community** - Helping others, answering questions

---

## 📄 License

By contributing to PhoLight, you agree that your contributions will be licensed under the same **MIT License** - [LICENSE](LICENSE) that covers the project.

---

<div align="center">
  <h3>🎉 Thank you for contributing to PhoLight! 🎉</h3>
  <p>Together, we can create amazing party experiences!</p>
</div>
