// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
  var options = {
    container: document.querySelector('#waveform'),
    loaderColor: '#DDDDDD',
    waveColor: '#7FC6BC',
    progressColor: '#4BB5C1',
    cursorColor: '#96CA2D',
    height: 150,
    scrollParent: false
  };

  // Init
  wavesurfer.init(options);
  // Load audio from URL
  wavesurfer.load('feelsoclose.mp3');

  // Regions
  /* if (wavesurfer.enableDragSelection) {
    wavesurfer.enableDragSelection({
      color: 'rgba(150, 202, 45, 0.1)'
    });
  } */
});

wavesurfer.on('ready', function () {
  // wavesurfer.play();
});

// Report errors
wavesurfer.on('error', function (err) {
  console.error(err);
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
