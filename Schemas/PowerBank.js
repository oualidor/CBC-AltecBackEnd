const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const PowerBank = db.define('PowerBank', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    currentStation : {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    stat : {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


module.exports = PowerBank;