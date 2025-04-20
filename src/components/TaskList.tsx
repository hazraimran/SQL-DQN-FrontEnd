import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { TaskStatus } from '../types';
import { extractQuestion } from '../utils/formatters';

interface TaskListProps {
  tasks: TaskStatus[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="mb-4">
      <h4 className="text-lg">Previous Tasks</h4>
      <div className="space-y-1">
        {tasks.map((task, idx) => (
          <div 
            key={idx}
            className={`
              ${task.correct ? 'bg-green-900/20 border-l-4 border-green-500' : 'bg-red-900/20 border-l-4 border-red-500'} 
              cursor-help mb-2 p-2 rounded flex items-center justify-between
              hover:bg-gray-700 transition-colors duration-150 shadow-sm
              relative group
            `}
            data-tooltip={`Task ${idx + 1}: ${task.concept}\n${extractQuestion(task.narrative)}`}
          >
            <div className="flex items-center">
              <span className="font-medium">{task.taskName}</span>
              <span className="ml-2 text-xs opacity-80"></span>
            </div>
            <div>
              {task.correct ? 
                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                <XCircle className="w-5 h-5 text-red-400" />
              }
            </div>
            <div className="absolute inset-0 border-2 border-blue-500/0 rounded transition-all duration-200 group-hover:border-blue-500/50"></div>
          </div>
        ))}
      </div>
    </div>
  );
};