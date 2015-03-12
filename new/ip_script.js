paper.install(window);
var triangle;

function setupTicksCanvas() {
	$("#ticks-canvas").attr("width", $(window).width());
	$("#ticks-canvas").attr("height", 20);

	paper.setup("ticks-canvas");
	
	/* create the triangle stamp */
	var segments = [new Point(0, 16), new Point(8, 0), new Point(16, 16)];
	var path = new Path(segments)
	path.fillColor = "#96CA2D";
	triangle = new Symbol(path);
	path.remove();

	/* sampleTriangles */
	drawTriangle(0.3);
	drawTriangle(0.5);
	drawTriangle(0.1);
	var four = drawTriangle(0.2);

	highlightTriangle(four);

	view.draw();
}

function drawTriangleAt(position) {
	// var newTriangle = triangle.place(new Point(position, 8));
	var newTriangle = new PlacedSymbol(triangle, new Point(position, 8));
	newTriangle.fillColor = "blue"
	view.draw();
	return newTriangle;
}

function drawTriangle(fraction) {
	var position = fraction * view.size.width;
	return drawTriangleAt(position);
}

function highlightTriangle(triangle) {
	triangle.fillColor = "blue";
	console.log("yay")
	view.draw();
}

function unhighlightTriangle(triangle) {
	triangle.fillColor = "#96CA2D";
	view.draw();
}