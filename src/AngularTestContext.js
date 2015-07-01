/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * AngularTestContext class.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = AngularTestContext;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

// Private model name.
var MODEL = '_angularTestContext';

//-------------------------------------
// Page object.
//-------------------------------------

/*
 * AngularTestContext is a class which provides a simple API for
 * invoking common angular functions needed during unit testing.
 *
 * @constructor
 *
 * @param {...string[]|string} [moduleNames]
 *    The names of the required modules.
 */
function AngularTestContext() {
    var m = this[MODEL] = {};
    m.scope = null;
    m.moduleDependencies = ['ng'];

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg instanceof Array) {
            for (var j = 0; j < arg.length; j++) {
                m.moduleDependencies.push(arg[j]);
            }
        } else {
            m.moduleDependencies.push(arg);
        }
    }
}

var proto = AngularTestContext.prototype;

/*
 * Compiles the HTML against the provided scope properties.
 *
 * @param {string} html
 * @param {object} [scopeProperties]
 *    The properties to add to the scope at compilation.
 * @return {object} The root element of the compiled HTML.
 */
proto.compile = function(html, scopeProperties) {
    var m = this[MODEL],
        element;

    compileHtml.$inject = ['$compile', '$rootScope'];

    function compileHtml($compile, $rootScope) {
        var scope = $rootScope.$new();

        // Add the properties to the current scope.
        if (scopeProperties) {
            angular.extend(scope, scopeProperties);
        }

        // Compile the HTML against the scope.
        element = $compile(html)(scope);
        scope.$digest();

        m.scope = scope;
    }

    this.inject(compileHtml);

    return element;
};

/*
 * Executes a digest cycle on the current scope.
 */
proto.digest = function() {
    var m = this[MODEL];
    m.scope.$digest();
};

/*
 * Invokes the function and injects any specified module dependencies.
 *
 * @param {function} func
 */
proto.inject = function(func) {
    var m = this[MODEL];
    angular.injector(m.moduleDependencies).invoke(func);
};
