# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TransferFiles is a Next.js 14 web application for secure peer-to-peer file transfers using WebRTC. It enables direct file sharing between devices without installation, using PeerJS for WebRTC connectivity and QR codes for easy device pairing.

## Common Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Installation
- `npm install` - Install all dependencies

### Deployment
- `./scripts/deploy.sh` - Automated Vercel deployment setup with GitHub Actions
- Manual deployment: `npm run build` then deploy to Vercel

## Architecture

### Core Technologies
- **Next.js 14** with TypeScript and App Router
- **WebRTC** via PeerJS for peer-to-peer connections  
- **QRCode.js** for connection sharing
- Client-side only architecture with no backend API

### Key Components Structure

#### Main Application Flow
1. **FileTransfer** (`src/components/FileTransfer.tsx`) - Root component managing connection state
2. **ConnectionPanel** (`src/components/ConnectionPanel.tsx`) - Handles initial device pairing
3. **TransferPage** (`src/components/TransferPage.tsx`) - File transfer interface after connection

#### WebRTC Connection Management
- **usePeerConnection** (`src/hooks/usePeerConnection.ts`) - Main WebRTC hook with auto-reconnection
- Uses multiple STUN servers for NAT traversal
- Implements exponential backoff reconnection strategy
- Handles connection timeouts and error states

#### Data Flow
- File transfers use binary data over WebRTC data channels
- Text messages supported alongside file transfers
- Received files converted to blob URLs for download
- Memory management with URL cleanup on component unmount

### External Dependencies
- PeerJS library loaded via CDN in layout.tsx:48
- QRCode library loaded via CDN in layout.tsx:49
- Google Analytics integration (optional via NEXT_PUBLIC_GA_ID)

### File Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - React components for UI
- `/src/hooks/` - Custom React hooks (WebRTC connection logic)
- `/src/utils/` - Helper functions (file formatting, notifications)
- `/src/types/` - TypeScript type definitions
- `/src/data/blogs/` - Markdown blog content

### Build Configuration
- TypeScript with strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Custom type definitions in `src/types/`
- Standard Next.js configuration with React strict mode

### Environment Variables
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID (optional)

## Development Notes

### WebRTC Connection Flow
1. Component initializes PeerJS with auto-generated ID
2. First device shares ID/QR code for second device to connect
3. Direct P2P connection established using STUN servers
4. File/text data transmitted over encrypted WebRTC channels

### Key Patterns
- All WebRTC logic centralized in `usePeerConnection` hook
- Component state managed through React hooks
- File handling uses browser Blob/URL APIs
- Error handling with user-friendly status messages

## Deployment

### Vercel Configuration
- **vercel.json** - Vercel deployment configuration
- Framework set to Next.js with environment variables
- No API routes or serverless functions (client-side only)

### GitHub Actions
- **`.github/workflows/deploy.yml`** - Automated deployment workflow
- Triggers on push to main branch and pull requests  
- Builds project and deploys to Vercel
- Preview deployments for PRs, production for main branch

### Required GitHub Secrets
- `VERCEL_TOKEN` - Vercel API token for deployment
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID  
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

### Deployment Setup
1. Run `./scripts/deploy.sh` for guided setup
2. Script handles GitHub repo creation, Vercel linking, and secrets configuration
3. Push to main branch triggers automatic deployment