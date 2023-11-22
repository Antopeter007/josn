dojo.provide("misys.report.definitions.report_sr_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// SR candidate
		//

		// Define an array which stores the EL columns
		

		arrProductColumn["SR"][0] = "ref_id";
		arrProductColumn["SR"][1] = "template_id";
		arrProductColumn["SR"][2] = "bo_ref_id";
		arrProductColumn["SR"][3] = "cust_ref_id";
		arrProductColumn["SR"][4] = "entity";
		arrProductColumn["SR"][7] = "prod_stat_code";
		arrProductColumn["SR"][17] = "appl_date";
		arrProductColumn["SR"][18] = "iss_date";
		arrProductColumn["SR"][19] = "exp_date";
		arrProductColumn["SR"][20] = "amd_date";
		arrProductColumn["SR"][22] = "amd_no";
		arrProductColumn["SR"][23] = "last_ship_date";
		arrProductColumn["SR"][24] = "lc_cur_code";
		arrProductColumn["SR"][25] = "lc_amt";
		arrProductColumn["SR"][26] = "lc_liab_amt";
		arrProductColumn["SR"][27] = "lc_type";
		
		arrProductColumn["SR"][29] = "beneficiary_name";
		arrProductColumn["SR"][30] = "beneficiary_address_line_1";
		arrProductColumn["SR"][31] = "beneficiary_address_line_2";
		arrProductColumn["SR"][32] = "beneficiary_dom";
		arrProductColumn["SR"][33] = "beneficiary_reference";
		
		arrProductColumn["SR"][35] = "applicant_name";
		arrProductColumn["SR"][36] = "applicant_address_line_1";
		arrProductColumn["SR"][37] = "applicant_address_line_2";
		arrProductColumn["SR"][38] = "applicant_dom";
		arrProductColumn["SR"][39] = "applicant_reference";
		arrProductColumn["SR"][40] = "expiry_place";
		arrProductColumn["SR"][41] = "inco_term";
		arrProductColumn["SR"][189] = "inco_term_year";
		arrProductColumn["SR"][42] = "inco_place";
		arrProductColumn["SR"][43] = "part_ship_detl";
		arrProductColumn["SR"][44] = "tran_ship_detl";
		arrProductColumn["SR"][45] = "ship_from";
		arrProductColumn["SR"][46] = "ship_to";
		arrProductColumn["SR"][47] = "draft_term";
		arrProductColumn["SR"][48] = "cty_of_dest";
		
		arrProductColumn["SR"][51] = "neg_tol_pct";
		arrProductColumn["SR"][52] = "pstv_tol_pct";
		
		arrProductColumn["SR"][54] = "cr_avl_by_code";
		arrProductColumn["SR"][55] = "dir_reim_flag";
		arrProductColumn["SR"][56] = "irv_flag";
		arrProductColumn["SR"][57] = "ntrf_flag";
		arrProductColumn["SR"][58] = "stnd_by_lc_flag";
		arrProductColumn["SR"][59] = "cfm_inst_code";
		arrProductColumn["SR"][60] = "cfm_flag";
		arrProductColumn["SR"][61] = "cfm_chrg_brn_by_code";
		arrProductColumn["SR"][62] = "corr_chrg_brn_by_code";
		arrProductColumn["SR"][63] = "open_chrg_brn_by_code";
		
		arrProductColumn["SR"][65] = "fee_act_no";
		
		arrProductColumn["SR"][70] = "IssuingBank@name";
		arrProductColumn["SR"][71] = "IssuingBank@address_line_1";
		arrProductColumn["SR"][72] = "IssuingBank@address_line_2";
		arrProductColumn["SR"][73] = "IssuingBank@dom";
		
		arrProductColumn["SR"][76] = "AdvisingBank@abbv_name";
		arrProductColumn["SR"][77] = "AdvisingBank@name";
		arrProductColumn["SR"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["SR"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["SR"][80] = "AdvisingBank@dom";
		
		arrProductColumn["SR"][84] = "AdviseThruBank@name";
		arrProductColumn["SR"][85] = "AdviseThruBank@address_line_1";
		arrProductColumn["SR"][86] = "AdviseThruBank@address_line_2";
		arrProductColumn["SR"][87] = "AdviseThruBank@dom";
		
		arrProductColumn["SR"][91] = "CreditAvailableWithBank@name";
		arrProductColumn["SR"][92] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["SR"][93] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["SR"][94] = "CreditAvailableWithBank@dom";
		
		arrProductColumn["SR"][98] = "DraweeDetailsBank@name";
		arrProductColumn["SR"][99] = "DraweeDetailsBank@address_line_1";
		arrProductColumn["SR"][100] = "DraweeDetailsBank@address_line_2";
		arrProductColumn["SR"][101] = "DraweeDetailsBank@dom";
		
		/* MPS-50897 :These 3 narrative are removed from report designer in 
		 * swift 2018 onwards. moved them to report_core.xsl to add them conditionally
		arrProductColumn["SR"][104] = "Narrative@goodsDesc";
		arrProductColumn["SR"][105] = "Narrative@docsRequired";
		arrProductColumn["SR"][106] = "Narrative@additionalInstructions";*/
		/*arrProductColumn["SR"][107] = "Narrative@chargesDetails";
		arrProductColumn["SR"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["SR"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["SR"][110] = "Narrative@fullDetails";
		*/
		arrProductColumn["SR"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["SR"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["SR"][111] = "lc_ref_id";
		//arrProductColumn["SR"][112] = "imp_bill_ref_id";

		arrProductColumn["SR"][113] = "Charge@chrg_code";
		arrProductColumn["SR"][114] = "Charge@amt";
		arrProductColumn["SR"][115] = "Charge@cur_code";
		arrProductColumn["SR"][116] = "Charge@status";
		arrProductColumn["SR"][117] = "Charge@additional_comment";
		arrProductColumn["SR"][118] = "Charge@settlement_date";
		arrProductColumn["SR"][119] = "doc_ref_no";
		arrProductColumn["SR"][120] = "rolling_renew_on_code";
		arrProductColumn["SR"][121] = "rolling_renew_for_nb";
		arrProductColumn["SR"][122] = "rolling_renew_for_period";
		arrProductColumn["SR"][123] = "rolling_day_in_month";
		arrProductColumn["SR"][124] = "projected_expiry_date";
		arrProductColumn["SR"][125] = "final_expiry_date";
		arrProductColumn["SR"][126] = "applicable_rules";
		arrProductColumn["SR"][227] = "Narrative@splPaymentBeneficiary";
		arrProductColumn["SR"][230] = "AdvisingBank@reference";
		

		//
		// SR Transaction candidate
		//

		// Define an array which stores the SR Transaction columns
		

		arrProductColumn["SRTnx"][0] = "ref_id";
		arrProductColumn["SRTnx"][1] = "template_id";
		arrProductColumn["SRTnx"][2] = "bo_ref_id";
		arrProductColumn["SRTnx"][3] = "bo_tnx_id";
		arrProductColumn["SRTnx"][4] = "cust_ref_id";
		arrProductColumn["SRTnx"][5] = "entity";
		arrProductColumn["SRTnx"][6] = "tnx_type_code";
		arrProductColumn["SRTnx"][7] = "sub_tnx_type_code";
		arrProductColumn["SRTnx"][8] = "prod_stat_code";
		arrProductColumn["SRTnx"][14] = "tnx_val_date";
		arrProductColumn["SRTnx"][15] = "tnx_amt";
		arrProductColumn["SRTnx"][16] = "tnx_cur_code";		
		arrProductColumn["SRTnx"][17] = "tnx_stat_code";		
		arrProductColumn["SRTnx"][18] = "appl_date";
		arrProductColumn["SRTnx"][19] = "iss_date";
		arrProductColumn["SRTnx"][20] = "exp_date";
		arrProductColumn["SRTnx"][21] = "amd_date";
		arrProductColumn["SRTnx"][22] = "amd_no";
		arrProductColumn["SRTnx"][23] = "last_ship_date";
		arrProductColumn["SRTnx"][24] = "lc_cur_code";
		arrProductColumn["SRTnx"][25] = "lc_amt";
		arrProductColumn["SRTnx"][26] = "lc_liab_amt";
		arrProductColumn["SRTnx"][27] = "lc_type";
		
		arrProductColumn["SRTnx"][29] = "beneficiary_name";
		arrProductColumn["SRTnx"][30] = "beneficiary_address_line_1";
		arrProductColumn["SRTnx"][31] = "beneficiary_address_line_2";
		arrProductColumn["SRTnx"][32] = "beneficiary_dom";
		arrProductColumn["SRTnx"][33] = "beneficiary_reference";
		
		arrProductColumn["SRTnx"][35] = "applicant_name";
		arrProductColumn["SRTnx"][36] = "applicant_address_line_1";
		arrProductColumn["SRTnx"][37] = "applicant_address_line_2";
		arrProductColumn["SRTnx"][38] = "applicant_dom";
		arrProductColumn["SRTnx"][39] = "applicant_reference";
		arrProductColumn["SRTnx"][40] = "expiry_place";
		arrProductColumn["SRTnx"][41] = "inco_term";
		arrProductColumn["SRTnx"][189] = "inco_term_year";
		arrProductColumn["SRTnx"][42] = "inco_place";
		arrProductColumn["SRTnx"][43] = "part_ship_detl";
		arrProductColumn["SRTnx"][44] = "tran_ship_detl";
		arrProductColumn["SRTnx"][45] = "ship_from";
		arrProductColumn["SRTnx"][46] = "ship_to";
		arrProductColumn["SRTnx"][47] = "draft_term";
		arrProductColumn["SRTnx"][48] = "cty_of_dest";
		
		arrProductColumn["SRTnx"][51] = "neg_tol_pct";
		arrProductColumn["SRTnx"][52] = "pstv_tol_pct";
		
		arrProductColumn["SRTnx"][54] = "cr_avl_by_code";
		arrProductColumn["SRTnx"][55] = "dir_reim_flag";
		arrProductColumn["SRTnx"][56] = "irv_flag";
		arrProductColumn["SRTnx"][57] = "ntrf_flag";
		arrProductColumn["SRTnx"][58] = "stnd_by_lc_flag";
		arrProductColumn["SRTnx"][59] = "cfm_inst_code";
		arrProductColumn["SRTnx"][60] = "cfm_flag";
		arrProductColumn["SRTnx"][61] = "cfm_chrg_brn_by_code";
		arrProductColumn["SRTnx"][62] = "corr_chrg_brn_by_code";
		arrProductColumn["SRTnx"][63] = "open_chrg_brn_by_code";
		
		arrProductColumn["SRTnx"][65] = "fee_act_no";
		
		arrProductColumn["SRTnx"][70] = "IssuingBank@name";
		arrProductColumn["SRTnx"][71] = "IssuingBank@address_line_1";
		arrProductColumn["SRTnx"][72] = "IssuingBank@address_line_2";
		arrProductColumn["SRTnx"][73] = "IssuingBank@dom";
		
		arrProductColumn["SRTnx"][76] = "AdvisingBank@abbv_name";
		arrProductColumn["SRTnx"][77] = "AdvisingBank@name";
		arrProductColumn["SRTnx"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["SRTnx"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["SRTnx"][80] = "AdvisingBank@dom";
		
		arrProductColumn["SRTnx"][84] = "AdviseThruBank@name";
		arrProductColumn["SRTnx"][85] = "AdviseThruBank@address_line_1";
		arrProductColumn["SRTnx"][86] = "AdviseThruBank@address_line_2";
		arrProductColumn["SRTnx"][87] = "AdviseThruBank@dom";
		
		arrProductColumn["SRTnx"][91] = "CreditAvailableWithBank@name";
		arrProductColumn["SRTnx"][92] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["SRTnx"][93] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["SRTnx"][94] = "CreditAvailableWithBank@dom";
		
		arrProductColumn["SRTnx"][98] = "DraweeDetailsBank@name";
		arrProductColumn["SRTnx"][99] = "DraweeDetailsBank@address_line_1";
		arrProductColumn["SRTnx"][100] = "DraweeDetailsBank@address_line_2";
		arrProductColumn["SRTnx"][101] = "DraweeDetailsBank@dom";
		
		/* MPS-50897 :These 3 narrative are removed from report designer in 
		 * swift 2018 onwards. moved them to report_core.xsl to add them conditionally
		arrProductColumn["SRTnx"][104] = "Narrative@goodsDesc";
		arrProductColumn["SRTnx"][105] = "Narrative@docsRequired";
		arrProductColumn["SRTnx"][106] = "Narrative@additionalInstructions";*/
		/*arrProductColumn["SRTnx"][107] = "Narrative@chargesDetails";
		arrProductColumn["SRTnx"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["SRTnx"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["SRTnx"][110] = "Narrative@fullDetails";
		arrProductColumn["SRTnx"][111] = "Narrative@boComment";
		*/
		arrProductColumn["SRTnx"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["SRTnx"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["SRTnx"][122] = "lc_ref_id";
		arrProductColumn["SRTnx"][123] = "imp_bill_ref_id";

		arrProductColumn["SRTnx"][130] = "Inputter@last_name";
		arrProductColumn["SRTnx"][131] = "Inputter@first_name";
		arrProductColumn["SRTnx"][132] = "inp_dttm";
		
		arrProductColumn["SRTnx"][135] = "LastController@validation_dttm";
		arrProductColumn["SRTnx"][136] = "Releaser@last_name";
		arrProductColumn["SRTnx"][137] = "Releaser@first_name";
		arrProductColumn["SRTnx"][138] = "release_dttm";

		arrProductColumn["SRTnx"][139] = "Charge@chrg_code";
		arrProductColumn["SRTnx"][140] = "Charge@amt";
		arrProductColumn["SRTnx"][141] = "Charge@cur_code";
		arrProductColumn["SRTnx"][142] = "Charge@status";
		arrProductColumn["SRTnx"][143] = "Charge@additional_comment";
		arrProductColumn["SRTnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["SRTnx"][145] = "bo_release_dttm";
		arrProductColumn["SRTnx"][146] = "maturity_date";
		arrProductColumn["SRTnx"][150] = "sub_tnx_stat_code";
		arrProductColumn["SRTnx"][151] = "doc_ref_no";
		arrProductColumn["SRTnx"][152] = "rolling_renew_on_code";
		arrProductColumn["SRTnx"][153] = "rolling_renew_for_nb";
		arrProductColumn["SRTnx"][154] = "rolling_renew_for_period";
		arrProductColumn["SRTnx"][155] = "rolling_day_in_month";
		arrProductColumn["SRTnx"][156] = "projected_expiry_date";
		arrProductColumn["SRTnx"][157] = "final_expiry_date";
		arrProductColumn["SRTnx"][158] = "applicable_rules";
		arrProductColumn["SRTnx"][169] = "LastController@LastControllerUser@first_name";
		arrProductColumn["SRTnx"][170] = "LastController@LastControllerUser@last_name";
		arrProductColumn["SRTnx"][227] = "Narrative@splPaymentBeneficiary";
		arrProductColumn["SRTnx"][230] = "AdvisingBank@reference";
		
		