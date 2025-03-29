import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Database } from 'lucide-react';
import { MasteryProgress } from './MasteryProgress';
import { queries } from '../utils/constants';
import { getGeneratedQuery } from '../utils/llmService';

interface Schema {
  name: string;
  columns: string[];
}

interface MainUIProps {
  initialOutput: string;
  initialSchemas: Schema[];
  // NEW: Add optional theme in case you want to pass it from App
  theme?: 'cyberpunk' | 'fantasy' | 'real-world';
}

export function MainUI({
  initialOutput,
  initialSchemas,
  theme = 'cyberpunk', // default if not passed
}: MainUIProps) {
  const [output, setOutput] = useState(initialOutput);
  const [input, setInput] = useState('');
  const [schemas, setSchemas] = useState(initialSchemas);
  const [masteryLevels, setMasteryLevels] = useState([
    0.6, // Basic Queries
    0.6, // Joins
    0.6, // Aggregations
    0.6, // Subqueries
    0.6, // Window Functions
    0.6, // Indexes
    0.6, // Transactions
    0.6, // Views
    0.6, // Stored Procedures
    0.6  // Triggers
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/submit-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: input }),
      });
      if (!response.ok) {
        throw new Error('Failed to execute query in MainUI - handleSubmit');
      }

      const data = await response.json();
      const actionNum  = parseInt(data.action, 10);
      // 1) Read schema from queries[theme][actionNum].tables
      const newSchema = queries[theme]?.[actionNum]?.tables || [];
      setSchemas(newSchema);
      // 2) Pass data to getGeneratedQuery
      const narrative = await getGeneratedQuery(
        theme,
        (queries[theme] as Record<number, typeof queries[keyof typeof queries][number]>)[actionNum].branchName,
        (queries[theme] as Record<number, typeof queries[keyof typeof queries][number]>)[actionNum].tables,
        (queries[theme] as Record<number, typeof queries[keyof typeof queries][number]>)[actionNum].expected
      );
      console.log('Generated narrative from MainUI:', narrative);

      // 3) setOutput with Markdown content
      setOutput(`**Task ${actionNum}:**\n\n${narrative.toString()}`);

      // Update mastery
      const newMastery = data.newMastery;
      setMasteryLevels(() => {
        const newLevels = [...newMastery];
        return newLevels;
      });

      // Clear input after processing
      setInput('');
    } catch {
      setOutput('Error: Failed to execute query in MainUI - handleSubmit as a whole');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        {/* System Output as Markdown */}
        <div className="h-[60vh] bg-gray-800 rounded-xl p-4 overflow-auto">
          <div className="prose prose-invert">
            <ReactMarkdown>
              {output || 'No output yet...'}
            </ReactMarkdown>
          </div>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your SQL query..."
            className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {/* Mastery Progress */}
        <MasteryProgress masteryLevels={masteryLevels} />

        {/* Schema from queries[theme][action].tables */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
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