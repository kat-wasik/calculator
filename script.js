const display = document.querySelector(".display");
const numberKeys = document.querySelectorAll(".numberKey");
const operatorKeys = document.querySelectorAll(".operatorKey");
const clearKey = document.querySelector(".clearKey");
const equalsKey = document.querySelector(".equalsKey");

let operand1 = "";
let operand2 = "";
let selectedOperator = "";
let digitWasLastPressed = false;

function calculate(a, b, operator) {
  const operators = {
    "+": a + b,
    "-": a - b,
    "\u00D7": a * b,
    "\u00F7": a / b
  };
  let result = operators[operator];
  return result;
}

// add event listeners to all number keys
numberKeys.forEach(function(numberKey) {
  numberKey.addEventListener('click', function(event) {
    // determine which digit got pressed
    let digit = event.target.textContent;
    // prevent user from starting numbers with zeros
    // also start a new number after an operator was pressed
    if (display.textContent === "0" || !digitWasLastPressed) {
      display.textContent = digit;
    } else if (display.textContent.length < 16) {
      // The MAX_SAFE_INTEGER constant has a value of 9007199254740991 so anything above 16 digits won't work anyway
      display.textContent += digit;
    }
    digitWasLastPressed = true;
  });
});

// add event listeners to all operator keys
operatorKeys.forEach(function(operatorKey) {
  operatorKey.addEventListener('click', function(event) {
    // check if user entered a new number
    if (digitWasLastPressed) { // does not activate if user pressed a second operator in a row
      if (operand1 !== "") {
        // if we already have the first operand, calculate and display the result
        operand2 = parseInt(display.textContent);
        display.textContent = calculate(operand1, operand2, selectedOperator);
        // save the result as the new first operand for future calculations
        operand1 = parseFloat(display.textContent);
      } else {
      // save the number on the display as the first operand, since we don't have any
        operand1 = parseInt(display.textContent);
      }
    }
    // if user presses a few operators in a row, the code above gets ignored
    // and only the last operator is remembered for calculation.
    // e.g. input "2+-*2" is calculated as "2*2"
    selectedOperator = event.target.textContent;
    digitWasLastPressed = false;
  });
});

// add event listener to the equals key
equalsKey.addEventListener('click', function() {
  // check if we already have the first operand and the second number on the display.
  // if yes: calculate result. if not: do nothing.
  if (operand1 !== "" && digitWasLastPressed) {
    operand2 = parseInt(display.textContent);
    display.textContent = calculate(operand1, operand2, selectedOperator);
    operand1 = parseFloat(display.textContent);
    digitWasLastPressed = false;
  }
});

// add event listener to the clear key
clearKey.addEventListener('click', function() {
  // reset important values
  display.textContent = "0";
  operand1 = "";
  digitWasLastPressed = false;
});
