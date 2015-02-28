// annotation -> { timestamp, text, displayID }

var table;
var annotations = [];

function formatTimestamp(timestamp) {
	return timestamp;
}

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


function displayAnnotation(annotation) {

	annotation.displayID = '#' + annotation.timestamp;

	var tableRow = "<tr id='" + annotation.timestamp + "'><td>" + formatTimestamp(annotation.timestamp) 
								+ "</td><td>" + annotation.text + "</td></tr>";

	var prevIndex = findIndex(annotation) - 1;
	if (prevIndex >= 0) {
		table.find(annotations[prevIndex].displayID).after(tableRow);
	}
	else table.find('#heading-row').after(tableRow);

	annotations.splice(prevIndex+1, 0, annotation);
}

function displayAllAnnotations(annotations) {
	annotations.forEach(function (e, i, a) {
		displayAnnotation(e);
	});
}

$(document).ready(function () {
	table = $('#annotation-table');
	var ann = [ { timestamp: 5, text: "hi"},
							{ timestamp: 11, text: "how"}, 
							{ timestamp: 3, text: "are"},
							{ timestamp: 9, text: "you"},
							{ timestamp: 1, text: "dude"},]

	displayAllAnnotations(ann);
});

//Global variable which stores the id of the annotation which is currently "on", if any
onAnn = null;

//Given a time in seconds, highlights that annotation to be yellow 
function highlight(time){
	if (onAnn){
		document.getElementById(onAnn).style.backgroundColor = "white";
	}
	for (i = 0; i < annotations.length; i++){
		if (annotations[i]["timestamp"] == time){
			document.getElementById("#" + time).style.backgroundColor = "yellow";
			onAnn = "#" + time;
		}
	}
}
