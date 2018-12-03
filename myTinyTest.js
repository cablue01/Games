// this is my attempt to write tinytest myself

// global variables
var succeessColor = '#99ff99';
var failColor = '#ff9999';

// helper functions
var TinyTestHelper = {
	pluralize: function(word, count, optionalSuffix) {
		var suffix = optionalSuffix === undefined ? 's' : optionalSuffix;
		return count > 1 ? word + suffix : word;
	},

	consoleLogGroup: function(groupTitle, msgArray, isCollapsed, cssString) {
		var formattedTitle = cssString === undefined ? groupTitle : '%c' + groupTitle;

		isCollapsed ? console.groupCollapsed(formattedTitle, cssString) : console.group(formattedTitle, cssString);

		for (var i = 0; i < msgArray.length; i++) {
			var formattedMsg = cssString === undefined ? msgArray[i] : '%c' + msgArray[i];
			console.log(formattedMsg, cssString);
		}
		console.groupEnd();
	},

	addElementToBody: function(elementType, myBody, txt) {
		var myElement = document.createElement(elementType);
		myElement.textContent = txt;
		myBody.appendChild(myElement);
	},

	renderStats: function(tests, failCount) {
		var numTests = Object.keys(tests).length;
		var numSuccesses = numTests - failCount;
		var summaryString = 'ran ' + numTests + ' ' + this.pluralize('test', numTests);
		var successDetail = numSuccesses + this.pluralize(' success', numSuccesses, 'es');
		var failDetail = failCount + this.pluralize(' failure', failCount);

		var myBody = document.querySelector('body');
		myBody.innerHTML = '';
		myBody.style.backgroundColor = failCount === 0 ? succeessColor : failColor;

		this.addElementToBody('h2', myBody, summaryString);
		this.addElementToBody('p', myBody, failDetail);
		this.addElementToBody('p', myBody, successDetail);
	},
}

// TODO: put all successfull tests in a collapsed group with a title that says how many passed
//       have the group for the passed tests first then each fail listed individually
// TODO: if no tests passed console.log(No passing tests) make it still green. not a group.

// one object with no properties, all methods
var tinytest = {
	run: function(tests) {
		var failCount = 0;
		var successMsgs = [];
		var failMsgs = [];

		for (var testDesc in tests) {
			try {
				tests[testDesc].apply(this);
				successMsgs.push(testDesc);
			} catch(e) {
				console.groupCollapsed('%c' + testDesc, 'color: red;');
				console.error(e.stack, 'err.last');
				console.groupEnd();
				failCount++;
			}
		}

		// log successes last in a group
		TinyTestHelper.consoleLogGroup('Successful Tests', successMsgs, true, 'color: green;')


		// set the body to red if any fails otw green
		setTimeout(function() {
			if (window.document && document.body) {
				TinyTestHelper.renderStats(tests, failCount);
			}
		}, 0)
	},

	fail: function(msg) {
		throw new Error(msg);
	},

	eq: function(a, b, msg) {
		if (a !== b) {
			var myMsg = 'expected "' + a + '" to be "' + b + '". ' + (msg === undefined ? '' : msg);
			throw new Error(myMsg);
		}
	},

	notEq: function(a, b, msg) {
		if (a === b) {
			var myMsg = 'expected "' + a + '" to not equal "' + b + '". ' + (msg === undefined ? '' : msg);
			throw new Error(myMsg);
		}
	},

	assert: function(expectation, msg) {
		if (!expectation) {
			throw new Error(msg);
		}
	},

	objEq: function(a, b, msg) {
		var exp = JSON.stringify(a);
		var act = JSON.stringify(b);

		if (exp !== act) {
			var myMsg = 'expected "' + exp + '" to equal "' + act + '". ' + (msg === undefined ? '' : msg);
			throw new Error(myMsg);
		}
	}
}

// declare functions that access the methods of tinytest
var tests = tinytest.run.bind(tinytest),
	eq = tinytest.eq.bind(tinytest),
	notEq = tinytest.notEq.bind(tinytest),
	assert = tinytest.assert.bind(tinytest),
	objEq = tinytest.objEq.bind(tinytest),
    fail = tinytest.fail.bind(tinytest);