const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const Transaction = db.define('Transaction',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

db.sync()


module.exports = Transaction;