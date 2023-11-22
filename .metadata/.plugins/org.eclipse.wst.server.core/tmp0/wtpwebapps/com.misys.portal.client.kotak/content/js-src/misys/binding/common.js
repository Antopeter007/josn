dojo.provide("misys.binding.common");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.form.SortedFilteringSelect");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	d.mixin(m, {
/**
 * 
		 * <h4>Summary:</h4> Populate a newly added fields for SWIFT changes
		 * for Fx deals, if opics.swift.enabled is true , then only it should display fields.
		 * For FT deals, if currency and counter currency is different then only populate fields
		 * @method populateSwiftFields
		 */
		
		_populateSwiftFields:function(){
			if(m._config.swift_allowed){
				var subProductCode = dj.byId("sub_product_code").get("value");
				if(subProductCode==='TRTPT'){
					var payment_cur_code =dj.byId("payment_cur_code").get("value");
					var applicant_cur_code = dj.byId("applicant_act_cur_code").get("value");
					if(payment_cur_code !== applicant_cur_code){
						d.style('bene_details_clrc_div',{'display':'block'});	
						d.style('beneficiary_bank_clrc_div',{'display':'block'});	
						d.style('order_details_clrc_div',{'display':'block'});	
						d.style('inter_bank_clrc_div',{'display':'block'});
						d.style('intermediary_bank_street_2_div',{'display':'block'});
						d.style('ordering_cust_address_2_div',{'display':'block'});
						dj.byId("beneficiary_name").set("maxLength", "34");
						dj.byId("beneficiary_address").set("maxLength", "34");
						dj.byId("beneficiary_address_2").set("maxLength", "34");
						dj.byId("beneficiary_city").set("maxLength", "31");
						dj.byId("beneficiary_bank").set("maxLength", "34");
						dj.byId("beneficiary_bank_branch").set("maxLength", "34");
						dj.byId("beneficiary_bank_address").set("maxLength", "34");
						dj.byId("beneficiary_bank_city").set("maxLength", "31");
						dj.byId("ordering_cust_name").set("maxLength", "34");
						dj.byId("ordering_cust_address").set("maxLength", "34");
						dj.byId("ordering_cust_address_2").set("maxLength", "34");
						dj.byId("ordering_cust_citystate").set("maxLength", "31");
						dj.byId("intermediary_bank").set("maxLength", "34");
						dj.byId("intermediary_bank_street").set("maxLength", "34");
						dj.byId("intermediary_bank_street_2").set("maxLength", "34");
						dj.byId("intermediary_bank_city").set("maxLength", "31");
					}
					else{
						d.style('bene_details_clrc_div',{'display':'none'});
						d.style('beneficiary_bank_clrc_div',{'display':'none'});	
						d.style('order_details_clrc_div',{'display':'none'});	
						d.style('inter_bank_clrc_div',{'display':'none'});
						d.style('intermediary_bank_street_2_div',{'display':'none'});
						d.style('ordering_cust_address_2_div',{'display':'none'});
						dj.byId("beneficiary_name").set("maxLength", "35");
						dj.byId("beneficiary_address").set("maxLength", "35");
						dj.byId("beneficiary_address_2").set("maxLength", "35");
						dj.byId("beneficiary_city").set("maxLength", "32");
						dj.byId("beneficiary_bank").set("maxLength", "35");
						dj.byId("beneficiary_bank_branch").set("maxLength", "35");
						dj.byId("beneficiary_bank_address").set("maxLength", "35");
						dj.byId("beneficiary_bank_city").set("maxLength", "32");
						dj.byId("ordering_cust_name").set("maxLength", "35");
						dj.byId("ordering_cust_address").set("maxLength", "35");
						dj.byId("ordering_cust_citystate").set("maxLength", "32");
						dj.byId("intermediary_bank").set("maxLength", "35");
						dj.byId("intermediary_bank_street").set("maxLength", "35");
						dj.byId("intermediary_bank_city").set("maxLength", "32");
					}
				}
				else{
					d.style('bene_details_clrc_div',{'display':'block'});	
					d.style('beneficiary_bank_clrc_div',{'display':'block'});	
					d.style('order_details_clrc_div',{'display':'block'});	
					d.style('inter_bank_clrc_div',{'display':'block'});
					d.style('intermediary_bank_street_2_div',{'display':'block'});
					d.style('ordering_cust_address_2_div',{'display':'block'});
					dj.byId("beneficiary_name").set("maxLength", "34");
					dj.byId("beneficiary_address").set("maxLength", "34");
					dj.byId("beneficiary_address_2").set("maxLength", "34");
					dj.byId("beneficiary_city").set("maxLength", "31");
					dj.byId("beneficiary_bank").set("maxLength", "34");
					dj.byId("beneficiary_bank_branch").set("maxLength", "34");
					dj.byId("beneficiary_bank_address").set("maxLength", "34");
					dj.byId("beneficiary_bank_city").set("maxLength", "31");
					dj.byId("ordering_cust_name").set("maxLength", "34");
					dj.byId("ordering_cust_address").set("maxLength", "34");
					dj.byId("ordering_cust_address_2").set("maxLength", "34");
					dj.byId("ordering_cust_citystate").set("maxLength", "31");
					dj.byId("intermediary_bank").set("maxLength", "34");
					dj.byId("intermediary_bank_street").set("maxLength", "34");
					dj.byId("intermediary_bank_street_2").set("maxLength", "34");
					dj.byId("intermediary_bank_city").set("maxLength", "31");
				}
			}
			else{
				d.style('bene_details_clrc_div',{'display':'none'});
				d.style('beneficiary_bank_clrc_div',{'display':'none'});	
				d.style('order_details_clrc_div',{'display':'none'});	
				d.style('inter_bank_clrc_div',{'display':'none'});
				d.style('intermediary_bank_street_2_div',{'display':'none'});
				d.style('ordering_cust_address_2_div',{'display':'none'});
				dj.byId("beneficiary_name").set("maxLength", "35");
				dj.byId("beneficiary_address").set("maxLength", "35");
				dj.byId("beneficiary_address_2").set("maxLength", "35");
				dj.byId("beneficiary_city").set("maxLength", "32");
				dj.byId("beneficiary_bank").set("maxLength", "35");
				dj.byId("beneficiary_bank_branch").set("maxLength", "35");
				dj.byId("beneficiary_bank_address").set("maxLength", "35");
				dj.byId("beneficiary_bank_city").set("maxLength", "32");
				dj.byId("ordering_cust_name").set("maxLength", "35");
				dj.byId("ordering_cust_address").set("maxLength", "35");
				dj.byId("ordering_cust_citystate").set("maxLength", "32");
				dj.byId("intermediary_bank").set("maxLength", "35");
				dj.byId("intermediary_bank_street").set("maxLength", "35");
				dj.byId("intermediary_bank_city").set("maxLength", "32");
			}
			},
			/**
			 * <h4>Summary:</h4> It will remove additional fields for CD
			 * @method removeAdditionalFieldsForCD
			 */
			removeAdditionalFieldsForCD : function()
			{
				d.style('bene_details_clrc_div',{'display':'none'});
				d.style('beneficiary_bank_clrc_div',{'display':'none'});	
				d.style('order_details_clrc_div',{'display':'none'});	
				d.style('inter_bank_clrc_div',{'display':'none'});
				d.style('intermediary_bank_street_2_div',{'display':'none'});
				d.style('ordering_cust_address_2_div',{'display':'none'});
			},
			
		
		/**
		 * <h4>Summary:</h4> It will populate clearing codes based on type
		 * Only when swift changes are enabled
		 * @method _populateClearingCodes
		 */
		_populateClearingCodes: function(/*String*/type) 
		{
			var clearingCodeSelectWidget;
			
			switch(type){
			
			case "beneficiary_bank":
				clearingCodeSelectWidget = dj.byId("beneficiary_bank_clrc");
				break;
				
			case "intermediary_bank":
				clearingCodeSelectWidget = dj.byId("inter_bank_clrc");
				break;
				
			case "ordering_customer":
				clearingCodeSelectWidget = dj.byId("order_details_clrc");
				break;
			default:
				clearingCodeSelectWidget = dj.byId("bene_details_clrc");
				break;				
			}
			if (clearingCodeSelectWidget) 
			{
				clearingCodeSelectWidget.reset();
			    var counCurr, clearingCodesPair;
			    var j;
				var clearingCodesCollection = [];
				var jsonArray = Object.keys(misys._config.clearingCodes);
				
				for(j= 0; j < jsonArray.length; j++)
				{
					clearingCodesPair = {"name": m._config.clearingCodes[jsonArray[j]], "value": jsonArray[j]};
					clearingCodesCollection.push(clearingCodesPair);							
				}
				
				if (clearingCodesCollection.length < 1)
				{
					var sectionId;
					switch(type){
					
					case "beneficiary_bank":
						sectionId="beneficiary_bank_clearing_code_section";
						break;
					case "intermediary_bank":
						sectionId="intermediary_bank_clearing_code_section";
						break;
					case "ordering_customer":
						sectionId="ordering_customer_clearing_code_section";
						break;
					default:
						sectionId="beneficiary_clearing_code_section";
						break;
					}
					
				}
				else
				{
					var store = new dojo.data.ItemFileReadStore({data: {identifier: "value", label: "name", items: clearingCodesCollection}});
					clearingCodeSelectWidget.store = store;
				}
			}
			

		}
	});
})(dojo, dijit, misys);