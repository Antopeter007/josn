dojo.provide("misys.binding.system.fscm_program");
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
dojo.require("misys.form.static_document");
dojo.require("misys.system.widget.CounterpartyPrograms");
dojo.require("misys.system.widget.CounterpartyProgram");
dojo.require("misys.widget.Dialog");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	"use strict"; // ECMA5 Strict Mode
	// Public functions & variables
	d.mixin(m, {
		bind : function() 
		{						
			m.connect("pc_lookup","onClick", function(){
				var program_id = dj.byId('program_id').get('value');
				var status = dj.byId('status').get('value');
				if(status ==='I')
				{
					m.dialog.show("ERROR", m.getLocalization("counterpartyCannotBeAddedToInactiveFscmProgram")); 
				}
				else
				{
					m.getPrgmCpty(program_id);
				}
			});
		},
		
	/**
	 * <h4>Summary:</h4>
	 * This function is used to fetch the selected program cpty, process and populate it on grid		
	 * @param {Object} Grid
	 * Popup Grid	
	 * @method fetchPrgmCptyRecords
	 */
	fetchPrgmCptyRecords: function(/* Dojox Grid*/ grid) 
	{		
		
		var selectedGrid = grid.selection.getSelected();
		
		dj.byId("xhrDialog").hide();
		
		var xmlString = m._config.xmlTransform(selectedGrid);
		
		if (dj.byId("prgrmCptySubmit"))
		{
			dj.byId("prgrmCptySubmit").set("disabled",true);
		}
		
		m.xhrPost( {
			url : m.getServletURL("/screen/AjaxScreen/action/FSCMProgramCounterPartyAction"),
			handleAs 	: "json",
			sync 		: true,
			content :
			{
				option : "fscm_program_counterparty",
				transactiondata : xmlString
			},
			load : function(response){
				m.processSaveCounterPartyResponse(response);
			}
		});
	},
	
	/**
	 * <h4>Summary:</h4>
	 * This function is used to close the pop up in the fscm program details screen
	 * @param {Object} Grid
	 * Popup Grid
	 * @method closeCounterPartiesListGrid
	 */
	closeCounterPartiesListGrid : function( /*Dojox Grid*/ grid) {
		dj.byId("xhrDialog").hide();
	},
	
	/**
	 *
	 * @method processSaveCounterPartyResponse
	 * 
	 */
	processSaveCounterPartyResponse : function(response)
	{
		var rItems = response.items;
				
		if(rItems.valid === true)
		{
			window.location.reload();
		}
		else{
			misys.dialog.show("ERROR", misys.getLocalization("errorAddingProgramCounterParty"));
		}
	},
	
	/**
	 * <h4>Summary:</h4>
	 * 
	 *  	This methods could be used navigate to Product specific listing screens.
	 *   
	 *  <h4>Description:</h4>
	 *  
	 * 		This onCancelNavigation is a standard action method.
	 * 		Any Product specific navigations will be coded in this method.
	 *
	 * @method onCancelNavigation
	 * @return {String}, the product specific target URL will be returned.
	 **/
	onCancelNavigation : function()
	{
		var targetUrl = misys._config.homeUrl;
		if(misys._config.xmlTagName && misys._config.xmlTagName === "program_counterparty")
		{
			// Navigate to FSCM Program List 
			var cancelButtonURL = ["/screen/CustomerSystemFeaturesScreen?", "option=DISPLAY_FSCMPROG_LIST"];
			targetUrl = misys.getServletURL(cancelButtonURL.join(""));
		}
		return targetUrl;
	},
	
	onFormLoad : function()
	{ 
	}
		
	
	});
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {});	
	d.mixin(m._config, {
		/*
		 * Request XML having program_id, operation_code and list of program counterparties associated. 
		 */
		xmlTransform : function (/* Dojox Grid*/ grid) {			
			var progId = dj.byId('program_id').get('value');
			var operationType =  dj.byId('operationtype').get('value');
			
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [];							
				transformedXml.push("<program_id>",progId,"</program_id>");
				transformedXml.push("<operation_type>",operationType,"</operation_type>");
				
				if(grid && grid.length >0) {
					transformedXml.push("<associated_counterparties>");
					
					for (var i = 0, len = grid.length; i < len; i++)
					{
						transformedXml.push("<associated_counterparty>");
						transformedXml.push("<abbv_name>",grid[i].ABBVNAME,"</abbv_name>");
						transformedXml.push("<name>",grid[i].NAME,"</name>");								
						transformedXml.push("</associated_counterparty>");
					}
					
					transformedXml.push("</associated_counterparties>");
				}				
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}
	});
	d.mixin(m, {});
	d.ready(function(){
		d.require("misys.system.widget.CounterpartyProgram");
		d.require("misys.system.widget.CounterpartyPrograms");
	});
})(dojo, dijit, misys);
