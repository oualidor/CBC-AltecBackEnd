const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const Partner = db.define('Partner', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mail: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fullName: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    stat: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    x: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    y: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
});

module.exports = Partner;