dojo.provide("misys.form.MultiSelect");
dojo.experimental("misys.form.MultiSelect");

dojo.require("dijit.form.MultiSelect");

dojo.declare("misys.form.MultiSelect", dijit.form.MultiSelect, {
	// summary:
	//		Widget version of a <select multiple=true> element,
	//		for selecting multiple options.

	addSelected: function(/*dijit.form.MultiSelect*/ select){
		// summary:
		//		Move the selected nodes of a passed Select widget
		//		instance to this Select widget.
		//
		// example:
		// |	// move all the selected values from "bar" to "foo"
		// | 	dijit.byId("foo").addSelected(dijit.byId("bar"));
		console.debug("[misys.form.MultiSelect] addSelected");
		select.getSelected().forEach(function(n){
			this.containerNode.appendChild(n);
			// scroll to bottom to see item
			// cannot use scrollIntoView since <option> tags don't support all attributes
			// does not work on IE due to a bug where <select> always shows scrollTop = 0
		},this);
		this.domNode.scrollTop = this.domNode.offsetHeight; // overshoot will be ignored
		// scrolling the source select is trickier esp. on safari who forgets to change the scrollbar size
		var oldscroll = select.domNode.scrollTop;
		select.domNode.scrollTop = 0;
		select.domNode.scrollTop = oldscroll;
		this.sortValues();
	},

	postCreate: function(){
		console.debug("[misys.form.MultiSelect] postCreate");
		this._onChange();
		this.sortValues();
	},
	
	sortValues : function(){
		console.debug("[misys.form.MultiSelect] sortValues");
		var that = this;
		var array = dojo.query("option",that.containerNode).sort(function(a,b){
			if(a.firstChild && b.firstChild)
			{
				if (a.firstChild.nodeValue.toUpperCase() < b.firstChild.nodeValue.toUpperCase()) 
				{
					return -1;
				}
				else if(a.firstChild.nodeValue.toUpperCase() > b.firstChild.nodeValue.toUpperCase())
				{
					return 1;
				}
				else
				{
					return 0;
				}
			}
		});
		array.forEach(function(n){
			if(that.containerNode)
			{
				that.containerNode.appendChild(n);
			}
		});
		that.domNode.scrollTop = 0;
	}
});

