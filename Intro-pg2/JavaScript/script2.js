'use strict';

const Name_Retrieve = localStorage.getItem("T1");
const Name = JSON.parse(Name_Retrieve);

// Arrays
const texts = ["The sun is setting.", "Maybe I should go"];
const buttonLabels = ["Pack up and head out", "Stay"];
const buttonLinks = ["/pg3-5/HTML/Leave.html","/pg3-5/HTML/Stay.html"];

let textCounter = 0;
let buttonCounter = 0;

const textElement = document.getElementById("text-element");
const container = document.getElementById("button-container");

//Text
textElement.textContent = texts[0];


function changeTextWithAnimation() {
    
    if (textCounter + 1 >= texts.length) {
        clearInterval(textInterval); 
        startButtons();
        return;
    }

    textElement.classList.remove("text-show");
    textElement.classList.add("text-fade");

    setTimeout(() => {
        textCounter++;
        textElement.textContent = texts[textCounter];
        textElement.classList.remove("text-fade");
        textElement.classList.add("text-show");
    }, 2000);
}

//Button after text
function startButtons() {
    const buttonInterval = setInterval(() => {
        if (buttonCounter >= buttonLabels.length) {
            clearInterval(buttonInterval);
            return;
        }

        const newBtn = document.createElement("button");
        newBtn.textContent = buttonLabels[buttonCounter];
        newBtn.classList.add("btntext-show"); 
        const destination = buttonLinks[buttonCounter];
        newBtn.onclick = () => {
            window.location.href = destination;
        };

        container.appendChild(newBtn);
        buttonCounter++;
    }, 1500); 
}


const textInterval = setInterval(changeTextWithAnimation, 4000);

//Timer Bar
const timerBar = document.getElementById('timerBar');
const durationSeconds = 300;
timerBar.style.animationDuration = `${durationSeconds}s`;

timerBar.addEventListener('animationend', () => {
    // use the standard prompt (lowercase) and declare AT so errors here don't stop the script
    try {
        clearInterval(progressTextInterval);
        hideProgressText();
        const AT = window.prompt('There is no turning back');
        if (AT === "HOME") {
            window.location.href = "/pg9-15/HTML/Home.html";
        }


    } catch (e) {
        console.warn('prompt failed', e);
    }
});
