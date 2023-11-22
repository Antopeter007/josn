dojo.provide("misys.binding.system.prgm_cpty");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.xml.DomParser");
dojo.require("dijit.form.Button");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.Editor");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.xml.DomParser");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.grid.EnhancedGrid");
dojo.require("misys.form.static_document");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {
		/*
		 * Request XML having program_id, operation_code and list of program counterparties associated. 
		 */
		xmlTransform : function () {			
			var progId = dj.byId('program_id').get('value');
			var operationType =  dj.byId('operationtype').get('value');
			
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [];							
				transformedXml.push("<program_id>",progId,"</program_id>");
				transformedXml.push("<operation_type>",operationType,"</operation_type>");
				
				if(dj.byId("gridPC") && dj.byId("gridPC").store && dj.byId("gridPC").store !== null && dj.byId("gridPC").store._arrayOfAllItems.length >0) {
					transformedXml.push("<associated_counterparties>");
					dj.byId("gridPC").store.fetch({
						query: {ABBVNAME: '*'},
						onComplete: dojo.hitch(dj.byId("gridPC"), function(items){
							dojo.forEach(items, function(item){
								transformedXml.push("<associated_counterparty>");
								transformedXml.push("<abbv_name>",item.ABBVNAME,"</abbv_name>");
								transformedXml.push("<name>",item.NAME,"</name>");								
								transformedXml.push("</associated_counterparty>");
							});
						})
					});
					transformedXml.push("</associated_counterparties>");
				}				
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}
	});		
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() 
		{						
			m.connect("pc_lookup","onClick", function(){
				var program_id = dj.byId('program_id').get('value');
				m.getPrgmCpty(program_id);
			});
		},
		
	/**
	 * <h4>Summary:</h4>
	 * This function is used to fetch the selected program cpty, process and populate it on grid		
	 * @param {Object} Grid
	 * Popup Grid	
	 * @method fetchPrgmCptyRecords
	 */
	fetchPrgmCptyRecords: function(/* Dojox Grid*/ grid) {
		
		var numSelected = grid.selection.getSelected().length;
		var storeSize	= grid.store? grid.store._arrayOfAllItems.length:0;
		if(numSelected > 0 && storeSize > 0) {		
			m.processPCRecords(grid);
			m.populateGridOnLoad();			
		} 
		dj.byId("xhrDialog").hide();
	},
	
	/**
	 * <h4>Summary:</h4>
	 * This function is used to create the ProgramCpty item grid after selection of a set of pc is done.
	 * @param {Object} Grid
	 * Popup Grid
	 * @method processPCRecords
	 */
	processPCRecords : function( /*Dojox Grid*/ grid) {
		var pcData = dj.byId("gridPC");
		
		//set an empty store
		var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"ABBVNAME","items" :[]}});
		// Object to save grid data already present
		var obj= [];
		if(pcData && pcData.store && pcData.store._arrayOfTopLevelItems.length >0) {
			pcData.store.fetch({
				query: {ABBVNAME: '*'},
				onComplete: function(items){
					dojo.forEach(items, function(item){
						var abbv_name = item.ABBVNAME.slice().toString();
						var name = item.NAME.slice().toString();
						var pcDeleteIconPath = "";
						if(d.byId("pc_delete_icon")!=null && d.byId("pc_delete_icon"))
						{
							pcDeleteIconPath = d.byId("pc_delete_icon").value;
						}
						var actn= "<img src="+pcDeleteIconPath+" onClick =\"javascript:misys.deleteprogramCptyRecord('" + item.ABBVNAME + "')\"/>";
						var newItem= {"ABBVNAME" : abbv_name,"NAME": name,"ACTION" : actn};
						emptyStore.newItem(newItem);
						obj.push(item);
					});
				}
			});
		}
		
		var selItems = grid.selection.getSelected();
		//add - update
		if(selItems.length >0) {
			for(var i=0;i<selItems.length;i++) {
				var item=selItems[i];
				if(item !== null)
				{
					var abbv_name = item.ABBVNAME.slice().toString();
					var name = item.NAME.slice().toString();					
					var pcDeleteIconPath = "";
					if(d.byId("pc_delete_icon")!=null && d.byId("pc_delete_icon"))
					{
						pcDeleteIconPath = d.byId("pc_delete_icon").value;
					}
					var actn= "<img src="+pcDeleteIconPath+" onClick =\"javascript:misys.deleteprogramCptyRecord('" + item.ABBVNAME + "')\"/>";
					var newItem = {"ABBVNAME" : abbv_name,"NAME": name,"ACTION" : actn};	
					emptyStore.newItem(newItem);
				}
			}
		}
		if(pcData)
		{
			pcData.setStore(emptyStore);
			dojo.style(pcData.domNode, "display", "");
			pcData.render();
			pcData.resize();
		}
	},
	/**
	 * <h4>Summary:</h4>
	 * This function is used to delete a particular PC record.
	 * @param {String} abbv_name
	 *  abbv_name of the row to be deleted
	 * @method deletePrgmCptyRecord
	 */
	deleteprogramCptyRecord : function(/*String*/ abbvName) {
		var items=[];
		dj.byId("gridPC").store.fetch({
			query: {ABBVNAME: '*'},
			onComplete: dojo.hitch(dj.byId("gridPC"), function(items){
				dojo.forEach(items, function(item){
					if(item.ABBVNAME.slice().toString() === abbvName.slice().toString())
					{
						dj.byId("gridPC").store.deleteItem(item);							
					}
				});
			})
		});
		
		dj.byId("gridPC").resize();
		dj.byId("gridPC").render();
	},
		
	/**
	 * <h4>Summary:</h4>
	 * This function is used to populate the programCpty grid on form load.
	 * And create connect events on the programCpty allocated amount widgets for validation against actual amount.
	 * @param {String} productCode
	 * Product Code
	 * @method populateGridOnLoad
	 */
	populateGridOnLoad : function() {
		//Populate the grid based on the selection from the counterparty popup
		var pcData = dj.byId("gridPC");
		var grid = dj.byId("programCounterpartydata_grid");
		// assigning the list of selected items to PCSelectedNewItems
		var PCSelectedNewItems = grid.selection.getSelected();				
		if(pcData && PCSelectedNewItems && PCSelectedNewItems.length > 0)
		{
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"ABBVNAME","items" :[]}});
			//add - update
			for(var i=0;i<PCSelectedNewItems.length;i++) 
			{
				var item=PCSelectedNewItems[i];
				var abbv_name = item.ABBVNAME.slice().toString();
				var name = item.NAME.slice().toString();							
				var pcDeleteIconPath = "";
				
				if(d.byId("pc_delete_icon")!= null && d.byId("pc_delete_icon"))
				{
					pcDeleteIconPath = d.byId("pc_delete_icon").value;
				}
				var actn= "<img src="+pcDeleteIconPath+" onClick =\"javascript:misys.deleteprogramCptyRecord('" + item.ABBVNAME + "')\"/>";				
				var newItem = {"ABBVNAME" : abbv_name,"NAME":name,"ACTION" : actn};
				emptyStore.newItem(newItem);
			}
			dojo.style(pcData.domNode, "display", "");
			pcData.resize();
		}
		else if(dj.byId("gridPC")){
		dojo.style(dj.byId("gridPC").domNode, "display", "none");
		}
	},
	onFormLoad : function()
	{ 
	}
		
	
	});
	
	// Dialog functions
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.prgm_cpty_client');