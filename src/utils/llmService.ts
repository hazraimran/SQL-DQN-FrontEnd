export async function getGeneratedQuery(
    prompt: string, branchName: string, expected: string
    // promptTheme: string = "Matrix (Movie)",
    // promptSchema: { tableName: string; columns: string[] } = {tableName: 'residue', columns: ['name', 'status']},
    // promptConcepts: string[] = ["basic SELECT and FROM",]
    //  "basic WHERE clause", "pattern matching with LIKE", "handle NULL values", "ORDER BY clause", "INSERT Statement", "UPDATE Statement", "DELETE Statement", "basic TRANSACTION usage (ROLLBACK)", "basic TRANSACTION usage (COMMIT)"]
): Promise<string> {
    const background =
    `You are an expert in the field of teaching SQL concepts, and you are creating quizzes for your students. Generate a narrative similar to ${prompt} around 50 words, where the objective of the query is ${branchName}, and the expected output is ${expected}. State clearly the requirements of the query and the expected output, but in a storytelling format.`;

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: "open-r1/olympiccoder-7b:free",
                messages: [{ role: "user", content: background }],
            }),
        }
    );
    const data = await response.json();
    const generatedQuery = data.choices[0].message.content;
    console.log("Generated query:", generatedQuery);

    // // Store the query in src/resources/llm_queries.txt
    // const filePath = path.join(__dirname, "..", "resources", "llm_queries.txt");
    // fs.appendFileSync(filePath, generatedQuery + "\n");

    return generatedQuery;
}
