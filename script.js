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
// when  click on a ball, cycle through its states, 0, 1 or 2
function cycleState(e) {
    let ballNumber = e.target.id;
    var state = JSON.parse(loadState(ballNumber));
    state = (state + 1) % 3;
    saveState(ballNumber, state);
    return state;
}
// when the page loads, load the state of the 7 balls, if any is not there, set it to 0
function loadAllStates() {
    for (let i = 1; i < 8; i++) {
        let state = loadState(i);
        if (state === null) {
            saveState(i, 0);
        }
    }
}
loadAllStates();