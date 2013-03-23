// IndexedDB
var todoo = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}

todoo.indexedDB = {};
todoo.indexedDB.db = null;

todoo.indexedDB.onerror = function(e) {
	console.log(e);
};

//Open the DB
todoo.indexedDB.open = function() {
	var request = indexedDB.open("todoos");
	request.onsuccess = function(e) {   
		var v = "3.0";
		todoo.indexedDB.db = e.target.result;
		var db = todoo.indexedDB.db;

		// We can only create Object stores in a setVersion transaction;
		if (v!= db.version) {
			var setVrequest = db.setVersion(v);

			// onsuccess is the only place we can create Object Stores
			setVrequest.onfailure = todoo.indexedDB.onerror;
			setVrequest.onsuccess = function(e) {
				if(db.objectStoreNames.contains("todoo")) {
					db.deleteObjectStore("todoo");}
				var store = db.createObjectStore("todoo", {keyPath: "timeStamp"});
				e.target.transaction.oncomplete = function(){
					todoo.indexedDB.getAllTodoItems();
				};
			};
		}
		else {
			todoo.indexedDB.getAllTodoItems();
		}
	};

	request.onfailure = todoo.indexedDB.onerror;
}

//Define DB addTodo()
todoo.indexedDB.addTodo = function(data) {
	var db = todoo.indexedDB.db;
	var trans = db.transaction(["todoo"], "readwrite");
	var store = trans.objectStore("todoo");

	var request = store.put(data);

	request.onsuccess = function(e) {
		//todoo.indexedDB.getAllTodoItems();
	};

	request.onerror = function(e) {
		console.log("Error Adding: ", e);
		alert("Error Adding: " + e);
	};
};

//Define DB deleteTodo()
todoo.indexedDB.deleteTodo = function(id) {
	var db = todoo.indexedDB.db;
	var trans = db.transaction(["todoo"], "readwrite");
	var store = trans.objectStore("todoo");

	var request = store.delete(id);

	request.onsuccess = function(e) {
		window.location.href='index.html';
		//alert('delete ' + id);
	};

	request.onerror = function(e) {
		console.log("Error Adding: ", e);
	};
};

//Define DB getAllTodoItems()
todoo.indexedDB.getAllTodoItems = function() {
	var db = todoo.indexedDB.db;
	var trans = db.transaction(["todoo"], "readwrite");
	var store = trans.objectStore("todoo");

	// Get everything in the store;
	var keyRange = IDBKeyRange.lowerBound(0);
	var cursorRequest = store.openCursor(keyRange);

	cursorRequest.onsuccess = function(e) {
		var result = e.target.result;
		if(!!result == false){
			return;
		}              
		//checks whether it is an event or the bg object
		if(result.value.bg == null){
			renderTodo(result.value);
		}
		else if(result.value.bg != null){
			//renderBG(result.value);
		}
						
		result.continue();
	};

	document.getElementById('right_container').innerHTML = "";
	cursorRequest.onerror = todoo.indexedDB.onerror;
};

//Define DB getAllTodoItems()
todoo.indexedDB.countToday = function() {
	todayCount = 0;
	var db = todoo.indexedDB.db;
	var trans = db.transaction(["todoo"], "readwrite");
	var store = trans.objectStore("todoo");

	// Get everything in the store;
	var keyRange = IDBKeyRange.lowerBound(0);
	var cursorRequest = store.openCursor(keyRange);

	cursorRequest.onsuccess = function(e) {
		var result = e.target.result;
		if(!!result == false){
			return;
		}              
		//checks whether it is an event or the bg object
		if(result.value.bg == null){
			var data = result.value;
			var dte = getFormattedDate(data);
			
			if(dte.today == data.dueDate)
				todayCount+=1;
				
			alert(todayCount);
		}
		else if(result.value.bg != null){
			//renderBG(result.value);
		}
						
		result.continue();
	};

	document.getElementById('right_container').innerHTML = "";
	cursorRequest.onerror = todoo.indexedDB.onerror;
};