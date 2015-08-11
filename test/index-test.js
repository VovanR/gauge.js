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
                block: document.getElementById('holder'),
                actualValue: 4,
                labels: [0, 1, 2, 3, 4, 5, 6],
                warningValue: 75,
                dangerValue: 90,
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
    });
});

if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
} else {
    mocha.run();
}
