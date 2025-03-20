import { Trophy } from 'lucide-react';

interface MasteryProgressProps {
  masteryLevels: number[];
}

export function MasteryProgress({ masteryLevels }: MasteryProgressProps) {
  const totalProgress = masteryLevels.reduce((sum, level) => sum + level, 0) / masteryLevels.length * 100;

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          SQL Mastery Progress
        </h3>
        <span className="text-gray-400">{Math.round(totalProgress)}% Complete</span>
      </div>

      <div className="grid grid-cols-10 gap-2 mb-4">
        {masteryLevels.map((level, index) => (
          <div key={index} className="relative">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                style={{ width: `${level * 100}%` }}
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {masteryLevels.map((level, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Concept {index + 1}</span>
            <span className={`font-medium ${level >= 0.8 ? 'text-green-400' : level >= 0.5 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {Math.round(level * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}