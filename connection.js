const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "asd",
  database: "postgres",
});

module.exports = client;
