/**
 * 文件描述
 * @author ydr.me
 * @create 2017-04-07 16:24
 * @update 2017-04-07 16:24
 */


'use strict';

var http = require('http');
var https = require('https');
var kernel = require('request');
var object = require('blear.utils.object');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');
var fun = require('blear.utils.function');
var console = require('blear.node.console');
var debug = require('blear.node.debug');
var Class = require('blear.classes.class');

var pkg = require('../package.json');

var defaults = {
    query: {},
    body: {},
    headers: {},
    cookies: {},
    url: '/',
    // 请求方法
    method: 'get',
    // 响应编码
    encoding: 'utf8',
    // 最大 30x 跳转次数
    maxRedirects: 10,
    // 超时时间：15 秒
    timeout: 15000,
    // 是否模拟浏览器
    browser: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'accept-encoding': 'gzip',
        'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) ' +
        'AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 ' +
        pkg.name + '/' + pkg.version,
        'cache-control': 'no-cache',
        host: true,
        origin: true,
        // 经典错误，应为 referrer
        referer: true
    },
    // 是否严格 SSL
    strictSSL: false,
    // 是否调试模式
    debug: false
};

var Request = Class.ify(kernel.Request).extend({
    constructor: function (options) {
        this.httpModules = {
            'http:': overideHttpModule(this, http),
            'https:': overideHttpModule(this, https)
        };

        var requestedList = [];
        var debugHead = function (method, url) {
            if (!options.debug) {
                return;
            }

            console.log();
            console.log();
            console.infoWithTime(console.pretty(method + ' ' + url, 'magenta'));
        };
        var debugInfo = function (event, val) {
            if (!options.debug) {
                return;
            }

            debug.info(event, val);
        };

        this.on('beforeRequest', function () {
            if (!typeis.Object(options.browser)) {
                return;
            }

            if (options.browser.host === true) {
                this.setHeader('host', this.uri.host);
            } else if (typeis.String(options.browser.host)) {
                this.setHeader('host', options.browser.host);
            }

            if (options.browser.origin === true) {
                this.setHeader('origin', this.uri.protocol + '//' + this.uri.host);
            } else if (typeis.String(options.browser.origin)) {
                this.setHeader('origin', options.browser.origin);
            }

            if (options.browser.referer === true) {
                this.setHeader('referer', this.uri.href);
            } else if (typeis.String(options.browser.referer)) {
                this.setHeader('referer', options.browser.referer);
            }
        });

        this.on('request', function (req) {
            requestedList.push(this.href);
            debugHead(this.method, this.href);
            debugInfo('request headers', req._headers);
            debugInfo('request query', options.query);
            debugInfo('request body', options.body);
        });

        this.on('error', function (error) {
            debugHead(this.method, this.href);
            debugInfo('request error', error);
        });

        this.on('response', function (res) {
            debugHead(this.method, this.href);
            debugInfo('response statusCode', res.statusCode);
            debugInfo('response headers', res.headers);
        });

        this.on('body', function (body) {
            debugInfo('response body', body);
        });

        this.requestedList = requestedList;
        Request.parent(this, options);
    }
});

function request(options, callback) {
    var args = access.args(arguments);

    options = object.assign({}, defaults, options);
    options.method = options.method.toUpperCase();

    if (typeis.Object(options.browser)) {
        options.headers = object.assign({}, {
            accept: options.browser.accept,
            'accept-encoding': options.browser['accept-encoding'],
            'accept-language': options.browser['accept-language'],
            'user-agent': options.browser['user-agent'],
            'cache-control': options.browser['cache-control']
        }, options.headers);
    }

    options.json = options.body;
    options.body = null;

    if (options.encoding === 'binary') {
        options.encoding = null;
        options.callback = fun.ensure(callback);
    }

    if (args.length === 2
        && typeis.Function(callback)
        && !typeis.Function(options.callback)
    ) {
        options.callback = callback;
    }

    var response = options.callback;

    if (typeis.Function(response)) {
        options.callback = function (err, res, body) {
            this.emit('body', body);
            response.call(this, err, body, res);
        };
    }

    return new Request(options);
}

request.defaults = defaults;
module.exports = request;

// =================================================
function overideHttpModule(client, original) {
    var overided = object.assign({}, original);

    overided.request = function (options, cb) {
        client.emit('beforeRequest');
        return new original.ClientRequest(options, cb);
    };

    return overided;
}
