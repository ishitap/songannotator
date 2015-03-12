paper.install(window);

var tickHeight = 10;
var totalLength = 807;
var yPos = 50;

//------

function setupPaper() {
	canvas = $("#timeline-canvas")
	canvas.attr("width", $(window).width());
	totalLength = canvas.width();
	yPos = canvas.height()/2;

	// console.log(totalLength)
	// console.log(yPos)

	paper.setup("timeline-canvas");

	paperscope = paper;
	
	var base = new Path.Line(new Point(0, yPos), new Point(totalLength, yPos));
	base.strokeColor = 'black';
	view.draw();
}

function drawTick(seconds) {
  var audioDuration = wavesurfer.getDuration();
  var x = seconds/audioDuration * totalLength;

  var tick = new Path.Line(new Point(x, yPos - tickHeight/2), new Point(x, yPos + tickHeight/2));
  tick.strokeColor = 'black';

  view.draw();

  return tick;
}

function removeTick(annotation) {
	var tick = annotation.tick;
	if(tick)
		tick.remove();
	view.draw();
}

function highlightTick(annotation) {
	annotation.tick.strokeColor = '#d6e9c6';
	view.draw();
}

function unhighlightTick(annotation) {
	annotation.tick.strokeColor = 'black';
	view.draw();
}