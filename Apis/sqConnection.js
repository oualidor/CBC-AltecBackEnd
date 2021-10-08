const Sequelize = require('sequelize');
//Local
/*
const db = new Sequelize('cbc-altec', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
});


let host  = "sql5.freemysqlhosting.net"
const db = new Sequelize('sql5439528', 'sql5439528', 'yysX4snjwI', {
    host: host,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
});

 */

let host  = "164.132.59.129"
const db = new Sequelize('ppdb', 'postgres', 'kn?t!CkNht@khut', {

    host: host,
    dialect: 'postgres',
    port: "5432",
    operatorsAliases: false,
    logging: false
});




module.exports = db;