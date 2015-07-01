# AngularTestContext

AngularTestContext provides a simple API for the core ngMock
capabilities needed for unit testing. Based upon your needs, it can replace 
the need for ngMock, or it can be used in conjunction with ngMock.

This utility was originally created to make it easier to build unit tests 
for directives using the [Page Object](https://code.google.com/p/selenium/wiki/PageObjects)
design pattern.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
   - [Creating a Test Context](#creating-a-test-context)
   - [Compiling HTML with Scope Variables](#compiling-html-with-scope-variables)
   - [Changing a Scope Value](#changing-a-scope-value)
   - [Injecting a dependency](#injecting-a-dependency)
- [Page Object Design Pattern](#page-object-design-pattern)
   - [Calculator Unit Tests](#calculator-unit-tests)
   - [Calculator Page Object](#calculator-page-object)
   
## Features

* Compatible with CommonJS, AMD, and non-module build environments.

## Installation

To install the package:

    npm install angular-test-context
    
To require the package:    

```javascript
var AngularTestContext = require("angular-test-context");
```    

## Usage

### Creating a Test Context

First, make available any Angular modules needed by your test. In this example,
we want to test `myDirective`, so we create a module and add the directive
to the module:

```javascript    
angular.module('testApp', [])
    .directive('myDirective', myDirective); 
```

Next, create the AngularTestContext instance.
AngularTestContext needs to know which Angular modules are used by your
test. The names of the Angular modules can be passed in as an array, or as
comma separated strings, or both.

```javascript    
var testContext = new AngularTestContext('testApp');
```

### Compiling HTML with Scope Variables

To compile the HTML to be tested, call the `compile()` method with the 
appropriate HTML and any optional scope variables:

```javascript
var scope = {
    data: {
        value: 'hello',
    }
};
var element = testContext.compile('<div my-directive="data"></div>', scope);
```

The `compile()` method returns the Angular wrapped DOM element, which you can 
then inspect during your tests to validate the directive's behavior.

### Changing a Scope Value

To change a scope value, modify the value, and then call the `digest()` method:

```javascript
scope.data.value = 'goodbye';
testContext.digest();
```

### Injecting A Dependency

To inject a dependency from one of the Angular modules, use the `inject()` method:

```javascript
testContext.inject(function($timer) {
    ...
});

```
## Page Object Design Pattern

The GitHub project for AngularTestContext contains a 
[calculator directive example](https://github.com/JeffHing/angular-test-context/tree/master/src/calculator)
for writing unit tests using the Page Object design pattern and the 
AngularTestContext utility.

If you haven't used the 
[Page Object](https://code.google.com/p/selenium/wiki/PageObjects)
design pattern for writing unit tests, I highly recommend it. It will transform
your tests from being unwieldy and fragile, to being a well managed suite of 
tests for your code.

The main benefits are:

* It eliminates fragile tests. If the underlying implementation of your code 
changes, you modify the Page Object, not your tests.
* Tests are much easier to understand since all implementation details
are encapsulated in the Page Object.
* Tests are much easier to write since the DRY (Don't Repeat Yourself) code 
is encapsulated within the Page Object.
* Since the implementation is encapsulated within the Page Object, tests 
have the potential to be portable across different frameworks - preserving your 
investment in tests. Instead of changing your tests for each framework, 
create a different Page Object for each framework.

### Calculator Unit Tests

Here are the unit tests for the calculator directive using the 
`CalculatorPageObject`.

A couple of points to observe:

* There are no implementation details in the tests. The tests simply execute
logical calls against the calculator's Page Object.
* You can't determine what underlying framework is used to implement the 
calculator.

**Note:** Abstracting out the underlying framework in your tests may not always
be feasible, but it's a goal worth considering.


```javascript

/*
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

```

### Calculator Page Object

Here is the source code for the `CalculatorPageObject`, that uses the 
AngularTestContext utility.

```javascript
/*
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
 * @contructor
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
```