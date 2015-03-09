'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
  var options = {
    container     : document.querySelector('#waveform'),
    waveColor     : 'violet',
    progressColor : 'purple',
    loaderColor   : 'purple',
    cursorColor   : 'purple'
  };

  // Init
  wavesurfer.init(options);

  // Load audio from URL
  wavesurfer.load('media/feelsoclose.mp3');
});

// Play at once when ready
wavesurfer.on('ready', function () {
  // wavesurfer.play();
});

// Report errors
wavesurfer.on('error', function (err) {
  console.error(err);
});

// Do something when the clip is over
wavesurfer.on('finish', function () {
  console.log('Finished playing');
});

/* Progress bar */
document.addEventListener('DOMContentLoaded', function () {
  var progressDiv = document.querySelector('#progress-bar');
  var progressBar = progressDiv.querySelector('.progress-bar');

  var showProgress = function (percent) {
    progressDiv.style.display = 'block';
    progressBar.style.width = percent + '%';
  };

  var hideProgress = function () {
    progressDiv.style.display = 'none';
  };

  wavesurfer.on('loading', showProgress);
  wavesurfer.on('ready', hideProgress);
  wavesurfer.on('destroy', hideProgress);
  wavesurfer.on('error', hideProgress);
});
