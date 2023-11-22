dojo.provide("misys.binding.dialog.baselineCustomer");

//
// Copyright (c) 2000-2011 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for Add a Beneficiary popup
//
// version:   1.2
// date:      18/04/11
//

dojo.require("dijit.layout.TabContainer");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//
	function _toggleProductFields( /*Boolean*/ isChecked,
										/*Boolean*/ keepValues) {
		var counterpartyProducts = dojo.byId("counterparty-products");
		if (isChecked) {
			m.animate("fadeIn", counterpartyProducts);
		} else {
			m.animate("fadeOut", counterpartyProducts);
		}

		var fieldIds =[];
		d.forEach(d.query("[id*='counterparty_permission_']").query("[id]"),
				function(field) {
					fieldIds.push(field.id);
		});
		m.toggleFields(isChecked, fieldIds, null, keepValues);
	}
	
	/**
	 * TMA fields are MutuallyExclusive on FSCM and CreditNote and CounterpartyCollaboration fields.
	 * This method resolves the conflict between FSCM and Proprietary-id fields.
	 *  
	 * @param {Boolean} makePrtryIdEmpty
	 * @method _resolveTMAFields
	 */
	function _resolveTMAFields(makePrtryIdEmpty){
		var tmaPropIdTypeFlag = dj.byId("popup_prtry_id_type_flag");
		var tmaPropIdType = dj.byId("popup_prtry_id_type");
		var isThisSubmitProcess = makePrtryIdEmpty;

		if(tmaPropIdTypeFlag && tmaPropIdType){
			if(isThisSubmitProcess)
			{
				tmaPropIdType.set("required", false);
				tmaPropIdType.set("value", "");
			}
			
			if(tmaPropIdType.get("value")){
				tmaPropIdTypeFlag.set("checked", true);
				tmaPropIdTypeFlag.set("readOnly", true);
			}
			else{
				tmaPropIdTypeFlag.set("checked", false);
				tmaPropIdTypeFlag.set("readOnly", false);
			}
		}
	}
	
	//
	// Public functions & variables
	//
	d.mixin(m.dialog, {
		bind: function(){
			m.setValidation("popup_abbv_name", m.validateCharactersExcludeSpace);
			m.connect("popup_abbv_name", "onKeyPress", function(e){
				if (e.keyCode === 32 || e.charCode === 32)
				{
					dojo.stopEvent(e);
				}
			});

			m.connect("popup_abbv_name", "onChange", function(e){
				var thisField = this;
				var cptyAbbvName = this.get('value');
				var tmaPropIdTypeFlag = dj.byId("popup_prtry_id_type_flag");
				var tmaPropIdType = dj.byId("popup_prtry_id_type");
				var tmaPropIdTypeDiv = d.byId("popup_prtry_id_type_div");

				if(tmaPropIdTypeFlag && tmaPropIdType && cptyAbbvName != '') {

					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckStaticBeneficiaryAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							cpty_abbv_name : cptyAbbvName
						},
						load : function(response){
							if(response.items.prtryIdType)
							{
								tmaPropIdType.set("value", response.items.prtryIdType);
								tmaPropIdType.set("readOnly", true);
								tmaPropIdType.set("required", false);
								_resolveTMAFields(false);

								// Just intimate regarding the beneficiary with the name(in context) is already exist.
								dj.showTooltip(m.getLocalization("beneficiaryAlreadyExist", [cptyAbbvName]), thisField.domNode, 0);
								setTimeout(function(){dj.hideTooltip(thisField.domNode);}, 5000);
							}
							else
							{
								if(tmaPropIdType.get("readOnly")){
									tmaPropIdType.set("value", "");
								}
								tmaPropIdTypeFlag.set("checked", false);
								_resolveTMAFields(true);
							}
						} 
					});
				}
			});
			
			m.connect("popup_prtry_id_type","onBlur", function(){
				var field = this;
				if(field && !field.get("readOnly"))
				{
					var abbvName = dj.byId("popup_abbv_name");
					var cptyAbbvName = abbvName ? abbvName.get("value"):"";

					var prtryIdTypeValue = field.get('value');
					var tmaPropIdTypeFlag = dj.byId("popup_prtry_id_type_flag");
					var tmaPropIdType = dj.byId("popup_prtry_id_type");
					var tmaPropIdTypeDiv = d.byId("popup_prtry_id_type_div");

					var prtryIdTypeSeprtr = dj.byId("popup_prtry_id_type_separator");
					var idTypeSeprtr = prtryIdTypeSeprtr?prtryIdTypeSeprtr.get("value"):"";
					var splitPrtryIdTypeValue = prtryIdTypeValue?prtryIdTypeValue.split(idTypeSeprtr):"";
					// Proprietary Id
					var propId = splitPrtryIdTypeValue[0];
					// Proprietary Id Type
					var propIdType = splitPrtryIdTypeValue[1];
					var tmaValLength = prtryIdTypeValue.length;
					var isSeprtrPositionInvalid = (prtryIdTypeValue.indexOf(idTypeSeprtr)=== 0 || prtryIdTypeValue.indexOf(idTypeSeprtr)=== tmaValLength-1 || prtryIdTypeValue.indexOf(idTypeSeprtr)=== -1) ;
					var isSeprtrAppearsMoreThanTwice = splitPrtryIdTypeValue && splitPrtryIdTypeValue.length > 2 ;
					
					if(prtryIdTypeValue && (isSeprtrPositionInvalid || isSeprtrAppearsMoreThanTwice)){
						console.debug("Invalid Format: Expected format is <ProprietaryId><configured-separator><ProprietaryType> ");
						field.set("state","Error");
						dj.hideTooltip(field.domNode);
						dj.showTooltip(m.getLocalization("invalidPrtryIdTypeFormat", [ idTypeSeprtr ]), field.domNode, 0);
						setTimeout(function(){dj.hideTooltip(field.domNode);}, 5000);
					}
				    if(propId && propId.length > 35 || propIdType && propIdType.length > 35)
				    {
					    console.debug("Individual length of ProprietaryId and ProprietaryType should be less or equal to 35");
						field.set("state","Error");
						dj.hideTooltip(field.domNode);
						dj.showTooltip(m.getLocalization("lengthTMAField"), field.domNode, 0);
						setTimeout(function(){dj.hideTooltip(field.domNode);}, 5000);
				    }

					if(tmaPropIdTypeFlag && tmaPropIdType && prtryIdTypeValue != '') {

						m.xhrPost( {
							url : m.getServletURL("/screen/AjaxScreen/action/CheckStaticBeneficiaryAction"),
							handleAs 	: "json",
							sync 		: true,
							content : {
								cpty_abbv_name : cptyAbbvName,
								prtry_id_type : prtryIdTypeValue
							},
							load : function(response){
								if(response.items.isDuplicate){
									console.debug("Duplicate: This type of Proprietary-id is already assgined to another party.");
									field.set("value", "");
									field.set("state","Error");
									dj.hideTooltip(field.domNode);
									dj.showTooltip(m.getLocalization("duplicatePrtryIdType"), field.domNode, 0);
									setTimeout(function(){dj.hideTooltip(field.domNode);}, 5000);
								}
							} 
						});
					}
				}
				
			});
			
			m.connect("popup_prtry_id_type_flag","onChange", function(){
				var tmaPropIdType = dj.byId("popup_prtry_id_type");
				var tmaPropIdTypeDiv = d.byId("popup_prtry_id_type_div");
				
				if(this.get("checked") && this.get("readOnly") && tmaPropIdType.get("value")){
					// onBlur of counter-party abbv_name i.e., when modifying counter-party name this block will get into use
					tmaPropIdType.set("readOnly", true);
					tmaPropIdType.set("required", false);
					m.animate("fadeIn", tmaPropIdTypeDiv);
				}
				else if(this.get("checked")){
					tmaPropIdType.set("readOnly", false);
					tmaPropIdType.set("required", true);
					m.animate("fadeIn", tmaPropIdTypeDiv);
				}
				else{
					tmaPropIdType.set("required", false);
					if(!tmaPropIdType.get("readOnly")){
						tmaPropIdType.set("value", "");
					}
					tmaPropIdType.set("readOnly", true);
					m.animate("fadeOut", tmaPropIdTypeDiv);
				}
			});

			m.setValidation("popup_country", m.validateCountry);
			m.setValidation("popup_phone", m.validatePhoneOrFax);
			m.setValidation("popup_fax", m.validatePhoneOrFax);
			m.setValidation("popup_telex", m.validatePhoneOrFax);
			m.setValidation("popup_email", m.validateEmailAddr);
			m.setValidation("popup_web_address", m.validateWebAddr);
			m.setValidation("popup_bei", m.validateBEIFormat);
			m.setValidation("popup_iso_code", m.validateBICFormat);
			m.connect("popup_post_code", "onBlur", function() {
				dj.byId("popup_swift_address_address_line_1").set("value",
						this.get("value"));
			});
			m.connect("popup_address_line_1", "onBlur", function() {
				dj.byId("popup_address_line_1").set("value", this.get("value"));
			});
			m.connect("popup_access_opened", "onClick", function() {
				m.toggleFields(this.get("checked"), ["popup_notification_enabled"], null);
				dj.byId("popup_notification_enabled").onClick();
			});
			m.connect("popup_notification_enabled", "onClick", function() {
				_toggleProductFields(this.get("checked"), false);
			});
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.dialog.baselineCustomer_client');