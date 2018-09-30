/**
 * 文件描述
 * @author ydr.me
 * @create 2018-09-30 09:25
 * @update 2018-09-30 09:25
 */


'use strict';

var http = require('http');
var express = require('express');

/**
 * 启动一个服务器，用于单元测试
 * @param done
 * @param callback
 */
module.exports = function (done, callback) {
    var app = express();
    var server = http.createServer(app);

    server.listen(0, function (err) {
        if (err) {
            return done(err);
        }

        var port = this.address().port;

        app.$remote = function (pathname) {
            return 'http://localhost:' + port + pathname;
        };

        callback(app, function () {
            server.close(done);
            app = null;
            server = null;
        });
    });
};


