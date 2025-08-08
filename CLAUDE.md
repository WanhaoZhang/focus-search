# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Focus Search is a Chrome extension that provides quick search functionality for Chinese platforms (知乎, 小红书, 百度). The extension features a clean popup interface with search history management.

## Development Setup

This is a Chrome extension project using Manifest V3. No build tools required - the extension can be loaded directly into Chrome for development.

### Loading the Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

## Architecture

### Core Files
- `manifest.json`: Extension configuration and permissions
- `popup.html`: Main UI interface with search form and history display
- `popup.css`: Styling for the popup interface with gradient themes
- `popup.js`: Main logic for search functionality and storage management

### Key Features
- **Search Integration**: Direct URL construction for 知乎, 小红书, and 百度
- **Local Storage**: Uses `chrome.storage.local` API for persistent search history
- **History Management**: Displays, filters, and allows deletion of individual or all records
- **URL Encoding**: Proper encoding of search keywords for safe URL construction

### Storage Schema
Search records stored as:
```javascript
{
  keyword: string,
  site: string,
  siteName: string,
  timestamp: number,
  id: string
}
```