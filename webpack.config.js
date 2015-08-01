/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Webpack configurations.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var flags = require('minimist')(process.argv.slice(2));

// Webpack loaders.
var loaders = {

    // Lint javascript.
    eslint: {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },

    // Load HTML as javascript.
    html: {
        test: /\.html$/,
        loader: 'html'
    }
};

// Library settings.
var library = {

    // GitHub project name.
    projectName: 'angular-test-context',

    // Name of library variable for non-module build environments.
    variable: 'AngularTestContext',

    // Filename of library.
    filename: 'AngularTestContext.js',

    // Filename of minimized library.
    filenameMin: 'AngularTestContext.min.js',

    // Path to library source.
    sourceFile: './src/AngularTestContext.js',

    // Loaders to load the library source.
    sourceLoaders: [
        loaders.eslint
    ]
};

/*
 * Creates a webpack distribution configuration.
 *
 * @param {string} libraryName
 */
function createDistConfig(libraryName) {

    return {
        entry: library.sourceFile,

        eslint: {
            failOnError: true
        },

        module: {
            loaders: library.sourceLoaders
        },

        output: {
            filename: libraryName,
            library: library.variable,
            libraryTarget: 'umd',
            path: 'dist/'
        }
    };
}

//-------------------------------------
// Module exports
//-------------------------------------

if (flags['#wdist']) {
    // Create distribution file.
    module.exports = createDistConfig(library.filename);

} else if (flags['#wdistMin']) {
    // Create minimized distribution file.
    module.exports = createDistConfig(library.filenameMin);

} else {
    // Common settings.
    module.exports = {
        library: library,
        loaders: loaders
    };
}
