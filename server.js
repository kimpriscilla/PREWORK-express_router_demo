const {
  client,
  syncAndSeed,
  getUsers,
  getPlaces,
  createUser,
  deleteUser,
} = require("./db");

const start = async () => {
  try {
    await client.connect(); //! connects to database
    await syncAndSeed(); //!syncs my data into my database
    const curly = await createUser({ name: "curly" });
    console.log(curly);
    console.log(await getUsers()); //! gets users from database
    console.log(await getPlaces());
    await deleteUser(curly.id);
    console.log(await getUsers());
  } catch (error) {
    console.log(error);
  }
};

start();
