dojo.provide("misys.widget.BookmarkMenu");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) 
{
	function _saveBookmarkAction(/*String*/ link, /*String*/ actionValue, /*String*/ screenValue)
	{  
		//      summary:
	    //            Saves a screen bookmark
	    //      tags:
	    //            protected
		var text = '';
		var xmlString =['<?xml version=\"1.0\" encoding=\"UTF-8\"?><bookmark>'];
		var nodeBookmark = dijit.byId('sendBookmark');
		dojo.forEach(nodeBookmark.getDescendants(),
				function(field){
					xmlString.push("<", field.get("name"), ">",
									field.get("value"),
									"</", field.get("name"), ">");
				}
		);
		if(dijit.byId("bookmarkName"))
		{
			xmlString.push('<bookmark_name>', dijit.byId("bookmarkName").get('value'), '</bookmark_name>'); 
		}
		xmlString.push('<bookmark_url>',"**" , '</bookmark_url>');
		xmlString.push('<bookmark_source>', "**", '</bookmark_source>');
		xmlString.push('<bookmark_id>', link, '</bookmark_id>');
		xmlString.push('<action>', link, '</action></bookmark>');
		console.debug('[Bookmarks] Adding Bookmark - Request XML');
		console.debug('[Bookmarks] ' + xmlString.join(''));
		var deferred = misys.xhrPost( {
			url : misys.getServletURL('/screen/BookmarkMenuScreen'),
			handleAs: "json",
			content: {
				formContent: xmlString.join(""),
				bookmarkAction: "SAVE",
				currentActionCode: actionValue,
				currentScreen: screenValue
			},
			load : function(response){
				text = response.content[0];
			}
		});
		deferred.then(function(){
			//console.debug('[Bookmarks] Adding Bookmrk - Response = ' + text);
			var favorites = dojo.byId('favorites');
			if(!dijit.byId('sendBookmark')){
			 dojo.parser.parse(dojo.byId('favorites'));
			}
			misys.animate("wipeOut", favorites, function(){
				dijit.byId('sendBookmark').destroyRecursive(true);
				//Destroy all previous widgets and containers
				var widgets = dj.findWidgets(dojo.byId("favorites"));
				dojo.forEach(widgets, function(w) {
				    w.destroyRecursive(false);
				});
				//Destroy all the Children
				dojo.empty("favorites");
				// substring is used to avoid duplicated favorites node
				favorites.innerHTML = text.substring(20, text.length - 6);
				dojo.parser.parse(dojo.byId('favorites'));
				misys.animate("wipeIn",favorites);
			});
		});
		return deferred;
	}
	function _deleteBookmarkAction(/*String*/ id, /*String*/ action, /*String*/ actionValue, /*String*/ screenValue)
	{
	    //  summary:
	    //            Deletes a bookmark
	    //      tags:
	    //            protected
		var xmlString = ['<?xml version=\"1.0\" encoding=\"UTF-8\"?><bookmark>'];
		var nodeBookmark = dijit.byId('sendBookmark');
		dojo.forEach(nodeBookmark.getDescendants(),
				function(field){
					if(field.id !== 'bookmark_'+id && field.id !== 'bookmark_name_'+id && field.id !== 'bookmark_source_'+id && field.id !== 'bookmark_url_'+id) {
						xmlString.push("<", field.get("name"), ">",
								field.get("value"),
								"</", field.get("name"), ">");
					}
				}
		);
		xmlString.push('<action>', action, '</action></bookmark>');
		console.debug('[Bookmarks] Deleting Bookmark - Request XML');
		console.debug('[Bookmarks] ' + xmlString.join(''));
		var text = '';
		var deferred = misys.xhrPost( {
			url : misys.getServletURL('/screen/BookmarkMenuScreen'),
			handleAs: "json",
			content: {
				formContent: xmlString.join(""),
				bookmarkAction: "DELETE",
				currentActionCode: actionValue,
				currentScreen: screenValue
			},
			load : function(response){
				text = response.content[0];
			}
		});
		deferred.then(function(){
			console.debug('[Bookmarks] Deleting Bookmark - Response = ' + text);
			var favorites = dojo.byId('favorites');
			if(!dijit.byId('sendBookmark')){
				dojo.parser.parse(dojo.byId('favorites'));
			}
			misys.animate("wipeOut", favorites, function(){
				// destroy java script object that will be changed by the innerHTML update
				dijit.byId('sendBookmark').destroyRecursive(true);
				//Destroy all previous widgets and containers
				var widgets = dj.findWidgets(dojo.byId("favorites"));
				dojo.forEach(widgets, function(w) {
				    w.destroyRecursive(false);
				});
				//Destroy all the Children
				dojo.empty("favorites");
				// substring is used to avoid duplicated favorites node
				favorites.innerHTML = text.substring(20, text.length - 6);
				dojo.parser.parse(dojo.byId('favorites'));
				// parse the new html block to register new java script objects.
				misys.animate("wipeIn", favorites);
			});
		});
		return deferred;
	}

	d.mixin(m,{
		doBookmarkAction : function( /*String*/ type, /*String*/ action,  /*String*/ id,  /*String*/ actionValue,  /*String*/ screenValue)
		{
			//		      summary:
			//		            Save or Deletes a bookmark, and ensures everything is parsed and loaded first.
			//		      tags:
			//		            protected
			if(!dijit.byId('sendBookmark'))
			{
				dojo.parser.parse('favorites');
			}
			if (type === 'SAVE') 
			{
				_saveBookmarkAction(action, actionValue, screenValue);
			} 
			else
			{ 
				_deleteBookmarkAction(id, action, actionValue, screenValue);
			}
		}
	});
})(dojo, dijit, misys);
