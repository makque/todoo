// JavaScript Document
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
                var v = "1.99";
                todoo.indexedDB.db = e.target.result;
                var db = todoo.indexedDB.db;

                // We can only create Object stores in a setVersion transaction;
                if (v!= db.version) {
                    var setVrequest = db.setVersion(v);

                    // onsuccess is the only place we can create Object Stores
                    setVrequest.onerror = todoo.indexedDB.onerror;
                    
                    setVrequest.onsuccess = function(e) {
                        if(db.objectStoreNames.contains("todoo")) {
                            db.deleteObjectStore("todoo");
                        }

                        var store = db.createObjectStore("todoo", {keyPath: "timeStamp"});

                        todoo.indexedDB.getAllTodoItems();
                    };
                }
                else {
                    todoo.indexedDB.getAllTodoItems();
                }
            };

            request.onerror = todoo.indexedDB.onerror;
        }

        //Define DB addTodo()
        todoo.indexedDB.addTodo = function(data) {
            var db = todoo.indexedDB.db;
            var trans = db.transaction(["todoo"], IDBTransaction.READ_WRITE);
            var store = trans.objectStore("todoo");

            var request = store.put(data);

            request.onsuccess = function(e) {
                todoo.indexedDB.getAllTodoItems();
            };

            request.onerror = function(e) {
                console.log("Error Adding: ", e);
            };
        };

        //Define DB deleteTodo()
        todoo.indexedDB.deleteTodo = function(id) {
            var db = todoo.indexedDB.db;
            var trans = db.transaction(["todoo"], IDBTransaction.READ_WRITE);
            var store = trans.objectStore("todoo");

            var request = store.delete(id);

            request.onsuccess = function(e) {
                todoo.indexedDB.getAllTodoItems();
            };

            request.onerror = function(e) {
                console.log("Error Adding: ", e);
            };
        };

        //Define DB getAllTodoItems()
        todoo.indexedDB.getAllTodoItems = function() {
            var db = todoo.indexedDB.db;
            var trans = db.transaction(["todoo"], IDBTransaction.READ_WRITE);
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
                else if(result.value.bg != null)
                    renderBG(result.value);

                result.continue();
            };

            cursorRequest.onerror = todoo.indexedDB.onerror;
        };

        function renderBG(row){
            var isRepeat = "";
            var filename = "";
            isRepeat = row.isRepeat;
            filename = row.bg;

            if(filename != null){
                File1.value = filename;

                //gets the directory
                var fullDir = image1.src;
                var absoluteDir = fullDir.split("default_bg.png", 1).toString();
                var folderPath = absoluteDir.slice(19).toString();
                var lastInd = folderPath.indexOf('/');
                var folderName = folderPath.slice(0, lastInd);

                image.src =  absoluteDir + filename;
                spanFolderName.innerHTML = folderName;

                if (isRepeat == 0) {
                    repeat_info.innerHTML = "no-repeat";
                }
                else {
                    repeat_info.innerHTML = "repeat";
                }
            }
        }

        function renderTodo(row) {
            var string_bg = row.bg;
            File1.src = string_bg;
        }
		
		function init() {
            todoo.indexedDB.open();
        }

        function saveBG() {
            var fullPath = File1.value;
            var filename = "";
            var timeStamp = new Date().getTime();
            var isRepeat = 0;

            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));

                var filename = fullPath.substring(startIndex);

                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
            }

            //gets the directory
            var fullDir = image1.src;
            var absoluteDir = fullDir.split("default_bg.png", 1).toString();
            var folderName = absoluteDir.slice(19);

            if (Checkbox1.checked == false) {
                isRepeat = 0;
                document.body.style.background = "url('" + absoluteDir + filename + "')  repeat center center fixed";
                document.body.style.webkitBackgroundSize = "cover";
            }
            else {
                isRepeat = 1;
                document.body.style.background = "url('" + absoluteDir + filename + "')  repeat center center fixed";
                document.body.style.webkitBackgroundSize = "";
            }

            var data = { "timeStamp": '1', "bg": filename, "isRepeat": isRepeat };
            todoo.indexedDB.addTodo(data);
        }