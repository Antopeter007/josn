dojo.provide("misys.grid._base");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary: 
// 		Functions for grids
//
// description:
// 		Common methods for grid/list actions. Should be loaded first, as
// 		it creates the initial m.grid object
//
// version:   1.2
// date:      24/03/2011
// author:    Cormac Flynn

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.currency");
dojo.require("dojo.fx");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _processRecords( /*Dijit._widget | Array of grids*/ grids,
							  /*String*/ url,
							  /*String*/ keys,
							  /*Function*/ handleCallback) {
		// summary: 
		//		Process records
	    // description: 
		//		The parameters to pass to xhrGet, the url, how to handle it,
		// 		and the callbacks.
		
		grids = d.isArray(grids) ? grids : [grids];
		
		var 
			urlParams = {
				"list_keys": keys
			},
			targetNode = d.byId("batchContainer"),
			xhrArgs;
		
		if(dj.byId("reauth_password")) {
			d.mixin(urlParams, {
				"reauth_password" : dj.byId("reauth_password").get("value")
			});
		}
		
		xhrArgs = {
				url: m.getServletURL(url),
				handleAs: "text",
				sync : true,
				content: urlParams,
				load: function(data){
					// Replace newlines with nice HTML tags.
					data = data.replace(/\n/g, "<br>");
		
					// Replace tabs with spaces.
					data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
					targetNode.innerHTML = data;
		
					 setTimeout(function(){
				        	m.animate("wipeIn", "batchContainer");
					    }, 500);
		
					// Deselect all rows & rerender grids
					m._config.groups = [];
					d.forEach(grids, function(g){
						// Reload data
						g.setStore(g.store);
						d.hitch(g, "render")();
		   
						// Clear selection once data fetch complete
						m.connect(g, "_onFetchComplete", function(){
							g.selection.clear();
						});
					});
		        }
		};
		
		if (handleCallback)
		{
			d.mixin(xhrArgs, {handle: handleCallback});
		}	   

		// Call the asynchronous xhrPost
		m.xhrPost(xhrArgs);
	}
	
	//Holidays And CutOffTime Error Dialog With Auto Forward Operation
	/**
	 * <h4>Summary:</h4>
	 * This method is for showing error dialog for the holiday and cutoff time error.
	 * @param {String} mode
	 * @param {boolean} autoFormwardEnabled
	 * @method _showHolidaysNCutOffTimeErrorDialog
	 */
	function _showHolidaysNCutOffTimeErrorDialog(/*boolean*/autoForwardEnabled, /*String*/ message, /*boolean*/ reauthEnabled , xhrParams)
	{	
   	 	var mode = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
   	 	var autoForwardButton  = dijit.byId("forwardHolidayButtonId") ? dijit.byId("forwardHolidayButtonId") : new dj.form.Button({label:m.getLocalization("autoForwardMessage"),id:"forwardHolidayButtonId"});
   	 	//if holidayCutOffDialog not defined
   	 	if(!dj.byId("holidayCutOffDialog"))
   	 	{
   	 		d.require('misys.widget.Dialog');
			d.require('dijit.form.Button');
			
			//Create a dialog
			var dialog = new dj.Dialog({id: 'holidayCutOffDialog',
			    title: 'Confirmation',draggable: false});
			
			//Create dialog content
			var dialogContent = d.create("div", { id: "holidayCutOffDialogContent"});
			var dialogText = d.create("div", {id:"dialogHolidayText"},dialogContent,'first');
			var dialogButtons =   d.create("div",{id:"holidayCutOffDialogButtons",style:"text-align:center;"},dialogContent,'last');
			
			//Cancel Button
			var cancelButton  = new dj.form.Button({label:m.getLocalization("cancelMessage"),id:"cancelHolidayButtonId"});
			
			d.place(cancelButton.domNode,dialogButtons);
			dialog.set("content", dialogContent);
   	 	}
   	 	
		var holidayDialog = dj.byId("holidayCutOffDialog");
		if(autoForwardEnabled === true)
		{
			d.place(autoForwardButton.domNode,d.byId("holidayCutOffDialogButtons"),'first');
			m.dialog.connect(dj.byId('forwardHolidayButtonId'), 'onClick', function(){
				if(reauthEnabled)
				{
					holidayDialog.hide();
					m._config.doReauthSubmit(xhrParams);
					autoForwardButton.destroy();
				}
				else
				{
					holidayDialog.hide();
					m.xhrPost (xhrParams);
					setTimeout(d.hitch(grid, "render"), 100);
				}
			}, holidayDialog.id);
		}
		else
		{
			autoForwardButton.destroy();
			//dojo.destroy("forwardHolidayButtonId");
		}
		//Set the Error into the Dialog
		if(d.byId("dialogHolidayText"))
		{
			d.byId("dialogHolidayText").innerHTML = message;
			d.byId("dialogHolidayText").innerHTML =  d.byId("dialogHolidayText").innerHTML.replace(/\,/g,"");
		}
		// Disable window closing by using the escape key
		m.dialog.connect(holidayDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode == d.keys.ESCAPE) {
				d.stopEvent(evt);
			}
		});
		
		//Dialog Connects
		
		m.dialog.connect(dj.byId('cancelHolidayButtonId'), 'onClick', function(){
			m.dialog.hide();
			autoForwardButton.destroy();
			holidayDialog.hide();
		}, holidayDialog.id);
		
		//On Hide of Dialog
		m.dialog.connect(holidayDialog, 'onHide', function() {
			autoForwardButton.destroy();
			m.dialog.disconnect(holidayDialog);
			m.dialog.hide();
		});
		
		//Show the Dialog
		holidayDialog.show();
	}
	
	//Excluding operations to skip traversing to first page in case of Pagination change
	/**
	 * <h4>Summary:</h4>
	 * This method returns boolean value based on excluding operations to skip traversing to first page in case of Pagination change
	 */
	function _isNotExcludedOperationTraversingToFirstPage()
	{
		var isNotExcludedOperation = true;
		if(dijit.byId('operation') && dijit.byId('operation').get('value') === "LIST_FX_DEALS")
		{
			isNotExcludedOperation = false;
		}	
		return isNotExcludedOperation;
	}

	//
	// Public functions & variables
	//
	m.grid = m.grid || {};
	d.mixin(m.grid, {
		setStore : function( /*Json store*/ storeJson, 
							 /*Obj*/ ioArgs, 
							 /*Dijit._widget*/ gridObj) {
			// summary:
			//		Sets the store on a grid
			//
			// @deprecated should be removed in favour of DataStores defined in the
			// HTML, and attached to the DataGrid via the store attribute
			
			var grid = gridObj || ioArgs.args.grid,
				store;
			if(grid) {
				store = grid.store;
				if (store && store != null) {
					store.close();
				}
				
				console.debug("[misys.grid._base] Setting the gridstore of grid", grid.id);
				grid.setStore(new dojo.data.ItemFileReadStore({
					data: storeJson,
					urlPreventCache: true,
					clearOnClose: true
				}));
			}
		},
		
		setStoreURL : function( /*Dijit._widget || String*/ node,
                    			/*String*/ url,
                    			/*Object*/ queryOptions) {
			// summary:
			//	Sets the url on the given grid.
			//
			// description:
			//	Set a url on a grid and refreshes its content. The first time this is called, 
			//  the store will be created. Subsequent calls will close the store and refresh the 
			//	grid.
			//
			//	Note that the url parameter is optional. Called without, the grid will be
			//  refreshed using whatever store it is already linked to
			
			var grid = dj.byId(node),
				gridURL, gridQueryOptions,
			    store;
			if(grid) {
				store = grid.store;
				if(store) {
					gridURL = url || store.url;
					gridQueryOptions = queryOptions || grid.queryOptions;
					store.close();
					store.url = gridURL;
					if (store.declaredClass === 'dojox.data.QueryReadStore') {
						grid.setStore(store, queryOptions);
					} else {
						grid.setStore(store, null, queryOptions);					
					}
				} else {
					grid.setStore(new misys.data.ItemFileReadStore({
						url: url,
						urlPreventCache: true,
						clearOnClose: true
					}), null, queryOptions);
				}
			}
		},		
		
		filter : function( /*Dijit._widget || DomNode || String*/ node,
                		   /*Array*/ jsonKeys,
                		   /*Array*/ fieldIds) {
			//  summary:
			//            Filters a grid where jsonKeys[i] is the json key and
			//            dj.byId(fieldIds[i]).get('value') is the corresponding value.
			//
			// TODO Extend for QueryReadStore case

			var grid = dj.byId(node),
				filterString = [],
				field;
			
			if(grid && (jsonKeys.length === fieldIds.length)) {
				d.forEach(jsonKeys, function(key, i){
					field = dj.byId(fieldIds[i]);
					if(field) {
						var fieldValue = field.get("value");
						fieldValue = fieldValue.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
						if(fieldValue !== ""){
							filterString.push(key, ":'", fieldValue, "',");
						}
					}
				});
				
				filterString = filterString.join("");
				if(filterString.charAt(filterString.length -1) === ",") {
					filterString = filterString.substring(0,  filterString.length);
				}

				console.debug("[misys.grid._base] Filtering grid", grid.id,
						"with filter string", filterString.substring(0, filterString.length-1));
				// Mixin with existing queryOptions that may contain url parameters 
				grid.queryOptions = d.mixin(grid.queryOptions, {ignoreCase: true});
				grid.filter(d.fromJson("{" + filterString.substring(0, filterString.length-1)+"}"),true);
			}
		}, 
		
		selectAll : function() {
			// summary:
			//    
			// TODO Not yet transitioned to Dojo
			
			var blnChecked = d.byId("select_all_box").checked,
			    checkList = d.query("input[type=checkbox]");
			
			for(var x = 0, len=checkList.length; x < len; x++) {
				 checkList[x].checked = blnChecked;
			}
		},
		
		reloadForSearchTerms : function() {
			// summary: 
			//
			
			var form = dj.byId("TransactionSearchForm"),
				grids = d.query(".dojoxGrid"),
				gridContainer = d.query(".gridContainer")[0],
				dateRegex = /Date/,
				timeRegex = /Time/,
				queryOptions = {},
				store, baseURL, grid;

			// Find the first grid that doesn't have the .noReload class
			// This is to prevent loading grids that don't take search terms (in the rare
			// case where these is more than one grid in the page. An example is the "Open Account"
			// folder screen)
			
			for(var i = 0, len = grids.length; i < len; i++) {
				if(!d.hasClass(grids[i], "noReload")) {
					grid = dj.byId(grids[i].id);
					break;
				}
			}
			
			if(grid && form) {
				
				// Always goto the first page after reload
				if(dojo.isFunction(grid.gotoFirstPage) && _isNotExcludedOperationTraversingToFirstPage()){
					grid.gotoFirstPage();				
					}
				// Collect the search form field values as a JSON object
				
				// show the grid, if hidden
				if(gridContainer) {
					d.removeClass(gridContainer, "notready");
				}
				

				if(d.byId("divResults")){
					   d.style("divResults", "margin", 0);
				}

				store = grid.get("store");
				m.connect(grid, "_onFetchComplete", function(){
					setTimeout(function(){
						grid.resize();
					}, 500);		 			
				});
				baseURL = store.url;
				if(baseURL.indexOf("&") !== -1) {
					baseURL = baseURL.substring(0, baseURL.indexOf("&"));
				}
				if(baseURL.indexOf("EventsSearchAction") !== -1)
				{
				   if(baseURL.indexOf("?") !== -1) 
				   {
				   baseURL = baseURL.substring(0, baseURL.indexOf("?"));
				   }
				}
				
				form.getDescendants().forEach(function(field, i){
					if(field.name) {
						var value ;
						// special case if the field is a radio button
						if(field.declaredClass == 'dijit.form.RadioButton')
						{
							var radioDomNodes = dojo.query("[name='" + field.name + "']", form.domNode);
							// iterate through radio buttons
							d.some(radioDomNodes, function(radioDomNode){
								var radioWidget=dj.byNode(radioDomNode.parentNode);
								// if the radio button checked get its value
								if(radioWidget.checked)
								 {
									value = radioWidget.params.value;
								 }
								
							});
						}
						else
						{
							value = field.get("value");
						}
						if(dateRegex.test(field.declaredClass) || (timeRegex.test(field.declaredClass))) {
							value = field.get("displayedValue");
						}
						if(value === " ") {
							value = "";
						}
						queryOptions[field.get("name")] = value;
					}
				});
				queryOptions["searchFlag"] = true;
				
				//On search action the clean script should be call.
				var script = grid.onSelectionClearedScript;
				if (script){
				console.debug("[misys.grid._base] eval:", script);
				d.eval(script);
				}
				
				// If selectionMode not null, deselect all first then load new store
				// It is important to deselect first because listener may need store before 
				// it is discarded
				if (grid.selection && grid.get("selectionMode") !== "") {
					grid.selection.clear();
				}
						
				store.close();
				store.url = baseURL;
				console.debug("[misys.grid._base] Resetting grid store URL to", store.url, queryOptions);
				if(queryOptions.list_keys)
				{
					queryOptions.list_keys = "";
				}
				if (store.declaredClass === 'dojox.data.QueryReadStore'){
					grid.setStore(store, queryOptions);
				} else {
					grid.setStore(store, null, queryOptions);					
				}
			}
		},
		
		onSelection : function() {
			//  summary:
		    //            Execute Script
			//
			//	TODO	remove use of eval here 
			
			if (this.selection.selectedIndex!=-1) {
				var script = this.store.getValue(this.getItem(this.selection.selectedIndex), 
						"onSelectionChangedScript");
				console.debug("[misys.grid._base] eval:", script);
				d.eval(script);
				this.updateRowStyles(this.selection.selectedIndex);
			} 
			
		},
		
		getCellData : function(item, field){
			// TODO Why is this a function? Shouldn't it just be called directly?
			console.debug("[misys.grid._base] get cell data (usage?) from: ", item, ", ", field); 
			return this.grid.store.getValue(item, field);
		},
		
		formatJSLink : function( /*String*/ result) {
			//  summary:
			//    		Formats an URL in a column. The data is taken from misys.grid.getURL.
			
			return (result && d.isObject(result)) ? d.string.substitute(
					"<a href='javascript:${href}'>${text}</a>", 
					result) : result;
		},

		formatSelectField : function(rowIndex, item) {
			//
			// summary:
			//	Generates select box in a column. The "box" field contains the reference.
			//
			// TODO rowIndex param is unused
			// TODO Should use d.create to create the select box. Anyway, shouldn't
			//      it be a Dijit?
			
			if(!item) {
				return this.defaultValue;
			}
			var reference = this.grid.store.getValue(item, "box_ref"),
				checked = this.grid.store.getValue(item, "box_checked") === "true";
			return "<input id='" + value + "' name='" + value +
					 "' onclick='alert('To implement')' type='checkbox' " + checked ? 
					 "checked='checked'" : "";
		},

		formatGroupsAndAggregates : function(result, idx) {
			// summary:
			//		Formats a group footer.
			if (result) {
				return m.grid.formatHTML(result);
			} else {
				return result;
			}
		},
		
		formatSimpleHTML : function(/*String*/ text) {
			   // summary: 
			   //		Formats the content, replacing a limited number of low risk entities with
			   //       their HTML equivalents.

			   text = text.replace(/&amp;nbsp;/g, "&nbsp;");
			   text = text.replace(/&amp;#x27;/g, "&#x27;");
			   text = text.replace(/&amp;#x2F;/g, "&#x2F;");
			   text = text.replace(/&amp;#34;/g, "&#34;");
			   text = text.replace(/&amp;#x28;/g,"(");
			   text = text.replace(/&amp;#x29;/g,")");
			   text = text.replace(/&amp;#x26;/g,"&");
			   return text.replace(/&amp;amp;/g, "&amp;");
		},
		
		formatHTML : function( /*String*/ text) {
		    // summary: 
			//			Formats content containing HTML elements such as <img>. Should *only*
		    //          be used on grid cells containing trusted data.
		    //          
			// TODO Replace with more robust regular expressions
			/*text = text.replace(/&lt;img/g, "<img");
			text = text.replace(/&lt;input/g, "<input");
			text = text.replace(/&lt;span/g, "<span");
			text = text.replace(/&lt;\/span/g, "</span");
			text = text.replace(/&lt;div/g, "<div");
			text = text.replace(/&lt;\/div/g, "</div");
			text = text.replace(/&lt;table/g, "<table");
			text = text.replace(/&lt;\/table/g, "</table");
			text = text.replace(/&lt;tr/g, "<tr");
			text = text.replace(/&lt;\/tr/g, "</tr");
			text = text.replace(/&lt;i&gt;/g, "<i>");
			text = text.replace(/&lt;\/i&gt;/g, "</i>");
			text = text.replace(/&lt;i>/g, "<i>");
			text = text.replace(/&lt;\/i>/g, "</i>");
			text = text.replace(/&lt;a/g, "<a");
			text = text.replace(/&lt;\/a>/g, "</a>");
			text = text.replace(/&lt;br/g, "<br");
			text = text.replace(/&gt;/g, ">");
			
			return m.grid.formatSimpleHTML(text);*/
			return text;
		},
		/**
		 * <h4>Summary:</h4>
		 * Encodes the content containing HTML elements for UI
		 * only.
		 * <h4>Description:</h4>
		 * This method will encodes the input content containing
		 * HTML elements for UI only.
		 * 
		 * @param {String}
		 *            text
		 * @method sanitizeHTMLDataForUI
		 * @return {String} Returns sanitized text
		 */
		sanitizeHTMLDataForUI : function( /*String*/ text) {
			if(text) {
				text = text.replace(/<img/g, "&lt;img");
				text = text.replace(/>/g, "&gt;");
			}
			return text;
		},
		/**
		 * <h4>Summary:</h4>
		 *  HTML type Integer for DataGridHeader Formatter. Function returns the integer number
		 */
		formatHTMLInteger : function( /*Integer*/ number) {
		   
			return number;
		},

		formatDate : function(/*String*/ dateString){
			var startindex = dateString.indexOf(">");
			var endIndex = dateString.indexOf("<", 1);
			return dateString.substring(startindex+1, endIndex);
		},
		
		formatFlagImage : function( /*String*/ flagName) {
			// summary: 
			//		format a flag in a rates grid
			//
			// TODO Should create an image with dojo.create
			var flag = flagName.toLowerCase();
			if(misys._config.fbccVersion!=="" || misys._config.fbccVersion !== null)
			{
				return m.grid.formatHTML("<img src='" + m.getContextualURL(m._config.imagesSrc + "flags/") + 
						flag + ".png?v=" +misys._config.fbccVersion+"'alt='" +flag+ "'/>");
			}
			else
			{
				return m.grid.formatHTML("<img src='" + m.getContextualURL(m._config.imagesSrc + "flags/") + 
						flag + ".png' alt='" +flag+ "'/>");
			}
			
		},
		
		formatCurrencyFlagImage : function( /*String*/ curCode) {
			// summary: 
			//		format a flag in a lisdef screen 
			//
			var	flag = curCode.toLowerCase().substring(0, 2);
			if(misys._config.fbccVersion!=="" || misys._config.fbccVersion !== null)
			{
				return m.grid.formatHTML("<img src='" + m.getContextualURL(m._config.imagesSrc + "flags/") + 
						flag + ".png?v=" +misys._config.fbccVersion+"'alt='" +flag+ "'/>");
			}
			else
			{
				return m.grid.formatHTML("<img src='" + m.getContextualURL(m._config.imagesSrc + "flags/") + 
						flag + ".png' alt='" +flag+ "'/>");
			}
		},

		formatSummary : function (value, rowIdx, cell, sing, plur) {
			// summary:
			//    TODO
			
			if(value === 0) {
				return "";
			}
			var str;
			if(rowIdx >= 0) {
				return value;
			}
			if(rowIdx === -1) {
				str = m.getLocalization("totalPrefix") + " (${numItems} ${displayName})";
			}else{
				str = "${numItems} ${displayName}";
			}
			return d.string.substitute(str, {numItems: value, 
						displayName: (value === 1) ? sing : plur});			
		},

		formatOperationsSummary : function (value, rowIdx) {
			// summary:
			//
			
			return m.grid.formatSummary(value, rowIdx, this, "Operation", "Operations");
		},

		formatTypesSummary : function (value, rowIdx) {
			// summary:
			//
			
			return m.grid.formatSummary(value, rowIdx, this, "Type", "Types");
		},

		formatDataSummary : function (value, rowIdx) {
			// summary:
			//  TODO
			
			return (value === 0) ? "" : value;
		},

		formatTitlesSummary :function (value, rowIdx){
			// summary:
			//	TODO
			
			return m.grid.formatSummary(value, rowIdx, this, "Title", "Titles");
		},

		formatURL : function(result) {
			//	summary:
			//		Formats an URL in a column. The data is taken from m.grid.getURL.
			// TODO Shouldn't use strings to build HTML 
			
			if(!window.isAccessibilityEnabled) {
				return (result && d.isObject(result)) ? d.string.substitute(
						"<a href='${href}'>${text}</a>", 
						result) : result;
			} else {
				var linkText = misys.getLocalization('link');
				return (result && d.isObject(result)) ? d.string.substitute(
								"<a href='${href}' aria-labelledby='${href}_link_span'>${text}</a><span class='sr-only' id='${href}_link_span'>"+linkText+"</span>", 
								result)  : result;
			}
		},
		
		formatReportActions : function(rowIndex, item, cell) {
			//  summary:
			//          Generate the HTML containing the different possible actions in a grid.

			// TODO Temporarily named this until we establish which formatActions function is
			//	the appropriate one to use
			var displayMode=cell.grid.gridMultipleItemsWidget.overrideDisplaymode;
			
			var divId = cell.grid.gridMultipleItemsWidget.id;
			
			var parent=dojo.create('div');
				
			var div=dojo.create('div',{'class':'gridActions'},parent);
			
			if (displayMode && displayMode=='view')
			{
				dojo.create ('img',{'src': misys._config.context + misys._config.imagesSrc + "pic_text.gif" , 'alt' : 'View', border : '0',	'type' : 'view'},div);
			}
			else
			{
				dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.editIcon),'title':'Edit','alt':'Edit','border' : '0', 'type': 'edit'},div);
				dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.deleteIcon),'title':'Delete','alt':'Delete','border' : '0', 'type': 'remove'},div);
				if(divId === 'columns') 
				{
					dojo.create ('img',{'src': misys._config.context + misys._config.imagesSrc + "action-up.png" , 'alt' : 'Move Up', border : '0',	'type' : 'moveup'},div);
					dojo.create ('img',{'src': misys._config.context + misys._config.imagesSrc + "action-down.png" , 'alt' : 'Move Down', border : '0',	'type' : 'movedown'},div);
				}

			}
			
			return parent.innerHTML;
			
		},
		
		/*
		 * Grid actions only with edit and view option in case of Accounts
		 */
		formatAccountActions : function(rowIndex, item, cell)
		{	
			var displayMode=cell.grid.gridMultipleItemsWidget.overrideDisplaymode;
			var divId = cell.grid.gridMultipleItemsWidget.id;
			var parent=dojo.create('div');
			var div=dojo.create('div',{'class':'gridActions'},parent);
			if (displayMode && displayMode=='view')
			{
				dojo.create ('img',{'src': misys._config.context + misys._config.imagesSrc + "pic_text.gif" , 'alt' : 'View', border : '0',	'type' : 'view'},div);
			}
			else
			{
				dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.editIcon),'title':'Edit','alt':'Edit','border' : '0', 'type': 'edit'},div);
			}
			return parent.innerHTML;
		},
		
		/*
		 * Grid actions only with delete option
		 */
		formatDeleteActions : function(rowIndex, item, cell) {
			//  summary:
			//          Generate the HTML containing the different possible actions in a grid.

			// TODO Temporarily named this until we establish which formatActions function is
			//	the appropriate one to use
			var displayMode=cell.grid.gridMultipleItemsWidget.overrideDisplaymode;
			var parent=dojo.create('div');
			var div=dojo.create('div',{'class':'gridActions'},parent);
			dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.deleteIcon),'alt':'Delete','border' : '0', 'type': 'remove'},div);	
			return parent.innerHTML;
		},	
		/*
		 * Grid actions only with counterparty delete option
		 */
		formatCptyDeleteActions : function(rowIndex, item, cell) {
			//  summary:
			//          Generate the HTML containing the different possible actions in a grid.

			// TODO Temporarily named this until we establish which formatActions function is
			//	the appropriate one to use
			var displayMode=cell.grid.gridMultipleItemsWidget.overrideDisplaymode;
			var parent=dojo.create('div');
			var div=dojo.create('div',{'class':'gridActions'},parent);
			if(cell.grid._by_idx[item] && cell.grid._by_idx[item].item && cell.grid._by_idx[item].item.cpty_showDelete[0] && cell.grid._by_idx[item].item.cpty_showDelete[0]==="true")
			{
				dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.deleteIcon),'alt':'Delete','border' : '0', 'type': 'remove'},div);
			}			
			return parent.innerHTML;
		},		
		formatActions : function(result) {
			// summary:
			//		Format actions in a column. The data is taken from m.grid.getActions
			
			return (result && d.isObject(result) ? result.href : result);
		},
		
		confirmDeleteRecords : function( /*Dojox Grid*/ grid,
									  	 /*String*/ url) {
			// summary:
			//	TODO
			
			var numSelected = grid.selection.getSelected().length;
			var storeSize	= grid.store._items.length;
			if(numSelected > 0 && storeSize > 0) {
				m.dialog.show("CONFIRMATION", 
						m.getLocalization("deleteTransactionsConfirmation", 
								[grid.selection.getSelected().length]), "", 
								function(){ m.grid.processRecords(grid, url);});
			} else {
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			}
		},
		
		confirmSubmitRecords: function( /*Dojox Grid*/ grid,
									  	 /*String*/ url) {
			// summary:
			//	TODO
			var numSelected = grid.selection.getSelected().length;
			var storeSize	= grid.store._items.length;
			if(numSelected > 0 && storeSize > 0) 
			{
				m.dialog.show("CONFIRMATION", 
						m.getLocalization("submitTransactionsConfirmation", 
								[grid.selection.getSelected().length]), "", 
								function(){ m.grid.processRecordsWithHolidayCutOffValidation(grid, url);});
			} 
			else 
			{
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			}
		},
		
		confirmResendRecords: function( /*Dojox Grid*/ grid,
										/*String*/ url) {
		 	// summary:
		 	//      TODO
		 	var numSelected = grid.selection.getSelected().length;
		 	var storeSize   = grid.store._items.length;
		 	if(numSelected > 0 && storeSize > 0) {
		 		m.dialog.show("CONFIRMATION",
		 				m.getLocalization("resendTransactionsConfirmation",
		 						[grid.selection.getSelected().length]), "",
		 						function(){
		 			setTimeout(function(){
		 				m.grid.processRecords(grid, url);
		 			}, 100);});
		 		//processRecordsWithHolidayCutOffValidation(grid, url);
		 	} else {
		 		m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
		 	}
		},
		
		/*
		 * Grid actions only with cancel option
		 */
		confirmCancelRecords : function( /*Dojox Grid*/ grid,
						  	 /*String*/ url, /*String*/ viewRecords) {
			// summary:
			//	TODO
			
			var targetNode = d.byId("batchContainer"), 
			items = grid.selection.getSelected(),
			strListKeys = "",
			intNbKeys = 0,
			reference, xhr,
			isValid = true;
			var reauth = dj.byId("reauth_perform");
			m.animate("wipeOut", targetNode);
			
			if(items.length) 
			{
				// Iterate through the list of selected items.
				d.forEach(items, function(selectedItem) {
					// extract the reference
					reference = grid.store.getValues(selectedItem, "box_ref");
					
					// separator
					if("S" + strListKeys != "S"){ strListKeys = strListKeys + ",";}
					strListKeys = strListKeys + reference;
					intNbKeys++;
				}); // end forEach
				
				if(intNbKeys > 0)
				{
					var callBack = function()
								   {
										var xhrParams	= {
														      url: m.getServletURL(url),
														      handleAs: "text",
														      content: {list_keys: strListKeys},
														      load: function(data)
														      {
															        // Replace newlines with nice HTML tags.
															        data = data.replace(/\n/g, "<br>");
										
															        // Replace tabs with spaces.
															        data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
															        
															        targetNode.innerHTML = data;
															        
															        m.animate("wipeIn", "batchContainer");
															        
															        // Deselect all rows
															        grid.selection.clear();
															        grid.setStore(grid.store);
														      }
										                };
										
										var fncCallBack = function()
											{
												m.xhrPost (xhrParams);
												setTimeout(d.hitch(grid, "render"), 100);
											};
										if((reauth && reauth.get('value') === "Y") && d.isFunction(m._config.doReauthSubmit))
										{
											m._config.doReauthSubmit(xhrParams);
										}
										else
										{
											fncCallBack();
										}
								   };
					m.dialog.show("CONFIRMATION", m.getLocalization("cancelledTransactionsConfirmation",[grid.selection.getSelected().length]),'',callBack);
				}
			}
			else
			{
				m.dialog.show('ERROR', m.getLocalization('noTransactionsSelectedError'));
			}
		},
	
		confirmForwardRecords : function( /*Dojox Grid*/ grid, 
									  	  /*String*/ url) {
			// summary:
			//		TODO
			
			var numSelected = grid.selection.getSelected().length;
			if(numSelected > 0) {
				m.dialog.show('CONFIRMATION', 
						m.getLocalization('forwardsTransactionConfirmation', 
											[grid.selection.getSelected().length]), 
											'', function(){
												m.rocessRecords(grid, url);
											}
				);
			} else {
				m.dialog.show('ERROR', m.getLocalization('noTransactionsSelectedError'));
			}
		},
		

		processRecordsWithHolidayCutOffValidation : function( /*Dojox Grid*/ grid, /*String*/ url) {
			// summary:
			//		Triggers the submission of transaction records along with holiday cut-off validation.
			// 		Also promts user to Auto Forward Dates with Holiday-CutOff Validation Fails
			
			var targetNode = d.byId("batchContainer"), 
			items = grid.selection.getSelected(),
			strListKeys = "",
			intNbKeys = 0,
			reference, xhr,
			isValid = true, autoForwardTransactionDetails,failedTransactionDetailsHolidays,failedTransactionDetailsCutOff,autoForwardEnabled;
			var details = [];
			
			
			m.animate("wipeOut", targetNode);
			var reauth = dj.byId("reauth_perform");
			if(items.length) 
			{
				// Iterate through the list of selected items.
				d.forEach(items, function(selectedItem) {
					// extract the reference
					reference = grid.store.getValues(selectedItem, "box_ref");
					
					// separator
					if("S" + strListKeys != "S"){ strListKeys = strListKeys + ",";}
					strListKeys = strListKeys + reference;
					intNbKeys++;
				}); // end forEach
				
				if(intNbKeys > 0)
				{
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/ValidateHolidayCutOffMultipleSubmission"),
						handleAs : "json",
						preventCache : true,
						sync : true,
						content: {list_keys: strListKeys},
						load : function(response, args){
							autoForwardEnabled = response.autoForwardEnabled;
							isValid = response.isValid;
							autoForwardTransactionDetails = response.autoForwardTransactionDetails;
							failedTransactionDetailsCutOff = response.failedTransactionDetailsCutOff;
							failedTransactionDetailsHolidays = response.failedTransactionDetailsHolidays;
						},
						error : function(response, args){
							console.error("[misys.grid._base] processRecordsWithHolidayCutOffValidation error", response);
						}
					});
				
					if(isValid)
					{
						var xhrParams	= {
							      url: m.getServletURL(url),
							      handleAs: "text",
							      content: {list_keys: strListKeys},
							      load: function(data)
							      {
								        // Replace newlines with nice HTML tags.
								        data = data.replace(/\n/g, "<br>");
			
								        // Replace tabs with spaces.
								        data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
								        
								        targetNode.innerHTML = data;
								        								        
								        // Deselect all rows
								        grid.selection.clear();
								        grid.setStore(grid.store);
								        
								        setTimeout(function(){
								        	m.animate("wipeIn", "batchContainer");
								        }, 1000);
							      }
							};
						var fncCallBack = function(){
							m.xhrPost (xhrParams);
							setTimeout(d.hitch(grid, "render"), 10000);
						};
						//If doReauthSubmit is overridden in client specific then doReauthSubmit will take the flow control
						
						if((reauth && reauth.get('value') === "Y") && d.isFunction(m._config.doReauthSubmit))
						{
							m._config.doReauthSubmit(xhrParams);
						}
						else
						{
							fncCallBack();
						}
					}
					else if(autoForwardEnabled && autoForwardEnabled === "N")
						{

						details = [];
						details.push("<div style='display:block;'>" + m.getLocalization("Cutoffdatepassed")+ "<br/>");
						
						d.forEach(autoForwardTransactionDetails,function(node){
							details.push("<li>"+node+"</li>");
						});
						
						details.push("</div>");
						//If doReauthSubmit is overridden in client specific then it will take the flow control 
						if((reauth && reauth.get('value') === "Y") && d.isFunction(m._config.doReauthSubmit))
						{
							fncCallBack = function(){m._config.doReauthSubmit(xhrParams);};
							m.dialog.show("CUSTOM-NO-CANCEL",details.join(''),'',fncCallBack);
						}
						else
						{
							m.dialog.show("CUSTOM-NO-CANCEL",details.join(''),'',callBack);
						}
					
						}
					else
					{
						details = [];
						if(autoForwardEnabled)
						{
							if (failedTransactionDetailsCutOff.length > 0)
							{
								details.push("<div <b>" + m.getLocalization("failedMultipleSubmissionCutOff")+ "</b><br/>");
								d.forEach(failedTransactionDetailsCutOff,function(node){
									details.push("<li>"+node+"</li>");
								});
								details.push("</div>");
							}
							if (failedTransactionDetailsHolidays.length > 0)
							{
								details.push("<div style='display:block;'><b>" + m.getLocalization("failedMultipleSubmissionHoliday")+ "</b><br/>");
								d.forEach(failedTransactionDetailsHolidays,function(node){
									details.push("<li>"+node+"</li>");
								});
								details.push("</div>");
							}
							details.push("<div style='display:block;'><b>" + m.getLocalization("autoForwardMultipleSubmission")+ "</b><br/>");
							details.push("</div>");
							xhrParams	=	{
									  url: m.getServletURL(url),
								      handleAs: "text",
								      content: {list_keys: strListKeys, autoForward: "Y"},
								      load: function(data)
								      {
									        // Replace newlines with nice HTML tags.
									        data = data.replace(/\n/g, "<br>");
				
									        // Replace tabs with spaces.
									        data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
									        
									        targetNode.innerHTML = data;
									        
									        m.animate("wipeIn", "batchContainer");
									        
									        // Deselect all rows
									        grid.selection.clear();
									        grid.setStore(grid.store);
							      	  }
							}; 
							
							//If doReauthSubmit is overridden in client specific then it will take the flow control 
							if((reauth && reauth.get('value') === "Y") && d.isFunction(m._config.doReauthSubmit))
							{
								_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled , details, true, xhrParams);
							}
							else
							{
								_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled, details , false ,xhrParams);
							}
						}
						else
						{
							if (failedTransactionDetailsCutOff.length > 0)
							{
								details.push("<div style='display:block;'><b>" + m.getLocalization("failedMultipleSubmissionCutOff")+ "</b><br/>");
								d.forEach(failedTransactionDetailsCutOff,function(node){
									details.push("<li>"+node+"</li>");
								});
							}
							if (failedTransactionDetailsHolidays.length > 0)
							{
								details.push("<div style='display:block;'><b>" + m.getLocalization("failedMultipleSubmissionHoliday")+ "</b><br/>");
								d.forEach(failedTransactionDetailsHolidays,function(node){
									details.push("<li>"+node+"</li>");
								});
							}
							_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled, details , false , xhrParams);
						}
					}
				}
			}
		},
		
		processDeletionOfBatch: function( /*Dojox Grid*/ grid, /*String*/ url) {
			// summary:
			//		Triggers the submission of transaction records along with holiday cut-off validation.
			// 		Also promts user to Auto Forward Dates with Holiday-CutOff Validation Fails
			
			var targetNode = d.byId("batchContainer"), 
			items = grid.selection.getSelected(),
			strListKeys = "",
			intNbKeys = 0,
			reference, xhr,
			isValid = true;
			
			m.animate("wipeOut", targetNode);
			
			if(items.length) 
			{
				// Iterate through the list of selected items.
				d.forEach(items, function(selectedItem) {
					// extract the reference
					reference = grid.store.getValues(selectedItem, "box_ref");
					
					// separator
					if("S" + strListKeys != "S"){ strListKeys = strListKeys + ",";}
					strListKeys = strListKeys + reference;
					intNbKeys++;
				}); // end forEach
				
				if(intNbKeys > 0)
				{
					var callBack = function(){
						m.xhrPost ({
							  url: m.getServletURL(url),
						      handleAs: "text",
						      content: {list_keys: strListKeys},
						      load: function(data)
						      {
							        // Replace newlines with nice HTML tags.
							        data = data.replace(/\n/g, "<br>");
		
							        // Replace tabs with spaces.
							        data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
							        
							        targetNode.innerHTML = data;
							        
							        m.animate("wipeIn", "batchContainer");
							        
							        grid.setStore(grid.store);
							        setTimeout(d.hitch(grid, "render"), 300);
					   
									// Clear selection once data fetch complete
									m.connect(grid, "_onFetchComplete", function(){
										grid.selection.clear();
									});
					      	  }
						});
					};
					m.dialog.show("CONFIRMATION",m.getLocalization("batchSelectedDelete"),'',callBack);
				}
			}
			else if (items.length === 0){
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			}
		},
		
		processBatchingOfRecords : function( /*Dojox Grid*/ grid, /*String*/ url) {
			// summary:
			//		Triggers the submission of transaction records along with holiday cut-off validation.
			// 		Also promts user to Auto Forward Dates with Holiday-CutOff Validation Fails
			
			var targetNode = d.byId("batchContainer"), 
			items = grid.selection.getSelected(),
			strListKeys = "",
			intNbKeys = 0,
			reference, xhr,
			isValid = true;
			
			m.animate("wipeOut", targetNode);
			
			if(items.length) 
			{
				// Iterate through the list of selected items.
				d.forEach(items, function(selectedItem) {
					// extract the reference
					reference = grid.store.getValues(selectedItem, "box_ref");
					
					// separator
					if("S" + strListKeys != "S"){ strListKeys = strListKeys + ",";}
					strListKeys = strListKeys + reference;
					intNbKeys++;
				}); // end forEach
				
				if(intNbKeys > 0)
				{
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/ValidateBatchCriteria"),
						handleAs : "json",
						preventCache : true,
						sync : true,
						content: {list_keys: strListKeys},
						load : function(response, args){
							isValid = response.isValid;
						},
						error : function(response, args){
							console.error("[misys.grid._base] processBatchingOfRecords error", response);
						}
					});
				
					if(!isValid)
					{
						m.dialog.show("ERROR",m.getLocalization("batchTransactionsError"));
					}
					else
					{
						m.xhrPost ({
						      url: m.getServletURL(url),
						      handleAs: "text",
						      sync : true,
						      content: {list_keys: strListKeys},
						      load: function(data)
						      {
							        // Replace newlines with nice HTML tags.
							        data = data.replace(/\n/g, "<br>");
		
							        // Replace tabs with spaces.
							        data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
							        
							        targetNode.innerHTML = data;
							        
							        // Deselect all rows
							        grid.selection.clear();
							        grid.setStore(grid.store);
							        
							        setTimeout(function(){
							        	m.animate("wipeIn", "batchContainer");
								    }, 3000);
							  }
						});
						
						setTimeout(d.hitch(grid, "render"), 100);
					}
				}
				
			}
			else if (items.length === 0){
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			}
		},

		processRecords : function( /*Dojox Grid || Array of Grids*/ grid,
								   /*String*/ url,
								   /*Function*/ handleCallback) {
			// summary:
			//		Triggers the submission of transaction records (msg = 22).
			// 
			//	TODO This appears to be only partially implemented
		    
			var grids = d.isArray(grid) ? grid : [grid],
				targetNode = d.byId("batchContainer"),
				items = [],
				keys = "",
				intNbKeys = 0,
				reference, xhrArgs;
				m.animate("wipeOut", targetNode);
			d.forEach(grids, function(grid){
				items = grid.selection.getSelected();
				if(items && items.length) {
					d.forEach(items, function(selectedItem) {
						// extract the reference
						reference = grid.store.getValues(selectedItem, "box_ref");

						// separator
						if(keys !== ""){
							keys += ", ";
						}
						keys += reference;
						intNbKeys++;
					});
				}
			});
			
			if(intNbKeys > 0) {
				// TODO This should be implemented properly
				_processRecords(grids, url, keys, handleCallback);
				/*if(true  fncShowConfirmation(22, intNbKeys) ) {
					 // Call the asynchronous xhrGet
				    var reauth = dj.byId("reauth_dialog");
					if(reauth) {
						m.dialog.connect("doReauthentication", "onClick", function(){
							_processRecords(grids, url, keys);
						});
						dj.byId("reauth_pwd").set("value", "");
						reauth.show();
					} else {
						_processRecords(grids, url, keys);
					}
				}*/
			}	
			grid.multipleSelectItems = new Object();
		},
		
		setListKey : function(/*Dijit._widget*/ grid) {
			var keys = "",
				items = grid.selection.getSelected(),
				intNbKeys = 0,
				listkey = dj.byId("list_keys"),
				reference;
				
			if(items.length) {
				d.forEach(items, function(selectedItem) {
					reference = grid.store.getValues(selectedItem, "box_ref");

					if(intNbKeys !== 0){ 
						keys += ",";
					}
					
					keys += reference;
					intNbKeys++;
				});

			}

			if (listkey && listkey != null){
				listkey.set("value", keys);
			}
			
			if (intNbKeys === 0 && 
					dj.byId("export_list") && 
					dj.byId("export_list").get("value") === "zip"){
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
				e.preventDefault();
			}
		},

		beforeRow : function(rowIndex, cells) {
			// summary:
			//		
			// Description: 
			//	cells is an array of subRows. we hide the summary subRow except for every nth
			//  row should hide the normal row and the group row according to the row's values
			if (cells.length >= 2)
			{
				//Fixed as part of MPS-45351, in case of grouping, values like group-0 and group-1 were added while creating the grid.
				//In case of delayed response from Server side these values (group-0, group-1) which are for internal processing were displayed instead of actual data.
				//To stop these values showing up in the rows, the rows containing these values are hidden initially and later loaded when the actual data load into the grid.
				if(cells[1] && !cells[1].hidden)
				{
					cells[1].hidden = true;
				}
				if (rowIndex === -1) {
					if (!cells.headerDisplayed) {
						cells.headerDisplayed = true;
					} else {
						cells[1].hidden = true;
						if (cells.length === 3) {
							cells[2].hidden = true;
						}
					}
				} else {
					var item = this.grid.getItem(rowIndex);
					if (item) {
						var rowType = this.grid.store.getValue(item, "_row_type");
						if (rowType === 2 || rowType === 3) {
							cells[1].hidden = false;
						} 
						else if (rowType === 4) {
							cells[1].hidden = false;
							cells[2].hidden = false;
						} 
						else {
							cells[1].hidden = true;
							if (cells.length === 3) {
								cells[2].hidden = true;
							}
						}
					} else {
						cells[1].hidden = true;
						if (cells.length === 3) {
							cells[2].hidden = true;
						}
					}
				}
			}
		},

		// TODO Should be in validations. Or grid validations? 
		validateSearchDateRange : function() {
			//  summary:
		    //        Validates the date range for a search screen. 
		    //  Description:
			//		  Expects the fields to be named "start" and "end"
	
			// TODO Move into validations/common
			
			var range = dj.byId("range").get("value"),
				start = dj.byId("startdate"),
				end = dj.byId("enddate"),
				diff = 0;
			
			if(start && end) {
				diff = d.date.difference(dj.byId("startdate").get("value"), 
						dj.byId("enddate").get("value"), "day");
			}	
			
		    var days;
		    if(range == 1)
		    {
		      days=31;
		    }
		    else
		    {
		      days=92;
		    }
		    if(diff < 0 || diff > days) {
		    var changed = false;
                if(range == 1){
                                m.connect("startdate", "onChange", function(){
                                if(!changed)
                                {
                                	var date1 = dojo.date.add(dj.byId("startdate").get("value"), "month", 1);
                                	dijit.byId('enddate').set('value', date1);
                                	changed=true;
                                }
                	           });
                	
                               m.connect("enddate", "onChange", function(){
                            	if(!changed)
                            	{   
                            		var date1 = dojo.date.add(dj.byId("enddate").get("value"), "month", -1);
                            		dijit.byId('startdate').set('value', date1);
                            		changed=true;
                            	}
                                });
                               }
                	           else if(range == 3)
                	           {
                	        	   m.connect("startdate", "onChange", function(){
                	        	   if(!changed)
                	        	   {
                	        		   var date1 = dojo.date.add(dj.byId("startdate").get("value"), "month", 3);
                	        		   dijit.byId('enddate').set('value', date1);
                	        		   changed=true;
                	        	   }
                               });
                               m.connect("enddate", "onChange", function()
                            	  {
                            	   if(!changed)
                            	   {
                            		   var date1 = dojo.date.add(dj.byId("enddate").get("value"), "month", -3);
                            		   dijit.byId('startdate').set('value', date1);
                            		   changed=true;
                            	   }
                               });
                               }
            else
            {
				
				this.invalidMessage = m.getLocalization("monthRangeValidityMessage", 
									[range, dj.byId("startdate").get("displayedValue")]);
				return false;
			} 
			}
			return true;
		},

		redirect : function( /*Grid Row Click Action*/ event){
			//  summary:
			//            Event called when you click on an item in the ongoing tasks table.

			// Retrieve the grid elements
			var grid = event.grid,
				item = grid.getItem(event.rowIndex),
				url = grid.store.getValue(item, "SCREEN");

			// Set the page URL
			if (url) {
				var prodCode = m.getQueryParameterByName('productcode', url);
				var subProductCode = m.getQueryParameterByName('subproductcode', url);
				console.debug('prodcut code is: ' + prodCode);
				console.debug('subProductCode is: ' + subProductCode);
				var angularUrl = [];
				if (misys._config.isBank === 'false' && misys._config.fccuiEnabled && misys._config.fccuiEnabled === 'true' && m.isAngularProductUrl(prodCode, subProductCode)) {
					angularUrl.push("/productScreen?");
					angularUrl.push("refId=", m.getQueryParameterByName('referenceid', url));
					angularUrl.push("&tnxId=", m.getQueryParameterByName('tnxid', url));
					angularUrl.push("&productCode=", prodCode);
					angularUrl.push("&subProductCode=", subProductCode);
					angularUrl.push("&mode=", m.getQueryParameterByName('mode', url));
					angularUrl.push("&tnxTypeCode=", m.getQueryParameterByName('tnxtype', url));
					angularUrl.push("&subTnxTypeCode=", m.getQueryParameterByName('subTnxTypeCode', url));
					window.location = m.getServletURL('').replace(/.$/,"#") + angularUrl.join("");
				} else {
					console.debug("[misys.grid._base] Redirecting to URL", url);
					window.location = url;
				}
			}
		},

		noSortOnSecondColumn : function( /*int*/ colIndex) {
			// summary: 
			//		Whether to sort a column in the rate table, all but column 2  
			//		(flags) should be sortable
			
			return Math.abs(colIndex) !== 2;
		},

		toggleExpandedList : function( /*String*/ id, 
				   /*Integer*/ limit) {
			// summary: 
			//		Expands or collapses a long <UL> list
			
			d.query("#"+id+" li").forEach(function(l, i){
				if(i >= limit) {
					d.toggleClass(l, "hide");
				}
			});
			d.toggleClass(id+"_show", "hide");
			d.toggleClass(id+"_hide", "hide");
		},

		noSortOnThirdColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 3;
		},

		noSortOnFourthColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 4;
		},

		noSortOnFifthColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 5;
		},

		noSortOnSixthColumn : function(/*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 6;
		},

		noSortOnSeventhColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 7;
		},

		noSortOnEighthColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 8;
		},
		
		noSortOnNinthColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 9;
		},
		
		noSortOnEleventhColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 11;
		},
		
		noSortOnThirteenthColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 13;
		},
		noSortOnThirdFourthAndFifthColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 3 && Math.abs(colIndex) !== 4 && Math.abs(colIndex) !== 5;
		},
		
		noSortOnAllColumns : function( /*int*/ colIndex){
			
			return false;
		},
		
		noSortOnThirdAndSeventhColumn : function( /*int*/ colIndex){
			// summary:
			//
			
			return Math.abs(colIndex) !== 3 && Math.abs(colIndex) !== 7;
		},

		noSortOnLastColumn : function( /*int*/ colIndex){
			   // summary:
			   //
			   
			   return Math.abs(colIndex) !== this.layout.cellCount;
		},
		
		noSortEnabledOnColumn  : function(colIndex){
			return this.noSortColumnIndex.indexOf(colIndex) === -1;
		},
		
		noSortColumnConfiguredOnHeader : function(colIndex){
            var grid = this;
            var column = "";
            if(grid.structure.cells[0][colIndex - 1])
			{
            	column = grid.structure.cells[0][colIndex - 1];
				if(grid.selectionMode && (grid.selectionMode === 'single' || grid.selectionMode === 'multiple'))
				{
					column = grid.structure.cells[0][colIndex - 2];
				}
			}
			if(grid.structure.cells[1])
			{
				column = grid.structure.cells[1][colIndex - 2];
				if(grid.selectionMode && (grid.selectionMode === 'single' || grid.selectionMode === 'multiple'))
				{
					column = grid.structure.cells[1][colIndex - 3];
				}
			}
            if(column)
            {
                    if(column["sort"] && column["sort"] === "false")
                    {
                            return false;
                    }
                    else
                    {
                            return true;
                    }
            }
            else
            {
                    return true;
            }
    },
		
		sortAmountColumn : function( /* String */a,
				/* String */b)
				{
					// summary: Filter for sorting String
					// amount(formatted) values in a grid.
					// TODO:Handle different currency formats like Yen
					
					var amtA = a;
					var amtB = b;
					if(!amtA || amtA == "" || amtA == null){
						amtA = 0;
					}
					else{
						//remove delimiters
						amtA = amtA.replace(/\./g, "");
						amtA = amtA.replace("/ /g", "");
						amtA = amtA.replace(/\,/g, "");
						amtA = parseFloat(amtA);
					}
					if(!amtB || amtB == "" || amtB == null){
						amtB = 0;
					}
					else{
						//remove delimiters
						amtB = amtB.replace(/\./g, "");
						amtB = amtB.replace("/ /g", "");
						amtB = amtB.replace(/\,/g, "");
						amtB = parseFloat(amtB);
					}		
					
					if (amtA > amtB)
					{
						return 1;
					}
					if (amtA < amtB)
					{
						return -1;
					}
					return 0;
				},
				
				sortAccountNumberColumn : function( /* String */a,
						/* String */b)
						{
				    //  summary:
					//            Filter for sorting columns in a grid that contain links, based on the 
					//            innerText of the link ie. <a>sort text</a>
					
					var accntA = a.substring(a.indexOf(">", 1)+1, a.indexOf("<", 1));
					var accntB = b.substring(b.indexOf(">", 1)+1, b.indexOf("<", 1));
					 
							if (accntA > accntB)
							{
								return -1;
							}
							if (accntA < accntB)
							{
								return 1;
							}
							return 0;
						},

		sortFloatColumn : function( /*Int,Float*/ a, 
									/*Int,Float*/ b){
			//  summary:
			//            Filter for sorting float values in a grid.

			var floatA = parseFloat(a);
			var floatB = parseFloat(b);
			if((isNaN(floatA) && isNaN(floatB)) || (floatA === floatB)) {
				return 0; 
			}// null considered as larger value
			else if(isNaN(floatA) || (floatA > floatB)){   
				return 1; 
			}
			else{
				return -1;
			} 
		},

		sortLinkColumn : function(a, b) {
			//  summary:
			//            Filter for sorting columns in a grid that contain links, based on the 
			//            innerText of the link ie. <a>sort text</a>
		    //  tags:
		    //            public
			var innerA = a.substring(a.indexOf(">", 1)+1, a.indexOf("<", 1));
			var innerB = b.substring(b.indexOf(">", 1)+1, b.indexOf("<", 1));
			
			if(innerA > innerB) {
				return 1;
			}
			if(innerA < innerB) {
				return -1;
			}

			return 0;
		},
		sortLinkDateColumn : function(a, b) {
			//  summary:
			//            Filter for sorting date-columns in a grid that contain links, based on the 
			//            innerText of the link. That is,<a>sort date-text inside link</a>
		    //  tags:
		    //            public
			var innerA = a.substring(a.indexOf(">", 1)+1, a.indexOf("<", 1));
			var innerB = b.substring(b.indexOf(">", 1)+1, b.indexOf("<", 1));
			
			return m.grid.sortDateColumn(innerA, innerB);
		},
		//format the milliseconds date to user local format
		formatDateTimeColumn : function(dateTimeColumnValue) {
					if(!dateTimeColumnValue.match(/^[0-9]+$/i)) 
					{
					    return dateTimeColumnValue;
					}
					else{
					var dateTimeMillis = eval(dateTimeColumnValue);
					console.warn('formatDateTimeColumn has been called!!');
					var formattedString = dojo.date.locale.format(new Date(dateTimeMillis), {datePattern: m.getLocalization("g_strGlobalDateFormat"), selector: "date"});
					return formattedString;
				}
		},
		
		sortCaseSensetiveColumn : function(a, b) {
			//  summary:
			//            Filter for sorting columns in a grid that contain links, based on the 
			//            innerText of the link ie. <a>sort text</a>
		    //  tags:
		    //            public
			var A = a.toLowerCase();
			var B = b.toLowerCase();
			
			if(A > B) {
				return 1;
			}
			if(A < B) {
				return -1;
			}

			return 0;
		},
		
		sortOnAnchorDescriptionCaseSensetive : function(a, b) {
			
			var element = document.createElement("div");
			element.innerHTML = a;
			var innerTextA = element.innerText;
			element.innerHTML = b;
			var innerTextB = element.innerText;
			
			return misys.grid.sortCaseSensetiveColumn(innerTextA, innerTextB);
		},


		sortDateColumn : function( /*String*/ a, 
								   /*String*/ b) {
			// summary: 
			//		Sorts a grid column containing dates

			var dateFormat = m.getLocalization("g_strGlobalDateFormat");
			var dateA = d.date.locale.parse(a, {
				selector :"date",
				datePattern : dateFormat
			});
			var dateB = d.date.locale.parse(b, {
				selector :"date",
				datePattern : dateFormat
			});
			return d.date.compare(dateA, dateB);
		},
		sortFormatDateColumn : function( /*String*/ a, 
						   /*String*/ b) {
			// summary: 
			//		Sorts a grid column containing dates with formatted string
			
			var dateFormat = m.getLocalization("g_strGlobalDateFormat");
			var formattedA = m.grid.formatDate(a);
			var formattedB = m.grid.formatDate(b);
			var dateA = d.date.locale.parse(formattedA, {
				selector :"date",
				datePattern : dateFormat
			});
			var dateB = d.date.locale.parse(formattedB, {
				selector :"date",
				datePattern : dateFormat
			});
			return d.date.compare(dateA, dateB);
		},

		getURL : function(rowIndex, item) {
			//	summary:
			//		Gets an URL in a column. The URI is taken from <column_name>_uri. Scope is a
			//		Cell.
			
			if(!item || !item.i[this.field]) {
				return this.defaultValue;
			}
			
			if (!item.i[this.field + "_uri"]){
				return this.grid.store.getValue(item, this.field);
			}
			
			// NOTE Be careful not to introduce a carriage return here
			// otherwise it will return "undefined"
			return {
				text: this.grid.store.getValue(item, this.field),
				href: this.grid.store.getValue(item, this.field + "_uri")
			};
		},

		getActions : function(rowIndex, item) {
			//	summary:
			//		Generates actions in an action column. Just copy the value of
			//		<column_name>_uri field.
			
			if(!item) {
				return this.defaultValue;
			}

			return { href: this.grid.store.getValue(item, this.field + "_uri")};
		},

		//
		// The follow functions are (probably) deprecated
		//
		deleteRecords : function() {
			//  summary:
			//            Trigger the deletion of transaction records.
			
			m.concatCheckboxes(m.getLocalization("deleteTransactionsConfirmation"));
		},
		
		loadRecords : function() {
			//  summary:
			//            Trigger the loading of records.
			
			var count = 0;
			d.query(".gridCheckbox").forEach(function(checkbox){
				if(d.attr(checkbox, "checked")) {
					count++;
				}
			});

			if(count > 0) {
				m.concatCheckboxes(m.getLocalization("loadRecordsConfirmation", [count]));
			} else {
				m.dialog.show("ERROR", m.getLocalization("noTemplateSelectedError"));
			}
		}, 

		submitRecords : function() {
			//  summary:
			//            Trigger the submission of transaction records.
			
			m.concatCheckboxes(m.getLocalization("submitTransactionsConfirmation"));
		},

		//
		// The following functions are for the PO Group Folder
		// Consult also the binding create_po_folder.js
		//
		
		submitOpenAccount : function() {
			// TODO Temporary implementation
			// TODO This is called in a listdef, and so there's no way of getting a reference to 
			//		the grid or the action of the form.
			
			var handleCallback = function(){
				dj.byId("dijit_form_Button_3").set("disabled", false);
			};
			
			//dj.byId("dijit_form_Button_3").set("disabled", true);
			
			var grids = [];
			
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			
			var referenceId = dj.byId("referenceid") ? dj.byId("referenceid").get("value") : "";
			var tnxid = dj.byId("tnxid") ? dj.byId("tnxid").get("value") : "";
			var url = "/screen/AjaxScreen/action/RunPOGroupSubmission?s=PurchaseOrderScreen&operation=SUBMIT&option=PO_FOLDER&mode=DRAFT&tnxtype=01";
			
			if(referenceId) {
				url += "&referenceid=" + referenceId;
			}
			if(tnxid) {
				url += "&tnxid=" + tnxid;
			}				

			//m.grid.processRecords(grids, url, handleCallback);
			m.grid.processRecords(grids, url);
		},

		saveOpenAccount : function() {
			// TODO Temporary implementation
			// TODO This is called in a listdef, and so there's no way of getting a reference to 
			//		the grid or the action of the form.
			
			var grids = [];
			
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			
			var referenceId = dj.byId("referenceid") ? dj.byId("referenceid").get("value") : "";
			var tnxid = dj.byId("tnxid") ? dj.byId("tnxid").get("value") : "";
			var url = "/screen/AjaxScreen/action/RunPOGroupSubmission?s=PurchaseOrderScreen&operation=SAVE&option=PO_FOLDER&mode=DRAFT&tnxtype=01";
			
			if(referenceId) {
				url += "&referenceid=" + referenceId;
			}
			if(tnxid) {
				url += "&tnxid=" + tnxid;
			}			
			
			m.grid.processRecords(grids, url);
		},

		submitBankerGuarantee : function() {
			// TODO Temporary implementation
			// TODO This is called in a listdef, and so there's no way of getting a reference to 
			//		the grid or the action of the form.
			
			var grids = [];
			
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			
			var referenceId = dijit.byId("referenceid") ? dijit.byId("referenceid").get("value") : "";
			var tnxid = dijit.byId("tnxid") ? dijit.byId("tnxid").get("value") : "";
			var url = "/screen/AjaxScreen/action/RunGroupBGDelete?s=BankerGuaranteeScreen&operation=DELETE&option=PRODUCTS_MAINTENANCE";
			
			if(referenceId) {
				url += "&referenceid=" + referenceId;
			}
			if(tnxid) {
				url += "&tnxid=" + tnxid;
			}
			
			m.grid.processRecords(grids, url);
		},
		
		selectFolderRow : function( /*Dijit._widget*/ grid,
									/*Dijit._widget*/ gridItem, 
				  					/*Object*/ gridSelection) {
			// summary:
			//		Called onRowClick for a grid of PO transactions in the group folder screen
			
			var gridItems = [],
				selectGroup = false,
				rowIndex,
				arrayIndex,
				selectStartIndex,
				selectEndIndex;
			
			if(gridItem.i._row_type === 0) {
				// 1. Get all children for the group
				// 2. Pass to updateFolderTotal
				
				// Consult m._config.groups, which stores the rowIndex of all groups
				
				rowIndex = gridItem.n;
				
				// 1. Find the location of the groupId in the groups array
				if(rowIndex && rowIndex != null) {
					arrayIndex = d.indexOf(m._config.groups, rowIndex);
					if(arrayIndex > -1) {
						selectStartIndex = m._config.groups[arrayIndex] + 1;
						selectEndIndex = m._config.groups[arrayIndex + 1];
						selectGroup = gridSelection[rowIndex];
						
						// Reset folder total to zero
						m._config.folderTotals = m._config.folderTotals || {};
						m._config.folderTotals[gridItem.i._group_id] = 0;
						
						console.debug("[grid/_base] Toggling rows in range [", selectStartIndex, ",", selectEndIndex, ")");
						
						for(;selectStartIndex < selectEndIndex; selectStartIndex++) {
							grid.selection.setSelected(selectStartIndex, selectGroup);
							gridItems.push(grid.getItem(selectStartIndex));
						}
					} else {
						console.error("[grid/_base] Problem finding group Id index",
								groupId, " group row number array", m._config.groups);
					}
				}
			} 
			else if(gridItem.i._row_type === 1){
				gridItems.push(gridItem);
			}
		},
		
		selectUnsignedFolderRow : function( /*Dijit._widget*/ grid,
											/*Dijit._widget*/ gridItem, 
											/*Object*/ gridSelection) {
			// summary:
			//		Called onRowClick for a grid of PO transactions in the group unsigned folder
			//		screen
			var gridItems = d.isArray(gridItem) ? gridItem : [gridItem];
		},

		groupRecords : function() {
			//  summary:
			//            Trigger the submission of transaction records.
			m.concatCheckboxes(m.getLocalization("deleteRoutingSummariesConfirmation"));
		},

		printRecords : function( /*Dojox Grid*/ grid,
			  	 /*String*/ url) {

			// summary:
			var numSelected = grid.selection.getSelected().length;
			var storeSize	= grid.store._items.length;
			if(numSelected > 0 && storeSize > 0) {
				m.dialog.show("CONFIRMATION", 
						m.getLocalization("printTransactionsConfirmation", 
								[grid.selection.getSelected().length]), "", 
								function(){
					var grids = d.isArray(grid) ? grid : [grid],
							items = [],
							keys = "",
							intNbKeys = 0,
							reference, xhrArgs;
							
					d.forEach(grids, function(grid){
						items = grid.selection.getSelected();
						if(items && items.length) {
							d.forEach(items, function(selectedItem) {
								// extract the reference
								reference = grid.store.getValues(selectedItem, "box_ref");

								// separator
								if(keys !== ""){
									keys += ", ";
								}
								keys += reference;
								intNbKeys++;
							});
						}
					});
					var 
					urlParams = {
						"list_keys": keys
					};
										
					var form = new dijit.form.Form({
					    method: "POST",
					    action: m.getServletURL(url),
					    content: urlParams
					  }, "submitForm");
					var textarea = new dijit.form.SimpleTextarea({
					    name: "list_keys",
					    style: "width:auto;visibility:hidden;"
					  }, "list_keys");
					textarea.set("value",keys);
					form.domNode.appendChild(textarea.domNode);
					document.body.appendChild(form.domNode);
					form.domNode.appendChild(dijit.byId('token').domNode);
					form.submit();
					d.forEach(grids, function(g){
						// Reload data
						g.setStore(g.store);
						d.hitch(g, "render")();
		   
						// Clear selection once data fetch complete
						m.connect(g, "_onFetchComplete", function(){
							g.selection.clear();
						});
					});
				});
			} else {
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			}
		
		},
		
		selectAllRecords : function(/*String*/ gridId) {
			//  summary:
			var i;
			for (i=0; i< dj.byId(gridId).rowCount; i++)
			{
				dj.byId(gridId).selection.addToSelection(i);
			}
		},
		
		deselectAllRecords : function(/*String*/ gridId) {
			//  summary:
			dj.byId(gridId).selection.deselectAll();
		},
		
		reloadDialogGridForSearchTerms : function(/*String*/formId,/*String*/ gridId) {
			// summary: 
			// This method is used for Search Criteria when using a ListDef in a Dialog
			
			var form = dj.byId(formId),
				grid = dj.byId(gridId),
				dateRegex = /Date/,
				timeRegex = /Time/,
				params = "?",
				store, baseURL;

			if(grid && form) {
				// Collect the search form field values as a JSON object
				
				if(dojo.byId('divResults')){
					   d.style("divResults", "margin", 0);
				}

				store = grid.get("store");
				misys.connect(grid, "_onFetchComplete", function(){
					setTimeout(function(){
						grid.resize();
					}, 500);		 			
				});
				baseURL = store.url;
				if(baseURL.indexOf("?listdef=") !== -1) {
					if(baseURL.indexOf("&") !== -1) {
					 params = baseURL.substring(baseURL.indexOf("?listdef="), 
							 baseURL.indexOf("&")) + "&";
					} else {
					 params = baseURL.substring(baseURL.indexOf("?listdef=")) + "&";	
					}
				}
				
				if(baseURL.indexOf("&fields=") !== -1) {
					var tempParams =  baseURL.substring(baseURL.indexOf("fields="));
					if(tempParams.indexOf("&") !== -1)
					{
						tempParams = tempParams.substring(tempParams.indexOf("fields="), tempParams.indexOf("&"));
					}
					params += tempParams + "&";	
				}
				
				form.getDescendants().forEach(function(field, i){
					if(field.name) {
						if(i !== 0) {
							params += "&";
						}
						var value = field.get("value");
						if(dateRegex.test(field.declaredClass) || (timeRegex.test(field.declaredClass))) {
							value = field.get("displayedValue");
						}
						
						if(value === " ") {
							value = "";
						}
						
						params += field.get("name") + "=" + encodeURIComponent(value);
					}
				});
				
				// If selectionMode not null, deselect all first then load new store
				// It is important to deselect first because listener may need store before 
				// it is discarded
				if (grid.selection && grid.get("selectionMode") !== "") {
					grid.selection.clear();
				}
						
				if(store.url.indexOf("?") !== -1) {
					baseURL = store.url.substring(0, store.url.indexOf("?"));
				}
				store.close();
				store.url = baseURL + params;
				console.debug("[misys.grid._base] Resetting grid store URL to", store.url);
				grid.setStore(store);
				
			}
		},
		
		// Open Account - Add Product Identifier, Product Characteristic, Product Category formatter
		formatOpenAccountProductType: function(rowIndex, item) {
			var type = dojo.isArray(item.type) ? item.type[0] : item.type;
			var typeLabel = dojo.isArray(item.type_label) ? item.type_label[0] : item.type_label;
			var otherType = dojo.isArray(item.other_type) ? item.other_type[0] : item.other_type;
			return (type == "OTHR" ? otherType : typeLabel);
		},

		showGroups : function( /*String*/ gridId,
							   /*String*/ buttonId) {
			// summary:
			//		Shows groups and hide the "open" button
			
			m.grid.toggleAllGroups(gridId, true);
			d.style(d.byId("open" + buttonId), "display", "none");
			d.style(d.byId("close" + buttonId), "display", "inline");
		},

		hideGroups : function( /*String*/ gridId,
							   /*String*/ buttonId) {
			// summary:
			//		Hide groups and hide the "close" button
			
			m.grid.toggleAllGroups(gridId, false);
			d.style(d.byId("close" + buttonId), "display", "none");
			d.style(d.byId("open" + buttonId), "display", "inline");
		},

		toggleAllGroups : function( /*Dijit._widget || DomNode || String*/ node,
									/*Boolean*/ inShow) {
			// summary:
			//		Shows/hides all groups.
			//
			// Description: 
			//		inShow true is should show the group, false otherwise the id of the
			//		group to show/hide
			
			var grid = dj.byId(node);
			if(grid && "expandedGroups" in grid) {
				for(var i = 1, rowCount = grid.rowCount; i <= rowCount; i++){
					grid.expandedGroups[i] = inShow;
				}
			}
			grid.update();
		}, 
		
		toggleAllGroupsWithTimeOut : function( /*Dijit._widget || DomNode || String*/ node,
				/*Boolean*/ inShow) {
			// summary:
			//		Shows/hides all groups.
			//
			// Description: 
			//		inShow true is should show the group, false otherwise the id of the
			//		group to show/hide

			var grid = dj.byId(node);
			if(grid && "expandedGroups" in grid) {
				for(var i = 1, rowCount = grid.rowCount; i <= rowCount; i++){
					grid.expandedGroups[i] = inShow;
				}
			}
			else
			{
				setTimeout(function(){
					if(grid && "expandedGroups" in grid) {
						for(var i = 1, rowCount = grid.rowCount; i <= rowCount; i++){
							grid.expandedGroups[i] = inShow;
						}
				}}, 1000);
			}
			grid.update();
		}, 

		getGroupHeader : function(rowIndex, item) {
			// summary:
			//		Builds the data for the group header.
			// description:
			//		return a JSON object with all data nicely set for the
			// 		misys.grid.formatGroupHeader() formatter
			
			if(!item) {
				return "undefined";
			}
			this.grid.expandedGroups = this.grid.expandedGroups || [];

			var groupId = this.grid.store.getValue(item, "_group_id"),
			
				// determine the target state
				// TODO Can this guard ever be true?
				show = (typeof this.grid.expandedGroups[groupId] !== "undefined" && 
						!this.grid.expandedGroups[groupId]);
			
			m._config.groups = m._config.groups || [];
			m._config.groups.push(rowIndex);
			
			// NOTE Be careful not to introduce a carriage return here
			// otherwise it will return "undefined"
			return {
				groupId: groupId,
				show: show,
				name: this.grid.store.getValue(item, "_group_name"),
				gridId: this.grid.id,
				rowIndex: rowIndex
			};
		}, 
		
		getGroupFooter : function(inRowIndex, item) {
			// summary: 
			//
			// Description: 
			//	return a JSON object with all data nicely set for the
			//  m.grid.formatGroupHeader() formatter
			
			if(!item) {
				return "undefined";
			}
			
			// return a JSON object with all data nicely set for the
			// m.grid.formatGroupHeader() formatter
			
			// NOTE Be careful not to introduce a carriage return here
			// otherwise it will return "undefined"
		
			return {
				name: this.grid.store.getValue(item, "_group_name"),
				value: this.grid.store.getValue(item, "_group_footer"),
				gridId: this.grid.id
			};
		},
		
		formatGroupFooter : function(result, idx) {
			// summary:
			//		Formats a group footer.
			
			if (result && d.isObject(result)) {
				if (result.name === "_root") {
					return d.string.substitute("<b>${value}</b>", result);
				}

				return d.string.substitute("<i>${value}</i>", result);
			} else {
				return result;
			}
		},

		formatGroupHeader : function( /*JSON*/ result) {
			// summary:
			//		Formats a group header. The data is extracted by m.getGroupHeader().
			//
			// TODO Should create an image with dojo.create
			
			if (result && d.isObject(result)) {
				if(result.name === "_root") {
					return "";
				}

				result.image = result.show ? "closed.gif" : "open.gif";
				return d.string.substitute(
								"<img src='" + m.getContextualURL('/content/images/${image}') + 
								"' onclick='misys.grid.toggleGroup(${show}, \"${groupId}\"," +
								"\"${gridId}\")' height='11' width='11'> ${name}",
								result);
			} else {
				return result;
			}
		},

		setGroupBeforeRow : function(inDataIndex, inRow) {
			// summary:
			//		
			// Description: 
			//	inRow is an array of subRows. we hide the summary subRow except for every nth
			//  row should hide the normal row and the group row according to the row's values

			var footerPresent = inRow[2],
				headerIndex = 0,
				rowIndex = 1,
				item,
				groupId,
				rowType,
				groupName;
			
			inRow[headerIndex].hidden = false;
			inRow[rowIndex].hidden = false;
			if(footerPresent) {
				inRow[2].hidden = false;
			}
			
			if(inDataIndex < 0) {
				// This is the list header row
				inRow[headerIndex].hidden = true;
				// only show the regular rows header, this is because of a Dojo bug.
				inRow[rowIndex].hidden = false;
				if(footerPresent) {
					inRow[2].hidden = true;
				}

				return;
			}
			
			// Test the group row
			item = this.grid.getItem(inDataIndex);
			if (item) {
				groupId = this.grid.store.getValue(item, "_group_id");	// extract group id
				rowType = this.grid.store.getValue(item, "_row_type");	// extract row type
				groupName = this.grid.store.getValue(item, "_group_name"); // extract row type										
				// If this is a header
				if (rowType === 0) {
					if(groupName === "_root")
					{
						inRow[headerIndex].hidden = true;
					}
					else
					{
						inRow[headerIndex].hidden = false;
					}
					inRow[rowIndex].hidden = true;	// hide details
					if(footerPresent) {
						inRow[2].hidden = true;	// hide footer
					}
				}
				// If this is a detail row
				else if (rowType === 1)
				{
					inRow[headerIndex].hidden = true;	// hide header
					if (typeof this.grid.expandedGroups[groupId] != "undefined" && 
							!this.grid.expandedGroups[groupId]) {
						inRow[rowIndex].hidden = true; // hide details
					} else {
						inRow[rowIndex].hidden = false; // show details
					}
					if(footerPresent) {
						inRow[2].hidden = true; // hide footer
					}
				}
				// If this is a footer
				else if (rowType === 2) {
					inRow[headerIndex].hidden = true;	// hide header
					inRow[rowIndex].hidden = true;	// hide details
					if(footerPresent) {
						inRow[2].hidden = false;// show footer
					}
				}
			}
		},

		toggleGroup : function( /*Boolean*/ inShow,
								/*String*/ groupId, 
								/*String*/ gridId) {
			// summary:
			// 		Shows/hides a group.
			//
			// Description: 
			//       inShow true is should show the group, false otherwise @param groupid
			//		 the id of the group to show/hide
			
			var grid = dj.byId(gridId);
			grid.expandedGroups[groupId] = inShow;	// update the group state array
			grid.sizeChange();
		}
	});
	
	d.mixin(m, {
		redirectWithConfirmation : function( /*String*/ strURL, 
											 /*String*/ intMessageCode) {
			// summary: 
			//    Before redirecting the user, we ask for a confirmation if applicable
			//
			// TODO Should be retested
			
			if (intMessageCode) {
			    m.dialog.show("CONFIRMATION", intMessageCode, "", function(){
			    	window.location.href = strURL;
			    });
			} else {
				window.location.href = strURL;
			}
		}, 
		
		toggleHistoryButton : function(/*String*/ type) {
			// summary:
			//
			// TODO Where is this used? Shouldn't it just use m.toggleFields ?
			
			var height;
			if(type === "STANDARD") {
				height = d.position(dj.byId("threadHistoryButton").domNode).h;
				d.style(dj.byId("threadHistoryButton").domNode, "display", "none");
				d.style(dj.byId("historyButton").domNode, "display", "block");
			} else {
				height = d.position(dj.byId("historyButton").domNode).h;
				d.style(dj.byId("threadHistoryButton").domNode, "display", "block");
				d.style(dj.byId("historyButton").domNode, "display", "none");
			}
			
			d.style("historyButtons", "height", height+"px");
		},
		
		// TODO Rearrange arguments
		concatCheckboxes : function( /*String*/ confirmationMessage,
									 /*Boolean*/ doAction,
									 /*String*/ actionType) {
			//  summary:
			//            Trigger the deletion/submission/initiation of transaction records.
			//
			// TODO Needs to be retested
			var keys = "",
				intNbKeys = 0,
				theTopForm,
				theRealForm; 
			
			if(doAction)
			{
				// The list of keys specifying the records to concat 
				// (whether ref_ids, tnx_ids or product code)
				theTopForm = dj.byId("TransactionSearchForm");
				theRealForm = dj.byId("RealForm"); 
				
				//Scan the form containing the list
				d.query(".gridCheckbox").forEach(function(checkbox){
					if(d.attr(checkbox, "checked")) {
						if(keys.length !== 0) {
							keys += ", ";
						} 
						keys += checkbox.id;
						intNbKeys++;
					}
				});
				
				if(keys.length > 0) {
					console.debug("[misys.grid._base] ListKeys are", keys);
					dj.byId("list_keys").set("value", keys);
					if (actionType === "dissociate"){
						theRealForm.set("action", 
								m.getServletURL("/screen/BankSystemFeaturesScreen?operation=" + 
									"REMOVE_CUSTOMER_AS_COUNTERPARTY&option=CUSTOMER_COUNTERPARTY"));
					}
					
					theRealForm.submit();
				}

				
				/*var checkList = d.query(".gridCheckbox");
				for(var i=0;i<checkList.length;i++)
				{
				 if((checkList[i].type === "checkbox") && (checkList[i].name != "select_all_box"))
				 {
				  if(checkList[i].checked)
				  {
					  // If this is not the first element in the list, we add a comma separator
				      if("S" + keys != "S"){
				    	  keys = keys + ", ";
				      }
				      // And then we add the key (name of the checkbox) related to the record
				      keys = keys +  checkList[i].name ;
				      intNbKeys++;
				   }
				  }
				}
				console.debug("[misys.grid._base] ListKeys = " + keys);
			    // If the list is not empty (some records need to be deleted or submitted), 
			    // we post the form with the list as a parameter
			    if("S" + keys != "S")
			    {  
			     theRealForm.list_keys.value = keys;
			     theRealForm.submit();
			    }*/
			}
			else
			{
				m.dialog.show("CONFIRMATION", confirmationMessage, "", function(){
					m.concatCheckboxes(confirmationMessage, true, actionType);
				});
			}
		},
		
		showTransactionUsersDialog : function(parameterSet, productCode, title) {
			var node = d.query(".grid")[0],
				grid,
				selectedIndex;
			
			if(node) {
				grid = dj.byId(node.id);
				selectedIndex = grid.focus.rowIndex;
				if(grid.selection.isSelected(selectedIndex)) {
					grid.selection.deselect(selectedIndex);
				}
				else {
					grid.selection.setSelected(selectedIndex, true);
				}
			}
			
			m.showSearchDialog("User", "", parameterSet, 
					"AjaxScreen/action/GetValidationUsersPopup", productCode, 
					"width:700px;height:600px;overflow:auto;", title, "", "GetValidationUsersList");
		},
		
		toggleSearchGrid : function(){
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var searchDiv = d.byId("searchCriteria");
			if(d.style("searchCriteria","display") === "none")
			{
				m.animate('wipeIn',searchDiv);
				d.style('actionDown',"display","none");
				d.style('actionUp',"display","block");
				if(window.isAccessibilityEnabled) {
					d.style('actionUp', "cursor", "default");
				} else {
					d.style('actionUp', "cursor", "pointer");
				}
			}
			else
			{
				m.animate('wipeOut',searchDiv);
				d.style('actionUp',"display","none");
				d.style('actionDown',"display","block");
				if(window.isAccessibilityEnabled) {
					d.style('actionDown', "cursor", "default");
				} else {
					d.style('actionDown', "cursor", "pointer");
				}
			}
		}		
		
	});

	// 
	// Onload/Unload/onWidgetLoad Events
	//
})(dojo, dijit, misys);