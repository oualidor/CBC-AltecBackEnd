const Sequelize = require('sequelize');
//Local
/*
const db = new Sequelize('cbc-altec', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
});

 */
let host  = "sql5.freemysqlhosting.net"
const db = new Sequelize('sql5439528', 'sql5439528', 'yysX4snjwI', {
    host: host,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
});




module.exports = db;