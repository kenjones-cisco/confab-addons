'use strict';

var path = require('path');
var os = require('os');
var _ = require('lodash');
var yaml = require('js-yaml');
var confab = require('confab');
var utils = require('./utils');

var transforms = module.exports;


transforms.loadYaml = function loadYaml(files) {
    return utils.load(files, yaml.safeLoad);
};

transforms.loadEnvConfigFile = function () {
    var jsonFiles = [];
    var yamlFiles = [];
    var baseNames = [];
    var basedir = utils.getEnv('NODE_CONFIG_DIR', path.join(process.cwd(), 'config'));
    var appinstance = utils.getEnv('NODE_APP_INSTANCE');
    var appenv = utils.getEnv('NODE_ENV', 'development');
    var hostname = utils.getEnv('HOST', utils.getEnv('HOSTNAME', os.hostname()));

    utils.debuglog('basedir = ', basedir);
    utils.debuglog('appinstance = ', appinstance);
    utils.debuglog('appenv = ', appenv);
    utils.debuglog('hostname = ', hostname);

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
        utils.debuglog('checking JSON files:', jsonFiles);
        return confab.loadJSON(jsonFiles);
    } else {
        utils.debuglog('checking YAML files:', yamlFiles);
        return transforms.loadYaml(yamlFiles);
    }
};
