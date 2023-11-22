dojo.provide("misys.binding.common.remote_authorisation");

(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	d.mixin(m, {
		sendEsignRequest : function(/*String*/operation){
			if(dj.byId("authoriser_name").get("value") === "")
			{
				m.dialog.show("ERROR",m.getLocalization("selectAuthoriserError"));
				return;
			}
			if(!dj.byId("esign_request_mode_email").get("checked") && !dj.byId("esign_request_mode_sms").get("checked"))
			{
				m.dialog.show("ERROR",m.getLocalization("selectRequestModeError"));
				return;
			}
			
			if(dj.byId("authoriser_name").get("value") !== "" && (dj.byId("esign_request_mode_email").get("checked") || dj.byId("esign_request_mode_sms").get("checked")))
			{
				dj.byId("realform_operation").set("value", operation);
				if(dj.byId("esign_request_mode_email").get("checked"))
				{
					dj.byId("request_mode").set("value","email");
				}
				else
				{
					dj.byId("request_mode").set("value","sms");
				}
				console.debug("Esign Request Mode : ", dj.byId("request_mode").get("value"));
				console.debug("mobile_phone : ", dj.byId("mobile_phone").get("value"));
				console.debug("email : ", dj.byId("email").get("value"));
				console.debug("authoriser_id : ", dj.byId("authoriser_id").get("value"));
				
				var callBack = function(){
					dj.byId("TransactionData").set("value", m.formToXML());
					dj.byId("realform").submit();
				};
				m.dialog.show("CONFIRMATION",m.getLocalization("sendEsignRequestConfirm"),'',callBack);
			}
		},
		submitProxyAuthorise : function( /*String*/batchId, /*String*/ operation) {
			// summary:
			//		Triggers the submission of transaction records along with holiday cut-off validation.
			// 		Also promts user to Auto Forward Dates with Holiday-CutOff Validation Fails
			
			if(dj.byId("authoriser").get("value") === "")
			{
				m.dialog.show("ERROR",m.getLocalization("selectAuthoriserError"));
				return;
			}
			if(dj.byId("remote_auth_otp_response").get("value") === "")
			{
				m.dialog.show("ERROR",m.getLocalization("inputOTPResponseError"));
				return;
			}
			if(dj.byId("authoriser").get("value") !== "" && dj.byId("remote_auth_otp_response").get("value") !== "")
			{
				dj.byId("realform_operation").set("value", operation);
				dj.byId("authoriser_id").set("value",dj.byId("authoriser").get("value"));
				var isValid = true, autoForwardTransactionDetails;
				
				var callBack = function(){
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/ValidateHolidayCutOffMultipleSubmission"),
						sync : true,
						handleAs : "json",
						content: {"batch_id": batchId},
						load : function(response, args){
							isValid = response.isValid;
							autoForwardTransactionDetails = response.autoForwardTransactionDetails;
						},
						error : function(response, args){
							//Should be prevent from submitting when there is a error ?
							//isValid = false;
							console.error("[misys.grid._base] submitBatchWithHolidayCutOffValidation error", response);
						}
					});
						
					if(isValid)
					{
						dj.byId("TransactionData").set("value", m.formToXML());
						dj.byId("realform").submit();
					}
					else
					{
						var details = [];
						details.push("<b>" + m.getLocalization("autoForwardMultipleSubmission")+ "</b><br/>");
						
						d.forEach(autoForwardTransactionDetails,function(node){
							details.push("<li>"+node+"</li>");
						});
						
						var callBackAutoForward = function(){
							dj.byId("autoForward").set("value", "Y");
							dj.byId("TransactionData").set("value", m.formToXML());
							dj.byId("realform").submit();
						};
						m.dialog.show("CONFIRMATION",details.join(''),'',callBackAutoForward);
					}
				};
				m.dialog.show("CONFIRMATION",m.getLocalization("proxyAuthoriseTransaction"),'',callBack);
			}
		},
		
		bind : function()
		{
			m.connect("authoriser_name","onChange",function(){
				if(dj.byId("email").get("value") !== "")
				{
					d.byId("email_display").innerHTML = dj.byId("email").get("value");
					dj.byId("esign_request_mode_email").set("checked",false);
					dj.byId("esign_request_mode_email").set("disabled",false);
					if(dj.byId("mobile_phone").get("value") === "")
					{
						dj.byId("esign_request_mode_email").set("checked",true);
						dj.byId("esign_request_mode_sms").set("checked",false);
						dj.byId("esign_request_mode_sms").set("disabled",true);
						d.byId("mobile_phone_display").innerHTML = "-";
					}
					else
					{
						d.byId("mobile_phone_display").innerHTML = dj.byId("mobile_phone").get("value");
						dj.byId("esign_request_mode_sms").set("checked",false);
						dj.byId("esign_request_mode_sms").set("disabled",false);
					}
				}
				else
				{
					dj.byId("esign_request_mode_email").set("checked",false);
					dj.byId("esign_request_mode_email").set("disabled",true);
					d.byId("email_display").innerHTML = "-";
					if(dj.byId("mobile_phone").get("value") === "")
					{
						dj.byId("esign_request_mode_sms").set("checked",false);
						dj.byId("esign_request_mode_sms").set("disabled",true);
						d.byId("mobile_phone_display").innerHTML = "-";
					}
					else
					{
						d.byId("mobile_phone_display").innerHTML = dj.byId("mobile_phone").get("value");
						dj.byId("esign_request_mode_sms").set("disabled",false);
						dj.byId("esign_request_mode_sms").set("checked",true);
					}
				}
				if(dj.byId("email").get("value") !== "" && dj.byId("mobile_phone").get("value") !== "")
				{
					dj.byId("esign_request_mode_sms").set("checked",true);
				}
			});
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.remote_authorisation_client');