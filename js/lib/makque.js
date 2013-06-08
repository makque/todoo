/**
* makque lib
*/
var makque = {
	/**
	* To height
	* @param {number} elem HTML element
	* @param {number} percentage Percentage value
	*/
	toScreenHeight : function(elem, percentage) {
		var h = $(window).height() * (percentage!=null ? percentage : 1);
		$(elem).height(h);

		//resize elem on window resize
		$(window).resize(function() {
			h =  $(window).height();
			$(elem).height(h);
		});
	},
	toScreenWidth : function(elem, percentage) {
		var w = $(window).width();
		$(elem).width(w);

		//resize elem on window resize
		$(window).resize(function() {
			w =  $(window).width();
			$(elem).width(w);
		});
	}
}