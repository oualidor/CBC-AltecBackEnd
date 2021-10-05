const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const RentTransaction = db.define('RentTransactions',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        StationId : {
            type: Sequelize.STRING,
            allowNull: false
        },
        clientId : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        powerBankId : {
            type: Sequelize.STRING,
            allowNull: false
        },
        type : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

db.sync()


module.exports = RentTransaction;