

const Sequelize = require('sequelize');


const db = require('../apis/sqConnection');

const Transaction = require('./Transaction')
const TransactionMetaData = db.define('TransactionMetaData', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transactionId: {
        type: Sequelize.INTEGER,
    },
    dataTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dataValue: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

TransactionMetaData.belongsTo(Transaction, {
    foreignKey: {
        name: 'transactionId'
    }
});
db.sync();
module.exports = TransactionMetaData;