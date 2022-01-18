const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')
const MeetingRequest = db.define('MeetingRequests', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    clientType:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
    },
    mail: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    preferredTime: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    reason: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    stat: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

});

db.sync()

module.exports = MeetingRequest;
