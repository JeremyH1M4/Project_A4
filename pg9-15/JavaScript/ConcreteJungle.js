'use strict';

// Scenes: each scene has texts, image and buttons that either navigate or switch scenes
const scenes = [
    {
        id: 'intro',
        image: '/pg9-15/Images/ConcreteJungle.webp',
        texts: [
            'A city with empty streets...',
            'The occupancy of the buildings are non-existent.',
            'There is nothing but you and a concrete jungle.'
        ],
        // per-scene decay bases (applied after text/button interval finishes)
        sanityBase: 20,
        // per-scene space press increase (how much Space adds to progress)
    spaceIncreaseBase: 7.5,
    progressBase: 0.50,
    // per-scene starting progress when entering the 'progress' phase
    startingProgress: 75,
        // optional per-scene tick frequencies (ms)
        sanityTickMs: 10000,
        progressTickMs: 50,
        buttons: [
            { label: 'Explore', nextScene: 'city' },
            { label: 'Go inside one of the buildings', nextScene: 'Building' }
        ]
    },
    {
        id: 'city',
        image: '/pg9-15/Images/Explore.webp',
        texts: [
            'You step into the city; lights hum in empty towers.',
            'Everything is intact, but nobody walks these streets.'
        ],
        sanityBase: 0.75,
        // pressing Space adds this much progress in this scene
    spaceIncreaseBase: 5,
    progressBase: 0.1,
    // per-scene starting progress when entering the 'progress' phase
    startingProgress: 20,
        sanityTickMs: 500,
        progressTickMs:100,
        buttons: [
            { label: 'Explore Left', nextScene: 'deep1' },
            { label: 'Explore Right', nextScene: 'deep2' },
            { label: 'Return', nextScene: 'intro' },
        ]
    },
    {
        id: 'Building',
        image: '/pg9-15/Images/Office.webp',
        texts: [
            'You explore the building closest to you; at most, what greets you is the echo of your entry and an empty office.',
            'Silence lingers.', 'It\'s so much more silent compare to the outside.'
        ],
        sanityBase: 2.2,
        // Building offers a stronger space-increase to help progress
    spaceIncreaseBase: 3,
    progressBase: 3.75,
    // per-scene starting progress when entering the 'progress' phase
    startingProgress: 45,
        sanityTickMs: 500,
        progressTickMs: 1200,
        buttons: [
            { label: 'Press on', nextScene: 'deep' },
            { label: 'Return', nextScene: 'intro' }
        ]
    },
    {
        id: 'deep1',
        image: '/pg9-15/Images/Deep1.jpg',
        texts: [
            'You descend into the marrow of the city.',
            'Shadows rearrange themselves into doors that do not exist.'
        ],
        sanityBase: 3.5,
        // deeper scenes give larger space increases
    spaceIncreaseBase: 4,
    progressBase: 6,
    // per-scene starting progress when entering the 'progress' phase
    startingProgress: 50,
        sanityTickMs: 1800,
        progressTickMs: 900,
        buttons: [
            { label: 'Return', nextScene: 'city' }
        ]
    },

        {
        id: 'deep2',
        image: '/pg9-15/Images/Deep2.webp',
        texts: [
            'You descend into the marrow of the city.',
            'Shadows rearrange themselves into doors that do not exist.'
        ],
        // variant deep2: even stronger space increases
    spaceIncreaseBase: 5,
    sanityBase: 3.5,
    progressBase: 6,
    // per-scene starting progress when entering the 'progress' phase
    startingProgress: 55,
        sanityTickMs: 1800,
        progressTickMs: 900,
        buttons: [
            { label: 'Wake up', link: '/pg9-15/HTML/Home.html' },
            { label: 'Return', nextScene: 'intro' }
        ]
    }


];



// elements that are initialized on DOMContentLoaded but referenced by
// functions declared at top-level — declare them here so references
// don't throw before the DOM handler runs.
let textElement;
let container;
let imgEl;

document.addEventListener('DOMContentLoaded', () => {
    textElement = document.getElementById('text-element');
    container = document.getElementById('button-container');
    imgEl = document.getElementById('img-1');

    let currentSceneId = scenes[0].id;
    let textCounter = 0;
    let buttonCounter = 0;
    let textInterval = null;
    // interval ids and per-scene tick-ms (managed per-scene, restartable)
    let sanityIntervalId = null;
    let progressIntervalId = null;
    let currentSanityTickMs = 2000;
    let currentProgressTickMs = 1000;
    // per-scene space increase base (fallback to global SPACE_INCREASE_BASE)
    // assign into the module-scoped variable (don't redeclare)
    currentSpaceIncreaseBase = SPACE_INCREASE_BASE;

    function findScene(id) {
        return scenes.find(s => s.id === id) || scenes[0];
    }

    function clearButtons() {
        if (!container) return;
        container.innerHTML = '';
    }

    function startButtonsForScene(scene) {
        if (!container) return;
            clearButtons();
            // reveal the container when buttons are ready
            container.classList.remove('hidden');
        buttonCounter = 0;

        scene.buttons.forEach((btnDef) => {
            const btn = document.createElement('button');
            btn.textContent = btnDef.label;
            btn.classList.add('btntext-show');
            btn.addEventListener('click', () => {
                if (btnDef.nextScene) {
                    showScene(btnDef.nextScene);
                } else if (btnDef.link) {
                    window.location.href = btnDef.link;
                }
            });
            container.appendChild(btn);
        });
        // when buttons are ready (text interval finished), apply the scene's decay bases
        try {
            // fall back to global bases if scene doesn't provide values
            currentSanityBase = typeof scene.sanityBase === 'number' ? scene.sanityBase : SANITY_DECAY_BASE;
            currentProgressBase = typeof scene.progressBase === 'number' ? scene.progressBase : PROGRESS_DECAY_BASE;
            // set per-scene tick frequencies if provided
            currentSanityTickMs = typeof scene.sanityTickMs === 'number' ? scene.sanityTickMs : SANITY_TICK_MS;
            currentProgressTickMs = typeof scene.progressTickMs === 'number' ? scene.progressTickMs : PROGRESS_TICK_MS;
                // set per-scene space-increase base (fallback to global)
                currentSpaceIncreaseBase = typeof scene.spaceIncreaseBase === 'number' ? scene.spaceIncreaseBase : SPACE_INCREASE_BASE;
        } catch (e) {
            currentSanityBase = SANITY_DECAY_BASE;
            currentProgressBase = PROGRESS_DECAY_BASE;
            currentSanityTickMs = SANITY_TICK_MS;
            currentProgressTickMs = PROGRESS_TICK_MS;
                currentSpaceIncreaseBase = SPACE_INCREASE_BASE;
        }
        // restart intervals so per-scene tick frequencies take effect now
        restartSanityInterval();
        restartProgressInterval();
    }

    function restartSanityInterval() {
        if (sanityIntervalId) clearInterval(sanityIntervalId);
        sanityIntervalId = setInterval(() => {
            if (phase !== 'sanity') return;
            const sanDecay = currentSanityBase + count * 0.175; // scale with count
            sanity = clamp(sanity - sanDecay, 0, 100);
            updateUI();

            if (sanity <= 0) {
                phase = 'progress';
                progress = 40;
                showProgress();
                updateUI();
            }
        }, currentSanityTickMs);
    }

    function restartProgressInterval() {
        if (progressIntervalId) clearInterval(progressIntervalId);
        progressIntervalId = setInterval(() => {
            if (phase !== 'progress') return;
            const progressDecay = currentProgressBase + count * 1.125;
            progress = clamp(progress - progressDecay, 0, 100);
            updateUI();

            if (progress <= 0) {
                // stop intervals
                if (sanityIntervalId) clearInterval(sanityIntervalId);
                if (progressIntervalId) clearInterval(progressIntervalId);
                gameOver = true;
                try { if (typeof textInterval !== 'undefined') clearInterval(textInterval); } catch(e) {}
                if (progressTextInterval) { clearInterval(progressTextInterval); progressTextInterval = null; }
                hideProgressText();
                if (typeof timerBar !== 'undefined' && timerBar) timerBar.style.animationPlayState = 'paused';
                alert('You werent able to survive in this forsaken place.');
                return;
            }

            if (progress >= 100) {
                progress = 100;
                phase = 'sanity';
                sanity = 100;
                progress = 40;
                hideProgressText();
                showSanity();
                updateUI();
            }
        }, currentProgressTickMs);
    }

    function changeTextWithAnimation(scene) {
        if (!textElement) return;
        if (textCounter + 1 >= scene.texts.length) {
            clearInterval(textInterval);
            startButtonsForScene(scene);
            return;
        }

        textElement.classList.remove('text-show');
        textElement.classList.add('text-fade');

        setTimeout(() => {
            textCounter++;
            textElement.textContent = scene.texts[textCounter];
            textElement.classList.remove('text-fade');
            textElement.classList.add('text-show');
        }, 800);
    }

    function showScene(id) {
        const scene = findScene(id);
        currentSceneId = scene.id;
        // update image
        if (imgEl && scene.image) imgEl.src = scene.image;
        // reset counters and text
        textCounter = 0;
        if (textElement) textElement.textContent = scene.texts[0] || '';
        // clear any previous interval
        if (textInterval) clearInterval(textInterval);
            // hide buttons immediately while the text sequence runs
            if (container) {
                container.classList.add('hidden');
                clearButtons();
            }
        // start text progression for this scene
        textInterval = setInterval(() => changeTextWithAnimation(scene), 2200);
        // ensure buttons will be created when the text series finishes
    }

    // initialize with first scene
    showScene(scenes[0].id);
    // start the restartable tickers (they will gate by `phase` internally)
    try { restartSanityInterval(); } catch (e) { /* defensive: if restart isn't defined yet, ignore */ }
    try { restartProgressInterval(); } catch (e) { /* defensive */ }
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
// code-entry UI (same behavior as TimeTooLong)
const codeContainer = document.getElementById('code-container');
const codeInput = document.getElementById('code-input');
const codeSubmit = document.getElementById('code-submit');
const codeFeedback = document.getElementById('code-feedback');

// map of valid codes to destinations (adjust per-page as needed)
// keep raw mapping here, then normalize keys into CODE_MAP for case/whitespace-insensitive lookup
const CODE_MAP_RAW = {
    'sky': '/pg9-15/HTML/Home.html',
    'the sky': '/pg9-15/HTML/Home.html'
};
const CODE_MAP = Object.fromEntries(
    Object.entries(CODE_MAP_RAW).map(([k, v]) => [k.toLowerCase().replace(/\s+/g, ' '), v])
);

function showCodeEntry() {
    if (codeContainer) {
        codeContainer.classList.remove('hidden');
        codeContainer.style.display = 'flex';
    }
}

function hideCodeEntry() {
    if (codeContainer) {
        codeContainer.classList.add('hidden');
        codeContainer.style.display = '';
    }
    if (codeFeedback) codeFeedback.textContent = '';
}

function handleCodeSubmit() {
    if (!codeInput) return;
    // normalize: trim, collapse multiple spaces, lower-case for robust matching
    const val = codeInput.value.trim().replace(/\s+/g, ' ').toLowerCase();
    if (!val) {
        if (codeFeedback) codeFeedback.textContent = 'Choose your fate';
        return;
    }
    const dest = CODE_MAP[val];
    if (dest) {
        window.location.href = dest;
    } else {
        if (codeFeedback) codeFeedback.textContent = 'The fate you have chosen is not within your grasp';
    }
}

if (codeSubmit) codeSubmit.addEventListener('click', handleCodeSubmit);
if (codeInput) codeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleCodeSubmit(); });

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
    // show code-entry UI in sanity
    showCodeEntry();
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
    // hide code-entry UI during progression
    hideCodeEntry();

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
        insaneCaptionEl.textContent = `Forceful Resistance| ${count}: ${msg}`;
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
        if (count <= 1) severity = 'I cant give up';
        else if (count <= 2) severity = 'Its not my time';
        else if (count <= 3) severity = 'Its hopeless';
        else severity = '...';

        // choose message fragment based on progress
        const pct = Math.floor(progress);
        let fragment;
        if (pct < 25) fragment = '';
        else if (pct < 50) fragment = '';
        else if (pct < 75) fragment = '';
        else fragment = '';

        progressTextEl.textContent = `Resistance ${severity} — ${fragment}`;
    } catch (err) {
        console.warn('updateProgressText failed:', err);
    }
}

// clamp helper
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// timing constants and bases
const SANITY_TICK_MS = 2000; // how often sanity ticks (ms)
const PROGRESS_TICK_MS = 1000; // how often progress ticks (ms)
const SANITY_DECAY_BASE = 2.5;   // base sanity decay per sanity tick
const PROGRESS_DECAY_BASE = 5; // base progress decay per progress tick
const SPACE_INCREASE_BASE = 2; // base progress increase per space press

// current per-tick bases (updated per-scene when the scene's buttons appear)
let currentSanityBase = SANITY_DECAY_BASE;
let currentProgressBase = PROGRESS_DECAY_BASE;
// current per-scene space increase base (updated in startButtonsForScene)
let currentSpaceIncreaseBase = SPACE_INCREASE_BASE;

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
    const baseInc = (typeof currentSpaceIncreaseBase === 'number') ? currentSpaceIncreaseBase : SPACE_INCREASE_BASE;
    const spaceInc = Math.max(1, Math.round(baseInc - Math.floor(count * 0.5)));
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

// Note: intervals are now managed via restartSanityInterval/restartProgressInterval
// to support per-scene tick frequencies and restarting. The old fixed global
// intervals were removed to avoid duplicate/conflicting timers.
