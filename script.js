let currentInput = '0';
let previousInput = '';
let operator = null;
let resultShown = false;

const displayCurrent = document.getElementById('displayCurrent');
const displayPrev = document.getElementById('displayPrev');

function updateDisplay() {
  displayCurrent.textContent = currentInput;
  displayPrev.textContent = previousInput ? `${previousInput}` : '\u00A0';
}

function appendNumber(num) {
  if (resultShown) {
    currentInput = num;
    resultShown = false;
  } else if (currentInput === '0') {
    currentInput = num;
  } else {
    if (currentInput.replace('-', '').replace('.', '').length >= 14) return;
    currentInput += num;
  }
  updateDisplay();
}

function appendDecimal() {
  if (resultShown) {
    currentInput = '0.';
    resultShown = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (operator !== null && !resultShown) {
    calculate();
  }
  operator = op;
  previousInput = `${currentInput} ${operator}`;
  resultShown = true;
  updateDisplay();
}

function calculate() {
  if (operator === null || resultShown) return;
  const prevValue = parseFloat(previousInput);
  const currValue = parseFloat(currentInput);
  if (isNaN(prevValue) || isNaN(currValue)) return;

  let result;
  switch (operator) {
    case '+': result = prevValue + currValue; break;
    case '−': result = prevValue - currValue; break;
    case '×': result = prevValue * currValue; break;
    case '÷': result = currValue === 0 ? NaN : prevValue / currValue; break;
    case '%': result = prevValue % currValue; break;
    default: return;
  }

  previousInput = `${prevValue} ${operator} ${currValue} =`;
  currentInput = isNaN(result) ? 'Error' : trimResult(result);
  operator = null;
  resultShown = true;
  updateDisplay();
}

function trimResult(num) {
  let str = String(Math.round(num * 1e10) / 1e10);
  if (str.length > 14) {
    str = num.toExponential(6);
  }
  return str;
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  resultShown = false;
  updateDisplay();
}

function deleteLast() {
  if (resultShown) {
    clearAll();
    return;
  }
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('−');
  else if (e.key === '*') chooseOperator('×');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});

updateDisplay();