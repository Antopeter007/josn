dojo.provide("misys.form.addon_definitions");

//Copyright (c) 2000-2011 Misys (http://www.m.com),
//All Rights Reserved. 
//
//summary:
//	JSON descriptions of the mandatory and hidden fields, and table cells, that should be
//  generated for each transaction addon.
//
//	They are accessed in the following manner, returning a JSON structure
//
//		misys._addons.hiddenFields["addontype"](id, prefix)
//		misys._addons.mandatoryFields["addontype"](prefix)
//		misys._addons.tableCells["addontype"](prefix)
//
//	In addition, in some cases we need to fire specific bindings, or perform actions on
//	addon delete. These functions perform actions but return nothing. 
//
//		misys._addons.bind["addontype"]()   // sometimes takes an argument
//		misys._addons.deleteAddon["addontype"](id)
//		
//
//	NOTE For functions that simply return an array, don"t be tempted to push the opening array
//	square bracket onto a newline following the return statement. A return statement *must* be
//	followed by something other than a carriage return, otherwise the JS parser will automatically
//	add a semi-colon and the function will return nothing.
//
//version:   1.1
//date:      13/07/2011
//author:    Cormac Flynn
//email:     cormac.flynn@m.com

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions & variables go here

	function _getChargeBearerCode() {
		// summary:
		//		TODO
		
		var productCode = m._config.productCode.toLowerCase();
		
		// Map equivalent codes
		productCode = (productCode === "sr") ? "el" : productCode;
		productCode = (productCode === "ir") ? "ic" : productCode;
		productCode = (productCode === "sr") ? "ec" : productCode;
		productCode = (productCode === "bg" || productCode === "sg" ||
					   productCode === "ft" || productCode === "tf" ||
					   productCode === "si" || productCode === "li") ? "lc" : productCode;
		
		switch(productCode) {
		case "lc":
			return "01";
			break;
		case "el":
			return "02";
			break;
		case "ic":
			return "03";
			break;
		case "ec":
			return "04";
			break;
		default:
			break;
		}
		
		return "";
	}
	
	m._addons = m._addons || {};
	d.mixin(m._addons, {
		
		hiddenFields : {
			// summary: 
			//		A collection of functions that each return an array of JSON objects 
			//		representing the hidden fields that should be created for the given
			//		transaction addon
			
			alert01 : function( /*String*/ id, /*String*/ prefix) {
				var typefield = "alert01_type_nosend",
					typefieldName = "_tnxtype",
					fields = [];
				
				if(dj.byId(typefield)) {
					fields.push({
			    		name: "alerts_01_details_select_prodcode_" + id,
			    		id: "alert01_product_nosend",
			    		value: dj.byId("alert01_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_prodcode_" + id,
			    		id: "alert01_product_nosend",
			    		value: dj.byId("alert01_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_proddecode_" + id,
			    		id: "alert01_product_nosend",
			    		value:dj.byId("alert01_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_select"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_01_details"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_01_details"+typefieldName+"decode_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_01_details_usercode_" + id,
			    		id: "alert01_details_usercode_nosend",
			    		value: dj.byId("alert01_details_usercode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_langcode_" + id,
			    		id: "alert01_details_langcode_nosend",
			    		value: dj.byId("alert01_details_langcode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_address_" + id,
			    		id: "alert01_details_email_nosend",
			    		value: dj.byId("alert01_details_email_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_position_" + id,
			    		value: id
			    	},
			    	{
			    		name: "alerts_01_details_address_value_" + id,
			    		id: "alert01_details_address_value_nosend",
			    		value: dj.byId("alert01_details_usercode_nosend").get("value")?
			    				m._config.recipientCollection[dj.byId("alert01_details_usercode_nosend").get("value")] :
			    					dj.byId("alert01_details_email_nosend").get("value")
			    	});
				} else {
					typefield = "alert01_datecode_nosend";
					typefieldName = "_date";
					fields.push({
			    		name: "alerts_01_details_select_prodcode_" + id,
			    		id: "alert01_product_nosend",
			    		value: dj.byId("alert01_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_prodcode_" + id,
			    		id: "alert01_product_nosend",
			    		value: dj.byId("alert01_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_proddecode_" + id,
			    		id: "alert01_product_nosend",
			    		value:dj.byId("alert01_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_select"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_01_details"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_01_details"+typefieldName+"decode_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_01_details_offsetcode_" + id,
			    		id: "alert01_details_offsetcode_nosend",
			    		value: dj.byId("alert01_details_offsetcode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_offsetsigncode_" + id,
			    		id: dj.byId("alert01_details_offsetsigncode_nosend_1").get("checked") ?
			    				"alert01_details_offsetsigncode_nosend_1" : "alert01_details_offsetsigncode_nosend_0",
			    		value: dj.byId("alert01_details_offsetsigncode_nosend_0").get("checked") ? 0 : 1
			    	},
			    	{
			    		name: "alerts_01_details_usercode_" + id,
			    		id: "alert01_details_usercode_nosend",
			    		value: dj.byId("alert01_details_usercode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_langcode_" + id,
			    		id: "alert01_details_langcode_nosend",
			    		value: dj.byId("alert01_details_langcode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_address_" + id,
			    		id: "alert01_details_email_nosend",
			    		value: dj.byId("alert01_details_email_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_01_details_position_" + id,
			    		value: id
			    	},
			    	{
			    		name: "alerts_01_details_address_value_" + id,
			    		id: "alert01_details_address_value_nosend",
			    		value: dj.byId("alert01_details_usercode_nosend").get("value")?
			    				m._config.recipientCollection[dj.byId("alert01_details_usercode_nosend").get("value")] : dj.byId("alert01_details_email_nosend").get("value")
			    	});
				}
				
				// If there is an entity
				if (dj.byId("01entity")) {
					fields.unshift({
							name: "alerts_01_details_entity_" + id,
				    		id: "alert01_details_entity_nosend",
				    		value: dj.byId("01entity").get("value")
					});
				}
				
				return fields;
			},
			
			alert02 : function( /*String*/ id, /*String*/ prefix) {
				var typefield = "alert02_type_nosend",
					typefieldName = "_tnxtype",
					fields = [];
				
				if(dj.byId("alert02_type_nosend")){
					fields.push({
			    		name: "alerts_02_details_select_prodcode_" + id,
			    		id: "alert02_product_nosend",
			    		value: dj.byId("alert02_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_prodcode_" + id,
			    		id: "alert02_product_nosend",
			    		value: dj.byId("alert02_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_proddecode_" + id,
			    		id: "alert02_product_nosend",
			    		value: dj.byId("alert02_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_select"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_02_details"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_02_details"+typefieldName+"decode_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_02_details_usercode_" + id,
			    		id: "alert02_details_usercode_nosend",
			    		value: dj.byId("alert02_details_usercode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_langcode_" + id,
			    		id: "alert02_details_langcode_nosend",
			    		value: dj.byId("alert02_details_langcode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_address_" + id,
			    		id: "alert02_details_email_nosend",
			    		value: dj.byId("alert02_details_email_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_position_" + id,
			    		value: id
			    	},
			    	{
			    		name: "alerts_02_details_address_value_" + id,
			    		id: "alert02_details_address_nosend",
			    		value: dj.byId("alert02_details_usercode_nosend").get("value")?
			    				m._config.recipientCollection[dj.byId("alert02_details_usercode_nosend").get("value")] : dj.byId("alert02_details_email_nosend").get("value")
			    	});
				} else {
					typefield = "alert02_datecode_nosend";
					typefieldName = "_date";
					fields.push({
			    		name: "alerts_02_details_select_prodcode_" + id,
			    		id: "alert02_product_nosend",
			    		value: dj.byId("alert02_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_prodcode_" + id,
			    		id: "alert02_product_nosend",
			    		value: dj.byId("alert02_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_proddecode_" + id,
			    		id: "alert02_product_nosend",
			    		value: dj.byId("alert02_product_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_select"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_02_details"+typefieldName+"code_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_02_details"+typefieldName+"decode_" + id,
			    		id: typefield,
			    		value: dj.byId(typefield).get("value")
			    	},
			    	{
			    		name: "alerts_02_details_offsetcode_" + id,
			    		id: "alert02_details_offsetcode_nosend",
			    		value: dj.byId("alert02_details_offsetcode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_offsetsigncode_" + id,
			    		id: dj.byId("alert02_details_offsetsigncode_nosend_0").get("checked") ?
			    				"alert02_details_offsetsigncode_nosend_0" : "alert02_details_offsetsigncode_nosend_1",
			    		value: dj.byId("alert02_details_offsetsigncode_nosend_0").get("checked") ?
			    								0 : 1
			    	},
			    	{
			    		name: "alerts_02_details_usercode_" + id,
			    		id: "alert02_details_usercode_nosend",
			    		value: dj.byId("alert02_details_usercode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_langcode_" + id,
			    		id: "alert02_details_langcode_nosend",
			    		value: dj.byId("alert02_details_langcode_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_address_" + id,
			    		id: "alert02_details_email_nosend",
			    		value: dj.byId("alert02_details_email_nosend").get("value")
			    	},
			    	{
			    		name: "alerts_02_details_position_" + id,
			    		value: id
			    	},
			    	{
			    		name: "alerts_02_details_address_value_" + id,
			    		id: "alert02_details_address_nosend",
			    		value: dj.byId("alert02_details_usercode_nosend").get("value")?
			    				m._config.recipientCollection[dj.byId("alert02_details_usercode_nosend").get("value")] : dj.byId("alert02_details_email_nosend").get("value")
			    	});
				}
				
				return fields;
			},
			
			customerReference : function( /*String*/ id, /*String*/ prefix) {
				// summary: 
				//		TODO
				
				var targetBank = dj.byId("customerReference_target_bank").get("value");
				var bank = targetBank ? "_" +targetBank : "";
				var	fields = [];
				var coreFields = misys._config.coreReferenceFields || [];
				var customFields = misys._config.customReferenceFields || [];
				var allFields = coreFields.concat(customFields);
				
				dojo.forEach(allFields,function(field, index){
					if(dj.byId("customerReference" + bank + "_details_"+field+"_nosend") ){
						fields.push({
							name: "customer_reference" + bank + "_details_"+field+"_" + id,
							id: "customerReference" + bank + "_details_"+field+"_nosend",
							value: dj.byId("customerReference" + bank + "_details_"+field+"_nosend").get("value")
						});
					}
				});
				
				fields.push({
					name: "customer_reference" + bank + "_details_position_" + id,
					id: "customerReference" + bank + "_details_position_nosend",
					value: m._config["customerReference" + bank + "Attached"] + 1
				});
				
				if(dj.byId("customerReference" + bank + "_details_liquidityenabledflag_nosend")){
					fields.push({
						name: "customer_reference" + bank + "_details_"+"liquidityenabledflag"+"_" + id,
						id: "customerReference" + bank + "_details_"+"liquidityenabledflag"+"_nosend",
						value: dj.byId("customerReference" + bank + "_details_liquidityenabledflag_nosend").get("value")
					});
				}
				
				return fields;
			},
			
			counterparty : function( /*String*/ id, /*String*/ prefix) {
				// summary:
				//		TODO
				
				var fields = [];
				
				// TODO These details look wrong, the id and names
				fields.push({
					name : "counterparty_details_act_no_" + id,
					id : "counterparty_details_act_no_nosend",
					value :dj.byId("counterparty_details_act_no_nosend").get("value")
				},
				{
					name : "counterparty_details_name_" + id,
					id : "counterparty_details_name_nosend",
					value :dj.byId("counterparty_details_name_nosend").get("value")
				},
				{
					name : "counterparty_details_reference_" + id,
					id : "counterparty_details_reference_nosend",
					value :dj.byId("counterparty_details_reference_nosend").get("value")
				},
				{
					name : "counterparty_details_ft_cur_code_" + id,
					id : "counterparty_details_ft_cur_code_nosend",
					value :dj.byId("counterparty_details_ft_cur_code_nosend").get("value")
				},
				{
					name : "counterparty_details_ft_amt_" + id,
					id : "counterparty_details_ft_amt_nosend",
					value :dj.byId("counterparty_details_ft_amt_nosend").get("value")
				},
				{
					name : "counterparty_details_document_id_" + id,
					value :id
				});	
				
				if(dj.byId("counterparty_details_address_line_1_nosend")) {
					fields.push({
						name : "counterparty_details_address_line_1_" + id,
						id : "counterparty_details_address_line_1_nosend",
						value :dj.byId("counterparty_details_address_line_1_nosend").get("value")
					},
					{
						name : "counterparty_details_address_line_2_" + id,
						id : "counterparty_details_address_line_2_nosend",
						value :dj.byId("counterparty_details_address_line_2_nosend").get("value")
					},
					{
						name : "counterparty_details_dom_" + id,
						id : "counterparty_details_dom_nosend",
						value :dj.byId("counterparty_details_dom_nosend").get("value")
					});
				}
				
				return fields;
			},
			
			document : function( /*String*/ id, /*String*/ prefix) {
				// summary: 
				//		TODO
				
				var docCode = dj.byId("documents_details_code_nosend").get("value"),
					docTitle = (docCode !== "99") ? 
								dj.byId("documents_details_code_nosend").get("displayedValue") :
								dj.byId("documents_details_name_nosend").get("value");
				var documentDate = dj.byId("documents_details_doc_date_send")?dj.byId("documents_details_doc_date_send").get("displayedValue"):"";
								
				return [{
					name : "documents_details_code_" + id,
					id : "documents_details_code_nosend",
					value : docCode
				},
				{
					name : "documents_details_document_id_" + id,
					id : "",
					value : id
				},
				{
					name : "documents_details_name_" + id,
					id : "documents_details_name_nosend",
					value : docTitle
				},
				{
					name : "documents_details_second_mail_" + id,
					id : "documents_details_second_mail_send",
					value : dj.byId("documents_details_second_mail_send")?dj.byId("documents_details_second_mail_send").get("value"):""
				},
				{
					name : "documents_details_first_mail_" + id,
					id : "documents_details_first_mail_send",
					value  :dj.byId("documents_details_first_mail_send")?dj.byId("documents_details_first_mail_send").get("value"):""
				},
				{
					name : "documents_details_total_" + id,
					id : "documents_details_total_send",
					value  :dj.byId("documents_details_total_send")?dj.byId("documents_details_total_send").get("value"):""
				},
				{
					name : "documents_details_mapped_attachment_name_" + id,
					id : "documents_details_mapped_attachment_name_send",
					value  : dj.byId("documents_details_mapped_attachment_name_send")?dj.byId("documents_details_mapped_attachment_name_send").get("displayedValue"):""
				},
				{
					name : "documents_details_mapped_attachment_id_" + id,
					id : "documents_details_mapped_attachment_id_send",
					value  :dj.byId("documents_details_mapped_attachment_name_send")?dj.byId("documents_details_mapped_attachment_name_send").get("value"):""
				},
				{
					name : "documents_details_doc_no_" + id,
					id : "documents_details_doc_no_send",
					value  :dj.byId("documents_details_doc_no_send")?dj.byId("documents_details_doc_no_send").get("value"):""
				},
				{
					name : "documents_details_doc_date_" + id,
					id : "documents_details_doc_date_send",
					value  : documentDate
				}];
			},
			
			fee : function( /*String*/ id, /*String*/ prefix) {
				var inceptionDate = d.date.locale.format(new Date(), {
					selector :"date",
					datePattern : m.getLocalization("g_strGlobalDateFormat")
				});
				
				return [{
					name : prefix + "fee_details_chrg_details_" + id,
					id : prefix + "fee_details_chrg_code_nosend",
					value :dj.byId(prefix + "fee_details_chrg_code_nosend").get("value")
				},
				{
					name :prefix + "fee_details_chrg_id_" + id,
					id : prefix + "fee_details_chrg_id_nosend",
					value : id
				},
				{
					name :prefix + "fee_details_chrg_code_" + id,
					id : prefix + "fee_details_chrg_code_nosend",
					value :dj.byId(prefix + "fee_details_chrg_code_nosend").get("value")
				},
				
				{
					name :prefix + "fee_details_cur_code_" + id,
					id : prefix + "fee_details_cur_code_nosend",
					value :dj.byId(prefix + "fee_details_cur_code_nosend").get("value")
				},
				{
					name :prefix + "fee_details_amt_" + id,
					id : prefix + "fee_details_amt_nosend",
					value :dj.byId(prefix + "fee_details_amt_nosend").get("value")
				},
				
				{
					name :prefix + "fee_details_settlement_date_" + id,
					id : prefix + "fee_details_settlement_date_nosend",
					value :dj.byId(prefix + "fee_details_settlement_date_nosend").get("displayedValue")
				},
				{
					name :prefix + "fee_details_inception_date_" + id,
					id : "",
					value :inceptionDate
				},
				{
					name :prefix + "fee_details_exchange_rate_" + id,
					id : "",
					value :""
				},
				{
					name :prefix + "fee_details_eqv_cur_code_" + id,
					id : "",
					value :""
				},
				{
					name :prefix + "fee_details_eqv_amt_" + id,
					id : "",
					value :""
				},
				{
					name :prefix + "fee_details_bearer_role_code_" + id,
					id : "",
					value : _getChargeBearerCode()
				},
				{
					name :prefix + "fee_details_created_in_session_" + id,
					id : "",
					value :"Y"
				}];
			},
			
			charge : function( /*String*/ id, /*String*/ prefix) {
				// summary:
				//		TODO
				
				var inceptionDate = d.date.locale.format(new Date(), {
					selector :"date",
					datePattern : m.getLocalization("g_strGlobalDateFormat")
				});
				
				var fields =  [{
					name : prefix + "charge_details_chrg_details_" + id,
					id : prefix + "charge_details_chrg_code_nosend",
					value : dj.byId(prefix + "charge_details_chrg_code_nosend").get("value")
				},
				{
					name : prefix + "charge_details_chrg_id_" + id,
					id : prefix + "charge_details_chrg_id_nosend",
					value : id
				},
				{
					name : prefix + "charge_details_chrg_code_" + id,
					id : prefix + "charge_details_chrg_code_nosend",
					value : dj.byId(prefix + "charge_details_chrg_code_nosend").get("value")
				},
				{
					name : prefix + "charge_details_additional_comment_" + id,
					id : prefix + "charge_details_additional_comment_nosend",
					value : dj.byId(prefix + "charge_details_additional_comment_nosend").get("value")
				},
				{
					name : prefix + "charge_details_cur_code_" + id,
					id : prefix + "charge_details_cur_code_nosend",
					value : dj.byId(prefix + "charge_details_cur_code_nosend").get("value")
				},
				{
					name : prefix + "charge_details_amt_" + id,
					id : prefix + "charge_details_amt_nosend",
					value : dj.byId(prefix + "charge_details_amt_nosend").get("value")
				},
				{
					name : prefix + "charge_details_status_" + id,
					id : prefix + "charge_details_status_nosend",
					value : dj.byId(prefix + "charge_details_status_nosend").get("value")
				},
				{
					name : prefix + "charge_details_settlement_date_" + id,
					id : prefix + "charge_details_settlement_date_nosend",
					value : dj.byId(prefix + "charge_details_settlement_date_nosend").get("displayedValue")
				},
				{
					name : prefix + "charge_details_inception_date_" + id,
					id : "",
					value : inceptionDate
				},
				{
					name : prefix + "charge_details_exchange_rate_" + id,
					id : "",
					value :""
				},
				{
					name : prefix + "charge_details_eqv_cur_code_" + id,
					id : "",
					value :""
				},
				{
					name : prefix + "charge_details_eqv_amt_" + id,
					id : "",
					value :""
				},
				{
					name : prefix + "charge_details_bearer_role_code_" + id,
					id : "",
					value : _getChargeBearerCode()
				},
				{
					name : prefix + "charge_details_created_in_session_" + id,
					id : "",
					value :"Y"
				}];
				//Push this field only if MT798 is enabled
				var isMT798 = dj.byId("is_MT798");
				if(isMT798 && isMT798.get("value") !== "" && isMT798.get("value") != null && isMT798.get("value") === "Y"){
					fields.push({name : prefix + "charge_details_chrg_type_" + id,id : prefix + "charge_details_chrg_type_nosend",
						value : dj.byId(prefix + "charge_details_chrg_type_nosend") ? dj.byId(prefix + "charge_details_chrg_type_nosend").get("value") : null});
				}
				return fields;
			},
			
			role : function( /*String*/ id, /*String*/ prefix) {
				// summary:
				//		TODO
				
				return [
				    {
				    	name: "authorization_level_role_id_" + id,
				    	id: "",
				    	value: dj.byId("roles_details_role_name_nosend").get("value")
				    },
				    {
				    	name: "authorization_level_level_id_" + id,
				    	id: "",
				    	value:dj.byId("roles_level_id_role_name_nosend").get("value")
				    },
				    {
				    	name: "authorization_level_order_number_" + id,
				    	id: "",
				    	value: dj.byId("roles_order_number_role_name_nosend").get("value") ?
				    			dj.byId("roles_order_number_role_name_nosend").get("value") :
				    				(d.byId("role-master-table").rows.length - 1)
				}];
			},
			
			topic : function( /*String*/ id, /*String*/ prefix) {
				// summary:
				// 		TODO
				
				return [ {
			    		name: "topic_id_" + id,
			    		id: "title_offsetcode_nosend",
			    		value: dj.byId("dialog_topic_id_offsetcode_nosend").get("value")
			    	},
			    	{
			    		name: "img_file_id_" + id,
			    		id: "title_offsetcode_nosend",
			    		value: dj.byId("img_file_id_offsetcode_nosend").get("value")
			    	},
			    	{
			    		name: "title_" + id,
			    		id: "title_offsetcode_nosend",
			    		value: dj.byId("title_offsetcode_nosend").get("value")
			    	},
			    	{
			    		name: "link_" + id,
			    		id: "title_offsetcode_nosend",
			    		value: dj.byId("link_offsetcode_nosend").get("value")
			    	}
			    ];
			}
			
		},
		
		mandatoryFields : {
			
			alert01 : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				if(dj.byId("alert01_type_nosend")) {
					typefield = "alert01_type_nosend";
				}
				else if(dj.byId("alert01_product_nosend").get("value") !== "*") {
					typefield = "alert01_datecode_nosend";
				}
				
				var fields = [{
						name: "alert01_product_nosend",
						value: ""
					},
					{
						name: typefield,
						value: ""
				 	}
				 ];
				
				if(dj.byId("alert01_details_usercode_nosend").get("value")) {
					fields.push(
							{
							    name: "alert01_details_langcode_nosend",
							    value: ""
					        },
					      	{
					      		name: "alert01_details_email_nosend",
					      		value: ""
					       	}
					);
				} else {
					fields.push(
						{
							name: "alert01_details_usercode_nosend",
							value: ""
						}
					);
				}
				
				return fields;
			},
			
			alert02 : function( /*String*/ prefix) {
				var typefield = dj.byId("alert02_type_nosend") ? "alert02_type_nosend" : "alert02_datecode_nosend";
					fields = [];
				
				fields.push({
					name: "alert02_product_nosend",
					value: ""
				},
				{
					name: typefield,
					value: ""
			 	});
				
				if(dj.byId("alert02_details_usercode_nosend").get("value")){
					fields.push({
			       		name: "alert02_details_langcode_nosend",
			       		value: ""
			        },
			       	{
			       		name: "alert02_details_email_nosend",
			       		value: ""
			    	});
				} else {
					fields.push({
						name: "alert02_details_usercode_nosend",
						value: ""
					});
				}
				
				return fields;
				
			},
			
			customerReference : function( /*String*/ prefix, /*String*/ suffix) {
				// summary:
				//		TODO
				var _prefix = prefix || "";
				var _suffix = suffix || "";
				var mandatoryFields = misys._config.mandatoryReferenceFields || [];
				if(_suffix !== "")
				{
					_suffix = "_" + _suffix;
				}	
				var arrayMandatory =  [];
					
				dojo.forEach(mandatoryFields,function(field, index){
					arrayMandatory.push({
						name: _prefix + "customerReference" + _suffix + "_details_"+field+"_nosend",
			    		value: ""
					});
				});
				return arrayMandatory;
			},
			
			counterparty : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				// TODO Should we not be outputting an ID, and no name?
				var fields = [{
					name : "counterparty_details_act_no_nosend",
					value : ""
				  },
				  {
					name : "counterparty_details_name_nosend",
					value : ""
				  },
				  {
					name : "counterparty_details_ft_cur_code_nosend",
					value : ""
				  },
				  {
					name : "counterparty_details_ft_amt_nosend",
					value : ""
				  },
				  {
					name : "counterparty_details_reference_nosend",
					value : ""
				}];
				
				if(dj.byId("counterparty_details_address_line_1_nosend")){
					fields.push( {
						name : "counterparty_details_address_line_1_nosend",
						value : ""
					});
				}
				
				return fields;
			},
			
			charge : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				var fields = [ 
	              {
	           		name :prefix + "charge_details_chrg_code_nosend",
	           		value : ""
	           	  },
	           	  {
	           		name :prefix + "charge_details_cur_code_nosend",
	           		value : ""
	           	  },
	           	  {
	           		name :prefix + "charge_details_amt_nosend",
	           		value : ""
	           	  },
	           	  {
	           		name :prefix + "charge_details_status_nosend",
	           		value : ""
	           	  },
	           	  {
	           		 name :prefix + "charge_details_additional_comment_nosend",
	           		 value : ""
	           	  }
	           	];
				
				var chargeDetailsStatus = dj.byId(prefix + "charge_details_status_nosend");
				if(chargeDetailsStatus && chargeDetailsStatus.get("value") === "01"){
					fields.push({
						name: prefix + "charge_details_settlement_date_nosend",
						value: ""
					});
				}
				return fields;
			},
			
			document : function( /*String*/ prefix) {
				// summary:
				//		TODO
				// This fields Ids are mandatory on the form.
				var fields = [{
			 		name :"documents_details_code_nosend",
			 		value :""
			 	}];
				if(m._config.productCode =='EC'|| m._config.productCode =='IC')
				{
					if(dojo.hasClass("documents_details_first_mail_send_row", "required"))
					{
						fields.push({name:"documents_details_first_mail_send", value:""});
					}
					if(dojo.hasClass("documents_details_second_mail_send_row", "required"))
					{
						fields.push({name:"documents_details_second_mail_send", value:""});
					}
					if(dojo.hasClass("documents_details_first_mail_send_row", "required") || (dojo.hasClass("documents_details_second_mail_send_row", "required")))
					{
						fields.push({name:"documents_details_total_send", value:""});
					}
				} else
				{
					fields.push({name:"documents_details_first_mail_send", value:""});
					fields.push({name:"documents_details_second_mail_send", value:""});
					fields.push({name:"documents_details_total_send", value:""});
				}
				
				if(dj.byId("documents_details_code_nosend").get("value") === "99"){
					fields.push({name:"documents_details_name_nosend", value:""});
				}
				
				if(dj.byId("documents_details_doc_no_send") && dj.byId("documents_details_doc_no_send").get("value") !==""){
					fields.push({name:"documents_details_doc_date_send", value:""});					
				}
				return fields;
			},
			
			fee : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				return [{
					name : prefix + "fee_details_chrg_code_nosend",
				    value : ""
				   },
		     	   {
		     		name : prefix + "fee_details_cur_code_nosend",
		     		value : ""
		     	   },
		     	   {
		     		name: prefix + "fee_details_settlement_date_nosend",
		     		value: ""
		     	   },
		     	   {
		     		name : prefix + "fee_details_amt_nosend",
		     		value : ""
		     	}];
			},
			
			role : function( /*String*/ prefix) {
				// summary
				//		TODO
				
				return [{
		     		name : "roles_details_role_id_nosend",
		     		value : "" 
				},
				{
					name : "roles_details_role_name_nosend",
					value : ""
				}];
			},
			
			topic : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				return [{
				    name: "title_offsetcode_nosend",
				    value: ""
				}];
			}
			
		},
		
		tableCells : {
			// summary:
			//		TODO
			
			alert01 : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				var typefield = "alert01_type_nosend",
					userCodeValue = dj.byId("alert01_details_usercode_nosend").get("value"),
					offset = "",
					cells = [];
				
				if(!dj.byId("alert01_type_nosend")) {
					typefield = "alert01_datecode_nosend";
					offset = dj.byId("alert01_details_offsetcode_nosend").get("value");
					if(dj.byId("alert01_details_offsetsigncode_nosend_1").get("checked")) {
						offset = "(+" + offset + ")";
					} else if(dj.byId("alert01_details_offsetsigncode_nosend_0").get("checked")) {
						offset = "(-" + offset + ")";
					}
				}
				
				userCodeValue = (userCodeValue !== "*") ? userCodeValue : "";
				
				// If there is an entity (Customer side)
				if (dj.byId("01entity")) {
					cells.push(
				   		{
				   			name: "",
				   			value: dj.byId("01entity").get("value")
				   		},
				   		{
				   			name: "",
				   			value: m._config.productsCollection[dj.byId("alert01_product_nosend").get("value")]
				   		},
				   		{
				   			name: "",
				   			value: dj.byId("alert01_type_nosend")? m._config.typesCollection[dj.byId(typefield).get("value")] : myDates[dj.byId("alert01_product_nosend").get("value")+"_"+dj.byId(typefield).get("value")] + offset
				   		},
				   		{
				   			name: "",
				   			value: userCodeValue ? m._config.recipientCollection[dj.byId("alert01_details_usercode_nosend").get("value")]: dj.byId("alert01_details_email_nosend").get("value")
				   		}
				    );
				}
				else
				{
					cells.push(
						{
				   			name: "",
				   			value: m._config.productsCollection[dj.byId("alert01_product_nosend").get("value")]
				   		},
				   		{
				   			name: "",
				   			value: dj.byId("alert01_type_nosend")? m._config.typesCollection[dj.byId(typefield).get("value")] : myDates[dj.byId("alert01_product_nosend").get("value")+"_"+dj.byId(typefield).get("value")] + offset
				   		},
				   		{
				   			name: "",
				   			value: userCodeValue ? m._config.recipientCollection[dj.byId("alert01_details_usercode_nosend").get("value")]: dj.byId("alert01_details_email_nosend").get("value")
				   		}
					);
				}
				
				return cells;
			},
			
			alert02 : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				var typefield = "alert02_type_nosend",
					offset = "",
					cells = [];
					
				if(!dj.byId("alert02_type_nosend")){
					typefield = "alert02_datecode_nosend";
					offset = dj.byId("alert02_details_offsetcode_nosend").get("value");
					if(dj.byId("alert02_details_offsetsigncode_nosend_1").get("checked")) {
						offset = "(+" + offset + ")";
					}
					else if(dj.byId("alert02_details_offsetsigncode_nosend_0").get("checked")) {
						offset = "(-" + offset + ")";
					}
				}
				
				cells.push({
						name: "",
						value: m._config.productsCollection[dj.byId("alert02_product_nosend").get("value")]
					},
					{
						name: "",
						value: dj.byId("alert02_type_nosend")? m._config.typesCollection[dj.byId(typefield).get("value")] :
							myDates[dj.byId("alert02_product_nosend").get("value")+"_"+dj.byId(typefield).get("value")] + offset
					},
					{
						name: "",
						value: dj.byId("alert02_details_usercode_nosend").get("value") !== "*" ?
								m._config.recipientCollection[dj.byId("alert02_details_usercode_nosend").get("value")] :
									dj.byId("alert02_details_email_nosend").get("value")
					}
				);
				
				return cells;
			},
			
			customerReference : function( /*String*/ prefix) {
				//	summary:
				//		TODO
				
				var targetBank = dj.byId("customerReference_target_bank").get("value");
				var suffix = targetBank !== "" ? targetBank : "";
				
				return [{
					name: "",
					value: dj.byId("customerReference_"+suffix+"_details_reference_nosend").get("value")
				},
				{
					name: "",
					value: dj.byId("customerReference_"+suffix+"_details_description_nosend").get("value")
				}];
			}, 
			
			counterparty : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				var counterpartyDetails =
					dj.byId("counterparty_details_name_nosend").get("value"),
					amt;
				
				// TODO Should remove breaks below
				if(dj.byId("counterparty_details_address_line_1_nosend")){
					if(dj.byId("counterparty_details_address_line_1_nosend").get("value")){
						counterpartyDetails += "<br>" +
						dj.byId("counterparty_details_address_line_1_nosend").get("value");
					}
					if(dj.byId("counterparty_details_address_line_2_nosend").get("value")){
						counterpartyDetails += "<br>" +
						dj.byId("counterparty_details_address_line_2_nosend").get("value");
					}
					if(dj.byId("counterparty_details_dom_nosend").get("value")){
						counterpartyDetails += "<br>" +
						dj.byId("counterparty_details_dom_nosend").get("value");
					}
				}
				// TODO Remove the nbsp below
				amt = dj.byId("counterparty_details_ft_cur_code_nosend").get("value") +
						"&nbsp;" + dj.byId("counterparty_details_ft_amt_nosend").get("value");
				
				// TODO Empty names? Is this correct?
				return [{
					name : "",
					value :dj.byId("counterparty_details_act_no_nosend").get("value")
				},
				{
					name : "",
					value :counterpartyDetails
				},
				{
					name : "",
					value :amt
				},
				{
					name : "",
					value :dj.byId("counterparty_details_reference_nosend").get("value")
				}];
			}, 
			
			charge : function( /*String*/ prefix) {
				// summary:
				//		TODO

				var fields =  [{
					name : "",
					value : dj.byId(prefix + "charge_details_chrg_code_nosend").get("displayedValue")
				},
				{
					name : "",
					value :dj.byId(prefix + "charge_details_additional_comment_nosend").get("value")
				},
				{
					name : "",
					value :dj.byId(prefix + "charge_details_cur_code_nosend").get("value")
				},
				{
					name : "",
					value :dj.byId(prefix + "charge_details_amt_nosend").get("displayedValue")
				},
				{
					name : "",
					value : dj.byId(prefix + "charge_details_status_nosend") ?
						dj.byId(prefix + "charge_details_status_nosend").get("displayedValue") : ""
				},
				{
					name: "",
					value: dj.byId(prefix + "charge_details_settlement_date_nosend").get("displayedValue")
				}];
				// Push this field only if MT798 is enabled
				var isMT798 = dj.byId("is_MT798");
				if(isMT798 && isMT798.get("value") !== "" && isMT798.get("value") != null && isMT798.get("value") === "Y"){
					fields.push({name : "",
						value :	dj.byId(prefix + "charge_details_chrg_type_nosend") ? dj.byId(prefix + "charge_details_chrg_type_nosend").get("displayedValue") : null}); 
				}
		
				return fields;
			}, 
			
			document : function( /*String*/ prefix) {
				var docTitle = dj.byId("documents_details_code_nosend").get("displayedValue"), 
					first_mail = dj.byId("documents_details_first_mail_send").get("value") || 0, 
					second_mail = dj.byId("documents_details_second_mail_send").get("value") || 0, 
					total = dj.byId("documents_details_total_send") ? dj.byId("documents_details_total_send").get("value") : "" || 0,
					mappedAttachmentName = dj.byId("documents_details_mapped_attachment_name_send") ? dj.byId("documents_details_mapped_attachment_name_send").get("displayedValue") : "", 
					mappedAttachmentId = dj.byId("documents_details_mapped_attachment_id_send") ? dj.byId("documents_details_mapped_attachment_name_send").get("value") : "",
					doc_no = dj.byId("documents_details_doc_no_send") ? dj.byId("documents_details_doc_no_send").get("value") :"", 
					doc_date = (dj.byId("documents_details_doc_date_send") && dj.byId("documents_details_doc_date_send").get("value")) ? dj.byId("documents_details_doc_date_send").get("value") :"";
				
				if(doc_date && doc_date !== ""){
				
					 doc_date = d.date.locale.format(doc_date, {
						selector :"date"
					});
				}
				
				if(dj.byId("documents_details_code_nosend").get("value") === "99"){
					docTitle = dj.byId("documents_details_name_nosend").get("value");
				}
				
				if(dj.byId("documents_details_total_send") && dj.byId("documents_details_doc_no_send") && dj.byId("documents_details_doc_date_send"))
				{
					return [{
				 		name :"",
				 		value :docTitle
				 	},
				 	{
				 		name :"",
				 		value : doc_no
				 	},
				 	{
				 		name :"",
				 		value : doc_date
				 	},
				 	{
				 		name :"",
				 		value : first_mail
				 	},
				 	{
				 		name :"",
				 		value : second_mail
				 	},
				 	{
				 		name :"",
				 		value : total
				 	},
				 	{
				 		name :"",
				 		value : mappedAttachmentName
				 	}];
				}
				else
				{
					return [{
				 		name :"",
				 		value :docTitle
				 	},
				 	{
				 		name :"",
				 		value : first_mail
				 	},
				 	{
				 		name :"",
				 		value : second_mail
				 	}];
				}

				
			},
			
			fee : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				return [{
					name : "",
					value : dj.byId(prefix + "fee_details_chrg_code_nosend").get("displayedValue")
				},
				{
					name : "",
					value : dj.byId(prefix + "fee_details_cur_code_nosend").get("value")
				},
				{
					name : "",
					value : dj.byId(prefix + "fee_details_amt_nosend").get("displayedValue")
				},
				{
					name: "",
					value: dj.byId(prefix + "fee_details_settlement_date_nosend").get("displayedValue")
				}];
			},
			
			role : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				return [{
					name : "",
					value : dj.byId("roles_details_role_name_nosend").get("displayedValue")
				}];
			},
			
			topic : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				return [{
					name: "",
					value: "<img src='" +
								m.getServletURL("/screen/AjaxScreen/action/GetCustomerLogo") +
								"?logoid=" + dj.byId("new").get("value") + "'>"
					},
			   		{
			   			name: "",
			   			value: dj.byId("title_offsetcode_nosend").get("value")
			   		},
			   		{
			   			name: "",
			   			value:
			   				"<a onclick='if (!this.isContentEditable) return !window.open(this.href,\'blank\');' href='" +
			   				dj.byId("link_offsetcode_nosend").get("value") +
			   				"'>" + dj.byId("link_offsetcode_nosend").get("value") + "</a>"        
			   	}];
			}
		},
		
		bind: {
			// summary:
			//		TODO
			
			charge : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				prefix = prefix || "";
				
				m.setValidation(prefix + "charge_details_cur_code_nosend",
						m.validateCurrency);

				m.connect(prefix + "charge_details_cur_code_nosend", "onChange",
						function(){
							m.setCurrency(this, [
									prefix + "charge_details_amt_nosend"]);
						});
				
				if(prefix != null) {
					m.connect(prefix + "charge_details_status_nosend", "onChange",
						function(){
							m.toggleFields(this.get("value") === "01", null,
									[prefix + "charge_details_settlement_date_nosend"]);
							if(this.get("value") === "01"){
								dj.byId("charge_details_settlement_date_nosend").set("displayedValue",dj.byId("currentDate").get("value"));
							}
						});
				}
				
				m.setCurrency(dj.byId(prefix + "charge_details_cur_code_nosend"),
						[prefix + "charge_details_amt_nosend"]);
			},
			
			document : function() {
				// summary:
				//		TODO
				
				m.connect("documents_details_code_nosend", "onChange", function(){
					m.toggleFields(this.get("value") === "99", null,
							["documents_details_name_nosend"]);
				});
				
				m.connect("documents_details_doc_no_send", "onMouseLeave", function(){
					if(this.get("value") !== ""){
						m.toggleRequired("documents_details_doc_date_send", true);
					} 
					else{	
						m.toggleRequired("documents_details_doc_date_send", false);
					}
					
				}); 
				
				m.setValidation("documents_details_doc_date_send", m.validateDocumentDate);
				
			},
			
			fee : function( /*String*/ prefix) {
				// summary:
				//		TODO
				
				prefix = prefix || "";
				m.setValidation(prefix+"fee_details_cur_code_nosend", m.validateCurrency);

				// Events
				m.connect(prefix+"fee_details_cur_code_nosend", "onChange",
						function(){ m.setCurrency(this, [prefix + "fee_details_amt_nosend"]);
				});

				// Onload events
				m.setCurrency(dj.byId(prefix + "fee_details_cur_code_nosend"),
						[prefix + "fee_details_amt_nosend"]);
			}
		},
		
		deleteAddon : {
			// summary:
			//		TODO
			
			counterparty : function( /*String*/ id) {
				// Recalculate FT amt
				var amt = dj.byId("counterparty_details_ft_amt_" + id).get("value"),
					ftAmtField = dj.byId("ft_amt"),
					ftAmt = ftAmtField.get("value"),
					existingAmt = (ftAmt) ? ftAmt - parseFloat(amt) : 0;
				
				ftAmtField.set("value", existingAmt);
			}
		}

	});

	// Onload/Unload/onWidgetLoad Events

})(dojo, dijit, misys);