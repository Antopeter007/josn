dojo.provide("misys.binding.bank.report_tf");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("misys.widget.Dialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.ProgressBar");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.binding.common.bank_create_fx");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	// Public functions & variables follow

	 d.mixin(m._config, {
				/*
				 * Overriding to add license items in the xml. 
				 */
			
			xmlTransform : function (/*String*/ xml) {
				var tdXMLStart = "<tf_tnx_record>";
				/*
				 * Add license items tags, only in case of LC transaction.
				 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
				 */
				if(xml.indexOf(tdXMLStart) !== -1){
					// Setup the root of the XML string
					var xmlRoot = m._config.xmlTagName,
					transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
							tdXMLEnd   = "</tf_tnx_record>",
							subTDXML	= "";
					subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
					transformedXml.push(subTDXML);
					if(dj.byId("gridLicense") && dj.byId("gridLicense").store && dj.byId("gridLicense").store !== null && dj.byId("gridLicense").store._arrayOfAllItems.length >0) {
						transformedXml.push("<linked_licenses>");
						dj.byId("gridLicense").store.fetch({
							query: {REFERENCEID: '*'},
							onComplete: dojo.hitch(dj.byId("gridLicense"), function(items, request){
								dojo.forEach(items, function(item){
									transformedXml.push("<license>");
									transformedXml.push("<ls_ref_id>",item.REFERENCEID,"</ls_ref_id>");
									transformedXml.push("<bo_ref_id>",item.BO_REF_ID,"</bo_ref_id>");
									transformedXml.push("<ls_number>",item.LS_NUMBER,"</ls_number>");
									transformedXml.push("<ls_allocated_amt>",item.LS_ALLOCATED_AMT,"</ls_allocated_amt>");
									transformedXml.push("<ls_amt>",item.LS_AMT,"</ls_amt>");
									transformedXml.push("<ls_os_amt>",item.LS_OS_AMT,"</ls_os_amt>");
									transformedXml.push("<converted_os_amt>",item.CONVERTED_OS_AMT,"</converted_os_amt>");
									transformedXml.push("<allow_overdraw>",item.ALLOW_OVERDRAW,"</allow_overdraw>");
									transformedXml.push("</license>");
								});
							})
						});
						transformedXml.push("</linked_licenses>");
					}
					if(xmlRoot) {
						transformedXml.push("</", xmlRoot, ">");
					}
					return transformedXml.join("");
				}else{
					return xml;
				}

			}
		});

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("maturity_date", m.validateTFMaturityDate);
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				m.toggleFields(
					(this.get("value") != "" && this.get("value") != "01" && 
							this.get("value") != "18"), 
					null,
					["bo_ref_id","fin_liab_amt"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("fin_liab_amt",false);
				}	
			});
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("tf");
			});
			m.connect("fin_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.finCurCode);
			});
			
			m.connect("maturity_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate);
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("fin_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
					}
				if(m._config.enable_to_edit_customer_details_bank_side=="false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !== '' && dj.byId("fin_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{	
					m.toggleRequired("iss_date", false);
					m.toggleRequired("maturity_date", false);
					m.toggleRequired("fin_liab_amt", false);
					
				}
			});
			
			m.connect("iss_date", "onBlur", m.getMaturityDate);
			m.connect("sub_product_code", "onChange", function(){
				var field = dj.byId("sub_product_code_text");
				var other = false;
				if(this.get("value") == "IOTHF" ){
					other = true;
				}
				if(this.get("value") == "EOTHF" ){
					other = true;
				}
				m.toggleFields(
						(other), 
						null,
						["sub_product_code_text"]);
				
			});
			m.connect("maturity_date", "onBlur", m.getMaturityDate);
			m.connect("tenor", "onBlur", m.getMaturityDate);
			m.connect("fin_cur_code", "onChange", function(){
				m.setCurrency(this, ["fin_amt", "fin_liab_amt"]);
				dj.byId("req_cur_code") ? dj.byId("req_cur_code").set("value", dj.byId("fin_cur_code").get("value")) : "";
			});

			m.connect("fin_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			m.connect("fin_liab_amt", "onBlur", function(){
				if(dj.byId("fin_amt") && (dj.byId("fin_amt").get("value") < dj.byId("fin_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("fin_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("TFLiabilityAmountCanNotBeGreaterThanTFTotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
				if(dj.byId("fin_liab_amt").get("value") && dj.byId("fin_outstanding_amt")) {
					dj.byId("fin_outstanding_amt").setValue(dj.byId("fin_liab_amt").get("value"));
				}
			});
			
			// On Blur of request percentage, calculate the requested amount value.
			m.connect("req_pct","onBlur",function(){
					if(this.get("value") !== null && !isNaN(this.get("value")) && parseFloat(this.get("value")) <= 100 && parseFloat(this.get("value")) > 0)
					{
						var convertedAmt = (parseFloat(this.get("value")) * parseFloat(dj.byId("bill_amt").get("value"))) / 100;
						dj.byId("req_amt").set("value", convertedAmt);
					}
					else
					{
						displayMessage = misys.getLocalization("incorrectPercentage");
						this.focus();
				 		this.set("state","Error");
				 		dj.hideTooltip(this.domNode);
				 		dj.showTooltip(displayMessage, this.domNode, 0);
					}
			});
			m.connect("fin_amt","onBlur",function(){
				if(dj.byId("req_pct") && dj.byId("req_pct").get("value") !== null && !isNaN(dj.byId("req_pct").get("value")) &&
						(!dj.byId("bill_amt") || dj.byId("bill_amt") === undefined))
				{
					if(parseFloat(dj.byId("req_pct").get("value")) <= 100 && !(parseFloat(dj.byId("req_pct").get("value")) <= 0))
					{
						var convertedAmt = (parseFloat(dj.byId("req_pct").get("value")) * parseFloat(dj.byId("fin_amt").get("value"))) / 100;
						dj.byId("req_amt").set("value", convertedAmt);
					}
				}
				else if(dj.byId("req_amt"))
				{
					dj.byId("req_amt").set("value", dj.byId("fin_amt").get("value"));
				}
				m.setCurrency(dj.byId("fin_cur_code"), ["req_amt"]);
			});
			
			if(dj.byId("fx_rates_type_temp") && dj.byId("fx_rates_type_temp").get("value") !== ""){
				var amtUtiliseInd = "N",maxNbrContracts =0;
				if(dj.byId("fx_nbr_contracts") && dj.byId("fx_nbr_contracts").get("value") > 0){
					maxNbrContracts = dj.byId("fx_nbr_contracts").get("value");
				}
				m.bindTheFXTypes(maxNbrContracts, "Y");					
			}
		},

		onFormLoad : function() {
			m.setCurrency(dj.byId("fin_cur_code"), ["tnx_amt", "fin_amt", "fin_liab_amt","req_amt"]);
			m.setCurrency(dj.byId("bill_amt_cur_code"), [ "bill_amt"]);
				
			if(dj.byId("fx_rates_type_temp") && dj.byId("fx_rates_type_temp").get("value") !== ""){
				m.onloadFXActions();					
			}
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
			{					
				m.toggleRequired("iss_date",false);
				m.toggleRequired("fin_liab_amt",false);
			}
			//Disabling the issue date, outstanding amount and bank reference fields when new status is not processed
			if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "01")
			{
				var prod_status_code = dj.byId("prod_stat_code");
				var fin_liab_amount = dj.byId("fin_liab_amt");
				var bo_refe_id = dj.byId("bo_ref_id");
				var issue_date = dj.byId("iss_date");
				m.toggleFields(	!(prod_status_code && (fin_liab_amount ||bo_refe_id ||issue_date ||maturity_date )) ,null,
						["bo_ref_id","fin_liab_amt"],false,false);
			}
			else if(dj.byId("prod_stat_code").get("value") === "98" && dj.byId("product_code") && dj.byId("product_code").get("value") === "TF") 
			{
				dj.byId("action_req_code").set("value", "07");
				dj.byId("action_req_code").set("readOnly", true);
			}
			m.populateGridOnLoad("tf");
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "entity", "applicant_name",
							"applicant_address_line_1", "applicant_address_line_2",
							"applicant_dom", "applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email", "iss_date",
							"tenor", "maturity_date", "sub_product_code",
							"sub_product_code_text", "related_reference", "goods_desc",
							"goods_desc", "fin_liab_amt", "fin_cur_code", "fin_amt",
							"bill_amt_cur_code", "bill_amt", "fin_amt_img",
							"description_of_goods" ];
					d.forEach(transactionids, function(id)
					{
						var field = dj.byId(id);
						if (field)
						{
							m.toggleRequired(field, false);
						}
					});

				}
			}
			
			var reqAmtVal = dj.byId("req_amt");
			var reqAmtCurCode = dj.byId("req_cur_code");
			if(reqAmtVal && reqAmtVal.get("value") && reqAmtVal.get("value") !== "" &&
			(dj.byId("fin_amt") && (dj.byId("fin_amt").get("value") === "" || isNaN(dj.byId("fin_amt").get("value"))))) {
				dj.byId("fin_amt").set("value", reqAmtVal.get("value"));
				dj.byId("fin_cur_code").set("value", reqAmtCurCode.get("value"));
			}
			var isStandAloneFinance = true;
			if(dj.byId("parent_reference_id") && 
			(dj.byId("parent_reference_id").get("value") !== "" || !isNaN(dj.byId("parent_reference_id").get("value")))) {
				isStandAloneFinance = false;
			} else {
				isStandAloneFinance = true;
			}
			if(isStandAloneFinance) {
				dj.byId("req_pct").set("value", 100);
			}
			
			m.setCurrency(dj.byId("fin_cur_code"), ("fin_amt"));
			m.setCurrency(dj.byId("req_cur_code"), ("req_amt"));
			
		},
		  beforeSubmitValidations : function() {

			   //Validation check for Transfer Amount value which should be greater than zero
			   var finAmtVal = dj.byId("fin_amt");
			   var billAmtVal = dj.byId("bill_amt");
			   var billAmtCurCode = dj.byId("bill_amt_cur_code");
			   var finAmtCurCode = dj.byId("fin_cur_code");
			   var fxExcgRateAmt =dj.byId("fx_exchange_rate_amt");
			   var reqAmt = dj.byId("req_amt");
			   var reqAmrCurCode = dj.byId("req_cur_code");

			   if(dj.byId("bill_amt")&& dj.byId("bill_amt").get("value"))
				   {
			   		   		   		 
			   if( (billAmtCurCode.get("value") === finAmtCurCode.get("value")) &&  (dojo.number.parse(finAmtVal.get("value")) >  dojo.number.parse(billAmtVal.get("value"))) ){
				   	m._config.onSubmitErrorMsg =  m.getLocalization("FinAmtGreaterThanBillAmtValidation");			   	
					return false;			   			   
			   }
				   }
			   if(dj.byId("fin_amt") && dj.byId("fin_liab_amt") && (dj.byId("fin_amt").get("value") < dj.byId("fin_liab_amt").get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("TFLiabilityAmountCanNotBeGreaterThanTFTotalAmount");
					dj.byId("fin_liab_amt").set("value", "");
					console.debug("Invalid Outstanding Amount.");
					return false;
				}
			  
				   return true;
			  
			}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_tf_client');