/**
 * Created : 05/05/2011
 * Timer to handle Idle Session timeout and Session Duration timeout
*/
dojo.provide("misys.binding.SessionTimer");
dojo.require("dijit.form.Button");
// TODO This should be turned into a proper widget. It's not really
//		a proper binding file, it doesn't match the others (+ name is wrong)

(function(/*Dojo*/ d, /*Misys*/m){
	
	"use strict"; // ECMA5 Strict Mode
	
	/*
	 -----------------------------------------------------------------------------
	 Copyright (c) 2000-2011 Misys (http://www.misys.com),
	 All Rights Reserved. 

	 version:   1.1
	 date:      28/06/2011
	 -----------------------------------------------------------------------------
	*/
	
	//Dialog for After Max duration over Session
	function _showMaxDurationOverDialog(){
		
		var sessionMaxDurationOverDialog = dijit.byId("sessionMaxDurationOverDialog");
		var sessionMaxDurationOverDialogButtons = dojo.byId('sessionMaxDurationOverDialogButtons'),
		sessionMaxDurationOverButton = dijit.byId('sessionMaxDurationOverButton').domNode;
		var sessionMaxDurationOverDialogContent = dojo.byId('sessionMaxDurationOverDialogContent'); 

		dojo.style(sessionMaxDurationOverDialogButtons, 'display', 'block');
		dojo.style(sessionMaxDurationOverDialogContent, 'display', 'block');
		dojo.style(sessionMaxDurationOverButton, 'display', 'inline-block');
		dojo.style(sessionMaxDurationOverDialog.closeButtonNode, 'display', 'none');
		sessionMaxDurationOverDialog.set('title', misys.getLocalization('sessionalertMessage'));
		
		// Disable window closing by using the escape key
		misys.dialog.connect(sessionMaxDurationOverDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode == dojo.keys.ESCAPE) {
				dojo.stopEvent(evt);
			}
		});
			
		misys.dialog.connect(dijit.byId('sessionMaxDurationOverButton'), 'onClick', function(){
			misys.dialog.disconnect(sessionMaxDurationOverDialog);
			sessionMaxDurationOverDialog.hide();
			document.location.href = dojo.byId('loginAction').value;
		}, sessionMaxDurationOverDialog.id);
		
		misys.dialog.connect(sessionMaxDurationOverDialog, 'onHide', function() {
				misys.dialog.disconnect(sessionMaxDurationOverDialog);
		});
		
		sessionMaxDurationOverDialog.show();
	}

	
	
	//Dialog for Alerting Idle Session Timeout 
	function _showIdleSessionDialog(){
		var idleDialog = dijit.byId("idleSessionDialog");
		var idleSessionDialogButtons = dojo.byId('idleSessionDialogButtons'),
			sessionContinueButtonNode = dijit.byId('sessionContinueButton').domNode,
			logButtonNode = dijit.byId('sessionlogButton').domNode;
		var idleSessionDialogContent = dojo.byId('idleSessionDialogContent'); 

		dojo.style(idleSessionDialogButtons, 'display', 'block');
		dojo.style(idleSessionDialogContent, 'display', 'block');
		dojo.style(sessionContinueButtonNode, 'display', 'inline-block');
		dojo.style(logButtonNode, 'display', 'inline-block');
		dojo.style(idleDialog.closeButtonNode, 'display', 'none');
		idleDialog.set('title', misys.getLocalization('sessionalertMessage'));
		
		// Disable window closing by using the escape key
		misys.dialog.connect(idleDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode == dojo.keys.ESCAPE) {
				dojo.stopEvent(evt);
			}
		});
		
		misys.dialog.connect(dijit.byId('sessionContinueButton'), 'onClick', function(){

			var sessionOver = false;
			misys.xhrGet( {
				url : misys.getServletURL("/screen/AjaxScreen/action/PingAction"),
				sync : true,
				handleAs : "text",
				load : function(response, args){
					if(response.indexOf('SC_UNAUTHORIZED') !== -1)
					{
						sessionOver = true;
					}							
				},
				customError : function(response, ioArgs) {				
					sessionOver = true;
				}
			});
			
			if(sessionOver){
				misys.showSessionOverDialog();
				misys.dialog.disconnect(idleDialog);
				idleDialog.hide();
			}else{
				misys.idleSessionTimer(0);
				misys.dialog.disconnect(idleDialog);
				idleDialog.hide();
			}
			
		
		}, idleDialog.id);
		
		misys.dialog.connect(dijit.byId('sessionlogButton'), 'onClick', function(){
			misys.dialog.disconnect(idleDialog);
			idleDialog.hide();
			if(dojo.byId('_token') && dojo.byId('logoutAction'))
			{
				misys.post({action:dojo.byId('logoutAction').value, params : [{name:'commonToken', value:dojo.byId('_token').value}]});	
			}
		}, idleDialog.id);
		
		misys.dialog.connect(idleDialog, 'onHide', function() {
				misys.dialog.disconnect(idleDialog);
		});
		
		
		idleDialog.show();
	}
	
	//Dialog for Alerting Max Session Duration Timeout
	function _showDurationSessionDialog(){
		
		//console.debug("Inside _showDurationSessionDialog method starting...... ");
		
		var durationDialog = dijit.byId("durationSessionDialog");
		var durationSessionDialogButtons = dojo.byId('durationSessionDialogButtons'),
			okButtonNode = dijit.byId('OkSessionButton').domNode;
		var durationSessionDialogContent = dojo.byId('durationSessionDialogContent'); 
	
		dojo.style(durationSessionDialogButtons, 'display', 'block');
		dojo.style(durationSessionDialogContent, 'display', 'block');
		dojo.style(okButtonNode, 'display', 'inline-block');
		dojo.style(durationDialog.closeButtonNode, 'display', 'none');
		durationDialog.set('title', misys.getLocalization('sessionalertMessage'));
		
		// Disable window closing by using the escape key
		misys.dialog.connect(durationDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode == dojo.keys.ESCAPE) {
				dojo.stopEvent(evt);
			}
		});
		
		misys.dialog.connect(dijit.byId('OkSessionButton'), 'onClick', function(){
			
			var sessionOver = true;
			misys.xhrGet( {
				url : misys.getServletURL("/screen/AjaxScreen/action/PingAction"),
				sync : true,
				handleAs : "text",
				load : function(response, args){
					if(response.indexOf('SC_UNAUTHORIZED') === -1)
					{
						sessionOver = false;
					}							
				},
				customError : function(response, ioArgs) {				
					sessionOver = false;
				}
			});
			
			if(sessionOver){
				misys.showSessionOverDialog();
				misys.dialog.disconnect(durationDialog);
				durationDialog.hide();
			}else{
				
				misys.dialog.disconnect(durationDialog);
				durationDialog.hide();
			}
			
			
		}, durationDialog.id);
		
		misys.dialog.connect(durationDialog, 'onHide', function() {
				misys.dialog.disconnect(durationDialog);
		});
		
		durationDialog.show();
//		console.debug("Inside _showDurationSessionDialog after showing durationDialog....");
//		console.debug("Inside _showDurationSessionDialog calling startAutoLogoutCounter...... ");
		misys.startAutoLogoutCounter(misys._config.sessionMaxDurationTimeAlert);
	}
	
	
	d.mixin(m, {
		
		//Dialog for Already Expired Session
		showSessionOverDialog : function(){
			
			var sessionOverDialog = dijit.byId("sessionOverDialog");
			var sessionOverDialogButtons = dojo.byId('sessionOverDialogButtons'),
				sessionOverButton = dijit.byId('sessionOverButton').domNode;
			var sessionOverDialogContent = dojo.byId('sessionOverDialogContent'); 

			dojo.style(sessionOverDialogButtons, 'display', 'block');
			dojo.style(sessionOverDialogContent, 'display', 'block');
			dojo.style(sessionOverButton, 'display', 'inline-block');
			dojo.style(sessionOverDialog.closeButtonNode, 'display', 'none');
			sessionOverDialog.set('title', misys.getLocalization('sessionalertMessage'));
			
			// Disable window closing by using the escape key
			misys.dialog.connect(sessionOverDialog, 'onKeyPress', function(evt) {
				if (evt.keyCode == dojo.keys.ESCAPE) {
					dojo.stopEvent(evt);
				}
			});
				
			misys.dialog.connect(dijit.byId('sessionOverButton'), 'onClick', function(){
				misys.dialog.disconnect(sessionOverDialog);
				sessionOverDialog.hide();
				if(dojo.byId('customLoginAction') && dojo.byId('customLoginAction').value)
				{
					document.location.href = dojo.byId('customLoginAction').value;
				}
				else
				{
					document.location.href = dojo.byId('loginAction').value;
				}
			}, sessionOverDialog.id);
			
			misys.dialog.connect(sessionOverDialog, 'onHide', function() {
					misys.dialog.disconnect(sessionOverDialog);
			});
			
			sessionOverDialog.show();
		},
		
		startAutoLogoutCounter : function(sessionMaxDurationTimeAlert){	
			
//			console.debug("Inside startAutoLogoutCounter starting...");
//			console.debug("sessionMaxDurationDialogTimeAlert parameter passes is "+sessionMaxDurationTimeAlert);
			
			var durationDialog = dijit.byId("durationSessionDialog");
			
			//Counter
			if(sessionMaxDurationTimeAlert <= misys._config.sessionMaxDurationTime)
			{
				sessionMaxDurationTimeAlert = sessionMaxDurationTimeAlert+1;
				setTimeout("misys.startAutoLogoutCounter("+sessionMaxDurationTimeAlert+")",1000);
			}
			//TimeOut
			else 
			{
				sessionMaxDurationTimeAlert = 0;
				//fire an ajax for auto logout
				var sessionOver = false;
				misys.xhrGet( {
					url : misys.getServletURL("/screen/AjaxScreen/action/PingAction"),
					sync : true,
					handleAs : "text",
					load : function(response, args){
						if(response.indexOf('SC_UNAUTHORIZED') !== -1)
						{
							sessionOver = true;
							
						}	
//						console.debug("ajax call made to auto logout is sucess and return value of sessionalreadyover is: "+sessionOver);
					},
					customError : function(response, ioArgs) {				
						sessionOver = true;
						//console.debug("ajax call made to auto logout is failed.........");
					}
				});
				
				if(sessionOver){
					//console.debug("calling misys.showSessionOverDialog...");
					misys.showSessionOverDialog();
					misys.dialog.disconnect(durationDialog);
					durationDialog.hide();
				}else{
					
					//console.debug("calling _showMaxDurationOverDialog popup");
					_showMaxDurationOverDialog();
					misys.dialog.disconnect(durationDialog);
					durationDialog.hide();
				}
			}
			
		},
		
		//Timer for Idle Session Duration
		idleSessionTimer : function(idleTimer)
		{
//			console.debug("calling idleSessionTimer..."+idleTimer);
			if(dojo.byId("idleSessionTimeOutIndicator"))
			{ 
				//Counter
				if(idleTimer <= (misys._config.idleSessionTimeOutTime))
				{
					idleTimer = idleTimer+1;
					setTimeout("misys.idleSessionTimer("+idleTimer+")",1000);
				}
				//TimeOut
				else if(!misys._config.stopIdleSessionTimer)
				{
					idleTimer = 0;
					_showIdleSessionDialog();
				}
			}	
			
		},
		
		//Timer for Max Session Duration
		durationSessionTimer : function(durationTimer)
		{
//			console.debug("calling durationSessionTimer..."+durationTimer);
			if(dojo.byId("sessionMaxDurationIndicator"))
			{	
				var sessionTime = misys._config.presentTime - misys._config.loginTime;
				sessionTime = Math.floor(sessionTime/1000);
				var sessionMaxDurationDialogTimeAlert = misys._config.sessionMaxDurationTimeAlert;
				var remainingTime = sessionMaxDurationDialogTimeAlert - sessionTime;
				
				//Counter
				if(durationTimer <= (remainingTime))
				{
					durationTimer = durationTimer+1;
					setTimeout("misys.durationSessionTimer("+durationTimer+")",1000);
				}
				//TimeOut
				else 
				{
//					console.debug("Inside durationSessionTimer method and durationTimer is"+ durationTimer);
					durationTimer = 0;
					_showDurationSessionDialog();
					//make sure idle-dialog is closed if it is on open state
					misys._config.stopIdleSessionTimer = true;
					//misys.idleSessionTimer(0);
					var idleDialog = dijit.byId("idleSessionDialog");
					if(idleDialog){
						//just call hide
				
					idleDialog.hide();
					}
//					console.debug("Inside durationSessionTimer method end");
					
				}
			}
		}
	});
})(dojo, misys);
