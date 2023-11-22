dojo.provide("misys.binding.loan.facility_ongoing_fee");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.SessionTimer");
dojo.require("dojox.xml.DomParser");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.common");


/**
 * Create Loan Screen JS Binding 
 * 
 * @class  reprice_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
	{

	"use strict"; // ECMA5 Strict Mode

	
	d.mixin(m,
			{
		/**
		 * Get or Identify the Transaction in the Grid, on which the Action needs to be performed.
		 * 
		 * @method getLinkedLoansInterestDetailsAction
		 * @return {String} `ref_id`, the Transaction Reference ID.
		 */
		getFacilityOngoingFee : function(rowIndex, item) {

			if(!item) {
				return this.defaultValue;
			}

			return {
				fee_Identifier: this.grid.store.getValue(item, "fee_Identifier"),
				fee_type:this.grid.store.getValue(item, "fee_type"),
				fee_rid:encodeURIComponent(this.grid.store.getValue(item, "fee_rid")),
				currency:encodeURIComponent(this.grid.store.getValue(item, "currency"))
			};
		}, 
		

		/**
		 * Format Linked Loans Interest Details Grid section. Like, alignment, CSS, and hyper link to appear in each grid-row.
		 * 
		 * @method formatLinkedLoanInterestDetailsPreviewActions
		 */
		formatFacilityOngoingFeeActions : function(result){
			
			var parent = dojo.create('a');
              
			var id = ''+result.fee_Identifier+'_details_link';			
            var href = 'javascript:';
			var link=''+result.fee_type;
			var facilityId=encodeURIComponent(dj.byId("facilityId").get("value"));
			var borrowerId=encodeURIComponent(dijit.byId('borrowerId').value);
			var facilityName=encodeURIComponent(dj.byId("facilityName").get("value"));
			var effectiveDate=dj.byId("effectiveDate").get("value");
			var dueDate=dj.byId("dueDate").get("value");
			var feeRid = decodeURIComponent(result.fee_rid);
			var currency = ''+result.currency;
			// Escaping Special characters in facility Name
			/*if(facilityName && facilityName.indexOf("'") || facilityName.indexOf("\"") || facilityName.indexOf("<") || facilityName.indexOf(">") || facilityName.indexOf("&") ){
				facilityName = m.escapeHtml(facilityName);
			}*/

			href="javascript:misys.popup.showPopup('feeType="+result.fee_type+"&facilityid="+facilityId+"&borrowerId="+borrowerId+"&facilityName="+facilityName+"&fee_rid="+feeRid+"&effectiveDate="+effectiveDate+"&dueDate="+dueDate +"&fac_ccy="+currency +"','FEE_ONGOING')";
		      
			var anchor = dojo.create('a',{'id':id, 'href' : href,'innerHTML':link}, parent);
			var gridData = dj.byId("gridRepricingLoanTransactions");
			if(gridData){
				var feeDetails = gridData.store;
				feeDetails.comparatorMap = {};
				feeDetails.comparatorMap['fee_amount'] = misys.grid.sortAmountColumn;	  
			}
			return parent.innerHTML;
			
		}
		


	});
	

		
})(dojo, dijit, misys);
// Including the client specific implementation
//dojo.require('misys.client.binding.loan.repricing_ln_client');
