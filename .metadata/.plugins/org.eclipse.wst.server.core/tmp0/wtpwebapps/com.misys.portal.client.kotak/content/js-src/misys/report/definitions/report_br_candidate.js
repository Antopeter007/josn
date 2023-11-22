dojo.provide("misys.report.definitions.report_bg_candidate");


		// Copyright (c) 2000-2012 Misys (http://www.misys.com),
		// All Rights Reserved. 
	
		//
		// BR candidate
		//report

		// Define an array which stores the BR columns
		

		arrProductColumn["BR"][0] = "ref_id";
		arrProductColumn["BR"][1] = "template_id";
		arrProductColumn["BR"][2] = "bo_ref_id";
		arrProductColumn["BR"][3] = "cust_ref_id";
		arrProductColumn["BR"][7] = "prod_stat_code";
		arrProductColumn["BR"][17] = "appl_date";
		arrProductColumn["BR"][18] = "iss_date";
		arrProductColumn["BR"][19] = "iss_date_type_code";
		arrProductColumn["BR"][20] = "iss_date_type_details";
		arrProductColumn["BR"][21] = "exp_date";
		arrProductColumn["BR"][22] = "exp_date_type_code";
		arrProductColumn["BR"][23] = "amd_date";
		arrProductColumn["BR"][24] = "amd_no";
		arrProductColumn["BR"][25] = "bg_cur_code";
		arrProductColumn["BR"][26] = "bg_amt";
		
		arrProductColumn["BR"][27] = "entity";
		arrProductColumn["BR"][28] = "applicant_name";
		arrProductColumn["BR"][29] = "applicant_address_line_1";
		arrProductColumn["BR"][30] = "applicant_address_line_2";
		arrProductColumn["BR"][31] = "applicant_dom";
		arrProductColumn["BR"][32] = "applicant_country";
		arrProductColumn["BR"][33] = "applicant_reference";
		
		arrProductColumn["BR"][34] = "beneficiary_name";
		arrProductColumn["BR"][35] = "beneficiary_address_line_1";
		arrProductColumn["BR"][36] = "beneficiary_address_line_2";
		arrProductColumn["BR"][37] = "beneficiary_dom";
		arrProductColumn["BR"][38] = "beneficiary_country";
		arrProductColumn["BR"][39] = "beneficiary_reference";
		
		arrProductColumn["BR"][40] = "bg_liab_amt";
		arrProductColumn["BR"][41] = "bg_type_code";
		arrProductColumn["BR"][42] = "bg_type_details";
		arrProductColumn["BR"][43] = "bg_rule";
		arrProductColumn["BR"][44] = "bg_text_type_code";
		arrProductColumn["BR"][45] = "bg_text_type_details";
		arrProductColumn["BR"][46] = "text_language";
		arrProductColumn["BR"][47] = "text_language_other";
		
		arrProductColumn["BR"][48] = "bg_release_flag";
		
		arrProductColumn["BR"][49] = "issuing_bank_type_code";
		arrProductColumn["BR"][50] = "adv_send_mode";
		arrProductColumn["BR"][51] = "contract_ref";
		arrProductColumn["BR"][52] = "contract_date";
		arrProductColumn["BR"][53] = "contract_amt";
		arrProductColumn["BR"][54] = "contract_cur_code";
		arrProductColumn["BR"][55] = "contract_pct";
		arrProductColumn["BR"][56] = "principal_act_no";
		arrProductColumn["BR"][57] = "fee_act_no";
		
		arrProductColumn["BR"][58] = "bg_rule_other";
		
		arrProductColumn["BR"][70] = "IssuingBank@name";
		arrProductColumn["BR"][71] = "IssuingBank@address_line_1";
		arrProductColumn["BR"][72] = "IssuingBank@address_line_2";
		arrProductColumn["BR"][73] = "IssuingBank@dom";
		
		arrProductColumn["BR"][77] = "AdvisingBank@name";
		arrProductColumn["BR"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["BR"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["BR"][80] = "AdvisingBank@dom";
		arrProductColumn["BR"][81] = "adv_bank_conf_req";
		
		arrProductColumn["BR"][90] = "RecipientBank@abbv_name";
		arrProductColumn["BR"][91] = "RecipientBank@name";
		arrProductColumn["BR"][92] = "RecipientBank@address_line_1";
		arrProductColumn["BR"][93] = "RecipientBank@address_line_2";
		arrProductColumn["BR"][94] = "RecipientBank@dom";
		
		arrProductColumn["BR"][98] = "ConfirmingBank@name";
		arrProductColumn["BR"][99] = "ConfirmingBank@address_line_1";
		arrProductColumn["BR"][100] = "ConfirmingBank@address_line_2";
		arrProductColumn["BR"][101] = "ConfirmingBank@dom";
		
		//arrProductColumn["BR"][104] = "Narrative@additionalInstructions";
		
		arrProductColumn["BR"][110]= "Charge@chrg_code";
		arrProductColumn["BR"][111]= "Charge@amt";
		arrProductColumn["BR"][112]= "Charge@cur_code";
		arrProductColumn["BR"][113]= "Charge@status";
		arrProductColumn["BR"][114] = "Charge@additional_comment";
		arrProductColumn["BR"][115] = "Charge@settlement_date";
		arrProductColumn["BR"][116] = "doc_ref_no";
		arrProductColumn["BR"][119] = "related_ref";
		arrProductColumn["BR"][121] = "renew_flag";
		arrProductColumn["BR"][122] = "renew_on_code";
		arrProductColumn["BR"][123] = "renewal_calendar_date";
		arrProductColumn["BR"][124] = "renew_for_nb";
		arrProductColumn["BR"][125] = "renew_for_period";
		arrProductColumn["BR"][126] = "advise_renewal_flag";
		arrProductColumn["BR"][127] = "advise_renewal_days_nb";
		arrProductColumn["BR"][128] = "rolling_renewal_flag";
		arrProductColumn["BR"][129] = "rolling_renewal_nb";
		arrProductColumn["BR"][130] = "rolling_cancellation_days";
		arrProductColumn["BR"][131] = "renew_amt_code";
		arrProductColumn["BR"][132] = "rolling_renew_on_code";
		arrProductColumn["BR"][133] = "rolling_renew_for_nb";
		arrProductColumn["BR"][134] = "rolling_renew_for_period";
		arrProductColumn["BR"][135] = "rolling_day_in_month";
		arrProductColumn["BR"][136] = "projected_expiry_date";
		arrProductColumn["BR"][137] = "final_expiry_date";
		arrProductColumn["BR"][138] = "contract_narrative";
		arrProductColumn["BR"][139] = "tender_expiry_date";
		arrProductColumn["BR"][140] = "bg_available_amt";
		arrProductColumn["BR"][241]= "adv_send_mode_text";
		
		
		
		// Object Data
		/*arrProductColumn["BR"][116] = "ObjectDataString@mur_codes_sent";
		arrProductColumn["BR"][117] = "ObjectDataString@mur_codes_ack";
		arrProductColumn["BR"][118] = "ObjectDataString@mur_codes_nak";
		
		arrProductColumn["BR"][160] = "exp_event";
		arrProductColumn["BR"][161] = "reduction_authorised";
		arrProductColumn["BR"][162] = "reduction_clause";
		arrProductColumn["BR"][163] = "reduction_clause_other";
		arrProductColumn["BR"][164] = "contact_name";
		arrProductColumn["BR"][165] = "contact_address_line_1";
		arrProductColumn["BR"][166] = "contact_address_line_2";
		arrProductColumn["BR"][167] = "contact_dom";
		arrProductColumn["BR"][168] = "contact_country";
		arrProductColumn["BR"][169] = "for_account";
		arrProductColumn["BR"][170] = "alt_applicant_name";
		arrProductColumn["BR"][171] = "alt_applicant_address_line_1";
		arrProductColumn["BR"][172] = "alt_applicant_address_line_2";
		arrProductColumn["BR"][173] = "alt_applicant_dom";
		arrProductColumn["BR"][174] = "alt_applicant_country";
		arrProductColumn["BR"][175] = "consortium";
		arrProductColumn["BR"][176] = "net_exposure_cur_code";
		arrProductColumn["BR"][177] = "net_exposure_amt";
		arrProductColumn["BR"][178] = "character_commitment";
		arrProductColumn["BR"][179] = "delivery_to";
		arrProductColumn["BR"][180] = "delivery_to_other";*/
		
		//
		// BG Transaction candidate
		//

		// Define an array which stores the BG Transaction columns
		

		arrProductColumn["BRTnx"][0] = "ref_id";
		arrProductColumn["BRTnx"][1] = "template_id";
		arrProductColumn["BRTnx"][2] = "bo_ref_id";
		arrProductColumn["BRTnx"][3] = "bo_tnx_id";
		arrProductColumn["BRTnx"][4] = "cust_ref_id";
		arrProductColumn["BRTnx"][5] = "tnx_type_code";
		arrProductColumn["BRTnx"][6] = "sub_tnx_type_code";
		arrProductColumn["BRTnx"][7] = "prod_stat_code";
		arrProductColumn["BRTnx"][14] = "tnx_val_date";
		arrProductColumn["BRTnx"][15] = "tnx_amt";
		arrProductColumn["BRTnx"][16] = "tnx_cur_code";
		arrProductColumn["BRTnx"][17] = "tnx_stat_code";
		
		arrProductColumn["BRTnx"][18] = "appl_date";
		arrProductColumn["BRTnx"][19] = "iss_date";
		arrProductColumn["BRTnx"][20] = "iss_date_type_code";
		arrProductColumn["BRTnx"][21] = "iss_date_type_details";
		arrProductColumn["BRTnx"][22] = "exp_date";
		arrProductColumn["BRTnx"][23] = "exp_date_type_code";
		arrProductColumn["BRTnx"][24] = "amd_date";
		arrProductColumn["BRTnx"][25] = "amd_no";
		arrProductColumn["BRTnx"][26] = "bg_cur_code";
		arrProductColumn["BRTnx"][27] = "bg_amt";
		arrProductColumn["BRTnx"][28] = "bg_liab_amt";
		arrProductColumn["BRTnx"][29] = "bg_type_code";
		arrProductColumn["BRTnx"][30] = "bg_type_details";
		arrProductColumn["BRTnx"][31] = "bg_rule";
		arrProductColumn["BRTnx"][32] = "bg_text_type_code";
		arrProductColumn["BRTnx"][33] = "bg_text_type_details";
		arrProductColumn["BRTnx"][34] = "bg_release_flag";
		arrProductColumn["BRTnx"][35] = "entity";
		arrProductColumn["BRTnx"][36] = "beneficiary_name";
		arrProductColumn["BRTnx"][37] = "beneficiary_address_line_1";
		arrProductColumn["BRTnx"][38] = "beneficiary_address_line_2";
		arrProductColumn["BRTnx"][39] = "beneficiary_dom";
		arrProductColumn["BRTnx"][40] = "beneficiary_country";
		arrProductColumn["BRTnx"][41] = "beneficiary_reference";
		
		arrProductColumn["BRTnx"][42] = "applicant_name";
		arrProductColumn["BRTnx"][43] = "applicant_address_line_1";
		arrProductColumn["BRTnx"][44] = "applicant_address_line_2";
		arrProductColumn["BRTnx"][45] = "applicant_dom";
		arrProductColumn["BRTnx"][46] = "applicant_country";
		arrProductColumn["BRTnx"][47] = "applicant_reference";
		
		arrProductColumn["BRTnx"][48] = "issuing_bank_type_code";
		
		arrProductColumn["BRTnx"][49] = "contract_ref";
		arrProductColumn["BRTnx"][50] = "contract_date";
		arrProductColumn["BRTnx"][51] = "contract_amt";
		arrProductColumn["BRTnx"][52] = "contract_cur_code";
		arrProductColumn["BRTnx"][53] = "contract_pct";
		arrProductColumn["BRTnx"][54] = "principal_act_no";
		arrProductColumn["BRTnx"][55] = "fee_act_no";
		
		arrProductColumn["BRTnx"][56] = "text_language";
		arrProductColumn["BRTnx"][57] = "text_language_other";
		
		arrProductColumn["BRTnx"][58] = "bg_rule_other";
		
		arrProductColumn["BRTnx"][70] = "IssuingBank@name";
		arrProductColumn["BRTnx"][71] = "IssuingBank@address_line_1";
		arrProductColumn["BRTnx"][72] = "IssuingBank@address_line_2";
		arrProductColumn["BRTnx"][73] = "IssuingBank@dom";
		
		arrProductColumn["BRTnx"][77] = "AdvisingBank@name";
		arrProductColumn["BRTnx"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["BRTnx"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["BRTnx"][80] = "AdvisingBank@dom";
		arrProductColumn["BRTnx"][81] = "adv_bank_conf_req";
		
		arrProductColumn["BRTnx"][90] = "RecipientBank@abbv_name";
		arrProductColumn["BRTnx"][91] = "RecipientBank@name";
		arrProductColumn["BRTnx"][92] = "RecipientBank@address_line_1";
		arrProductColumn["BRTnx"][93] = "RecipientBank@address_line_2";
		arrProductColumn["BRTnx"][94] = "RecipientBank@dom";
		
		arrProductColumn["BRTnx"][98] = "ConfirmingBank@name";
		arrProductColumn["BRTnx"][99] = "ConfirmingBank@address_line_1";
		arrProductColumn["BRTnx"][100] = "ConfirmingBank@address_line_2";
		arrProductColumn["BRTnx"][101] = "ConfirmingBank@dom";
		
	/*	arrProductColumn["BRTnx"][104] = "Narrative@additionalInstructions";
		arrProductColumn["BRTnx"][105] = "Narrative@boComment";
		arrProductColumn["BRTnx"][106] = "Narrative@freeFormatText";
		arrProductColumn["BRTnx"][107] = "Narrative@amdDetails";		
*/
		arrProductColumn["BRTnx"][130] = "Inputter@last_name";
		arrProductColumn["BRTnx"][131] = "Inputter@first_name";
		arrProductColumn["BRTnx"][132] = "inp_dttm";
		/*arrProductColumn["BRTnx"][133] = "Controller@last_name";
		arrProductColumn["BRTnx"][134] = "Controller@first_name";*/
		arrProductColumn["BRTnx"][135] = "LastController@validation_dttm";
		arrProductColumn["BRTnx"][136] = "Releaser@last_name";
		arrProductColumn["BRTnx"][137] = "Releaser@first_name";
		arrProductColumn["BRTnx"][138] = "release_dttm";

		arrProductColumn["BRTnx"][139] = "Charge@chrg_code";
		arrProductColumn["BRTnx"][140] = "Charge@amt";
		arrProductColumn["BRTnx"][141] = "Charge@cur_code";
		arrProductColumn["BRTnx"][142] = "Charge@status";
		arrProductColumn["BRTnx"][143] = "Charge@additional_comment";
		arrProductColumn["BRTnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["BRTnx"][145] = "bo_release_dttm";
		
		// Object Data
		arrProductColumn["BRTnx"][146] = "ObjectDataString@mur_codes_sent";
		arrProductColumn["BRTnx"][147] = "ObjectDataString@mur_codes_ack";
		arrProductColumn["BRTnx"][148] = "ObjectDataString@mur_codes_nak";
		arrProductColumn["BRTnx"][161] = "sub_tnx_stat_code";
		arrProductColumn["BRTnx"][162] = "doc_ref_no";
		arrProductColumn["BRTnx"][163] = "related_ref";
		arrProductColumn["BRTnx"][164] = "renew_flag";
		arrProductColumn["BRTnx"][165] = "renew_on_code";
		arrProductColumn["BRTnx"][166] = "renewal_calendar_date";
		arrProductColumn["BRTnx"][167] = "renew_for_nb";
		arrProductColumn["BRTnx"][168] = "renew_for_period";
		arrProductColumn["BRTnx"][169] = "advise_renewal_flag";
		arrProductColumn["BRTnx"][170] = "advise_renewal_days_nb";
		arrProductColumn["BRTnx"][171] = "rolling_renewal_flag";
		arrProductColumn["BRTnx"][172] = "rolling_renewal_nb";
		arrProductColumn["BRTnx"][173] = "rolling_cancellation_days";
		arrProductColumn["BRTnx"][174] = "renew_amt_code";
		arrProductColumn["BRTnx"][175] = "rolling_renew_on_code";
		arrProductColumn["BRTnx"][176] = "rolling_renew_for_nb";
		arrProductColumn["BRTnx"][177] = "rolling_renew_for_period";
		arrProductColumn["BRTnx"][178] = "rolling_day_in_month";
		arrProductColumn["BRTnx"][179] = "projected_expiry_date";
		arrProductColumn["BRTnx"][180] = "final_expiry_date";
		arrProductColumn["BRTnx"][181] = "contract_narrative";
		arrProductColumn["BRTnx"][182] = "tender_expiry_date";
		arrProductColumn["BRTnx"][183] = "bg_available_amt";
		arrProductColumn["BRTnx"][204] = "LastController@LastControllerUser@first_name";
		arrProductColumn["BRTnx"][205] = "LastController@LastControllerUser@last_name";
		arrProductColumn["BRTnx"][266]= "adv_send_mode_text";
		
	
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["BR"][120] = "beneficiary_country";
		//arrProductColumn["BR"][121] = "applicant_country";
		
		//arrProductColumn["BRTnx"][150] = "beneficiary_country";
		//arrProductColumn["BRTnx"][151] = "applicant_country";
		
		/*arrProductColumn["BRTnx"][160] = "exp_event";
		arrProductColumn["BRTnx"][161] = "reduction_authorised";
		arrProductColumn["BRTnx"][162] = "reduction_clause";
		arrProductColumn["BRTnx"][163] = "reduction_clause_other";
		arrProductColumn["BRTnx"][164] = "contact_name";
		arrProductColumn["BRTnx"][165] = "contact_address_line_1";
		arrProductColumn["BRTnx"][166] = "contact_address_line_2";
		arrProductColumn["BRTnx"][167] = "contact_dom";
		arrProductColumn["BRTnx"][168] = "contact_country";
		arrProductColumn["BRTnx"][169] = "for_account";
		arrProductColumn["BRTnx"][170] = "alt_applicant_name";
		arrProductColumn["BRTnx"][171] = "alt_applicant_address_line_1";
		arrProductColumn["BRTnx"][172] = "alt_applicant_address_line_2";
		arrProductColumn["BRTnx"][173] = "alt_applicant_dom";
		arrProductColumn["BRTnx"][174] = "alt_applicant_country";
		arrProductColumn["BRTnx"][175] = "consortium";
		arrProductColumn["BRTnx"][176] = "net_exposure_cur_code";
		arrProductColumn["BRTnx"][177] = "net_exposure_amt";
		arrProductColumn["BRTnx"][178] = "character_commitment";
		arrProductColumn["BRTnx"][179] = "delivery_to";
		arrProductColumn["BRTnx"][180] = "delivery_to_other";*/
