export async function getGeneratedQuery(
  theme: string,
  branchName: string,
  tables: { name: string; columns: string[] }[],
    expected: Array<Record<string, any>>
): Promise<string> {
  // Create a list of tables with columns in a friendly format
  const tablesList = tables
    .map(
      (tbl, idx) =>
        `Table #${idx + 1}: "${tbl.name}" (columns: ${tbl.columns.join(', ')})`
    )
    .join('\n');

  // Convert the expected result to a string, whether array or single string
  const expectedResult = Array.isArray(expected)
    ? expected.map((item) => JSON.stringify(item)).join(',\n')
    : expected;

  // Build the LLM prompt content
  const content =
    'You are a creative storyteller with knowledge of SQL database queries. ' +
    'Generate a **engaging narrative within 100 words** based on a given theme. ' +
    'Your story must include:\n\n' +
    '1. An introduction to the setting or characters tied to the theme.\n' +
    `2. A challenge or mission that can only be solved by running a ${branchName} SQL query ` +
    'against the following table(s):\n' +
    `${tablesList}\n\n` +
    "3. A direct prompt asking the user (the 'player') to provide the SQL query " +
    'that returns the specified expected result.\n\n' +
    '[Details to incorporate into the story]\n' +
    `- Theme: ${theme}\n` +
    `- Expected Result:\n[${expectedResult}]\n\n` +
    '[Format of your response]\n' +
    "1. Provide a short narrative or storyline set in the specified theme.\n" +
    "2. Do NOT provide the SQL query yourself; only ask the player to supply it.\n\n" +
    '[Example Guidance]\n' +
    "- If the theme is 'Cyberpunk,' your story might refer to futuristic cities, neon lights, or secret hacking missions.\n" +
    " - Conclude with a direct question like:\n" +
    "'Neo has discovered three individuals who show signs of rebellion. He needs a query that will list these rebels. " +
    "What SQL command can you use to retrieve only those entries from the table(s)?'\n";

  // Post to your LLM endpoint
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [{ role: 'user', content }],
    }),
  });

  const data = await response.json();
  const generatedQuery = data.choices[0].message.content;
  console.log('Generated query:', generatedQuery);

  return generatedQuery;
}