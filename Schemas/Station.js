const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const Station = db.define('Station',
    {
        systemId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id : {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        currentPartner : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        stat : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

db.sync()


module.exports = Station;