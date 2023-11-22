dojo.provide("misys.form.common");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.form.SortedFilteringSelect");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
// version:   1.2
// date:      08/04/11
// author:    Cormac Flynn
/**
 * <h4>Summary:</h4>
 * Library of code used across all pages that contain a product form
 * 
 * <h4>Description</h4>: 
 * This file contains code that is used specifically in product and
 * some system forms. It should not* contain code that is critical to the
 * creation of a page or form. Hence the functions below tend to be those that
 * are particular to a particular screen.
 * 
 * @class common(Form)
 * 
 * 
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var tabTitle ="tab title:";
	var tenorLabel="label[for=tenor_period_label]";
	var advBank="Advising Bank";
	var reqConfParBankDet="requested-conf-party-bank-details";
    var viewNarrativeSwift	="view-narrative-swift";
    var varProdCode ="&productcode=";
   var chilDialog="[misys.form.common] Opening a child dialog at URL";
   var ajaxActionUrl="/screen/AjaxScreen/action/";
   var ajaxStaticDPopup="AjaxScreen/action/GetStaticDataPopup";
   var messageGridContent="[misys.form.common] Retrieving grid content from URL";
   var excValue ='excluded-value';
   var attFile ="attachment-file";
	// Private Functions and Variables
	
	var 
		// Default dimensions for the BG document editor pane
		_defaultEditorRows = "13",
		_defaultEditorCols = "40",
		_defaultEditorMaxSize = "300",
		limit = 0,
		limitSingle = 0,
		entered = 0,
		enteredSingle = 0,
		isCombinedValid = true, 
		isSingleFieldValid = true;	
	 
	
	/**
	 * <h4>Summary:</h4>Unwraps text based on given identifiers for swift 2018 extended
	 *  narratives.
	 * 
	 * <h4>Description:</h4>Unwraps all the text unless a specific identifier appears
	 *  as the first character of a line. In a case, the specific identifier comes in 
	 *  the middle of a specific line, the unwrap function is applied and a new line or
	 *  paragraph is not started.
	 *  
	 *  @param {String} msg
	 *  @method _unwrap
	 *  Allowed identifiers are :
                         +,
                         #,
                         -,
                         a to z),
                         A) to Z),
                         a. to z.,
                         A. to Z.,
                         1) to 99),
                         1. to 99.,
                         1- to 99-
                         1# to 99#
                         1+ to 99+
                         a to z-
                         a# to z#
                         a+ to z+
                         A- to Z-
                         A# to Z#
                         A+ to Z+
                         
	 */
	function _unwrap(/*String*/ msg){
		var re = new RegExp(/^[a-zA-Z]{1}[).#+-]|^[1-9]{1,2}[).#+-]|^[\+#-]/);
		var message = msg.split(/\n/);
		var unwrappedMessage = '<pre style="background-color:#ffffff;border-width:0px; white-space: pre-wrap;">';
		for(var i = 0; i < message.length; i++){
			message[i] = message[i] + '\n';
			var len =  message[i].length;
			var temp = '';
			if(message[i][len-1] === '\n' && message[i+1] != undefined &&
			  (re.test(message[i+1].trim()) || message[i+1].trim() ==='' || message[i+1].trim()==='\n'  )){
				temp = message[i].replace(/\n/g,'');
				temp = temp+'<br/>';
			}else{
				temp = message[i].replace(/\n/g,' ');
			}
			unwrappedMessage += temp;
		}
		unwrappedMessage+="</pre>";
		return unwrappedMessage;
	}
	
	/**
	 * 
	 * Custom decode for narrative extension while the display-mode is view
	 */
	
	function _decode(/*String*/ msg){
		var message = msg;
		message = message.replace(/&#xa;/g,'\n');
		message = message.replace(/&#xa;/g,'\t');
		message = message.replace(/&#x29;/g,')');
		message = message.replace(/&#x2b;/g,'+');
		message = message.replace(/&#x23;/g,'#');
		message = message.replace(/&#x2d;/g,'-');
		message = message.replace(/&#x3e;/g,'>');
		message = message.replace(/&#x3c;/g,'<');
		message = message.replace(/&#x2f;/g,'/');
		message = message.replace(/&#x9;/g,'');
		message = message.replace(/&#x26;nbsp&#x3b;/g,' ');
		message = message.replace(/&#x26;amp&#x3b;/g,'&');
		return _unwrap(message);
	}

	/**
	 * <h4>Summary:</h4> Calculate the new amt. 
	 * 
	 * <h4>Description:</h4>  Calculate the new amount in
	 * the case of amendment. Handles both increment and decrement in amount.
	 * 
	 * {misys._config.productCode}_amt fields must exist for this function to be
	 * correctly called.
	 * 
	 * @param {Dijit} node
	 * 	Node either inc_amt or dec_amt
	 * @method _calculateNewAmt
	 */
	function _calculateNewAmt( /*Dijit*/ node) {
		var productCode = m._config.productCode.toLowerCase(),
			amtField = dj.byId(productCode + "_amt"),
			orgAmtField = dj.byId("org_" + productCode + "_amt"),
			// We parse to number in case either field happens to be a hidden field.
			orgAmt = d.number.parse(orgAmtField.get("displayedValue")),
			amendAmt = d.number.parse(node.get("displayedValue"));

		orgAmt = !isNaN(orgAmt) ? orgAmt : 0;
		amendAmt = !isNaN(amendAmt) ? amendAmt : null;
		
		if(node.id === "inc_amt" || node.id === "inc_amt_value") {
			console.debug("[misys.form.common] Incrementing amount from", amtField.get("value"), 
								"to", (orgAmt + amendAmt));
			amtField.set("value", orgAmt + amendAmt);
			m.setTnxAmt(amendAmt);
		} else {
			if(amendAmt <= orgAmt) {
				console.debug("[misys.form.common] Changing amount from", 
						amtField.get("value") ,"to", (orgAmt - amendAmt));
				amtField.set("value", orgAmt - amendAmt);
				m.setTnxAmt(amendAmt);
			} else {
				// TODO This should be handled by a validation attached
				// to the field
				m.setFieldState(node, false);
			}
		}
	}
	
	/**
	 * <h4>Summary:</h4> 
	 * Deletes counterparties and clears tnx_amt upon currency change
	 * @param {Dijit} widget
	 *  Currency widget  
	 * @method _resetFTCounterparties
	 */
	function _resetFTCounterparties(/*Dijit*/ widget) {

		// 1. Clear tnx_amt val
		m.setTnxAmt("");

		// 2. Set currency values
		var value = widget.get("value");
		dj.byId("ft_cur_code").set("value", value);
		dj.byId("counterparty_details_ft_cur_code_nosend").set("value", value);
		m.setCurrency(widget, ["ft_amt", "counterparty_details_ft_amt_nosend"]);

		// 3. Delete beneficiaries, if there are any 
		d.query(
				".widgetContainer #counterparty_fields " + 
				"[id^='counterparty_details_document_id_']").forEach(function(field){
			if(field.id.indexOf("nosend") === -1)
			{
				var w = dj.byId(field.id);
				if(w){
					m.deleteTransactionAddon("counterparty", w.get("value"));
				}
			}
		});
	}
	/**
	 * <h4>Summary:</h4> 
	 * Set the value of drawee details. 
	 * <h4>Description:</h4>  
	 * Sets the values of Drawee bank details.Depending upon crAvailCode set the drawee bank details
	 * It can be issuing bank or advising bank depending upon the value of code
	 * @param {String} crAvlCode
	 * @param {String} bankType
	 *  Whether bank is issuing bank or advising bank or any other bank
	 * @method _toggleDraweeBankDetails
	 */
	function _toggleDraweeBankDetails( /*String*/ crAvlCode, 
									   /*String*/ bankType) {
		
		var draweeDetailsBankName = dj.byId("drawee_details_bank_name");
		var amendmentTransaction = (dj.byId("tnxtype") && dj.byId("tnxtype").get("value")==="03") || 
		(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")==="03") || 
		(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value")==="08" || dj.byId("prod_stat_code").get("value")==="31"));
		if(!(amendmentTransaction)) {
		switch(bankType) {
		 case m._config.issuingBank:
			draweeDetailsBankName.set("value", m._config.issuingBank);
			break;
		 case m._config.advisingBank:
			if(crAvlCode !== "03") {
				draweeDetailsBankName.set("value", m._config.advisingBank);
			} else {
				draweeDetailsBankName.set("value", m._config.issuingBank);
			}
			break;
		 case m._config.anyBank:
			draweeDetailsBankName.set("value", m._config.issuingBank);
			break;
		 default:
			if(crAvlCode === "01" || crAvlCode === "02" || crAvlCode === "04" || crAvlCode === "05" || crAvlCode === "03") {
				/*jsl:pass*/
				// TODO error in original script but I don't know the business logic so I can't 
				//		correct it
				// draweeDetailsBankName.set("value",m._config.namedBank);
			} else {
				draweeDetailsBankName.set("value", m._config.issuingBank);
			}
			break;
		}
		}
	}
/**
 * <h4>Summary:</h4>
 * This function creates transaction grid like any other grid in application
 * @param {String} url	
 * @param {String} containerId
 * @method _createTransactionGrid
 */
	function _createTransactionGrid( /*String*/ url, 
									 /*String*/ containerId){
		// summary:
		//		TODO add summary
		//		TODO Dimensions should not be hardcoded
		// 		TODO This grid is created in a manner unlike other grids in the application
		
		var layout = [{field: "REFIDLINK",name: "ref_id",width: "100px", 
						styles: "text-align: center;",formatter: m.grid.formatHTML},
						{field: "CURCODE",name: "cur_code",width: "auto"},
						{field: "TNXID",name: "tnx_id",width: "auto"},
						{field: "TYPE",name: "type",width: "auto",formatter: m.grid.formatHTML},
						{field: "STATUS",name: "status",width: "auto"},
						{field: "AMOUNT",name: "tnx_amt",width: "auto"}],
			json = "items: ''",
			store = new dojo.data.ItemFileReadStore({data:json}),
			grid = new dojox.grid.DataGrid({
				  query: {
				      id: "*"
				  },
				  id: "transaction_Grid",
				  structure: layout,
				  height: "100px",
				  noDataMessage: m.getLocalization("noTransactionsFound"),
				  onSelected: function(inRowIndex){_selectTransactionIndex(inRowIndex);},
				  selectionMode: "single"
			}, document.createElement("div"));
			d.byId(containerId).appendChild(grid.domNode);
			grid.startup();
			store.url = url;
			grid.setStore(store);
	}
	/**
	 * <h4>Summary:</h4>
	 * This function provides selection of transaction grid.
	 * @param {Number} inRowIndex
	 *  Index of the items to be selected
	 * @method _selectTransactionIndex
	 * 
	 */
	function _selectTransactionIndex( /*Number*/ inRowIndex){
		//	Summary
		//		TODO Add <h4>Description:</h4> 
		//		TODO 

		var transationSelected = dj.byId("transaction_Grid").get("store")._arrayOfAllItems[inRowIndex];
		dj.byId("imp_bill_ref_id").set("value", transationSelected.TNXID);
		d.byId("TransactionLink").innerHTML = 
			"<a id='javascriptLink' href='javascript:void(0)\'>" + 
			m.getLocalization("TransactionLink") + "</a>";
		d.attr("javascriptLink", "onclick", 
				"misys.popup.showReporting('FULL','" + transationSelected.PRODUCTCODE + 
				"','" + transationSelected.REFID + "','" + transationSelected.TNXID + "');");
		dj.byId("linkedTransaction_dialog").hide();
	}
	/**
	 * <h4>Summary:</h4>
	 *  Method to reset Limit fields on change of facility and applicant reference and Entity.
	 *  Set the displayed value of all the fields to empty in the same.
	 * @method _resetLimitDetails
	 */
	function _resetLimitDetails(){
		//Summary
		//Method to reset Limit fields onchange of facility and applicant reference and entity
		var fieldIds 	  	= m._config.limitFieldIdCollection;
		console.debug("[misys.form.common] Reset Limit Fields");
		
		d.forEach(fieldIds, function(id, index){
			var obj = dj.byId(id);
			if(obj) 
			{
				obj.set("displayedValue","");
			}
		});
	}
	/**
	 * <h4>Summary:</h4>
	 *  Method to store Limit collection.Create a itemFileReadStore from the store and form the response object
	 *  @param {Object} response
	 *   Response object contains all required fields ,items,store.
	 *  @method _setLimitCollection
	 * 
	 */
	function _setLimitCollection(response){
		//Summary
		//Method to store Limit collection
		console.debug("[misys.form.common] Set Limit Reference Store");
		m._config.limitFieldIdCollection = response.fields;
		m._config.limitCollection 		= response.items;
		m._config.limitStore			= response.store;
		var limitIdWidget 				= dj.byId("limit_id");
			
		if(limitIdWidget)
		{
			limitIdWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : m._config.limitStore
						}
					});
		}
	}
	/**
	 * <h4>Summary:</h4>
	 * This function is used to set the dynamic text content to the field selected.
	 * <h4>Description:</h4> 
	 * The phrase text is appended to the existing text area field.
	 * @param {Object} response
	 * @method _showExistingPoRefMsg
	 */
	function _showDynamicNarrativeText(response){
		
		console.debug("[misys.form.common] _showDynamicNarrativeText : start ");
		
		var fieldId;
			if(response.items !== "")
			{
				fieldId = response.items.widget;
				var field = dj.byId(fieldId);
				var value = field.get("value");
				if(value === ""){
					field.set("value",value + response.items.text);
				}
				else{
					field.set("value",value + "\n" +response.items.text);
				}
				console.debug("[misys.form.common] _showDynamicNarrativeText : end ");
			}
			dj.byId("xhrDialog")?dj.byId("xhrDialog").hide():"";
	}
	
	/**
	 * <h4>Summary:</h4>
	 * This function is used to populate the selected user details to the user fields.
	 * <h4>Description:</h4> 
	 * The user details are populated to the existing fields.
	 * @param {Object} response
	 * @method _PopulateCloneUserDetails
	 */
	function _PopulateCloneUserDetails(response){
		
		console.debug("[misys.form.common] _PopulateCloneUserDetails : start ");
		
		if(response.message !== "")
		{
			var firstname = dj.byId("first_name"),
			lastname = dj.byId("last_name"),
			legalcountry =dj.byId("legal_country"),
			legaltype=dj.byId("legal_type"),
   		    legalno=dj.byId("legal_no"),
			addr1=dj.byId("address_line_1"),
			addr2=dj.byId("address_line_2"),
			countrysubdiv=dj.byId("country_sub_div"),
			county=dj.byId("county"),
			country_name=dj.byId("country_name"),
			phone=dj.byId("phone"),
			fax=dj.byId("fax"),
			email=dj.byId("email"),
			dom=dj.byId("dom"),
			timezone=dj.byId("time_zone"),
			crsplang=dj.byId("correspondence_language"),
			status=dj.byId("actv_flag"),
			curcode=dj.byId("base_cur_code"),
			department=dj.byId("employee_department");
			var authlen=response.message.static_user.group_record.length;
			var rolelistref;
			var availrolelistref;
			var firstnamevalue = response.message.static_user.first_name,
			lastnamevalue = response.message.static_user.last_name,
			addr1value = response.message.static_user.address_line_1,
			addr2value = response.message.static_user.address_line_2,
			countrysubdivvalue = response.message.static_user.country_sub_div,
			countyvalue = response.message.static_user.county,
			countryvalue = response.message.static_user.country_name,
			phonevalue = response.message.static_user.phone,
			faxvalue = response.message.static_user.fax,
			emailvalue = response.message.static_user.email,
			domvalue = response.message.static_user.dom,
			timezonevalue = response.message.static_user.time_zone,
			crspdlangvalue = response.message.static_user.correspondence_language,
			curcodevalue = response.message.static_user.cur_code;
			if(response.message.static_user.company_type == '03'){
			rolelistref = dojo.byId("company_role_list");
			availrolelistref = dojo.byId("company_avail_list_nosend");
			var pendingtransvalue = response.message.static_user.pending_trans_notify,
			legalcountryvalue = response.message.static_user.legal_country,
			legaltypevalue = response.message.static_user.legal_type,
			legalnovalue = response.message.static_user.legal_no;
			legalcountry.set("value",legalcountryvalue);
			legaltype.set("value",legaltypevalue);
			legalno.set("value",legalnovalue);
			if(pendingtransvalue == 'Y')
				{
				dj.byId("pending_trans_notify").set("checked", true);
				dj.byId("email").set("required", true);
				}
			if(response.message.static_user.group_record.length > 0)
				{
				for(var m=1;m<=authlen-1;m++){
					dj.byId("company_auth_level_"+m).set("value","");
					dj.byId("company_limit_amt_"+m).set("value", "");
					dj.byId("company_limit_cur_code_"+m).set("value","");
					if(response.message.static_user.group_record[m-1].existing_roles)
					{
					var authval= response.message.static_user.group_record[m-1].existing_roles.role.name;
					var amtval = response.message.static_user.group_record[m-1].existing_roles.role.limit_amt;
					var curval = response.message.static_user.group_record[m-1].existing_roles.role.limit_cur_code;
					dj.byId("company_auth_level_"+m).set("value",authval);
					dj.byId("company_limit_amt_"+m).set("value", amtval);
					dj.byId("company_limit_cur_code_"+m).set("value",curval);
					misys.animate('wipeIn', "grp_rec_"+response.message.static_user.group_record[m-1].group_abbv_name);
					}
				}
				}
			}
			if(response.message.static_user.company_type == '01' || response.message.static_user.company_type == '02'){
				rolelistref = dojo.byId("bank_role_list");
				availrolelistref = dojo.byId("bank_avail_list_nosend");
				var option;
				if(response.message.static_user.group_record.existing_roles != "")
					{
					var bankauthlevelvalue = null;
					if(response.message.static_user.group_record.existing_roles.role.length > 0)
						{
						for(var x=0; x<response.message.static_user.group_record.existing_roles.role.length; x++)
							{
							  if(response.message.static_user.group_record.existing_roles.role[x].roletype=='02')
								  {
									 bankauthlevelvalue = response.message.static_user.group_record.existing_roles.role[x].role_description;
								     option = document.createElement("OPTION");
									 option.innerHTML = bankauthlevelvalue;
									 option.value= response.message.static_user.group_record.existing_roles.role[x].name;
									 dj.byId("bank_auth_level_1").set("item", option);
								  }
							}
						}
					else
						{
						if(response.message.static_user.group_record.existing_roles.role.roletype=='02')
						  {
							 bankauthlevelvalue = response.message.static_user.group_record.existing_roles.role.role_description;
						     option = document.createElement("OPTION");
							 option.innerHTML = bankauthlevelvalue;
							 option.value= response.message.static_user.group_record.existing_roles.role[x].name;
							 dj.byId("bank_auth_level_1").set("item", option);
						  }
						}
					}
				var departmentvalue = response.message.static_user.employee_department;
				department.set("value", departmentvalue );
				}
			firstname.set("value",firstnamevalue);
			lastname.set("value",lastnamevalue);
			addr1.set("value",addr1value);
			addr2.set("value",addr2value);
			countrysubdiv.set("value",countrysubdivvalue);
			county.set("value",countyvalue);
			country_name.set("value",countryvalue);
			phone.set("value",phonevalue);
			fax.set("value",faxvalue);
			email.set("value",emailvalue);
			dom.set("value",domvalue);
			timezone.set("value",timezonevalue);
			crsplang.set("value",crspdlangvalue);
			curcode.set("value", curcodevalue);
			var roledesc;
			var roleval;
			
			if(availrolelistref)
				{
					availrolelistref.innerHTML = "";
				}
			if(rolelistref)
			{
				rolelistref.innerHTML = "";
			}
			// populating existing roles for corportae user
			if(response.message.static_user.company_type == '03' && response.message.static_user.static_company.owner_id != '2' && response.message.static_user.group_record[1].group_abbv_name == "global")
			{
			// if there are existing roles are not empty
			if(response.message.static_user.group_record[1].existing_roles)
			{
			// if there are existing roles are not empty and has more than 1 role
			if(response.message.static_user.group_record[1].existing_roles.role.length>0)
			{
									for(var j = 0; j < response.message.static_user.group_record[1].existing_roles.role.length; j++)
									{
										roledesc = response.message.static_user.group_record[1].existing_roles.role[j].role_description;
										roleval = response.message.static_user.group_record[1].existing_roles.role[j].name;
										dojo.create("option", { text: roledesc, value: roleval, innerHTML: roledesc, textValue: roledesc}, rolelistref);
									}
			}
			// if there are existing roles are not empty and has only 1 role
			else{
			dojo.byId("company_role_list").add(dojo.create("option", { text: response.message.static_user.group_record[1].existing_roles.role.role_description, innerHTML: response.message.static_user.group_record[1].existing_roles.role.role_description, value: response.message.static_user.group_record[1].existing_roles.role.name}));
			}
			}
		}

			// populating existing roles for bank and bankgroup side
			var desc3;
			var val3;
			if(response.message.static_user.company_type == '01' || response.message.static_user.company_type == '02')
			{
			//if the existing roles are not empty
			if(response.message.static_user.group_record.existing_roles)
			{
				// if the existing roles are not empty and having more than 1 role
				if(response.message.static_user.group_record.existing_roles.role.length>0)
				{
				for(var y = 0; y < response.message.static_user.group_record.existing_roles.role.length; y++)
					{
						// check if the condition is needed for roledest also for bankgroup and bank users.
					  if(response.message.static_user.group_record.existing_roles.role[y].roletype=="01")
					  {
						  desc3 = response.message.static_user.group_record.existing_roles.role[y].role_description;
						  val3 = response.message.static_user.group_record.existing_roles.role[y].name;
						  dojo.create("option", { text: desc3, value: val3, innerHTML: desc3, textValue: desc3}, rolelistref);
					  }
					}
				}
				// if the existing roles are not empty and having only single role
				else
				{
					if(response.message.static_user.group_record.existing_roles.role.roletype=="01")
						{
							dojo.byId("bank_role_list").add(dojo.create("option", { text: response.message.static_user.group_record.existing_roles.role.role_description, innerHTML: response.message.static_user.group_record.existing_roles.role.role_description,  value: response.message.static_user.group_record.existing_roles.role.name}));
						}
				}
			}
			}
			
			// populating existing roles for customers from bankgroup side
			if(response.message.static_user.company_type == '03' && response.message.static_user.static_company.owner_id == '2')
			{
				//multibank scenario
				var len=response.message.static_user.group_record.length;
				if(response.message.static_user.group_record.length > 0)
					{
					// if there are existing roles are not empty
					if(response.message.static_user.group_record[len-1].existing_roles)
					{
					// if there are existing roles are not empty and has more than 1 role
					if(response.message.static_user.group_record[len-1].existing_roles.role.length>0)
					{
											for(var z = 0; z < response.message.static_user.group_record[len-1].existing_roles.role.length; z++)
											{
												roledesc = response.message.static_user.group_record[len-1].existing_roles.role[z].role_description;
												roleval = response.message.static_user.group_record[len-1].existing_roles.role[z].name;
												dojo.create("option", { text: roledesc, value: roleval, innerHTML: roledesc, textValue: roledesc}, rolelistref);
											}
					}
					// if there are existing roles are not empty and has only 1 role
					else{
					dojo.byId("company_role_list").add(dojo.create("option", { text: response.message.static_user.group_record[len-1].existing_roles.role.role_description, innerHTML: response.message.static_user.group_record.existing_roles.role.role_description, value: response.message.static_user.group_record.existing_roles.role.name}));
					}
					}
					}
					
				// no multibank
				else{
					// if there are existing roles are not empty
			if(response.message.static_user.group_record.existing_roles)
			{
			// if there are existing roles are not empty and has more than 1 role
			if(response.message.static_user.group_record.existing_roles.role.length>0)
			{
									for(var zn = 0; zn < response.message.static_user.group_record.existing_roles.role.length; zn++)
									{
										roledesc = response.message.static_user.group_record.existing_roles.role[zn].role_description;
										roleval = response.message.static_user.group_record.existing_roles.role[zn].name;
										dojo.create("option", { text: roledesc, value: roleval, innerHTML: roledesc, textValue: roledesc}, rolelistref);
									}
			}
			// if there are existing roles are not empty and has only 1 role
			else{
			dojo.byId("company_role_list").add(dojo.create("option", { text: response.message.static_user.group_record.existing_roles.role.role_description, innerHTML: response.message.static_user.group_record.existing_roles.role.role_description, value: response.message.static_user.group_record.existing_roles.role.name}));
			}
			}
				}
		}
			
			//available roles for corporate user
			var desc1;
			var val1;
			if(response.message.static_user.company_type == '03' && response.message.static_user.static_company.owner_id != '2' && response.message.static_user.group_record[1].group_abbv_name == "global")
			{
						// if the available roles are not empty
						if(response.message.static_user.group_record[1].avail_roles != "")
						{
							// if there are available roles are not empty and has more than 1 role
							if(response.message.static_user.group_record[1].avail_roles.role.length > 0)
							{
								response.message.static_user.group_record[1].avail_roles.role.sort(GetSortOrder("role_description"));
							for(var k = 0; k < response.message.static_user.group_record[1].avail_roles.role.length; k++)
									{
										if(response.message.static_user.group_record[1].avail_roles.role[k].roledest =='03' && response.message.static_user.group_record[1].avail_roles.role[k].roletype == '01')
										{
										desc1 = response.message.static_user.group_record[1].avail_roles.role[k].role_description;
										val1 = response.message.static_user.group_record[1].avail_roles.role[k].name;
										dojo.create("option", { text: desc1, value: val1, innerHTML: desc1, textValue: desc1}, availrolelistref);
										}
									}
							}
							// if there are available roles are not empty and has only single role
							else{
								if(response.message.static_user.group_record[1].avail_roles.role.roledest =='03' && response.message.static_user.group_record[1].avail_roles.role.roletype == '01')
								{
									dojo.byId("company_avail_list_nosend").add(dojo.create("option", { text: response.message.static_user.group_record[1].avail_roles.role.role_description,
									innerHTML : response.message.static_user.group_record[1].avail_roles.role.role_description,
									value: response.message.static_user.group_record[1].avail_roles.role.name}));
								}
							}
						
							
						}
			}

				// populating available roles for customers from bankgroup side 
			if(response.message.static_user.company_type == '03' && response.message.static_user.static_company.owner_id == '2')
			{

				//multibank scenario
				var ln=response.message.static_user.group_record.length;
				if(response.message.static_user.group_record.length > 0)
					{
					// if the available roles are not empty
					if(response.message.static_user.group_record[ln-1].avail_roles != "")
					{
						// if there are available roles are not empty and has more than 1 role
						if(response.message.static_user.group_record[ln-1].avail_roles.role.length > 0)
						{
							response.message.static_user.group_record[ln-1].avail_roles.role.sort(GetSortOrder("role_description"));
						for(var mor = 0; mor < response.message.static_user.group_record[ln-1].avail_roles.role.length; mor++)
								{
									if(response.message.static_user.group_record[ln-1].avail_roles.role[mor].roledest =='03' && response.message.static_user.group_record[ln-1].avail_roles.role[mor].roletype == '01')
									{
									desc1 = response.message.static_user.group_record[ln-1].avail_roles.role[mor].role_description;
									val1 = response.message.static_user.group_record[ln-1].avail_roles.role[mor].name;
									dojo.create("option", { value: val1, innerHTML: desc1/*, textValue: desc1*/}, availrolelistref);
									}
								}
						}
						// if there are available roles are not empty and has only single role
						else{
							if(response.message.static_user.group_record[ln-1].avail_roles.role.roledest =='03' && response.message.static_user.group_record[ln-1].avail_roles.role.roletype == '01')
							{
								dojo.byId("company_avail_list_nosend").add(dojo.create("option", {/* text: response.message.static_user.group_record.avail_roles.role.role_description,*/
								innerHTML : response.message.static_user.group_record[ln-1].avail_roles.role.role_description,
								value: response.message.static_user.group_record[ln-1].avail_roles.role.name}));
							}
						}
					
						
					}
				}
				else
					{
					// if the available roles are not empty
					if(response.message.static_user.group_record.avail_roles != "")
					{
						// if there are available roles are not empty and has more than 1 role
						if(response.message.static_user.group_record.avail_roles.role.length > 0)
						{
							response.message.static_user.group_record.avail_roles.role.sort(GetSortOrder("role_description"));
						for(var mr = 0; mr < response.message.static_user.group_record.avail_roles.role.length; mr++)
								{
									if(response.message.static_user.group_record.avail_roles.role[mr].roledest =='03' && response.message.static_user.group_record.avail_roles.role[mr].roletype == '01')
									{
									desc1 = response.message.static_user.group_record.avail_roles.role[mr].role_description;
									val1 = response.message.static_user.group_record.avail_roles.role[mr].name;
									dojo.create("option", { value: val1, innerHTML: desc1/*, textValue: desc1*/}, availrolelistref);
									}
								}
						}
						// if there are available roles are not empty and has only single role
						else{
							if(response.message.static_user.group_record.avail_roles.role.roledest =='03' && response.message.static_user.group_record.avail_roles.role.roletype == '01')
							{
								dojo.byId("company_avail_list_nosend").add(dojo.create("option", {/* text: response.message.static_user.group_record.avail_roles.role.role_description,*/
								innerHTML : response.message.static_user.group_record.avail_roles.role.role_description,
								value: response.message.static_user.group_record.avail_roles.role.name}));
							}
						}
					
						
					}
					}
			}
			
			//available roles for bank and bank group users

			// avaialble roles for bankgroup side
			if(response.message.static_user.company_type == '02')
						{
								// if the available roles are not empty
									if(response.message.static_user.group_record.avail_roles)
									{
										

										// if there are available roles are not empty and has more than 1 role
										if(response.message.static_user.group_record.avail_roles.role.length > 0)
										{
											response.message.static_user.group_record.avail_roles.role.sort(GetSortOrder("role_description"));
										for(var n = 0; n < response.message.static_user.group_record.avail_roles.role.length; n++)
												{
													if(response.message.static_user.group_record.avail_roles.role[n].roledest =='02' &&
															 response.message.static_user.group_record.avail_roles.role[n].roletype == '01')
													{
														//response.message.static_user.group_record.avail_roles.role.sort(GetSortOrder("role_description"));
														desc1 = response.message.static_user.group_record.avail_roles.role[n].role_description;
														val1 = response.message.static_user.group_record.avail_roles.role[n].name;
														dojo.create("option", { text: desc1, value: val1, innerHTML: desc1, textValue: desc1}, availrolelistref);
													}
												}
										}
										// if there are available roles are not empty and has only single role
										else{
										if(response.message.static_user.group_record.avail_roles.role[n].roledest =='02' &&
												 response.message.static_user.group_record.avail_roles.role.roletype == '01')
												{
										  						dojo.byId("company_avail_list_nosend").add(dojo.create("option", { text: response.message.static_user.group_record[i].avail_roles.role.role_description,
																innerHTML : response.message.static_user.group_record.avail_roles.role.role_description,
																value: response.message.static_user.group_record.avail_roles.role.name}));
												}
											}
										
									}
						}
						
						
						// avaialble roles for bank side
			            if(response.message.static_user.company_type == '01')
						{
								// if the available roles are not empty
									if(response.message.static_user.group_record.avail_roles)
									{
										

										// if there are available roles are not empty and has more than 1 role
										if(response.message.static_user.group_record.avail_roles.role.length > 0)
										{
											response.message.static_user.group_record.avail_roles.role.sort(GetSortOrder("role_description"));
										for(var p = 0; p < response.message.static_user.group_record.avail_roles.role.length; p++)
												{
													if(response.message.static_user.group_record.avail_roles.role[p].roledest =='01' &&
															 response.message.static_user.group_record.avail_roles.role[p].roletype == '01')
													{
														desc1 = response.message.static_user.group_record.avail_roles.role[p].role_description;
														val1 = response.message.static_user.group_record.avail_roles.role[p].name;
														dojo.create("option", { text: desc1, value: val1, innerHTML: desc1, textValue: desc1}, availrolelistref);
													}
												}
										}
										// if there are available roles are not empty and has only single role
										else{
										if(response.message.static_user.group_record.avail_roles.role[p].roledest =='01' &&
												 response.message.static_user.group_record.avail_roles.role.roletype == '01')
												{
										  						dojo.byId("company_avail_list_nosend").add(dojo.create("option", { text: response.message.static_user.group_record[i].avail_roles.role.role_description,
																innerHTML : response.message.static_user.group_record.avail_roles.role.role_description,
																value: response.message.static_user.group_record.avail_roles.role.name}));
												}
											}
										
									}
						}

			
			
			// populating roles for entities
			if(response.message.static_user.company_type == '03')
			{
				if(response.message.static_user.entity_record)
					{
				
				// populating existing roles for entities
			var entityroledesc,
			entityroleval,
			entityId,
			entflag,
			entityrolelistref,
			entflagval,
			defaultent = dj.byId("default_entity");
			 var option1 = document.createElement("OPTION");
			 option1.innerHTML = "";
			 option1.value= "";
			 if(defaultent)
				 {
				 	defaultent.set("item", option1);
				 }
			 			// if there are more than one entities related to company
						if(response.message.static_user.entity_record.length > 0)
						{
						for(var x1 in response.message.static_user.entity_record){
							if(response.message.static_user.entity_record[x1].default_entity == "Y"){
								var temp=response.message.static_user.entity_record[x1].entity_name;
								 var opt = document.createElement("OPTION");
								 opt.innerHTML = temp;
								 opt.value= temp;
								 defaultent.set("item", opt);
								break;
							}
						}
						for(var a=0; a < response.message.static_user.entity_record.length; a++)
							{
								entityId = response.message.static_user.entity_record[a].entity_id;
								entflag = dijit.byId("entity_flag_nosend_"+entityId);
								entityrolelistref = dojo.byId("entity_roles_exist_nosend_"+entityId);
								entityrolelistref.innerHTML="";
							    entflagval = response.message.static_user.entity_record[a].entity_flag;
							    entflag.set("value", entflagval);
							    // populating existing roles only when the entity is checked
							    if(entflagval == "Y")
							    {
							    	// if existing roles are not empty
							    	if(response.message.static_user.entity_record[a].existing_roles)
							    		{
							    			// if existing roles are not empty and having more than 1 role.
							    			if(response.message.static_user.entity_record[a].existing_roles.role.length > 0)
											 {
												for(var q = 0; q < response.message.static_user.entity_record[a].existing_roles.role.length; q++)
												{
												entityroledesc = response.message.static_user.entity_record[a].existing_roles.role[q].role_description;
												entityroleval = response.message.static_user.entity_record[a].existing_roles.role[q].name;
												dojo.create("option", { text: entityroledesc, value: entityroleval, innerHTML: entityroledesc, textValue: entityroledesc}, entityrolelistref);
												}
											 }
							    			// if existing roles are not empty and having only 1 role.
											else
											 {
												dojo.byId("entity_roles_exist_nosend_"+entityId).add(dojo.create("option", { text: response.message.static_user.entity_record[a].existing_roles.role.role_description, innerHTML:response.message.static_user.entity_record[a].existing_roles.role.role_description, value: response.message.static_user.entity_record[a].existing_roles.role.name}));
												
											 }
							    			
							    			dj.byId("entity_flag_nosend_"+entityId).set("checked", true);
									    	   misys.animate('wipeIn', "entity_roles_div_"+entityId);
							    		}
							    }
							    // if entity is not checked no action for existing roles
							    else
							    	{
							    	  dj.byId("entity_flag_nosend_"+entityId).set("checked", false);
							    	   misys.animate('wipeOut', "entity_roles_div_"+entityId);
							    	}
							}
						}
						
						// if there is single entity related to company
					else
						{
						if(response.message.static_user.entity_record.default_entity == "Y")
							{
								 var temp1=response.message.static_user.entity_record.entity_name;
								 var opt1 = document.createElement("OPTION");
								 opt1.innerHTML = temp1;
								 opt1.value= temp1;
								 defaultent.set("item", opt1);
							}
						entityId = response.message.static_user.entity_record.entity_id;
						entityrolelistref = dojo.byId("entity_roles_exist_nosend_"+entityId);
						entityrolelistref.innerHTML="";
						entflagval = response.message.static_user.entity_record.entity_flag;
						// populating existing roles only when the entity is checked
						if(entflagval == 'Y')
						{
							// if existing roles are not empty
							if(response.message.static_user.entity_record.existing_roles)
								{
							
								// if existing roles are not empty and having more than 1 role.
						if(response.message.static_user.entity_record.existing_roles.role.length>0)
						 {
							for(var r = 0; r < response.message.static_user.entity_record.existing_roles.role.length; r++)
							{
							entityroledesc = response.message.static_user.entity_record.existing_roles.role[r].role_description;
							entityroleval = response.message.static_user.entity_record.existing_roles.role[r].name;
							dojo.create("option", { text: entityroledesc, value: entityroleval, innerHTML: entityroledesc, textValue: entityroledesc}, entityrolelistref);
							}
							dj.byId("entity_flag_nosend_"+entityId).set("checked", true);
					    	   misys.animate('wipeIn', "entity_roles_div_"+entityId);
						 }
						
						// if existing roles are not empty and having only 1 role.
						else
						 {
							dojo.byId("entity_roles_exist_nosend_"+entityId).add(dojo.create("option", { text: response.message.static_user.entity_record.existing_roles.role.role_description, innerHTML:response.message.static_user.entity_record.existing_roles.role.role_description, value: response.message.static_user.entity_record.existing_roles.role.name}));
							
						 }
								}
						}
						
						// when the entity checkobox is unchecked, no need of populating existing roles
						else{
							dj.byId("entity_flag_nosend_"+entityId).set("checked", false);
					    	   misys.animate('wipeOut', "entity_roles_div_"+entityId);
						}
						}
					
						// to populate the available role list from available roles
						var entityavailroledesc,
						entityavailroleval,
						entityavailrolelistref,
						entflagval1,
						defaultentity = dj.byId("default_entity");
						
						// if there are more than one entities related to company
						if(response.message.static_user.entity_record.length > 0)
						{
						for(var b=0; b < response.message.static_user.entity_record.length; b++)
							{
								entityId = response.message.static_user.entity_record[b].entity_id;
								entflag = dijit.byId("entity_flag_nosend_"+entityId);
								entityavailrolelistref = dojo.byId("entity_roles_avail_nosend_"+entityId);
							    entflagval1 = response.message.static_user.entity_record[b].entity_flag;
							    entflag.set("value", entflagval1);
							    // 
							    if(entflagval1 == "Y")
							    {
							    	entityavailrolelistref.innerHTML="";
							    	// if available roles not empty
							    	if(response.message.static_user.entity_record[b].avail_roles)
							    		{
							    			// if available roles are not empty and having more than 1 role
							    			if(response.message.static_user.entity_record[b].avail_roles.role.length > 0)
											 {
							    				response.message.static_user.entity_record[b].avail_roles.role.sort(GetSortOrder("role_description"));
												for(var s = 0; s < response.message.static_user.entity_record[b].avail_roles.role.length; s++)
												{
												entityavailroledesc = response.message.static_user.entity_record[b].avail_roles.role[s].role_description;
												entityavailroleval = response.message.static_user.entity_record[b].avail_roles.role[s].name;
												dojo.create("option", { text: entityavailroledesc, value: entityavailroleval, innerHTML: entityavailroledesc, textValue: entityavailroledesc}, entityavailrolelistref);
												}
											 }
							    			// if available roles are not empty and having only 1 role
											else
											 {
												dojo.byId("entity_roles_avail_nosend_"+entityId).add(dojo.create("option", { text: response.message.static_user.entity_record[b].avail_roles.role.role_description, innerHTML:response.message.static_user.entity_record[b].avail_roles.role.role_description, value: response.message.static_user.entity_record[b].avail_roles.role.name}));
												
											 }
							    			
							    			dj.byId("entity_flag_nosend_"+entityId).set("checked", true);
									    	   misys.animate('wipeIn', "entity_roles_div_"+entityId);
							    		}
							    }
							    //
							    else
							    	{
							    	  dj.byId("entity_flag_nosend_"+entityId).set("checked", false);
							    	   misys.animate('wipeOut', "entity_roles_div_"+entityId);
							    	}
							}
						}
						
						// if only single entity is linked to company
					else
						{
						if(response.message.static_user.entity_record.default_entity == "Y")
							{
								 var tmp=response.message.static_user.entity_record.entity_name;
								 var op = document.createElement("OPTION");
								 op.innerHTML = tmp;
								 op.value= tmp;
								 defaultentity.set("item", op);
							}
						entityId = response.message.static_user.entity_record.entity_id;
						entityavailrolelistref = dojo.byId("entity_roles_avail_nosend_"+entityId);
						entflagval1 = response.message.static_user.entity_record.entity_flag;
						if(entflagval1 == 'Y')
						{
							entityavailrolelistref.innerHTML="";
							// if available roles not empty
							if(response.message.static_user.entity_record.avail_roles)
								{
								// if available roles are not empty and having more than 1 role
						if(response.message.static_user.entity_record.avail_roles.role.length>0 /*&& response.message.static_user.entity_record.avail_roles*/)
						 {
							response.message.static_user.entity_record.avail_roles.role.sort(GetSortOrder("role_description"));
							for(var t = 0; t < response.message.static_user.entity_record.avail_roles.role.length; t++)
							{
							entityavailroledesc = response.message.static_user.entity_record.avail_roles.role[t].role_description;
							entityavailroleval = response.message.static_user.entity_record.avail_roles.role[t].name;
							dojo.create("option", { text: entityavailroledesc, value: entityavailroleval, innerHTML: entityavailroledesc, textValue: entityavailroledesc}, entityavailrolelistref);
							}
							dj.byId("entity_flag_nosend_"+entityId).set("checked", true);
							/* misys.animate('wipeIn', "entity_roles_div_"+entityId);*/
						 }
						// if available roles are not empty and having only 1 role
						else
						 {
							dojo.byId("entity_roles_avail_nosend_"+entityId).add(dojo.create("option", {text: response.message.static_user.entity_record.avail_roles.role.role_description, innerHTML: response.message.static_user.entity_record.avail_roles.role.role_description,  value: response.message.static_user.entity_record.avail_roles.role.name}));
							
						 }
								}
						}
						
						else{
							dj.byId("entity_flag_nosend_"+entityId).set("checked", false);
					    	   misys.animate('wipeOut', "entity_roles_div_"+entityId);
						}
						}
						
				}
		}
			// populating roles for entitlement
		if(response.message.static_user.company_type == '03')
		{
			if(response.message.static_user.entitlement_record)
			{
				var entitlementId;
				var entitlementFlag = false;
				for(var t2 = 0; t2 < response.message.static_user.entitlement_record.length; t2++){
					entitlementId = response.message.static_user.entitlement_record[t2].entitlement_id;
					if(response.message.static_user.entitlement_code !== null && response.message.static_user.entitlement_code !== undefined && response.message.static_user.entitlement_code === response.message.static_user.entitlement_record[t2].entitlement_code && dj.byId("entitlement_flag_nosend_"+entitlementId) !== null && dj.byId("entitlement_flag_nosend_"+entitlementId) !== undefined)
					{
						entitlementFlag= true;
					}
				}
				for(var t1 = 0; t1 < response.message.static_user.entitlement_record.length; t1++)
				{
					entitlementId = response.message.static_user.entitlement_record[t1].entitlement_id;
					var subsidiaryIDValue;
					var entitlementCode = response.message.static_user.entitlement_record[t1].entitlement_code;
					var defaultSubsidiary = response.message.static_user.entitlement_record[t1].default_subsidiary;
					var subsidiaryIDListValue = response.message.static_user.entitlement_record[t1].subsidiary_List;
					if(subsidiaryIDListValue !== undefined && subsidiaryIDListValue.length > 0) {
						subsidiaryIDValue = subsidiaryIDListValue.substring(1,subsidiaryIDListValue.length-1);
					}
					if(response.message.static_user.entitlement_code !== null && response.message.static_user.entitlement_code !== undefined && response.message.static_user.entitlement_code === response.message.static_user.entitlement_record[t1].entitlement_code && dj.byId("entitlement_flag_nosend_"+entitlementId) !== null && dj.byId("entitlement_flag_nosend_"+entitlementId) !== undefined)
					{
						dj.byId("entitlement_flag_nosend_"+entitlementId).set("checked", true);
						misys.animate('wipeIn', 'userSubsidiaryTable_'+entitlementId);
						if(subsidiaryIDValue !== "" && subsidiaryIDValue !== undefined) {
							if(dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue)))
							{
								dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue)).set("checked",true);
								dijit.byId("subsidiary_radio_flag_nosend_".concat(subsidiaryIDValue)).set("checked",true);
								dijit.byId("default_subsidiary").set("value",defaultSubsidiary);
							}
							dijit.byId("entitlement_code").set("value",entitlementCode);
						}
					}
					else if (response.message.static_user.entitlement_code === "")
					{
						dj.byId("entitlement_flag_nosend_"+entitlementId).set("checked", false);
						dj.byId("entitlement_flag_nosend_"+entitlementId).set("disabled", false);
						misys.animate('wipeOut', 'userSubsidiaryTable_'+entitlementId);
						if(subsidiaryIDValue !== "" && subsidiaryIDValue !== undefined) {
							dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue)).set("checked",false);
							dijit.byId("subsidiary_radio_flag_nosend_".concat(subsidiaryIDValue)).set("checked",false);
						}
					}
					else
					{
						if (response.message.static_user.entitlement_code !== response.message.static_user.entitlement_record[t1].entitlement_code && !entitlementFlag) {
							dj.byId("entitlement_flag_nosend_"+entitlementId).set("disabled", false);
						} else if(dj.byId("entitlement_flag_nosend_"+entitlementId) !== null && dj.byId("entitlement_flag_nosend_"+entitlementId)) {
							dj.byId("entitlement_flag_nosend_"+entitlementId).set("disabled", true);
						}
					}
				}			
			}
		}
		if(d.byId("clone_user"))
		{
			d.byId('clone_user').checked = true;
		}
		console.debug("[misys.form.common] _PopulateCloneUserDetails : end ");
		}
		dj.byId("xhrDialog")?dj.byId("xhrDialog").hide():"";
	}
	
	function GetSortOrder(prop) {  
	    return function(a, b) {  
	        if (a[prop] > b[prop]) {  
	            return 1;  
	        } else if (a[prop] < b[prop]) {  
	            return -1;  
	        }  
	        return 0;  
	    };  
	}  
	
	
	
	/**
	 * <h4>Summary:</h4>
	 * This function is used to set the ajax response to the store id.
	 * <h4>Description:</h4> 
	 * The store value is refreshed with the ajax response for the search options.
	 * @param {Object} response
	 * @method _showExistingPoRefMsg
	 */
	function _showAjaxSearchData(response) {
		console.debug("[misys.form.common] _showAjaxSearchData : start ");
		if(response && response.items !=="")
		{
			var storeId = response.store_id ;
			var field = dj.byId(storeId);
			if(field && field.store)
			{
				var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"id","items" :[]}});
				var ctr = 0;
				dojo.forEach(response.items, function(item){
					var newItem = item;
					newItem.id = ctr++;
					emptyStore.newItem(newItem);
				});
				field.setStore(emptyStore);
				field.resize();
			}
		}
		console.debug("[misys.form.common] _showAjaxSearchData : end ");
	}
	
	// Public Functions and Variables
	d.mixin(m, {
		
		selectEntityBeforeBank : function()	{
			if(dj.byId("entity") && dj.byId("entity").get("value") == "" && Object.keys(misys._config.entityBankMap).length > 1)
			{
				var id = this.id;
				var onLoadCallback = function() {
					dj.byId(id).set("value", "");
					 dojox.fx.smoothScroll({
							node: document.getElementById("entity"), 
							win: window
						}).play();
				};
				
				m.dialog.show("ERROR", m.getLocalization("selectEntityBeforeBank"),"", onLoadCallback);
			}
		},
		populateBankAsPerEntity : function(bankFieldId) {
			var linkedBankBox = dj.byId(bankFieldId);
		    var banksArray = Object.keys(misys._config.entityBankMap).map(function(itm) { return misys._config.entityBankMap[itm]; });
			var jsonData = {
			    		"identifier" :"value",
			    		"items" : []
			    },
		    linkedBankBoxStore = new d.data.ItemFileWriteStore({
				data : jsonData
			});
			
			if(linkedBankBox) {
				linkedBankBox.store = null;
				
				for(var i = 0; i < banksArray.length; i++) {
					if (dj.byId("entity") && banksArray[i].indexOf(dj.byId("entity").get("value")) > -1) {
						linkedBankBoxStore.newItem({
						"value" : Object.keys(misys._config.entityBankMap).map(function(itm) { return misys._config.entityBankMap[itm]; })[i][0],
						"name" : Object.keys(misys._config.entityBankMap)[i]
						});
					}
				}
			}
			linkedBankBox.store = linkedBankBoxStore;
			var bankValue = dj.byId(bankFieldId)?dj.byId(bankFieldId).get("value"):"";
			var arrayLineItems = linkedBankBox.store._arrayOfAllItems;
			var flag = false;
			for(i=0;i<arrayLineItems.length;i++) {
				if(arrayLineItems[i] && arrayLineItems[i].value!="" && arrayLineItems[i].value==bankValue) {
					flag=true;
					break;
				}
			}	
			if(!flag)
				{
				dj.byId(bankFieldId).set("value", "");
				}
		},
		/**
		 * <h4>Summary:</h4> Populate a select box based on the content
		 * of the current bank and entity selection.
		 * @method populateReferences
		 */
		populateReferences : function() {
		    //  summary:
		    //        Populate a select box based on the content of the current bank and entity 
			//        selection.

			// Retrieve the prefix and set the name value;
			console.debug("[misys.form.common] Populating references ");
			
			// TODO Needs another refactor
			
			 var value = this.get("displayedValue"),
			    splitter = "_",
			    tokens = this.id.split(splitter),
			    prefix = tokens[0] + splitter + tokens[1],
			    referencesBox = dj.byId(prefix + "_customer_reference"),
			    applicantRefObj = dj.byId("applicant_reference") || 
			    					dj.byId("applicant_reference_hidden") || dj.byId("seller_reference") || dj.byId("drawer_reference") || dj.byId("buyer_reference"),
			    entity = dj.byId("entity") ? dj.byId("entity").get("value") : "",
			    currentReferencesIndex = this.get("value") + "_" + entity,
			    currentReferences = (m._config.customerReferences && 
			    					   m._config.customerReferences[currentReferencesIndex]) ?
			    						  m._config.customerReferences[currentReferencesIndex] : "",
			    jsonData = {
			    		"identifier" :"id",
			    		"items" : []
			    },
			    referenceBoxStore = new d.data.ItemFileWriteStore( {
					data : jsonData
				});
			    // changes done as part of MPS-49250 -Reverting the changes done for MPS-49250 solves MPS-53828					  
			    if(dj.byId(prefix + "_name"))
		    	{
					dj.byId(prefix + "_name").set("value", value);
		    	}

			// If the contents of currentReferences are undefined
			
			if(referencesBox) {
				// Clear references
				referencesBox.store = null;

				if(currentReferences && currentReferences.length !== 0) {
					console.debug("[misys.form.common]", currentReferences.length,  
							"refs were found");
					
					// Arrays are pairs of (description, value), so we 
					// iterate in groups of 2
					for(var i = 0, limit = (currentReferences.length) / 2; i < limit; i++){
						referenceBoxStore.newItem( {
							"id" : currentReferences[2 * i + 1],
							"name" : currentReferences[2 * i]
						});
					}
				} /*else {
					referenceBoxStore.newItem({
						"id" : "",
						"name" : ""
					});
				}*/
				referencesBox.store = referenceBoxStore;
				
				//Remove previously entered text if any
				if(referenceBoxStore._arrayOfAllItems.length === 1)
				{
					referencesBox.set("displayedValue",referenceBoxStore._arrayOfAllItems[0].name[0]);
				}
				else
				{
					if(applicantRefObj )
					{
						if(applicantRefObj.get("value")!=='' && currentReferences.indexOf(applicantRefObj.get("value"))!==-1)
						{
							referencesBox.set("value",applicantRefObj.get("value"));
						}
						else
						{
							referencesBox.item = null;
							applicantRefObj.set("value","");
							referencesBox.set("displayedValue","");
						}
					}
				}
			}
			if (dj.byId("product_code") && dj.byId("product_code").get("value") === "IO" && dj.byId("buyer_bank_bic"))
			{
				dj.byId("buyer_bank_bic").set("value", m._config.isoCodes[this.get("value")]);
			}
			if (dj.byId("product_code") && dj.byId("product_code").get("value") === "EA" && dj.byId("seller_bank_bic"))
			{
				dj.byId("seller_bank_bic").set("value", m._config.isoCodes[this.get("value")]);
			}
		}, 
		updateBusinessDate: function() {
			 var ownerBankDate = m._config.bankBusinessDate;
			 var currentDate;
			 var tempDate;
			if(this.get("value")!="")
			{
				var yearServer = parseInt(misys._config.businessDateForBank[this.get('value')][0].value.substring(0,4), 10);
				var monthServer = parseInt(misys._config.businessDateForBank[this.get('value')][0].value.substring(5,7), 10);
				var dateServer = parseInt(misys._config.businessDateForBank[this.get('value')][0].value.substring(8,10), 10);
				tempDate=new  Date(yearServer, monthServer - 1, dateServer);
				currentDate = d.date.locale.format((tempDate), {
					selector :"date"
				});
			    m._config.bankBusinessDate = misys._config.businessDateForBank[this.get('value')][0].name;
				if(m._config.bankBusinessDate != ownerBankDate)
					{
					 m.dialog.show("CUSTOM-NO-CANCEL", m.getLocalization("changeInBusinessDates"),"Warning",function(){});
					 if(dj.byId("appl_date"))
						{
							dj.byId("appl_date").set("value",currentDate);
							dojo.byId("appl_date_view_row").childNodes[1].innerHTML=dj.byId("appl_date").get("value");
						}
					}
			}
		},
		
		checkBeneficiaryNicknameDiv: function()
		{
			if(misys._config.beneficiarynickname==="true")
			{
				if(dj.byId("beneficiary_nickname") && dj.byId("beneficiary_nickname").get("value")!==""  && d.byId("beneficiarynickname") && d.byId("beneficiary_nickname_row")){
					d.style("ben_label", "display", "inline-block");
					d.byId("beneficiarynickname").innerHTML = dj.byId("beneficiary_nickname").get("value");
					d.byId("beneficiarynickname").value = dj.byId("beneficiary_nickname").get("value");
					d.style("beneficiarynickname", "display", "inline");
					m.animate("fadeIn", d.byId("beneficiary_nickname_row"));
				}else{
					if(d.byId("beneficiarynickname")){
						d.style("beneficiarynickname", "display", "none");	
						m.animate("fadeOut", d.byId("beneficiary_nickname_row"));
					}
				}
			}
		},
		
		checkBeneficiaryNicknameOnFormLoad : function()
		{
			if(misys._config.beneficiarynickname==="true" && dj.byId("beneficiary_nickname") && dj.byId("beneficiary_nickname").get("value")!=="" && dj.byId("beneficiary_nickname").get("value")!=="null" && d.byId("beneficiarynickname")){
				m.animate("fadeIn", d.byId("beneficiarynickname"));
				d.style("beneficiarynickname","display","inline");
				d.byId("beneficiarynickname").innerHTML = dj.byId("beneficiary_nickname").get("value");
			}else{
				m.animate("wipeOut", d.byId("beneficiary_nickname_row"));
			}
		},		
		
		/**
		 * <h4>Summary:</h4> 
		 * Set the currency of a set of amount
		 * fields 
		 * <h4>Description:</h4>  
		 * This function takes two
		 * parameters - a node (or id) of a Dijit
		 * containing a currency code, and a single ID
		 * or array of IDs for fields on which this
		 * currency should be set as a constraint
		 * @param {Dijit||String} node
		 *  A node of dijit containing currency code.
		 * @param {Array|| String} arr
		 *  A single ID or array of IDs for fields on which this currency should be set as a constraint
		 * @param {Object} constraints
		 * @method setCurrency
		 */
		setCurrency : function( /*Dijit|String*/ node,
                				/*Array|String*/ arr,
                				/*Object*/ constraints) {
			//  summary:
			//        Set the currency of a set of amount fields
			//	description:
			//		  This function takes two parameters - a node (or id) of a Dijit containing
			//		  a currency code, and a single ID or array of IDs for fields on which this
			//		  currency should be set as a constraint
			
			var currencyField = dj.byId(node),
				targetFieldIds = d.isArray(arr) ? arr : [arr],
				currency, field, cldrMonetary;
			
			if(currencyField && currencyField.get("value") !== "" &&
					currencyField.state !== "Error") {
				currency = currencyField.get("value");
				d.forEach(targetFieldIds, function(id){
					field  = dj.byId(id);
					if(field){
						console.debug("[misys.form.common] Setting currency code", currency, 
										"on field", id);
						cldrMonetary = d.cldr.monetary.getData(currency);
						//added as part of MPS-34571(5.4) fix.
						if (dj.byId("product_code") && ((dj.byId("product_code").get("value") === "IP")||(dj.byId("product_code").get("value") === "IN") || (dj.byId("product_code").get("value") === "PO") || (dj.byId("product_code").get("value") === "SO")))
						{
							currencyField.set("readOnly",true);
						}
						
						
						//Client specific (FIX ME : Need to find a solution to override common 
						//function's for client specific requirement)
						var monetaryConst = {round: cldrMonetary.round, 
											places: cldrMonetary.places,
											max:999999999999.99,
											min: 0.01};
						
						if(cldrMonetary.places === 2)
						{
							monetaryConst = {
								round: cldrMonetary.round,
								places: cldrMonetary.places,
								min:0.00,
								max:999999999999.99
							};
						}
						else if(cldrMonetary.places === 3)
						{
							monetaryConst = {
								round: cldrMonetary.round,
								places: cldrMonetary.places,
								min:0.000,
								max:99999999999.999
							};
						}
						else if(cldrMonetary.places === 0)
						{
							monetaryConst = {
								round: cldrMonetary.round,
								places: cldrMonetary.places,
								min:0,
								max:999999999999
							};
						}

						// Mixin any provided constraints
						d.mixin(monetaryConst, constraints);

						field.set("constraints", monetaryConst);
						field.set("value",field.get("value"));
					}
				});
			}
		},
						/**
						 * <h4>Summary:</h4> Populate the TNX amount 
						 * 
						 * <h4>Description:</h4>  Just a
						 * helper function 
						 * 
						 * @param String || Number
						 * @method setTnxAmt 
						 */
		setTnxAmt : function( /*String|number*/ amt) {
			//  summary:
		    //        Populate the TNX amount
			//  description:
			//        Just a helper function - tnx_amt doesn't always exist and its a pain to
			//        check every time
			
			var tnxAmt = dj.byId("tnx_amt");
			if(tnxAmt){
				tnxAmt.set("value", amt);
			}
		},
		setTnxCurCode : function(curCode) {
				//  summary:
		    //        Populate the TNX currency
			//  description:
			//        Just a helper function - tnx_cur_code doesn't always exist and its a pain to
			//        check every time
			var tnxCurCode = dj.byId("tnx_cur_code");
			if(tnxCurCode){
				tnxCurCode.set("value", curCode);
			}
		},
						/**
						 * <h4>Summary:</h4>
						 *  Amend the transaction amount by taking the
						 * value of the field "node", and either incrementing or
						 * decrementing the transaction amount.
						 * 
						 *  <h4>Description:</h4> 
						 * Amends the transaction amount by incrementing or
						 * decrementing the transaction amount (action chosen
						 * based on the ID of field "this"). If an increment is
						 * performed, the decrement field is disabled (and vice
						 * versa).
						 * 
						 * Note that the value of misys._config.productCode must
						 * be correctly set for this function to work.
						 * Previously, we were passing around the product code
						 * but we want to avoid that...
						 * 
						 * @method amendTransaction
						 * 
						 * 
						 */
		amendTransaction : function() {
			//  summary:
		    //        Amend the transaction amount by taking the value of the field
			//		  "node", and either incrementing or decrementing the transaction 
			//		  amount.
			//	description
			//		  Amends the transaction amount by incrementing or decrementing
			//		  the transaction amount (action chosen based on the ID of field "this").
			//		  If an increment is performed, the decrement field is disabled (and vice versa).
			//
			//		  Note that the value of misys._config.productCode must be correctly set
			//		  for this function to work. Previously, we were passing around the product code
			//		  but we want to avoid that...

			var otherField = ("inc_amt" === this.get("id")) ? 
								dj.byId("dec_amt") : dj.byId("inc_amt");
			
			if(!isNaN(this.get("value"))) {
				otherField.set("disabled", true);
			} else {
				this.set("disabled", false);
				otherField.set("disabled", false);
			}
			_calculateNewAmt(this);
		},
		amendTransactionBank : function() {
			var otherField = ("inc_amt_value" === this.get("id")) ? 
								dj.byId("dec_amt_value") : dj.byId("inc_amt_value");
			
			if(!isNaN(this.get("value"))) {
				otherField.set("disabled", true);
			} else {
				this.set("disabled", false);
				otherField.set("disabled", false);
			}
			_calculateNewAmt(this);
		}, 

		amendTransactionLiabAmt : function()
		{
			dj.byId("lc_liab_amt").set("value",dj.byId("org_lc_cur_code_liab_amt").value);
		},
		
		setPaymentDescriptionForCAD : function()
		{
			if (dojo.byId("date-value_description").innerHTML !== "" && dojo.byId("request_value_code").value === 'SPOT' && 
					dojo.byId("payment_cur_code").value ==='CAD' && dojo.byId("applicant_cur_code").value === 'USD')
			{
				dojo.byId("date-value_description").innerText = m.getLocalization("valueOneBusinessDayCADdeal");
			}
			else if (dojo.byId("date-value_description").innerHTML !== "" && dojo.byId("request_value_code").value === 'SPOT' && 
			 (dojo.byId("payment_cur_code").value !=='CAD' ||  dojo.byId("applicant_cur_code").value !== 'USD'))
			{
				dojo.byId("date-value_description").innerText = m.getLocalization("valueTwoBusinessDay");
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 *  Reset the increased and transaction amounts
		 *  
		 * <h4>Description:</h4> 
		 * @method  toggleAmendmentFields
		 */
		toggleAmendmentFields : function(){
			//  summary:
		    //        Reset the increased and tnx amounts
			//	decription:
			//		  TODO The business logic behind this needs to be better explained here
			//
			//	      Note that misys._config.productCode must be correctly set, otherwise
			//		  _calculateNewAmt will not be able to find certain fields.

			var incrementField = dj.byId("inc_amt"),
			    decrementField = dj.byId("dec_amt");
			// Reset the increased and tnx amount
			if(this.get("checked")){
				incrementField.set("value", "");
				incrementField.set("disabled", true);
				decrementField.set("disabled", false);
				_calculateNewAmt(decrementField);
			} else {
				incrementField.onBlur();
				decrementField.onBlur();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Update sub transaction type code depending upon Flag checked
		 * @method updateSubTnxTypeCode
		 */
		updateSubTnxTypeCode : function() {
			// summary:
			//		TODO Need a better explanation of the business logic here, particularly
			//		why the if/else logic is in this particular order
			
			var productCode = misys._config.productCode.toLowerCase(),
				incrementField = dj.byId("inc_amt"),
				decrementField = dj.byId("dec_amt"),
				releaseFlagField = dj.byId(productCode + "_release_flag"),
				subTnxTypeCodeField = dj.byId("sub_tnx_type_code"),
				subTnxTypeCode = "03", // default value
				incrementAmount = incrementField ? dojo.number.parse(incrementField.get("value")) : "",
				decrementAmount = decrementField ? dojo.number.parse(decrementField.get("value")) : "";
		
			if(releaseFlagField && releaseFlagField.get("checked")) {
				subTnxTypeCode = "05";
			} 
			else if(incrementField && !isNaN(incrementAmount) && incrementAmount !== "") {
				subTnxTypeCode = "01";
			}
			else if(decrementField && !isNaN(decrementAmount) && decrementAmount !== "") {
				subTnxTypeCode = "02";
			}
			
			if(subTnxTypeCodeField) {
				subTnxTypeCodeField.set("value", subTnxTypeCode);
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 * Enable a set of beneficiary fields.Do a loop over all the fields and enable all  of them.
		 * @method enableBeneficiaryFields
		 */
		enableBeneficiaryFields : function(){
			//  summary:
		    //        enable a set of fields
			
			var ids = ["beneficiary_address_line_1",
			           		"beneficiary_address_line_2", "beneficiary_dom", "beneficiary_address_line_4"];
			d.forEach(ids, function(id){
				var field = dj.byId(id);
				if(field) {
					field.set("disabled", false);
					field.set("readOnly", false);
				}
			});
		}, 
		/**
		 * <h4>Summary:</h4>
		 * Setting action required depending upon product status code
		 * @method toggleProdStatCodeFields
		 */
		toggleProdStatCodeFields : function() {
			//  summary:
		    //        Actions for the prod stat code
			//	description:
			//		  TODO The business logic behind this function must be explained here
			// 		  TODO This code needs to be reviewed, and compared with v3. Not clear
			//			   at all what its doing
			
			var prodStatCode = dj.byId("prod_stat_code").get("value"),
			    actionReqCodeField = dj.byId("action_req_code"),
			    //Comment for TF maturity getting disable on reporting status selection
			    //requiredFields = ["tnx_amt", "maturity_date"],
			   // nonRequiredFields = ["tnx_amt", "maturity_date", "latest_answer_date"];
			 	requiredFields = ["tnx_amt"],
			    nonRequiredFields = ["tnx_amt", "latest_answer_date"];
			
			if(actionReqCodeField)
			{
				if (prodStatCode === "01" || prodStatCode === "18") {
					actionReqCodeField.set("readOnly", true);
					actionReqCodeField.reset();
				} 
				else if(prodStatCode === "12") {
					actionReqCodeField.set("value", "12");
					actionReqCodeField.set("readOnly", true);
				    m.toggleFields(false, ["latest_answer_date"], requiredFields, true);
					requiredFields = ["tnx_amt"];
				}
				else if(prodStatCode === "26") {
					actionReqCodeField.set("value", "26");
					actionReqCodeField.set("readOnly", true);
					m.toggleFields(false, ["latest_answer_date"], requiredFields, true);
					requiredFields = ["tnx_amt"];
				}
				else if(prodStatCode === "78" || prodStatCode === "79" || (prodStatCode === "98" && dj.byId("product_code") && dj.byId("product_code").get("value") === "TF")) {
					actionReqCodeField.set("value", "07");
					actionReqCodeField.set("readOnly", true);
				}
				else if(prodStatCode === "A9") {
					actionReqCodeField.reset();
					actionReqCodeField.set("readOnly", false);
					nonRequiredFields = ["tnx_amt"];
					requiredFields = [];
				}
				else if(prodStatCode === "31") {
					var productCode = dj.byId("product_code").get("value");
					if(dj.byId("product_code") && (productCode === "LC" || productCode === 'SI' || productCode === 'BG' || productCode === 'SG')) {
						actionReqCodeField.set("value", "");
						actionReqCodeField.set("readOnly", true);
					} else {
						actionReqCodeField.set("value", "03");
						actionReqCodeField.set("readOnly", true);
					}
				}
				else if(prodStatCode === "81") {
					actionReqCodeField.set("value", "05");
					actionReqCodeField.set("readOnly", true);
				}
				else {
					//actionReqCodeField.reset();
					actionReqCodeField.set("readOnly", false);
					nonRequiredFields = ["latest_answer_date"];
				}
			}
			
			var toggleTnxAmt = (prodStatCode === "08" && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") === "03") ? true : !(prodStatCode !== "01" && prodStatCode !== "07" &&
					prodStatCode !== "04" && prodStatCode !== "05" &&
					prodStatCode !== "12" && prodStatCode !== "26" && prodStatCode !== "13" &&
					prodStatCode !== "14" && prodStatCode !== "15" && prodStatCode !== "A9");

			m.toggleFields(toggleTnxAmt, nonRequiredFields, requiredFields);
		},
	/**
	 * <h4>Summary:</h4>
	 * Toggle the guarantee text rich text editor. Must be called via d.connect.
	 * If bg_text_type_code is 04 animate the guarantee text field otherwise do a fade out.
	 * @method toggleGuaranteeText
	 */
		toggleGuaranteeText : function() {
			//  summary:
			//          Toggle the guarantee text rich text editor. Must be called via d.connect.
			
			var value = this.get("value"),
			    documentEditorDiv = d.byId("document-editor"),
			    bgDocument = dj.byId("bg_document");
			
			m.toggleFields(value === "03", null, ["bg_text_type_details"]);
			if(value === "04") {
				m.animate("fadeIn", documentEditorDiv, function(){
				console.debug("[misys.form.common] - toggleGuaranteeText - Test editor");
					if (!bgDocument) {
						var attachPoint = d.byId("bg_document");
						bgDocument = new dj.Editor({
							id: "bg_document",
							name: "bg_document",
							rows: _defaultEditorRows,
							cols: _defaultEditorCols,
							maxSize: _defaultEditorMaxSize,
							plugins:[
							         "undo", "redo", "|", "bold", "italic", "underline", "strikethrough", 
							         "|", "insertOrderedList", "insertUnorderedList", "|", "indent", 
							         "outdent", "|", "justifyLeft", "justifyRight", "justifyCenter", 
							         "justifyFull", "||",
							         {
							        	 name: "dijit._editor.plugins.FontChoice", 
							        	 command: "fontName"
							         },
							         {
							        	 name: "m.editor.plugins.ProductFieldChoice", 
							        	 command: "misysEditorPluginsProductFieldChoice", 
							        	 product: "BG"
							         }
							        ]
							}, attachPoint);
						var rteContentDiv = d.byId("rteContent");
						var rteContent = rteContentDiv.innerHTML;
						rteContent.replaceAll("&lt;", "<");
						rteContent.replaceAll("&gt;", ">");
						rteContent.replaceAll("&amp;", "&");
						bgDocument.set("value", (rteContent || ""));
					}
				});
			} else {
				m.animate("fadeOut", documentEditorDiv, function(){
					if (bgDocument){
						bgDocument.set("value", "");
					}
				});
			}
		},
		
						/**
						 * <h4>Summary:</h4> 
						 * Set buyer reference on issuing bank
						 * reference change. 
						 * <h4>Description:</h4>  
						 * Another helper function to avoid repetition.
						 * @method setBuyerReference
						 */
		setBuyerReference : function() {
			//  summary:
		    //        Set buyer reference on issuing bank reference change.
			//  description:
			//        Another helper function to avoid repetition
			//
			
			var buyerRefObj = dj.byId("buyer_reference") || 
									dj.byId("buyer_reference_hidden");
			if(buyerRefObj) {
				buyerRefObj.set("value", this.get("value"));
			}
		},
						/**
						 * <h4>Summary:</h4> 
						 * Set Seller reference on issuing bank
						 * reference change.
						 *  
						 * <h4>Description:</h4>  Another helper
						 * function to avoid repetition
						 * @method setSellerReference 
						 */
		setSellerReference : function() {
			//  summary:
		    //        Set Seller reference on issuing bank reference change.
			//  description:
			//        Another helper function to avoid repetition
			//
			
			var sellerRefObj = dj.byId("seller_reference") || 
									dj.byId("seller_reference_hidden");
			if(sellerRefObj) {
				sellerRefObj.set("value", this.get("value"));
			}
		},
		
		setApplicantReference : function() {
			//  summary:
		    //        Set applicant reference on issuing bank reference change.
			//  description:
			//        Another helper function to avoid repetition
			//
			
			var applicantRefObj = dj.byId("applicant_reference") || 
									dj.byId("applicant_reference_hidden");
			if(applicantRefObj) {
				applicantRefObj.set("value", this.get("value"));
			}
		},

				/**
				 * <h4>Summary:</h4>
				 *  Recompute the maturity date based on the issue date and the tenor.
				 *  @method getMaturityDate 
				 */
		getMaturityDate : function() {
			//  summary:
		    //        Recompute the maturity date based on the issue date and the tenor.
			var tenorField = dj.byId("tenor"),
				tenor = tenorField.get("value"),
				issDate = dj.byId("iss_date").get("value"),
				maturityDateField = dj.byId("maturity_date"),
				newValue = "";
			
			// If we've changed the maturity date, then change the tenor
			if(this.id === "maturity_date") {
				newValue = issDate ? 
								d.date.difference(issDate, this.get("value"), "day") : tenor;
				tenorField.set("value", newValue);
			} else if(tenor !== '' && issDate) {
				maturityDateField.set("value", d.date.add(issDate, "day", tenor));
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *  This function manages the deletion of the counterparties.
		 *  First it check if new currency code is not same as the ft_cur_code's value,
		 *  It means currency change has happened now delete the counterparties or reset them.
		 *  @method initFTCounterparties
		 */
		initFTCounterparties : function(){
			//  summary:
		    //        This function manages the deletion of the counterparties.
			
			var inputCurCode = this.get("value"),
				that;
			
			if(inputCurCode !== dj.byId("ft_cur_code").get("value")){
				console.debug(
						"[misys.form.common] Currency change, may have to delete counterparties"); 
				if(d.query(
						".widgetContainer *[id^='counterparty_details_document_id_']").length > 0){
					that = this; // For closure reference, below
					m.dialog.show("CONFIRMATION", 
							m.getLocalization("modifyFundTransferCurrencyConfirmation"), "",
							function() {
								_resetFTCounterparties(that);
							}
					);
				} else {
					_resetFTCounterparties(this);
				}
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 * Disabling non acceptance field.It depends on the value of the term_code ,disable the fields if its value os '01'.
		 * @method disableNonAcceptanceFields
		 */
		disableNonAcceptanceFields : function(){
			// summary:
			//
			
			if(dj.byId("term_code").get("value") === "01") {
				console.debug("[misys.form.common] Disabling Protest non-acceptance");
				this.set("checked", false);
			}
		}, 

								/**
								 * <h4>Summary:</h4> 
								 * Set the value for the credit bank
								 * name, and perform other actions. 
								 * @method setCreditAvailBy
								 * 
								 */
		setCreditAvailBy : function() {
			//  summary:
		    //        Set the value for the credit bank name, and perform other actions.
			//	description:
			//			TODO Business logic explanation should go here
			
			var bankType = this.get("value"),
				crAvlBankName = dj.byId("credit_available_with_bank_name"),
				crAvlCode = dj.byId("fakeform1").get("value").cr_avl_by_code,
				crAvlBankNameValue, crAvlBankAdd1Value,
				crAvlBankAdd1 = dj.byId("credit_available_with_bank_address_line_1");
			
			console.debug("[misys.form.common] Setting Credit/Available By Values for bank type", 
								bankType);
			m.toggleFields(bankType === m._config.other, 
					["credit_available_with_bank_address_line_1",
					"credit_available_with_bank_address_line_2",
					"credit_available_with_bank_dom",
					"credit_available_with_bank_address_line_4"]);
			
			crAvlBankNameValue = crAvlBankName.get("value");
			crAvlBankAdd1Value = crAvlBankAdd1.get("value");
			// address-line-1 is a mandatory field
		    if((!(crAvlBankNameValue != '' && crAvlBankAdd1Value != '') && (dj.byId("formLoad") && dj.byId("formLoad").get("value") === "false") || !dj.byId("formLoad")) || (dj.byId("template_id") && dj.byId("template_id").getValue() !== ''))
			{
				crAvlBankName.set("value", this.get("displayedValue"));
			}
			
			
			console.debug(
					"[misys.form.common] credit_available_with_bank_name now has the value",  
					crAvlBankName.get("value"));
			
			var keepFieldValues = 
				(!crAvlBankNameValue && !dj.byId("tenor_maturity_date").get("value") && !dj.byId("tenor_days").get("value") && !dj.byId("tenor_period").get("value") && !dj.byId("tenor_from_after").get("value") && !dj.byId("tenor_days_type").get("value") && !m._config.firstPageLoad);
			
			if(keepFieldValues) {
				// Drawee Bank Details
				if(crAvlCode) {
					_toggleDraweeBankDetails(crAvlCode, bankType);
				}
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Populates the Bank Fields based on SWIFT BIC CODE from My Banks and Other banks
		 * @param {Boolean} includeCustomerBanks
		 * @param {String} swiftWidgetId
		 * @param {Array} arrayOfBankFields
		 * @param {Array} arrayOfRequiredFields
		 * @param {String} bankType
		 * @param {Boolean} populateFlag
		 * @param {Boolean} toggleRequired
		 * @param {Booelan} toggleReadOnly
		 * @param {String} country
		 * @method getSwiftBankDetails
		 */
		getSwiftBankDetails : function(/*boolean*/ includeCustomerBanks,
									   /*String*/swiftWidgetId, 
									   /*String*/ brch_code,
									   /*Array*/arrayOfBankFields, 
									   /*Array*/arrayOfRequiredFields,
									   /*String*/bankType, 
									   /*boolean*/ populateFlag,
									   /*boolean*/ toggleRequired,
									   /*boolean*/toggleReadOnly, 
									   /*String*/ country){
			/** 
			 * <h4>Summary:</h4>
			 * Populates the Bank Fields based on SWIFT BIC CODE from My Banks and Other banks
			 */
			var retValid = false;
			if (!country)
			{
				country = "";
			}
				
			if(!arrayOfBankFields)
			{
				arrayOfBankFields = [bankType+"name", bankType+"address_line_1", bankType+"address_line_2", 
				                         	bankType+"dom", bankType+"contact_name", bankType+"phone", bankType+"country"];
			}
					
			if(!arrayOfRequiredFields)
			{
				arrayOfRequiredFields = [bankType+"name", bankType+"address_line_1", bankType+"country"];
			}
										
			var swiftWidget = dj.byId(swiftWidgetId);
			var brchcode= dj.byId(brch_code);
			if(swiftWidget && (swiftWidget.get("value") !== ""))
			{
				d.forEach(arrayOfBankFields,function(node){
					if(dj.byId(node))
					{
						if(populateFlag)
						{
							dj.byId(node).set("value","", false);
						}
						if(toggleReadOnly)
						{
							dj.byId(node).set("readOnly",true);
						}
					}
				});
				if(toggleRequired)
				{
					d.forEach(arrayOfRequiredFields,function(node){
						if(dj.byId(node))
						{
							m.toggleRequired(node, true);
						}
					});
					}
				
				if(populateFlag && (swiftWidget.validate()))
				{
					var bicCodeValue = "";
					var brchCodeValue = "";
					if(swiftWidget.get("value"))
					{
						bicCodeValue = swiftWidget.get("value");
					}
					if(brchcode && (brchcode.get("value")))
					{
					brchCodeValue = brchcode.get("value");
					}
				
					//AJAX Call
					m.xhrPost({
								url : misys.getServletURL("/screen/AjaxScreen/action/GetSwiftBankDetails"),
								content : {
									bicCode : bicCodeValue,
									brchCode: brchCodeValue,
									country : country,
									customerBanks : includeCustomerBanks
								},
								sync : true,
								handleAs : "json",
								load : function(response, args){
									
								    //Response 
									var swiftBankDetails = response;
									retValid = response.valid;
									if(retValid)
									{
										var arrayOfDetails = [swiftBankDetails.bankName, swiftBankDetails.bankAddressLine1, 
										                      swiftBankDetails.bankAddressLine2, swiftBankDetails.bankDom, swiftBankDetails.bankContactName,
										                      swiftBankDetails.bankPhone, swiftBankDetails.bankCountry];
										
										d.forEach(arrayOfBankFields,function(node,i){
											if(dj.byId(node))
											{
												if(i < 7)
												{
													dj.byId(node).set("value", arrayOfDetails[i], false);
												}
											}
										});
									}
									else
									{
										var displayMessage = "";
										// focus on the widget and set state to error and
										// display a tooltip indicating the same
										if((swiftWidget && (swiftWidget.get("value") !== "")))
										{
											swiftWidget.focus();
											displayMessage = m.getLocalization("swiftValidationFailed", [swiftWidget.get("value")]);
											swiftWidget.set("value", "");
											swiftWidget.set("state", "Error");
											dijit.hideTooltip(swiftWidget.domNode);
											dijit.showTooltip(displayMessage,swiftWidget.domNode, 0);
										}
									}
								},
								customError : function(response, args){
									console.warn("getSwiftBankDetails error");
								}
						});
				}
				else
				{
					if(dijit.byId("bank_iso_code"))
					{
					// If ISO code not valid, enable it so that user can correct it
					setTimeout(function(){
						dijit.byId("bank_iso_code").set("readOnly", false);
					}, 600);
				}
				}
			}
			else
			{
				d.forEach(arrayOfBankFields,function(node){
					if(dj.byId(node))
					{
						if(toggleReadOnly)
						{
							dj.byId(node).set("readOnly",false);
						}
					}
				});
				if(toggleRequired)
				{
					d.forEach(arrayOfRequiredFields,function(node){
					if(dj.byId(node))
					{
							m.toggleRequired(node, false);
						}
				});
					}
				if(d.byId(bankType+"iso_code_row") && d.byId(bankType+"iso_code_row").parentNode && d.byId(bankType+"iso_code_row").parentNode.id)
									{
					var tabId = d.byId(bankType+"iso_code_row").parentNode.id;
					if(dj.byId(tabId))
					{
						var title = dj.byId(tabId).get("title");
						if(title.indexOf("*") !== -1)
						{
							title = title.substring(title.indexOf(">")+1,title.lastIndexOf("<"));
							console.debug(tabTitle,title);
							if(title.indexOf("*") !== -1)
							{
								title = title.substring(title.indexOf("*")+1);
								console.debug(tabTitle,title);
								dj.byId(tabId).set("title",title);
							}
							else
							{
								dj.byId(tabId).set("title",title);
							}
						}
					}
				}
			}
			
		},
		
		
		
		getIFSCCodeDetails : function(
				   /*String*/ifscWidgetId, 
				   /*Array*/arrayOfBankFields, 
				   /*Array*/arrayOfRequiredFields,
				   /*String*/bankType, 
				   /*boolean*/ populateFlag,
				   /*boolean*/ toggleRequired,
				   /*boolean*/toggleReadOnly){
				/** 
				* <h4>Summary:</h4>
				* Populates the Bank Fields based on SWIFT BIC CODE from My Banks and Other banks
				*/
				var retValid = false;
				
				if(!arrayOfBankFields)
				{
					arrayOfBankFields = [bankType+"ifsc_name", bankType+"ifsc_address_line_1", bankType+"ifsc_address_line_2", 
					                         	bankType+"ifsc_city"];
				}
				
				
				if(!arrayOfRequiredFields)
				{
				arrayOfRequiredFields = [bankType+"ifsc_code", bankType+"ifsc_name"];
				}
									
				var ifscWidget = dj.byId(ifscWidgetId);
				if(ifscWidget && (ifscWidget.get("value") !== ""))
				{
					d.forEach(arrayOfBankFields,function(node){
						if(dj.byId(node))
						{
							if(populateFlag)
							{
								dj.byId(node).set("value","", false);
							}
							if(toggleReadOnly)
							{
								dj.byId(node).set("readOnly",true);
							}
						}
					});
					
				if(toggleRequired)
				{
				d.forEach(arrayOfRequiredFields,function(node){
					if(dj.byId(node))
					{
						m.toggleRequired(node, true);
					}
				});
				}
				
				if(populateFlag && (ifscWidget.validate()))
				{
				var ifscCodeValue = "";
				if(ifscWidget.get("value"))
				{
					ifscCodeValue = ifscWidget.get("value");
				}
				//AJAX Call
				m.xhrPost({
							url : misys.getServletURL("/screen/AjaxScreen/action/GetIFSCCodeDetails"),
							content : {
								ifscCode : ifscCodeValue,
								paramId  : "P701"
							},
							sync : true,
							handleAs : "json",
							load : function(response, args){
								
							    //Response 
								var ifscCodeDetails = response;
								retValid = response.valid;
								if(retValid)
								{
									var arrayOfDetails = [ifscCodeDetails.bankName, ifscCodeDetails.bankAddressLine1, 
									                      ifscCodeDetails.bankAddressLine2, ifscCodeDetails.city];
									
									d.forEach(arrayOfBankFields,function(node,i){
										if(dj.byId(node))
										{
											if(i < 7)
											{
												dj.byId(node).set("value", arrayOfDetails[i], false);
											}
										}
									});
											ifscWidget.set("value", ifscCodeDetails.bankIFSCCode);
								}
								else
								{
									var displayMessage = "";
									// focus on the widget and set state to error and
									// display a tooltip indicating the same
									if((ifscWidget && (ifscWidget.get("value") !== "")))
									{
										ifscWidget.focus();
										displayMessage = m.getLocalization("ifscCodeValidationFailed", [ifscWidget.get("value")]);
										ifscWidget.set("value", "");
										ifscWidget.set("state", "Error");
										dijit.hideTooltip(ifscWidget.domNode);
										dijit.showTooltip(displayMessage,ifscWidget.domNode, 0);
									}
								}
							},
							customError : function(response, args){
								console.warn("getSwiftBankDetails error");
							}
					});
				}
				else
				{
				// If ISO code not valid, enable it so that user can correct it
				setTimeout(function(){
					dijit.byId("bank_iso_code").set("readOnly", false);
				}, 600);
				}
				}
				else
				{
				d.forEach(arrayOfBankFields,function(node){
				if(dj.byId(node))
				{
					if(toggleReadOnly)
					{
						dj.byId(node).set("readOnly",false);
					}
				}
				});
				if(toggleRequired)
				{
				d.forEach(arrayOfRequiredFields,function(node){
				if(dj.byId(node))
				{
						m.toggleRequired(node, false);
					}
				});
				}
				if(d.byId(bankType+"ifsc_code_row") && d.byId(bankType+"ifsc_code_row").parentNode && d.byId(bankType+"ifsc_code_row").parentNode.id)
								{
				var tabId = d.byId(bankType+"ifsc_code_row").parentNode.id;
				if(dj.byId(tabId))
				{
					var title = dj.byId(tabId).get("title");
					if(title.indexOf("*") !== -1)
					{
						title = title.substring(title.indexOf(">")+1,title.lastIndexOf("<"));
						console.debug(tabTitle,title);
						if(title.indexOf("*") !== -1)
						{
							title = title.substring(title.indexOf("*")+1);
							console.debug(tabTitle,title);
							dj.byId(tabId).set("title",title);
						}
						else
						{
							dj.byId(tabId).set("title",title);
						}
					}
				}
				}
				}
				
				},
		/**
		 * <h4>Summary:</h4>
		 * This function is for setting swift details on blur event
		 * @param {Boolean} includeCustomerBanks
		 * @param String swiftWidget
		 * @param Array arrayOfBankFields
		 * @param Array arrayOfRequiredFields
		 * @param String bankType
		 * @param Boolean populateFlag
		 * @param Boolean toggleRequired
		 * @param Boolean toggleRequired
		 * @param String toggleReadOnly
		 * @param String country
		 * @method setSwiftBankDetailsForOnBlurEvent
		 */
		setSwiftBankDetailsForOnBlurEvent : function(/*boolean*/ includeCustomerBanks,
													   /*String*/swiftWidget, 
													   /*String*/brch_code,
													   /*Array*/arrayOfBankFields, 
													   /*Array*/arrayOfRequiredFields,
													   /*String*/bankType, 
													   /*boolean*/ populateFlag,
													   /*boolean*/ toggleRequired,
													   /*boolean*/toggleReadOnly, 
													   /*String*/ country){
			if(m._config.isBankDetailsPopulated)
			{
				m.getSwiftBankDetails(includeCustomerBanks, swiftWidget,brch_code,arrayOfBankFields,arrayOfRequiredFields,bankType,false,toggleRequired,toggleReadOnly,country);
			}
			else
			{
				m.getSwiftBankDetails(includeCustomerBanks, swiftWidget,brch_code,arrayOfBankFields,arrayOfRequiredFields,bankType,populateFlag,toggleRequired,toggleReadOnly,country);
			}
			m._config.isBankDetailsPopulated = false;
		},
		
		setIFSCCodeDetailsForOnBlurEvent : function(
				   /*String*/ifscWidget, 
				   /*Array*/arrayOfBankFields,
				   /*Array*/arrayOfRequiredFields,
				   /*String*/bankType, 
				   /*boolean*/ populateFlag,
				   /*boolean*/ toggleRequired,
				   /*boolean*/toggleReadOnly){
			
			m.getIFSCCodeDetails(ifscWidget,arrayOfBankFields,arrayOfRequiredFields,bankType,populateFlag,toggleRequired,toggleReadOnly);
			},
		/**
		 * <h4>Summary:</h4>
		 * Toggels the display of draft terms.Basically check for the value of draftTermType Toggels the fields.For toggeling it calls m.toggleFields.
		 * @param {String} draftTermType
		 * @method toggleDraftTerm
		 */
		toggleDraftTerm : function( /*String*/ draftTermType) {
			//  summary:
		    //        Toggles the display of the draft term
			//	description:
			//		  TODO Add business logic description here
			
			var keepFieldValues = 
					(!dj.byId("tenor_maturity_date").get("value") && !dj.byId("tenor_days").get("value") && !dj.byId("tenor_period").get("value") && !dj.byId("tenor_from_after").get("value") && !dj.byId("tenor_days_type").get("value") && !m._config.firstPageLoad);
			if(!d.isString(draftTermType)) {
				draftTermType = this.get("value");
			}
			m.toggleFields(draftTermType === "02", null, 
							["tenor_maturity_date"], keepFieldValues); 
			m.toggleFields(draftTermType === "03", null, 
					["tenor_days", "tenor_period", "tenor_from_after", "tenor_days_type"],
					keepFieldValues);
			m.toggleFields(draftTermType === "05", null, 
					["draft_term"],
					keepFieldValues);
			if(dj.byId("tenor_days_type").get("value") !== "99"){
				dj.byId("tenor_type_details").set("value", "");
			}
			if(dj.byId("tenor_days_type"))
			{
				var tenorDaysType = dj.byId("tenor_days_type").get("value") === "99";
				m.toggleFields((tenorDaysType),
						null, ["tenor_type_details"]);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *  Control the drawee details value.It checks for the values of the flags credit avail by code 2 and 3.
		 *  If both are not checked set the values of all the address field to empty and fade out the drawee details image.
		 *  Otherwise fade in the drawee datails bank image.
		 *  <h4>Description:</h4> 
		 *  Initilaise Drawee fields
		 *  @method initDraweeFields
		 */
		initDraweeFields : function() {
			//  summary:
		    //        Control the drawee details value.
			//	description:
			//		  TODO Add business logic description here
			
			var crAvlByCode2Checked = false; 
			if(dj.byId("cr_avl_by_code_2")) {
				crAvlByCode2Checked = dj.byId("cr_avl_by_code_2").get("checked");
			}
			
			var crAvlByCode3Checked = false; 
			if(dj.byId("cr_avl_by_code_3")) {
				crAvlByCode3Checked = dj.byId("cr_avl_by_code_3").get("checked");
			} 
			
			if(!crAvlByCode2Checked && !crAvlByCode3Checked){
				dj.byId("drawee_details_bank_name").set("value", "");
				if (dj.byId("drawee_details_bank_iso_code")){
					dj.byId("drawee_details_bank_iso_code").set("value", "");
				}
				if(dj.byId("drawee_details_bank_address_line_1")) {
					dj.byId("drawee_details_bank_address_line_1").set("value", "");
					dj.byId("drawee_details_bank_address_line_2").set("value", "");
					dj.byId("drawee_details_bank_dom").set("value", "");
					dj.byId("drawee_details_bank_address_line_4").set("value", "");
				}
				if (d.byId('drawee_details_bank_img'))
				{
					m.animate("fadeOut","drawee_details_bank_img");
				}
			}
			else
			{
				if (d.byId('drawee_details_bank_img'))
				{
					m.animate("fadeIn","drawee_details_bank_img");
				}
			}
			
			m.toggleFields(
					crAvlByCode2Checked || crAvlByCode3Checked,
					["drawee_details_bank_address_line_2", "drawee_details_bank_dom", "drawee_details_bank_address_line_4"],
					["drawee_details_bank_name", "drawee_details_bank_address_line_1", "drawee_details_bank_iso_code"],
					true);
			
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'){
				m.toggleRequired("drawee_details_bank_address_line_1",false);
			}
			
			//MPSSC-14966 - Drawee Details non mandatory for LC and SI
			var productCode = dj.byId("product_code").get("value") ;
			var isDraweeRequired = !JSON.parse(misys._config.drawee_details_nonmandatory);
			if(dj.byId("product_code") && (productCode === "LC" || productCode === 'SI') && (crAvlByCode2Checked || crAvlByCode3Checked))
			{
				if (dj.byId("drawee_details_bank_iso_code") && dj.byId("drawee_details_bank_name") && dj.byId("drawee_details_bank_address_line_1"))
				{
					m.toggleRequired("drawee_details_bank_iso_code", isDraweeRequired);
					m.toggleRequired("drawee_details_bank_name", false);
					m.toggleRequired("drawee_details_bank_address_line_1", isDraweeRequired);
				}
			}
		},
						/**
						 * <h4>Summary:</h4>
						 * Shows the particular form fields depending
						 * on the selection made in "Credit Available By".
						 * @method togglePaymentDraftAt
						 */
		togglePaymentDraftAt: function() {
			//  summary:
		    //        Shows the particular form fields depending on the selection made in 
			//        "Credit Available By".
			//	description:
			//		  TODO Add business logic explanation here 
			//
			
			var tenorType1 = dj.byId("tenor_type_1"),
				tenorType2 = dj.byId("tenor_type_2"),
				tenorType3 = dj.byId("tenor_type_3"),
				draftTerm = dj.byId("draft_term"),
				crAvlByCode = this.get("value"),
				paymentDraftDiv = d.byId("payment-draft"),
				draftTermDiv = d.byId("draft-term"),
				creditAvlBankType = dj.byId("credit_available_with_bank_type");
			
			// to prevent error with undefined variable
			if (!tenorType1 || !tenorType2 || !tenorType3){
				return;
			}
			
			tenorType1.set("disabled", true);
			tenorType2.set("disabled", true);
			tenorType3.set("disabled", true);
			
			// Everything disabled and cleared by default
			// TODO Look at getting rid of this, seems hacky
			if(m._config.firstPageLoad && crAvlByCode !== "05") {
				draftTerm.set("value", "");
			}

			// By default, display payment draft
			if(crAvlByCode !== "05" && d.style(paymentDraftDiv, "opacity") !== 1){
				m.animate("fadeOut", draftTermDiv);
				m.animate("fadeIn", paymentDraftDiv);
			}

			switch(crAvlByCode) {
			 case "01":
				tenorType1.set("disabled", false);
				tenorType1.set("checked", true);
				m.toggleDraftTerm("01");
				break;
			 case "02":
				tenorType2.set("disabled", false);
				tenorType3.set("disabled", false);
				if(dj.byId("tenor_maturity_date").get("displayedValue") !== ""){
					tenorType2.set("checked", true);
					m.toggleDraftTerm("02");
					draftTerm.set("value", dj.byId("tenor_maturity_date").get("displayedValue"));
					break;
				} else{
					tenorType3.set("checked", true);
					m.toggleDraftTerm("03");
					break;
				}
				break;
			 case "03":
				tenorType1.set("disabled", false);
				tenorType2.set("disabled", false);
				tenorType3.set("disabled", false);
				if(tenorType1.get("checked")){
				   tenorType1.set("checked", true);
				   m.toggleDraftTerm("01");
				   break;
				} 
				else if(dj.byId("tenor_maturity_date").get("displayedValue") !== ""){
				   tenorType2.set("checked", true);
				   m.toggleDraftTerm("02");
				   break;
				}
				else{
				   tenorType3.set("checked", true);
				   m.toggleDraftTerm("03");
				   break;
				}
				break;
			 case "06":
				 tenorType1.set("disabled", true);
				 tenorType2.set("disabled", true);
				 tenorType3.set("disabled", true);
				 m.toggleDraftTerm("01");
				 break;
			 case "04":
				tenorType2.set("disabled", false);
				tenorType3.set("disabled", false);
				if(dj.byId("tenor_maturity_date").get("displayedValue") !== ""){
					tenorType2.set("checked", true);
					m.toggleDraftTerm("02");
					break;
				} else{
					tenorType3.set("checked", true);
					m.toggleDraftTerm("03");
					break;
				}
				break;
			 case "05":
				m.animate("fadeOut", paymentDraftDiv);
				m.animate("fadeIn", draftTermDiv);
				tenorType1.set("checked", false);
				tenorType2.set("checked", false);
				tenorType3.set("checked", false);
				m.toggleDraftTerm("05");
				break;
			 default:
				break;
			}
			
			var tnx_type_code_val='01';
			if(dj.byId("tnx_type_code")){
				tnx_type_code_val = dj.byId("tnx_type_code").get("value");
			}
			if(creditAvlBankType && !(tnx_type_code_val=== '03')) {
				_toggleDraweeBankDetails(crAvlByCode, creditAvlBankType.get("value"));
			}
			m.initDraweeFields();
		},
		/**
		 * <h4>Summary:</h4>
		 * Calculates the maturity date based on the base date and the tenor period
		 * @method calcMaturityDate
		 */
		calcMaturityDate : function(){
			if(dj.byId("tenor_days").get("value")!=="" && !isNaN(dj.byId("tenor_days").get("value")) && dj.byId("tenor_period").get("value")!=="" && dj.byId("tenor_from_after").get("value")!==""){
				var baseDate = dj.byId("tenor_base_date").get("value");
				var tenorDays = dj.byId("tenor_days").get("value");
				var tenorPeriod = dj.byId("tenor_period").get("value");
				var interval,milliSecTillDate = null;
				var maturityDate;
					
				switch(tenorPeriod){
				case "D": 
						interval= "day";
						break;
				case "W": 
						interval="week";
						break;
				case "M": 
						interval= "month";
						break;
				case "Y": 
						interval= "year";
						break;
				default:
					break;
					
				}
				var tenorFromAfter = dj.byId("tenor_from_after").get("value");
				
				if (dj.byId("tenor_base_date").get("displayedValue")!=="") 
				{
					milliSecTillDate = d.date.add(baseDate,interval, tenorDays);
					
					if(tenorFromAfter === "F" )
					{
						milliSecTillDate = d.date.add(milliSecTillDate,"day", -1);
					}
					
					maturityDate= new Date(milliSecTillDate.getTime());
					maturityDate = d.date.locale.format(maturityDate, {
						selector :"date"
					});
					dj.byId("tenor_maturity_date").set("displayedValue", maturityDate);
					//Added as part of MPS-50580
					dj.byId("tenor_maturity_date").set("disabled", true);
				}
				else {
					dj.byId("tenor_maturity_date").set("displayedValue", "");					
				}
				
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Toggels the display of all tenor fields.Basically check for the value of tenorType Toggels the fields.For toggeling it calls m.toggleFields.
		 * @method toggleTenorFields
		 */
		toggleAllTenorFields : function() {
			
			var keepFields = ["tenor_days", "tenor_period", "tenor_from_after" , "tenor_base_date" , "tenor_maturity_date" , "tenor_days_type"];
			if(m._config.isBank){
				keepFields = ["tenor_days", "tenor_period", "tenor_from_after" ,"tenor_base_date","tenor_maturity_date","tenor_days_type"];
			}
			var tenor2Checked = dj.byId("tenor_type_2").get("checked");
			var tenor3Checked;
			if (dj.byId("tenor_type_3")) {
				tenor3Checked = dj.byId("tenor_type_3").get("checked");
			}
			var termCodeValue = dj.byId("term_code") ? dj.byId("term_code").get("value") : "";
			
			if(tenor2Checked)
			{	
				m.toggleFields(tenor2Checked, ["tenor_days_type"], keepFields, tenor2Checked, tenor2Checked);
				if(dojo.query(tenorLabel)[0].innerHTML.indexOf("*")=== -1){
					dojo.query(tenorLabel)[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query(tenorLabel)[0].innerHTML;
				}
				m.toggleRequired("tenor_days_type", true);
				m.toggleRequired("tenor_days", true);
				m.toggleRequired("tenor_period", true);
				m.toggleRequired("tenor_from_after", true);
				m.toggleRequired("tenor_maturity_date", true);
				// Made following fields optional and enabled for the issue MPS-42032 
				m.toggleRequired("tenor_maturity_date", false);
				m.toggleRequired("tenor_base_date", false);
				/*dj.byId("tenor_maturity_date").set("disabled", false);
				dj.byId("tenor_base_date").set("disabled", false);*/
				if(termCodeValue === "03" || (termCodeValue === "02" && !dj.byId("tenor_type_3"))){
					m.animate("fadeIn", d.byId("boe"));
			}
			}
			else if(tenor3Checked)
			{	
				m.toggleFields(tenor3Checked, ["tenor_days_type"], keepFields, tenor3Checked, tenor3Checked);
				if(dojo.query(tenorLabel)[0].innerHTML.indexOf("*")=== -1){
					dojo.query(tenorLabel)[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query(tenorLabel)[0].innerHTML;
				}
				m.toggleRequired("tenor_days_type", true);
				m.toggleRequired("tenor_days", true);
				m.toggleRequired("tenor_period", true);
				m.toggleRequired("tenor_from_after", true);	
				if(dj.byId("tenor_type_2").get("checked")){
					m.toggleRequired("tenor_base_date", false);
					m.toggleRequired("tenor_maturity_date", false);
				} else {
					m.toggleRequired("tenor_base_date", true);
					m.toggleRequired("tenor_maturity_date", true);
				}	
				if(termCodeValue === "03" || (termCodeValue === "02" && !dj.byId("tenor_type_3"))){
					m.animate("fadeIn", d.byId("boe"));
			}
			}
				
			else
			{
				dojo.query(tenorLabel)[0].innerHTML = m.getLocalization("tenorPeriod");
				m.toggleRequired("tenor_days_type", false);
				m.toggleRequired("tenor_days", false);
				m.toggleRequired("tenor_period", false);
				m.toggleRequired("tenor_from_after", false);
				m.toggleRequired("tenor_maturity_date", false);
				//m.toggleRequired("tenor_base_date", true);
				dj.byId("tenor_type_details").set("displayedValue", "");
				dj.byId("tenor_type_details").set("disabled", true);
				dj.byId("tenor_maturity_date").set("displayedValue", "");
				dj.byId("tenor_days").set("displayedValue", "");
                dj.byId("tenor_days").set("disabled", true);
                dj.byId("tenor_period").set("displayedValue", "");
                dj.byId("tenor_period").set("disabled", true);
                dj.byId("tenor_from_after").set("displayedValue", "");
                dj.byId("tenor_from_after").set("disabled", true);
                dj.byId("tenor_days_type").set("displayedValue", "");
                dj.byId("tenor_days_type").set("disabled", true);
                dj.byId("tenor_base_date").set("displayedValue", "");
                dj.byId("tenor_base_date").set("disabled", true);
				// Made following fields enabled for the issue MPS-42032 
				/*dj.byId("tenor_maturity_date").set("disabled", true);
				dj.byId("tenor_base_date").set("disabled", true);*/
				if(termCodeValue === "03" || (termCodeValue === "02" && !dj.byId("tenor_type_3"))){
					m.animate("fadeOut", d.byId("boe"));
					if (dj.byId("boe_flag")) {
						dj.byId("boe_flag").set("checked", false);
					}
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Toggles bank-side "payment draft at" fields.Create an array of all the fields to clear.
		 * Loop through the array and reset all fields one by one.
		 * @method toggleBankPaymentDraftAt
		 */
		toggleBankPaymentDraftAt : function() {
			//  summary:
		    //        Toggles bank-side "payment draft at" fields.
			
			var field, 
				fieldsToClear = ["draft_term", "drawee_details_bank_name", 
			                     "drawee_details_bank_address_line_1",
			                     "drawee_details_bank_address_line_2", 
			                     "drawee_details_bank_dom","drawee_details_bank_address_line_4", "drawee_details_bank_iso_code",
			                     "drawee_details_bank_reference"];
			    

			d.forEach(fieldsToClear, function(id){
				field = dj.byId(id);
				if(field) {
					field.reset();
				}
			});
		},
/**
 * <h4>Summary:</h4>
 * Write or set the draft termm value
 * <h4>Description:</h4> 
 * Checks the value of tenor_type_1.If this falg is checked set the value of draftTerm to "Sight".If tenor_type_2 is checked set  the value of maturity date if it is there.
 * Otherwise set the tenor period.
 * @method setDraftTerm
 * 
 */
		setDraftTerm : function() {
			//  summary:
		    //        Write the draft term value.
			
			var draftTerm = dj.byId("draft_term"),
				tenorPeriodLabels = misys._config.tenorPeriodLabels,
				tenorFromAfterLabels = misys._config.tenorFromAfterLabels,
				tenorDaysTypeLabels = misys._config.tenorDaysTypeLabels,
				period,
				fromAfter,
				days,
				daysType;
			
			if(draftTerm){
				if(!(dj.byId("cr_avl_by_code_5") && dj.byId("cr_avl_by_code_5").get("checked"))){
					draftTerm.set("value", "");
				}
						
				if(dj.byId("tenor_type_1") && dj.byId("tenor_type_1").get("checked")) {
					draftTerm.set("value", m.getLocalization("tenorSight"));
				}				
				else if((dj.byId("tenor_type_2") && dj.byId("tenor_type_2").get("checked")) && 
						dj.byId("tenor_maturity_date").get("displayedValue") !== "") {
					draftTerm.set("value",
							dj.byId("tenor_maturity_date").get("displayedValue"));
				}
				else {
					period = dj.byId("tenor_period").get("value");
					fromAfter = dj.byId("tenor_from_after").get("value");
					days = dj.byId("tenor_days").get("value");
					daysType = dj.byId("tenor_days_type").get("value");
			
					if(!isNaN(days) && days !== 0 || ( days === 0 && daysType === "07" ) ) {
						if(daysType !== "99") {
							draftTerm.set("value", days + " " + tenorPeriodLabels[period] + " " + 
								tenorFromAfterLabels[fromAfter] + " " + 
									tenorDaysTypeLabels[daysType]);
						} else {
							draftTerm.set("value", days + " " + tenorPeriodLabels[period] + " " + 
								tenorFromAfterLabels[fromAfter] + " " + 
									dj.byId("tenor_type_details").get("value"));
						}
					} 
				}
				console.debug("[misys.form.common] draft_term value is now", 
						draftTerm.get("value"));
			}
		}, 
/**
 * <h4>Summary:</h4>
 * Control draft days read only.
 * If tenor_type_3 is not checked set Draft Days to read only.
 * @method setDraftDaysReadOnly
 */
		setDraftDaysReadOnly : function() {
			//  summary:
		    //        Control draft days read only.
			//
			//	TODO Add business logic reasoning here
			
			this.set("readOnly", !dj.byId("tenor_type_3").get("checked"));
		}, 

								/**
								 * <h4>Summary:</h4>
								 *  Validate the Irrevocable flag
								 * against the Transferable and Stand By flags
								 * (if required).
								 */
		checkIrrevocableFlag : function() {
			//  summary:
		    //        Validate the Irrevocable flag against the Transferable and 
			//        Stand By flags (if required).
			//	TODO Add business logic reasoning here
			
			var ntrfFlag = dj.byId("ntrf_flag"),
			    stndByLcFlag = dj.byId("stnd_by_lc_flag");

			if(!this.get("checked") && ntrfFlag && stndByLcFlag && !ntrfFlag.get("checked") && 
						stndByLcFlag.get("checked")){
				this.set("checked", true);
				m.showTooltip(m.getLocalization("irrevocableStandByError"), 
						this.domNode, ["before"]);
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 *  Check the Non Transferable flag against the Irrevocable and Stand By flags.
		 *  @method checkNonTransferableFlag
		 */
		checkNonTransferableFlag : function() {
			//  summary:
		    //        Check the Non Transferable flag against the Irrevocable and Stand By flags.
			//	TODO Add business logic reasoning here
			
			var irvFlag = dj.byId("irv_flag"),
			    stndByLcFlag = dj.byId("stnd_by_lc_flag");

			if(!this.get("checked") && irvFlag && stndByLcFlag && !irvFlag.get("checked") && 
					stndByLcFlag.get("checked")){
				this.set("checked", false);
				irvFlag.set("checked", true);
				m.showTooltip(m.getLocalization("irrevocableStandByError"), 
						irvFlag.domNode, ["before"]);
			}
		}, 

								/**
								 * <h4>Summary:</h4> 
								 * Check the Stand By flag against the
								 * Irrevocable and Non Transferable flag. It
								 * checks if stnd_by_lc_flag is set in which
								 * this function was called .Checks for the
								 * values of Irrevocable and Non Transferable
								 * flag also if both are not checked .Make check
								 * of the Irrevocable falg true and show an
								 * error .
								 * @checkStandByFlag
								 */
		checkStandByFlag: function() {
			//  summary:
		    //        Check the Non Transferable flag against the Irrevocable and Non Transferable flag.
			//	TODO Add business logic reasoning here
			//  TODO Check against v3 
			
			var irvFlag = dj.byId("irv_flag"),
			    ntrfFlag = dj.byId("ntrf_flag");

			if(this.get("checked") && ntrfFlag && irvFlag &&
						!ntrfFlag.get("checked") && !irvFlag.get("checked")) {
					irvFlag.set("checked", true);
					m.showTooltip(m.getLocalization("irrevocableStandByError"), 
							irvFlag.domNode, ["before"]);
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 *   Reset the confirmation charges according to the confirmation instructions.
		 *   @method resetConfirmationCharges
		 */
		resetConfirmationCharges : function() {
			//  summary:
		    //        Reset the confirmation charges according to the confirmation instructions.
			if(m._config.charge_splitting_lc){
				if(dj.byId("open_chrg_brn_by_code_3")){ // if defined
					if(!dj.byId("cfm_chrg_brn_by_code_3").get("checked")) {
						dj.byId("cfm_chrg_brn_by_code_1").set("checked", false);
						dj.byId("cfm_chrg_brn_by_code_2").set("checked", this.get("value") !== "03");
						dj.byId("cfm_chrg_brn_by_code_3").set("checked", false);
					}
					if(dj.byId("cfm_inst_code_3").get("checked")) {
						dj.byId("cfm_chrg_brn_by_code_1").set("checked", false);
						dj.byId("cfm_chrg_brn_by_code_2").set("checked", this.get("value") !== "03");
						dj.byId("cfm_chrg_brn_by_code_3").set("checked", false);
	
						dj.byId("cfm_chrg_applicant").set("disabled", true).set("value", "").set("required", false);
						dj.byId("cfm_chrg_beneficiary").set("disabled", true).set("value", "").set("required", false);
					}
				}
			}
			else
			{
				if(dj.byId("cfm_chrg_brn_by_code_1")){
					dj.byId("cfm_chrg_brn_by_code_1").set("checked", false);
				}
				if(dj.byId("cfm_chrg_brn_by_code_2")){
					dj.byId("cfm_chrg_brn_by_code_2").set("checked", this.get("value") !== "03");
				}			
			}
			
			var effect = (this.get("value") === "01" || this.get("value") === "02") ? "fadeIn" : "fadeOut";
            m.animate(effect, d.byId("cfm_chrg_brn_by_code_div"));
			//Execute this piece of code only for SWIFT 2018 SWITCH ON
			if(m._config.swift2018Enabled){
				if(this.get("value") === "01" || this.get("value") === "02"){
					m.animate("fadeIn", d.byId("requested-conf-party"));
					m.toggleFields(true ,["req_conf_party_flag"],null,null,true);
					dj.byId("req_conf_party_flag").set("value",advBank);		
				}
				else{
					m.animate("fadeOut", d.byId("requested-conf-party"));
					m.toggleFields(false , 
							["req_conf_party_flag","requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_address_line_4","requested_confirmation_party_iso_code"],null,null,false);
				}			
			}
			
		}, 	 
		/**
		 * <h4>Summary:</h4>
		 *   Reset the confirmation charges according to the confirmation instructions for ILC Product
		 *   This also validates the conditions when Requested Confirmation Party details need to be displayed 
		 *   on selection of Confirmation Instructions
		 *   @method resetConfirmationChargesLC
		 *   
		 */
		resetConfirmationChargesLC : function() {
			
			var companyCode;
			var parentTabRCF;
			//_userType is defined in Topdemobank.vm
			//companycode is used to identify the company of user who is logged into the application.
			if (document.getElementById("_userType"))
			{
				companyCode = document.getElementById("_userType").getAttribute('value');
			}
			var userType = (companyCode !== '03' && companyCode !== '06') ? "bank":"customer";
			
			if(dj.byId("cfm_chrg_brn_by_code_1")){
				dj.byId("cfm_chrg_brn_by_code_1").set("checked", false);
			}
			if(dj.byId("cfm_chrg_brn_by_code_2")){
				dj.byId("cfm_chrg_brn_by_code_2").set("checked", this.get("value") !== "03");
			}
			var effect = (this.get("value") === "01" || this.get("value") === "02") ? "fadeIn" : "fadeOut";
            m.animate(effect, d.byId("cfm_chrg_brn_by_code_div"));
			
			var reqConfParty=dj.byId("req_conf_party_flag");
			var reqConfPartyFiltered=dj.byId("req_conf_party_flag_filtered");
			var tnx_type_code_val='01';
			if(dj.byId("tnx_type_code")){
				tnx_type_code_val = dj.byId("tnx_type_code").get("value");
			}
			var prod_stat_code_val='01';
			if(dj.byId("prod_stat_code")){
				prod_stat_code_val = dj.byId("prod_stat_code").get("value");
			}
			if(reqConfPartyFiltered && ((tnx_type_code_val=== '15' && prod_stat_code_val === '08') ||
					tnx_type_code_val=== '03')){
				reqConfParty=reqConfPartyFiltered;
			}
			//SWIFT 2018
			//If confirmation instructions is Without then reset the value of req_conf_party_flag and do not display the block requested-conf-party-bank-details
			if(this.get("value") === "01" || this.get("value") === "02"){
				reqConfParty.set("disabled",false);
				reqConfParty.set("value","");	
//				if(userType === "bank"){
//					m.toggleRequired(reqConfParty,true);
//		    	}
			}else{
				if(userType === "bank"){
					m.toggleRequired(reqConfParty,false);
					//If the transaction is of amendment type in existing records,we have 2 RCF's and hence this needs to be executed again
					//for amendment reqConfParty will actually refer to dj.byId("req_conf_party_flag_filtered")
					if((tnx_type_code_val=== '15' && prod_stat_code_val === '08') || tnx_type_code_val=== '03'){
							var originalrcf=dj.byId("req_conf_party_flag");
							m.toggleRequired(originalrcf,false);
					}
					parentTabRCF = dj.byId("req_conf_party_flag").parentTab;
					m.resetTabState(dijit.byId(parentTabRCF));
		    	}
				reqConfParty.set("disabled",true);
				reqConfParty.set("value","");
				d.byId(reqConfParBankDet).style.display = "none";
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 *   Validates before form is submitted for an Advising Bank,Advise Thru Bank and Other bank if 
		 *   1.Either Name and Address or BIC code is entered in the bank fields
		 *   2.Focusses the higlighted object which is missing
		 *   A pop up informing user about the error will be displayed to the user
		 *   @method validateBankEntry
		 *   
		 */
		validateBankEntry : function( bankType){	
			
			var bankName = dj.byId( bankType + "_name");
			var bankAddress = dj.byId(bankType + "_address_line_1");	
			var bankIsoCode = dj.byId(bankType + "_iso_code");		
			
			if(bankName.get("value") == "" && bankIsoCode.get("value") == "" && bankAddress.get("value") == ""){
				m.setRequiredFields([bankName,bankAddress] , true);
				bankName.focus();
				bankAddress.focus();			
				return false;
			}
			else if(bankIsoCode.get("value") == "" && (bankName.get("value") =="" || bankAddress.get("value") =="")){
				var focusObject = bankName.get("value") =="" ? bankName : bankAddress;
				m.setRequiredFields([focusObject] , true);
				focusObject.focus();				
				return false;
			}
			else{
				return true;
			}
		
		},
		/**
		 * <h4>Summary:</h4>
		 *  When RequestedConfirmationParty dropdown is changed,reset the required fields for advising,advise thru and other bank as per RCF selected
		 *   @method resetBankRequiredFields
		 *   
		 */
		resetBankRequiredFields : function () {			
			var reqConfFlagValue = this.get("value");
			var parentTabId;
			var bicCodeValue;
			if(reqConfFlagValue === "Other"){
				parentTabId=dj.byId("advising_bank_name").parentTab;
				//Reset tabstate of Advising bank to non mandatory if it was mandatory earlier
				m.resetTabState(dijit.byId(parentTabId));
				parentTabId=dj.byId("advise_thru_bank_name").parentTab;
				//Reset tabstate of advise_thru_bank_name to non mandatory if it was mandatory earlier
				m.resetTabState(dijit.byId(parentTabId));
				m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1","advise_thru_bank_name","advise_thru_bank_address_line_1"] , false);
				d.byId(reqConfParBankDet).style.display = "block";
				m.toggleFields(true , 
						["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_address_line_4","requested_confirmation_party_iso_code"],null,null,true);
				
			}
			else if(reqConfFlagValue === advBank){
				bicCodeValue = dj.byId("advising_bank_iso_code").get("value");
				parentTabId=dj.byId("advise_thru_bank_name").parentTab;
				//Reset tabstate of Advise thru bank to non mandatory if it was mandatory earlier
				m.resetTabState(dijit.byId(parentTabId));
				//If BIC Code is present,advising_bank_name and address will not be mandatory
				if(bicCodeValue!== "null" && bicCodeValue.length > 0){
					m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1"] , false);
				}else{
					m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1"] , true);
				}
				m.setRequiredFields(["advise_thru_bank_name","advise_thru_bank_address_line_1"] , false);
				d.byId(reqConfParBankDet).style.display = "none";
				m.toggleFields(false , 
						["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_address_line_4","requested_confirmation_party_iso_code"],null,null,false);
				
			}
			else if(reqConfFlagValue === "Advise Thru Bank"){
				bicCodeValue = dj.byId("advise_thru_bank_iso_code").get("value");
				parentTabId=dj.byId("advising_bank_name").parentTab;
				//Reset tabstate of Advising bank to non mandatory if it was mandatory earlier
				m.resetTabState(dijit.byId(parentTabId));
				//If BIC Code is present,advise_thru_bank_name and address will not be mandatory
				if(bicCodeValue!== "null" && bicCodeValue.length > 0){
					m.setRequiredFields(["advise_thru_bank_name","advise_thru_bank_address_line_1"] , false);
				}else{
					m.setRequiredFields(["advise_thru_bank_name","advise_thru_bank_address_line_1"] , true);
				}
				m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1"] , false);		
				d.byId(reqConfParBankDet).style.display = "none";
				m.toggleFields(false , 
						["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_address_line_4","requested_confirmation_party_iso_code"],null,null,false);
			
			}
			else{
				parentTabId=dj.byId("advising_bank_name").parentTab;
				//Reset tabstate of Advising bank to non mandatory if it was mandatory earlier
				m.resetTabState(dijit.byId(parentTabId));
				parentTabId=dj.byId("advise_thru_bank_name").parentTab;
				//Reset tabstate of advise_thru_bank_name to non mandatory if it was mandatory earlier
				m.resetTabState(dijit.byId(parentTabId));
				
				m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1","advise_thru_bank_name","advise_thru_bank_address_line_1"] , false);
				d.byId(reqConfParBankDet).style.display = "none";
				m.toggleFields(false , 
						["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_address_line_4","requested_confirmation_party_iso_code"],null,null,false);
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 *  Removes the mandatory state and warning icon message from the advisingbank,advise thru bank if they are not selected in 
		 *  Requested confirmation Party
		 *   @method resetTabState
		 *   @parameters:Tab header element
		 */
		resetTabState : function( /*dijit._Widget*/ tab) {
			
			if(tab){
				var title = tab.get("title");
				//If Mandatory * icon OR warning icon alt text image is present in the tab,they are to be removed from tab title
				if(title.indexOf("<img") !== -1 && title.indexOf("*")!== -1) {
					title = title.replace("*","");
					title = title.substring(0, title.indexOf("<img"));
				}
				//Only asterisk is present in the tab
				else if(title.indexOf("*")!== -1){    
					title = title.replace("*","");
				}
				tab.set("title", title);			
			}		
		},	
		/**
		 * <h4>Summary:</h4>
		 *   Disables Requested Confirmation Party if Confirmation instructions is Not 'Confirm' or 'Maybe'
		 *   @method resetRequestedConfirmationParty
		 *   
		 */
		resetRequestedConfirmationParty : function () {			
			var companyCode;
			var parentTabRCF;
			//_userType is defined in Topdemobank.vm
			//companycode is used to identify the company of user who is logged into the application.
			if (document.getElementById("_userType"))
			{
				companyCode = document.getElementById("_userType").getAttribute('value');
			}
			var userType = (companyCode !== '03' && companyCode !== '06') ? "bank":"customer";
			if(dijit.byId("cfm_inst_code_1") && !dijit.byId("cfm_inst_code_1").get("value") && !dijit.byId("cfm_inst_code_2").get("value")){
				if(dj.byId("req_conf_party_flag")){
					dj.byId("req_conf_party_flag").set("disabled",true);
				}
				if(dj.byId("req_conf_party_flag_filtered")){
                    dj.byId("req_conf_party_flag_filtered").set("disabled",true);
                    m.toggleRequired(dj.byId("req_conf_party_flag_filtered"),false);
                    parentTabRCF = dj.byId("req_conf_party_flag_filtered").parentTab;
                    m.resetTabState(dijit.byId(parentTabRCF));
				}
				//This check is done only on bank side to make RCF Flag and the tab non mandatory if confirmation istructions is without
				if(userType === "bank" && dj.byId("req_conf_party_flag")){
					m.toggleRequired(dj.byId("req_conf_party_flag"),false);
					parentTabRCF = dj.byId("req_conf_party_flag").parentTab;
					m.resetTabState(dijit.byId(parentTabRCF));
		    	}
			}
			else{
				if(dj.byId("req_conf_party_flag")){
					dj.byId("req_conf_party_flag").set("disabled",false);
					}
				if(dj.byId("req_conf_party_flag_filtered")){
					dj.byId("req_conf_party_flag_filtered").set("disabled",false);
				}
			}
			var effect = ( dijit.byId("cfm_inst_code_1").get("value") || dijit.byId("cfm_inst_code_2").get("value")) ? "fadeIn" : "fadeOut";
             m.animate(effect, d.byId("cfm_chrg_brn_by_code_div"));
			
		},

		/**
		 * <h4>Summary:</h4>
		 *   Modify UI to render/disable amendment related fields for BG
		 *   @method refreshUBGIforAmendment
		 *   
		 */
		refreshUIforBGAmendment: function() {
			var prod_stat_code_val = dj.byId("prod_stat_code").get("value");
			var tnx_type_code_val = dj.byId("tnx_type_code").get("value");
			
			if( (tnx_type_code_val=== '15' && prod_stat_code_val === '08') || (tnx_type_code_val=== '15' && prod_stat_code_val === '31') ||
					tnx_type_code_val=== '03'){
			
			  if(tnx_type_code_val=== '03'){
				if(d.byId("amd_no_date_display_div")){
					d.byId("amd_no_date_display_div").style.display="none";
					dj.byId("amd_date").set("disabled",false);
				}
			  }
			
		       if((tnx_type_code_val=== '15' && prod_stat_code_val === '08') || (tnx_type_code_val=== '15' && prod_stat_code_val === '31') ||
					(tnx_type_code_val=== '03' && prod_stat_code_val === '08')){
				if(d.byId("amd_no_date_display_div")){
					d.byId("amd_no_date_display_div").style.display="block";
					dj.byId("amd_date").set("disabled",false);
			}
				if(d.byId("amd_no_date_bg_display_div")){
					d.byId("amd_no_date_bg_display_div").style.display="block";
					dj.byId("amd_date").set("disabled",false);
			}
			}
		      
		}
			else {
				if(d.byId("amd_no_date_bg_display_div")){
					d.byId("amd_no_date_bg_display_div").style.display="none";
					dj.byId("amd_date").set("disabled",false);
			}		
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 *   Modify UI to render/disable amendment related fields 
		 *   @method refreshUIforAmendment
		 *   
		 */
		refreshUIforAmendment : function() {
			var prod_stat_code_val = dj.byId("prod_stat_code").get("value");
			var tnx_type_code_val = dj.byId("tnx_type_code").get("value");
			var sub_tnx_type_code_val = dj.byId("sub_tnx_type_code") ? dj.byId("sub_tnx_type_code").get("value") : '';
			
			if( (tnx_type_code_val=== '15' && prod_stat_code_val === '08') || (tnx_type_code_val=== '15' && prod_stat_code_val === '31') )
			{
				if(d.byId("amd_chrg_brn_by_code_div")){
				d.byId("amd_chrg_brn_by_code_div").style.display="block";
				}
				if(d.byId("cfm_chrg_brn_by_code_div")){
					d.byId("cfm_chrg_brn_by_code_div").style.display="block";
				}
				if(tnx_type_code_val=== '03'){
				if(d.byId("amd_no_date_display_div")){
					d.byId("amd_no_date_display_div").style.display="none";
					dj.byId("amd_date").set("disabled",false);
				}
				}
				if((tnx_type_code_val=== '15' && prod_stat_code_val === '08') || (tnx_type_code_val=== '15' && prod_stat_code_val === '31') ||
						(tnx_type_code_val=== '03' && prod_stat_code_val === '08')){
					if(d.byId("amd_no_date_display_div")){
						d.byId("amd_no_date_display_div").style.display="block";
						dj.byId("amd_date").set("disabled",false);
				}
				}
				
				m.toggleFields(false , 
						["advising_bank_name","advising_bank_address_line_1","advising_bank_address_line_2","advising_bank_dom","advising_bank_address_line_4","advising_bank_iso_code","advising_bank_reference"],null,true,null);
				m.toggleFields(false , 
						["advise_thru_bank_name","advise_thru_bank_address_line_1","advise_thru_bank_address_line_2","advise_thru_bank_dom","advise_thru_bank_address_line_4","advise_thru_bank_iso_code","advise_thru_bank_reference"],null,true,null);
				//d.byId("req_conf_party_flag_adv_bank_div").style.display="block";
				if(d.byId("req_conf_party_flag_filtered_div"))
				{
				d.byId("req_conf_party_flag_filtered_div").style.display="block";
				}
				if(dj.byId("req_conf_party_flag_filtered"))
				{
				dj.byId("req_conf_party_flag_filtered").set("value",dj.byId("req_conf_party_flag").getValue());	
				}
				if(d.byId("req_conf_party_flag_div"))
				{
				d.byId("req_conf_party_flag_div").style.display="none";	
				}
				m.resetRequestedConfirmationParty();
				if(dj.byId("req_conf_party_flag_filtered"))
				{
				m.setRequiredFields(['req_conf_party_flag_filtered'],true);
				}
				if(dj.byId("amd_chrg_brn_by_code_1") && !dj.byId("amd_chrg_brn_by_code_1").get("value") && !dj.byId("amd_chrg_brn_by_code_2").get("value") && !dj.byId("amd_chrg_brn_by_code_4").get("value") && (dj.byId("amd_chrg_brn_by_code_5") && !dj.byId("amd_chrg_brn_by_code_5").get("value")) && !dj.byId("amd_chrg_brn_by_code_9").get("value")){
					dj.byId("amd_chrg_brn_by_code_2").set("checked",true);
				}
				if(d.byId("advising_bank_name_img")){
					m.animate("wipeOut", d.byId('advising_bank_name_img'));
				}
				if(d.byId("advise_thru_bank_name_img")){
					m.animate("wipeOut", d.byId('advise_thru_bank_name_img'));
				}
				m.resetFormFields(["advising_bank_name","advising_bank_address_line_1","advising_bank_address_line_2","advising_bank_dom","advising_bank_address_line_4","advising_bank_iso_code","advising_bank_reference"]);
				m.resetFormFields(["advise_thru_bank_name","advise_thru_bank_address_line_1","advise_thru_bank_address_line_2","advise_thru_bank_dom","advise_thru_bank_address_line_4","advise_thru_bank_iso_code","advise_thru_bank_reference"]);
				
				if(m._config.narrativeDescGoodsDataStore || m._config.narrativeDocsReqDataStore || m._config.narrativeAddInstrDataStore || m._config.narrativeSpBeneDataStore || m._config.narrativeSpRecvbankDataStore) {
					m._config.currentNarrativeDescGoodsDataStore = m._config.narrativeDescGoodsDataStore;
					m._config.currentNarrativeDocsReqDataStore = m._config.narrativeDocsReqDataStore;
					m._config.currentNarrativeAddInstrDataStore = m._config.narrativeAddInstrDataStore;
					m._config.currentNarrativeSpBeneDataStore = m._config.narrativeSpBeneDataStore;
					m._config.currentNarrativeSpRecvbankDataStore = m._config.narrativeSpRecvbankDataStore;
				}
				
				if(d.byId("amend_narratives_display")) {
					d.byId("amend_narratives_display").style.display="block";
				}
				if(d.byId(viewNarrativeSwift)) {
					d.byId(viewNarrativeSwift).style.display="none";
				}
			}
			else if (tnx_type_code_val=== '15'){
				if(d.byId("amd_chrg_brn_by_code_div")){
				d.byId("amd_chrg_brn_by_code_div").style.display="none";
				}
				if(d.byId("cfm_chrg_brn_by_code_div")){
					d.byId("cfm_chrg_brn_by_code_div").style.display="none";
				}
				if(d.byId("amd_no_date_display_div")){
					dj.byId("amd_date").set("disabled",true);
					d.byId("amd_no_date_display_div").style.display="none";
				}
				m.toggleFields(true , 
						["advising_bank_name","advising_bank_address_line_1","advising_bank_address_line_2","advising_bank_dom","advising_bank_address_line_4","advising_bank_iso_code","advising_bank_reference"],null,true,null);
				m.toggleFields(true , 
						["advise_thru_bank_name","advise_thru_bank_address_line_1","advise_thru_bank_address_line_2","advise_thru_bank_dom","advise_thru_bank_address_line_4","advise_thru_bank_iso_code","advise_thru_bank_reference"],null,true,null);
				//d.byId("req_conf_party_flag_adv_bank_div").style.display="none";
				if(d.byId("req_conf_party_flag_filtered_div"))
					{
				d.byId("req_conf_party_flag_filtered_div").style.display="none";
					}
				if(d.byId("req_conf_party_flag_div"))
					{
				d.byId("req_conf_party_flag_div").style.display="block";
					}
				
				if(d.byId("advising_bank_name_img")){
					m.animate("wipeIn", d.byId('advising_bank_name_img'));
				}
				if(d.byId("advise_thru_bank_name_img")){
					m.animate("wipeIn", d.byId('advise_thru_bank_name_img'));
				}
				m.resetRequestedConfirmationParty();
				if(dj.byId("req_conf_party_flag_filtered")){
				m.setRequiredFields(['req_conf_party_flag_filtered'],false);
				}
				
				if(d.byId("amend_narratives_display")) {
					d.byId("amend_narratives_display").style.display="none";
				}
				if(d.byId(viewNarrativeSwift)) {
					d.byId(viewNarrativeSwift).style.display="block";
				}
				
				if(m._config.currentNarrativeDescGoodsDataStore) {
					m._config.narrativeDescGoodsDataStore = m._config.currentNarrativeDescGoodsDataStore;
					m._config.narrativeDocsReqDataStore = m._config.currentNarrativeDocsReqDataStore;
					m._config.narrativeAddInstrDataStore = m._config.currentNarrativeAddInstrDataStore;
					m._config.narrativeSpBeneDataStore = m._config.currentNarrativeSpBeneDataStore;
					m._config.narrativeSpRecvbankDataStore = m._config.currentNarrativeSpRecvbankDataStore;
				} else {
					m._config.narrativeDescGoodsDataStore = '';
					m._config.narrativeDocsReqDataStore = '';
					m._config.narrativeAddInstrDataStore = '';
					m._config.narrativeSpBeneDataStore = '';
					m._config.narrativeSpRecvbankDataStore = '';
					if(document.getElementById("narrativeDescriptionGoods")){
						document.getElementById("narrativeDescriptionGoods").innerHTML = "";
					}
					if(document.getElementById("narrativeDocumentsRequired")){
						document.getElementById("narrativeDocumentsRequired").innerHTML = "";
					}
					if(document.getElementById("narrativeAdditionalInstructions")){
						document.getElementById("narrativeAdditionalInstructions").innerHTML = "";
					}
					if(document.getElementById("narrativeSpecialBeneficiary")){
						document.getElementById("narrativeSpecialBeneficiary").innerHTML = "";
					}
					if(document.getElementById("narrativeSpecialReceivingBank")){
						document.getElementById("narrativeSpecialReceivingBank").innerHTML = "";
					}					
				}
			}else if((tnx_type_code_val=== '13' && !(sub_tnx_type_code_val === '12' || sub_tnx_type_code_val ==='19')) || tnx_type_code_val !=='13'){
				if(d.byId("amend_narratives_display")) {
					d.byId("amend_narratives_display").style.display="none";
				}
				if(d.byId(viewNarrativeSwift)) {
					d.byId(viewNarrativeSwift).style.display="block";
				}
			}
			
		},
		/**
		 * <h4>Summary:</h4>
		 *   Modify UI MO amendment to render/disable amendment related fields 
		 *   @method refreshUIforAmendment
		 *   
		 */
		refreshUIforAmendmentMO : function() {
			var prod_stat_code_val = dj.byId("prod_stat_code") ? dj.byId("prod_stat_code").get("value") : null;
			var tnx_type_code_val = dj.byId("tnx_type_code") ? dj.byId("tnx_type_code").get("value") : null;
			
			if( (tnx_type_code_val=== '15' && prod_stat_code_val === '08') || (tnx_type_code_val=== '15' && prod_stat_code_val === '31') ||
					tnx_type_code_val=== '03'){
				if(d.byId("amd_chrg_brn_by_code_div")){
				d.byId("amd_chrg_brn_by_code_div").style.display="block";
				}
				if(d.byId("cfm_chrg_brn_by_code_div")){
				d.byId("cfm_chrg_brn_by_code_div").style.display="block";
				}
				if(d.byId("amd_no_date_display_mo_div")){
					d.byId("amd_no_date_display_mo_div").style.display="block";
				}
				if(d.byId("amd_date_display_mo_div")){
					d.byId("amd_date_display_mo_div").style.display="block";
				}
				
				if(dj.byId("amd_chrg_brn_by_code_1") && !dj.byId("amd_chrg_brn_by_code_1").get("value") && !dj.byId("amd_chrg_brn_by_code_2").get("value") && !dj.byId("amd_chrg_brn_by_code_4").get("value") && (dj.byId("amd_chrg_brn_by_code_5") && !dj.byId("amd_chrg_brn_by_code_5").get("value")) && !dj.byId("amd_chrg_brn_by_code_9").get("value")){
					dj.byId("amd_chrg_brn_by_code_2").set("checked",true);
				}
				
				if(m._config.narrativeDescGoodsDataStore || m._config.narrativeDocsReqDataStore || m._config.narrativeAddInstrDataStore || m._config.narrativeSpBeneDataStore || m._config.narrativeSpRecvbankDataStore) {
					m._config.currentNarrativeDescGoodsDataStore = m._config.narrativeDescGoodsDataStore;
					m._config.currentNarrativeDocsReqDataStore = m._config.narrativeDocsReqDataStore;
					m._config.currentNarrativeAddInstrDataStore = m._config.narrativeAddInstrDataStore;
					m._config.currentNarrativeSpBeneDataStore = m._config.narrativeSpBeneDataStore;
					m._config.currentNarrativeSpRecvbankDataStore = m._config.narrativeSpRecvbankDataStore;
				}
				if(document.getElementById("amd_no"))
				{
				document.getElementById("amd_no").value = m._config.amendmentNumber;
				}
				if(d.byId("amend_narratives_display")) {
					d.byId("amend_narratives_display").style.display="block";
				}
				if(d.byId(viewNarrativeSwift)) {
					d.byId(viewNarrativeSwift).style.display="none";
				}
					
					
			}
			else if (tnx_type_code_val=== '15' || tnx_type_code_val=== '13'){
				if(d.byId("amd_chrg_brn_by_code_div")){
				d.byId("amd_chrg_brn_by_code_div").style.display="none";
				}
				if(d.byId("cfm_chrg_brn_by_code_div")){
				d.byId("cfm_chrg_brn_by_code_div").style.display="none";
				}
				if(d.byId("amd_no_date_display_mo_div")){
					d.byId("amd_no_date_display_mo_div").style.display="none";
				}
				if(d.byId("amd_date_display_mo_div")){
					d.byId("amd_date_display_mo_div").style.display="none";
				}
				if(d.byId("amend_narratives_display")) {
					d.byId("amend_narratives_display").style.display="none";
				}
				if(d.byId(viewNarrativeSwift)) {
					d.byId(viewNarrativeSwift).style.display="block";
				}
				
				if(document.getElementById("amd_no"))
				{
				document.getElementById("amd_no").value ='';
				}
				if(m._config.currentNarrativeDescGoodsDataStore) {
					m._config.narrativeDescGoodsDataStore = m._config.currentNarrativeDescGoodsDataStore;
					m._config.narrativeDocsReqDataStore = m._config.currentNarrativeDocsReqDataStore;
					m._config.narrativeAddInstrDataStore = m._config.currentNarrativeAddInstrDataStore;
					m._config.narrativeSpBeneDataStore = m._config.currentNarrativeSpBeneDataStore;
					m._config.narrativeSpRecvbankDataStore = m._config.currentNarrativeSpRecvbankDataStore;
				} else {
					m._config.narrativeDescGoodsDataStore = '';
					m._config.narrativeDocsReqDataStore = '';
					m._config.narrativeAddInstrDataStore = '';
					m._config.narrativeSpBeneDataStore = '';
					m._config.narrativeSpRecvbankDataStore = '';
					if(document.getElementById("narrativeDescriptionGoods")){
						document.getElementById("narrativeDescriptionGoods").innerHTML = "";
					}
					if(document.getElementById("narrativeDocumentsRequired")){
						document.getElementById("narrativeDocumentsRequired").innerHTML = "";
					}
					if(document.getElementById("narrativeAdditionalInstructions")){
						document.getElementById("narrativeAdditionalInstructions").innerHTML = "";
					}
					if(document.getElementById("narrativeSpecialBeneficiary")){
						document.getElementById("narrativeSpecialBeneficiary").innerHTML = "";
					}
					if(document.getElementById("narrativeSpecialReceivingBank")){
						document.getElementById("narrativeSpecialReceivingBank").innerHTML = "";
					}					
				}
			}
		},
		
		resetFormFields : function ( fieldArray ){
			d.forEach(fieldArray, function (id, index) {
				var item = dj.byId(id);
				if(item){
					item.reset();
				}
			});
		},
		
		/**
		 * <h4>Summary:</h4>
		 *   sets the required attribute of each Dijit form field in the fieldarray to true or false based on requiredFlag
		 *   @method setRequiredFields
		 *   
		 */
		setRequiredFields : function ( fieldArray , requiredFlag) {			
			
			d.forEach(fieldArray, function (id, index) {
				var item = dj.byId(id);
				item.set("required", requiredFlag);			
			});
		},
		/**
		 * <h4>Summary:</h4>
		 *   Utility method for comparing Transaction and Master form elements
		 *   Even if a single field is different b/w transaction and master, return true and no further comparison is necessary
		 *  
		 *   @method compareTransactionMaster
		 *   @Parameters : tnxFormArray->This contains the form elements we want to compare with Master
		 *   @Returns :True if even a single field is different between Transaction and Master.
		 *   		   False otherwise
		 *   
		 */
		compareTransactionMaster : function( tnxFormArray , type){
			
			var compareResult = false;
			for(var i=0 ; i<tnxFormArray.length ; i++){
				var transactionData = dj.byId(tnxFormArray[i]);
				var masterData = dj.byId("org_" + tnxFormArray[i]);
				
				//Present in Master but not Transaction
				if((masterData && !transactionData)||(transactionData && !masterData)){
					compareResult=true;
					break;
				}
				//Present in Transaction and Master,then compare the values
				else{
					if(type === "TXT"){
						if( m.trim(masterData.get("value")) !== m.trim(transactionData.get("value")) ){
							compareResult=true;
							break;				
						}					
					}else if(type === "CHECK"){			
						var transactionCheckBoxValue =  (transactionData.get("checked") === true) ? "Y" : "N";
						if( masterData.get("value") !== transactionCheckBoxValue){
							compareResult=true;
							break;				
						}
					}
				}
			}	
			return compareResult;
		},
		/**
		 * <h4>Summary:</h4>
		 *   Utility method for comparing Transaction and Master radio button elements
		 *   Even if a single field is different b/w transaction and master, return true and no further comparison is necessary
		 *  
		 *   @method compareTransactionMasterRadio
		 *   @Parameters : tnxFormArray->This contains the form elements we want to compare with Master
		 *   @Returns :True if even a single field is different between Transaction and Master.
		 *   		   False otherwise
		 *   
		 */
		compareTransactionMasterRadio : function( tnxFormArray ){
			var compareResult = false;
			
			for(var i=0 ; i<tnxFormArray.length ; i++){
				var transactionData = dj.byId(tnxFormArray[i]);
			//This gives which radio button been selected currently in the amendment screen.
			//Radio buttons generally have some value if they are selected like "01","07" etc
				if(transactionData && transactionData.get("value") !== false){
					var masterData = dj.byId("org_" + tnxFormArray[i]);
					//Compare the same selection with that of the master.If they are different means value are different
					if( !masterData || (masterData.get("value") !== transactionData.get("value"))){
						compareResult=true;
						break;
					}
				}
			}
			return compareResult;		
		},
		/**
		 * <h4>Summary:</h4>
		 *  
		 *   @method amendChargesLC
		 *   Disables Other Narrative in Amendment page when amendment charges are applicant/beneficiary
		 *   Enables Other Narrative when Amendment charges is selected  'Other'
		 */
		amendChargesLC : function() {
			var amdChargesArea = dj.byId("narrative_amend_charges_other");
			var optId = this.get("id");
			if(amdChargesArea) {
				if(optId === "amd_chrg_brn_by_code_4" || optId === "amd_chrg_brn_by_code_5") {
					amdChargesArea.set("value", "");
					amdChargesArea.set("disabled", false);
				}
				else {
						amdChargesArea.set("value", "");
						amdChargesArea.set("disabled", true);			
				}
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *  
		 *   @method calculateAmendTransactionAmount
		 *   Calculates the tnx amount for the amendmentment
		 */
		calculateAmendTransactionAmount : function() {
			var amendmentTransaction = (dj.byId("tnxtype") && dj.byId("tnxtype").get("value")==="03") || 
					(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")==="03") || 
					(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value")==="08" || dj.byId("prod_stat_code").get("value")==="31"));
			var tnxAmt = dj.byId("tnx_amt");
			if(amendmentTransaction)
			{
			var incAmt = dj.byId("inc_amt");
			if(incAmt){
				incAmt.set("value", "");
			}
			var decAmt = dj.byId("dec_amt");
			if(decAmt){
				decAmt.set("value", "");
			}
			
			var amtField = dj.byId("lc_amt"),
			orgAmtField = dj.byId("org_lc_amt"),
			// We parse to number in case either field happens to be a hidden field.
			orgAmt = d.number.parse(orgAmtField.get("displayedValue")),
			amendedAmt = d.number.parse(amtField.get("displayedValue"));

			orgAmt = !isNaN(orgAmt) ? orgAmt : 0;
			amendedAmt = !isNaN(amendedAmt) ? amendedAmt : 0;
			
			var diffAmt = amendedAmt - orgAmt;
			if(diffAmt > 0){
				//Inc Amt
				if(tnxAmt){
					tnxAmt.set("value", diffAmt);
				}
				if(incAmt){
					incAmt.set("value", diffAmt);
				}
			}
			else if(diffAmt < 0){
				//Dec Amt
				if(tnxAmt){
					tnxAmt.set("value", (-1*diffAmt));
				}
				if(decAmt){
					decAmt.set("value", (-1*diffAmt));
				}
			}
			}
			else
			{
				tnxAmt.set("value", d.number.parse(dj.byId("lc_amt").get("value")));
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * If the confirmation instructions say Without, always uncheck the
		 * confirmation charges.
		 * @method checkConfirmationCharges
		 */
		checkConfirmationCharges: function() {
			//  summary:
		    //        If the confirmation instructions say Without, always uncheck the
			//        confirmation charges.
			
			if(dj.byId("cfm_inst_code_3").get("checked")) {
				this.set("checked", false);
				m.showTooltip(m.getLocalization("confirmationInstructionsError"), 
						d.byId("cfm_chrg_brn_by_code_1"), ["before"]);
			}
			if(m._config.charge_splitting_lc){
				if(dj.byId("open_chrg_brn_by_code_3")){ // if defined
					if(dj.byId("cfm_chrg_brn_by_code_3").get("checked")) {
						dj.byId("cfm_chrg_applicant").set("disabled", false).set("required", true);
						dj.byId("cfm_chrg_beneficiary").set("disabled", false).set("required", true);
					}
					else {
						dj.byId("cfm_chrg_applicant").set("disabled", true).set("value", "").set("required", false);
						dj.byId("cfm_chrg_beneficiary").set("disabled", true).set("value", "").set("required", false);
					}
				}
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * If the splitting button of open_charge and corr_charge selected, enable amount text boxes,
		 * Otherwise, disbale them.
		 * @method checkApplBeneCharges
		 */		
		checkApplBeneCharges: function() {
			if(dj.byId("open_chrg_brn_by_code_3")){ // if defined
				if(dj.byId("open_chrg_brn_by_code_3").get("checked")) {
					dj.byId("open_chrg_applicant").set("disabled", false).set("required", true);
					dj.byId("open_chrg_beneficiary").set("disabled", false).set("required", true);
				}
				else {
					dj.byId("open_chrg_applicant").set("disabled", true).set("value", "").set("required", false);
					dj.byId("open_chrg_beneficiary").set("disabled", true).set("value", "").set("required", false);
				}
			}
			if(dj.byId("corr_chrg_brn_by_code_3")){ // if defined
				if(dj.byId("corr_chrg_brn_by_code_3").get("checked")) {
					dj.byId("corr_chrg_applicant").set("disabled", false).set("required", true);
					dj.byId("corr_chrg_beneficiary").set("disabled", false).set("required", true);
				}
				else {
					dj.byId("corr_chrg_applicant").set("disabled", true).set("value", "").set("required", false);
					dj.byId("corr_chrg_beneficiary").set("disabled", true).set("value", "").set("required", false);
				}
			}
		},		
		/**
		 * <h4>Summary:</h4>
		 * Toggle the display of the renewal details.
		 * Checks for the value of is_bank depending upon that it toggels diffrent field.
		 * Also sets values of some of the fields of depending upon the value of renew_flag on which this function is called.
		 * @method toggleRenewalDetails
		 */
		toggleRenewalDetails : function( /*Boolean*/ keepFieldValues) {
			//  summary:
		    //        Toggle the display of the renewal details.
			
			if(dj.byId("is_bank") && dj.byId("is_bank").get("value") === "N")
			{
				m.toggleFields(this.get("checked"), ["advise_renewal_flag",
				           "rolling_renewal_flag", "renew_amt_code_1", "renew_amt_code_2", "final_expiry_date"],
				           ["renew_on_code", "renew_for_nb", "renew_for_period"], 
				           keepFieldValues);
			}
			else
			{
				m.toggleFields(this.get("checked"), ["advise_renewal_flag",
  				           "rolling_renewal_flag", "renew_amt_code_1", "renew_amt_code_2", "projected_expiry_date", "final_expiry_date"],
  				           ["renew_on_code", "renew_for_nb", "renew_for_period"], 
  				           keepFieldValues);
			}

			// Reset other fields
			if(!this.get("checked")) {
				dj.byId("renew_on_code").set("value", "");
				dj.byId("renew_for_nb").set("value", "");
				dj.byId("renew_for_period").set("value", "");
				dj.byId("advise_renewal_flag").set("checked", false);
				dj.byId("rolling_renewal_flag").set("checked", false);
				dj.byId("renew_amt_code_1").set("checked", false);
				dj.byId("renew_amt_code_2").set("checked", false);
				if(dj.byId("projected_expiry_date"))
				{
					dj.byId("projected_expiry_date").set("value", null);
				}
				dj.byId("final_expiry_date").set("value", null);
			}
		}, 
		
		/**
		 * <h4>Summary:</h4>
		 * Toggle the display of the renewal details.
		 * Checks for the value of is_bank depending upon that it toggels diffrent field.
		 * Also sets values of some of the fields of depending upon the value of renew_flag on which this function is called.
		 * @method toggleRenewalDetails
		 */
		resetRenewalDetails : function( /*Boolean*/ keepFieldValues, /*Dijit._widget || DomNode*/ node) {
			//  summary:
		    //        Toggle the display of the renewal details.
			
			if(dj.byId("is_bank") && dj.byId("is_bank").get("value") === "N")
			{
				m.toggleFields(node.get("checked"), ["advise_renewal_flag",
				           "rolling_renewal_flag", "renew_amt_code_1", "renew_amt_code_2", "final_expiry_date"],
				           ["renew_on_code", "renew_for_nb", "renew_for_period"], 
				           keepFieldValues);
			}
			else
			{
				m.toggleFields(node.get("checked"), ["advise_renewal_flag",
  				           "rolling_renewal_flag", "renew_amt_code_1", "renew_amt_code_2", "projected_expiry_date", "final_expiry_date"],
  				           ["renew_on_code", "renew_for_nb", "renew_for_period"], 
  				           keepFieldValues);
			}

			// Reset other fields
			if(!node.get("checked")) {
				dj.byId("renew_on_code").set("value", "");
				dj.byId("renew_for_nb").set("value", "");
				dj.byId("renew_for_period").set("value", "");
				dj.byId("advise_renewal_flag").set("checked", false);
				dj.byId("rolling_renewal_flag").set("checked", false);
				dj.byId("renew_amt_code_2").set("checked", true);
				if(dj.byId("projected_expiry_date"))
				{
					dj.byId("projected_expiry_date").set("value", null);
				}
				dj.byId("final_expiry_date").set("value", null);
			}
		},

								/**
								 * <h4>Summary:</h4> 
								 * Toggle dependent fields.
								 * The object field cannot have a value
								 * if the object dependent Field already has one
								 * 
								 * @param {Dijit._Widget||DonNode} node
								 * @param {Dijit._Widget||DomNode} dependentNode
								 * @param {String} tooltip
								 * @method toggleDependentFields
								 */
		toggleDependentFields : function( /*Dijit._widget || DomNode*/ node,
										  /*Dijit._widget || DomNode */ dependentNode,
										  /*String*/ tooltip) {
			//  summary:
		    //        The object field cannot have a value if the object 
			//        dependentField already has one
			//
			//	TODO Field should have its state changed to Error, otherwise the form can be 
			//		 submitted
			
			var field = dj.byId(node),
				dependentField = dj.byId(dependentNode);			
			
			if(dependentField.get("displayedValue") !== "" && field.get("displayedValue") !== "") {
				field.set("displayedValue", "");
				field.set("readOnly", true);
				if(tooltip) {
					m.setFieldState(field, false);
					m.showTooltip(tooltip, field.domNode);
				}
			} else {
				field.set("readOnly", false);
				dependentField.set("readOnly", false);
				//why change state the field is clear ? 
				//this made conflict with validation of field
				//m.setFieldState(field, true);
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function updates outstanding amount depending upon 
		 * tnx type code and prod stat code,sub tnx type code.
		 * @param {Dijit._Widget} liabAmtField
		 * 
		 * @param {Dijit._Widget} orgLiabAmtField 
		 * @method updateOutstandingAmount
		 */
		updateOutstandingAmount : function( /*Dijit._widget*/ liabAmtField, 
											/*Dijit._widget*/ orgLiabAmtField,productCode) {
			// summary:
			//		TODO Explain business logic
			
			var prodStatCodeValue = dj.byId("prod_stat_code").get("value");
				if(productCode == null || productCode == undefined)
					{
					var product = dj.byId("product_code").get("value").toLowerCase();
					productCode = dj.byId(product+"_amt");
					}
						
				var originalLiabAmt = dojo.number.parse(orgLiabAmtField.get("value")) || (productCode? productCode.get("value") : 0)  ;
				var tnxAmt;
				if(dj.byId("tnx_amt") && dj.byId("tnx_amt").get("value")){
				tnxAmt = isNaN(dojo.number.parse(dj.byId("tnx_amt").get("value"))) ? 0: dj.byId("tnx_amt").get("value");
				}
				else
				{
					tnxAmt = 0;
				}
				var liabAmt,tnxTypeCode = dj.byId("tnx_type_code"),subTnxTypeCode = dj.byId("sub_tnx_type_code");
				
			
			// Reduce outstanding amount by document amount value, in the following cases
			if(liabAmtField && (prodStatCodeValue === "04" || prodStatCodeValue === "14" ||
					prodStatCodeValue === "15" || prodStatCodeValue === "13" || prodStatCodeValue === "05") ) {
				liabAmt = originalLiabAmt - tnxAmt;
				liabAmt = (liabAmt > 0) ? liabAmt : 0;
				liabAmtField.set("value", liabAmt);
			} 
			else if(tnxTypeCode && subTnxTypeCode && tnxTypeCode.get("value") != "03" && subTnxTypeCode.get("value") != "05" && liabAmtField && isNaN(liabAmtField.get("value")))
			{
				liabAmtField.set("value", originalLiabAmt);
			}
			else if((prodStatCodeValue=="07" || prodStatCodeValue === "03") && liabAmtField && !isNaN(liabAmtField.get("value")))
			{
				console.log("liability amount retained");
			}
			else if(liabAmtField)
			{
				liabAmtField.set("value", originalLiabAmt);
			}
						},
						
						/**
						 * <h4>Summary:</h4> 
						 * 
						 * Show a popup of confirmation to allow the
						 * deletion of a record 
						 * <h4>Description:</h4>  
						 * Confirmation popup
						 * when deleting an account / bill payee (Accounts
						 * Management Module)
						 * @param {String} title
						 * @param {String} url
						 * @param {String} type
						 * @method confirmAccountDelete
						 */
		confirmAccountDelete : function( /*String*/ title,
										 /*String*/ url,
										 /*String*/ type) {
			
			//  summary:
			//         Show a popup of confirmation to allow the deletion of a record
			//  description:
			//		   Confirmation popup when deleting an account / bill payee 
			//         (Accounts Management Module)

			var mess = (type === "bill") ? 
					"deleteBillPayeeConfirmation" : "deleteTransactionConfirmation";
			
			m.dialog.show("CONFIRMATION",
				m.getLocalization(mess, [title]), "",
					function(){ document.location.href = url; }
			);
		},
						/**
						 * <h4>Summary:</h4> 
						 * Open a popup window showing the details of
						 * static data such as entities, phrases, etc.
						 * @param {String} option
						 * @param {String} operation
						 * @param {String[]} arrFieldValues
						 * @param {String} screen
						 * @param {String} product
						 * @method populateStaticDataDialog
						 */
		populateStaticDataDialog : function( /*String*/ option, 
					 						 /*String*/ operation,
					 						 /*String[]*/ arrFieldValues,
					 						 /*String*/ screen,
					 						 /*String*/ product){
			//  summary:
			//            Open a popup window showing the details of static data such as 
			//            entities, phrases, etc.

			var url = "/screen/AjaxScreen/action/GetStaticDataPopup",
			    query = {};
			query.option = option;
			query.operation = operation;
			query.fields = arrFieldValues;
			query.popupType = "ADD_DATA";
			
			if(product) {
				query.productcode = product;
			}

			console.debug("[misys.form.common] Opening an 'Add Static Data' popup screen at URL",  url, query);
			m.dialog.populate(option, m.getServletURL(url), null, query);
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Returns a URL for the static data auch as Entities ,Pharses etc.
		 * @param {String} option
		 * @param {String} operation
		 * @param {String} formName
		 * @paran {String[]} arrFieldValues
		 * @param {String} screen
		 * @param {String} product
		 * @method getStaticDataURL
		 */
		getStaticDataURL : function( /*String*/ option,
				 					 /*String*/ operation,
				 					 /*String*/ formName,
				 					 /*String[]*/ arrFieldValues,
				 					 /*String*/ screen, 
				 					 /*String*/ product){
			//  summary:
		    //        Open a popup window showing the details of static data such as 
			//        entities, phrases, etc.
			
			var url = ["/screen/"],
				urlScreen = screen || "StaticDataListPopup";
			
			url.push(urlScreen, "?option=", option, "&operation=", operation, 
					"&fields=", arrFieldValues, "&formname=", formName);
	
			if(product){
				url.push(varProdCode, product);
			}

			return m.getServletURL(url.join(""));
		}, 
		
		// TODO Switch to JSON object as a parameter
		// TODO Replace references to "popup" with "dialog"
		/**
		 * <h4>Summary:</h4>
		 * Open a popup window to perform the search in the available list of entity
		 * records. The screen can also be given as parameter.
		 *  Set isInPopup to true for a button that is already in a popup
		 *  @param String,String[],String,String,String,String,String,String,String,String
		 *  @param Boolean,Boolean,String,String
		 */
		showEntityDialog : function( /*String*/entity,
					                /*String[]*/fields, 
					                /*String*/product, 
					                /*String*/entityContext,
					                /*String*/company, 
					                /*String*/ featureid, 
					                /*String*/ option, 
					                /*String*/dimensions, 
					                /*String*/title, 
					                /*String*/ subProduct,
					                /*Boolean*/ isInPopup, 
					                /*Boolean*/ closeParent,
					                /*String*/ popupPrefix,
					                /*String*/ wildCard) {
			//  summary:
			//        Open a popup window to perform the search in the available list of entity
			//        records. The screen can also be given as parameter.   
			//		  Set isInPopup to true for a button that is already in a popup

			
			var url = "/screen/EntityListPopup",
				query = {},
				contentURL = "/screen/AjaxScreen/action/GetEntities",
				queryStore = {}, grid, gridId, childDialog, onShowCallback;

			
			if(closeParent) {
				queryStore.closeParent = closeParent;
				query.closeParent = closeParent;
			}
			
			if (wildCard){
				query.wildcard = wildCard;	
				queryStore.wildcard = wildCard;
			}

			if(fields){
				queryStore.fields = fields;
				query.fields = fields;
			}

			if(product){
				query.productcode = product;
				queryStore.productcode = product;
			} else {
				query.productcode = "*";
				queryStore.productcode = product;
			}
			if(subProduct){
				query.subproductcode = subProduct;
				queryStore.subproductcode = subProduct;
			} 

			if(company){
				query.company = company;
				queryStore.company = company;
			}

			if(entityContext){
				query.entitycontext = entityContext;
				queryStore.entitycontext = entityContext;
			}

			if(featureid){
				query.featureid = featureid;			
				queryStore.featureid = featureid;
			}

			if(option){
				query.option = option;
				queryStore.option = option;
			}
			
			if(popupPrefix) {
				query.popupPrefix = popupPrefix;
				queryStore.popupPrefix = popupPrefix;
			}
			query.dimensions = dimensions;

			gridId = entityContext + "entities_grid";
			onShowCallback = function() {
				// Show loading message, otherwise it doesn't necessarily appear
				if(popupPrefix){
					gridId = popupPrefix + gridId;
				}
				grid = dj.byId(gridId);
				console.debug("[misys.form.common] Calling onShowCallback for grid", gridId);
				console.debug("[misys.form.common] Grid content URL is", contentURL);
				grid.showMessage(grid.loadingMessage);
				if(!entityContext || entityContext !== 'CUSTOMER')
				{
					m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
				}
				/*m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);*/
				
				m.connect("sy_name", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USERentities_grid'), ['NAME'], ['sy_name']);
				  }
				});
				m.connect("sy_abbvname", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USERentities_grid'), ['ABBVNAME'], ['sy_abbvname']);
				  }
				});
				m.connect("sy_name", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USER_WITH_ENTITY_WILDCARDentities_grid'), ['NAME'], ['sy_name']);
				  }
				});
				m.connect("sy_abbvname", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USER_WITH_ENTITY_WILDCARDentities_grid'), ['ABBVNAME'], ['sy_abbvname']);
				  }
				});

				m.connect("sy_abbvname", "onKeyPress", function(evnt){
					if(evnt.keyCode == dojo.keys.ENTER){
						m.grid.filter(dj.byId('CUSTOMERentities_grid'), ['ABBVNAME'], ['sy_abbvname']);
					}
				});
				
				m.connect("sy_name", "onKeyPress", function(evnt){
					if(evnt.keyCode == dojo.keys.ENTER){
						m.grid.filter(dj.byId('CUSTOMERentities_grid'), ['NAME'], ['sy_name']);
					}
				});
				
				m.connect("sy_prefixentity", "onKeyPress", function(evnt){
					if(evnt.keyCode == dojo.keys.ENTER){
						m.grid.filter(dj.byId('prefixCUSTOMERentities_grid'), ['ENTITY_ABBV_NAME'], ['sy_prefixentity']);
					}
				});
				
				m.connect("sy_prefixname", "onKeyPress", function(evnt){
					if(evnt.keyCode == dojo.keys.ENTER){
						m.grid.filter(dj.byId('prefixCUSTOMERentities_grid'), ['NAME'], ['sy_prefixname']);
					}
				});
				
//				m.connect("abbv_name", "onKeyPress", function(evnt){
//					if(evnt.keyCode == dojo.keys.ENTER){
//						m.grid.filter(dj.byId('gridColumn_phrasedata_grid'), ['ABBVNAME'], ['abbv_name']);
//				  }
//				});
			};
			if(isInPopup) {
				console.debug(chilDialog, url);
				childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
					title: title,
					id: "childXhrDialog",
					href: m.getServletURL(url),
					ioMethod: misys.xhrPost,
					ioArgs: { content: query }
				});
				
				m.dialog.connect(childDialog, "onLoad", onShowCallback);
				m.dialog.connect(childDialog, "onHide", function(){setTimeout(function(){
					m.dialog.disconnect(childDialog);
					childDialog.destroyRecursive();
				}, 2000);});
				
				// Offset the dialog from the parent window
				var co = d.coords("xhrDialog");
				childDialog._relativePosition = {
						x: co.x + 30,
						y: co.y + 30
				};
				
				childDialog.show();
			} else {
				m.dialog.show("URL", "", title, null, onShowCallback, m.getServletURL(url), null, null, query);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Shows a dialog if credit availlable with bank's type is Other.Internally it calls showSearchDialog to create a dialog.
		 * @param String type
		 *  Type of the dialog
		 * @param {String[]} fields
		 *  Fields to populate in the dialog.
		 * @param {String} product
		 * @param {String} dimensions
		 *  Dimensions for dialog
		 * @param {String} title
		 *  Title for the dialog
		 * @method showBankTypeDialog
		 */
		showBankTypeDialog : function( /*String*/ type,
				   					   /*String[]*/ fields, 
				   					   /*String*/ product,
				   					   /*String*/ dimensions, 
				   					   /*String*/ title) {
			//  summary:
			//        Search credit available by

			if(dj.byId("credit_available_with_bank_type").get("value") === "Other"){
				m.showSearchDialog(type, fields, "", "", product, 
							dimensions, title);
			}
		},

		// TODO Get rid of hardcoded width
		/**
		 * <h4>Summary:</h4>
		 * Shows Drawee Dialog .This function internally calls showSearchDialog.
		 * @param {String} type
		 *  Tyope of the dialog
		 * @param {String} formName
		 * @param {String[]} fields
		 * @param {String} title
		 *  Title of dialog
		 * @method showDraweeDialog
		 */
		showDraweeDialog : function ( /*String*/ type,
				  					  /*String*/ formName, 
				  					  /*String[]*/ fields, 
				  					  /*String*/ title)  {
			//	summary:
			//

			if((dj.byId("cr_avl_by_code_2") && dj.byId("cr_avl_by_code_2").get("checked")) ||
					(dj.byId("cr_avl_by_code_3") && dj.byId("cr_avl_by_code_3").get("checked"))){
				m.showSearchDialog(type, fields, "", "", 
						"EL", "width:580px;height:auto;", title);
			}
		},
		
				showUsersDialog : function ( /*String*/ type,
								 /*String[]*/ fields, 
								/*String*/ companyName,
								/*String*/ userId,
								/*Object*/ parameter,
								/*String*/ screen,
								/*String*/ dimensions, 
								/*String*/ title, 
								/*String*/ companyId,
								/*String*/ action, 
								/*boolean*/ isQueryReadStore, 
								/*String*/ userAction){
				var url = [],
				query = {},
				contentURL = [ ajaxActionUrl ],
				queryStore = {},
				urlAction = action || "GetStaticData",
				urlScreen = screen || ajaxStaticDPopup,
				entity,
				onLoadCallback;
				// Check that the dimensions have a trailing semi-colon
				// as it will be appended to other rules later
				if(dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
				}
				contentURL.push(urlAction);
				queryStore.option = type;
				queryStore.fields = fields;
				queryStore.companyName = companyName;
				queryStore.userId = userId;
				queryStore.entity = entity;
				queryStore.user_action = userAction;
				d.mixin(queryStore, parameter);
				
				url.push("/screen/", urlScreen);	
				query.option = type;
				query.fields = fields;
				query.companyName = companyName;
				query.userId = userId;
				query.companyId = companyId;
				query.dimensions = dimensions;
				d.mixin(query, parameter);
				query.popupType = "LIST_DATA";
				
				if (companyId) {
				query.companyid = companyId;
				queryStore.companyid = companyId;
				}
				
				console.debug(messageGridContent, contentURL.join(""), queryStore);
				
				// Load data
				onLoadCallback = function() {
				var grid = dj.byId(type + "data_grid");
				grid.showMessage(grid.loadingMessage);
				m.grid.setStoreURL(grid, m.getServletURL(contentURL.join("")), queryStore);
				};
				
				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
				
				 m.connect("lastname", "onKeyPress", function(evnt){
                     if(evnt.keyCode === dojo.keys.ENTER){
                             m.grid.filter(dj.byId('userdata_grid'), ['LAST_NAME'], ['last_name']);
               }
             });
             m.connect("firstname", "onKeyPress", function(evnt){
                     if(evnt.keyCode === dojo.keys.ENTER){
                             m.grid.filter(dj.byId('userdata_grid'), ['FIRST_NAME'], ['first_name']);
               }
         });
             m.connect("loginId", "onKeyPress", function(evnt){
                     if(evnt.keyCode === dojo.keys.ENTER){
                             m.grid.filter(dj.byId('userdata_grid'), ['LOGIN_ID'], ['login_id']);
               }
             });
				
				},
		/**
		 * <h4>Summary:</h4>
		 * It is for showing External account dialog
		 * @param String
		 * @param String[]
		 * @param Object
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param boolean
		 * @param String
		 * @method showSearchExtAccountDialog
		 * 
		 */
		showSearchExtAccountDialog : function ( /*String*/ type,
												 /*String[]*/ fields, 
												/*Object*/ parameter, 
												/*String*/ screen,
												/*String*/ product, 
												/*String*/ dimensions, 
												/*String*/ title, 
												/*String*/ entityField,
												/*String*/ companyId,
												/*String*/ action, 
												/*boolean*/ isQueryReadStore, 
												/*String*/ userAction){
				var url = [],
				query = {},
				contentURL = [ ajaxActionUrl ],
				queryStore = {},
				urlAction = action || "GetStaticData",
				urlScreen = screen || ajaxStaticDPopup,
				entity,
				onLoadCallback;
				// Check that the dimensions have a trailing semi-colon
				// as it will be appended to other rules later
				if(dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
				}
				if (dj.byId(entityField))
				{
				entity = dj.byId(entityField).get('value');			
				}
				contentURL.push(urlAction);
				queryStore.option = type;
				queryStore.fields = fields;
				queryStore.entity = entity;
				queryStore.user_action = userAction;
				d.mixin(queryStore, parameter);
				
				url.push("/screen/", urlScreen);	
				query.option = type;
				query.fields = fields;
				query.dimensions = dimensions;
				d.mixin(query, parameter);
				query.popupType = "LIST_DATA";
				
				if(product) {
				query.productcode = product;
				queryStore.productcode = product;
				}
				
				if (companyId) {
				query.companyid = companyId;
				queryStore.companyid = companyId;
				}
				
				console.debug(messageGridContent, contentURL.join(""), queryStore);
				
				if (!isQueryReadStore) {
				// Load data
				onLoadCallback = function() {
				var grid = dj.byId(type + "data_grid");
				if(grid)
				{
				grid.showMessage(grid.loadingMessage);
				m.grid.setStoreURL(grid, m.getServletURL(contentURL.join("")), queryStore);
				}
				};
				}
				
				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
								
		},
						/**
						 * <h4>Summary:</h4>
						 *  Open a popup window to perform the search in
						 * the available list of records whose type is passed as
						 * a parameter("bank", "beneficiary", "phrase",
						 * "account", "currency", ...). The screen can also be
						 * given as parameter.
						 * @param String
						 * @param String[]
						 * @param Object
						 * @param String
						 * @param String
						 * @param String
						 * @param String
						 * @param String
						 * @param String
						 * @param boolean
						 * @param String
						 * @param String
						 * @method showSearchDialog
						 */
		showSearchDialog : function( /*String*/ type,
				 					 /*String[]*/ fields, 
				 					 /*Object*/ parameter, 
				 					 /*String*/ screen,
				 					 /*String*/ product, 
				 					 /*String*/ dimensions,
				 					 /*String*/ title,
				 					 /*String*/ companyId,
				 					 /*String*/ action, 
				 					 /*boolean*/ isQueryReadStore, 
				 					 /*String*/ userAction,
				 					/*String*/ excludedValueField,
				 					 /*String*/ subProduct){
				 					
			//  summary:
			//        Open a popup window to perform the search in the available list of records
			//        whose type is passed as a parameter("bank", "beneficiary", "phrase",
			//        "account", "currency", ...). The screen can also be given as parameter.        

			var url = [],
				query = {},
				contentURL = [ ajaxActionUrl ],
				queryStore = {},
				urlAction = action || "GetStaticData",
				urlScreen = screen || ajaxStaticDPopup,
				excludedValue,
				onLoadCallback,
				bank_abbv_name,
				product_type=dj.byId("product_type") ? dj.byId("product_type").get("value"):"",
				customerBankValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get("value") : "",
				issuingBankAbbvName = dijit.byId("issuing_bank_abbv_name") ? dijit.byId("issuing_bank_abbv_name").get("value") : "";
				var fscmPgm = dj.byId("program_id");
			
			if (dj.byId(excludedValueField))
			{
			    excludedValue = dj.byId(excludedValueField).get('value'); 
			    if (excludedValue === "")
			     {
			         console.debug("[misys.form.common] cannot select an account if excluded value is mandatory");
			         return;
			     }
			}
			// Check that the dimensions have a trailing semi-colon
			// as it will be appended to other rules later
			if(dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
			}
			contentURL.push(urlAction);
			queryStore.option = type;
			queryStore.fields = fields;
			queryStore.user_action = userAction;
			queryStore[excValue] = excludedValue;
			d.mixin(queryStore, parameter);
			
			url.push("/screen/", urlScreen);	
			query.option = type;
			query.fields = fields;
			query.dimensions = dimensions;
			d.mixin(query, parameter);
			query.popupType = "LIST_DATA";

			if(product) {
				query.productcode = product;
				queryStore.productcode = product;
			}

			if (companyId) {
				query.companyid = companyId;
				queryStore.companyid = companyId;
			}
			
			if (parameter && parameter.entity_name==="") {
				queryStore.entity_name = dj.byId("entity") ? dj.byId("entity").get("value") : "";
				query.entity_name = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			}
			if(customerBankValue)
			{
				bank_abbv_name = customerBankValue;
			}	
			else if(dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get("value") !== "")
            {       
                bank_abbv_name = dj.byId("bank_abbv_name").get("value");
            }	
			else if(issuingBankAbbvName)
            {
				// if both customer_bank and bank_abbv_name are 'empty' or 'undefined', assign issuing_bank_abbv_name to bank_abbv_name.
                bank_abbv_name = issuingBankAbbvName;
            }			
			queryStore.bank_abbv_name = bank_abbv_name;
			
			if(fscmPgm)
			{
				query.fcmPgmId = fscmPgm.get('value');
				queryStore.fcmPgmId = fscmPgm.get('value');
			}
			
			if (product_type) {
				query.product_type = product_type;
				queryStore.product_type = product_type;
			}
			if(subProduct) {
				query.subproductcode = subProduct;
				queryStore.subproductcode = subProduct;
			}
			
			console.debug(messageGridContent, contentURL.join(""), queryStore);

			if (!isQueryReadStore) {
				// Load data
				onLoadCallback = function() {
					var grid = dj.byId(type + "data_grid");
					if(grid)
					{
						grid.showMessage(grid.loadingMessage);
						
						m.grid.setStoreURL(grid, m.getServletURL(contentURL.join("")), queryStore);
						
						m.connect("CurrencyName", "onKeyPress", function(evnt){
							if(evnt.keyCode === dojo.keys.ENTER){
								m.grid.filter(dj.byId('currencydata_grid'), ['NAME'], ['CurrencyName']);
						  }
						});
						m.connect("ISOCode", "onKeyPress", function(evnt){
							if(evnt.keyCode === dojo.keys.ENTER){
								m.grid.filter(dj.byId('currencydata_grid'), ['ISOCODE'], ['ISOCode']);
						  }
						});
						m.connect("abbv_name", "onKeyPress", function(evnt){
							if(evnt.keyCode === dojo.keys.ENTER){
								m.grid.filter(dj.byId('beneficiarydata_grid'), ['ABBVNAME'], ['abbv_name']);
						  }
						});
						m.connect("name", "onKeyPress", function(evnt){
							if(evnt.keyCode === dojo.keys.ENTER){
								m.grid.filter(dj.byId('beneficiarydata_grid'), ['NAME'], ['name']);
						  }
						});
						m.connect("abbv_name", "onKeyPress", function(evnt){
							if(evnt.keyCode == dojo.keys.ENTER){
								m.grid.filter(dj.byId('bankdata_grid'), ['ABBVNAME'], ['abbv_name']);
						  }
						});
						
						m.connect("name", "onKeyPress", function(evnt){
							if(evnt.keyCode == dojo.keys.ENTER){
								m.grid.filter(dj.byId('bankdata_grid'), ['NAME'], ['name']);
						  }
						});
						
						m.connect("abbv_name", "onKeyPress", function(evnt){
							if(evnt.keyCode == dojo.keys.ENTER){
								m.grid.filter(dj.byId('phrasedata_grid'), ['ABBVNAME'], ['abbv_name']);
						  }
						});
						
						m.connect("descriptionField", "onKeyPress", function(evnt){
							if(evnt.keyCode == dojo.keys.ENTER){
								m.grid.filter(dj.byId('phrasedata_grid'), ['DESCRIPTION'], ['descriptionField']);
						  }
						});
						m.connect("description", "onKeyPress", function(evnt){
							if(evnt.keyCode === dojo.keys.ENTER){
								m.grid.filter(dj.byId('accountdata_grid'), ['DESCRIPTION'], ['description']);
						  }
						});
						m.connect("account_no", "onKeyPress", function(evnt){
							if(evnt.keyCode === dojo.keys.ENTER){
								m.grid.filter(dj.byId('accountdata_grid'), ['ACCOUNTNO'], ['account_no']);
						  }
						});
					}
				};
			}

			m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
		},
		/**
		 * <h4>Summary:</h4>
		 * Shows program Counterparty dialog
		 * @param String
		 * @param String []
		 * @param String
		 * @param String
		 * @param String		
		 * @param Boolean
		 * @method showProgramCptyDialog
		 * 
		 */
		showProgramCptyDialog : function(/*String*/ type,
						/* String[] */fields,
						/* String */program_id,
						/* String */screen,
						/* String */dimensions,
						/* String */title,
						/* Boolean */isInPopup) {
							
							var benAbbvNameList = "";
							if(dj.byId('gridPC') && dj.byId('gridPC').store && dj.byId('gridPC').store._arrayOfAllItems &&  dj.byId('gridPC').store._arrayOfAllItems.length)
							{
								var currentItems = dj.byId('gridPC').store._arrayOfAllItems;
								for(var i=0; i < currentItems.length; i++)
									{
										if(currentItems[i] && currentItems[i]["ABBVNAME"])
										{
											benAbbvNameList = benAbbvNameList + currentItems[i]["ABBVNAME"] + ",";
										}
									}
							}					
			
							var url = [], query = {}, contentURL = ajaxActionUrl, queryStore = {}, urlAction = "GetStaticData", urlScreen = screen|| ajaxStaticDPopup, onLoadCallback, childDialog;

							// Check that the dimensions have a trailing
							// semi-colon
							// as it will be appended to other rules later
							if (dimensions.slice(dimensions.length - 1) !== ";") {
								dimensions += ";";
							}
							contentURL += urlAction;
							queryStore.option = type;
							queryStore.fields = fields;
							queryStore.benAbbvNameList = benAbbvNameList;

							url.push("/screen/", urlScreen);
							query.option = type;
							query.fields = fields;
							
							if(program_id){
								query.program_id = program_id;			
								queryStore.program_id = program_id;
							}
							query.dimensions = dimensions;
							query.popupType = "LIST_DATA";

							console.debug(messageGridContent,contentURL);
							// Load data
							onLoadCallback = function() {
								var grid = dj.byId(type + "data_grid");
								grid.showMessage(grid.loadingMessage);
								m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);

								m.connect("prgm_cpty_popup","onKeyPress",function(evnt) {
													if (evnt.keyCode === dojo.keys.ENTER) {
														m.grid.filter(dj.byId('programCounterpartydata_grid'),[ 'ABBVNAME' ],[ 'prgm_cpty_popup' ]);
													}
												});
							};

							if (isInPopup) {
								console.debug(chilDialog,url.join(""), query);
								childDialog = dj.byId("childXhrDialog") || new dj.Dialog({title : title,
													id : "childXhrDialog",
													href : m.getServletURL(url.join("")),
													ioMethod : misys.xhrPost,
													ioArgs : { content : query
													}
												});

								m.dialog.connect(childDialog, "onLoad",
										onLoadCallback);
								m.dialog.connect(childDialog,"onHide",function() {
													setTimeout(function() {
																m.dialog.disconnect(childDialog);
																childDialog.destroyRecursive();
															}, 2000);
												});

								// Offset the dialog from the parent window
								var co = d.coords("xhrDialog");
								childDialog._relativePosition = {
									x : co.x + 30,
									y : co.y + 30
								};

								childDialog.show();
							} else {
								m.dialog.show("URL", "", title, null,onLoadCallback, m.getServletURL(url.join("")), null, null, query);
							}
						},
		/**
		 * <h4>Summary:</h4>
		 * Shows bank branch code dialog
		 * @param String[]
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param Boolean
		 * @method showBankBranchCodeDialog
		 * 
		 */
	  showBankBranchCodeDialog : function( /*String*/ type,
				 	 	  /*String[]*/ fields, 
				 	 	  /*String*/ parameter, 
				 	 	  /*String*/ branchIndicators, 
				 	 	  /*String*/ internal, 
				 	 	  /*String*/ screen,				 
				 	 	  /*String*/ dimensions, 
				 	 	  /*String*/ title, 
				 	 	  /*Boolean*/ isInPopup){
		var url = [],
		query = {},
		contentURL = ajaxActionUrl,
		queryStore = {},
		urlAction = "GetStaticData",
		urlScreen = screen || ajaxStaticDPopup,
		onLoadCallback,
		childDialog,
		co;
		
		// Check that the dimensions have a trailing semi-colon
		// as it will be appended to other rules later
		if(dimensions.slice(dimensions.length - 1) !== ";") {
			dimensions += ";";
		}
				
		contentURL += urlAction;
		queryStore.option = type;
		queryStore.fields = fields;
		queryStore.parameter = parameter;
		queryStore.branchindicators = branchIndicators;
		queryStore.internal = internal;
		
		url.push("/screen/", urlScreen);
		query.option = type;
		query.fields = fields;
		query.parameter = parameter;
		query.branchindicators = branchIndicators;
		query.internal = internal;
		query.dimensions = dimensions;
		query.popupType = "LIST_DATA";
		
		console.debug(messageGridContent, contentURL);
		
		// Load data
		onLoadCallback = function() {
			var grid = dj.byId(type + "data_grid");
			grid.showMessage(grid.loadingMessage);
			m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
		};
		
		if(isInPopup) {
			console.debug(chilDialog, url.join(""), query);
			childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
				title: title,
				id: "childXhrDialog",
				href: m.getServletURL(url.join("")),
				ioMethod: misys.xhrPost,
				ioArgs: { content: query }
			});
			
			m.dialog.connect(childDialog, "onLoad", onLoadCallback);
			m.dialog.connect(childDialog, "onHide", function(){setTimeout(function(){
				m.dialog.disconnect(childDialog);
				childDialog.destroyRecursive();
			}, 2000);});
			
			// Offset the dialog from the parent window
			// even if is in pop up, check for the parent dialog exists 
			// and then assign the coordinates for the child dialog
			co = d.coords("xhrDialog");
			childDialog._relativePosition = {
				x: co.x + 30,
				y: co.y + 30
			};
			childDialog.show();
		} else {
			m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
		}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for showing user account dialog
		 * @param String
		 * @param String[]
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String 
		 * @param boolean
		 * @param String
		 * @param String[]
		 * @param String
		 * @param String
		 *@method  showSearchUserAccountsDialog     
		 */
		showSearchUserAccountsDialog : function( /*String*/ type,
												 /*String[]*/ fields, 
												 /*String*/ excludedValueField,
												 /*String*/ entityField,
												 /*String*/ drCr,
												 /*String*/ productTypes,
												 /*String*/ dimensions, 
												 /*String*/ title,
												 /*String*/ parameter,
												 /*String*/ companyId,
							 					 /*String */ action, 
							 					 /*boolean*/ isQueryReadStore, 
							 					 /*String*/ userAction,
							 					 /*String[]*/ ccy_code_fields,
							 					 /*String*/ accountType,
							 					 /*String*/ excludedaccttype,
							 					 /*String*/ isSearchScreen){
				//  summary:
				//        Open a popup window to perform the search in the available list of user accounts

				var url = [],
				query = {},
				contentURL = ajaxActionUrl,
				queryStore = {},
				urlAction = "GetStaticData",
				urlScreen = ajaxStaticDPopup,
				onLoadCallback,
				entity,
				bank_abbv_name,
				excludedValue;
	
				if (dj.byId(entityField))
				{
					entity = dj.byId(entityField).get('value'); 
					if (entity === "")
					{
					if( dj.byId("applicant_abbv_name"))
						{
						var recipient = dj.byId("applicant_abbv_name").get('value');
							if (recipient === "")
						{
							console.debug("[misys.form.common] cannot select an account if entity is mandatory");
							m.showTooltip(m.getLocalization("entitynotselected"), document.activeElement, ["after"]);
							return;
						}	
						}
						else if(isSearchScreen && isSearchScreen === true)
						{
							// MPSSC-10358 - Check is this the request is from ListDef search screen. 
							console.debug("[misys.form.common] It's a listdef request.");
						}
						else
						{
							console.debug("[misys.form.common] cannot select an account if entity is mandatory");
							m.showTooltip(m.getLocalization("entitynotselected"), document.activeElement, ["after"]);
							return;
						}
				}
				}
				else if(misys._config.isEntityRequired)
				{
					console.debug("[misys.form.common] cannot select an account as user does not have any entity level permission");
					m.showTooltip(m.getLocalization("entitynotselected"), document.activeElement, ["after"]);
					return;
				}
				
				if (dj.byId(excludedValueField))
				{
				    excludedValue = dj.byId(excludedValueField).get('value'); 
				    if (excludedValue === "")
				     {
				         console.debug("[misys.form.common] cannot select an account if excluded value is mandatory");
				         return;
				     }
				}
				var ccyValues = [];
				if (ccy_code_fields)
				{
					var ccyArray = ccy_code_fields.split(",");
					for(var i in ccyArray)
					{
						if (dj.byId(ccyArray[i]))
						{
							ccyValues.push(dj.byId(ccyArray[i]).get('value'));
						}
					}
				}
										
				if(dj.byId("customer_bank") && dj.byId("customer_bank").get("value") !== "")
				{
					bank_abbv_name = dj.byId("customer_bank").get("value");
				}	
				else if(dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get("value") !== "")
                {       
                    bank_abbv_name = dj.byId("bank_abbv_name").get("value");
                }
				else if(dj.byId("issuing_bank") && dj.byId("issuing_bank").get("value") !== "")
				{
					bank_abbv_name = dj.byId("issuing_bank").get("value");
				}


				// Check that the dimensions have a trailing semi-colon
				// as it will be appended to other rules later
				if(dimensions.slice(dimensions.length - 1) !== ";") {
					dimensions += ";";
				}
				
				contentURL += urlAction;
				queryStore.option = type;
				queryStore.user_action = userAction;
				queryStore.fields = fields;
				queryStore.entity = entity;
				queryStore.bank_abbv_name = bank_abbv_name;
				queryStore[excValue] = excludedValue;
				queryStore['dr-cr'] = drCr;
				queryStore['product-types'] = productTypes;
				queryStore.parameter = parameter;
				queryStore.companyId = companyId;
				queryStore.accountType = accountType;
				queryStore.isSearchScreen = isSearchScreen;
				
				if(dj.byId("issuing_bank_customer_reference") && dj.byId("issuing_bank_customer_reference").get("value") !== "" && productTypes.length > 0 && (("FT:TRTPT" === productTypes)||("FT:TRINT" === productTypes)))
				{	
//					issuing_bank_customer_reference value has to be passed , so we fetch accounts which belong to the particular reference only.
					queryStore['issuing_bank_customer_reference']=dj.byId("issuing_bank_customer_reference").get("value");
				}
				
				if(productTypes.length > 0 && "FX" === productTypes && parameter.indexOf("ownerType:") > -1) {
					queryStore.ownerType = parameter.substring(10);
				}
				
				if(ccyValues.length > 0){
					queryStore.ccy_codes = ccyValues.join(",");
				}
				
				url.push("/screen/", urlScreen);
				query.option = type;
				query.dimensions = dimensions;
				query.bank_abbv_name = bank_abbv_name; 
				query.entity = entity;
				query.popupType = "LIST_DATA";
				query.pageType = parameter;
				
				if (companyId) {
					query.companyid = companyId;
				}
				
				console.debug(messageGridContent, contentURL);
				
				if (!isQueryReadStore) {
					// Load data
					onLoadCallback = function() {
						var grid = dj.byId(type + "data_grid");
						grid.showMessage(grid.loadingMessage);
						m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
					};
				}
				
				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
				 m.connect("accountNo", "onKeyPress", function(evnt){
		                                        if(evnt.keyCode === dojo.keys.ENTER){
		                                                m.grid.filter(dj.byId('useraccountdata_grid'), ['ACCOUNTNOTEMP'], ['accountNo']);
		                                  }
		                                });
		                                m.connect("curCode", "onKeyPress", function(evnt){
		                                        if(evnt.keyCode === dojo.keys.ENTER){
		                                                m.grid.filter(dj.byId('useraccountdata_grid'), ['CURCODE'], ['curCode']);
		                                  }
	                                });
		                                m.connect("descriptionDialog", "onKeyPress", function(evnt){
		                                        if(evnt.keyCode === dojo.keys.ENTER){
		                                                m.grid.filter(dj.byId('useraccountdata_grid'), ['DESCRIPTION'], ['descriptionDialog']);
		                                  }
		                                });
				if (bank_abbv_name !== "") {
		        	 m.connect("bankName", "onKeyPress", function(evnt){
                         if(evnt.keyCode === dojo.keys.ENTER){
                                 m.grid.filter(dj.byId('useraccountdata_grid'), ['BANKNAME'], ['bankName']);
	                   }
	                 });
		         }		                                
			},
			
			/**
			 * <h4>Summary:</h4>
			 * This function is for showing fscm program dialog
			 * 
			 * @param String
			 * @param String[]
			 * @param String
			 * @param String
			 * @param Object
			 * @param boolean
			 * @param String
			 * @method showSearchFSCMProgramDialog
			 */
			showSearchFSCMProgramDialog : function(
					/* String */type,
					/* String[] */fields,
					/* String */dimensions,
					/* String */title,
					/* Object */parameter,
					/* boolean */isQueryReadStore,
					/* String */userAction) {
				var url = [], query = {}, contentURL = ajaxActionUrl, queryStore = {}, urlAction = "GetStaticData", urlScreen = ajaxStaticDPopup, onLoadCallback, entity, excludedValue;

				// Check that the dimensions have a trailing
				// semi-colon
				// as it will be appended to other rules later
				if (dimensions.slice(dimensions.length - 1) !== ";") {
					dimensions += ";";
				}

				contentURL += urlAction;
				queryStore.option = type;
				queryStore.user_action = userAction;
				queryStore.fields = fields;
				queryStore.entity = entity;
				queryStore[excValue] = excludedValue;
				d.mixin(queryStore, parameter);

				url.push("/screen/", urlScreen);
				query.option = type;
				query.dimensions = dimensions;
				d.mixin(query, parameter);
				query.popupType = "LIST_DATA";

				console.debug(messageGridContent,contentURL);

				if (!isQueryReadStore) 
				{
					// Load data
					onLoadCallback = function() 
					{
						var grid = dj.byId(type + "data_grid");
						grid.showMessage(grid.loadingMessage);
						m.grid.setStoreURL(grid, m.getServletURL(contentURL),queryStore);
					};
				}

				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);

				m.connect("programCode", "onKeyPress", function(evnt) {
					if (evnt.keyCode === dojo.keys.ENTER) {
						m.grid.filter(dj.byId('fscmprogramdata_grid'),[ 'PROGRAM_CODE' ],[ 'programCode' ]);
					}
				});

				m.connect("programName", "onKeyPress", function(
						evnt) {
					if (evnt.keyCode === dojo.keys.ENTER) {
						m.grid.filter(dj.byId('fscmprogramdata_grid'),[ 'PROGRAM_NAME' ],[ 'programName' ]);
					}
				});
				
				m.connect("programId", "onKeyPress", function(evnt) {
					if (evnt.keyCode === dojo.keys.ENTER) {
						m.grid.filter(dj.byId('fscmprogramdata_grid'),[ 'PROGRAM_ID' ],[ 'programId' ]);
					}
				});

			},
			
			
			/**
			 * <h4>Summary:</h4>
			 * This function is for showing fscm program for finance request, in a dialog.
			 * 
			 * @param String
			 * @param String[]
			 * @param String
			 * @param String
			 * @param String
			 * @param String
			 * @param boolean
			 * @method showFSCMProgramFinanceRequestDialog
			 */
			showFSCMProgramFinanceRequestDialog : function( /*String*/ type,
									 	 	  /*String[]*/ fields, 
									 	 	  /*String*/ parameter, 
									 	 	  /*String*/ screen,
									 	 	  /*String*/ dimensions, 
									 	 	  /*String*/ title, 
									 	 	  /*Boolean*/ isInPopup){
								
				var url = [],
					query = {},
					contentURL = ajaxActionUrl,
					queryStore = {},
					urlAction = "GetStaticData", 
					urlScreen = screen || ajaxStaticDPopup, 
					onLoadCallback, childDialog;

				// Check that the dimensions have a trailing
				// semi-colon
				// as it will be appended to other rules later
				if (dimensions.slice(dimensions.length - 1) !== ";") {
					dimensions += ";";
				}

				contentURL += urlAction;
				queryStore.option = type;
				queryStore.fields = fields;
				d.mixin(queryStore, parameter);

				url.push("/screen/", urlScreen);
				
				query.option = type;
				query.fields = fields;
				d.mixin(query, parameter);
				query.dimensions = dimensions;
				query.popupType = "LIST_DATA";

				console.debug(messageGridContent, contentURL);

				// Load data
				onLoadCallback = function() {
					var grid = dj.byId(type + "data_grid");
					grid.showMessage(grid.loadingMessage);
					m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
					m.connect("CurrencyName", "onKeyPress", function(evnt){
						if(evnt.keyCode === dojo.keys.ENTER){
							m.grid.filter(dj.byId('currencydata_grid'), ['NAME'], ['CurrencyName']);
					  }
					});
					
				};

				if (isInPopup) 
				{
					console.debug(chilDialog, url.join(""));
					childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
																		title : title,
																		id : "childXhrDialog",
																		href : m.getServletURL(url.join("")),
																		ioMethod: misys.xhrPost,
																		ioArgs: { content: query }
																	});

					m.dialog.connect(childDialog, "onLoad", onLoadCallback);
					m.dialog.connect( childDialog, "onHide", 
							function() {
											setTimeout(function() {
												m.dialog.disconnect(childDialog);
												childDialog.destroyRecursive();
											}, 2000);
										}
					);

					// Offset the dialog from the parent window
					var co = d.coords("xhrDialog");
					childDialog._relativePosition = {
						x : co.x + 30,
						y : co.y + 30
					};

					childDialog.show();
				} 
				else 
				{
					m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
				}
			},			
		/**
		 * <h4>Summary:</h4>
		 * This fuction is for showing Country code dialog
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param Boolean
		 * @method showCountryCodeDialog
		 * 
		 */
		showCountryCodeDialog : function( /*String*/ type,
								 	 	  /*String[]*/ fields, 
								 	 	  /*String*/ parameter, 
								 	 	  /*String*/ screen,
								 	 	  /*String*/ product, 
								 	 	  /*String*/ subProduct, 
								 	 	  /*String*/ dimensions, 
								 	 	  /*String*/ title, 
								 	 	  /*Boolean*/ isInPopup){
			var url = [],
				query = {},
				contentURL = ajaxActionUrl,
				queryStore = {},
				urlAction = "GetStaticData",
				urlScreen = screen || ajaxStaticDPopup,
				onLoadCallback,
				childDialog;
		
			// Check that the dimensions have a trailing semi-colon
			// as it will be appended to other rules later
			if(dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
			}

			contentURL += urlAction;
			queryStore.option = type;
			queryStore.fields = fields;
			queryStore.parameter = parameter;
			
			url.push("/screen/", urlScreen);
			query.option = type;
			query.fields = fields;
			query.parameter = parameter;
			query.dimensions = dimensions;
			query.popupType = "LIST_DATA";
			
			if(product) {
				query.productcode = product;
				queryStore.productcode = product;
			}
			
			if(subProduct) {
				query.subproductcode = subProduct;
				queryStore.subproductcode = subProduct;
			}
	
			console.debug(messageGridContent, contentURL);

			// Load data
			onLoadCallback = function() {
					var grid = dj.byId(type + "data_grid");
					grid.showMessage(grid.loadingMessage);
					m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
					
					m.connect("country_name_popup", "onKeyPress", function(evnt){
						if(evnt.keyCode === dojo.keys.ENTER){
							m.grid.filter(dj.byId('codevaluedata_grid'), ['DESCRIPTION'], ['country_name_popup']);
					  }
					});
//					
			};
			
			if(isInPopup) {
				console.debug(chilDialog, url.join(""), query);
				childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
					title: title,
					id: "childXhrDialog",
					href: m.getServletURL(url.join("")),
					ioMethod: misys.xhrPost,
					ioArgs: { content: query }
				});

				m.dialog.connect(childDialog, "onLoad", onLoadCallback);
				m.dialog.connect(childDialog, "onHide", function(){setTimeout(function(){
					m.dialog.disconnect(childDialog);
					childDialog.destroyRecursive();
				}, 200);});
				
				// Offset the dialog from the parent window
				var co = d.coords("xhrDialog");
				childDialog._relativePosition = {
						x: co.x + 30,
						y: co.y + 30
				};
				
				childDialog.show();
			} else {
				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for showing currency code dialog
		 * @param String
		 * @param String[]
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param Boolean
		 * @method showCurrencyCodeDialog
		 * 
		 */
		showCurrencyCodeDialog : function( /*String*/ type,
								 	 	  /*String[]*/ fields, 
								 	 	  /*String*/ parameter, 
								 	 	  /*String*/ screen,
								 	 	  /*String*/ product, 
								 	 	  /*String*/ subProduct, 
								 	 	  /*String*/ dimensions, 
								 	 	  /*String*/ title, 
								 	 	  /*Boolean*/ isInPopup){
							
			var url = [],
				query = {},
				contentURL = ajaxActionUrl,
				queryStore = {},
				urlAction = "GetStaticData", 
				urlScreen = screen || ajaxStaticDPopup, 
				onLoadCallback, childDialog;

			// Check that the dimensions have a trailing
			// semi-colon
			// as it will be appended to other rules later
			if (dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
			}

			contentURL += urlAction;
			queryStore.option = type;
			queryStore.fields = fields;
			queryStore.parameter = parameter;

			url.push("/screen/", urlScreen);
			
			query.option = type;
			query.fields = fields;
			query.parameter = parameter;
			query.dimensions = dimensions;
			query.popupType = "LIST_DATA";

			if (product) {
				query.productcode = product;
				contentURL.push(varProdCode, product);
			}

			if (subProduct) {
				query.subproductcode = subProduct;
				contentURL.push("&subproductcode=", subProduct);
			}

			console.debug(messageGridContent, contentURL);

			// Load data
			onLoadCallback = function() {
				var grid = dj.byId(type + "data_grid");
				grid.showMessage(grid.loadingMessage);
				m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
				m.connect("CurrencyName", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('currencydata_grid'), ['NAME'], ['CurrencyName']);
				  }
				});
				
			};

			if (isInPopup) 
			{
				console.debug(chilDialog, url.join(""));
				childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
																	title : title,
																	id : "childXhrDialog",
																	href : m.getServletURL(url.join("")),
																	ioMethod: misys.xhrPost,
																	ioArgs: { content: query }
																});

				m.dialog.connect(childDialog, "onLoad", onLoadCallback);
				m.dialog.connect( childDialog, "onHide", 
						function() {
										setTimeout(function() {
											m.dialog.disconnect(childDialog);
											childDialog.destroyRecursive();
										}, 200);
									}
				);

				// Offset the dialog from the parent window
				var co = d.coords("xhrDialog");
				childDialog._relativePosition = {
					x : co.x + 30,
					y : co.y + 30
				};

				childDialog.show();
			} 
			else 
			{
				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function to check whether the data grid in the
		 * amendment pop up is empty.
		 */
		isGridEmpty : function(){
			var emptyFlag = true;
			if(dijit.byId("amendments").store){
				for(var i = 0; i < dijit.byId("amendments").store._arrayOfAllItems.length; i++){
					if(dijit.byId("amendments").store._arrayOfAllItems[i] != null){
						emptyFlag = false;
					}
				}
			}
			return emptyFlag;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for toggling the radio buttons
		 * in the amendment pop up.
		 * ADD/DELETE selected and grid NOT empty: REPALL is enabled.
		 * ADD/DELETE selected and grid is empty: REPALL is enabled.
		 * Multiple ADD/DELETE allowed.
		 * REPALL can be done only once.
		 */
		toggleADR : function(){
			if(dj.byId("adr_1").get("value") || dj.byId("adr_2").get("value")){
				var adr3 = dj.byId("adr_3");
				if(!m.isGridEmpty()){
					adr3.set("disabled", true);
				}
				dj.byId("narrative_description_goods_popup").set("value","");
				if(dj.byId("adr_1").get("value")){
					dj.byId("narrative_description_goods_popup").set("value","/ADD/");
				}
				else if(dj.byId("adr_2").get("value")){
					dj.byId("narrative_description_goods_popup").set("value","/DELETE/");
				}
			}
			if(dj.byId("adr_3").get("value")){
				dj.byId("narrative_description_goods_popup").set("value","");
				if(!m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems[0].verb[0] != "REPALL"){
					dj.byId("adr_3").set("disabled", true);
					dj.byId("narrative_description_goods_popup").set("disabled",true);
					dj.byId("adr_3").set("value",false);
				}
				dj.byId("narrative_description_goods_popup").set("value","/REPALL/");
			}
			if(dj.byId("adr_1").get("value") === "ADD" || dj.byId("adr_2").get("value") === "DELETE" || dj.byId("adr_3").get("value") === "REPALL"){
				dj.byId("narrative_description_goods_popup").set("disabled",false);
			}
			if(!m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems[0].verb[0] == "REPALL"){
				dj.byId("adr_1").set("disabled", true);
				dj.byId("adr_2").set("disabled", true);
				dj.byId("adr_3").set("disabled", false);
				dj.byId("adr_3").set("value", "REPALL");
				dj.byId("narrative_description_goods_popup").set("disabled",true);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for handles the action on click of
		 * OK button in amendment pop up.
		 * Places the current grid data, above the tab group container 
		 * on the base page.
		 */
		consolidateGridData : function(){
			var table;
			var verb, text;
			if(m.isGridEmpty()){
				m.dialog.show("CONFIRMATION", m.getLocalization("saveEmptyDataConfirmation"), "", onLoadCallback);
				table = "<table><tr><span style='height: 1px;'></span></tr>" ;
			}
			else if(!m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems) {
				table = "<table><tr><b><span style='color: blue;' class='indented-header;'>Current Amendment</span></b></tr>" ;
				for(var u = 0; u < dijit.byId("amendments").store._arrayOfAllItems.length; u++){
					if(dijit.byId("amendments").store._arrayOfAllItems[u] != null){
						table += "<tr><td style='white-space: pre-wrap;'>";
						var verbId = dijit.byId("amendments").store._arrayOfAllItems[u].verb[0];
						var displayedVerb = '';
						if(verbId === "ADD") {
							displayedVerb = misys.getLocalization("add");
						}else if(verbId === "DELETE") {
							displayedVerb = misys.getLocalization("delete");
						}else if(verbId === "REPALL") {
							displayedVerb = misys.getLocalization("repall");
						}
						verb = "<b>/"+displayedVerb+"/</b>";
						text = dijit.byId("amendments").store._arrayOfAllItems[u].content[0];
						table += verb+" "+text;
						table += "</td></tr>";
					}
				}
				
			}
			table += "</table>";
			var onLoadCallback = function(){
				var gridStoreData;
				if(dijit.byId("amendments").store && !m.isGridEmpty()){
					gridStoreData = dijit.byId("amendments").store._arrayOfAllItems;
					if(m._config.narrativeId === "narrative_amend_goods"){
						m._config.narrativeDescGoodsDataStore = gridStoreData;
						document.getElementById("narrativeDescriptionGoods").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_docs"){
						m._config.narrativeDocsReqDataStore = gridStoreData;
						document.getElementById("narrativeDocumentsRequired").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_instructions"){
						m._config.narrativeAddInstrDataStore = gridStoreData;
						document.getElementById("narrativeAdditionalInstructions").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_sp_beneficiary"){
						m._config.narrativeSpBeneDataStore = gridStoreData;
						document.getElementById("narrativeSpecialBeneficiary").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_sp_recvbank"){
						m._config.narrativeSpRecvbankDataStore = gridStoreData;
						document.getElementById("narrativeSpecialReceivingBank").innerHTML=table;
					}
				}
				else if(m.isGridEmpty()){
					if(m._config.narrativeId === "narrative_amend_goods"){
						m._config.narrativeDescGoodsDataStore.length = 0;
						document.getElementById("narrativeDescriptionGoods").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_docs"){
						m._config.narrativeDocsReqDataStore.length = 0;
						document.getElementById("narrativeDocumentsRequired").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_instructions"){
						m._config.narrativeAddInstrDataStore.length = 0;
						document.getElementById("narrativeAdditionalInstructions").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_sp_beneficiary"){
						m._config.narrativeSpBeneDataStore.length = 0;
						document.getElementById("narrativeSpecialBeneficiary").innerHTML=table;
					}
					if(m._config.narrativeId === "narrative_amend_sp_recvbank"){
						m._config.narrativeSpRecvbankDataStore.length = 0;
						document.getElementById("narrativeSpecialReceivingBank").innerHTML=table;
					}
				}
           	 	if(dj.byId("narrative_description_goods_popup").state === "" && !dj.byId("narrative_description_goods_popup").disabled){
					m.toggleNarrativeDivStatus(true);
           	 	}
				m.dialog.hide();
				m.initDivMouseOver();
			};
			if(!m.isGridEmpty()){
				if(m.hasTextBoxLogicalValue()){
					m.dialog.show("CONFIRMATION", m.getLocalization("unsavedDataExistInTextBox"), "", onLoadCallback);
				}
				else{
					m.dialog.show("CONFIRMATION", m.getLocalization("saveDataConfirmation"), "", onLoadCallback);
				}
			}
			else{
				m.dialog.show("CONFIRMATION", m.getLocalization("saveEmptyDataConfirmation"), "", onLoadCallback);
			}
			console.log(dj.byId("narrative_description_goods_popup").get("value"));
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for handling the ocClick of
		 * 'Cancel' in the amendment popup.
		 * 
		 */
		closeAmendmentPopup : function(){
			var onLoadCallback = function(){
				m._config.narrativeId = '';
				var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
				var i = 0, msgRows = 0, fieldSize = 0;
				for(var itr = 0; itr < 5; itr++){
					if(dataStoreNarrative[itr]){
						d.forEach(dataStoreNarrative[itr], function(){
							if(dataStoreNarrative[itr][i] && dataStoreNarrative[itr][i] !== null){
								dataStoreNarrative[itr][i].content[0].replace(/&#xa;/g,'\n');
								fieldSize += dataStoreNarrative[itr][i].content[0].length;
								msgRows += dataStoreNarrative[itr][i].text_size[0];
							}
							i++;
						});
					}
				}
				if(msgRows <= (misys._config.is798 == 'Y' ? 792 : 800)){
					m.toggleNarrativeDivStatus(true);
				}
				else{
					m.initDivMouseOver();
				}
				m.dialog.hide();
			};
			if(!m.hasTextBoxLogicalValue()){
				m.dialog.show("CONFIRMATION", m.getLocalization("cancelTransactionConfirmation"), "", onLoadCallback);
			}
			else{
				if(dj.byId("narrative_description_goods_popup").get("value") != "/ADD/" &&
						dj.byId("narrative_description_goods_popup").get("value") != "/DELETE/" &&
						dj.byId("narrative_description_goods_popup").get("value") != "/REPALL/"){
					m.dialog.show("CONFIRMATION", m.getLocalization("unsavedDataExistInTextBox"), "", onLoadCallback);
				}
			}
		},

		/**
		 * To view extended views of base page narratives on amendment base page
		 * */
		viewNarrativeInPopUp : function( /*String*/ type,
				 /*String*/ fields, 
				 /*String*/ parameter,
				 /*String*/ product, 
				 /*String*/ dimensions,
				 /*String*/ title,
				 /*String*/ amdno){
			var url = [],
			query = {},
			contentURL = [ ajaxActionUrl ],
			urlAction = "GetStaticData",
			urlScreen = ajaxStaticDPopup,
			onLoadCallback;
			
			if(dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
			}
			
			var rundataXML;
			m._config.amendmentNumber = amdno;
			m._config.narrativeId = parameter;
			if(parameter === "narrative_amend_goods"){
				if(dj.byId("org_narrative_description_goods") && dj.byId("org_narrative_description_goods").get("value") != ''){
					rundataXML = dj.byId("org_narrative_description_goods").get("value");
				} else {
					rundataXML = dj.byId("original_narrative_description_goods") ? dj.byId("original_narrative_description_goods").get("value") : "";
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")=="03" && misys._config.narrativeDescGoodsDataStore && misys._config.narrativeDescGoodsDataStore.length != 0){
					rundataXML = rundataXML.concat(m.customXMLForCurrentAmend(misys._config.narrativeDescGoodsDataStore));
				}
			}
			else if(parameter === "narrative_amend_docs"){
				if(dj.byId("org_narrative_documents_required") && dj.byId("org_narrative_documents_required").get("value") != ''){
					rundataXML = dj.byId("org_narrative_documents_required").get("value");
				} else {
					rundataXML = dj.byId("original_narrative_documents_required") ? dj.byId("original_narrative_documents_required").get("value") : "";
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")=="03" && misys._config.narrativeDocsReqDataStore && misys._config.narrativeDocsReqDataStore.length != 0){
					rundataXML = rundataXML.concat(m.customXMLForCurrentAmend(misys._config.narrativeDocsReqDataStore));
				}
			}
			else if(parameter === "narrative_amend_instructions"){
				if(dj.byId("org_narrative_additional_instructions") && dj.byId("org_narrative_additional_instructions").get("value") != ''){
					rundataXML = dj.byId("org_narrative_additional_instructions").get("value");
				} else {
					rundataXML = dj.byId("original_narrative_additional_instructions") ? dj.byId("original_narrative_additional_instructions").get("value") : "";
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")=="03" && misys._config.narrativeAddInstrDataStore && misys._config.narrativeAddInstrDataStore.length != 0){
					rundataXML = rundataXML.concat(m.customXMLForCurrentAmend(misys._config.narrativeAddInstrDataStore));
				}
			}
			else if(parameter === "narrative_amend_sp_beneficiary"){
				if(dj.byId("org_narrative_special_beneficiary") && dj.byId("org_narrative_special_beneficiary").get("value") != ''){
					rundataXML = dj.byId("org_narrative_special_beneficiary").get("value");
				} else {
					rundataXML = dj.byId("original_narrative_special_beneficiary") ? dj.byId("original_narrative_special_beneficiary").get("value") : "";
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")=="03" && misys._config.narrativeSpBeneDataStore && misys._config.narrativeSpBeneDataStore.length != 0){
					rundataXML = rundataXML.concat(m.customXMLForCurrentAmend(misys._config.narrativeSpBeneDataStore));
				}
			}
			else if(parameter === "narrative_amend_sp_recvbank"){
				if(dj.byId("org_narrative_special_recvbank") && dj.byId("org_narrative_special_recvbank").get("value") != ''){
					rundataXML = dj.byId("org_narrative_special_recvbank").get("value");
				} else {
					rundataXML = dj.byId("original_narrative_special_recvbank") ? dj.byId("original_narrative_special_recvbank").get("value") : "";
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")=="03" && misys._config.narrativeSpRecvbankDataStore && misys._config.narrativeSpRecvbankDataStore.length != 0){
					rundataXML = rundataXML.concat(m.customXMLForCurrentAmend(misys._config.narrativeSpRecvbankDataStore));
				}
			}
			
			contentURL.push(urlAction);
			query.option = type;
			query.dimensions = dimensions;
			query.messageValue = fields;
			query.node = type;
			query.rundataXML = rundataXML;
			
			
			url.push("/screen/", urlScreen);	
			//d.mixin(query, parameter);
						
			m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
		},
		
		/**
		 * Custom xml to show the current amendment in the extended pop up on base page.
		 */
		customXMLForCurrentAmend : function(/*String*/ dataStore){
			var i = 0;
			var customXML = "<amendments>";
			customXML = customXML.concat("<amendment>");
			customXML = customXML.concat("<sequence>");
			customXML = customXML.concat(m._config.amendmentNumber);
			customXML = customXML.concat("</sequence>");
			customXML = customXML.concat("<data>");
			for(i = 0 ;i < dataStore.length; i++){
				if(dataStore[i] != null){
					customXML = customXML.concat("<datum>");
					customXML = customXML.concat("<id>");
					customXML = customXML.concat(i);
					customXML = customXML.concat("</id>");
					customXML = customXML.concat("<verb>");
					customXML = customXML.concat(dataStore[i].verb[0]);
					customXML = customXML.concat("</verb>");
					customXML = customXML.concat("<text>");
					customXML = customXML.concat( dojox.html.entities.encode(dataStore[i].content[0], dojox.html.entities.html));
					customXML = customXML.concat("</text>");
					customXML = customXML.concat("</datum>");
				}
			}
			customXML = customXML.concat("</data>");
			customXML = customXML.concat("</amendment>");
			customXML = customXML.concat("</amendments>");
			return customXML;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for showing the error bubble
		 * on the narrative tab group div on hovering of mouse, using tooltip.
		 * 
		 */
		initDivMouseOver : function(){
		    var tabNarrativeDescriptionGoodsNode = document.getElementById("tabNarrativeDescriptionGoods");
		    var sendMode = dj.byId("adv_send_mode") ? dj.byId("adv_send_mode").get("value") : '';

		    tabNarrativeDescriptionGoodsNode.onmouseover = function(){
			   if((dj.byId("narrative_description_goods_popup") && dj.byId("narrative_description_goods_popup").state == "Error") ||
					   (document.getElementById("tabNarrativeDescriptionGoods").status == false) && (sendMode === '01') && m._config.isZCharValid && m._config.isSingleNarrativeValid[0]){
				   isSingleFieldValid ? dijit.showTooltip(m.getLocalization("invalidFieldSizeError",[limit, entered]), tabNarrativeDescriptionGoodsNode,["after"]) :
					   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeDescriptionGoodsNode,["after"]);
				}
			   else if(m._config.isNarrativeZCharValidArray && ! m._config.isNarrativeZCharValidArray[0] && document.getElementById("tabNarrativeDescriptionGoods").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank"), tabNarrativeDescriptionGoodsNode,["after"]);
			   }
			   else if(m._config.isSingleNarrativeValid && ! m._config.isSingleNarrativeValid[0] && document.getElementById("tabNarrativeDescriptionGoods").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeDescriptionGoodsNode,["after"]);
			   }
		    };
		    tabNarrativeDescriptionGoodsNode.onmouseout = function(){
			    dijit.hideTooltip(tabNarrativeDescriptionGoodsNode);
		    };
		    
		    var tabNarrativeDocumentsRequiredNode = document.getElementById("tabNarrativeDocumentsRequired");
		    tabNarrativeDocumentsRequiredNode.onmouseover = function(){
			   if((dj.byId("narrative_description_goods_popup") && dj.byId("narrative_description_goods_popup").state == "Error") ||
					   (document.getElementById("tabNarrativeDescriptionGoods").status == false) && tabNarrativeDocumentsRequiredNode.status==false && (sendMode === '01') && m._config.isZCharValid && m._config.isSingleNarrativeValid[1]){
				   isSingleFieldValid ? dijit.showTooltip(m.getLocalization("invalidFieldSizeError",[limit, entered]), tabNarrativeDocumentsRequiredNode,["after"]) :
					   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeDocumentsRequiredNode,["after"]);
				}
			   else if(m._config.isNarrativeZCharValidArray && !m._config.isNarrativeZCharValidArray[1] && document.getElementById("tabNarrativeDocumentsRequired").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank"), tabNarrativeDocumentsRequiredNode,["after"]);
			   }
			   else if(m._config.isSingleNarrativeValid && ! m._config.isSingleNarrativeValid[1] && document.getElementById("tabNarrativeDescriptionGoods").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeDescriptionGoodsNode,["after"]);
			   }
		    };
		    tabNarrativeDocumentsRequiredNode.onmouseout = function(){
			    dijit.hideTooltip(tabNarrativeDocumentsRequiredNode);
		    };
		    
		    var tabNarrativeAdditionalInstructionsNode = document.getElementById("tabNarrativeAdditionalInstructions");
		    tabNarrativeAdditionalInstructionsNode.onmouseover = function(){
			   if((dj.byId("narrative_description_goods_popup") && dj.byId("narrative_description_goods_popup").state == "Error") ||
					   (document.getElementById("tabNarrativeDescriptionGoods").status == false) && tabNarrativeAdditionalInstructionsNode.status == false && (sendMode === '01') && m._config.isZCharValid && m._config.isSingleNarrativeValid[2]){
				   isSingleFieldValid ? dijit.showTooltip(m.getLocalization("invalidFieldSizeError",[limit, entered]), tabNarrativeAdditionalInstructionsNode,["after"]) :
					   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeAdditionalInstructionsNode,["after"]);
				}
			   else if(m._config.isNarrativeZCharValidArray && !m._config.isNarrativeZCharValidArray[2] && document.getElementById("tabNarrativeAdditionalInstructions").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank"), tabNarrativeAdditionalInstructionsNode,["after"]);
			   }
			   else if(m._config.isSingleNarrativeValid && ! m._config.isSingleNarrativeValid[2] && document.getElementById("tabNarrativeDescriptionGoods").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeDescriptionGoodsNode,["after"]);
			   }
		    };
		    tabNarrativeAdditionalInstructionsNode.onmouseout = function(){
			    dijit.hideTooltip(tabNarrativeAdditionalInstructionsNode);
		    };
		    
		    var tabNarrativeSpecialBeneficiaryNode = document.getElementById("tabNarrativeSpecialBeneficiary");
		    tabNarrativeSpecialBeneficiaryNode.onmouseover = function(){
			   if((dj.byId("narrative_description_goods_popup") && dj.byId("narrative_description_goods_popup").state == "Error") ||
					   (document.getElementById("tabNarrativeDescriptionGoods").status == false) && tabNarrativeSpecialBeneficiaryNode == false && (sendMode === '01') && m._config.isZCharValid && m._config.isSingleNarrativeValid[3]){
				   isSingleFieldValid ? dijit.showTooltip(m.getLocalization("invalidFieldSizeError",[limit, entered]), tabNarrativeSpecialBeneficiaryNode,["after"]) :
					   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeSpecialBeneficiaryNode,["after"]);
				}
			   else if(m._config.isNarrativeZCharValidArray && !m._config.isNarrativeZCharValidArray[3] && document.getElementById("tabNarrativeSpecialBeneficiary").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank"), tabNarrativeSpecialBeneficiaryNode,["after"]);
			   }
			   else if(m._config.isSingleNarrativeValid && ! m._config.isSingleNarrativeValid[3] && document.getElementById("tabNarrativeDescriptionGoods").status == false){
				   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredtSingle]), tabNarrativeDescriptionGoodsNode,["after"]);
			   }
		    };
		    tabNarrativeSpecialBeneficiaryNode.onmouseout = function(){
			    dijit.hideTooltip(tabNarrativeSpecialBeneficiaryNode);
		    };
		    if(document.getElementById("tabNarrativeSpecialReceivingBank")){
		    	var tabNarrativeSpecialReceivingBankNode = document.getElementById("tabNarrativeSpecialReceivingBank");
			    tabNarrativeSpecialReceivingBankNode.onmouseover = function(){
					   if((dj.byId("narrative_description_goods_popup") && dj.byId("narrative_description_goods_popup").state == "Error") ||
							   (document.getElementById("tabNarrativeDescriptionGoods").status == false) && tabNarrativeSpecialReceivingBankNode.status == false && (sendMode === '01') && m._config.isZCharValid && m._config.isSingleNarrativeValid[4]){
						   isSingleFieldValid ? dijit.showTooltip(m.getLocalization("invalidFieldSizeError",[limit, entered]), tabNarrativeSpecialReceivingBankNode,["after"]) :
							   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeSpecialReceivingBankNode,["after"]);
						}
					   else if(m._config.isNarrativeZCharValidArray && !m._config.isNarrativeZCharValidArray[4] && document.getElementById("tabNarrativeSpecialReceivingBank").status == false){
						   dijit.showTooltip(m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank"), tabNarrativeSpecialReceivingBankNode,["after"]);
					   }
					   else if(m._config.isSingleNarrativeValid && ! m._config.isSingleNarrativeValid[4] && document.getElementById("tabNarrativeDescriptionGoods").status == false){
						   dijit.showTooltip(m.getLocalization("invalidSingleFieldLength", [limitSingle, enteredSingle]), tabNarrativeDescriptionGoodsNode,["after"]);
					   }
				    };
			    tabNarrativeSpecialBeneficiaryNode.onmouseout = function(){
				    dijit.hideTooltip(tabNarrativeSpecialBeneficiaryNode);
			    };
		    }
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for opening the amendment pop up.
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 */
		editNarrativeInPopUp : function( /*String*/ type,
				 /*String*/ fields, 
				 /*String*/ parameter,
				 /*String*/ product, 
				 /*String*/ dimensions,
				 /*String*/ title,
				 /*String*/ amdno){
			var url = [],
			query = {},
			contentURL = [ ajaxActionUrl ],
			urlAction = "GetStaticData",
			urlScreen = ajaxStaticDPopup,
			onLoadCallback;
			
			if(dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
			}
			
			var rundataXML, is798 = dj.byId("is798") ? dj.byId("is798").get("value") : (dj.byId("issuing_bank_abbv_name") ? (m._config.customerBanksMT798Channel[dj.byId("issuing_bank_abbv_name").get("value")] == true ? 'Y' : 'N') : (dj.byId("advising_bank_abbv_name") ? (m._config.customerBanksMT798Channel[dj.byId("advising_bank_abbv_name").get("value")] == true ? 'Y' : 'N') : 'N'));
			m._config.is798 = is798;
			m._config.amendmentNumber = amdno;
			m._config.narrativeId = parameter;
			if(parameter === "narrative_amend_goods"){
				rundataXML = dj.byId("org_narrative_description_goods") ? dj.byId("org_narrative_description_goods").get("value") : "";
			}
			else if(parameter === "narrative_amend_docs"){
				rundataXML = dj.byId("org_narrative_documents_required") ? dj.byId("org_narrative_documents_required").get("value") : "";
			}
			else if(parameter === "narrative_amend_instructions"){
				rundataXML = dj.byId("org_narrative_additional_instructions") ? dj.byId("org_narrative_additional_instructions").get("value") : "";
			}
			else if(parameter === "narrative_amend_sp_beneficiary"){
				rundataXML = dj.byId("org_narrative_special_beneficiary") ? dj.byId("org_narrative_special_beneficiary").get("value") : "";
			}
			else if(parameter === "narrative_amend_sp_recvbank"){
				rundataXML = dj.byId("org_narrative_special_recvbank") ? dj.byId("org_narrative_special_recvbank").get("value") : "";
			}
			
			contentURL.push(urlAction);
			query.option = type;
			query.dimensions = dimensions;
			query.messageValue = fields;
			query.node = type;
			query.rundataXML = rundataXML;
			query.is798 = is798;
			
			
			url.push("/screen/", urlScreen);	
			//d.mixin(query, parameter);
			
			var prevRadioButton = "";
			
			onLoadCallback = function() {
				if(m._config.codeword_enabled==true){
					dj.byId("narrative_description_goods_popup").set("disabled",true);
					
					var onOkCallback = function(){
						m.toggleADR();
					};
					var onCancelCallback = function(){
						dj.byId(prevRadioButton).set("value",true);
					};
					
					m.connect("adr_1", "onClick", function(){
						if(!m.hasTextBoxLogicalValue()){
							m.toggleADR();
						}
						else{
							m.dialog.show("Warning", m.getLocalization("textboxDataLossOnToggle"),"","","","",onOkCallback,onCancelCallback);
						}
					});
					m.connect("adr_1", "onChange", function(){
						prevRadioButton = "adr_1";
					});
					
					m.connect("adr_2", "onClick", function(){
						if(!m.hasTextBoxLogicalValue()){
							m.toggleADR();
						}
						else{
							m.dialog.show("Warning", m.getLocalization("textboxDataLossOnToggle"),"","","","",onOkCallback,onCancelCallback);
						}
					});
					m.connect("adr_2", "onChange", function(){
						prevRadioButton = "adr_2";
					});
					
					m.connect("adr_3", "onClick", function(){
						if(!m.hasTextBoxLogicalValue()){
							m.toggleADR();
						}
						else{
							m.dialog.show("Warning", m.getLocalization("textboxDataLossOnToggle"),"","","","",onOkCallback,onCancelCallback);
						}
					});
					m.connect("adr_3", "onChange", function(){
						prevRadioButton = "adr_3";
					});
					
					m.connect("narrative_description_goods_popup", "onKeyPress", function(evnt){
						var readOnlyLength;
						readOnlyLength = dj.byId("adr_1").get("value") == "ADD" ? 5:8;
						if ((evnt.keyCode !== dojo.keys.LEFT_ARROW && (evnt.keyCode !== dojo.keys.RIGHT_ARROW)) && ((this.domNode.selectionStart < readOnlyLength) ||
								((this.domNode.selectionEnd == readOnlyLength) && (evnt.keyCode === dojo.keys.BACKSPACE)))){
							evnt.preventDefault();
						}
					});
				}
				if(misys._config.swiftExtendedNarrativeEnabled){
					m.setValidation("narrative_description_goods_popup", m.validatePopupDataLength);
				}else{
					m.setValidation("narrative_description_goods_popup", m.validatePopupData);
				}
				m.connect("addAmendmentButton", "onClick", function(){
					if(m.hasTextBoxLogicalValue()){
						m.onSaveSizeAndSwiftValidation();
					}
				});
					
			};
			m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
		},
		
		/**
		 * Function to check the values in the amendment narrative pop up text box
		 * */
		hasTextBoxLogicalValue : function(){
			if(dj.byId("narrative_description_goods_popup").disabled ||
				   dj.byId("narrative_description_goods_popup").get("value") === "/ADD/" ||
				   dj.byId("narrative_description_goods_popup").get("value") === "/DELETE/" ||
				   dj.byId("narrative_description_goods_popup").get("value") === "/REPALL/"){
				return false;
			}
				return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Function to do z-char validation and length validation
		 * onClick of 'Save' button in the pop up. 
		 */
		onSaveSizeAndSwiftValidation : function(){
            var value=dj.byId("narrative_description_goods_popup").get("value");
            var sendMode = '';
            if(dj.byId("adv_send_mode")) {
            	sendMode=dj.byId("adv_send_mode").get("value");
            }
            
            var regex=dj.byId("swiftregexzcharValue").get("value");
            if(sendMode !== '01' || value === null || value === ""){
            	m._config.isZCharValid = true;
            	m.toggleNarrativeDivStatus(true);
            }
            else{
	    	    var swiftchar = value;
	            var swiftregexp = new RegExp(regex);
	            m._config.isZCharValid= swiftregexp.test(swiftchar);
            }
            dj.byId("narrative_description_goods_popup").set("value", dojox.html.entities.encode(dj.byId("narrative_description_goods_popup").get("value"), dojox.html.entities.html));
            var onOkCallback = function(){
            	dj.byId("amendments").createDataGrid();
        		if(m._config.codeword_enabled == true){
					m.toggleADR();
        		}
				else if(!m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems[0].verb[0] == "REPALL"){
					dj.byId("narrative_description_goods_popup").set("disabled",true);
				}
			};
            var onOkCallback1 = function(){
    			var fieldValue = dj.byId("narrative_description_goods_popup").get("value");
            	if(m.validatePopupData()){
    				dj.byId("amendments").createDataGrid();
    			}
        		if(m._config.codeword_enabled == true){
					m.toggleADR();
					m._config.swiftExtendedNarrativeEnabled ? "" : dj.byId("narrative_description_goods_popup").set("value",fieldValue);
        		}
				else if(!m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems[0].verb[0] == "REPALL"){
					dj.byId("narrative_description_goods_popup").set("disabled",true);
				}
			};
            if(!m._config.isZCharValid){
               if(m.validatePopupData()){
	               var userType;
	               if (document.getElementById("_userType")){
	            	   userType = document.getElementById("_userType").getAttribute('value');
	               }
	               
	               if(userType == '03' || userType == '06'){
	                    m.dialog.show("CONFIRMATION", m.getLocalization("invalidSWIFTTransactionValidValuesWithExt"),"","","","",onOkCallback);
	               }
	               else{
	            	   m.dialog.show("Warning", m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank"),"","","","",onOkCallback);
	               }   
	               m.toggleNarrativeDivStatus(true);
               }else{
	               m.dialog.show("ERROR", m.getLocalization("invalidSWIFTTPopupValueLength"),"","","","",onOkCallback1);
               }
        	}
            else if(m._config.isZCharValid){
            	 if(dj.byId("narrative_description_goods_popup").state === "Error"){
	            	 m.toggleNarrativeDivStatus(false);
	            	 if(m._config.swiftExtendedNarrativeEnabled){
	            		 m.dialog.show("Warning", m.getLocalization("invalidSWIFTTPopupValueSize"),"","","","",onOkCallback);
	            	 }else{
	            		 m.dialog.show("ERROR", m.getLocalization("invalidSWIFTTPopupValueLength"),"","","","",onOkCallback1);
	            	 }
                 }
            	 else{
            	 dj.byId("amendments").createDataGrid();
        		 if(m._config.codeword_enabled == true){
					m.toggleADR();
             		}
					else if(!m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems[0].verb[0] == "REPALL"){
					dj.byId("narrative_description_goods_popup").set("disabled",true);
				}
        		m.toggleNarrativeDivStatus(true);
               }
           }
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is setting the state of div to true/false. 
		 */
		toggleNarrativeDivStatus : function(/*Boolean*/divStatus, /*String*/divName){
			var domNodeArray = ["tabNarrativeDescriptionGoods","tabNarrativeDocumentsRequired","tabNarrativeAdditionalInstructions","tabNarrativeSpecialBeneficiary","tabNarrativeSpecialReceivingBank"];
			var divColor = divStatus ? 'solid 1px #B8B8B8' : 'solid 1px #d46464';
			if(divName == '' || divName == undefined){
				for(var itr = 0; itr < domNodeArray.length; itr++){
	           		if(document.getElementById(domNodeArray[itr]) != null) {
		           		document.getElementById(domNodeArray[itr]).status = divStatus;
		           		document.getElementById(domNodeArray[itr]).style.border = divColor;
	           		}
	           	 }
			}
			else{
				document.getElementById(divName).status = divStatus;
           		document.getElementById(divName).style.border = divColor;
			}
			if(document.getElementById("tabNarrativeDescriptionGoods") != null || document.getElementById("tabNarrativeDocumentsRequired") != null || 
					document.getElementById("tabNarrativeAdditionalInstructions") != null || document.getElementById("tabNarrativeSpecialBeneficiary") != null || 
					document.getElementById("tabNarrativeSpecialReceivingBank") != null) {
				m.initDivMouseOver();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for validating the text size. 
		 */
		validatePopupDataLength : function() {
			var descOfGoodsSize = 0,fieldSizeTotal = 0, fieldSizeSingle = 0, i = 0, msgRowsTotal = 0, msgRowsSingle = 0;
			var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
			var narrativeId = ["narrative_amend_goods","narrative_amend_docs","narrative_amend_instructions","narrative_amend_sp_beneficiary","narrative_amend_sp_recvbank"];
			var narrativeIdIndex = narrativeId.indexOf(m._config.narrativeId);
			var sendMode = dj.byId("adv_send_mode")? dj.byId("adv_send_mode").get("value") : '';

			if(sendMode !== '01'){
				  return true;
			}
			for(var itr = 0; itr < 5; itr++){
				if(dataStoreNarrative[itr] && (itr != narrativeIdIndex && narrativeIdIndex != -1)){
					i = 0;
					d.forEach(dataStoreNarrative[itr], function(){
						if(dataStoreNarrative[itr][i] && dataStoreNarrative[itr][i] !== null){
							dataStoreNarrative[itr][i].content[0].replace(/&#xa;/g,'\n');
							fieldSizeTotal += dataStoreNarrative[itr][i].content[0].length;
							msgRowsTotal += dataStoreNarrative[itr][i].text_size[0];
						}
						i++;
					});
				}
			}
			if(dijit.byId("amendments") && !m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems){
				for(var v = 0; v < dijit.byId("amendments").store._arrayOfAllItems.length; v++){
					if(dijit.byId("amendments").store._arrayOfAllItems[v] !== null){
						fieldSizeSingle += dijit.byId("amendments").store._arrayOfAllItems[v].content ? dijit.byId("amendments").store._arrayOfAllItems[v].content[0].length : 0;
						fieldSizeSingle += dijit.byId("amendments").store._arrayOfAllItems[v].verb ? ("/"+dijit.byId("amendments").store._arrayOfAllItems[v].verb[0]+"/").length : 0;
						msgRowsSingle += dijit.byId("amendments").store._arrayOfAllItems[v].text_size[0];
					}
				}
			}
			if(dj.byId("narrative_description_goods_popup")){
				descOfGoodsSize = (!m.hasTextBoxLogicalValue()) ? 0 : dj.byId("narrative_description_goods_popup").get("value").length;
				limitSingle = (misys._config.is798 == 'Y' ? 792 : 800) * 65;
				enteredSingle = fieldSizeSingle + descOfGoodsSize;
				isSingleFieldValid = m.validateExtendedNarrativeSwift2018(dj.byId("narrative_description_goods_popup").get("value"), msgRowsSingle, misys._config.is798, true);
			}
			isCombinedValid =  m.validateExtendedNarrativeSwift2018(dj.byId("narrative_description_goods_popup").get("value"), (msgRowsSingle+msgRowsTotal), misys._config.is798, false);
			limit = (misys._config.is798 == 'Y' ? 992 : 1000) * 65;
			entered = (fieldSizeSingle + fieldSizeTotal + descOfGoodsSize);
			if(!isSingleFieldValid) {
						this.invalidMessage = m.getLocalization("invalidSingleFieldLength",[limitSingle, enteredSingle]);
				}
			else {
					   	this.invalidMessage = m.getLocalization("invalidFieldSizeError",[limit, entered]);
				   }
			return isSingleFieldValid && isCombinedValid;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is for validating the text size while 
		 * swift.extended.narrative.enable=false only for amendment
		 * narrative pop up. 
		 */
		
		validatePopupData : function(){
			
			var isValid = true;
			if(m._config.swiftExtendedNarrativeEnabled){
				return isValid;
			}
			var descOfGoodsSize = 0,fieldSize = 0, msgRows = 0;
			
			if(dijit.byId("amendments") && !m.isGridEmpty() && dijit.byId("amendments").store._arrayOfAllItems){
				for(var w = 0; w < dijit.byId("amendments").store._arrayOfAllItems.length; w++){
					if(dijit.byId("amendments").store._arrayOfAllItems[w] !== null){
						fieldSize += dijit.byId("amendments").store._arrayOfAllItems[w].content ? dijit.byId("amendments").store._arrayOfAllItems[w].content[0].length : 0;
						fieldSize += dijit.byId("amendments").store._arrayOfAllItems[w].verb ? ("/"+dijit.byId("amendments").store._arrayOfAllItems[w].verb[0]+"/").length : 0;
						msgRows += dijit.byId("amendments").store._arrayOfAllItems[w].text_size[0];
					}
				}
			}
			
			if(dj.byId("narrative_description_goods_popup")){
				descOfGoodsSize = (!m.hasTextBoxLogicalValue()) ? 0 : dj.byId("narrative_description_goods_popup").get("value").length; 
			}
			
			limit = 100 * 65;
			entered = descOfGoodsSize + fieldSize;
			this.invalidMessage  = m.getLocalization("invalidFieldSizeError",[limit, entered]);
			return m.validateExtendedNarrativeSwift2018(dj.byId("narrative_description_goods_popup").get("value"), msgRows, false);
			
		},
		
		/**
		 * Shows limited number of lines in the data grid*/
		showTruncatedGridData : function( /* String */textContent,
										/* Integer */numberOfLines){
			var textToDisplay = null;
			if(textContent !== "" && textContent !== null){
				textToDisplay = '<p style="white-space: pre-wrap;">';
				var message = textContent.split(/\n/);
				var displayedLinesLength = message.length > numberOfLines ? numberOfLines : message.length;
				for(var i = 0; i < displayedLinesLength; i++){
					textToDisplay = textToDisplay + message[i] + "\n";
				}
				if(message.length > numberOfLines){
					var tail = ".....";
					textToDisplay = textToDisplay.trim() + tail;
				}
				textToDisplay+="</p>";
			}
			return textToDisplay;
		},

		/**
		 * Opens dialog box for Extended narrative for swift 2018
		 */

		showExtendedNarrativeView : function( /* String */type,
											/* String */product,
											/* String */title,
											/* String */messageValue,
											/*String*/ widget){
			if(dj.byId(widget)){
				var msg = dojox.html.entities.encode(dj.byId(widget).get("value"), dojox.html.entities.html);
					msg = _unwrap(msg);
					msg = "<div style='width: auto; height: 400px;  overflow:auto'>"+ msg + "</div>";
				}
				else if(messageValue != "gridPreviewOverlay")
				{
					msg = messageValue;
					msg = _decode(msg);
					msg = "<div style='height: 400px;width: auto; overflow:auto'>"+ msg + "</div>";
				}
				else if(messageValue == "gridPreviewOverlay")
				{
					msg = "";
					title = "Current Amendment";
					if(dijit.byId("amendments").store){
						for(var i = 0; i<dijit.byId("amendments").store._arrayOfAllItems.length; i++){
							if(dijit.byId("amendments").store._arrayOfAllItems[i]){
								var verbId = dijit.byId("amendments").store._arrayOfAllItems[i].verb[0];
								var displayedVerb = '';
								if(verbId === "ADD") {
									displayedVerb = misys.getLocalization("add");
								}else if(verbId === "DELETE") {
									displayedVerb = misys.getLocalization("delete");
								}else if(verbId === "REPALL") {
									displayedVerb = misys.getLocalization("repall");
								}
								msg +=  "<b>" + "/"+displayedVerb+"/"+"</b>";
								msg += _decode(dijit.byId("amendments").store._arrayOfAllItems[i].content[0]);
							}
							msg += "<div style='height: 8px; background-color: #FFFFFF'><div style='height: 1px; background-color: ##808080'></div></div>";
						}
					}
					else{
						msg =   m.getLocalization("emptyAmendmentGrid");
					}
					msg = "<div style='width: auto; height: 400px; overflow:auto'>"+ msg + "</div>";
				}
				m.dialog.show("EXTENDED-VIEW", msg , title);
			},
			/**
			 * Opens dialog box for Localization
			 */

			showLocalizationDialog : function(id,oldValue){
				//console.log(id);
				dj.byId("xsl_name").value=id;
				dj.byId("new_title").set("value",oldValue);
				dj.byId("localizationDialog").show();
			},
			
			undoLocalization :function(){
				dj.byId("new_title").set("value","");
				m.submitLocalization();
			},
			submitLocalization : function(){
				var xsl_name=dj.byId("xsl_name").value;
				var new_title=dj.byId("new_title").value;

				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/UpdateLocalizationAction"),
					sync : true,
					handleAs : "json",
					content: { 
						XSLNAME:xsl_name,
						NEWNAME:new_title
					},
					load : function(response, args){
						
					},
					error : function(response, args){
						console.error("[misys.grid._base] Country Validation error", response);
					}
				});
				dj.byId("localizationDialog").hide();
				location.reload();
			
			},
		/**
		 * <h4>Summary:</h4>
		 * This function is for showing transaction search dialog
		 * @param String
		 * @param String
		 * @param String
		 * @method showSearchTransactionsDialog
		 */
		showSearchTransactionsDialog : function( /*String*/ companyId, 
				 								 /*String*/ productCode, 
				 								 /*String*/ refId){
			
			//  summary:
			//		   Show reporting summary dialog.
			// 
			// TODO Dimensions should not be hardcoded like this


			var url = [m.getServletURL("/screen/AjaxScreen/action/ListOfTransactionsAction")];
			url.push("?companyid=", companyId, varProdCode, productCode, 
					 "&referenceid=", refId);

			d.style("linkedTransaction_dialog", "width", "650px");
			d.create("div", {id: "transaction_div"}, "linkedTransaction_div");

			if (!dj.byId("transaction_Grid")) {
				_createTransactionGrid(url.join(""), "transaction_div");
			}
			
			dj.byId("linkedTransaction_dialog").show();
			d.style("linkedTransaction_dialog", "height", "225px");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for deleting the transaction 
		 * 
		 * <h4>Description:</h4> 
		 * Clears the transaction grid 
		 * @method deleteTransactions
		 */
		deleteTransactions : function(){
			// summary:
			//		TODO
			
			dj.byId("imp_bill_ref_id").set("value", "");
			dj.byId("transaction_Grid").selection.clear();
			d.byId("TransactionLink").innerHTML = m.getLocalization("NoTransactionLink");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for creating rich text editor
		 * @method createRteEditor
		 */
		createRteEditor : function(productCode,editorId) {
			//	summary:
			//		TODO
			var editor = dj.byId(editorId);
			if (!editor) {
				var attachPoint = d.byId(editorId);
				var	rteContent = d.byId("rteContent").innerHTML;
					
				editor = new dj.Editor({
					id:editorId,
					name:editorId,
					rows:"13",
					cols:"40",
					maxSize:"300",
					plugins:[
						"undo", "redo", "|", "bold", "italic", "underline", "strikethrough", "|",
						"insertOrderedList", "insertUnorderedList", "|",
						"indent", "outdent", "|",
						"justifyLeft", "justifyRight", "justifyCenter", "justifyFull", "||",
						{name: "dijit._editor.plugins.FontChoice", command: "fontName"},
						{name: "misys.editor.plugins.ProductFieldChoice", command: "misysEditorPluginsProductFieldChoice", product: productCode}
						]
				}, attachPoint);
				
				rteContent = rteContent.replace(/&lt;/g, "<");
				rteContent = rteContent.replace(/&gt;/g, ">");
				rteContent = rteContent.replace(/&amp;/g, "&");
				rteContent = rteContent.replace(/&quot;/g, '"');
				editor.set("value", rteContent ? rteContent : "");
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This fucntion is for toggling bank grids
		 * @methods toggleBankGrids
		 */
		toggleBankGrids : function(){
			var bankGridType = dj.byId("bankRadioId");
			if(bankGridType.checked)
			{
				m.animate("wipeOut",d.byId("bank_swift_data"),function(){
					m.animate("wipeIn",d.byId("bankdata"));
					dijit.byId("bankdata_grid").resize();
				});
			}
			else
			{
				m.animate("wipeOut",d.byId("bankdata"),function(){
					m.animate("wipeOut",d.byId("contentPaneContainer"));
					m.animate("wipeIn",d.byId("bank_swift_data"));
					d.query("#bankTypeContainer .dojoxGrid").forEach(function(/*DomNode*/ grid){
						var gridObj = dj.byId(grid.id);
						if(gridObj) 
						{
							gridObj.resize();
						}
					});
				});
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Wipe In and Wipe Out a Set of Fields using Action UP n DOWN Img in the Header
		 * @param String - aniamteDivId
		 * @param String imgPrefix
		 * @param String direction
		 * @method toggleFieldSetContent
		 * 
		 */
		toggleFieldSetContent : function(/*String*/animateDivId,/*String*/imgPrefix,/*String*/direction){
			
			var downArrow = d.byId(imgPrefix+"_img_down");
			var upArrow = d.byId(imgPrefix+"_img_up");
			if(direction === 'down')
			{
				m.animate('wipeIn', animateDivId);
				d.style(downArrow, "display", "none");
				d.style(upArrow, "display", "block");
				d.style(upArrow, "cursor", "pointer");
			}
			else
			{
				m.animate('wipeOut', animateDivId);
				d.style(upArrow, "display", "none");
				d.style(downArrow, "display", "block");
				d.style(downArrow, "cursor", "pointer");
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Wipe In and Wipe Out a Set of Fields using Action UP n DOWN Img in the Header
		 * @param String - aniamteDivId
		 * @param String imgPrefix
		 * @param String direction
		 * @method toggleFieldSetContent
		 * 
		 */
		toggleEyeSetContent : function(/*String*/animateDivId,/*String*/imgPrefix,/*String*/direction,/*String*/fieldValue,/*String*/toggleFieldName){
			
			var downArrow = d.byId(imgPrefix+"_eye_down");
			var upArrow = d.byId(imgPrefix+"_eye_up");
			if(direction === 'down')
			{
				d.style(downArrow, "display", "none");
				d.style(upArrow, "display", "inline");
				d.style(upArrow, "cursor", "pointer");
				document.getElementById(toggleFieldName).getElementsByClassName('content')[0].innerHTML = fieldValue;
			}
			else
			{
				d.style(upArrow, "display", "none");
				d.style(downArrow, "display", "inline");
				d.style(downArrow, "cursor", "pointer");
				document.getElementById(toggleFieldName).getElementsByClassName('content')[0].innerHTML = "************";
			}
		},

		/**
		 * <h4>Summary:</h4>
		 *  Method to handle hide and show of inline-block elements
		 *  since IE6 and IE7 dont support display:inline-block css style
		 *  @param String - divId
		 *  @param boolean - show
		 *  @method toggleClassInlineBlock
		 */
		toggleClassInlineBlock : function(/*String*/divId,/* boolean*/show)
		{
			/**
			 * Method to handle hide and show of inline-block elements 
			 * since IE6 and IE7 dont support display:inline-block css style 
			 */
			if(show === true)
			{
				d.removeClass(divId,"hide");
				d.addClass(divId,"inlineBlock");
			}
			else
			{
				d.removeClass(divId,"inlineBlock");
				d.addClass(divId,"hide");
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Method to handle toggeling a array of fields readOnly based on the guard
		 * @param Array - Array of widgets
		 * @param boolean - readOnly
		 * @param boolean clearFields
		 * @method toggleFieldsReadOnly
		 */
		toggleFieldsReadOnly : function(/*Array of widget ids*/ array, /* boolean*/ readOnly, /*boolean*/clearFields)
		{
			d.forEach(array, function(node){
				if (dj.byId(node))
				{
					if(clearFields)
					{
						dj.byId(node).set("value", '');
					}
					dj.byId(node).set("readOnly", readOnly);
				}
			});
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Method to handle toggeling a array of fields readOnly based on the guard
		 * @param Array - Array of widgets
		 * @param boolean - isDisable
		 * @method disableFields
		 */
		disableFields : function(/*Array of widget ids*/ array, /* boolean*/ isDisable)
		{
			d.forEach(array, function(node){
				if (dj.byId(node))
				{
					dj.byId(node).set("disabled", isDisable);
				}
			});
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for generating Esign request transaction
		 * @param String - operation
		 * @param String - action
		 */
		generateEsignRequestTransaction : function(/*String*/ operation,/*String*/ action){
			console.debug("Generate Esign Request For Transaction");
			var callBack = function(){
				action = action + "&prodCode=" + m._config.productCode;
				dj.byId("realform_operation").set("value", operation);
				dj.byId("option").set("value", "");
				dj.byId("tnxtype").set("value", "");
				dj.byId("realform").set("action", action);
				dj.byId("realform").submit();
			};
			m.dialog.show("CONFIRMATION",m.getLocalization("generateEsignRequest"),'',callBack);
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for generating proxy authorization
		 * @param {String} operation
		 * @param {String} action
		 * @method proxyAuthoriseTransaction
		 */
		proxyAuthoriseTransaction : function(/*String*/ operation,/*String*/ action){
			console.debug("Proxy Authorise Transaction");
			var callBack = function(){
				action = action + "&prodCode=" + m._config.productCode;
				dj.byId("realform_operation").set("value", operation);
				dj.byId("option").set("value", "");
				dj.byId("tnxtype").set("value", "");
				dj.byId("realform").set("action", action);
				dj.byId("realform").submit();
			};
			m.dialog.show("CONFIRMATION",m.getLocalization("proxyAuthorise"),'',callBack);
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for toggling of bgTypeDetails-editor div 
		 * <h4>Description:</h4> 
		 * Show this div only if bg_type_code is "99"
		 * @method toggleGuaranteeType
		 * 
		 */
		toggleGuaranteeType : function(){
			var bgTypeDetailsDiv = d.byId('bgtypedetails-editor');
			if(this.get("value") === "99") 
			{
				//this.set("disabled", false);
				m.animate("fadeIn", bgTypeDetailsDiv);
			} 
			else 
			{
				m.animate("fadeOut", bgTypeDetailsDiv);
			}
		},
		
		getIncoYear : function(){

			var incoTermYearStore = null;
			var incoTermYearField = dj.byId("inco_term_year");
			var issuingBank =dj.byId("issuing_bank_abbv_name")?dj.byId("issuing_bank_abbv_name").get("value"):"";
			var remittingBank=dj.byId("remitting_bank_abbv_name")?dj.byId("remitting_bank_abbv_name").get("value"):"";
			var advisingBank=dj.byId("advising_bank_abbv_name")?dj.byId("advising_bank_abbv_name").get("value"):"";
			if(issuingBank!="")
					{
					incoTermYearStore = misys._config.incoTermYearMap[issuingBank];
					}
				else if(remittingBank!="")
					{
					incoTermYearStore = misys._config.incoTermYearMap[remittingBank];
					}
				else if(advisingBank!="")
				{
				incoTermYearStore = misys._config.incoTermYearMap[advisingBank];
				}
				else{
					incoTermYearStore = misys._config.incoTermYearMap[misys._config.bankAbbvNamePrefix];
					}
					 var jsonData = {"identifier" :"id", "items" : []};
					 var incoTermYearFieldStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
					 if(incoTermYearStore != undefined && incoTermYearStore != "" )
					 {
						 for(var j = 0; j < incoTermYearStore.length; j++)
						 {
							 incoTermYearFieldStore.newItem( {"id" : incoTermYearStore[j].value, "name" : incoTermYearStore[j].name});
						 }
						 
						 if(incoTermYearField)
					     {
						 incoTermYearField.store = new dojo.data.ItemFileReadStore(
									{
										data :
										{
											identifier : "value",
											label : "name",
											items : incoTermYearFieldStore
										}
									});
							 incoTermYearField.store = incoTermYearFieldStore;
						 incoTermYearField.set('disabled', false);
						 incoTermYearField.fetchProperties =
							{
								sort : [
								{
									attribute : "name"
								} ]
							};
							 }
						
							 }
					 else
						 {

						 incoTermYearField.store = new dojo.data.ItemFileReadStore(
									{
									 data :
										{
											identifier : "value",
											label : "name",
											items : incoTermYearFieldStore
										}
									});
						 
						 
						 }
					// dijit.byId("inco_term_year").set("value",dijit.byId("inco_term_year")._lastQuery);
					 var incoYearValue = dijit.byId("inco_term_year")?dijit.byId("inco_term_year").get("value"):"";
					 var arrayLineItems = incoTermYearField.store._arrayOfAllItems;
						var flag = false;
						for(var i=0;i<arrayLineItems.length;i++) {
							if(arrayLineItems[i] && arrayLineItems[i].name!="" && arrayLineItems[i].name==incoYearValue) {
								flag=true;
								break;
							}
						}	
						if(!flag)
							{
							dijit.byId("inco_term_year").set("value", "");
							dj.byId("inco_term").set("value", "");
							}
	},
	
	getDeliveryTo : function(){

		var deliveryToStore = null;
		var deliveryToField = dj.byId("delivery_to");
		var issuingBank =dj.byId("issuing_bank_abbv_name")?dj.byId("issuing_bank_abbv_name").get("value"):"";
		var remittingBank=dj.byId("remitting_bank_abbv_name")?dj.byId("remitting_bank_abbv_name").get("value"):"";
		var advisingBank=dj.byId("advising_bank_abbv_name")?dj.byId("advising_bank_abbv_name").get("value"):"";
		if(issuingBank!="")
				{
				deliveryToStore = misys._config.deliveryToMap[issuingBank];
				}
			else if(remittingBank!="")
				{
				deliveryToStore = misys._config.deliveryToMap[remittingBank];
				}
			else if(advisingBank!="")
			{
				deliveryToStore = misys._config.deliveryToMap[advisingBank];
			}
			else{
				deliveryToStore = misys._config.deliveryToMap[misys._config.bankAbbvNamePrefix];
				}
				 var jsonData = {"identifier" :"id", "items" : []};
				 var deliveryToFieldStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
				 if(deliveryToStore != undefined && deliveryToStore != "" )
				 {
					 for(var j = 0; j < deliveryToStore.length; j++)
					 {
						 deliveryToFieldStore.newItem( {"id" : deliveryToStore[j].value, "name" : deliveryToStore[j].name});
					 }
					 
					 if(deliveryToField)
				     {
						 deliveryToField.store = new dojo.data.ItemFileReadStore(
								{
									data :
									{
										identifier : "value",
										label : "name",
										items : deliveryToFieldStore
									}
								});
						 deliveryToField.store = deliveryToFieldStore;
						 deliveryToField.set('disabled', false);
						 deliveryToField.fetchProperties =
						{
							sort : [
							{
								attribute : "name"
							} ]
						};
						 }
					
						 }
				 else
					 {

					 deliveryToField.store = new dojo.data.ItemFileReadStore(
								{
								 data :
									{
										identifier : "value",
										label : "name",
										items : deliveryToFieldStore
									}
								});
					 
					 
					 }
				// dijit.byId("inco_term_year").set("value",dijit.byId("inco_term_year")._lastQuery);
				 var deliveryToValue = dijit.byId("delivery_to")?dijit.byId("delivery_to").get("value"):"";
				 var arrayLineItems = deliveryToField.store._arrayOfAllItems;
					var flag = false;
					for(var i=0;i<arrayLineItems.length;i++) {
						if(arrayLineItems[i] && arrayLineItems[i].id!="" && arrayLineItems[i].id==deliveryToValue) {
							flag=true;
							break;
						}
					}	
					if(!flag)
						{
						dijit.byId("delivery_to").set("value", "");
						dj.byId("delivery_to").set("value", "");
						}
},
		
		getIncoTerm : function(){
			
			var incoTermDataStore = null;
			var incoTermDataField = dj.byId("inco_term");
			var bankAndYear;
			var issuingBank =dj.byId("issuing_bank_abbv_name")?dj.byId("issuing_bank_abbv_name").get("value"):"";
			var remittingBank=dj.byId("remitting_bank_abbv_name")?dj.byId("remitting_bank_abbv_name").get("value"):"";
			var advisingBank=dj.byId("advising_bank_abbv_name")?dj.byId("advising_bank_abbv_name").get("value"):"";
			if(issuingBank!="")
					{
					   bankAndYear =issuingBank +":"+dj.byId("inco_term_year").get("value");
						
					}
				else if(remittingBank!="")
				{
					   bankAndYear =remittingBank +":"+dj.byId("inco_term_year").get("value");
						
				}
				else if(advisingBank!="")
				{
					bankAndYear =advisingBank +":"+dj.byId("inco_term_year").get("value");
				}
				else
					{
					 bankAndYear =misys._config.bankAbbvNamePrefix +":"+dj.byId("inco_term_year").get("value");
					}
			incoTermDataStore = misys._config.incoTermProductMap[bankAndYear];
			 var jsonData = {"identifier" :"id", "items" : []};
			 var incoTermDataFieldStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			 if(incoTermDataStore != undefined && incoTermDataStore != "" )
			 {
				 for(var j = 0; j < incoTermDataStore.length; j++)
				 {
					 incoTermDataFieldStore.newItem( {"id" : incoTermDataStore[j].value, "name" : incoTermDataStore[j].name});
					 
				 }
			 incoTermDataField.store = new dojo.data.ItemFileReadStore(
				{
				 data :
					{
						identifier : "value",
						label : "name",
						items : incoTermDataFieldStore
					}
				});
				if(incoTermDataField)
			    {
					 incoTermDataField.store = incoTermDataFieldStore;
			    }
				incoTermDataField.set('disabled', false);
				incoTermDataField.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}
			 else
				 {
				 incoTermDataField.store = new dojo.data.ItemFileReadStore(
							{
							 data :
								{
									identifier : "value",
									label : "name",
									items : incoTermDataFieldStore
								}
							});
				 }
    if(dj.byId("inco_term_year").get("value")!==dj.byId("org_term_year").get("value"))
    	{
    	dj.byId("inco_term").set("value","");
    	dj.byId("org_term_year").set("value",dj.byId("inco_term_year").get("value"));
    	}
		},

		/**
		 * <h4>Summary:</h4>
		 *  Check which attachments have been added or deleted.
		 * @method checkForAttachments
		 */
		checkForAttachments : function() {

		    //  summary:
		    //        Check which attachments have been added or deleted.
		    //  tags:
		    //        private
			
			console.debug('[common] Checking for attachments');
			var attIdsField = dj.byId('attIds');
			var numOfFiles = false;
			var count = 0;
			if(attIdsField)
			{
					var grids = [dj.byId(attFile)];
					d.forEach(grids, function(gridContainer){
						if(gridContainer &&  gridContainer.grid) {
							var arr = gridContainer.grid.store._arrayOfAllItems;
							d.forEach(arr, function(attachment, i){
								if(attachment != null) {
									numOfFiles = true;
									count++;
								}
							});
						}
					});
			}
			if (dj.byId(attFile) && dj.byId(attFile).store) {
				if(dj.byId(attFile).store._arrayOfAllItems.length > 0) {
		    		return true; 
		    	}
			}
			m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMinimumFileUploadTypeError");
			return numOfFiles;
		},
		/**
		 * <h4>Summary:</h4>
		 * Check whether documents are attached or not
		 * @method hasAttachments
		 */
		hasAttachments : function() {

		    //  summary:
		    //        Check whether documents are attached or not
		    //  tags:
		    //        private
			
			console.debug('[common] has attachments check');
			var attIdsField = dj.byId('attIds');
			var numOfFiles = false;
			var count = 0;
			if(attIdsField)
			{
					var grids = [dj.byId(attFile)];
					d.forEach(grids, function(gridContainer){
						if(gridContainer &&  gridContainer.grid) {
							var arr = gridContainer.grid.store._arrayOfAllItems;
							d.forEach(arr, function(attachment, i){
								if(attachment != null) {
									numOfFiles = true;
									count++;
								}
							});
						}
					});
			}
			return numOfFiles;
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is to handle toggling of MT798 fields
		 * <h4>Description:</h4> 
		 * This method handles toggling of MT798 fields depending on whether MT798 is enabled or not
		 * @method toggleMT798Fields
		 */
		toggleMT798Fields : function(mainBankWidjetId){
			var mainBankAbbvName = dj.byId(mainBankWidjetId).get('value');
			var advSendMode ="";
			if(dj.byId("adv_send_mode"))
			{
				advSendMode = dj.byId("adv_send_mode").get("value");
			}
			var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true && advSendMode === "01";
			m.toggleFields(isMT798Enable, ["delivery_channel","transport_mode_nosend", "transport_mode"], null, false, false);
			// Toggle required fields
			m.toggleFields(isMT798Enable && m.hasAttachments(), null, ["delivery_channel"], false, false);
			if(isMT798Enable){
				if (dj.byId("delivery_channel")){
					m.animate("fadeIn", "delivery_channel_row");
					m.connect("delivery_channel", "onChange",  function(){
						if(dj.byId(attFile))
						{
							if(dj.byId("delivery_channel").get('value') === 'FACT')
							{
								dj.byId(attFile).displayFileAct(true);
							}
							else
							{
								dj.byId(attFile).displayFileAct(false);
							}
						}
					});
					dj.byId("delivery_channel").onChange();
				}
				if (dj.byId("transport_mode")){
					m.animate("fadeIn", "transport_mode_nosend_row");
					m.animate("fadeIn", "transport_mode_text_nosend_row");
				}
				
			} 
			else {
				if (dj.byId("delivery_channel")){
					m.animate("fadeOut", "delivery_channel_row");
				}
				if (dj.byId("transport_mode")){
					m.animate("fadeOut", "transport_mode_nosend_row");
					m.animate("fadeOut", "transport_mode_text_nosend_row");
				}
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is for renewal of final expiry date.
		 * <h4>Description:</h4> 
		 * In this method depending on "renew_on_code" we do renewal of renewal of expiry method
		 * @method setRenewalFinalExpiryDate
		 * 
		 */
		setRenewalFinalExpiryDate : function()
		{
			var calcFinalExpDate = calculateRenewalFinalExpiryDate();
			
			if(calcFinalExpDate){
				dj.byId("final_expiry_date").set("value",calcFinalExpDate);
			}
	            
	            //Code for calculation of final expiry date after rolling renewal. Can be used later for MPSSC-4449
	            
	            /*if(isPreCondStsfd && renewalInterval !=null && renewalIntervalUnit!=null && numOfRenewals!= null)
	            {
		            if(!rollingRenewalOn || rollingRenewalOn !== "03") {
		                  switch (renewalIntervalUnit) {
							case "D":	 
								milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", numOfRenewals * renewalInterval);
								break;
							case "W":	
								milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", numOfRenewals * renewalInterval);		
								break;
							case "M":	
								milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", numOfRenewals * renewalInterval);
								break;
							case "Y":	
								milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", numOfRenewals * renewalInterval);		
								break;
							default:
								break;
						}
		                  //Last active date of the trade product
		                  //Last active date of the trade product
		                  var lastActiveDateObj = new Date(milliSecTillLastRenewal.getTime());
		                  dj.byId("final_expiry_date").set("value",lastActiveDateObj);
		            }
		                  
		            else if(rollingRenewalOn === "03" && rollingRenewalIntervalUnit !== "" && rollingRenewalInterval !== "")
		            {    
		            	switch (renewalIntervalUnit) {
						case "D":	 
							milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", renewalInterval);
							break;
						case "W":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", renewalInterval);		
							break;
						case "M":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", renewalInterval);
							break;
						case "Y":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", renewalInterval);		
							break;
						default:
							break;
		            	}
		                  var finalExpiryOnFirstRenewal = new Date(milliSecTillLastRenewal.getTime());
		                  
	                	  switch (rollingRenewalIntervalUnit) {
							case "D":	 
								milliSecTillLastRollingRenewal =  d.date.add(finalExpiryOnFirstRenewal, "day", (numOfRenewals-1) * rollingRenewalInterval);
								break;
							case "W":	
								milliSecTillLastRollingRenewal = d.date.add(finalExpiryOnFirstRenewal, "week", (numOfRenewals-1) * rollingRenewalInterval);		
								break;
							case "M":	
								milliSecTillLastRollingRenewal = d.date.add(finalExpiryOnFirstRenewal, "month", (numOfRenewals-1) * rollingRenewalInterval);
								break;
							case "Y":	
								milliSecTillLastRollingRenewal = d.date.add(finalExpiryOnFirstRenewal, "year", (numOfRenewals-1) * rollingRenewalInterval);		
								break;
							default:
								break;
	                	  }
	                	  var finalExpiryOnRollingRenewal = new Date(milliSecTillLastRollingRenewal.getTime());
	                	  dj.byId("final_expiry_date").set("value",finalExpiryOnRollingRenewal);
		            }
	            }*/
	            if(!isPreCondStsfd) {
	            	var rollingFinalExpiryDate = dj.byId("final_expiry_date");
	    			if(rollingFinalExpiryDate && rollingFinalExpiryDate.get("value") !== ""){
	    				rollingFinalExpiryDate.set("value",new Date().getHours());
	    			}
	            }
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is to calculate and set the renewal of final expiry date.
		 * <h4>Description:</h4> 
		 * In this method depending on "renew_on_code", "renew_for_nb", "renew_for_period" and the final expiry date is calculated.
		 * If renew_on_code = 01, i.e. on expiry, calculate the new date based on existing expiry date, the renew for data, and the number of renewals.
		 * If renew_on_code = 02, i.e. on calendar date, calculate the new date based on existing expiry date, the renew for data, and the number of renewals.
		 * @method calculateRenewalFinalExpiryDate
		 * 
		 */
		calculateRenewalFinalExpiryDate : function(){
            var renewalOn = dj.byId("renew_on_code")?dj.byId("renew_on_code").get("value"):"";                        //Whether the first renewal is on "Expiry('01')" or "Calendar Date('02')"
            var renewalCalDate = dj.byId("renewal_calendar_date")?dj.byId("renewal_calendar_date").get("value"):"";        //Date String, if first renewal is on a "Calendar Date('02')"
            var renewalInterval = dj.byId("renew_for_nb")?dj.byId("renew_for_nb").get("value"):"";                   //Interval between subsequent renewals (number) 
            var renewalIntervalUnit = dj.byId("renew_for_period")?dj.byId("renew_for_period").get("value"):"";       //Unit of interval i.e., whether it is "Days"/"Weeks"/"Months"/"Years".This along with the interval forms the frequency of renewal.
                                                                                          //For ex. Once in 10(renewalInterval) months (renewalIntervalUnit)
            var numOfRenewals = dj.byId("rolling_renewal_nb")?dj.byId("rolling_renewal_nb").get("value"):"";                  //Number of renewals allowed
            var milliSecTillLastRenewal = null;
            var firstRenewalDateObj = null;
            var isPreCondStsfd = true;
            var calcFinalExpDate = null;
            if(renewalOn === "01") {
                  firstRenewalDateObj = dj.byId("exp_date")?dj.byId("exp_date").get("value"):"";
                  var orgExpDate = dj.byId("org_exp_date")?dj.byId("org_exp_date"):"";
                  if(!firstRenewalDateObj && orgExpDate)
                	{
                	  firstRenewalDateObj = dojo.date.locale.parse(orgExpDate.get("value"),{locale:dojo.config.locale, formatLength:"short", selector:"date" });
                	}
                  if(firstRenewalDateObj == null) {
                        isPreCondStsfd = false;
                  }
            }
            else if(renewalOn === "02") {
                  firstRenewalDateObj = renewalCalDate;
                  if(firstRenewalDateObj == null)
                  {
                        isPreCondStsfd = false;
                  }
            }
            else{
                  isPreCondStsfd = false;
            }
            if(renewalInterval == null || renewalInterval === "" || isNaN(renewalInterval))
            {
            	isPreCondStsfd = false;
            }
            if(renewalIntervalUnit == null || renewalIntervalUnit === "")
            {
            	isPreCondStsfd = false;
            }
            if(numOfRenewals == null || numOfRenewals === "" || isNaN(numOfRenewals))
            {
            	isPreCondStsfd = false;
            }
            	            
            if(isPreCondStsfd && numOfRenewals) {
                  switch (renewalIntervalUnit) {
					case "D":	 
						milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", numOfRenewals * renewalInterval);
						break;
					case "W":	
						milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", numOfRenewals * renewalInterval);		
						break;
					case "M":	
						milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", numOfRenewals * renewalInterval);
						break;
					case "Y":	
						milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", numOfRenewals * renewalInterval);		
						break;
					default:
						break;
				}
                  if(milliSecTillLastRenewal)
                	  {
	                	  calcFinalExpDate = new Date(milliSecTillLastRenewal.getTime());
	                      calcFinalExpDate = calcFinalExpDate.getDate() + '/' + (calcFinalExpDate.getMonth() + 1) + '/' +  calcFinalExpDate.getFullYear();
	                      var finalExpiryOnRollingRenewal = new Date(milliSecTillLastRenewal.getTime());
	                	  dj.byId("final_expiry_date").set("value",finalExpiryOnRollingRenewal);
                	  }
            }
            
            return calcFinalExpDate;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is to calculate renewal of final expiry date.
		 * <h4>Description:</h4> 
		 * In this method depending on "renew_on_code", "renew_for_nb", "renew_for_period" and the final expiry date is calculated.
		 * If renew_on_code = 01, i.e. on expiry, calculate the new date based on existing expiry date, the renew for data, and the number of renewals.
		 * If renew_on_code = 02, i.e. on calendar date, calculate the new date based on existing expiry date, the renew for data, and the number of renewals.
		 * @method calculateRenewalFinalExpiryDate
		 * 
		 */
		calculateFinalExpiryDate : function(){
            var renewalOn = dj.byId("renew_on_code")?dj.byId("renew_on_code").get("value"):"";                        //Whether the first renewal is on "Expiry('01')" or "Calendar Date('02')"
            var renewalCalDate = dj.byId("renewal_calendar_date")?dj.byId("renewal_calendar_date").get("value"):"";        //Date String, if first renewal is on a "Calendar Date('02')"
            var renewalInterval = dj.byId("renew_for_nb")?dj.byId("renew_for_nb").get("value"):"";                   //Interval between subsequent renewals (number) 
            var renewalIntervalUnit = dj.byId("renew_for_period")?dj.byId("renew_for_period").get("value"):"";       //Unit of interval i.e., whether it is "Days"/"Weeks"/"Months"/"Years".This along with the interval forms the frequency of renewal.
                                                                                          //For ex. Once in 10(renewalInterval) months (renewalIntervalUnit)
            var numOfRenewals = dj.byId("rolling_renewal_nb")?dj.byId("rolling_renewal_nb").get("value"):"";                  //Number of renewals allowed
            var milliSecTillLastRenewal = null;
            var firstRenewalDateObj = null;
            var isPreCondStsfd = true;
            if(renewalOn === "01") {
                  firstRenewalDateObj = dj.byId("exp_date")?dj.byId("exp_date").get("value"):"";
                  var orgExpDate = dj.byId("org_exp_date")?dj.byId("org_exp_date"):"";
                  if(!firstRenewalDateObj && orgExpDate)
                	{
                	  firstRenewalDateObj = dojo.date.locale.parse(orgExpDate.get("value"),{locale:dojo.config.locale, formatLength:"short", selector:"date" });
                	}
                  if(firstRenewalDateObj == null) {
                        isPreCondStsfd = false;
                  }
            }
            else if(renewalOn === "02") {
                  firstRenewalDateObj = renewalCalDate;
                  if(firstRenewalDateObj == null)
                  {
                        isPreCondStsfd = false;
                  }
            }
            else{
                  isPreCondStsfd = false;
            }
            if(renewalInterval == null || renewalInterval === "" || isNaN(renewalInterval))
            {
            	isPreCondStsfd = false;
            }
            if(renewalIntervalUnit == null || renewalIntervalUnit === "")
            {
            	isPreCondStsfd = false;
            }
            if(numOfRenewals == null || numOfRenewals === "" || isNaN(numOfRenewals))
            {
            	isPreCondStsfd = false;
            }
            	            
            if(isPreCondStsfd && numOfRenewals) {
                  switch (renewalIntervalUnit) {
					case "D":	 
						milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", numOfRenewals * renewalInterval);
						break;
					case "W":	
						milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", numOfRenewals * renewalInterval);		
						break;
					case "M":	
						milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", numOfRenewals * renewalInterval);
						break;
					case "Y":	
						milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", numOfRenewals * renewalInterval);		
						break;
					default:
						break;
				}
                  if(milliSecTillLastRenewal)
                	  {
	                      var finalExpiryOnRollingRenewal = new Date(milliSecTillLastRenewal.getTime());
                	  }
            }
            
            return finalExpiryOnRollingRenewal;
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is for Marking a widget as loading
		 * <h4>Description:</h4> 
		 * Mark as loading if icon is not there
		 * @param {String} idField
		 * @param {Boolean} isLoading
		 * @method markWidgetAsLoading
		 */
		markWidgetAsLoading : function(/*String*/ idField, /*Boolean*/ isLoading)
		{
			var spanId = idField + "_id_loading_span";
			if (dj.byId(idField))
			{
				var loadingIconDomNode;
				if (isLoading)
				{
					if (!d.byId(spanId)) //Do not add another icon if there is one already 
					{
						dj.byId(idField).set("disabled", true);
						var loadingIcon = '<img src="' + m._config["context"] + m._config["imagesSrc"] + 'loading.gif"/>';
						loadingIconDomNode = d.create("span", {innerHTML: loadingIcon, id:spanId}, dj.byId(idField).domNode, "after");
						dj.byId(idField).set("loadingIconDomNode", loadingIconDomNode);
					}
				}
				else
				{
					loadingIconDomNode = dj.byId(idField).get("loadingIconDomNode");
					dj.byId(idField).set("loadingIconDomNode", null);
					d.destroy(loadingIconDomNode);
					dj.byId(idField).set("disabled", false);
				}
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *  Populate a select box based on the content of the current bank, entity and Customer reference.
		 *  @param {Object} referenceWidget
		 * @method populateFacilityReference
		 * 
		 */
		populateFacilityReference : function(referenceWidget)
		{
			 //  summary:
		    //        Populate a select box based on the content of the current bank, entity and Customer reference 
			//        selection.

			// Retrieve the prefix and set the name value;
			var customerReference 		= referenceWidget.get("value"),
		    	splitter				= "_",
		    	tokens 					= referenceWidget.id.split(splitter),
		    	prefix					= tokens[0] + splitter + tokens[1],
		    	bankAbbvName			= dj.byId(prefix + "_abbv_name") ? dj.byId(prefix + "_abbv_name").get("value") : "",
		    	entityName				= dj.byId("entity") ? dj.byId("entity").get("value") : "",
		    	facilityWidget			= dj.byId("facility_id"),
		        facilityReferenceStore	= [],
		    	facilityDetailsDivId 	= d.byId("facilityLimitDetail");
				
		    	
				
	    	if(customerReference + "S" !== "S" && m._config.facilityReferenceCollection && m._config.facilityReferenceCollection[customerReference] && facilityWidget && facilityDetailsDivId && m._config.facilityReferenceCollection[customerReference][bankAbbvName + "_" + entityName])
    		{
	    		facilityWidget.set("displayedValue","");
	    		facilityReferenceStore = m._config.facilityReferenceCollection[customerReference][bankAbbvName + "_" + entityName];
	    		if(facilityReferenceStore)
    			{
	    			console.debug("[misys.form.common] Set Facility Reference Store ");
	    			facilityWidget.store = new dojo.data.ItemFileReadStore(
	    					{
	    						data :
	    						{
	    							identifier : "value",
	    							label : "name",
	    							items : facilityReferenceStore
	    						}
	    					});
	    			m.animate("wipeIn",facilityDetailsDivId);
	    			if(dj.byId("facility_mandatory") && dj.byId("facility_mandatory").get("value") === "true")
	    			{
	    				m.toggleRequired("facility_id", true);
	    			}
	    			if(m._config.limitFieldIdCollection)
	    			{
	    				_resetLimitDetails();
	    				dj.byId("limit_id").set("displayedValue","");
	    				if(!m._config.isLoading && dj.byId("limit_reference") && dj.byId("limit_reference").get("value")+"S" !== "S")
    					{
	    					dj.byId("limit_reference").set("value","");
    					}
	    			}
    			}
    		}
	    	else
    		{
	    		m.animate("wipeOut",facilityDetailsDivId);
				m.toggleRequired("facility_id", false);
				
    		}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for getting limit details for a specific facility.
		 * @method getLimitDetails
		 */
		getLimitDetails : function(/*boolean*/ isAmendment)
		{
		//  summary:
			// Set facility review date based on Facility Reference
			
			var faclilityDate 			= dj.byId("facility_date"),
				facilityReferenceWidget = dj.byId("facility_reference"),
				facilityIdWidget 		= dj.byId("facility_id");
			
			if(faclilityDate && facilityIdWidget)
			{
				console.debug("[misys.form.common] Facility Date for "+facilityIdWidget.get("displayedValue") );
				if(m._config.facilityReviewDateCollection && m._config.facilityReviewDateCollection[facilityIdWidget.get("displayedValue")])
				{
					faclilityDate.set("displayedValue", m._config.facilityReviewDateCollection[facilityIdWidget.get("displayedValue")]);
				}
				else 
				{
					faclilityDate.set("displayedValue","");
				}
			}
			if(facilityReferenceWidget)
			{
				facilityReferenceWidget.set("value",dj.byId("facility_id").get("displayedValue"));
			}
			var entity 				= dj.byId("entity") ? dj.byId("entity").get("value") : "",
				productTypeCodeId 	= m._config.productCode.toLowerCase()+"_type_code",
				facilityId 			= facilityIdWidget ? facilityIdWidget.get("value") : "",
				facilityReference 	= facilityReferenceWidget ? facilityReferenceWidget.get("displayedValue") : "",
				productTypeCode 	= dj.byId(productTypeCodeId) ? dj.byId(productTypeCodeId).get("value") : "",
				country 			= dj.byId("beneficiary_country") ? dj.byId("beneficiary_country").get("value") : "";
				
			if(isAmendment || (country !== ""))
			{
				console.debug("[misys.form.common] Fetching Available Limit for "+facilityReferenceWidget.get("value") );
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/GetLimitsJSONDataAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						facility : facilityReference ,
						facilityId :  facilityId,
						productCode : m._config.productCode,
						entity : entity,
						subProduct : "",
						productTypeCode : productTypeCode,
						beneficiary :  "",
						beneficiaryCountry : country
					},
					load : _setLimitCollection
				});
			
				var limitIdWidget 				= dj.byId("limit_id"),
					limitReference				= dj.byId("limit_reference");
				//set limit id from hidden field while form is loading
				if(limitReference && limitIdWidget && limitIdWidget.get("value") + "S" === "S")
				{
					limitIdWidget.set("displayedValue",limitReference.get("value"));
				}
				else if(limitIdWidget)
				{
					limitIdWidget.set("displayedValue","");
				}
				_resetLimitDetails();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is for setting Limit details from collection
		 * @method  setLimitFieldsValue
		 */
		setLimitFieldsValue : function()
		{
			
			//Summary
			//Method to set limit details from Collection
			  var limitReference 		= this.get("displayedValue"),
			  		fieldIds 			= m._config.limitFieldIdCollection,
			  		limitFieldValues 	= m._config.limitCollection[limitReference];
			  
			  if(dj.byId("limit_reference"))
			  {
				  dj.byId("limit_reference").set("value",this.get("displayedValue"));
			  }
			  console.debug("[misys.form.common] Setting Limit Field Values ");
			  d.forEach(fieldIds, function(id, index){
				  var obj = dj.byId(id);
				  if(obj && limitFieldValues) 
				  {
					  if(obj.declaredClass === "dijit.form.DateTextBox")
					  {
						  obj.set("displayedValue", limitFieldValues[index]);
					  }
					  else
					  {
					  	obj.set("value", limitFieldValues[index]);
					  }
				  }
				  else if(obj)
				  {
					  obj.set("displayedValue","");
				  }
			  });
		},
		/**
		 * <h4>Summary:</h4>
		 * Method to validate Booking amount against outstanding amounts
		 * Tnx amount is converted based on limit currency
		 * @method validateLimitBookingAmount
		 */
		validateLimitBookingAmount : function(event)
		{
			//Summary
			//Method to validate Booking amount against outstanding amounts
			//Tnx amount is converted based on limit currency
			var	transactionAmtWidget 	= dj.byId(m._config.productCode.toLowerCase()+"_amt"),
				tnxCurrencyWidget 	= dj.byId(m._config.productCode.toLocaleLowerCase()+"_cur_code"),
				limitCurrencyWidget 		= dj.byId("limit_outstanding_cur_code"),
				limitAmtWidget		= dj.byId("limit_outstanding_amount"),
				facilityCurrencyWidget		= dj.byId("facility_outstanding_cur_code"),
				facilityAmtWidget 	= dj.byId("facility_outstanding_amount"),
				bookingAmountWidget 		= dj.byId("booking_amt"),
				requestCurrency = "";
			if(!m._config.isLoading)
			{
				if(this.id && this.id !== "booking_amt" && bookingAmountWidget)
				{
					bookingAmountWidget.set("value","");
				}
				console.debug("[misys.form.common] Validating Limit Booking Amount ");
				if(transactionAmtWidget && tnxCurrencyWidget && limitCurrencyWidget && limitAmtWidget && facilityCurrencyWidget && facilityAmtWidget && bookingAmountWidget)
				{
					var trasactionAmt	= transactionAmtWidget.get("value"),
						limitAmt		= limitAmtWidget.get("value"),
						facilityAmt		= facilityAmtWidget.get("value"),
						limitCurrency	= limitCurrencyWidget.get("value"),
						tnxCurrency		= tnxCurrencyWidget.get("value"),
						facilityCurrency = 	facilityCurrencyWidget.get("value"),
						bookingAmount 	= bookingAmountWidget.get("value"),
						isValid			= true,
						isValidTnxAmt	= true,
						errorMessage	= "";
					//If cross currency get mid rates and validate
					if(limitCurrency !== "" && tnxCurrency !== "" && facilityCurrency !== "")
					{
						if(limitCurrency !== tnxCurrency)
						{
							requestCurrency = tnxCurrency+"_"+limitCurrency+"_limit,";
						}
						if(facilityCurrency !== limitCurrency)
						{
							requestCurrency = requestCurrency+facilityCurrency+"_"+limitCurrency+"_facility";
						}
						if(requestCurrency+"S" !== "S")
						{
							m.getCurrencyRateForFacility(requestCurrency);
							if(isNaN(bookingAmount) || bookingAmount === "" || (event !== undefined && event === "true"))
							{
								if(m._config.limitRate)
								{
									bookingAmount = trasactionAmt*m._config.limitRate;
									bookingAmountWidget.attr("value",bookingAmount,false);
									dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
								}
								if(isNaN(bookingAmount) || bookingAmount === "" || (event !== undefined && event === "true" && trasactionAmt < bookingAmount))
								{
									bookingAmountWidget.attr("value",bookingAmount,false);
									dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
								}
								if(dj.byId("pstv_tol_pct") && (!isNaN(dj.byId("pstv_tol_pct").get("value"))))
								{
								bookingAmount = bookingAmount + bookingAmount * (dj.byId("pstv_tol_pct").get("value")/100.0);
								bookingAmountWidget.attr("value",bookingAmount,false);
								dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
								}
							}
							
							if(bookingAmount > dj.byId("tol_booking_amt") ? dj.byId("tol_booking_amt").get('value') : 0)
							{
							isValid = false;
							errorMessage = m.getLocalization("invalidBookingAmountTnx");
							
							}
							
							if(isValid && bookingAmount > limitAmt)
							{
								isValid = false;
								if(m._config.limitRate !== 1)
								{
									errorMessage = m.getLocalization("invalidBookingAmountCurrency", ["Limit",tnxCurrency+"/"+limitCurrency]);
								}
								else
								{
									errorMessage = m.getLocalization("invalidBookingAmount", ["Limit"]);
								}
							}
							if(isValid && bookingAmount > facilityAmt*m._config.facilityRate)
							{
								isValid = false;
								if(m._config.facilityRate !== 1)
								{
									errorMessage = m.getLocalization("invalidBookingAmountCurrency", ["Facility",facilityCurrency+"/"+limitCurrency]);
								}
								else
								{
									errorMessage = m.getLocalization("invalidBookingAmount", ["Limit"]);
								}
							}
							
							if(m._config.validate_tnxamt_with_limit_outstanding)
							{
								if(isValid && dj.byId("tol_booking_amt").get('value') > limitAmt) //MPS-40477
								{
									isValid = false;
									isValidTnxAmt = false;
									errorMessage = m.getLocalization("invalidTnxAmount");
								}
							}
						}
						else
						{
							if(isNaN(bookingAmount) || bookingAmount === "" || (event !== undefined && event === "true"))
							{
								if(isNaN(bookingAmount) || bookingAmount === "" || (event !== undefined && event === "true" && trasactionAmt < bookingAmount))
								{
									bookingAmount = trasactionAmt;
									if(dj.byId("pstv_tol_pct") && (!isNaN(dj.byId("pstv_tol_pct").get("value"))))
									{
									bookingAmount = bookingAmount + bookingAmount * (dj.byId("pstv_tol_pct").get("value")/100.0);
									}
									bookingAmountWidget.attr("value",bookingAmount,false);
									dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
								}
								if(dj.byId("pstv_tol_pct") && (!isNaN(dj.byId("pstv_tol_pct").get("value"))))
								{
								bookingAmount = trasactionAmt;
								bookingAmount = bookingAmount + bookingAmount * (dj.byId("pstv_tol_pct").get("value")/100.0);
								bookingAmountWidget.attr("value",bookingAmount,false);
								dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
								}
							}
							if(bookingAmount > dj.byId("tol_booking_amt") ? dj.byId("tol_booking_amt").get('value') : 0)
							{
							isValid = false;
							errorMessage = m.getLocalization("invalidBookingAmountTnx");
							
							}
							if(isValid && bookingAmount > limitAmt)
							{
								isValid = false;
								errorMessage = m.getLocalization("invalidBookingAmount", ["Limit"]);
							}
							if(isValid && bookingAmount > facilityAmt)
							{
								isValid = false;
								errorMessage = m.getLocalization("invalidBookingAmount", ["Facility"]);
							}
							if(m._config.validate_tnxamt_with_limit_outstanding)
							{
								if(isValid && dj.byId("tol_booking_amt").get('value') > limitAmt) //MPS-40477
								{
									isValid = false;
									isValidTnxAmt = false;
									errorMessage = m.getLocalization("invalidTnxAmount");
								}
							}							
						}
					}
					if(!isValid)
					{
						var onErrorCallback1;
						if(!isValidTnxAmt)
						{
							dj.hideTooltip(transactionAmtWidget.domNode);
							onErrorCallback1 = function(){
								transactionAmtWidget.focus();
								transactionAmtWidget.set("state","Error");
								dj.showTooltip(errorMessage, transactionAmtWidget.domNode, 0);								
								};						
						}
						else
						{
							dj.hideTooltip(bookingAmountWidget.domNode);
							onErrorCallback1 = function(){
								bookingAmountWidget.focus();
								bookingAmountWidget.set("state","Error");
								dj.showTooltip(errorMessage, bookingAmountWidget.domNode, 0);
								
								};
						}
						m.dialog.show("ERROR", errorMessage, "", onErrorCallback1);
						return false;
					}
				}
			}
			else if(this.id === "limit_id")
			{
				m._config.isLoading = false;
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is for getting currency rate for facility.
		 * <h4>Description:</h4> 
		 * Fetching currency rate for limit validation.
		 * @method {Object} requestCurrency
		 */
		getCurrencyRateForFacility : function(requestCurrency)
		{
			console.debug("[misys.form.common] Fetching MidRates for Limit Validation ");
			var recipientBankAbbvName = dijit.byId('recipient_bank_abbv_name');
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetMidRateForLimitAction"),
				handleAs 	: "json",
				sync 		: true,
				content 	: {
								currency  : requestCurrency,
								bank_abbv_name : recipientBankAbbvName
							  },
				load		: function(response, args){
								m._config.limitRate 	= 	response.limit ? response.limit : 1;
								m._config.facilityRate 	= 	response.facility ? response.facility : 1;
								m._config.rateType 		=	response.rateType ? response.rateType : 1;
								}
			});
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch user details auto populate the selected users
		 *
		 */
		getUserDetails : function(/*String*/loginName, /* String*/userId)
		{
			console.debug("[misys.form.common] Fetching selected user details ");
			var formXml = m.formToXML({
				selector: ".validate",
				xmlRoot: m._config.xmlTagName,
				ignoreDisabled: true
			});
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetUserDetails"),
				handleAs 	: "json",
				sync 		: true,
				content 	: {
								login_id : loginName,
								user_id  : userId,
								xmlString : formXml
							  },
				load		: _PopulateCloneUserDetails

			});
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch phrase content dynamically from the form
		 * and set in the text area field. 
		 */
		getDynamicNarrativeText : function(/*Node*/ widgetNode,/*String*/phraseId )
		{
			console.debug("[misys.form.common] Fetching Dynamic Text ");
			var formXml = m.formToXML({
				selector: ".validate",
				xmlRoot: m._config.xmlTagName,
				ignoreDisabled: true
			});
			var prodCode = dijit.byId("product_code")? dijit.byId("product_code").get("value") :"";
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetDynamicNarrativeText"),
				handleAs 	: "json",
				sync 		: true,
				content 	: {
								phrase_id  : phraseId,
								field : widgetNode,
								xmlString : formXml,
								product_code : prodCode
							  },
				load		: _showDynamicNarrativeText
			});
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is used to toggle products list when phrase type is changed.
		 */
		togglePhraseProducts : function()
		{
			console.debug("[misys.form.common] Toggling product fields. ");
			var phraseType = dj.byId("phrase_type") ? dj.byId("phrase_type").get("value") : dj.byId("type").get("value"), 
				existingProductSelectWidget = dj.byId("productcode") ? dj.byId("productcode") : dj.byId("product"), 
				productDataStore = m._config.phraseTypesProductMap[phraseType];
	
			// Remove the existing product and sub product entries
			if(!misys._config.isModified)
			{
				existingProductSelectWidget.set("value", "");
			}
	
			if (productDataStore)
			{
				// Load sub product items based on the newly selected Area (sorted by
				// name)
				existingProductSelectWidget.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : productDataStore
					}
				});
				existingProductSelectWidget.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
				existingProductSelectWidget.set("value", "");
				existingProductSelectWidget.focus();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This method is used to toggle category list when product is changed.
		 */
		togglePhraseCategory : function()
		{
			console.debug("[misys.form.common] Toggling phrase category. ");
			var productCode = dj.byId("productcode")? dj.byId("productcode").get("value") : dj.byId("product").get("value"), 
				existingCategoryWidget = dj.byId("category"), 
				categoryStore = m._config.productCategoryMap[productCode];
				
			if(productCode !== "")
			{
				if (categoryStore)
				{
					// Load sub product items based on the newly selected Area (sorted by
					// name)
					existingCategoryWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : categoryStore
						}
					});
					existingCategoryWidget.fetchProperties =
					{
						sort : [
						{
							attribute : "value"
						} ]
					};
					existingCategoryWidget.set("value", "");
					existingCategoryWidget.focus();
					existingCategoryWidget.set("state", "Error");
				}
				else
				{
					categoryStore = m._config.productCategoryMap["ALL"];
					existingCategoryWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : categoryStore
						}
					});
					existingCategoryWidget.fetchProperties =
					{
						sort : [
						{
							attribute : "value"
						} ]
					};
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to make ajax call for fetching data from search pop up form
		 * for the search fields (fieldsArray) and option (opt).
		 * The id passed is the store id where the ajax response is set. The widget id is the id used for the 
		 * setting the callback if required in the grid items.
		 */
		getAjaxSearchData : function (/*Store id*/ id, /*search fields*/ fieldsArray, /*option*/ opt, /*widget */ widgetId)
		{
			console.debug("[misys.form.common] getAjaxSearchData : Ajax call from search fields");
			
			var count = 0;
			// get the product code from the form
			var prodCode = dijit.byId("product_code")? dijit.byId("product_code").get("value") :"";
			var arrString = "[";
			dojo.forEach(fieldsArray, function(field){
				var widget = dj.byId(field);
				if(widget && widget.state === "Error")
				{
					return;
				}
				if(count !== 0) {
					arrString = arrString + ",";
				}
				count++;
				if(widget)
				{
					arrString = arrString +"'" + widget.get("value") + "'";
					
				}
				else {
					arrString = arrString + "''";
				}
			});
			arrString = arrString + "]";
			var widgetString = "[";
			count= 0;
			while(count!=(widgetId.length-1))
			{
				widgetString = widgetString +"'" + widgetId[count] + "',";
				count++;
			}
			widgetString = widgetString +"'" + widgetId[count] + "']";
				
			
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetStaticDataSearchAction"),
				handleAs 	: "json",
				sync 		: true,
				content 	: {
								option : opt,
								store_id  : id,
								"widget[]" : widgetString,
								productcode : prodCode,
								"fields[]" : arrString
							  },
				load		: _showAjaxSearchData
			});
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to toggle the fields on mutual exclusive principle
		 * for the fields (fieldsArray).
		 */
		toggleMutuallyExclusiveFields : function ( /*fields */ fieldsArray) {
			console.debug("[misys.form.common] toggleMutuallyExclusiveFields : toggle fields");
			var emptyFlag = true;
			var enabled = false;
			dojo.forEach(fieldsArray, function(field) {
				var widget = dj.byId(field);
				if((widget.declaredClass === 'dijit.form.NumberTextBox') || (widget.declaredClass === 'misys.form.CurrencyTextBox')) {
					if(widget && !enabled && widget.get("value")+"" !== "NaN") {
						widget.set("disabled",false);
						enabled = true;
						emptyFlag = false;
					}
					else {
						widget.set("disabled",true);
					}
				}
				else {
					if(widget && !enabled && widget.get("value") !== "" ) {
						widget.set("disabled",false);
						enabled = true;
						emptyFlag = false;
					}
					else {
						widget.set("disabled",true);
					}
				}
				
			});
			if(emptyFlag) {
				dojo.forEach(fieldsArray, function(field) {
					var widget = dj.byId(field);
					if(widget) {
						widget.set("disabled",false);
					}
				});
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to toggle the mandatory fields on mutual exclusive principle
		 * for the fields (fieldsArray). It disables the fields as well as makes them non mandatory.
		 */
		toggleMutuallyExclusiveMandatoryFields : function ( /*fields */ fieldsArray) {
			console.debug("[misys.form.common] toggleMutuallyExclusiveMandatoryFields : toggle fields");
			var emptyFlag = true;
			var enabled = false;
			dojo.forEach(fieldsArray, function(field) {
				var widget = dj.byId(field);
				if((widget.declaredClass === 'dijit.form.NumberTextBox') || (widget.declaredClass === 'misys.form.CurrencyTextBox')) {
					if(widget && !enabled && widget.get("value")+"" !== "NaN") {
						widget.set("disabled",false);
						widget.set("required", true);
						enabled = true;
						emptyFlag = false;
					}
					else {
						widget.set("disabled",true);
						widget.set("required", false);
					}
				}
				else {
					if(widget && !enabled && widget.get("value") !== "" ) {
						widget.set("disabled",false);
						widget.set("required", true);
						enabled = true;
						emptyFlag = false;
					}
					else {
						widget.set("disabled",true);
						widget.set("required", false);
					}
				}
				
			});
			if(emptyFlag) {
				dojo.forEach(fieldsArray, function(field) {
					var widget = dj.byId(field);
					if(widget) {
						widget.set("disabled",false);
						widget.set("required", true);
					}
				});
			}
		},
		getPrgmCpty: function(/*String*/program_id) {
			misys.showProgramCptyDialog('programCounterparty',"['abbv_name','name']",program_id,'','width:400px;height:400px',m.getLocalization("TABLE_PROGRAM_CPTY_LIST"),'legal' === 'popup');
		},
		
		/**
		 * <h4>Summary:</h4>
		 * When action === "required" : This method is used to toggle the mutual inclusive principle
		 * for the fields.If one widget is present, mandate the other and vice versa.
		 *  When action === "disabled" : This method is used to toggle enable/disbale one field based on the value of another field. 
		 */
		toggleMutuallyInclusiveFields : function (/*field*/ field1,/*field*/ field2,/*String*/ action) {
			var widget1 = dj.byId(field1);
			var widget2 = dj.byId(field2);
			if(action === "required"){
				if(widget1 &&  widget1.value !== "" && widget2)
				{
					widget2.set("required",true);
				}
				else if(widget1 &&  widget1.value === "" && widget2)
				{
					widget2.set("required",false);
				}
			}
			else if(action === "disabled"){
				if(widget1 && widget1.disabled === true){
					widget2.set("disabled", true);
					widget2.set("value","");
				}
				else if(widget1 && widget1.disabled === false){
					widget2.set("disabled", false);
				}
			}
		},
		toggleTransferIndicatorFlag : function( /*Boolean*/ keepFieldValues) {
			if(dj.byId("ntrf_flag").get("checked"))
				{
					dj.byId("narrative_transfer_conditions").set("disabled", true);
					dj.byId("narrative_transfer_conditions").set("value", "");
					document.getElementById("narrative_transfer_conditions_img").style.display = "none";
				}
			else
				{
					dj.byId("narrative_transfer_conditions").set("disabled", false);
					dj.byId("narrative_transfer_conditions").set("value", "");
					document.getElementById("narrative_transfer_conditions_img").style.display = "block";
				}
		},
		toggleDeliverMode : function( /*Boolean*/ keepFieldValues) {
			if(dj.byId("delv_org").get("value") === "99")
				{
					dj.byId("delv_org_text").set("disabled", false);
				}
			else
				{
					dj.byId("delv_org_text").set("disabled", true);
					dj.byId("delv_org_text").set("value", "");
				}
		},
		
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to clear the date array
		 */
		clearDateCache : function()
		{
			misys._config.dateCache=[];
		},
		
		setDraweeDetailBankName : function()
		{
			if( (dj.byId("cr_avl_by_code_2") && dj.byId("cr_avl_by_code_2").get("checked")) || (dj.byId("cr_avl_by_code_3") && dj.byId("cr_avl_by_code_3").get("checked")))
			{
				dj.byId("drawee_details_bank_name").set("value",dj.byId("drawee_details_bank_name")._resetValue);
			}
		},
		
		
		escapeHtml: function(/*String*/str){
			//	summary:
			//		Utility function to escape XML special characters in an HTML string.
			//	description:
			//		Utility function to escape XML special characters in an HTML string.
			//
			//	str:
			//		The string to escape
			//	returns:
			//		HTML String with special characters (<,>,&, ", etc,) escaped.
			return str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;").replace(/'/gm, "&#39;"); // String
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for showing fscm program for finance request, in a dialog.
		 * 
		 * @param String
		 * @param String[]
		 * @param String
		 * @param String
		 * @param String
		 * @param String
		 * @param boolean
		 * @method showFSCMProgramFinanceRequestDialog
		 */
		showFSCMProgramIPCollectionDialog : function( /*String*/ type,
								 	 	  /*String[]*/ fields, 
								 	 	  /*String*/ parameter, 
								 	 	  /*String*/ screen,
								 	 	  /*String*/ dimensions, 
								 	 	  /*String*/ title, 
								 	 	  /*Boolean*/ isInPopup){
							
			var url = [],
				query = {},
				contentURL = ajaxActionUrl,
				queryStore = {},
				urlAction = "GetStaticData", 
				urlScreen = screen || ajaxStaticDPopup, 
				onLoadCallback, childDialog;

			// Check that the dimensions have a trailing
			// semi-colon
			// as it will be appended to other rules later
			if (dimensions.slice(dimensions.length - 1) !== ";") {
				dimensions += ";";
			}

			contentURL += urlAction;
			queryStore.option = type;
			queryStore.fields = fields;
			d.mixin(queryStore, parameter);

			url.push("/screen/", urlScreen);
			
			query.option = type;
			query.fields = fields;
			d.mixin(query, parameter);
			query.dimensions = dimensions;
			query.popupType = "LIST_DATA";

			console.debug(messageGridContent, contentURL);

			// Load data
			onLoadCallback = function() {
				var grid = dj.byId(type + "data_grid");
				grid.showMessage(grid.loadingMessage);
				m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
				m.connect("CurrencyName", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('currencydata_grid'), ['NAME'], ['CurrencyName']);
				  }
				});
				
			};

			if (isInPopup) 
			{
				console.debug(chilDialog, url.join(""));
				childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
																	title : title,
																	id : "childXhrDialog",
																	href : m.getServletURL(url.join("")),
																	ioMethod: misys.xhrPost,
																	ioArgs: { content: query }
																});

				m.dialog.connect(childDialog, "onLoad", onLoadCallback);
				m.dialog.connect( childDialog, "onHide", 
						function() {
										setTimeout(function() {
											m.dialog.disconnect(childDialog);
											childDialog.destroyRecursive();
										}, 2000);
									}
				);

				// Offset the dialog from the parent window
				var co = d.coords("xhrDialog");
				childDialog._relativePosition = {
					x : co.x + 30,
					y : co.y + 30
				};

				childDialog.show();
			} 
			else 
			{
				m.dialog.show("URL", "", title, null, onLoadCallback, m.getServletURL(url.join("")), null, null, query);
			}
		},
		clearDataOnclicTenortype2or3 : function() {
			dj.byId("tenor_maturity_date").set("displayedValue", "");
			dj.byId("tenor_days").set("value", "");
			dj.byId("tenor_period").set("value", "");
			dj.byId("tenor_from_after").set("value", "");
			dj.byId("tenor_days_type").set("value", "");
			dj.byId("tenor_type_details").set("value", "");
			dj.byId("tenor_base_date").set("displayedValue", "");			
		},
		validateShipPeriod : function() {
				var shipPeriodField = dj.byId("ship_period");
				var shipPeriodFieldVal = shipPeriodField ? shipPeriodField.get("value") : "";
				var shipPeriodTabContainer = (dijit.byId("narrative_shipment_period") && dijit.byId("narrative_shipment_period").tabContainer) ? dijit.byId("narrative_shipment_period").tabContainer : "";
				var shipPeriodParentTab = (dijit.byId("narrative_shipment_period") && dijit.byId("narrative_shipment_period").parentTab) ? dijit.byId("narrative_shipment_period").parentTab : "";
				var narrativeShipmentPeriodTabs = "";
				var narrativeShipPeriodLabel = "";
				
					if(shipPeriodFieldVal === "01")
						{
							m.toggleRequired("earliest_ship_date", false);
							dj.byId("earliest_ship_date").set("displayedValue", "");
							dj.byId("earliest_ship_date").set("disabled", true);

							m.toggleRequired("last_ship_date", false);
							dj.byId("last_ship_date").set("displayedValue", "");
							dj.byId("last_ship_date").set("disabled", true);
						
							m.toggleRequired("narrative_shipment_period", true);
							dj.byId("narrative_shipment_period").set("disabled", false);
							dj.byId("narrative_shipment_period_img").set("required", true);
							
							if(shipPeriodTabContainer.length > 0 && shipPeriodParentTab.length > 0 ){
							narrativeShipmentPeriodTabs = shipPeriodTabContainer.concat("_tablist_").concat(shipPeriodParentTab);
							narrativeShipPeriodLabel = dj.byId(narrativeShipmentPeriodTabs).label ? dj.byId(narrativeShipmentPeriodTabs).label : "";
							if(!narrativeShipPeriodLabel.includes("*")){
							  dj.byId(narrativeShipmentPeriodTabs).set("label", "*".concat(narrativeShipPeriodLabel));
							  }
							}else{
								dj.byId("narrative_shipment_period_img").set("displayedValue", "*");
								dj.byId("narrative_shipment_period_img").set("value", dj.byId("narrative_shipment_period_img").get("value"));
							}
							
						} else if(shipPeriodFieldVal === "02")
						{
							m.toggleRequired("earliest_ship_date", false);
							dj.byId("earliest_ship_date").set("displayedValue", "");
							dj.byId("earliest_ship_date").set("disabled", true);

							m.toggleRequired("last_ship_date", false);
							dj.byId("last_ship_date").set("disabled", false);
		
							m.toggleRequired("narrative_shipment_period", false);
							if (dj.byId("narrative_shipment_period")) {
								dj.byId("narrative_shipment_period").set("displayedValue", "");
								dj.byId("narrative_shipment_period").set("disabled", true);
							}
							if (dj.byId("narrative_shipment_period_img")) {
								dj.byId("narrative_shipment_period_img").set("required", false);
							}
							
							if(shipPeriodTabContainer.length > 0 && shipPeriodParentTab.length > 0 ){										
						       narrativeShipmentPeriodTabs = shipPeriodTabContainer.concat("_tablist_").concat(shipPeriodParentTab);
						       narrativeShipPeriodLabel = dj.byId(narrativeShipmentPeriodTabs).label;
						       if(narrativeShipPeriodLabel.includes("*")){
						        dj.byId(narrativeShipmentPeriodTabs).set("label", narrativeShipPeriodLabel.replace("*", ""));
						       }
							}			
						} else if(shipPeriodFieldVal === "03")
						{
							m.toggleRequired("earliest_ship_date", true);
							dj.byId("earliest_ship_date").set("disabled", false);
		
							m.toggleRequired("last_ship_date", true);
							dj.byId("last_ship_date").set("disabled", false);
							
							m.toggleRequired("narrative_shipment_period", false);
							dj.byId("narrative_shipment_period").set("value", "");
							dj.byId("narrative_shipment_period").set("disabled", true);
                            dj.byId("narrative_shipment_period_img").set("required", false);
							
                            if(shipPeriodTabContainer.length > 0 && shipPeriodParentTab.length > 0 ){										
 						       narrativeShipmentPeriodTabs =  shipPeriodTabContainer.concat("_tablist_").concat(shipPeriodParentTab);
 						       narrativeShipPeriodLabel = dj.byId(narrativeShipmentPeriodTabs).label;
 						       if(narrativeShipPeriodLabel.includes("*")){
 						        dj.byId(narrativeShipmentPeriodTabs).set("label", narrativeShipPeriodLabel.replace("*", ""));
 						       }
 							}
						}
				}
	});

	// Onload/Unload/onWidgetLoad Events
	d.ready(function(){
		// TODO Probably shouldn't be in _config
		d.mixin(m._config, {
			advisingBank : advBank,
			anyBank: "Any Bank",
			issuingBank : "Issuing Bank",
			other : "Other",
			namedBank : "Named Bank",
			firstPageLoad : false
		}); 
	});
})(dojo, dijit, misys);
dojo.require('misys.client.form.common_client');