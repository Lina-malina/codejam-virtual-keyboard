import {
  russianCharts, russianChartsUpper, englishCharts, englishChartsUpper,
} from './const.js';

// Keyboard generation
const keyboard = document.createElement('div');
keyboard.className = 'keyboard';
document.body.prepend(keyboard);
const textarea = document.createElement('textarea');
textarea.className = 'textarea';
document.body.prepend(textarea);
let language = localStorage.getItem('language');
if (!language) {
  language = 'eng';
  localStorage.setItem('language', language);
}

function createChar(char, keyboardRow) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.className = 'keyboard_keys--key';
  button.innerText = char;
  if (char === 'backspace' || char === 'tab'
    || char === 'enter' || char === 'shift'
    || char === 'ctrl' || char === 'alt') {
    button.className = 'keyboard_keys--key wide';
  }
  if (char === ' ') {
    button.className = 'keyboard_keys--key extra-wide';
  }
  if (char === 'caps lock') {
    button.classList.add('keyboard_keys--key');
    button.classList.add('wide');
    button.classList.add('active_caps_lock');
  }
  keyboardRow.append(button);
}
function createKeyboard(chartsArray, keyboardClass, isVisible) {
  const keyboardContainer = document.createElement('div');
  keyboardContainer.classList.add('hidden');
  keyboardContainer.classList.add(keyboardClass);
  if (isVisible) {
    keyboardContainer.classList.add('visible');
  }
  chartsArray.forEach((row) => {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard--keys_row';
    row.forEach((char) => createChar(char, keyboardRow));
    keyboardContainer.append(keyboardRow);
  });
  keyboard.append(keyboardContainer);
}

createKeyboard(russianCharts, 'russianKeyboard', language === 'ru');
createKeyboard(russianChartsUpper, 'russianKeyboardUp', language === 'Ru');
createKeyboard(englishCharts, 'englishKeyboard', language === 'eng');
createKeyboard(englishChartsUpper, 'englishKeyboardUp', language === 'Eng');

let currentKeyboard = document.querySelector('.visible');
let currentChartsArray;
if (language === 'ru') {
  currentChartsArray = russianCharts;
} else if (language === 'Ru') {
  currentChartsArray = russianChartsUpper;
} else if (language === 'eng') {
  currentChartsArray = englishCharts;
} else {
  currentChartsArray = englishChartsUpper;
}

// Press button on physical keyboard -> highlight the corresponding virtual button
function getPressedButton(event) {
  let pressedButtonRow;
  let pressedButtonIndex;
  let pressedButton = event.key.toLocaleLowerCase();
  if (pressedButton === 'capslock') {
    pressedButton = 'caps lock';
  }
  if (pressedButton === 'control') {
    pressedButton = 'ctrl';
  }
  if (event.code === 'ShiftRight') {
    pressedButtonRow = 3;
    pressedButtonIndex = 11;
  } else if (event.code === 'ControlRight') {
    pressedButtonRow = 4;
    pressedButtonIndex = 4;
  } else if (event.code === 'AltRight') {
    pressedButtonRow = 4;
    pressedButtonIndex = 3;
  } else {
    pressedButtonRow = currentChartsArray.findIndex((row) => row.indexOf(pressedButton) !== -1);
    if (pressedButtonRow === -1) {
      return undefined;
    }
    pressedButtonIndex = currentChartsArray[pressedButtonRow].indexOf(pressedButton);
  }
  const htmlKeyboardRows = currentKeyboard.querySelectorAll('.keyboard--keys_row');
  const htmlPressedButtonRow = htmlKeyboardRows[pressedButtonRow];
  const htmlPressedButton = htmlPressedButtonRow.children[pressedButtonIndex];

  return htmlPressedButton;
}
function changeRegister() {
  let keyboardToChangeRegister;
  if (currentKeyboard.classList.contains('russianKeyboard')) {
    keyboardToChangeRegister = document.querySelector('.russianKeyboardUp');
    localStorage.setItem('language', 'Ru');
  } else if (currentKeyboard.classList.contains('russianKeyboardUp')) {
    keyboardToChangeRegister = document.querySelector('.russianKeyboard');
    localStorage.setItem('language', 'ru');
  } else if (currentKeyboard.classList.contains('englishKeyboard')) {
    keyboardToChangeRegister = document.querySelector('.englishKeyboardUp');
    localStorage.setItem('language', 'Eng');
  } else {
    keyboardToChangeRegister = document.querySelector('.englishKeyboard');
    localStorage.setItem('language', 'eng');
  }
  currentKeyboard.classList.remove('visible');
  keyboardToChangeRegister.classList.add('visible');
  currentKeyboard = keyboardToChangeRegister;
}
document.body.addEventListener('keydown', (event) => {
  const htmlPressedButton = getPressedButton(event);
  if (htmlPressedButton !== undefined) {
    if (htmlPressedButton.innerText === 'caps lock') {
      changeRegister();
    } else {
      htmlPressedButton.classList.add('active');
    }
  }
});
document.body.addEventListener('keyup', (event) => {
  const htmlPressedButton = getPressedButton(event);
  if (htmlPressedButton !== undefined) {
    htmlPressedButton.classList.remove('active');
  }
});

// Click on virtual button -> show the corresponding char in the textarea
const buttons = document.querySelectorAll('.keyboard_keys--key');
buttons.forEach((btn) => btn.addEventListener('mousedown', () => {
  const char = btn.innerText;
  if (char === 'backspace') {
    textarea.value = textarea.value.slice(0, -1);
  } else if (char === 'tab') {
    textarea.value += '\t';
  } else if (char === 'enter') {
    textarea.value += '\n';
  } else if (char === 'caps lock') {
    changeRegister();
  } else if (char === '') {
    textarea.value += ' ';
  } else if (char !== 'alt' && char !== 'ctrl' && char !== 'shift') {
    textarea.value += char;
  }
}));

// Language switcher -> alt + shift
// Implement from https://plnkr.co/edit/Mm2lX4LILnAMXGur0eMv?p=preview
function languageSwitcher(func, ...codes) {
  const pressed = new Set();
  document.body.addEventListener('keydown', (event) => {
    pressed.add(event.code);

    for (let i = 0; i < codes.length; i += 1) {
      if (!pressed.has(codes[i])) {
        return;
      }
    }
    func();
  });

  document.addEventListener('keyup', (event) => {
    pressed.delete(event.code);
  });
}
function changeKeyboardLayout() {
  if (currentChartsArray === englishCharts) {
    currentChartsArray = russianCharts;
    currentKeyboard.classList.remove('visible');
    currentKeyboard = document.querySelector('.russianKeyboard');
    currentKeyboard.classList.add('visible');
    localStorage.setItem('language', 'ru');
  } else {
    currentChartsArray = englishCharts;
    currentKeyboard.classList.remove('visible');
    currentKeyboard = document.querySelector('.englishKeyboard');
    currentKeyboard.classList.add('visible');
    localStorage.setItem('language', 'eng');
  }
}
languageSwitcher(changeKeyboardLayout, 'AltLeft', 'ShiftLeft');

// Fix 'caps lock' button highlighting
document.querySelector('.russianKeyboard .active_caps_lock').classList.remove('active_caps_lock');
document.querySelector('.englishKeyboard .active_caps_lock').classList.remove('active_caps_lock');
