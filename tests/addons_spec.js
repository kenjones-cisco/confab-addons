'use strict';

var _ = require('lodash');
var path = require('path');
var os = require('os');

var confab = require('../lib/index');

var TEST_CFG_DIR = path.join(__dirname, 'fixtures');


function populate(val) {
    return function () {
        return val;
    };
}

var applyTimesTwo = function (config) {
    Object.keys(config).forEach(function (k) {
        if (typeof config[k] === 'number') {
            config[k] *= 2;
        }
    });

    return config;
};

describe('#confab', function () {

    it('with Config wrapper', function () {
        expect(confab.create([
            populate({
                a: 4
            }),
            applyTimesTwo
        ]).get('a')).toEqual(8);
    });

    describe('#transforms.loadEnvConfigFile', function () {
        var prevEnv;

        beforeEach(function () {
            prevEnv = _.cloneDeep(process.env);
        });

        it('hostname + appenv + appinstance json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-haa-json');
            process.env.NODE_APP_INSTANCE = 1;
            process.env.NODE_ENV = 'test';
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('hostname + appenv + appinstance yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-haa-yaml');
            process.env.NODE_APP_INSTANCE = 1;
            process.env.NODE_ENV = 'test';
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        it('hostname + appinstance json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-hai-json');
            process.env.NODE_APP_INSTANCE = 1;
            process.env.NODE_ENV = 'test';
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('hostname + appinstance yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-hai-yaml');
            process.env.NODE_APP_INSTANCE = 1;
            process.env.NODE_ENV = 'test';
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        it('hostname + appenv json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-hae-json');
            delete process.env.NODE_APP_INSTANCE;
            process.env.NODE_ENV = 'test';
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('hostname + appenv yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-hae-yaml');
            delete process.env.NODE_APP_INSTANCE;
            process.env.NODE_ENV = 'test';
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        it('hostname json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-host-json');
            delete process.env.NODE_APP_INSTANCE;
            delete process.env.NODE_ENV;
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('hostname yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-host-yaml');
            delete process.env.NODE_APP_INSTANCE;
            delete process.env.NODE_ENV;
            process.env.HOSTNAME = 'confab';
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        it('appenv + appinstance json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-aa-json');
            process.env.NODE_APP_INSTANCE = 1;
            process.env.NODE_ENV = 'test';
            delete process.env.HOSTNAME;
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('appenv + appinstance yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-aa-yaml');
            process.env.NODE_APP_INSTANCE = 1;
            process.env.NODE_ENV = 'test';
            delete process.env.HOSTNAME;
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        it('appenv json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-env-json');
            delete process.env.NODE_APP_INSTANCE;
            process.env.NODE_ENV = 'test';
            delete process.env.HOSTNAME;
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('appenv yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-env-yaml');
            delete process.env.NODE_APP_INSTANCE;
            process.env.NODE_ENV = 'test';
            delete process.env.HOSTNAME;
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        it('default json', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-default-json');
            delete process.env.NODE_APP_INSTANCE;
            delete process.env.NODE_ENV;
            delete process.env.HOSTNAME;
            spyOn(os, 'hostname').and.returnValue(undefined);
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('default yaml', function () {
            process.env.NODE_CONFIG_DIR = path.join(TEST_CFG_DIR, 'config-default-yaml');
            delete process.env.NODE_APP_INSTANCE;
            delete process.env.NODE_ENV;
            delete process.env.HOSTNAME;
            spyOn(os, 'hostname').and.returnValue(undefined);
            var config = confab([
                confab.loadEnvConfigFile()
            ]);
            expect(config.author).toEqual('Charles Lutwidge Dodgson');
        });

        afterEach(function () {
            process.env = prevEnv;
        });

    });

});
