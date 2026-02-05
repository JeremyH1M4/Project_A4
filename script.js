'use strict'

addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        this.window.location.href = '/Intro-pg2/HTML/BR.html'
    }

    else {
        console.log("invalid key")
    }
})