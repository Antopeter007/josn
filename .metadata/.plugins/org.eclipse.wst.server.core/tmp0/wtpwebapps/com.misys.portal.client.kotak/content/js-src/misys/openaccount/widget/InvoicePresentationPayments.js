dojo.provide("misys.openaccount.widget.InvoicePresentationPayments");
dojo.experimental("misys.openaccount.widget.InvoicePresentationPayments"); 

dojo.require("misys.openaccount.widget.Payments");
dojo.require("misys.openaccount.widget.Payment");

// our declared class
dojo.declare("misys.openaccount.widget.InvoicePresentationPayments",
		[ misys.openaccount.widget.Payments ],
		// class properties:
		{
		layout: [
				{ name: 'Payment Type', get: misys.getPaymentType, width: '35%' },
				{ name: 'Ccy', field: 'cur_code', width: '15%' },
				{ name: 'Amount/Rate', get: misys.getPaymentAmountRate, width: '40%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActionsNoDelete, width: '10%' }
				]
	}
);