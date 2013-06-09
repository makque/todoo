$(function() {
	App = {
		Constants: {},
		Templates: {},
		Helpers: {},
		Models: {},
		Views: {},
		Collections: {}
	}

	App.Constants = {
		MAIN_COLORS: ['#b8b8b8', '#f97676', '#f78ea8', '#fcaa58', '#f9d876', '#56b876', '#6dbcd4', '#b79af9'],
		VIEW_COLOR: [1,1,1,1,1,1,1],
		MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		SETTINGS: [
			{"view_color": App.Constants.VIEW_COLOR},
			{"db_version":0}
		]
	}

	App.Templates = {
		todooSummary:
		"<div class='one checkbox'>" +
		"	<a href class='toggle-done'>" +
		"		<img src='images/done.png' width='24px' height='24px' alt='done'" +
		"			<% if (done) { %>title='set as not done' class='done'" +
		"			<% } else { %>title='set as done' class='not-done'<% } %>" +
		"		/>" +
		"	</a>" +
		"</div>" +
		"<div class='seven-halves info left'>" +
		"	<div class='title'><%- title %></div>" +
		"</div>" +
		"<div class='one-half due'>" +
		"	<%- App.Helpers.formatDate(due_date) %>" +
		"</div>",
		todooDetails:
		"<div class='title'><%- title %></div>" +
		"<div class='edit-title'><input type='text' value='<%- title %>' class='center'/></div>" +
        "<div class='tabs left'>" +
        "    <button class='active'>Notes</button>" +
        "    <button>Tasks</button>" +
        "</div>" +
        "<div class='notes active'>" +
        "    <textarea class='ten content' placeholder='Add some notes here.'><%- note %></textarea>" +
        "</div>" +
        "<div class='tasks'>" +
        "    <div class='content'>" +
        "        <div class='task'>" +
        "            <span class='half done'>[]</span>" +
        "            <span class='eight-halves content left'>Taks</span>" +
        "            <span class='half delete'>x</span>" +
        "        </div>" +
        "    </div>" +
        "    <div class='add right'>" +
        "        <button>+</button>" +
        "    </div>" +
        "</div>"
	}

	App.Helpers = {
		formatDate: function(date) {
			var now = new Date();
			var d = new Date(date);
			if (Date.parse(d)){
				var mm = App.Constants.MONTHS[d.getMonth()];
				var dd = d.getDate();
				var yy = now.getYear() == d.getYear() ? "" : ", " + d.getFullYear();
				return mm + " " + (dd.toString().length == 1 ? "0"+dd : dd) + yy;
			}
		}
	}

	App.Models.Todoo = Backbone.Model.extend({
		validate: function(attrs) {
			if (attrs.title.trim() == "")
				return "Please specify a title.";
		},
		defaults: {
			id: new Date().getTime(),
			title: "Untitled",
			note: "",
			tasks: [],
			color: 0,
			due_date: "",
			done: false
		}
	});

	App.Collections.Todoos = Backbone.Collection.extend({
		model: App.Models.Todoo,
		localStorage: new Backbone.LocalStorage("todoos"),
		initialize: function() {
			// bind a view to this collection
			App.todoosView = new App.Views.Todoos({collection: this});
		}
	});

	App.Views.Todoos = Backbone.View.extend({
		el: "#output",
		initialize: function() {
			this.listenTo(this.collection, "add", this.renderAll);
			//this.listenTo(this.collection, "all", function(e){console.log(e)});
		},
		renderAll: function() {
			// clear the view
			this.$el.html("");
			// Render each todoo view
			this.collection.each(this.renderEach, this);
		},
		renderEach: function(model) {
			var todooSummaryView = new App.Views.TodooSummary({model: model});
			this.$el.prepend( todooSummaryView.render().el );
		}
	});

	App.Views.TodooSummary = Backbone.View.extend({
		tagName: "div",
		className: "summary",
		template: _.template(App.Templates.todooSummary),
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
		},
		events: {
			"click .info": "toggleSummary",
			"click .checkbox a.toggle-done": "toggleDone"
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			// set background & border color
			this.$el.css({
				"background-color": App.Constants.MAIN_COLORS[this.model.get("color")],
				"border-left-color": App.Constants.MAIN_COLORS[this.model.get("color")]
			});
			return this;
		},
		toggleSummary: function() {
			// toogle active summaries
			if (this.$el.hasClass("active")) {
				this.deactivate();
			}
			else {
				this.activate();
			}
		},
		toggleDone: function(e) {
			e.preventDefault();
			// toggle done state of the todoo
			var isDone = this.model.get("done");
			this.model.save({done: !isDone});
		},
		deactivate: function() {
			this.$el.removeClass("active");
			// if this summary is deactivated that means no other summaries
			// are active, change body bg to default
			$("body").css("background-color", "");
			// remove idle state for all summaries
			$("#output").find(".summary").removeClass("idle");
			// hide details
			$("#details").addClass("hide");
			App.todooSummary = null;
			App.todooDetails = null;
		},
		activate: function() {
			// only one summary can be active at a time in #output
			$("#output").find(".summary.active").removeClass("active");
			// make all summaries idle
			$("#output").find(".summary").addClass("idle");
			// activate selected summary
			this.$el.removeClass("idle").addClass("active");
			// change page bg color to the active's color
			$("body").css("background-color", App.Constants.MAIN_COLORS[this.model.get("color")]);
			// show details
			$("#details").removeClass("hide");
			// create a new view for the details set this as active summary
			App.todooSummary = null;
			App.todooDetails = null;
			App.todooSummary = this;
			App.todooDetails = new App.Views.TodooDetails({model: this.model});
		}
	});

	App.Views.TodooDetails = Backbone.View.extend({
		el: "#details",
		template: _.template(App.Templates.todooDetails),
		events: {
			"click .title": "editTitle",
			"blur .edit-title": "exitEdit",
			"keyup .edit-title": "saveTitle",
			"keyup .notes .content": "saveNote"
		},
		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		editTitle: function() {
			this.$el.addClass("edit");
			this.$el.find(".edit-title input").focus();
		},
		exitEdit: function() {
			this.$el.removeClass("edit");
		},
		saveTitle: function() {
			var self = this;
			var title = this.$el.find(".edit-title input").val();
			this.model.save({title: title},
				{ success: function(){
					// update just the title display
					self.$el.find(".title").html(self.model.get("title"));
				}});
		},
		saveNote: function() {
			var note = this.$el.find(".notes .content").val();
			this.model.save({note: note});
		}
	});

	App.Views.App = Backbone.View.extend({
		el: "body",
		events: {
			"click #add_todoo" : "add"
		},
		initialize: function() {
			this.renderColorPicker();

			// Get all todoos.
			App.todoos = new App.Collections.Todoos;
			App.todoos.fetch();
		},
		renderColorPicker: function() {
			for(i = 0; App.Constants.MAIN_COLORS.length > i; i++){
				this.$el.find("#cv_"+i).css('background-color', App.Constants.MAIN_COLORS[i]).val(i);
				this.$el.find(".cp_"+i).css('background-color', App.Constants.MAIN_COLORS[i]).val(i);
			}
		},
		add: function(){
			var color_id_in_view = 0;
			//return the color that is in view
			/*for(var i = 0; i < VIEW_COLOR.length; i++){
				if(VIEW_COLOR[i] == true){
					color_id_in_view = i;
					break;
				}
			}*/

			App.todoos.create({color:color_id_in_view});
		},
	});

	App.view = new App.Views.App();
});