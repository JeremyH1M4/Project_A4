'use strict';

const buttonLabels = ["Button 1", "Button 2", "Button 3"];
let counter = 0;
const container = document.getElementById("button-container");

function addNewButton() {
    if (counter >= buttonLabels.length) {
        clearInterval(intervalId);
        return;
    }

    const newBtn = document.createElement("button");
    newBtn.textContent = buttonLabels[counter];
    newBtn.classList.add("btntext-show");
    

    container.appendChild(newBtn);

    counter++;
}

const intervalId = setInterval(addNewButton, 4000);


const timerBar = document.getElementById('timerBar');
const durationSeconds = 12;
timerBar.style.animationDuration = `${durationSeconds}s`;

timerBar.addEventListener('animationend', () => {
    window.location.replace("BR-2.html"); 
});
