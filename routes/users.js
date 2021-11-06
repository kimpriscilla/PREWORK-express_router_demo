const { getUsers, getPlaces, createUser, deleteUser } = require("../db");

const app = require("express").Router();
module.exports = app;

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
  //!Dont forget to remove users after / bc it's already mounted on server.js
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

app.post("/", async (req, res, next) => {
  try {
    await createUser(req.body); //!whatever the user posts, aka new name, pass that req.body(which is a name user inputted) into createUser func
    res.redirect("/users"); //! and redirect the page back to /users
  } catch (error) {
    next(error);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.redirect("/users"); //! and redirect the page back to /users
  } catch (error) {
    next(error);
  }
});
