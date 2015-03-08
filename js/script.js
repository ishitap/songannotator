// annotation -> { timestamp, text, displayID }

var id_counter = 1;      // global for annotation ids
var annotationList;               // global referring to the annotation table
var annotations = [];    // global data structure for annotations

var annotationTemplate;

function formatTimestamp(timestamp) {
	var min = Math.floor(timestamp / 60);
	var sec = timestamp % 60;
	if (sec < 10) {
		sec = "0" + sec;
	}
	var formatted = min + ":" + sec;
	return formatted;
}

// Helper Function: Finds the right spot for the annotation to be added within the time-wise sorted array
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

function getMotif(textVal, annotation){
	i = 0;
	annotation["motifs"] = []
	while (i < textVal.length){
		hashTag = textVal.indexOf('#',i);
		if (hashTag == -1){
			break;
		}
		space = textVal.indexOf(' ',hashTag);
		if (space == -1){
			space = textVal.length;
		}		
		tag = textVal.substring(hashTag+1,space);
		newMotif = {mName: tag, timestamp:Date.now(), ann:[]};
		addMotif(newMotif, annotation);
		i = hashTag + 1;
	}
}

// Displays the newly added annotation
function displayAnnotation(annotation) {
	annotation.timestamp = Number(annotation.timestamp);
	annotation.displayTime = formatTimestamp(annotation.timestamp);
	annotation.displayID = id_counter++;

	var annotationHTML = annotationTemplate(annotation);

	var index = findIndex(annotation)
	var prevIndex = index - 1;
	var annotationObj;

	if (prevIndex >= 0) {
		// if this annotation isn't first
		var prev = annotationList.find('#' + annotations[prevIndex].displayID)
		prev.after(annotationHTML);
	}
	else 
		// if this annotation is first
		annotationList.prepend(annotationHTML);

	if (index >= annotations.length)
		annotations.push(annotation);
	else {
		annotations.splice(index, 0, annotation);
	}

	addAnnotationInteractions($("#" + annotation.displayID));
}

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
}

function removeAnnotation(annotation) {
	var displayID = annotation.attr("id");
	var actualAnn;
	for (i = 0; i < annotations.length; i++){
		if (displayID == annotations[i].displayID){
			actualAnn = annotations[i];
			break;
		}
	}
		annotation.slideUp(400, function () {
			$(this).remove();
		});

		var indexToRemove = -1;
		annotations.some(function (e, i, a) {
			if(e.displayID == displayID) {
				indexToRemove = i;
				return true;
			}
			return false;
		});
		if(indexToRemove != -1)
			annotations.splice(indexToRemove, 1);
	var annMotifs = actualAnn.motifs;
	for (i = 0; i < motifs.length; i++){
		if (annMotifs.indexOf(motifs[i].timestamp) > -1){
			annLocation = motifs[i].ann.indexOf(displayID);
			motifs[i].ann.splice(annLocation,1);
		}
	}
}

// Displays all the annotations that are already present
function displayAllAnnotations(annotations) {
	annotations.forEach(function (e, i, a) {
		displayAnnotation(e);
	});
}

// Global variable which stores the id of the annotation which is currently "on", if any
onAnn = null;

// Given a time in seconds, highlights that annotation to be yellow 
function highlight(time){
	if (onAnn && document.getElementById(onAnn)){
		document.getElementById(onAnn).style.backgroundColor = "white";
	}
	for (i = 0; i < annotations.length; i++){
		if (annotations[i]["timestamp"] == time){
			document.getElementById(annotations[i]["displayID"]).style.backgroundColor = "#d6e9c6";
			onAnn = annotations[i]["displayID"];
		}
	}
}

// Function that runs with pre-populated annotations when the page is first loaded 
$(document).ready(function () {
	table = $('#annotation-table');
	annotationList = $('#annotation-list');
	annotationTemplate = Handlebars.compile($("#annotation-template").html());

	ann = [ { timestamp: 1, text: "First annotation"},
							{ timestamp: 4, text: "Second annotation"},
							{ timestamp: 12, text: "Opportunity for ramp-up"},
							{ timestamp: 30, text: "Bass drop"}]

	displayAllAnnotations(ann);
	addInitialMotifs();
});

// Check current time to highlight annotations
window.setInterval(function() {
	var time = Math.floor($("audio")[0].currentTime);
	highlight(time);
	document.getElementById("time").innerHTML = "Time: " + formatTimestamp(time);
}, 100);
