const Sequelize = require('sequelize');

const db = new Sequelize('cbc-altec', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
});



module.exports = db;