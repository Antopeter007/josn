dojo.provide("misys.binding.system.master_payee");
/*
 ----------------------------------------------------------
 Event Binding for

 Subscription Package Form, Customer Side.

 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
 ----------------------------------------------------------
 */
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.xml.DomParser");
dojo.require("dijit.form.Button");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.Editor");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.xml.DomParser");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.static_document");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	"use strict"; // ECMA5 Strict Mode
	/*will prompt a message to Bank User to confirm whether after updated details, system should invalidate all the 
	registrations made for this payee. Bank is to invalidate all registrations if modification of payee includes changes in the bill references. Otherwise, if payee changes includes name, label names, help text, etc. then bank can ignore invalidating the registration*/
	var onFormLoad = true;
	function _fncSaveMasterPayee(submitType){
		if(dj.byId('featureid')&&  dj.byId('registrations_made').get('value')==='Y'){
			//modification of payye
		_showInvalidateRagistrationDialog(submitType);
		}
		else{
			misys.submit(submitType);
		}
	}
	function _showInvalidateRagistrationDialog(submitType)
	{
		//if InvalidateRegistrationDailog not defined
		if(!dj.byId("invalidateRegistrationDialog"))
		{
			d.require('misys.widget.Dialog');
			d.require('dijit.form.Button');
			var dialog = new dj.Dialog({id: 'invalidateRegistrationDialog',
			    title: m.getLocalization("alertMessage")});
			//Create dialog content
			var dialogContent = d.create("div", { id: "invRegDialogContent"});
			var dialogText = d.create("div", {id:"dialogInvRegText"},dialogContent,'first');
			var dialogButtons =   d.create("div",{id:"invalidateRegistrationDialogButtons",style:"text-align:center;"},dialogContent,'last');
			//Buttons
			var yesButtton  = new dj.form.Button({label:m.getLocalization("yesMessage"),id:"invalidateRegistrationButtonId"});
			var noButton  = new dj.form.Button({label:m.getLocalization("noMessage"),id:"noinvalidateRegistrationButtonId"});
			var cancelButton  = new dj.form.Button({label:m.getLocalization("cancelMessage"),id:"cancelinvalidateRegistrationButtonId"});
			d.place(yesButtton.domNode,dialogButtons);
			d.place(noButton.domNode,dialogButtons);
			d.place(cancelButton.domNode,dialogButtons);
			dialog.attr("content", dialogContent);
		}
		var invReg = dj.byId("invalidateRegistrationDialog");
		//Set the Message into the Dialog
		if(d.byId("dialogInvRegText"))
		{
			d.byId("dialogInvRegText").innerHTML = m.getLocalization("invalidateRegistrationDialogText");
		}
		// Disable window closing by using the escape key
		m.dialog.connect(invReg, 'onKeyPress', function(evt) {
			if (evt.keyCode == d.keys.ESCAPE) {
				d.stopEvent(evt);
			}
		});
		//Dialog Connects
		m.dialog.connect(dj.byId('invalidateRegistrationButtonId'), 'onClick', function(){
			dj.byId("invalidate_payee").set('value','Y');
			invReg.hide();
			misys.submit(submitType);
		}, invReg.id);
		m.dialog.connect(dj.byId('noinvalidateRegistrationButtonId'), 'onClick', function(){
			dj.byId("invalidate_payee").set('value','N');
			invReg.hide();
			misys.submit(submitType);
		}, invReg.id);
		m.dialog.connect(dj.byId('cancelinvalidateRegistrationButtonId'), 'onClick', function(){
			invReg.hide();
		}, invReg.id);
		//On Hide of Dialog
		m.dialog.connect(invReg, 'onHide', function() {
			m.dialog.disconnect(invReg);
		});
		//Show the Dialog
		invReg.show();
	}
	function _validateInputIn(){
		// summary:
		//		validate the input in
		var input_in_type_1 = dj.byId("input_in_type_1" ),
		input_in_type_2 = dj.byId("input_in_type_2" );
		if (!input_in_type_1.get("checked") && !input_in_type_2.get("checked")){
			m.showTooltip(m.getLocalization("inputInMandatory"),
					input_in_type_1.domNode, ["before"]);
			return false;
		}
		return true;
	}
	
	function _validateFmt(){
		// summary:
		//		validate the validation format to check the input is a valid regular expression
		var bValid = true;
		var fmtFld = dj.byId("validation_format" );
		if (fmtFld){
			var fmt= fmtFld.get("value");
			if(fmt!== ""){
				
				try{
					var re = new RegExp(fmt);
				}
				catch(e){
					 console.debug("invalid regular expression");
						var displayMessage = m.getLocalization("invalidRegExpression");
						//focus on the widget and set state to error and display a tooltip indicating the same
						fmtFld.focus();
						fmtFld.set("state","Error");
						dijit.hideTooltip(fmtFld.domNode);
						dijit.showTooltip(displayMessage, fmtFld.domNode, 0);
						bValid =false;
					}
			}
		}
		return bValid;
	}
	
	function _validateRefId(){
		// summary:
		//		validate the refid 
		var isValid = true;
		// verify grid is present
		var refsGrid = dijit.byId('payee_refs_grid');
		var refInputFld = dj.byId("reference_id" );
		var refInput;
		if(refInputFld){
			refInput = refInputFld.get("value");
		}
		if (refsGrid) {
			// if it is multi data make sure that at least one data is there
			if (!refsGrid.grid) {
				isValid = true;
			} else {
				var storeId = refsGrid.dialog.storeId;
				refsGrid.grid.store.fetch({
					query : {
						reference_id : refInput
					},
					onComplete : function(items, request) {
						if (items.length > 0) {
							if (items.length >1 ) {
								isValid =false;
							}
							else{
								if(items[0].store_id != storeId){
									isValid =false;
								}
							}
						}
					}
				});
			}
			if (!isValid) {
				misys._config.onSubmitErrorMsg =
						misys.getLocalization('payeeRefExist', [refInput]);
				misys.showTooltip(misys.getLocalization('payeeRefExist', [refInput]),
						refInputFld.domNode);
			}
		}
		return isValid;
	}
	function _actionRegistrationReq(){
		
		if(m._config.isMultiBank){
			var check = _checkPerBankRegistration();
			if(check=== "N")
			{
			  dj.byId("reg_required").set("value", "N");
			  dj.byId("service_code").set("required", true);
			  dj.byId("service_name").set("required", true);
			  m.animate("fadeIn", d.byId("service_section"));
			}
		else {
			  dj.byId("reg_required").set("value", "");
			  dj.byId("service_code").set("value", "");
			  dj.byId("service_name").set("value", "");
			  dj.byId("local_service_name").set("value", "");
			  dj.byId("service_code").set("required", false);
			  dj.byId("service_name").set("required", false);
			  m.animate("fadeOut", d.byId("service_section"));
			}
		}
		else{
			var category = m._config.billp.registrationArr[dj.byId("payee_category").get("value")];
			if(category === "N")
				{
				  dj.byId("reg_required").set("value", "N");
				  dj.byId("service_code").set("required", true);
				  dj.byId("service_name").set("required", true);
				  m.animate("fadeIn", d.byId("service_section"));
				}
			else {
				  dj.byId("reg_required").set("value", "");
				  dj.byId("service_code").set("value", "");
				  dj.byId("service_name").set("value", "");
				  dj.byId("local_service_name").set("value", "");
				  dj.byId("service_code").set("required", false);
				  dj.byId("service_name").set("required", false);
				  m.animate("fadeOut", d.byId("service_section"));
				}
		}
		
	}
	
	function _checkPerBankRegistration(){
		var perBankCat =[];
		var cat;
		var bank = dj.byId("bank_abbv_name").get("value");
		var category = dj.byId("payee_category").get("value");
		dojo.forEach(misys._config.perBankPayeeCategoryRegistrationRequired[bank],function(value, key){
			perBankCat.push(value);
			});
			dojo.forEach(perBankCat,function(value, key){
				if(value.cat===category){
					console.log(value.reg);
					cat = value.reg;
				}
				});
			return cat;
	}
	
	function _populateCategory(){
		var payeeCategoryStore=null;
		dj.byId("payee_category").set("disabled",false);
		var payeeCategoryField = dj.byId("payee_category");
		var bankFieldName = dj.byId("bank_abbv_name")?dj.byId("bank_abbv_name").get("value"):"";
		if(dj.byId("payee_category").get("value")!=='')
			{
				dj.byId("payee_category").set("value",'');
			}
		if(dj.byId("bank_abbv_name")!=='')
			{
				payeeCategoryStore = misys._config.perBankPayeeCategory[bankFieldName];
			}
		if (payeeCategoryStore)
		{
			payeeCategoryField.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : payeeCategoryStore
				}
			});
			payeeCategoryField.fetchProperties =
			{
				sort : [
				{
					attribute : "name"
				} ]
			};
		}
	}
	
	function _checkPayeeName(){
		
		var pValid = true;
		if(dj.byId("payee_name"))
			{
		var payeename = dj.byId("payee_name").get("value");
		var n = payeename.length;
		if(n>35)
			  {
			     console.debug("invalid payee name");
			     var displayMessage = m.getLocalization("invalidPayeeName");
			//focus on the widget and set state to error and display a tooltip indicating the same
			     dj.byId("payee_name").focus();
			     dj.byId("payee_name").set("state","Error");
			    dijit.hideTooltip(dj.byId("payee_name").domNode);
			    dijit.showTooltip(displayMessage, dj.byId("payee_name").domNode, 0);
			    pValid = false;
			
			  }
			}
		return pValid;	
	}
	
	function _clearCommonFields(onLoad){
		if(!onLoad){
			if(dj.byId("service_code") && dj.byId("service_code").get("value")!==""){
				dj.byId("service_code").set("value","");
			}
			if(dj.byId("service_name") && dj.byId("service_name").get("value")!==""){
				dj.byId("service_name").set("value","");
			}
			if(dj.byId("local_service_name") && dj.byId("local_service_name").get("value")!==""){
				dj.byId("local_service_name").set("value","");
			}
			if(dj.byId("end_date") && dj.byId("end_date").get("value")!==""){
				dj.byId("end_date").set("value",null);
			}
			if(dj.byId("base_cur_code") && dj.byId("base_cur_code").get("value")!==""){
				dj.byId("base_cur_code").set("value","");
			}
			if(dj.byId("samp_bill_path") && dj.byId("samp_bill_path").get("value")!==""){
				dj.byId("samp_bill_path").set("value","");
			}
			if(dj.byId("additional_Info") && dj.byId("additional_Info").get("value")!==""){
				dj.byId("additional_Info").set("value","");
			}
			if(dj.byId("local_additional_Info") && dj.byId("local_additional_Info").get("value")!==""){
				dj.byId("local_additional_Info").set("value","");
			}
			if(dj.byId("description") && dj.byId("description").get("value")!==""){
				dj.byId("description").set("value", "");
			}
			if(dj.byId("local_description") && dj.byId("local_description").get("value")!==""){
				dj.byId("local_description").set("value", "");
			}
			if(dj.byId("payee_refs_grid").store && dj.byId("payee_refs_grid").store._arrayOfAllItems.length>0)
			{
				for (var i = 0, length = dj.byId("payee_refs_grid").store._arrayOfAllItems.length ; i <length ; i++ ){
					var currentObject = dj.byId("payee_refs_grid").store._arrayOfAllItems[i];
					dj.byId("payee_refs_grid").store.deleteItem(currentObject);
				}
				dj.byId("payee_refs_grid").store._arrayOfAllItems.length=0;
				dj.byId("payee_refs_grid").store.close();
				dj.byId("payee_refs_grid").store.fetch();
			}
		}
	}
	//
	// Public functions & variables
	//
	d.mixin(m, {
		bind : function(){
			m.setValidation("base_cur_code", m.validateCurrency);
			m.setValidation("payee_code",m.checkNumericOnlyValue);
			m.setValidation("reference_id",m.checkNumericOnlyValue);
			m.connect("end_date","onClick", function(){
				if(misys._config.isMultiBank){
					var customer_bank;
					if(dijit.byId("bank_abbv_name"))
					{
						customer_bank = dijit.byId("bank_abbv_name").get("value");
					}
					if(customer_bank !== '' && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
					{
						var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
						var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
						var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
						this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
					}
				}
			});
			
			m.connect("bank_abbv_name", "onChange", function(){
				dj.byId("payee_category").set("value","");
				dj.byId("payee_category").store ="";
				_clearCommonFields(onFormLoad);
				_populateCategory();
				if(m._config.currencyCodes && m._config.currencyCodes.length !==0){
					m._config.currencyCodes = [];
				}
				onFormLoad = false;
			});
			m.setValidation('end_date',m.validateEndDateWithCurrentDate);
			m.connect("payee_category", "onChange", function(){
				_actionRegistrationReq();
				_clearCommonFields(onFormLoad);
				onFormLoad = false;
			});
			m.connect("payee_name", "onBlur", _checkPayeeName);
			m.connect("field_type_1", "onChange", function(){
				if(dj.byId("field_type_1").get("checked"))
				{
					m.animate('fadeOut', "format_div", function(){});
				}
			});
			m.connect("field_type_2", "onChange", function(){
				if(dj.byId("field_type_2").get("checked"))
				{
					m.animate('fadeIn', "format_div", function(){});
				}
			});
			m.connect("payee_category","onChange",function(){
				if(dj.byId("payee_category").get("value")!==''){
					if(dj.byId("dijit_form_Button_1")){
						dj.byId("dijit_form_Button_1").set("disabled", false);
					}
				}
				else{
					dj.byId("dijit_form_Button_1").set("disabled", false);
				}
			});
			m.connect("end_date", "onChange", m.validateEndDateWithCurrentDate);
			
			if (dijit.byId('approveButton')){
				dijit.byId('approveButton').set('onClick', 
						function()
						{
							_fncSaveMasterPayee("APPROVE");
						}
				);
			}
		},
		onFormLoad : function() {
			
			/*_populateCategory();*/
			if(misys._config.isMultiBank){
				if(dj.byId("bank_abbv_name") && dj.byId("payee_category") && dj.byId("bank_abbv_name").get("value")==="")
					{
						dj.byId("payee_category").set("disabled", true);
					}
				else if(dj.byId("bank_abbv_name") && dj.byId("payee_category") && dj.byId("bank_abbv_name").get("value")!=="")
				{
					_populateCategory();
					dj.byId("payee_category").set("disabled", false);
					dj.byId("payee_category").set("value",dj.byId("payee_category_hidden").get("value"));
					_actionRegistrationReq();
				}
			}
			_actionRegistrationReq();
			m.setValidation("base_cur_code", m.validateCurrency);
			m.setValidation("service_code", m.checkNumericOnlyValue);
			m.setValidation('end_date',m.validateEndDateWithCurrentDate);
			// modify onclick for submit button
			if (dijit.byId('sySubmitButton')){
				dijit.byId('sySubmitButton').set('onClick', 
						function()
						{
							_fncSaveMasterPayee("SUBMIT");
						}
				);
			}
			if(dj.byId("payee_category")  && dj.byId("payee_category").get("value")==='')
				{
				dj.byId("dijit_form_Button_1").set("disabled", true);
				}
		}
	});
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {
		submitPayeeRef : function( /*String*/ dialogId) {
			var dialog = dj.byId(dialogId);
			if(dialog && dialog.validate() && _validateInputIn() && _validateRefId()&& _validateFmt()) {
				dialog.execute();
				dialog.hide();
			}
		}
	});	
	m._config = m._config || {};
	d.mixin(m, { 
		beforeSubmitValidations:function() {
			var isValid = true;
			// verify grid is present
			var refsGrid = dijit.byId('payee_refs_grid');
			if (refsGrid) {
				// if it is multi data make sure that at least one data is there
				if (!refsGrid.grid) {
					isValid = false;
				} else {
					refsGrid.grid.store.fetch({
						query : {
							store_id : '*'
						},
						onComplete : function(items, request) {
							if (items.length < 1 || items.length > 5) {
								isValid = false;
							}
						}
					});
				}
				if (!isValid) {
					misys._config.onSubmitErrorMsg =
							misys.getLocalization('noOfPayeeRef');
					refsGrid.invalidMessage = misys.getLocalization('noOfPayeeRef');
				}
			}
			if(dj.byId("end_date") && dj.byId("current_date")){
				var dateError = false;
				var today = new Date();
				var endDate = dj.byId("end_date");
				if(d.date.compare(today, endDate.get('value'))===1){
					today = today.getDate()+'/'+today.getMonth()+1+'/'+today.getFullYear();
					var msg = m.getLocalization('endDateSmallerThanCurrentDate', [endDate.get('displayedValue')]);
					endDate.set("state", "Error");
					dj.hideTooltip(endDate.domNode);
					dj.showTooltip(msg, endDate.domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(endDate.domNode);
					};
					setTimeout(hideTT, 5000);
					dateError= true;
				}
			}
			if(!dateError){
				return isValid;
			}
		}
	});
	d.ready(function(){
		d.require("misys.system.widget.PayeeRef");
		d.require("misys.system.widget.PayeeRefs");
	});
})(dojo, dijit, misys);

//Including the client specific implementation
       dojo.require('misys.client.binding.system.master_payee_client');