const Sequelize = require('sequelize');
const db = require('../Apis/sqConnection');

const Ads = db.define('AdminAds', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: Sequelize.STRING(500)
    },
    type: {
        type: Sequelize.INTEGER
    },
    stat: {
        type: Sequelize.INTEGER
    }
});

export default Ads