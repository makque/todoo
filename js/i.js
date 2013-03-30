// Initialize
//Stores
var MAIN_COLORS = new Array( '#999999', '#FF5353', '#FF800D', '#F2B426', '#339933', '#25A0C5', '#A27AFE', '#FF73B9' );
var OPA_COLORS = new Array( '#AAAAAA', '#FF6565', '#FF8D26', '#FFC53E', '#48A348', '#3BAACB', '#AB88FE', '#FF81C0' );

jQuery(document).ready(function($) {

//MODEL
Todoo = Backbone.Model.extend({
	defaults: {
		id: new Date().getTime(),
		title: "Untitled",
		note: "",
		tasks: [], //{"Finish Assignment.":{"done":true}, "Pay internet.":{"done":false} },
		color: 0,
		due_date: "",
		done: false
	},
	initialize: function(){
		//renderTodo(this);
		//alert("todoo created.");
	},
	toggle: function () {
		this.save( { done: !this.get("done") } );
	}
});

//COLLECTION
Todoos = Backbone.Collection.extend({
	model: Todoo,
	localStorage: new Backbone.LocalStorage("todoos"),
	 // Filter down the list of all todo items that are finished.
    done: function() {
    	notdone_count = 0;
		for(i=0; i < this.length; i++){
			if(!this.models[i].get("done"))
				notdone_count++;
		}
		return notdone_count;
    },
});

todoos = new Todoos;
todoos_count = 0;
current_id = 0;
//TODOO VIEW
TodooView = Backbone.View.extend({
	className: "todoo_container",
	events: {
		"click .todoo_delete": "test",
		"dblclick .todoo_title": "edit_title",
		"click .todoo_title": "toggle_hidden",
		"blur .todoo_title_edit": "close_edit_title",
		"keyup .todoo_note": "update",
		"click .todoo_state": "toggle_state",
		"click .todoo_tasks input[type='checkbox']": "toggle_task",
		"keyup .todoo_tasks input[type='text']": "save_task",
		"click .todoo_task_delete_btn": "delete_task",
		"click .todoo_add_task":"add_task",
		"click .todoo_remove_date":"remove_date",
		"change .todoo_add_date":"save_date",
		"click .todoo_change_color": function(){this.$( "#dialog_color_"+this.model.get("id") ).stop().slideToggle()},
		"click .dialog_color button": function(e){
			c = this.model.get("color");
			//console.log( e.currentTarget.value);
			c = e.currentTarget.value;
			this.model.save({color: c});
			this.render_color();
		}
	},
	initialize: function(){
		this.listenTo(this.model, 'add', this.render);
		this.listenTo(this.model, 'change', this.countNotDone);
	},
	render: function(){
		tasks = this.model.get("tasks")
		elem = 	"<div class='todoo_info'>";
		elem += "	<div class='todoo_state "+ (this.model.get("done") ? "checked" : "unchecked") + "'></div>";
		elem += "	<div class='todoo_date'></div>";
		elem += "	<div class='todoo_tasks_count'></div>";
		elem += "</div>";
		elem += "<div class='todoo_title'>"+this.model.get("title")+"</div>";
		elem += "<textarea type='text' class='todoo_title_edit'>"+this.model.get("title")+"</textarea>";
		elem += "<div class='todoo_hidden'>";
		elem += "	<div class='todoo_note_info'>NOTES</div>";
		elem += "	<textarea class='todoo_note' id='note_"+this.model.get("id")+"''>"+this.model.get("note")+"</textarea>";
		elem += "	<div class='todoo_tasks_info'>TASKS</div>";
					//render each tasks
		elem += "	<div class='todoo_tasks'>";
					tasks_id_count = 0;
					for(key in tasks){
						tasks_id_count++;
		elem += "		<div class='todoo_task_container' id='task_"+ key +"_"+ this.model.get("id") +"'>";
		elem += "			<input type='checkbox' value='" + key + "' " + (tasks[key].done ? "checked='checked'" : "") +">";
		elem += "			<input type='text' value='"+ tasks[key].task + "''><button class='todoo_task_delete_btn' value='"+key+"'>x</button>";
		elem += "		</div>";
					}
		elem += "	</div>"
		elem += "	<div class='todoo_submenu'>";
		elem += "		<input type='button' class='todoo_add_task' title='add task'>";
		elem += "		<input type='button' class='todoo_change_color' title='change color'>";
		elem += "		<input readonly='true' class='todoo_add_date' value='' title='add/change date'>";
		elem += "		<input type='button' class='todoo_remove_date' title='remove date'>";
		elem += "		<input type='button' class='todoo_delete' title='delete'>";
		elem +=	"	</div>";
		elem += "	<div class='dialog_color' id='dialog_color_"+this.model.get("id")+"'>";
		elem += "		<button class='cp_0'></button>";
		elem += "		<button class='cp_1'></button>";
		elem += "		<button class='cp_2'></button>";
		elem += "		<button class='cp_3'></button>";
		elem += "		<button class='cp_4'></button>";
		elem += "		<button class='cp_5'></button>";
		elem += "		<button class='cp_6'></button>";
		elem += "	</div>";
		elem +=	"</div>";
		this.$el.html(elem);
		this.render_color();
		this.$("input.todoo_add_date").datepicker({ minDate: new Date() });
		this.countTasks();
		this.countNotDone();
		this.format_date();
		return this;
	},
	render_color: function(){
		for(i = 0; MAIN_COLORS.length > i; i++){
			this.$("#cv_"+i).css('background-color', MAIN_COLORS[i]).val(i);
			this.$(".cp_"+i).css('background-color', MAIN_COLORS[i]).val(i);
		}
		this.$el.css( {
			//"background-color":MAIN_COLORS[this.model.get("color")],
			//"background-color":"#333",
			"border":"solid 1px "+MAIN_COLORS[this.model.get("color")],
			//"color":OPA_COLORS[this.model.get("color")] 
		}).attr("id", this.model.get("id"));

		this.$(".todoo_info").css({
			"background-color":MAIN_COLORS[this.model.get("color")],
			//"color":OPA_COLORS[this.model.get("color")]
		});
		this.$(".todoo_note_info").css({
			"border-top":"solid 1px "+MAIN_COLORS[this.model.get("color")],
			"color":MAIN_COLORS[this.model.get("color")]
		});

		this.$(".todoo_tasks_info").css({
			"border-top":"solid 1px "+MAIN_COLORS[this.model.get("color")],
			"color":MAIN_COLORS[this.model.get("color")]
		});

		this.$(".todoo_tasks_count").css({
			"color":OPA_COLORS[this.model.get("color")]
		});

		this.$(".todoo_note").css({ "border": "solid 1px "+OPA_COLORS[this.model.get("color")] });
		this.$(".todoo_tasks").css({ "border": "solid 1px "+OPA_COLORS[this.model.get("color")] });
		this.$(".todoo_tasks input[type='text']").css("border-bottom", "solid 1px "+MAIN_COLORS[this.model.get("color")] );
	},
	countNotDone: function(){
		document.title = "(" + todoos.done() + ") todoo";
	},
	countTasks: function(){
		tasks = this.model.get("tasks");
		total = 0;
		count_not_done = 0;
		for(key in tasks){
			total++;
			if(tasks[key].done)
				count_not_done++;
		}
		//"+ ( tasks_count ? tasks_count["not_done"]+"/"+tasks_count["all"] : "" ) +"
		count_str = "fsdf";
		if(total != 0){
			count_str = count_not_done+" / "+total;
			this.$(".todoo_tasks_count").show();
		}else{
			this.$(".todoo_tasks_count").hide();
		}

		this.$(".todoo_tasks_count").html(count_str);
	},
	edit_title: function(){
		var h = this.$(".todoo_title").height();
		this.$el.addClass("edit");
		this.$(".todoo_title_edit").val(this.model.get("title")).height(h).focus();
	},
	close_edit_title: function(){
		new_title = this.strip( this.$(".todoo_title_edit").val().trim() );
		if(new_title)
			this.model.save({"title":new_title});
		this.$el.removeClass("edit");
		this.$(".todoo_title").html(this.model.get("title"));
	},
	toggle_hidden: function(){
		this.$(".todoo_hidden").stop().slideToggle();
		this.render_color();
		this.autosize_note();
	},
	autosize_note: function(){
		h = document.getElementById("note_"+this.model.get("id")).scrollHeight;
		this.$(".todoo_note").height(h-30);
	},
	update: function(){
		this.model.save({note:this.$(".todoo_note").val()});
		this.autosize_note();
	},
	strip: function(html){
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		stripped = tmp.textContent||tmp.innerText;
		return stripped.replace(/\s/g, " ");
	},
	format_date: function(){
		d = new Date(this.model.get("due_date"));
		f_d = $.datepicker.formatDate("M d yy", d);

		this.$(".todoo_date").html( (this.model.get("due_date") ? f_d : "" ) );

		this.$(".todoo_remove_date").css("display", (this.model.get("due_date") ? "inline-block" : "none"));
	},
	toggle_state: function(){
		this.model.toggle();
		if(this.model.get("done"))
			this.$(".todoo_state").removeClass("unchecked").addClass("checked");
		else
			this.$(".todoo_state").addClass("unchecked").removeClass("checked");
	},
	toggle_task: function(e){ 
		tasks = this.model.get("tasks");
		tasks[e.currentTarget.value].done = !tasks[e.currentTarget.value].done;
		this.model.save();
		this.countTasks();
	},
	save_task: function(e){
		tasks = this.model.get("tasks");
		id = e.currentTarget.previousElementSibling.value;
		tasks[id].task = e.currentTarget.value;
		this.model.save();
		this.countTasks();
	},
	delete_task: function(e){ 
		tasks = this.model.get("tasks");
		tasks.splice(e.currentTarget.value, 1);
		this.$( "#task_"+ e.currentTarget.value + "_" + this.model.get("id")).remove();
		this.model.save();
		this.countTasks();
	},
	add_task: function(e){
		key = this.model.get("tasks").length;
		this.model.get("tasks").push({"task":"New task.","done":false});

		elem =  "<div class='todoo_task_container' id='task_"+ key +"_"+ this.model.get("id") +"'>";
		elem += "	<input type='checkbox' value='" + key + "' >";
		elem += "	<input type='text' value='New task.' style='border-bottom: solid 1px "+ MAIN_COLORS[this.model.get("color")]+"'><button class='todoo_task_delete_btn' value='"+key+"'>x</button>";
		elem += "</div>";

		this.$( ".todoo_tasks").append(elem);
		this.model.save();
		this.countTasks();
	},
	save_date: function(e){
		due_date = e.currentTarget.value;
		this.model.save({due_date: due_date});
		this.format_date();
	},
	remove_date: function(e){
		due_date = "";
		this.model.save({due_date: due_date});
		this.format_date();
	}
});

//APP VIEW
AppView = Backbone.View.extend({
	el: "body",
	events: {
		"click .color_views li button" : "setView",
		"dblclick .color_views li button" : "setView_only",
		"click #add_todoo" : "add"
	},
	initialize: function(){
		//init buttons
		//init color_views & color_picker buttons
		for(i = 0; MAIN_COLORS.length > i; i++){
			$("#cv_"+i).css('background-color', MAIN_COLORS[i]).val(i);
		}

		this.listenTo(todoos, 'add', this.addOne);
		this.listenTo(todoos, 'reset', this.addAll);
		this.listenTo(todoos, 'all', this.render);

		todoos.fetch();
	},
	setView: function(e){ 

	},
	setView_only: function(e){ 

	},
	add: function(){
		todoos.create();
	},
	addAll: function(){
		todoos.each(this.addOne, this);
	},
	addOne: function(todoo){
		tv = new TodooView( { model: todoo } )
		this.$("#output").prepend( tv.render().el );
	},
	render: function(){
		//alert( JSON.stringify(todoos) );
		for(key in todoos){
			old_value = this.$("cv_"+todoos[key].color).html() ? this.$("cv_"+todoos[key].color).html() : 0;
			//alert( JSON.stringify(todoos) );
			if(!todoos[key].done)
				this.$("cv_"+todoos[key].color).addClass("test");//.html( old_value+1 );
		}
	}
});

//init the app
appView = new AppView;

});