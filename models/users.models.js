const db = require("../db/connection");
const { checkIfExists } = require("../db/seeds/utils");

exports.selectUsers = () => {
  return db
    .query(
      `
    SELECT * from users;
    `
    )
    .then((res) => {
      return res.rows;
    });
};

exports.selectUserByUsername = (username) => {
  const re = new RegExp(/[a-z]+/gi);

  if (!re.test(username)) {
    return Promise.reject({ status: 400, msg: "Invalid username" });
  }

  return checkIfExists("users", "username", username)
    .then(() => {
      return db.query(
        `
      SELECT * FROM users
      WHERE username = $1;
      `,
        [username]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};
