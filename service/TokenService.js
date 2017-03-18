var UUID = require('node-uuid');

const Util = require('../lib/util');
const Log = require('../lib/log');

var Token = require('../model/token');

function makeToken(userId) {
    var token = UUID.v1();
    token = token.replace(/-/g, '');

    return Token().build({
        token: token,
        user_id: userId,
        create_time: Util.time(),
        update_time: Util.time()
    }).save().then(function () {
        return token;
    }).catch(function (error) {
        Log.e(`save table token error: ${error}`);
    });
}

var TokenService = {
    makeToken: makeToken
};

module.exports = TokenService;