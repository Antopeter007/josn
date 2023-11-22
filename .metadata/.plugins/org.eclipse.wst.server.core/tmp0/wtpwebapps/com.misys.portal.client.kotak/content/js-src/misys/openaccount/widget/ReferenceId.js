dojo.provide("misys.openaccount.widget.ReferenceId");
dojo.experimental("misys.openacount.widget.ReferenceId"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.ReferenceId",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		cust_reference:'',
		back_office_1:'',
		customer_input_center:'',
		prodcode: '',
		subprodcode: '',
		uniqueRef: '',
		from: '',
		to: '',
		title: '',
		
		createItem: function()
		{
			var item = {
				cust_reference: this.get('cust_reference'),
				back_office_1: this.get('back_office_1'),
				customer_input_center: this.get('customer_input_center'),
				prodcode: this.get('prodcode'),
				subprodcode: this.get('subprodcode'),
				uniqueRef: this.get('uniqueRef'),
				from: this.get('from'),
				to: this.get('to'),
				title: this.get('title')
			};
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						item.push(child.createItem());
					}
				}, this);
    		}
    		return item;
		},

		constructor: function()
		{
			console.debug("[BoReferenceId] constructor");
		}
	}
);