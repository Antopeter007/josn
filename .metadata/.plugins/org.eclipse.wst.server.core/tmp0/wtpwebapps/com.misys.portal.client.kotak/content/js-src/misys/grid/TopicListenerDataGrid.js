dojo.provide("misys.grid.TopicListenerDataGrid");
dojo.experimental("misys.grid.TopicListenerDataGrid"); 

dojo.require("dojox.grid.EnhancedGrid");

dojo.require("dojo.regexp");
dojo.require("dojox.string.tokenize");


//our declared class
dojo.declare("misys.grid.TopicListenerDataGrid",
		[ dojox.grid.EnhancedGrid ],
		// class properties:
		{
	subscribe_topic: "",
	onSelectionClearedScript: "",

	startup: function()
	{
		console.debug("[TopicListenerDataGrid] startup start");
		this.inherited(arguments);
		console.debug("[TopicListenerDataGrid] startup end");
	},

	handleTopicEvent: function(event, topic)
	{


		if (this.selection && this.get('selectionMode') != '')
		{
			this.selection.clear();
		}

		console.debug("[TopicListenerDataGrid] handle event: "+event+", topic: "+topic);
		this._reloadGridForEventTerms(event);

	},

	_reloadGridForEventTerms: function(event)
	{
		// Collect the search field values from event as a JSON object
		var store = this.get('store'),
			baseURL = store.url,
			query = {};
		if(baseURL.indexOf("&") !== -1) {
			baseURL = baseURL.substring(0, baseURL.indexOf("&"));
		}		

		for(key in event) {
			if(event.hasOwnProperty(key)) {
				query[key] = event[key];
			}
		}

		store.close();
		store.url = baseURL;
		this.setStore(store, query);
	}
		}
);