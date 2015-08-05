"use strict";

var esprima = require('esprima');
var eswalk = require('eswalk');

module.exports = function insertPackages(text, packages) {
    var program = esprima.parse(text);

    eswalk(program, function (node) {
        if (node.type === 'CallExpression'
            && node.callee.type === 'MemberExpression'
            && node.callee.object.name === 'requirejs'
            && node.callee.property.name === 'config'
            && node.arguments[0].type === 'ObjectExpression') {

            var props = node.arguments[0].properties;
            props.forEach(function (p) {
                if (p.key.type === 'Identifier' && p.key.name === 'packages') {
                    p.value = esprima.parse(JSON.stringify(packages)).body[0].expression;
                }
            });
        }

    });
    return program;
};
