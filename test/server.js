/**
 * 文件描述
 * @author ydr.me
 * @create 2017-04-07 18:00
 * @update 2017-04-07 18:00
 */


'use strict';

var http = require('http');

http.createServer(function (req, res) {
    res.end(JSON.stringify({
        'request url': req.url,
        'request headers': req.headers
    }, null, 4));
}).listen(2017);


