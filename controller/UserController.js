var UserService = require('../service/UserService');

function login(context, username, password) {
    UserService.login(username, password).then((data) => {
        context.finish(data);
    }).catch((error) => {
        context.processError(error);
    });
}

function register(context, username, password) {
    UserService.register(username, password).then((data) => {
        context.finish(data);
    }).catch((error) => {
        context.processError(error);
    })
}

function detail(context) {
    context.finish({user: context.user});
}

function userList(context) {
    UserService.getUserList().then((data) => {
        context.finish({list: data});
    }).catch((error) => {
        context.processError(error);
    });
}

var User = {
    login: login,
    register: register,
    detail: detail,
    userList: userList
};

module.exports = User;