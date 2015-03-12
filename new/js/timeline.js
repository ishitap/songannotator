paper.install(window);
var triangle;
var totalTime = 0;

function setupTicksCanvas(seconds) {
	totalTime = seconds;
	$("#ticks-canvas").attr("width", $(window).width());
	$("#ticks-canvas").attr("height", 20);
	paper.setup("ticks-canvas");
	view.draw();
}

function drawTickAt(position) {
	var segments = [new Point(position-8, 16), new Point(position, 0), new Point(position+8, 16)]
	var path = new Path(segments);
	path.fillColor = "#96CA2D";
	view.draw();

	return path;
}

function drawTick(seconds) {
	var position = seconds/totalTime * view.size.width;
	return drawTickAt(position);
}

function highlightTick(tick) {
	tick.fillColor = "blue";
	view.draw();
}

function unhighlightTick(tick) {
	tick.fillColor = "#96CA2D";
	view.draw();
}