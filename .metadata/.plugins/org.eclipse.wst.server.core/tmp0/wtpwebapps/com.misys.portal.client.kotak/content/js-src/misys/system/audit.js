dojo.provide("misys.system.audit");

//
// Created 04/05/2011
// @author Gauthier Pillon
//

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _fetchAuditDetails( /*String*/ audit_id, 
								 /*String*/ audit_option) {
		// summary:
		//		TODO 
		
		_resetAuditDialog();
		
		m.xhrPost( {
			url : m.getServletURL("/screen/AjaxScreen/action/AuditDialogAction"),
			handleAs : "json",
			content : {
				option: audit_option,
				auditId: audit_id
			},
			sync : true,
			load : function(response, args){
				var date = response.date,
				action = response.action,
				user = response.user,
				company = response.company,
				result = response.result,
				ipaddress = response.ip_address,
				context = response.context,
				items = response.items;
				//product = response.item.product; 
				
				if(date) {
					d.style(d.byId("dateDiv"), "display", "block");
					d.byId("dateSpan").innerHTML = date;
				}
				
				if(action) {
					d.style(d.byId("actionDiv"), "display", "block");
					d.byId("actionSpan").innerHTML = action;
				}
				
				if(user) {
					d.style(d.byId("userDiv"), "display", "block");
					d.byId("userSpan").innerHTML = user;
				}
				
				if(company) {
					d.style(d.byId("companyDiv"), "display", "block");
					d.byId("companySpan").innerHTML = company;
				}
				
				if(result) {
					d.style(d.byId("resultDiv"), "display", "block");
					d.byId("resultSpan").innerHTML = result;
				}
				
				if (ipaddress) {
					d.style(d.byId("ipaddressDiv"), "display", "block");
					d.byId("ipaddressSpan").innerHTML = ipaddress;
				}
				
				if(items){
					dojo.empty("itemsDiv");
					dojo.place(items,'itemsDiv');
				}				
			},
			error : function(response, args){
				console.error("[audit] Technical error while fetching audit details");
				console.error(response);
			}
		});
	}
	
	function _resetAuditDialog() {
		// 	summary:
		//		TODO
		
		d.byId("dateSpan").innerHTML = "";
		d.byId("actionSpan").innerHTML = "";
		d.byId("userSpan").innerHTML = "";
		d.byId("companySpan").innerHTML = "";
		d.byId("resultSpan").innerHTML = "";
		if (d.byId("ipaddressSpan"))
		{
			d.byId("ipaddressSpan").innerHTML = "";
		}
		d.byId("contextSpan").innerHTML = "";
		d.byId("productSpan").innerHTML = "";
		d.style(d.byId("dateDiv"), "display", "none");
		d.style(d.byId("actionDiv"), "display", "none");
		d.style(d.byId("userDiv"), "display", "none");
		d.style(d.byId("companyDiv"), "display", "none");
		d.style(d.byId("resultDiv"), "display", "none");
		if(d.byId("ipaddressDiv"))
		{
			d.style(d.byId("ipaddressDiv"), "display", "none");
		}
		d.style(d.byId("contextDiv"), "display", "none");
		d.style(d.byId("productDiv"), "display", "none");
	} 

	d.mixin(m, {
		showAuditDialog : function( /*String*/ audit_id, 
									/*String*/ audit_option) {
			// summary:
			//		TODO
			
			_fetchAuditDetails(audit_id, audit_option);
			m.dialog.show("HTML",
							    d.byId("auditContainer").innerHTML,
								m.getLocalization("auditDialogTitle"),
								_resetAuditDialog);
		},

		bind : function() {
			m.connect("dttm_begin", "onChange", function() {
				dj.byId("dttm_end").focus();
			});
			m.connect("dttm_end", "onChange", function() {
				dj.byId("dttm_begin").focus();
			});
		}
	});
	

	// Onload/Unload/onWidgetLoad Events

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.system.audit_client');