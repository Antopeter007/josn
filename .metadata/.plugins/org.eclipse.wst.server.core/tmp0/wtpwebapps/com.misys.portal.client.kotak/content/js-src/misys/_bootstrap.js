dojo.provide("misys._bootstrap");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary:
//	Resources that should be loaded on all screens, in DEBUG modes only
//
// description:
//  Sometimes in DEBUG mode, especially for screens that do not have their
//  own binding (list screens, for example) we want to ensure that certain
//  resources are always loaded. We want to avoid putting <script> tags
//  all over the place, so that's what this file is for.
//
//  It will always be loaded in the two DEBUG modes, and you should included
//  any resources that would previously have been loaded via in-page calls
//  to dojo.require, or via the (now deprecated) dojo.modules.default property
//  in portal.properties
//
// version:   1.0
// date:      24/03/2011
// author:    Cormac Flynn

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m){
	d.require("dojo.data.ItemFileReadStore");
	d.require("misys.data.ItemFileReadStore");
	d.require("dojox.data.QueryReadStore");
	d.require("dojox.grid.DataGrid");
	d.require("dojox.grid.EnhancedGrid");
	d.require("misys.grid.Pagination");
	d.require("dojox.grid.enhanced.plugins.IndirectSelection");
	d.require("dijit.ProgressBar");
	d.require("misys.widget.Dialog");
	d.require("dijit.form.Form");
	d.require("dijit.form.TextBox");
	d.require("dijit.form.FilteringSelect");
	d.require("dijit.form.DateTextBox");
	d.require("misys.grid._base");
	d.require("misys.grid.TopicListenerDataGrid");
	d.require("misys.grid.IndirectSelection");
	d.require("misys.calendar.Calendar");
	d.require("misys.form.common");
	d.require("misys.form.file");
	d.require("misys.binding.SessionTimer");
	d.require("misys.widget.Collaboration");
	d.require("misys.form.CurrencyTextBox");
	d.require("dijit.MenuBar");
	d.require("dijit.PopupMenuBarItem");
	d.require("dijit.Menu");
	d.require("dijit.form.Button");
	d.require("misys.widget.BookmarkMenu");
	d.require("dijit.form.DropDownButton");
	d.require("dijit.TooltipDialog");
	d.require("misys.widget.Tree");
	d.require("misys.binding.AsyncMessage");
	
	// If you need resources on a per-screen basis, then add your screen and require below
	
	var screen = window.location.href.substring(d.lastIndexOf(window.location.href, "/") + 1, 
			       window.location.href.indexOf("?")).toLowerCase();
	switch(screen) {
		case "fulleventsscreen":
			d.require("dojox.grid.TreeGrid");
			break;
		default:
			break;
	}
	
	// If you have any methods you want to add to help with debugging, add them here. They'll
	// only be added to the misys object in modes DEBUG and DEBUG_ALL
	
	var _slideshowTimer,
		_slideshowIndex;
	d.mixin(misys, {
			
		_getFieldsInError : function( /*String | DomNode*/ formId){
			// summary:
			//		Utility function that returns all fields currently in error
			// description:
			//		A similar function was removed from the dijit.form.Form object in
			//		Dojo 1.6. It was useful for debug purposes, so this is our own version.
			//
			//		If you don't pass in an id/DomNode, we use fakeform1, so its usually
			//		enough to call misys._getFieldsInError();
			// tags:
			//		pseudo-private
			
			var id = formId || "fakeform1",
				form = dj.byId(id),
				fields = [];
			
			if(form) {
				d.forEach(form.getDescendants(), function(w) {
					if(w.state === "Error") {
						fields.push(w);
					}
				});
				
				if(fields.length > 0) {
					console.debug("[misys._bootstrap]", fields.length, "field(s) are in error");
					d.forEach(fields, function(w){
						console.debug(w.id, w);
					});
					return;
				}
				
				console.debug("[misys._bootstrap] No fields are in error");
			}
			
			return;
		},
		
		_availableThemes : ["demobank", "misys", "ceylan"],
		
		_setTheme : function setTheme(theme) {
			// summary:
			//	Quick & dirty function to change the theme on-the-fly.
			//
			// description: 
			//	This is *not* a replacement for a proper test, but is meant to give you an idea of 
			//	your CSS changes, across all themes, without having to restart MTP.
			//
			//  Note this *only* works in Chrome and Firefox
			
			if(d.indexOf(m._availableThemes, theme) !== -1) {
				var body = d.body();
				m.animate("fadeOut", body, function(){
					dojo.attr(dojo.query("link")[0], "href",
							m._config.context +
							"/content/js-src/misys/themes/" +
							theme + "/" + theme + ".css?v=" + Math.floor(Math.random()*100));
					dojo.attr(body, "class", "claro base " + theme);
					setTimeout(function(){
						m.animate("fadeIn", body);
					}, 500);
				});
			} else {
				console.warn("The theme " + theme + " is not in the list of avilable themes." + 
							  " Consult misys._availableThemes in _bootstrap.js");	
			}
		},
		
		_startSlideshow : function() {
			m._stopSlideshow();
			_slideshowTimer = setInterval(function(){
				if(!_slideshowIndex || _slideshowIndex === m._availableThemes.length) {
					_slideshowIndex = 0;
				}
				m._setTheme(m._availableThemes[_slideshowIndex++]);
			}, 10000);
		},
		
		_stopSlideshow : function() {
			if(_slideshowTimer) {
				clearInterval(_slideshowTimer);
			}
		}
	});	
})(dojo, dijit, misys);