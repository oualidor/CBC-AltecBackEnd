const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')

const ClientWallet = db.define('ClientWallet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    balance: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    stat: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = ClientWallet;