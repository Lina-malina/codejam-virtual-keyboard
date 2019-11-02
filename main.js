const russianCharts = [
    ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\'],
    ['caps lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter'],
    ['shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'shift'],
    ['ctrl', 'alt', ' ', 'alt', 'ctrl']
];


let keyboard = document.createElement('div');
keyboard.className = 'keyboard';
document.body.prepend(keyboard);

let textarea = document.createElement('textarea');
textarea.className = 'textarea';
document.body.prepend(textarea);

russianCharts.forEach(row => {
    let keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard--keys_row';
    row.forEach(char => createChar(char, keyboardRow));
    keyboard.append(keyboardRow);
});

function createChar (char, keyboardRow) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.className = 'keyboard_keys--key';
    button.innerText = char;

    if(char == 'backspace' || char == 'caps lock' || 
        char == 'tab' || char == 'enter' || char == 'shift' || 
        char == 'ctrl' || char == 'alt') {
        button.className = 'keyboard_keys--key wide';
    }
    if(char == ' ') {
        button.className = 'keyboard_keys--key extra-wide';
    }

    keyboardRow.append(button);
}

document.body.addEventListener('keydown', event => {
    let htmlPressedButton = getPressedButton();
    htmlPressedButton.classList.add('active');
});

document.body.addEventListener('keyup', event => {
    let htmlPressedButton = getPressedButton();
    htmlPressedButton.classList.remove('active');
});

function getPressedButton () {
    let pressedButton = event.key.toLocaleLowerCase();
    if(pressedButton == 'capslock') {
        pressedButton = 'caps lock'
    };
    if(pressedButton == 'control') {
        pressedButton = 'ctrl'
    };
    console.log(pressedButton)
    let pressedButtonRow = russianCharts.findIndex(row => row.indexOf(pressedButton) != -1);
    let pressedButtonIndex = russianCharts[pressedButtonRow].indexOf(pressedButton);
    let htmlKeyboardRows = document.querySelectorAll('.keyboard--keys_row');
    let htmlPressedButtonRow = htmlKeyboardRows[pressedButtonRow];
    let htmlPressedButton =  htmlPressedButtonRow.children[pressedButtonIndex];

    return htmlPressedButton;
}

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
            buttons.forEach(char.toUpperCase);
        } else if (char == '') {
            textarea.value += ' ';
        } else if (char == 'alt' || char == 'ctrl' || char == 'shift') {

        } else {
            textarea.value += char;
        }
    }
));