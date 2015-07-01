/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Page Object for the calculator directive.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = CalculatorPageObject;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var AngularTestContext = require('AngularTestContext');
var calculatorDirective = require('./calculator.directive');

// Privte model name.
var MODEL = '_calculatorPageObject';

//-------------------------------------
// Page Object
//-------------------------------------

/*
 * @constructor
 */
function CalculatorPageObject() {
    var m = this[MODEL] = {};

    // Add directive to module.
    angular.module('testApp', [])
        .directive('calculator', calculatorDirective);

    // Create test context.
    var testContext = new AngularTestContext('testApp');

    // Compile and find elements.
    var element = testContext.compile('<calculator></calculator>');

    var inputs = element.find('input');
    expect(inputs.length).toBe(2);

    var button = element.find('button');
    expect(button.length).toBe(1);

    var result = element.find('span span');
    expect(result.length).toBe(1);

    m.input1 = $(inputs[0]);
    m.input2 = $(inputs[1]);
    m.button = button;
    m.result = result;
}

var proto = CalculatorPageObject.prototype;

/*
 * Sets the value of the first operand.
 *
 * @param {string} value
 */
proto.operand1 = function(value) {
    var m = this[MODEL];
    m.input1.val(value).trigger('input');
};

/*
 * Sets the value of the second operand.
 *
 * @param {string} value
 */
proto.operand2 = function(value) {
    var m = this[MODEL];
    m.input2.val(value).trigger('input');
};

/*
 * Adds the two operands.
 *
 * @returns {number} The result.
 */
proto.add = function() {
    var m = this[MODEL];
    m.button.trigger('click');
    return parseInt(m.result.html());
};

/*
 * Indicates whether add button is disabled.
 *
 * @returns {boolean}
 */
proto.isButtonDisabled = function() {
    var m = this[MODEL];
    return m.button.prop('disabled');
};
