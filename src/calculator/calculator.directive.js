/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Calculator directive.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = calculatorDirective;

//-------------------------------------
// Module dependencies and variables.
//-------------------------------------

// Template HTML
var HTML = require('./calculator.directive.html');

//-------------------------------------
// Directive
//-------------------------------------

/*
 * The calculator directive allows the user to add two numbers.
 */
function calculatorDirective() {

    return {
        controller: Controller,
        controllerAs: 'ctrl',
        restrict: 'EA',
        scope: {},
        template: HTML
    };

    function Controller() {
        this.operand1 = null;
        this.operand2 = null;
        this.result = null;

        this.add = function() {
            this.result = parseInt(this.operand1) + parseInt(this.operand2);
        };

        this.isAddDisabled = function() {
            return isNaN(parseInt(this.operand1)) || isNaN(parseInt(this.operand2));
        };
    }
}
