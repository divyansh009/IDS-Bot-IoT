const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "password",
  database : "bot_iot"
});
module.exports = connection