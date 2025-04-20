# SQL-DQN Frontend
A gamified SQL learning platform that helps users master database concepts through interactive challenges in themed environments.

[![SQL DQN main page]](https://example.com)

## Overview
SQL DQN (Deep Query Network) is an interactive educational platform designed to make learning SQL engaging and effective. Users progress through themed challenges while the system adapts to their skill level, presenting appropriate concepts based on mastery.

### Key Features
- **Thematic Learning Environments**: Choose between Cyberpunk, Fantasy, or Real-World themes
- **Progressive Learning Path**: System adapts to your mastery level
- **Interactive Challenges**: Solve SQL puzzles with immediate feedback
- **Narrative-Driven Experience**: Learn through engaging storylines
- **Visual Progress Tracking**: Monitor your mastery of different SQL concepts

## Getting Started

### Installation
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```bash
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

3. Start the server:
```bash
npm run start
```

4. Open your browser and navigate to `http://localhost:5173`

> **Backend Setup**: 
    The application requires a backend server running at `http://localhost:3000`. Make sure to set up the companion backend service following its own README instructions.

### Usage
1. **Start Game**: Click "Set Up Game" on the welcome screen
2. **Select Theme**: Choose between Cyberpunk, Fantasy or Real-World settings
3. **Select Concepts**: Pick SQL concepts you want to practice
4. **Complete Challenges**: Write SQL queries to solve the presented challenges
4. **Enjoy your journey!**

## SQL Concepts Covered
- Basic SELECT and FROM
- Basic WHERE clause
- Pattern matching with LIKE
- Handling NULL values
- ORDER BY clause
- INSERT Statement
- UPDATE Statement
- DELETE Statement
- Basic GROUP BY and HAVING
- Basic JOIN usage (INNER JOIN)

## Project Architecture
### Technology Stack
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Markdown Rendering: React-Markdown with remark-gfm
- Icons: Lucide React
- API Communication: Fetch API

### Project Structure
```bash
sql-dqn-frontend/
├── .env                            # Environment variables
├── .gitignore                      # Git ignore file
├── index.html                      # HTML entry point
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root application component
│   ├── index.css                   # Static assets
|   ├── types.ts                    # TypeScript type definitions
│   ├── components/                 # React components
│   │   ├── FeedbackAnimations.tsx  # Success/error animations
│   │   ├── HistoryPopup.tsx        # Query history popup
│   │   ├── LoadingScreen.tsx       # Initial loading screen
│   │   ├── MainUI.tsx              # Main user interface
│   │   ├── MasteryProgress.tsx     # Mastery level visualization
│   │   ├── OutputDisplay.tsx       # Query output display
│   │   ├── QueryInputForm.tsx      # SQL input form
│   │   ├── SchemaDisplay.tsx       # Database schema display
│   │   ├── SetupModal.tsx          # Game setup modal
│   │   ├── TaskList.tsx            # List of completed tasks
│   │   └── WelcomeScreen.tsx       # Welcome screen
│   ├── hooks/                      # Custom React hooks
│   │   └── useTypewriter.ts        # Typewriter animation hook
│   ├── styles/                     # Global styles
│   │   ├── animations.ts           # Animation styles
│   └── utils/                      # Utility functions
│       ├── constants.ts            # Game constants and data
│       ├── formatters.ts           # Output formatting utilities  
│       ├── llmService.ts           # LLM integration service
│       └── queryHelpers.ts         # SQL query generation helpers
```

## How It Works
1. The application presents themed SQL challenges based on selected concepts
2. Users write SQL queries to solve presented challenges
3. Queries are sent to the backend for validation
4. The system provides immediate feedback on correctness
5. User mastery levels are adjusted based on performance
6. The system adapts by selecting appropriate next challenges