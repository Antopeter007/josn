dojo.provide("misys.binding.cash.common.standing_instruction_action");
/*
 * -----------------------------------------------------------------------------
 * Scripts for
 * 
 * StandingInstruction Common
 * 
 * 
 * Copyright (c) 2000-2010 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 author: Pillon Gauthier date: 12/20/10
 * -----------------------------------------------------------------------------
 */
dojo.require("misys.grid.EnhancedGrid");
dojo.require("misys.binding.cash.opics.si_popup_management");

(function(/* Dojo */ d, /* Dijit */ dj, /* Misys */ m) {
	
	"use strict"; // ECMA5 Strict Mode

	// Private functions and variables
	
	var customerItems;
	
	/** ********** Public Function ************************ */
	
	d.mixin(m, {
	
		/**
		 * Clear table (input & radio button).
		 */
		_fncClearTable : function(/* String */idTable)
		{	
			// clear table
			d.query("#"+idTable+" .dojoxGridRowSelector").forEach(
				    function(tag){
				    	d.removeClass(tag, "dijitRadioChecked");
				    });
			d.query("#"+idTable+" .dojoxGridRowSelected").forEach(
				    function(tag){
				    	d.removeClass(tag, "dojoxGridRowSelected");
				    	// dj.byId(tag.id).set("required", false);
				    });
			// With out this null check the Edit transaction screen fore wire does
			// not display.
			if(dj.byId(idTable)){
				dj.byId(idTable).selection.clear() ;
			}
		},
		
		_fncConnectSSIFields : function(/*prefix*/ prefix)
		{
			
			m.connect("intermediary_bank", "onChange", function(){ m._fncChangeIntermediaryRequiredFieldsOnChange(prefix);});
			m.connect("intermediary_bank_city", "onChange", function(){ m._fncChangeIntermediaryRequiredFieldsOnChange(prefix);});
			m.connect("intermediary_bank_country", "onChange", function(){ m._fncChangeIntermediaryRequiredFieldsOnChange(prefix);});
			m.connect("intermediary_bank_street", "onChange", function(){ m._fncChangeIntermediaryRequiredFieldsOnChange(prefix);});
			m.connect("intermediary_bank_instruction_1", "onChange", function(){ m._fncCheckSpecialRoutingInstructionFields(prefix);});
			m.connect("intermediary_bank_instruction_2", "onChange", function(){ m._fncCheckSpecialRoutingInstructionFields(prefix);});
			m.connect("intermediary_bank_instruction_3", "onChange", function(){ m._fncCheckSpecialRoutingInstructionFields(prefix);});
			m.connect("intermediary_bank_instruction_4", "onChange", function(){ m._fncCheckSpecialRoutingInstructionFields(prefix);});
			m.connect("intermediary_bank_instruction_5", "onChange", function(){ m._fncCheckSpecialRoutingInstructionFields(prefix);});
			m.connect("intermediary_bank_instruction_6", "onChange", function(){ m._fncCheckSpecialRoutingInstructionFields(prefix);});
			m.connect("free_additional_details_line_1_input", "onChange", function(){ m._fncCheckPaymentDetailsFields(prefix);});
			m.connect("free_additional_details_line_2_input", "onChange", function(){ m._fncCheckPaymentDetailsFields(prefix);});
			m.connect("free_additional_details_line_3_input", "onChange", function(){ m._fncCheckPaymentDetailsFields(prefix);});
			m.connect("free_additional_details_line_4_input", "onChange", function(){ m._fncCheckPaymentDetailsFields(prefix);});	
		},
		
		_fncCheckSpecialRoutingInstructionFields : function(/* String */ prefix){
			/*
			 * This functions set as required the routing instuction fields.
			 * Fields are marked as required if a field which the name has a lower index
			 * is empty whereas a field with a greater index is populated.
			 * 
			 */
			var instructionFieldName =  prefix + "intermediary_bank_instruction_";
			var instructionFieldsNameArray = [];
			var i = 1;
			// first field name
			var lastInputIndex = instructionFieldName + i;
			// Populate the array of instruction fields name
			// currently, there are 6
			for (i= 1; i <= 6; i++)
			{
				instructionFieldsNameArray.push(instructionFieldName + i);
				// keep the last input field name
				if (dj.byId(instructionFieldName + i).get("value") !== ""){
					lastInputIndex = instructionFieldName + i;
				}
			}
			// Go through all fields and set their state
			d.forEach(instructionFieldsNameArray, function (instructionFieldName, i){
				var instructionField = dj.byId(instructionFieldName);
				var anInstruction = instructionField.get("value");
				if (anInstruction === "" && instructionFieldName < lastInputIndex)
				{
					instructionField.set("required", true);			
				}
				else
				{
					instructionField.set("required", false);
				}
			});
		},
		
		_fncCheckPaymentDetailsFields : function(/* String */ prefix){
			/*
			 * This functions set as required the payment details fields.
			 * Fields are marked as required if a field which the name has a lower index
			 * is empty whereas a field with a greater index is populated.
			 * 
			 */
			var paymentDetailsFieldsNameArray = [prefix + "free_additional_details_line_1_input",prefix +  "free_additional_details_line_2_input",prefix +  "free_additional_details_line_3_input",prefix + "free_additional_details_line_4_input"];
			// first field name
			var lastInputIndex = paymentDetailsFieldsNameArray[0];
			// Populate the array of instruction fields name
			// currently, there are 6
			d.forEach(paymentDetailsFieldsNameArray, function(paymentDetailsFieldName){
				// keep the last input field name
				if (dj.byId(paymentDetailsFieldName).get("value") !== ""){
					lastInputIndex = paymentDetailsFieldName;
				}
			});
			// Go through all fields and set their state
			d.forEach(paymentDetailsFieldsNameArray, function(paymentDetailsFieldName, i){
				var aPaymentDetailsField = dj.byId(paymentDetailsFieldName);
				var aPaymentDetails = aPaymentDetailsField.get("value");
				if (aPaymentDetails === "" && paymentDetailsFieldName < lastInputIndex){
					aPaymentDetailsField.set("required", true);			
				}
				else{
					aPaymentDetailsField.set("required", false);
				}
			});
		},
	
		_fncDisplayStoredBankInstruction : function(/* String */ prefix){
			
			var prefix_name=prefix;
			if (prefix_name != null && prefix_name !== ""){
				prefix_name=prefix_name+"_";
			}else
			{
				prefix_name="";
			}
			
			var bankIndicator = dj.byId(prefix_name + "bank_instruction_indicator").get("value"); 
			var freeFormatIndicator = dj.byId(prefix_name + "beneficiary_name").get("value"); 
	
			console.debug("[DEBUG] "+ prefix_name + "bankIndicator-[" + bankIndicator + "] "+ prefix_name + "freeformatIndicator-[" + freeFormatIndicator+"]");
			
			/*
			 * Determine what was previously stored and set screen to display this information.
			 */
				
				// if instructions previously stored, either bank or freeformat
				if(bankIndicator != null && bankIndicator !== ""){
					// bank instructions stored - display
					console.debug("[DEBUG] Display stored "+ prefix_name + "Bank instruction");
					d.style(prefix_name + "bank_instruction_field",{"display":"block"});
					d.style(prefix_name + "free_format_field",{"display":"none"});
					dj.byId(prefix_name + "instructions_type_1").set("checked", true);
					dj.byId(prefix_name + "instructions_type_2").set("checked", false);
				}
				else if(freeFormatIndicator != null && freeFormatIndicator !== ""){
					// free format is stored, displayed.
					console.debug("[DEBUG] Display stored "+ prefix_name + "Free Format instruction");
					d.style(prefix_name + "bank_instruction_field",{"display":"none"});
					d.style(prefix_name + "free_format_field",{"display":"block"});
					dj.byId(prefix_name + "instructions_type_1").set("checked", false);
					dj.byId(prefix_name + "instructions_type_2").set("checked", true);
					m.fncfreeformatbeneficiary(prefix);		
				}	
				else{
				//no details stored previosuly
				console.debug("[DEBUG] No instructions previously stored. Display default");
				d.style(prefix_name + "bank_instruction_field",{"display":"block"});
				d.style(prefix_name + "free_format_field",{"display":"none"});
				dj.byId(prefix_name + "instructions_type_1").set("checked", true);
				dj.byId(prefix_name + "instructions_type_2").set("checked", false);
			}
		},
		
		
		/**
		 * Action linked to the selection of instruction type. Switch displayed
		 * fields.
		 */
		_fncSwitchBankPaymentInstructionsFields : function(/* String */ fieldToShow, /* String */ fieldToHide,/* String */ fieldToHide2,/* String */ fieldToHide3,/* String */ fieldToHide4, /* String */ idRadioButton, /* String */ prefix)
		{
			var prefix_name=prefix;
			if (prefix_name != null && prefix_name !== ""){
				prefix_name=prefix_name+"_";
			}else
			{
				prefix_name="";
			}
			
			
			// in case where the fieldToShow is already displayed
			if (d.style(prefix_name+fieldToShow,"display") === "block" && d.style(prefix_name+fieldToHide,"display") === "none"){
				return;
			}
			// open a modal dialog
			m.dialog.show("CONFIRMATION",
					m.getLocalization("clearMessage"),"",
					// in case of ok
					function(){
						if(fieldToHide2 != null && fieldToHide3 != null && fieldToHide4 != null){
							d.style(prefix_name+fieldToHide2,{"display":"block"});
							d.style(prefix_name+fieldToHide3,{"display":"none"});
							d.style(prefix_name+fieldToHide4,{"display":"none"});						
						}
						m.animate("fadeOut", d.byId(prefix_name+fieldToHide));
						// clear fields
						if (prefix==null){prefix="";}
						var action = 0;
						if(fieldToHide === "bank_instruction_field"){action = 2;}
						else if(fieldToHide === "free_format_field"){action = 3;}
						m.performClear(prefix,action, false);
						// switch shown fields
						m.animate("fadeIn", d.byId(prefix_name+fieldToShow));
						//re-render grid
						if(fieldToShow === "bank_instruction_field"){
							dj.byId(prefix_name+"bankPaymentGrid").resize();
						}
						// changed required fields
						m._fncChangePaymentTypeRequired(fieldToShow, fieldToHide,prefix);
					},
					function(){
						// Has to be a global event; otherwise it gets removed too
						// early to fire
						m.connect(dj.byId("cancelButton"), "onClick", function(){
							dj.byId(idRadioButton).set("checked", true);
						});
					}
			);
		},
	
		fncfreeformataddlinstructions : function(/* String */ prefix){
			var prefix_name=prefix;
			if (prefix_name != null && prefix_name !== ""){
				prefix_name=prefix_name+"_";
			}else
			{
				prefix_name="";
			}
	
			d.style(prefix_name+"freeformatbeneficiary",{"display":"block"});
			d.style(prefix_name+"freeformataddlinstructions",{"display":"block"});
			d.style(prefix_name+"freeformatpaymentdetails",{"display":"block"});
		},
		
		fncfreeformatpaymentdetails : function(/* String */ prefix){
			var prefix_name=prefix;
			if (prefix_name != null && prefix_name !== ""){
				prefix_name=prefix_name+"_";
			}else
			{
				prefix_name="";
			}
	
			d.style(prefix_name+"freeformatbeneficiary",{"display":"block"});
			d.style(prefix_name+"freeformataddlinstructions",{"display":"block"});
			d.style(prefix_name+"freeformatpaymentdetails",{"display":"block"});
		},
		
		fncfreeformatbeneficiary : function(/* String */ prefix){
			var prefix_name=prefix;
			if (prefix_name != null && prefix_name !== ""){
				prefix_name=prefix_name+"_";
			}else
			{
				prefix_name="";
			}
	
			d.style(prefix_name+"freeformatbeneficiary",{"display":"block"});
			d.style(prefix_name+"freeformataddlinstructions",{"display":"block"});
			d.style(prefix_name+"freeformatpaymentdetails",{"display":"block"});
		},
		
		_fncChangePaymentTypeRequired : function(/* String */ fieldToShow, /* String */ fieldToHide,/* String */prefix)
		{
			var prefix_name=prefix;
			if (prefix_name != null && prefix_name !== ""){
				prefix_name = prefix_name+"_";
			}else
			{
				prefix_name="";
			}
			
			if("free_format_field" === fieldToShow)
			{
				m.toggleRequired(prefix_name+"payment_type",true);
				// dj.byId("payment_type").set("required", true);
				m.changeRequiredFieldsOnPaymentTypeChange(prefix);
			}
			if("bank_instruction_field" === fieldToShow)
			{
				m.toggleRequired(prefix_name+"payment_type",false);
				// dj.byId("payment_type").set("required", false);
				m.changeRequiredFieldsOnPaymentTypeChange(prefix);
			}
		},
		
		/**
		 * 
		 */
		_fncRemoveRequiredOnFields : function(/* String */tableDivId){
			d.query("#"+tableDivId+" input[aria-required=true]").forEach(function(field){dj.byId(dj.byId(field).id).set("required", false);});
		},
		
		/**
		 * Function changing required fields according non-empty field.
		 */
		_fncChangeRequiredFieldsOnChange : function(/* String */provadingField, /* String */ prefix){
			if (prefix != null && prefix !== ""){
				prefix=prefix+"_";
			}else
			{
				prefix="";
			}
			var provadingFieldValue = dj.byId(provadingField).get("value");
			// var paymentTypeValue =
			// dj.byId(prefix+"payment_type").get("displayedValue");
			var paymentTypeValue = dj.byId(prefix+"payment_type").get("value");
			var fields;
			var required;
			
			if(prefix+"beneficiary_account" === provadingField)
			{
				fields = [prefix+"beneficiary_address", prefix+"beneficiary_city", prefix+"beneficiary_country"];
				if(provadingFieldValue === "")
				{
					required = false;
				}
				// else if(paymentTypeValue === "Wire")
				else if(paymentTypeValue === "01")
				{
					required = true;
				}
				
			}
			
			else if(prefix+"beneficiary_address" === provadingField)
			{
				fields = [prefix+"beneficiary_account"];
				if(provadingFieldValue === "")
				{
					required = false;
				}
				// else if(paymentTypeValue === "Wire")
				else if(paymentTypeValue === "01")
				{
					required = true;
				}
			}		
		},
		
		_fncChangeIntermediaryRequiredFieldsOnChange : function( /* String */ prefix){
		
			var EmptyListfield = [prefix+"intermediary_bank",prefix+"intermediary_bank_street", prefix+"intermediary_bank_city", prefix+"intermediary_bank_country"];
			
			var required = false;
			var fields = [prefix+"intermediary_bank", prefix+"intermediary_bank_city", prefix+"intermediary_bank_country"];
			
			d.forEach(EmptyListfield, function(Emptyfield){
			
				if(dj.byId(Emptyfield).get("value") !== ""){
					required = true;
				}
			});
			d.forEach(fields, function(field){dj.byId(field).set("required", required);});
		},
	
		_fncChangeDisabledAdditionalDetailsFiels : function(/* String */ additionalDetailLineId, /* boolean */ disabled){
			if(dj.byId(additionalDetailLineId+"_line_1_input"))
			{
				dj.byId(additionalDetailLineId+"_line_1_input").set("disabled", disabled);
			}
			if(dj.byId(additionalDetailLineId+"_line_2_input"))
			{
				dj.byId(additionalDetailLineId+"_line_2_input").set("disabled", disabled);
			}
			if(dj.byId(additionalDetailLineId+"_line_3_input"))
			{
				dj.byId(additionalDetailLineId+"_line_3_input").set("disabled", disabled);
			}
			if(dj.byId(additionalDetailLineId+"_line_4_input"))
			{
				dj.byId(additionalDetailLineId+"_line_4_input").set("disabled", disabled);			
			} 
		},
	
	
		//_fncConstructCustomerPaymentGrid : function(/* JSON */ json, /* String */ idTab, /* String */IdHiddenField,/* String */prefix)
		//{
		//	_fncConstructCustomerPaymentGrid(json, idTab, IdHiddentField, prefix, null);
		//},
		
		_fncConstructCustomerPaymentGrid : function(/* JSON */ json, /* String */ idTab, /* String */IdHiddenField,/* String */prefix,  /* String */ selectedId)
		{
			var grid;
			
			if (prefix != null && prefix !== ""){
				prefix=prefix+"_";
			}
			else 
			{
				prefix="";
			}
			var store = new d.data.ItemFileReadStore({data:json});
			// set the layout structure:
			var layout = [{field: "currency",name: "Ccy",width: "50px"},
			              {field: "account",name: "Account",width: "100px", center: "true"},
			              {field: "instruction_indicator",name: "Instruction ID",width: "auto"}];
			// create a new grid:
			grid = new misys.grid.EnhancedGrid({
				query: {
					id: "*"
						},
				store: store,
				id: idTab,
				name: idTab,
				structure: layout,
				height: "100px",
				noDataMessage: "No Instructions Found",
				xmlTagName: prefix+"customer_payment",
				onSelected: function(inRowIndex){
					customerItems = grid.selection.getSelected();
					m.selectIndex(inRowIndex, idTab, IdHiddenField);
					var xml = grid.toXML();
				},
				plugins: {
					indirectSelection:{
						name: "Select",
						width: "50px",
						styles: "text-align: center;"
					}
				},
				selectionMode: "single"
			},
			document.createElement("div"));
			// append the new grid to the div "gridContainer":
			d.byId(prefix+"customerPayment").appendChild(grid.domNode);
	
			// Call startup, in order to render the grid:
			grid.startup();
		},
	
		//function _fncConstructBankPaymentGrid(/* JSON */ json, /* String */ idTab, /* String */IdHiddenField,/* String */prefix)
		//{
		//	return _fncConstructBankPaymentGrid(json, idTab, IdHiddentField, prefix, null);
		//}
		
		_fncConstructBankPaymentGrid : function(/* JSON */ json, /* String */ idTab, /* String */IdHiddenField,/* String */prefix,  /* String */ selectedId)
		{
			var grid;	
			
			if (prefix != null && prefix !== ""){
				prefix=prefix+"_";
			}
			else 
			{
				prefix="";
			}
					
			var store = new d.data.ItemFileReadStore({data:json});
			// set the layout structure:
			var layout = [{field: "currency",name: "Ccy",width: "4%"},
			              {field: "account",name: "Account",width: "15%"},
			              {field: "instruction_indicator",name: "Instruction ID", "text-align": "center", width: "10%"},
			              {field: "beneficiary_institution",name: "Beneficiary",width: "15%"},
			              {field: "beneficiary_bank_bic",name: "Beneficiary Swift ID",width: "10%"},
			              {field: "beneficiary_account",name: "Beneficiary Account",width: "15%"},
			              {field: "institution_account",name: "Beneficiary Bank",width: "15%"},
			              {field: "account_with_institution_BIC",name: "Beneficiary Bank SWIFT ID",width: "12%"},
			              {field: "action_link",name: " ",width: "4%",formatter: function(value) { 
			                  return "<img src= '" + misys.getContextualURL("content/images/preview.png") + "'//>";}}];
	
			// create a new grid:
			if(!dj.byId(prefix+"bankPaymentGrid"))
			{
				d.style(prefix+"bankPayment",{"display":"block"});		
				grid = new misys.grid.EnhancedGrid({
					query: {
						id: "*"
					},
					store: store,
					id: idTab,
					name: idTab,
					structure: layout,
					rowsPerPage: 500, 
					height: "170px",
					noDataMessage: "No Instructions Found",
					xmlTagName: prefix+"bank_payment",
					onSelected: function(inRowIndex){ m._selectIndex(inRowIndex, idTab, IdHiddenField, prefix);
					var xml = grid.toXML();},
					plugins: {
						indirectSelection:{
							name: "Select",
							width: "50px",
							styles: "text-align: center;"
						}
					},
					selectionMode: "single"
				},
				document.createElement("div"));
				// append the new grid to the div "gridContainer":
	
				d.byId(prefix+"bankPayment").appendChild(grid.domNode);
				
				d.connect(grid, "onRowClick", grid, function(evt){ 
					var idx = evt.rowIndex,
						colField = evt.cell.field, 
			    		item = this.getItem(idx);
					
					if (colField === "action_link") {
						// console.info("[INFO] SI grid clicked, row " + idx + ",col
						// " + colField);
						// display the Standing Instruction Information pane
						m.showSiDialog(item, prefix);
					}
				});
				
				// Call startup, in order to render the grid:
				grid.startup();
			}
			else
			{
				d.style(prefix+"bankPayment",{"display":"block"});		
				m._fncClearTable(prefix+"bankPaymentGrid");
				grid =  dj.byId(prefix+"bankPaymentGrid");
				d.byId(prefix+"bankPayment").appendChild(grid.domNode);
	            grid.setStore(store);
	
				// Call startup, in order to render the grid:
				grid.startup();
			}
			
			return grid;
	
		},
		
		
		_fncSetGridSelectedId : function(/* gridId */ gridId, /* String */ selectedId)
		{	
			if(gridId != null && selectedId != null){
				
			var grid = dj.byId(gridId);		
			
				// set the grid with id checked
				if(selectedId != null){
					var rowIdx = 0;
					var len = grid.get("store")._arrayOfTopLevelItems.length;
	
					// if instruction is complete and un-editable, select (option disable the grid)
					if ((len === 1) && (grid.get("store")._arrayOfTopLevelItems[0].instruction_indicator == m.getLocalization("instructionComplete"))) {
						grid.selection.select(0);
					}
					else {
						for(var i = 0; i < len; i++)
						{
							rowIdx++;
							if(grid.get("store")._arrayOfTopLevelItems[i].instruction_indicator == selectedId)
							{
									grid.scrollToRow(rowIdx-1);
									grid.selection.select(rowIdx-1+"");
							}
						}
					}
				}
			}
		},	
	
		_selectIndex : function( /* Number */ inRowIndex, idTab, IdHiddenField, prefix){
			/*
			 * console.debug("[INFO] Using function _selectIndex."); var
			 * rowSelected;
			 * 
			 * if (dj.byId("bankPaymentGrid")) { rowSelected =
			 * dj.byId(prefix+"bankPaymentGrid").get("store")._arrayOfAllItems[inRowIndex]; }
			 * else { var rowsSelected =
			 * dj.byId(prefix+"bankPaymentGrid").selection.getSelected();
			 * 
			 * if (rowsSelected.length) { dojo.forEach(rowsSelected,
			 * function(selectedItem){ if(selectedItem != null){ rowSelected =
			 * selectedItem; } }); } }
			 */
			return m.selectIndex(inRowIndex, idTab, IdHiddenField);
		},
	

		/**
		 * Clear fields : _ action "1": clear customer payment instructions
		 * table _ action "2": clear Bank Payment Instructions - Bank
		 * Instructions _ action "3": clear Bank Payment Instructions - free
		 * format instructions _ action "4": clear near customer payment
		 * instructions table _ action "5": clear near Bank Payment Instructions -
		 * Bank Instructions _ action "6": clear near Bank Payment Instructions -
		 * free format instructions
		 */
		performClear : function(/* String */ prefix, /* int */action, /* boolean */notRemoveRequired)
		{
			if (prefix != null && prefix !== ""){
				prefix=prefix+"_";
			}else
			{
				prefix="";
			}
			
			var fieldToClear;
			if (action === 1)
			{
				m._fncClearTable(prefix+"customerPaymentGrid");
				dj.byId(prefix+"payment_instructions_id").set("value", "");
			}
			else if (action === 2)
			{
				m._fncClearTable(prefix+"bankPaymentGrid");
				dj.byId(prefix+"receipt_instructions_id").set("value", "");
				fieldToClear = d.query("#"+prefix+"bank_instruction_field .dijitInputContainer input");
				m._fncChangeDisabledAdditionalDetailsFiels(prefix+"additional_details", true);
			}
			else if (action === 3)
			{
				if(!notRemoveRequired){ m._fncRemoveRequiredOnFields(prefix+"free_format_field");}
				fieldToClear = d.query("#"+prefix+"free_format_field .dijitInputContainer input");
			}

			d.forEach(fieldToClear, function(field){
				
				// do not clear default value of Payment CCY/ Payment Amount
				// /Payment Type
				if (!(field.id.match("payment_cur") != null ||field.id.match("payment_amt") != null ||field.id.match("payment_type") != null)){
					field.value = "";	
				}
				
				if(field.id === ("beneficiary_bank_bic")  || field.id === ("beneficiary_bank") ||
						field.id === ("beneficiary_bank_branch") || field.id === ("beneficiary_bank_address") ||
						field.id === ("beneficiary_bank_city") || field.id === ("beneficiary_bank_country") ||
						field.id === ("intermediary_bank_bic") || field.id === ("intermediary_bank") ||
						field.id === ("intermediary_bank_street") || field.id === ("intermediary_bank_city") ||
						field.id === ("intermediary_bank_country"))
					{
						dj.byId(field.id).set('disabled', false);
					}
				
				if(field.id === ("beneficiary_bank_bic")   ||
						field.id === ("beneficiary_bank_branch") || field.id === ("beneficiary_bank_address") ||
						field.id === ("intermediary_bank_bic") || field.id === ("intermediary_bank") ||
						field.id === ("intermediary_bank_street") || field.id === ("intermediary_bank_city") ||
						field.id === ("intermediary_bank_country"))
					{
						m.toggleRequired(field.id, false);
					}
				
				if( field.id === ("beneficiary_bank") || field.id === ("beneficiary_bank_city") || 
						field.id === ("beneficiary_bank_country"))
				{
					m.toggleRequired(field.id, true);
				}
				
				if (!dj.byId("swift_charges_type_1").checked)
					{
						dj.byId("swift_charges_type_1").set('checked', true);
					}
			});
			
		},
		selectIndex : function(){
			console.debug("[INFO] Using default function selectIndex. This method has to be overloaded.");
			return [];
		},
	
		/**
		 * Function changing required fields according selected payment-type.
		 */

		changeRequiredFieldsOnPaymentTypeChange : function(/* String */ prefix,/* boolean */ bankSelected)
		{
			if (prefix != null && prefix !== ""){
				prefix=prefix+"_";
			}else
			{
				prefix="";
			}
			var noRequiredFields;
			var requiredFields;
			// This change was made to fix the artifact - artf1005584 - To
			// remove the draft payment type
			var valueSelected = dj.byId(prefix+"payment_type").get("value");
			if("01" === valueSelected && !bankSelected)
			{
				noRequiredFields = []; 
				if(document.getElementById("instructions_type_1") && dj.byId("instructions_type_1").checked) {
					requiredFields = []; 
					noRequiredFields = [prefix+"beneficiary_name",prefix+"beneficiary_bank", prefix+"beneficiary_bank_city", prefix+"beneficiary_bank_country", prefix+"beneficiary_address", prefix+"beneficiary_city", prefix+"beneficiary_country", prefix+"beneficiary_account",prefix+"beneficiary_address_2"];
				}
				else
				{
					requiredFields = [prefix+"beneficiary_name",prefix+"beneficiary_bank", prefix+"beneficiary_bank_city", prefix+"beneficiary_bank_country", prefix+"beneficiary_address", prefix+"beneficiary_city", prefix+"beneficiary_country", prefix+"beneficiary_account"];
				}
				
//				if(dj.byId(prefix+"intermediary_bank") != null && dj.byId(prefix+"intermediary_bank").get("value") !== "")
//				{
//					requiredFields.push(prefix+"intermediary_bank_city", prefix+"intermediary_bank_country");
//				}
			}
			else if("02" === valueSelected && !bankSelected)
			{
				noRequiredFields = [prefix+"beneficiary_bank", prefix+"beneficiary_bank_city", prefix+"beneficiary_bank_country"];
				requiredFields = [prefix+"beneficiary_name", prefix+"beneficiary_address", prefix+"beneficiary_city", prefix+"beneficiary_country"];
				// in case where other fields are required according to
				// paymentType value
//				if(dj.byId(prefix+"intermediary_bank") != null && dj.byId(prefix+"intermediary_bank").get("value") !== "")
//				{
//					requiredFields.push(prefix+"intermediary_bank_city", prefix+"intermediary_bank_country");
//				}
			}
			else
			{
				noRequiredFields = [prefix+"beneficiary_name",prefix+"beneficiary_bank", prefix+"beneficiary_bank_city", prefix+"beneficiary_bank_country",
						prefix+"beneficiary_address", prefix+"beneficiary_city", prefix+"beneficiary_country", prefix+"beneficiary_account"];
			}
			
			/*
			 * d.forEach(noRequiredFields,
			 * function(field){dj.byId(field).set("required", false);});
			 * d.forEach(requiredFields,
			 * function(field){dj.byId(field).set("required", true);});
			 */
			d.forEach(noRequiredFields, function(field){m.toggleRequired(field,false);});
			d.forEach(requiredFields, function(field){m.toggleRequired(field,true);});
			
		},
		
		
		/*
		 * Toggle the beneficiary fields to disable/enable
		 * Set Required/not Required accordingly		
		 */
		toggleBeneficiaryFields : function(bicCode, prefix,imgId,isRequired){
			var arr = ["_bank", "_bank_branch", "_bank_address", "_bank_city","_bank_country","_bank_street","_bank_street_2"];
			var beneId;
			if(bicCode !== ''){
				for	(var index = 0; index < arr.length; index++) {
				    beneId = prefix+arr[index];				    
				    if(dj.byId(beneId)) {				   
					    dj.byId(beneId).set('required', false);
						dj.byId(beneId).set('disabled', true);
						dj.byId(beneId).set('value','');
						d.query('#'+beneId+"_row label span").style("display", "none");
						d.query('#'+imgId).style("display", "none");
				    }
				} 
			}
			else{
				for	(index = 0; index < arr.length; index++) {
					beneId = prefix+arr[index];				    
				    if(dj.byId(beneId)) {
					    if(isRequired){
				    		 dj.byId(beneId).set('required', true);
				    	}
						dj.byId(beneId).set('disabled', false);
						var selector = '#'+beneId+"_row label span";
						d.query('#'+beneId+"_row label span").style("display", "inline-block");
						d.query('#'+imgId).style("display", "inline-block");
				    }
				} 
			}
			
			var noRequiredFields = ["beneficiary_bank_branch", "beneficiary_bank_address"];
			d.forEach(noRequiredFields, function(field){m.toggleRequired(field,false);});
		},
		
		
		
		
		/*
		 * Toggle the BIC fields to disable/enable
		 * Set Required/not Required accordingly		
		 */
		toggleBICFields : function(bankInp, field){
			if(bankInp !== ''){					    
			    if(dj.byId(field)) {
					dj.byId(field).set('disabled', true);
					dj.byId(field).set('value','');
					 m.toggleRequired(field,false);
			    }
			}
			else{			    
			    if(dj.byId(field)) {
				    dj.byId(field).set('disabled', false);
				    m.toggleRequired(field,true);
			    }
			}
			
			var noRequiredFields = ["intermediary_bank_bic"];
			d.forEach(noRequiredFields, function(field){m.toggleRequired(field,false);});
		
		}
		
					
		/*
		 * d.query(params.selector).forEach(function(node) {
		 * console.debug("[misys.common] Building XML for grid", node.id); var
		 * form = dj.byId(node.id), widgets = {}, values, widget, declaredClass,
		 * value;
		 * 
		 * if (form) { d.forEach(form.getDescendants(), function(widget){
		 * if(!widget.name || widgets[widget.name]){ return; }
		 * widgets[widget.name] = widget; }); // Now that all fields are enabled
		 * and ready, collect the form value values = form.get("value");
		 * 
		 * for(var name in values) { if(widgets.hasOwnProperty(name)) { // don't
		 * traverse the prototype chain widget = widgets[name]; declaredClass =
		 * widget.declaredClass;
		 * 
		 * if(widget.toXML) { value = widget.toXML(); value = (!value) ? "" :
		 * value; } else { value = _normalize(values[name], declaredClass); } //
		 * If the widget defines its own XML tag, use the tag as provided by
		 * this widget if (widget.xmlTagName) { xml.push(value); } else {
		 * xml.push("<", name, ">", value, "</", name, ">"); } } } } });
		 * 
		 */
		
	});
})(dojo, dijit, misys);


