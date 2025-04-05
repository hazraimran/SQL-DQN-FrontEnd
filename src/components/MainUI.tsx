import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Database, Wand } from 'lucide-react';
import { MasteryProgress } from './MasteryProgress';
import { Queries } from '../utils/constants';
import { getGeneratedQuery } from '../utils/llmService';

interface Schema {
  name: string;
  columns: string[];
}

interface MainUIProps {
  initialOutput: string;
  initialSchemas: Schema[];
  theme: string;
  concepts: string[];
  actionNumber: number;
}

export function MainUI({
  initialOutput,
  initialSchemas,
  theme,
  concepts,
  actionNumber,
}: MainUIProps) {
  const [output, setOutput] = useState(initialOutput);
  const [input, setInput] = useState('');
  const [schemas, setSchemas] = useState(initialSchemas);
  const [masteryLevels, setMasteryLevels] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Match mastery levels to the number of user-chosen concepts
  useEffect(() => {
    setMasteryLevels(concepts.map(() => 0.6)); // or 0 to start
  }, [concepts]);

  // Pick styles/icons based on theme
  const IconToUse = theme === 'fantasy' ? Wand : Database;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const expected = (Queries[theme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].expected;
      const response = await fetch('http://localhost:3000/submit-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: input, expected }),
      });
      if (!response.ok) {
        throw new Error('Failed to execute query in MainUI - handleSubmit');
      }

      const data = await response.json();
      actionNumber = parseInt(data.action, 10);
      const newSchema = Queries[theme][actionNumber].input || [];
      setSchemas(newSchema);

      const narrative = await getGeneratedQuery(
        theme,
        (Queries[theme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].concept,
        (Queries[theme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].input,
        (Queries[theme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber].expected
      );
      setOutput(`**Task ${actionNumber + 1}:**\n\n${narrative}`);

      const newMastery = data.newMastery;
      console.log('New Mastery Levels:', newMastery);
      setMasteryLevels([...newMastery]);
      setInput('');
    } catch {
      setOutput('Error: Failed to execute query in MainUI - handleSubmit as a whole');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        {/* System Output as Markdown */}
        <div className="h-[60vh] rounded-xl p-4 overflow-auto bg-gray-800">
          <div className="prose prose-invert">
            <ReactMarkdown>{output || 'No output yet...'}</ReactMarkdown>
          </div>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your SQL query..."
            className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
          {isLoading && (
            <div
              className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              title="Generating next query..."
            />
          )}
        </form>
      </div>

      <div className="space-y-4">
        {/* Mastery Progress */}
        <MasteryProgress concepts={concepts} masteryLevels={masteryLevels} />

        {/* Schema from queries[theme][action].tables */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <IconToUse className="w-5 h-5 mr-2" />
            SQL Schemas
          </h3>
          <div className="space-y-4">
            {schemas.map((table) => (
              <div key={table.name} className="border border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-blue-400 mb-2">{table.name}</h4>
                <div className="font-mono text-sm text-gray-400">
                  {table.columns.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}