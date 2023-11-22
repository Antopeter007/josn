dojo.provide("misys.binding.openaccount.message_baseline");
/*
 -----------------------------------------------------------------------------
 
 Copyright (c) 2000-2012 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      26/01/12
 author: 	Sam Sundar K
 -----------------------------------------------------------------------------
 */

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
dojo.require("misys.form.PercentNumberTextBox");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	function _toggleSubTnxTypeCode()
	{
		var sub_tnx_type_code	=	dj.byId("sub_tnx_type_code"),
			conditions_div		=	d.byId("conditions_div"),
			prod_stat_code		=	dj.byId("prod_stat_code"),
			request_amount_div	=	d.byId("request_amount_div"),
			partial_fin_req_div	=	d.byId("partial_fin_req"),
			request_yes 		=   dj.byId("request_yes"),
			request_no	 		=   dj.byId("request_no"),
			subtnxtype			=	dj.byId("subtnxtype");
		
			sub_tnx_type_code.set("value",this.get("value"));
		
		if(this.get("value") === "72")
		{
			prod_stat_code.set("value", "48");
			sub_tnx_type_code.set("value", "72");
			subtnxtype.set("value", "72");
		}
		else if(this.get("value") === "73")
		{
			prod_stat_code.set("value", "49");
			sub_tnx_type_code.set("value", "73");
			subtnxtype.set("value", "73");
		}
		else if(this.get("value") === "74")
		{
			prod_stat_code.set("value", "50");
			sub_tnx_type_code.set("value", "74");
		}
		else if(this.get("value") === "75")
		{
			prod_stat_code.set("value", "51");
			sub_tnx_type_code.set("value", "75");
		}
		else if(this.get("value") === "76")
		{
			prod_stat_code.set("value", "52");
			sub_tnx_type_code.set("value", "76");
		}
		else if(this.get("value") === "77")
		{
			prod_stat_code.set("value", "53");
			sub_tnx_type_code.set("value", "77");
		}
		else if(this.get("value") === "78")
		{
			prod_stat_code.set("value", "54");
			sub_tnx_type_code.set("value", "78");
			m.animate("fadeIn", partial_fin_req_div);
		}	
		else if(this.get("value") === "85")
		{
			m.animate("fadeIn", partial_fin_req_div);
		}
		else if(this.get("value") === "90")
		{
			prod_stat_code.set("value", "B9");
			sub_tnx_type_code.set("value", "90");
		}
		else if(this.get("value") === "98")
		{
			prod_stat_code.set("value", "C6");
			sub_tnx_type_code.set("value", "98");
		}
		else if(this.get("value") === "A0")
		{
			prod_stat_code.set("value", "C7");
			sub_tnx_type_code.set("value", "A0");
		}
		else if(this.get("value") === "A1")
		{
			prod_stat_code.set("value", "C8");
			sub_tnx_type_code.set("value", "A1");
		}
		else
		{
			m.animate("fadeOut", partial_fin_req_div);
		}		
		
		if (request_yes && request_yes.checked)
		{
			sub_tnx_type_code.set("value", "72");
			subtnxtype.set("value", "72");
		}
		else if (request_no && request_no.checked)
		{
			sub_tnx_type_code.set("value", "73");
			subtnxtype.set("value", "73");
		}
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = { 	productCode : dj.byId("product_code").get('value'),
				     				subProductCode : '',
				    				transactionTypeCode : '13',
				    				entity : dj.byId("entity")?dj.byId("entity").get('value'):"",			        				
				    				currency : dj.byId("tnx_cur_code").get('value'),
				    				amount : m.trimAmount(dj.byId("tnx_amt").get('value')),
				    				
				    				es_field1 : m.trimAmount(dj.byId("tnx_amt").get('value')),
				    				es_field2 : ''
				  };
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
			bind : function() {
				
			var inv_eligible_cur_code      =   dj.byId("inv_eligible_cur_code");
			m.connect('request_yes','onClick',_toggleSubTnxTypeCode);
			m.connect('request_no','onClick',_toggleSubTnxTypeCode);
			m.connect('request_no','onClick',function(){
				if(dj.byId("finance_cur_code"))
				{
					dj.byId("finance_cur_code").set("value", dj.byId("tnx_cur_code").get("value"));
				}
				if(dj.byId("inv_eligible_pct"))
				{
					dj.byId("inv_eligible_pct").set("value", "");
					dj.byId("inv_eligible_pct").set("required", false);
				}
				if(dj.byId("inv_eligible_amt"))
				{
					dj.byId("inv_eligible_amt").set("value", "");
					dj.byId("inv_eligible_amt").set("required", false);
				}
			});
			if(dj.byId("finance_cur_code"))
			{
				m.setValidation("finance_cur_code", m.validateCurrency);
			}
			if(dj.byId("inv_eligible_cur_code"))
			{
				m.setCurrency(inv_eligible_cur_code, ["inv_eligible_amt"]);
			}	
			m.connect('inv_eligible_pct','onBlur',function(){
				if(this.get("value") !== null && !isNaN(this.get("value")))
				{
					if(parseFloat(this.get("value")) <= 100 && !(parseFloat(this.get("value")) <= 0))
					{
						var convertedAmt = (parseFloat(this.get("value")) * parseFloat(dj.byId("tnx_amt").get("value").replace(",", ""))) / 100;
						dj.byId("inv_eligible_amt").set("value", convertedAmt);
					}
					else
					{
						displayMessage = misys.getLocalization('incorrectPercentage');
						this.focus();
				 		this.set("state","Error");
				 		dj.hideTooltip(this.domNode);
				 		dj.showTooltip(displayMessage, this.domNode, 0);
				 		dj.showTooltip(displayMessage, domNode, 0);
					}
				}
				else
				{
					if(dj.byId("inv_eligible_amt").get("value") !== null && !isNaN(dj.byId("inv_eligible_amt").get("value")))
					{
						dj.byId("inv_eligible_amt").set("value", "");
					}
				}
			});
		},
		
		onFormLoad : function() {
			var partial_fin_req_div	=	d.byId("partial_fin_req"),
			subTnxTypeCode = dj.byId("sub_tnx_type_code")?dj.byId("sub_tnx_type_code").get("value"):"";
			if(subTnxTypeCode == "72" || subTnxTypeCode == "73")
			{
				dj.byId("subtnxtype").set("value", subTnxTypeCode);
			}
			if(subTnxTypeCode === "85" || subTnxTypeCode === "78" || subTnxTypeCode === "A2" || subTnxTypeCode === "A0")
			{
				m.animate("fadeIn", partial_fin_req_div);
				if(isNaN(dj.byId("inv_eligible_pct").get("value")))
				{
					dj.byId("inv_eligible_pct").set("value", 100);
					dj.byId("inv_eligible_pct").onBlur();
				}
			}
			else
			{
				m.animate("fadeOut", partial_fin_req_div);
			}
		}
  });
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.message_baseline_client');