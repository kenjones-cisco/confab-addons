'use strict';

var path = require('path');

var confab = require('../lib/index');

function yamlFixturePath(name) {
    return path.join(__dirname, 'fixtures', name + '.yml');
}

describe('confab-yaml', function () {

    describe('#loadYaml', function () {

        it('passing in no files gets empty object', function () {
            var config = confab([
                confab.loadYaml()
            ]);
            expect(config).toEqual({});
        });

        it('has right author', function () {
            var config = confab([
                confab.loadYaml([
                    yamlFixturePath('test')
                ])
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('accepts a single file as a string', function () {
            var config = confab([
                confab.loadYaml(yamlFixturePath('test'))
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('skips missing files', function () {
            var config = confab([
                confab.loadYaml([
                    yamlFixturePath('missing'),
                    yamlFixturePath('test')
                ])
            ]);
            expect(config.author).toEqual('Lewis Carroll');
        });

        it('throws when config is not parseable', function () {
            var shouldThrow = function () {
                confab([
                    confab.loadYaml(yamlFixturePath('invalid'))
                ]);
            };

            expect(shouldThrow).toThrow();
        });

        it('does not clobber existing config', function () {
            var config = confab([
                confab.assign({
                    'extra': 'anything'
                }),
                confab.loadYaml(yamlFixturePath('test'))
            ]);
            expect(config.extra).toEqual('anything');
        });

    });

});
