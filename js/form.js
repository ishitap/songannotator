$("#annForm").submit(function() {
	event.preventDefault();
	var timestamp = Math.floor($("audio")[0].currentTime);
	var text = $('input[name="text"]').val();
	var annotation = {timestamp: timestamp, text: text};
	displayAnnotation(annotation);
	getMotif(text, annotation);
	this.reset()
});
