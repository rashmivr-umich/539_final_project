// CREATING ACCESSIBLE dropdown

// source code referenced and modified from: w3c schools dropdown
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_dropdown_navbar_click
// To make content keyboard accessible UMGPT was used for trouble shooting

// Adding dom content loaded to prevent errors in running javascript. JS will tun only after full html has loaded
document.addEventListener("DOMContentLoaded", () => {
    // interesting note: => this symbol is a shorthand for defining functions

    // setting constants
    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.getElementById("myDropdown");

    // adding event listener for clicking
    dropdownButton.addEventListener("click", dropdown); 
    
    // adding event listener for tabbing and pressing dropdown
    dropdownButton.addEventListener("keydown", function(e){
        // checks if the key pressed is enter
        if (e.key === 'Enter'){
            e.preventDefault(); // prevents default action of enter cause we are defining a new action for it
            dropdown();
        }
    });

    // defining the dropdown function
    function dropdown(){
        const isOpen = dropdownButton.getAttribute("aria-expanded") === 'true';
        // getAttribute method gets the truth value of aria-expanded, and asssigned to a constant
        // checking it against 'true' to check if the retrieved value is true or not

        dropdownButton.setAttribute("aria-expanded", !isOpen);
        // toggling the truth value of aria-expanded, if it is expanded (true), it will collapse, if it is closed(flase), it will open

        dropdownContent.classList.toggle("show");
    }

    // closing dropdown if the person clicks outside
    window.addEventListener("click", function(e){
        if (!e.target.matches(".dropbtn") && !dropdownContent.contains(e.target)){
            closeDropdown();
            // note: !dropdownContent.contains(e.target) checks if the clicked element is not contained within the dropdown content
        }
    });

    // closing dropdown when it loses focus on it
    //interesting - blur is used when focus of an element is lost
    dropdownButton.addEventListener("blur", function(e){
        setTimeout(() => {
            if(!dropdownContent.contains(document.activeElement)){
                closeDropdown();
            }
        }, 0);
    });

    // setTimeout was suggested by UM-GPT because:
    // By using setTimeout with a delay of 0, it allows the browser to complete the focus event handling and move focus to a new element. 
    // It ensures that the check for document.activeElement happens after the focus has updated. 
    // NOTE to self - read about this   

    // tabbing out of the last link:
    dropdownContent.querySelectorAll("a").forEach(link =>{
        // forEach link=> iterates over each element to add event listener
        link.addEventListener("keydown", function(e){
            if(e.key === 'Tab' && !e.shiftKey && e.target === dropdownContent.lastElementChild){
                // checking the following: 
                // key pressed is tab, it is not pressed with shift key (i.e. to go back), and the last element of dropdown is in focus
                closeDropdown();
            }
        });
    });

    // defining closeDropdown
    function closeDropdown() {
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdownContent.classList.remove("show");
    }
});

// _______________________________________________________________________________________________________
// SETTING THE DATE-TIME
document.getElementById("year").innerHTML = new Date().getFullYear();


// ______________________________________________________________________________________________________________________
// VERSION 1.3:
// Disclosure: THE FOLLOWING CODE HAS BEEN DEBUGGED BY UMGPT  - THE CODE PROVIDED TO UMGPT WAS THE VERSION 1.2 (added below in comments)

// Notes: The front-view is the question mark and the back-view is the illustration

const cards = document.querySelectorAll(".card");

let matched = 0; // This variable tracks the number of matched pairs
let cardOne, cardTwo;
let disableDeck = false; // To prevent interaction while two cards are being compared

function flipCard(card) {
    if(cardOne !== card && !disableDeck && !card.classList.contains("matched")) { // Ensuring that matched cards are not flipped again
        card.classList.add("flip");
        toggleAriaHidden(card);  // Toggle aria-hidden for currently clicked card
        if(!cardOne) {
            return cardOne = card;
        }
        cardTwo = card;
        disableDeck = true; // Disable the rest of the deck to prevent simultaneous flips

        let cardOneImg = cardOne.querySelector(".back-view img").src,
            cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function toggleAriaHidden(card) {
    const frontView = card.querySelector(".front-view");
    const backView = card.querySelector(".back-view");

    if (card.classList.contains("flip")) { // this function only executes if the card has class 'flip' meaning it got clicked and may match
        frontView.setAttribute("aria-hidden", "true"); // making the front-view question mark hidden
        backView.setAttribute("aria-hidden", "false"); // setting the back-view illustration to visible 
    } else {
        frontView.setAttribute("aria-hidden", "false"); // setting front-view question mark to visible 
        backView.setAttribute("aria-hidden", "true"); // making the back-view illustration hidden
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matched++;  // Increment the matched pairs count by 1

        // Add a class to mark these cards as matched - 
        // this will be checked in the handle card click function to determine whether the card clicked is already matched
        cardOne.classList.add("matched");
        cardTwo.classList.add("matched");

        //removes the click and keydown function from card - it is sort of disable now that it is matched with another card
        cardOne.removeEventListener("click", handleCardClick); 
        cardOne.removeEventListener("keydown", handleCardClick);
        cardTwo.removeEventListener("click", handleCardClick);
        cardTwo.removeEventListener("keydown", handleCardClick);

        //Setting aria-disabled attribute so that the cards are read-out as non-interactive after they have beem matched
        cardOne.setAttribute("aria-disabled", "true");
        cardTwo.setAttribute("aria-disabled", "true");

        cardOne = cardTwo = ""; // Reset for the next pair
        disableDeck = false;    // Re-enable the deck
        
        // Check for game completion here and call resetGame if needed
        if (matched === cards.length / 2) {
            setTimeout(() => {
                resetGame();
            }, 2000); // adding delay reset the game to allow user to see final matched pair
        }

    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            toggleAriaHidden(cardOne); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
            toggleAriaHidden(cardTwo); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
            cardOne = cardTwo = ""; // Reset the variables for cards to blank so that they can be reused
            disableDeck = false;    // Re-enable the deck for clicking and keydown
        }, 1200);
    }
}

function handleCardClick(event) {
    const card = event.target.closest(".card");
    if (card && !card.classList.contains("matched")) { // Ensure matched cards are not processed
        if (event.type === "click") {
            flipCard(card);
        } else if (event.type === "keydown" && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault(); // Ensure default action is prevented particularly for key events
            flipCard(card);
        }
    }
}

// reseting the game if all cards are matched
function resetGame() {
    matched = 0; //reset the number of matched cards back to zero
    disableDeck = false; // Re-enabling the deck

    // removing all added flip and matched classes, removing aria-disabled, and adding back the eventlisteners for click and keydown actions
    cards.forEach(card => {
        card.classList.remove("flip", "matched");
        toggleAriaHidden(card); // Reset aria-hidden state
        card.setAttribute("aria-disabled", "false"); // Re-enable accessibility attributes
        card.addEventListener("click", handleCardClick); // Re-add event listeners
        card.addEventListener("keydown", handleCardClick);
    });

}

cards.forEach(card => {
    card.addEventListener("click", handleCardClick);
    card.addEventListener("keydown", handleCardClick);
});

// _________________________________________________________________________________
// Code for changing logo - code to change logo source based on screen width was generated using Github Copilot
// this code changes the logo source when the screen size is greater than 560px - this not desktop specific

const viewportWidth = window.innerWidth;
console.log(`view port width = ${viewportWidth}`);
const logo = document.getElementById("logo");
const logoMobile = "images/illustrations/mumsi-logo.png";
const logoDesktop = "images/illustrations/mumsi-logo-full.png";

function changeLogo () {
    if (window.innerWidth > 560) {
        logo.src = logoDesktop;
        logo.style.width = "120px";
        logo.style.height = "auto";
    } else {
        logo.src = logoMobile;
        logo.style.width = "40px";
        logo.style.height = "auto";
    }
}

window.addEventListener("resize", changeLogo);

changeLogo();


// _________________________________________________________ OLD GAME JS VERSIONS _________________________________________________________________



// ______________________________________________________________________________________________________________________
// VERSION 1.4: THIS CODE DOES NOT WORK
// Updates: Version 1.4 adds a live region for reading out the aria labels. it tells when the card is flipped, what is the illustration when flipped and if cards were matched
// Disclosure: THE FOLLOWING CODE HAS BEEN DEBUGGED BY UMGPT  - THE CODE PROVIDED TO UMGPT WAS THE VERSION 1.2 (added below in comments)

// Notes: The front-view is the question mark and the back-view is the illustration

// const cards = document.querySelectorAll(".card");

// let matched = 0; // This variable tracks the number of matched pairs
// let cardOne, cardTwo;
// let disableDeck = false; // To prevent interaction while two cards are being compared

// // Function def: flips the card clicked and passes of work to matchCrds to chek if cards are same or not
// function flipCard(card) {
//     if(cardOne !== card && !disableDeck && !card.classList.contains("matched")) { // Ensuring that matched cards are not flipped again
//         card.classList.add("flip");
//         toggleAriaHidden(card);  // Toggle aria-hidden for currently clicked card
//         setAriaLabel(card); // Update aria-label when the card is flipped
//         if(!cardOne) {
//             return cardOne = card;
//         }
//         cardTwo = card;
//         disableDeck = true; // Disable the rest of the deck to prevent simultaneous flips

//         let cardOneImg = cardOne.querySelector(".back-view img").src,
//             cardTwoImg = cardTwo.querySelector(".back-view img").src;
//         matchCards(cardOneImg, cardTwoImg);
//     }
// }

// // Function def: toggles the ariahidden of each card to indicate which face: front or back, of the card is hidden or visible
// function toggleAriaHidden(card) {
//     const frontView = card.querySelector(".front-view");
//     const backView = card.querySelector(".back-view");

//     if (card.classList.contains("flip")) { // this function only executes if the card has class 'flip' meaning it got clicked and may match
//         frontView.setAttribute("aria-hidden", "true"); // making the front-view question mark hidden
//         backView.setAttribute("aria-hidden", "false"); // setting the back-view illustration to visible 
//     } else {
//         frontView.setAttribute("aria-hidden", "false"); // setting front-view question mark to visible 
//         backView.setAttribute("aria-hidden", "true"); // making the back-view illustration hidden
//     }
// }

// // Function def: Creating a new function for adding and changing aria lables
// function setAriaLabel(card) {
//     const backView = card.querySelector(".back-view img");

//     if (card.classList.contains("flip")) {
//         card.setAttribute("aria-label", `Card flipped: ${backView.alt}`);
//     } else {
//         card.setAttribute("aria-label", "Card front view with question mark");
//     }
// }

// // Function def: checks the status of liveregion and announces if cards are matched or not matched along with illustration names
// function announceMatch(status, img1, img2) {
//     const liveRegion = document.getElementById('live-region');
//     if (status === "match") {
//         liveRegion.innerText = `Cards matched: ${img1.alt}`;
//     } else if (status === "unmatch") {
//         liveRegion.innerText = `Cards unmatched: ${img1.alt} and ${img2.alt}`;
//     }
// }

// // Function def: matched cards are kept turned, and unmatched cards flip back. all eventlisteners, and ariahidden etc. are updated
// function matchCards(img1, img2) {
//     if (img1 === img2) {
//         const cardOneImg = cardOne.querySelector(".back-view img");
//         const cardTwoImg = cardTwo.querySelector(".back-view img");
//         matched++;  // Increment the matched pairs count by 1\
//         announceMatch('match', cardOneImg, cardTwoImg); // Announce matching cards

//         // Add a class to mark these cards as matched - 
//         // this will be checked in the handle card click function to determine whether the card clicked is already matched
//         cardOne.classList.add("matched");
//         cardTwo.classList.add("matched");

//         //removes the click and keydown function from card - it is sort of disable now that it is matched with another card
//         cardOne.removeEventListener("click", handleCardClick); 
//         cardOne.removeEventListener("keydown", handleCardClick);
//         cardTwo.removeEventListener("click", handleCardClick);
//         cardTwo.removeEventListener("keydown", handleCardClick);

//         //Setting aria-disabled attribute so that the cards are read-out as non-interactive after they have beem matched
//         cardOne.setAttribute("aria-disabled", "true");
//         cardTwo.setAttribute("aria-disabled", "true");

//         cardOne = cardTwo = ""; // Reset for the next pair
//         disableDeck = false;    // Re-enable the deck
        
//         // Check for game completion here and call resetGame if needed
//         if (matched === cards.length / 2) {
//             setTimeout(() => {
//                 resetGame();
//             }, 2000); // adding delay reset the game to allow user to see final matched pair
//         }

//     } else {
//         announceMatch('unmatch', cardOneImg, cardTwoImg); // Announce unmatched cards
//         setTimeout(() => {
//             cardOne.classList.add("shake");
//             cardTwo.classList.add("shake");
//         }, 400);

//         setTimeout(() => {
//             cardOne.classList.remove("shake", "flip");
//             cardTwo.classList.remove("shake", "flip");
//             toggleAriaHidden(cardOne); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
//             toggleAriaHidden(cardTwo); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
//             cardOne = cardTwo = ""; // Reset the variables for cards to blank so that they can be reused
//             setAriaLabel(cardOne); // Reset aria-label after shaking
//             setAriaLabel(cardTwo); // Reset aria-label after shaking
//             disableDeck = false;    // Re-enable the deck for clicking and keydown
//         }, 1200);
//     }
// }

// // Function def: adds eventlistener for click and keydown to each card - lets person use only one of these actions
// function handleCardClick(event) {
//     const card = event.target.closest(".card");
//     if (card && !card.classList.contains("matched")) { // Ensure matched cards are not processed
//         if (event.type === "click") {
//             flipCard(card);
//         } else if (event.type === "keydown" && (event.key === "Enter" || event.key === " ")) {
//             event.preventDefault(); // Ensure default action is prevented particularly for key events
//             flipCard(card);
//         }
//     }
// }

// // // Function def: reseting the game if all cards are matched
// function resetGame() {
//     matched = 0; //reset the number of matched cards back to zero
//     disableDeck = false; // Re-enabling the deck

//     // removing all added flip and matched classes, removing aria-disabled, and adding back the eventlisteners for click and keydown actions
//     cards.forEach(card => {
//         card.classList.remove("flip", "matched");
//         toggleAriaHidden(card); // Reset aria-hidden state
//         setAriaLabel(card); // Reset aria-label when resetting the game
//         card.setAttribute("aria-disabled", "false"); // Re-enable accessibility attributes
//         card.addEventListener("click", handleCardClick); // Re-add event listeners
//         card.addEventListener("keydown", handleCardClick);
//     });

// }

// // Create a live region for announcements
// const liveRegion = document.createElement('div');
// liveRegion.setAttribute('id', 'live-region');
// liveRegion.setAttribute('aria-live', 'polite'); //polite meaning it will complete reading what it was saying before, before starting to say the new label
// liveRegion.setAttribute('role', 'status'); //the role of this div is to provide status
// liveRegion.setAttribute('style', 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;'); // Off-screen and non-interactive
// document.body.appendChild(liveRegion);

// cards.forEach(card => {
//     card.addEventListener("click", handleCardClick);
//     card.addEventListener("keydown", handleCardClick);
//     setAriaLabel(card); // Set initial aria label on all the cards
// });





// ______________________________________________________________________________________________________________________
// VERSION 1.3:
// Disclosure: THE FOLLOWING CODE HAS BEEN DEBUGGED BY UMGPT  - THE CODE PROVIDED TO UMGPT WAS THE VERSION 1.2 (added below in comments)

// Notes: The front-view is the question mark and the back-view is the illustration

// const cards = document.querySelectorAll(".card");

// let matched = 0; // This variable tracks the number of matched pairs
// let cardOne, cardTwo;
// let disableDeck = false; // To prevent interaction while two cards are being compared

// function flipCard(card) {
//     if(cardOne !== card && !disableDeck && !card.classList.contains("matched")) { // Ensuring that matched cards are not flipped again
//         card.classList.add("flip");
//         toggleAriaHidden(card);  // Toggle aria-hidden for currently clicked card
//         if(!cardOne) {
//             return cardOne = card;
//         }
//         cardTwo = card;
//         disableDeck = true; // Disable the rest of the deck to prevent simultaneous flips

//         let cardOneImg = cardOne.querySelector(".back-view img").src,
//             cardTwoImg = cardTwo.querySelector(".back-view img").src;
//         matchCards(cardOneImg, cardTwoImg);
//     }
// }

// function toggleAriaHidden(card) {
//     const frontView = card.querySelector(".front-view");
//     const backView = card.querySelector(".back-view");

//     if (card.classList.contains("flip")) { // this function only executes if the card has class 'flip' meaning it got clicked and may match
//         frontView.setAttribute("aria-hidden", "true"); // making the front-view question mark hidden
//         backView.setAttribute("aria-hidden", "false"); // setting the back-view illustration to visible 
//     } else {
//         frontView.setAttribute("aria-hidden", "false"); // setting front-view question mark to visible 
//         backView.setAttribute("aria-hidden", "true"); // making the back-view illustration hidden
//     }
// }

// function matchCards(img1, img2) {
//     if (img1 === img2) {
//         matched++;  // Increment the matched pairs count by 1

//         // Add a class to mark these cards as matched - 
//         // this will be checked in the handle card click function to determine whether the card clicked is already matched
//         cardOne.classList.add("matched");
//         cardTwo.classList.add("matched");

//         //removes the click and keydown function from card - it is sort of disable now that it is matched with another card
//         cardOne.removeEventListener("click", handleCardClick); 
//         cardOne.removeEventListener("keydown", handleCardClick);
//         cardTwo.removeEventListener("click", handleCardClick);
//         cardTwo.removeEventListener("keydown", handleCardClick);

//         //Setting aria-disabled attribute so that the cards are read-out as non-interactive after they have beem matched
//         cardOne.setAttribute("aria-disabled", "true");
//         cardTwo.setAttribute("aria-disabled", "true");

//         cardOne = cardTwo = ""; // Reset for the next pair
//         disableDeck = false;    // Re-enable the deck
        
//         // Check for game completion here and call resetGame if needed
//         if (matched === cards.length / 2) {
//             setTimeout(() => {
//                 resetGame();
//             }, 2000); // adding delay reset the game to allow user to see final matched pair
//         }

//     } else {
//         setTimeout(() => {
//             cardOne.classList.add("shake");
//             cardTwo.classList.add("shake");
//         }, 400);

//         setTimeout(() => {
//             cardOne.classList.remove("shake", "flip");
//             cardTwo.classList.remove("shake", "flip");
//             toggleAriaHidden(cardOne); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
//             toggleAriaHidden(cardTwo); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
//             cardOne = cardTwo = ""; // Reset the variables for cards to blank so that they can be reused
//             disableDeck = false;    // Re-enable the deck for clicking and keydown
//         }, 1200);
//     }
// }

// function handleCardClick(event) {
//     const card = event.target.closest(".card");
//     if (card && !card.classList.contains("matched")) { // Ensure matched cards are not processed
//         if (event.type === "click") {
//             flipCard(card);
//         } else if (event.type === "keydown" && (event.key === "Enter" || event.key === " ")) {
//             event.preventDefault(); // Ensure default action is prevented particularly for key events
//             flipCard(card);
//         }
//     }
// }

// // reseting the game if all cards are matched
// function resetGame() {
//     matched = 0; //reset the number of matched cards back to zero
//     disableDeck = false; // Re-enabling the deck

//     // removing all added flip and matched classes, removing aria-disabled, and adding back the eventlisteners for click and keydown actions
//     cards.forEach(card => {
//         card.classList.remove("flip", "matched");
//         toggleAriaHidden(card); // Reset aria-hidden state
//         card.setAttribute("aria-disabled", "false"); // Re-enable accessibility attributes
//         card.addEventListener("click", handleCardClick); // Re-add event listeners
//         card.addEventListener("keydown", handleCardClick);
//     });

// }

// cards.forEach(card => {
//     card.addEventListener("click", handleCardClick);
//     card.addEventListener("keydown", handleCardClick);
// });





// _______________________________________________________________________________________________________
// OLD VERSION 1.1 FLIPPING CARDS
// const cards = document.querySelectorAll(".card");

// let matched = 0;
// let cardOne, cardTwo;
// let disableDeck = false;

// function flipCard({target: clickedCard}) {
//     if(cardOne !== clickedCard && !disableDeck) {
//         clickedCard.classList.add("flip");
//         if(!cardOne) {
//             return cardOne = clickedCard;
//         }
//         cardTwo = clickedCard;
//         disableDeck = true;
//         let cardOneImg = cardOne.querySelector(".back-view img").src,
//         cardTwoImg = cardTwo.querySelector(".back-view img").src;
//         matchCards(cardOneImg, cardTwoImg);
//     }
// }

// function matchCards(img1, img2) {
//     if(img1 === img2) {
//         matched++;
//         cardOne.removeEventListener("click", flipCard);
//         cardTwo.removeEventListener("click", flipCard);
//         cardOne = cardTwo = "";
//         return disableDeck = false;
//     }
//     setTimeout(() => {
//         cardOne.classList.add("shake");
//         cardTwo.classList.add("shake");
//     }, 400);

//     setTimeout(() => {
//         cardOne.classList.remove("shake", "flip");
//         cardTwo.classList.remove("shake", "flip");
//         cardOne = cardTwo = "";
//         disableDeck = false;
//     }, 1200);
// }
    
// cards.forEach(card => {
//     card.addEventListener("click", flipCard);
// });





// ______________________________________________________________________________________________________________________
// OLD VERSION 1.2: FLIPPING CARDS
// const cards = document.querySelectorAll(".card");

//     let matched = 0; // This variable tracks the number of matched pairs
//     let cardOne, cardTwo;
//     let disableDeck = false;

//     function flipCard(card) {
//         if(cardOne !== card && !disableDeck) {
//             card.classList.add("flip");
//             toggleAriaHidden(card);  // Toggle aria-hidden for current card
//             if(!cardOne) {
//                 return cardOne = card;
//             }
//             cardTwo = card;
//             disableDeck = true; // disabling the rest of the deck so that other cards can't be clicked simultaneously when one is flipped
//             let cardOneImg = cardOne.querySelector(".back-view img").src,
//                 cardTwoImg = cardTwo.querySelector(".back-view img").src;
//             matchCards(cardOneImg, cardTwoImg);
//         }
//     }

//     function toggleAriaHidden(card) {
//         const frontView = card.querySelector(".front-view");
//         const backView = card.querySelector(".back-view");

//         if (card.classList.contains("flip")) {
//             frontView.setAttribute("aria-hidden", "true");
//             backView.setAttribute("aria-hidden", "false");
//         } else {
//             frontView.setAttribute("aria-hidden", "false");
//             backView.setAttribute("aria-hidden", "true");
//         }
//     }

//     function matchCards(img1, img2) {
//         if(img1 === img2) {
//             matched++;  // Increments the matched pairs count by 1
//             //removes the click and keydown function from card - it is sort of disable now that it is matched with another card
//             cardOne.removeEventListener("click", handleCardClick); 
//             cardOne.removeEventListener("keydown", handleCardClick);
//             cardTwo.removeEventListener("click", handleCardClick);
//             cardTwo.removeEventListener("keydown", handleCardClick);
    
//             // Add a class to mark these cards as matched - 
//             // this will be checked in the handle card click function to determine whether the card clicked is already matched
//             cardOne.classList.add("matched");
//             cardTwo.classList.add("matched");
    
//             //Setting aria-disabled attribute so that the cards are read-out as non-interactive after they have beem matched
//             cardOne.setAttribute("aria-disabled", "true");
//             cardTwo.setAttribute("aria-disabled", "true");
    
//         }
//         setTimeout(() => {
//             cardOne.classList.add("shake");
//             cardTwo.classList.add("shake");
//         }, 400);

//         setTimeout(() => {
//             cardOne.classList.remove("shake", "flip");
//             cardTwo.classList.remove("shake", "flip");
//             toggleAriaHidden(cardOne); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
//             toggleAriaHidden(cardTwo); // Reset aria-hidden after shaking the cards so that it reads that card's illustartion got hidden again
//             cardOne = cardTwo = ""; // resetting the variables cardOne and cardTwo to reuse them again
//             disableDeck = false; // re-enabling the rest of the deck after cards failed to match
//         }, 1200);
//     }

//         // function  helps handle only one type of event - either clicking a card or pressing the enter/space key - prevents flipping card with both actions
//     function handleCardClick(event) {
//         const card = event.target.closest(".card");
//         if (!card.classList.contains("matched")) {
//             if (event.type === "click") {
//                 flipCard(card);
//             } else if (event.type === "keydown" && (event.key === "Enter" || event.key === " ")) {
//                 flipCard(card);
//             }
//         }
//     }
//     // function handleCardClick(event) {
//     //     if (event.type === "click") {
//     //         flipCard(event.target.closest(".card"));
//     //     } else if (event.type === "keydown" && (event.key === "Enter" || event.key === " ")) {
//     //         flipCard(event.target);
//     //     }
//     // }

//     // each card has added eventlistener for click and keydown actionx
//     cards.forEach(card => {
//         card.addEventListener("click", handleCardClick);
//         card.addEventListener("keydown", handleCardClick);
//     });

