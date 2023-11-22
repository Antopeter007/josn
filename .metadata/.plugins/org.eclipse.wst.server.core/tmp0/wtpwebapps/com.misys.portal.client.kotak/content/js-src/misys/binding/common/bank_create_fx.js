dojo.provide("misys.binding.common.bank_create_fx");


(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	var _boardRatesDiv = d.byId('fx-board-rate-type'),
		_fxContractsDiv = d.byId('fx-contracts-type');
	
	function _clearBoardRateFields(){
		if(dj.byId('fx_exchange_rate'))
		{
			dj.byId('fx_exchange_rate').set("value",'');
		}
		if(dj.byId('fx_exchange_rate_amt'))
		{
			dj.byId('fx_exchange_rate_amt').set("value",'');
		}
		if(dj.byId('fx_exchange_rate_cur_code'))
		{
			dj.byId('fx_exchange_rate_cur_code').set("value",'');
		}
		if(dj.byId('fx_tolerance_rate'))
		{
			dj.byId('fx_tolerance_rate').set("value",'');
		}
		if(dj.byId('fx_tolerance_rate_amt'))
		{
			dj.byId('fx_tolerance_rate_amt').set("value",'');
		}
		if(dj.byId('fx_tolerance_rate_cur_code'))
		{
			dj.byId('fx_tolerance_rate_cur_code').set("value",'');
		}
	}
	
	function _clearContractRateFields(maxNbrContracts, amtUtiliseInd){
		if(maxNbrContracts > 0){
		for(var i = 1; i<=maxNbrContracts; i++){
			if (dj.byId("fx_contract_nbr_"+ i)) {
				dj.byId('fx_contract_nbr_'+i).set("value",'');
			}
		}
		}
		if(amtUtiliseInd === 'Y'){
			for(var j = 1; j<=maxNbrContracts; j++){
				if(dj.byId('fx_contract_nbr_amt_'+j) && dj.byId('fx_contract_nbr_cur_code_'+j))
				{
					dj.byId('fx_contract_nbr_amt_'+j).set("value",'');
					dj.byId('fx_contract_nbr_cur_code_'+j).set("value",'');
				}
			}
			if(maxNbrContracts !== '1'){
				if(dj.byId('fx_total_utilise_cur_code') && dj.byId('fx_total_utilise_amt'))
				{
					dj.byId('fx_total_utilise_cur_code').set("value",'');
					dj.byId('fx_total_utilise_amt').set("value",'');
				}
			}
		}
	}
	
	function _onClickBindingType(maxNbrContracts, amtUtiliseInd){
		if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked')){
			_clearContractRateFields(maxNbrContracts, amtUtiliseInd);
			m.animate('fadeOut', _fxContractsDiv);
			m.animate('fadeIn', _boardRatesDiv);
			m.animate('fadeOut', d.byId('contractMsgDiv'));
			m.animate('fadeOut', d.byId('totalUtiliseDiv'));
			//m.disconnect(dj.byId('fx_rates_type_2'));
			m.setValidation('fx_exchange_rate_cur_code', m.validateCurrency);
			m.setValidation('fx_tolerance_rate_cur_code', m.validateCurrency);
			m.setCurrency(dj.byId('fx_exchange_rate_cur_code'), ['fx_exchange_rate_amt']);
			m.setCurrency(dj.byId('fx_tolerance_rate_cur_code'), ['fx_tolerance_rate_amt']);
			// make  contract number non mandatory
			if(dj.byId("fx_contract_nbr_1"))
		    {
				m.toggleRequired("fx_contract_nbr_1", false);
		    }
			if(dj.byId("fx_contract_nbr_amt_1"))
		    {
				m.toggleRequired("fx_contract_nbr_amt_1", false);
		    }
		}
		if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked')){
			_clearBoardRateFields();
			m.animate('fadeOut', _boardRatesDiv);
			m.animate('fadeIn', _fxContractsDiv);
			m.animate('fadeIn', d.byId('contractMsgDiv'));
			m.animate('fadeIn', d.byId('totalUtiliseDiv'));
			if(maxNbrContracts !== '1'){
			m.registerAndcalculateTotalUtiliseAmt(maxNbrContracts);
			}
			for(var i = 1; i<=maxNbrContracts; i++){
				m.setValidation(('fx_contract_nbr_cur_code_'+ i), m.validateCurrency);
				m.setCurrency(dj.byId(('fx_contract_nbr_cur_code_'+i)), ['fx_contract_nbr_amt']);
			}
			// make  contract number non mandatory
			if(dj.byId("fx_contract_nbr_1"))
		    {
				m.toggleRequired("fx_contract_nbr_1", true);
		    }
			if(dj.byId("fx_contract_nbr_amt_1"))
		    {
				m.toggleRequired("fx_contract_nbr_amt_1", true);
		    }
		}
	}
	
	d.mixin(m, {
		
		calculateTotalUtiliseAmt : function(maxNbrContracts){
			var  totalAmount =0;
			for(var i = 1; i<=maxNbrContracts; i++){
				if (dj.byId("fx_contract_nbr_amt_"+ i)) {	
				var currentContAmt;
				if(!isNaN(dj.byId("fx_contract_nbr_amt_"+i).get("value"))){
					
					currentContAmt = dj.byId("fx_contract_nbr_amt_"+i).get("value");
					}else{
					currentContAmt = '0';
					}
				totalAmount = parseInt(totalAmount,10) + parseInt(currentContAmt,10);
				if(totalAmount == '0'){
					dj.byId("fx_total_utilise_amt").set("value",'');	
				}else{
					dj.byId("fx_total_utilise_amt").set("value",totalAmount);
				}
				m.setCurrency(dj.byId('fx_total_utilise_cur_code'), ['fx_total_utilise_amt']);
			}
		  }
		},
		
		registerAndcalculateTotalUtiliseAmt : function(maxNbrContracts){
			for(var i = 1; i<=maxNbrContracts; i++){
				if (dj.byId("fx_contract_nbr_amt_"+ i)) {
					m.connect(('fx_contract_nbr_amt_'+ i), 'onBlur', function(){
						m.setTnxAmt(this.get('value'));
						m.calculateTotalUtiliseAmt(maxNbrContracts);
				    });
				}
			}
		},
		
		bindTheFXTypes : function(maxNbrContracts, amtUtiliseInd){
			m.connect('fx_rates_type_1', 'onClick', function(){
				   _onClickBindingType(maxNbrContracts, amtUtiliseInd);
			});
			m.connect('fx_rates_type_2', 'onClick', function(){
				   _onClickBindingType(maxNbrContracts, amtUtiliseInd);
			});
		},
		
		setMasterCurrency : function(maxNbrContracts, masterCurrency){
			for(var i=1;i<=maxNbrContracts;i++){
				if(dj.byId('fx_contract_nbr_cur_code_'+i) && masterCurrency !== '' ){
					dj.byId('fx_contract_nbr_cur_code_'+i).set('value', masterCurrency);
				}
			}
			if(dj.byId('fx_total_utilise_cur_code') && masterCurrency !== ''){
				dj.byId('fx_total_utilise_cur_code').set('value', masterCurrency);
			}
			for(var j=1;j<=maxNbrContracts;j++){
				m.setCurrency(dj.byId("fx_contract_nbr_cur_code_"+j), ["fx_contract_nbr_amt_"+j]);
			}
		},
		
		defaultBindTheFXTypes : function(maxNbrContracts, amtUtiliseInd){
			if(dj.byId('fx_rates_type_1')){
				m.animate('fadeOut', _fxContractsDiv);
				m.animate('fadeIn', _boardRatesDiv);
				m.animate('fadeOut', d.byId('contractMsgDiv'));
				m.animate('fadeOut', d.byId('totalUtiliseDiv'));
			}
			_clearContractRateFields(maxNbrContracts,amtUtiliseInd);
			dj.byId('fx_rates_type_1').set('checked',true);
			_clearBoardRateFields();
		},
		
		onloadFXActions : function(){
			var maxNbrContracts = '1';
			var amtUtiliseInd = 'Y';
			if(dj.byId('fx_nbr_contracts')){
				maxNbrContracts = dj.byId('fx_nbr_contracts').get('value'); 
			}
			
			if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				m.bindTheFXTypes(maxNbrContracts, amtUtiliseInd);
				   if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked')){
					   dj.byId('fx_rates_type_1').set('checked', true);
					   _onClickBindingType(maxNbrContracts, amtUtiliseInd);
				   }else if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked')){
					   dj.byId('fx_rates_type_2').set('checked', true);
					   _onClickBindingType(maxNbrContracts, amtUtiliseInd);
					    if(dj.byId('fx_master_currency') && dj.byId('fx_master_currency').get('value') !== ''){
					    	m.setMasterCurrency(maxNbrContracts, dj.byId('fx_master_currency').get('value'));
					    }
						if(dj.byId('fx_nbr_contracts') && dj.byId('fx_nbr_contracts').get('value') > '1'){
							m.calculateTotalUtiliseAmt(dj.byId('fx_nbr_contracts').get('value'));
							m.setCurrency(dj.byId('fx_total_utilise_cur_code'), ['fx_total_utilise_amt']);
						}
						// make one contract number mandatory
						if(dj.byId("fx_contract_nbr_1"))
					    {
							m.toggleRequired("fx_contract_nbr_1", true);
					    }
						if(dj.byId("fx_contract_nbr_amt_1"))
					    {
							m.toggleRequired("fx_contract_nbr_amt_1", true);
					    }
				   }
			   }else{
				   defaultBindTheFXTypes(maxNbrContracts, amtUtiliseInd);
			   }
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.bank_create_fx_client');