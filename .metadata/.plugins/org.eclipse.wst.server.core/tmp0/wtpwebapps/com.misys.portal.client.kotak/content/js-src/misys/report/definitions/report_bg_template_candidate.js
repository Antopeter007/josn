dojo.provide("misys.report.definitions.report_bg_template_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
		
		//
		// BG Template candidate
		//
		
		// Define an array which stores the BG Template columns
		

		arrProductColumn["BGTemplate"][1] = "template_id";
		arrProductColumn["BGTemplate"][2] = "template_description";
		arrProductColumn["BGTemplate"][18] = "iss_date";
		arrProductColumn["BGTemplate"][19] = "iss_date_type_code";
		arrProductColumn["BGTemplate"][20] = "iss_date_type_details";
		arrProductColumn["BGTemplate"][21] = "exp_date";
		arrProductColumn["BGTemplate"][22] = "exp_date_type_code";
		arrProductColumn["BGTemplate"][28] = "bg_type_code";
		arrProductColumn["BGTemplate"][29] = "bg_type_details";
		arrProductColumn["BGTemplate"][30] = "bg_rule";
		arrProductColumn["BGTemplate"][31] = "bg_text_type_code";
		arrProductColumn["BGTemplate"][32] = "bg_text_type_details";
		arrProductColumn["BGTemplate"][33] = "bg_release_flag";
		arrProductColumn["BGTemplate"][34] = "text_language";
		arrProductColumn["BGTemplate"][35] = "text_language_other";
		
		
		arrProductColumn["BGTemplate"][36] = "beneficiary_name";
		arrProductColumn["BGTemplate"][37] = "beneficiary_address_line_1";
		arrProductColumn["BGTemplate"][38] = "beneficiary_address_line_2";
		arrProductColumn["BGTemplate"][39] = "beneficiary_dom";
		arrProductColumn["BGTemplate"][40] = "beneficiary_country";
		arrProductColumn["BGTemplate"][41] = "beneficiary_reference";
		
		arrProductColumn["BGTemplate"][42] = "applicant_name";
		arrProductColumn["BGTemplate"][43] = "applicant_address_line_1";
		arrProductColumn["BGTemplate"][44] = "applicant_address_line_2";
		arrProductColumn["BGTemplate"][45] = "applicant_dom";
		arrProductColumn["BGTemplate"][46] = "applicant_country";
		arrProductColumn["BGTemplate"][47] = "applicant_reference";
		
		arrProductColumn["BGTemplate"][48] = "issuing_bank_type_code";
		arrProductColumn["BGTemplate"][49] = "adv_send_mode";
		
		arrProductColumn["BGTemplate"][50] = "bg_rule_other";
				
		arrProductColumn["BGTemplate"][70] = "IssuingBank@name";
		arrProductColumn["BGTemplate"][71] = "IssuingBank@address_line_1";
		arrProductColumn["BGTemplate"][72] = "IssuingBank@address_line_2";
		arrProductColumn["BGTemplate"][73] = "IssuingBank@dom";
		
		arrProductColumn["BGTemplate"][77] = "AdvisingBank@name";
		arrProductColumn["BGTemplate"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["BGTemplate"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["BGTemplate"][80] = "AdvisingBank@dom";
		arrProductColumn["BGTemplate"][81] = "adv_bank_conf_req";
		
		arrProductColumn["BGTemplate"][90] = "RecipientBank@abbv_name";
		arrProductColumn["BGTemplate"][91] = "RecipientBank@name";
		arrProductColumn["BGTemplate"][92] = "RecipientBank@address_line_1";
		arrProductColumn["BGTemplate"][93] = "RecipientBank@address_line_2";
		arrProductColumn["BGTemplate"][94] = "RecipientBank@dom";
		
		arrProductColumn["BGTemplate"][98] = "ConfirmingBank@name";
		arrProductColumn["BGTemplate"][99] = "ConfirmingBank@address_line_1";
		arrProductColumn["BGTemplate"][100] = "ConfirmingBank@address_line_2";
		arrProductColumn["BGTemplate"][101] = "ConfirmingBank@dom";
		
		//arrProductColumn["BGTemplate"][104] = "Narrative@additionalInstructions";
	
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["BGTemplate"][110] = "beneficiary_country";
		//arrProductColumn["BGTemplate"][111] = "applicant_country";
		
		arrProductColumn["BGTemplate"][160] = "exp_event";
		arrProductColumn["BGTemplate"][161] = "reduction_authorised";
		arrProductColumn["BGTemplate"][162] = "reduction_clause";
		arrProductColumn["BGTemplate"][163] = "reduction_clause_other";
		arrProductColumn["BGTemplate"][164] = "contact_name";
		arrProductColumn["BGTemplate"][165] = "contact_address_line_1";
		arrProductColumn["BGTemplate"][166] = "contact_address_line_2";
		arrProductColumn["BGTemplate"][167] = "contact_dom";
		arrProductColumn["BGTemplate"][168] = "contact_country";
		arrProductColumn["BGTemplate"][169] = "for_account";
		arrProductColumn["BGTemplate"][170] = "alt_applicant_name";
		arrProductColumn["BGTemplate"][171] = "alt_applicant_address_line_1";
		arrProductColumn["BGTemplate"][172] = "alt_applicant_address_line_2";
		arrProductColumn["BGTemplate"][173] = "alt_applicant_dom";
		arrProductColumn["BGTemplate"][174] = "alt_applicant_country";
		arrProductColumn["BGTemplate"][175] = "consortium";
		arrProductColumn["BGTemplate"][176] = "net_exposure_cur_code";
		arrProductColumn["BGTemplate"][177] = "net_exposure_amt";
		arrProductColumn["BGTemplate"][178] = "character_commitment";
		arrProductColumn["BGTemplate"][179] = "delivery_to";
		arrProductColumn["BGTemplate"][180] = "delivery_to_other";
		arrProductColumn["BGTemplate"][181] = "final_expiry_date";
		arrProductColumn["BGTemplate"][182] = "contract_ref";
		arrProductColumn["BGTemplate"][183] = "contract_date";
		arrProductColumn["BGTemplate"][184] = "contract_amt";
		arrProductColumn["BGTemplate"][185] = "contract_cur_code";
		arrProductColumn["BGTemplate"][186] = "contract_pct";
		arrProductColumn["BGTemplate"][187] = "contract_narrative";
		arrProductColumn["BGTemplate"][188] = "tender_expiry_date";
		arrProductColumn["BGTemplate"][136] = "adv_send_mode_text";

		
		if (misys._config.shipment_period_standard === false) {
			arrProductColumn["BGTemplate"][189] = "ship_name";
			arrProductColumn["BGTemplate"][190] = "ship_period";
		}
		
