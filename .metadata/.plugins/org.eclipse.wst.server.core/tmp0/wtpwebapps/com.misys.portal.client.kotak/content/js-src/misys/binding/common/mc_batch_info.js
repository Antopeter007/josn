dojo.provide("misys.binding.common.mc_batch_info");

(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	"use strict"; 
//Holidays And CutOffTime Error Dialog With Auto Forward Operation
	/**
	 * <h4>Summary:</h4>
	 * This method is for showing error dialog for the holiday and cutoff time error.
	 * @param {String} mode
	 * @param {boolean} autoFormwardEnabled
	 * @method _showHolidaysNCutOffTimeErrorDialog
	 */
	function _showHolidaysNCutOffTimeErrorDialog(/*boolean*/autoForwardEnabled, /*String*/ message, /*boolean*/ reauthEnabled)
	{	
   	 	var mode = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
   	 	var autoForwardButton  = dijit.byId("forwardHolidayButtonId") ? dijit.byId("forwardHolidayButtonId") : new dj.form.Button({label:"Auto Forward",id:"forwardHolidayButtonId"});
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
			var cancelButton  = new dj.form.Button({label:"Cancel",id:"cancelHolidayButtonId"});

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
					dj.byId("autoForward").set("value", "Y");
					dj.byId("TransactionData").set("value", m.formToXML());
					m.performReauth();
				}
				else
				{
					holidayDialog.hide();
					m.submit();
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
			holidayDialog.hide();
		}, holidayDialog.id);
		
		//On Hide of Dialog
		m.dialog.connect(holidayDialog, 'onHide', function() {
			m.dialog.disconnect(holidayDialog);
			m.dialog.hide();
		});
		
		//Show the Dialog
		holidayDialog.show();
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'MB',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : '',				
				amount : '',
				batch_id : dj.byId("batch_id") ? dj.byId('batch_id').get("value") : "",
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
		generateEsignRequest : function(/*String*/operation){
			dj.byId("realform_operation").set("value", operation);
			var callBack = function(){
				dj.byId("TransactionData").set("value", m.formToXML());
				dj.byId("realform").submit();
			};
			m.dialog.show("CONFIRMATION",m.getLocalization("generateEsignRequest"),'',callBack);
		},
		proxyAuthorise : function(/*String*/operation){
			dj.byId("realform_operation").set("value", operation);
			var callBack = function(){
				dj.byId("TransactionData").set("value", m.formToXML());
				dj.byId("realform").submit();
			};
			m.dialog.show("CONFIRMATION",m.getLocalization("proxyAuthorise"),'',callBack);
		},
		deleteBatch : function(/*String*/operation){
			dj.byId("realform_operation").set("value", operation);
			var callBack = function(){
				dj.byId("TransactionData").set("value", m.formToXML());
				dj.byId("realform").submit();
			};
			m.dialog.show("CONFIRMATION",m.getLocalization("deleteBatchConfirmation"),'',callBack);
		},
		
		
		checkAndShowReAuthDialog : function ( /* Collection */ paramsReAuth) {		

			// Summary: This function is to make a Ajax call to find out whether re-auth is needed 
			//          if needed it builds the re-auth pop up screen
			
			console.debug('[FormEvents] Checking for reAuth requirement');
			
			m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/ReAuthenticationAjax"),
			handleAs : "text",
			sync : true,
			preventCache: true,
			content : {
				productCode : paramsReAuth.productCode,
				subProductCode : paramsReAuth.subProductCode,
				transactionTypeCode : paramsReAuth.transactionTypeCode,
				entity : (paramsReAuth.entity) ? paramsReAuth.entity : '',		
				currency : (paramsReAuth.currency) ? paramsReAuth.currency : '',
				amount : (paramsReAuth.amount) ? paramsReAuth.amount : '',
				batch_id : paramsReAuth.batch_id ? paramsReAuth.batch_id : ""
			},		
			load : function(response, ioArgs)
			{   
				
					
				    if(!(response.indexOf('SC_UNAUTHORIZED') === -1))
				    {
				    	misys.showSessionOverDialog();
				    }
				    else
				    {
				    
						m.setContentInReAuthDialog(response, ioArgs);
						if (""+response+"" != '01')
						{
							dj.byId("reauth_dialog").show(); 
						}
				    }
			},
			customError : function(response, ioArgs)
			{
				console.debug("Error in ReAuthenticationAjax Call");
				console.error(response);
				m.setContentInReAuthDialog("ERROR", ioArgs);
				dj.byId("reauth_dialog").show();
			}

			});
		
		},
		
		
		
		submitBatchWithHolidayCutOffValidation : function( /*String*/batchId, /*String*/ operation) {
			
			// summary:
			//		Triggers the submission of transaction records along with holiday cut-off validation.
			// 		Also promts user to Auto Forward Dates with Holiday-CutOff Validation Fails	
			if(misys.client.submitBatchWithHolidayCutOffValidation)
			{
				misys.client.submitBatchWithHolidayCutOffValidation(batchId, operation);
			}
			else
			{
			var isValid = true, xhrParams, autoForwardTransactionDetails,failedTransactionDetailsHolidays,failedTransactionDetailsCutOff,autoForwardEnabled;
			dj.byId("realform_operation").set("value", operation);
			var callBack = function(){
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/ValidateHolidayCutOffMultipleSubmission"),
					sync : true,
					handleAs : "json",
					content: {"batch_id": batchId},
					load : function(response, args){
						isValid = response.isValid;
						autoForwardTransactionDetails = response.autoForwardTransactionDetails;
						failedTransactionDetailsCutOff = response.failedTransactionDetailsCutOff;
						failedTransactionDetailsHolidays = response.failedTransactionDetailsHolidays;
						autoForwardEnabled = response.autoForwardEnabled;
					},
					error : function(response, args){
						//Should be prevent from submitting when there is a error ?
						//isValid = false;
						console.error("[misys.grid._base] submitBatchWithHolidayCutOffValidation error", response);
					}
				});
					
				if(isValid)
				{
					m.performReauth();
				}
				else
				{
					var reauth = dj.byId("reauth_perform");
					var details = [];
						if(autoForwardEnabled)
						{
							
							if (failedTransactionDetailsCutOff.length > 0)
							{
								details.push("<div <b>" + m.getLocalization("failedMultipleSubmissionCutOff")+ "</b><br/>");
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
							details.push("<div style='display:block;'><b>" + m.getLocalization("autoForwardMultipleSubmission")+ "</b><br/>");
							
							details.push("</div>");
							
							//If doReauthSubmit is overridden in client specific then it will take the flow control 
							if(reauth && reauth.get("value") === "Y")
							{
								_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled , details, true);
							}
							else
							{
								_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled, details , false);
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
							//If doReauthSubmit is overridden in client specific then it will take the flow control 
							if(reauth && reauth.get("value") === "Y")
							{
								_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled , details, true);
							}
							else
							{
								_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled, details , false);
							}
						}
					}
			};
			m.dialog.show("CONFIRMATION",m.getLocalization("submitBatchConfirmation"),'',callBack);
		}
		},
		performReauth: function(){
			var reauth = dj.byId("reauth_perform");
			if(reauth && reauth.get('value') === "Y" ) 
			{
				 var paramsReAuth = {};
				 if(d.isFunction(m._config.initReAuthParams)) {
					 paramsReAuth =  m._config.initReAuthParams();
					 m.checkAndShowReAuthDialog(paramsReAuth);
				 }else{
					 console.debug("Doesnt find the function initReAuthParams for ReAuthentication");
					 m.setContentInReAuthDialog("ERROR", "");
					 dj.byId("reauth_dialog").show();
				 }
			}
			else {
				dj.byId("TransactionData").set("value", m.formToXML());
				dj.byId("realform").submit();
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.mc_batch_info_client');