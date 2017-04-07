/**
 * 文件描述
 * @author ydr.me
 * @create 2017-04-07 18:00
 * @update 2017-04-07 18:00
 */


'use strict';

var request = require('../src/index');

request({
    url: 'http://localhost:2017',
    debug: true
}, function (err, body, res) {
    console.log(err);

    if (!err) {
        console.log(body);
        console.log(res.statusCode);
        console.log(res.headers);
    }
});

