const db = require("../db/connection");

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
