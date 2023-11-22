dojo.provide("misys.widget.Bookmark");
/*
 -----------------------------------------------------------------------------
 Scripts for saving bookmarks/favourites

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      15/02/08
 -----------------------------------------------------------------------------
*/

fncSaveBookmarkAction = function(/*String*/ link, /*String*/ actionValue, /*String*/ screenValue)
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
	
	xmlString.push('<bookmark_id>', link, '</bookmark_id>'); 
	xmlString.push('<action>', link, '</action></bookmark>');
	
	console.debug('[Bookmarks] Adding Bookmark - Request XML');
	console.debug('[Bookmarks] ' + xmlString.join(''));
	var deferred = misys.xhrPost( {
		url : misys.getServletURL('/screen/BookmarkScreen?currentActionCode=' +actionValue+'&currentScreen='+screenValue),
		postData: xmlString.join(''),
		load : function(response){
			text = response;
		}
	});
	
	deferred.then(function(){
		console.debug('[Bookmarks] Adding Bookmrk - Response = ' + text);
		var favorites = dojo.byId('favorites');
		if(!dijit.byId('sendBookmark')){
		 dojo.parser.parse(dojo.byId('favorites'));
		}
		misys.animate("wipeOut", favorites, function(){
			dijit.byId('sendBookmark').destroyRecursive(true);
			// substring is used to avoid duplicated favorites node
			favorites.innerHTML = text.substring(20, text.length - 6);
			misys.animate("wipeIn",favorites);
		});
	});
	return deferred;
};

fncDeleteBookmarkAction = function(/*String*/ id, /*String*/ action, /*String*/ actionValue, /*String*/ screenValue)
{
    //  summary:
    //            Deletes a bookmark
    //      tags:
    //            protected
	var xmlString = ['<?xml version=\"1.0\" encoding=\"UTF-8\"?><bookmark>'];
	var nodeBookmark = dijit.byId('sendBookmark');
	dojo.forEach(nodeBookmark.getDescendants(),
			function(field){
				if(field.id != 'bookmark_'+id) {
					xmlString.push("<", field.get("name"), ">",
							field.get("value"),
							"</", field.get("name"), ">");
				}
			}
	);
	
	xmlString.push('<action>', action, '</action></bookmark>');
	
	console.debug('[Bookmarks] Deleting Bookmark - Request XML');
	console.debug('[Bookmarks] ' + xmlString);
	var text = '';
	var deferred = misys.xhrPost( {
		url : misys.getServletURL('/screen/BookmarkScreen?currentActionCode=' +actionValue+'&currentScreen='+screenValue),
		postData: xmlString.join(""),
		load : function(response){
			text = response;
		}
	});
	
	deferred.then(function(){
		//console.debug('[Bookmarks] Deleting Bookmark - Response = ' + text);
		var favorites = dojo.byId('favorites');
		if(!dijit.byId('sendBookmark')){
		 dojo.parser.parse(dojo.byId('favorites'));
		}
		misys.animate("wipeOut", favorites, function(){
			// destroy java script object that will be changed by the innerHTML update
			dijit.byId('sendBookmark').destroyRecursive(true);
			// substring is used to avoid duplicated favorites node
			favorites.innerHTML = text.substring(20, text.length - 6);
			
			// parse the new html block to register new java script objects.
			misys.animate("wipeIn", favorites);
		});

		
	});
	return deferred;
};


fncDoBookmarkAction = function( /*String*/ type,
        /*String*/ action, 
        /*String*/ id, 
        /*String*/ actionValue, 
        /*String*/ screenValue){
//      summary:
//            Save or Deletes a bookmark, and ensures everything is parsed and loaded first.
//      tags:
//            protected
if(!dijit.byId('sendBookmark'))
{

dojo.parser.parse('favorites');
}

if (type == 'SAVE') {
fncSaveBookmarkAction(action, actionValue, screenValue);
} else { 
fncDeleteBookmarkAction(id, action, actionValue, screenValue);
}
};
