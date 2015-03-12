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

// Displays the newly added annotation
function displayAnnotation(annotation) {	
	$("#empty-text").hide();

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
		e.preventDefault();
		e.stopPropagation();
		var annotationToRemove = $(this).closest(".annotation");
		removeAnnotation(annotationToRemove);
	});

	annotation.find(".annotation-time-display").click(function () {
		$(this).hide();
		var annotationTimeInput = $(this).next();
		annotationTimeInput.show().focus();
	});

	annotation.find(".annotation-time-input").on("blur keypress", function (e) {
		if (e.which == 13 ) {
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
		removeTick(annotationToRemove.tick);
		if (annotations.length == 0)
			$("#empty-text").show();
	});
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
		unhighlightTick(e.tick);
	});
	onAnn = [];
	for (i = 0; i < annotations.length; i++) {
		if (annotations[i].timestamp > (time - 0.5) && annotations[i].timestamp < (time + 1.5)) {
			$('#' + annotations[i].displayID).addClass("highlighted");
			scrollToAnnotation(annotations[i]);
			highlightTick(annotations[i].tick);
			onAnn.push(annotations[i]);
		}
	}
}

function scrollToAnnotation(annotation) {
	// var annotationView = $('#' + annotation.displayID);
	// var scrollPos = annotationView.offset().top - 50;
	// $('html, body').animate({
	// 	scrollTop: scrollPos
	// }, 400);
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

