dojo.provide("misys.system.widget.CounterpartyPrograms");
dojo.experimental("misys.system.widget.CounterpartyPrograms");

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.CounterpartyProgram");

// our declared class
dojo.declare("misys.system.widget.CounterpartyPrograms", [ misys.grid.GridMultipleItems ],
// class properties:
{
	data : {
		identifier : 'store_id',
		label : 'store_id',
		items : []
	},
	handle : null,
	templatePath : null,
	templateString : dojo.byId("cptyProgs-template").innerHTML ? dojo.byId("cptyProgs-template").innerHTML:"",
	dialogId : 'cptyProg-dialog-template',
	gridId : 'cptyProg_defn_grid',
	xmlTagName : 'fscm_counterparty_list',
	xmlsubTagName : 'fscm_counterparty_record',

	gridColumns : [ "cpty_abbv_name", "cpty_name","cpty_bo_status","cpty_prog_cpty_assn_status","cpty_limit_cur_code","cpty_limit_amt","cpty_available_limit_amt","cpty_max_finance_percent","cpty_beneficiary_id","cpty_program_cpty_id","cpty_showDelete"],
	propertiesMap : {
		cpty_abbv_name : {
			_fieldName : 'cpty_abbv_name'
		},
		cpty_name : {
			_fieldName : 'cpty_name'
		},
		cpty_bo_status : {
			_fieldName : 'cpty_bo_status'
		},
		cpty_prog_cpty_assn_status : {
			_fieldName : 'cpty_prog_cpty_assn_status'
		},
		cpty_limit_cur_code : {
			_fieldName : 'cpty_limit_cur_code'
		},
		cpty_limit_amt : {
			_fieldName : 'cpty_limit_amt'
		},
		cpty_available_limit_amt : {
			_fieldName : 'cpty_available_limit_amt'
		},
		cpty_max_finance_percent : {
			_fieldName : 'cpty_max_finance_percent'
		},
		cpty_beneficiary_id : {
			_fieldName : 'cpty_beneficiary_id'
		},
		cpty_program_cpty_id : {
			_fieldName : 'cpty_program_cpty_id'
		},
		cpty_showDelete : {
			_fieldName : 'cpty_showDelete'
		}
	},
	basicMap : {

		cpty_abbv_name : {
			_fieldName : 'cpty_abbv_name'
		},
		cpty_name : {
			_fieldName : 'cpty_name'
		}
	},
	layout : [ {
		name : "cpty_abbv_name",
		field : "cpty_abbv_name",
		width : "25%"
	}, {
		name : "cpty_name",
		field : "cpty_name",
		width : "25%"
	},
	{
		name : "cpty_bo_status",
		field : "cpty_bo_status",
		width : "10%"
	},
	{
		name : "cpty_prog_cpty_assn_status",
		field : "cpty_prog_cpty_assn_status",
		width : "10%"
	},
	{
		name : "cpty_limit_cur_code",
		field : "cpty_limit_cur_code",
		width : "7%"
	},
	{
		name : "cpty_limit_amt",
		field : "cpty_limit_amt",
		width : "12%"
	},
	{
		name : "cpty_available_limit_amt",
		field : "cpty_available_limit_amt",
		width : "12%"
	},
	{
		name : "cpty_max_finance_percent",
		field : "cpty_max_finance_percent",
		width : "8%"
	},
	{
		name : " ",
		field : "actions",
		formatter : misys.grid.formatCptyDeleteActions,
		width : "5%"
	} ],

	startup : function() {
		console.debug("[CptyPrograms] startup start");
		// Prepare data store
		this.dataList = [];
		if (this.hasChildren()) {
			dojo.forEach(this.getChildren(), function(child) {
				// Mark the child as started.
				// This will prevent Dojo from parsing the child
				// as we don't want to make it appear on the form now.
				if (child.createItem) {
					var item = child.createItem();
					this.dataList.push(item);
				}

			}, this);
		}
		this.inherited(arguments);
		console.debug("[CptyPrograms] startup end");
	},
	_showCounterPartyDeleteMsg : function(response){
		
		console.debug("Counter Party deleted Successfully");
	},
	createDataGrid: function()
	{
		this.inherited(arguments);
		var grid = this.grid;
		var tempGrid = grid;
		misys.connect(grid, "onDelete",
				function(){	
					misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
						window.location.reload(); 
						var programId = dijit.byId("program_id").get("value");
						var beneficiaryId= dijit.byId("cptyProg_defn_grid").selection.getSelected()[0].cpty_beneficiary_id;
						var prgCptyId=dijit.byId("cptyProg_defn_grid").selection.getSelected()[0].cpty_program_cpty_id;
						misys.xhrPost( {
							url : misys.getServletURL("/screen/AjaxScreen/action/DeleteAssociatedCounterPartyAction"),
							handleAs 	: "json",
							sync 		: true,
							content : {
								programId : programId,
								prgCptyId : prgCptyId,
								beneficiaryId : beneficiaryId
							},
							load : this._showCounterPartyDeleteMsg
						});
					}, "alertDialog");
			});
	},
	resetDialog : function(items, request) {
		console.debug("[CptyPrograms] resetDialog start");

		this.inherited(arguments);

		console.debug("[CptyPrograms] resetDialog end");
	},
	openDialogFromExistingItem : function(items, request) {
		console.debug("[CptyPrograms] openDialogFromExistingItem start");
		this.inherited(arguments);
		console.debug("[CptyProgs] openDialogFromExistingItem end");
	},

	addItem : function(event) {
		console.debug("[CptyPrograms] addItem start");

		var that = this;

		that.inherited(arguments);
		console.debug("[CptyPrograms] addItem end");
	}
});