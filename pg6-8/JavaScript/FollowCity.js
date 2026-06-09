'use strict';

// Arrays
const texts = ["Why is there no one around...?"];
const buttonLabels = ["You have no choice but to keep going deeper into the city"];
const buttonLinks = ["/pg9-15/HTML/ConcreteJungle.html"];

let textCounter = 0;
let buttonCounter = 0;

// DOM-dependent behavior: run after elements exist
document.addEventListener('DOMContentLoaded', () => {
    // node references
    const textElement = document.getElementById('text-element');
    const container = document.getElementById('button-container');

    // initialize text if element exists
    if (textElement) textElement.textContent = texts[0];

    function changeTextWithAnimation() {
        if (!textElement) return;

        if (textCounter + 1 >= texts.length) {
            clearInterval(textInterval);
            startButtons();
            return;
        }

        textElement.classList.remove('text-show');
        textElement.classList.add('text-fade');

        setTimeout(() => {
            textCounter++;
            if (textElement) textElement.textContent = texts[textCounter];
            if (textElement) {
                textElement.classList.remove('text-fade');
                textElement.classList.add('text-show');
            }
        }, 2000);
    }

    // Button after text
    function startButtons() {
        const buttonInterval = setInterval(() => {
            if (buttonCounter >= buttonLabels.length) {
                clearInterval(buttonInterval);
                return;
            }

            const newBtn = document.createElement('button');
            newBtn.textContent = buttonLabels[buttonCounter];
            newBtn.classList.add('btntext-show');
            const destination = buttonLinks[buttonCounter];
            newBtn.onclick = () => {
                window.location.href = destination;
            };

            if (container) container.appendChild(newBtn);
            buttonCounter++;
        }, 1500);
    }

    const textInterval = setInterval(changeTextWithAnimation, 4000);

    // Timer Bar
    const timerBar = document.getElementById('timerBar');
    const durationSeconds = 133;
    if (timerBar) {
        // defensively set animationDuration if CSS uses it
        try {
            timerBar.style.animationDuration = `${durationSeconds}s`;
        } catch (e) {
            // ignore if style cannot be set
        }

        timerBar.addEventListener('animationend', () => {
            try {
                window.location.href = '/pg6-8/HTML/TimeTooLong.html';
            } catch (e) {
                console.warn('navigation failed', e);
            }
        });
    } else {
        console.warn('FollowCity: #timerBar not found; timer will not run');
    }
});