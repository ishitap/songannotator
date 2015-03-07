//motif -> {motif text, timestamp of addition, array of corresponding annotation IDs}
var motifs = [];

//Allows user to add motif to their collection of motifs
$("#motForm").submit(function() {
	event.preventDefault();
	var text = $('input[name="motText"]').val();
	text = text.replace(/\s+/g, '');
	var time = Date.now();
	addMotif({mName: text, timestamp: time, ann: []}, null);
	this.reset();
});

$("#filterForm").submit(function() {
	event.preventDefault();
	var text = $('input[name="filterText"]').val();
	for (i = 0; i < motifs.length; i++){
		if (motifs[i]["mName"] == text){
			var anns = motifs[i]["ann"];
			for (j = 0; j < annotations.length; j++){
				if (anns.indexOf(annotations[j]["displayID"]) == -1){
					console.log(annotations[j]["displayID"]);
					$("#" + annotations[j]["displayID"]).hide();
				}
			}
		}
	}
});

function filter(motifId){
	for (i = 0; i < motifs.length; i++){
		if (motifs[i]["timestamp"] == motifId){
			var anns = motifs[i]["ann"];
			for (j = 0; j < annotations.length; j++){
				if (anns.indexOf(annotations[j]["displayID"]) == -1){
					console.log(annotations[j]["displayID"]);
					$("#" + annotations[j]["displayID"]).hide();
				}
			}
		}
	}	
}

function clearFilter(){
	for (j = 0; j < annotations.length; j++){
		$("#" + annotations[j]["displayID"]).show();
	}
}

// Helper Function: Finds the right spot for the motif to be added within an alphabetically sorted array
function findMIndex(motif) {
	var index = motifs.length;
	for (i = 0; i < motifs.length; i++){
		if (motifs[i]["mName"] > motif.mName){
			index = i;
			break;
		}
	}
	return index;
}

//Adds motif directly as an annotation
function addClickFunction(motifId){
	var text = "";
	for (i = 0; i < motifs.length; i++){
		if (motifs[i].timestamp == motifId){
			text = "#" + motifs[i].mName;
			break;
		}
	}
	var timing = Math.floor($("audio")[0].currentTime);
	var ann = {timestamp: timing, text: text};
	displayAnnotation(ann);
}

// Adds motif to the annotation box
// function addToAnnotation(motifId){
// 	var text = "";
// 	for (i = 0; i < motifs.length; i++){
// 		if (motifs[i].timestamp == motifId){
// 			text = "#" + motifs[i].mName + " ";
// 			break;
// 		}
// 	}
// 	var startVal = $('input[name="text"]').val();
// 	$('input[name="text"]').val(startVal.concat(text));

// }

//Function to delete a motif
function deleteFunction(motifId){
	var mot = 0;
	var motText = "";
	for (i = 0; i < motifs.length; i++){
		if (motifs[i]["timestamp"] == motifId){
			mot = i;
			motText = motifs[i]["mName"];
			break;
		}
	}
	motifs.splice(mot,1);
	for (i = 0; i < annotations.length; i++){
		if (annotations[i]["motifs"]){
			var aMot = annotations[i]["motifs"].indexOf(motifId);
			if (aMot > -1){
				annotations[i]["motifs"].splice(aMot,1);
				var val = annotations[i]["text"];
				var mVal = val.indexOf("#" + motText);
				var firstPart = val.substring(0,mVal);
				var secondPart = val.substring(mVal+motText.length+2,val.length);
				annotations[i]["text"] = firstPart.concat(secondPart);
				tableId = "#td" + annotations[i]["displayID"];
				$(tableId)[0].innerHTML = annotations[i]["text"];
			}
		}
	}
	document.getElementById("motif-table").deleteRow(mot+1);
}

//Adds Motif to the Table Display
function addMotif(motif, annotation) {
	for (i = 0; i < motifs.length; i++){
		if (motifs[i].mName == motif.mName){
			if (annotation){
				motifs[i].ann.push(annotation.displayID);
				if (annotation["motifs"]){
					annotation["motifs"].push(motifs[i].timestamp);
				}
				else{
					annotation["motifs"] = [motifs[i].timestamp];
				}
			}
			return;
		}
	}

	if(annotation){
		motif.ann.push(annotation.displayID);
		if (annotation["motifs"]){
			annotation["motifs"].push(motif.timestamp);
		}
		else{
			annotation["motifs"] = [motif.timestamp];
		}
	}

	motifId = motif.timestamp;	

	var tableRow = "<tr id='" + motifId + "'><td><a href='#' onclick='filter("+ motifId + ")'>"+ motif.mName + "</a></td><td><a href='#' onclick='deleteFunction("+ motifId + ")''><img style='height:20px;' src='images/delete.png'></img></a></td></tr>";

	var mIndex = findMIndex(motif);
	var prevMIndex = mIndex - 1;
	console.log(prevMIndex);

	if (prevMIndex >= 0) {
		console.log(prevMIndex, motifs[prevMIndex].timestamp)
		var prev = $('#motif-table').find('#' + motifs[prevMIndex].timestamp);
		prev.after(tableRow);
	}
	else 
		$('#motif-table').find('#first-row').after(tableRow);

	if (mIndex >= motifs.length)
		motifs.push(motif);
	else {
		motifs.splice(mIndex, 0, motif);
	}
}

function addInitialMotifs(){
	motif1 = {mName:"formation-change", timestamp:Date.now(), ann:[]};
	addMotif(motif1, null);
	motif2 = {mName:"smooth-music", timestamp:Date.now(), ann:[]};
	addMotif(motif2, null);
	motif3 = {mName:"storyline", timestamp:Date.now(), ann:[]};
	addMotif(motif3, null);
	motif4 = {mName:"angry-flute", timestamp:Date.now(), ann:[]};
	addMotif(motif4,null);
	motif5 = {mName:"music-annotation", timestamp:Date.now(), ann:[]};
	addMotif(motif5,null);
	motif6 = {mName:"choreo-annotation", timestamp:Date.now(), ann:[]};
	addMotif(motif6, null);
}

