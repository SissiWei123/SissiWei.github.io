$(document).ready(function() {
  var result = 0;
  var prevEntry = 0;
  var currentEntry = '0';
  var equalClicked = 0;
  let expre = " ";
  updateScreen(result);

  $('.button').on('click', function(evt) {
    var buttonPressed = $(this).html();
    console.log(buttonPressed);
    try {
      if (buttonPressed === "C") {
        result = 0;
        currentEntry = '0';
        equalClicked = 0;
        expre = "";

      } else if (buttonPressed === "CE") {
        currentEntry = '0';

      } else if (buttonPressed === '.') {
        currentEntry += '.';

      } else if (buttonPressed === '(' && currentEntry === '0') {
        currentEntry = '(';

      } else if (buttonPressed === ')' && currentEntry === '0') {
        currentEntry = '0';

      } else if (isNumber(buttonPressed)) {
        if (currentEntry === '0') {
          currentEntry = buttonPressed;
        }
        else {
          currentEntry = currentEntry + buttonPressed;
        }
      } else if (isOperator(buttonPressed)) {

        expre += currentEntry + buttonPressed;
        if (expre.includes('=')) {
          expre = currentEntry + buttonPressed;
        }

        currentEntry = '';

      } else if (buttonPressed === '=') {
        equalClicked += 1;
        expre += currentEntry;
        currentEntry = eval(expre);
        expre += " = " + currentEntry;
      }
    }
    catch(e) {
      expre = "ERROR";
    }
    finally {
      updateScreen(currentEntry,expre);
    }
  });
});

updateScreen = function(displayValue,expre) {
  var displayValue = displayValue.toString();
  $('.screen').html(displayValue.substring(0, 10));
  $('.display').html(expre);
};

isNumber = function(value) {
  return !isNaN(value);
}

isOperator = function(value) {
  return value === '/' || value === '*' || value === '+' || value === '-' || value === '(' || value === ')';
};
