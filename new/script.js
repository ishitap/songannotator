/* Globals */

var id_counter = 1; // for annotation ids
var annotationList; // refers to the annotation table
var annotations = []; // data structure for annotations
var onAnn = []; // stores the id of the annotation which is currently "on", if any

/* Helper functions */

// Converts number of seconds into timestamp
function secondsToTime(seconds) {
	var min = Math.floor(seconds / 60);
	var sec = seconds % 60;
	if (sec < 10) {
		sec = "0" + sec;
	}
	return min + ":" + sec;
}

// Converts timestamp into number of seconds
function timeToSeconds(time) {
	var sections = time.split(":");
	return (Number(sections[0]) * 60) + Number(sections[1]);
}

// Finds the index for annotation to be added at within the time-sorted array
function findIndex(annotation) {
	var index = annotations.length;
	for (i = 0; i < annotations.length; i++){
		if (annotations[i]["timestamp"] > annotation.timestamp){
			index = i;
			break;
		}
	}
	return index;
}	

/* Functions */

// Displays the newly added annotation
function displayAnnotation(annotation) {
	annotation.timestamp = Number(annotation.timestamp);
	annotation.displayTime = secondsToTime(annotation.timestamp);
	annotation.displayID = id_counter++;

	var annotationHTML = annotationTemplate(annotation);

	var index = findIndex(annotation)
	var prevIndex = index - 1;
	var annotationObj;

	if (prevIndex >= 0) {
		var prev = annotationList.find('#' + annotations[prevIndex].displayID)
		prev.after(annotationHTML);
	}
	else {
		annotationList.prepend(annotationHTML);
	}

	annotations.splice(index, 0, annotation);
	addAnnotationInteractions($("#" + annotation.displayID));
}

// Adds listeners for annotation
function addAnnotationInteractions(annotation) {
	annotation.slideDown()
		.mouseover(function () {
			$(this).find(".annotation-control").show();
		})
		.mouseout(function () {
			$(this).find(".annotation-control").hide();
		});

	annotation.find(".remove-annotation").click(function () {
		var annotationToRemove = $(this).closest(".annotation");
		removeAnnotation(annotationToRemove);
	});

	annotation.find(".annotation-time-display").click(function () {
		$(this).hide();
		var annotationTimeInput = $(this).next();
		annotationTimeInput.show().focus();
	});

	annotation.find(".annotation-time-input").on("blur keypress", function (e) {
		if (e.which == 13) {
			e.preventDefault();
		}
		if (e.type == "blur" || e.which == 13) {
			$(this).hide();
			if ($(this).val() == $(this).prev().html()) {
				$(this).prev().show();
				return;
			}
			$(this).prev().html($(this).val());
			$(this).prev().show();
			var annotation = $(this).closest(".annotation");
			changeAnnotationTime(annotation, formatTimeReverse($(this).val()));
		}
	});
}

// Changes timestamp for annotation
function changeAnnotationTime(annotation, newTimestamp) {
	var displayID = annotation.attr("id");
	var oldAnnotation = annotations[findAnnotation(displayID)];
	var newAnnotation = {};
	newAnnotation.text = oldAnnotation.text;
	newAnnotation.timestamp = newTimestamp;
	removeAnnotation(annotation);
	displayAnnotation(newAnnotation);
}

// Finds annotation based on displayID
function findAnnotation(displayID) {
	var index = -1;
	annotations.some(function (e, i, a) {
			if(Number(e.displayID) == Number(displayID)) {
				index = i;
				return true;
			}
			return false;
		});
	return index;
}

// Removes annotation
function removeAnnotation(annotation) {
	var displayID = annotation.attr("id");
	annotation.slideUp(400, function () {
		$(this).remove();
	});

	var indexToRemove = findAnnotation(displayID);
	var annotationToRemove = annotations[indexToRemove];
	var annotationMotifs = annotationToRemove.motifs;
	if (annotationMotifs) {
		for (i = 0; i < motifs.length; i++) {
			if (annotationMotifs.indexOf(motifs[i].timestamp) > -1) {
				annLocation = motifs[i].ann.indexOf(displayID);
				motifs[i].ann.splice(annLocation, 1);
			}
		}
	}
	annotations.splice(indexToRemove, 1);
}

// Displays all the annotations that are already present
function displayAllAnnotations(annotations) {
	annotations.forEach(function (e, i, a) {
		displayAnnotation(e);
	});
}

// Given a time in seconds, highlights that annotation to be yellow 
function highlight(time){
	onAnn.forEach(function (e, i, a) {
		$('#' + e.displayID).removeClass("highlighted");
	});
	onAnn = [];
	for (i = 0; i < annotations.length; i++) {
		if (annotations[i].timestamp == time) {
			$('#' + annotations[i].displayID).addClass("highlighted");
			scrollToAnnotation(annotations[i]);
			onAnn.push(annotations[i]);
		}
	}
}

// Scrolls to annotation
function scrollToAnnotation(annotation) {
	/* var annotationView = $('#' + annotation.displayID);
	var scrollPos = annotationView.offset().top - 50;
	$('html, body').animate({
		scrollTop: scrollPos
	}, 400); */
}

// Function that runs with pre-populated annotations when the page is first loaded 
$(document).ready(function () {
	annotationList = $('#annotation-list');
	annotationTemplate = Handlebars.compile($("#annotation-template").html());

	ann = [ { timestamp: 1, text: "First annotation"},
					{ timestamp: 4, text: "Second annotation"},
					{ timestamp: 12, text: "Opportunity for ramp-up"},
					{ timestamp: 30, text: "Bass drop"}]

	displayAllAnnotations(ann);
});

wavesurfer.on('ready', function () {
  // Check current time to highlight annotations
	window.setInterval(function() {
		var seconds = Math.floor(wavesurfer.currentTime);
		highlight(seconds);
		document.getElementById("time").innerHTML = "Time: " + secondsToTime(seconds);
	}, 100);
});

/* Callbacks */

// Creates and displays new annotation on form submit
$("#annForm").submit(function() {
	event.preventDefault();
	var time = Math.floor(wavesurfer.getCurrentTime());
	var text = $('input[name="text"]').val();
	var annotation = {timestamp: time, text: text};
	displayAnnotation(annotation);
	this.reset()
});
