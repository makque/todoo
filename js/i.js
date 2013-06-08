$(function() {
	App = {
		Constants: {},
		Templates: {},
		Models: {},
		Views: {},
		Collections: {}
	}

	App.Constants = {
		MAIN_COLORS: ['#aaaaaa', '#fc5858', '#f97697', '#fcaa58', '#fcd358', '#30aa58', '#4db0cd', '#a985fc'],
		VIEW_COLOR: [1,1,1,1,1,1,1],
		SETTINGS: [
			{"view_color": App.Constants.VIEW_COLOR},
			{"db_version":0}
		]
	}

	App.Templates = {
		todooSummary:
			"<div class='one checkbox'><% if (done) { %> DONE <% } else { %> [ ] <% } %></div>" +
			"<div class='seven-halves info left'>" +
			"	<div class='title'><%- title %></div>" +
			"</div>" +
			"<div class='one-half due right'>" +
			"	Jan 23<%- due_date %>" +
			"</div>"
	}

	App.Models.Todoo = Backbone.Model.extend({
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
			this.listenTo(this.collection, "sync", this.renderAll);
			//this.listenTo(this.collection, "all", function(e){console.log(e)});
		},
		renderAll: function() {
			// clear the view
			this.$el.html("");
			// Render each todoo view
			this.collection.each(this.renderEach, this);
		},
		renderEach: function(model) {
			var todooView = new App.Views.Todoo({model: model});
			this.$el.prepend( todooView.render().el );
		}
	});

	App.Views.Todoo = Backbone.View.extend({
		tagName: "div",
		className: "summary",
		template: _.template(App.Templates.todooSummary),
		initialize: function() {

		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			// set background color
			this.$el.css("background-color", App.Constants.MAIN_COLORS[this.model.get("color")]);
			return this;
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