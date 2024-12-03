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



document.getElementById("year").innerHTML = new Date().getFullYear();