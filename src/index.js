/**
 * 文件描述
 * @author ydr.me
 * @create 2017-04-07 16:24
 * @update 2017-04-07 16:24
 */


'use strict';

var object = require('blear.utils.object');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');
var fun = require('blear.utils.function');

var Request = require('./request.class');

var defaults = {
    // url 查询参数
    query: null,
    // string
    body: null,
    // application/json
    json: null,
    // application/x-www-form-urlencoded
    form: null,
    // multipart/form-data
    formData: null,
    headers: {},
    cookies: {},
    url: '/',
    proxy: null,
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
        referer: true,
        // 是否保持 cookie
        cookie: true
    },
    // 是否严格 SSL
    strictSSL: false,
    // 是否调试模式
    debug: false
};

function request(options, callback) {
    var args = access.args(arguments);

    options = object.assign({}, defaults, options);
    options.method = options.method.toUpperCase();
    options.qs = options.query;

    if (typeis.Object(options.browser)) {
        options.headers = object.assign({}, {
            accept: options.browser.accept,
            'accept-encoding': options.browser['accept-encoding'],
            'accept-language': options.browser['accept-language'],
            'user-agent': options.browser['user-agent'],
            'cache-control': options.browser['cache-control']
        }, options.headers);
    }

    if (typeis.Object(options.cookies)) {
        options.headers.cookie = options.headers.cookie || '';
        var cookies = [];
        object.each(options.cookies, function (key, val) {
            cookies.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
        });
        options.headers.cookie += cookies.join(';');
    }

    if (typeis.Object(options.json)) {
        options.body = JSON.stringify(options.json);
    }
    // compact
    else if (typeis.Object(options.body)) {
        options.body = JSON.stringify(options.body);
    }

    options.json = false;
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
            if (err) {
                return response.call(this, err);
            }

            var headers = res.headers;
            res.cookies = (headers['set-cookie'] || []).map(function (val) {
                var o = {};
                val.split(/;\s+/).forEach(function (slice, index) {
                    var group = slice.split('=');
                    var key = decodeURIComponent(group[0]);
                    var val = decodeURIComponent(group[1] || '');

                    // desc
                    if (index) {
                        o[key.toLowerCase()] = val;
                    } else {
                        o.key = key;
                        o.val = val;
                    }
                });
                return o;
            });

            response.call(
                this,
                null,
                options.method === 'HEAD' ? res && res.headers : body,
                res
            );
        };
    }

    return new Request(options);
}

request.defaults = defaults;
request.head = buildExports('HEAD');
request.get = buildExports('GET');
request.post = buildExports('POST');
request.put = buildExports('PUT');
request.delete = buildExports('DELETE');
module.exports = request;

// =================================================
// =================================================
// =================================================

/**
 * 构建出口函数
 * @param method
 * @param [extra]
 * @returns {Function}
 */
function buildExports(method, extra) {
    return function (options, callback) {
        if (typeis.String(options)) {
            options = {
                url: options
            };
        }

        options.method = method;
        object.assign(options, extra);
        return request(options, callback);
    };
}
