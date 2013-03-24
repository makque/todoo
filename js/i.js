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

jQuery(document).ready(function($) {
	//MODEL
	Todoo = Backbone.Model.extend({
		defaults: {
			id: new Date().getTime(),
			title: "Untitled",
			note: "",
			tasks: null,
			color: 0,
			due_date: null,
			done: false
		},
		initialize: function(){
			//renderTodo(this);
			alert("todoo created.");
		},
		toggle: function () {
			this.save( { done: !this.get("done") } );
		}
	});

	//COLLECTION
	Todoos = Backbone.Collection.extend({
		model: Todoo,
		localStorage: new Backbone.LocalStorage("todoos"),
		initialize: function(){
			//for (var key in localStorage){
   			//	console.log(key);
			//}
		},
		add: function(model){
			//localStorage.setItem(model.get("id"), JSON.stringify(model));
			//alert(model.get('id'));
		}
	});

	todoos = new Todoos;

	//APP VIEW
	AppView = Backbone.View.extend({
		el: "body",
		events: {
			"click .color_views li button" : "setView",
			"dblclick .color_views li button" : "setView_only",
			"click #add_todoo" : "add"
		},
		setView: function(e){ 
			//alert( $(e.currentTarget).val() );
			//todayCount++;

		},
		setView_only: function(e){ 
			//alert( "only: " + $(e.currentTarget).val() );
			//todayCount++;
			//alert(todayCount);
		},
		add: function(){
			//todoos.add(new Todoo());
			todoos.create();
		},
		initialize: function(){
			//init buttons
			//init color_views buttons
			for(i = 0; MAIN_COLORS.length > i; i++){
				$("#cv_"+i).css('background-color', MAIN_COLORS[i]).val(i);
				//this.setView();
			}

			this.listenTo(todoos, 'add', this.addOne);
			//this.listenTo(todoos, 'reset', this.addAll);
			todoos.fetch();
		},
		addAll: function(){
			todoos.each(this.addOne, this);
			alert("reset");
		},
		addOne: function(todoo){
			//this.$("#output").append(todoo.get("id")+'adding todoo.<br/>');
			tv = new TodooView( { model: todoo } )
			this.$("#output").append( tv.render() );
		}
	});

	//APP VIEW
	TodooView = Backbone.View.extend({
		el: "div",
		events: {

		},
		initialize: function(){
			//return this.model.get("id");
		},
		render: function(){
			tasks_count = this.countTasks(this.model.get("tasks"));
			elem = 	"<div class='todoo_container'>";
			elem += "	<div class='todoo_info'>";
			elem += "		<div class='todoo_state "+ (this.model.get("done") ? "checked" : "unchecked") + "'></div>";
			elem += "		<div class='todoo_date'>"+ (this.model.get("due_date") ? this.model.get("due_date") : "" ) +"</div>";
			elem += "		<div class='todoo_tasks_count'>"+ ( tasks_count ? tasks_count["not_done"]+"/"+tasks_count["all"] : "" ) +"</div>";
			elem += "	</div>";
			elem += "	<div class='todoo_title'>"+this.model.get("title")+"</div>";
			elem += "	<div class='todoo_hidden'>";
			elem += "		<div class='todoo_note_info'>NOTES</div>";
			elem += "		<textarea class='todoo_note'>"+this.model.get("note")+"</textarea>";
			elem += "		<div class='todoo_tasks_info'>TASKS</div>";
			elem += "		<div class='todoo_tasks'>"+this.model.get("note")+"</div>";
			elem += "		<div class='todoo_submenu'>";
			elem += "			<button class='todoo_change_color'>change color</button>";
			elem += "			<button class='todoo_add_date'>add date</button>";
			elem += "			<button class='todoo_remove_date' style='display:"+(this.model.get("due_date") ? "inline-block" : "none")+"'>rem date</button>";
			elem += "			<button class='todoo_delete'>delete</button>";
			elem +=	"		</div>";
			elem +=	"	</div>";
			elem += "</div>";

			return elem;
		},
		countTasks: function(tasks){
			total = 0;
			count_not_done = 0;
			for(key in tasks){
				total++;
				if(tasks[key].done)
					count_not_done++;
			}

			if(total != 0){
				return {"not_done":count_not_done, "all":total};
			}else{
				return null;
			}
		}
	});

	appView = new AppView;
});