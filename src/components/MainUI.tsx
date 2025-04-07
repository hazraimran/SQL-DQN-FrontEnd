import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Send, Database, Wand, ClipboardList, ListChecks, CheckCircle, XCircle } from 'lucide-react';
import { MasteryProgress } from './MasteryProgress';
import { Queries } from '../utils/constants';
import { getGeneratedQuery } from '../utils/llmService';

interface Schema {
  name: string;
  columns: string[];
  types: string[];
}

interface MainUIProps {
  initialOutput: string;
  initialSchemas: Schema[];
  theme: string;
  concepts: string[];
  actionNumber: number;
}

type HistoryEntry = {
  userQuery: string;
  dbResultString: string;
};

/** Tracks each task’s correctness, name, concept, and narrative. */
type TaskStatus = {
  taskName: string;
  correct: boolean;
  concept: string;
  narrative: string; // Add this new field
};

// Add animation styles
const animations = {
  success: `
    @keyframes success-animation {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1); }
    }
    .success-animation {
      animation: success-animation 1.5s ease-in-out;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;
    }
  `,
  error: `
    @keyframes error-animation {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1); }
    }
    .error-animation {
      animation: error-animation 1.5s ease-in-out;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;
    }
  `,
  tooltip: `
    [data-tooltip] {
      position: relative;
    }
    [data-tooltip]:hover:after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #1f2937;
      padding: 8px 12px;
      border-radius: 4px;
      white-space: pre-wrap;
      max-width: 500px;
      min-width: 200px;
      width: auto;
      z-index: 10;
      font-size: 13px;
      line-height: 1.4;
      display: block;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow-y: auto;
      max-height: 300px;
    }
  `
};

export function MainUI({
  initialOutput,
  initialSchemas,
  theme,
  concepts,
  actionNumber: initialActionNumber,
}: MainUIProps) {
  // Existing state
  const [output, setOutput] = useState(initialOutput);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [input, setInput] = useState('');
  const [masteryLevels, setMasteryLevels] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionNumber, setActionNumber] = useState(initialActionNumber);
  
  // New states for animations
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);

  // New states for typewriter animation
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for scrolling
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history or output changes
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [output]);

  // Match mastery levels to the number of user-chosen concepts
  useEffect(() => {
    setMasteryLevels(concepts.map(() => 0.6));
  }, [concepts]);

  // Typewriter animation for output
  useEffect(() => {
    // Clear any existing animation
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    
    // If there's no output or we're showing an error, just display it immediately
    if (!output || output.includes('Error:')) {
      setDisplayText(output);
      return;
    }
    
    // Start typing animation
    setIsTyping(true);
    let i = 0;
    const text = output;
    setDisplayText(''); // Start with empty string
    
    const typeNextChar = () => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
        typewriterRef.current = setTimeout(typeNextChar, 15);
      } else {
        setIsTyping(false);
        typewriterRef.current = null;
      }
    };
    
    // Call typeNextChar immediately to handle the first character
    typeNextChar();
    
    // Clean up on unmount or when output changes
    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [output]);

  // Pick styles/icons based on theme
  const IconToUse = theme === 'fantasy' ? Wand : Database;

  // Helper to format DB result as JSON with line breaks
  function formatDBResult(dbResult: unknown): string {
    // Check if dbResult is a non-empty array of objects (so we can build a table)
    if (Array.isArray(dbResult) && dbResult.length > 0 && typeof dbResult[0] === 'object') {
      const keys = Object.keys(dbResult[0] as Record<string, unknown>);
      // Table header
      const headerRow = `| ${keys.join(' | ')} |`;
      const separator = `| ${keys.map(() => '---').join(' | ')} |`;
  
      // Table rows
      const rows = (dbResult as Record<string, unknown>[]).map((item) => {
        return `| ${keys.map((k) => (item[k] === null ? 'null' : String(item[k]))).join(' | ')} |`;
      });
  
      return [headerRow, separator, ...rows].join('\n');
    } else if (Array.isArray(dbResult)) {
      // If it's an array with primitive values
      return dbResult.map((item) => JSON.stringify(item, null, 2)).join('\n');
    } else if (typeof dbResult === 'object' && dbResult !== null) {
      // Single object
      return JSON.stringify(dbResult, null, 2);
    }
    // Fallback for any other type
    return String(dbResult);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const expected =
        (Queries[theme] as Record<number, typeof Queries[keyof typeof Queries][number]>)[actionNumber]
          .expected;
      const response = await fetch('http://localhost:3000/submit-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: input, expected }),
      });

      if (!response.ok) {
        console.log('Error response:', response);
        // Try to parse the response to get the detailed error message
        // try {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          // Extract error message from the backend format
          const errorMessage = `${errorData.error || 'An unknown error occurred'}` +
            `- ${errorData.details || 'No additional information available.'}`;
          throw new Error(errorMessage);
        // } catch (jsonError) {
        //   // If we can't parse the JSON, fall back to the original error
        //   throw new Error(`Failed to execute query - ${response.statusText}`);
        // }
      }

      const data = await response.json();
      const newActionNumber = parseInt(data.action, 10);
      setActionNumber(newActionNumber);

      const randomChoice = Math.floor(
        Math.random() * Queries[theme][newActionNumber].numOptions
      );
      const chosenConcept = Queries[theme][newActionNumber].concept;
      const chosenInput = Queries[theme][newActionNumber].input[randomChoice];
      const chosenExpected = Queries[theme][newActionNumber].expected[randomChoice];
      const narrative = await getGeneratedQuery(
        theme,
        chosenConcept,
        chosenInput,
        chosenExpected
      );

      console.log(JSON.stringify(data, null, 2));
      // Improve the correctness check with better type handling
      const isCorrect = data.correct;

      // Log the correctness value to debug
      console.log('Correctness data:', data.correct, 'Interpreted as:', isCorrect);

      // Show animation based on correctness - ensure only one animation shows
      if (isCorrect) {
        setShowSuccessAnimation(true);
        setShowErrorAnimation(false); // Explicitly turn off error animation
        setTimeout(() => setShowSuccessAnimation(false), 1500);
      } else {
        setShowErrorAnimation(true);
        setShowSuccessAnimation(false); // Explicitly turn off success animation
        setTimeout(() => setShowErrorAnimation(false), 1500);
      }

      const previousResultFromDB = data.resultFromDB;
      const dbResultString = formatDBResult(previousResultFromDB);

      // 1) Keep a history of all userQueries & DB results
      setHistory((prev) => [...prev, { 
        userQuery: input, 
        dbResultString 
      }]);

      // 2) Integrate new task record with sequential numbering
      setTasks((currentTasks) => [
        ...currentTasks,
        {
          taskName: `Task ${currentTasks.length + 1}`,
          correct: isCorrect, // Using our improved check
          concept: chosenConcept,
          narrative: narrative
        },
      ]);

      // 3) Update output without DB result - only narrative
      setOutput(`${narrative}`);
      setMasteryLevels(data.newMastery);

      setInput('');
    } catch (error) {
      // console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Display error in red and replace previous error message if it exists
      setOutput(prevOutput => {
        // Check if there's already an error message
        const hasExistingError = prevOutput.includes("Error:");
        if (hasExistingError) {
          // Replace the existing error message
          return prevOutput.split("Error:")[0] + `<span class="text-red-500">Error: ${errorMessage}</span>`;
        } else {
          // Add new error message
          return prevOutput + `\n\n<span class="text-red-500">Error: ${errorMessage}</span>`;
        }
      });
      
      // Also show the error animation
      setShowErrorAnimation(true);
      setTimeout(() => setShowErrorAnimation(false), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Add CSS for animations */}
      <style>{animations.success + animations.error + animations.tooltip}</style>
      
      {/* Success animation */}
      {showSuccessAnimation && (
        <div className="success-animation">
          <CheckCircle size={80} color="#10b981" />
        </div>
      )}
      
      {/* Error animation */}
      {showErrorAnimation && (
        <div className="error-animation">
          <XCircle size={80} color="#ef4444" />
        </div>
      )}
      
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Left panel */}
        <div className="space-y-4">
          {/* Box for query history */}
          <div ref={historyContainerRef} className="h-[40vh] p-4 overflow-auto bg-gray-800 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Query History
            </h3>
            {history.length === 0 ? (
              <p>No previous queries.</p>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <p className="text-sm text-blue-400">Query {idx + 1}:</p>
                  <pre className="bg-gray-700 p-2 whitespace-pre-wrap break-words">
                    {item.userQuery}
                  </pre>
                  <div className="bg-gray-700 p-2 whitespace-pre-wrap break-words mt-1 markdown-table">
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

          {/* System Output as plain text (no Markdown) */}
          <div ref={outputContainerRef} className="h-[60vh] rounded-xl p-4 overflow-auto bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ListChecks className="w-5 h-5 mr-2" />
              Task Board
            </h3>
            
            {/* Separate task list with proper styling and instant tooltips */}
            <div className="mb-4">
              <h4 className="text-lg">Previous Tasks</h4>
              <div className="space-y-1">
                {tasks.map((task, idx) => (
                  <div 
                    key={idx}
                    className={`${task.correct ? 'text-green-400' : 'text-red-400'} cursor-help mb-1 p-1 hover:bg-gray-700 rounded`}
                    data-tooltip={`Task ${idx + 1}: ${task.concept}\n\n${task.narrative}`}
                  >
                    {task.taskName} {task.correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="prose prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]} // This enables HTML in markdown
              >
                {displayText || 'No output yet...'}
              </ReactMarkdown>
              {isTyping && <span className="animate-pulse">▌</span>}
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

        {/* Right panel - unchanged */}
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
              {initialSchemas.map((table) => (
                <div key={table.name} className="border border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium text-blue-400 mb-2">{table.name}</h4>
                  <div className="font-mono text-sm text-gray-400">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b border-gray-600 text-left px-2 py-1">
                            Column Name
                          </th>
                          <th className="border-b border-gray-600 text-left px-2 py-1">
                            Data Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col, idx) => (
                          <tr key={col}>
                            <td className="border-b border-gray-700 px-2 py-1">{col}</td>
                            <td className="border-b border-gray-700 px-2 py-1">
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
        </div>
      </div>
    </>
  );
}