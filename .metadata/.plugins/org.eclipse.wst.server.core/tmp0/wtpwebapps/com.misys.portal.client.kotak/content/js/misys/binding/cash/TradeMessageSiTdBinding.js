/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.TradeMessageSiTdBinding"]){dojo._hasResource["misys.binding.cash.TradeMessageSiTdBinding"]=true;dojo.provide("misys.binding.cash.TradeMessageSiTdBinding");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.grid._base");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojo.parser");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.layout.TabContainer");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dojox.grid.EnhancedGrid");dojo.require("dojox.grid.enhanced.plugins.Menu");dojo.require("dojox.grid.enhanced.plugins.NestedSorting");dojo.require("dojox.grid.enhanced.plugins.IndirectSelection");dojo.require("dojox.grid.cells.dijit");dojo.require("misys.binding.cash.request.StandingInstructionAction");fncDoBinding=function(){misys.connect("instructions_type_1","onClick",function(){_fncSwitchBankPaymentInstructionsFields("bank_instruction_field","free_format_field","instructions_type_2");});misys.connect("instructions_type_2","onClick",function(){_fncSwitchBankPaymentInstructionsFields("free_format_field","bank_instruction_field","instructions_type_1");});misys.connect("payment_type","onChange",function(){_fncChangeRequiredFieldsOnPaymentTypeChange("");});misys.connect("beneficiary_account","onChange",function(){_fncChangeRequiredFieldsOnChange("beneficiary_account","");});misys.connect("beneficiary_address","onChange",function(){_fncChangeRequiredFieldsOnChange("beneficiary_address","");});misys.connect("intermediary_bank","onChange",function(){_fncChangeRequiredFieldsOnChange("intermediary_bank","");});var _1=dijit.byId("sub_tnx_type_code").get("value");if(_1=="25"){misys.connect("near_instructions_type_1","onClick",function(){_fncSwitchBankPaymentInstructionsFields("near_bank_instruction_field","free_format_field","near_instructions_type_2","near");});misys.connect("near_instructions_type_2","onClick",function(){_fncSwitchBankPaymentInstructionsFields("near_free_format_field","bank_instruction_field","near_instructions_type_1","near");});misys.connect("near_payment_type","onChange",function(){_fncChangeRequiredFieldsOnPaymentTypeChange("near");});misys.connect("near_beneficiary_account","onChange",function(){_fncChangeRequiredFieldsOnChange("near_beneficiary_account","near");});misys.connect("near_beneficiary_address","onChange",function(){_fncChangeRequiredFieldsOnChange("near_beneficiary_address","near");});misys.connect("near_intermediary_bank","onChange",function(){_fncChangeRequiredFieldsOnChange("near_intermediary_bank","near");});}};fncDoFormOnLoadEvents=function(){var _2=misys._config.td_si;dijit.byId("rec_id").set("value",_2.rec_id);var _3=dijit.byId("sub_tnx_type_code").get("value");dojo.style("bank_instruction_field",{"display":"block"});dojo.style("free_format_field",{"display":"none"});dijit.byId("payment_type").set("required",false);var _4={items:_2.receipts};_fncConstructCustomerPaymentGrid(_4,"customerPaymentGrid","receipt_instructions_id","");var _5={items:_2.payments};_fncConstructBankPaymentGrid(_5,"bankPaymentGrid","payment_instructions_id","");_fncChangeDisabledAdditionalDetailsFiels("additional_details",true);if(_3=="25"){_5={items:_2.near_receipts};dojo.style("near_bank_instruction_field",{"display":"block"});dojo.style("near_free_format_field",{"display":"none"});dijit.byId("near_payment_type").set("required",false);_fncConstructBankPaymentGrid(_5,"near_bankPaymentGrid","near_payment_instructions_id","near");_fncChangeDisabledAdditionalDetailsFiels("near_additional_details",true);}else{if(_3=="24"){_4={items:_2.near_payments};_fncConstructCustomerPaymentGrid(_4,"near_customerPaymentGrid","near_receipt_instructions_id","near");}}};_fncSelectIndex=function(_6,_7,_8){var _9=dijit.byId(_7).selection.selectedIndex;var _a=dijit.byId(_7).get("store")._arrayOfAllItems[_9].id;dijit.byId(_8).set("value",_a);};fncDoPreSubmitValidations=function(){var _b=dijit.byId("customerPaymentGrid").store._arrayOfAllItems.length==0||(dijit.byId("customerPaymentGrid").store._arrayOfAllItems.length!=0&&dijit.byId("customerPaymentGrid").selection.selectedIndex!=-1);var _c=dijit.byId("bankPaymentGrid").store._arrayOfAllItems.length==0||(dijit.byId("bankPaymentGrid").store._arrayOfAllItems.length!=0&&dijit.byId("instructions_type_1").checked&&dijit.byId("bankPaymentGrid").selection.selectedIndex!=-1);var _d;var _e;var _f=dijit.byId("sub_tnx_type_code").get("value");if(_f=="24"){_d=dijit.byId("near_customerPaymentGrid").store._arrayOfAllItems.length==0||(dijit.byId("customerPaymentGrid").store._arrayOfAllItems.length!=0&&dijit.byId("customerPaymentGrid").selection.selectedIndex!=-1);_e=true;}else{if(_f=="25"){_e=dijit.byId("near_bankPaymentGrid").store._arrayOfAllItems.length==0||(dijit.byId("bankPaymentGrid").store._arrayOfAllItems.length!=0&&dijit.byId("instructions_type_1").checked&&dijit.byId("bankPaymentGrid").selection.selectedIndex!=-1);_d=true;}else{_d=true;_e=true;}}return _b&&_c&&_d&&_e;};dojo.require("misys.client.binding.cash.TradeMessageSiTdBinding_client");}