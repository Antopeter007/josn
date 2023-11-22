dojo.provide("misys.binding.system.matrix");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.addons");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
{

	"use strict"; // ECMA5 Strict Mode

	//
	// Private functions & variables
	//
	function _checkForAuthorisationLevel()
	{

		// summary:
		// Check if authorisation levels have been added
		// tags:
		// private

		
		var trs = dojo.query("tr", "role-master-table");
		if (!trs[1])
		{
			// Matrix needs minimum one level, show error message
			m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMinimumAuthorisationLevelError");
			return false;
		}
		else
		{
			return true;
		}
	}

	function _toggleAmtType()
	{
		var typeCodeDiv = dojo.byId("amtTypeDiv"), isVisible = m.isVisible(typeCodeDiv);

		if (dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") === "14")
		{
			m.animate("wipeIn", typeCodeDiv);
		} else
		{
			dj.byId("amt_type_1").set("checked", true);
			dj.byId("amt_type_2").set("checked", false);
			if (isVisible)
			{
				m.animate("wipeOut", typeCodeDiv);
			}
		}
	}

	function _toggleAccType()
	{
		var accDiv = dojo.byId("accDiv"), isVisible = m.isVisible(accDiv);
		var productCode = dj.byId("product_code") ? dj.byId("product_code").get("value") : "";
		var subProductCode = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";

		if (productCode === "SE"  && !(subProductCode === "DT")|| (productCode === "FT" && !(subProductCode === "TINT" || subProductCode === "TTPT")) || (productCode === "BK" && subProductCode !== "LNRPN") || (productCode === "TD" && subProductCode !== "TRTD"))
		{
			m.animate("wipeIn", accDiv);
			if (m._config.company_type === "03")
			{
				m.toggleRequired("account_no", true);
			}
		} else
		{
			if (isVisible)
			{
				m.animate("wipeOut", accDiv);
				if (m._config.company_type === "03")
				{
					m.toggleRequired("account_no", false);
				}
			}
		}
	}
	
	function _toggleProductTypeAndTenor()
	{
		if(dj.byId("isSwift2019Enabled").get("value") && (dj.byId("product_code").get("value") === 'BG' || dj.byId("product_code").get("value") === 'BR') )
		{
			var prodTypeDiv = dojo.byId("productTypeDiv"), isProdTypeVisible = m.isVisible(prodTypeDiv);
			var tenorDiv = dojo.byId("tenorDiv"), isTenorVisible = m.isVisible(tenorDiv);
			var productCode = dj.byId("product_code") ? dj.byId("product_code").get("value") : "";
			var subProductCode = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";
			
			var hiddenProdType = dj.byId('product_type_code_hidden'), isProdTypeOnLoad = false;
			var hiddenTenorType = dj.byId('tenor_type_code_hidden'), isTenorOnLoad = false;
			if (hiddenProdType && hiddenProdType.get("value") !== '' && hiddenTenorType && hiddenTenorType.get("value") !== '')
			{
				isProdTypeOnLoad = true;
				isTenorOnLoad = true;
			}
			if ((productCode === "BG" || productCode === "BR")  && !(subProductCode === "STBY")) 
			{
				m.animate("wipeIn", prodTypeDiv);
				m.animate("wipeIn", tenorDiv);
				if (m._config.company_type === "03")
				{
					m.toggleRequired("product_type_code", true);
					m.toggleRequired("tenor_type_code", true);
				}
			} else
			{
				if (isProdTypeVisible && isTenorVisible)
				{
					m.animate("wipeOut", prodTypeDiv);
					m.animate("wipeOut", tenorDiv);
					if (m._config.company_type === "03" || m._config.company_type === "01")
					{
						m.toggleRequired("product_type_code", false);
						m.toggleRequired("tenor_type_code", false);
					}
				}
			}
			
			dj.byId("product_type_code").set('displayedValue', "");
			dj.byId("tenor_type_code").set('displayedValue', "");
	
			if (isProdTypeOnLoad && isTenorOnLoad && !(subProductCode === "STBY")) {
				dj.byId("product_type_code").set('displayedValue', hiddenProdType.get('value'));
				dj.byId("tenor_type_code").set('displayedValue', hiddenTenorType.get('value'));
			}
			
			m.connect("sub_product_code", "onChange",  function(){
			if(dj.byId('product_type_code'))
			{
				dj.byId('product_type_code').set('value', '');
			}
			if(dj.byId("tenor_type_code"))
			{
				dj.byId("tenor_type_code").set('value', '');
			}
			});
		}
	}
	
	
	// Client needs a custom version of this method.
	// We keep separate lists of product codes and sub product
	// but don't show them to the user, who has the impression
	// that sub products and products are the same thing.
	// on the storage and in the validation though the difference
	// still apply.
	function _changeProductList(isOnLoad)
	{

		var	existingProductSelectWidget = dj.byId('product_code'), 
			productHidden = dj.byId('product_code_hidden') ?  dj.byId('product_code_hidden').get('value'): "",
			accountField = dj.byId('account_no');

		if (productHidden == "FT" || productHidden == "SE" || productHidden === "BK" || productHidden === "TD")
		{
			//m.animate("wipeOut", productDiv);
			//m.animate("wipeIn", subProductDiv);
			if (accountField)
			{
				accountField.set("required", true);
			}
		}
		else
		{
			//m.animate("wipeOut", subProductDiv);
			//m.animate("wipeIn", productDiv);
			if (accountField)
			{
				accountField.set("required", false);
			}
		}
		// if the hidden values are set, the page is in modify mode:
		// set if it is the first time:
		if (isOnLoad == "LOAD")
		{
			existingProductSelectWidget.set("value", productHidden);
		}
		else
		{
			if (accountField)
			{
				accountField.set("value", "");
			}
			// Empty the account field if business area changes
		}
		existingProductSelectWidget.fetchProperties =
		{
			sort : [
			{
				attribute : "name"
			} ]
		};
	}
	
	//This function is used to fetch and set sub_tnx_type_code vlaues to dropdown based on the 
	//user already selected product code and tnx type code. This sub tnx type code drop down should
	//be visible for customer authorisation only not for bank/bankgroup level authorisation.
	//Default value for this dropdown is '*'
	function _changeSubTnxTypeCodeList()
	{
		var typeItems 	= [],
		typeValues 	= [],
		emptyFlag 	= true,
		displaySubTnxType = false,
		productCode = dj.byId('product_code') ? dj.byId('product_code').get('value'): "", 
		productCodeKey = (productCode === '*') ? 'ALL' : productCode,
		tnxTypeDataStore = (productCodeKey !== "") ? m._config.SubTnxTypeCollection[productCodeKey] : "",
		tnxTypeCode = dj.byId('tnx_type_code') ?dj.byId('tnx_type_code').get('value'): "",
		subTnxTypeHidden = dj.byId('sub_tnx_type_code_hidden') ? dj.byId('sub_tnx_type_code_hidden').get('value'): "",
		existingProducts = dj.byId('sub_tnx_type_code');
		if(existingProducts)
		{
			existingProducts.set("displayedValue", "");
			existingProducts.store = null;
		}	
		
		var subTnxDiv = dojo.byId("subTnxTypeDiv"), isVisible = m.isVisible(subTnxDiv);
		if(existingProducts)
		{
			existingProducts.set("displayedValue", '');
		}	
		
		if(m._config.company_type === "03" && tnxTypeDataStore && tnxTypeCode)
		{
		   if(tnxTypeDataStore[0][tnxTypeCode])
		   {
			   var array = tnxTypeDataStore[0][tnxTypeCode];
			   
			   if(array.name && array.name.length === 1 && array.name === '*' && array.value === '*')
			   {
				   displaySubTnxType = false;
			   }else  if(array.length > 1)
			   {
				   displaySubTnxType = true;
				   existingProducts.set("displayedValue", '');
				   m.animate("wipeIn", subTnxDiv);
				   m.toggleRequired("sub_tnx_type_code", true); 
				   
				    dojo.forEach(array, function(item, index){
	                     typeItems[index] = item.name;
	                     typeValues[index] = item.value;
				   });
		       }
			   
			   
		   }else{
			   displaySubTnxType = false;
		   }
		}else{
			displaySubTnxType = false;
		}
		
		if(!displaySubTnxType)
		{	
			 typeItems[0] = '*';
             typeValues[0] = '*';
		}
	 
		 var jsonData = {"identifier" :"id", "items" : []};
		 var productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
		 
		 for(var j = 0; j < typeItems.length; j++){
			 productStore.newItem( {"id" : typeValues[j], "name" : typeItems[j]});
		 }
		 if(existingProducts)
	     {
			 existingProducts.store = productStore;
	     }
		 
		// if the hidden values are set, the page is in modify mode:
			// set if it is the first time:
		if (m._config.isLoading)
		{
			if(existingProducts)
			{
				existingProducts.set("displayedValue", subTnxTypeHidden);
			}
			if(dj.byId('sub_tnx_type_code_hidden'))
			{
				dj.byId('sub_tnx_type_code_hidden').set("value", '');
			}	
			m._config.isLoading = false;
		}else if(!displaySubTnxType && subTnxTypeHidden !== '*')
		 {
			 dj.byId("sub_tnx_type_code").set("value", '*');
		 }else if(subTnxTypeHidden == ''){
			 dj.byId("sub_tnx_type_code").set("displayedValue", '');
		 }
		if(!displaySubTnxType)
		{
			m.toggleRequired("sub_tnx_type_code", false);
		    m.animate("wipeOut", subTnxDiv);
		}
	}
	
	// Client needs a custom version of this method.
	// We keep separate lists of product codes and sub product
	// but don't show them to the user, who has the impression
	// that sub products and products are the same thing.
	// on the storage and in the validation though the difference
	// still apply.
	function _changeSubProductList()
	{

		var productCode = dj.byId('product_code') ? dj.byId('product_code').get('value'): "", 
			existingSubProductSelectWidget = dj.byId('sub_product_code'), 
			productCodeKey = (productCode === '*') ? 'ALL' : productCode,
			subProductDataStore = (productCodeKey !=="") ? m._config.SubProductsCollection[productCodeKey]: "",
			subProductHidden = dj.byId('sub_product_code_hidden') ? dj.byId('sub_product_code_hidden').get('value'): "",
			accountField = dj.byId('account_no');

		//As limit amount is not applicable for Secure Emails (MPS-21301)
		if(productCode === 'SE')
			{
			m.animate("wipeOut", d.byId("limit_amount"));
			m.toggleRequired("lmt_amt", false);
			m.toggleRequired("lmt_cur_code", false);
			 dj.byId("lmt_amt").set("value", '');
			 dj.byId("lmt_cur_code").set("value", '');
			m.toggleRequired("min_lmt_amt", false);
			if(dj.byId("min_lmt_amt")) {
			 dj.byId("min_lmt_amt").set("value", '');
			}
			}
		else
			{
			m.animate("wipeIn", d.byId("limit_amount"));
			m.animate("wipeIn", d.byId("limit_min_amount"));
			m.toggleRequired("lmt_amt", true);
			m.toggleRequired("lmt_cur_code", true);
			}
		// Remove the existing product and sub product entries
		if(existingSubProductSelectWidget)
		{
			existingSubProductSelectWidget.set("displayedValue", "");
			existingSubProductSelectWidget.store = null;
		}

		if (subProductDataStore)
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : subProductDataStore
				}
			});
			existingSubProductSelectWidget.fetchProperties =
			{
				sort : [
				{
					attribute : "name"
				} ]
			};
		}
		
		// if the hidden values are set, the page is in modify mode:
		// set if it is the first time:
		if (m._config.isLoading)
		{
			existingSubProductSelectWidget.set("displayedValue", subProductHidden);
			m._config.isLoading = false;
		}
		else
		{
			// Empty the account field if business area changes
			if (accountField)
			{
				accountField.set("value", "");
			}
		}
	}
	
	function _changeTenorType()
	{
		var productCode = dj.byId('product_code') ? dj.byId('product_code').get('value') : "", 
			existingTenorTypetWidget = dj.byId('tenor_type_code'), 
			productCodeKey = (productCode === '*') ? 'ALL' : productCode,
			tenorTypeDataStore =(productCodeKey !== "")? m._config.tenorTypeProductList[productCodeKey]: "",
			tenorTypeHidden = dj.byId('tenor_type_code_hidden') ? dj.byId('tenor_type_code_hidden').get('value') : "";

		// Remove the existing Tenor Type
		if(existingTenorTypetWidget)
		{
			existingTenorTypetWidget.set("value", "");
		}
			
		if (tenorTypeDataStore)
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingTenorTypetWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : tenorTypeDataStore
				}
			});
			existingTenorTypetWidget.fetchProperties =
			{
				sort : [
				{
					attribute : "value"
				} ]
			};
			m.animate("wipeIn", d.byId("tenorDiv"));
			m.toggleRequired("tenor_type_code", true);
			if (m._config.isLoading)
			{
				existingTenorTypetWidget.set("displayedValue", tenorTypeHidden);
				m._config.isLoading = false;
			}
		}
		else
			{
				m.animate("wipeOut", d.byId("tenorDiv"));
				m.toggleRequired("tenor_type_code", false);
			}
	}
	
	function _changeProductTypeCode()
	{
		var productCode = dj.byId('product_code') ? dj.byId('product_code').get('value') : "", 
			existingProductTypetWidget = dj.byId('product_type_code'), 
			productCodeKey = (productCode === '*') ? 'ALL' : productCode,
			productTypeCodeStore = (productCodeKey !== "")?m._config.productTypeCodeList[productCodeKey]:"",
			productTypeCodeHidden = dj.byId('product_type_code_hidden') ? dj.byId('product_type_code_hidden').get('value') : "";

		// Remove the existing Tenor Type
		if(existingProductTypetWidget)
		{
			existingProductTypetWidget.set("value", "");
		}	
			
		if (productTypeCodeStore)
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingProductTypetWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : productTypeCodeStore
				}
			});
			existingProductTypetWidget.fetchProperties =
			{
				sort : [
				{
					attribute : "value"
				} ]
			};
			m.animate("wipeIn", d.byId("productTypeDiv"));
			m.toggleRequired("product_type_code", true);
			if (m._config.isLoading)
			{
				existingProductTypetWidget.set("displayedValue", productTypeCodeHidden);
				m._config.isLoading = false;
			}
		}
		else
			{
				m.animate("wipeOut", d.byId("productTypeDiv"));
				m.toggleRequired("product_type_code", false);
			}
	}
	
	function _resetEntity()
	{
		var entity = dj.byId("entity");
		if (entity && entity.get("type") === "hidden")
		{
			entity.set("value", "");
		}
	}
	
	function _validateMinLmtAmount()
	{
		if (dj.byId("min_lmt_amt").get("value") >= dj.byId("lmt_amt").get("value"))
			{
				misys.dialog.show("ERROR", misys.getLocalization("minAmountValidationMessage"), "", function(){
				 	dj.byId("min_lmt_amt").set("state","Error");
				});
				return false;
			}
		if (dj.byId("min_lmt_amt").get("value") < dj.byId("lmt_amt").get("value"))
			{
				dj.byId("min_lmt_amt").set("state","");
				return true;
			}
	}

	function _setLimitAmount()
	{
		// summary:
		// Limit amount needs to be set programmatically
		// because the database value has a comma in it
		if(dj.byId("lmt_amt"))
			{
		dj.byId("lmt_amt").set("displayedValue", m._config.lmt_amt);
		m.setCurrency(dijit.byId("iso_code"), [ "lmt_amt" ]);
	}
		
		
		if(dj.byId("min_lmt_amt"))
		{
			dj.byId("min_lmt_amt").set("displayedValue", m._config.min_lmt_amt);
			if(isNaN(dj.byId("min_lmt_amt").get("value")))
			{
				dj.byId("min_lmt_amt").set("value" , 0);
			}
			m.setCurrency(dijit.byId("iso_code"), [ "min_lmt_amt" ]);
		}
	}

	d.mixin(m._config, {
			
			initReAuthParams : function(){	
				
				var reAuthParams = { 	productCode : 'AM',
				         				subProductCode : '',
				        				transactionTypeCode : '01',
				        				entity : '',			        			
				        				currency : '',
				        				amount : '',
				        				
				        				es_field1 : '',
				        				es_field2 : ''
									  };
				return reAuthParams;
			}
	});
	
	//
	// Public functions & variables
	//
	d.mixin(m,
	{
		bind : function()
		{

			m.connect("product_code",  "onChange", _changeSubProductList);
			
			m.connect("product_code",  "onChange", _toggleAccType);
			
			m.connect("product_code",  "onChange", function()
			{
				if(dj.byId("product_code").get("value") !== '' && dj.byId("tnx_type_code").get("value") !== '')
				{
					_changeSubTnxTypeCodeList();
				}
			});
			
			m.connect("product_code",  "onChange", function()
					{
						if(dj.byId("product_type_code"))
						{
							_changeProductTypeCode();
						}
						else
						{
							m.animate("wipeOut", d.byId("productTypeDiv"));
						}
					});
			
			m.connect("product_code",  "onChange", function()
			       {
				      if(dj.byId("tenor_type_code") && dj.byId('tenor_type_code'))
				   {
				       _changeTenorType();
				   }
				   else
				   {
					   m.animate("wipeOut", d.byId("tenorDiv"));
				   }
			   });
			
			m.connect("tnx_type_code",  "onChange", function()
			{	
				if(dj.byId("product_code").get("value") !== '' && dj.byId("tnx_type_code").get("value") !== '')
				{
					_changeSubTnxTypeCodeList();
				}
			});
			
			m.connect("sub_product_code",  "onChange", _toggleAccType);
			
			if(dj.byId("isSwift2019Enabled") && dj.byId("isSwift2019Enabled").get("value"))
			{
				m.connect("sub_product_code",  "onChange", _toggleProductTypeAndTenor);
			}
			
			m.connect("sub_product_code",  "onChange", function()
			{
				var hiddenAcctNo = dj.byId('account_no_hidden'), isOnLoad = false;
				if (hiddenAcctNo && hiddenAcctNo.get("value") !== '')
				{
					isOnLoad = true;
					dj.byId('account_no_hidden').set('value','');
					
				}
				if(dj.byId('account_no') && !isOnLoad)
					{
					dj.byId('account_no').set('value','');
					}
				if(dj.byId('sub_product_code').get("value") == "MUPS" && dj.byId("lmt_cur_code").get("value") == "")
				{
					dj.byId("lmt_cur_code").set("value","INR");
				}				
			});
			
			
			m.setValidation("lmt_cur_code", m.validateCurrency);

			m.connect("lmt_cur_code", "onChange", function()
			{
				m.setCurrency(this, [ "lmt_amt" ]);
			});
			
			m.connect("lmt_cur_code", "onChange", function()
					{
						m.setCurrency(this, [ "min_lmt_amt" ]);
					});
			
			
			m.connect("min_lmt_amt",  "onChange", function()
					{
						if(dj.byId("lmt_amt").get("value") !== '' && dj.byId("min_lmt_amt").get("value") !== '')
						{
							_validateMinLmtAmount();
						}
					});
			
			m.connect("min_lmt_amt",  "onBlur", function()
					{
						if(dj.byId("lmt_amt").get("value") !== '' && dj.byId("min_lmt_amt").get("value") !== '')
						{
							_validateMinLmtAmount();
						}
						if(isNaN(dj.byId("min_lmt_amt").get("value")))
						{
							dj.byId("min_lmt_amt").set("value" , 0);
						}
						m.setCurrency(dijit.byId("iso_code"), [ "min_lmt_amt" ]);
					});
			
			m.connect("lmt_amt",  "onChange", function()
					{
						if(dj.byId("lmt_amt").get("value") !== '' && dj.byId("min_lmt_amt") && dj.byId("min_lmt_amt").get("value") !== '')
						{
							_validateMinLmtAmount();
						}
					});
			
			m.connect("lmt_amt",  "onBlur", function()
					{
						if(dj.byId("lmt_amt").get("value") !== '' && dj.byId("min_lmt_amt") && dj.byId("min_lmt_amt").get("value") !== '')
						{
							_validateMinLmtAmount();
						}
						if(isNaN(dj.byId("lmt_amt").get("value")))
						{
							dj.byId("lmt_amt").set("value" , "");
						}
						m.setCurrency(dijit.byId("iso_code"), [ "lmt_amt" ]);
					});
			
			m.connect("account_img", "onClick", function(){
				var companyId = dj.byId("company_id").get("value");
				var prod_sub_product = "";
				
				if(dj.byId('product_code') && dj.byId('sub_product_code') && dj.byId('product_code').get('value')!=='' && dj.byId('sub_product_code').get('value') !=='' )
					{
						prod_sub_product = dj.byId('product_code').get('value') + ":" + dj.byId('sub_product_code').get('value');
					}
				
				m.showSearchUserAccountsDialog("companyaccountwildcard", "['','','account_no', '', '','','']", 
						'', 'entity', '', prod_sub_product, 'width:750px;height:400px;', m.getLocalization("ListOfAccountsTitleMessage"),'', companyId);
			
			});
		},

		onFormLoad : function()
		{
			m.setCurrency(dj.byId("lmt_cur_code"), [ "lmt_amt" ]);
			m.setCurrency(dj.byId("lmt_cur_code"), [ "min_lmt_amt" ]);
			_setLimitAmount();
			
			
			
			if (m._config.company_type === "03")
			{
				var productCode = dj.byId("product_code").get("value");
				if(productCode ==="FT" || productCode === "SE" || productCode ==="BK" || productCode === "TD")
				{
					m.animate("wipeIn", d.byId("accDiv"));
					m.toggleRequired("account_no", true);
				}
				else
				{
					m.animate("wipeOut", d.byId("accDiv"));
					m.toggleRequired("account_no", false);
				}
			}
			
			
			
			if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") !== "")
			{
				m.animate("wipeOut", d.byId("subProductDiv"));
			}else
			{
				m.animate("wipeIn", d.byId("subProductDiv"));
			}
			

			if (dj.byId("product_code"))
			{
				_changeProductList("");
				_changeProductTypeCode();
				_changeTenorType();
			} else
			{
				m.animate("wipeOut", d.byId("productTypeDiv"));
			}

			m._config.isLoading = true;
			if (dj.byId("product_code_hidden") && dj.byId("product_code_hidden").get("value") !== "")
			{
				// this will trigger the _changeSubProductList method attached to
				// the product_code onChange event and update the subProduct as well
				dj.byId("product_code").set("displayedValue",dj.byId("product_code_hidden").get("value"));
				_changeSubProductList();
			}
			
			m._config.isLoading = true;
			if (dj.byId("tenor_type_code_hidden") && dj.byId("tenor_type_code_hidden").get("value") !== "")
			{
				_changeTenorType();
			}
			
			m._config.isLoading = true;
			if (dj.byId("product_type_code_hidden") && dj.byId("product_type_code_hidden").get("value") !== "")
			{
				_changeProductTypeCode();
			}
			m._config.isLoading = true;
			if (m._config.company_type === "03" && dj.byId("sub_tnx_type_code_hidden").get("value") !== "")
			{
				// this will trigger the _changeSubProductList method attached to
				// the product_code onChange event and update the subProduct as well
				dj.byId("sub_tnx_type_code").set("displayedValue",
						dj.byId("sub_tnx_type_code_hidden").get("value"));
			}
			if (m._config.company_type === "03" && dj.byId("sub_tnx_type_code_hidden").get("value") !== "")
			{
				// this will trigger the _changeSubProductList method attached to
				// the product_code onChange event and update the subProduct as well
				dj.byId("sub_tnx_type_code").set("displayedValue",
						dj.byId("sub_tnx_type_code_hidden").get("value"));
			}
			if (m._config.company_type === "03" && dj.byId("account_no_hidden").get("value") !== "")
			{
				dj.byId("account_no").set("displayedValue",
						dj.byId("account_no_hidden").get("value"));
			}
			_changeSubTnxTypeCodeList();
		},

		beforeSubmitValidations : function()
		{
			return _checkForAuthorisationLevel();
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.matrix_client');