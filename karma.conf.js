/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Karma configuration for testing un-minimized version.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables.
//-------------------------------------

var path = require('path');
var karmaBaseConf = require('./karma.base.conf');

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = function(config) {
    var options = karmaBaseConf();

    // Test using this source file
    options.webpack.resolve.alias['angular-test-context'] =
        path.join(__dirname, 'src/AngularTestContext.js');

    // Lint source file.
    options.webpack.module.loaders.push({
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    });

    config.set(options);
};
