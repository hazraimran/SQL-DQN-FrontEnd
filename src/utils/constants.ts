export type ThemeType = "cyberpunk" | "fantasy" | "real-world";

export const AllConcepts = [
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

export const ThemeTables = {
    cyberpunk: [
        {
            name: "residue",
            columns: ["name", "status"],
            types: ["varchar(50)", "varchar(50)"],
        },
        {
            name: "archives",
            columns: ["mission_name", "mission_description"],
            types: ["varchar(50)", "text"],
        },
        {
            name: "mission_logs",
            columns: ["mission_name", "agent_id", "reference"],
            types: ["varchar(50)", "int", "text"],
        },
        {
            name: "multi_agent_events",
            columns: ["agent_id", "timestamp", "location", "agent_replication"],
            types: ["int", "timestamp", "varchar(50)", "boolean"],
        },
    ],
    fantasy: [
        {
            name: "rings",
            columns: ["name", "profession"],
            types: ["varchar(50)", "varchar(50)"],
        },
        {
            name: "chronicles",
            columns: ["quest_name", "quest_description"],
            types: ["varchar(50)", "text"],
        },
        {
            name: "quest_logs",
            columns: ["quest_name", "hero_id", "reference"],
            types: ["varchar(50)", "int", "text"],
        },
        {
            name: "battle_summaries",
            columns: ["hero_id", "timestamp", "location", "victory"],
            types: ["int", "timestamp", "varchar(50)", "boolean"],
        },
    ],
    "real-world": [
        {
            name: "movies",
            columns: ["movie_name", "genre"],
            types: ["varchar(50)", "varchar(50)"],
        },
        {
            name: "reviews",
            columns: ["movie_name", "review_text", "rating"],
            types: ["varchar(50)", "text", "int"],
        },
        {
            name: "actors",
            columns: ["movie_name", "user_id"],
            types: ["varchar(50)", "int"],
        },
        {
            name: "collections",
            columns: ["movie_name", "timestamp", "shared"],
            types: ["varchar(50)", "timestamp", "boolean"],
        },
    ],
};

export const Queries: Record<
    string,
    Record<
        number,
        {
            concept: string;
            numOptions: number;
            input: Array<Record<string, Record<string, any>>>;
            expected: Array<Array<Record<string, any>>>;
        }
    >
> = {
    cyberpunk: {
        0: {
            concept: AllConcepts[0],
            numOptions: 1,
            input: [
                {
                    residue: [
                        { name: "Neo", status: "PotentialRebel" },
                        { name: "Trinity", status: "PotentialRebel" },
                        { name: "Morpheus", status: "Captain" },
                        { name: "Smith", status: "EliminationProtocol" },
                        { name: "Jane Doe", status: null },
                    ],
                },
            ],
            expected: [
                [
                    { name: "Neo", status: "PotentialRebel" },
                    { name: "Trinity", status: "PotentialRebel" },
                    { name: "Morpheus", status: "Captain" },
                    { name: "Smith", status: "EliminationProtocol" },
                    { name: "Jane Doe", status: null },
                ],
            ],
        },
        1: {
            concept: AllConcepts[1],
            numOptions: 2,
            input: [
                {
                    residue: [
                        { name: "Neo", status: "PotentialRebel" },
                        { name: "Trinity", status: "PotentialRebel" },
                        { name: "Morpheus", status: "Captain" },
                        { name: "Jane Doe", status: null },
                    ]
                },
                {
                    mission_logs: [
                        {
                            mission_name: "Free The Mind",
                            agent_id: 1,
                            reference: "Operation started, Morpheus leads",
                        },
                        {
                            mission_name: "Free The Mind",
                            agent_id: 1,
                            reference: "Strange glitch observed in downtown",
                        },
                        {
                            mission_name: "Defend Zion",
                            agent_id: 5,
                            reference: "Sentinel swarm approaching main gate",
                        },
                        {
                            mission_name: "Eliminate Virus",
                            agent_id: 4,
                            reference:
                                "Agent Smith anomaly flagged for investigation",
                        },
                    ],
                },
            ],
            expected: [
                [
                    { name: "Neo", status: "PotentialRebel" },
                    { name: "Trinity", status: "PotentialRebel" },
                ],
                [
                    {
                        mission_name: "Free The Mind",
                        agent_id: 1,
                        reference: "Operation started, Morpheus leads",
                    },
                    {
                        mission_name: "Free The Mind",
                        agent_id: 1,
                        reference: "Strange glitch observed in downtown",
                    },
                ],
            ],
        },
        2: {
            concept: AllConcepts[2],
            numOptions: 1,
            input: [
                {
                    archives: [
                        {
                            mission_id: 1,
                            mission_name: "Free The Mind",
                            mission_description: "An attempt to awaken humanity.",
                        },
                        {
                            mission_id: 2,
                            mission_name: "Locate The Key-maker",
                            mission_description:
                                "Securing the Keymaker for the Source.",
                        },
                        {
                            mission_id: 3,
                            mission_name: "Defend Zion",
                            mission_description:
                                "Protect the last human city from Sentinels.",
                        },
                        {
                            mission_id: 4,
                            mission_name: "Rescue Operator",
                            mission_description:
                                "An operator has gone missing in the field.",
                        },
                        {
                            mission_id: 5,
                            mission_name: "Eliminate Virus",
                            mission_description:
                                "Suspected virus detected within the Matrix code.",
                        },
                    ],
                },
            ],
            expected: [
                [
                    {
                        mission_id: 1,
                        mission_name: "Free The Mind",
                        mission_description:
                            "An attempt to awaken humanity.",
                    },
                    {
                        mission_id: 3,
                        mission_name: "Defend Zion",
                        mission_description:
                            "Protect the last human city from Sentinels.",
                    },
                ],
            ],
        },
        3: {
            concept: AllConcepts[3],
            input: {
                residue: [
                    { name: "Neo", status: "PotentialRebel" },
                    { name: "Trinity", status: "PotentialRebel" },
                    { name: "Morpheus", status: "Captain" },
                    { name: "Jane Doe", status: null },
                ],
            },
            expected: [{ name: "Jane Doe", status: null }],
        },
        4: {
            concept: AllConcepts[4],
            input: {
                archives: [
                    {
                        mission_id: 1,
                        mission_name: "Free The Mind",
                        mission_description: "An attempt to awaken humanity.",
                    },
                    {
                        mission_id: 2,
                        mission_name: "Locate The Key-maker",
                        mission_description:
                            "Securing the Keymaker for the Source.",
                    },
                    {
                        mission_id: 3,
                        mission_name: "Defend Zion",
                        mission_description:
                            "Protect the last human city from Sentinels.",
                    },
                    {
                        mission_id: 4,
                        mission_name: "Rescue Operator",
                        mission_description:
                            "An operator has gone missing in the field.",
                    },
                    {
                        mission_id: 5,
                        mission_name: "Eliminate Virus",
                        mission_description:
                            "Suspected virus detected within the Matrix code.",
                    },
                ],
            },
            expected: [
                { name: "Jane Doe", status: "PotentialRebel" },
                { name: "Morpheus", status: "Captain" },
                { name: "Neo", status: "PotentialRebel" },
                { name: "Trinity", status: "PotentialRebel" },
            ],
        },
        5: {
            concept: AllConcepts[5],
            input: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        6: {
            concept: AllConcepts[6],
            input: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        7: {
            concept: AllConcepts[7],
            input: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        8: {
            concept: AllConcepts[8],
            input: [
                {
                    name: "residue",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        9: {
            concept: AllConcepts[9],
            input: [
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
            concept: AllConcepts[0],
            input: [
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
            concept: AllConcepts[1],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        2: {
            concept: AllConcepts[2],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        3: {
            concept: AllConcepts[3],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The Two Rings", status: null }],
        },
        4: {
            concept: AllConcepts[4],
            input: [
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
            concept: AllConcepts[5],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        6: {
            concept: AllConcepts[6],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        7: {
            concept: AllConcepts[7],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        8: {
            concept: AllConcepts[8],
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        9: {
            concept: AllConcepts[9],
            input: [
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
            concept: AllConcepts[0],
            input: [
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
            concept: AllConcepts[1],
            input: [
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
            concept: AllConcepts[2],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "Matrix", genre: "Cyberpunk" }],
        },
        3: {
            concept: AllConcepts[3],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "The Lord of the Rings", status: null }],
        },
        4: {
            concept: AllConcepts[4],
            input: [
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
            concept: AllConcepts[5],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        6: {
            concept: AllConcepts[6],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        7: {
            concept: AllConcepts[7],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["DELETE 1"],
        },
        8: {
            concept: AllConcepts[8],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        9: {
            concept: AllConcepts[9],
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["START TRANSACTION", "COMMIT"],
        },
    },
};
