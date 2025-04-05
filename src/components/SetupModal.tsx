import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { AllConcepts, ThemeType } from '../utils/constants';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (payload: {
    theme: ThemeType;
    concepts: string[];
    action: string;
  }) => void;
}

export function SetupModal({ isOpen, onClose, onComplete }: SetupModalProps) {
  const [theme, setTheme] = useState<ThemeType>('cyberpunk' as ThemeType);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [concepts, setConcepts] = useState<string[]>([]);

  function toggleConcept(concept: string) {
    setConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/setup-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptsLength: concepts.length }),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      // sort concepts based on the order of the allConcepts array
      const sortedConcepts = AllConcepts.filter((concept) => concepts.includes(concept));

      // Pass theme, concepts and action to the parent
      onComplete({ theme, concepts: sortedConcepts, action: data.action });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        // CSV format: masteryOfConcept1,masteryOfConcept2,...masteryOfConceptN
        // e.g. 0.8,0.6,0.4,0.9,0.7,0.5
        // pass the mastery levels or concepts to the server if needed
        const lines = csv.split(',').map((c) => c.trim());
        if (lines.length !== AllConcepts.length) {
          throw new Error('Inconsistent number of concepts.');
        }
      } catch (err) {
        setError('Invalid CSV format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Changed max-w-md to max-w-2xl to increase window size */}
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
  
        <h2 className="text-2xl font-bold mb-6">Game Setup</h2>
  
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <div className="flex space-x-2">
              {(['cyberpunk', 'fantasy', 'real-world'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`px-3 py-2 rounded-lg ${
                    theme === t ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Concepts</label>
            <div className="grid grid-cols-2 gap-2">
              {AllConcepts.map((concept) => (
                <label key={concept} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={concepts.includes(concept)}
                    onChange={() => toggleConcept(concept)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{concept}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-500 rounded-lg font-medium hover:bg-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            ) : (
              'Start Game'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}