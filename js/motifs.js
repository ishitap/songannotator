//motif -> {motif text, timestamp of addition, array of corresponding annotation IDs}
var motifs = [];

//Allows user to add motif to their collection of motifs
$("#motForm").submit(function() {
	event.preventDefault();
	var text = $('input[name="motText"]').val();
	var time = Date.now();
	addMotif({mName: text, timestamp: time, ann: []}, null);
	this.reset()
});

// Helper Function: Finds the right spot for the motif to be added within an alphabetically sorted array
function findMIndex(motif) {
	var index = motifs.length;
	for (i = 0; i < motifs.length; i++){
		if (motifs[i]["mName"] > motif.mName){
			index = i;
			break;
		}
	}
	console.log(index);
	return index;
}

//Adds Motif to the Table Display
function addMotif(motif, annotation) {
	for (i = 0; i < motifs.length; i++){
		if (motifs[i].mName == motif.mName){
			if (annotation){
				motifs[i].ann.push(annotation.displayID);
			}
			return;
		}
	}

	if(annotation){
		motif.ann.push(annotation.displayID);
	}

	motifId = motif.timestamp;	

	var tableRow = "<tr id='" + motifId + "'><td>" + motif.mName + "</td></tr>";

	var mIndex = findMIndex(motif);
	var prevMIndex = mIndex - 1;
	console.log(prevMIndex);

	if (prevMIndex >= 0) {
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

