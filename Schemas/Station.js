const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const Station = db.define('Station', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    currentPartner : {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    stat : {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


module.exports = Station;