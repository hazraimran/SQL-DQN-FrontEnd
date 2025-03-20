import React, { useState, useEffect } from 'react';
import { Loader2, Terminal, Database, Trophy, Upload } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SetupModal } from './components/SetupModal';
import { MainUI } from './components/MainUI';
import { easyQueries } from './constants';

type GameState = 'loading' | 'welcome' | 'main';

// Mock initial data
const mockSystemOutput = `Welcome to SQL Adventure!
Current Challenge: Query the users table to find all users who made a purchase.
Available Tables: users, orders
Type your first query to begin...`;

const mockSchemas = [
  { 
    name: 'users', 
    columns: ['id', 'name', 'email', 'created_at']
  },
  { 
    name: 'orders', 
    columns: ['id', 'user_id', 'total', 'status', 'order_date']
  }
];

function App() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [systemOutput, setSystemOutput] = useState('');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setGameState('welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSetupComplete = (output: string) => {
    const action = parseInt(output, 10) as keyof typeof easyQueries;
    const narrative = easyQueries[action]?.storyNarrative;
    setSystemOutput(`Task ${action}: ${narrative}`);
    setIsSetupModalOpen(false);
    setGameState('main');
  };

  const handleQuickStart = () => {
    setSystemOutput(mockSystemOutput);
    setGameState('main');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {gameState === 'loading' && <LoadingScreen />}
      
      {gameState === 'welcome' && (
        <WelcomeScreen 
          onStart={handleQuickStart}
          onCustomSetup={() => setIsSetupModalOpen(true)} 
        />
      )}
      
      {gameState === 'main' && (
        <MainUI 
          initialOutput={systemOutput}
          initialSchemas={mockSchemas}
        />
      )}

      <SetupModal 
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onComplete={handleSetupComplete}
      />
    </div>
  );
}

export default App;