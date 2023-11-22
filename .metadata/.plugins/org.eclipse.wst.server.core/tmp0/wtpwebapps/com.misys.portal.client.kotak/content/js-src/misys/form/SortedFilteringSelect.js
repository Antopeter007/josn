dojo.provide("misys.form.SortedFilteringSelect");
dojo.experimental("misys.form.SortedFilteringSelect");

dojo.require("dijit.form.FilteringSelect");

dojo.declare("misys.form.SortedFilteringSelect", dijit.form.FilteringSelect,{
	postCreate: function(){
		this.inherited(arguments);
		console.debug("[misys.form.SortedFilteringSelect] postCreate");
		this.fetchProperties =
		{
			sort : [
			{
				attribute : "name"
			} ]
		};
	}
});