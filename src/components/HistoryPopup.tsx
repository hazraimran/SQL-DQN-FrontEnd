import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClipboardList } from 'lucide-react';
import { HistoryEntry } from '../types';

interface HistoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onUseQuery: (query: string) => void;
}

export const HistoryPopup: React.FC<HistoryPopupProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onUseQuery 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute z-50 bottom-full left-0 w-full mb-2 max-h-[60vh] overflow-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <ClipboardList className="w-5 h-5 mr-2" />
          Query History
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>
      
      {history.length === 0 ? (
        <p>No previous queries.</p>
      ) : (
        history.map((item, idx) => (
          <div key={idx} className="mb-4 border-b border-gray-700 pb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-blue-400">Query {idx + 1}:</p>
              <button 
                className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                onClick={() => {
                  onUseQuery(item.userQuery);
                  onClose();
                }}
              >
                Use this query
              </button>
            </div>
            <pre className="bg-gray-700 p-2 whitespace-pre-wrap break-words rounded">
              {item.userQuery}
            </pre>
            <div className="bg-gray-700 p-2 whitespace-pre-wrap break-words mt-1 markdown-table rounded">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => (
                    <table className="border-collapse border border-gray-600 w-full" {...props} />
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-gray-600 px-2 py-1 bg-gray-800" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-gray-600 px-2 py-1" {...props} />
                  )
                }}
              >
                {item.dbResultString}
              </ReactMarkdown>
            </div>
          </div>
        ))
      )}
    </div>
  );
};