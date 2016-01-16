'use strict';

var _ = require('lodash');
var Config = require('./config');

var addons = module.exports = require('confab');

addons.create = function create(transforms, options) {
    return Config.create(this(transforms), options);
};

_.assign(addons, require('./transformers'));
