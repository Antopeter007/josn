dojo.provide("misys._base");
dojo.require("dojo.parser");
dojo.require("dijit.dijit");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.Tooltip");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary:
//   Library of commonly used, non-sensitive JavaScript functions   
//
// description:
//   JavaScript functions used across the application, for all secured and non-
//   secured pages. This can be loaded safely anywhere. It is automatically 
//   imported by misys.common, which is loaded into the top of every 
//   secured page. Basically, this file represents the minimum required to load
//   the main un-secured landing page, and the login page.
//
//   Hence DONT put anything in this file that could be considered sensitive
//   or that would aid a malicious user.
//
// tags:
//   pseudo-private
//
// version:   1.2
// date:      24/03/2011
// author:    Cormac Flynn

/**
 * <h4>Summary:</h4>
 *  Library of commonly used, non-sensitive JavaScript functions.
 *  <h4>Description:</h4>
 *  JavaScript functions used across the application, for all secured and non-
 *  secured pages. This can be loaded safely anywhere. It is automatically
 *  imported by misys.common, which is loaded into the top of every
 *  secured page. Basically, this file represents the minimum required to load
 *  the main un-secured landing page, and the login page.
 *    
 *  Hence don't put anything in this file that could be considered sensitive
 *   or that would aid a malicious user.
 *  
 * @class _base
 */
(function( /*Dojo*/ d,
		   /*Dijit*/ dj,
		   /*Misys*/ m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables
	
	var 
		// default className for containers with Dijits in them
		_widgetContainerSelector = ".widgetContainer",
		
		// className for forms in the page (might not always use <form>)
	    _formClassSelector = ".form",
	    
	    // Dijit attribute we look for, to see if a field should trap
	    // the user's focus in the case of error
	    _focusOnErrorAttr = "focusonerror",
	    
	    // body className that is removed once the page is completely ready
	    _notReadyClass = "notready",
	    
	    // dojo.subcribe channel that is updated once all Dijits have been parsed
	    _readyChannel = "ready",
	    
	    // IDs of floating windows and dialogs, that should be destroyed
	    // onWindowUnload
	    _floatingWindowIds = ["alertDialog", "xhrDialog", "extDialog", "collaborationWindow"],
	    
	    // Priority 1 onLoad callbacks are fired after this number of ms
	    _p1Timeout = 1000,
	    
	    // Priority 2 onLoad callbacks are fired this number of ms after priority 1
	    _p2Timeout = 2000,
	    
	    // We parse the page in blocks; this is the timeout to leave between each
	    // , multiplied by the block's position in the parse array 
	    // (i.e. 1*_parseTimeout, 2*_parseTimeout, 3*_parseTimeout, etc.)
	    _parseTimeout = 50,
	    /**
		 * <h4>Summary:</h4> This is called on every page, once there is activity on the
		 * 'ready' topic ie. once the page is fully loaded *and* once all Dijits
		 * have been completely instantiated.
		 * <h4>Description</h4> : p1 is a function which is first priority callback
		 * and p2 is Second priority callback.Also this method has calls to the m.bind() and misys.onFormLoad methods if display mode is Edit.
		 * This function will get called inside another function _onLoad which again is a pseudo private function which again will get called in a function onLoad().
		 * @param {Function} p1
		 *  First call back function
		 * @param {Function} p2
		 *  Second callback Function
		 * @method _onLoadCallback
		 */
	    _onLoadCallback = function( /*Function*/ p1,
	    		                    /*Function*/ p2) {
			// summary: 
			//		This is called on every page, once there is activity on the
			//		'ready' topic ie. once the page is fully loaded *and*
			//		once all Dijits have been completely instantiated.
	
			// Set the breadcrumb width
			// The width of the breadcrumb is set according to the width of either the 
			// product menu (#MenuBuilder) or the width of .col2 if there is only one in
			// page.,
			// Both of which have their widths set at runtime. :'(
			var widthElement = d.byId("MenuBuilder"),
				breadcrumbList = d.query(".breadcrumb"),
				padding = 6,
				col2List;
			
			if(breadcrumbList.length === 1) {
				if(!widthElement) {
					// No menu found, so attempt to find col2
					col2List = d.query(".col2");
					if(col2List.length === 1) {
						padding = 0;
						widthElement = col2List[0];
					}
				}
				
				if(widthElement) {
					d.style(breadcrumbList[0], "width",
							(d.position(widthElement).w + padding) + "px");
				}
			}
			
			// Bind & onFormLoad
			// The following should be completed before we show the page, otherwise 
			// page elements can jump around a bit
			m.bind();
			// Hook for client specific binding
			if(m.client){
				if(m.client.registerValidations) {
					m.client.registerValidations();
				}
				if(m.client.connectEventHandlers) {
					m.client.connectEventHandlers();
				}
			}
			
			if(m._config.displayMode !== "view") {
				m.onFormLoad();
				// Hook for client specific on form load event handlers
				if(m.client && m.client.prepareScreen){
					m.client.prepareScreen();
				}
			}
		
			// Document is ready, so remove this class
			d.removeClass(d.body(), _notReadyClass);

			// Fire 1st priority callbacks
			setTimeout(function(){
				console.debug("[misys._base] Executing p1 onLoad callbacks");
				p1();
			 }, _p1Timeout);
			
			// Fire 2nd priority callbacks
			setTimeout(function(){
				console.debug("[misys._base] Executing p2 onLoad callbacks");
				p2();
				// This topic is a unit test hook, but left in as it could
				// be useful to know when both callbacks have fired
				d.publish("callbacksReady");
			}, _p2Timeout);
		}, 
		_error = {
			// summary: 
			//  	A common error handler for all XHR GET/POST requests

			error: function( /*JSON*/ response,
					         /*Array*/ ioArgs) {
				console.debug("[misys._base] XHR error with status code", ioArgs.xhr.status);
				switch(ioArgs.xhr.status) {
				 case 401:
					 if(dj.byId && m.dialog){
						 m.dialog.show("ERROR", m.getLocalization("authenticationError")); 
					 }
					 break;
				 default:
					if(this.customError) {
						console.debug("[misys._base] Calling custom error actions");
						this.customError.apply(this, arguments);
					}
					console.debug("[misys._base] Response and arguments objects follow", 
										response, ioArgs);
					break;
				}
		   }
		},
		
		// onLoad subscribe handle
		_handle;
		/**
		 * This function wraps custom validations with calls to the widget's default validation.Most validations are wrapped by this 
		 * function, which ensures that the widget's default validations are called before the custom ones.Moreover, we make sure that
		 * the custom validation is called only if the field is focused and invalid at the time when validation is called or unfocused 
		 * (which occurs when the validation is called upon form submit).This function is invoked by misys.setValidation method, as long as the
		 *  variable noWrap is set to false (which it is by default).This return a boolean variable that a widget is valid or not.True if id/widget is valid otherwise false.
		 *
		 * @param {dijit._Widget} node
		 *  Node to be validate
		 * @param {Boolean} isFocused
		 *  If that widget or node is focused
		 * @param {Function} validation
		 *  Function for validation
		 * @method _validationWrapper
		 * @return {boolean}
		 * Whether a node is in valid state or not.True if valid otherwise false
		 */
	function _validationWrapper ( /*dijit._Widget*/ node, 
            					  /*Boolean*/ isFocused,
            					  /*Function*/ validation) {
		
		node.invalidMessage = node.messages.invalidMessage;
		if(!node.validator(node.textbox.value, node.constraints)){
			return false;
		}

		var isValid = (node.state === "Error") ? false : true;
		if((isFocused && !isValid) || !isFocused) {
			return d.hitch(node, validation)();
		}

		return isValid;
    }
	/**
	 * <h4>Summary:</h4>Creates the standard dialogs.
	 * <h4>Description</h4>:
	 *  It creates two dialogs one with alertDialog as id
	 * and another as xhrDialog as id of type <b>misys.widget.Dialog.Returns</b>.
	 * Return's AlertDialog if dialog id is "alertDialog" otherwise returns a
	 * XmlHttpRequest dialog.
	 * 
	 * @param {String} dialogId
	 *  Id of the dialog you want to initiate
	 * @method _initDialogs
	 * @return {Object}
	 *  Return AlertDialog if dialog id is "alertDialog" otherwise returns a
	 *  XmlHttpRequest dialog.
	 */
	function _initDialogs( /*String*/ dialogId) {
		// summary:
		//		Creates the standard dialogs, the first time an attempt is made to open
		//      one.
		
		var varReFocus = false;
		if(window.isAccessibilityEnabled){
			varReFocus = true; 
		}
		
		var alertDialog = new misys.widget.Dialog({
				id: "alertDialog",
				refocus: varReFocus,
				draggable: false,
				"class": "dialog"
			}), 
			xhrDialog = new misys.widget.Dialog({
				id: "xhrDialog",
				refocus: varReFocus,
				draggable: false
			}),
			extDialog = new misys.widget.Dialog({
				id: "extDialog",
				refocus: varReFocus,
				draggable: false,
				"class": "narrativePaneContent"
			}),
			container = d.create("div"),
			dialogButtonsContainer = d.create("div", {
				id: "dialogButtons",
				"class": "dijitDialogPaneActionBar"
			});
		
		// <p> that will container the dialog message
		d.place(d.create("div", {
			id: "alertDialogContent"
		}), container);
		new dijit.ProgressBar({
			id: "dialogProgressBar",
			indeterminate: true
		}).placeAt(container);
		new dijit.form.Button({
			id: "okButton",
			label: m.getLocalization("okMessage")
		}).placeAt(dialogButtonsContainer);
		new dijit.form.Button({
			id: "cancelButton",
			label: m.getLocalization("cancelMessage")
		}).placeAt(dialogButtonsContainer);
		
		d.place(dialogButtonsContainer, container);
		alertDialog.set("content", container);
		if(dialogId === "extDialog"){
			return extDialog;
		}
		return dialogId === "alertDialog" ? alertDialog : xhrDialog;
	}
	/**
	 * <h4>Summary:</h4>
	 *  This function takes an array of choices as input arguments and return's
	 *  a multiple choice radio button for input choices.
	 *  <h4>Description:</h4> 
	 *  First it creates an element of type input.
	 *  Makes it a Radio button of type "dijit.form.RadioButton".Sets attributes  like id,name,type,value.
	 *  After this it creates a Span.With child as Radio button. Then a Div with child as Span.
	 *  This method returns a div in the result.
	 *  Like:
	 *  
	 *  
	 *  &lt;div&gt;
	 *    &lt;span&gt;
	 *      &lt;button&gt;
	 *      Radio Button
	*       &lt;/button&gt;
	 *    &lt;/span&gt;
	 *  &lt;/div&gt;
	 *  
	 *  
	 *  
	 *  @param {Array} localizations
	 *   An array of localizations which we will set as innerHTML of spans
	 *  @method _getMultipleChoiceRadioButton
	 *  @returns radioButton
	 *   Return's a div                                
	 */
	function _getMultipleChoiceRadioButton( /*Array*/ localizations){
		var result = [];
		for (var i = 1, len = localizations.length; i <= len; i++) {
			var radioB = d.doc.createElement("input");
			d.attr( radioB, "dojoType", "dijit.form.RadioButton");
			radioB.id = "MulChoiceRadioBtn_" + i;
			radioB.name = "MulChoiceRadioBtn";
			radioB.type = "radio";
			radioB.value = "";
			
			var span = d.doc.createElement("span");
			d.addClass(span, "dialogLabelCheckBtn");
			span.appendChild(radioB);
			span.innerHTML += localizations[i-1];
			
			var div = d.doc.createElement("div");
			div.id = "MulChoiceRadio_row_" + i;
			d.addClass(div, "field");
			d.addClass(div, "radio");
			d.style(div,"margin-left","40px");
			div.appendChild(span);
			
			result.push(div);
		}
		
		return result;
	}
	
	function _navigateToAngularScreen(obj) {
		var prodCode = "&productCode=";
		var subProdCode = "&subProductCode=";
		var url = [];
		if (obj.mode === "DRAFT") {
			url.push("/productScreen?");
			url.push("refId=", obj.referenceid);
			url.push("&tnxId=", obj.tnxid);
			url.push(prodCode, obj.productcode);
			url.push(subProdCode, obj.subproductcode);
			url.push("&tnxTypeCode=", obj.tnxtype);
			url.push("&mode=", obj.mode);
			url.push("&subTnxTypeCode=", obj.subtnxtype);
		} else if (obj.mode === "UNSIGNED") {
			url.push("/reviewScreen?");
			url.push("referenceid=", obj.referenceid);
			url.push("&tnxid=", obj.tnxid);
			url.push(prodCode, obj.productcode);
			url.push(subProdCode, obj.subproductcode);
			url.push("&mode=", "view");
			url.push("&action=", "approve");
			url.push("&operation=", "LIST_INQUIRY");
		}
		else if (obj.option === "HISTORY") {
			url.push("/reviewScreen?");
			url.push("referenceid=", obj.referenceid);
			url.push("&tnxid=", obj.tnxid);
			url.push(prodCode, obj.productcode);
			url.push(subProdCode, obj.subproductcode);
			url.push("&mode=", "view");
			url.push("&operation=", obj.operation);
		}
		window.open(m.getServletURL('').replace(/.$/,"#") + url.join(""), '_self');
	
	}
	
   // Public functions follow
   //
   // Note: ONLY add methods here that can be exposed to non-authenticated users.
	
   d.mixin(m, {
		// An array of dojo.connect event references for the page, 
		// so they can be unconnected later (otherwise ancient IE versions leak 
	    // memory all over the place)
		connections: [],
		connectionsById: {},
	/**
	 * This function works as a Stub onLoad for non-secured pages. Overridden in common.js with more complicated 
	 * callback's We return the Deferred object passed from _onLoad,  in case subsequent async actions are required.
	 * @method onLoad.
	 * @return this._onLoad
	 */
		onLoad : function() {
			//  summary:
		    //         Stub onLoad for non-secured pages. Overridden in common.js 
			//         with more complicated callbacks
			//		   
			//		   We return the Deferred object passed from _onLoad, 
			//		   in case subsequent async actions are required.
			
			return this._onLoad();
		},
		/**
		 * This function Performs basic page onLoad events. We only perform core page onLoad events here. 
		 * This is called by non-authorised pages too, so any sensitive actions should instead be performed in 
		 * the overridden _onLoad in misys.common. We return  the Deferred object parsed from method <b>parseWidgets</b>,in case 
		 * subsequent async actions are required.
		 * @param {Function} priority1
		 *  First priority callback function
		 * @param {Function} priority2
		 *  Second priority callback function
		 * @method _onLoad
		 * @return this.parseWidgets
		 */
		_onLoad : function( /*Function*/ priority1,
				            /*Function*/ priority2) {
		    //  tags:
		    //         pseudo private
			
			console.debug("[misys._base] Firing page onLoad");
			
			var theBody = document.getElementsByTagName('body')[0];
				theBody.style.display = "block";
			
			var p1 = priority1 || function(){},
			    p2 = priority2 || function(){};

			// Parse page elements
			console.debug("[misys._base] Parsing HTML for Dijits ...");
			_handle = d.subscribe(_readyChannel, function(){
				_onLoadCallback.call(this, p1, p2);
				d.unsubscribe(_handle);
			});
			return this.parseWidgets();
		},
		/**
		 * <h4>Summary:</h4>
		 * This function Parse and instantiate all Dijit widgets in the page .
		 * <h4>Description:</h4> 
		 *  We retrieve the children of all elements of the
		 *  given selector or (if this is not passed) elements of the class 'widgetContainer', and search these DOM fragments for Dijit  
		 *  classes to instantiate. Once this is done,we instantiate each <form> individually (avoiding the double-instantiation  of its children).
		 *   Note that a form widget should *not* be contained within a .widgetContainer  DIV - such DIVs are created with each fieldset, and for groups of hidden fields.
		 *   @param {String} selector
		 *   @method parseWidgets
		 *   @return  
		 */
		parseWidgets : function( /*String*/ selector) {
			//  summary:
		    //         Parse and instantiate all Dijit widgets in the page
			//
			//  description:
		    //         We retrieve the children of all elements of the given selector or (if
			//		   this is not passed) elements of the class 'widgetContainer', and search 
			//         these DOM fragments for Dijit  classes to instantiate. Once this is done, 
			//         we instantiate each <form> individually (avoiding the double-instantiation
			//         of its children). Note that a form widget should *not* be contained within 
			//         a .widgetContainer DIV - such DIVs are created with each fieldset, and for 
			//         groups of hidden fields. 
			//
			//         This is to avoid instantiating the entire page at once (a
			//         form encloses most of the page); instead we parse and 
			//         instantiate in fieldset-sized blocks and *then* create
			//         the forms separately.  
			//
			//         Once complete, we publish a deferred object to the ready channel. Therefore
			//		   events that require only a successful page load should be fired
			//         by dojo.ready. Events that require all our widgets to be
			//         fully instantiated should instead subscribe to the 'ready'
			//         channel, and fire once a message is received.
			//
			//		   In addition, we return a deferred object (for cases when the caller prefers 
			//		   to use a Deferred). For example, you could call
			//
			//				misys.parseWidgets().then(function(){ ... });
			//
			//		   and the closure would only be evaluated once all widgets had
			//		   been instantiated. This is useful in DOH unit tests, for example.
			//
			//		   Finally, refer to the private function that is invoked by the call to 
			//		   dojo.subscribe(), elsewhere in the code. Once the final p2 callback
			//		   has been fired, we publish to the stream callbacksReady. This is for cases
			//		   where we need to be sure that all parsing and *all* events/callbacks have
			//		   completely finished.
			
			var widgetContainerSelector = selector || _widgetContainerSelector,
			    widgetContainers = d.query(widgetContainerSelector),
			    containers = (widgetContainers.length > 0) ? widgetContainers : [0],
			    len = containers.length,
			    deferred = new dojo.Deferred;
			
			console.debug(
					"[misys._base] Parsing widgets for selector", widgetContainerSelector, 
						", ", containers);

			d.forEach(containers, function(container, i){
				setTimeout(function(){
					// We parse all containers found by the widgetContainerSelector and instantiate
					// the Dijit widgets within. Note that, if there are no forms found in the page, 
					// the widgets' startup methods are invoked by the call to dojo.parser.parse. If
					// forms *are* found in the page, each widget's startup method is instead invoked 
					// when the forms are instantiated thru the call to dojo.parser.instantiate. This
					// is to prevent startup being called twice.
					d.parser.parse(container);
					if(i >= (len - 1)) {
						try {
							d.parser.instantiate(d.query(_formClassSelector));
						} catch(err) {
							console.warn("An error occurred instantiating the page form.");
							console.warn("Note that forms should *not* be inside .widgetContainer ",
											"<div>s, otherwise they will be instantiated *twice*");
							console.warn(err);
						}
						d.publish(_readyChannel);
						deferred.callback(true);
					}
				}, i * _parseTimeout);
			});
			
			return deferred;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function Connects a function to an event.
		 * <h4>Description:</h4> 
		 * This function can accept a Dijit or a DOM node. We always assume its a Dijit first.
		 * Event bindings for Dijits are usually camel case e.g. onClick, onMouseOver. DOM node event bindings are always lower case .This is expressly for elements *in the page*.
		 *  If you are  connecting to an arbitrary object, you can use the standard Dojo  connect/disconnect functions.
		 *  @param {dijit._Widget || DomNode || String} node
		 *   id of the widget or the DomNode itself
		 *  @param {String} event
		 *   An event like "onChange"
		 *  @param {dijit._Widget || null} context
		 *  @param {String || Function} method
		 *   Method to connect
		 *  @method connect
		 *  @return handle 
		 *   Returns a handle to the event
		 */
		connect : function( /*dijit._Widget || DomNode || String*/ node,
							/*String*/ event,
							/*dijit._Widget || null*/ context,
							/*String|Function*/ method) {
			//  summary:
			//         Connects a function to an event handler
			//  description:
			//        This function can accept a Dijit or a DOM node. We always
			//        assume its a Dijit first.
			//
			//        Event bindings for Dijits are usually camel case e.g. 
			//        onClick, onMouseOver. DOM node event bindings are always
			//        lower case
			//
			//		  Note that this is expressly for elements *in the page*. If you are
			//		  connecting to an arbitrary object, you can use the standard Dojo
			//		  connect/disconnect functions
			
			var field = dj.byId(node) || d.byId(node),
			    eventBinding,
			    handle;
			    
			if(field && d.attr(field, "type") !== "hidden") {
				eventBinding = (field.declaredClass) ? event : event.toLowerCase();
				handle = d.connect(field, eventBinding, context, method);
				this.connections.push(handle);
				if (field.id && this.connectionsById) {
					this.connectionsById[field.id] = this.connectionsById[field.id] || [];
					this.connectionsById[field.id].push(handle);
				}
			} else {
				// NOTE sometimes you need to explicity find the caller - uncomment
				// this if you do, and add it to the console call. Note that this won't
				// work in ECMA5 Strict mode
				
				// var callerName = this.connect.caller.name || "(anonymous)";
				console.warn("[misys._base] Event binding failed for page element", node);
			}
			return handle;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function Just echoes dojo.disconnect. Added in case someone tries to Just echoes dojo.disconnect. 
		 * Added in case someone tries to  called misys.disconnect.
		 * @param {Object}
		 *  handle
		 * @method disconnect
		 */
		disconnect : function( /*Object*/ handle) {
			//
			// summary: 
			//     Just echoes dojo.disconnect. Added in case someone tries to
			//     called misys.disconnect.
			//
			//	   We don't bother removing the handle from the connections 
			//     array, as the overhead isn't worth it, IMO.
			
			d.disconnect(handle);
		},
		/**
		 * <h4>Summary:</h4>
		 * This function Invokes dojo.disconnect based on the element id.
		 * The handle is found from the misys.connectionsById handles map.
		 * @param {dijit._Widget || DomNode || String} node
		 *  Node on which you want to remove an  event
		 * @mthod disconnectById
		 */
		disconnectById : function( /*dijit._Widget || DomNode || String*/ node) {
			//
			// summary: 
			//     Invokes dojo.disconnect based on the element id.
			//     The handle is found from the misys.connectionsById handles map.
			var field = dj.byId(node) || d.byId(node);
			if (field && field.id)
			{
				d.forEach(m.connectionsById[field.id], function(handle) {
					d.disconnect(handle);
				});
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function  Attaches a function as a validation to a Dijit.
		 * <h4>Description:</h4> 
		 * It accepts a Dijit node or ID.
		 * It sets the function fnc as a validation, optionally wrapping it in a standard utility 
		 * function (see _validationWrapper).
		 * @param {dijit._Widget || String}
		 *  Any node on which you want to apply validation
		 * @param {Function} fnc
		 *  Validation function
		 * @param {Boolean} noWrap
		 *  Any Node on which you want to set a validation
		 * @method setValidation
		 * 
		 */
		setValidation : function( /*dijit._Widget || String*/ node,
    							  /*Function*/ fnc,
   			 					  /*Boolean*/ noWrap) {
			//
			//  summary:
			//         Attach a function as a validation to a Dijit
			//
			//  description:
			//         Sets the function fnc as a validation, optionally wrapping
			//         it in a standard utility function (see _validationWrapper)
			//
			//         Accepts a Dijit node or ID
			
			var widget = dj.byId(node);
			if(widget && widget.get("type") != "hidden") {
				widget.set(_focusOnErrorAttr, true);
				var validationFnc = (noWrap) ? fnc : function( /*Boolean*/ isFocused) {
					return _validationWrapper(widget, isFocused, fnc);
				};
				widget.isValid = validationFnc;
				if(/Select/.test(widget.declaredClass)) {
					// FilteringSelect fields should be validated as soon as they change
					m.connect(node, "onChange", function(){
						this.validate();
					});
				}
			} else {
				console.warn("[misys._base] Validation binding failed for page element", node);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function Sets a localized string into the JSON store. 
		 * Note that the first time a string is set, the store is loaded, if it hasn't been already.
		 * Its sets the passed value to the key in to the store
		 * @param {String} key
		 *  A localization key as 
		 * @param {String} value 
		 *  Value for the loaclization key
		 * @mehtod setLocalization
		 */
		setLocalization : function( /*String*/ key, 
                					/*String*/ value) {
			
        	//  summary:
            //            Sets a localized string into the JSON store.
        	//  description: 
        	//            Note that the first time a string is set, the store is 
			//            loaded, if it hasn't been already.
			
        	m._config = m._config || {};
        	if(!m._config.localization) {
        		m._config.localization = d.i18n.getLocalization(m._config.client, "common");
        	}
        	
        	m._config.localization[key] = value;
        },
		/**
		 * <h4>Summary:</h4>
		 *  This method gives the value of a localization key . Retrieves a localized string from the JSON store.
		 *  If an array of values is passed in, we substitute each in turn,in place of ${0},${1},${2}, etc.First 
		 *  time a string is requested, the store is loaded, if it hasn't been already.
		 *  @param {String} key
		 *   Key whose value you want ot fetch
		 *  @param {Array} substitutions
		 *   If an array of values is passed ,we substitute each in turn
		 *  @method getLocalization
		 *  @return {String}
		 *   
		 */
		getLocalization : function( /*String*/ key,
                					/*Array*/ substitutions) {

			//  summary:
			//    Get the value of a localization key
			//
			//  description:
			//    Retrieves a localized string from the JSON store. If an 
			//    array of values is passed in, we substitute each in turn, 
			//    in place of ${0},${1},${2}, etc.
			//
			//    Get Client specific Bank Localized Key.If its not available,
			//	  get Core specific Bank Localized Key. 
			// 	  If Bank Localized Key is not available, get Client specific default Localized key.
			//	  If Client Specific Localized key is not found, retrieve Core specific default Localized key.
			//
			//    Note that the first time a string is requested, the store is 
			//    loaded, if it hasn't been already.

			var bank_localized_key = "";
			var str = "";
			m._config = m._config || {};
			if(!m._config.localization) {
				m._config.localization = d.i18n.getLocalization(m._config.client, "common");
			}
			if(!m._config.clientLocalization) {
				m._config.clientLocalization = d.i18n.getLocalization(m._config.client, "client");
			}
			if(m._config.bankSpecificLocalizationEnabled === "true")
			{	
	            bank_localized_key = m._config.bankAbbvNamePrefix + "-" + key;
	            str = m._config.clientLocalization[bank_localized_key] ? m._config.clientLocalization[bank_localized_key] : 
	                			(m._config.localization[bank_localized_key] ? m._config.localization[bank_localized_key] :
	                				(m._config.clientLocalization[key] ? m._config.clientLocalization[key] : (m._config.localization[key] || "")));   
				
				if(m._config.showKey === "true" && key.substring(0,2)!=='g_'){
					str = bank_localized_key ? bank_localized_key : key;
				}
			}
			else
			{
				str = m._config.clientLocalization[key] || "";
				if(str === "" ||  str == null || str == undefined){
					str = m._config.localization[key] || "";
				}
				if(m._config.showKey === "true" && key.substring(0,2)!=='g_'){
					str = key;
				}
			}	
			
			return substitutions ? d.string.substitute(str, substitutions) : str;
		},
	/**
	 * <h4>Summary:</h4>
	 * This method  Performs an XmlHttpRequest GET request . 
	 * <h4>Description:</h4> 
	 * Centralised XHR GET function to ensure that errors and non-authenticated requests are 
	 * properly handled. Pass in a params object to override the default settings. In particular, if load: calls another function,
	 * that function must  have the signature fnc(response, ioArgs). If you need additional  parameters, add a property to the params 
	 * object which is then available inside fnc via the object ioArgs.args.
	 * @param {JSON} params
	 *   Parameters for the particular request
	 */
		xhrGet : function( /*JSON*/ params) {
			
			// summary:
			//    Perform an XHR GET request
			//
			// description:
			//    Centralised XHR GET function to ensure that errors and 
			//    non-authenticated requests are properly handled.
			//  
			//    Pass in a params object to override the default settings. In 
			//    particular, if load: calls another function, that function must 
			//    have the signature fnc(response, ioArgs). If you need additional 
			//    parameters, add a property to the params object which is then 
			//    available inside fnc via the object ioArgs.args.
			//
			//    For example:
			//
			//      misys.xhrGet({
			//           url: "http://...",  // AJAX request URL
			//           load: callback,     // Callback function
			//           handleAs: "text",   // Override the handleAs property
			//           contentType: "text/plan; charset=utf-8", // Override the contentType property
			//           myCustomProperty: "foo"                  // Add a custom prop for the callback
			//      });
			//
			//      function callback(/*String*/ response, /*Obj*/ ioArgs) {
			//        console.debug("Response is", response);  // output the response
			//        console.debug("My custom property", ioArgs.args.myCustomProperty);
			//      }
			//
			//	  xhrGet uses a centralised error handler (defined as the local _error). If you wish
			//	  to add your own error handling callback, define the property customError as a
			//    function(err, ioArgs) on the JSON object you pass in.
			//
			//    misys.xhrGet returns a Deferred object, if you need to trigger a event dependent
			//    on the asynchronous request.
			
			var defaults = {
					handleAs: "json",
					contentType: "application/json; charset=utf-8",
					preventCache: true
			};
			
			// TODO Instead of this, we should listen to the topics
			/*if(d.byId("idleSessionTimeOutIndicator")) {
				m.idleSessionTimer(0);
			}*/
			
			return d.xhrGet(d.mixin(defaults, _error, params));	
		},
	/**
	 * <h4>Summary:</h4>
	 * This function performs an XHR POST.
	 * <h4>Description:</h4> 
	 *  Centralised XHR POST function to ensure that errors and non-authenticated
	 *  requests are properly handled.
	 *  @param {JSON} params
	 *   Parameters for the particular request
	 *  @method xhrPost
	 *  @return 
	 * 
	 */
		xhrPost : function( /*JSON*/ params) {
			
			if (document.getElementById("_token") && params.form !== "popup_realform" && params.url.indexOf('AsyncScreen') == -1) {
				params.content = params.content || {};
				d.mixin(params.content, {token : document.getElementById("_token").getAttribute('value')});
			}
			// summary:
			//    Perform an XHR POST
			//
			// description:
			//    Centralised XHR POST function to ensure that errors and non-authenticated 
			//    requests are properly handled.
			//
			// TODO: there is no reason to default content type as xml and this causes an issue
			// when the content is not xml and method is POST, parameters are discarded
			var defaults = {
					//handleAs : "text",
					//contentType: "text/xml; charset=utf-8"
			};
			
			// TODO Instead of this, we should listen to the topics
			/*if(d.byId("idleSessionTimeOutIndicator")) {
				m.idleSessionTimer(0);
			}*/
			if(params && params.content && params.content.fields) { 
				//Check if this is already encoded we are assuming that the characaters [ & ] will be part of the fields always 
				if(params.content.fields.indexOf("%5B") > -1 && params.content.fields.indexOf("%5D") > -1) {
					console.debug('fields are already encoded:' + params.content.fields);
				} else {
					params.content.fields = encodeURI(params.content.fields);
				}
				
			}
			
			return d.xhrPost(d.mixin(defaults, _error, params));
		},
						/**
						 * <h4>Summary:</h4>
						 * This fuction is to animate a node.
						 * <h4>Description:</h4> 
						 * This function
						 * managed fading and wiping in and out of page nodes.
						 * We collect together the various dojo fx class in one
						 * function because, in our case, we also want to set
						 * display to "none" or "block", and this can be tricky
						 * to consistently place in the order of events for each
						 * effect. We want to do proper event chaining too.
						 * 
						 * This function can accept following values as a value
						 * for ".node" 1. The Id of DomNode 2. The DomNode
						 * itself . 3. Any custom proprties that you need to
						 * pass to the animation can be in the customProps,
						 * JSON. They will overwrite whatever defaults have been
						 * set.
						 * 
						 * We accept any of the following function signatures
						 * 
						 * 1. misys.animate(type, node);
						 *  2. misys.animate(type,
						 * node, callback);
						 *  3. misys.animate(type, node,
						 * deferPlay);
						 *  4. misys.animate(type, node, callback,
						 * deferPlay); 
						 * 5. misys.animate(type, node, callback,
						 * deferPlay, customProps);
						 * 
						 * Finally, some elements should not, of course, be
						 * given a display value of "block" (labels are
						 * 'inline-block', for example). You can override this
						 * in the custom properties as "display"
						 * 
						 * e.g.
						 * 
						 * misys.animate("fadeIn", "myNodeId", null, false, {
						 * display : "table-row" // Additional custom props
						 * could go here });
						 *  // isDialogAnimation - is used to notify if the
						 * animation is happening in a dialog
						 * 
						 * @param {String} type
						 *  Like fadein
						 * @param {String||DomNode||Array} node
						 *  Node you want to animate
						 * @param {Function} callback
						 *  Callback funtion
						 * @param {Boolean} deferPlay
						 * @param {JSON} customProps
						 * @param {Boolean} deferPlay
						 * @method animate
						 * @return
						 */
		animate : function( /*String*/ type,
						    /*String || DomNode || Array*/ node,  
						    /*Function*/ callback, 
						    /*Boolean*/ deferPlay,
						    /*JSON*/ customProps, /*Boolean*/isDialogAnimation) {
			
			//  summary:
			//         Animate a node
			//  description:
			//		   This function managed fading and wiping in and out of page nodes. We collect
			//		   together the various dojo fx class in one function because, in our
			//		   case, we also want to set display to "none" or "block", and this can be tricky
			//		   to consistently place in the order of events for each effect. We
			//		   want to do proper event chaining too.
			//
			//		   In the case of IE6, we eschew all animation.
			//
			//		   This function can accept the following as a value for "node"
			//			1. The ID of a DOM node;
			//			2. The DOM node itself;
			//			3. A NodeList (from, for example, a dojo.query call). Animations on lists
			//			of nodes will be chained, and executed in order
			//
			//		   It will *not* accept Dijits, so animate something that contains the
			//		   Dijit.
			//
			//		   Other parameters:
			//
			//		   1. The callback parameter is optional; it will be fired at the end of the 
			//		      chain.
			//		   2. Pass in true for deferPlay, if you don't want .play() to be called.
			//		   3. Any custom proprties that you need to pass to the animation can be in
			//		      the customProps, JSON. They will overwrite whatever defaults
			//			  have been set.
			//
			//		   We accept any of the following function signatures
			//
			//			1. misys.animate(type, node);
			//          2. misys.animate(type, node, callback);
			//			3. misys.animate(type, node, deferPlay);
			//			4. misys.animate(type, node, callback, deferPlay);
			//			5. misys.animate(type, node, callback, deferPlay, customProps);
			//
			//		   Finally, some elements should not, of course, be given a display
			//		   value of "block" (labels are 'inline-block', for example). You can override
			//		   this in the custom properties as "display"
			//
			//		   e.g.
			//
			//		   misys.animate("fadeIn", "myNodeId", null, false, {
			//				display : "table-row"
			//				// Additional custom props could go here
			//		   });
			
			// isDialogAnimation - is used to notify if the animation is happening  in a dialog

			var chain = dojo.fx.chain([]);
			if(node) {
				var nodes = d.isArray(node) ? node : [d.byId(node)],
					animation = d[type] || d.fx[type],
					props = {
						duration: 500,	
						// note: display is our own property, it isn't a standard 
						// Dojo animation one
						display: "block"
					},
				    animations = [],
				    setNodeDisplay = function(){
						d.forEach(nodes, function(node) {
							if(node) {
								d.style(node, "display", props.display);
							}
						});
					};
				
				if(!animation) {
					console.warn(
							"[misys._base] Animation type", type, "is not supported!",
							"We only support fadeIn, fadeOut, wipeIn, wipeOut.",
							"(you tried to animate node", node, ")");
					return chain;
				}
				
				// Sort out signature 3 (see comment above)
				if(callback && !d.isFunction(callback)) {
					deferPlay = callback;
					callback = null;
				}

				// Apply custom properties
				props = (customProps) ? d.mixin(props, customProps) : props;

				// Setup particular animation properties
				switch(type) {
					case "fadeIn" :
						d.mixin(props, {
							beforeBegin: setNodeDisplay
						});
						break;
					case "fadeOut" : 
						props.display = "none";
						d.mixin(props, {		
							onEnd: setNodeDisplay
						});
						break;
					case "wipeOut":
						props.display = "none";
						d.mixin(props, {				
							onEnd: setNodeDisplay
						});
						break;
					default:
						break;
				}
				
				// Chain the animations
				d.forEach(nodes, function(node){
					if(node) {
						if(d.isIE <= 7 && !isDialogAnimation) {
							console.debug("Animating for IE");
							d.style(node, "display", props.display);
							//IE7 doesnt handle opacity, instead it makes use of filters.
							d.style(node, "filter", "opacity(0)");
							d.style(node, "filter", "opacity(50)");
							d.forEach(d.query('> Div', node),function(node){
								if(node && node.id && node.id !== "")
								{
									d.byId(node.id).style.filter = "opacity(0)";
									d.byId(node.id).style.filter = "opacity(50)";
								}
							});
						} else {
							animations.push(
								animation(d.mixin(props, {
									node: node
							})));
						}
					}
				});

				// Handle defer play and callbacks
				if(d.isIE <= 7 && !isDialogAnimation) {
					if(callback && d.isFunction(callback)) {
						callback();
					}
				} else {
					chain = d.fx.chain(animations);
					if(callback && d.isFunction(callback)) {
						d.connect(chain, "onEnd", callback);
					}
					if(!deferPlay) {
						chain.play();
					}
				}
			}
			
			return chain;
		},
		/**
		 * <h4>Summary:</h4>
		 * This method takes a URL as input and Returns a url with the application context as a prefix.
		 * For example misys.getContextualURL("content/images/preview.png") it will return a url with context as prefix for the passed url.
		 * @param {String} url
		 *   Passed url
		 * @method getContextualURL
		 * @return {String} url
		 *   A URL with application cotext as prefix.
		 */
		getContextualURL : function( /*String*/ url) {
			// summary: 
			//		Returns url with the application context as a prefix

			if(!this._config || this._config.context == null) {
				console.warn("Unable to format a contextual URL for", url);
				throw {
					name : "InitializationError",
					message : "misys.getContextualURL has been called " + 
							  "before misys._config has been fully instantiated"
				};
			}
			
			var contextualURL = d.trim(url);
			if(contextualURL.indexOf("/") !== 0) {
				contextualURL = "/" + contextualURL;
			}
			contextualURL = this._config.context + contextualURL;
			contextualURL = (contextualURL.indexOf("//") === 0) ?
					contextualURL.substr(1) : contextualURL;
			return contextualURL;
		},
		/**
		 * <h4>Summary:</h4>
		 * Returns the URL with application context + servlet as a prefix
		 * For example m.getServletURL("/screen/GTPUploadLogoScreen") will return a Url with context and servlet as prefix.
		 * @param {String} url
		 * @method getServletURL
		 * @return url
		 *  Url with application context and servlet as a prefix
		 * 
		 */
		getServletURL : function(/*String*/ url) {
			// summary: 
			// 		Returns the URL with application context + servlet as a prefix

			if(!this._config || this._config.context == null || this._config.servlet == null) {
				console.warn("Unable to format a servlet URL for", url);
				throw {
					name : "InitializationError",
					message : "misys.getServletURL has been called " + 
					  		  "before misys._config has been fully instantiated"
				};
			}
			
			var servletURL = d.trim(url);
			if(servletURL.indexOf("/") !== 0) {
				servletURL = "/" + servletURL;
			}
			servletURL = this._config.context + this._config.servlet + servletURL;
			servletURL = (servletURL.indexOf("//") === 0) ? servletURL.substr(1) : servletURL;
			return servletURL;
		},
		
		// The following functions are overriden in individual screen bindings, 
		// but are kept here so they can be called without error. 
		/**
		 * <h4>Summary:</h4>
		 * This function is overridden in indivisual screen
		 * but kept here so that it can be called without error.
		 * @methodbind
		 */
		bind : function(){},
		/**
		 * <h4>Summary:</h4>
		 * This function is overridden in indivisual screen
		 * but kept here so that it can be called without error.
		 * @method onFormLoad
		 */
		onFormLoad : function(){},
		/**
		 * <h4>Summary:</h4>
		 * This function is overridden in indivisual screen
		 * but kept here so that it can be called without error.
		 * @method beforeSubmit
		 */
		beforeSubmit: function(){},
		/**
		 * <h4>Summary:</h4>
		 * Utility function that returns all fields currently in error.
		 * <h4>Description:</h4> 
		 * If you don't pass an <b>id/DomNode</b>, we use fakeform1, so its usually enough to call misys._getFieldsInError().
		 * It checks for the state of all the fields and put all the fields which are in error state into an array.
		 * After this it shows all the fields in error state.
		 * @param {String | DomNode} formId
		 *  Either Id of node or DomNode itself e.g ft_cur_code
		 * @method _getFieldsInError
		 */
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
					console.debug("[misys._base]", fields.length, "field(s) are in error");
					d.forEach(fields, function(w){
						console.debug(w.id, w);
					});
					return;
				}
				
				console.debug("[misys._base] No fields are in error");
			}
			
			return;
		},
		
		//
		// description: An object to hold dialog info.
		// 
		// Note: Remember 'this' inside this block refers to 'dialog' (not misys), for functions
		// called with the dot operator. Reference misys directly (misys. or m.) if you need its
		// functions.
		//
		dialog : {
			// An object with properties by dialog ID, containing array values of event handlers
			// e.g. misys.dialog.alertDialog will return an array of event handlers of the dialog
			// with id=alertDialog, and can be disconnected like so
			//
			//    d.forEach(misys.dialog.alertDialog, d.disconnect);
			//
			
			connections: {},
			
			// Variable to indicate if the multiple items dialog is active or not
			isActive: false,
			/**
			 * <h4>Summary:</h4>
			 *  Manages the connection and disconnection of a method to an even for
			 *  a given dialog or a field inside a dialog.
			 *  <h4>Description:</h4> 
			 *  We share a single dialog instance across the application; therefore, we
			 *  must manage the connection/disconnection of events as the dialog is opened
			 *  and closed.
			 *  @param node
			 *    A widget or field
			 *  @parma event
			 *   An event like onChange or onClick
			 *  @param method 
			 *   Callback for a given event
			 *  @param dialogId
			 *    Id of dailog otherwise node itself
			 *  @method connect
			 *  @return {Object}
			 *    handle to an event
			 */
			connect: function( /*dijit._Widget || DomNode || String*/ node,
				      		   /*String*/ event,
				      		   /*String || Function*/ method,
				      		   /*String*/ dialogId) {
				//  summary:
				//        Manages the connection and disconnection of a method to an event handler for
				//        a given dialog or a field inside a dialog.
				//
				//  description:
				//		   We share a single dialog instance across the application; therefore, we
				//		   must manage the connection/disconnection of events as the dialog is opened
				//		   and closed. 
				//		
				//		   All events connected via misys.dialog.connect will be disconnected on the
				//		   dialog's onHide event.
				//
				//		   Arguments are:
				//
				//		   	node - a widget or field (or its id)
				//		   	event - an event handler
				//		   	method - method to fire on the given event handler for the given object
				//		   	dialogId - optional, the id of a dialog. The connection will be bound to this
				//					   dialog. If no id is passed, we assume the widget "node" is the dialog
				//
				//		   Some examples
				//
				//		   // These both connect the method callback to the onShow event of the dialog "myDialog".
				//		   misys.dialog.connect("myDialog", "onShow", callback);
				//		   misys.dialog.connect(dijit.byId("myDialog"), "onShow", callback);
				//			
				//		   // Both these examples connect the function callback to the onFocus event
				//		   // of the field "myField" in the dialog "myDialog"
				//		   misys.dialog.connect("myField", "onFocus", callback, "myDialog");
				//		   misys.dialog.connect(dijit.byId("myField"), "onFocus", callback, "myDialog");
				//
				//        See misys.connect for more information.
				
				var obj = dj.byId(node) || d.byId(node),
					theDialogId = (dialogId) ? dialogId : obj.id,
					eventBinding,
					handle;
					
				if(obj && d.attr(obj, "type") !== "hidden") {
					// event bindings for domNodes should be lowercase
					eventBinding = (obj.declaredClass) ? event : event.toLowerCase();
					handle = d.connect(obj, eventBinding, null, method);
					if(!this.connections[theDialogId]) {
						this.connections[theDialogId] = [];
					}
					this.connections[theDialogId].push(handle);
					if (obj.id && this.connectionsById) {
						this.connectionsById[obj.id] = this.connectionsById[obj.id] || [];
						this.connectionsById[obj.id].push(handle);
					}

				} else {
					console.warn("[misys._base] Event binding failed for page element", obj);
				}
				
				return handle;
		    },
		    /**
		     * <h4>Summary:</h4>
		     * Disconnects all events associated with the dialog
		     * @param {Dijit||String} 
		     *   Node - Id of dialog or node itself
		     */
		    disconnect : function( /*Dijit|String*/ node) {
		    	// summary:
		    	//      Disconnects *all* events associated with the dialog
		    	
		     	var dialog = dj.byId(node); 
		     	if(dialog) {
		     	 var dialogId = dialog.id;
		     	 if(this.connections[dialogId] && this.connections[dialogId].length > 0) {
		     	  console.debug("[misys._base] Disconnecting", this.connections[dialogId].length,
		     			  		"bindings for dialog", dialogId);
		     	  d.forEach(this.connections[dialogId], d.disconnect);
		     	  this.connections[dialogId] = [];
		     	 }
		     	}
		    },
			
		    // Refactored to explicitly attach events to the ok/cancel buttons
		    /**
		     *  <h4>Summary:</h4>
		     *   Shows the standard modal dialog.
		     *   
		     *   <h4>Description:</h4> 
		     *   Handles the setup and display of alert, error, confirmation, progress
		     *   and dialogs populated via a URL.
		     *   "type" and "message" are required, the rest are mostly optional.
		     *   We return the Deferred object returned by the show() call, so that
		     *   it can be included in event chaining. When type is URL, a HTTP POST request will be used to get the markup
		     *   from the url and the optional query containing POST content.
		     *   @param String,String,String,Fuction,Function,String,Function,Object
		     *   @method show
		     *   
		     */
			show: function( /*String*/ type,
	   				   		/*String*/ message,
		   				    /*String*/ title,
		   				    /*Function*/ onHideCallback,
		   				    /*Function*/ onShowCallback,
		   				    /*String*/ url,
		   				    /*Function*/ onOkCallback,
		   				    /*Function*/ onCancelCallback,
		   				    /*Object*/ query) {
				//  summary:
				//         Show the standard modal dialog.
				//
				//  description: 
				//		   Handles the setup and display of alert, error, confirmation, progress 
				//		   and dialogs populated via a URL.
				//
				//         "type" and "message" are required, the rest are mostly optional. 
				//
				//		   Note that the onHide callback is only fired if the dialog is closed
				//		   by clicking the OK button
				//
				//		   We return the Deferred object returned by the show() call, so that
				//		   it can be included in event chaining.
				//
				//		   When type is URL, a HTTP POST request will be used to get the markup
				//		   from the url and the optional query containing POST content
				type = type.toUpperCase();
				if(type === "EXTENDED-VIEW"){
					var dialogId = "extDialog",
					dialog = dj.byId(dialogId) || _initDialogs(dialogId);
				}
				else
				{
					dialogId = (type !== "HTML" && type !== "URL") ? "alertDialog" : "xhrDialog";
					dialog = dj.byId(dialogId) || _initDialogs(dialogId);
				}

				console.debug("[misys._base] Opening a dialog of type", type);
			
				var dialogProgressBar = d.byId("dialogProgressBar"),
					dialogButtons = d.byId("dialogButtons"),
					cancelButtonNode = dj.byId("cancelButton").domNode,
					alertDialogContent = d.byId("alertDialogContent"); 
			
				d.style(dialogProgressBar, "display", "none");
				d.style(dialogProgressBar, "visibility", "hidden");
				d.style(dialogButtons, "display", "block");
				d.style(cancelButtonNode, "display", "inline-block");
			
				d.toggleClass(alertDialogContent, "errorDialog", type === "ERROR");
				d.toggleClass(alertDialogContent, "informationDialog",
						(type !== "ERROR" && type !== "PROGRESS"));
				var style = body.style;
				style.overflow ="hidden";
				switch(type){
					case "ALERT":
						title = m.getLocalization("alertMessage");
						break;
					case "ERROR":
						title = m.getLocalization("errorMessage");
						d.style(cancelButtonNode, "display", "none");
						break;
					case "CONFIRMATION":
						title = m.getLocalization("confirmationMessage");
						break;
					case "PROGRESS":
						title = m.getLocalization("progressMessage");
						d.style(alertDialogContent, "height", "auto");
						d.style(dialogProgressBar, "display", "block");
						d.style(dialogProgressBar, "visibility", "visible");
						d.style(dialogButtons, "display", "none");
						break;
					case "URL":
						console.debug("[misys._base] Opening a modal dialog with URL", url, query, "and title", title);
						// set ioMethod and ioArgs first because the Dojo ContentPane may call the server at the time the href is set
						dialog.set("ioMethod", misys.xhrPost);
						dialog.set("ioArgs", { content: query });
						dialog.set("href", url);
						break;
					case "HTML":
						console.debug("[misys._base] Opening a modal dialog with HTML content",
								message, "and title", title);
						dialog.set("content", message);
						break;
					case "EXTENDED-VIEW":
						console.debug("Opening a modal dialog with extended narrative content");
						dialog.set("content", message);
						break;
					case "CUSTOM-NO-CANCEL":
						d.style(cancelButtonNode, "display", "none");
						break;
					case "DATE-CONFLICT":
						title = m.getLocalization("dateConflictMessage");
						d.style(cancelButtonNode, "display", "none");
						break;
					default:
						title = m.getLocalization("alertMessage");
					break;
				}

				dialog.set("title", title);
				if(type !== "URL" && type !== "HTML" && type !== "EXTENDED-VIEW") {
					alertDialogContent.innerHTML = message;
					d.style(alertDialogContent, "height", "auto");
					d.style(alertDialogContent, "width", "auto");
				}
			
				// Add events
				m.dialog.cancelCalled = false;
				if(type !== "PROGRESS" && type !== "URL") {
					m.dialog.connect(dj.byId("okButton"), "onMouseUp", function(){
						if(onOkCallback)
						{
							console.debug("[misys._base] Dialog onOk will trigger the action", 
									onOkCallback.toString());

							// Reinstate the onbeforeunload if it exists
							if(m.unloadListener)
							{
								window.onbeforeunload = m.unloadListener;
								m.isSystemButtonClicked = false;
							}
							
							onOkCallback();
						}
						dialog.hide();
					}, dialog.id);
					//Connecting event On keyboard ENTER key action to call onOkCallback which will execute callback function
					m.connect("okButton", "onKeyDown", function(evt){
						if(evt.keyCode === d.keys.ENTER){
							if(onOkCallback)
							{
								console.debug("[misys._base] Dialog onOk will trigger the action", 
										onOkCallback.toString());
	
								// Reinstate the onbeforeunload if it exists
								if(m.unloadListener)
								{
									window.onbeforeunload = m.unloadListener;
									m.isSystemButtonClicked = false;
								}
								
								onOkCallback();
							}
							dialog.hide();
						}
					});
					
					if(type !== "ERROR" && type !== "CUSTOM-NO-CANCEL") {
						misys.dialog.connect(dj.byId("cancelButton"), "onMouseUp", function(){
							m.dialog.cancelCalled = true;
							if(onCancelCallback)
							{
								console.debug("[misys._base] Dialog onCancel will trigger the action", 
										onCancelCallback.toString());
								// Reinstate the onbeforeunload if it exists
								if(m.unloadListener)
								{
									window.onbeforeunload = m.unloadListener;
									m.isSystemButtonClicked = false;
								}
								onCancelCallback();
							}
							dialog.hide();
						}, dialog.id);
						//Connecting event On keyboard ENTER key action to call onCancelCallBack which will close dialog
						m.connect("cancelButton", "onKeyDown", function(evt){
							m.dialog.cancelCalled = true;
							if(evt.keyCode === d.keys.ENTER){
								if(onCancelCallback)
								{
									console.debug("[misys._base] Dialog onCancel will trigger the action", 
											onOkCallback.toString());
		
									// Reinstate the onbeforeunload if it exists
									if(m.unloadListener)
									{
										window.onbeforeunload = m.unloadListener;
										m.isSystemButtonClicked = false;
									}
									onCancelCallback();
								}
								dialog.hide();
							}
						});
					}
				}
				m.dialog.connect(dialog, "onKeyPress", function (evt){
					if(evt.keyCode === d.keys.ESCAPE){
						d.stopEvent(evt);
					}
				});
				if(onShowCallback) {
					var evt = (url && url !== "") ? "onLoad" : "onShow";
					console.debug("[misys._base] Attaching dialog callback ", onShowCallback, 
								  "on event", evt);
					m.dialog.connect(dialog, evt, onShowCallback);
				}	
			//[MPS-19821]changed the time delay as the trasaction is posting while cancel it very fast
				m.dialog.connect(dialog, "onHide", function(){
				style.overflow ="";
						setTimeout(function() {
							if(onHideCallback && !m.dialog.cancelCalled) {
								console.debug("[misys._base] Dialog onHide will trigger the action", 
										onHideCallback.toString());
								onHideCallback();
							}
						}, 300);
						if(!m.isSystemButtonClicked)
						{
							console.debug("Inside onHide. m.isSystemButtonClicked=",m.isSystemButtonClicked);
							// Reinstate the onbeforeunload if it exists
							if(m.unloadListener)
							{
								window.onbeforeunload = m.unloadListener;
							}
						}	
						m.dialog.disconnect(dialog);
				});
			
				return dialog.show();
			},
		/**
		 * <h4>Summary:</h4>
		 * This fuction is for hiding the dialog
		 * @param {String} id
		 *  Id of the dialog
		 * @method hide
		 */
			hide : function( /*String*/ id) {
				var dialogIds = id || ["alertDialog", "xhrDialog"];
				d.forEach(dialogIds, function(dialogId) {
					var dialog = dj.byId(dialogId);
					if(dialog && dialog.get("open")) {
						dialog.hide();
					}
				});
			},
			/**
			 * This fuction is for showing multiple choice dialog
			 * <h4>Description:</h4>
			 * This method takes Message which we will be stting as intterHTML of the Dialog and Title of the dialog and URls as the input.
			 * If a dijit is there with the id as "alertDialog" use it otherwise initilaize a new dialog with that id.
			 * Creating an object of the dialogProgressBar,Dialog buttons and dialog content.
			 * After that set the styles  to the dialog progress bar.Set the title of the dialog.
			 * 
			 * 
			 * @param {String} message
			 *  Message which we will set as content of dialog
			 * @param {String} title
			 *  Title of the dialog
			 * @param {Array} localizations
			 *  An array of choices which will be passed as input to the psuedo private method _getMultipleChoiceRadioButton
			 * @param {Array} URLs
			 * @method showMultipleChoiceDialog
			 */
			showMultipleChoiceDialog : function( /*String*/ message,
					 /*String*/ title,
					 /*Array*/ localizations,
					 /*Array*/ URLs) {
					
					// summary:
					//		TODO
					
					var dialog = dj.byId("alertDialog") || _initDialogs("alertDialog");
					
					console.debug("[misys.form.common] Opening a multiple choice dialog");
					
					var dialogProgressBar = d.byId("dialogProgressBar"),
					dialogButtons = d.byId("dialogButtons"),
					cancelButtonNode = dj.byId("cancelButton").domNode,
					alertDialogContent = d.byId("alertDialogContent"); 
					
					d.style(dialogProgressBar, "display", "none");
					d.style(dialogProgressBar, "visibility", "hidden");
					d.style(dialogProgressBar, "display", "none");
					d.style(dialogProgressBar, "visibility", "hidden");
					d.style(dialogButtons, "display", "block");
					d.style(cancelButtonNode, "display", "inline-block");
					d.style(alertDialogContent, "display", "block");
					d.style(alertDialogContent, "width", "480px");
					d.style(alertDialogContent, "height", "120px");
					
					// Setting the title
					dialog.set("title", title);
					
					// Creating the content
					var radioButtons = _getMultipleChoiceRadioButton(localizations);
					
					alertDialogContent.innerHTML = message;
					for (var i = 0, len = radioButtons.length; i < len; i++) {
						alertDialogContent.appendChild(radioButtons[i]);
						d.parser.parse("MulChoiceRadio_row_" + (i + 1));
					}
					
					// Add events
					m.dialog.connect(dj.byId("okButton"), "onMouseUp", 
						function(){
							for (var i = 1, len = radioButtons.length; i<= len; i++){
								if (dj.byId("MulChoiceRadioBtn_" + i).get("checked")) {
									var form = new dijit.form.Form({
									    method: "POST",
									    action: URLs[i-1]
									  }, "submitForm");
									form.domNode.appendChild(dijit.byId('token').domNode);
									dojo.body().appendChild(form.domNode);
									form.submit();
									return;
								}
							}
							m.showTooltip(m.getLocalization("multipleChoiceError"),
							d.byId("MulChoiceRadioBtn_1"), ["before"]);
					}, dialog.id); 
					
					
					m.dialog.connect(dj.byId("cancelButton"), "onMouseUp", 
						function(){
							dialog.hide();
							m.dialog.disconnect(dialog);
							for (var i = 0, len = radioButtons.length; i< len; i++) {
								alertDialogContent.appendChild(radioButtons[i]);
								dj.byId("MulChoiceRadioBtn_" + (i + 1)).destroy();
						}
					}, dialog.id); 
					
					m.dialog.connect(dialog, "onKeyPress", function (evt){
						if(evt.keyCode == d.keys.ESCAPE){
							dialog.hide();
							m.dialog.disconnect(dialog);
							for (var i = 0, len = radioButtons.length; i < len; i++) {
								alertDialogContent.appendChild(radioButtons[i]);
								dj.byId("MulChoiceRadioBtn_" + (i + 1)).destroy();
							}
						}
					});
					dialog.show();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Utility function that creates a Form and submit it using the POST action
		 * This function is used to implement page navigation using POST
		 * @param {Object}  args 
		 *  having action for the post form and the array having 
		 *  parameters to include in post from
		 * @method post
		 * 
		 */
		post : function( /*Object*/ args) {
			// summary:
			//		Utility function that creates a Form and submit it using the POST action
			// description:
			//		This function is used to implement page navigation using POST
			//
			//		args.action: the action for the POST form
			//		args.params: the array of parameters to include into the POST request
			var prodCode, subProdCode;
			var paramObj = {};
			d.forEach(args.params, function(item){
				paramObj [item.name] = item.value;
			});
			if (misys._config.isBank === 'false' && misys._config.fccuiEnabled && misys._config.fccuiEnabled === 'true' && m.isAngularProductUrl(paramObj.productcode, paramObj.subproductcode)) {
				_navigateToAngularScreen(paramObj);
		} else {
			var reAuth = false; 
			var hideProgressBar = false;
			var navForm = new dj.form.Form({action: args.action, method:'POST', name:'' + new Date().getTime()});
			d.place(navForm.domNode, d.body(), 'last');
			var divForm = d.create('div', null, d.body());
			var obj = "display:none";
			d.attr(divForm, "style", obj);
			d.place(divForm, navForm.domNode, 'first');
			d.forEach(args.params, function(item){
				d.create('input', item, divForm);
				if(item.name === 'operation'&& item.value === 'DELETE_FEATURES'){
					reAuth = true;
				}
				if(item.name === 'option'&& item.value === 'FAILED_UPLOADS'){
					hideProgressBar = true;
				}
			});
			//making sure to pass the software token while submiting the form if present
			if(dj.byId("token")){
				dojo.create('input',{name:'token',value:dijit.byId('token').get('value')},divForm);
			}
			if(!hideProgressBar)
			{
				m.dialog.show("PROGRESS", "");
			}
			if(d.isFunction(m._config.doReauthSubmit)){
				var reauth = dj.byId("reauth_perform");
				if(reauth && reauth.get('value') === "Y" && reAuth){
					 m._config.doReauthSubmit(navForm);
				}else {
					navForm.submit();
				}
			}else {
				navForm.submit();
			}
		}
		},
		
		togglePortletContent : function(/*String*/portletId){
			var showAction = portletId + "-show",
			collapseAction = portletId + "-collapse",
			portletContent,
			portletContentQuery = d.query("#" + portletId + " > .portlet-section-body");
			if(portletContentQuery && portletContentQuery[0])
			{
				portletContent = portletContentQuery[0];
			}
			 
			if(portletContent){
				if(d.style(portletContent,"display") === "none")
				{
					m.animate('wipeIn',portletContent);
					d.style(showAction,"display","none");
					d.style(collapseAction,"display","inline-block");
					d.style(collapseAction, "cursor", "pointer");
				}
				else
				{
					m.animate('wipeOut',portletContent);
					d.style(collapseAction,"display","none");
					d.style(showAction,"display","inline-block");
					d.style(showAction, "cursor", "pointer");
				}
			}
		}
   });
   
   if(!d.isFunction(String.prototype.replaceAll)) {
	   String.prototype.replaceAll = function( /*String*/ target, 
				   							   /*String*/ replacement) {
		   // summary:
		   //  	Replace all instances of target with replacement

		   return d.map(this, function(theChar){
			   return theChar == target ? replacement : theChar;
		   }).join("");
	   };
   }
   
   m._config = (m._config) || {};
   d.mixin(m._config, {
		// summary: 
		//      Setup some configuration params
		   
		imagesSrc : "/content/images/",
		
		// Instead of hardcoding image names, we put theme here. We can then change images
		// across the application, or override for particular clients 
		//
		// For exmaple, PNGs inserted dynamically don't work for IE6, so these images can be 
		// overridden with GIFs/24bit PNGs for such clients.
		imageStore : {
			editIcon : "edit.png",
			deleteIcon : "delete.png",
			downloadIcon : "download.png",
			warningIcon : "warning.png"
		},
		
		//		Real browsers show tables with css display table and rows
		//      as table-row. Internet Explorer wants them all as block. Fine.
		showTable : ("table"),
		showTableRow : ("table-row")
   });
	/**
	 *  <h4>Summary:</h4>
	 *   Disconnects all events in the page.
	 *   Each call to misys.connect pushes the event onto a global array. In this method,
	 *   we try to disconnect each of these events, before the page unloads. This is to correctly
	 *   free browser memory, especially in Internet Explorer.
	 *   We also null the larger global variables and hide and destroy the collaboration window and
	 *   any open dialogs.
	 *   @method addOnWindowUnload
	 */
   d.addOnWindowUnload(function() {
		//  summary:
	    //        Disconnects all events in the page
		//  description:
		//        Each call to misys.connect pushes the event onto a global array. In this method,
		//        we try to disconnect each of these events, before the page unloads. This is to correctly
		//        free browser memory, especially in Internet Explorer.
		//
		//        We also null the larger global variables and hide and destroy the collaboration window and
		//        any open dialogs.
	   
		try {
			d.forEach(m.connections, d.disconnect);
			d.forEach(_floatingWindowIds, function(id){
				var obj = dj.byId ? dj.byId(id) : undefined;
				if(obj) {
					obj.destroyRecursive();
				}
			});
		} catch(err){
			console.error("[misys._base] There was an error unloading an event");
			console.error(err);
		}
		console.debug("[misys._base] Events unloaded");
  });
})(dojo, dijit, misys);