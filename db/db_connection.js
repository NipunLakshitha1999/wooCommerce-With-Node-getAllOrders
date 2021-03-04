var mysql = require('mysql')
var db;

function getConnection() {
    if (!db) {
        db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'courier_db'
        });
    }
    return db;
}

module.exports = getConnection();
