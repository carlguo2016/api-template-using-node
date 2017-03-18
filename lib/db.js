var Sequelize = require('sequelize');

const Config = require('../lib/config');

var sequelize;

function getSequelize() {
    if (!sequelize) {
        sequelize = new Sequelize(Config.MYSQL_DB, Config.MYSQL_USER, Config.MYSQL_PASS, {
            host: Config.MYSQL_HOST,
            dialect: 'mysql',
            pool: {
                max: 10,
                min: 0,
                idle: 10000
            },
            logging: false
        });
    }

    return sequelize;
}

module.exports = {
    getSequelize: getSequelize
};