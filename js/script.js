// annotation -> { timestamp, text, displayID }

var table;
var annotations = [];

function formatTimestamp(timestamp) {
	return timestamp;
}

function findIndex(annotation) {
	var index = 0;
	annotations.some(function (e, i, a) {
		if(e.timestamp > annotation.timestamp) {
			index = i;
			return true;
		}
		return false;
	});
	return index;
}


function displayAnnotation(annotation) {

	annotation.displayID = '#' + annotation.timestamp;

	var tableRow = "<tr id='" + annotation.displayID + "'><td>" + formatTimestamp(annotation.timestamp) 
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

