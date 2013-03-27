// Initialize
//Stores
var MAIN_COLORS = new Array( '#999999', '#FF5353', '#FF800D', '#FFBE28', '#339933', '#25A0C5', '#A27AFE', '#FF73B9' );
var OPA_COLORS = new Array( '#AAAAAA', '#FF6565', '#FF8D26', '#FFC53E', '#48A348', '#3BAACB', '#AB88FE', '#FF81C0' );

jQuery(document).ready(function($) {

//MODEL
Todoo = Backbone.Model.extend({
	defaults: {
		id: new Date().getTime(),
		title: "Untitled",
		note: "",
		tasks: null, //{"Finish Assignment.":{"done":true}, "Pay internet.":{"done":false} },
		color: 0,
		due_date: null,
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
	localStorage: new Backbone.LocalStorage("todoos")
});

todoos = new Todoos;

//TODOO VIEW
TodooView = Backbone.View.extend({
	className: "todoo_container",
	events: {
		"click .todoo_delete": "test",
		"dblclick .todoo_title": "edit_title",
		"blur .todoo_title_edit": "close_edit_title" 
	},
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		tasks = this.model.get("tasks")
		tasks_count = this.countTasks(tasks);
		elem = 	"<div class='todoo_info'>";
		elem += "	<div class='todoo_state "+ (this.model.get("done") ? "checked" : "unchecked") + "'></div>";
		elem += "	<div class='todoo_date'>"+ (this.model.get("due_date") ? this.model.get("due_date") : "" ) +"</div>";
		elem += "	<div class='todoo_tasks_count'>"+ ( tasks_count ? tasks_count["not_done"]+"/"+tasks_count["all"] : "" ) +"</div>";
		elem += "</div>";
		elem += "<div class='todoo_title'>"+this.model.get("title")+"</div>";
		elem += "<input type='text' class='todoo_title_edit' value='"+this.model.get("title")+"'>";
		elem += "<div class='todoo_hidden'>";
		elem += "	<div class='todoo_note_info'>NOTES</div>";
		elem += "	<textarea class='todoo_note'>"+this.model.get("note")+"</textarea>";
		elem += "	<div class='todoo_tasks_info'>TASKS</div>";
					//render each tasks
		elem += "	<div class='todoo_tasks'>";
					tasks_id_count = 0;
					for(key in tasks){
						tasks_id_count++;
		elem += "		<input type='checkbox' id='" + this.model.get("id") + "_task_" + tasks_id_count + "' " + (tasks[key].done ? "checked='checked'" : "") +">";
		elem += "		<label for='" + this.model.get("id") + "_task_" + tasks_id_count + "'>"+ key + "</label>";
					}
		elem += "	</div>"
		elem += "	<div class='todoo_submenu'>";
		elem += "		<button class='todoo_change_color'>change color</button>";
		elem += "		<button class='todoo_add_date'>add date</button>";
		elem += "		<button class='todoo_remove_date' style='display:"+(this.model.get("due_date") ? "inline-block" : "none")+"'>rem date</button>";
		elem += "		<button class='todoo_delete'>delete</button>";
		elem +=	"	</div>";
		elem +=	"</div>";
		this.$el.html(elem);
		this.$el.css( {
			//"background-color":MAIN_COLORS[this.model.get("color")],
			"border":"solid 7px "+OPA_COLORS[this.model.get("color")],
			"color":MAIN_COLORS[this.model.get("color")] 
		});
		return this;
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
	},
	edit_title: function(){
		this.$el.addClass("edit");
		this.$(".todoo_title_edit").val(this.model.get("title")).focus();
		//alert('f');
	},
	close_edit_title: function(){
		new_title = this.$(".todoo_title_edit").val().trim();
		if(new_title)
			this.model.save({"title":new_title});
		this.$el.removeClass("edit");
		//this.$(".todoo_title_edit").focus();
		//alert('f');
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
			$("#cp_"+i).css('background-color', MAIN_COLORS[i]).val(i);
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