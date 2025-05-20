# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server on port 8000
npm run start

# Build for production
npm run build

# Format code
npm run format

# Check license compliance
npm run test:license
npm run license:fix
```

### Testing
```bash
# Run unit tests
npm run test:unit

# Run Cypress component tests
npm run cy:open
npx cypress open --component

# Run Cypress E2E tests
npx cypress open --e2e

# Run all tests
npm run test:audit     # Audit dependencies for security issues
npm run test:lint      # Run ESLint
npm run test:types     # Run TypeScript type checking
npm run test:format    # Check formatting
```

### Docker
```bash
# Run client in Docker
docker compose up client

# Run Cypress tests in Docker
docker compose build
docker compose up cypress
```

## Architecture

ABE-Client is a React application for AI-enhanced educational document editing and activity management. It allows users to work with documents and provides AI-based feedback and activities.

### Core Components

1. **Authentication & User Management**
   - Uses Google OAuth for authentication
   - User roles and classroom code management
   - Redux state management for login status

2. **Document Services**
   - Support for multiple document services via DocService enum
   - Google Docs integration
   - Microsoft Word integration
   - Raw text document support (in development)
   - Document versioning and timeline tracking
   - Document Service type is stored in local storage upon login. 

3. **AI Services**
   - Multiple AI service providers (OpenAI, Azure OpenAI, Gemini)
   - Prompt templating and execution
   - Async AI job handling
   - AI model configuration

4. **Activity Builder**
   - Custom educational activities with step configuration
   - Multiple step types (prompts, user input, system messages)
   - Conditional logic for activity flow
   - Built activity handler for execution

5. **UI Components**
   - Admin view for creating and managing activities
   - User view for interacting with documents and activities
   - Document timeline for viewing document history
   - Chat interface for AI interactions

### State Management

- Uses Redux for global state
- Key slices:
  - login: Authentication state
  - chat: Chat interactions state
  - state: Application state
  - config: Configuration state
  - docGoalsActivities: Document goals and activities state

### API Communication

- GraphQL API endpoint for most operations
- REST endpoints for some document operations
- Async job handling for AI requests
- WebSocket is not used; polling is used for async operations

### Current Development

- The current branch `raw-text-support` is implementing support for working with raw text documents instead of only Google Docs
- Recent commits show renaming of GoogleDoc to UserDoc to make the system more generic