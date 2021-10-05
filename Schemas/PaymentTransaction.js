const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const PaymentTransaction = db.define('PaymentTransaction',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        clientId : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount : {
            type: Sequelize.STRING,
            allowNull: false
        },
        powerBankId : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        type : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

db.sync()


module.exports = PaymentTransaction;