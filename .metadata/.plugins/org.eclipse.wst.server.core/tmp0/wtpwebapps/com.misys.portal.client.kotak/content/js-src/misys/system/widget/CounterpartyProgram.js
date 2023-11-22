dojo.provide("misys.system.widget.CounterpartyProgram");
dojo.experimental("misys.system.widget.CounterpartyProgram");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");
// our declared class
dojo.declare("misys.system.widget.CounterpartyProgram", [ dijit._Widget, dijit._Contained,
		dijit._Container, misys.layout.SimpleItem ],
// class properties:
{
	cpty_abbv_name : "",
	cpty_name : "",
	cpty_bo_status : "",
	cpty_prog_cpty_assn_status : "",
	cpty_limit_cur_code : "",
	cpty_limit_amt : "",
	cpty_available_limit_amt : "",
	cpty_max_finance_percent : "",
	cpty_beneficiary_id : "",
	cpty_program_cpty_id : "",
	cpty_showDelete : "",
	createItem : function() {
		var item = {
			cpty_abbv_name : this.get("cpty_abbv_name"),
			cpty_name : this.get("cpty_name"),
			cpty_bo_status : this.get("cpty_bo_status"),
			cpty_prog_cpty_assn_status : this.get("cpty_prog_cpty_assn_status"),
			cpty_limit_cur_code : this.get("cpty_limit_cur_code"),
			cpty_limit_amt : this.get("cpty_limit_amt"),
			cpty_available_limit_amt : this.get("cpty_available_limit_amt"),
			cpty_max_finance_percent : this.get("cpty_max_finance_percent"),
			cpty_beneficiary_id : this.get("cpty_beneficiary_id"),
			cpty_program_cpty_id:  this.get("cpty_program_cpty_id"),
			cpty_showDelete:  this.get("cpty_showDelete")
		};
		if (this.hasChildren && this.hasChildren()) {
			dojo.forEach(this.getChildren(), function(child) {
				if (child.createItem) {
					item.push(child.createItem());
				}
			}, this);
		}
		return item;
	},
	constructor : function() {
		console.debug("[CptyProg] constructor");
	}
});