// annotation -> { timestamp, text, displayID }

var table;
var annotations = [];

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

// Displays the newly added annotation
function displayAnnotation(annotation) {

	annotation.timestamp = Number(annotation.timestamp);
	annotation.displayID = '#' + annotation.timestamp;

	var tableRow = "<tr id='" + annotation.timestamp + "'><td>" + formatTimestamp(annotation.timestamp) 
								+ "</td><td>" + annotation.text + "</td></tr>";

	var index = findIndex(annotation)
	var prevIndex = index - 1;

	if (prevIndex >= 0) {
		// console.log(annotation.timestamp + " not first")
		var prev = table.find(annotations[prevIndex].displayID)
		prev.after(tableRow);
	}
	else 
		table.find('#heading-row').after(tableRow);

	// console.log(annotations.length)

	if (index >= annotations.length)
		annotations.push(annotation);
	else {
		annotations.splice(index, 0, annotation);
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
	if (onAnn){
		document.getElementById(onAnn).style.backgroundColor = "white";
	}
	for (i = 0; i < annotations.length; i++){
		if (annotations[i]["timestamp"] == time){
			document.getElementById(time).style.backgroundColor = "yellow";
			onAnn = time;
		}
	}
}

// Function that runs with pre-populated annotations when the page is first loaded 
$(document).ready(function () {
	table = $('#annotation-table');
	var ann = [ { timestamp: 1, text: "First annotation"},
							{ timestamp: 4, text: "Second annotation"},
							{ timestamp: 12, text: "Opportunity for ramp-up"},
							{ timestamp: 30, text: "Bass drop"}]

	displayAllAnnotations(ann);
});

// Check current time to highlight annotations
window.setInterval(function() {
	var time = Math.floor($("audio")[0].currentTime);
	highlight(time);
	document.getElementById("time").innerHTML = "Time: " + formatTimestamp(time);
}, 100);
