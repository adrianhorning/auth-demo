const mysql = require('mysql');
const config = require('./config/db');

let db;
const connectDatabase = () => {
    if (!db) {
        db = mysql.createPool(config);

        db.getConnection(err => {
            if (err) {
                console.log('Error connecting database');
            } else {
                console.log('Database is connected');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();
