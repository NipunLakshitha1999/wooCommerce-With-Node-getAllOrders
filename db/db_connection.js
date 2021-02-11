var mysql = require('mysql')
var db;

function getConnection() {
    if (!db) {
        db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'wooCommersOrders'
        });
    }
    return db;
}

module.exports = getConnection();
