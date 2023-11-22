dojo.provide("misys.binding.bank.report_td");

/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Term Design (TD) Form, Bank Side.
  
 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      06/10/11
  
 -----------------------------------------------------------------------------
 */
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.validation.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	function _fncTenorForSelectedDeposit(depositType){
		var typeItems 	= [],
	        typeValues 	= [],
		    tenorTypes = dj.byId('tenor_term_code');
		if(tenorTypes && depositType && depositType!=='*')
		{
			tenorTypes.store = null;
			var array = misys._config.depositTypes[depositType].tenor;
			dojo.forEach(array,function(tenorType,index){
				  typeItems[index] = misys._config.depositTypes[depositType].tenor[tenorType].key;
				  typeValues[index] = misys._config.depositTypes[depositType].tenor[tenorType].value;
			  });
			
			 jsonData = {"identifier" :"id", "items" : []};
			 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			 
			 for(var j = 0; j < typeItems.length; j++){
				 productStore.newItem( {"id" :  typeItems[j], "name" : typeValues[j]});
			 }
			 tenorTypes.store = productStore;
			 //Remove previously entered text if any
			 tenorTypes.set("value","");
		}
	}
	
	function _fncValidCurrencies(depositType, tenorType){
		var typeItems 	= [],
	        typeValues 	= [],
	        array  = [],
		    curTypes =  "";
		if(dj.byId('td_cur_code') && depositType && depositType!=='*'){
			curTypes = dj.byId('td_cur_code');
			curTypes.store = null;
			array = misys._config.depositTypes[depositType].tenor[tenorType].currency;
			array.sort();
			dojo.forEach(array,function(currency, index){
				  typeItems[index] = currency;
				  typeValues[index] = currency;
			  });
			
			 jsonData = {"identifier" :"id", "items" : []};
			 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			 
			 for(var j = 0; j < typeItems.length; j++){
				 productStore.newItem( {"id" :  typeItems[j], "name" : typeValues[j]});
			 }
			 curTypes.store = productStore;
			 //Remove previously entered text if any
			 curTypes.set("value","");
			}
	}
	
	function _fncMaturityInstForSelectedDeposit(depositType){
		  var typeItems 	= [],
		      typeValues 	= [],
			  maturityTypes = dj.byId('maturity_instruction');
		  maturityTypes.store = null;
		  if(maturityTypes && depositType && depositType!=='*')
		  {
			  var maturityCodes = misys._config.maturityCodes[depositType];
			  var maturityDesc = misys._config.maturityCodesDescription[depositType];
			  for(var i =0; i< maturityCodes.length ; i++){
				  typeItems[i] = maturityCodes[i];
			  }
			  for(var k =0; k< maturityDesc.length ; k++){
				  typeValues[k] = maturityDesc[k];
			  }
			 jsonData = {"identifier" :"id", "label" : "name","items" : []};
			 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			 
			 for(var j = 0; j < typeItems.length; j++){
				 productStore.newItem( {"id" : typeItems[j], "name" :typeValues[j]});
			 }
			 maturityTypes.store = productStore;
			 maturityTypes.set("value","");
		  }
		
	}
	
	d.mixin(m, {
	
	  bind : function() {
		  
		  m.connect('td_cur_code', 'onChange', function(){
				m.setCurrency(this, ['td_amt']);
			  });
		  m.connect('td_amt', 'onBlur', function(){
			m.setTnxAmt(this.get('value'));
		  }); 
		  
			// Making Bank Reference Non mandatory in case of Not Processed
			m.connect("prod_stat_code","onChange",function(){
				if(dj.byId("bo_ref_id")){
					var prodStatCodeValue = dj.byId("prod_stat_code").get('value');
					if(prodStatCodeValue === '01')
						{
							dj.byId("bo_ref_id").set("readOnly", true);
							dj.byId("bo_ref_id").set("disabled", true);
							m.toggleRequired(dj.byId("bo_ref_id"), false);
						}
					else 
						{
							dj.byId("bo_ref_id").set("readOnly", false);
							dj.byId("bo_ref_id").set("disabled", false);
							m.toggleRequired(dj.byId("bo_ref_id"), true);
						}
				}
			});
		  
		  if(dj.byId('td_type')){
		  m.connect('td_type', 'onChange', function() {
				if (dijit.byId('td_type') && dijit.byId('td_type').get('value') !== '') {
					var depositType = dijit.byId('td_type').get('value');
					if(dj.byId("selected_tenor_type") && dj.byId("selected_tenor_type").get("value")) 
					{
						_fncTenorForSelectedDeposit(depositType);
					}
					_fncMaturityInstForSelectedDeposit(depositType);
				}
			});
		  }
		  if(dj.byId('tenor_term_code')){
				 m.connect('tenor_term_code', 'onChange', function() {
						if (dj.byId('td_type') && dj.byId('td_type').get('value')!== '' && dj.byId('tenor_term_code') && dj.byId('tenor_term_code').get('value') !== '') {
							_fncValidCurrencies(dj.byId('td_type').get('value'), dijit.byId('tenor_term_code'));
						}
					});
		   }
		  if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				var maxNbrContracts =0;
				if(dj.byId('fx_nbr_contracts') && dj.byId('fx_nbr_contracts').get('value') > 0){
					maxNbrContracts = dj.byId('fx_nbr_contracts').get('value');
				}
				m.bindTheFXTypes(maxNbrContracts, 'Y');
		  }
	  },

	  onFormLoad : function() {
		  
		  var typeItems 	= [],
		      typeValues 	= [],
		      emptyFlag 	= true,
			  depositTypes = dj.byId('td_type'),
			  tempDepositType = "",
			  setter = "",
			  timeoutInMs = -1,
			  tempMaturityType = "";
		  
		  if(depositTypes)
		  {
			  depositTypes.store = null;
			  
			  dojo.forEach(misys._config.depositTypes,function(depositType, index){
				  var depType = depositType.split(',');
				  typeItems[index] = depType[0];
				  typeValues[index] = depType[1];
			  });
			  if(depositTypes){
				 jsonData = {"identifier" :"id", "label" : "name","items" : []};
				 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
				 
				 for(var j = 0; j < typeItems.length; j++){
					 productStore.newItem( {"id" : typeItems[j], "name" :typeValues[j]});
				 }
				 depositTypes.store = productStore;
				 if(dj.byId('selected_td_type') && !('S' + dj.byId('selected_td_type').get('value') === 'S')){
					 tempDepositType = dj.byId('selected_td_type').get('value');
					 dj.byId('td_type').set('value', tempDepositType);
					 
					 if((dj.byId('selected_tenor_type') && !('S' + dj.byId('selected_tenor_type').get('value') === 'S'))){
						 tempTenorType = dj.byId('selected_tenor_type').get('value');
						 _fncTenorForSelectedDeposit(tempDepositType);
						  setter = function() {
							  dj.byId('tenor_term_code').set('value', tempTenorType);
						  };
						  timeoutInMs = 1000;
						  setTimeout(setter, timeoutInMs);
					 }
					 if((dj.byId('selected_td_cur') && !('S' + dj.byId('selected_td_cur').get('value') === 'S'))){
						 tempCurType = dj.byId('selected_td_cur').get('value');
						 tempDepositType = dj.byId('selected_td_type').get('value');
						 tempTenorType = dj.byId('selected_tenor_type').get('value');
						 _fncValidCurrencies(tempDepositType, tempTenorType);
						  setter = function() {
							  dj.byId('td_cur_code').set('value', tempCurType);
						  };
						  timeoutInMs = 1500;
						  setTimeout(setter, timeoutInMs);
					 }
					 if((dj.byId('selected_maturity_type') && !('S' + dj.byId('selected_maturity_type').get('value') === 'S'))){
						 tempMaturityType = dj.byId('selected_maturity_type').get('value');
						 if(dj.byId('maturity_instruction')){
						     _fncMaturityInstForSelectedDeposit(tempDepositType);
						     setter = function() {
						    	 dj.byId('maturity_instruction').set('value', tempMaturityType);
							 };
							 timeoutInMs = 1000;
							 setTimeout(setter, timeoutInMs);
						}
					 }
				 }
				 else{
					 depositTypes.set("displayedValue","");
				 }
				 if(d.byId('placement-div'))
				 {
				  
				   if(dj.byId('placement_account_enabled')&& dj.byId('placement_account_enabled').get('value') == 'Y')
					   {
					   d.style("placement-div","display","block");
					   }
				   else
					   {
					   d.style("placement-div","display","none");
					   
					   }
				 
				 }
				 if(d.byId('interest-rate'))
				 {
				  
				   if(dj.byId('service_enabled')&& dj.byId('service_enabled').get('value') == 'Y')
					   {
					   d.style("interest-rate","display","block");
					   }
				   else
					   {
					   d.style("interest-rate","display","none");
					   
					   }
				 
				 }
			  }
		  }else
		  {
			  if((dj.byId('selected_td_cur') && !('S' + dj.byId('selected_td_cur').get('value') === 'S')))
			  {
					 dj.byId('td_cur_code').set('displayedValue', dj.byId('selected_td_cur').get('value'));
					 dj.byId('td_amt').set('readOnly', true);
			  }
		  }
		  m.setCurrency(dj.byId('td_cur_code'), ['td_amt']);
		  if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				m.onloadFXActions();
		  }
		  //Make bo_ref_id not mandatory in case of Not Processed
			if(dj.byId("prod_stat_code") && dj.byId("bo_ref_id")){
				
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value');
				if(prodStatCodeValue === '01')
					{
						dj.byId("bo_ref_id").set("readOnly", true);
						dj.byId("bo_ref_id").set("disabled", true);
						m.toggleRequired(dj.byId("bo_ref_id"), false);
					}
			}
		
	  }
	});
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		/**
		 * <h4>Summary:</h4>  This method transforms the xml.
		 * <h4>Description</h4> : This method overrides the xmlTransform method to add maturity instructions items 
		 * and tenor details in the xml.
		 * Allow to modify the xml only in case of Term Deposit transaction
		 * Else pass the input xml, without modification. (Example : for adding phrase from pop up.) 
		 *
		 * @param {String} xml
		 * XML String to transform.
		 * @method xmlTransform
		 */
		xmlTransform : function(/*String*/ xml) {
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
				tdXMLStart = "<tnx_td_record>",
				tdXMLEnd   = "</tnx_td_record>",
				maturityInstructionType = "",
				subTDXML	= "",
				selectedIndex = -1,
				maturityCodes = [], 
				maturityDesc  = [], 
				depositType   = "", 
				selectedValue = "",
				selectedTenor = "",
				tenorNumber   = -1,
				tenorCode     = "",
				selectedTenorArray = [];
					
				if(xml.indexOf(tdXMLStart) != -1)
				{
					subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
					transformedXml.push(subTDXML);
	
					if(dj.byId("maturity_instruction") && dj.byId("maturity_instruction").get('value') !== '' && (dj.byId('td_type') && !('S' + dj.byId('td_type').get('value') === 'S'))){
						maturityInstructionType = dj.byId("maturity_instruction").get("value");
						 depositType = dijit.byId('td_type').get('value');
						 maturityCodes = misys._config.maturityCodes[depositType];
						 maturityDesc = misys._config.maturityCodesDescription[depositType];
						 for(var i =0; i< maturityCodes.length ; i++)
						 {
							  if(maturityInstructionType === maturityCodes[i])
							  {
								  selectedIndex = i; 
								  break;
							  }
						 }
						  transformedXml.push("<maturity_instruction_code>",maturityInstructionType,"</maturity_instruction_code>");
						  selectedValue = maturityDesc[selectedIndex];
						  transformedXml.push("<maturity_instruction_name>",selectedValue,"</maturity_instruction_name>");
					}
					if(dj.byId('tenor_term_code') && dj.byId('tenor_term_code').get('value') !== '' && !('S' + dj.byId('td_type').get('value') === 'S')){
						selectedTenor = dj.byId('tenor_term_code').get('value');
						selectedTenorArray = selectedTenor.split('_');
						tenorNumber = selectedTenorArray[0];
						tenorCode = selectedTenorArray[1];
						transformedXml.push("<value_date_term_number>",tenorNumber,"</value_date_term_number>");
						selectedValue = maturityDesc[selectedIndex];
						transformedXml.push("<value_date_term_code>",tenorCode,"</value_date_term_code>");
					}
					if(xmlRoot) {
						transformedXml.push("</", xmlRoot, ">");
					}
					return transformedXml.join("");
				}
				else
				{
					return xml;
				}
		}
	});
	
})(dojo, dijit, misys);	  
//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_td_client');