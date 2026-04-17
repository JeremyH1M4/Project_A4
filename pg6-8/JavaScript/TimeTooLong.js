'use strict';

const Name_Retrieve = localStorage.getItem("T1");
const Name = JSON.parse(Name_Retrieve);

// Arrays
const texts = ["There is no turning back now," + " " + Name];

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
const durationSeconds = 45;
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


let progress = 40;
let sanity = 100;
let phase = 'sanity'; // start with sanity decaying
let count = 0; // tracks how many times the player has successfully transitioned back to sanity
let gameOver = false; // when true, stop accepting input for progression

const progressBar = document.getElementById('bar');
const sanityBar = document.getElementById('sanity-bar');
const progressContainer = document.getElementById('progress-container');
const sanityContainer = document.getElementById('sanity-container');
const Sane = document.getElementById('img-1'); // visible image for the 'sane' state
const Insane = document.getElementById('insane-img');
const insaneCaptionEl = document.getElementById('insane-caption');
// captions to show under the GIF for each completed progression (index = count)
const CAPTION_MESSAGES = [
    'A whisper at the edge of hearing.',
    'The walls breathe softly.',
    'Shapes press at the corners of vision.',
    'You can feel something watching.',
    'The world thins; your hands tremble.',
    'It laughs without sound.'
];
const Text = document.getElementById('Text');
const mainContent = document.querySelector('.id');
const progressTextEl = document.getElementById('progress-text');
let progressTextInterval = null;

// helpers to show/hide containers consistently
function showSanity() {
    if (sanityContainer) sanityContainer.classList.remove('hidden');
    if (progressContainer) progressContainer.classList.add('hidden');
        if (Text) progressContainer.classList.add('hidden');
    if (Sane) Sane.classList.remove('hidden');
    if (Insane) Insane.classList.add('hidden');
    // show buttons in sanity
    const btnContainer = document.getElementById('button-container');
    if (btnContainer) btnContainer.classList.remove('hidden');
    if (insaneCaptionEl) insaneCaptionEl.classList.add('hidden');
    // also show main content and timer, hide the progress view
    if (mainContent) mainContent.classList.remove('hidden');
    if (textElement) textElement.classList.remove('hidden');
    // revert progress container visual to compact bar
    if (progressContainer) {
        progressContainer.style.height = '30px';
        progressContainer.style.overflow = 'hidden';
    }
}

function showProgress() {
           if (Text) progressContainer.classList.remove('hidden');
    if (progressContainer) progressContainer.classList.remove('hidden');
    if (sanityContainer) sanityContainer.classList.add('hidden');
    if (Sane) Sane.classList.add('hidden');
    if (Insane) Insane.classList.remove('hidden');
    // hide main content and timer when showing progress
    if (mainContent) mainContent.classList.add('hidden');
    if (textElement) textElement.classList.add('hidden');
    // hide buttons during progression
    const btnContainer = document.getElementById('button-container');
    if (btnContainer) btnContainer.classList.add('hidden');

    // extra defensive steps: make sure elements are visible if class toggles failed
    if (progressContainer) {
        progressContainer.style.display = '';
        progressContainer.style.zIndex = '1000';
    }
    if (Insane) {
        Insane.style.display = '';
        Insane.style.visibility = 'visible';
        Insane.style.zIndex = '1010';
    }

    // allow the progress container to expand so the GIF isn't clipped
    if (progressContainer) {
        progressContainer.style.height = 'auto';
        progressContainer.style.overflow = 'visible';
        progressContainer.style.paddingTop = '10px';
    }

    // start updating progress text
    if (progressTextEl) {
        progressTextEl.classList.remove('hidden');
        updateProgressText();
        if (progressTextInterval) clearInterval(progressTextInterval);
        progressTextInterval = setInterval(updateProgressText, 700);
    }

    // show caption under GIF and update according to current count
    if (insaneCaptionEl) {
        insaneCaptionEl.classList.remove('hidden');
        const msg = CAPTION_MESSAGES[count] || CAPTION_MESSAGES[CAPTION_MESSAGES.length - 1];
        insaneCaptionEl.textContent = `Adapting Resistance ${count}: ${msg}`;
    }
}

function hideProgressText() {
    if (progressTextInterval) {
        clearInterval(progressTextInterval);
        progressTextInterval = null;
    }
    if (progressTextEl) progressTextEl.classList.add('hidden');
    if (insaneCaptionEl) insaneCaptionEl.classList.add('hidden');
}

// UI update helper
function updateUI() {
    progressBar.style.width = Math.max(0, Math.min(100, progress)) + '%';
    progressBar.innerHTML = Math.floor(Math.max(0, Math.min(100, progress))) + '%';

    sanityBar.style.width = Math.max(0, Math.min(100, sanity)) + '%';
    sanityBar.innerHTML = Math.floor(Math.max(0, Math.min(100, sanity))) +' ' + 'Sanity';
}

// progress-phase messaging
function updateProgressText() {
    if (!progressTextEl) return;

    try {
        // choose severity text based on `count`
        let severity;
        if (count <= 6) severity = 'I cant give up';
        else if (count <= 1) severity = 'Its not my time';
        else if (count <= 4) severity = 'Its hopeless';
        else severity = '...';

        // choose message fragment based on progress
        const pct = Math.floor(progress);
        let fragment;
        if (pct < 25) fragment = 'I cant.';
        else if (pct < 50) fragment = 'Light?';
        else if (pct < 75) fragment = 'Wake Up...';
        else fragment = 'Almost there — focus.';

        progressTextEl.textContent = `Resistance| ${severity} — ${fragment}`;
    } catch (err) {
        console.warn('updateProgressText failed:', err);
    }
}

// clamp helper
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// timing constants and bases (per-100ms tick rates)
const TICK_MS = 75;
const SANITY_DECAY_BASE = 3;   // base sanity decay per tick
const PROGRESS_DECAY_BASE = 0.5; // base progress decay per tick
const SPACE_INCREASE_BASE = 5; // base progress increase per space press

// prevent holding space to spam increases
let spaceDown = false;

// initialize UI
updateUI();
// show the correct container for the starting phase
if (phase === 'sanity') showSanity(); else showProgress();

// Space key handler: increases progress in both phases (progress decay rules handled by tick)
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        // if the game is over, ignore space presses
        if (gameOver) return;
        // ignore auto-repeats from holding the key
        if (event.repeat) return;
        if (spaceDown) return;

        // Only allow adding to progress during the 'progress' phase
        if (phase !== 'progress') {
            // optionally: play a blocked sound or flash UI here
            return;
        }

        // mark that space is down until a keyup fires
        spaceDown = true;
        event.preventDefault();

    // compute dynamic space increase so it weakens as count grows but never goes below 1
    const spaceInc = Math.max(1, Math.round(SPACE_INCREASE_BASE - Math.floor(count * 0.5)));
    // player can add to progress in progress phase (single increment per press)
    progress = clamp(progress + spaceInc, 0, 1000); // allow overshoot then clamp on transition
        updateUI();

        // If we've reached 100 due to this press, trigger transition immediately
        if (progress >= 100) {
            progress = 100;
            // transition to sanity phase
            phase = 'sanity';
            sanity = 100;
            progress = 35;
            count ++
            showSanity();
            updateUI();
            // clear the hold state so future presses register
            spaceDown = false;
        }
    }
});

// clear spaceDown when the key is released so the next press registers
window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') spaceDown = false;
});

// Tick loop handles both decays and phase transitions
const tickInterval = setInterval(() => {
    if (phase === 'sanity') {
        // sanity decays, progress decay is halted
        const sanDecay = SANITY_DECAY_BASE + count * .15; // scale with count
        sanity = clamp(sanity - sanDecay, 0, 100);
        updateUI();

        if (sanity <= 0) {
            // switch to progress phase
            phase = 'progress';
            progress = 40; // start progress at 40 when sanity reached 0
            showProgress();
            updateUI();
        }
    } else if (phase === 'progress') {
        // progress decays; sanity stays at 0 while in this phase
        const progressDecay = PROGRESS_DECAY_BASE + count * 0.25; // scale with count
        progress = clamp(progress - progressDecay, 0, 100);
        updateUI();

        // losing condition
        if (progress <= 0) {
            // stop the main game tick
            clearInterval(tickInterval);
            // mark game over to prevent further input
            gameOver = true;
            // stop other intervals/animations so everything visibly stops
            try {
                if (typeof textInterval !== 'undefined') clearInterval(textInterval);
            } catch (e) { }
            if (progressTextInterval) {
                clearInterval(progressTextInterval);
                progressTextInterval = null;
            }
            // hide progress text and caption
            hideProgressText();
            // pause the CSS timer bar animation so it stops moving
            if (typeof timerBar !== 'undefined' && timerBar) {
                timerBar.style.animationPlayState = 'paused';
            }

            alert('You lost!');
            return;
        }

        if (progress >= 100) {
            // reached 100: increment resistance and reset to sanity phase
            progress = 100;
            phase = 'sanity';
            sanity = 100;
            progress = 40; // as requested, progress set back to 40
            hideProgressText();
            showSanity();
            updateUI();
        }
    }
}, TICK_MS);
