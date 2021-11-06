const {
  client,
  syncAndSeed,
  getUsers,
  getPlaces,
  createUser,
  deleteUser,
} = require("./db");

const express = require("express"); //!STARTING UP HOMEPAGE NOW
const app = express();
const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets"))); //!GIVES US ACCESS TO OUR STLYING SHEET IN ASSETS FOLDER

app.use(express.urlencoded({ extended: false })); //!parses our data to readable data? look it up

app.use(require("method-override")("_method")); //!By default, itll look at URL request and if a POST itll change the action to whatever comes after _method. _method overrides any method before that

const nav = ({ users, places }) =>
  `<ul id ='nav'>
  <li> <a href ='/'> Home </a> </li>
  <li><a href = '/users'>Users(${users.length})</a> </li>
  <li><a href ='/places'>Places(${places.length})</a></li>
  </ul>`;

const head = ({ title }) => `
  <head>
  <link rel='stylesheet' href = '/assets/styles.css'/>
  <title>${title}</title>
  </head>
  `;

app.get("/", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(
      `<html>
      ${head({ title: "Acme Home" })}
        <body>
          ${nav({ users, places })}
        <h1>Welcome to Acme Users and Places</h1>
        </body>
      </html>`
    );
  } catch (error) {
    next(error);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(
      `<html>
       ${head({ title: "Users" })}
        <body>
        ${nav({ users, places })}
        <form method='POST'>
        <input name='name'/>
        <button> Create </button>
        </form>
        ${users
          .map(
            (user) =>
              `<li>
              ${user.name}
              <form method = 'POST' action='/users/${user.id}?_method=DELETE'>
              <button>X</button>
              </form>
            </li>`
          )
          .join("")}
        </body>
      </html>`
    );
  } catch (error) {
    next(error);
  }
});

app.post("/users", async (req, res, next) => {
  try {
    await createUser(req.body); //!whatever the user posts, aka new name, pass that req.body(which is a name user inputted) into createUser func
    res.redirect("/users"); //! and redirect the page back to /users
  } catch (error) {
    next(error);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.redirect("/users"); //! and redirect the page back to /users
  } catch (error) {
    next(error);
  }
});

app.get("/places", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(
      `<html>
       ${head({ title: "Places" })}
        <body>
        ${nav({ users, places })}


        ${places
          .map(
            (place) =>
              `<li>
              ${place.name}
            </li>`
          )
          .join("")}
        </body>
      </html>`
    );
  } catch (error) {
    next(error);
  }
});

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

    const PORT = 3000;
    app.listen(PORT, () => {
      //!START UP HOMEPAGE AFTER DATABASE GETS CONNECTED & SYNCED!!
      console.log(`listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
