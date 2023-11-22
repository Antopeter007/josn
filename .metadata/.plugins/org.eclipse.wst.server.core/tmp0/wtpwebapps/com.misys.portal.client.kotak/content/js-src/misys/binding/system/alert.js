dojo.provide("misys.binding.system.alert");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode 
	
	function _validateRecipient( /*String*/ alertType){
		// summary:
		//		TODO
		
		var issuerAbbvType1 = dj.byId("issuer_abbv_name" + alertType + "_1"),
			issuerAbbvType2 = dj.byId("issuer_abbv_name" + alertType + "_2"),
			issuerAbbvType3 = dj.byId("issuer_abbv_name" + alertType + "_3"),
			issuerAbbvType4 = dj.byId("issuer_abbv_name" + alertType + "_4"),
			issuerAbbvType5;
		if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'Y'){
			issuerAbbvType5 = dj.byId("issuer_abbv_name" + alertType + "_5");
		}
		
		if (!issuerAbbvType1) {
			return true;
		}
		if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'Y'){
		if (!issuerAbbvType1.get("checked") && !issuerAbbvType2.get("checked") && 
			!issuerAbbvType3.get("checked") && !issuerAbbvType4.get("checked") && issuerAbbvType5!=undefined &&!issuerAbbvType5.get("checked")) {
			m.showTooltip(m.getLocalization("recipientMandatory"),
					issuerAbbvType1.domNode, ["before"]);
			return false;
		}
		}else{
			if (!issuerAbbvType1.get("checked") && !issuerAbbvType2.get("checked") && 
					!issuerAbbvType3.get("checked") && !issuerAbbvType4.get("checked")) {
					m.showTooltip(m.getLocalization("recipientMandatory"),
							issuerAbbvType1.domNode, ["before"]);
					return false;
				}	
		}
		return true;
	}
	function _callAddEvents(){
		m.connect(dj.byId("prod_code01"),'onClick', function(){
			this.focus();
			console.log("focused on product code 01");
		});
		m.connect(dj.byId("sub_prod_code01"),'onClick', function(){
			this.focus();
			console.log("focused on sub products code 01");
		});
		m.connect(dj.byId("tnx_type_code01"),'onClick', function(){
			this.focus();
			console.log("focused on tnx type code 01");
		});
		m.connect(dj.byId("prod_stat_code01"),'onClick', function(){
			this.focus();
			console.log("focused prod stat code 01");
		});
		m.connect(dj.byId("tnx_amount_sign01"),'onClick', function(){
			this.focus();
			console.log("focused tnx amount sign 01");
		});
		m.connect(dj.byId("prod_code02"),'onClick', function(){
			this.focus();
			console.log("focused on product code 02");
		});
		m.connect(dj.byId("sub_prod_code02"),'onClick', function(){
			this.focus();
			console.log("focused on sub products code 02");
		});
		m.connect(dj.byId("tnx_type_code02"),'onClick', function(){
			this.focus();
			console.log("focused on tnx type code 02");
		});
		m.connect(dj.byId("prod_stat_code02"),'onClick', function(){
			this.focus();
			console.log("focused prod stat code 02");
		});
		m.connect(dj.byId("tnx_amount_sign02"),'onClick', function(){
			this.focus();
			console.log("focused tnx amount sign 02");
		});
	}
	
	function _populateStatusFieldsByProductType(productCode, alertType)
    {
             console.debug("[Submission Alerts] populate Product Status fields by product type start");
             var typeItems   = [],
             typeValues      = [],
             array  = [],
                 statusCodes =  "";
             if(dj.byId('prod_stat_code'+alertType))
             {
                     var jsonData = {"identifier" :"id", "items" : []},
                             statusStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
                     statusCodes = dj.byId('prod_stat_code'+alertType);
                     statusCodes.store = null;
                     if(misys._config && misys._config.productStatusesCollection && misys._config.productStatusesCollection[productCode])
                     {
                             array = misys._config.productStatusesCollection[productCode];
                     }
                     dojo.forEach(array, function(statusString, index){
                             var statusArr = statusString.split(';');
                               typeItems[index] = statusArr[0];
                               typeValues[index] = statusArr[1];
                     });
                     for(var j = 0; j < typeItems.length; j++)
                     {
                             statusStore.newItem( {"id" :  typeItems[j], "name" : typeValues[j]});
                     }
                     statusCodes.store = statusStore;
                     statusCodes.set("value","");
             }
             console.debug("[Submission Alerts] populate statuses by product type ends");
     }
	
	function _validateMultiEmail(emails) {
		 if(emails) {
			 d.forEach(emails.split(","), function(email){
					 if(!dojox.validate.isEmailAddress(email)){
						 	var displayMessage = m.getLocalization("invalidEmailAddressError"),
							//focus on the widget and set state to error and display a tooltip indicating the same
						 	widget = dijit.byId("address01");
						 	widget.focus();
						 	widget.set("state","Error");
							dijit.hideTooltip(widget.domNode);
							dijit.showTooltip(displayMessage, widget.domNode, 0);
						}		 
				  });
				 }
	}
	
	function _changeSubProductList(prodCode, subProdCode)
	{
			var productCode = dj.byId(prodCode).get('value'),
			existingSubProductSelectWidget = dj.byId(subProdCode), 
			productCodeKey = (productCode === '*') ? 'ALL' : productCode,
			subProductDataStore = m._config.subProductsCollection[productCodeKey];
			existingSubProductSelectWidget.set("value","");
		
		if(subProductDataStore && productCodeKey !== "*" && subProductDataStore.length === 1)
		{
			if(dj.byId(subProdCode))
			{
				m.animate("fadeOut",d.byId(subProdCode+"_row"));
				dj.byId(subProdCode).set("required",false);
			}
		}
		else
		{
			if(dj.byId(subProdCode))
			{
				m.animate("fadeIn",d.byId(subProdCode+"_row"));
				m.toggleRequired(subProdCode, true);
			}
		}		
				
		if (subProductDataStore) 
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : subProductDataStore
				}
			});
			existingSubProductSelectWidget.fetchProperties = {
				sort : [{attribute : "name" }]
			};
		}

		else
		{
			existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : [{value:'*',name:'*'}]
				}
			});
		}
	}
	
	function _fncProductTypeSelection(productCode,tnxValue){
		var typeItems 	= [],
			typeValues 	= [],
			emptyFlag 	= true,
			existingProducts = dijit.byId('tnx_type_code01');
			existingProducts.store = null;
		if(productCode === 'LC' || productCode === 'BG' || productCode === 'SI' || productCode === 'PO' || productCode === 'EC'){
			 typeItems = ['*', m.getLocalization("new"), m.getLocalization("amend"), m.getLocalization("message"), m.getLocalization("reporting")];
			 typeValues = ['*', '01', '03', '13', '15'];
		}else if(productCode === 'EL' || productCode === 'SG' || productCode === 'TF' || productCode === 'IC' || productCode === 'SR' || productCode === 'SE' || productCode === 'FA' || productCode === 'SO' || productCode === 'FT' ){
			 typeItems = ['*', m.getLocalization("new"), m.getLocalization("message"),m.getLocalization("reporting")];
			 typeValues = ['*', '01', '13', '15'];
		}else if(productCode === 'EL' || productCode === 'SG' || productCode === 'TF' || productCode === 'IC' || productCode === 'SR' || productCode === 'SE' || productCode === 'FA' || productCode === 'SO' ){
				 typeItems = ['*', m.getLocalization("financeRequest")];
				 typeValues = ['*', '63'];
		}else if(productCode === 'IN' || productCode === 'IP'){
			 typeItems = ['*', m.getLocalization("new"), m.getLocalization("message"),m.getLocalization("reporting"), m.getLocalization("financeRequest"), m.getLocalization("invoiceSettle")];
			 typeValues = ['*', '01', '13', '15', '63', '85'];
		}/*else if(productCode == 'DM'){
			 typeItems = ['*', 'New', 'Message', 'Reporting', 'Presentation'];
		}*/else if(productCode === 'IO'){
			 typeItems = ['*',  m.getLocalization("new"), m.getLocalization("baselineMatch"), m.getLocalization("baselineMismatch"), m.getLocalization("baselineResubmit"), m.getLocalization("close"), m.getLocalization("paymentRequest"), m.getLocalization("intentToPay"), m.getLocalization("amendRequest"), m.getLocalization("amend"), m.getLocalization("reporting")];
			 typeValues = ['*', '01', '64', '65', '31', '38', '55', '49', '32', '03', '15'];
		}else if(productCode === 'EA'){
			 typeItems = ['*',  m.getLocalization("initialBaseline"), m.getLocalization("baselineResubmit"), m.getLocalization("close"), m.getLocalization("baselineMatch"), m.getLocalization("baselineMismatch"), m.getLocalization("amend")];
			 typeValues = ['*', '30', '31', '38', '64', '65', '03'];
		}else if(productCode == 'LN'){
			 typeItems = ['*',  m.getLocalization("new"), m.getLocalization("payment"), m.getLocalization("amend"), m.getLocalization("reporting")];
			 typeValues = ['*', '01', '61', '03', '15'];
		}else if(productCode === 'FB'){
			 typeItems = ['*',  m.getLocalization("new"), m.getLocalization("amend"), m.getLocalization("reporting")];
			 typeValues = ['*', '01', '03', '15'];
		}
		else if(productCode === 'BK' || productCode === 'FT' ){
			 typeItems = ['*', m.getLocalization("new"), m.getLocalization("reporting")];
			 typeValues = ['*', '01', '15'];
		}

		else{
			 typeItems = ['*',  m.getLocalization("new"), m.getLocalization("message"), m.getLocalization("amend"), m.getLocalization("reporting")];
			 typeValues = ['*', '01', '13', '03', '15'];
		}
		 
		 var jsonData = {"identifier" :"id", "items" : []};
		 var productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
		 
		 for(var j = 0; j < typeItems.length; j++){
			 productStore.newItem( {"id" : typeValues[j], "name" : typeItems[j]});
		 }
		 existingProducts.store = productStore;
		 existingProducts.set("value","");
				 
	}
	
	function _handleCurrencyAmount(alertType){
		if(dj.byId('tnx_amount_sign'+alertType).get('value') !== '*')
		{
			dj.byId('tnx_currency'+alertType).set('required', true);
			dj.byId('tnx_amount'+alertType).set('required', true);
		}
		else
		{
			dj.byId('tnx_currency'+alertType).set('value', "");
			dj.byId('tnx_amount'+alertType).set('value', "");
			dj.byId('tnx_currency'+alertType).set('required', false);
			dj.byId('tnx_amount'+alertType).set('required', false);
		}
		m.connect('tnx_currency'+alertType, 'onBlur', function(){
			dj.byId('tnx_currency'+alertType).set('value', dj.byId('tnx_currency'+alertType).getValue().toUpperCase());
		});
		m.setValidation('tnx_currency'+alertType, m.validateCurrency);
		m.connect('tnx_currency'+alertType, 'onChange', function(){
			m.setCurrency(this, ['tnx_amount'+alertType]);
		});
		if (dj.byId('tnx_amount_sign'+alertType).get('value') !== '' && dj.byId('tnx_amount_sign'+alertType).get('value')!== "*"){
			m.animate("fadeIn", d.byId("amount-id-"+alertType));
		}
		else{
			m.animate("fadeOut", d.byId("amount-id-"+alertType));
		}
	}

	function _alertSubmit(dialogId,alertType){
		var dialog = dj.byId(dialogId);
		if(dialog && dialog.validate() && _validateRecipient(alertType)) {
			dialog.execute();
			dialog.hide();
			m.isFormDirty = true;
	}
	}
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			
			m.setValidation('address01',m.validateEmailAddr);
			m.setValidation('address02',m.validatePhoneOrFax);
			d.query("input[id^=\"prod_code\"]").forEach(function(node){
                m.connect(node.id, 'onChange', function(){
                        _populateStatusFieldsByProductType(dj.byId(node.id).get("value"), node.id.substring("prod_code".length));
                });
			});
			if(dojo.isIE){
				_callAddEvents();
			}
			m.connect('prod_code01', 'onChange', function() {			
				if (dijit.byId('prod_code01') && dijit.byId('prod_code01').get('value') !== '') {
					var prodCode = dijit.byId('prod_code01').get('value');	
					_fncProductTypeSelection(prodCode,dijit.byId('tnx_type_code01').get('value'));
					_changeSubProductList("prod_code01","sub_prod_code01");
					if(misys._config.alerts && (misys._config.alerts.tempSubProductCode || misys._config.alerts.tempTypeCode || misys._config.alerts.tempProdStatCode))
					{
						dijit.byId("sub_prod_code01").set("value",misys._config.alerts.tempSubProductCode);
						dijit.byId("tnx_type_code01").set("value",misys._config.alerts.tempTypeCode);
						dijit.byId("prod_stat_code01").set("value",misys._config.alerts.tempProdStatCode);
						misys._config.alerts.tempSubProductCode = "";
						misys._config.alerts.tempTypeCode = "";
						misys._config.alerts.tempProdStatCode = "";
					}
				}
			});
			
			m.connect('prod_code02', 'onChange', function() {
				if (dijit.byId('prod_code02')) {
					var prodCode = dijit.byId('prod_code02').get('value');
					_fncProductTypeSelection(prodCode, dijit.byId('tnx_type_code02').get('value'));
					_changeSubProductList("prod_code02","sub_prod_code02");
					if(misys._config.alerts && (misys._config.alerts.tempSubProductCode && misys._config.alerts.tempTypeCode && misys._config.alerts.tempProdStatCode))
					{
						dijit.byId("sub_prod_code02").set("value",misys._config.alerts.tempSubProductCode);
						dijit.byId("tnx_type_code02").set("value",misys._config.alerts.tempTypeCode);
						dijit.byId("prod_stat_code02").set("value",misys._config.alerts.tempProdStatCode);
						misys._config.alerts.tempSubProductCode = "";
						misys._config.alerts.tempTypeCode = "";
						misys._config.alerts.tempProdStatCode = "";
					}
				}
			});		
						
			dojo.query('.issuer_abbv_name .dijitCheckBoxInput').forEach(function(field){
				var fieldId = field.id;
				if(fieldId.indexOf("issuer_abbv_name01") !== -1)
				{
					console.debug(field.id);
					
					m.connect(field.id, "onClick", function(){
						
						var currentField = field.id;
						var currentOption = currentField.substring(19);
						
						switch(currentOption){
								case '4':
									m.toggleFields(this.get("checked"), ["alertlanguage01", "address01"],
											["alertlanguage01", "address01"]);
									m.animate("fadeIn", d.byId("language-address-id-01"));
									m.animate("fadeOut", d.byId("contact-person-id-01"));
									break;
								case '5':
									m.toggleFields(false, ["alertlanguage01", "address01"],
											["alertlanguage01", "address01"]);
									if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'Y'){
										if(dijit.byId('contact_person01') && dijit.byId('contact_address01')){
											if(this.checked)
											{
												
												if( dijit.byId('01entity') && dijit.byId('01entity').get('value') !== ''){
													dijit.byId('contact_person01').set('value',m._config.entityEmailCollection[dijit.byId('01entity').get('value')].alertContactPerson);
													dijit.byId('contact_address01').set('value',m._config.entityEmailCollection[dijit.byId('01entity').get('value')].alertEmail);
													if(dijit.byId('contact_address01').get('value')==="")
													 {
														m.animate("fadeOut", d.byId("language-address-id-01"));
														m.animate("fadeOut", d.byId("contact-person-id-01"));
														m.dialog.show("ERROR",m.getLocalization("emailIdEmpty"));
													 }
												}else if(dijit.byId('01entity')  && dijit.byId('01entity').get('value') === ''){
														dijit.byId('contact_person01').set('value','');
														dijit.byId('contact_address01').set('value','');
														if(dijit.byId('contact_address01').get('value')==="")
														 {
															m.animate("fadeOut", d.byId("language-address-id-01"));
															m.animate("fadeOut", d.byId("contact-person-id-01"));
															m.dialog.show("ERROR",m.getLocalization("emailIdEmpty"));
														 }
													}
													else{
														dijit.byId('contact_person01').set('value',m._config.entityEmailCollection['*'].alertContactPerson);
														dijit.byId('contact_address01').set('value',m._config.entityEmailCollection['*'].alertEmail);
														if(dijit.byId('contact_address01').get('value')==="")
														 {
															m.animate("fadeOut", d.byId("language-address-id-01"));
															m.animate("fadeOut", d.byId("contact-person-id-01"));
															m.dialog.show("ERROR",m.getLocalization("emailIdEmpty"));
														 }
													}
												}
											}
											else
											{
												dijit.byId('contact_person01').set('value','');
												dijit.byId('contact_address01').set('value','');
											}
										}
									
									m.animate("fadeOut", d.byId("language-address-id-01"));
									m.animate("fadeIn", d.byId("contact-person-id-01"));
									m.connect('alert01-dialog-template','onHide',function(){
										m.animate("fadeOut", d.byId("language-address-id-01"));
										m.animate("fadeIn", d.byId("contact-person-id-01"));
									});
									break;
								default:
							    	m.toggleFields(false, ["alertlanguage01", "address01"],
								    			["alertlanguage01", "address01"]);
									m.animate("fadeOut", d.byId("language-address-id-01"));
								    m.animate("fadeOut", d.byId("contact-person-id-01"));
								    break;
							}
					});
				}
			});
			m.connect("issuer_abbv_name02_4", "onChange", function(){
				m.toggleFields(this.get("checked"), ["alertlanguage02", "address02"], 
						["alertlanguage02", "address02"]);
				if (this.get("value") === "*"){
					m.animate("fadeIn", d.byId("language-address-id-02"));
				}
				else{
					m.animate("fadeOut", d.byId("language-address-id-02"));
				}
			});
			
			m.connect("01entity", "onChange", function(){
				if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'Y'){
				if(dijit.byId('01entity') &&  dijit.byId('01entity').get('value') !== ''){
					if(dijit.byId('issuer_abbv_name01_5') && dijit.byId('issuer_abbv_name01_5').get('checked')){
						
							dijit.byId('contact_person01').set('value',m._config.entityEmailCollection[dijit.byId('01entity').get('value')].alertContactPerson);
							dijit.byId('contact_address01').set('value',m._config.entityEmailCollection[dijit.byId('01entity').get('value')].alertEmail);
					
						m.animate("fadeOut", d.byId("language-address-id-01"));
						m.animate("fadeIn", d.byId("contact-person-id-01"));
						if(dijit.byId('contact_address01').get('value')===""){
							m.animate("fadeOut", d.byId("contact-person-id-01"));
							}
					}
				} 
				}
			});
			
			m.connect("tnx_amount_sign01", "onChange", function(){
				_handleCurrencyAmount('01');
			});
			m.connect("tnx_amount_sign02", "onChange", function(){
				_handleCurrencyAmount('02');
			});
			
			m.connect("tnx_amount_sign03", "onChange", function(){
				_handleCurrencyAmount('03');
			});
			
			m.connect("address01", "onBlur", function(){
				if(dijit.byId('address01') && dijit.byId('address01').get('value')!== ''){
					m.setValidation("address01", m.validateEmailAddr);
				}
			});
			
		},

		// Other public functions follow. These are bound to the alert widget
		// during their instantiation
		
		getProductLabel : function(rowIndex, item) {
			// summary:
			//		TODO
			if (!item)
			 {
				return "*";
			}
			if((m._config.productsCollection[item.prod_code]))
			{
				return m._config.productsCollection[item.prod_code];
			}
			return "*" ;
		},
		
		getSubProductLabel : function(rowIndex, item) {

			if (!item) {
				return "*";
				}
			var product = m._config.subProductsCollection[item.prod_code];
			
			// why 50? why not something like product.length!!!!!!
			for(var i =0;i<=50;i++)
			{
				if(product && product[i])
				{
					if(product[i].value instanceof Array)
					{
						if(product[i].value[0] === item.sub_prod_code[0])
						{
							return product[i].name[0];
						}
					}
					else
					{
						if(product[i].value === item.sub_prod_code[0])
						{
							return product[i].name;
						}
					}
				}
				else
				{
					return "*";
				}
			}
			return "*";
		},
		
		getAmountLabel : function(rowIndex, item) {
			if (!item) {
				return "*";
				}
			console.debug("[binding.alert] item.tnx_amount_sign", item.tnx_amount_sign);
			if (item.tnx_amount_sign[0] !== '01' && item.tnx_amount_sign[0] !== '02') {
				return "*";
			} else {
				var amountLabel;
				if(item.tnx_amount_sign[0] === '01'){
					amountLabel = "<";
				}else if(item.tnx_amount_sign[0] === '02'){
					amountLabel = ">";
				}
			}	
			var cldrMonetary = d.cldr.monetary.getData(item.tnx_currency);
			var formatedAmount = isNaN(item.tnx_amount)?item.tnx_amount:dojo.currency.format(item.tnx_amount, {round: cldrMonetary.round,places: cldrMonetary.places});
			return amountLabel + " " + item.tnx_currency + " " + formatedAmount;
		},
		
		getAddressLabel : function(rowIndex, item) {
			if (!item) {
				return "*";
				}
			// Important: do not replace with ":==" because it creates a bug !
			return item.issuer_abbv_name != '*' ? 
					m._config.recipientCollection[item.issuer_abbv_name] : item.address;
		}, 
		
		getTypeLabel : function(rowIndex, item) {
			if (!item) {
				return "*";
				}
			return m._config.typesCollection[item.tnx_type_code];
		},
		
		getProdStatCode : function(rowIndex, item) {
			if (!item) {
				return "*";
				}
			return m._config.productStatCodeCollection[item.prod_stat_code];
		}
	});
	
	m._config = m._config || {};
	d.mixin(m._config, {
			
			initReAuthParams : function(){	
				
				var reAuthParams = { 	productCode : 'SA',
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
	
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {
		submitAlert : function( /*String*/ dialogId,
								/*String*/ alertType) {
			if(dijit.byId('issuer_abbv_name01_5'))
			{
			if(dijit.byId('issuer_abbv_name01_5').get('checked') && dijit.byId('contact_address01').get('value')==="") {
			  	m.dialog.show("ERROR",m.getLocalization("emailIdEmpty"));
			 }
			else{
				_alertSubmit(dialogId,alertType);

				}
			}
			
			else {
				_alertSubmit(dialogId,alertType);
				}
			
		}
	});	
	
	function _sortCode(prodCode) {		
		var	existingProductSelectWidget = dj.byId(prodCode);
		existingProductSelectWidget.fetchProperties =
		{
			sort : [
			{
				attribute : "name"
			} ]
		};
	}
	
	d.ready(function() {
		// summary:
		//	There is a dependency between these imports and the functions above.
		//	TODO The above functions should probably be moved into a mixin that the below
		//		 classes import
		
		d.require("misys.admin.widget.Alerts");
		d.require("misys.admin.widget.Alert");
		d.require("misys.admin.widget.AlertEntity");
	});
	d.subscribe("ready", function(){
		if(dijit.byId('prod_code01'))
		{
			_sortCode('prod_code01');
		}
		if(dijit.byId('prod_code02'))
		{
			_sortCode('prod_code02');
		}
		if(dijit.byId('tnx_type_code01'))
		{
			_sortCode('tnx_type_code01');
		}
		if(dijit.byId('tnx_type_code02'))
		{
			_sortCode('tnx_type_code02');
		}
		if(dijit.byId('prod_stat_code01'))
		{
			_sortCode('prod_stat_code01');
		}
		if(dijit.byId('prod_stat_code02'))
		{
			_sortCode('prod_stat_code02');
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.alert_client');