dojo.provide("misys.binding.system.alert_calendar");

dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileWriteStore");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'CA',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :'',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	function _validateRecipient( /*String*/ alertType){
		// summary:
		//		TODO
		
		var issuerAbbvType1 = dj.byId("issuer_abbv_name" + alertType + "_1"),
			issuerAbbvType2 = dj.byId("issuer_abbv_name" + alertType + "_2"),
			issuerAbbvType3 = dj.byId("issuer_abbv_name" + alertType + "_3"),
			issuerAbbvType4 = dj.byId("issuer_abbv_name" + alertType + "_4");
		
		if (!issuerAbbvType1) {
			return true;
		}
		
		if (!issuerAbbvType1.get("checked") && !issuerAbbvType2.get("checked") && 
			!issuerAbbvType3.get("checked") && !issuerAbbvType4.get("checked")) {
			m.showTooltip(m.getLocalization("recipientMandatory"),
					issuerAbbvType1.domNode, ["before"]);
			return false;
		}
		
		return true;
	}
	
	function _validateOffset(){
		// summary:
		//		TODO
		if(dj.byId("offset01"))
		{
			var offset = dj.byId("offset01");
			if(!isNaN(dj.byId("offset01").get("value")))
			{
				if(!(dj.byId("offsetsign01_0").get("checked") || dj.byId("offsetsign01_1").get("checked")))
				{
					m.showTooltip(m.getLocalization("offsetMandatory"),
							dj.byId("offsetsign01_0").domNode, ["before"]);
					return false;
				}
			}
		}
		return true;
	}
	
    // Populate alert type based on product code
	function _populateDateFieldsByProductType(productCode, alertType)
	{	
		console.debug("[Calendar Alerts] populate date fields by product type start");	
		var typeItems 	= [],
        	typeValues 	= [],
        	array  = [],
		    dateCodes =  "";
		if(dj.byId('date_code'+alertType))
		{
			var jsonData = {"identifier" :"id", "items" : []},
				datesStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			dateCodes = dj.byId('date_code'+alertType);
			dateCodes.store = null;
			if(misys._config && misys._config.productDates && misys._config.productDates[productCode])
			{
				array = misys._config.productDates[productCode];
			}
			dojo.forEach(array, function(dateString, index){
				var dateArr = dateString.split(';');
				  typeItems[index] = dateArr[0];
				  typeValues[index] = dateArr[1];
			});
			for(var j = 0; j < typeItems.length; j++)
			{
				 datesStore.newItem( {"id" :  typeItems[j], "name" : typeValues[j]});
			}
			dateCodes.store = datesStore;
			if(misys._config.currentSelectedCalendarAlertItem && misys._config.currentSelectedCalendarAlertItem !== null)
			{
				dateCodes.set("value", misys._config.currentSelectedCalendarAlertItem.date_code);
				misys._config.currentSelectedCalendarAlertItem = null;
			}
			else
			{
				dateCodes.set("value",null);
			}
		}
		console.debug("[Calendar Alerts] populate date fields by product type ends");
	}

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation('address01',m.validateEmailAddr);
			m.setValidation('address02',m.validatePhoneOrFax);
			m.connect("issuer_abbv_name01_4", "onChange", function(){
				m.toggleFields(this.get("checked"), ["alertlanguage01", "address01"],
									["alertlanguage01", "address01"]);
				if (this.get("value")== "*"){
					m.animate("fadeIn", d.byId("language-address-id-01"));
				}
				else{
					m.animate("fadeOut", d.byId("language-address-id-01"));
				}
			});
			m.connect("issuer_abbv_name02_4", "onChange", function(){
				m.toggleFields((this.get("value") === "*"), ["alertlanguage02", "address02"],
									["alertlanguage02", "address02"]);
				if (this.get("value")== "*"){
					m.animate("fadeIn", d.byId("language-address-id-02"));
				}
				else{
					m.animate("fadeOut", d.byId("language-address-id-02"));
				}
			});
			m.connect("offsetsign01_0", "onClick", function(){
				
				var offset = dj.byId("offset01");
				if(dj.byId("offsetsign01_0").get("checked"))
					{
						offset.attr('required', true);
					}
			});
			m.connect("offsetsign01_1", "onClick", function(){
				
				var offset = dj.byId("offset01");
				if(dj.byId("offsetsign01_1").get("checked"))
					{
						offset.attr('required', true);
					}
			});
			d.query("input[id^=\"prod_code\"]").forEach(function(node){	
		  		m.connect(node.id, 'onChange', function(){
		  			_populateDateFieldsByProductType(dj.byId(node.id).get("value"), node.id.substring("prod_code".length));
				});
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
			
		getAddressLabel : function(rowIndex, item) {
			if (!item)
			{
				return "*";
			}
			// Important: do not replace with ":==" because it creates a bug !
			return item.issuer_abbv_name != '*' ? 
					m._config.recipientCollection[item.issuer_abbv_name] : item.address;
		}, 
		
		
		
		getDateLabel : function(rowIndex, item) {									
			if (!item) 
			{
				return "*";
			}
			var sign = item.offsetsign;							
			sign = item.offsetsign == "0" ? "-" : "+";			
			return m._config.datesCollection[item.date_code] + " (" + sign + item.offset + ")";
		}
	});
	
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {
		submitCalendarAlert : function( /*String*/ dialogId,
										/*String*/ alertType) {
			var dialog = dj.byId(dialogId);
			if(!(dj.byId("offsetsign01_0").get("checked") || dj.byId("offsetsign01_1").get("checked")))
				{
				dj.byId("offset01").attr('required', false);
				}
			if(dialog && dialog.validate() && _validateOffset() && _validateRecipient(alertType)) {
				dialog.execute();
				dialog.hide();
				m.isFormDirty = true;
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
		
		d.require("misys.admin.widget.AlertsCalendar");
		d.require("misys.admin.widget.AlertCalendar");
		d.require("misys.admin.widget.AlertCalendarEntity");
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
		if(dijit.byId('date_code01'))
		{
			_sortCode('date_code01');
		}
		if(dijit.byId('date_code02'))
		{
			_sortCode('date_code02');
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.alert_calendar_client');