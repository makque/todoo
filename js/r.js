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
	//var data = { "timeStamp": timeStamp, "title": todoo_title, "note": note, "color": color, "dueDate": dueDate, "isActive": 1 };
	todoos.push(row);
	var isShown = 1;
	var colorIndex = 0;
	
	for(i=0; MAIN_COLORS.length > i; i++){
		if(toRGBString(MAIN_COLORS[i]) == row.color){
			isShown = showByColor[i];
			colorIndex = i;
			break;
		}
	}
	
	//count all events today
	var dte = getFormattedDate(row);
	var isToday = false;
	
	var dateNode = document.createElement('input');
	dateNode.setAttribute('id', 'todoo_date'+row.timeStamp);
	dateNode.setAttribute('style', 'background-color: ' + row.color);
	dateNode.setAttribute('readonly', "readonly");		
	dateNode.value = dte.fdate;
	
	//if due date is today
	if(dte.today == row.dueDate){
		if(row.timeStamp=='2' || row.timeStamp=='3')
			dateNode.style.color = "#eeeeee";
		else
			dateNode.style.color = "black";
			
		dateNode.style.fontWeight = "bold";
		dateNode.value = "TODAY";
		isToday = true;
	
		if(row.isActive==1){
		todayTodoos.push(row.timeStamp);
		updateTodayCount();
		}
	}
	else{
		if(row.timeStamp=='2' || row.timeStamp=='3')
			dateNode.style.color = "white";
		else
			dateNode.style.color = "white";
			
		
		dateNode.style.fontWeight = "normal";
		var d = new Date();
		//if same month
		/*if(dte.month == getStrMonth(dte.today[0]+dte.today[1])){
			var today_day = dte.today[3]+dte.today[4];
			if( (dte.day - today_day) == 1){
				//dateNode.value = "TOMORROW";
			}
		}*/	
	}


	if(isShown == 1 || getCookie("showToday")==1){
		var right_container = document.getElementById('right_container');
		var displayNode = document.createElement('input');
			if(row.timeStamp=='2' || row.timeStamp=='3'){
				displayNode.setAttribute('style', "background:#000 repeat center; color: #eee;" + 
				"width: 600px; height: 80px; font-size: 1.3em; font-weight: bold; text-align: center; letter-spacing: 5px;");
			}
			else
				displayNode.setAttribute('style', 'background-color:'+row.color);
			displayNode.setAttribute('id', "todoo"+row.timeStamp);
			displayNode.setAttribute('type', 'button');
			
			if(row.dueDate != "")
				dateNode.style.display = 'block';
			else
				dateNode.style.display = 'none';
			
			//if( row.isActive == 1)
			//show done
			if( showHideDone == 1){
				if(row.isActive == 1){
					displayNode.setAttribute('class', 'todoo_title');
					dateNode.setAttribute('class', 'todoo_date');
				}
				else{
					displayNode.setAttribute('class', 'todoo_title done');
					dateNode.setAttribute('class', 'todoo_date done');
				}
			}
			else{//hide done
				if(row.isActive == 1){
					displayNode.setAttribute('class', 'todoo_title');
					dateNode.setAttribute('class', 'todoo_date');
				}
				else{
					displayNode.setAttribute('class', 'todoo_title');
					displayNode.style.display = 'none';
					dateNode.setAttribute('class', 'todoo_date');
					dateNode.style.display = 'none';
				}
			}
			
			//displayNode.setAttribute('class', 'todoo_title margin_todoo');
			var singleLine_title = row.title.replace(/\n/g, " ");
			displayNode.value = singleLine_title;
			
			
			var todooContainer = document.createElement('div');
			todooContainer.setAttribute('id', 'todooContainer'+row.timeStamp);
			todooContainer.setAttribute('class', 'margin_todoo');
			todooContainer.appendChild(displayNode);
			//if(row.dueDate != "" && row.isActive == 1)
			//if(row.isActive == 1)
			todooContainer.appendChild(dateNode);
		
		if(getCookie("showToday")==1){
			if(isToday==true){
				right_container.appendChild(todooContainer);
			}
		}
		else
			right_container.appendChild(todooContainer);				
		
		displayNode.onclick = function() {
			//535 //300
			viewType = EDIT_VIEW;
			var data = {};
			for(var i =0; todoos.length > i; i++){
				if(todoos[i].timeStamp == row.timeStamp){
					data = todoos[i];
					break;	
				}
			}
			var input_color = document.getElementById("todoo"+data.timeStamp);
			data.color = input_color.style.backgroundColor.toString();
			currentTodoo = data;
			
			setCookie("showHideAdd", "showAdd", 365);
			
			var option = document.getElementById('option');
			var add_container = document.getElementById('add_container');
			
			option.innerHTML = 'edit todoo';
			
			var txt_todoo = document.getElementById('txt_todoo');
			txt_todoo.style.height = "30px";
			if(row.timeStamp=='2' || row.timeStamp=='3')
				txt_todoo.value = HELP_TITLE;
			else{
				var singleLine_title = data.title.replace(/\n/g, " ");
				txt_todoo.value = singleLine_title;
			}
			
			var txt_note = document.getElementById('txt_note');
			txt_note.style.height = "420px";
			txt_note.value = data.note;
			
			var datepicker = document.getElementById('datepicker');
			datepicker.value = data.dueDate;
			
			var btn_clearDate = document.getElementById('btn_clearDate');
			if(data.dueDate != "")
				btn_clearDate.style.display = "inline";
			else
				btn_clearDate.style.display = "none";
				
			
			for(i=0; MAIN_COLORS.length > i; i++){
				if(toRGBString(MAIN_COLORS[i]) == currentTodoo.color){
					isShown = showByColor[i];
					colorIndex = i;
					break;
				}
			}
			
			var menu = document.getElementById('menu');					
			menu.setAttribute('open', 'open');
			setAddBG(colorIndex);
			
			var btn_add = document.getElementById('btn_add');					
			btn_add.style.display = 'none';
			
			var btn_done = document.getElementById('btn_done');	
			var btn_undo = document.getElementById('btn_undo');		
			var btn_delete = document.getElementById('btn_delete');					
			if(data.isActive == 1){
				btn_done.style.display = 'inline';
				btn_undo.style.display = 'none';
				btn_delete.style.display = 'none';
			}
			else{
				btn_done.style.display = 'none';
				btn_undo.style.display = 'inline';
				btn_delete.style.display = 'inline';
			}
			
			btn_done.onclick = function(){
				data.isActive = 0;
				/*todoos.push(data);*/
				var elem = document.getElementById("todoo"+data.timeStamp);
				var elemdate = document.getElementById("todoo_date"+data.timeStamp);
				
				if(row.timeStamp=='2' || row.timeStamp=='3')
					elem.setAttribute('style', "background: url('bg/default_bg.png') #333333 repeat center; color:White;");
				else
					elem.setAttribute('style', 'background-color:'+row.color);						
					
				update(data);
				if(showHideDone == 1){
					elem.setAttribute('class', 'todoo_title done margin_todoo');
					elemdate.setAttribute('class', 'todoo_date done');
				}
				else{
					elem.parentNode.removeChild(elem);
					elemdate.parentNode.removeChild(elemdate);
					window.location.href='index.html';
				}
				
				btn_undo.style.display = 'inline';
				btn_delete.style.display = 'inline';
				btn_done.style.display = 'none';
			};
			
			btn_undo.onclick = function(){
				data.isActive = 1;
				/*todoos.push(data);*/
				var elem = document.getElementById("todoo"+data.timeStamp);
				var elemdate = document.getElementById("todoo_date"+data.timeStamp);
				
				elem.setAttribute('class', 'todoo_title margin_todoo');
				elemdate.setAttribute('class', 'todoo_date');
				if(row.timeStamp=='2' || row.timeStamp=='3')
					elem.setAttribute('style', "background: url('bg/default_bg.png') #333333 repeat center; color:White;");
				else
					elem.setAttribute('style', 'background-color:'+row.color);
				btn_undo.style.display = 'none';
				btn_delete.style.display = 'none';
				btn_done.style.display = 'inline';
				update(data);
				//setAdd();
			};
			
			initDatePicker();
			
			btn_delete.onclick = function(){
				todoo.indexedDB.deleteTodo(data.timeStamp);
			};

			txt_todoo.style.height = txt_todoo.scrollHeight+'px';
			txt_note.style.height = txt_note.scrollHeight+'px';

			txt_todoo.onchange = function(){ data.title = txt_todoo.value.trim(); /*todoos.push(data);*/ update(data); };
			txt_todoo.onkeyup = function(){ data.title = txt_todoo.value.trim(); /*todoos.push(data);*/ update(data); };
			txt_note.onchange = function(){ data.note = txt_note.value.trim(); /*todoos.push(data);*/ update(data); };
			txt_note.onkeyup = function(){ data.note = txt_note.value.trim(); /*todoos.push(data);*/ update(data); };

			var btn_clearDate = document.getElementById('btn_clearDate');
			var datepicker = document.getElementById('datepicker');
	
			datepicker.onchange = function(){
				if(datepicker.value != "")
					btn_clearDate.style.display = 'inline';
				else
					btn_clearDate.style.display = 'none';
				if(viewType = "edit"){
					data.dueDate = datepicker.value; 
					/*todoos.push(data);*/ 
					update(data);
				}
			};
	
//datepicker.onkeyup = function(){ data.dueDate = datepicker.value; todoos.push(data); update(data); };
	
			btn_clearDate.onclick = function(){ 
				clearDate(); 
				if(viewType = "edit"){
					data.dueDate = datepicker.value; /*todoos.push(data);*/
					update(data);
				}
			};	
			
			window.scrollTo(0,0);
		};
	}
}
