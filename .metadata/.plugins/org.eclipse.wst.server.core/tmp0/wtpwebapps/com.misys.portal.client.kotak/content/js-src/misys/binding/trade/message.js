dojo.provide("misys.binding.trade.message");

dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";

	d.mixin(m._config, {

		initReAuthParams : function() {
			var prodCodeInLowerCase = m._config.productCode.toLowerCase();
			var prodCurCode = dj.byId(prodCodeInLowerCase+"_cur_code");
			var prodAmt = dj.byId(prodCodeInLowerCase+"_amt");
			var reAuthParams = {
					productCode : m._config.productCode.toUpperCase(),
					subProductCode : '',
					transactionTypeCode : '13',	
					entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
					currency : prodCurCode ? prodCurCode.get("value") : "",
					amount : prodAmt ? m.trimAmount(prodAmt.get("value")) : "",
					
					es_field1 : '',
					es_field2 : ''					
			};
			return reAuthParams;
		}
	});
		
	function _toggleSettlementDetails(/*Boolean*/ keepValues) {
		var productCode = m._config.productCode.toLowerCase(),
			doToggle = dj.byId("sub_tnx_type_code") && (dj.byId("sub_tnx_type_code").get("value") === "25" || dj.byId("sub_tnx_type_code").get("value") === "62"),
			callback,
			curCodeField,
			effect;
			
		switch(productCode) {
			case "si":
				productCode = "lc";
				break;
			case "tf":
				productCode = "fin";
				break;
			default:
				break;
		}

		callback = function(){
			var prodCode = m._config.productCode.toLowerCase();
			
			if (prodCode === 'lc') {				
				if(dj.byId("sub_tnx_type_code") && (dj.byId("sub_tnx_type_code").get("value") === "25"))
				{
					m.toggleFields(doToggle, null, ["tnx_amt"], keepValues);
				}
				// principal_act_no and fee_act_no to be readonly and tnx_amt is required 
				else 
				{
					m.toggleFields(doToggle, ["principal_act_no", "fee_act_no"], ["tnx_amt"], keepValues);
				}
				if(dj.byId('is_amt_editable') && dj.byId('is_amt_editable').get("value") === "true")
				{
					dj.byId("tnx_amt").set("readOnly", false);
					dj.byId("tnx_amt").set("disabled", false);
				}
				else
				{
					dj.byId("tnx_amt").set("readOnly", true);
					dj.byId("tnx_amt").set("disabled", true);
					m.toggleRequired("tnx_amt", false);
				}				
			}
			else {
				m.toggleFields(doToggle, ["fwd_contract_no"], ["tnx_amt"], keepValues);				
			}
			// CF NOTE Not sure why cur_code_field is cleared/enabled/disabled, as its a hidden
			// field, and this action is breaking the form submission
			
		};

		effect = (doToggle) ? "fadeIn" : "fadeOut";
		m.animate(effect, d.byId("settlement-details"), callback);
	}
	
	function _validateDebitAmt(){
		   var debitAmt = dj.byId('claim_amt');
			if(dj.byId('document_amt') && dj.byId('document_amt').get('value')!=='' && debitAmt.get('value') !== '' && debitAmt.get('value') > dj.byId('document_amt').get('value'))
			{
				var displayMessage = misys.getLocalization('debitAmtLessThanDocumentAmt', [debitAmt.get('value'),dj.byId('document_amt').get('value')]);
				var domNode = debitAmt.domNode;
				debitAmt.set("state","Error");
				dj.showTooltip(displayMessage, domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(domNode);
				};
				var timeoutInMs = 2000;
				setTimeout(hideTT, timeoutInMs);
			}
	   }

	function _validateSettlementAmt(){
		   var tnxAmt = dj.byId("tnx_amt");
			 
			if(tnxAmt && dj.byId("document_amt") && dj.byId("document_amt").get("value")!=="" && tnxAmt.get("value") !== "")
			{
				var docAmt = dojo.number.parse(dj.byId("document_amt").get("value"));
				docAmt = !isNaN(docAmt) ? docAmt : 0;
				if(tnxAmt.get("value") > docAmt)
						{
				var displayMessage = misys.getLocalization("settlementAmtLessThanTnxAmt", [tnxAmt.get("value"),docAmt]);
				var domNode = tnxAmt.domNode;
				tnxAmt.set("state","Error");
				dj.showTooltip(displayMessage, domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(domNode);
				};
				var timeoutInMs = 2000;
				setTimeout(hideTT, timeoutInMs);
			}
			}
	   }
	
	d.mixin(m, {
		_submit : m.submit,
		
		bind : function() {
			m.connect("tnx_amt", "onBlur", function(){
				if(!m.validateTnxAmount())
				{
					dj.byId("tnx_amt").set("value","");
					var hideTT = function() {
						dj.hideTooltip(dj.byId("tnx_amt").domNode);
					};
					dj.showTooltip(this.invalidMessage, dj.byId("tnx_amt").domNode, 0);
					setTimeout(hideTT, 10000);
				}
			});
			if(dojo.isIE){
				m.connect("sub_tnx_type_code","onClick", function(){
					this.focus();
				});
			}
			m.connect("sub_tnx_type_code", "onChange", function(){
				_toggleSettlementDetails(false);
				if(dj.byId("tnx_amt") && dj.byId("claim_amt") && dj.byId("claim_amt").get("value") !== "")
				{
					dj.byId("tnx_amt").set("value", dj.byId("claim_amt").get("value"));
				}
				// 25 - Request For Settlement, and, 24 - Correspondence
				if(this.get("value") === "25")
				{
					_toggleSettlementDetails(false);
				}
				else if(this.get("value") === "24")
				{
					_toggleSettlementDetails(true);
				}
				var mainBankAbbvName = m.getMainBankAbbvName();
				var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true;
				if(isMT798Enable)
				{
					if(d.byId("pending-list-grid"))
					{
						d.byId("pending-list-grid").style.display = "none";
					}
					if(dj.byId("sub_tnx_type_code").get("value") == "68")
					{
						m.animate("fadeIn", d.byId("bankInst"));
						if(dj.byId("free_format_text"))
						{
							dj.byId("free_format_text").set("rows",6);
							dj.byId("free_format_text").set("cols",35);
							dj.byId("free_format_text").set("maxSize",210);
							dj.byId("free_format_text").set("hide",false);
						}
						if(d.byId("pending-list-grid"))
						{
							d.byId("pending-list-grid").style.display = "block";
						}
					}
					if(dj.byId("product_code").get("value") === "EL" && dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "01")
					{
						m.animate("fadeIn", d.byId("bankInst"));
						// Already listening to 'delivery_channel' drop-down for 'onChange' event on Form load.
					}
					else if((dj.byId("sub_tnx_type_code").get("value") == "46" || dj.byId("sub_tnx_type_code").get("value") == "47") && dj.byId("adv_send_mode").get("value") == "01")
					{
						m.animate("fadeIn", d.byId("bankInst"));
						dj.byId("delivery_channel").set("disabled", true);
						dj.byId("delivery_channel").set("value", null);
					}
					else if(dj.byId("product_code") && dj.byId("product_code").get("value") === "SR" )
					{
						if(d.byId("claimAmt") && dj.byId("sub_tnx_type_code").get("value") == "25")
						{
							m.animate("fadeIn", d.byId("claimAmt"));
							dj.byId("claim_amt").set("required", true);
							
						}
						else if(d.byId("claimAmt"))
						{
							m.animate("fadeOut", d.byId("claimAmt"));
							dj.byId("claim_amt").set("value", "");
							dj.byId("claim_amt").set("required", false);
						}
						m.animate("fadeIn", d.byId("bankInst"));
						if(m.hasAttachments())
						{
							dj.byId("delivery_channel").set("disabled", false);
							dj.byId("adv_send_mode").set("required", true);
						}
						else
						{
							dj.byId("delivery_channel").set("disabled", true);
							dj.byId("delivery_channel").set("value", null);
						}
						dj.byId("adv_send_mode").set("required", true);
					}
					else if(dj.byId("product_code") && (dj.byId("product_code").get("value") === "LC" || dj.byId("product_code").get("value") === "SI")  && dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "01")
					{
						m.animate("fadeIn", d.byId("bankInst"));
						if(dj.byId('attachment-file'))
						{
							dj.byId("delivery_channel").set("disabled", false);
							dj.byId("adv_send_mode").set("required", true);
						}
						else
						{
							dj.byId("delivery_channel").set("disabled", true);
							dj.byId("delivery_channel").set("value", null);
						}
					}
					else
					{
						m.clearAndFadeClaimAmtAndBankInst();
					}
				}
				
			});
			m.connect('claim_amt', 'onBlur', function(){
				_validateDebitAmt();
			});	
			m.connect('tnx_amt', 'onBlur', function(){
				_validateSettlementAmt();
			});
			m.connect('adv_send_mode', 'onChange', function(){
				var mainBankAbbvName = m.getMainBankAbbvName();

				if(dj.byId("adv_send_mode").get("value") == "01" && m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments() && dj.byId("delivery_channel"))
				{
					dj.byId("delivery_channel").set("disabled", false);
					dj.byId("delivery_channel").set("required", true);
					m.connectDeliveryChannelOnChange();
				}
				else
				{
					dj.byId("delivery_channel").set("required", false);
					dj.byId("delivery_channel").set("disabled", true);
					dj.byId("delivery_channel").set("value", null);
				}
			});	
			
			//Validate that the settlement amount should be less than equal to outstanding amount.
			m.connect("tnx_amt", "onBlur", function(){
				var settlementAmtField = dj.byId("tnx_amt");
				if(settlementAmtField && dj.byId("outstanding_amt") && dj.byId("outstanding_amt").get("value")!=="" && settlementAmtField.get("value") !== "")
				{
					var outStandingAmt = dojo.number.parse(dj.byId("outstanding_amt").get("value"));
					outStandingAmt = !isNaN(outStandingAmt) ? outStandingAmt : 0;
					if(settlementAmtField.get("value") > outStandingAmt)
						{
					var displayMessage = misys.getLocalization("settlementAmountGreaterThanOutstanding");
					var domNode = settlementAmtField.domNode;
					settlementAmtField.set("state","Error");
					dj.showTooltip(displayMessage, domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(domNode);
					};
					var timeoutInMs = 2000;
					setTimeout(hideTT, timeoutInMs);
						}
				}
			});
			
			m.connect("free_format_text", "onBlur", function(){
				if(dj.byId("free_format_text").value && dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") == "68")
				{
					var value = dj.byId("free_format_text").value;
					var length;
					if(value && value != "" && value != null)
					{
						length = dj.byId("free_format_text").value.replaceAll("\n","").length;
					}
					if(value && length && length > dj.byId("free_format_text").maxSize)
					{
						var displayMessage = misys.getLocalization("ciMaxSizeExceeded");
						var domNode = this.domNode;
						this.set("state","Error");
						dj.showTooltip(displayMessage, domNode, 0);
						return false;
					}
				}
			});
			m.connect("free_format_text", "onChange", function(){
				if(dj.byId("free_format_text").value && dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") == "68")
				{
					var value = dj.byId("free_format_text").value;
					var length;
					if(value && value != "" && value != null)
					{
						length = dj.byId("free_format_text").value.replaceAll("\n","").length;
					}
					if(value && length && length > dj.byId("free_format_text").maxSize)
					{
						var displayMessage = misys.getLocalization("ciMaxSizeExceeded");
						var domNode = this.domNode;
						this.set("state","Error");
						dj.showTooltip(displayMessage, domNode, 0);
						return false;
					}
				}
			});
		},
		
		onFormLoad : function() {
			var mainBankAbbvName = m.getMainBankAbbvName();
			
			var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true;
			m.setCurrency(dijit.byId('claim_cur_code'), ['claim_amt']);
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			_toggleSettlementDetails(true);
				
				if(isMT798Enable)
				{
					if((subTnxTypeCode && (subTnxTypeCode.get("value") == "25" || subTnxTypeCode.get("value") == "46" || subTnxTypeCode.get("value") == "47")) && dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "01")
					{
						m.animate("fadeIn", d.byId("bankInst"));
						// Connect/listen to 'delivery_channel' drop-down for 'onChange' event
						m.connectDeliveryChannelOnChange();
						if(dj.byId("claim_amt"))
						{
							m.animate("fadeIn", d.byId("claimAmt"));
							dj.byId("claim_amt").set("required", true);
						}
						dj.byId("adv_send_mode").set("required", true);
					}
					else if(subTnxTypeCode && subTnxTypeCode.get("value") == "25" && ((dj.byId("product_code") && dj.byId("product_code").get("value") === "SR") || (dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "01")))
					{
						m.animate("fadeIn", d.byId("bankInst"));
						// Connect/listen to 'delivery_channel' drop-down for 'onChange' event
						m.connectDeliveryChannelOnChange();
						if(dj.byId("claim_amt"))
						{
							m.animate("fadeIn", d.byId("claimAmt"));
							dj.byId("claim_amt").set("required", true);
						}
						dj.byId("adv_send_mode").set("required", true);
					}
					else if(subTnxTypeCode && subTnxTypeCode.get("value") == "68")
					{	
						m.animate("fadeIn", d.byId("bankInst"));
						if(d.byId("pending-list-grid"))
						{
							d.byId("pending-list-grid").style.display = "block";
						}
						if(d.byId("selected_tnx") && d.byId("selected_tnx").value)
						{
							var selectedTnx = d.byId("selected_tnx").value;
							if(dj.byId(selectedTnx))
							{
								dj.byId(selectedTnx).set("checked",true);
							}
						}
						if(dj.byId("free_format_text"))
						{
							dj.byId("free_format_text").set("rows",6);
							dj.byId("free_format_text").set("cols",35);
							dj.byId("free_format_text").set("maxSize",210);
							dj.byId("free_format_text").set("hide",false);
						}
					}
					else if(dj.byId("product_code").get("value") === "SR" && dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "")
					{
						m.animate("fadeIn", d.byId("bankInst"));
						// Connect/listen to 'delivery_channel' drop-down for 'onChange' event
						m.connectDeliveryChannelOnChange();
						dj.byId("adv_send_mode").set("required", true);
					}
					else if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "01")
					{
						if(dj.byId("product_code") && (dj.byId("product_code").get("value") === "LC" || dj.byId("product_code").get("value") === "EL" || dj.byId("product_code").get("value") === "BG" || dj.byId("product_code").get("value") === "SI" || dj.byId("product_code").get("value") === "SR"))
						{
							m.animate("fadeIn", d.byId("bankInst"));
							if(m.hasAttachments()){
								if(dj.byId("delivery_channel"))
									{
										misys.toggleFields(true, null, ["delivery_channel"], false, false);
									}
							}
							// Connect/listen to 'delivery_channel' drop-down for 'onChange' event
							m.connectDeliveryChannelOnChange();
						}
					}
					if(dj.byId("adv_send_mode"))
					{
						m.animate("wipeOut", d.byId("adv_send_mode_row"));
						m.toggleRequired("adv_send_mode", false);
					}
				}
				else
				{
					m.animate("fadeOut", d.byId("bankInst"));
					if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") !== "")
					{
						m.animate("wipeIn", d.byId("adv_send_mode_row"));
						m.toggleRequired("adv_send_mode", true);
					} else if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") === ""){
						m.toggleRequired("adv_send_mode", false);
					}
					// Else part ends for isMT798Enable check
				}
				
			
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			if(dj.byId("tnx_amt"))
				{
					if(dj.byId("lc_cur_code"))
					{
						m.setCurrency("lc_cur_code", ["tnx_amt"]);
					}
					if(dj.byId("ic_cur_code"))
					{
						m.setCurrency("ic_cur_code", ["tnx_amt"]);
					}
				}
			if(dj.byId("product_code") && dj.byId("product_code").get("value") === "SR"){
				m.toggleRequired( "sub_tnx_type_code", true);
			}
		},
		
		getMainBankAbbvName : function(){
			var mainBankAbbvName = "";			

			if(dj.byId("product_code") && (dj.byId("product_code").get("value") === "LC" || dj.byId("product_code").get("value") === "SG" || dj.byId("product_code").get("value") === "LI" || dj.byId("product_code").get("value") === "TF" || dj.byId("product_code").get("value") === "SI" || dj.byId("product_code").get("value") === "BG" || dj.byId("product_code").get("value") === "FX" || dj.byId("product_code").get("value") === "XO" || dj.byId("product_code").get("value") === "FA" || dj.byId("product_code").get("value") === "SI"))
			{
				mainBankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
			}
			else if(dj.byId("product_code") && (dj.byId("product_code").get("value") === "EL" || dj.byId("product_code").get("value") === "SR" || dj.byId("product_code").get("value") === "BR"))
			{
				mainBankAbbvName = dj.byId("advising_bank_abbv_name") ? dj.byId("advising_bank_abbv_name").get("value") : "";
			}
			else if(dj.byId("product_code") && (dj.byId("product_code").get("value") === "EC" || dj.byId("product_code").get("value") === "IR"))
			{
				mainBankAbbvName = dj.byId("remitting_bank_abbv_name") ? dj.byId("remitting_bank_abbv_name").get("value") : "";
			}
			else if(dj.byId("product_code") && (dj.byId("product_code").get("value") === "IC"))
			{
				mainBankAbbvName = dj.byId("presenting_bank_abbv_name") ? dj.byId("presenting_bank_abbv_name").get("value") : "";
			}
			return mainBankAbbvName;
		},
		
		connectDeliveryChannelOnChange : function(){
			// MT798 FileAct checkbox appears upon selection of 
			// File Act(FACT) 'option' from delivery_channel Combo Box
			if (dj.byId("delivery_channel")){
				if((dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") != "01") || !m.hasAttachments())
				{
					dj.byId("delivery_channel").set("disabled", true);
					dj.byId("delivery_channel").set("value", null);
					dj.byId("delivery_channel").set("required", false);
				}
				m.animate("fadeIn", "delivery_channel_row");
				m.connect("delivery_channel", "onChange",  function(){
					if(dj.byId('attachment-file'))
					{
						if(dj.byId("delivery_channel").get('value') === 'FACT')
						{
							dj.byId('attachment-file').displayFileAct(true);
						}
						else
						{
							dj.byId('attachment-file').displayFileAct(false);
						}
					}
				});
				dj.byId("delivery_channel").onChange();
			}
			m.toggleFields(m._config.customerBanksMT798Channel[m.getMainBankAbbvName()] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
		},
		
		clearAndFadeClaimAmtAndBankInst : function(){
			if(d.byId("claimAmt"))
			{
				m.animate("fadeOut", d.byId("claimAmt"));
				dj.byId("claim_amt").set("value", "");
				dj.byId("claim_amt").set("required", false);
				dj.byId("adv_send_mode").set("value", "");
				dj.byId("adv_send_mode").set("required", false);
				if(dj.byId("delivery_channel"))
				{
					dj.byId("delivery_channel").set("value", "");
					dj.byId("delivery_channel").set("required", false);
				}
			}
			m.animate("fadeOut", d.byId("bankInst"));
		},
		
		beforeSubmitValidations : function() {
			
			var valid = true;
			var error_message = "";
			var mainBankAbbvName = m.getMainBankAbbvName();
			var isMT798Enable =  m._config.customerBanksMT798Channel ? m._config.customerBanksMT798Channel[mainBankAbbvName] === true : false;
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			var freeFormatText = dj.byId("free_format_text") ;
			var prodCode = dj.byId("product_code");
			if(isMT798Enable && subTnxTypeCode && subTnxTypeCode.get("value") == "68" && d.byId("selected_tnx") && (d.byId("selected_tnx").value == "" || d.byId("selected_tnx").value == null))
			{
				error_message += misys.getLocalization("mandatoryPendingItemError");
				valid = false;
			}
			//Fixed as part of MPS-53630, Message to Bank-> From Existing, customer Instructions text area is mandatory, hence validating that field before submitting (for LI only as per the issue)
			if((prodCode && prodCode.get("value") == 'LI') && (freeFormatText && dojo.string.trim(freeFormatText.get("value")) === ""))
            {
				freeFormatText.set("required",true);
				freeFormatText.focus();
				valid = false;
            }
            else
            {
                valid = true;
            }
			m._config.onSubmitErrorMsg = error_message;
			return valid;
			
		},	
		
		beforeSaveValidations : function() {
			
			if(dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				var cur = dj.byId("claim_cur_code").get('value');
				var amt = dj.byId("claim_amt").get('value');
				dj.byId('tnx_amt').set('value', amt);
				dj.byId('tnx_cur_code').set('value', cur);
			}
			return true;
			
		},
		submit : function(/*String*/ type)
		{
			if(dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				var cur = dj.byId("claim_cur_code").get('value');
				var amt = dj.byId("claim_amt").get('value');
				dj.byId('tnx_amt').set('value', amt);
				dj.byId('tnx_cur_code').set('value', cur);
			}
			var pending_list_count = d.byId("pending_list_count")? d.byId("pending_list_count").value : 0;
			var convertedValue;
			if (pending_list_count && d.isString(pending_list_count))
			{
				convertedValue = d.number.parse(pending_list_count);
			}
			if(m._config.pendingTnxIdArray){
				convertedValue = m._config.pendingTnxIdArray.length;
				 for(var i=0; i< convertedValue; i++)
				 {
					var tnxId = m._config.pendingTnxIdArray[i];
						
					if(d.byId(tnxId) && d.byId(tnxId).checked === true && d.byId("selected_tnx"))
					{
						d.byId("selected_tnx").value = tnxId;
					}		
				}
			}
			 m._submit(type);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_client');