/* Waveform intialization */

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
  // Set options
  var options = {
    container: document.querySelector('#waveform'),
    loaderColor: '#DDDDDD',
    waveColor: '#7FC6BC',
    progressColor: '#4BB5C1',
    cursorColor: '#6DCA2D',
    height: 150,
    scrollParent: false
  };

  // Init
  wavesurfer.init(options);
  // Load audio from URL
  wavesurfer.load('peeloon.mp3');
});

// Report errors
wavesurfer.on('error', function (err) {
  console.error(err);
});

// Progress bar
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

/* Load controls */

var GLOBAL_ACTIONS = {
    'play': function () {
        wavesurfer.playPause();
        // Change icon
        var $playPause = $("#play-pause");
        if ($playPause.hasClass("glyphicon-play")) {
            $playPause.removeClass("glyphicon-play");
            $playPause.addClass("glyphicon-pause");
        } else if ($playPause.hasClass("glyphicon-pause")) {
            $playPause.removeClass("glyphicon-pause");
            $playPause.addClass("glyphicon-play");
        }
    },

    'back': function () {
        wavesurfer.skipBackward();
    },

    'forth': function () {
        wavesurfer.skipForward();
    },

    'mute': function () {
        wavesurfer.toggleMute();
        // Change icon
        var $volume = $("#volume");
        if ($volume.hasClass("glyphicon-volume-up")) {
            $volume.removeClass("glyphicon-volume-up");
            $volume.addClass("glyphicon-volume-off");
        } else if ($volume.hasClass("glyphicon-volume-off")) {
            $volume.removeClass("glyphicon-volume-off");
            $volume.addClass("glyphicon-volume-up");
        }
    }
};

// Bind actions to buttons and keypresses
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', function (e) {
        var map = {
            // 32: 'play',       // space
            37: 'back',       // left
            39: 'forth'       // right
        };
        var action = map[e.keyCode];
        if (action in GLOBAL_ACTIONS) {
            if (document == e.target || document.body == e.target) {
                e.preventDefault();
            }
            GLOBAL_ACTIONS[action](e);
        }
    });

    [].forEach.call(document.querySelectorAll('[data-action]'), function (el) {
        el.addEventListener('click', function (e) {
            var action = e.currentTarget.dataset.action;
            if (action in GLOBAL_ACTIONS) {
                e.preventDefault();
                GLOBAL_ACTIONS[action](e);
            }
        });
    });

    $("#controls .btn-group button").mouseup(function () {
      $(this).blur();
    });
});

/* Callback */
wavesurfer.on('ready', function () {
  // Check current time to highlight annotations
  window.setInterval(function() {
    var seconds = Math.floor(wavesurfer.getCurrentTime());
    highlight(seconds);
    document.getElementById("time").innerHTML = formatTimestamp(seconds);
  }, 100);

  console.log("Loaded wavesurfer");

  annotationList = $('#annotation-list');
  annotationTemplate = Handlebars.compile($("#annotation-template").html());
  canvas = document.getElementById("timeline-canvas");

  ann = [ { timestamp: 1, text: "First annotation"},
              { timestamp: 4, text: "Second annotation"},
              { timestamp: 12, text: "Opportunity for ramp-up"},
              { timestamp: 30, text: "Bass drop"}]

  setupTicksCanvas(wavesurfer.getDuration());
  displayAllAnnotations(ann);
  addInitialMotifs();
  addMotifFiltering();

  if (annotations.length == 0)
    $("#empty-text").show();
});


function jumpTo(numSecond){
  wavesurfer.seekTo((numSecond*1.0)/wavesurfer.getDuration());
}