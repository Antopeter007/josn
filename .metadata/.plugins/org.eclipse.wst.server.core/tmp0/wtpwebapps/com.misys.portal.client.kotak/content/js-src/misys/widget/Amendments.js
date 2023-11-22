dojo.provide("misys.widget.Amendments");
dojo.experimental("misys.widget.Amendments"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.widget.Amendment");

// our declared class
dojo.declare("misys.widget.Amendments",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		
        templateString: "<div></div>",
		
		gridColumns: ['content', 'verb'],
        
		propertiesMap: {
			content: {_fieldName: 'amendment'}
			},
        
		layout : [],
        
		startup: function(){
			if(this._started) { return; }
			console.debug("[Customers1] startup start");
			
			// Prepare data store
			this.dataList = [];

			var parameter = misys._config.narrativeId;
			var narrativeFieldsStore;
			if("narrative_amend_goods" === parameter && misys._config.narrativeDescGoodsDataStore) {
				narrativeFieldsStore = misys._config.narrativeDescGoodsDataStore;
			} else if("narrative_amend_docs" === parameter && misys._config.narrativeDocsReqDataStore) {
				narrativeFieldsStore = misys._config.narrativeDocsReqDataStore;
			} else if ("narrative_amend_instructions" === parameter && misys._config.narrativeAddInstrDataStore) {
				narrativeFieldsStore = misys._config.narrativeAddInstrDataStore;
			} else if ("narrative_amend_sp_beneficiary" === parameter && misys._config.narrativeSpBeneDataStore) {
				narrativeFieldsStore = misys._config.narrativeSpBeneDataStore;
			} else if ("narrative_amend_sp_recvbank" === parameter && misys._config.narrativeSpRecvbankDataStore) {
				narrativeFieldsStore = misys._config.narrativeSpRecvbankDataStore;
			}
			if (narrativeFieldsStore && narrativeFieldsStore != '') {
				for(var i=0; i < narrativeFieldsStore.length; i++) {
					var key,textDisplayed, text, row_count, verbDisplayed;
					if(narrativeFieldsStore[i] != null){
						key = narrativeFieldsStore[i].verb[0];
						textDisplayed = misys.showTruncatedGridData(narrativeFieldsStore[i].content[0].replace(/&#x9;/g,'\t'),2);
						if(key === "ADD") {
							verbDisplayed = misys.getLocalization("add");
						}else if(key === "DELETE") {
							verbDisplayed = misys.getLocalization("delete");
						}else if(key === "REPALL") {
							verbDisplayed = misys.getLocalization("repall");
						}
						text = narrativeFieldsStore[i].content[0].replace(/&#x9;/g,'\t');
						row_count = narrativeFieldsStore[i].text_size[0];
						var item = { content: text.replace(/&#xa;/g,'\n'), displayed_content : textDisplayed, displayed_verb : verbDisplayed, verb : key , text_size : row_count};
						this.dataList.push(item);
					}
					
				}
			}
			if(dijit.byId("amendments").data){
				dijit.byId("amendments").data.items.splice(0,dijit.byId("amendments").data.items.length);
			}	
			
			if(misys._config.codeword_enabled == true){
			this.layout = [
						{ name: 'Verb', field: 'verb', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true},
						{ name: 'Verb', field: 'displayed_verb', width: '12%' ,noresize:true},
						{ name: 'Content', field: 'displayed_content', width: '75%' ,noresize:true},
						{ name: 'Action', field: 'actions', formatter: misys.grid.formatReportActions, width: '13%',noresize:true },
						{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' , noresize:true},
						{ name: 'size', field: 'text_size', headerStyles: 'display:none', cellStyles: 'display:none' , noresize:true},
						{ name: 'Content', field: 'content', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
					];
			}else{
				this.layout = [
					{ name: 'Verb', field: 'verb', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true},
					{ name: 'Content', field: 'displayed_content', width: '85%' ,noresize:true},
					{ name: 'Action', field: 'actions', formatter: misys.grid.formatReportActions, width: '15%',noresize:true },
					{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' , noresize:true},
					{name: 'size', field: 'text_size', headerStyles: 'display:none', cellStyles: 'display:none' , noresize:true},
					{ name: 'Content', field: 'content', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
				];
			}
			
			this.inherited(arguments);
			console.debug("[Customers2] startup end");
		},
		
		createDataGrid: function(){
			
			console.debug("[Customers] createDataGrid start");
			
			if (this.grid)
			{
				this.grid.destroy();
			}
			
			var verbId = '';
			var displayedVerb = '';
			var verbIdLen =0;
			if(misys._config.codeword_enabled == true){
				if(dijit.byId("adr_1").get("value")){
					verbId = dijit.byId("adr_1").get("value");
				}
				else if(dijit.byId("adr_2").get("value")){
					verbId = dijit.byId("adr_2").get("value");
				}
				else if(dijit.byId("adr_3").get("value")){
					verbId = dijit.byId("adr_3").get("value");
				}
				verbIdLen = "/"+verbId+"/";
			}else{
				verbId="REPALL";
			} 
			if(verbId === "ADD") {
				displayedVerb = misys.getLocalization("add");
			}else if(verbId === "DELETE") {
				displayedVerb = misys.getLocalization("delete");
			}else if(verbId === "REPALL") {
				displayedVerb = misys.getLocalization("repall");
			}
			var displayedText = misys.showTruncatedGridData(dijit.byId("narrative_description_goods_popup").get("value").substring(verbIdLen.length), 2);
			var item = {content: dijit.byId("narrative_description_goods_popup").get("value").substring(verbIdLen.length),displayed_content: displayedText,displayed_verb : displayedVerb,verb : verbId,text_size: dijit.byId("narrative_description_goods_popup").rowCount+1};

			if(verbId != "" && dijit.byId("narrative_description_goods_popup").get("value")!=""){
				this.dataList.push(item);
			}
			if(this.dataList.length > 0 && verbId != "" && dijit.byId("narrative_description_goods_popup").get("value")!="")
			{
				// Create data store
				this.createAmendDataStoreFromText(item);
				
			}
			
			if(this.dataList.length > 0 && this.dataList[0].verb == "REPALL"){
				if(misys._config.codeword_enabled == true){
					dijit.byId("adr_1").set("disabled", false).set("value", false);
					dijit.byId("adr_2").set("disabled", false).set("value", false);
					dijit.byId("adr_3").set("disabled", false).set("value", false);
					dijit.byId("narrative_description_goods_popup").set("value","/REPALL/");
				}else{
					dijit.byId("narrative_description_goods_popup").set("value","");
				}
				dijit.byId("narrative_description_goods_popup").set("disabled",true);
			}
			// Create data grid
			this.gridId = "";
			
			this.inherited(arguments);
			
			this.dataList = [];
			
			console.debug("[Customers] createDataGrid start");
			
		},
    	
		editGridData: function(items, request)
		{
			misys._config.prevEditedItemIndex = misys._config.editedItemIndex;
			misys._config.editedItemIndex = -1;
			console.debug("[Customers] openDialogFromExistingItem start");
			var count = 0;
			for(var itr = 0; itr < request.store._arrayOfAllItems.length; itr++){
				count = request.store._arrayOfAllItems[itr] == null ? count + 1 : count;
			}
			for(itr = 0; itr < request.store._arrayOfAllItems.length; itr++){
				if(request.store._arrayOfAllItems[itr] != null && request.store._arrayOfAllItems[itr].store_id[0] === items[0].store_id[0]){
					count > 0 ? misys._config.editedItemIndex = misys._config.prevEditedItemIndex : misys._config.editedItemIndex = itr;
					break;
				}
			}
			
			this.inherited(arguments);

			console.debug("[Customers] openDialogFromExistingItem end");
		},

		clear : function(){
			console.debug("STORE clear start");
			
			this.inherited(arguments);
			
			console.debug("STORE clear end");
		},
		
		addItem: function(event)
		{
			console.debug("[Customers] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[Customers] addItem end");
		},
		updateData: function()
		{
			
			// TODO: Handle edit event
			console.debug("[Customers] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[Customers] updateData end");
			
		},
		deleteData: function()
		{
			
			// TODO: Handle edit event
			console.debug("[Customers] deleteData start");
			
			if(dijit.byId("amendments").data.items.length == 0){
				if(misys._config.codeword_enabled == true){
					if(dijit.byId("narrative_description_goods_popup").get("value") !== "" || (dijit.byId("narrative_description_goods_popup").get("value") === "" && dijit.byId("narrative_description_goods_popup").disabled === true)){
						dijit.byId("narrative_description_goods_popup").set("disabled",false);
						dijit.byId("adr_1").set("disabled", false);
						dijit.byId("adr_2").set("disabled", false);
						dijit.byId("adr_3").set("disabled", false);
						if(dijit.byId("adr_1").checked){
							dijit.byId("adr_2").set("value",false);
							dijit.byId("adr_3").set("value",false);
							dijit.byId("adr_1").set("value",true);
						}
						else if(dijit.byId("adr_2").checked){
							dijit.byId("adr_1").set("value",false);
							dijit.byId("adr_3").set("value",false);
						}
						else{
							dijit.byId("adr_1").set("value",false);
							dijit.byId("adr_2").set("value",false);
						}
					}
				}else{
					dijit.byId("narrative_description_goods_popup").set("disabled",false);
					dijit.byId("narrative_description_goods_popup").set("value","");
				}
			}
			
			console.debug("[Customers] deleteData end");
			
		}
	}
);