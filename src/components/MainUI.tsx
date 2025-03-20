import React, { useState } from 'react';
import { Send, Database } from 'lucide-react';

interface Schema {
  name: string;
  columns: string[];
}

interface MainUIProps {
  initialOutput: string;
  initialSchemas: Schema[];
}

export function MainUI({ initialOutput, initialSchemas }: MainUIProps) {
  const [output, setOutput] = useState(initialOutput);
  const [input, setInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [schemas, setSchemas] = useState(initialSchemas);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await fetch('/submit-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      setOutput(data.output);
      setProgress((prev) => Math.min(prev + 10, 100));
      setInput('');
    } catch (err) {
      setOutput('Error: Failed to execute query');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        {/* System Output */}
        <div className="h-[60vh] bg-gray-800 rounded-xl p-4 overflow-auto">
          <pre className="font-mono text-green-400 whitespace-pre-wrap">
            {output || 'No output yet...'}
          </pre>
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
        {/* Progress */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4">Progress</h3>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-gray-400">{progress}% Complete</p>
        </div>

        {/* Schema */}
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