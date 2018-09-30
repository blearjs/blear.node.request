/**
 * 单元测试 basic
 * @author 云淡然
 * @create 2018年09月30日09:29:55
 */


var expect = require('chai-jasmine').expect;
var server = require('./sever');
var request = require('../src/index');

describe('cookies', function () {

    it('get', function (done) {
        server(done, function (app, stop) {

            app.get('/', function (req, res) {
                res.send(req.headers.cookie);
            });

            var cookies = {
                a: 1
            };

            request({
                url: app.$remote('/'),
                cookies: cookies
            }, function (err, body) {
                expect(body).toEqual('a=1');
                stop();
            });

        });
    });

    it('set', function (done) {
        server(done, function (app, stop) {

            app.get('/', function (req, res) {
                res.cookie('b', 2);
                res.send(req.headers.cookie);
            });

            var cookies = {
                a: 1
            };

            request({
                url: app.$remote('/'),
                cookies: cookies
            }, function (err, body, res) {
                expect(body).toEqual('a=1');
                expect(res.cookies.length).toBe(1);
                expect(res.cookies[0].key).toBe('b');
                expect(res.cookies[0].val).toBe('2');
                expect(res.cookies[0].path).toBe('/');
                stop();
            });

        });
    });

});







