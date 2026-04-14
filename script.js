'use strict'

addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const T1 = prompt("Who am I again?")
        const Name = JSON.stringify(T1);
        localStorage.setItem("T1", Name);    
        this.window.location.href = '/Intro-pg2/HTML/BR-2.html'
    }

    else {
        console.log("invalid key")
    }
})