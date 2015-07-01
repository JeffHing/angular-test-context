/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for the calculator directive.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var Calculator = require('./CalculatorPageObject');

//-------------------------------------
// Unit tests
//-------------------------------------

describe('calculator directive:', function() {

    var calc;

    beforeEach(function() {
        calc = new Calculator();
    });

    describe('adding two numbers', function() {

        it('should be 3', function() {
            calc.operand1(1);
            calc.operand2(2);
            expect(calc.add()).toBe(3);
        });

        it('should be -2', function() {
            calc.operand1(0);
            calc.operand2(-2);
            expect(calc.add()).toBe(-2);
        });
    });

    describe('button state', function() {

        it('should be disabled if only first operand set', function() {
            expect(calc.isButtonDisabled()).toBe(true);
            calc.operand1(1);
            expect(calc.isButtonDisabled()).toBe(true);
        });

        it('should be disabled if only second operand set', function() {
            expect(calc.isButtonDisabled()).toBe(true);
            calc.operand2(2);
            expect(calc.isButtonDisabled()).toBe(true);
        });

        it('should be enabled if both operands set', function() {
            expect(calc.isButtonDisabled()).toBe(true);
            calc.operand1(1);
            calc.operand2(2);
            expect(calc.isButtonDisabled()).toBe(false);
        });
    });
});
