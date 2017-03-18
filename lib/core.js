var _ = require('lodash');

const Const = require('./const');
const Log = require('./log');
const Util = require('./util');

var UserService = require('../service/UserService');

var Core = {

    initContext: (req, res, next) => {
        var Context = {
            request: req,
            response: res,
            params: _.merge(req.query, req.body),
            next: next,
            user: undefined,

            update: function () {
                Context.params = _.merge(Context.request.query, Context.request.params, Context.request.body);
                return Context;
            },

            errorFinish: function (code, message) {
                Context.response.json({
                    code: code,
                    message: message
                }).end();
            },

            finish: function (data) {
                Context.response.json({
                    code: 0,
                    data: data
                }).end();
            },

            processError: function (error) {
                if (error.hasOwnProperty('code') && error.hasOwnProperty('message')) {
                    return Context.errorFinish(error.code, error.message);
                }

                Context.errorFinish(-1, '' + error);
            },

            canGuestAccess: function (route) {
                var action = Core.getAction(route);
                return action && action.canGuestAccess;
            }
        };

        return Context;
    },

    auth: (context) => {
        var request = context.request;

        request.header('Access-Control-Allow-Origin', '*');

        if (context.canGuestAccess(request.path)) {
            return Promise.resolve();
        }

        if (request.body.token == undefined) {
            context.errorFinish(Const.ERROR.ERROR_NOT_AUTHORIZED, 'not authorized');
            return Promise.reject();
        }

        var token = request.body.token;
        if (!token) {
            context.errorFinish(Const.ERROR.ERROR_TOKEN_INVALID, 'token is invalid');
            return Promise.reject();
        }
        return UserService.getUserByToken(token).then((user) => {
            context.user = user;
        });
    },

    installAction: (router, actionMap) => {
        var ACTION = {};
        for (var route in actionMap) {
            if (actionMap.hasOwnProperty(route)) {
                var canGuestAccess = _.startsWith(route, '~');
                var action = actionMap[route];
                var func = action[0];
                var arg = action.slice(1);

                var argList = [];
                for (let i = 0; i < arg.length; i++) {
                    argList.push(Util.parseApiKey(arg[i]));
                }

                route = _.trim(route, '~');

                ACTION[route] = {
                    func: func,
                    argList: argList,
                    canGuestAccess: canGuestAccess
                };

                router.get(route, Core.runAction);
                router.post(route, Core.runAction);
            }
        }

        Core.ACTION = ACTION;
    },

    hasAction: (route) => {
        return Core.ACTION.hasOwnProperty(route);
    },

    getAction: (route) => {
        return Core.ACTION[route];
    },

    runAction: (req, res, next) => {
        var path = req.route.path;
        path = _.trimEnd(path, '/');

        if (Core.hasAction(path)) {
            var context = Core.initContext(req, res, next);
            context = context.update();
            Core.auth(context).then(() => {
                var {func, argList} = Core.getAction(path);
                var params = [context];
                for (let i = 0; i < argList.length; i++) {
                    var {key, defaultValue} = argList[i];
                    var value = undefined;
                    if (context.params.hasOwnProperty(key)) {
                        value = defaultValue || context.params[key];
                    }
                    else {
                        if (defaultValue === undefined) {
                            return context.errorFinish(Const.ERROR.ERROR_PARAM_NOT_SET, `param ${key} not set`);
                        }

                        value = defaultValue;
                    }

                    params.push(value);
                }

                func.apply(null, params);
            });
        }
        else {
            next();
        }
    },

    errorHandler: (err, req, res, next) => {
        console.log(err);
        res.status(500).json({
            code: -2,
            message: 'an internal error occurred'
        }).end();
    },

    notFoundHandler: (req, res) => {
        res.status(404).json({
            code: -1,
            message: 'not found'
        }).end();
    }
};

Core.Const = Const;
Core.Log = Log;
Core.Util = Util;

module.exports = Core;
