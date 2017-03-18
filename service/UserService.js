const Util = require('../lib/util');
const Const = require('../lib/const');

var User = require('../model/user');
var Token = require('../model/token');
var TokenService = require('./tokenService');

function login(username, password) {
    var userModel;

    return User().findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if (!user) {
            return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXIST, 'user not exists'));
        }
        if (Util.md5(password) != user.password) {
            return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXIST, 'password error'))
        }
        user.update_time = Util.time();
        return user.save();
    }).then((user) => {
        return User.processModel(user, User.detailAttributes);
    }).then((user) => {
        userModel = user;
        return TokenService.makeToken(user.id);
    }).then((token) => {
        return {
            token: token,
            user: userModel
        };
    });
}

function register(username, password) {
    if (!Util.isPhoneNumber(username)) {
        return Promise.reject(Util.makeError(Const.ERROR.ERROR_WRONG_PARAM, '手机号码不正确'));
    }

    var userData;

    return User().findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if (user) {
            return Promise.reject(Util.makeError(Const.ERROR.ERROR_ALREADY_EXISTS, 'user already exists'));
        }
        return User().build({
            username: username,
            password: Util.md5(password.toString()),
            create_time: Util.time(),
            update_time: Util.time()
        }).save();
    }).then((user) => {
        userData = {
            user_id: user.id,
            username: user.username
        };
        return {user: userData};
    });
}

function getUserByToken(token) {
    return Token().findOne({
        where: {
            token: token
        }
    }).then((data) => {
        var userId = data.user_id;

        return User().findById(userId)
            .then((user) => {
                return user;
            });
    });
}

function getUserList() {
    return User().findAll();
}

var UserService = {
    login: login,
    register: register,
    getUserByToken: getUserByToken,
    getUserList: getUserList
};

module.exports = UserService;