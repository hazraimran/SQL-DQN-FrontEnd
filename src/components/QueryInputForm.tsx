import React from 'react';
import { Send, History } from 'lucide-react';

interface QueryInputFormProps {
  input: string;
  setInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  toggleHistory: () => void;
}

export const QueryInputForm: React.FC<QueryInputFormProps> = ({ 
  input, 
  setInput, 
  onSubmit, 
  isLoading,
  toggleHistory 
}) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center h-full">
      <button
        type="button"
        onClick={toggleHistory}
        className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        title="View query history"
      >
        <History className="w-5 h-5" />
      </button>
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
  );
};