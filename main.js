const russianCharts = [
    ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\'],
    ['caps lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter'],
    ['shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'shift'],
    ['ctrl', 'alt', ' ', 'alt', 'ctrl']
];

const russianChartsUpper = [
    ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace'],
    ['tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/'],
    ['caps lock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter'],
    ['shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'shift'],
    ['ctrl', 'alt', ' ', 'alt', 'ctrl']
];

const englishCharts =  [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
    ['ctrl', 'alt', ' ', 'alt', 'ctrl']
];


const englishChartsUpper =  [
    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace'],
    ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
    ['caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter'],
    ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift'],
    ['ctrl', 'alt', ' ', 'alt', 'ctrl']
];

// Keyboard generation 

let keyboard = document.createElement('div');
keyboard.className = 'keyboard';
document.body.prepend(keyboard);

let textarea = document.createElement('textarea');
textarea.className = 'textarea';
document.body.prepend(textarea);


let language = localStorage.getItem('language');
if(!language) {
    language = 'eng';
    localStorage.setItem('language', language);
}

createKeyboard(russianCharts, 'russianKeyboard', language == 'ru'); 
createKeyboard(russianChartsUpper, 'russianKeyboardUp', language == 'Ru'); 
createKeyboard(englishCharts, 'englishKeyboard', language == 'eng');
createKeyboard(englishChartsUpper, 'englishKeyboardUp', language == 'Eng');

let currentKeyboard = document.querySelector('.visible');
currentChartsArray = englishCharts;


// Press button on physical keyboard -> highlight the corresponding virtual button 

document.body.addEventListener('keydown', event => {
    let htmlPressedButton = getPressedButton();
    if(htmlPressedButton == undefined) {
        
    } else {
        htmlPressedButton.classList.add('active');
    }
    if(htmlPressedButton.innerText == 'caps lock') {
        changeRegister();
    }
});

document.body.addEventListener('keyup', event => {
    let htmlPressedButton = getPressedButton();
    if(htmlPressedButton == undefined) {
        
    } else {
        htmlPressedButton.classList.remove('active');
    }
});


// Click on virtual button -> show the corresponding char in the textarea 

let buttons = document.querySelectorAll('.keyboard_keys--key');

buttons.forEach(btn => 
    btn.addEventListener('mousedown', function() {
        let char = btn.innerText;
        if(char == 'backspace') {
            textarea.value = textarea.value.slice(0, -1);
        } else if(char == 'tab') {
            textarea.value += '\t'
        } else if (char == 'enter') {
            textarea.value += '\n'
        } else if (char == 'caps lock') {
            changeRegister();
        } else if (char == '') {
            textarea.value += ' ';
        } else if (char == 'alt' || char == 'ctrl' || char == 'shift') {

        } else {
            textarea.value += char;
        }
    }
));

// Language switcher -> alt + shift
// Implement from https://plnkr.co/edit/Mm2lX4LILnAMXGur0eMv?p=preview

languageSwitcher(changeKeyboardLayout, 'AltLeft', 'ShiftLeft');


// Functions

function createKeyboard(chartsArray, keyboardClass, isVisible) {
    let keyboardContainer = document.createElement('div');
    keyboardContainer.classList.add('hidden');
    keyboardContainer.classList.add(keyboardClass);
    if(isVisible) {
     keyboardContainer.classList.add('visible');
    }
    chartsArray.forEach(row => {
         let keyboardRow = document.createElement('div');
         keyboardRow.className = 'keyboard--keys_row';
         row.forEach(char => createChar(char, keyboardRow));
         keyboardContainer.append(keyboardRow);
     });
     keyboard.append(keyboardContainer);
 }
 
function languageSwitcher(func, ...codes) {
    let pressed = new Set();

    document.body.addEventListener('keydown', function(event) {
        pressed.add(event.code);

    for (let code of codes) {
        if (!pressed.has(code)) {
          return;
        }
      }
       func();
    });

    document.addEventListener('keyup', function(event) {
        pressed.delete(event.code);
      });
}

function changeKeyboardLayout() {

    if(currentChartsArray == englishCharts) {
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

function changeRegister () {
    let keyboardToChangeRegister; 
    if(currentKeyboard.classList.contains('russianKeyboard')) {
      keyboardToChangeRegister = document.querySelector('.russianKeyboardUp');
      localStorage.setItem('language', 'Ru');
    } else if(currentKeyboard.classList.contains('russianKeyboardUp')) {
      keyboardToChangeRegister = document.querySelector('.russianKeyboard');
      localStorage.setItem('language', 'ru');
    } else if(currentKeyboard.classList.contains('englishKeyboard')){
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

function createChar (char, keyboardRow) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.className = 'keyboard_keys--key';
    button.innerText = char;

    if(char == 'backspace' || char == 'tab' || 
        char == 'enter' || char == 'shift' || 
        char == 'ctrl' || char == 'alt') {
        button.className = 'keyboard_keys--key wide';
    }
    if(char == ' ') {
        button.className = 'keyboard_keys--key extra-wide';
    }
    if(char == 'caps lock') {
        button.classList.add('keyboard_keys--key');
        button.classList.add('wide');
        button.classList.add('active_caps_lock');
    }

    keyboardRow.append(button);
}

function getPressedButton () {
    let pressedButton = event.key.toLocaleLowerCase();
    
    if(pressedButton == 'capslock') {
        pressedButton = 'caps lock';
    };
    if(pressedButton == 'control') {
        pressedButton = 'ctrl';
    };

    let pressedButtonRow = currentChartsArray.findIndex(row => row.indexOf(pressedButton) != -1);
    if(pressedButtonRow == -1){
        return;
    }
    let pressedButtonIndex = currentChartsArray[pressedButtonRow].indexOf(pressedButton);
    let htmlKeyboardRows = currentKeyboard.querySelectorAll('.keyboard--keys_row');
    let htmlPressedButtonRow = htmlKeyboardRows[pressedButtonRow];
    let htmlPressedButton =  htmlPressedButtonRow.children[pressedButtonIndex];

    return htmlPressedButton;
}

// Fix 'caps lock' button highlighting 

document.querySelector('.russianKeyboard .active_caps_lock').classList.remove('active_caps_lock');
document.querySelector('.englishKeyboard .active_caps_lock').classList.remove('active_caps_lock');