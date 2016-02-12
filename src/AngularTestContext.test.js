/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License.
 *
 * Unit tests for AngularTestContext.js.
 */
'use strict';

//----------------------------------
// Module dependencies
//----------------------------------

var AngularTestContext = require('angular-test-context');

//----------------------------------
// Unit Tests
//----------------------------------

describe('AngularTestContext:', function() {

    //----------------------------------
    // Compilation tests
    //----------------------------------

    describe('compiling HTML', function() {

        var HTML =
            '<div>' +
            '<button></button>' +
            '<button></button>' +
            '<input/>' +
            '<input/>' +
            '<input/>' +
            '</div>';

        var testContext = new AngularTestContext();

        var element = testContext.compile(HTML);

        it('should have 2 buttons', function() {
            expect(element.find('button').length).toBe(2);
        });

        it('should have 3 inputs', function() {
            expect(element.find('input').length).toBe(3);
        });
    });

    //----------------------------------
    // Scope tests
    //----------------------------------

    describe('compiling directive with scope variables', function() {

        var HTML =
            '<input type="text" ng-model="formData.textValue"/>';

        var scope = {
            formData: {
                textValue: 'hello'
            }
        };

        var testContext = new AngularTestContext();

        var inputEl = testContext.compile(HTML, scope);

        it('should have the initial scope value', function() {
            expect(inputEl.val()).toBe('hello');
        });

        it('should have the changed scope value after digest', function() {
            expect(inputEl.val()).toBe('hello');

            scope.formData.textValue = 'goodbye';
            testContext.digest();

            expect(inputEl.val()).toBe('goodbye');
        });

        it('should provide the angular scope object used for compile', function() {
            expect(testContext.scope().formData).toBe(scope.formData);
            expect(testContext.scope().$emit).not.toBeNull();
        });
    });

    //----------------------------------
    // Injection tests
    //----------------------------------

    describe('injecting function with a module dependency', function() {
        angular.module('mileMeasurement', []).constant('mile', {
            feet: 5280
        });

        var testContext = new AngularTestContext('mileMeasurement');
        var injectedMile;

        // Can't use jasmine spy with angular injection.
        testContext.inject(function(mile) {
            injectedMile = mile;
        });

        it('should have injected the dependency', function() {
            expect(injectedMile.feet).toBe(5280);
        });
    });

    describe('injecting constructor with a module dependency', function() {
        angular.module('mileMeasurement', []).constant('mile', {
            feet: 5280
        });

        var testContext = new AngularTestContext('mileMeasurement');

        function MyController(mile) {
            var injectedMile = mile;

            this.mile = function() {
                return injectedMile;
            }
        }

        // Can't use jasmine spy with angular injection.
        var controller = testContext.instantiate(MyController);

        it('should have injected the dependency', function() {
            expect(controller.mile().feet).toBe(5280);
        });
    });

    describe('injecting function with a module dependency using array', function() {
        angular.module('yardMeasurement', []).constant('yard', {
            feet: 3
        });
        angular.module('footMeasurement', []).constant('foot', {
            inch: 12
        });

        var testContext = new AngularTestContext(['mileMeasurement', 'yardMeasurement']);
        var injectedMile, injectedYard;

        // Can't use jasmine spy with angular injection.
        testContext.inject(function(mile, yard) {
            injectedMile = mile;
            injectedYard = yard;
        });

        it('should have injected the dependency', function() {
            expect(injectedMile.feet).toBe(5280);
            expect(injectedYard.feet).toBe(3);
        });
    });

    describe('injecting $timeout', function() {

        var controllerTimeout;

        function fooDirective() {

            return {
                controller: Controller,
                controllerAs: 'ctrl',
                restrict: 'EA',
                scope: {}
            };

            function Controller($timeout) {
                controllerTimeout = $timeout;
            }
        }

        angular.module('testApp', []).directive('foo', fooDirective);

        var testContext = new AngularTestContext(['ng', 'testApp']);
        testContext.compile('<foo></foo>');

        it('should always be the same $timeout instance', function() {
            var timeout;
            testContext.inject(function($timeout) {
                timeout = $timeout;
            });

            expect(controllerTimeout).toBe(timeout);
        });
    });
});
