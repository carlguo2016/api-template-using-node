var Sequelize = require('sequelize');
const db = require('../lib/db');
var sequelize = db.getSequelize();

var Token = function () {
    return sequelize.define('token', {
        id: {type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true},
        token: {type: Sequelize.STRING, defaultValue: ''},
        user_id: {type: Sequelize.BIGINT},
        expire_time: {type: Sequelize.BIGINT, defaultValue: 0},
        create_time: {type: Sequelize.BIGINT, defaultValue: 0},
        update_time: {type: Sequelize.BIGINT, defaultValue: 0}
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });
};

module.exports = Token;

