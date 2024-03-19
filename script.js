/* 
center positions
#indicator-1 {
    top: calc(55% - 4%);
    left: 48%;
}

#indicator-2 {
    top: calc(55% - 3.5%);
    left: calc(48% + 5%);
}

#indicator-3 {
    top: 55%;
    left: calc(48% + 7%);
}

#indicator-4 {
    top: calc(55% + 3.5%);
    left: calc(48% + 5%);
}

#indicator-5 {
    top: calc(55% + 4%);
    left: 48%;
}

#indicator-6 {
    top: calc(55% + 2.5%);
    left: calc(48% - 4%);
}

#indicator-7 {
    top: calc(55% - 1.5%);
    left: calc(48% - 4%);
} */
const indicatorsCenterPositions = {
    1: { top: 'calc(55% - 4%)', left: '48%' },
    2: { top: 'calc(55% - 3.5%)', left: 'calc(48% + 5%)' },
    3: { top: '55%', left: 'calc(48% + 7%)' },
    4: { top: 'calc(55% + 3.5%)', left: 'calc(48% + 5%)' },
    5: { top: 'calc(55% + 4%)', left: '48%' },
    6: { top: 'calc(55% + 2.5%)', left: 'calc(48% - 4%)' },
    7: { top: 'calc(55% - 1.5%)', left: 'calc(48% - 4%)' }
};
const clues = [
    '¡Ayúdame a pedir mi deseo!',
    'Como en nuestras tardes de juegos, la aventura empieza donde guardamos secretos, sueños e incontables horas de diversión. Ahí encontrarás la estrella que ilumina nuestro inicio.',
    'En el mundo de Hyrule o explorando el Reino Champiñón, siempre has sido mi compañera de aventuras. Busca en el lugar donde Link y Mario descansan, para encontrar la próxima estrella.',
    'Para seguir tu camino en esta búsqueda, necesitarás la energía de una Saiyan. Encuentra el sustento de Goku para descubrir tu próximo destino.',
    'En tierras lejanas y ciudades desconocidas, has demostrado ser una estratega y compañera sin igual. Busca entre los juegos donde hemos combatido juntos y descubierto tesoros.',
    'Como dijo Tyrion, busca las piedras de afilar que utilizaste para alcanzar y mantener tu agudeza.',
    'Para alcanzar el próximo nivel, una verdadera Saiyan nunca deja de entrenar. A Brandon Stark le habría encantado tener de estos  antes de su caída. Tu fuerza interior te guiará a la siguiente estrella.',
    'Para encontrar la próxima estrella, necesitarás de todo tu poder e inteligencia, pues tendrás que derrotar a un antiguo mal durmiente que la ha consumido y tomarla de sus mismísimas entrañas.'
];
let currentClue = 0;
function setClue() {
    let clue = document.getElementById('clue-container');
    clue.innerHTML = clues[currentClue];
}
// save to local storage the state of the 7 balls
function saveState(ballNumber, state) {
    localStorage.setItem(ballNumber, JSON.stringify(state));
}
// load from local storage the state of the 7 balls
function loadState(ballNumber) {
    return localStorage.getItem(ballNumber);
}
// clear local storage
function clearState() {
    localStorage.clear();
}
function setBallState(ballNumber, state) {
    let ball = document.getElementById(`${ballNumber}-img`);
    ball.classList.remove('ball-transparent');
    ball.classList.remove('ball-outlined');
    if (state === 0) {
        ball.classList.add('ball-transparent');
    } else if (state === 2) {
        ball.classList.add('ball-outlined');
    }
}
// when  click on a ball, cycle through its states, 0, 1 or 2
function cycleState(id) {
    let ballNumber = id;
    let state = JSON.parse(loadState(ballNumber));
    if (state !== 0) { return state }
    state = (state + 1) % 2;
    saveState(ballNumber, state);
    setBallState(ballNumber, state);
    currentClue = parseInt(ballNumber.split('-')[1]);
    setClue();
    // check for any other ball that is 1 and set it to 0
    for (let i = 1; i < 8; i++) {
        if (`ball-${i}` !== ballNumber) {
            console.log(`ball-${i}`)
            let state = JSON.parse(loadState(`ball-${i}`));
            if (state === 1) {
                saveState(`ball-${i}`, 0);
                setBallState(`ball-${i}`, 0);
            }
        }
    }
    return state;
}
// when the page loads, load the state of if 7 balls, if any is not there, set it to 0
function loadAllStates() {
    for (let i = 1; i < 8; i++) {
        let state = JSON.parse(loadState(`ball-${i}`));
        if (state === null) {
            state = 0;
        }
        if (state === 1) {
            currentClue = i;
        }
        saveState(`ball-${i}`, state);
        setBallState(`ball-${i}`, state);
        // if any ball is 2, set the right indicator's style to its center position
        if (state === 2) {
            let indicator = document.getElementById(`indicator-${i}`);
            indicator.style.top = indicatorsCenterPositions[i].top;
            indicator.style.left = indicatorsCenterPositions[i].left;
        }
    }
    setClue();
}

// Helper function to set a timeout to change the ball state after 2 seconds
function startPressTimer(ballNumber) {
    return setTimeout(function () {
        saveState(ballNumber, 2);
        setBallState(ballNumber, 2);
        // play secret-sound.mp3 once
        let audio = new Audio('secret-sound.mp3');
        audio.play();
        // change the right indicator's style to its center position
        let indicator = document.getElementById(`indicator-${ballNumber.split('-')[1]}`);
        indicator.style.top = indicatorsCenterPositions[ballNumber.split('-')[1]].top;
        indicator.style.left = indicatorsCenterPositions[ballNumber.split('-')[1]].left;

    }, 2000); // 2000 milliseconds = 2 seconds
}

// Setup the event listeners for each ball container
function setupLongPressListeners() {
    let timers = {}; // Keep track of timers for each ball

    // Setup the long press event for each ball container
    for (let i = 1; i <= 7; i++) {
        let ballContainer = document.getElementById(`ball-${i}`);

        ballContainer.addEventListener('mousedown', function (event) {
            timers[i] = startPressTimer(`ball-${i}`);
        });
        ballContainer.addEventListener('touchstart', function (event) {
            timers[i] = startPressTimer(`ball-${i}`);
        });

        // Cancel the timer if the user stops pressing
        ballContainer.addEventListener('mouseup', function (event) {
            clearTimeout(timers[i]);
        });
        ballContainer.addEventListener('mouseleave', function (event) {
            clearTimeout(timers[i]);
        });
        ballContainer.addEventListener('touchend', function (event) {
            clearTimeout(timers[i]);
        });
    }
}

loadAllStates();
setupLongPressListeners();


