'use strict';

// Arrays
const texts = [".", "..", "...", ".. / .- -- / .... --- -- ."];


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

console.log(".. / .- -- / .... --- -- .");

const textInterval = setInterval(changeTextWithAnimation, 4000);

//Timer Bar
const timerBar = document.getElementById('timerBar');
const durationSeconds = 30 ;
timerBar.style.animationDuration = `${durationSeconds}s`;

timerBar.addEventListener('animationend', () => {
    window.location.replace("/pg9-11/HTML/Rooms.html"); 
});
