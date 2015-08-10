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

    var Gauge;

    /**
     * @param {Object} o Options
     * @param {HTMLElement} o.block
     * @constructor
     * @module Gauge
     */
    Gauge = function (o) {
        this._block = o.block;
        this._values = o.values;

        this._r = new window.Raphael(this._block, 600, 600);

        this._init();
    };

    Gauge.prototype = {
        /**
         * Initialize
         *
         * @private
         */
        _init: function () {
            console.info('Gauge init');

            var _this = this;

            /**
             * @param {Number} min
             * @param {Number} max
             */
            this._r.customAttributes.arc = function (min, max) {
                var total = 100;
                var radius = 175;
                var positionStart = _this._getPosition(total, min, radius);
                var positionEnd = _this._getPosition(total, max, radius);
                var alpha = (360 - 120) / total * (max - min);
                var path = [
                    ['M', positionStart.x, positionStart.y],
                    ['A', radius, radius, 0, Boolean(alpha > 180), 1, positionEnd.x, positionEnd.y]
                ];

                return {
                    path: path,
                };
            };

            this._render();
        },

        /**
         * @private
         */
        _render: function () {
            this._renderHand();
            this._renderMarks();
            this._renderTicks();
            this._renderTicksLabels();
            this._renderArcScale();
            this._renderArcMiddle();
            this._renderArcHigh();
        },

        /**
         * @private
         */
        _renderHand: function () {
            var hand = this._r.set();
            var center = this._getPosition(0, 0, 0);
            var radius = this._getPosition(0, 0, 190);
            hand.push(this._r.circle(center.x, center.y, 10).attr({
                fill: '#1E98E4',
                stroke: 0,
            }));
            hand.push(this._r.path([
                ['M', 300 - 6, 300],
                ['L', 300, 300 - 190],
                ['L', 300 + 6, 300],
                ['z']
            ]).attr({
                fill: '#1E98E4',
                stroke: 0,
            }));
            hand.rotate(-120, center.x, center.y);
        },

        /**
         * @private
         */
        _renderTicks: function () {
            this._drawTicks(6);
        },

        /**
         * @param {Number} total
         * @private
         */
        _drawTicks: function (total) {
            var out = this._r.set();
            var radius = 182;

            for (var value = 0; value <= total; value++) {
                var positionStart = this._getPosition(total, value, radius);
                var positionEnd = this._getPosition(total, value, radius + 5);
                out.push(this._r.path([
                    ['M', positionStart.x, positionStart.y],
                    ['L', positionEnd.x, positionEnd.y],
                ]).attr({
                    stroke: '#666',
                    'stroke-width': 2,
                }));
            }

            return out;
        },

        /**
         * @private
         */
        _renderTicksLabels: function () {
            var out = this._r.set();
            var radius = 200;
            var total = 6;

            for (var value = 0; value <= total; value++) {
                var position = this._getPosition(total, value, radius);
                console.log(position);

                out.push(this._r.text(position.x, position.y, String(value)).attr({
                    'font-size': '14px',
                    fill: '#666',
                    'text-anchor': 'middle',
                }));
            }
        },

        /**
         * @private
         */
        _renderMarks: function () {
            this._drawMarks(100);
        },

        /**
         * @param {Number} total
         * @private
         */
        _drawMarks: function (total) {
            var out = this._r.set();
            var radius = 182;

            for (var value = 0; value < total; value++) {
                var position = this._getPosition(total, value, radius);
                out.push(this._r.circle(position.x, position.y, 1).attr({
                    fill: '#666',
                    stroke: 'none',
                }));
            }

            return out;
        },

        /**
         * @private
         */
        _renderArcScale: function () {
            var scaleArc = this._r.path()
                .attr({
                    stroke: '#666',
                    'stroke-width': 3,
                })
                .attr({
                    arc: [0, 75],
                });
        },

        /**
         * @private
         */
        _renderArcMiddle: function () {
            var scaleArc = this._r.path()
                .attr({
                    stroke: '#ffa500',
                    'stroke-width': 3,
                })
                .attr({
                    arc: [75, 90],
                });
        },

        /**
         * @private
         */
        _renderArcHigh: function () {
            var scaleArc = this._r.path()
                .attr({
                    stroke: '#ff0000',
                    'stroke-width': 3,
                })
                .attr({
                    arc: [90, 100],
                });
        },

        /**
         * @param {Number} total
         * @param {Number} value
         * @param {Number} radius
         * @return {Object}
         * @private
         */
        _getPosition: function (total, value, radius) {
            var alpha = 0;
            if (total !== 0) {
                // -120 - отсеченное внизу
                alpha = (360 - 120) / total * value;
            }
            // -150 - сдвиг начала
            var a = (-150 - alpha) * Math.PI / 180;
            var x = 300 + radius * Math.cos(a);
            var y = 300 - radius * Math.sin(a);

            return {
                x: x,
                y: y,
            };
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
