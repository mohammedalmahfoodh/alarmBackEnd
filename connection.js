const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kokumation",
    database: "level_master",
    multipleStatements: true
});


mysqlConnection.connect((err) => {
    if (err) {
        throw err
    } else {
        console.log('Connecte')
    }
});

module.exports = mysqlConnection;