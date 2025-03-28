import { Terminal } from 'lucide-react';

interface WelcomeScreenProps {
  onCustomSetup: () => void;
}

export function WelcomeScreen({ onCustomSetup }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
      
      <div className="relative z-10 text-center">
        <Terminal className="w-20 h-20 text-blue-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-8 animate-float">
          Welcome to DQN SQL Land
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Master SQL through interactive challenges and real-world scenarios
        </p>
        <div className="space-y-4">
          <button
            onClick={onCustomSetup}
            className="w-full px-8 py-4 bg-blue-500 text-white rounded-lg text-xl font-semibold
                     hover:bg-blue-600 transition-colors duration-200 shadow-lg
                     hover:shadow-blue-500/25"
          >
            Set Up Game
          </button>
        </div>
      </div>
    </div>
  );
}