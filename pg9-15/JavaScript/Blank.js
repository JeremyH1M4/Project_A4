'use strict';

// Arrays
const texts = ["Why is there no one around...?", ">ERROR", "Work in Progress"];

let textCounter = 0;
let buttonCounter = 0;

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
