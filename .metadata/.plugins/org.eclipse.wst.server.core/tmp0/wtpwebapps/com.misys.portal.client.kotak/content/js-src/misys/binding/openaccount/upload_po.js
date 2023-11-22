dojo.provide("misys.binding.openaccount.upload_po");
/*
----------------------------------------------------------
Event Binding for

  Upload (PO) Form, Customer Side.

----------------------------------------------------------
*/

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m._config, {

		initReAuthParams : function() {
			
			var reAuthParams = {
				productCode : 'PO',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',				
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",				
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {		
		
		bind : function() {			
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_customer_reference", "onChange", m.setBuyerReference);			
			if(dj.byId("issuing_bank_abbv_name")) {
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}			
		},

		onFormLoad : function() {
			// Populate references
			var issuingBankCustRef 	= dj.byId("issuing_bank_customer_reference"),
				issuingBankAbbvName = dj.byId("issuing_bank_abbv_name"),
				tempReferenceValue;
			if(issuingBankCustRef)
			{
				tempReferenceValue = issuingBankCustRef.value;
			}
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				issuingBankCustRef.set("value", tempReferenceValue);
			}
		},
		
		beforeSubmitValidations : function(){
			// Check if something has been attached ($attachment-group = "purchaseorderupload")
			if (!dj.byId("attachment-filepurchaseorderupload") || 
					!dj.byId("attachment-filepurchaseorderupload").store ||
					dj.byId("attachment-filepurchaseorderupload").store._arrayOfAllItems.length < 1)
			{
				m._config.onSubmitErrorMsg = m.getLocalization("uploadpoFileRequired");				
				return false;
			}
			return true;
		},
		
		beforeSaveValidations : function(){
			var entity = dj.byId("entity");
			if(entity && entity.get("value") === "")
			{
				return false;
			}
			else
			{
				return true;
			}
		}

	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.upload_po_client');