dojo.provide("misys.binding.loan.repayment_details_ln");

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
dojo.require("misys.grid._base");


/**
 * Create Facility Fee Details Screen JS Binding 
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
		
		onFormLoad : function() {
			var gridData = dj.byId("gridLoanRepaymentDetails");
			if(gridData){
			var storeLoanRepaymentDetails = gridData.store;
			storeLoanRepaymentDetails.comparatorMap = {};
			storeLoanRepaymentDetails.comparatorMap['cycleNo'] = misys.grid.sortAmountColumn;
			storeLoanRepaymentDetails.comparatorMap['paymentAmt'] = misys.grid.sortAmountColumn;
			storeLoanRepaymentDetails.comparatorMap['interestAmt'] = misys.grid.sortAmountColumn;
			storeLoanRepaymentDetails.comparatorMap['unpaidInterestAmt'] = misys.grid.sortAmountColumn;
			storeLoanRepaymentDetails.comparatorMap['principleAmt'] = misys.grid.sortAmountColumn;
			storeLoanRepaymentDetails.comparatorMap['unpaidPrincipleAmt'] = misys.grid.sortAmountColumn;
			storeLoanRepaymentDetails.comparatorMap['dueDate'] = misys.grid.sortDateColumn;
			storeLoanRepaymentDetails.comparatorMap['remainingAmt'] = misys.grid.sortAmountColumn;
			}
        }
	});
	
})(dojo, dijit, misys);
