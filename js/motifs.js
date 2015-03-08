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
					$("#" + annotations[j]["displayID"]).hide();
				}
			}
		}
	}
});

function filter(motifId){
	clearFilter();
	for (i = 0; i < motifs.length; i++){
		if ($('#link' + motifs[i].timestamp).attr('class') == 'clicked' && motifs[i].timestamp != motifId){
			$('#link' + motifs[i].timestamp).toggleClass('clicked').toggleClass('unclicked');
		}
	}
	if ($('#link' + motifId).attr('class') == 'unclicked'){
		for (i = 0; i < motifs.length; i++){
			if (motifs[i]["timestamp"] == motifId){
				var anns = motifs[i]["ann"];
				console.log("ANNS", anns);
				if (anns.length == 0){
					clearFilter();
					$('#link' + motifId).toggleClass('clicked').toggleClass('unclicked');
					$('#filterText').show();
					return;
				}
				for (j = 0; j < annotations.length; j++){
					if (anns.indexOf(annotations[j]["displayID"]) == -1){
						console.log(annotations[j]["displayID"]);
						$("#" + annotations[j]["displayID"]).hide();
						annotations[j].tick.visible = false;
					}
				}
				view.draw();
				var showText = "Showing " + anns.length + " of " + annotations.length + " annotations";
				$('#filterText').text(showText);
				$('#filterText').show();
				break;
			}
		}
	}
	else{
		clearFilter();
	}	
	$('#link' + motifId).toggleClass('clicked').toggleClass('unclicked');
}

function clearFilter(){
	for (j = 0; j < annotations.length; j++){
		$("#" + annotations[j]["displayID"]).show();
		annotations[j].tick.visible = true;
	}
	view.draw();
	$('#filterText').text("No Annotations Match this Tag");
	$('#filterText').hide();
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
				valId = "#ann" + annotations[i]["displayID"];
				$(valId)[0].innerHTML = annotations[i]["text"];
			}
		}
	}
	$("#" + motifId).remove();
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

	var newElem = "<ul id='" + motifId + "'><a href='#' id='link"+ motifId +"'class='unclicked' onclick='filter("+ motifId + ")'>"+ motif.mName + "  " + "</a><span class='glyphicon glyphicon-remove remove-motif' onclick='deleteFunction("+motifId+")' aria-hidden='true'></span></ul>";

	$('#' + motifId).mouseover(function(){
		console.log("hello");
	})

	var mIndex = findMIndex(motif);
	var prevMIndex = mIndex - 1;

	if (prevMIndex >= 0) {
		console.log(motif.mName, prevMIndex, motifs[prevMIndex].mName, motifs[prevMIndex].timestamp)
		var prev = $('#motif-list').find('#' + motifs[prevMIndex].timestamp);
		prev.after(newElem);
	}
	else{ 
		$('#motif-list').find('#first-elem').after(newElem);
	}

	if (mIndex >= motifs.length)
		motifs.push(motif);
	else {
		motifs.splice(mIndex, 0, motif);
	}
}

function addInitialMotifs(){
	time = Date.now();
	motif1 = {mName:"formation-change", timestamp:time, ann:[]};
	addMotif(motif1, null);
	motif2 = {mName:"smooth-music", timestamp:time+1, ann:[]};
	addMotif(motif2, null);
	motif3 = {mName:"storyline", timestamp:time+2, ann:[]};
	addMotif(motif3, null);
	motif5 = {mName:"music-annotation", timestamp:time+4, ann:[]};
	addMotif(motif5,null);
	motif6 = {mName:"choreo-annotation", timestamp:time+5, ann:[]};
	addMotif(motif6, null);
}

