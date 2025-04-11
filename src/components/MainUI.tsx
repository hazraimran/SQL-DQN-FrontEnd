import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Send, Database, Wand, ClipboardList, ListChecks, CheckCircle, XCircle, History } from 'lucide-react';
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
  concept: string;
  randomChoice: number;
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
    [data-tooltip]:after {
      opacity: 0;
      visibility: hidden;
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 10px);
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
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow-y: auto;
      max-height: 300px;
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, transform 0.2s ease-in-out;
      transform: translateY(10px);
      pointer-events: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    [data-tooltip]:before {
      opacity: 0;
      visibility: hidden;
      content: '';
      position: absolute;
      bottom: 100%;
      left: 20px;
      border: 8px solid transparent;
      border-top-color: #1f2937;
      transform: translateY(3px);
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, transform 0.2s ease-in-out;
      pointer-events: none;
    }
    [data-tooltip]:hover:after,
    [data-tooltip]:hover:before {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  `
};

// Helper function to extract just the question from the narrative
const extractQuestion = (narrative: string): string => {
  // Look for the last sentence with a question mark (likely the SQL question)
  const questionMatch = narrative.match(/[^.!?]+\?/g);
  if (questionMatch && questionMatch.length > 0) {
    return questionMatch[questionMatch.length - 1].trim();
  }
  
  // Fallback: return last sentence or a shortened version
  const sentences = narrative.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.length ? sentences[sentences.length - 1].trim() : narrative.substring(0, 100);
};

export function MainUI({
  initialOutput,
  initialSchemas,
  theme,
  concepts,
  concept: initialConcept,
  randomChoice: initialRandomChoice, // Rename to clarify it's initial
}: MainUIProps) {
  // Add randomChoice to state variables
  const [randomChoice, setRandomChoice] = useState(initialRandomChoice);
  
  // Existing state
  const [output, setOutput] = useState(initialOutput);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [input, setInput] = useState('');
  const [masteryLevels, setMasteryLevels] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [concept, setConcept] = useState(initialConcept);
  
  // New states for animations
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);

  // New states for typewriter animation
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Add this state to control the history popup
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
      const themeQueries = Queries[theme as keyof typeof Queries];
      const conceptQueries = themeQueries[concept as keyof typeof themeQueries];
      
      // Make sure we have valid expected data to send
      if (!conceptQueries?.expected || randomChoice >= conceptQueries.expected.length) {
        throw new Error("Invalid query configuration");
      }
      
      const expected = conceptQueries.expected[randomChoice];
      
      const response = await fetch('http://localhost:3000/submit-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: input, expected }),
      });

      if (!response.ok) {
        console.log('Error response:', response);
        const errorData = await response.json();
        console.log('Error data:', errorData);
        const errorMessage = `${errorData.error || 'An unknown error occurred'}` +
          `- ${errorData.details || 'No additional information available.'}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const newActionNumber = parseInt(data.action, 10);
      const newConcept = concepts[newActionNumber];
      setConcept(newConcept);

      // Generate new random choice and UPDATE STATE properly
      const newRandomChoice = Math.floor(
        Math.random() * Queries[theme as keyof typeof Queries][newConcept]?.numOptions || 1
      );
      setRandomChoice(newRandomChoice); // Use state setter
      
      const chosenInput = Queries[theme as keyof typeof Queries][newConcept]?.input?.[newRandomChoice];
      const chosenExpected = Queries[theme as keyof typeof Queries][newConcept]?.expected?.[newRandomChoice];
      
      // Use the new values
      const narrative = await getGeneratedQuery(
        theme,
        newConcept,
        chosenInput,
        chosenExpected
      );

      console.log(JSON.stringify(data, null, 2));
      const isCorrect = data.correct;

      console.log('Correctness data:', data.correct, 'Interpreted as:', isCorrect);

      if (isCorrect) {
        setShowSuccessAnimation(true);
        setShowErrorAnimation(false);
        setTimeout(() => setShowSuccessAnimation(false), 1500);
      } else {
        setShowErrorAnimation(true);
        setShowSuccessAnimation(false);
        setTimeout(() => setShowErrorAnimation(false), 1500);
      }

      const previousResultFromDB = data.resultFromDB;
      const dbResultString = formatDBResult(previousResultFromDB);

      setHistory((prev) => [...prev, { 
        userQuery: input, 
        dbResultString 
      }]);

      setTasks((currentTasks) => [
        ...currentTasks,
        {
          taskName: `Task ${currentTasks.length + 1}`,
          correct: isCorrect,
          concept: newConcept,
          narrative: narrative
        },
      ]);

      setOutput(`${narrative}`);
      setMasteryLevels(data.newMastery);

      setInput('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      setOutput(prevOutput => {
        const hasExistingError = prevOutput.includes("Error:");
        if (hasExistingError) {
          return prevOutput.split("Error:")[0] + `<span class="text-red-500">Error: ${errorMessage}</span>`;
        } else {
          return prevOutput + `\n\n<span class="text-red-500">Error: ${errorMessage}</span>`;
        }
      });
      
      setShowErrorAnimation(true);
      setTimeout(() => setShowErrorAnimation(false), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{animations.success + animations.error + animations.tooltip}</style>
      
      {showSuccessAnimation && (
        <div className="success-animation">
          <CheckCircle size={80} color="#10b981" />
        </div>
      )}
      
      {showErrorAnimation && (
        <div className="error-animation">
          <XCircle size={80} color="#ef4444" />
        </div>
      )}
      
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col h-full">
          <div ref={outputContainerRef} className="flex-grow mb-4 rounded-xl p-4 overflow-auto bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ListChecks className="w-5 h-5 mr-2" />
              Task Board
            </h3>
            
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
            
            <div className="prose prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {displayText || 'No output yet...'}
              </ReactMarkdown>
              {isTyping && <span className="animate-pulse">▌</span>}
            </div>
          </div>

          <div className="relative h-12 mb-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center h-full">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
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
            
            {isHistoryOpen && (
              <div className="absolute z-50 bottom-full left-0 w-full mb-2 max-h-[60vh] overflow-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Query History
                  </h3>
                  <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-white">
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
                            setInput(item.userQuery);
                            setIsHistoryOpen(false);
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
            )}
          </div>
        </div>

        <div className="space-y-4">
          <MasteryProgress concepts={concepts} masteryLevels={masteryLevels} />

          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <IconToUse className="w-5 h-5 mr-2" />
              SQL Schemas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {initialSchemas.map((table) => (
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
        </div>
      </div>
    </>
  );
}