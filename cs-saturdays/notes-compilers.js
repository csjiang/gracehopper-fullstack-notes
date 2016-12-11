// Expression = Term {(+|-) Term} // {} means that you can have zero or more of that rule
// Term = Factor {(*|/) Factor}
// Factor = -Factor
//     | "(" Expression ")"
//     | Number
// Number = [0-9] {([0-9]|.)+}   // Note that this regular expression is a simplification that 
//                               // allows numbers like 324.234.432. We will use it anyway to 
//                               // simplify our code.

// Based on http://en.wikipedia.org/wiki/Recursive_descent_parser

function Calculator(expression) {
  this.expressionToParse = expression.replace(/\s+/g, '').split('');
}

Calculator.prototype.run = function () {
  return this.expression();
}

Calculator.prototype.peek = function () {
  return this.expressionToParse[0] || '';
};

Calculator.prototype.get = function () {
  return this.expressionToParse.shift();
}

/*
  Grammar Rule:
  number = [0-9] {[0-9.]+}
  Hint: remember this means we need to get the first number
    followed by any number of numbers (or the period .)
 */
Calculator.prototype.number = function () {
	if (this.peek() == '\(\d{1}|\.{1})\g') {
		return this.get();
	} else {
		return false;
	}
}

/* Grammar Rule:
  factor = number
          | "(" expression ")"
          | - factor
  Hints:
    - If we see a number, produce a number 
    - If we see a (  then consume it and an expression
    - If we see a "-", return the negative of the factor
 */
Calculator.prototype.factor = function () {
	var result = this.number();
	if (!result) {
		while (this.peek() == '(' || this.peek() == ')') {
			result = this.get().expression();
		} else if (this.get() == '-') {
			result = -this.factor();
		}
	}
  
}

/*
  term = factor {(*|/) factor}
 */
Calculator.prototype.term = function () {
	var result = this.factor();
	while (this.peek() == '*' || this.peek() == '/') {
		if (this.get() == '*') {
			result *= this.factor();
		} else {
			result /= this.factor();
		}
	}
	return result;
};

/* Grammar Rules
    expression = term {(+|-) term}
*/
Calculator.prototype.expression = function () {
  var result = this.term();
  while (this.peek() == '+' || this.peek() == '-') {
    if (this.get() == '+') {
      result += this.term();
    } else {
      result -= this.term();
    }
  }
  return result;
};
  // TODO: Handle additional term productions if we see a + or - at this point
