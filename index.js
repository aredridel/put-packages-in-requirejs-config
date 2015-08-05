"use strict";

var rsvp = require('rsvp');
var Promise = rsvp.Promise;
var glob = rsvp.denodeify(require('glob'));
var path = require('path');
var fs = require('fs');
var writeFile = rsvp.denodeify(fs.writeFile);
var readFile = rsvp.denodeify(fs.readFile);
var insertPackages = require('./insertPackages');
var escodegen = require('escodegen');

module.exports = function insertPackagesFromPathIntoConfig(root, config, dest) {
    return glob(path.resolve(root, '*', 'package.json')).then(function (files) {
        return Promise.all(files.map(function (f) {
            return readFile(f, 'utf-8').then(JSON.parse).then(extractRJSFields);
        }));
    }).then(function (p) {
        return readFile(config, 'utf-8').then(function (file) {
            return insertPackages(file, p);
        });
    }).then(function (pt) {
        return writeFile(config || dest, escodegen.generate(pt));
    });
};

function extractRJSFields(o) {
    var out = {};
    if (o.name) {
        out.name = o.name;
    }

    if (o.version) {
        out.version = o.version;
    }

    if (o.location) {
        out.location = o.location;
    }

    if (o.main) {
        out.main = o.main;
    } else {
        out.main = 'index.js';
    }

    return out;
}
