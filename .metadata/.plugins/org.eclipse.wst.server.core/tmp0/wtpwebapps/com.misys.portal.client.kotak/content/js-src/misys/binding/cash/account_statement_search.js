dojo.provide("misys.binding.cash.account_statement_search");

dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.form.common");
dojo.require("dijit.Tooltip");
dojo.require("misys.widget.Dialog");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	var formloading = true;
	var range_options = ['Current Day','Previous Day','Current Month','Previous Month','dateRange'];
	
		/**
		 * To change extension of the file depending on the output format selected
		 */
		function _setExportFileName()
		{
			var extension = dj.byId("export_list_option");
			if(extension != "screen")
				{
					var name = "AccountStatement." + extension;
					dj.byId("filename_option").set("value", name);
				}	
		}	
		
		function _validateDateRange()
		{
			if((dj.byId("from_date").get("value") !== "" && dj.byId("to_date").get("value") !== "" )&& (dj.byId("from_date").get("value") !== null && dj.byId("to_date").get("value") !== null ))
			{
				var from = dj.byId('from_date');
				var to =  dj.byId('to_date');
				// Test that the 'To' date is greater than or equal to
				// the 'From' date
				var standardizedFromDate = m.localizeDate(from);
				var standardizedToDate = m.localizeDate(to);
				var actualRange = ((standardizedToDate.getTime() - standardizedFromDate.getTime())/(1000 * 60 * 60 * 24));
				console.debug("Range "+ actualRange);
				var limitRange = parseInt(dj.byId('limit_range').getValue(), 10);
				
				if(!m.compareDateFields(from, to)) {
						this.invalidMessage = m.getLocalization("toDateGreaterThanFromDateError", [
										dj.byId('from_date').get("displayedValue"),
										dj.byId('to_date').get("displayedValue")]);
						m.showTooltip(m.getLocalization('toDateGreaterThanFromDateError',
								[dj.byId('to_date').get("displayedValue"),dj.byId('from_date').get("displayedValue")]), d.byId('to_date'), ['below']);
						//dj.byId("to_date").set("value", null);
						return false;
					}	
				
				//Test the range between 'To' date and 'From' date
				if(actualRange > limitRange) {
					this.invalidMessage = m.getLocalization("actualRangeGreaterThanLimitRangeError", [
									dj.byId('limit_range').get("displayedValue")]);
					//dj.byId('to_date').set("value", null);
					m.showTooltip(m.getLocalization('actualRangeGreaterThanLimitRangeError',
							[dj.byId('limit_range').get("displayedValue")]), d.byId('to_date'), ['below']);
					return false;
				}	else {
					dojo.query('input:submit', 'TransactionSearchForm').removeAttr("disabled");
					return true;
				}
			}
		}
		function _validateToDate()
		{
			var to = dj.byId('to_date');
			var today = dj.byId('today');
			var displayMessage = misys.getLocalization('requiredToolTip');
			if((to.get("value") === "" ) || (to.get("value") === null ))
			{
				to.set("state","Error");
				dj.hideTooltip(to.domNode);
				dj.showTooltip(displayMessage, to.domNode, 0);
				var hideTT = function() {dj.hideTooltip(to.domNode);};
				setTimeout(hideTT, 1500);
				return false;	
				
			}
			// Test if 'To' date is less than todays date
			else if (!m.compareDateFields(to, today))
			{
				to.set("state","Error");
				this.invalidMessage = m.getLocalization("toDateLessThanOrEqualToTodaysDateError", [
						dj.byId('to_date').get("displayedValue"), dj.byId('today').get("value") ]);
				m.showTooltip(m.getLocalization('toDateLessThanOrEqualToTodaysDateError', [
						dj.byId('to_date').get("displayedValue"), dj.byId('today').get("value") ]), d.byId('to_date'), [ 'below' ]);
				//dj.byId("to_date").set("value", null);
				//Disabling the search button to stop the request if invalid data
				return false;
			}
			else {
				dojo.query('input:submit', 'TransactionSearchForm').removeAttr("disabled");
				return true;
			}
			
		}
			
		
		function _populateDateRange()
		{		 
			d.forEach(range_options ,function(node, i)
					{
						if (dj.byId(node))
						{
							if(dj.byId(node).get("checked"))
							 {
							 	dj.byId("rangeOption").set("value",i+1);							 	
							 }
						}
					});
		}
		function _validateFromDate()
		{	
			var from = dj.byId('from_date');
			var displayMessage = misys.getLocalization('requiredToolTip');			
			if((from.get("value") === "") || (from.get("value") === null))
			{
				from.set("state","Error");
				dj.hideTooltip(from.domNode);
				dj.showTooltip(displayMessage, from.domNode, 0);
				var hideTT = function() {dj.hideTooltip(from.domNode);};				
				setTimeout(hideTT, 1500);
				return false;	
			}
			else if((dj.byId("from_date").get("value") !== "")&& (dj.byId("from_date").get("value") !== null))
			{			
				var today = dj.byId('today');
				
				// Test if 'From' date is less than todays date 
				if(!m.compareDateFields(from, today)) {
					from.set("state","Error");
					this.invalidMessage = m.getLocalization("fromDateLessThanOrEqualToTodaysDateError", [
					                                                                   		dj.byId('from_date').get("displayedValue"),
					                                										dj.byId('today').get("value")]);
					m.showTooltip(m.getLocalization('fromDateLessThanOrEqualToTodaysDateError',[
					                                                                   		dj.byId('from_date').get("displayedValue"),
					                                										dj.byId('today').get("value")]), d.byId('from_date'), ['below']);
					//dj.byId("from_date").set("value", null);
					return false;
					} 						
			}else {
				dojo.query('input:submit', 'TransactionSearchForm').removeAttr("disabled");
				return true;
			}	
		}
		function _fieldValidation() 
		{
			var hideTT;
			var asteriskVal=/^[^\*]/;
			var entityExists=dj.byId("entity");
			var displayMessage;
			if(entityExists)
			{
				if(dj.byId("entity").get("value")!== "" && dj.byId("entity").get("value").search(asteriskVal) === -1)
				{
					dj.byId("entity").set("value","");
					dijit.byId("entity").focus();
					m.showTooltip(m.getLocalization('entityInputError'),d.byId("entity"),0);
					hideTT = function() {
							dj.hideTooltip(dijit.byId("entity").domNode);
						};
					setTimeout(hideTT, 1500);	
					return false;
				}				
		
				else if(dj.byId("entity").get("value") === "")
				{
					displayMessage = misys.getLocalization('mandatoryEntMessage', [dijit.byId("entity").get("value")]);
					//focus on the widget and set state to error and display a tooltip indicating the same
					dijit.byId("entity").focus();
					dijit.hideTooltip(dijit.byId("entity").domNode);
					dijit.showTooltip(displayMessage, dijit.byId("entity").domNode, 0);
					hideTT = function() {
							dj.hideTooltip(dijit.byId("entity").domNode);
						};
					setTimeout(hideTT, 1500);	
					return false;
				}
			}
			else if (dj.byId("account_no").get("value")!== "" && dj.byId("account_no").get("value").search(asteriskVal) === -1)
			{			
				dj.byId("account_no").set("value","");
				dijit.byId("account_no").focus();
				m.showTooltip(m.getLocalization('accountInputError'),d.byId("account_no"),0);
				hideTT = function() {
						dj.hideTooltip(dijit.byId("account_no").domNode);
					};
				setTimeout(hideTT, 1500);	
				return false;
			}
					
			else if(dj.byId("account_no").get("value") === "")
			{
				displayMessage = misys.getLocalization('mandatoryAcctNumberMessage', [dijit.byId("account_no").get("value")]);
			      //focus on the widget and set state to error and display a tooltip indicating the same
				dijit.byId("account_no").focus();
			    dijit.hideTooltip(dijit.byId("account_no").domNode);
			    dijit.showTooltip(displayMessage, dijit.byId("account_no").domNode, 0);
			    hideTT = function() {
					dj.hideTooltip(dijit.byId("account_no").domNode);
				};
				setTimeout(hideTT, 1500);	
				return false;
			}	
			return true;
		}
		function _openPopup( /*String*/ url,
				 /*String*/ name,
				 /*String*/ props) {
	
		var windowName = name || misys.getLocalization("transactionPopupWindowTitle"),
		   windowProps = props || "width=800,height=500,resizable=yes,scrollbars=yes",
		   popupWindow = d.global.open(url, windowName, windowProps);
		
		console.debug("[misys.common] Opening a standard popup with name", windowName, "at URL", url);
		if(!popupWindow.opener){
			popupWindow.opener = self;
		}
		
		popupWindow.focus();
		}
		
		function _isNotBlank(dateFieldId) {
			if (dj.byId(dateFieldId) && (dj.byId(dateFieldId).get("value") == "" || dj.byId(dateFieldId).get("value") == null)) {	
				dj.byId(dateFieldId).set("state","Error");				
				this.invalidMessage = m.getLocalization("awbToolTip", 
						[dj.byId(dateFieldId).get("displayedValue"), dj.byId(dateFieldId).get("value") ]);
				m.showTooltip(m.getLocalization('awbToolTip', 
						[dj.byId(dateFieldId).get("displayedValue"), dj.byId(dateFieldId).get("value") ]), d.byId(dateFieldId), [ 'below' ]);
				return false;
			}	
			return true;
		}
		
		function populateBanks()
		{
			var entity = null;
			var bank = null;
			if(dj.byId("bank_abbv_name"))
			{
				bank = dj.byId("bank_abbv_name");
			}
			
			if(dj.byId("entity") && dj.byId("entity").get("value") !== "")
			{
				entity = dj.byId("entity").get("value");
			}
			else
			{
				entity = "All";
			}
			
			
			if(misys._config.entityBanksMap)
			{
				var customerBankDataStore = null;
				customerBankDataStore = m._config.entityBanksMap[entity];
				console.log(customerBankDataStore);
				if (customerBankDataStore && bank)
				{	
					bank.store = new dojo.data.ItemFileReadStore({
						data :
						{
							identifier : "value",
							label : "name",
							items : customerBankDataStore
						}
					});
					bank.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}	
			}
		}
		
		function _handleBankOnChangeFields()
		{
			var bank_abbv_name = dj.byId('bank_abbv_name').get('value');
			if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[bank_abbv_name][0] && misys._config.businessDateForBank[bank_abbv_name][0].value !== '')
			{
				var dateFocussed = misys._config.businessDateForBank[bank_abbv_name][0].value;
				var yearServer = dateFocussed.substring(0,4);
				var monthServer = dateFocussed.substring(5,7);
				var dateServer = dateFocussed.substring(8,10);
				var today = dateServer + "/" + monthServer + "/" + yearServer;
				var yesterday = new Date(yearServer, monthServer - 1, dateServer);
				yesterday.setDate(yesterday.getDate() - 1);
				yesterday = yesterday.getDate() + "/" + (yesterday.getMonth() + 1) + "/" + yesterday.getFullYear(); 
				var currentMonthStart = new Date(yearServer, monthServer - 1, 1);
				currentMonthStart = currentMonthStart.getDate() + "/" + (currentMonthStart.getMonth() + 1) + "/" + currentMonthStart.getFullYear(); 
				var previousMonthStart = new Date(yearServer, monthServer-2,1);
				var previousMonthEnd = new Date(previousMonthStart.getFullYear(), previousMonthStart.getMonth() + 1, 0);
				previousMonthStart = previousMonthStart.getDate() + "/" + (previousMonthStart.getMonth() + 1) + "/" + previousMonthStart.getFullYear(); 
				previousMonthEnd = previousMonthEnd.getDate() + "/" + (previousMonthEnd.getMonth() + 1) + "/" + previousMonthEnd.getFullYear(); 
				
				dj.byId("today").set("value", today);
				dj.byId("yesterday").set("value", yesterday);
				dj.byId("currentMonthStart").set("value", currentMonthStart);
				dj.byId("previousMonthStart").set("value", previousMonthStart);
				dj.byId("previousMonthEnd").set("value", previousMonthEnd);
			}
			if(formloading && dj.byId("account_no"))
			{
				dj.byId("account_no").set("value", "");
			}
				
				formloading = true;
		}
		
		
		d.mixin(m, {			
			openAccountDetails : function(accountId, entityID)
			{
				var urlScreen = "/screen/AjaxScreen/action/AccountAdditionalDetailsAction";
				var query = {};
				var diagTitle = m.getLocalization("accountDetailsTitle");
				query.accountfeatureid = accountId;
				query.custentity = entityID;
						        
				var dialogAccountDetails = new dj.Dialog({
					id: "account_details_dialog",
		            title: diagTitle,
		            ioMethod: misys.xhrPost,
		            ioArgs: {content: query},
		            href: m.getServletURL(urlScreen),
		            style: "width: 640px;height:auto"
				});
				
				dialogAccountDetails.connect(dialogAccountDetails, "hide", function(e){
				    dj.byId("account_details_dialog").destroy(); 
				});
				
				dialogAccountDetails.show();
			},			
			bind : function() {								
				m.connect("dateRange", "onChange", function()
						{							
							if (dj.byId("dateRange").get("checked"))
							{
								dj.byId("from_date").set("displayedValue","");
								dj.byId("to_date").set("displayedValue","");
								dj.byId("from_date").set("disabled", false);
								dj.byId("to_date").set("disabled", false);
								m.toggleRequired("from_date", true);
								m.toggleRequired("to_date", true);
							}
							else
							{								
								dj.byId("from_date").set("disabled", true);
								dj.byId("to_date").set("disabled", true);
								m.toggleRequired("from_date", false);
								m.toggleRequired("to_date", false);								
							}								
						});	
				
				// Check for valid dates
				m.connect("account_no", "onChange" , _fieldValidation);
				
				m.connect("account_no", "onChange", function(){
					dj.byId("account_no").set("state","");
				});
				
				m.connect("Current Day","onChange", function(){
					if(dj.byId("Current Day").get("checked"))
						{
							dj.byId("create_date").set("displayedValue", dj.byId("today").get("value"));
							dj.byId("create_date2").set("displayedValue", dj.byId("today").get("value"));
						}
				});
				
				m.connect("Previous Day","onChange", function(){
					if(dj.byId("Previous Day").get("checked"))
						{
							dj.byId("create_date").set("displayedValue", dj.byId("yesterday").get("value"));
							dj.byId("create_date2").set("displayedValue", dj.byId("yesterday").get("value"));
						}
				});
				
				m.connect("Current Month","onChange", function(){
					if(dj.byId("Current Month").get("checked"))
						{
						// if today is 1st day of the month, then we set dates for today
						  if(dj.byId("currentMonthStart").get("value") === dj.byId("today").get("value"))
							{
								dj.byId("create_date").set("displayedValue", dj.byId("today").get("value"));
								dj.byId("create_date2").set("displayedValue", dj.byId("today").get("value"));
							}
						else
							{
								dj.byId("create_date").set("displayedValue", dj.byId("currentMonthStart").get("value"));
								dj.byId("create_date2").set("displayedValue", dj.byId("today").get("value"));
							}
						}
				});
				
				m.connect("Previous Month","onChange", function(){
					if(dj.byId("Previous Month").get("checked"))
						{
							dj.byId("create_date").set("displayedValue", dj.byId("previousMonthStart").get("value"));
							dj.byId("create_date2").set("displayedValue", dj.byId("previousMonthEnd").get("value"));
						}
				});
				
				if(d.byId("TransactionSearchForm")) 
				{
						m.connect("TransactionSearchForm", "onSubmit",  function(/*Event*/ e)
						{							
							var entity_field	=	dj.byId("entity"),
							account_no_field	=	dj.byId("account_no"),
							displayMessage = "";
							var hideTT;
							if(entity_field)
							{
								if (e && (account_no_field.get("value") === "" || entity_field.get("value") === "")) 
								{
									_fieldValidation();
									e.preventDefault();
								}
								displayMessage = misys.getLocalization('accountStatementErrorToolTip', [entity_field.get("value"),account_no_field.get("value")]);
								
								//focus on the widget and set state to error and display a tool tip indicating the same
								if("S" + entity_field.get("value") === "S")
								{
									entity_field.set("focus", true);
									entity_field.set("state","Error");
									dj.hideTooltip(entity_field.domNode);
									dj.showTooltip(displayMessage, entity_field.domNode, 0);
									hideTT = function() {dj.hideTooltip(entity_field.domNode);};
									setTimeout(hideTT, 1500);
								}
							}
							if (e && (account_no_field.get("value") === "")) 
							{
								_fieldValidation();
								e.preventDefault();
							}
							displayMessage = misys.getLocalization('accountStatementErrorToolTip', [account_no_field.get("value")]);
							
							if(dj.byId("export_list").get("value") === "screen")
							{
								dj.byId("export_list").set("value","");
							}
							
							/*if(dj.byId("export_list").get("value") === "")
							{
								dj.byId("account_no").set("value","");
							}*/
							
							if(!( dj.byId('account_id') && dj.byId('account_id').get('value')))
							{
								if("S" + account_no_field.get("value") === "S")
								{
									account_no_field.set("focus", true);
									account_no_field.set("state","Error");
									dj.hideTooltip(account_no_field.domNode);
									dj.showTooltip(displayMessage, account_no_field.domNode, 0);
									hideTT = function() {dj.hideTooltip(account_no_field.domNode);};
									setTimeout(hideTT, 1500);
								}
							}
							if (dj.byId("dateRange").get("checked") && (dj.byId("from_date").get("displayedValue") === "" || dj.byId("to_date").get("displayedValue") === ""))
							{
								m.toggleRequired("from_date", true);
								m.toggleRequired("to_date", true);
								_validateFromDate();
								_validateToDate();
								_validateDateRange();
								e.preventDefault();
							}
							
							if (dj.byId("dateRange") && (dj.byId("dateRange").get("checked") && !_validateDateRange())) {	
									e.preventDefault();
									d.stopEvent(e);
								if (!d.every(["from_date", "to_date"], _isNotBlank)) {
									d.stopEvent(e);
								}								
							}
							
						});
					}
				
				m.connect("from_date", "onChange" , function(){
					_validateFromDate();
					_validateDateRange();
					if(dj.byId("from_date"))
						{
							dj.byId("create_date").set("value", dj.byId("from_date").get("value"));
						}
				});
				m.connect("to_date", "onChange" , function(){
					var res = _validateToDate();
					if(res) {
						_validateDateRange();
						if(dj.byId("to_date"))
							{
								dj.byId("create_date2").set("value", dj.byId("to_date").get("value"));
							}
					}
				});
				m.connect("account_type", "onChange" , function(){					
					if(dj.byId("account_type").get("value") === '02')
						{
							dj.byId("dateRange").reset();
							d.style("dateRanges", "display", "none");	
							d.style("note_div", "display", "none");	
						}			
					else
						{
							d.style("note_div", "display", "block");
							d.style("dateRanges", "display", "block");
						}
				});				
				m.connect("entity", "onChange", function(){
					if(dj.byId("entity").get("value")=== "*"||dj.byId("entity").get("value")==="**")
						{
							dj.byId("entity").set("value","");
							dijit.byId("entity").focus();
							m.showTooltip(m.getLocalization('entityInputError'),d.byId("entity"),0);
						}
					if(dj.byId("account_no"))
					{
						dj.byId("account_no").set("value", "");
						dj.byId("account_id").set("value", "");
					}
					if(dj.byId("bank_abbv_name"))
		    		{
		    			dj.byId("bank_abbv_name").set("value","");
		    		}
					if(dj.byId("entity").get("value") !== "")
					{
						dj.byId("entity").set("state","");
						dj.byId("account_no").set("state","");
					}
					populateBanks();
				});
				
				// fix a problem with this grid that it doesn't size properly, 
				// truncating the last column
				d.query(".dojoxGrid").forEach(function(g){
					m.connect(g.id, "_onFetchComplete", function(){
						m.resizeGrids();
					});
				});
			},
			exportABStatementListToFormat : function( /*String*/ pdfOption) {
				
				//as options always will be upper case
				// in module files, convert the final option to upper case
				pdfOption = pdfOption.toUpperCase();
				_populateDateRange();
				var url = ["/screen/AccountBalanceScreen?operation=LIST_STATEMENTS"];
				url.push("&export_list_option=", pdfOption);
				url.push("&filename=", "AccountStatement.pdf");
				url.push("&in_memory_export=", "true");
				url.push("&type=", "export");
				if(dj.byId("entity"))
				{
					url.push("&entity=", dj.byId("entity").get("value"));
				}
				url.push("&account_no=", dj.byId("account_no").get("value"));
				url.push("&stmtrange=", dj.byId("rangeOption").get("value"));
				url.push("&create_date=", dj.byId("create_date").get("displayedValue"));
				url.push("&create_date2=", dj.byId("create_date2").get("displayedValue"));
				url.push("&owner_type=", dj.byId("owner_type").get("value"));
				url.push("&bic_code=", dj.byId("bic_code").get("value"));
				_openPopup(misys.getServletURL(url.join("")));
			},		
			
			onFormLoad : function() {
				m.connect("export_list_option", "onChange", _setExportFileName);
				m.connect("bank_abbv_name", "onChange", _handleBankOnChangeFields);

				d.style("rangeParametersDiv","display","none");
				if(!dj.byId("dateRange").get("checked") && dj.byId("from_date") && dj.byId("to_date"))
					{
						dj.byId("from_date").reset();
						dj.byId("to_date").reset();
						dj.byId("from_date").set("disabled", true);
						dj.byId("to_date").set("disabled", true);
					}
				
				if(dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get("value") === "")
				{
					dj.byId("bank_abbv_name").set("required",false);
				}	
				
				// Check if any range has been selected, if not default to previous day
				var isChecked =  false;
				
				d.forEach(range_options ,function(node, i)
						{
							if (dj.byId(node))
							{
								if(dj.byId(node).get("checked"))
								 {
								 	isChecked =  true;								 	
								 }
							}
						});		
				if(!dj.byId("dateRange").get("checked"))
					{
						if(!isChecked)
						{
							dj.byId("Previous Day").set("checked" , true);
						}
					}				
				
				if(dj.byId("account_type").get("value") === '02')
					{
						dj.byId("dateRange").reset();
						d.style("dateRanges", "display", "none");								
					}						
					
				m.toggleRequired("entity", true);
				m.toggleRequired("account_no", true);
				
				populateBanks();
				
				if(dj.byId("bank_name_hidden") && dj.byId("bank_name_hidden").get("value") !== '' && dj.byId("bank_abbv_name"))
				{
					if(dj.byId("bank_abbv_name").get("value") === '')
					{
						formloading = false;
					}
					dj.byId("bank_abbv_name").set("value", dj.byId("bank_name_hidden").get("value"));
				}
				m.toggleRequired("entity", true);
				
				if(dj.byId("account_no").get("value") === "" && formloading === "true")
				{
					m.dialog.show("ERROR", m.getLocalization("accountInputError"));
					return;
				}	
				m.connect("account_no", "onChange", function() {
					if(dj.byId("bank_abbv_name") && dj.byId("account_no") && dj.byId("account_no").get("value") !== "" && dj.byId("bank_abbv_name").get("value") === '')
					{	
						formloading = false;
						dj.byId("bank_abbv_name").set("value", m._config.customerBankName);
					}
				});
			}
		});
	})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.account_statement_search_client');