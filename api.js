var UserController = require('./controller/UserController');

/**
 * ~ 开头表示无需验证token
 * [UserController.login, 'username, 13800000001', 'password'], username 默认值是13800000001
 */

var ApiList = {

    /*============================================================
     User相关Api
     ============================================================*/
    '~/v1/user/login':                           [UserController.login, 'username', 'password'],
    '~/v1/user/register':                        [UserController.register, 'username, 15535596729', 'password'],
    '/v1/user/detail':                           [UserController.detail],
    '/v1/user/list':                             [UserController.userList],
};

module.exports = ApiList;