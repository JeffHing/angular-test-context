(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AngularTestContext"] = factory();
	else
		root["AngularTestContext"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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

	    var moduleDependencies = ['ng'];

	    for (var i = 0; i < arguments.length; i++) {
	        var arg = arguments[i];
	        if (arg instanceof Array) {
	            for (var j = 0; j < arg.length; j++) {
	                moduleDependencies.push(arg[j]);
	            }
	        } else {
	            moduleDependencies.push(arg);
	        }
	    }

	    m.injector = angular.injector(moduleDependencies);
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
	    m.injector.invoke(func);
	};


/***/ }
/******/ ])
});
;