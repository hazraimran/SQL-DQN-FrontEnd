import React from 'react';
import { Database, Wand } from 'lucide-react';
import { Schema } from '../types';

interface SchemaDisplayProps {
  schemas: Schema[];
  theme: string;
}

export const SchemaDisplay: React.FC<SchemaDisplayProps> = ({ schemas, theme }) => {
  // Choose icon based on theme
  const IconToUse = theme === 'fantasy' ? Wand : Database;
  
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <IconToUse className="w-5 h-5 mr-2" />
        SQL Schemas
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {schemas.map((table) => (
          <div key={table.name} className="border border-gray-700 rounded-lg p-2">
            <h4 className="font-medium text-blue-400 mb-1 text-sm">{table.name}</h4>
            <div className="font-mono text-xs text-gray-400">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-600 text-left px-1 py-1">
                      Column
                    </th>
                    <th className="border-b border-gray-600 text-left px-1 py-1">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col, idx) => (
                    <tr key={col}>
                      <td className="border-b border-gray-700 px-1 py-0.5">{col}</td>
                      <td className="border-b border-gray-700 px-1 py-0.5">
                        {table.types[idx].toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};