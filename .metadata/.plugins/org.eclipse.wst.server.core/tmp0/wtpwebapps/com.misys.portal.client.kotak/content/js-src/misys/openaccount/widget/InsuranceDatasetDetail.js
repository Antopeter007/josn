dojo.provide("misys.openaccount.widget.InsuranceDatasetDetail");
dojo.experimental("misys.openacount.widget.InsuranceDatasetDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.InsuranceDatasetDetail",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		ids_match_issuer_name: "",
		ids_match_issuer_country: "",
		ids_identification: "",
		ids_identification_type: "",
		ids_match_iss_date: "",
		ids_match_amount: "",
		ids_match_transport: "",
		ids_match_assured_party: "",
		insurance_dataset_bic: "",
		insurance_dataset_req_clause: "",
		
		startup: function()
		{
			console.debug("[PaymentObligation] startup start");
			
			this.inherited(arguments);
			console.debug("[PaymentObligation] startup end");
		},
		
		buildRendering: function()
		{
			console.debug("[PaymentObligation] buildRendering start");
			this.inherited(arguments);
			var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, 'style', {display: 'none'});
			});
			console.debug("[PaymentObligation] buildRendering end");
		},
		
				
		createItem: function()
		{
			var insuranceBicText = this.get('insurance_dataset_bic');
			var insuranceBicObj = '';
			if(insuranceBicText){
				insuranceBicObj = new misys.openaccount.widget.InsuranceSubmittrBics();
				insuranceBicObj.createItemsFromJson(insuranceBicText);
			}
			var insuranceReqClauseText = this.get('insurance_dataset_req_clause');
			var insuranceReqClauseObj = '';
			if(insuranceReqClauseText){
				insuranceReqClauseObj = new misys.openaccount.widget.InsuranceRequiredClauses();
				insuranceReqClauseObj.createItemsFromJson(insuranceReqClauseText);
			}
			var item = {
					ids_match_issuer_name: this.get("ids_match_issuer_name"),
					ids_match_issuer_country: this.get("ids_match_issuer_country"),
					ids_identification: this.get("ids_identification"),
					ids_identification_type: this.get("ids_identification_type"),
					ids_match_iss_date: this.get("ids_match_iss_date"),
					ids_match_amount: this.get("ids_match_amount"),
					ids_match_transport: this.get("ids_match_transport"),
					ids_match_assured_party: this.get("ids_match_assured_party"),
					insurance_dataset_bic: "",
					insurance_dataset_req_clause: ""
			};
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var items = child.createItem();
						if (items != null)
						{
							dojo.mixin(item, items);
						}
					}
				}, this);
    		}
    		return item;
		},

		constructor: function()
		{
			console.debug("[Transport Dataset] constructor");
		}
	}
);