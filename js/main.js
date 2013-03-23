function init() {
	todoo.indexedDB.open();
	initButtons();
	initBG();
	setShowHideAddCookie();
	setShowHideByColors();
	document.getElementById('right_container').innerHTML = "";
	renderByColors();
	setShowHideDone();
	getIsNotifRead();
	
	$( "#datepicker" ).datepicker();
	
	//snow effect
	/*$(document).snowfall();
	$(document).snowfall('clear');
	$(document).snowfall({round : true, minSize: 1, maxSize:3});*/
	
	//analytics
	/*var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-30199496-1']);
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();*/
}

//setCookie("isNotifRead", 1, 365);
function getIsNotifRead(){
	if(getCookie("isNotifRead") == "1"){
		//do nothing
	}
	else{
		setCookie("isNotifRead", "0", 365);
		var help = document.getElementById("help");
		help.style.background = "url('images/help_unread.png')";
	}
}

function setShowHideByColors(){
	if(getCookie("showHideByColors") != null){
		ck = getCookie("showHideByColors").split(",");
		if(ck != null && ck != ""){
			for(i=0;ck.length>i;i++){        			
				if(ck[i] == '1')
					showByColor[i] = ck[i];
				else
					showByColor[i] = '0';
			}
			var newValue = showByColor[0]+
				","+showByColor[1]+
				","+showByColor[2]+
				","+showByColor[3]+
				","+showByColor[4]+
				","+showByColor[5]+
				","+showByColor[6]+
				","+showByColor[7];
			setCookie("showHideByColors", newValue, 365);
			//setCookie("showToday", "0", 365);
		}
	}
	else{
		if(isCookieEnabled() == true){
			setCookie("showHideByColors", "1,0,1,0,0,1,1,1", 365);
		//setCookie("showToday", "0", 365);
		window.location.reload();
	}
	}
}

function setShowHideDone(){
	var cookieShowHideAdd = getCookie("showHideDone");
	
	if(cookieShowHideAdd != null && cookieShowHideAdd != ""){
		if(cookieShowHideAdd == "1")
			showDone();
		else{
			hideDone();
		}
	}
	else{
		setCookie("showHideDone", "0", 365);
		hideAdd();
	}
}

function setShowHideAddCookie(){
	var cookieShowHideAdd = getCookie("showHideAdd");
	
	if(cookieShowHideAdd != null && cookieShowHideAdd != ""){
		if(cookieShowHideAdd == "showAdd")
			showAdd();
		else{
			hideAdd();
		}
	}
	else{
		setCookie("showHideAdd", "hideAdd", 365);
		hideAdd();
	}
}

function toggleShowHide(){
	var cookieShowHideAdd = getCookie("showHideAdd");
	
	if(cookieShowHideAdd != null && cookieShowHideAdd != ""){
		if(cookieShowHideAdd == "showAdd")
			setCookie("showHideAdd", "hideAdd", 365);
		else
			setCookie("showHideAdd", "showAdd", 365);
	}
	else{
		setCookie("showHideAdd", "hideAdd", 365);
		hideAdd();
	}
}

function renderByColors(){
	//set Button height
	for(i=0;showByColor.length>i;i++){
		if(showByColor[i] == 1)
			document.getElementById("btnColor"+(i)).style.height = "20px";
		else
			document.getElementById("btnColor"+(i)).style.height = "10px";
	}

	for(i=0;todoos.length>i;i++){
		for(j=0;MAIN_COLORS.length>j;j++){
			if(todoos[i].color == toRGBString(MAIN_COLORS[i])){
				if(showByColor[i] == 1){
					document.getElementById('mainTodoo'+todoos[i].timeStamp).style.display = "block";
				}
				else
					document.getElementById('mainTodoo'+todoos[i].timeStamp).style.display = "none";
			}
		}				
	}
}

function setColorOnly(index){
	var newValue = "";
	for(var i=0; 8 > i; i++){
		if(i == index)
			newValue+= '1';
		else
			newValue+='0';
		
		if(i!=7)
			newValue+=',';	
	}
	setCookie("showHideByColors", newValue, 365);
	setCookie("showToday", "0", 365);
	window.location.reload();
}

function setColorView(index){
	if(showByColor[index] == 1){
		showByColor[index] = 0;
	}
	else{
		showByColor[index] = 1;
	}
	
	var newValue = showByColor[0]+
		","+showByColor[1]+
		","+showByColor[2]+
		","+showByColor[3]+
		","+showByColor[4]+
		","+showByColor[5]+
		","+showByColor[6]+
		","+showByColor[7];
	setCookie("showHideByColors", newValue, 365);
	setCookie("showToday", "0", 365);
	window.location.reload();
}

function updateTodayCount(){
	var count = 0;
	//updates todoo in the collection
			//alert("count: "+todoos.length);
	for(var i=0; i<todoos.length; i++){
		var dte = getFormattedDate(todoos[i]);
		if(dte.today==todoos[i].dueDate && todoos[i].isActive == 1){
			//alert(todoos[i].title);
			count++;
		}
	}
	
	var no_notif = document.getElementById("no_notif");
	var events_str = document.getElementById("events_str");
	if(count==0)
		no_notif.innerHTML = "no";
	else{
		no_notif.innerHTML = count;
		if(count==1)
			events_str.innerHTML = "event";
	}
}

function update(data) {
	var todoo_title = txt_todoo.value.trim();
	var note = txt_note.value.trim();
	var dueDate = new Date();
	dueDate = datepicker.value;
	//validate that title is not empty
	if(todoo_title != ""){
		//if an announcement
		if(data.timeStamp!='2')
			var color = add_container.style.backgroundColor.toString();
		var timeStamp = new Date().getTime();
		var data = { "timeStamp": data.timeStamp, "title": todoo_title, "note": note, "color": color, "dueDate": dueDate, "isActive": data.isActive };
		todoo.indexedDB.addTodo(data);
		
		//updates todoo in the collection
		for(var i=0; i<todoos.length; i++){
			if(data.timeStamp == todoos[i].timeStamp){
				todoos[i] = data;
				break;
			}
		}
		
		var displayNode = document.getElementById('todoo'+data.timeStamp);
		var singleLine_title = todoo_title.replace(/\n/g, " ");
		var dte = getFormattedDate(data);
		displayNode.value = singleLine_title;
		displayNode.style.backgroundColor = data.color;
		
		var dateNode = document.getElementById('todoo_date'+data.timeStamp);
		//if date is not empty
		if(data.dueDate.length != 0){
			displayNode.style.display = 'block';
			dateNode.style.display = 'block';
			dateNode.style.backgroundColor = data.color;
			dateNode.value = dte.fdate;
			var isToday = false;
			
			//if date is today
			if(dte.today == data.dueDate){
				dateNode.style.color = "black";
				dateNode.style.fontWeight = "bold";
				dateNode.value = "TODAY";
				isToday = true;
			}
			//if not today
			else{
				dateNode.style.color = "white";
				dateNode.style.fontWeight = "normal";
			}
			
			if(data.isActive==0){
			}
			
			if(getCookie("showToday")==1){
				if(isToday==false){
					displayNode.style.display = 'none';
					dateNode.style.display = 'none';
				}
			}
		}
		else{
			dateNode.style.display = 'none';
			if(getCookie("showToday")==1){
				displayNode.style.display = 'none';
			}
		}

		currentTodoo = data;
		updateTodayCount();
	}
	else
		txt_todoo.placeholder = "Enter a todoo first.";
}

function setDatePicker(datepickerId){
	$(document).ready(function(){
		$(datepickerId).datepicker();
	});
}

function initBG(){
	var primColor = "#1D1D1D";
	var secColor = "#999999";
	add_container.style.backgroundColor = secColor;
}

function showAdd(){
	setDefaultColor();
	var txt_todoo = document.getElementById('txt_todoo');
	txt_todoo.focus();
	var menu = document.getElementById('menu');
	menu.setAttribute('open', 'open');
}

function hideAdd(){
	setDefaultColor();
	initBG();
}

function showDone(){
	btn_hide_done = document.getElementById('hide_done');
	btn_hide_done.style.display = 'inline';
	btn_done = document.getElementById('done');
	btn_done.style.display = 'none';
	
	showHideDone = 1;
}

function hideDone(){
	btn_hide_done = document.getElementById('hide_done');
	btn_hide_done.style.display = 'none';
	btn_done = document.getElementById('done');
	btn_done.style.display = 'inline';
	
	showHideDone = 0;
}

function setDefaultColor(){
	setAddBG(0);
}

function setAddBG(index){
	var btn = document.getElementById("add_btnColor"+index);
	var color = btn.style.backgroundColor;
	add_container.style.backgroundColor = color;			
	var colorOpa = OPA_COLORS[index];	
	txt_todoo.style.backgroundColor = color;
	txt_todoo.onfocus = function(){ txt_todoo.style.backgroundColor = colorOpa; };
	txt_todoo.onblur = function(){ txt_todoo.style.backgroundColor = color; };
	txt_note.style.backgroundColor = color;
	datepicker.style.backgroundColor = colorOpa;
	btn_clearDate.style.color = colorOpa;
	btn_add.style.color = colorOpa;
	
	var btn_done = document.getElementById('btn_done');
	btn_done.style.color = colorOpa;
	
	var btn_delete = document.getElementById('btn_delete');
	btn_delete.style.color = colorOpa;
		
	var btn_undo= document.getElementById('btn_undo');
	btn_undo.style.color = colorOpa;
	
	if(viewType == EDIT_VIEW && !(currentTodoo.timeStamp=='2' || currentTodoo.timeStamp=='3') )
		update(currentTodoo);
}

function setCookie(key, value, exdays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=key + "=" + c_value;
}

function getCookie(key){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==key){
			return unescape(y);
		}
	}
}

function showToday(){
	//hide all colors
	var newValue = "0,0,0,0,0,0,0,0";
	setCookie("showHideByColors", newValue, 365);
	//set cookie to show today
	setCookie("showToday", "1", 365);
	window.location.reload();
}

function add() {
	var todoo_title = txt_todoo.value.trim();
	var note = txt_note.value.trim();
	var dueDate = new Date();
	dueDate = datepicker.value;
	if(todoo_title != ""){
		var color = add_container.style.backgroundColor.toString();
		var timeStamp = new Date().getTime();
		var data = { "timeStamp": timeStamp, "title": todoo_title, "note": note, "color": color, "dueDate": dueDate, "isActive": 1 };
		todoo.indexedDB.addTodo(data);
		renderTodo(data);
	}
	else
		txt_todoo.placeholder = "Enter a todoo first.";
}

function toRGBString(string_hex){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(string_hex);
	var r = parseInt(result[1], 16);
	var g = parseInt(result[2], 16);
	var b = parseInt(result[3], 16);
	return "rgb("+r+", "+g+", "+b+")";
}

function setHelp(){
	//hide all first
	setCookie("showHideByColors", "0,0,0,0,0,0,0,0", 365);
	//var title="Thank you for downloading Todoo! Click this to see the updates.";
	var title="Click here to get started!";
	var note="**********************\n"+
	"Version 1.4.6 *NEW*\n"+
	"*Added today notification display and view. Just click on the number of today's event to view them.\n";
	note+="**********************\n\n"+
	"FEATURES\n"+
	"*ADD TODOOS:\n"+
	">Tasks\n"+
	">Notes\n"+
	">Deadlines\n"+
	">Reminders\n"+
	">Scribbles\n"+
	">etc.\n\n"+
	"*VIEWS:\n"+
	">Show todoos by color.\n"+
	">Show active and done todoos.\n\n"+
	"*OTHERS:\n"+
	">Include dates.\n"+
	">Mark todoos as done or undo it.\n"+
	">Delete 'only' done todoos.\n"+
	">This is an offline application 'for now'.\n\n"+
	"*All data is stored in your device.\n";
	note+="____________________________\n\n"+
	"More updates coming soon!"+"\n\n#Please make sure to enable your cookies."+
	"\n\nBUGS? FEEDBACKS? SUGGESTIONS?\n\nappsbymakque\n@gmail.com"+
	"\n\nTo delete this, click \'set as done\' then \'delete\'";
	var color=toRGBString("#000000");
	var d = new Date();
		var t_m = (d.getMonth()+1).toString();
	var t_d = d.getDate().toString();
	
	//Change '1' to '01'
	if(t_m.length == 1)
		t_m = "0"+t_m;
	
	if(t_d.length == 1)
		t_d = "0"+t_d;
	
	var today = t_m+"/"+t_d+"/"+d.getFullYear();
	
	var data = { "timeStamp": '2', "title": title, "note": note, "color": color, "dueDate": today, "isActive": 1 };
	setCookie("isNotifRead", 1, 365);
	todoo.indexedDB.addTodo(data);   
	window.location.reload();         
}

function getFormattedDate(row){
	var d = new Date();
	var mn = getStrMonth(row.dueDate[0]+row.dueDate[1]);
	var dy = row.dueDate[3]+row.dueDate[4];
	var yr = row.dueDate[6]+row.dueDate[7]+row.dueDate[8]+row.dueDate[9];
	
		
	var t_m = (d.getMonth()+1).toString();
	var t_d = d.getDate().toString();
	
	//Change '1' to '01'
	if(t_m.length == 1)
		t_m = "0"+t_m;
	
	if(t_d.length == 1)
		t_d = "0"+t_d;
	
	var today = t_m+"/"+t_d+"/"+d.getFullYear();
	
	var dte = {};
	dte.fdate =  mn + " " + dy + ", " + yr;
	dte.today = today;
	dte.month = mn;
	dte.day = dy;
	dte.year = yr;
	return  dte;
}

function hover(id){
	var btn = document.getElementById("btnColor"+(id));
	if(showByColor[id] == 0)
	btn.style.height= "20px";
}

function normal(id){
	var btn = document.getElementById("btnColor"+(id));
	if(showByColor[id] == 0)
		btn.style.height= "10px";
}

function menu(id){
	switch(id){
		case 'help':
			setHelp();
			setCookie("showToday", "0", 365);
			break;
		case 'all':
			setCookie("showHideByColors", "1,1,1,1,1,1,1,1", 365);
			setCookie("showToday", "0", 365);
			window.location.reload();
			break;
		case 'add':
			viewType = "add";
			window.location.href='index.html';
			break;
		case 'done':
			setCookie("showHideDone", "1", 365);
			window.location.href='index.html';
			break;
		case 'hide_done':
			setCookie("showHideDone", "0", 365);
			window.location.href='index.html';
			break;
		case 'sync':
			//auth();
			setSync();
			break;
	}
}		

function setAdd(){
//window.location.href='index.html';
setAddBG(0);
currentTodoo = "";
var option = document.getElementById('option');
var add_container = document.getElementById('add_container');

option.innerHTML = 'add todoo';
	
var txt_todoo = document.getElementById('txt_todoo');
txt_todoo.style.height = "100px";
txt_todoo.value = "";
	
var txt_note = document.getElementById('txt_note');
txt_note.style.height = "420px";
txt_note.value = "";
		
var datepicker = document.getElementById('datepicker');
datepicker.value = "";
			
var btn_clearDate = document.getElementById('btn_clearDate');
btn_clearDate.style.display = "none";

var btn_add = document.getElementById('btn_add');
btn_add.style.display = "inline";

var btn_done = document.getElementById('btn_done');
btn_done.style.display = "none";
}

function isCookieEnabled(){
var test = setCookie("test", "test", 1);
var isEnabled;
if(test == "test")
	isEnabled = true;
else
	isEnabled = false;

setCookie("test", "", -1);

return isEnabled;
}

function showClearDate(){
//alert(datepicker.value);
if(datepicker.value != ""){
	btn_clearDate.style.display = "inline";
	datepicker.style.width = "150px";
}
}

function clearDate(){
	datepicker.value = "";
	btn_clearDate.style.display = "none";
	datepicker.style.width = "150px";
}

function auth() {
	var config = {
	  'client_id': '216550122037-0gp9mtrqkifir7tmefdlc76qoaj6524m.apps.googleusercontent.com',
	  'scope': 'https://www.googleapis.com/auth/urlshortener',
	  'secret': '-pcgFwMlBIJ0Zz-PYaqO4gHJ',
	  'redirect_uri': 'http://localhost'
	};
	gapi.auth.authorize(config, function() {
	  alert('login complete');
	  alert(gapi.auth.getToken());
	  setSync();
	});
}

function setSync(){
	//gapi.client.load('tasks', 'v1', addTask);
	gapi.client.load('plus', 'v1', addTask);
}

function addTask(){
	/*var request = gapi.client.urlshortener.url.get({
	  'shortUrl': 'http://goo.gl/fbsS'
	});
	request.execute(function(response) {
	  alert("response: " + response.longUrl);
	});*/
	gapi.client.setApiKey('AIzaSyDZ6mgergvwA-UPpUu5Q5THyyDjPkqE5W0');
	var request = gapi.client.plus.activities.search({'query': 'Google+', 'orderBy': 'best'});
	request.execute(handleResp);
}

function handleResp(resp){
	//alert(resp.length);
	//rsp = resp.getItems();
	
	//alert(resp.length + " " + resp.size + " " + resp.count + " " + resp.);
}

function getStrMonth(monthNum){
	var m = "";
	switch(monthNum){
		case '01': m="JAN"; break;
		case '02': m="FEB"; break;
		case '03': m="MAR"; break;
		case '04': m="APR"; break;
		case '05': m="MAY"; break;
		case '06': m="JUN"; break;
		case '07': m="JUL"; break;
		case '08': m="AUG"; break;
		case '09': m="SEP"; break;
		case '10': m="OCT"; break;
		case '11': m="NOV"; break;
		case '12': m="DEC"; break;
		default: m=""; break;
	}
	return m;
}
window.onload = init;

