const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection')


const PartnerImages = db.define('PartnerImages', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    partnerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    link: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
});

db.sync()

module.exports = PartnerImages;