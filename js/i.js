// Initialize
//CONSTANTS
var HELP_TITLE = "Todoo V1.4.6 Updates";
var EDIT_VIEW = "edit";
var ADD_VIEW = "add";
var CUSTOM_COLOR_VIEW = "custom";
var ONLY_COLOR_VIEW = "only";
//Stores
var MAIN_COLORS = new Array( '#999999', '#FF5353', '#FF800D', '#FFBE28', '#339933', '#25A0C5', '#A27AFE', '#FF73B9' );
var OPA_COLORS = new Array( '#AAAAAA', '#FF6565', '#FF8D26', '#FFC53E', '#48A348', '#3BAACB', '#AB88FE', '#FF81C0' );

//VIEW TYPES
var viewType = "add"; //add or edit
//var colorView = "custom";

//COLLECTIONS
//Stores the current todoo-type
var currentTodoo = {};
//Stores all todoos
var todoos = [];
//Stores all id of todoos for today
var todayTodoos = [];

//COOKIE VALUE
var showHideDone = 1;

var todayCount = 0;
var showByColor = new Array();

function initButtons(){	
	for(i = 0; MAIN_COLORS.length > i; i++){
		var btn_add = document.getElementById("add_btnColor"+i);
		btn_add.style.backgroundColor = MAIN_COLORS[i];
		
		var btn_color = document.getElementById("color"+(i));
		btn_color.style.backgroundColor = MAIN_COLORS[i];
		
		var btn = document.getElementById("btnColor"+(i));
		btn.style.backgroundColor = MAIN_COLORS[i];

		var btn_only = document.getElementById("btnColorOnly"+(i));
		btn_only.style.backgroundColor = MAIN_COLORS[i];
	}
	
	var color1 = document.getElementById('color0');
	var color2 = document.getElementById('color1');
	var color3 = document.getElementById('color2');
	var color4 = document.getElementById('color3');
	var color5 = document.getElementById('color4');
	var color6 = document.getElementById('color5');
	var color7 = document.getElementById('color6');
	var color8 = document.getElementById('color7');
	
	var btn1 = document.getElementById('btnColor0');
	var btn2 = document.getElementById('btnColor1');
	var btn3 = document.getElementById('btnColor2');
	var btn4 = document.getElementById('btnColor3');
	var btn5 = document.getElementById('btnColor4');
	var btn6 = document.getElementById('btnColor5');
	var btn7 = document.getElementById('btnColor6');
	var btn8 = document.getElementById('btnColor7');
	
	var btn_only1 = document.getElementById('btnColorOnly0');
	var btn_only2 = document.getElementById('btnColorOnly1');
	var btn_only3 = document.getElementById('btnColorOnly2');
	var btn_only4 = document.getElementById('btnColorOnly3');
	var btn_only5 = document.getElementById('btnColorOnly4');
	var btn_only6 = document.getElementById('btnColorOnly5');
	var btn_only7 = document.getElementById('btnColorOnly6');
	var btn_only8 = document.getElementById('btnColorOnly7');
	
	
	btn1.onclick = function(){ setColorView(0);  };
	btn2.onclick = function(){ setColorView(1); };
	btn3.onclick = function(){ setColorView(2); };
	btn4.onclick = function(){ setColorView(3); };
	btn5.onclick = function(){ setColorView(4); };
	btn6.onclick = function(){ setColorView(5); };
	btn7.onclick = function(){ setColorView(6); };
	btn8.onclick = function(){ setColorView(7); };
	
	color1.onmouseover = function(){ hover(0); btn_only1.style.display = 'inline'; };
	color2.onmouseover = function(){ hover(1); btn_only2.style.display = 'inline'; };
	color3.onmouseover = function(){ hover(2); btn_only3.style.display = 'inline'; };
	color4.onmouseover = function(){ hover(3); btn_only4.style.display = 'inline'; };
	color5.onmouseover = function(){ hover(4); btn_only5.style.display = 'inline'; };
	color6.onmouseover = function(){ hover(5); btn_only6.style.display = 'inline'; };
	color7.onmouseover = function(){ hover(6); btn_only7.style.display = 'inline'; };
	color8.onmouseover = function(){ hover(7); btn_only8.style.display = 'inline'; };
	
	color1.onmouseout = function(){ normal(0); btn_only1.style.display = 'none'; };
	color2.onmouseout = function(){ normal(1); btn_only2.style.display = 'none'; };
	color3.onmouseout = function(){ normal(2); btn_only3.style.display = 'none'; };
	color4.onmouseout = function(){ normal(3); btn_only4.style.display = 'none'; };
	color5.onmouseout = function(){ normal(4); btn_only5.style.display = 'none'; };
	color6.onmouseout = function(){ normal(5); btn_only6.style.display = 'none'; };
	color7.onmouseout = function(){ normal(6); btn_only7.style.display = 'none'; };
	color8.onmouseout = function(){ normal(7); btn_only8.style.display = 'none'; };
	
	btn_only1.onclick = function(){ setColorOnly(0); };
	btn_only2.onclick = function(){ setColorOnly(1); };
	btn_only3.onclick = function(){ setColorOnly(2); };
	btn_only4.onclick = function(){ setColorOnly(3); };
	btn_only5.onclick = function(){ setColorOnly(4); };
	btn_only6.onclick = function(){ setColorOnly(5); };
	btn_only7.onclick = function(){ setColorOnly(6); };
	btn_only8.onclick = function(){ setColorOnly(7); };
	
	for(i = 0; MAIN_COLORS.length > i; i++){
		var btn_add = document.getElementById("add_btnColor"+i);
		btn_add.style.backgroundColor = MAIN_COLORS[i];
		
		var btn_color = document.getElementById("color"+(i));
		btn_color.style.backgroundColor = MAIN_COLORS[i];		
		
		var btn = document.getElementById("btnColor"+(i));
		btn.style.backgroundColor = MAIN_COLORS[i];		

		var btn_only = document.getElementById("btnColorOnly"+(i));
		btn_only.style.backgroundColor = MAIN_COLORS[i];
	}
	
	initDatePicker();
	
	//details container
	var help = document.getElementById('help');
	help.addEventListener("click", function(e){ 
		menu(this.id);
	});
	var btn_options = document.getElementById('options');
	btn_options.addEventListener("click", function(e){ 
		window.open('options.html', '_blank');
	});
	var btn_all = document.getElementById('all');
	btn_all.addEventListener("click", function(e){ 
		menu(this.id);
	});
	var done = document.getElementById('done');
	done.addEventListener("click", function(e){ 
		menu(this.id);
	});
	var hide_done = document.getElementById('hide_done');
	hide_done.addEventListener("click", function(e){ 
		menu(this.id);
	});
	var btn_add = document.getElementById('add');
	btn_add.addEventListener("click", function(e){ 
		menu(this.id);
	});
	
	//ADD color picker
	var add_btnColor0 = document.getElementById('add_btnColor0');
	add_btnColor0.addEventListener("click", function(e){ setAddBG(0); });
	var add_btnColor1 = document.getElementById('add_btnColor1');
	add_btnColor1.addEventListener("click", function(e){ setAddBG(1); });
	var add_btnColor2 = document.getElementById('add_btnColor2');
	add_btnColor2.addEventListener("click", function(e){ setAddBG(2); });
	var add_btnColor3 = document.getElementById('add_btnColor3');
	add_btnColor3.addEventListener("click", function(e){ setAddBG(3); });
	var add_btnColor4 = document.getElementById('add_btnColor4');
	add_btnColor4.addEventListener("click", function(e){ setAddBG(4); });
	var add_btnColor5 = document.getElementById('add_btnColor5');
	add_btnColor5.addEventListener("click", function(e){ setAddBG(5); });
	var add_btnColor6 = document.getElementById('add_btnColor6');
	add_btnColor6.addEventListener("click", function(e){ setAddBG(6); });
	var add_btnColor7 = document.getElementById('add_btnColor7');
	add_btnColor7.addEventListener("click", function(e){ setAddBG(7); });
	
	//add form event handlers
	var datepicker = document.getElementById('datepicker');
	datepicker.addEventListener("change", function(e){ showClearDate(); });
	datepicker.setAttribute("readonly", "readonly");
	var btn_addForm = document.getElementById('btn_add');
	btn_addForm.addEventListener("click", function(e){ add(); });
	
	var todoo_header = document.getElementById('todoo_header');
	todoo_header.addEventListener("click", function(e){ toggleShowHide(); });
	
	var no_notif = document.getElementById("no_notif");
	no_notif.addEventListener("click", function(e){ showToday(); });
}

function initDatePicker(){
	var btn_clearDate = document.getElementById('btn_clearDate');
	var datepicker = document.getElementById('datepicker');
	
	datepicker.onchange = function(){
		if(datepicker.value != "")
			btn_clearDate.style.display = 'inline';
		else
			btn_clearDate.style.display = 'none';
	};
	
	btn_clearDate.onclick = function(){ 
		clearDate(); 
	};	
}
