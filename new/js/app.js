/* formerly script.js and form.js */

// annotation -> { timestamp, text, displayID }

var id_counter = 1;      // global for annotation ids
var annotationList;               // global referring to the annotation table
var annotations = [];    // global data structure for annotations
// Global variable which stores the id of the annotation which is currently "on", if any
onAnn = [];
var canvas;
var recordTime = 0;
var prevFormVal = $("formText").val();

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

// converts xx:xx to seconds
function formatTimeReverse(timestamp) {
	var sections = timestamp.split(":");
	return (Number(sections[0]) * 60) + Number(sections[1]);
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

function removeMotifs(annotation) {
	var annotationMotifs = annotation.motifs;
	if (!annotationMotifs) return;

	for (var i = 0; i < motifs.length; i++) {
		console.log("woot")
		console.log(motifs[i].mName)
		var j = annotationMotifs.indexOf(motifs[i].timestamp);
		console.log(j)
		if (j > -1) {
			annLocation = motifs[i].ann.indexOf(annotation.displayID);
			motifs[i].ann.splice(annLocation, 1);
			if (motifs[i].ann.length == 0) {
				deleteFunction(motifs[i].timestamp, false);
				i--;
			}
		}
	}
	annotation.motifs = [];
}

// Displays the newly added annotation
function displayAnnotation(annotation) {	
	$("#annotation-display .empty-text").hide();

	annotation.timestamp = Number(annotation.timestamp);
	annotation.displayTime = formatTimestamp(annotation.timestamp);
	annotation.displayID = id_counter++;

	var annotationHTML = annotationTemplate(annotation);

	var index = findIndex(annotation)
	var prevIndex = index - 1;
	var annotationObj;

	if (prevIndex >= 0) {
		var prev = annotationList.find('#' + annotations[prevIndex].displayID)
		prev.after(annotationHTML);
	}
	else 
		annotationList.prepend(annotationHTML);

	annotations.splice(index, 0, annotation);
	addAnnotationInteractions($("#" + annotation.displayID));
	annotation.tick = drawTick(annotation.timestamp);
	highlight(Math.floor(wavesurfer.getCurrentTime()));
	scrollToAnnotation(annotation);
}

function addAnnotationInteractions(annotation) {
	annotation.slideDown()
		.mouseover(function () {
			$(this).find(".annotation-control").show();
		})
		.mouseout(function () {
			$(this).find(".annotation-control").hide();
		});

	annotation.find(".remove-annotation").click(function (e) {
		e.stopPropagation();
		var annotationToRemove = $(this).closest(".annotation");
		removeAnnotation(annotationToRemove);
	});

	annotation.find(".edit-annotation").click(function (e) {
		e.stopPropagation();
		var annotationToEdit = $(this).closest(".annotation");
		editAnnotation(annotationToEdit);
	});

	annotation.find("form").on("submit focusout", function () {
		event.preventDefault();
		var newTime = $(this).find(".annotation-time-input").val().trim();
		var newText = $(this).find(".annotation-text-input").val().trim();

		// update annotation text
		var annotation = $(this).closest(".annotation");
		annotation.find(".annotation-text-display").html(newText);
		var annotationJSON = annotations[findAnnotation(annotation.attr("id"))];
		annotationJSON.text = newText;
		removeMotifs(annotationJSON);
		getMotif(newText, annotationJSON);

		// update annotation time
		var annotationTimeDisplay = annotation.find(".annotation-time-display");
		if (newTime != annotationTimeDisplay.html()) {
			annotationTimeDisplay.html(newTime);
			changeAnnotationTime(annotation, formatTimeReverse(newTime));
		}

		annotation.find(".editAnnotationForm").hide();
		annotation.find(".annotationDisplay").show();
	});
}

function editAnnotation(annotation) {
	annotation.find(".annotationDisplay").hide();
	annotation.find(".editAnnotationForm").show()
		.find(".annotation-text-input").focus();
}

function changeAnnotationTime(annotation, newTimestamp) {
	var displayID = annotation.attr("id");
	var oldAnnotation = annotations[findAnnotation(displayID)];
	var newAnnotation = {};
	newAnnotation.text = oldAnnotation.text;
	newAnnotation.timestamp = newTimestamp;
	removeAnnotation(annotation);
	displayAnnotation(newAnnotation);
}

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

function removeAnnotation(annotation) {
	var displayID = annotation.attr("id");
	annotation.slideUp(400, function () {
		$(this).remove();
		var indexToRemove = findAnnotation(displayID);
		var annotationToRemove = annotations[indexToRemove];
		removeMotifs(annotationToRemove);
		annotations.splice(indexToRemove, 1);
		removeTick(annotationToRemove.tick);
		if (annotations.length == 0)
			$("#annotation-display .empty-text").show();
	});
}

// Displays all the annotations that are already present
function displayAllAnnotations(annotations) {
	annotations.forEach(function (e, i, a) {
		displayAnnotation(e);
	});
}

// Given a time in seconds, highlights that annotation  
function highlight(time){
	onAnn.forEach(function (e, i, a) {
		$('#' + e.displayID).removeClass("highlighted");
		unhighlightTick(e.tick);
	});
	onAnn = [];
	for (i = 0; i < annotations.length; i++) {
		if (annotations[i].timestamp > (time - 0.5) && annotations[i].timestamp < (time + 1.5)) {
			$('#' + annotations[i].displayID).addClass("highlighted");
			highlightTick(annotations[i].tick);
			onAnn.push(annotations[i]);
		}
	}
	if (onAnn.length > 0){
		scrollToAnnotation(onAnn[0]);
	}
}

function scrollToAnnotation(annotation) {
	var annotationView = $('#' + annotation.displayID);
	// if (annotationView.offset().top + 50 > $(window).height()){
		var scrollPos = annotationView.offset().top;
		$('html, body').animate({
			scrollTop: scrollPos - 300
		}, 600);	
	// }
}

function keepTime(){
	curFormVal = $("#formText").val();
	if (prevFormVal == ""){
		recordTime = Math.floor(wavesurfer.getCurrentTime());
	}
	prevFormVal = curFormVal;
}


$("#formText").keyup(function () {
	var text = $(this).val();
	if (text.trim() == "") {
		$(".submit-button").attr("disabled", "disabled");
	}
	else {
		$(".submit-button").removeAttr("disabled");
	}
});

function clickAnn(displayID){
	ann = annotations[findAnnotation(displayID)];
	jumpTo(ann.timestamp);
}

$("#annForm").submit(function() {
	event.preventDefault();
	var timestamp = recordTime;
	// var timestamp = Math.floor(wavesurfer.getCurrentTime());
	prevFormVal = "";
	var text = $('input[name="text"]').val();
	var annotation = {timestamp: timestamp, text: text};
	displayAnnotation(annotation);
	getMotif(text, annotation);
	this.reset();
	// (".submit-button").attr("disabled", "disabled");
});

