dojo.provide("misys.purchaseorder.FormPurchaseOrderEvents");

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {

	// Private functions and variables
	

	var _getValueAsNumber = function(value){
		if (d.isString(value))
		{
			return d.currency.parse(value);
		}
		return value;
	};
	// Compute PO Net Amount from Total Amount and PO Allowances
	var _fncComputePONetAmount = function ()
	{
	    var totalAmt = dj.byId("fake_total_amt").get("value");
		var netAmt = _getValueAsNumber(totalAmt);
		if (netAmt >= 0 ){
			dj.byId("total_net_amt").set("value", netAmt);
			dj.byId("lc_amt").set("value", netAmt);
		}else {
			dj.byId("total_net_amt").set("value", "");

		}
	};
// Compute Line Item Net Amount from Total Amount and Adjustments.
	var _fncComputeLineItemNetAmount = function ()
	{
		var totalAmt = dj.byId("line_item_total_amt").get("value");
	    if ("S"+totalAmt=="S")
		{
		  return;
		}
	    var netAmt = _getValueAsNumber(totalAmt);
		if (netAmt < 0)
		{
		  netAmt = 0;
		}
		if(dj.byId("line_item_total_net_amt"))
		{
		  dj.byId("line_item_total_net_amt").set("value", netAmt);
		}
		m.computePOTotalAmount();
	};
	var	_fncRemoveItemsWithCurrency = function()
	{
		// Remove line items
		dj.byId("line-items").clear();
		// Delete also adjustments, taxes and freight charges and payments
		// Update total goods amount
		dj.byId("fake_total_cur_code").set("value", "");
		// Update total net amount
		dj.byId("total_net_cur_code").set("value", "");
	};
	// Function that changes the routing summary divs display and empty all the field populated
	// in the old div.
/*
 * Value constants for the field credit_available_with_bank_type 
 */
/************ Public  Function *************************/
	
	d.mixin(m, {
			toggleDisableButtons : function() {
			if(dj.byId("po_activated") && dj.byId("po_activated").checked){
				if(dj.byId("lc_cur_code").get("value")!== ""){
					var totalCurCodeField = dj.byId("po_activated");
					var widget = dj.byId("line-items");
					if (widget && widget.addButtonNode && totalCurCodeField) {
						widget.addButtonNode.set("disabled", totalCurCodeField.get("value") === false);
					}
					dj.byId("lc_amt").set("readOnly" , true);
				}
				else{
					misys.dialog.show('ERROR', misys.getLocalization('purchaseOrderCurrencyMustError'));
					dj.byId("po_activated").set("checked" , false);
				}
				
			}
			else{
				totalCurCodeField = dj.byId("po_activated");
				widget = dj.byId("line-items");
				if (widget && widget.addButtonNode && totalCurCodeField) {
					widget.addButtonNode.set("disabled", totalCurCodeField.get("value") === false);
				}
				if(dj.byId("lc_amt")){
				dj.byId("lc_amt").set("readOnly" , false);
				}
			}
		},
		saveOldPOCurrency : function() {
			var poCurCodeField = dj.byId('lc_cur_code');
			var poCurCode = poCurCodeField.get('value');
			poCurCodeField.set('old_value', poCurCode);
		},
		managePOCurrency : function() {
			if(dj.byId('lc_cur_code')){
			var poCurCode = dj.byId('lc_cur_code').get('value');
			var oldPoCurCode = dj.byId('lc_cur_code').get('old_value');
			}
			if (poCurCode === '')
			{
				//no message at form opening
				if (oldPoCurCode){
					misys.dialog.show('CONFIRMATION', misys.getLocalization('resetCurrencyConfirmation'), '', _fncRemoveItemsWithCurrency);
					// Revert to the old value of the PO currency when the user clicks on Cancel
					misys.connect(dj.byId('cancelButton'), 'onClick', function(){
						dj.byId('lc_cur_code').set('value', oldPoCurCode);
					});
				}
			}
			else
			{
				// Update total goods amount
				dj.byId('fake_total_cur_code').set('value', poCurCode);
				// Update total net amount
				dj.byId('total_net_cur_code').set('value', poCurCode);
				// Update transaction amount currency (used in Invoice on the bank side)
				if(dj.byId('tnx_cur_code')){
					dj.byId('tnx_cur_code').set('value', poCurCode);
				}
				// Update Outstanding amount currency (used in Invoice on the bank side)
				if(dj.byId('liab_total_cur_code')){
					dj.byId('liab_total_cur_code').set('value', poCurCode);
				}
				// Update total amount currency (used in Invoice on the bank side)
				if(dj.byId('total_net_inv_cur_code')){
					dj.byId('total_net_inv_cur_code').set('value', poCurCode);
				}
				if(dj.byId("order_total_cur_code"))
				{
					dj.byId("order_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("accpt_total_cur_code"))
				{
					dj.byId("accpt_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("outstanding_total_cur_code"))
				{
					dj.byId("outstanding_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("pending_total_cur_code"))
				{
					dj.byId("pending_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("order_total_net_cur_code"))
				{
					dj.byId("order_total_net_cur_code").set("value",poCurCode);
				}
				if(dj.byId("accpt_total_net_cur_code"))
				{
					dj.byId("accpt_total_net_cur_code").set("value",poCurCode);
				}
				if(dj.byId("outstanding_total_net_cur_code"))
				{
					dj.byId("outstanding_total_net_cur_code").set("value",poCurCode);
				}
				if(dj.byId("pending_total_net_cur_code"))
				{
					dj.byId("pending_total_net_cur_code").set("value",poCurCode);
				}
				
			}
		},
		checkLineItemsCurrencyTotalCurrency : function()
		{
			//  summary:
			//  Checks the change in invoice currency against line items currency, if changed then  prompts the user 
			//  private
			var message = misys.getLocalization('resetInvoicePayableCurrency');
			var that = this,
			curCodeDiffFlag = false,
			oldCurCode;
			var lineItem=dj.byId("line-items");
			if(lineItem && lineItem.store && lineItem.store != null && lineItem.store._arrayOfAllItems.length >0)
			{
				if(lineItem.grid && lineItem.grid.store)
				{
					lineItem.grid.store.fetch({
						query: {store_id: '*'},
						onComplete: dojo.hitch(this, function(items, request){
							 d.some(items, function(item){
								 var currentObject = item;
								if(currentObject !== null && currentObject.price_cur_code != that.get("value"))
								{
									curCodeDiffFlag = true;
									oldCurCode = currentObject.price_cur_code;
									return false;
								}
							 });
							if(curCodeDiffFlag)
							{
								var okCallback = function() {
									d.forEach(items, function(item){
										lineItem.grid.store.setValue(item, 'price_cur_code', dj.byId('lc_cur_code').get('value'));
										lineItem.grid.store.setValue(item, 'lc_cur_code', dj.byId('lc_cur_code').get('value'));
										lineItem.grid.store.setValue(item, 'total_net_cur_code', dj.byId('lc_cur_code').get('value'));
										lineItem.grid.store.setValue(item, 'total_cur_code', dj.byId('lc_cur_code').get('value'));
									
									}, lineItem);
									
									lineItem.grid.store.save();
									setTimeout(function(){
										lineItem.renderSections();
										lineItem.grid.render();	
									}, 200);
								};
								var onCancelCallback = function() {
								dj.byId("lc_cur_code").set("value", oldCurCode);
								};
								m.dialog.show("CONFIRMATION", message, '', '', '', '', okCallback, onCancelCallback);
							}
						})
					});
				}
			}
		},
		// Get and format the total Net Amount of a Command Line
		getTotalNetAmount : function(rowIndex, item)
		{
			var value = '';
			if (item && item.total_net_amt !== '')
			{
				// Check if the "item" object have a "total_net_amt" parameter as string (come from server as string) or not
				if (typeof item.total_net_amt[0] === "string") {
					value = item.total_net_amt;
				}
				else if (typeof item.total_net_amt[0] === "number" && isFinite(item.total_net_amt[0])){
					value = dojo.currency.format(item.total_net_amt, {currency: dj.byId("line_item_total_net_cur_code").get("value")});
					value = value.replace(/[A-Za-z]+/g, '');
				}
			}
			return value;
		},
		getQuantity : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				var unity = item.qty_unit_measr_label[0];
				var quantity = item.qty_val[0]; 
				value = quantity + ' ' +unity;
			}
			return value;
		},
		getPriceAmount : function(rowIndex, item)
		{
			var value = '';
			if (item && item.price_amt !== '')
			{
				// Check if the "item" object have a "total_net_amt" parameter as string (come from server as string) or not
				if (typeof item.price_amt[0] === "string") {
					value = item.price_amt;
					
				}
				else if (typeof item.price_amt[0] === "number" && isFinite(item.price_amt[0])){
					value = dojo.currency.format(item.price_amt, {currency: dj.byId("line_item_price_cur_code").get("value")});
					value = value.replace(/[A-Za-z]+/g, '');
				}
			}
			return value;
		},
		getPaymentType : function(rowIndex, item)
		{
			var value = "";
			var paymentDays='';
			
			
			if(item)
			{
				if ( item.nb_days !==""){
					paymentDays= ' (+'+item.nb_days +' ' + m.getLocalization('paymentDays')+ ')';
				}
				if(item.code !== '')
				{
					value = item.label +  paymentDays;
				}
				else if (item.other_paymt_terms !== "")
				{
					value = item.other_paymt_terms + paymentDays;
				}
			}
			return value;
		},
		getContactName : function(rowIndex, item)
		{
			var value = '';
			if(item)
			{
				return m.getLocalization(item.name_prefix) + ' ' + item.name_value;
			}
			return value;
		},
		//
		// Manage the display of the amount/rate
		//
		getPaymentAmountRate : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				if(item.pct !== "")
				{
					value = "+"+item.pct+"%";
				}
				else if (item.amt !== "")
				{
					// Check if the "item" object have a "amt" parameter as string (come from server as string) or not
					if (typeof item.amt[0] ==="string")
					{
						value = "+"+item.amt;
					}
					else if (typeof item.amt[0] === "number" && isFinite(item.amt[0]))
					{
						value = "+"+dojo.currency.format(item.amt);
					}
				}
			}
			return value;
		},
		//
		// Manage the display of the amount/rate
		//
		getAmountRate : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				if(item.rate !== "")
				{
					value = '+' + item.rate+'%';
				}
				else if (item.amt !== "")
				{
					// Check if the "item" object have a "amt" parameter as string (come from server as string) or not
					if (typeof item.amt[0] === "string") {
						value = "+" + item.amt;
					}
					else if (typeof item.amt[0] === "number" && isFinite(item.amt[0])){
						value = "+"+dojo.currency.format(item.amt, {currency: dj.byId("adjustment_cur_code").get("value")});
						value = value.replace(/[A-Za-z]+/g, '');
					}
				}
			}
			return value;
		},
		//Compute Line Item Amount from Unit Price and Quantity
		computeLineItemAmount : function ()
		{
			console.debug('[m.computeLineItemAmount]');
			var nbDec = dj.byId("line_item_total_cur_code").get("value");
			var quantity =  dj.byId("line_item_qty_val").get("value");
			var measureUnit = dj.byId("line_item_qty_unit_measr_code").get("value");
			var basePriceMeasureUnit = dj.byId("line_item_price_unit_measr_code").get("value");
			var basePrice = dj.byId("line_item_price_amt").get("value");
			var tempAmount = dj.byId("line_item_total_amt").get("value");
			if (basePrice && quantity)
			{
				tempAmount=(quantity * basePrice);
				if(tempAmount.toString().split(".")[0].length >13) {
					m.dialog.show("ERROR", m.getLocalization("lineItemNetAmountOutOfRange"));
					dj.byId("line_item_total_amt").set("value", "");
					return;
				}
				dj.byId("line_item_total_amt").set("readonly",true);
			}
			else
			{
				tempAmount = "";
				dj.byId("line_item_total_amt").set("readonly",false);
			}

			dj.byId("line_item_total_amt").set("value", tempAmount);

			// Compute Line Item Total Net Amount
			_fncComputeLineItemNetAmount();
	},
		fncUpdateDescriptionOfGoods : function(){
			var lineItem=dj.byId("line-items");
			console.debug('[m.fncUpdateDescriptionOfGoods]');
			if(lineItem && lineItem.store && lineItem.store != null && lineItem.store._arrayOfAllItems.length >0){
				
				dj.byId("narrative_description_goods").set("value" , '');
				lineItem.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
						for(var item in items){
							var lineitem = items[item];
							
							var nbDec = lineitem.total_cur_code;
							var quantity =  lineitem.qty_val;
							var measureUnit = lineitem.qty_unit_measr_code ;
							var basePriceMeasureUnit = lineitem.price_unit_measr_code;
							var basePrice = lineitem.price_amt;
							var desc= lineitem.product_name;
							if(lineitem.product_name)
								{
								desc =dojox.html.entities.decode(String(lineitem.product_name), dojox.html.entities.html);
								}
							var posTol = '';
							var negTol = '';
														
							if((lineitem.qty_tol_pstv_pct) && (lineitem.qty_tol_pstv_pct)!== '' && !isNaN(lineitem.qty_tol_pstv_pct))
							{
							posTol  =  "(Tolerance: +" + lineitem.qty_tol_pstv_pct+ ")";
							}

							if((lineitem.qty_tol_neg_pct) && (lineitem.qty_tol_neg_pct)!== '' && !isNaN(lineitem.qty_tol_neg_pct)){
														
							negTol = "(Tolerance: -" + lineitem.qty_tol_neg_pct + ")";
							}
							
							if(quantity && measureUnit && basePriceMeasureUnit && basePrice && desc){
								var oldNarrative = dj.byId("narrative_description_goods").get("value");
								var narrative =  oldNarrative +"\n\r+"+ quantity +"  "+ measureUnit +" of "+desc+"\n\r"+posTol + negTol+" at "+basePrice+" "+nbDec +" per "+basePriceMeasureUnit;
								dj.byId("narrative_description_goods").set("value" , narrative);
							}
								}
					})});
				console.debug('[m.fncUpdateDescriptionOfGoods.ended]');
			}
		},
		//Compute PO Total Amount from Line Items Net Amounts
		computePOTotalAmount : function ()
		{
			console.debug("Start Execute computePOTotalAmount");
		    var totalAmt = 0;
		    var lineItems = dj.byId("line-items");
			if(lineItems && lineItems.grid)
			{
				lineItems.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
					for(var item in items){
						var line = items[item];
						var lineAmt = dojo.isArray(line.total_net_amt)?line.total_net_amt[0]:line.total_net_amt;
						totalAmt = _getValueAsNumber(totalAmt) + _getValueAsNumber(lineAmt);
					}
				})});
			}
			if (totalAmt > 0)
			{
				dj.byId('fake_total_amt').set('value', totalAmt);
				dj.byId('lc_amt').set('value', totalAmt);
				_fncComputePONetAmount();
			}else if(totalAmt === 0){
				dj.byId('fake_total_amt').set('value','0' );
				dj.byId('total_net_amt').set('value', '0');
			}
			else
			{
				dj.byId('fake_total_amt').set('value', '');
				dj.byId('total_net_amt').set('value', '');
			}
			console.debug("End Execute computePOTotalAmount");
		}
	});
})(dojo, dijit, misys);
