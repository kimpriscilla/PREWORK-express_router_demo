const { getUsers, getPlaces } = require("../db");

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
