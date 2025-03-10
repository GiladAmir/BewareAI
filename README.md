# BewereAI Project

<div align="center">

![BewereAI Logo](/Frontend/public/images/BewereAi_logo_128.png)

An AI-powered content analysis system with a Chrome extension for enhancing ChatGPT interactions.

</div>

## 📋 Project Overview

BewereAI is a comprehensive solution that helps users analyze and improve their ChatGPT prompts in real-time. The project consists of two main components:

1. **Chrome Extension (Frontend)**: A React-based extension that integrates with ChatGPT's interface
2. **Analysis Server (Backend)**: A FastAPI server that performs AI-powered content analysis

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+ (for the backend)
- Chrome browser (Latest version)

### Development Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd BewereAI
```

2. Install Frontend dependencies:
```bash
cd Frontend
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Run `npm run build`
   - Deploy `build` folder to your chrome extension

### Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the extension for production
- `npm test` - Runs the test suite
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:coverage` - Generates test coverage report

## 💡 Key Features

- Real-time prompt analysis before submission
- Comprehensive prompt violation detection
- Summary generation for analyzed content
- Seamless integration with ChatGPT's interface

## 🔧 Technical Details

### Built With

- React 18
- TypeScript
- Material-UI (MUI)
- Chrome Extension Manifest V3

### Dependencies

#### Core Dependencies
- React & React DOM (^18.2.0)
- Material-UI (@mui/material ^6.4.7)
- TypeScript (^4.9.5)

#### Development Dependencies
- Craco (^7.1.0)
- Jest & Testing Library
- TypeScript types for Chrome and React

## 🧪 Testing

The project includes a comprehensive test suite using Jest and React Testing Library. Tests cover:

- Content script functionality
- Component rendering
- Event handling
- API integration

Run tests using:
```bash
npm test
```

## 🔐 Permissions

The extension requires the following permissions:
- `activeTab` - For interacting with the current tab
- `scripting` - For injecting content scripts

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
