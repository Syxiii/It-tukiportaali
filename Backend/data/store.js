export let tickets = [
  {
    id: 1,
    title: "VPN ei toimi",
    description: "VPN ei yhdistä",
    status: "Avoin",
    user: "matti@example.com",
    priority: "Korkea",
    created: "2025-01-10",
    updated: "2025-01-10"
  }
];

export let users = [
  {
    id: 1,
    email: "admin@example.com",
    passwordHash: "$argon2id$v=19$...", // generate once
    role: "admin",
    name: "Admin Käyttäjä"
  }
];

export let nextTicketId = 2;
