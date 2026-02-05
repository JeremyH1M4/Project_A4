'use strict'

setInterval(changeTextWithAnimation, 4000);

const texts = ["This is you", "Your name is Jeremy", "You're a photographer", "You're an intern at Cosmic Horizons Forestry and Photography"];
let counter = 0;
const textElement = document.getElementById("text-element");

function changeTextWithAnimation() {
    textElement.classList.remove("text-show");
    textElement.classList.add("text-fade");

    setTimeout(() => {
        counter++;


        if (counter >= texts.length) {
            clearInterval(intervalId);
            return;
        }

        textElement.textContent = texts[counter];
        textElement.classList.remove("text-fade");
        textElement.classList.add("text-show");
    }, 2000);
}


const intervalId = setInterval(changeTextWithAnimation, 4000);

const timerBar = document.getElementById('timerBar');
const durationSeconds = 12 ;

timerBar.addEventListener('animationend', () => {
    window.location.replace("/MAIN%20BASEPLATE/HTML/BR-2.html"); 
});


timerBar.style.animationDuration = `${durationSeconds}s`;