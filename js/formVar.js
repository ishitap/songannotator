testArray = []
annotation = {}

document.getElementById("addButton").onclick = function(){
	formElems = document.getElementById("annForm").elements;
	time = formElems[0].value;
	text = formElems[1].value;
	annotation.timestamp = time;
	annotation.text = text;
	displayAnnotation(annotation)
};

