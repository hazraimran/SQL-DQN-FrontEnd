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
        1: {
            branchName: "basic SELECT and FROM",
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
        2: {
            branchName: "basic WHERE clause",
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
        3: {
            branchName: "pattern matching with LIKE",
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "Trinity", status: "PotentialRebel" }],
        },
        4: {
            branchName: "handle NULL values",
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "Jane Doe", status: null }],
        },
        5: {
            branchName: "ORDER BY clause",
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
        6: {
            branchName: "INSERT Statement",
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        7: {
            branchName: "UPDATE Statement",
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        8: {
            branchName: "DELETE Statement",
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        9: {
            branchName: "basic TRANSACTION usage (ROLLBACK)",
            tables: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        10: {
            branchName: "basic TRANSACTION usage (COMMIT)",
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
        1: {
            branchName: "basic SELECT and FROM",
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
        2: {
            branchName: "basic WHERE clause",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        3: {
            branchName: "pattern matching with LIKE",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        4: {
            branchName: "handle NULL values",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The Two Rings", status: null }],
        },
        5: {
            branchName: "ORDER BY clause",
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
        6: {
            branchName: "INSERT Statement",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        7: {
            branchName: "UPDATE Statement",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        8: {
            branchName: "DELETE Statement",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        9: {
            branchName: "basic TRANSACTION usage (ROLLBACK)",
            tables: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        10: {
            branchName: "basic TRANSACTION usage (COMMIT)",
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
        1: {
            branchName: "basic SELECT and FROM",
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
        2: {
            branchName: "basic WHERE clause",
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
        3: {
            branchName: "pattern matching with LIKE",
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "Matrix", genre: "Cyberpunk" }],
        },
        4: {
            branchName: "handle NULL values",
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "The Lord of the Rings", status: null }],
        },
        5: {
            branchName: "ORDER BY clause",
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
        6: {
            branchName: "INSERT Statement",
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        7: {
            branchName: "UPDATE Statement",
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        8: {
            branchName: "DELETE Statement",
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["DELETE 1"],
        },
        9: {
            branchName: "basic TRANSACTION usage (ROLLBACK)",
            tables: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        10: {
            branchName: "basic TRANSACTION usage (COMMIT)",
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
