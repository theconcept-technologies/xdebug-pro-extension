# xDebug Helper Pro

<div align="center">
  <img src="public/icon.png" alt="xDebug Helper Pro" width="128" height="128" style="margin-right: 16px">
  <h1>xDebug Helper Pro</h1>
</div>

A modern Chrome extension for managing Xdebug sessions with IDE profiles and per-domain state. This extension helps PHP developers quickly enable or disable Xdebug debugging sessions directly from their browser, with support for multiple IDEs and custom configurations.

## Features

- 🔄 Enable/disable Xdebug sessions with a single click
- 🛠️ Support for multiple IDE profiles:
  - PHPStorm
  - VS Code
  - Custom profiles with custom session keys
- 🌐 Per-domain state management
- 🔐 Secure implementation with strict CSP
- 🎨 Modern, user-friendly interface
- 🔒 Privacy-focused: no data collection, works offline

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Chrome browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xdebug-helper-pro.git
cd xdebug-helper-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Testing Locally

1. Build the extension:
```bash
npm run build
```

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory
   - The extension icon should appear in your toolbar

### Building for Production

To create a production build and package the extension:

```bash
npm run build:prod
```

This will:
1. Clean the `dist` directory
2. Build the extension for production
3. Create a `xdebug-helper-pro.zip` file ready for Chrome Web Store submission

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/yourusername/xdebug-helper-pro/releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extracted directory

## Development

This project uses:
- TypeScript for type safety
- Vite for building
- ESLint and Prettier for code quality
- Modern JavaScript features
- Strict CSP for security

Available commands:
- `npm run dev` - Start development server
- `npm run build` - Build the extension
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
xdebug-helper-pro/
├── src/                # Source files
│   ├── background.ts   # Service worker
│   ├── popup.ts        # Popup script
│   ├── popup.html      # Popup HTML
│   ├── types.ts        # TypeScript types
│   └── utils/          # Utility functions
├── public/             # Static assets
│   └── icon.png        # Extension icon
├── dist/               # Build output (not in repo)
└── ...config files
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests
- Updates documentation as needed
- Has a clear description of changes

## Usage

1. Click the xDebug Helper Pro icon in your Chrome toolbar
2. Select your preferred IDE profile (PHPStorm, VS Code, or custom)
3. Toggle Xdebug sessions for each domain
4. For custom profiles, enter your desired Xdebug session key
5. The extension will maintain your preferences per domain

## Security

This extension implements:
- Strict Content Security Policy (CSP)
- Input validation and sanitization
- Secure cookie handling
- No external dependencies or tracking
- Regular security updates

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- [Xdebug](https://xdebug.org/) - The powerful PHP debugging tool
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/) - For development guidelines
- All contributors who help improve this project 