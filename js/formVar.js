document.getElementById("addButton").onclick = function(){
	formElems = document.getElementById("annForm").elements;
	time = formElems[0].value;
	text = formElems[1].value;
	var annotation = {timestamp:time, text:text};
	displayAnnotation(annotation)
};

