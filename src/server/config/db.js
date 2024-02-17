const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: 'mysql.default',
    user: 'root',
    password: 'reinvent',
    database: 'gh_data_2'
});

conn.connect((err) => {
    if (err) {
        console.log("mysql conn err: ", err);
        throw err;
    }
    console.log("Connected to mysql server");
});

module.exports = conn;
