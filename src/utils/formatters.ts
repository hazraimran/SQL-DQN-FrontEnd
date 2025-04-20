// Helper function to extract just the question from the narrative
export const extractQuestion = (narrative: string): string => {
  // Look for the last sentence with a question mark (likely the SQL question)
  const questionMatch = narrative.match(/[^.!?]+\?/g);
  if (questionMatch && questionMatch.length > 0) {
    return questionMatch[questionMatch.length - 1].trim();
  }
  
  // Fallback: return last sentence or a shortened version
  const sentences = narrative.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.length ? sentences[sentences.length - 1].trim() : narrative.substring(0, 100);
};

// Helper to format DB result as JSON with line breaks
export function formatDBResult(dbResult: unknown): string {
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