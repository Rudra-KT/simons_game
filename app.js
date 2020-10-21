// See if jQuery properly loaded
// $(document).ready(() => console.log("Ready"));

///// TODO 1: Recognize Key Strokes to start the game
///// TODO 2: Initialize variables and start randomly adding colors to press
///// TODO 3: Track users Clicks and check them against the random generated colors
///// TODO 4: Track outcomes and display them on screen
///// TODO 5: Add Animations and classes
// TODO 6: Add different difficulties (varies in tempo and showing the whole order) 

// * ----------------- GAME OBJECTS ----------------- * //

let gameControl = {
    gameRunning: false,
    colors: ["green", "red", "yellow", "blue"],
    goalOrder: [],
    userOrder: [],
    showPattern: 3
};

let sounds = {
    wrong: new Audio("sounds/wrong.mp3"),
    green: new Audio("sounds/green.mp3"),
    blue: new Audio("sounds/blue.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    red: new Audio("sounds/red.mp3")
};

// * ----------------- EVENT LISTENERS ----------------- * //

// * Starter Function on key press
$(document).keydown(function () {
    if (!gameControl.gameRunning) {
        initGame();
    };
});

// * Catches the game Button Clicks
$(".btn").click(function () {
    if (gameControl.gameRunning) {
        playSound(this.id);
        checkInput(this.id);
        console.log(gameControl.goalOrder);
        this.classList.add("pressed");
        setTimeout(() => this.classList.remove("pressed"), 100);
    };
});

// * Catches the game Button Clicks
$(".btn-show-pattern").click(function () {
    if (gameControl.gameRunning && gameControl.showPattern !== 0) {
        showFullPattern(this);
    };
});

// * ----------------- CONTROL FUNCTIONS ----------------- * //

// * Initializes the game
function initGame() {
    console.log("Init Game!");
    gameControl.gameRunning = true;
    $(".btn-show-pattern").text("Show full pattern (" + gameControl.showPattern + " left)");
    addColor();
    setLevel();
    console.log(gameControl.goalOrder);
}

// * Checks if the input is correct and if a new level should be set
function checkInput(color) {

    gameControl.userOrder.push(color);

    let roundIsOver = (gameControl.goalOrder.length === gameControl.userOrder.length);
    let orderWasCorrect = checkArrays();

    if (!orderWasCorrect) {
        console.log("Wrong :(");
        $("#level-title").text("Game Over! Press any button to restart");
        gameControl.gameRunning = false;
        gameControl.goalOrder = [];
        gameControl.userOrder = [];
        gameControl.showPattern = 3;
        sounds.wrong.play();
        $("body").addClass("game-over");
        setTimeout(() => $("body").removeClass("game-over"), 400);

    } else if (orderWasCorrect && roundIsOver) {
        console.log("Correct :)");
        $("#level-title").text("Correct :)")

        setTimeout(function () {
            addColor();
            setLevel();
            gameControl.userOrder = [];
        }, 800);

    };
};

function showFullPattern(obj) {
    gameControl.showPattern -= 1;
    obj.innerHTML = "Show full pattern (" + gameControl.showPattern + " left)";
    let index = 0
    let interval = setInterval(() => {
        if (index === gameControl.goalOrder.length) {
            clearInterval(interval);
        } else {
            let color = gameControl.goalOrder[index];
            playSound(color);
            $("#" + color).addClass("pressed-comp");
            $("#" + color).fadeOut(200);
            setTimeout(() => $("#" + color).removeClass("pressed-comp"), 200);
            $("#" + color).fadeIn(200);
            index++;
        }
    }, 1000)
}

// * ----------------- HELPER FUNCTIONS ----------------- * //

// * Adds a color to the stack
function addColor() {
    console.log("Color added!");
    let colorToAdd = gameControl.colors[generateNumber()];
    gameControl.goalOrder.push(colorToAdd);
    playSound(colorToAdd);
    $("#" + colorToAdd).addClass("pressed-comp");
    $("#" + colorToAdd).fadeOut(200);
    setTimeout(() => $("#" + colorToAdd).removeClass("pressed-comp"), 200);
    $("#" + colorToAdd).fadeIn(200);

}

// * Generates a random number based on the length of the available colors
function generateNumber() {
    return Math.floor(Math.random() * gameControl.colors.length)
}

// * Sets the level header based on the length of current colors
function setLevel() {
    console.log("Level Set!");
    $("#level-title").text("Level " + gameControl.goalOrder.length)
}

// * Checks the inputs for color and order
function checkArrays() {
    for (let i = 0; i < gameControl.userOrder.length; i++) {
        if (gameControl.goalOrder[i] !== gameControl.userOrder[i]) return false;
    };
    return true;
}

function playSound(color) {
    sounds[color].load();
    sounds[color].play();
}