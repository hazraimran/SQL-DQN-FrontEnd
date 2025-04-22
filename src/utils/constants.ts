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
    "basic GROUP BY and HAVING",
    "basic JOIN usage (INNER JOIN)",
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
            columns: ["mission_id", "mission_name", "mission_description"],
            types: ["int", "varchar(50)", "text"],
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
    ThemeType,
    Record<string, { numOptions: number; input: any[]; expected: any[] }>
> = {
    cyberpunk: {
        [AllConcepts[0]]: {
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
        [AllConcepts[1]]: {
            numOptions: 2,
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
                {
                    mission_logs: [
                        {
                            mission_name: "Free The Mind",
                            agent_id: 101,
                            reference: "Operation started, Morpheus leads",
                        },
                        {
                            mission_name: "Free The Mind",
                            agent_id: 101,
                            reference: "Strange glitch observed in downtown",
                        },
                        {
                            mission_name: "Defend Zion",
                            agent_id: 103,
                            reference: "Sentinel swarm approaching main gate",
                        },
                        {
                            mission_name: "Eliminate Virus",
                            agent_id: 102,
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
                        agent_id: 101,
                        reference: "Operation started, Morpheus leads",
                    },
                    {
                        mission_name: "Free The Mind",
                        agent_id: 101,
                        reference: "Strange glitch observed in downtown",
                    },
                ],
            ],
        },
        [AllConcepts[2]]: {
            numOptions: 1,
            input: [
                {
                    archives: [
                        {
                            mission_id: 1,
                            mission_name: "Free The Mind",
                            mission_description:
                                "An attempt to awaken humanity.",
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
                        mission_description: "An attempt to awaken humanity.",
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
        [AllConcepts[3]]: {
            numOptions: 2,
            input: [
                {
                    residue: [
                        { name: "Neo", status: "PotentialRebel" },
                        { name: "Trinity", status: "PotentialRebel" },
                        { name: "Morpheus", status: "Captain" },
                        { name: "Jane Doe", status: null },
                        { name: "Smith", status: "EliminationProtocol" },
                    ],
                },
                {
                    multi_agent_events: [
                        {
                            agent_id: 101,
                            timestamp: "2023-01-01T09:15:00.000Z",
                            location: "Downtown",
                            agent_replication: false,
                        },
                        {
                            agent_id: 101,
                            timestamp: "2023-01-01T09:30:00.000Z",
                            location: "Downtown",
                            agent_replication: false,
                        },
                        {
                            agent_id: 102,
                            timestamp: "2023-01-01T10:00:00.000Z",
                            location: "Rooftop",
                            agent_replication: true,
                        },
                        {
                            agent_id: 102,
                            timestamp: "2023-01-01T10:15:00.000Z",
                            location: "SubwayStation",
                            agent_replication: true,
                        },
                        {
                            agent_id: 103,
                            timestamp: "2023-01-01T18:30:00.000Z",
                            location: null,
                            agent_replication: false,
                        },
                    ],
                },
            ],
            expected: [
                [{ name: "Jane Doe", status: null }],
                [
                    {
                        agent_id: 103,
                        timestamp: "2023-01-01T10:30:00.000Z",
                        location: null,
                        agent_replication: false,
                    },
                ],
            ],
        },
        [AllConcepts[4]]: {
            numOptions: 2,
            input: [
                {
                    archives: [
                        {
                            mission_id: 1,
                            mission_name: "Free The Mind",
                            mission_description:
                                "An attempt to awaken humanity.",
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
                    multi_agent_events: [
                        {
                            agent_id: 101,
                            timestamp: "2023-01-01T09:15:00.000Z",
                            location: "Downtown",
                            agent_replication: false,
                        },
                        {
                            agent_id: 101,
                            timestamp: "2023-01-01T09:30:00.000Z",
                            location: "Downtown",
                            agent_replication: false,
                        },
                        {
                            agent_id: 102,
                            timestamp: "2023-01-01T10:00:00.000Z",
                            location: "Rooftop",
                            agent_replication: true,
                        },
                        {
                            agent_id: 102,
                            timestamp: "2023-01-01T10:15:00.000Z",
                            location: "SubwayStation",
                            agent_replication: true,
                        },
                        {
                            agent_id: 103,
                            timestamp: "2023-01-01T10:30:00.000Z",
                            location: null,
                            agent_replication: false,
                        },
                    ],
                },
            ],
            expected: [
                [
                    {
                        mission_id: 3,
                        mission_name: "Defend Zion",
                        mission_description:
                            "Protect the last human city from Sentinels.",
                    },
                    {
                        mission_id: 5,
                        mission_name: "Eliminate Virus",
                        mission_description:
                            "Suspected virus detected within the Matrix code.",
                    },
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
                        mission_id: 4,
                        mission_name: "Rescue Operator",
                        mission_description:
                            "An operator has gone missing in the field.",
                    },
                ],
                [
                    {
                        agent_id: 103,
                        timestamp: "2023-01-01T10:30:00.000Z",
                        location: null,
                        agent_replication: false,
                    },
                    {
                        agent_id: 102,
                        timestamp: "2023-01-01T10:15:00.000Z",
                        location: "SubwayStation",
                        agent_replication: true,
                    },
                    {
                        agent_id: 102,
                        timestamp: "2023-01-01T10:00:00.000Z",
                        location: "Rooftop",
                        agent_replication: true,
                    },
                    {
                        agent_id: 101,
                        timestamp: "2023-01-01T09:30:00.000Z",
                        location: "Downtown",
                        agent_replication: false,
                    },
                    {
                        agent_id: 101,
                        timestamp: "2023-01-01T09:15:00.000Z",
                        location: "Downtown",
                        agent_replication: false,
                    },
                ],
            ],
        },
        [AllConcepts[5]]: {
            numOptions: 4,
            input: [
                {
                    residue: [],
                    archives: [],
                    mission_logs: [],
                    multi_agent_events: [],
                },
            ],
            expected: [
                ["INSERT 0 1"],
                ["INSERT 0 1"],
                ["INSERT 0 1"],
                ["INSERT 0 1"],
            ],
        },
        [AllConcepts[6]]: {
            numOptions: 4,
            input: [
                {
                    residue: [],
                    archives: [],
                    mission_logs: [],
                    multi_agent_events: [],
                },
            ],
            expected: [["UPDATE 1"], ["UPDATE 1"], ["UPDATE 1"], ["UPDATE 1"]],
        },
        [AllConcepts[7]]: {
            numOptions: 4,
            input: [
                {
                    residue: [],
                    archives: [],
                    mission_logs: [],
                    multi_agent_events: [],
                },
            ],
            expected: [["DELETE 1"], ["DELETE 1"], ["DELETE 1"], ["DELETE 1"]],
        },
        [AllConcepts[8]]: {
            numOptions: 1,
            input: [],
            expected: [],
        },
        [AllConcepts[9]]: {
            numOptions: 2,
            input: [
                {
                    multi_agent_events: [
                        {
                            agent_id: 101,
                            timestamp: "2023-01-01T09:15:00.000Z",
                            location: "Downtown",
                            agent_replication: false,
                        },
                        {
                            agent_id: 101,
                            timestamp: "2023-01-01T09:30:00.000Z",
                            location: "Downtown",
                            agent_replication: false,
                        },
                        {
                            agent_id: 102,
                            timestamp: "2023-01-01T10:00:00.000Z",
                            location: "Rooftop",
                            agent_replication: true,
                        },
                        {
                            agent_id: 102,
                            timestamp: "2023-01-01T10:15:00.000Z",
                            location: "SubwayStation",
                            agent_replication: true,
                        },
                        {
                            agent_id: 103,
                            timestamp: "2023-01-01T10:30:00.000Z",
                            location: null,
                            agent_replication: false,
                        },
                    ],
                },
                {
                    mission_logs: [
                        {
                            mission_name: "Free The Mind",
                            agent_id: 101,
                            reference: "Operation started, Morpheus leads",
                        },
                        {
                            mission_name: "Free The Mind",
                            agent_id: 101,
                            reference: "Strange glitch observed in downtown",
                        },
                        {
                            mission_name: "Defend Zion",
                            agent_id: 103,
                            reference: "Sentinel swarm approaching main gate",
                        },
                        {
                            mission_name: "Eliminate Virus",
                            agent_id: 102,
                            reference:
                                "Agent Smith anomaly flagged for investigation",
                        },
                    ],
                },
            ],
            expected: [[], []],
        },
    },

    fantasy: {
        [AllConcepts[0]]: {
            numOptions: 4,
            input: [
                {
                    rings: [
                        { name: "Aragorn", profession: "Ranger" },
                        { name: "Frodo", profession: "RingBearer" },
                        { name: "Gandalf", profession: "Wizard" },
                        { name: "Gollum", profession: null },
                        { name: "Legolas", profession: "ElvenArcher" },
                        { name: "Samwise", profession: "Gardener" },
                        { name: "Bilbo", profession: "RingBearer" },
                        { name: "Sauron", profession: "DarkLord" },
                    ],
                },
                {
                    battle_summaries: [
                        {
                            hero_id: 1,
                            timestamp: "2025-03-05T09:15:00.000Z",
                            location: "PelennorFields",
                            victory: true,
                        },
                        {
                            hero_id: 2,
                            timestamp: "2025-03-05T09:30:00.000Z",
                            location: "MountDoom",
                            victory: true,
                        },
                        {
                            hero_id: 4,
                            timestamp: "2025-03-05T09:45:00.000Z",
                            location: "MountDoom",
                            victory: null,
                        },
                        {
                            hero_id: 3,
                            timestamp: "2025-03-05T10:00:00.000Z",
                            location: null,
                            victory: true,
                        },
                        {
                            hero_id: 5,
                            timestamp: "2025-03-05T10:15:00.000Z",
                            location: "HelmsDeep",
                            victory: true,
                        },
                        {
                            hero_id: 6,
                            timestamp: "2025-03-05T10:30:00.000Z",
                            location: "HelmsDeep",
                            victory: false,
                        },
                    ],
                },
                {
                    chronicles: [
                        { quest_name: "Protect the Ring", quest_description: "Ensure the One Ring never falls into evil hands." },
                        { quest_name: "Assemble the Fellowship", quest_description: "Gather heroes from across Middle‑earth." },
                        { quest_name: "Defend Minas Tirith", quest_description: "Hold the White City against Sauron’s armies." },
                        { quest_name: "Crown the King", quest_description: "Place the rightful king upon the throne." },
                        { quest_name: "Restore the Shire", quest_description: "Rebuild the Hobbits' homeland after the war." },
                    ],
                },
                {
                    quest_logs: [
                        { quest_name: "Protect the Ring", hero_id: 2, reference: "Frodo sets out from the Shire." },
                        { quest_name: "Protect the Ring", hero_id: 6, reference: "Samwise pledges never to leave Frodo’s side." },
                        { quest_name: "Assemble the Fellowship", hero_id: 3, reference: "Council of Elrond chooses nine companions." },
                        { quest_name: "Assemble the Fellowship", hero_id: 5, reference: "Legolas swears loyalty to Aragorn." },
                        { quest_name: "Defend Minas Tirith", hero_id: 3, reference: "Gandalf rallies the defenders at the gate." },
                        { quest_name: "Defend Minas Tirith", hero_id: 1, reference: "Aragorn arrives with the Army of the Dead." },
                        { quest_name: "Crown the King", hero_id: 1, reference: "Aragorn crowned Elessar Telcontar." },
                        { quest_name: "Restore the Shire", hero_id: 2, reference: "Hobbits return to drive out the ruffians." },
                    ],
                },
            ],
            expected: [
                [
                    { name: "Aragorn", profession: "Ranger" },
                    { name: "Frodo", profession: "RingBearer" },
                    { name: "Gandalf", profession: "Wizard" },
                    { name: "Gollum", profession: null },
                    { name: "Legolas", profession: "ElvenArcher" },
                    { name: "Samwise", profession: "Gardener" },
                    { name: "Bilbo", profession: "RingBearer" },
                    { name: "Sauron", profession: "DarkLord" },
                ],
                [
                    {
                        hero_id: 1,
                        timestamp: "2025-03-05T09:15:00.000Z",
                        location: "PelennorFields",
                        victory: true,
                    },
                    {
                        hero_id: 2,
                        timestamp: "2025-03-05T09:30:00.000Z",
                        location: "MountDoom",
                        victory: true,
                    },
                    {
                        hero_id: 4,
                        timestamp: "2025-03-05T09:45:00.000Z",
                        location: "MountDoom",
                        victory: null,
                    },
                    {
                        hero_id: 3,
                        timestamp: "2025-03-05T10:00:00.000Z",
                        location: null,
                        victory: true,
                    },
                    {
                        hero_id: 5,
                        timestamp: "2025-03-05T10:15:00.000Z",
                        location: "HelmsDeep",
                        victory: true,
                    },
                    {
                        hero_id: 6,
                        timestamp: "2025-03-05T10:30:00.000Z",
                        location: "HelmsDeep",
                        victory: false,
                    },
                ],
                [
                    { quest_name: "Protect the Ring", quest_description: "Ensure the One Ring never falls into evil hands." },
                    { quest_name: "Assemble the Fellowship", quest_description: "Gather heroes from across Middle‑earth." },
                    { quest_name: "Defend Minas Tirith", quest_description: "Hold the White City against Sauron’s armies." },
                    { quest_name: "Crown the King", quest_description: "Place the rightful king upon the throne." },
                    { quest_name: "Restore the Shire", quest_description: "Rebuild the Hobbits' homeland after the war." },
                ],
                [
                    { quest_name: "Protect the Ring", hero_id: 2, reference: "Frodo sets out from the Shire." },
                    { quest_name: "Protect the Ring", hero_id: 6, reference: "Samwise pledges never to leave Frodo’s side." },
                    { quest_name: "Assemble the Fellowship", hero_id: 3, reference: "Council of Elrond chooses nine companions." },
                    { quest_name: "Assemble the Fellowship", hero_id: 5, reference: "Legolas swears loyalty to Aragorn." },
                    { quest_name: "Defend Minas Tirith", hero_id: 3, reference: "Gandalf rallies the defenders at the gate." },
                    { quest_name: "Defend Minas Tirith", hero_id: 1, reference: "Aragorn arrives with the Army of the Dead." },
                    { quest_name: "Crown the King", hero_id: 1, reference: "Aragorn crowned Elessar Telcontar." },
                    { quest_name: "Restore the Shire", hero_id: 2, reference: "Hobbits return to drive out the ruffians." },
                ],
            ],
        },
        [AllConcepts[1]]: {
            numOptions: 4,
            input: [
                {
                    battle_summaries: [
                        {
                            hero_id: 1,
                            timestamp: "2025-03-05T09:15:00.000Z",
                            location: "PelennorFields",
                            victory: true,
                        },
                        {
                            hero_id: 2,
                            timestamp: "2025-03-05T09:30:00.000Z",
                            location: "MountDoom",
                            victory: true,
                        },
                        {
                            hero_id: 4,
                            timestamp: "2025-03-05T09:45:00.000Z",
                            location: "MountDoom",
                            victory: null,
                        },
                        {
                            hero_id: 3,
                            timestamp: "2025-03-05T10:00:00.000Z",
                            location: null,
                            victory: true,
                        },
                        {
                            hero_id: 5,
                            timestamp: "2025-03-05T10:15:00.000Z",
                            location: "HelmsDeep",
                            victory: true,
                        },
                        {
                            hero_id: 6,
                            timestamp: "2025-03-05T10:30:00.000Z",
                            location: "HelmsDeep",
                            victory: false,
                        },                        
                    ],
                },
                {
                    chronicles: [
                        { quest_name: "Protect the Ring", quest_description: "Ensure the One Ring never falls into evil hands." },
                        { quest_name: "Assemble the Fellowship", quest_description: "Gather heroes from across Middle‑earth." },
                        { quest_name: "Defend Minas Tirith", quest_description: "Hold the White City against Sauron’s armies." },
                        { quest_name: "Crown the King", quest_description: "Place the rightful king upon the throne." },
                        { quest_name: "Restore the Shire", quest_description: "Rebuild the Hobbits' homeland after the war." },
                    ],
                },
                {
                    rings: [
                        { name: "Aragorn", profession: "Ranger" },
                        { name: "Frodo", profession: "RingBearer" },
                        { name: "Gandalf", profession: "Wizard" },
                        { name: "Gollum", profession: null },
                        { name: "Legolas", profession: "ElvenArcher" },
                        { name: "Samwise", profession: "Gardener" },
                        { name: "Bilbo", profession: "RingBearer" },
                        { name: "Sauron", profession: "DarkLord" },
                    ],                    
                },
                {
                    quest_logs: [
                        { quest_name: "Protect the Ring", hero_id: 2, reference: "Frodo sets out from the Shire." },
                        { quest_name: "Protect the Ring", hero_id: 6, reference: "Samwise pledges never to leave Frodo’s side." },
                        { quest_name: "Assemble the Fellowship", hero_id: 3, reference: "Council of Elrond chooses nine companions." },
                        { quest_name: "Assemble the Fellowship", hero_id: 5, reference: "Legolas swears loyalty to Aragorn." },
                        { quest_name: "Defend Minas Tirith", hero_id: 3, reference: "Gandalf rallies the defenders at the gate." },
                        { quest_name: "Defend Minas Tirith", hero_id: 1, reference: "Aragorn arrives with the Army of the Dead." },
                        { quest_name: "Crown the King", hero_id: 1, reference: "Aragorn crowned Elessar Telcontar." },
                        { quest_name: "Restore the Shire", hero_id: 2, reference: "Hobbits return to drive out the ruffians." },
                    ],
                },
            ],
            expected: [
                [
                    {
                        hero_id: 2,
                        timestamp: "2025-03-05T09:30:00.000Z",
                        location: "MountDoom",
                        victory: true,
                    },
                    {
                        hero_id: 4,
                        timestamp: "2025-03-05T09:45:00.000Z",
                        location: "MountDoom",
                        victory: null,
                    },
                ],
                [
                    { quest_name: "Protect the Ring", quest_description: "Ensure the One Ring never falls into evil hands." },
                    { quest_name: "Crown the King", quest_description: "Place the rightful king upon the throne." },
                ],
                [
                    { name: "Frodo", profession: "RingBearer" },
                    { name: "Bilbo", profession: "RingBearer" },
                ],
                [
                    { quest_name: "Protect the Ring", hero_id: 2, reference: "Frodo sets out from the Shire." },
                    { quest_name: "Defend Minas Tirith", hero_id: 1, reference: "Aragorn arrives with the Army of the Dead." },
                    { quest_name: "Crown the King", hero_id: 1, reference: "Aragorn crowned Elessar Telcontar." },
                    { quest_name: "Restore the Shire", hero_id: 2, reference: "Hobbits return to drive out the ruffians." },
                ],
            ],
        },
        [AllConcepts[2]]: {
            numOptions: 4,
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The One Ring", status: "Precious" }],
        },
        [AllConcepts[3]]: {
            numOptions: 1,
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: [{ name: "The Two Rings", status: null }],
        },
        [AllConcepts[4]]: {
            numOptions: 1,
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
        [AllConcepts[5]]: {
            numOptions: 1,
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        [AllConcepts[6]]: {
            numOptions: 1,
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        [AllConcepts[7]]: {
            numOptions: 1,
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["DELETE 1"],
        },
        [AllConcepts[8]]: {
            numOptions: 1,
            input: [
                {
                    name: "rings",
                    columns: ["name", "status"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        [AllConcepts[9]]: {
            numOptions: 1,
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
        [AllConcepts[0]]: {
            numOptions: 1,
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
        [AllConcepts[1]]: {
            numOptions: 1,
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
        [AllConcepts[2]]: {
            numOptions: 1,
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "Matrix", genre: "Cyberpunk" }],
        },
        [AllConcepts[3]]: {
            numOptions: 1,
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: [{ name: "The Lord of the Rings", status: null }],
        },
        [AllConcepts[4]]: {
            numOptions: 1,
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
        [AllConcepts[5]]: {
            numOptions: 1,
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["INSERT 0 1"],
        },
        [AllConcepts[6]]: {
            numOptions: 1,
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["UPDATE 1"],
        },
        [AllConcepts[7]]: {
            numOptions: 1,
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["DELETE 1"],
        },
        [AllConcepts[8]]: {
            numOptions: 1,
            input: [
                {
                    name: "movies",
                    columns: ["name", "status", "genre"],
                },
            ],
            expected: ["START TRANSACTION", "ROLLBACK"],
        },
        [AllConcepts[9]]: {
            numOptions: 1,
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
