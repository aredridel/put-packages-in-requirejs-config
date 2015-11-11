"use strict";

var test = require('tap').test;
var insert = require('./insertPackages');
var escodegen = require('escodegen');
var insertPackagesFromPathIntoConfig = require('./');
var path = require('path');
var rsvp = require('rsvp');
var fs = require('fs');
var writeFile = rsvp.denodeify(fs.writeFile);
var readFile = rsvp.denodeify(fs.readFile);

test('should insert packages in file', function (t) {

    var updated = escodegen.generate(insert('"use strict"; requirejs.config({packages: []})', [
        { name: 'hello' }
    ]));

    t.match(updated, /name.*hello/);

    t.end();

});

test('reads files', function (t) {
    var config = path.resolve(__dirname, 'tmp', 'config.js');
    var packageRoot = path.resolve(__dirname, 'test-fixtures');
    t.plan(4);
    writeFile(config, '"use strict"; requirejs.config({packages: []})').then(function () {
        return insertPackagesFromPathIntoConfig(packageRoot, config);
    }).then(function () {
        return readFile(config, 'utf-8').then(function (file) {
            t.match(file, /1.0.0-a/);
            t.match(file, /1.0.0-b/);
            t.notMatch(file, /irrelevant/);
        });
    }).then(t.pass).catch(t.error).finally(t.end);

});
