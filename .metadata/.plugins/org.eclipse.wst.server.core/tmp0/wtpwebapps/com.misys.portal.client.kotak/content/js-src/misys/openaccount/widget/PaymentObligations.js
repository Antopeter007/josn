dojo.provide("misys.openaccount.widget.PaymentObligations");
dojo.experimental("misys.openaccount.widget.PaymentObligations"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentObligation");
/*dojo.require("misys.openaccount.widget.Charges");*/
dojo.require("misys.openaccount.widget.BpoPaymentTerms");
dojo.require("misys.openaccount.widget.DatagridBPO");

/**
 * This widget stores the payment obligation details for the Open account transactions.
 */
dojo.declare("misys.openaccount.widget.PaymentObligations",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("bank-payment-obligation-details-template") ? dojo.byId("bank-payment-obligation-details-template").innerHTML : "",
		dialogId: 'bank-payment-obligation-details-dialog-template',
		dialogAddItemTitle: misys.getLocalization('bank-payment-obligation-dialog'),
		xmlTagName: 'bank_payment_obligation',
		xmlSubTagName: 'PmtOblgtn',
		
		gridColumns: ['obligor_bank', 'recipient_bank',
		              'payment_obligation_amount', 'payment_obligation_percent',
		              'payment_charges_amount','payment_charges_percent',
		              'payment_expiry_date', 'applicable_law_country',
		              'creditor_agent_bic', 'creditor_agent_name',
		              'creditor_street_name','creditor_post_code_identification',
		              'creditor_town_name','creditor_country_sub_div',
		              'creditor_country','creditor_account_type_code',
		              'creditor_account_type_prop','creditor_account_id_iban',
		              'creditor_account_id_bban','creditor_account_id_upic',
		              'creditor_account_id_prop',
		              'creditor_account_cur_code','creditor_account_name',
		              /* ids of radio buttons and check boxes*/
		              'creditor_account_iban','creditor_account_bban',
					  'creditor_account_upic','creditor_account_prop',
					  'creditor_act_type_code','creditor_act_type_prop',
		              'settlement_bic',
		              'settlement_name_address','buyer_bank_bpo',
		              /* ids of inner widgets*/
		              'payment_obligations_paymnt_terms'
		              ],
        
		propertiesMap: {
			
				OblgrBK					: {_fieldName: "obligor_bank"},
				RcptBk					: {_fieldName: "recipient_bank"},				
				XpryDt					: {_fieldName: "payment_expiry_date"},
				AplblLaw				: {_fieldName: "applicable_law_country"},
				ChrgsAmt				: {_fieldName: "payment_charges_amount"},
				ChrgsPctg				: {_fieldName: "payment_charges_percent"},
				OblgnAmt				: {_fieldName: "payment_obligation_amount"},
				OblgnPctg				: {_fieldName: "payment_obligation_percent"},
				Cd						: {_fieldName: "payment_code"},
				NbOfDays				: {_fieldName: "payment_nb_days"},
				Amt						: {_fieldName: "payment_amount"},
				Pctg					: {_fieldName: "payment_percent"},
				BIC						: {_fieldName: "creditor_agent_bic"},
				Nm						: {_fieldName: "creditor_agent_name"},
				StrtNm					: {_fieldName: "creditor_street_name"},
		 		PstCdId					: {_fieldName: "creditor_post_code_identification"},
		 		TwnNm					: {_fieldName: "creditor_town_name"},
		 		CtrySubDvsn 			: {_fieldName: "creditor_country_sub_div"},
		 		Ctry					: {_fieldName: "creditor_country"},
				CrAccTypCd				: {_fieldName: "creditor_account_type_code"},
				Prtry					: {_fieldName: "creditor_account_type_prop"},
				CrAccTyp 				: {_fieldName: "creditor_account_id_type"},
				Id						: {_fieldName: "creditor_account_prop_account_id"},
				Ccy						: {_fieldName: "creditor_account_cur_code"},
				ActNm					: {_fieldName: "creditor_account_name"},
				buyer_bank_bpo			: {_fieldName: "buyer_bank_bpo"},
				paymentTerms			: {_fieldName: "payment_obligations_paymnt_terms", _type: "misys.openaccount.widget.BpoPaymentTerms"}
						
		},
		
		paymentCodeMap : {
				Cd						: {_fieldName: "payment_code"},
				NbOfDays				: {_fieldName: "payment_nb_days"}
		},
		
		settlementTermsMap : {
				BIC						: {_fieldName: "creditor_agent_bic"}			
		},
		
		creditorNameMap : {
				Nm						: {_fieldName: "creditor_agent_name"}
		},
		creditorAddressMap : {
				StrtNm					: {_fieldName: "creditor_street_name"},
		 		PstCdId					: {_fieldName: "creditor_post_code_identification"},
		 		TwnNm					: {_fieldName: "creditor_town_name"},
		 		CtrySubDvsn 			: {_fieldName: "creditor_country_sub_div"},
		 		Ctry					: {_fieldName: "creditor_country"}
		},
		
		creditorAccountMap : {
				Ccy						: {_fieldName: "creditor_account_cur_code"},
				Nm						: {_fieldName: "creditor_account_name"} 		
		},
		
		paymentTermMap : {
				OthrPmtTerms			: {_fieldName: "payment_other_term"}
		},
		
		extraPropertiesMap : {
			Amt							: {_fieldName: "payment_obligation_amount"},
			Pctg						: {_fieldName: "payment_obligation_percent"},
			ChrgsAmt					: {_fieldName: "payment_charges_amount"},
			ChrgsPctg					: {_fieldName: "payment_charges_percent"},
			XpryDt						: {_fieldName: "payment_expiry_date"},
			AplblLaw					: {_fieldName: "applicable_law_country"}
		},
		
		obligorBankMap : {
				BIC 					: {_fieldName: "obligor_bank"}
		},
		
		recipientBankMap : {
				BIC 					: {_fieldName: "recipient_bank"}
		},
		
		creditorAccountTypeMap : {
				Cd						: {_fieldName: "creditor_account_type_code"},
				Prtry					: {_fieldName: "creditor_account_type_prop"}
		},
		
		paymentTermAmountMap : {
			Amt							: {_fieldName: "payment_amount"},
			Pctg						: {_fieldName: "payment_percent"}
		},
		
		creditorAccountIdMap : {
				IBAN 					: {_fieldName: "creditor_account_id_iban"},
				BBAN					: {_fieldName: "creditor_account_id_bban"},
				UPIC					: {_fieldName: "creditor_account_id_upic"},
				PrtryAcct				: {_fieldName: "creditor_account_id_prop"}
		},
		
		layout: [
				{ name: 'obligor_bank', field: 'obligor_bank', width: '10%' },
				{ name: 'recipient_bank', field: 'recipient_bank', width: '30%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
				
		typeMap: {
					'misys.openaccount.widget.BpoPaymentTerms' : {
						'type': Array,
						'deserialize': function(value) {
							var item = {};
							item._type = 'misys.openaccount.widget.BpoPaymentTerms';
							item._values = value;
							return item;
						}
					}
				},
        
		mandatoryFields: [ "obligor_bank", "receipent_bank"],

		startup: function(){
			console.debug("[PaymentObligations] startup start");

			this.inherited(arguments);
			
			console.debug("[PaymentObligations] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentObligations] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			// Specific handling for BPO popup
			if(dijit.byId("payment_obligation_amount") && dijit.byId("oblg_amt") && (dijit.byId("oblg_amt").get("checked") != true)) {
				dijit.byId("payment_obligation_amount").set("disabled",true);
			}
			else if(dijit.byId("payment_obligation_amount")){
				dijit.byId("payment_obligation_amount").set("disabled",false);
			}
			if(dijit.byId("payment_obligation_percent") && dijit.byId("oblg_prct") && (dijit.byId("oblg_prct").get("checked") != true)) {
				dijit.byId("payment_obligation_percent").set("disabled",true);
			}
			else if(dijit.byId("payment_obligation_percent")) {
				dijit.byId("payment_obligation_percent").set("disabled",false);
			}
			
			if(dijit.byId("payment_other_rules") && dijit.byId("other_rule") && (dijit.byId("other_rule").get("checked") != true)) {
				dijit.byId("payment_other_rules").set("disabled",true);
			} 
			else if(dijit.byId("payment_other_rules")) {
				dijit.byId("payment_other_rules").set("disabled",false);
			}
			// BPO : Payment terms
			// Settlement Terms
			if(dijit.byId("creditor_agent_bic") && dijit.byId("settlement_bic") && (dijit.byId("settlement_bic").get("checked") != true)) {
				dijit.byId("creditor_agent_bic").set("disabled",true);
			} 
			else if(dijit.byId("creditor_agent_bic")) {
				dijit.byId("creditor_agent_bic").set("disabled",false);
			}
			if(dijit.byId("creditor_agent_name") && dijit.byId("creditor_street_name") &&
					dijit.byId("creditor_post_code_identification") && dijit.byId("creditor_town_name") && 
					dijit.byId("creditor_country_sub_div") && dijit.byId("creditor_country") &&
					 dijit.byId("settlement_name_address") && (dijit.byId("settlement_name_address").get("checked") != true)) 
			{
				dijit.byId("creditor_agent_name").set("disabled",true);
				dijit.byId("creditor_street_name").set("disabled",true);
				dijit.byId("creditor_post_code_identification").set("disabled",true);
				dijit.byId("creditor_town_name").set("disabled",true);
				dijit.byId("creditor_country_sub_div").set("disabled",true);
				dijit.byId("creditor_country").set("disabled",true);
				dijit.byId("creditor_agent_name").set("required",false);
				dijit.byId("creditor_post_code_identification").set("required",false);
				dijit.byId("creditor_town_name").set("required",false);
				dijit.byId("creditor_country").set("required",false);
			} 
			else if(dijit.byId("creditor_agent_name") && dijit.byId("creditor_street_name") &&
					 dijit.byId("creditor_post_code_identification") && dijit.byId("creditor_town_name") &&
					 dijit.byId("creditor_country_sub_div") && dijit.byId("creditor_country")) {
				dijit.byId("creditor_agent_name").set("disabled",false);
				dijit.byId("creditor_street_name").set("disabled",false);
				dijit.byId("creditor_post_code_identification").set("disabled",false);
				dijit.byId("creditor_town_name").set("disabled",false);
				dijit.byId("creditor_country_sub_div").set("disabled",false);
				dijit.byId("creditor_country").set("disabled",false);
				dijit.byId("creditor_agent_name").set("required",true);
				dijit.byId("creditor_post_code_identification").set("required",true);
				dijit.byId("creditor_town_name").set("required",true);
				dijit.byId("creditor_country").set("required",true);
			}
			
			// BPO :: Creditor Account
			
			if(dijit.byId("buyer_bank_bpo") && dijit.byId("buyer_bank_bpo").get("checked") === true) {
				dijit.byId("buyer_bank_bpo").set("disabled",false);
				dijit.byId("obligor_bank").set("disabled",true);
			}
			else if(dijit.byId("buyer_bank_bpo") && dijit.byId("buyer_bank_bpo_added") && dijit.byId("buyer_bank_bpo").get("checked") === false && dijit.byId("buyer_bank_bpo_added").get("value") ==="true" ) {
				dijit.byId("buyer_bank_bpo").set("disabled",true);
				dijit.byId("obligor_bank").set("disabled",false);
			}
			if(dijit.byId("buyer_bank_bpo") && dijit.byId("buyer_bank_bpo_added") && dijit.byId("buyer_bank_bpo").get("checked") === false && dijit.byId("buyer_bank_bpo_added").get("value") !="true" ) {
				dijit.byId("buyer_bank_bpo").set("disabled",false);
				dijit.byId("obligor_bank").set("disabled",false);
			}
			if(dijit.byId("obligor_bank") && dijit.byId("obligor_bank_hidden"))
			{
				dijit.byId("obligor_bank_hidden").set("value",dijit.byId("obligor_bank").get("value"));
			}
			if(dijit.byId("settlement_bic") && dojo.byId("CreditorAgentBIC") && dijit.byId("settlement_bic").get("checked") === true)
			{
				dojo.style(dojo.byId("CreditorAgentBIC"), "display", "block");
			}
			else if(dojo.byId("CreditorAgentBIC"))
			{
				dojo.style(dojo.byId("CreditorAgentBIC"), "display", "none");
			}
			if(dijit.byId("settlement_name_address") && dojo.byId("CreditorAgentName") && dijit.byId("settlement_name_address").get("checked")=== true)
			{
				dojo.style(dojo.byId("CreditorAgentName"), "display", "block");
			}
			else if (dojo.byId("CreditorAgentName"))
			{
				dojo.style(dojo.byId("CreditorAgentName"), "display", "none");
			}
			
			if(dijit.byId("creditor_account_iban") && dijit.byId("creditor_account_iban").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "block");
				dijit.byId("creditor_account_id_iban").set("required",true);
			}
			else if(dijit.byId("creditor_account_iban")) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "none");
				dijit.byId("creditor_account_id_iban").set("required",false);
			}
			if(dijit.byId("creditor_account_bban") && dijit.byId("creditor_account_bban").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "block");
				dijit.byId("creditor_account_id_bban").set("required",true);
			}
			else if(dijit.byId("creditor_account_bban")) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "none");
				dijit.byId("creditor_account_id_bban").set("required",false);
			}
			if(dijit.byId("creditor_account_upic") && dijit.byId("creditor_account_upic").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "block");
				dijit.byId("creditor_account_id_upic").set("required",true);
			}
			else if(dijit.byId("creditor_account_upic")) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "none");
				dijit.byId("creditor_account_id_upic").set("required",false);
			}
			if(dijit.byId("creditor_account_prop") && dijit.byId("creditor_account_prop").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "block");
				dijit.byId("creditor_account_id_prop").set("required",true);
			}
			else if(dijit.byId("creditor_account_prop")) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "none");
				dijit.byId("creditor_account_id_prop").set("required",false);
			}
			if(dijit.byId("creditor_act_type_prop") && dijit.byId("creditor_act_type_prop").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "block");
				dijit.byId("creditor_account_type_prop").set("required",true);
			}
			else if(dijit.byId("creditor_act_type_prop")) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "none");
				dijit.byId("creditor_account_type_prop").set("required",false);
			}
			if(dijit.byId("creditor_act_type_code") && dijit.byId("creditor_act_type_code").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "block");
				dijit.byId("creditor_account_type_code").set("required",true);
			}
			else if(dijit.byId("creditor_act_type_code")) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "none");
				dijit.byId("creditor_account_type_code").set("required",false);
			}
			
			// Validation that Obligor bank BIC and recipient bank BIC must not be same 
			if(dijit.byId("recipient_bank") && dijit.byId("recipient_bank").get("value")!== "" && dijit.byId("obligor_bank") && dijit.byId("obligor_bank").get("value")!=="") {
				if(dijit.byId("recipient_bank").get("value") === dijit.byId("obligor_bank").get("value")) {
					dijit.byId("recipient_bank").focus();
					displayMessage = misys.getLocalization("obligorRecipientSameBICError");
					dijit.byId("recipient_bank").set("state", "Error");
					dijit.hideTooltip(dj.byId("recipient_bank").domNode);
					dijit.showTooltip(displayMessage,dijit.byId("recipient_bank").domNode, 0);
				}
				else {
					dijit.byId("recipient_bank").set("state","");
				}
			}
			console.debug("[PaymentObligations] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[PaymentObligations] resetDialog start");
			
			this.inherited(arguments);
			if(dijit.byId("seller_bank_bic") && dijit.byId("recipient_bank") && dijit.byId("seller_bank_bic").get("value") != "")
			{
				dijit.byId("recipient_bank").set("value",dijit.byId("seller_bank_bic").get("value"));
				dijit.byId("recipient_bank").set("disabled",true);
			}
			else if(dijit.byId("seller_bank_bic") && dijit.byId("seller_bank_bic").get("value") === "")
			{
				dijit.byId("recipient_bank").set("disabled",false);
			}
			if(dijit.byId("settlement_bic") && dojo.byId("CreditorAgentBIC") && dijit.byId("settlement_bic").get("checked") === true)
			{
				dojo.style(dojo.byId("CreditorAgentBIC"), "display", "block");
			}
			else if (dojo.byId("CreditorAgentBIC"))
			{
				dojo.style(dojo.byId("CreditorAgentBIC"), "display", "none");
			}
			if(dijit.byId("settlement_name_address") && dojo.byId("CreditorAgentName") && dijit.byId("settlement_name_address").get("checked")=== true)
			{
				dojo.style(dojo.byId("CreditorAgentName"), "display", "block");
			}
			else if(dojo.byId("CreditorAgentName"))
			{
				dojo.style(dojo.byId("CreditorAgentName"), "display", "none");
			}
			if(dijit.byId("creditor_account_iban") && dijit.byId("creditor_account_iban").get("checked") === true) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "block");
			}
			else if(dojo.byId("creditor_account_id_iban_row")){
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "none");
			}
			if(dijit.byId("creditor_account_bban") && dijit.byId("creditor_account_bban").get("checked") === true) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "block");
			}
			else if(dojo.byId("creditor_account_id_bban_row")){
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "none");
			}
			if(dijit.byId("creditor_account_upic") && dijit.byId("creditor_account_upic").get("checked") === true) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "block");
			}
			else if(dojo.byId("creditor_account_id_upic_row")){
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "none");
			}
			if(dijit.byId("creditor_account_prop") && dijit.byId("creditor_account_prop").get("checked") === true) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "block");
			}
			else if(dojo.byId("creditor_account_id_prop_row")){
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "none");
			}
			if(dijit.byId("creditor_act_type_code") && dijit.byId("creditor_act_type_code").get("checked") === true) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "block");
			}
			else if(dojo.byId("creditor_account_type_code_row")){
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "none");
			}
			if(dijit.byId("creditor_act_type_prop") && dijit.byId("creditor_act_type_prop").get("checked") === true) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "block");
			}
			else if(dojo.byId("creditor_account_type_prop_row")){
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "none");
			}
			console.debug("[PaymentObligations] resetDialog end");
		},

		addItem: function(event)
		{
			console.debug("[PaymentObligations] addItem start");
			this.inherited(arguments);
			if(dijit.byId("buyer_bank_bpo") && dijit.byId("buyer_bank_bpo_added") && dijit.byId("buyer_bank_bpo").get("checked") === false && dijit.byId("buyer_bank_bpo_added").get("value") === "true")
			{
				dijit.byId("buyer_bank_bpo").set("disabled",true);
			}
			else if(dijit.byId("buyer_bank_bpo") && dijit.byId("buyer_bank_bpo_added") && dijit.byId("buyer_bank_bpo_added").get("value") != "true")
			{
				dijit.byId("buyer_bank_bpo").set("disabled",false);
				dijit.byId("obligor_bank").set("disabled",false);
			}
			if(dijit.byId("buyer_bank_bpo") && dijit.byId("buyer_bank_bpo").get("disabled") === true)
			{
				dijit.byId("obligor_bank").set("disabled",false);
			}
			if(dijit.byId("obligor_bank") && dijit.byId("obligor_bank_hidden"))
			{
				dijit.byId("obligor_bank_hidden").set("value","");
			}
			// BPO : Payment terms
			// Settlement Terms
			if(dijit.byId("creditor_agent_bic") && dijit.byId("settlement_bic") && (dijit.byId("settlement_bic").get("checked") != true)) {
				dijit.byId("creditor_agent_bic").set("disabled",true);
			} 
			else if(dijit.byId("creditor_agent_bic")) {
				dijit.byId("creditor_agent_bic").set("disabled",false);
			}
			if(dijit.byId("creditor_agent_name") && dijit.byId("creditor_street_name") &&
					dijit.byId("creditor_post_code_identification") && dijit.byId("creditor_town_name") && 
					dijit.byId("creditor_country_sub_div") && dijit.byId("creditor_country") &&
					 dijit.byId("settlement_name_address") && (dijit.byId("settlement_name_address").get("checked") != true)) 
			{
				dijit.byId("creditor_agent_name").set("disabled",true);
				dijit.byId("creditor_street_name").set("disabled",true);
				dijit.byId("creditor_post_code_identification").set("disabled",true);
				dijit.byId("creditor_town_name").set("disabled",true);
				dijit.byId("creditor_country_sub_div").set("disabled",true);
				dijit.byId("creditor_country").set("disabled",true);
			} 
			else if(dijit.byId("creditor_agent_name") && dijit.byId("creditor_street_name") &&
					 dijit.byId("creditor_post_code_identification") && dijit.byId("creditor_town_name") &&
					 dijit.byId("creditor_country_sub_div") && dijit.byId("creditor_country")) {
				dijit.byId("creditor_agent_name").set("disabled",false);
				dijit.byId("creditor_street_name").set("disabled",false);
				dijit.byId("creditor_post_code_identification").set("disabled",false);
				dijit.byId("creditor_town_name").set("disabled",false);
				dijit.byId("creditor_country_sub_div").set("disabled",false);
				dijit.byId("creditor_country").set("disabled",false);
			}
			
			if(dijit.byId("creditor_account_iban") && dijit.byId("creditor_account_iban").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "block");
				dijit.byId("creditor_account_id_iban").set("required",true);
			}
			else if(dijit.byId("creditor_account_iban")) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "none");
				dijit.byId("creditor_account_id_iban").set("required",false);
			}
			if(dijit.byId("creditor_account_bban") && dijit.byId("creditor_account_bban").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "block");
				dijit.byId("creditor_account_id_bban").set("required",true);
			}
			else if(dijit.byId("creditor_account_bban")) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "none");
				dijit.byId("creditor_account_id_bban").set("required",false);
			}
			if(dijit.byId("creditor_account_upic") && dijit.byId("creditor_account_upic").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "block");
				dijit.byId("creditor_account_id_upic").set("required",true);
			}
			else if(dijit.byId("creditor_account_upic")) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "none");
				dijit.byId("creditor_account_id_upic").set("required",false);
			}
			if(dijit.byId("creditor_account_prop") && dijit.byId("creditor_account_prop").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "block");
				dijit.byId("creditor_account_id_prop").set("required",true);
			}
			else if(dijit.byId("creditor_account_prop")) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "none");
				dijit.byId("creditor_account_id_prop").set("required",false);
			}
			
			if(dijit.byId("creditor_act_type_prop") && dijit.byId("creditor_act_type_prop").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "block");
				dijit.byId("creditor_account_type_prop").set("required",true);
			}
			else if(dijit.byId("creditor_act_type_prop")) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "none");
				dijit.byId("creditor_account_type_prop").set("required",false);
			}
			if(dijit.byId("creditor_act_type_code") && dijit.byId("creditor_act_type_code").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "block");
				dijit.byId("creditor_account_type_code").set("required",true);
			}
			else if(dijit.byId("creditor_act_type_code")) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "none");
				dijit.byId("creditor_account_type_code").set("required",false);
			}
			console.debug("[PaymentObligations] addItem end");
		},
		updateData: function(event)
		{
			console.debug("[PaymentObligations] updateData start");
			
			this.inherited(arguments);
			misys.updateOpenAccountExpiryDate();
			
			console.debug("[PaymentObligations] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[PaymentObligations] validate start");
			var valid = true;
			
			if(dijit.byId("buyer_bank_bpo_added") && dijit.byId("buyer_bank_bpo_added").get("value") != "true" && dijit.byId("buyer_bank_bpo").get("checked") === true)
			{
				dijit.byId("buyer_bank_bpo_added").set("value",true);
			}
			if(this.validateDialog(true)) {
				if(dijit.byId("payment_obligation_amount") && dijit.byId("payment_obligation_percent") && isNaN(dijit.byId("payment_obligation_amount").get("value")) && isNaN(dijit.byId("payment_obligation_percent").get("value")))
				{
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("amountOrPercentageReq"), "", function(){
						dijit.byId("payment_obligation_amount").set("disabled", false);
						dijit.byId("payment_obligation_amount").focus();
					});
				}
				// Check for mandatory payment terms
				var gridPayments = dijit.byId("payment_obligations_paymnt_terms");
				if(!(gridPayments && gridPayments.store && gridPayments.store._arrayOfTopLevelItems.length > 0)) {
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("addBpoPaymentTerm"), "", function(){
						dijit.byId("dijit_form_Button_96")?dijit.byId("dijit_form_Button_96").focus():"";
					});
				}
				
				if(dijit.byId("creditor_account_id_iban") && dijit.byId("creditor_account_id_iban").get("value") === "" && dijit.byId("creditor_account_id_bban") && dijit.byId("creditor_account_id_bban").get("value") === "" && dijit.byId("creditor_account_id_upic") && dijit.byId("creditor_account_id_upic").get("value") === "" && dijit.byId("creditor_account_id_prop") && dijit.byId("creditor_account_id_prop").get("value") === "") 
				{
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("mandatoryCreditorAccountError"));
				}	
				
				if(valid)
				{
					this.inherited(arguments);
				}
			}
			console.debug("[PaymentObligations] validate end");
		},
		
		createJsonItem: function()
		{
			var jsonEntry = [];
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var item = child.createItem();
						jsonEntry.push(item);
						if (this.get("is_valid") !== "N")
						{
							this.set("is_valid", item.is_valid ? item.is_valid : "Y");
						}
						misys._widgetsToDestroy = misys._widgetsToDestroy || [];
						misys._widgetsToDestroy.push(child.id);
					}
				}, this);
			}
			return jsonEntry;
			
		},
		
		toXML: function(){
			var xml = [];
			if(this.xmlTagName) {
				xml.push("<", this.xmlTagName, ">");
			}
			xml.push("<bpo><![CDATA[");
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items, this.xmlSubTagName));
				})});
			}
			xml.push("]]></bpo>");
			xml.push("<bpo_xml>");
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items, this.xmlSubTagName));
				})});
			}
			xml.push("</bpo_xml>");
			if(this.xmlTagName) {
				xml.push("</", this.xmlTagName, ">");
			}
			return xml.join("");
		},
		
		createDataGrid: function()
		{
			var gridId = this.gridId;
			if(!gridId)
			{
				gridId = 'grid-' + 
							(this.xmlTagName ? this.xmlTagName + '-' : '') + 
							dojox.uuid.generateRandomUuid();
			}
			this.grid = new misys.openaccount.widget.DatagridBPO({
				jsId: gridId,
				id: gridId,
				store: this.store,
				structure: this.layout,
				autoHeight: true,
				selectionMode: 'multiple',
				columnReordering: true,
				autoWidth: true,
				initialWidth: '100%',
				canSort: function(){
					return true;
				},
			 	showMoveOptions:  this.showMoveOptions
			}, document.createElement("div"));
			this.grid.gridMultipleItemsWidget = this;
			
			misys.connect(this.grid, "onStyleRow" , dojo.hitch(this, function(row) {
				var item = this.grid.getItem(row.index);
       
				/*if (!this.checkMandatoryFields(item))
				{
					row.customStyles += "background-color: #F9F7BA !important";
				}*/

				if (item && item.hasOwnProperty("is_valid")) {
                	var isValid = dojo.isArray(item.is_valid) ? item.is_valid[0] : item.is_valid;
                	
                	if(isValid && isValid !== "Y") {
                		// We have to use an inline style, otherwise the row colour 
                		// changes onMouseOver
                		row.customStyles += "background-color: #F9F7BA !important";
                		this.state = "Error";
                	}
                }

                 this.grid.focus.styleRow(row);
                 this.grid.edit.styleRow(row);
            }));
			
			this.addChild(this.grid);
			this.onGridCreate();
		},
		
		itemToXML: function(items, xmlSubTagName)
		{
			var xml = [];
			var chargeXml ='';
			var paymentCodeXml = '';
			var creditorNameAddressXml = '';
			var settlementXml = '';
			var creditorAccXml = '';
			var paymentTermXml = '';
			var creditorAddressXml = '';
			var obligorBankXml = '';
			var recipientBankXml = '';
			var propXml = '';
			var creditorAccountIdXml = '';
			var creditorAccountTypeXml ='';
			var fieldsXml = '';
			var paymentTermsXml = '';
			var flag = false;
			
			dojo.forEach(items, function(item){
				propXml = "";
				obligorBankXml = "";
				recipientBankXml= "";
				chargeXml="";
				paymentCodeXml="";
				creditorNameAddressXml="";
				settlementXml="";
				creditorAccXml="";
				creditorAddressXml="";
				creditorAccountTypeXml = "";
				creditorAccountIdXml="";
				fieldsXml="";
				paymentTermsXml = "<PmtTerms>";
				paymentTermXml = "";
				propXml = propXml.concat("<Prtry>");
				obligorBankXml = obligorBankXml.concat("<OblgrBk>");
				recipientBankXml= recipientBankXml.concat("<RcptBk>");
				chargeXml=chargeXml.concat("<Chrgs>");
				paymentCodeXml=paymentCodeXml.concat("<PmtCd>");
				creditorNameAddressXml=creditorNameAddressXml.concat("<NmAndAdr>");
				settlementXml=settlementXml.concat("<SttlmTerms><CdtrAgt>");
				creditorAddressXml=creditorAddressXml.concat("<Adr>");
				creditorAccountTypeXml = creditorAccountTypeXml.concat("<Tp>");
				creditorAccountIdXml=creditorAccountIdXml.concat("<Id>");
				if(item) {
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					
					for(var property in item)
					{
						flag = false;
						// Otherwise, process a property of the item
						if(property != 'store_id' && property.match('^_') != '_')
						{
							if(property === "payment_obligations_paymnt_terms")
							{
								if(item[property][0] === "")
								{
									paymentCodeXml = paymentCodeXml.concat("</PmtCd>");
									paymentTermsXml = paymentTermsXml.concat(paymentCodeXml).concat('</PmtTerms>');
								}
								else
								{
									var lengthPaymentTerms = item[property][0]._values.length;
									var arrayPaymentTerms = item[property][0]._values;
									if(lengthPaymentTerms === 0)
									{
										//paymentCodeXml=paymentCodeXml.concat("</PmtTerms>");
										paymentTermsXml = paymentTermsXml.concat("</PmtTerms>");
									}
									
									for(var j=0; j<lengthPaymentTerms ; j++)
									{
										var paymentAmtPrctXml = "";
										if(j>0)
										{
											paymentTermXml="";
											paymentCodeXml="";
											paymentTermXml = paymentTermXml.concat("<PmtTerms>");
											paymentCodeXml=paymentCodeXml.concat("<PmtCd>");
										}
										var bpoPaymntTerms = arrayPaymentTerms[j];
										for(var property20 in bpoPaymntTerms) {
											flag = false;
											value = bpoPaymntTerms[property20];
											value += "";
											for(var property8 in this.paymentCodeMap) {
												if(this.paymentCodeMap[property8]._fieldName === property20)
												{
													paymentCodeXml=paymentCodeXml.concat('<').concat(property8).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property8).concat('>');
													flag = true;
													break;
												}
											}
											
											if(flag === true)	 
											{
												continue;
											}
											for(var property12 in this.paymentTermMap) {
												if(this.paymentTermMap[property12]._fieldName === property20)
												{
													paymentTermXml=paymentTermXml.concat('<').concat(property12).concat('>').concat(dojox.html.entities.encode(value.toString(), dojox.html.entities.html)).concat('</').concat(property12).concat('>');
													flag = true;
													break;
												}
											}	
											if(flag === true)	 
											{
												continue;
											}
											for(var property21 in this.paymentTermAmountMap) {
												if(this.paymentTermAmountMap[property21]._fieldName === property20 && "Amt"===property21 && value !== "") {
													var currency = dijit.byId("total_net_cur_code")? dijit.byId("total_net_cur_code").get("value"):"";
													paymentAmtPrctXml= paymentAmtPrctXml.concat('<').concat(property21,' Ccy="',currency,'"').concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property21).concat('>');
												}
												else if(this.paymentTermAmountMap[property21]._fieldName === property20 && value !== "")
												{
													paymentAmtPrctXml= paymentAmtPrctXml.concat('<').concat(property21).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property21).concat('>');
												}
											}
											if(flag === true)	 
											{
												continue;
											}
										}
										paymentCodeXml=paymentCodeXml.concat('</PmtCd>');
										paymentTermsXml = paymentTermsXml.concat(paymentTermXml).concat(paymentCodeXml).concat(paymentAmtPrctXml).concat('</PmtTerms>');
									}
								}
							}
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += "";
							if(property === "buyer_bank_bpo")
							{
								xml.push("<", property, ">", dojox.html.entities.encode(value, dojox.html.entities.html), "</", property, ">");
							}
							for(var prop2 in this.obligorBankMap) {
								if(this.obligorBankMap[prop2]._fieldName === property)
								{
									obligorBankXml =obligorBankXml.concat('<').concat(prop2).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(prop2).concat('>');
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							for(var prop3 in this.recipientBankMap) {
								if(this.recipientBankMap[prop3]._fieldName === property)
								{
									recipientBankXml=recipientBankXml.concat('<').concat(prop3).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(prop3).concat('>');
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							for(var property1 in this.extraPropertiesMap) {
								if(this.extraPropertiesMap[property1]._fieldName === property)
								{
									if(property1 === "XpryDt" && value !== "")
									{
										var strDate = value.split("/");
										var date = new Date(strDate[2],(strDate[1]-1),strDate[0]);
										value = dojo.date.stamp.toISOString(date,{selector: 'date'}); 
									}
									if(("Amt"===property1 || "ChrgsAmt" === property1) && value!== "") {
										var curr = dijit.byId("total_net_cur_code")? dijit.byId("total_net_cur_code").get("value"):"";
										fieldsXml=fieldsXml.concat('<', property1,' Ccy="',curr,'"', '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									}
									else if(value!== "") {
										fieldsXml=fieldsXml.concat('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									}
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							// Append payment terms xml after extraPropertiesMap
							//xml.push(paymentCodeXml);
							
							for(var property10 in this.settlementTermsMap) {
								if(this.settlementTermsMap[property10]._fieldName === property)
								{
									settlementXml=settlementXml.concat('<').concat(property10).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property10).concat('>');
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							for(var property11 in this.creditorNameMap) {
								if(this.creditorNameMap[property11]._fieldName === property)
								{
									creditorNameAddressXml=creditorNameAddressXml.concat('<').concat(property11).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property11).concat('>');
									flag = true;
									break;
								}
							}	
							if(flag === true)	 
							{
								continue;
							}
							for(var property13 in this.creditorAddressMap) {
								if(this.creditorAddressMap[property13]._fieldName === property)
								{
									creditorAddressXml=creditorAddressXml.concat('<').concat(property13).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property13).concat('>');
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							
							
							for(var property15 in this.creditorAccountIdMap) {
								if(this.creditorAccountIdMap[property15]._fieldName === property)
								{
									if(property15 == "PrtryAcct" && value != "") {
										creditorAccountIdXml=creditorAccountIdXml.concat('<').concat(property15).concat('>').concat('<Id>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</Id>').concat('</').concat(property15).concat('>');
									}
									else {	
										creditorAccountIdXml=creditorAccountIdXml.concat('<').concat(property15).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property15).concat('>');
									}
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							
							for(var property17 in this.creditorAccountTypeMap) {
								if(this.creditorAccountTypeMap[property17]._fieldName === property)
								{
									creditorAccountTypeXml=creditorAccountTypeXml.concat('<').concat(property17).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property17).concat('>');
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
							for(var property2 in this.creditorAccountMap) {
								if(this.creditorAccountMap[property2]._fieldName === property)
								{
									creditorAccXml=creditorAccXml.concat('<').concat(property2).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property2).concat('>');
									flag = true;
									break;
								}
							}
							if(flag === true)	 
							{
								continue;
							}
						}
					}
					
					
					creditorAddressXml=creditorAddressXml.concat("</Adr>");
					creditorNameAddressXml=creditorNameAddressXml.concat(creditorAddressXml);
					creditorNameAddressXml=creditorNameAddressXml.concat('</NmAndAdr>');
					
					creditorAccountTypeXml=creditorAccountTypeXml.concat("</Tp>");
					creditorAccountIdXml = creditorAccountIdXml.concat("</Id>");
					
					var creditorAccountXml = "<CdtrAcct>";
					creditorAccountXml= creditorAccountXml.concat(creditorAccountIdXml).concat(creditorAccountTypeXml).concat(creditorAccXml).concat("</CdtrAcct>");
					//creditorAccXml=creditorAccXml.concat(creditorAccountIdXml).concat(creditorAccountTypeXml).concat("</CdtrAcct>");
					settlementXml=settlementXml.concat(creditorNameAddressXml).concat('</CdtrAgt>').concat(creditorAccountXml).concat('</SttlmTerms>');
					
					obligorBankXml=obligorBankXml.concat("</OblgrBk>");
					recipientBankXml=recipientBankXml.concat("</RcptBk>");
					
					xml.push(obligorBankXml,recipientBankXml,fieldsXml,paymentTermsXml,settlementXml);
					
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
							
			return xml.join("");
		}
	}
);