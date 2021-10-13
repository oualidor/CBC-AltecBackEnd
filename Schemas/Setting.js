const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')
const Setting = db.define('Settings', {
    name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    dataType: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    dataTitle: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    dataValue: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    stat: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

db.sync()

module.exports = Setting;