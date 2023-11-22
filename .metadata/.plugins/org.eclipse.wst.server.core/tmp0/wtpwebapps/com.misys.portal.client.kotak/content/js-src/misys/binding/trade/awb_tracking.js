/*
 * ---------------------------------------------------------- Event Binding for
 * 
 * AirwayBill Tracking System
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.trade.awb_tracking");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		goToDHLTracking : function() 
		{
			window.open( d.byId("dhlUrl").value, "_blank");
			dj.byId('AWBDialog').hide();
		},
		
		onCancelAWB: function()
		{
	        document.body.style.overflow = "visible";
	    },
		
		showAWB : function() 
		{
			var dialog = dj.byId('AWBDialog');
			if (!dialog) {
				d.require('misys.widget.Dialog');
				d.require('dijit.form.Button');
				d.parser.parse('AWBDialogContainer');
				dialog = dj.byId('AWBDialog');

				// Add dialog class, so we can hide the close button
				d.addClass(dialog.domNode, 'dialog');
			}

			dialog.set('title', m.getLocalization('confirmationMessage'));
			
			// Disable window closing by using the escape key
			m.dialog.connect(dialog, 'onKeyPress', function(evt) {
				if (evt.keyCode == d.keys.ESCAPE) {
					d.stopEvent(evt);
				}
			});
			m.dialog.connect(d.byId('cancelButtonAWB1'), 'onMouseUp', function(){
				dialog.hide();
			}, dialog.id);
			
			m.dialog.connect(dialog, 'onHide', function() {
				m.dialog.disconnect(dialog);
			});
			
			dialog.show();
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.awb_tracking_client');