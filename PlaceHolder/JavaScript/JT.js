'use strict'

setInterval(changeTextWithAnimation, 4000);

const texts = ["/PlaceHolder/Images/image1.jpeg","/PlaceHolder/Images/image1.jpeg", "/PlaceHolder/Images/image2.jpeg", "/PlaceHolder/Images/image3.jpg", "/PlaceHolder/Images/image4.jpg"];
let counter = 0;
const textElement = document.getElementById("image-element");

function changeTextWithAnimation() {
    textElement.classList.remove("text-show");
    textElement.classList.add("text-fade");

    setTimeout(() => {
        counter++;


        if (counter >= texts.length) {
            clearInterval(intervalId);
            return;
        }

        textElement.src = texts[counter];
        textElement.classList.remove("text-fade");
        textElement.classList.add("text-show");
    }, 2000);
}

textElement.src = texts[0]; 


const intervalId = setInterval(changeTextWithAnimation, 4000);

const timerBar = document.getElementById('timerBar');
const durationSeconds = 12 ;

timerBar.addEventListener('animationend', () => {
    window.location.replace("BR-2.html"); 
});


timerBar.style.animationDuration = `${durationSeconds}s`;