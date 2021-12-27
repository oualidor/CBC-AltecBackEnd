const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const Message = db.define('Message',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName : {
            type: Sequelize.STRING,
            allowNull: false
        },
        type : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        phone : {
            type: Sequelize.STRING,
            allowNull: false
        },
        mail : {
            type: Sequelize.STRING,
            allowNull: false
        },
        preferredTime : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        reason : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

db.sync()


module.exports = Message;