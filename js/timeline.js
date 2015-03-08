paper.install(window);

var tickHeight = 10;
var totalLength = 400;
var yPos = 50;

//------

function setupPaper() {
	canvas = document.getElementById('timeline-canvas');
	totalLength = canvas.width;
	yPos = canvas.height/2;

	paper.setup(canvas);

	paperscope = paper;
	
	var base = new Path.Line(new Point(0, yPos), new Point(totalLength, yPos));
	base.strokeColor = 'black';
	view.draw();
}

function drawTick(seconds) {
	var audioDuration = $("audio")[0].duration;
	var x = seconds/audioDuration * totalLength;

	var tick = new Path.Line(new Point(x, yPos - tickHeight/2), new Point(x, yPos + tickHeight/2));
	tick.strokeColor = 'black';

	view.draw();

	return tick;
}

function removeTick(annotation) {
	var tick = annotation.tick;
	console.log(tick)
	if(tick)
		tick.remove();
	view.draw();
}