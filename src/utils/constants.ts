const branchNames = [
    "basic SELECT and FROM",
    "basic WHERE clause",
    "pattern matching with LIKE",
    "handle NULL values",
    "ORDER BY clause",
    "INSERT Statement",
    "UPDATE Statement",
    "DELETE Statement",
    "basic JOIN usage (INNER JOIN)",
    "basic TRANSACTION usage (ROLLBACK)",
];

export const queries: Record<
    string,
    Record<
        number,
        {
            branchName: string;
            tables: { name: string; columns: string[] }[];
            // Changed expected to a more general structure
            expected: Array<Record<string, any>>;
        }
    >
> = {
    cyberpunk: {
        0: {
            branchName: branchNames[0],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [
                { name: "Neo", status: "PotentialRebel" },
                { name: "Trinity", status: "PotentialRebel" },
                { name: "Jane Doe", status: "PotentialRebel" },
                // { name: 'Morpheus', status: 'Captain' },
            ],
        },
        1: {
            branchName: branchNames[1],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [
                { name: "Neo", status: "PotentialRebel" },
                { name: "Trinity", status: "PotentialRebel" },
            ],
        },
        2: {
            branchName: branchNames[2],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "Trinity", status: "PotentialRebel" }],
        },
        3: {
            branchName: branchNames[3],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "Jane Doe", status: null }],
        },
        4: {
            branchName: branchNames[4],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [
                { name: "Jane Doe", status: "PotentialRebel" },
                { name: "Morpheus", status: "Captain" },
                { name: "Neo", status: "PotentialRebel" },
                { name: "Trinity", status: "PotentialRebel" },
            ],
        },
        5: {
            branchName: branchNames[5],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        6: {
            branchName: branchNames[6],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        7: {
            branchName: branchNames[7],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        8: {
            branchName: branchNames[8],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        9: {
            branchName: branchNames[9],
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "COMMIT"],
        },
    },

    fantasy: {
        0: {
            branchName: branchNames[0],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [
                { name: "The One Ring", status: "Precious" },
                { name: "The Two Rings", status: "Powerful" },
                { name: "The Three Rings", status: "Elven" },
                { name: "The Seven Rings", status: "Dwarven" },
            ],
        },
        1: {
            branchName: branchNames[1],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        2: {
            branchName: branchNames[2],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        3: {
            branchName: branchNames[3],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The Two Rings", status: null }],
        },
        4: {
            branchName: branchNames[4],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [
                { name: "The One Ring", status: "Precious" },
                { name: "The Seven Rings", status: "Dwarven" },
                { name: "The Three Rings", status: "Elven" },
                { name: "The Two Rings", status: "Powerful" },
            ],
        },
        5: {
            branchName: branchNames[5],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        6: {
            branchName: branchNames[6],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        7: {
            branchName: branchNames[7],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        8: {
            branchName: branchNames[8],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        9: {
            branchName: branchNames[9],
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "COMMIT"],
        },
    },

    "real-world": {
        0: {
            branchName: branchNames[0],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [
                { name: "Matrix", genre: "Cyberpunk" },
                { name: "2077", genre: "Cyberpunk" },
                { name: "The Lord of the Rings", genre: "Fantasy" },
                { name: "Harry Potter", genre: "Fantasy" },
            ],
        },
        1: {
            branchName: branchNames[1],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [
                { name: "Matrix", genre: "Cyberpunk" },
                { name: "2077", status: "Cyberpunk" },
            ],
        },
        2: {
            branchName: branchNames[2],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "Matrix", genre: "Cyberpunk" }],
        },
        3: {
            branchName: branchNames[3],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "The Lord of the Rings", status: null }],
        },
        4: {
            branchName: branchNames[4],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [
                { name: "Harry Potter", status: "Fantasy" },
                { name: "Matrix", genre: "Cyberpunk" },
                { name: "2077", status: "Cyberpunk" },
                { name: "The Lord of the Rings", status: "Fantasy" },
            ],
        },
        5: {
            branchName: branchNames[5],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        6: {
            branchName: branchNames[6],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        7: {
            branchName: branchNames[7],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["DELETE 1"],
        },
        8: {
            branchName: branchNames[8],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        9: {
            branchName: branchNames[9],
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["START TRANSACTION", "COMMIT"],
        },
    },
};
