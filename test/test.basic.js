/**
 * 单元测试 basic
 * @author 云淡然
 * @create 2018年09月30日09:29:55
 */


var expect = require('chai-jasmine').expect;
var server = require('./sever');
var request = require('../src/index');

describe('basic', function () {

    it('main', function (done) {
        server(done, function (app, stop) {

            app.get('/basic', function (req, res) {
                res.send('ok');
            });

            request({
                url: app.$remote('/basic')
            }, function (err, body) {
                expect(body).toEqual('ok');
                stop();
            });

        });
    });

});







