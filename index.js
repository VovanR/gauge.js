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

    var template = '<svg id="speedometr" version="1.1" width="100%" height="100%" ' +
        'preserveAspectRatio="xMidYMid meet" viewBox="-50 -50 100 100">' +
        '<defs>' +
            '<g id="mark">' +
                '<line x1="0" y1="-30.5" x2="0" y2="-30.75" />' +
            '</g>' +

            '<g id="tick">' +
                '<line x1="0" y1="-30.5" x2="0" y2="-31.5" />' +
            '</g>' +
        '</defs>' +

        '<g id="marks"></g>' +
        '<g id="ticks"></g>' +
        '<g id="labels"></g>' +

        '<g id="scale-arc"></g>' +
        '<g id="scale-arc-warning"></g>' +
        '<g id="scale-arc-danger"></g>' +

        '<g id="hand">' +
            '<polygon points="-0.8,0 0,-31 0.8,0" />' +
            '<circle cx="0" cy="0" r="1.5" />' +
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

        this._init();
    };

    Gauge.prototype = {
        /**
         * Initialize
         *
         * @private
         */
        _init: function () {
            console.info('Gauge init', this);

            var _this = this;

            this._render();
        },

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
         * @private
         */
        _valueToDegree: function (value) {
            return (value / this._maxValue * (360 - 120)) - 210;
        },

        /**
         * @param {Number} value
         * @param {Number} radius
         * @return {Object}
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
         * @return {Number}
         * @private
         */
        _percentToValue: function (percent) {
            return percent / this._delta;
        },

        /**
         * @private
         */
        _renderHand: function () {
            this._hand = document.getElementById('hand');
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
            var ticks = document.getElementById('ticks');
            for (var value = 0; value <= this._labels.length - 1; value++) {
                ticksCache += this._buildTick(value);
            }

            ticks.innerHTML = ticksCache;
        },

        /**
         * @return {String}
         * @private
         */
        _buildTick: function (value) {
            return '<use xlink:href="#tick" transform="rotate(' + (this._valueToDegree(value) + 90) + ')" />';
        },

        /**
         * @private
         */
        _renderTicksLabels: function () {
            var labelsCache = '';
            var labels = document.getElementById('labels');
            for (var value = 0; value <= (this._labels.length - 1); value++) {
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
            var position = this._valueToPosition(value, 33);

            return '<text x="' + position.x + '" y="' + position.y + '" text-anchor="middle">' + value + '</text>';
        },

        /**
         * @private
         */
        _renderMarks: function () {
            var marksCache = '';
            var marks = document.getElementById('marks');
            for (var value = 0; value <= ((this._labels.length - 1) * 10); value++) {
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
            return '<use xlink:href="#mark" transform="rotate(' + (this._valueToDegree(value) + 90) + ')" />';
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

            var group = document.getElementById('scale-arc');
            var arc = this._buildArc(0, max, 29);

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

            var group = document.getElementById('scale-arc-warning');
            var arc = this._buildArc(this._warningValue, max, 29);

            group.innerHTML = arc;
        },

        /**
         * @private
         */
        _renderArcDanger: function () {
            var group = document.getElementById('scale-arc-danger');
            var arc = this._buildArc(this._dangerValue, 100, 29);

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
