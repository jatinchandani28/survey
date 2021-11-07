
const mysql = require('mysql2');
const util = require("util");
require("dotenv").config();

const connection =mysql.createPool({
    host:"localhost",
    user:"root" ,
    port: '3306',
    password :null ,
    database: "survey",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = connection;