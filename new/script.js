function secondsToTime(seconds) {
	var min = Math.floor(seconds / 60);
	var sec = seconds % 60;
	if (sec < 10) {
		sec = "0" + sec;
	}
	return min + ":" + sec;
}

function timeToSeconds(time) {
	var sections = time.split(":");
	return (Number(sections[0]) * 60) + Number(sections[1]);
}