dojo.provide("misys.binding.trade.message_tf");
 
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");
dojo.require("dijit.Dialog");
dojo.require("misys.form.PercentNumberTextBox");
 
 
 
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
        
        var messageTypeDiv = d.byId('div-messageType');
        var messageTypeMsg;
        var settlementMsg               = m.getLocalization('settlementFreeFormatMessage');
        var correspondenceMsg   = m.getLocalization('correspondenceFreeFormatMessage');
        var fxMsgType = d.byId('fx-message-type');
 
        var reqMsgType = d.byId('request-message-type');
//      var sourceFundType = d.byId('source-of-fund-type');
		var fxSectionName= "fx-section";
 
        function _defaultsForCorrespondence() {
                if (dj.byId('repayment_cur_code')) {
                        dj.byId('repayment_cur_code').reset();
                }
                if (dj.byId('repayment_amt')) {
                        dj.byId('repayment_amt').reset();
                }
                if (dj.byId('settlement_code')) {
                        dj.byId('settlement_code').reset();
                }
                if (dj.byId('principal_act_name')) {
                        dj.byId('principal_act_name').reset();
                }
                if (dj.byId('repayment_mode_1') && dj.byId('repayment_mode_2')) {
                        dj.byId('repayment_mode_1').set('checked', true);
                        dj.byId('repayment_mode_2').set('checked', false);
                }
        }
        
 
        function _repaymentErrorDisplay(repayErrorMessage) {
                var domNode = dj.byId('repayment_amt').domNode;
                dj.showTooltip(m.getLocalization(repayErrorMessage), domNode, 0);
                var hideTT = function() {
                        dj.hideTooltip(domNode);
                };
                var timeoutInMs = 2000;
                setTimeout(hideTT, timeoutInMs);
                dj.byId("repayment_amt").set("state", "Error");
        }
        
 
        function _clearRequiredFields(message) {
                var callback = function() {
                        var widget = dijit.byId("repayment_amt");
                        widget.set("state", "Error");
                        m.defaultBindTheFXTypes();
                        dj.byId('repayment_amt').set('value', '');
                        // dj.byId('repayment_cur_code').set('value', '');
                        dj.byId('principal_act_name').set('value', '');
                        dj.byId('principal_act_cur_code').set('value', '');
                        dj.byId('principal_act_name').set('value', '');
                        dj.byId('principal_act_description').set('value', '');
                        dj.byId('principal_act_pab').set('value', '');
                        
                };
                m.dialog.show("ERROR", message, '', function() {
                        setTimeout(callback, 500);
                });
                if (d.byId(fxSectionName) && (d.style(d.byId(fxSectionName), "display") !== "none")) {
                        m.animate("wipeOut", d.byId(fxSectionName));
                }
        }
          
        function bindFieldsActions(){
                  m.connect('repayment_amt', 'onBlur', function(){
                                m.setTnxAmt(this.get('value'));
                                if(!isNaN(dj.byId('repayment_amt').get('value')) && dj.byId('repayment_cur_code').get('value') !== ''){
                                        m.fireFXAction();
                                }else{
                                        m.defaultBindTheFXTypes();
                                }
                        });
                        
                        m.connect('principal_act_name', 'onChange', function(){
                                if(dj.byId('principal_act_cur_code') && dj.byId('principal_act_cur_code').get('value') !== ''){
                                        m.fireFXAction();
                                }else{
                                        m.defaultBindTheFXTypes();
                                        if(d.byId(fxSectionName) && (d.style(d.byId(fxSectionName),"display") !== "none"))
                                        {
                                                m.animate("wipeOut", d.byId(fxSectionName));
                                        }
                                }
                        });
          }
          
          d.mixin(m._config, {          
                        initReAuthParams : function(){  
                                
                                var  reAuthAmt =  (dijit.byId("sub_tnx_type_code") && dijit.byId("sub_tnx_type_code").get("value") === "24")?dj.byId("fin_amt").get('value'):dj.byId("repayment_amt").get('value');
                                var  reAuthCurrency =  (dijit.byId("sub_tnx_type_code") && dijit.byId("sub_tnx_type_code").get("value") === "24")?dj.byId("fin_cur_code").get('value'):dj.byId("repayment_cur_code").get('value');
                                
                                var reAuthParams = {    productCode : 'TF',
                                                                        subProductCode : '',
                                                                        transactionTypeCode : '13',
                                                                        entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',                                       
                                                                        currency : reAuthCurrency,
                                                                        amount : m.trimAmount(reAuthAmt),
                                                                        
                                                                        es_field1 : m.trimAmount(reAuthAmt),
                                                                        es_field2 : ''
                                                                          };
                                return reAuthParams;
                        }
                });
          
        d.mixin(m, {
                
                fireFXAction : function(){
                        var fromCurrency,toCurrency;
                        var financeCurrency = dj.byId('repayment_cur_code').get('value');
                        var amount = dj.byId('repayment_amt').get('value');
                        var PrincipalAcctCurrency = dj.byId('principal_act_cur_code') ? dj.byId('principal_act_cur_code').get('value') : "";
                        var productCode = dj.byId('product_code').get('value');
                        var isDirectConversion = false;
                        var bankAbbvName = '';
                        if(dj.byId('issuing_bank_abbv_name') && dj.byId('issuing_bank_abbv_name').get('value')!== ''){
                                bankAbbvName = dj.byId('issuing_bank_abbv_name').get('value');
                        }
                        if(m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== ''){
                                   var fxParamObject = m._config.fxParamData[dj.byId("sub_product_code").get("value")];
                        if(m._config.fxParamData && fxParamObject.fxParametersData.isFXEnabled === 'Y'){
                                if(financeCurrency !== '' && !isNaN(amount) && productCode !== '' && bankAbbvName !== '' ){     
                                        if(financeCurrency !== PrincipalAcctCurrency){
                                                fromCurrency = PrincipalAcctCurrency;
                                                toCurrency   = financeCurrency;
                                                masterCurrency = PrincipalAcctCurrency;
                                        }
                                        if(fromCurrency && fromCurrency !== '' && toCurrency && toCurrency !== ''){
                                                if(d.byId(fxSectionName))
                                                                {
                                                                        m.animate("wipeIn", d.byId(fxSectionName));
                                                                }
                                                m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
                                                if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked')){
                                                        if(isNaN(dj.byId('fx_exchange_rate').get('value')) || dj.byId('fx_exchange_rate_cur_code').get('value') === '' ||
                                                                        isNaN(dj.byId('fx_exchange_rate_amt').get('value')) || (fxParamObject.fxParametersData.toleranceDispInd === 'Y' && (isNaN(dj.byId('fx_tolerance_rate').get('value')) ||
                                                                        isNaN(dj.byId('fx_tolerance_rate_amt').get('value')) || dj.byId('fx_tolerance_rate_cur_code').get('value') === ''))){
                                                                _clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
                                                        }
                                                }
                                        }else{
                                                if(d.byId(fxSectionName) && (d.style(d.byId(fxSectionName),"display") !== "none"))
                                                {
                                                        m.animate("wipeOut", d.byId(fxSectionName));
                                                }
                                                m.defaultBindTheFXTypes();
                                                }
                                }
                        }
                        }
                },
                
          bind : function() {
            m.setCurrency(dj.byId('fin_cur_code'), ['fin_liab_amt']);
            m.setCurrency(dj.byId('fin_cur_code'), ['interest_amt']);
                m.setCurrency(dj.byId('repayment_cur_code'), ['repayment_amt']);
                m.connect('sub_tnx_type_code', 'onChange', function(){
                var freeFormatText = dj.byId('free_format_text');
                var updatedOutstandingAmount = (dj.byId("updatedOutstandingAmt") && dj.byId("updatedOutstandingAmt").get('value')) ? dojo.number.parse(dj.byId("updatedOutstandingAmt").get('value')) :0;
                var finCurCode = dj.byId('fin_cur_code').get('value');
                if(this.get('value') == '24') {
                        _defaultsForCorrespondence();
                        m.toggleRequired('repayment_cur_code', false);
                        m.toggleRequired('repayment_amt', false);
                        m.toggleRequired('settlement_code', false);
                        m.toggleRequired('fee_act_no', false);
                        m.animate('fadeOut', reqMsgType, function(){});
//                      m.animate('fadeOut', sourceFundType, function(){});
                        m.animate('fadeOut', fxMsgType, function(){});
                }else if((this.get('value') == '38') && (updatedOutstandingAmount != 0)) {
                        _defaultsForCorrespondence();
                        m.animate('fadeIn', reqMsgType, function(){});
//                      m.animate('fadeIn', sourceFundType, function(){});
                        m.toggleRequired('repayment_cur_code', true);
                        m.toggleRequired('repayment_amt', true);
                        m.toggleRequired('settlement_code', true);
                        m.toggleRequired('fee_act_no', true);
                        if(dj.byId('repayment_amt') && dj.byId('repayment_cur_code'))
                        {
	                        if(dj.byId('fin_cur_code'))
	                        {
	                        	dj.byId('repayment_cur_code').set('value', dj.byId('fin_cur_code').get('value'));
	                        }
	                        dj.byId('repayment_amt').set('readOnly', false);
	                        dj.byId('repayment_amt').set('value', "");
	                        dj.byId('repayment_cur_code').set('readOnly', true);
                        }
                        if(dj.byId('repayment_mode_1'))
                        {
	                        dj.byId('repayment_mode_1').set('disabled',false);
	                        dj.byId('repayment_mode_1').set('checked',true);
                        }
                        if(dj.byId('repayment_mode_2'))
                        {
	                        dj.byId('repayment_mode_2').set('disabled',false);
	                        dj.byId('repayment_mode_2').set('checked',false);
                        }
                        if(dj.byId('settlement_code'))
                        {
                        	dj.byId('settlement_code').set('value','');
                        }
                        if(dj.byId('principal_act_name'))
                        {
                            dj.byId('principal_act_name').set('value','');
                        }
                        if(dj.byId('principal_act_no'))
                        {
                            dj.byId('principal_act_no').set('value','');
                        }
                        if(dj.byId('repayment_amt'))
                        {
                            dj.byId('repayment_amt').set('value','');
                        }
                        if(dj.byId('principal_act_cur_code'))
                        {
                        	dj.byId('principal_act_cur_code').set('value','');
                        }
                        if(dj.byId('fee_act_no'))
                        {
                        	dj.byId('fee_act_no').set('value','');
                        }
                        if(dj.byId('fee_act_cur_code'))
                        {
                        	dj.byId('fee_act_cur_code').set('value','');
                        }
                        if(dj.byId("interest_amt"))
                    	{
                        	dj.byId("interest_amt").set("readOnly", true);
                            dj.byId("interest_amt").set("value", "");
                    	}
	                    if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.isFXEnabled === 'Y'){
	                        m.animate('fadeIn', fxMsgType, function(){});
	                        bindFieldsActions();
                    }
	                    if(dojo.byId("repayment_cur_code_row")){
	    					dojo.place("<p style='width: 260px;font-size: 12px;display: inline;position: absolute;'>(Current Outstanding Amount:" + finCurCode + " " + updatedOutstandingAmount +  ")</p>", "repayment_cur_code_row", "last");
	    				}
                }else if((this.get('value') == '39') && (updatedOutstandingAmount != 0)) {
                        m.animate('fadeIn', reqMsgType, function(){});
//                      m.animate('fadeIn', sourceFundType, function(){});
                        m.toggleRequired('repayment_cur_code', true);
                        m.toggleRequired('repayment_amt', true);
                        m.toggleRequired('settlement_code', true);
                        m.toggleRequired('fee_act_no', true);
						if (dj.byId('repayment_amt') && dj.byId('repayment_cur_code'))
						{
							if (dj.byId('fin_liab_amt'))
							{
								var finLiabAmtValue = dj.byId('fin_liab_amt').get('value');
								if(finLiabAmtValue != updatedOutstandingAmount){
									dj.byId('repayment_amt').set('value',updatedOutstandingAmount);
								}else {
									dj.byId('repayment_amt').set('value',dj.byId('fin_liab_amt').get('value'));	
								}
								m.setTnxAmt(dj.byId('repayment_amt').get('value'));
							}
							if (dj.byId('fin_cur_code'))
							{
								dj.byId('repayment_cur_code').set('value',dj.byId('fin_cur_code').get('value'));
							}
	                        dj.byId('repayment_amt').set('readOnly', true);
	                        dj.byId('interest_amt').set('readOnly', true);
	                        dj.byId('repayment_cur_code').set('readOnly', true);
                        }
                        dj.byId('repayment_mode_1').set('checked',false);
                        dj.byId('repayment_mode_1').set('disabled',true);
                        dj.byId('repayment_mode_2').set('checked',false);
                        dj.byId('repayment_mode_2').set('disabled',true);
						if (dj.byId('settlement_code'))
						{
							dj.byId('settlement_code').set('value', '');
						}
						if (dj.byId('principal_act_name'))
						{
							dj.byId('principal_act_name').set('value', '');
						}
						if (dj.byId('principal_act_cur_code'))
						{
							dj.byId('principal_act_cur_code').set('value', '');
						}
						if (dj.byId('fee_act_no'))
						{
							dj.byId('fee_act_no').set('value', '');
						}
						if (dj.byId('fee_act_cur_code'))
						{
							dj.byId('fee_act_cur_code').set('value', '');
						}
						if(dj.byId('principal_act_no'))
						{
	                        dj.byId('principal_act_no').set('value','');
                        }
                        if(dj.byId('interest_amt'))
                        {
                            dj.byId('interest_amt').set('value','');
                        }
						if (dj.byId("interest_amt"))
						{
							dj.byId("interest_amt").set("readOnly", false);
						}
                    if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.isFXEnabled === 'Y'){
                        m.animate('fadeIn', fxMsgType, function(){});
                        bindFieldsActions();
                    }
                }
        });
        
        m.connect('repayment_amt', 'onBlur', function(){
                 m.setTnxAmt(this.get('value'));   
                 var updatedOutstandingAmount = (dj.byId("updatedOutstandingAmt") && dj.byId("updatedOutstandingAmt").get('value')) ? dojo.number.parse(dj.byId("updatedOutstandingAmt").get('value')) :0;
                 var repaymentCurCode = dj.byId("repayment_cur_code") ? dj.byId("repayment_cur_code").get("value") : "";
                 if(dj.byId('sub_tnx_type_code') && dj.byId('sub_tnx_type_code').get('value') == '38' && dj.byId('repayment_amt') && dj.byId('fin_liab_amt')){  
                        var outstandingAmt = dj.byId('fin_liab_amt').get('value');
                        var interestAmt = dj.byId('interest_amt').get('value');
                        var repaymentAmt = dj.byId('repayment_amt').get('value');
                        var domNode = dj.byId('repayment_amt').domNode;
                        if(dj.byId('repayment_mode_2').get('checked')){
                                if((interestAmt !== null && interestAmt!=='') && (repaymentAmt >= (outstandingAmt + interestAmt)) ){
                                		dj.byId('repayment_amt').set("value",null);
                                        _repaymentErrorDisplay("repaymentPrincipalInterestError");
                                }else{
                                        if(repaymentAmt >= outstandingAmt){
                                        	dj.byId('repayment_amt').set("value",null);
                                            _repaymentErrorDisplay("repaymentPrincipalInterestError");
                                        }
                                }        
                        }else if(dj.byId('repayment_mode_1').get('checked')){
                                if(repaymentAmt >= outstandingAmt){
                                	dj.byId('repayment_amt').set("value",null);
                                    _repaymentErrorDisplay("repaymentPrincipalError");
                                }else if(repaymentAmt >= updatedOutstandingAmount){
                                	var callback1 = function() {
                    					var widget = dijit.byId("repayment_amt");
                    				 	widget.focus();
                    				 	widget.set("state","Error");
                    				};
                    				m.dialog.show("ERROR", m.getLocalization("repaymentAmtLessThanOutstandingAmt",[repaymentCurCode,repaymentAmt,repaymentCurCode,updatedOutstandingAmount]), '', function(){
                    					setTimeout(callback1, 100);
                    				});
                                   } 
                           }
                        
                 }
        });
        
        m.connect('settlement_code', 'onChange', function(){
                if(dj.byId('settlement_code')){
                        if(dj.byId('settlement_code').get('value')=='01'){
                                m.toggleRequired('principal_act_name', true);
                        }else if(dj.byId('settlement_code').get('value')=='03'){
                                m.toggleRequired('principal_act_name', false);
                        }else{
                                m.toggleRequired('principal_act_name', false);
                        }
                
        }
        });
        
        m.connect('repayment_mode_2', 'onClick', function(){
        	if(dj.byId('repayment_mode_2').get("checked") === true)
    		{
	    		if(dj.byId("interest_amt"))
	    		{
	        		dj.byId("interest_amt").set("readOnly", false);
	    		}
    		}
        });
        
        m.connect('repayment_mode_1', 'onClick', function(){
        	if(dj.byId('repayment_mode_1').get("checked") === true)
    		{
        		if(dj.byId("interest_amt"))
	    		{
	        		dj.byId("interest_amt").set("readOnly", true);
	        		dj.byId("interest_amt").set("value", "");
	    		}
    		}
        });
        
     // On Blur of request percentage, calculate the requested amount value.
		m.connect("req_pct","onBlur",function(){
			if(this.get("value") !== null && !isNaN(this.get("value")))
			{
				if(parseFloat(this.get("value")) <= 100 && !(parseFloat(this.get("value")) <= 0))
				{
					var convertedAmt = (parseFloat(this.get("value")) * parseFloat(dj.byId("fin_amt").get("value"))) / 100;
					dj.byId("req_amt").set("value", convertedAmt);
				}
				else
				{
					displayMessage = misys.getLocalization("incorrectPercentage");
					this.focus();
			 		this.set("state","Error");
			 		dj.hideTooltip(this.domNode);
			 		dj.showTooltip(displayMessage, this.domNode, 0);
				}
			}
			else
			{
				if(dj.byId("fin_amt").get("value") !== null && !isNaN(dj.byId("fin_amt").get("value")))
				{
					dj.byId("req_amt").set("value", dj.byId("fin_amt").get("value"));
				}
			}
		});
 },
 
 onFormLoad : function() {
	 var freeFormat = dj.byId('free_format_text');
	 if(freeFormat && freeFormat.get("value") !== "")
	 {
		 freeFormat.focus();
	 }
        if(dj.byId("repayment_amt")){
                m.setTnxAmt(dj.byId("repayment_amt").get('value'));
        }  
        var subProduct = dj.byId("sub_product_code").get("value");
        //hide fx section by default
        if(d.byId(fxSectionName))
                {
                        m.initializeFX(subProduct);
                        //show fx section if previously enabled (in case of draft)
                        if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
                        {
                                        m.animate("wipeIn", d.byId(fxSectionName));                                                                                      
                        }else
                        {
                                d.style(fxSectionName,"display","none");
                        }
                }
        var freeFormatText = dj.byId('free_format_text');
        if(dj.byId('sub_tnx_type_code').value === '24') {
                _defaultsForCorrespondence();
                m.toggleRequired('repayment_cur_code', false);
                m.toggleRequired('repayment_amt', false);
                m.toggleRequired('settlement_code', false);
                m.toggleRequired('fee_act_no', false);
                m.animate('fadeOut', reqMsgType, function(){});
                m.animate('fadeOut', fxMsgType, function(){});
                if (freeFormatText.get('value') === '' || freeFormatText.get('value') === settlementMsg || freeFormatText.get('value') === messageTypeMsg) {
                        freeFormatText.set('value', correspondenceMsg);
                }
                
                if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === 'Y'){
                        m.defaultBindTheFXTypes();
                        m.animate('fadeOut', fxMsgType, function(){});
                }
        }else if(dj.byId('sub_tnx_type_code').value == '38') {  
                m.animate('fadeIn', reqMsgType, function(){});
                m.toggleRequired('repayment_cur_code', true);
                m.toggleRequired('repayment_amt', true);
                m.toggleRequired('settlement_code', true);
                m.toggleRequired('fee_act_no', true);
                if(dj.byId('repayment_amt') && dj.byId('repayment_cur_code')){
                if(dj.byId('fin_cur_code')){
                dj.byId('repayment_cur_code').set('value', dj.byId('fin_cur_code').get('value'));
                }
                dj.byId('repayment_amt').set('disabled', false);
                dj.byId('repayment_cur_code').set('disabled', true);
                }
                if(dj.byId('repayment_mode') && dj.byId('repayment_mode').get('value') === ''){
                        dj.byId('repayment_mode_1').set('checked',true);
                        dj.byId('repayment_mode_2').set('checked',false);
                }
                if(dj.byId('settlement_code')){
                        if(dj.byId('settlement_code').get('value')=='01'){
                                m.toggleRequired('principal_act_name', true);
                        }else if(dj.byId('settlement_code').get('value')=='03'){
                                m.toggleRequired('principal_act_name', false);
                        }else{
                                m.toggleRequired('principal_act_name', false);
                        }
              }
                if(dj.byId('repayment_mode_1').get("checked") === true)
        		{
            		if(dj.byId("interest_amt"))
    	    		{
    	        		dj.byId("interest_amt").set("readOnly", true);
    	        		dj.byId("interest_amt").set("value", "");
    	    		}
        		}
                else if(dj.byId('repayment_mode_2').get("checked") === true)
        		{
    	    		if(dj.byId("interest_amt"))
    	    		{
    	        		dj.byId("interest_amt").set("readOnly", false);
    	    		}
        		}
                if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === 'Y'){
                        m.animate('fadeIn', fxMsgType, function(){});
                        m.onloadFXActions();
                }
                freeFormatText.set('value', messageTypeMsg);
        }else if(dj.byId('sub_tnx_type_code').value == '39') {
                m.animate('fadeIn', reqMsgType, function(){});
                m.toggleRequired('repayment_cur_code', true);
                m.toggleRequired('repayment_amt', true);
                m.toggleRequired('settlement_code', true);
                m.toggleRequired('fee_act_no', true);
                if(dj.byId('repayment_amt') && dj.byId('repayment_cur_code')){
                if(dj.byId('fin_liab_amt')){
                dj.byId('repayment_amt').set('value', dj.byId('fin_liab_amt').get('value'));
                }
                if(dj.byId('fin_cur_code')){
                dj.byId('repayment_cur_code').set('value', dj.byId('fin_cur_code').get('value'));
                }
                dj.byId('repayment_amt').set('disabled', true);
                dj.byId('repayment_cur_code').set('disabled', true);
                }
                if(dj.byId('settlement_code') && dj.byId('settlement_code').get('value') === '01'){
                        m.toggleRequired('principal_act_name', true);
                }else{
                        m.toggleRequired('principal_act_name', false);
                }
                dj.byId('repayment_mode_1').set('disabled',true);
                dj.byId('repayment_mode_2').set('disabled',true);
                dj.byId('repayment_amt').set('disabled', true);
                if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === 'Y'){
                        m.animate('fadeIn', fxMsgType, function(){});
                        m.onloadFXActions();
                }
                freeFormatText.set('value', messageTypeMsg);
        }else{
                _defaultsForCorrespondence();
                m.animate('fadeOut', reqMsgType, function(){});
//              m.animate('fadeOut', fxMsgType, function(){});
                if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === 'Y'){
                        m.defaultBindTheFXTypes();
                        m.animate('fadeOut', fxMsgType, function(){});
                }
        }
 },
 
 beforeSubmitValidations : function() {
                var subProduct = dj.byId("sub_product_code").get("value");
                if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === 'Y'){
                        if(!m.fxBeforeSubmitValidation())
                                        {
                                                return false;
                                        }
                        var error_message = "";
                        var boardRateOption = dj.byId("fx_rates_type_2");
                        var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
                        var repaymentAmt = dj.byId("repayment_amt");
                        
                        if (boardRateOption.get('checked') && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get('value')) && repaymentAmt && !isNaN(repaymentAmt.get('value'))) {
                                if(repaymentAmt.get('value') < totalUtiliseAmt.get('value')){
                                error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
                                m._config.onSubmitErrorMsg =  error_message;
                                return false;
                                }
                        }
                }
                // Validate TF Partial Payment amount should be greater than zero
    			if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") === "38" && dj.byId("repayment_amt"))
    			{
    				if(!m.validateAmount(dj.byId("repayment_amt")))
    				{
    					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
    					dj.byId("repayment_amt").set("value","");
    					return false;
    				}
    			}  
            return true;
        }
        });
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_tf_client');