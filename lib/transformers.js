'use strict';

var path = require('path');
var os = require('os');
var _ = require('lodash');
var confab = require('confab');
var utils = require('./utils');

var transforms = module.exports;


transforms.loadYaml = require('./yaml');

transforms.loadEnvConfigFile = function () {
    var jsonFiles = [];
    var yamlFiles = [];
    var basedir = utils.getEnv('NODE_CONFIG_DIR', path.join(process.cwd(), 'config'));
    var appinstance = utils.getEnv('NODE_APP_INSTANCE');
    var appenv = utils.getEnv('NODE_ENV', 'development');
    var hostname = utils.getEnv('HOST', utils.getEnv('HOSTNAME', os.hostname()));

    var baseNames = [];

    function concatParts(items) {
        return items.join('-');
    }

    if (hostname && appinstance) {
        baseNames.push(concatParts([hostname, appenv, appinstance]));
        baseNames.push(concatParts([hostname, appinstance]));
    }

    if (hostname) {
        baseNames.push(concatParts([hostname, appenv]));
        baseNames.push(hostname);
    }

    if (appinstance) {
        baseNames.push(concatParts([appenv, appinstance]));
    }

    baseNames.push(appenv);
    baseNames.push('default');

    baseNames.forEach(function (baseName) {
        jsonFiles.push(path.join(basedir, baseName + '.json'));
        yamlFiles.push(path.join(basedir, baseName + '.yaml'));
        yamlFiles.push(path.join(basedir, baseName + '.yml'));
    });

    if (_.some(jsonFiles, utils.fileExists)) {
        return confab.loadJSON(jsonFiles);
    } else {
        return transforms.loadYaml(yamlFiles);
    }
};
