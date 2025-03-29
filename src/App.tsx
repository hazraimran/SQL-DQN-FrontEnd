import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { MainUI } from './components/MainUI';
import { SetupModal } from './components/SetupModal';
import { queries } from './utils/constants';
import { getGeneratedQuery } from './utils/llmService';

type GameState = 'loading' | 'welcome' | 'main';

const mockSchemas = [
  {
    name: 'users',
    columns: ['id', 'name', 'email', 'created_at'],
  },
  {
    name: 'orders',
    columns: ['id', 'user_id', 'total', 'status', 'order_date'],
  },
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

  // Handle setup form completion
  // since we used a fetch request to the server,
  // we've already passed theme and concepts to the server
  const handleSetupComplete = async ({ theme, action }: { theme: keyof typeof queries; action: string }) => {
    const actionNumber = parseInt(action, 10);
    const narrative = await getGeneratedQuery(
      theme,
      (queries[theme] as Record<number, typeof queries[keyof typeof queries][number]>)[actionNumber].branchName,
      (queries[theme] as Record<number, typeof queries[keyof typeof queries][number]>)[actionNumber].tables,
      (queries[theme] as Record<number, typeof queries[keyof typeof queries][number]>)[actionNumber].expected
    );
    setSystemOutput(`Task ${actionNumber}: ${narrative}`);
    setIsSetupModalOpen(false);
    setGameState('main');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {gameState === 'loading' && <LoadingScreen />}

      {gameState === 'welcome' && (
        <WelcomeScreen
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