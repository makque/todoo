//renders the background image
function renderBG(row){
	var isRepeat = "";
	var filename = "";
	isRepeat = row.isRepeat;
	filename = row.bg;

	//gets the directory
	var fullDir = document.getElementById('image1').src;
	var absoluteDir = fullDir.split("default_bg.png", 1).toString();
	var folderName = absoluteDir.slice(19);

	if (isRepeat == 0) {
		//document.body.style.background = "url('" + absoluteDir + filename + "')  repeat center center fixed";
		document.body.style.webkitBackgroundSize = "cover";
	}
	else {
		//document.body.style.background = "url('" + absoluteDir + filename + "')  repeat center center fixed";
		document.body.style.webkitBackgroundSize = "";
	}
}

function renderTodo(row) {
	if(row.timeStamp){
		//old version - from indexedDB
		//convert indexedDB row to localStorage row

	}
	else if(row.get("title")){
		//new version - localStorage
	}

	render(row);
}
