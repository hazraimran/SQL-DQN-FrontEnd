export const queries = {
  cyberpunk: {
    schema: [
      {
        name: "residue",
        columns: ["name", "status"],
      },
    ],
    "basic SELECT and FROM": {
      expected: [
        { name: "Neo", status: "PotentialRebel" },
        { name: "Trinity", status: "PotentialRebel" },
        { name: "Jane Doe", status: "PotentialRebel" },
        // { name: 'Morpheus', status: 'Captain' },
      ],
    },
    "basic WHERE clause": {
      expected: [
        { name: "Neo", status: "PotentialRebel" },
        { name: "Trinity", status: "PotentialRebel" },
      ],
    },
    "pattern matching with LIKE": {
      expected: [{ name: "Trinity", status: "PotentialRebel" }],
    },
    "handle NULL values": {
      expected: [{ name: "Jane Doe", status: null }],
    },
    "ORDER BY clause": {
      expected: [
        { name: "Jane Doe", status: "PotentialRebel" },
        { name: "Morpheus", status: "Captain" },
        { name: "Neo", status: "PotentialRebel" },
        { name: "Trinity", status: "PotentialRebel" },
      ],
    },
    "INSERT Statement": {
      expected: ["INSERT 0 1"],
    },
    "UPDATE Statement": {
      expected: ["UPDATE 1"],
    },
    "DELETE Statement": {
      expected: ["DELETE 1"],
    },
    "basic TRANSACTION usage (ROLLBACK)": {
      expected: ["START TRANSACTION", "ROLLBACK"],
    },
    "basic TRANSACTION usage (COMMIT)": {
      expected: ["START TRANSACTION", "COMMIT"],
    },
  },

  fantasy: {
    schema: [
      {
        name: "rings",
        columns: ["name", "status"],
      },
    ],
    "basic SELECT and FROM": {
      expected: [
        { name: "The One Ring", status: "Precious" },
        { name: "The Two Rings", status: "Powerful" },
        { name: "The Three Rings", status: "Elven" },
        { name: "The Seven Rings", status: "Dwarven" },
      ],
    },
    "basic WHERE clause": {
      expected: [{ name: "The One Ring", status: "Precious" }],
    },
    "pattern matching with LIKE": {
      expected: [{ name: "The One Ring", status: "Precious" }],
    },
    "handle NULL values": {
      expected: [{ name: "The Two Rings", status: null }],
    },
    "ORDER BY clause": {
      expected: [
        { name: "The One Ring", status: "Precious" },
        { name: "The Seven Rings", status: "Dwarven" },
        { name: "The Three Rings", status: "Elven" },
        { name: "The Two Rings", status: "Powerful" },
      ],
    },
    "INSERT Statement": {
      expected: ["INSERT 0 1"],
    },
    "UPDATE Statement": {
      expected: ["UPDATE 1"],
    },
    "DELETE Statement": {
      expected: ["DELETE 1"],
    },
    "basic TRANSACTION usage (ROLLBACK)": {
      expected: ["START TRANSACTION", "ROLLBACK"],
    },
    "basic TRANSACTION usage (COMMIT)": {
      expected: ["START TRANSACTION", "COMMIT"],
    },
  },

  "real-world": {
    schema: [
      {
        name: "media",
        columns: ["name", "genre", "status"],
      },
    ],
    "basic SELECT and FROM": {
      expected: [
        { name: "Matrix", genre: "Cyberpunk" },
        { name: "2077", status: "Cyberpunk" },
        { name: "The Lord of the Rings", status: "Fantasy" },
        { name: "Harry Potter", status: "Fantasy" },
      ],
    },
    "basic WHERE clause": {
      expected: [
        { name: "Matrix", genre: "Cyberpunk" },
        { name: "2077", status: "Cyberpunk" },
      ],
    },
    "pattern matching with LIKE": {
      expected: [{ name: "Matrix", genre: "Cyberpunk" }],
    },
    "handle NULL values": {
      expected: [{ name: "The Lord of the Rings", status: null }],
    },
    "ORDER BY clause": {
      expected: [
        { name: "Harry Potter", status: "Fantasy" },
        { name: "Matrix", genre: "Cyberpunk" },
        { name: "2077", status: "Cyberpunk" },
        { name: "The Lord of the Rings", status: "Fantasy" },
      ],
    },
    "INSERT Statement": {
      expected: ["INSERT 0 1"],
    },
    "UPDATE Statement": {
      expected: ["UPDATE 1"],
    },
    "DELETE Statement": {
      expected: ["DELETE 1"],
    },
    "basic TRANSACTION usage (ROLLBACK)": {
      expected: ["START TRANSACTION", "ROLLBACK"],
    },
    "basic TRANSACTION usage (COMMIT)": {
      expected: ["START TRANSACTION", "COMMIT"],
    },
  },

  1: {
    branchName: "basic SELECT and FROM",
    storyNarrative: `
      Neo is on a mission to identify potential rebels in the Matrix.
      He needs to query the 'residue' table to find them.
    `,
    expected: [
      { name: "Neo", status: "PotentialRebel" },
      { name: "Trinity", status: "PotentialRebel" },
      { name: "Jane Doe", status: "PotentialRebel" },
      { name: "Morpheus", status: "Captain" },
    ],
  },

  2: {
    branchName: "basic WHERE clause",
    storyNarrative: `
      Neo needs to narrow down his search to only those rebels
      who have a high probability of being The One.
    `,
    expected: [
      { name: "Neo", status: "PotentialRebel" },
      { name: "Trinity", status: "PotentialRebel" },
    ],
  },

  3: {
    branchName: "pattern matching with LIKE",
    storyNarrative: `
      Neo needs to find rebels with names that start from the letter 'T'.
    `,
    expected: [{ name: "Trinity", status: "PotentialRebel" }],
  },

  4: {
    branchName: "handle NULL values",
    storyNarrative: `
      Neo needs to find humans with unknown - 'null' status and set them to 'PotentialRebel'.
    `,
    expected: [{ name: "Jane Doe", status: null }],
  },

  5: {
    branchName: "ORDER BY clause",
    storyNarrative: `
      Neo needs to sort the rebels by their names.
    `,
    expected: [
      { name: "Jane Doe", status: "PotentialRebel" },
      { name: "Morpheus", status: "Captain" },
      { name: "Neo", status: "PotentialRebel" },
      { name: "Trinity", status: "PotentialRebel" },
    ],
  },

  6: {
    branchName: "INSERT Statement",
    storyNarrative: `
      Neo needs to add a new rebel to the 'residue' table.
    `,
    expected: ["INSERT 0 1"],
  },

  7: {
    branchName: "UPDATE Statement",
    storyNarrative: `
      Neo needs to update the status of Trinity to 'Partner'.
    `,
    expected: ["UPDATE 1"],
  },

  8: {
    branchName: "DELETE Statement",
    storyNarrative: `
      Neo needs to remove Jane Doe from the 'residue' table.
    `,
    expected: ["DELETE 1"],
  },

  9: {
    branchName: "basic TRANSACTION usage (ROLLBACK)",
    storyNarrative: `
      Neo needs to perform a transaction that should be rolled back.
    `,
    expected: ["START TRANSACTION", "ROLLBACK"],
  },

  10: {
    branchName: "basic TRANSACTION usage (COMMIT)",
    storyNarrative: `
      Neo needs to perform a transaction
      that should be committed.
    `,
    expected: ["START TRANSACTION", "COMMIT"],
  },
};