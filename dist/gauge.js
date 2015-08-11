/**
 * gauge.js
 * Copyright(c) 2015 Vladimir Rodkin <mail@vovanr.com>
 * MIT Licensed
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Gauge = factory();
    }
}(this, function () {

    'use strict';

    var template = '<svg version="1.1" width="100%" height="100%" ' +
        'preserveAspectRatio="xMidYMid meet" viewBox="-50 -50 100 100">' +
        '<defs>' +
            '<g id="gauge-mark" class="gauge-mark">' +
                '<line x1="0" y1="-40.5" x2="0" y2="-40.75" />' +
            '</g>' +

            '<g id="gauge-tick" class="gauge-tick">' +
                '<line x1="0" y1="-40.5" x2="0" y2="-41.5" />' +
            '</g>' +
        '</defs>' +

        '<g class="gauge-marks"></g>' +
        '<g class="gauge-ticks"></g>' +
        '<g class="gauge-labels"></g>' +

        '<g class="gauge-scale-arc"></g>' +
        '<g class="gauge-scale-arc-warning"></g>' +
        '<g class="gauge-scale-arc-danger"></g>' +

        '<g class="gauge-hand">' +
            '<polygon points="-1,0 0,-41 1,0" />' +
            '<circle cx="0" cy="0" r="2" />' +
        '</g>' +
    '</svg>';

    var Gauge;

    /**
     * @param {Object} o Options
     * @param {HTMLElement} o.block
     * @param {Number} o.actualValue
     * @param {Array} o.labels
     * @param {Number} [o.maxValue]
     * @param {Number} [o.warningValue] in percents
     * @param {Number} [o.dangerValue] in percentes
     * @constructor
     * @module Gauge
     */
    Gauge = function (o) {
        this._block = o.block;
        this._actualValue = o.actualValue;
        this._labels = o.labels;
        this._maxValue = o.maxValue || this._labels[this._labels.length - 1];
        this._warningValue = o.warningValue;
        this._dangerValue = o.dangerValue;

        this._delta = 100 / this._maxValue;

        this._render();
    };

    Gauge.prototype = {
        /**
         * @private
         */
        _render: function () {
            this._block.innerHTML = template;
            this._renderHand();
            this._renderTicks();
            this._renderMarks();
            this._renderTicksLabels();
            this._renderArcScale();
            if (this._warningValue !== undefined) {
                this._renderArcWarning();
            }
            if (this._dangerValue !== undefined) {
                this._renderArcDanger();
            }
        },

        /**
         * @param {Number} value
         * @return {Number} degree
         * @private
         */
        _valueToDegree: function (value) {
            // -120 deg - excluded part
            // -210 deg - rotate start to simmetrical view
            return (value / this._maxValue * (360 - 120)) - 210;
        },

        /**
         * @param {Number} value
         * @param {Number} radius
         * @return {Object} position
         * @private
         */
        _valueToPosition: function (value, radius) {
            var a = this._valueToDegree(value) * Math.PI / 180;
            var x = radius * Math.cos(a);
            var y = radius * Math.sin(a);

            return {
                x: x,
                y: y,
            };
        },

        /**
         * @param {Number} percent
         * @return {Number} value
         * @private
         */
        _percentToValue: function (percent) {
            return percent / this._delta;
        },

        /**
         * @private
         */
        _renderHand: function () {
            this._hand = $('.gauge-hand', this._block)[0];
            this._setValue(this._actualValue);
        },

        /**
         * @private
         */
        _setValue: function () {
            this._hand.style.transform = 'rotate(' + (this._valueToDegree(this._actualValue) + 90) + 'deg)';
        },

        /**
         * @param {Number} value
         * @public
         */
        setValue: function (value) {
            this._actualValue = value;
            this._setValue();
        },

        /**
         * @private
         */
        _renderTicks: function () {
            var ticksCache = '';
            var ticks = $('.gauge-ticks', this._block)[0];

            var total = this._labels.length - 1;
            for (var value = 0; value <= total; value++) {
                ticksCache += this._buildTick(value);
            }

            ticks.innerHTML = ticksCache;
        },

        /**
         * @return {String}
         * @private
         */
        _buildTick: function (value) {
            return '<use xlink:href="#gauge-tick" transform="rotate(' + (this._valueToDegree(value) + 90) + ')" />';
        },

        /**
         * @private
         */
        _renderTicksLabels: function () {
            var labelsCache = '';
            var labels = $('.gauge-labels', this._block)[0];

            var total = this._labels.length - 1;
            for (var value = 0; value <= total; value++) {
                labelsCache += this._buildTickLabel(value);
            }

            labels.innerHTML = labelsCache;
        },

        /**
         * @param {Number} value
         * @return {String}
         * @private
         */
        _buildTickLabel: function (value) {
            var position = this._valueToPosition(value, 43);

            return '<text x="' + position.x + '" y="' + position.y + '" text-anchor="middle">' +
                this._labels[value] + '</text>';
        },

        /**
         * @private
         */
        _renderMarks: function () {
            var marksCache = '';
            var marks = $('.gauge-marks', this._block)[0];

            var total = (this._labels.length - 1) * 10;
            for (var value = 0; value <= total; value++) {
                // Skip marks on ticks
                if (value % 10 === 0) {
                    continue;
                }
                marksCache += this._buildMark(value / 10);
            }

            marks.innerHTML = marksCache;
        },

        /**
         * @return {String}
         * @private
         */
        _buildMark: function (value) {
            return '<use xlink:href="#gauge-mark" transform="rotate(' + (this._valueToDegree(value) + 90) + ')" />';
        },

        /**
         * @private
         */
        _renderArcScale: function () {
            var max = 100;

            if (this._dangerValue) {
                max = this._dangerValue;
            }

            if (this._warningValue) {
                max = this._warningValue;
            }

            var group = $('.gauge-scale-arc', this._block)[0];
            var arc = this._buildArc(0, max, 39);

            group.innerHTML = arc;
        },

        /**
         * @private
         */
        _renderArcWarning: function () {
            var max = 100;

            if (this._dangerValue) {
                max = this._dangerValue;
            }

            var group = $('.gauge-scale-arc-warning', this._block)[0];
            var arc = this._buildArc(this._warningValue, max, 39);

            group.innerHTML = arc;
        },

        /**
         * @private
         */
        _renderArcDanger: function () {
            var group = $('.gauge-scale-arc-danger', this._block)[0];
            var arc = this._buildArc(this._dangerValue, 100, 39);

            group.innerHTML = arc;
        },

        /**
         * @param {Number} min in percents
         * @param {Number} max in percents
         * @param {Number} radius
         * @return {String}
         * @private
         */
        _buildArc: function (min, max, radius) {
            min = this._percentToValue(min);
            max = this._percentToValue(max);
            var positionStart = this._valueToPosition(min, radius);
            var positionEnd = this._valueToPosition(max, radius);
            var alpha = (360 - 120) / this._maxValue * (max - min);
            var arc = '<path d="M' + positionStart.x + ',' + positionStart.y +
                ' A' + radius + ',' + radius + ' 0 ' +
                ((alpha > 180) ? 1 : 0) + ',1 ' +
                positionEnd.x + ',' + positionEnd.y +
                '" style="fill: none;" />';

            return arc;
        },

        /**
         * @public
         */
        destroy: function () {
            console.log('destroy');
        },
    };

    return Gauge;

}));
