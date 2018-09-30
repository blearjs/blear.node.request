/**
 * 单元测试 basic
 * @author 云淡然
 * @create 2018年09月30日09:29:55
 */


var expect = require('chai-jasmine').expect;
var server = require('./sever');
var request = require('../src/index');

describe('cookies', function () {

    it('main', function (done) {
        server(done, function (app, stop) {

            app.get('/cookies', function (req, res) {
                res.send(req.headers.cookie);
            });

            var cookies = {
                a: 1
            };

            request({
                url: app.$remote('/cookies'),
                cookies: cookies
            }, function (err, body) {
                expect(body).toEqual('a=1');
                stop();
            });

        });
    });

});







