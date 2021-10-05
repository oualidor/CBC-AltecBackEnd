const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const RechargeCode = db.define('RechargeCode',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        hashedCode : {
            type: Sequelize.STRING,
            allowNull: false
        },
        stat : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

db.sync()


module.exports = RechargeCode;