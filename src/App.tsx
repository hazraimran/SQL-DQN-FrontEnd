import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { MainUI } from './components/MainUI';
import { SetupModal } from './components/SetupModal';
import { Queries } from './utils/constants';
import { getGeneratedQuery } from './utils/llmService';

type GameState = 'loading' | 'welcome' | 'main';

function App() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [systemOutput, setSystemOutput] = useState('');
  const [theme, setTheme] = useState('cyberpunk' as 'cyberpunk' | 'fantasy' | 'real-world');
  const [concepts, setConcepts] = useState<string[]>([]);
  const [actionNumber, setActionNumber] = useState(0);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setGameState('welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle setup form completion
  // since we used a fetch request to the server,
  // we've already passed theme and concepts to the backend
  // and received the action number in response.
  const handleSetupComplete = async ({ theme: chosenTheme, concepts, action }: { theme: 'cyberpunk' | 'fantasy' | 'real-world'; concepts: string[]; action: string }) => {
    setTheme(chosenTheme);
    setConcepts(concepts);

    const actionNumber = parseInt(action, 10);
    setActionNumber(actionNumber);

    const narrative = await getGeneratedQuery(
      chosenTheme,
      (Queries[chosenTheme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].concept,
      (Queries[chosenTheme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].input,
      (Queries[chosenTheme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].expected
    );
    setSystemOutput(`Task ${actionNumber+1}: ${narrative}`);
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

      {gameState === 'main' && theme && (
        <MainUI
          initialOutput={systemOutput}
          initialSchemas={Queries[theme][actionNumber].input}
          theme={theme}
          concepts={concepts}
          actionNumber={actionNumber}
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