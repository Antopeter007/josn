/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.openaccount.create_ip"]){dojo._hasResource["misys.binding.openaccount.create_ip"]=true;dojo.provide("misys.binding.openaccount.create_ip");dojo.require("dojo.parser");dojo.require("dijit.layout.BorderContainer");dojo.require("misys.widget.Dialog");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.layout.TabContainer");dojo.require("dojo.io.iframe");dojo.require("dijit.ProgressBar");dojo.require("dojo.behavior");dojo.require("dojo.date.locale");dojo.require("dijit.Tooltip");dojo.require("misys.openaccount.FormOpenAccountEvents");dojo.require("misys.grid.DataGrid");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.common");dojo.require("misys.form.file");dojo.require("misys.validation.common");dojo.require("misys.layout.FloatingPane");dojo.require("misys.openaccount.widget.LineItems");dojo.require("misys.openaccount.widget.LineItem");dojo.require("misys.openaccount.widget.ProductIdentifiers");dojo.require("misys.openaccount.widget.ProductIdentifier");dojo.require("misys.openaccount.widget.ProductCategories");dojo.require("misys.openaccount.widget.ProductCategory");dojo.require("misys.openaccount.widget.ProductCharacteristics");dojo.require("misys.openaccount.widget.ProductCharacteristic");dojo.require("misys.openaccount.widget.Adjustments");dojo.require("misys.openaccount.widget.Adjustment");dojo.require("misys.openaccount.widget.Payments");dojo.require("misys.openaccount.widget.Payment");dojo.require("misys.openaccount.widget.Taxes");dojo.require("misys.openaccount.widget.Tax");dojo.require("misys.openaccount.widget.AirTransports");dojo.require("misys.openaccount.widget.SeaTransports");dojo.require("misys.openaccount.widget.RoadTransports");dojo.require("misys.openaccount.widget.RailTransports");dojo.require("misys.openaccount.widget.TakingInTransports");dojo.require("misys.openaccount.widget.PlaceTransports");dojo.require("misys.openaccount.widget.FinalDestinationTransports");dojo.require("misys.openaccount.widget.Transport");dojo.require("misys.openaccount.widget.FreightCharges");dojo.require("misys.openaccount.widget.FreightCharge");dojo.require("misys.openaccount.widget.Incoterms");dojo.require("misys.openaccount.widget.Incoterm");dojo.require("misys.openaccount.widget.ContactDetails");dojo.require("misys.openaccount.widget.ContactDetail");dojo.require("misys.openaccount.widget.SUserInformations");dojo.require("misys.openaccount.widget.SUserInformation");dojo.require("misys.openaccount.widget.BUserInformations");dojo.require("misys.openaccount.widget.BUserInformation");(function(d,dj,m){d.mixin(m._config,{initReAuthParams:function(){var _1={productCode:dj.byId("product_code").get("value"),subProductCode:"",transactionTypeCode:"01",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("total_net_cur_code")?dj.byId("total_net_cur_code").get("value"):"",amount:dj.byId("total_net_amt")?m.trimAmount(dj.byId("total_net_amt").get("value")):"",bankAbbvName:dj.byId("issuing_bank_abbv_name")?dj.byId("issuing_bank_abbv_name").get("value"):"",es_field1:"",es_field2:""};return _1;},_hasLineItemShipmentDate:function(){if(dj.byId("line-items").store!==null){var _2=dj.byId("line-items").store._arrayOfAllItems;for(i=0;i<_2.length;i++){if(_2[i]&&_2[i].last_ship_date!==""){dj.byId("last_ship_date").set("value",null);dj.byId("last_ship_date").set("disabled",true);break;}else{dj.byId("last_ship_date").set("disabled",false);}}}}});d.mixin(m,{bind:function(){m.setValidation("iss_date",m.validateIPInvoiceDate);m.setValidation("due_date",m.validateIPDueDate);m.setValidation("last_ship_date",m.validateLastShipmentDate);m.setValidation("line_item_earliest_ship_date",m.validateEarliestShipDate);m.setValidation("line_item_last_ship_date",m.validateLastShipmentDate);m.setValidation("discount_exp_date",m.validateDiscountExpDate);m.setValidation("contact_email",m.validateEmailAddr);m.setValidation("buyer_bei",m.validateBEIFormat);m.setValidation("seller_bei",m.validateBEIFormat);m.setValidation("fin_inst_bic",m.validateBICFormat);m.setValidation("total_cur_code",m.validateCurrency);m.setValidation("face_total_cur_code",m.validateCurrency);m.setValidation("total_net_cur_code",m.validateCurrency);m.setValidation("line_item_price_cur_code",m.validateCurrency);m.setValidation("line_item_total_net_cur_code",m.validateCurrency);m.setValidation("adjustment_cur_code",m.validateCurrency);m.setValidation("details_cur_code",m.validateCurrency);m.setValidation("tax_cur_code",m.validateCurrency);m.setValidation("freight_charge_cur_code",m.validateCurrency);m.setValidation("buyer_country",m.validateCountry);m.setValidation("seller_country",m.validateCountry);m.setValidation("bill_to_country",m.validateCountry);m.setValidation("ship_to_country",m.validateCountry);m.setValidation("consgn_country",m.validateCountry);m.setValidation("line_item_product_orgn_country",m.validateCountry);m.setValidation("fin_inst_country",m.validateCountry);m.connect("total_cur_code","onChange",m.toggleDisableButtons);m.connect("total_cur_code","onBlur",_3);m.connect("issuer_ref_id","onChange",m.checkInvoiceReferenceExists);m.connect("cust_ref_id","onChange",m.checkInvoiceCustReferenceExists);m.connect("buyer_abbv_name","onChange",m.checkInvoiceReferenceExists);m.connect("buyer_abbv_name","onChange",m.checkInvoiceCustReferenceExists);m.connect("seller_abbv_name","onChange",m.checkInvoiceReferenceExists);m.connect("seller_abbv_name","onChange",m.checkInvoiceCustReferenceExists);m.connect("total_cur_code","onChange",function(){m.setCurrency(this,["line_item_total_net_amt","line_item_total_amt","line_item_price_amt","tax_amt","adjustment_amt","details_amt","freight_charge_amt"]);this.set("readOnly",false);});var _4=m._config.productCode.toLowerCase();if(_4==="ip"){m.connect("fscm_programme_code","onChange",function(){var _5=["seller_name","seller_abbv_name","seller_bei","seller_street_name","seller_post_code","seller_town_name","seller_country_sub_div","seller_country","seller_account_type","seller_account_value","fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name","fin_inst_country_sub_div"];m.clearFields(_5);});}if(_4==="in"){m.connect("fscm_programme_code","onChange",function(){var _6=["buyer_name","buyer_abbv_name","buyer_bei","buyer_street_name","buyer_post_code","buyer_town_name","buyer_country_sub_div","buyer_country","buyer_account_type","buyer_account_value","fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name","fin_inst_country_sub_div","access_opened","transaction_counterparty_email","ben_company_abbv_name"];m.clearFields(_6);});}m.connect("freight_charges_type","onFocus",m.saveOldFreightChargeType);m.connect("freight_charges_type","onChange",m.manageFreightButton);m.connect("total_cur_code","onChange",m.managePOCurrency);m.connect("adjustment_amt","onChange",function(){m.toggleFields(isNaN(this.get("value")),null,["adjustment_rate"],false,false);});m.connect("adjustment_rate","onChange",function(){m.toggleFields(isNaN(this.get("value")),null,["adjustment_amt","adjustment_cur_code"],false,false);});m.connect("freight_charge_amt","onChange",function(){m.toggleFields(isNaN(this.get("value")),null,["freight_charge_rate"],false,false);});m.connect("freight_charge_rate","onChange",function(){m.toggleFields(isNaN(this.get("value")),null,["freight_charge_amt","freight_charge_cur_code"],false,false);});m.connect("tax_amt","onChange",function(){m.toggleFields(isNaN(this.get("value")),null,["tax_rate"],false,false);});m.connect("tax_rate","onChange",function(){m.toggleFields(isNaN(this.get("value")),null,["tax_amt","tax_cur_code"],false,false);});m.connect("display_other_parties","onClick",m.showHideOtherParties);m.connect("total_cur_code","onFocus",m.saveOldPOCurrency);m.connect("transport_type","onChange",m.onChangeTranportType);m.connect("payment_terms_type_1","onClick",m.onClickCheckPaymentTerms);m.connect("payment_terms_type_2","onClick",m.onClickCheckPaymentTerms);m.connect("seller_account_type","onChange",function(){m.onChangeSellerAccountType("form_settlement","seller_account_value","seller_account_type");});m.connect("seller_account_value","onBlur",function(){m.onBlurSellerAccount("form_settlement","seller_account_value","seller_account_type");});m.connect("last_match_date","onBlur",m.onBlurMatchDate);m.connect("line_item_qty_val","onBlur",m.computeLineItemAmount);m.connect("line_item_price_amt","onBlur",m.computeLineItemAmount);m.connect("line_item_qty_unit_measr_code","onChange",function(){if(dojo.byId("line_item_qty_unit_measr_other_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","line_item_qty_unit_measr_other_row");dj.byId("line_item_qty_unit_measr_other").set("readOnly",false);m.toggleRequired("line_item_qty_unit_measr_other",true);}else{m.animate("fadeOut","line_item_qty_unit_measr_other_row");dj.byId("line_item_qty_unit_measr_other").set("readOnly",true);dj.byId("line_item_qty_unit_measr_other").set("value","");m.toggleRequired("line_item_qty_unit_measr_other",false);}}});m.connect("face_total_cur_code","onChange",function(){m.setCurrency(this,["face_total_amt"]);});m.connect("total_net_cur_code","onChange",function(){m.setCurrency(this,["total_net_amt"]);});m.connect("line_item_price_cur_code","onChange",function(){m.setCurrency(this,["line_item_price_amt"]);});m.connect("details_cur_code","onChange",function(){m.setCurrency(this,["details_amt"]);});m.connect("face_total_amt","onChange",function(){m.setTnxAmt(this.get("value"));});m.connect("line_item_total_cur_code","onChange",function(){m.setCurrency(this,["line_item_total_amt"]);});m.connect("line_item_total_net_cur_code","onChange",function(){m.setCurrency(this,["line_item_total_net_amt"]);});m.connect("fake_total_cur_code","onChange",function(){m.setCurrency(this,["fake_total_amt"]);});m.connect("adjustment_cur_code","onChange",function(){m.setCurrency(this,["adjustment_amt"]);});m.connect("tax_cur_code","onChange",function(){m.setCurrency(this,["tax_amt"]);});m.connect("freight_charge_cur_code","onChange",function(){m.setCurrency(this,["freight_charge_amt"]);});m.connect("issuing_bank_abbv_name","onChange",m.populateReferences);if(dj.byId("issuing_bank_abbv_name")){m.connect("entity","onChange",function(){dj.byId("issuing_bank_abbv_name").onChange();});}if(_4==="ip"){m.connect("issuing_bank_customer_reference","onChange",m.setBuyerReference);}if(_4==="in"){m.connect("issuing_bank_customer_reference","onChange",m.setSellerReference);}var _7=dj.byId("issuing_bank_customer_reference"),_8=dj.byId("issuing_bank_abbv_name"),_9;if(_7){_9=_7.value;}if(_8){_8.onChange();}if(_7){_7.onChange();_7.set("value",_9);}m.connect(dj.byId("line_item_qty_unit_measr_code"),"onChange",function(){dj.byId("line_item_price_unit_measr_code").set("value",this.get("value"));});m.connect(dj.byId("details_code"),"onChange",m.paymentDetailsChange);m.connect(dj.byId("line_item_qty_unit_measr_code"),"onChange",function(){dj.byId("line_item_qty_unit_measr_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("contact_type"),"onChange",function(){dj.byId("contact_type_decode").set("value",this.get("displayedValue"));});m.connect(dj.byId("product_identifier_code"),"onChange",function(){dj.byId("product_identifier_code_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("product_category_code"),"onChange",function(){dj.byId("product_category_code_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("product_characteristic_code"),"onChange",function(){dj.byId("product_characteristic_code_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("adjustment_type"),"onChange",function(){dj.byId("adjustment_type_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("tax_type"),"onChange",function(){dj.byId("tax_type_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("freight_charge_type"),"onChange",function(){dj.byId("freight_charge_type_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("incoterm_code"),"onChange",function(){dj.byId("incoterm_code_label").set("value",this.get("displayedValue"));});m.connect(dj.byId("iss_date"),"onChange",function(){var _a=dj.byId("details_code");if(_a&&_a.get("value")==="OTHR"){var _b=dj.byId("due_date").value;var _c=dj.byId("iss_date").value;var _d=dojo.date.difference(_c,_b,"day");dj.byId("details_nb_days").set("value",_d);}});m.connect(dj.byId("due_date"),"onChange",function(){var _e=dj.byId("details_code");if(_e&&_e.get("value")==="OTHR"){var _f=dj.byId("due_date").value;var _10=dj.byId("iss_date").value;var _11=dojo.date.difference(_10,_f,"day");dj.byId("details_nb_days").set("value",_11);}});m.connect(dj.byId("details_code"),"onChange",function(){var _12=dj.byId("details_code");var _13=dj.byId("due_date").value;var _14=dj.byId("iss_date").value;if(_12&&_14&&_13&&_12.get("value")==="OTHR"){var _15=dojo.date.difference(_14,_13,"day");dj.byId("details_nb_days").set("value",_15);dj.byId("details_nb_days").set("disabled",true);}else{var _16=["details_nb_days"];m.clearFields(_16);dj.byId("details_nb_days").set("disabled",false);}});m.connect(dj.byId("adjustment_type"),"onChange",function(){var _17=dj.byId("adjustment_type").get("value");if(_17==="REBA"||_17==="CREN"||_17==="DISC"){dj.byId("adjustment_direction_1").set("disabled",true);dj.byId("adjustment_direction_2").set("checked",true);dj.byId("adjustment_direction_2").set("disabled",false);}else{if(_17==="DEBN"){dj.byId("adjustment_direction_1").set("disabled",false);dj.byId("adjustment_direction_1").set("checked",true);dj.byId("adjustment_direction_2").set("disabled",true);}else{dj.byId("adjustment_direction_1").set("checked",false);dj.byId("adjustment_direction_1").set("disabled",false);dj.byId("adjustment_direction_2").set("disabled",false);dj.byId("adjustment_direction_2").set("checked",false);}}});if(d.byId("adjustment_other_type_row")&&d.byId("adjustment_type")){if(dj.byId("adjustment_type").get("value")==="OTHR"){m.animate("fadeIn","adjustment_other_type_row");}else{m.animate("fadeOut","adjustment_other_type_row");}}if(d.byId("tax_other_type_row")&&d.byId("tax_type")){if(dj.byId("tax_type").get("value")==="OTHR"){m.animate("fadeIn","tax_other_type_row");}else{m.animate("fadeOut","tax_other_type_row");}}if(d.byId("discount_exp_date_row")&&d.byId("adjustment_type")){if(dj.byId("adjustment_type").get("value")==="DISC"){m.animate("fadeIn","discount_exp_date_row");}else{m.animate("fadeOut","discount_exp_date_row");}}m.connect("adjustment_type","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["adjustment_other_type"]);if(d.byId("adjustment_other_type_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","adjustment_other_type_row");}else{m.animate("fadeOut","adjustment_other_type_row");}}});m.connect("tax_type","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["tax_other_type"]);if(d.byId("tax_other_type_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","tax_other_type_row");}else{m.animate("fadeOut","tax_other_type_row");}}});m.connect("adjustment_type","onChange",function(){m.toggleFields((this.get("value")==="DISC"),null,["discount_exp_date"]);if(d.byId("discount_exp_date_row")){if(this.get("value")==="DISC"){m.animate("fadeIn","discount_exp_date_row");}else{m.animate("fadeOut","discount_exp_date_row");}}});if(d.byId("product_category_other_code_row")&&d.byId("product_category_code")){if(dj.byId("product_category_code").get("value")==="OTHR"){m.animate("fadeIn","product_category_other_code_row");}else{m.animate("fadeOut","product_category_other_code_row");}}if(d.byId("product_characteristic_other_code_row")&&d.byId("product_characteristic_code")){if(dj.byId("product_characteristic_code").get("value")==="OTHR"){m.animate("fadeIn","product_characteristic_other_code_row");}else{m.animate("fadeOut","product_characteristic_other_code_row");}}if(d.byId("product_identifier_other_code_row")&&d.byId("product_identifier_code")){if(dj.byId("product_identifier_code").get("value")==="OTHR"){m.animate("fadeIn","product_identifier_other_code_row");}else{m.animate("fadeOut","product_identifier_other_code_row");}}if(d.byId("incoterm_other_row")&&d.byId("incoterm_code")){if(dj.byId("incoterm_code").get("value")==="OTHR"){m.animate("fadeIn","incoterm_other_row");}else{m.animate("fadeOut","incoterm_other_row");}}if(d.byId("details_other_paymt_terms_row")&&d.byId("details_code")){if(dj.byId("details_code").get("value")==="OTHR"){m.animate("fadeIn","details_other_paymt_terms_row");}else{m.animate("fadeOut","details_other_paymt_terms_row");}}if(d.byId("freight_charge_other_type_row")&&d.byId("freight_charge_type")){if(dj.byId("freight_charge_type").get("value")==="OTHR"){m.animate("fadeIn","freight_charge_other_type_row");}else{m.animate("fadeOut","freight_charge_other_type_row");}}m.connect("freight_charge_type","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["freight_charge_other_type"]);if(d.byId("freight_charge_other_type_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","freight_charge_other_type_row");}else{m.animate("fadeOut","freight_charge_other_type_row");}}});m.connect("details_code","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["details_other_paymt_terms"]);if(d.byId("details_other_paymt_terms_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","details_other_paymt_terms_row");}else{m.animate("fadeOut","details_other_paymt_terms_row");}}});m.connect("incoterm_code","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["incoterm_other"]);if(d.byId("incoterm_other_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","incoterm_other_row");}else{m.animate("fadeOut","incoterm_other_row");}}});m.connect("product_identifier_code","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["product_identifier_other_code"]);if(d.byId("product_identifier_other_code_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","product_identifier_other_code_row");}else{m.animate("fadeOut","product_identifier_other_code_row");}}});m.connect("product_characteristic_code","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["product_characteristic_other_code"]);if(d.byId("product_characteristic_other_code_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","product_characteristic_other_code_row");}else{m.animate("fadeOut","product_characteristic_other_code_row");}}});m.connect("product_category_code","onChange",function(){m.toggleFields((this.get("value")==="OTHR"),null,["product_category_other_code"]);if(d.byId("product_characteristic_other_code_row")){if(this.get("value")==="OTHR"){m.animate("fadeIn","product_category_other_code_row");}else{m.animate("fadeOut","product_category_other_code_row");}}});m.onClickCheckPaymentTerms();},onFormLoad:function(){m.setCurrency(dj.byId("total_net_cur_code"),["total_net_amt"]);var _18=dj.byId("display_other_parties");if(_18){m.showHideOtherParties();}m.toggleDisableButtons();if(dj.byId("add_payment_term_button")&&!(dj.byId("payment_terms_type_1").get("checked")||dj.byId("payment_terms_type_2").get("checked"))){dj.byId("add_payment_term_button").set("disabled",true);}var _19=dj.byId("issuing_bank_customer_reference"),_1a=dj.byId("issuing_bank_abbv_name"),_1b;if(_19){_1b=_19.value;}if(_1a){_1a.onChange();}if(_19){_19.onChange();_19.set("value",_1b);}m.computePOTotalAmount();m._config._hasLineItemShipmentDate();m.managePOCurrency();if(d.byId("line_item_qty_unit_measr_other_row")){m.animate("fadeOut","line_item_qty_unit_measr_other_row");}},beforeSubmitValidations:function(){var _1c=true;var _1d="";var _1e=dj.byId("po-payments");var _1f=dj.byId("line-items");var _20=dj.byId("total_net_amt");var _21=dj.byId("appl_date");var _22=dj.byId("due_date");if(!m.compareDateFields(_21,_22)){_1d=m.getLocalization("dueDateLessThanAppDateError",[m.localizeDate(_22),m.localizeDate(_21)]);_1c=false;}var _23=dj.byId("iss_date");if(!m.compareDateFields(_23,_22)){if(_1d!==""){_1d+="<br>";}_1d+=m.getLocalization("dueDateLessThanInvoiceDateError",[m.localizeDate(_22),m.localizeDate(_23)]);_1c=false;}if(!_1f||!_1f.store||_1f.store._arrayOfTopLevelItems.length<=0){if(_1d!==""){_1d+="<br>";}_1d+=misys.getLocalization("mandatoryLineItemError");_1c=false;}if(!_1e||!_1e.grid||_1e.grid.rowCount<=0){if(_1d!==""){_1d+="<br>";}_1d+=m.getLocalization("mandatoryPaymentTermError");_1c=false;}if(_20&&_1e.store&&_1e.store._arrayOfTopLevelItems.length>0){var _24=0;var Amt=0;var _25=parseFloat(dijit.byId("total_net_amt").get("value"));_1e.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(_1e,function(_26,_27){dojo.forEach(_26,function(_28){if(_28.amt[0]!==""){_24=_24+parseFloat(_28.amt[0].replace(/[^\d.]/g,""));}else{if(_28.pct[0]!==""){Amt=(parseFloat(_28.pct[0])/100)*_25;_24=_24+Amt;}}});})});if(_24!==_25){if(_1d!==""){_1d+="<br>";}_1d+=misys.getLocalization("paymentAmtOrPercentage");_1c=false;}}m._config.onSubmitErrorMsg=_1d;return _1c;},beforeSaveValidations:function(){var _29=dj.byId("entity");var _2a=false;if((_29&&_29.get("value")==="")){_2a=false;}else{if(dj.byId("total_net_amt")&&dj.byId("total_net_amt").state==="Error"){m._config.onSubmitErrorMsg=m.getLocalization("totalNetAmountExceeded");_2a=false;}else{_2a=true;}}return _2a;}});function _3(){var _2b=misys.getLocalization("resetInvoicePayableCurrency");var _2c=this,_2d=false,_2e;if(dj.byId("line-items")&&dj.byId("line-items").store&&dj.byId("line-items").store!==null&&dj.byId("line-items").store._arrayOfAllItems.length>0){if(dj.byId("line-items").grid&&dj.byId("line-items").grid.store){dj.byId("line-items").grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this,function(_2f,_30){d.some(_2f,function(_31){var _32=_31;if(_32!==null&&_32.price_cur_code!==_2c.get("value")){_2d=true;_2e=_32.price_cur_code;return false;}});if(_2d){var _33=function(){d.forEach(_2f,function(_34){var _35=dj.byId("line-items").grid.store;var _36=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_35.setValue(_34,"price_cur_code",_36);_35.setValue(_34,"total_cur_code",_36);_35.setValue(_34,"total_net_cur_code",_36);var _37=dojo.currency.format(_34.total_net_amt,{currency:_36});if(null!==_37&&_37!==""){_37=_37.replace((/[^\d\.\,]/g),"");}_35.setValue(_34,"total_net_amt",_37);var _38=dojo.currency.format(_34.total_amt,{currency:_36});if(null!==_38&&_38!==""){_38=_38.replace((/[^\d\.\,]/g),"");}_35.setValue(_34,"total_amt",_38);var _39=dojo.currency.format(_34.price_amt,{currency:_36});if(null!==_39&&_39!==""){_39=_39.replace((/[^\d\.\,]/g),"");}_35.setValue(_34,"price_amt",_39);if(_34.taxes&&_34.taxes.length>0){dj.byId("tax_cur_code").set("value",_36);if(_34.taxes[0]._values!==""&&_34.taxes[0]._values.length>0){for(i=0;i<_34.taxes[0]._values.length;i++){_34.taxes[0]._values[i].cur_code=_36;var _3a=dojo.currency.format(_34.taxes[0]._values[i].amt,{currency:dj.byId("total_cur_code").get("value")});if(null!==_3a&&_3a!==""){_3a=_3a.replace((/[^\d\.\,]/g),"");}_34.taxes[0]._values[i].amt=_3a;}}}if(_34.adjustments&&_34.adjustments.length>0){dj.byId("adjustment_cur_code").set("value",_36);if(_34.adjustments[0]._values!==""&&_34.adjustments[0]._values.length>0){for(i=0;i<_34.adjustments[0]._values.length;i++){_34.adjustments[0]._values[i].cur_code=_36;var _3b=dojo.currency.format(_34.adjustments[0]._values[i].amt,{currency:dj.byId("total_cur_code").get("value")});if(null!==_3b&&_3b!==""){_3b=_3b.replace((/[^\d\.\,]/g),"");}_34.adjustments[0]._values[i].amt=_3b;}}}if(_34.freight_charges&&_34.freight_charges.length>0){dj.byId("freight_charge_cur_code").set("value",_36);if(_34.freight_charges[0]._values!==""&&_34.freight_charges[0]._values.length>0){for(i=0;i<_34.freight_charges[0]._values.length;i++){_34.freight_charges[0]._values[i].cur_code=_36;var _3c=dojo.currency.format(_34.freight_charges[0]._values[i].amt,{currency:_36});if(null!==_3c&&_3c!==""){_3c=_3c.replace((/[^\d\.\,]/g),"");}_34.freight_charges[0]._values[i].amt=_3c;}}}},dj.byId("line-items"));dj.byId("line-items").grid.store.save();setTimeout(function(){dj.byId("line-items").renderSections();dj.byId("line-items").grid.render();},200);if(dj.byId("po-adjustments")&&dj.byId("po-adjustments").store&&dj.byId("po-adjustments").store!==null&&dj.byId("po-adjustments").store._arrayOfAllItems.length>0&&dj.byId("po-adjustments").grid&&dj.byId("po-adjustments").grid.store){d.forEach(dj.byId("po-adjustments").grid.store,function(_3d){var _3e=dj.byId("po-adjustments").grid.store;var _3f=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_3e.setValue(_3d,"cur_code",_3f);var _40=dojo.currency.format(_3d.amt,{currency:_3f});if(null!==_40&&_40!==""){_40=_40.replace((/[^\d\.\,]/g),"");}_3e.setValue(_3d,"amt",_40);},dj.byId("po-adjustments"));dj.byId("po-adjustments").grid.store.save();setTimeout(function(){dj.byId("po-adjustments").renderSections();dj.byId("po-adjustments").grid.render();},200);}if(dj.byId("po-taxes")&&dj.byId("po-taxes").store&&dj.byId("po-taxes").store!==null&&dj.byId("po-taxes").store._arrayOfAllItems.length>0&&dj.byId("po-taxes").grid&&dj.byId("po-taxes").grid.store){d.forEach(dj.byId("po-taxes").grid.store,function(_41){var _42=dj.byId("po-taxes").grid.store;var _43=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_42.setValue(_41,"cur_code",_43);var _44=dojo.currency.format(_41.amt,{currency:_43});if(null!==_44&&_44!==""){_44=_44.replace((/[^\d\.\,]/g),"");}_42.setValue(_41,"amt",_44);},dj.byId("po-taxes"));dj.byId("po-taxes").grid.store.save();setTimeout(function(){dj.byId("po-taxes").renderSections();dj.byId("po-taxes").grid.render();},200);}if(dj.byId("po-freight-charges")&&dj.byId("po-freight-charges").store&&dj.byId("po-freight-charges").store!==null&&dj.byId("po-freight-charges").store._arrayOfAllItems.length>0&&dj.byId("po-freight-charges").grid&&dj.byId("po-freight-charges").grid.store){d.forEach(dj.byId("po-freight-charges").grid.store,function(_45){var _46=dj.byId("po-freight-charges").grid.store;var _47=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_46.setValue(_45,"cur_code",_47);var _48=dojo.currency.format(_45.amt,{currency:_47});if(null!==_48&&_48!==""){_48=_48.replace((/[^\d\.\,]/g),"");}_46.setValue(_45,"amt",_48);},dj.byId("po-freight-charges"));dj.byId("po-freight-charges").grid.store.save();setTimeout(function(){dj.byId("po-freight-charges").renderSections();dj.byId("po-freight-charges").grid.render();},200);}};var _49=function(){dj.byId("total_cur_code").set("value",_2e);};m.dialog.show("CONFIRMATION",_2b,"","","","",_33,_49);}})});}if(dj.byId("po-adjustments")&&dj.byId("po-adjustments").store&&dj.byId("po-adjustments").store!==null&&dj.byId("po-adjustments").store._arrayOfAllItems.length>0&&dj.byId("po-adjustments").grid&&dj.byId("po-adjustments").grid.store){dj.byId("po-adjustments").grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this,function(_4a,_4b){d.forEach(_4a,function(_4c){var _4d=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";var _4e=dj.byId("po-adjustments").grid.store;_4e.setValue(_4c,"cur_code",_4d);var _4f=dojo.currency.format(_4c.amt,{currency:_4d});if(null!==_4f&&_4f!==""){_4f=_4f.replace((/[^\d\.\,]/g),"");}_4e.setValue(_4c,"amt",_4f);},dj.byId("po-adjustments"));})});}if(dj.byId("po-taxes")&&dj.byId("po-taxes").store&&dj.byId("po-taxes").store!==null&&dj.byId("po-taxes").store._arrayOfAllItems.length>0&&dj.byId("po-taxes").grid&&dj.byId("po-taxes").grid.store){dj.byId("po-taxes").grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this,function(_50,_51){d.forEach(_50,function(_52){var _53=dj.byId("po-taxes").grid.store;var _54=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_53.setValue(_52,"cur_code",_54);var _55=dojo.currency.format(_52.amt,{currency:_54});if(null!==_55&&_55!==""){_55=_55.replace((/[^\d\.\,]/g),"");}_53.setValue(_52,"amt",_55);},dj.byId("po-taxes"));})});}if(dj.byId("po-freight-charges")&&dj.byId("po-freight-charges").store&&dj.byId("po-freight-charges").store!==null&&dj.byId("po-freight-charges").store._arrayOfAllItems.length>0&&dj.byId("po-freight-charges").grid&&dj.byId("po-freight-charges").grid.store){dj.byId("po-freight-charges").grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this,function(_56,_57){d.forEach(_56,function(_58){var _59=dj.byId("po-freight-charges").grid.store;var _5a=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_59.setValue(_58,"cur_code",_5a);var _5b=dojo.currency.format(_58.amt,{currency:_5a});if(null!==_5b&&_5b!==""){_5b=_5b.replace((/[^\d\.\,]/g),"");}_59.setValue(_58,"amt",_5b);},dj.byId("po-freight-charges"));})});}}if(dj.byId("po-payments")&&dj.byId("po-payments").store&&dj.byId("po-payments").store!==null&&dj.byId("po-payments").store._arrayOfAllItems.length>0&&dj.byId("po-payments").grid&&dj.byId("po-payments").grid.store){dj.byId("po-payments").grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this,function(_5c,_5d){d.forEach(_5c,function(_5e){var _5f=dj.byId("po-payments").grid.store;var _60=dj.byId("total_cur_code")?dj.byId("total_cur_code").get("value"):"";_5f.setValue(_5e,"cur_code",_60);var _61=dojo.currency.format(_5e.amt,{currency:_60});if(null!==_61&&_61!==""){_61=_61.replace((/[^\d\.\,]/g),"");}_5f.setValue(_5e,"amt",_61);},dj.byId("po-payments"));})});}};})(dojo,dijit,misys);dojo.require("misys.client.binding.openaccount.create_ip_client");}