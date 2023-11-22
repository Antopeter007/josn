dojo.provide("misys.report.definitions.report_si_phrase_candidate");

		//
		// SI Transaction candidate
		//

		// Define an array which stores the SI Transaction columns
		

		arrProductColumn["SITnx"][0] = "ref_id";
		arrProductColumn["SITnx"][1] = "template_id";
		arrProductColumn["SITnx"][2] = "bo_ref_id";
		arrProductColumn["SITnx"][3] = "cust_ref_id";
		//arrProductColumn["SITnx"][4] = "sub_tnx_type_code";
		arrProductColumn["SITnx"][5] = "tnx_val_date";
		arrProductColumn["SITnx"][6] = "tnx_stat_code";
		
		arrProductColumn["SITnx"][7] = "appl_date";
		arrProductColumn["SITnx"][8] = "iss_date";
		arrProductColumn["SITnx"][9] = "exp_date";
		arrProductColumn["SITnx"][10] = "amd_date";
		arrProductColumn["SITnx"][11] = "amd_no";
		arrProductColumn["SITnx"][12] = "last_ship_date";
		arrProductColumn["SITnx"][13] = "lc_cur_code";
		arrProductColumn["SITnx"][14] = "lc_amt";
		arrProductColumn["SITnx"][15] = "lc_liab_amt";
		arrProductColumn["SITnx"][16] = "lc_type";
		arrProductColumn["SITnx"][17] = "entity";
		arrProductColumn["SITnx"][18] = "beneficiary_name";
		arrProductColumn["SITnx"][19] = "beneficiary_address_line_1";
		arrProductColumn["SITnx"][20] = "beneficiary_address_line_2";
		arrProductColumn["SITnx"][21] = "beneficiary_dom";
		arrProductColumn["SITnx"][22] = "beneficiary_reference";
		
		arrProductColumn["SITnx"][23] = "applicant_name";
		arrProductColumn["SITnx"][24] = "applicant_address_line_1";
		arrProductColumn["SITnx"][25] = "applicant_address_line_2";
		arrProductColumn["SITnx"][26] = "applicant_dom";
		arrProductColumn["SITnx"][27] = "applicant_reference";
		arrProductColumn["SITnx"][28] = "expiry_place";
		arrProductColumn["SITnx"][29] = "inco_place";
		arrProductColumn["SITnx"][30] = "ship_from";
		// SWIFT 2006
		arrProductColumn["SITnx"][31] = "ship_loading";
		arrProductColumn["SITnx"][32] = "ship_discharge";
		// SWIFT 2006
		arrProductColumn["SITnx"][33] = "ship_to";
		arrProductColumn["SITnx"][49] = "draft_term";
		arrProductColumn["SITnx"][50] = "cty_of_dest";
		
		arrProductColumn["SITnx"][34] = "neg_tol_pct";
		arrProductColumn["SITnx"][35] = "pstv_tol_pct";
		
		arrProductColumn["SITnx"][36] = "renewal_calendar_date";
		arrProductColumn["SITnx"][37] = "renew_for_nb";
		arrProductColumn["SITnx"][38] = "advise_renewal_days_nb";
		arrProductColumn["SITnx"][39] = "rolling_renewal_nb";
		arrProductColumn["SITnx"][40] = "rolling_cancellation_days";

		arrProductColumn["SITnx"][41] = "principal_act_no";
		arrProductColumn["SITnx"][42] = "fee_act_no";
		
		arrProductColumn["SITnx"][43] = "IssuingBank@abbv_name";
		arrProductColumn["SITnx"][44] = "IssuingBank@name";
		arrProductColumn["SITnx"][45] = "IssuingBank@address_line_1";
		arrProductColumn["SITnx"][46] = "IssuingBank@address_line_2";
		arrProductColumn["SITnx"][47] = "IssuingBank@dom";
		
		arrProductColumn["SITnx"][48] = "AdvisingBank@name";
		arrProductColumn["SITnx"][51] = "AdvisingBank@dom";
		
		arrProductColumn["SITnx"][52] = "AdviseThruBank@name";
		arrProductColumn["SITnx"][53] = "AdviseThruBank@address_line_1";
		arrProductColumn["SITnx"][54] = "AdviseThruBank@address_line_2";
		arrProductColumn["SITnx"][55] = "AdviseThruBank@dom";
		
		arrProductColumn["SITnx"][56] = "CreditAvailableWithBank@name";
		arrProductColumn["SITnx"][57] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["SITnx"][58] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["SITnx"][59] = "CreditAvailableWithBank@dom";
		
		arrProductColumn["SITnx"][60] = "DraweeDetailsBank@name";
		arrProductColumn["SITnx"][61] = "DraweeDetailsBank@address_line_1";
		arrProductColumn["SITnx"][62] = "DraweeDetailsBank@address_line_2";
		arrProductColumn["SITnx"][63] = "DraweeDetailsBank@dom";
		
		/*arrProductColumn["SITnx"][67] = "Narrative@chargesDetails";
		arrProductColumn["SITnx"][68] = "Narrative@additionalAmount";
		arrProductColumn["SITnx"][69] = "Narrative@paymentInstructions";
		arrProductColumn["SITnx"][70] = "Narrative@periodOfPresentation";
		arrProductColumn["SITnx"][71] = "Narrative@shipmentPeriod";
		arrProductColumn["SITnx"][72] = "Narrative@senderToReceiver";
		arrProductColumn["SITnx"][73] = "Narrative@boComment";
		arrProductColumn["SITnx"][74] = "Narrative@freeFormatText";
		arrProductColumn["SITnx"][75] = "Narrative@amdDetails";	
*/
		arrProductColumn["SITnx"][76] = "maturity_date";
		
		
		arrProductColumn["SITnx"][77] = "fwd_contract_no";
		arrProductColumn["SITnx"][78] = "sub_tnx_stat_code";
		
		arrProductColumn["SITnx"][79] = "final_expiry_date";
		arrProductColumn["SITnx"][80] = "release_amt";
		arrProductColumn["SITnx"][81] = "claim_amt";
		arrProductColumn["SITnx"][82] = "claim_reference";
		arrProductColumn["SITnx"][83] = "claim_present_date";
		arrProductColumn["SITnx"][84] = "rolling_renew_for_nb";
		arrProductColumn["SITnx"][85] = "rolling_day_in_month";
		arrProductColumn["SITnx"][86] = "projected_expiry_date";
		arrProductColumn["SITnx"][87] = "doc_ref_no";
		arrProductColumn["SITnx"][88] = "beneficiary_country";
		arrProductColumn["SITnx"][89] = "applicant_country";
		arrProductColumn["SITnx"][90] = "inc_amt";
		arrProductColumn["SITnx"][91] = "dec_amt";
		arrProductColumn["SITnx"][92] = "org_lc_amt";
		arrProductColumn["SITnx"][93] = "tnx_amt";

		arrProductColumn["SITnx"][224] = "AdvisingBank@address_line_1";
		arrProductColumn["SITnx"][225] = "AdvisingBank@address_line_2";
	