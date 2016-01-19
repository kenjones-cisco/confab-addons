'use strict';

var _ = require('lodash');
var Config = require('./config');

// load all of confab features
var addons = module.exports = require('confab');

// Provides ability to create a Config object after processing all
// of the transformers.
addons.create = function create(transforms, options) {
    return Config.create(this(transforms), options);
};

// Adds some add-on transformers
_.assign(addons, require('./transformers'));
