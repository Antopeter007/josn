
dojo.provide("misys.report.definitions.report_iu_template_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
		
		//
		// IU Template candidate
		//
		
		// Define an array which stores the IU Template columns
		

		arrProductColumn["BGTemplate"][1] = "template_id";
		arrProductColumn["BGTemplate"][2] = "template_description";
		arrProductColumn["BGTemplate"][3] = "iss_date_type_code";
		arrProductColumn["BGTemplate"][4] = "exp_date_type_code";
		arrProductColumn["BGTemplate"][5] = "bg_type_code";
		arrProductColumn["BGTemplate"][6] = "bg_type_details";
		arrProductColumn["BGTemplate"][7] = "bg_rule";
		arrProductColumn["BGTemplate"][8] = "bg_text_type_code";
		arrProductColumn["BGTemplate"][9] = "bg_text_type_details";
		arrProductColumn["BGTemplate"][10] = "bg_release_flag";
		arrProductColumn["BGTemplate"][11] = "text_language";
		arrProductColumn["BGTemplate"][12] = "text_language_other";
		
		
		arrProductColumn["BGTemplate"][13] = "beneficiary_name";
		arrProductColumn["BGTemplate"][14] = "beneficiary_address_line_1";
		arrProductColumn["BGTemplate"][15] = "beneficiary_address_line_2";
		arrProductColumn["BGTemplate"][16] = "beneficiary_dom";
		arrProductColumn["BGTemplate"][17] = "beneficiary_country";
		arrProductColumn["BGTemplate"][18] = "beneficiary_reference";
		
		arrProductColumn["BGTemplate"][19] = "applicant_name";
		arrProductColumn["BGTemplate"][20] = "applicant_address_line_1";
		arrProductColumn["BGTemplate"][21] = "applicant_address_line_2";
		arrProductColumn["BGTemplate"][22] = "applicant_dom";
		arrProductColumn["BGTemplate"][23] = "applicant_country";
		arrProductColumn["BGTemplate"][24] = "applicant_reference";
		
		arrProductColumn["BGTemplate"][25] = "issuing_bank_type_code";
		arrProductColumn["BGTemplate"][26] = "adv_send_mode";
		
		arrProductColumn["BGTemplate"][27] = "bg_rule_other";
				
		arrProductColumn["BGTemplate"][28] = "IssuingBank@name";
		arrProductColumn["BGTemplate"][29] = "IssuingBank@address_line_1";
		arrProductColumn["BGTemplate"][30] = "IssuingBank@address_line_2";
		arrProductColumn["BGTemplate"][31] = "IssuingBankIU@dom";
	
		arrProductColumn["BGTemplate"][32] = "AdvisingBank@name";
		arrProductColumn["BGTemplate"][33] = "AdvisingBank@address_line_1";
		arrProductColumn["BGTemplate"][34] = "AdvisingBank@address_line_2";
		arrProductColumn["BGTemplate"][35] = "AdvisingBankIU@dom";
		arrProductColumn["BGTemplate"][36] = "adv_bank_conf_req";
		
		arrProductColumn["BGTemplate"][37] = "RecipientBank@name";
		
		arrProductColumn["BGTemplate"][38] = "ConfirmingBank@name";
		arrProductColumn["BGTemplate"][39] = "ConfirmingBank@address_line_1";
		arrProductColumn["BGTemplate"][40] = "ConfirmingBank@address_line_2";
		arrProductColumn["BGTemplate"][41] = "ConfirmingBank@dom";
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["BGTemplate"][110] = "beneficiary_country";

		arrProductColumn["BGTemplate"][42] = "contact_name";
		arrProductColumn["BGTemplate"][43] = "contact_address_line_1";
		arrProductColumn["BGTemplate"][44] = "contact_address_line_2";
		arrProductColumn["BGTemplate"][45] = "contact_dom";
		arrProductColumn["BGTemplate"][46] = "contact_country";
		arrProductColumn["BGTemplate"][47] = "for_account";
		arrProductColumn["BGTemplate"][48] = "alt_applicant_name";
		arrProductColumn["BGTemplate"][49] = "alt_applicant_address_line_1";
		arrProductColumn["BGTemplate"][50] = "alt_applicant_address_line_2";
		arrProductColumn["BGTemplate"][51] = "IssuedUndertaking@alt_applicant_dom";
		arrProductColumn["BGTemplate"][52] = "alt_applicant_country";
		arrProductColumn["BGTemplate"][53] = "consortium";
		arrProductColumn["BGTemplate"][54] = "character_commitment";
		arrProductColumn["BGTemplate"][55] = "delivery_to";
		arrProductColumn["BGTemplate"][56] = "delivery_to_other";
		arrProductColumn["BGTemplate"][57] = "contract_ref";
		arrProductColumn["BGTemplate"][58] = "contract_pct";
		arrProductColumn["BGTemplate"][59] = "contract_narrative";

		// Swift2020 IU Tnx Fields
		arrProductColumn["BGTemplate"][60] = "purpose";
		arrProductColumn["BGTemplate"][61] = "bei_code";
		arrProductColumn["BGTemplate"][62] = "bg_conf_instructions";
		arrProductColumn["BGTemplate"][63] = "bg_govern_country";
		arrProductColumn["BGTemplate"][64] = "bg_govern_text";
		arrProductColumn["BGTemplate"][65] = "bg_demand_indicator";
		arrProductColumn["BGTemplate"][66] = "bg_special_terms";
		arrProductColumn["BGTemplate"][67] = "send_attachments_by";

		arrProductColumn["BGTemplate"][68] = "cu_effective_date_type_code";
		arrProductColumn["BGTemplate"][69] = "cu_exp_date_type_code";
	
		arrProductColumn["BGTemplate"][70] = "CUBeneProductPartyDetails@name";
		arrProductColumn["BGTemplate"][71] = "CUBeneProductPartyDetails@bei_code";
		arrProductColumn["BGTemplate"][72] = "CUBeneProductPartyDetails@address_line_1";
		arrProductColumn["BGTemplate"][73] = "CUBeneProductPartyDetails@address_line_2";
		arrProductColumn["BGTemplate"][74] = "CUBeneProductPartyDetails@dom";
		arrProductColumn["BGTemplate"][75] = "CUBeneProductPartyDetails@address_line_4";
		arrProductColumn["BGTemplate"][76] = "CUBeneProductPartyDetails@country";
		arrProductColumn["BGTemplate"][77] = "CUContactProductPartyDetails@name";
		arrProductColumn["BGTemplate"][78] = "CUContactProductPartyDetails@address_line_1";
		arrProductColumn["BGTemplate"][79] = "CUContactProductPartyDetails@address_line_2";
		arrProductColumn["BGTemplate"][80] = "CUContactProductPartyDetails@address_line_4";
		arrProductColumn["BGTemplate"][81] = "CUContactProductPartyDetails@dom";
	
		arrProductColumn["BGTemplate"][82] = "cu_sub_product_code";
		arrProductColumn["BGTemplate"][83] = "cu_consortium";
		arrProductColumn["BGTemplate"][84] = "cu_renew_flag";
		arrProductColumn["BGTemplate"][85] = "cu_renew_on_code";
		arrProductColumn["BGTemplate"][86] = "cu_renew_for_nb";
		arrProductColumn["BGTemplate"][87] = "cu_renew_for_period";
		arrProductColumn["BGTemplate"][88] = "cu_advise_renewal_flag";
		arrProductColumn["BGTemplate"][89] = "cu_advise_renewal_days_nb";
		arrProductColumn["BGTemplate"][90] = "cu_rolling_renewal_flag";
		arrProductColumn["BGTemplate"][91] = "cu_rolling_renew_on_code";
		arrProductColumn["BGTemplate"][92] = "cu_rolling_renew_for_period";
		arrProductColumn["BGTemplate"][93] = "cu_rolling_day_in_month";
		arrProductColumn["BGTemplate"][94] = "cu_rolling_renewal_nb";
		arrProductColumn["BGTemplate"][95] = "cu_rolling_cancellation_days";
		arrProductColumn["BGTemplate"][96]= "cu_renew_amt_code";
		
		arrProductColumn["BGTemplate"][97] = "cu_type_code";
		arrProductColumn["BGTemplate"][98] = "cu_rule";
		arrProductColumn["BGTemplate"][99] = "cu_rule_other";
		arrProductColumn["BGTemplate"][100] = "cu_govern_country";
		arrProductColumn["BGTemplate"][101] = "cu_govern_text";
		arrProductColumn["BGTemplate"][102] = "cu_text_language";
		arrProductColumn["BGTemplate"][103] = "cu_text_language_other";
		
		arrProductColumn["BGTemplate"][104] = "applicant_address_line_4";
		arrProductColumn["BGTemplate"][105] = "alt_applicant_address_line_4";
		arrProductColumn["BGTemplate"][106] = "beneficiary_address_line_4";
		arrProductColumn["BGTemplate"][107] = "contact_address_line_4";
		arrProductColumn["BGTemplate"][108] = "IssuedUndertaking@sub_product_code";
		arrProductColumn["BGTemplate"][109] = "bg_transfer_indicator";

		arrProductColumn["BGTemplate"][110] = "AdviseThruBank@name";
		arrProductColumn["BGTemplate"][111] = "AdviseThruBank@address_line_1";
		arrProductColumn["BGTemplate"][112] = "AdviseThruBank@address_line_2";
		arrProductColumn["BGTemplate"][113] = "AdviseThruBank@dom";

		arrProductColumn["BGTemplate"][114] = "ProcessingBank@name";
		arrProductColumn["BGTemplate"][115] = "ProcessingBank@address_line_1";
		arrProductColumn["BGTemplate"][116] = "ProcessingBank@address_line_2";
		arrProductColumn["BGTemplate"][117] = "ProcessingBank@dom";

		arrProductColumn["BGTemplate"][118] = "CURecipientBank@abbv_name";
		arrProductColumn["BGTemplate"][119] = "CURecipientBank@address_line_1";
		arrProductColumn["BGTemplate"][120] = "CURecipientBank@address_line_2";
		arrProductColumn["BGTemplate"][121] = "CURecipientBank@dom";
		arrProductColumn["BGTemplate"][122] = "CURecipientBank@address_line_4";
		arrProductColumn["BGTemplate"][123] = "CURecipientBank@iso_code";
	
		arrProductColumn["BGTemplate"][124] = "cu_rolling_renew_for_nb";
		arrProductColumn["BGTemplate"][125] = "RecipientBank@iso_code";
		arrProductColumn["BGTemplate"][126] = "IssuingBank@address_line_4";
		arrProductColumn["BGTemplate"][127] = "AdvisingBank@address_line_4";
		arrProductColumn["BGTemplate"][128] = "ConfirmingBank@address_line_4";
		arrProductColumn["BGTemplate"][129] = "AdviseThruBank@address_line_4";
		arrProductColumn["BGTemplate"][130] = "ProcessingBank@address_line_4";
		arrProductColumn["BGTemplate"][131] = "provisional_status";
		arrProductColumn["BGTemplate"][132] = "cu_demand_indicator";
		arrProductColumn["BGTemplate"][133] = "cu_transfer_indicator";
		arrProductColumn["BGTemplate"][134] = "cu_text_type_code";
		arrProductColumn["BGTemplate"][135] = "cu_text_type_details";
		arrProductColumn["BGTemplate"][136] = "adv_send_mode_text";
		arrProductColumn["BGTemplate"][137] = "delv_org_undertaking";
		arrProductColumn["BGTemplate"][138] = "delv_org_undertaking_text";
		arrProductColumn["BGTemplate"][139] = "entity";

		arrProductColumn["BGTemplate"][140] = "renew_flag";
		arrProductColumn["BGTemplate"][141] = "renew_on_code";
		arrProductColumn["BGTemplate"][142] = "renew_for_nb";
		arrProductColumn["BGTemplate"][143] = "renew_for_period";
		arrProductColumn["BGTemplate"][144] = "advise_renewal_flag";
		arrProductColumn["BGTemplate"][145] = "advise_renewal_days_nb";
		arrProductColumn["BGTemplate"][146] = "rolling_renewal_flag";
		arrProductColumn["BGTemplate"][147] = "rolling_renewal_nb";
		arrProductColumn["BGTemplate"][148] = "rolling_cancellation_days";
		arrProductColumn["BGTemplate"][149] = "renew_amt_code";
		arrProductColumn["BGTemplate"][150] = "rolling_renew_for_nb";
		arrProductColumn["BGTemplate"][151] = "rolling_day_in_month";
		arrProductColumn["BGTemplate"][152] = "rolling_renew_for_period";
		arrProductColumn["BGTemplate"][153] = "rolling_renew_on_code";
		arrProductColumn["BGTemplate"][154] = "IssuingBank@iso_code";
		arrProductColumn["BGTemplate"][155] = "AdvisingBank@iso_code";
		arrProductColumn["BGTemplate"][156] = "ConfirmingBank@iso_code";
		arrProductColumn["BGTemplate"][157] = "AdviseThruBank@iso_code";
		arrProductColumn["BGTemplate"][158] = "ProcessingBank@iso_code";
		arrProductColumn["BGTemplate"][159] = "lead_bank_flag";
		arrProductColumn["BGTemplate"][160] = "cu_conf_instructions";
		arrProductColumn["BGTemplate"][161] = "renewal_type";
		arrProductColumn["BGTemplate"][162] = "cu_renewal_type";
		arrProductColumn["BGTemplate"][163] = "bg_tolerance_positive_pct";
		arrProductColumn["BGTemplate"][164] = "bg_tolerance_negative_pct";
		arrProductColumn["BGTemplate"][165] = "ship_from";
		arrProductColumn["BGTemplate"][166] = "ship_loading";
		arrProductColumn["BGTemplate"][167] = "ship_discharge";
		arrProductColumn["BGTemplate"][168] = "ship_to";
		arrProductColumn["BGTemplate"][169] = "part_ship_detl";
		arrProductColumn["BGTemplate"][170] = "tran_ship_detl";

		arrProductColumn["BGTemplate"][172] = "inco_term_year";
		arrProductColumn["BGTemplate"][173] = "inco_term";
		arrProductColumn["BGTemplate"][174] = "inco_place";
		arrProductColumn["BGTemplate"][175] = "cr_avl_by_code";
		arrProductColumn["BGTemplate"][176] = "cu_cr_avl_by_code";
		
		arrProductColumn["BGTemplate"][177] = "CreditAvailableWithBank@name";
		arrProductColumn["BGTemplate"][178] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["BGTemplate"][179] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["BGTemplate"][180] = "CreditAvailableWithBank@dom";
		arrProductColumn["BGTemplate"][181] = "CreditAvailableWithBank@address_line_4";
		arrProductColumn["BGTemplate"][182] = "CreditAvailableWithBank@iso_code";
		
		arrProductColumn["BGTemplate"][183] = "CUCreditAvailableWithBank@name";
		arrProductColumn["BGTemplate"][184] = "CUCreditAvailableWithBank@address_line_1";
		arrProductColumn["BGTemplate"][185] = "CUCreditAvailableWithBank@address_line_2";
		arrProductColumn["BGTemplate"][186] = "CUCreditAvailableWithBank@dom";
		arrProductColumn["BGTemplate"][187] = "CUCreditAvailableWithBank@address_line_4";
		arrProductColumn["BGTemplate"][188] = "CUCreditAvailableWithBank@iso_code";
		arrProductColumn["BGTemplate"][301] = "bg_govern_country_subdiv";
		arrProductColumn["BGTemplate"][302] = "cu_govern_country_subdiv";
		if (misys._config.shipment_period_standard === false) {
			arrProductColumn["BGTemplate"][189] = "ship_name";
			arrProductColumn["BGTemplate"][190] = "ship_period";
		}
		
		arrProductColumn["BGTemplate"][200] = "Narrative@underlyingTransactionDetails";
		arrProductColumn["BGTemplate"][201] = "Narrative@textOfUndertaking";
		
