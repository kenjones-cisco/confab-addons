'use strict';

var yaml = require('js-yaml');
var utils = require('./utils');


module.exports = function loadYaml(files) {
    return utils.load(files, yaml.safeLoad);
};
