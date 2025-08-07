const db = require("./db");

db.query("SELECT NOW()", (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  db.end();
});
