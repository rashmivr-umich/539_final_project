


// _____________________________________________________________________________________
// Game logic javascript reference: https://www.youtube.com/watch?v=oZrp3Atkz18

// To replace 'X' and 'O' text with images, UM-GPT was used to generate reference code

// To make the game keyboard accesible, UM-GPT was used to generate reference code
// TO make the game screen reader accessible, 

// For updating player's turn content reference used: https://www.youtube.com/watch?v=AnmwHjpEhtA

let player = document.querySelector(".player")
let restartBtn = document.querySelector("#restartBtn")

// let boardcells = Array.from(document.getElementsByClassName("boardcell"))
let boardcells = Array.from(document.querySelectorAll(".boardcell")) //creates array from 'array-like' object

// Get variable of winning block color from CSS
let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')

console.log(boardcells)

const LEAF = "Leaf"
const NUT = "Mumsi"

const LEAF_IMAGE = "images/illustrations/leaf-green.png"
const NUT_IMAGE = "images/illustrations/nut-1.png"

let currentPlayer = NUT
let spaces = Array(9).fill(null) //Prevents player from clicking in a filled box

const startGame = () => {
    boardcells.forEach(boardcell => boardcell.addEventListener('click', boxClicked));
    boardcells.forEach(boardcell => boardcell.addEventListener('keydown', keyPressed))
    // boardcells.forEach(boardcell => boardcell.setAttribute('aria-live', `cell ${index + 1}`))
    player.textContent = `${currentPlayer}'s turn`
}


// function boxClicked(e) {
//     playTurn(e.target);
// }

function keyPressed(e) {
    if (e.key === 'Enter') {
        boxClicked(e);
    }
}


function boxClicked(e) {
    const id = e.target.id //accessing the element that triggered the event
    if (!spaces[id]){
        spaces[id] = currentPlayer;
        // e.target.innerHTML = currentPlayer;  - can be used if we need text in boardcell
        const img = document.createElement("img");
        img.src = currentPlayer === NUT ? NUT_IMAGE : LEAF_IMAGE; //check if nut is player
        img.alt = currentPlayer;
        img.classList.add('game-image');

        e.target.appendChild(img);

        // Update aria-label for screen reader - suggested by UM-GPT
        e.target.setAttribute('aria-label', `Cell ${parseInt(id) + 1} filled by ${currentPlayer}`);
        // Adding parseInt reads the numeric digit as a number - reads as 'one' and not 'zero one'


        changePlayer(); //Updates content to show next player's turn
        player.setAttribute('tabindex', '-1')
        player.focus(); // Focus on the player element to announce next player

        if(playerHasWon() !== false){
            player.textContent = `${currentPlayer} has won! 🎉`
            let winningBlocks = playerHasWon() //returns the winning combination array
            console.log(winningBlocks)
            winningBlocks.map(boardcell => {boardcells[boardcell].style.backgroundColor = winnerIndicator;
                boardcells[boardcell].setAttribute('aria-label', `${currentPlayer} has won`);})
            player.focus(); // Focus on the player element to announce the winner
            spaces.fill('filled') //to stop player's from clicking more
            //color the winning cells - boardcell represents element from winningblocks array and is used as index for grabbing element from boardcells
            return //stop game after someone wins
        };

        if (isDraw()) {
            player.textContent = "It's a draw!"
            player.focus(); // Focus on the player element to announce the winner
            return;
        }

        currentPlayer = currentPlayer == NUT ? LEAF : NUT;
        // if statement to change player; if player is nut then change to leaf, otherwise change to nut
    }
}

function changePlayer() {
    player.textContent = (currentPlayer == NUT) ? `${LEAF}'s turn` : `${NUT}'s turn`;
}

// Checking which player wins

const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]

function playerHasWon() {
    for (const condition of winningCombos) {
        //Looping over each winning possibility
        let [a, b, c] = condition //Unpacking like in python

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a,b,c]
        }
    }
    return false //nobody won
}

function isDraw() {
    return spaces.every(space => space !== null);
    //We don't use .forEach as it can be used for doing things to an element in the array. It is not designed to test conditions. .every returns truth value.

}

// Restarts game if player clicks 'play again'
restartBtn.addEventListener('click', restart)

function restart () {
    spaces.fill(null)
    boardcells.forEach((box, index) => {
        box.innerHTML = ""
        box.style.backgroundColor = ""; // Clear background color
        box.setAttribute('aria-label', `cell ${index + 1}`); // Reset aria-label with numeric values - suggested by UM-GPT
    })
    currentPlayer = NUT

    player.textContent = 'Tic Tac Toe'
}


startGame();




// ------------ Old trial code - not accessible, no images

// // Game logic javascript reference: https://www.youtube.com/watch?v=oZrp3Atkz18

// let player = document.querySelector(".player")
// let restartBtn = document.querySelector("#restartBtn")
// // let boardcells = Array.from(document.getElementsByClassName("boardcell"))
// let boardcells = Array.from(document.querySelectorAll(".boardcell")) //creates array from 'array-like' object

// // Get variable of winning block color from CSS
// let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--maize')

// console.log(boardcells)

// const LEAF = "O"
// const NUT = "X"

// let currentPlayer = NUT
// let spaces = Array(9).fill(null) //Prevents player from clicking in a filled box

// const startGame = () => {
//     boardcells.forEach(boardcell => boardcell.addEventListener('click', boxClicked));
// }

// function boxClicked(e) {
//     const id = e.target.id //accessing the element that triggered the event
//     if (!spaces[id]){
//         spaces[id] = currentPlayer;
//         e.target.innerHTML = currentPlayer;

//         if(playerHasWon() !== false){
//             player = `${currentPlayer} has won`
//             let winningBlocks = playerHasWon() //returns the winning combination array
//             console.log(winningBlocks)
//             winningBlocks.map(boardcell => boardcells[boardcell].style.backgroundColor = winnerIndicator) 
//             //color the winning cells - boardcell represents element from winningblocks array and is used as index for grabbing element from boardcells
//             return //stop game after someone wins
//         };

//         currentPlayer = currentPlayer == NUT ? LEAF : NUT;
//         // if statement to change player; if player is nut then change to leaf, otherwise change to nut
//     }
// }

// // Checking which player wins

// const winningCombos = [
//     [0,1,2],
//     [3,4,5],
//     [6,7,8],
//     [0,3,6],
//     [1,4,7],
//     [2,5,8],
//     [0,4,8],
//     [2,4,6],
// ]

// function playerHasWon() {
//     for (const condition of winningCombos) {
//         //Looping over each winning possibility
//         let [a, b, c] = condition //Unpacking like in python

//         if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
//             return [a,b,c]
//         }
//     }
//     return false //nobody won
// }

// // Restarts game if player clicks 'play again'
// restartBtn.addEventListener('click', restart)

// function restart () {
//     spaces.fill(null)
//     boardcells.forEach(box => {
//         box.innerHTML = ""
//     })
//     currentPlayer = NUT

//     player = 'Tic Tac Toe'
// }


// startGame()