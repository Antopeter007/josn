dojo.provide("misys.binding.openaccount.simplified_upload_in_template");

/*
-----------------------------------------------------------------------------
Event Binding for Upload Template Form, Customer Side.(Simplified Invoice)

Copyright (c) 2000-2016 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      09/08/2016
author:	   Devika Saraswat
-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dojox.xml.DomParser");
dojo.require("misys.openaccount.FormOpenAccountEvents");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	d.mixin(m, {
		bind : function() {
			misys.connect('name', 'onBlur', _checkTemplateNameExists);
			misys.connect('mapping_fixed', 'onClick', _toggleFixedLengthFields);
			misys.connect('mapping_delimited', 'onClick', _toggleFixedLengthFields);
			misys.connect('delimiter', 'onChange', _toggleDelimeterOtherField);
			misys.connect('user_list', 'onClick', _showColumnInformation);
			misys.connect('start', 'onBlur', _updateColumnInformation);
			misys.connect('format_length', 'onBlur', _updateColumnInformation);
			misys.connect('date_format_select', 'onChange', _updateColumnInformation);
			misys.connect('amount_format_select', 'onChange', _updateColumnInformation);
			misys.connect('date_format_other', 'onBlur', _updateColumnInformation);
			misys.connect('amount_format_other', 'onBlur', _updateColumnInformation);
			
			misys.connect('add_column', 'onClick', _addSelectedColumn);
			misys.connect('remove_column', 'onClick',_removeSelectedColumn);
			m.connect("delimiter","onChange",function()
			{
				if(dj.byId('amount_format_select'))
				{
					m.changeAmountFormatSelectField();
				}
			});
			//Default Column Mapping to Fixed Type if nothing selected
			var mappingFixedField = dj.byId("mapping_fixed");
			var mappingDelimitedField = dj.byId("mapping_delimited");
			if(mappingFixedField && mappingFixedField.get("checked") === false && dj.byId("mapping_delimited").get("checked") === false)
			{
				mappingFixedField.set("checked",true);
				mappingFixedField.onClick();
			}
			else if(mappingFixedField && mappingFixedField.get("checked") === true)
			{
				mappingFixedField.onClick();
			}
			else if(mappingDelimitedField && mappingDelimitedField.get("checked") === true)
			{
				mappingDelimitedField.onClick();
			}
			//Move column up and down images
			misys.connect('move_column_up_img', 'onClick', _reOrderColumns);
			misys.connect('move_column_down_img', 'onClick', _reOrderColumns);
		},
		onFormLoad : function() {
			var hiddenDelimiter 	= dj.byId("hidden_delimiter").get("value"),
				mappingFixedField	= dj.byId("mapping_fixed"),
				columnMatched		= misys._config.matchedColumn;
				amountFormatField	=dj.byId("amount_format_select");
				/*dj.byId("delimiter").onChange();*/
				if(columnMatched === "Y")
				{
							_fncHide(d.byId("column_amount_format_div"));
							_fncHide(d.byId("column_date_format_div"));
							_fncHide(d.byId("column_start_length_div"));
				
							_highlightMandatoryColumns();
				
							dj.byId("date_format_select").onChange();
				
							if(mappingFixedField && mappingFixedField.get("checked") === true)
							{
								mappingFixedField.onClick();
							}
							else
							{
								
								//If delimiter option is selected			
								var delimiterField = dj.byId("delimiter");
								var delimiterTextField = dj.byId("delimiter_text");
								
								if("S" + hiddenDelimiter !== "S")
								{										
									delimiterField?delimiterField.onChange():null;
									if(delimiterField && hiddenDelimiter !== "comma" && hiddenDelimiter !== ";" && hiddenDelimiter !== "tab" && hiddenDelimiter !== ";;")
									{
										delimiterField.set("value","OTHER");
										delimiterTextField.set("value",hiddenDelimiter);
									}
								}
								else if(delimiterField && delimiterTextField)
								{
									delimiterField.set("value","OTHER");
									delimiterTextField.set("value",hiddenDelimiter);
								}
							}
						}
				else
					{
						if(d.byId("disclaimer"))
						{
							d.byId("disclaimer").style.display="block";
						}
					}
			},
		
		beforeSubmitValidations : function() {
			var isValidForm 				= true,
				mappingDelimitedField		= dj.byId("mapping_delimited"),
				mappingFixedField			= dj.byId("mapping_fixed"),
				delimiterSelectField		= dj.byId("delimiter"),
				delimitedOtherFormatText	= dj.byId("delimiter_text"),
				userList	= dj.byId("user_list");
			
			if(_validateDiscountExpDate())
			{	
				m._config.onSubmitErrorMsg =  m.getLocalization("selectAdjustmentExpiry");
				return false;
			}
			if(mappingDelimitedField && mappingDelimitedField.get("checked") === true)
			{
				//If delimiter is not selected then throw error
				if("S" + delimiterSelectField.get("value") === "S")
				{
					displayMessage = misys.getLocalization('uploadTemplateDelimiterRequired');
					delimiterSelectField.set("state","Error");
					dj.hideTooltip(delimiterSelectField.domNode);
					dj.showTooltip(displayMessage, delimiterSelectField.domNode, 0);
					return false;
				}
				//If delimiter other is selected then other format text should be populated
				if(delimiterSelectField.get("value") === "OTHER" && "S" + delimitedOtherFormatText.get("value") === "S")
				{
					displayMessage = misys.getLocalization('uploadTemplateDelimiterTextRequired');
					delimitedOtherFormatText.set("state","Error");
					dj.hideTooltip(delimitedOtherFormatText.domNode);
					dj.showTooltip(displayMessage, delimitedOtherFormatText.domNode, 0);
					return false;
				}
			}
			//Validate all the mandatory columns are selected
			if(!_validateIsAllMandatoryColumnsSelected())
			{
				return false;
			}
			
			// Validate if the format is provided for the date and amount
			// columns
			if(mappingDelimitedField && mappingDelimitedField.get("checked") && !m.validateDateAmountFormatFields())
			{				
						return false;
			}
			
			// If fixed column mapping is selected then validate all start and
			// length fields column information are populated
			if(mappingFixedField && mappingFixedField.get("checked") && !_validateStartLengthFields())
			{
						return false;
			}
			
			return isValidForm;
		}
	});
	
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			
			var xmlRoot = m._config.xmlTagName,
				
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],

				// Representation of existing XML
				dom 		= dojox.xml.DomParser.parse(xml),
				userList	= dj.byId("user_list");
				
				transformedXml.push("<brch_code>","00001","</brch_code>");
				transformedXml.push(m.getDomNode(dom, "upload_template_id"));
				transformedXml.push(m.getDomNode(dom, "name"));
				transformedXml.push(m.getDomNode(dom, "description"));
				transformedXml.push(m.getDomNode(dom, "mapping"));
				transformedXml.push(m.getDomNode(dom, "delimiter"));
				transformedXml.push(m.getDomNode(dom, "delimiter_text"));
				transformedXml.push(m.getDomNode(dom, "executable"));
				
				//Generate column XML
				d.forEach(d.query("option", userList.domNode), function(option){
					transformedXml.push("<column>", 
							option.value, 
										"</column>");
				});
				//Generate column information XML
				transformedXml.push(_generateColumnInformationXML(userList));
				transformedXml.push(m.getDomNode(dom, "product_code"));
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				console.debug(transformedXml.join(""));
				return transformedXml.join("");
		}
	});

	d.ready(function(){
		m._config.clearOnSecondCall = false;
	});
	
	function _toggleDelimeterOtherField()
	{
		//  Summary: 
		//  If delimiter is other then show the other field
		var delimiterField			= dj.byId("delimiter"),
			delimiterTextField		= dj.byId("delimiter_text"),
			delimiterOtherFieldDiv	= d.byId("delimiter_text_div");
			if(delimiterField.get("value") === "OTHER")
			{
				_fncShow(delimiterOtherFieldDiv);
			}
			else
			{
				_fncHide(delimiterOtherFieldDiv);
				delimiterTextField.set("value","");
			}
	}
	
	function _addSelectedColumn()
	{
		// Summary:
		// Moves the selected option from available list to the user list, and updates the mappedColumns data type and key for the selected column
		var selectFromList = dj.byId("avail_mapped_columns_list_nosend"), 
			selectToList = dj.byId("user_list"),
			selectedIndex = selectFromList.domNode.selectedIndex,
			optionToMove,
			optionValue;
		if (selectedIndex === -1)
		{ return; } 
		else
		{
			while(selectedIndex !== -1)
			{
				optionToMove 	= selectFromList.domNode[selectedIndex];
				optionValue 	= optionToMove.value;

				if (optionValue !== "ignored_column")
				{
					d.byId("user_list").appendChild(optionToMove);
					
				}
				else
				{
					var c = dojo.doc.createElement('option');
					c.innerHTML 	= optionToMove.innerHTML;
					c.value 		= optionValue;
					c.className 	= optionToMove.className;
					c.text 			= optionToMove.text;
					d.byId("user_list").appendChild(c);
					selectFromList.domNode[selectedIndex].selected = false;
				}
				// Data Type
				m._config.mappedColumns[optionValue].dataType = m._config.arrColumn[optionValue][0];
				// Key Field
				m._config.mappedColumns[optionValue].key = m._config.arrColumn[optionValue][1];
				selectedIndex = selectFromList.domNode.selectedIndex;
			}
		}
	}
	
	function _removeSelectedColumn()
	{
		//  Summary: 
		//  Moves the selected option from user list to available list
		var selectFromList 		= 	dj.byId("avail_mapped_columns_list_nosend"),
			selectToList		= 	dj.byId("user_list"),
			startLengthDiv 		= 	d.byId("column_start_length_div"),
			amountFormatDiv 	= 	d.byId("column_amount_format_div"),
			dateFormatDiv		=	d.byId("column_date_format_div"),
			selectedIndex		= 	selectToList.domNode.selectedIndex,
			optionToMove,		
			optionValue; 
		
			if(selectedIndex === -1)
			{ return; }
			else
			{
				optionToMove		= selectToList.domNode.options[selectedIndex];
				optionValue			= optionToMove.value;
			}
			
			if(optionValue.indexOf("ignored_column") === -1)
			{
				selectFromList.addSelected(selectToList);
			}
			else
			{
				selectToList.containerNode.remove(selectedIndex);
			}
			_fncHideInlineGroup(startLengthDiv);
			_fncHideInlineGroup(amountFormatDiv);
			_fncHideInlineGroup(dateFormatDiv);
	}
	
	function _showColumnInformation()
	{
		//  Summary: 
		//  On Click of the user list option, show the column information fields by defaulting the field information from mapped columns matrix
		var startField 				=	dj.byId("start"),
			lengthField				= 	dj.byId("format_length"),
			dateFormatField			= 	dj.byId("date_format_select"),
			dateFormatOtherField	= 	dj.byId("date_format_other"),
			amountFormatField		= 	dj.byId("amount_format_select"),
			amountFormatOtherField	= 	dj.byId("amount_format_other"),
			startLengthDiv 			= 	d.byId("column_start_length_div"),
			amountFormatDiv 		= 	d.byId("column_amount_format_div"),
			dateFormatDiv			=	d.byId("column_date_format_div"),
			unitCodeDiv				=	d.byId("unit_code_div"),
			paymentTermCodeDiv		=	d.byId("payment_term_code_div"),
			fscmTermCodeDiv			= 	d.byId("fscm_programme_code_div"),
			selectedIndex			= 	this.containerNode.options.selectedIndex,
			optionToMove,
			optionValue,
			fieldInfoMap; 
			if(selectedIndex === -1)
			{
				_fncHideInlineGroup(startLengthDiv);
				_fncHide(amountFormatDiv);
				_fncHide(dateFormatDiv);
				return; 
			}
			else
			{
				optionToMove			= this.domNode.options[selectedIndex];
				optionValue				= optionToMove.value;
				fieldInfoMap			= m._config.mappedColumns[optionValue];
			}
			
			if(dj.byId("mapping_fixed") && dj.byId("mapping_fixed").get("checked"))
			{
				_fncShowInlineGroup(startLengthDiv);
			}
			else
			{
				_fncHideInlineGroup(startLengthDiv);
			}
			if(fieldInfoMap)
			{
				startField.set("value",fieldInfoMap.start);
				lengthField.set("value",fieldInfoMap.formatLength);
				dateFormatField.set("value",fieldInfoMap.dateFormat);
				dateFormatOtherField.set("value",fieldInfoMap.dateFormatText);
				amountFormatField.set("value",fieldInfoMap.amountFormat);
				amountFormatOtherField.set("value",fieldInfoMap.amountFormatText);
				//Based on the selected option data type show the corresponding format fields(Currently Date and amount).
				_toggleFormatFields(fieldInfoMap.dataType);
			}
	}
	
	function _updateColumnInformation()
	{
		//  Summary: 
		//  On onBlur or onChange event of the Column information fields associated to the selected option from user list, updates the values
		//  to the mapped columns matrix.
		var columnName			= this.get("name"),
			selectToList		= dj.byId("user_list"),
			startField 			= dj.byId("start"),
			selectedIndex		= selectToList.domNode.selectedIndex,
			optionToMove,
			optionValue,
			fieldInfoMap;
		
			
		if(selectedIndex === -1)
		{ return; }
		else
		{
			optionToMove		= selectToList.domNode.options[selectedIndex];
			optionValue			= optionToMove.value;
			fieldInfoMap		= m._config.mappedColumns[optionValue];
		}
		if(fieldInfoMap)
		{
			switch(columnName)
			{
			case "start":
						fieldInfoMap.start				= this.get("value");
						break;
			case "format_length":
						fieldInfoMap.formatLength		= this.get("value");
						break;
			case "date_format_select":
						fieldInfoMap.dateFormat			= this.get("value");
						_toggleOtherFields(this);
						break;
			case "date_format_other":
						fieldInfoMap.dateFormatText		= this.get("value");
						break;
			case "amount_format_select":
						
						if(this.get("value") !== "") 
						{
							fieldInfoMap.amountFormat		= this.get("value");	
						}
						else 
						{
							dijit.byId("delimiter").onChange();	
						}
						
						_toggleOtherFields(this);
						break;
			case "amount_format_other":
						fieldInfoMap.amountFormatText	= this.get("value");
						break;
			default:
						console.debug("Invalid Field Focues:"+this.get("value"));
						break;
			}
		}
	}

	
	function _toggleFormatFields(fieldDataType)
	{
		//  Summary: 
		//  Based on the selected option data type show the corresponding format fields(Currently Date and amount).
		var amountFormatDiv = 	d.byId("column_amount_format_div"),
			dateFormatDiv	=	d.byId("column_date_format_div"),
			selectToList		= dj.byId("user_list"),
			selectedIndex		= selectToList.domNode.selectedIndex,
			optionToMove		= selectToList.domNode.options[selectedIndex],
			optionValue			= optionToMove.value;
			if(fieldDataType === "Date")
			{
				_fncShow(dateFormatDiv);
				_fncHide(amountFormatDiv);
				dj.byId("date_format_select").onChange();
			}
			else if(fieldDataType === "Number" && optionValue !== "line_item_qty_val" &&  optionValue !== "payment_term_nb_days")
			{
				_fncShow(amountFormatDiv);
				_fncHide(dateFormatDiv);
				dj.byId("amount_format_select").onChange();
			}
			else
			{
				_fncHide(amountFormatDiv);
				_fncHide(dateFormatDiv);
			}
	}
	
	function _toggleOtherFields(field)
	{
		//  Summary: 
		//  If option value is other for amount or date format fields then show the other field
		var fieldDivObj = d.byId(field.get("name")+"_other_div");
		if(field.get("name") === "date_format_select")
		{
			if(field.get("value") === "OTHER")
			{
				dojo.removeClass(fieldDivObj, "hide");
			}
			else
			{
				d.addClass(fieldDivObj, "hide");
			}
		}
		else if(field.get("name") === "amount_format_select")
		{
			if(field.get("value") === "OTHER")
			{
				d.removeClass(fieldDivObj, "hide");
			}
			else
			{
				d.addClass(fieldDivObj, "hide");
			}
		}
	}
	
	function _checkTemplateNameExists()
	{
		var field;
		if(dj.byId("name"))
		{
			field = dj.byId("name");
		}
		if(field && field.get("value")!==  '' && !m.checkUploadTemplateNameExists())
		{
			var displayMessage = m.getLocalization("uploadTemplateNameExists", [field.get("value")]);
			field.focus();
			field.set("state","Error");
			dj.hideTooltip(field.domNode);
			dj.showTooltip(displayMessage,field.domNode, 0);
		}
		
	}
	
	function _toggleFixedLengthFields()
	{
		//  Summary: 
		//  Show start and length fields only when fixed option is selected
		var startLengthDiv 		=	d.byId("column_start_length_div"),
			selectToList		=	dj.byId("user_list"),
			selectedIndex		= 	selectToList.domNode.selectedIndex,
			delimetedFieldDiv	=	d.byId("delimiter_select_div"),
			delimiterOtherFieldDiv	= d.byId("delimiter_text_div");
		if(this.get("checked") === true)
		{
			if(this.get("value") === "fixed")
			{
				//If any option is available in the user list then display the start and length fields
				if(selectedIndex !== -1)
				{
					_fncShowInlineGroup(startLengthDiv);
				}
				else
				{
					_fncHideInlineGroup(startLengthDiv);
					
				}
				//Hide delimited drop down
				_fncHide(delimetedFieldDiv);
				//Hide delimited Text field
				_fncHide(delimiterOtherFieldDiv);
			}
			else if(this.get("value") === "delimited")
			{
				_fncHideInlineGroup(startLengthDiv);
				//Show delimited drop down
				_fncShow(delimetedFieldDiv);
				//reset delimeted to the no select
				if(m._config.clearOnSecondCall)
				{
					dj.byId("delimiter").set("value","");
					dj.byId("delimiter_text").set("value","");
				}
				m._config.clearOnSecondCall = true;
			}
		}
	}
	
	function _highlightMandatoryColumns()
	{
		//  Summary: 
		//  Highlights the key columns in the available list
		var selectFromList		=	dj.byId("avail_mapped_columns_list_nosend"),
			selectToList		=	dj.byId("user_list");
		d.forEach(selectFromList.domNode.options,function(option){
			if(m._config.arrColumn[option.value] && m._config.arrColumn[option.value][1] === true)
			{
				option.className = "ipUploadTemplateMandatoryColumn";
			}
		});
		d.forEach(selectToList.domNode.options,function(option){
			if(m._config.arrColumn[option.value] && m._config.arrColumn[option.value][1] === true)
			{
				option.className = "ipUploadTemplateMandatoryColumn";
			}
		});
	}
	
	function _reOrderColumns()
	{
		var selectToList	= dj.byId("user_list"),
		selectedIndex		= selectToList.domNode.selectedIndex,
		optionToMove,
		optionValue;
		if(selectedIndex !== -1)
		{
			optionToMove		= selectToList.domNode.options[selectedIndex];
			optionValue			= optionToMove.value;
		}
		if(this.id  === "move_column_up_img")
		{
			if(selectedIndex === -1 || selectedIndex === 0)
			{return;}
			// remove the option
			selectToList.containerNode.remove(selectedIndex);
			//If browser type is IE
			if(dojo.isIE)
			{
				selectToList.containerNode.add(optionToMove, selectedIndex-1); 
			}
			else
			{
				selectToList.containerNode.add(optionToMove, selectToList.domNode.options[selectedIndex-1]); // For Standard Browsers
			}
			
		}
		else if(this.id === "move_column_down_img")
		{
			if(selectedIndex === -1 || selectedIndex === selectToList.domNode.length - 1)
			{return;}
			// remove the option
			selectToList.containerNode.remove(selectedIndex);
			if(selectedIndex > selectToList.domNode.length)
			{
				selectToList.containerNode.appendChild(optionToMove);
			} 
			else 
			{
				//If browser type is IE
				if(dojo.isIE)
				{
					selectToList.containerNode.add(optionToMove, selectedIndex+1); 
				}
				else
				{
					selectToList.containerNode.add(optionToMove, selectToList.domNode.options[selectedIndex+1]);  // For Standard Browsers
				}
			}
		}
	}
	
	function _fncHide(div)
	{
		d.removeClass(div, "inlineBlock");
		d.addClass(div, "hide");
	}
	
	function _fncShow(div)
	{
		d.removeClass(div, "hide");
		d.addClass(div, "inlineBlock");
	}
	
	function _fncHideInlineGroup(div)
	{
		d.removeClass(div, "inline-group");
		d.addClass(div, "hide");
	}
	
	function _fncShowInlineGroup(div)
	{
		d.removeClass(div, "hide");
		d.addClass(div, "inline-group");
	}
	
	function _generateColumnInformationXML(userList)
	{
		var transformedXml = [];
		d.forEach(d.query("option", userList.domNode), function(option){
			transformedXml.push("<",option.value,"_key>",m._config.mappedColumns[option.value].key,"</",option.value,"_key>");
			transformedXml.push("<",option.value,"_type>",m._config.mappedColumns[option.value].dataType,"</",option.value,"_type>");
			transformedXml.push("<",option.value,"_start>",m._config.mappedColumns[option.value].start,"</",option.value,"_start>");
			transformedXml.push("<",option.value,"_length>",m._config.mappedColumns[option.value].formatLength,"</",option.value,"_length>");
			transformedXml.push("<",option.value,"_minlength>",m._config.mappedColumns[option.value].minLength,"</",option.value,"_minlength>");
			transformedXml.push("<",option.value,"_maxlength>",m._config.mappedColumns[option.value].maxLength,"</",option.value,"_maxlength>");
			if(m._config.mappedColumns[option.value].dataType === "Date")
			{
				transformedXml.push("<",option.value,"_format>",m._config.mappedColumns[option.value].dateFormat,"</",option.value,"_format>");
				transformedXml.push("<",option.value,"_format_text>",m._config.mappedColumns[option.value].dateFormatText,"</",option.value,"_format_text>");
			}
			else if(m._config.mappedColumns[option.value].dataType === "Number")
			{
				transformedXml.push("<",option.value,"_format>",m._config.mappedColumns[option.value].amountFormat,"</",option.value,"_format>");
				transformedXml.push("<",option.value,"_format_text>",m._config.mappedColumns[option.value].amountFormatText,"</",option.value,"_format_text>");
			}
		});
		return transformedXml.join("");
	}
	
	function _validateIsAllMandatoryColumnsSelected()
	{
		var selectFromList	=	dj.byId("avail_mapped_columns_list_nosend"),
			keyColumns		=	[],
			isValid			=	true;
		d.forEach(d.query("option", selectFromList.domNode), function(option){
			if(m._config.arrColumn[option.value] && m._config.arrColumn[option.value][1] === true)
			{
				keyColumns.push(option.value);
			}
		});
		
		if(keyColumns.length > 0)
		{
			isValid =	false;
			displayMessage = misys.getLocalization('selectAllUploadTemplateKeyColumns');
			dj.hideTooltip(selectFromList.domNode);
			dj.showTooltip(displayMessage, selectFromList.domNode, 0);
		}
		else
		{
			dj.hideTooltip(selectFromList.domNode);
		}
		return isValid;
	}
	
	function _validatePaymentTermsField()
	{
		var selectToList = dj.byId("user_list");
			
			if (selectToList)
			{
				if((selectToList.get("value").indexOf("payment_term_cur_code") !== -1 && selectToList.get("value").indexOf("payment_term_amt") !== -1 && selectToList.get("value").indexOf("payment_term_pct") === -1))
				{
					m._config.arrColumn["payment_term_pct"][1] = false;
				}
				else if(selectToList.get("value").indexOf("payment_term_pct") !== -1 && selectToList.get("value").indexOf("payment_term_cur_code") === -1 && selectToList.get("value").indexOf("payment_term_amt") === -1)
				{
					m._config.arrColumn["payment_term_cur_code"][1] = false;
					m._config.arrColumn["payment_term_amt"][1] = false;
				}
			}
	}
	
	function _validateStartLengthFields()
	{
		var selectToList			=	dj.byId("user_list"),
			isValid					=	true,
			startField				=	dj.byId("start"),
			lengthField				=	dj.byId("format_length"),
			dateFormatSelectField	=	dj.byId("date_format_select"),
			amountFormatSelectField =	dj.byId("amount_format_select"),
			dateTextField			=	dj.byId("date_format_other"),
			amountTextField			=	dj.byId("amount_format_other"),
			breakLoop				=	false;
			
			
		
		d.some(d.query("option", selectToList.domNode), function(option,index){
			var errorFields			=	[];
			if("S" + m._config.mappedColumns[option.value].start === "S")
			{
				errorFields.push(startField);
				breakLoop	= true;
				isValid	= false;
			}
			if("S" + m._config.mappedColumns[option.value].length === "S")
			{
				errorFields.push(lengthField);
				breakLoop	= true;
				isValid	= false;
			}
			
			if(m._config.mappedColumns[option.value].dataType === "Date")
			{
				if("S" + m._config.mappedColumns[option.value].dateFormat === "S")
				{
					errorFields.push(dateFormatSelectField);
					breakLoop	= true;
					isValid	= false;
				}
				else if(m._config.mappedColumns[option.value].dateFormat === "OTHER" && ("S" + m._config.mappedColumns[option.value].dateFormatText === "S"))
				{
					errorFields.push(dateTextField);
					breakLoop	= true;
					isValid	= false;
				}
			}
			else if(m._config.mappedColumns[option.value].dataType === "Number")
			{
				if("S" + m._config.mappedColumns[option.value].amountFormat === "S")
				{
					errorFields.push(amountFormatSelectField);
					breakLoop	= true;
					isValid	= false;
				}
				else if(m._config.mappedColumns[option.value].amountFormat === "OTHER" && ("S" + m._config.mappedColumns[option.value].amountFormatText === "S"))
				{
					errorFields.push(amountTextField);
					breakLoop	= true;
					isValid	= false;
				}
			}
			if(breakLoop)
			{
				dj.byId("user_list").domNode.options.selectedIndex = index;
				dj.byId("user_list").onClick();
				m.markErrorFields(errorFields);
			}
			
			return breakLoop;
		});
		return isValid;
	}
	
	function _validateDiscountExpDate()
	{
		var selectFromList	=	dj.byId("avail_mapped_columns_list_nosend"),
			selectToList = dj.byId("user_list");
		
		
		 // This will be the condition when fscm cash customization is not enabled or If both exists in to list or from list
		 
		if ((selectToList.get("value").indexOf("discount_exp_date") === -1 && selectFromList.get("value").indexOf("discount_exp_date") === -1) || ((selectToList.get("value").indexOf("total_adjustments") === -1 && selectToList.get("value").indexOf("discount_exp_date") === -1)|| (selectToList.get("value").indexOf("total_adjustments") != -1 && selectToList.get("value").indexOf("discount_exp_date") != -1)))
		{
			return false;
		}
		
		
		return true;
	}
	
})(dojo, dijit, misys);

//Including the client specific implementation
dojo.require('misys.client.binding.openaccount.simplified_upload_in_template_client');