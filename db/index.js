const { Client } = require("pg");
const client = new Client("postgres://localhost:5432/express_router_demo_db");
// console.log("this is Client--------", Client);
// console.log("this is client", client);

const getUsers = async () => {
  return (await client.query('SELECT * FROM "User";')).rows;
};

const getPlaces = async () => {
  return (await client.query('SELECT * FROM "Place";')).rows;
};

const createUser = async ({ name }) => {
  //!creates users, uses parameterized queries!
  //! [name] REPLACES $1
  return (
    await client.query('INSERT INTO "User"(name) VALUES ($1) RETURNING *', [
      name,
    ])
  ).rows[0];
};

const deleteUser = async (id) => {
  await client.query('DELETE FROM "User" WHERE id=$1', [id]); //! DELETE FROM USERS WHERE ID IS EQUAL TO THE [id] WE PASSED IN. $1 IS A PLACEHOLDER FOR [id]
};

async function syncAndSeed() {
  //! CREATING TABLES FOR MY DATABASE
  const SQL = `
    DROP TABLE IF EXISTS "User";
    DROP TABLE IF EXISTS "Place";
    CREATE TABLE "User"(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) NOT NULL UNIQUE
    );
    CREATE TABLE "Place"(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) NOT NULL UNIQUE
    );

      INSERT INTO "User"(name) VALUES('moe');
      INSERT INTO "User"(name) VALUES('lucy');
      INSERT INTO "User"(name) VALUES('mary');
      INSERT INTO "Place"(name) VALUES('NYC');
      INSERT INTO "Place"(name) VALUES('Chicago');
      INSERT INTO "Place"(name) VALUES('LA');
      INSERT INTO "Place"(name) VALUES('Paris');
  `;

  await client.query(SQL);
}

module.exports = {
  client,
  syncAndSeed,
  getUsers,
  getPlaces,
  createUser,
  deleteUser,
};
