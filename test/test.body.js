/**
 * 单元测试 basic
 * @author 云淡然
 * @create 2018年09月30日09:29:55
 */


var expect = require('chai-jasmine').expect;
var server = require('./sever');
var request = require('../src/index');

describe('body', function () {

    it('json', function (done) {
        server(done, function (app, stop) {

            app.post('/', function (req, res) {
                expect(req.headers['content-type']).toEqual('application/json');
                res.send(JSON.stringify(req.body));
            });

            var json = {
                a: 1
            };

            request({
                url: app.$remote('/'),
                json: json,
                method: 'post'
            }, function (err, body) {
                expect(body).toEqual('{"a":1}');
                stop();
            });

        });
    });

    it('form', function (done) {
        server(done, function (app, stop) {

            app.post('/', function (req, res) {
                expect(req.headers['content-type']).toEqual('application/x-www-form-urlencoded');
                res.send(JSON.stringify(req.body));
            });

            var form = {
                a: 1
            };

            request({
                url: app.$remote('/'),
                form: form,
                method: 'post'
            }, function (err, body) {
                expect(body).toEqual('{"a":"1"}');
                stop();
            });

        });
    });


    it('formData', function (done) {
        server(done, function (app, stop) {

            app.post('/', function (req, res) {
                expect(req.headers['content-type']).toEqual('application/x-www-form-urlencoded');
                res.send(JSON.stringify(req.body));
            });

            var formData = {
                a: 1
            };

            request({
                url: app.$remote('/'),
                formData: formData,
                method: 'post'
            }, function (err, body) {
                expect(body).toEqual('{"a":"1"}');
                stop();
            });

        });
    });

});







