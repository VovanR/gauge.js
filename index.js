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
     * @param {Object} [o] Options
     * @constructor
     * @module Gauge
     */
    Gauge = function (o) {

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

            this._bindControls();
        },

        /**
         * Bindings
         *
         * @private
         */
        _bindControls: function () {
        },

        /**
         */
        destroy: function () {
            console.log('destroy');
        },
    };

    return Gauge;

}));
