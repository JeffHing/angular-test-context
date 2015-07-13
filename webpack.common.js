/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Common webpack configuration values.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var extend = require('extend');

var common = {

    ANGULAR_TEST_CONTEXT_SOURCE: './src/AngularTestContext.js',

    // Lint javascript.
    ESLINT_LOADER: {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },

    // Load HTML as javascript.
    HTML_LOADER: {
        test: /\.html$/,
        loader: 'html'
    }
};

var distConfig = {

    // Configuration for a distribution.
    distConfig: function(outputName) {

        return {
            entry: common.ANGULAR_TEST_CONTEXT_SOURCE,

            eslint: {
                failOnError: true
            },

            module: {
                loaders: [
                    common.ESLINT_LOADER
                ]
            },

            output: {
                filename: outputName,
                library: 'AngularTestContext',
                libraryTarget: 'umd',
                path: 'dist/'
            }
        };
    }
};

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = extend({}, distConfig, common);
