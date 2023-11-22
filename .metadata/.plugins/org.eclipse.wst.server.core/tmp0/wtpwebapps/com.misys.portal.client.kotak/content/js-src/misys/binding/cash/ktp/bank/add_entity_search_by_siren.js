dojo.provide("misys.binding.cash.ktp.bank.add_entity_search_by_siren");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		
		showEntityDialog : function( /*String*/entity,
                /*String[]*/fields, 
                /*String*/product, 
                /*String*/entityContext,
                /*String*/company, 
                /*String*/ featureid, 
                /*String*/ option, 
                /*String*/dimensions, 
                /*String*/title, 
                /*String*/ subProduct,
                /*Boolean*/ isInPopup, 
                /*Boolean*/ closeParent,
                /*String*/ popupPrefix,
                /*String*/ wildCard) {

			var url = "/screen/EntityListPopup",
			query = {},
			contentURL = "/screen/AjaxScreen/action/GetEntities",
			queryStore = {}, grid, gridId, childDialog, onShowCallback;
			
			
			if(closeParent) {
				queryStore.closeParent = closeParent;
				query.closeParent = closeParent;
			}
			
			if (wildCard){
				query.wildcard = wildCard;	
				queryStore.wildcard = wildCard;
			}
			
			if(fields){
				queryStore.fields = fields;
				query.fields = fields;
			}
			
			if(product){
				query.productcode = product;
				queryStore.productcode = product;
			} else {
				query.productcode = "*";
				queryStore.productcode = product;
			}
			if(subProduct){
				query.subproductcode = subProduct;
				queryStore.subproductcode = subProduct;
			} 
			
			if(company){
				query.company = company;
				queryStore.company = company;
			}
			
			if(entityContext){
				query.entitycontext = entityContext;
				queryStore.entitycontext = entityContext;
			}
			
			if(featureid){
				query.featureid = featureid;			
				queryStore.featureid = featureid;
			}
			
			if(option){
				query.option = option;
				queryStore.option = option;
			}
			
			if(popupPrefix) {
				query.popupPrefix = popupPrefix;
				queryStore.popupPrefix = popupPrefix;
			}
			query.dimensions = dimensions;
			
			gridId = entityContext + "entities_grid";
			onShowCallback = function() {
				// Show loading message, otherwise it doesn't necessarily appear
				if(popupPrefix){
					gridId = popupPrefix + gridId;
				}
				grid = dj.byId(gridId);
				console.debug("[misys.form.common] Calling onShowCallback for grid", gridId);
				console.debug("[misys.form.common] Grid content URL is", contentURL);
				grid.showMessage(grid.loadingMessage);
				if(!entityContext || (entityContext !== 'CUSTOMER' && entityContext !== 'ENTITY_SIREN'))
				{
					m.grid.setStoreURL(grid, m.getServletURL(contentURL), queryStore);
				}
				
				m.connect("sy_name", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USERentities_grid'), ['NAME'], ['sy_name']);
					}
				});
				m.connect("sy_abbvname", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USERentities_grid'), ['ABBVNAME'], ['sy_abbvname']);
					}
				});
				m.connect("sy_name", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USER_WITH_ENTITY_WILDCARDentities_grid'), ['NAME'], ['sy_name']);
					}
				});
				m.connect("sy_abbvname", "onKeyPress", function(evnt){
					if(evnt.keyCode === dojo.keys.ENTER){
						m.grid.filter(dj.byId('USER_WITH_ENTITY_WILDCARDentities_grid'), ['ABBVNAME'], ['sy_abbvname']);
					}
				});
			};
			
			if(isInPopup) {
				console.debug("[misys.form.common] Opening a child dialog at URL", url);
				childDialog = dj.byId("childXhrDialog") || new dj.Dialog({
					title: title,
					id: "childXhrDialog",
					href: m.getServletURL(url),
					ioMethod: misys.xhrPost,
					ioArgs: { content: query }
					});
				
				if(onShowCallback) {
					m.dialog.connect(childDialog, "onLoad", onShowCallback);
				}
				m.dialog.connect(childDialog, "onHide", function(){setTimeout(function(){
					m.dialog.disconnect(childDialog);
					childDialog.destroyRecursive();
					}, 2000);
				});
				
				// Offset the dialog from the parent window
				var co = d.coords("xhrDialog");
				childDialog._relativePosition = {
					x: co.x + 30,
					y: co.y + 30
				};
				
				childDialog.show();
			}
			else
			{
				m.dialog.show("URL", "", title, null, onShowCallback, m.getServletURL(url), null, null, query);
			}
		}
	});
	
})(dojo, dijit, misys);
