// Главное состояние игры
const gameState = {
    currentStep: 'start',
    playerName: '',
    inventory: [],
    stationStatus: {
        power: 35,
        oxygen: 78,
        sanity: 10 // "Рассудок" ИИ станции
    }
};

// Элементы DOM
const splashScreen = document.getElementById('splash-screen');
const startBtn = document.getElementById('start-btn');
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const commandInput = document.getElementById('command-input');

// Загружаем историю
let storyData;
fetch('data/story.json')
    .then(response => response.json())
    .then(data => storyData = data)
    .catch(error => console.error('Ошибка загрузки story.json:', error));

// Инициализация
function init() {
    startBtn.addEventListener('click', startGame);
    commandInput.addEventListener('keydown', handleCommand);
    commandInput.focus();
}

// Начало игры
function startGame() {
    splashScreen.style.display = 'none';
    terminal.style.opacity = '1';

    // Запускаем звуковое сопровождение
    soundManager.play('ambient', true);
    soundManager.play('music', true);

    // Выводим начальное сообщение
    typeText(storyData.start.message, 'ai', () => {
        commandInput.focus();
    });
}

// Обработчик команд игрока
function handleCommand(e) {
    if (e.key !== 'Enter') return;

    const command = commandInput.value.trim().toLowerCase();
    commandInput.value = '';

    // Проигрываем звук набора
    soundManager.play('click');

    // Выводим команду игрока
    addToOutput('> ' + command, 'player');

    // Обрабатываем команду
    processCommand(command);
}

// Обработчик логики команд
function processCommand(command) {
    // Здесь будет сложная логика, зависящая от currentStep
    // Упрощенный пример:
    switch (gameState.currentStep) {
        case 'start':
            if (command === 'привет') {
                typeText(storyData.start.responses['привет'], 'ai');
                gameState.currentStep = 'intro';
            } else {
                typeText('> СИСТЕМА: КОМАНДА НЕ РАСПОЗНАНА. ПОПРОБУЙТЕ "ПРИВЕТ".', 'system');
            }
            break;
        case 'intro':
            // ... и так далее, логика для каждого шага
            if (command.includes('название')) {
                typeText('> СИСТЕМА: ЭТО СТАНЦИЯ "ЭПСИЛОН". МОЙ ИДЕНТИФИКАТОР - АИ-734. А ВАШ?', 'ai');
                gameState.currentStep = 'get_name';
            }
            break;
        case 'get_name':
            gameState.playerName = command;
            typeText(`> АИ-734: ПРИВЕТСТВУЮ, ${command.toUpperCase()}. СВЯЗЬ... НЕСТАБИЛЬНА...`, 'ai');
            // Спецэффект глитча
            setTimeout(() => {
                soundManager.play('glitch');
                addToOutput('> ОШИБКА! ОШИБКА! КОД 0x7B3F... ЗАГРУЗКА ДНЕВНИКА...', 'glitch');
            }, 2000);
            break;
        // ... и другие кейсы
        default:
            addToOutput('> СИСТЕМА: ПЕРЕЗАГРУЗКА ИНТЕРФЕЙСА...', 'system');
    }
}

// Функция для красивого вывода текста с эффектом печатания
function typeText(text, type = 'ai', callback = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    output.appendChild(messageDiv);

    let i = 0;
    const speed = 20; // Скорость печати

    function typeWriter() {
        if (i < text.length) {
            messageDiv.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else if (callback) {
            setTimeout(callback, 500);
        }
    }
    typeWriter();
}

// Простая функция для быстрого вывода текста
function addToOutput(text, type = 'ai') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    output.appendChild(messageDiv);
    // Автоскролл к новому сообщению
    output.scrollTop = output.scrollHeight;
}

// Запускаем игру когда страница загрузится
window.addEventListener('load', init);
