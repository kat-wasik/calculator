const display = document.querySelector(".display");
const numberKeys = document.querySelectorAll(".numberKey");
const operatorKeys = document.querySelectorAll(".operatorKey");
const clearKey = document.querySelector(".clearKey");
const decimalKey = document.querySelector(".decimalKey");
const equalsKey = document.querySelector(".equalsKey");
const backspaceKey = document.querySelector(".backspaceKey");
const negativeKey = document.querySelector(".negativeKey");

let operand1 = "";
let operand2 = "";
let selectedOperator = "";
let digitWasLastPressed = true;

function pressOperatorKey(operator) {
  const pressedColor = getComputedStyle(document.body).getPropertyValue('--pink');
  const translate = getComputedStyle(document.body).getPropertyValue('--translate');
  const pressedShadow = getComputedStyle(document.body).getPropertyValue('--pressedShadow');

  selectedOperator.style.color = pressedColor;
  selectedOperator.style.transform = translate;
  selectedOperator.style.boxShadow = pressedShadow;
}

function resetOperatorKey(operator) {
  const notPressedColor = getComputedStyle(document.body).getPropertyValue('--dark');
  const defaultShadow = getComputedStyle(document.body).getPropertyValue('--defaultShadow');

  selectedOperator.style.color = notPressedColor;
  selectedOperator.style.transform = "";
  selectedOperator.style.boxShadow = defaultShadow;
}

function calculate(a, b, operator) {
  const operators = {
    "+": a + b,
    "-": a - b,
    "\u00D7": a * b,
    "\u00F7": a / b
  };
  let result = operators[operator];
  // trim result so 10 / 3 displays as 3.333333333333333 instead of 3.3333333333333335
  if (result.toString()[0] == '-') {
    result = result.toString().slice(0,18);
  } else {
    result = result.toString().slice(0,17);
  }
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
    } else if (display.textContent.length < 17) {
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
        operand2 = parseFloat(display.textContent);
        display.textContent = calculate(operand1, operand2, selectedOperator.textContent);
        // save the result as the new first operand for future calculations
        operand1 = parseFloat(display.textContent);
      } else {
      // save the number on the display as the first operand, since we don't have any
        operand1 = parseFloat(display.textContent);
      }
    }
    // if user presses a few operators in a row, the code above gets ignored
    // and only the last operator is remembered for calculation.
    // e.g. input "2+-*2" is calculated as "2*2"
    if (selectedOperator !== "") {
      resetOperatorKey(selectedOperator);
    }
    selectedOperator = event.target;
    pressOperatorKey(selectedOperator);
    digitWasLastPressed = false;
  });
});

// add event listener to the decimal keys
decimalKey.addEventListener('click', function() {
  const decimalRegex = /\./;
  if (!decimalRegex.test(display.textContent)) {
    display.textContent += '.';
    digitWasLastPressed = true;
  }
});

// add event listener to the equals key
equalsKey.addEventListener('click', function() {
  // check if we already have the first operand and the second number on the display.
  // if yes: calculate result. if not: do nothing.
  if (operand1 !== "" && digitWasLastPressed) {
    operand2 = parseFloat(display.textContent);
    display.textContent = calculate(operand1, operand2, selectedOperator.textContent);
    operand1 = parseFloat(display.textContent);
    digitWasLastPressed = false;
    resetOperatorKey(selectedOperator);
  }
});

// add event listener to the clear key
clearKey.addEventListener('click', function() {
  // reset important values
  display.textContent = "0";
  operand1 = "";
  digitWasLastPressed = true;
  resetOperatorKey(selectedOperator);
});

// add event listener to the backspace key
backspaceKey.addEventListener('click', function() {
  if (display.textContent.length === 1) {
    display.textContent = '0';
  } else {
    display.textContent = display.textContent.slice(0,-1);
  }
  digitWasLastPressed = true;
})

// add event listener to the +/- keys
negativeKey.addEventListener('click', function() {
  // Save the number to which we want to add/remove the '-' sign for future reference
  let originalNumber = display.textContent;
  if (display.textContent !== "0") {
    if (display.textContent[0] === "-") {
      display.textContent = display.textContent.slice(1);
    } else {
      display.textContent = '-' + display.textContent;
    }
    // if user wants to add/remove '-' to the result of previous calculation we need to overwrite the operand1 value
    if (operand1 == originalNumber) { // won't work with strict equality sign!
      operand1 = parseFloat(display.textContent);
    }
  }
});
