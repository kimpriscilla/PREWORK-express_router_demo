const { Client } = require("pg");
const client = new Client("postgres://localhost:5432/express_router_demo_db");
//console.log(Client);
//console.log(client);

async function syncAndSeed() {
  const SQL = `
    DROP TABLE IF EXISTS "User";
    CREATE TABLE "User"(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) NOT NULL UNIQUE
    );
      INSERT INTO "User"(name) VALUES('moe');
  `;
  await client.query(SQL);
}

const start = async () => {
  try {
    await client.connect();
    await syncAndSeed();
  } catch (error) {
    console.log(error);
  }
};

start();
