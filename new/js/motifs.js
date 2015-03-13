//motif -> {motif text, timestamp of addition, array of corresponding annotation IDs}
var motifs = [];

function findMotif(motifID) {
	var index = -1;
	motifs.some(function (e, i, a) {
			if(Number(e.timestamp) == Number(motifID)) {
				index = i;
				return true;
			}
			return false;
		});
	return index;
}

function filterAll(motifBoxes){
	clearFilter();
	filterAnns = new Set();
	for (i = 0; i < motifBoxes.length; i++){
		idLength = motifBoxes[i].id.length;
		motifId = motifBoxes[i].id.substring(0,idLength-9);
		ind = findMotif(motifId);
		anns = motifs[ind].ann;
		for (j = 0; j < anns.length; j++){
			filterAnns.add(anns[j]);
		}
	}
	if (filterAnns.size == 0){
		$('#filter-text').show();
	}
	else{
		console.log("THERE IS SOMETHING TO ACTUALLY BE FILTERED", filterAnns);
		for (i = 0; i < annotations.length; i++){
			annotation = annotations[i];
			if (!filterAnns.has(annotation.displayID)){
				$("#"+annotation.displayID).hide();
				annotation.tick.visible = false;
			}
		}
		view.draw();
		var showText = "Showing " + filterAnns.size + " of " + annotations.length + " annotations";
		$('#filter-text').text(showText);
		$('#filter-text').show();
	}
}

function clearFilter(){
	for (j = 0; j < annotations.length; j++){
		$("#" + annotations[j]["displayID"]).show();
		annotations[j].tick.visible = true;
	}
	view.draw();
	$('#filter-text').text("No Annotations Match this Tag");
	$('#filter-text').hide();
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
function deleteFunction(motifId, modifyAnnotation){
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
			if (aMot > -1 && modifyAnnotation){
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

	if(motifs.length == 0) {
		$("#motif-display .empty-text").show();
	}
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

	var newElem = "<ul id='" + motifId + "'>" + "<input type='checkbox' class='motifBox' id='" + motifId + "-checkbox' name='cc' />" + "<label class='motifLabel' for='" + motifId + "-checkbox'><span class='checkbox-span'></span>#" + motif.mName + "  " + "<span class='glyphicon glyphicon-remove remove-motif' onclick='deleteFunction("+motifId+", true)' aria-hidden='true'></span></label></ul>";


	var mIndex = findMIndex(motif);
	var prevMIndex = mIndex - 1;

	if (prevMIndex >= 0) {
		// console.log(motif.mName, prevMIndex, motifs[prevMIndex].mName, motifs[prevMIndex].timestamp)
		var prev = $('#motif-list').find('#' + motifs[prevMIndex].timestamp);
		prev.after(newElem);
	}
	else{ 
		$('#motif-list').find('#first-elem').after(newElem);
	}

	$('#' + motifId).mouseover(function(){
		$(this).find(".remove-motif").show();
	});

	$('#' + motifId).mouseout(function(){
		$(this).find(".remove-motif").hide();
	})

	if (mIndex >= motifs.length)
		motifs.push(motif);
	else {
		motifs.splice(mIndex, 0, motif);
	}

	$(".motifBox").change(function(){
		toFilter = $('input:checked');
		if (toFilter.length > 0){
			filterAll(toFilter);
		}
		else{
			clearFilter();
		}
	});

	$("#motif-display .empty-text").hide();
}

function addInitialMotifs(){
	time = Date.now();
	motif1 = {mName:"formation", timestamp:time, ann:[]};
	addMotif(motif1, null);
	motif2 = {mName:"inspiration", timestamp:time+1, ann:[]};
	addMotif(motif2, null);
	motif3 = {mName:"theme-integration", timestamp:time+2, ann:[]};
	addMotif(motif3, null);
	motif5 = {mName:"music", timestamp:time+4, ann:[]};
	addMotif(motif5,null);
	motif6 = {mName:"transition", timestamp:time+5, ann:[]};
	addMotif(motif6, null);
	motif7 = {mName:"footwork", timestamp:time+6, ann:[]};
	addMotif(motif7, null);
}

function addMotifFiltering(){
	$(".motifBox").change(function(){
		toFilter = $('input:checked');
		if (toFilter.length > 0){
			filterAll(toFilter);
		}
		else{
			clearFilter();
		}
	});
}

