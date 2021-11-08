const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')

const ClientWallet = db.define('ClientWallet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false
    },
    balance: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0"
    },
    stat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
    },
});

module.exports = ClientWallet;