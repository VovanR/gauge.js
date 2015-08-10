mocha.setup('bdd');
var assert = chai.assert;

describe('Gauge', function () {
    /**
     */
    var module = function (o) {
        var $fixtures = $('#fixtures');

        o = _.defaults(
            o || {},
            {
            }
        );

        return new window.Gauge(o);
    };

    var _$fixtureTemplate = $('#fixture-template');
    var _fixtureTemplate = _$fixtureTemplate.html();
    _$fixtureTemplate.empty();

    beforeEach(function () {
        $('#fixtures').html(_fixtureTemplate);
    });

    afterEach(function () {
    });

    describe('constructor', function () {
    });

    describe('_init', function () {
    });

    describe('_bindControls', function () {
    });

    describe('#destroy', function () {
        it('should be a `Function`', function () {
            var m = module();
            assert.isFunction(m.destroy);
        });
    });
});

if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
} else {
    mocha.run();
}
