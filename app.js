const synth = window.speechSynthesis; 
const voiceSelect = document.querySelector('#voice-select');
const textArea = document.querySelector('textarea');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');
const rateInput = document.querySelector('input[name="rate"]');
const pitchInput = document.querySelector('input[name="pitch"]');


function populateVoiceSelect() {
    // filter voices
    const voices = synth.getVoices().filter(voice => voice.lang.includes('en'));
    // console.log(voices); this doesn't work on page re-load (maybe functions are being called before variables are declared?)
    voiceSelect.innerHTML = voices.map(voice => {
        return `<option value='${voice.name}'>${voice.name} (${voice.lang})</option>`
    }).join('');
}

function setVoice() {
    //console.log(this);
    //console.log(this.selectedIndex); //this works 
    const name = this.options[this.selectedIndex].value;
    // console.log(name);
    const voice = synth.getVoices().filter(voice => voice.name == name)[0];
    console.log(voice);
    utterThis.voice = voice;
}

// this was the only way I could get it to work. The following two methods didn't work
// <body onload='populateVoiceSelect()'>
// document.addEventListener('DOMContentLoaded', populateVoiceSelect);
setTimeout(populateVoiceSelect, 500);


function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

let utterThis = new SpeechSynthesisUtterance();
function getInputUtterance() {
    utterThis.text = textArea.value;
    // console.log(e);
    // console.log(utterThis);
}
getInputUtterance();
// this fires every time I type - needs some sort of lag for when we're done typing
// textArea.addEventListener('input', getInputUtterance);
// need to debounce it - test it a few times to see what a good value for 'wait' is
// 200 is sufficient for anyone but first time typers - we'll use 500 to be safe
textArea.addEventListener('input', debounce(getInputUtterance, 500));
speakButton.addEventListener('click', function() {
    synth.speak(utterThis);
});
stopButton.addEventListener('click', function() {
    synth.cancel();
})

// 'change' works but only on release
// 'oninput' doesn't work
// 'onchange' doesn't work
rateInput.addEventListener('change', function() {
    // console.log(e);
    // console.log(this.value);
    utterThis.rate = parseFloat(this.value);
});
pitchInput.addEventListener('change', function() {
    utterThis.pitch = parseFloat(this.value);
})
voiceSelect.addEventListener('change', setVoice);



// Experimental Code 
// var utterThis = new SpeechSynthesisUtterance('hello from the other side');
// won't autoplay in Chrome since it was being abused, this code does work though
// synth.speak(utterThis);

// this doesn't work
/*utterThis.voice = 'Fiona';
synth.speak(utterThis)*/

// this works although it won't run without me manually doing it
/*utterThis.voice = synth.getVoices()[15];
synth.speak(utterThis);*/
