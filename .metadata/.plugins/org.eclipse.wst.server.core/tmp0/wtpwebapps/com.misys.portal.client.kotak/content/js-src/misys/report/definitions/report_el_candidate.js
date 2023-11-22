dojo.provide("misys.report.definitions.report_el_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// EL candidate
		//

		// Define an array which stores the EL columns


		arrProductColumn["EL"][0] = "ref_id";
		arrProductColumn["EL"][1] = "entity";
		arrProductColumn["EL"][2] = "bo_ref_id";
		arrProductColumn["EL"][3] = "cust_ref_id";
		
		arrProductColumn["EL"][7] = "prod_stat_code";
		
		arrProductColumn["EL"][18] = "iss_date";
		arrProductColumn["EL"][19] = "exp_date";
		arrProductColumn["EL"][20] = "amd_date";
		arrProductColumn["EL"][22] = "amd_no";
		arrProductColumn["EL"][23] = "last_ship_date";
		arrProductColumn["EL"][24] = "lc_cur_code";
		arrProductColumn["EL"][25] = "lc_amt";
		arrProductColumn["EL"][26] = "lc_liab_amt";
		arrProductColumn["EL"][27] = "lc_type";
		
		arrProductColumn["EL"][29] = "beneficiary_name";
		arrProductColumn["EL"][30] = "beneficiary_address_line_1";
		arrProductColumn["EL"][31] = "beneficiary_address_line_2";
		arrProductColumn["EL"][32] = "beneficiary_dom";
		arrProductColumn["EL"][33] = "beneficiary_reference";
		
		arrProductColumn["EL"][35] = "applicant_name";
		arrProductColumn["EL"][36] = "applicant_address_line_1";
		arrProductColumn["EL"][37] = "applicant_address_line_2";
		arrProductColumn["EL"][38] = "applicant_dom";
		arrProductColumn["EL"][39] = "applicant_reference";
		arrProductColumn["EL"][40] = "expiry_place";
		arrProductColumn["EL"][41] = "inco_term";
		arrProductColumn["EL"][112] = "inco_term_year";
		arrProductColumn["EL"][42] = "inco_place";
		arrProductColumn["EL"][43] = "part_ship_detl";
		arrProductColumn["EL"][44] = "tran_ship_detl";
		arrProductColumn["EL"][45] = "ship_from";
		// SWIFT 2006
		arrProductColumn["EL"][46] = "ship_loading";
		arrProductColumn["EL"][47] = "ship_discharge";
		// SWIFT 2006
		arrProductColumn["EL"][48] = "ship_to";
		arrProductColumn["EL"][49] = "draft_term";
		
		arrProductColumn["EL"][51] = "neg_tol_pct";
		arrProductColumn["EL"][52] = "pstv_tol_pct";
		
		arrProductColumn["EL"][54] = "cr_avl_by_code";
		
		arrProductColumn["EL"][56] = "irv_flag";
		arrProductColumn["EL"][57] = "ntrf_flag";
		arrProductColumn["EL"][58] = "stnd_by_lc_flag";
		arrProductColumn["EL"][59] = "cfm_inst_code";
		arrProductColumn["EL"][60] = "cfm_flag";
		arrProductColumn["EL"][61] = "cfm_chrg_brn_by_code";
		arrProductColumn["EL"][62] = "corr_chrg_brn_by_code";
		arrProductColumn["EL"][63] = "open_chrg_brn_by_code";
		
		arrProductColumn["EL"][70] = "IssuingBank@name";
		arrProductColumn["EL"][71] = "IssuingBank@address_line_1";
		arrProductColumn["EL"][72] = "IssuingBank@address_line_2";
		arrProductColumn["EL"][73] = "IssuingBank@dom";
		
		arrProductColumn["EL"][77] = "AdvisingBank@name";
		arrProductColumn["EL"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["EL"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["EL"][80] = "AdvisingBank@dom";
		
		arrProductColumn["EL"][84] = "AdviseThruBank@name";
		arrProductColumn["EL"][85] = "AdviseThruBank@address_line_1";
		arrProductColumn["EL"][86] = "AdviseThruBank@address_line_2";
		arrProductColumn["EL"][87] = "AdviseThruBank@dom";
		
		arrProductColumn["EL"][91] = "CreditAvailableWithBank@name";
		arrProductColumn["EL"][92] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["EL"][93] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["EL"][94] = "CreditAvailableWithBank@dom";
		
		arrProductColumn["EL"][98] = "DraweeDetailsBank@name";
		arrProductColumn["EL"][99] = "DraweeDetailsBank@address_line_1";
		arrProductColumn["EL"][100] = "DraweeDetailsBank@address_line_2";
		arrProductColumn["EL"][101] = "DraweeDetailsBank@dom";
		
		/* MPS-50897 :These 3 narrative are removed from report designer in 
		 * swift 2018 onwards. moved them to report_core.xsl to add them conditionally
		arrProductColumn["EL"][104] = "Narrative@goodsDesc";
		arrProductColumn["EL"][105] = "Narrative@docsRequired";
		arrProductColumn["EL"][106] = "Narrative@additionalInstructions";*/
	/*	arrProductColumn["EL"][107] = "Narrative@chargesDetails";
		arrProductColumn["EL"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["EL"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["EL"][110] = "Narrative@fullDetails";*/
		arrProductColumn["EL"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["EL"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["EL"][111] = "lc_ref_id";
		
		arrProductColumn["EL"][113] = "Charge@chrg_code";
		arrProductColumn["EL"][114] = "Charge@amt";
		arrProductColumn["EL"][115] = "Charge@cur_code";
		arrProductColumn["EL"][116] = "Charge@status";
		arrProductColumn["EL"][117] = "Charge@additional_comment";
		arrProductColumn["EL"][118] = "Charge@settlement_date";
		arrProductColumn["EL"][119] = "lc_available_amt";
		
		arrProductColumn["EL"][121] = "applicable_rules";
		arrProductColumn["EL"][122] = "adv_send_mode_text";
		arrProductColumn["EL"][140] = "Narrative@splPaymentBeneficiary";
		// arrProductColumn["EL"][137] = "imp_bill_ref_id";
		//
		// EL Transaction candidate
		//

		// Define an array which stores the EL Transaction columns
		

		arrProductColumn["ELTnx"][0] = "ref_id";
		arrProductColumn["ELTnx"][1] = "entity";
		arrProductColumn["ELTnx"][2] = "bo_ref_id";
		arrProductColumn["ELTnx"][3] = "bo_tnx_id";
		arrProductColumn["ELTnx"][4] = "cust_ref_id";
		arrProductColumn["ELTnx"][5] = "tnx_type_code";
		arrProductColumn["ELTnx"][6] = "sub_tnx_type_code";
		arrProductColumn["ELTnx"][7] = "prod_stat_code";
		arrProductColumn["ELTnx"][14] = "tnx_val_date";
		arrProductColumn["ELTnx"][15] = "tnx_amt";
		arrProductColumn["ELTnx"][16] = "tnx_cur_code";
		arrProductColumn["ELTnx"][17] = "tnx_stat_code";
		
		arrProductColumn["ELTnx"][18] = "appl_date";
		arrProductColumn["ELTnx"][19] = "iss_date";
		arrProductColumn["ELTnx"][20] = "exp_date";
		arrProductColumn["ELTnx"][21] = "amd_date";
		arrProductColumn["ELTnx"][22] = "amd_no";
		arrProductColumn["ELTnx"][23] = "last_ship_date";
		arrProductColumn["ELTnx"][24] = "lc_cur_code";
		arrProductColumn["ELTnx"][25] = "lc_amt";
		arrProductColumn["ELTnx"][26] = "lc_liab_amt";
		arrProductColumn["ELTnx"][27] = "lc_type";
		
		arrProductColumn["ELTnx"][29] = "beneficiary_name";
		arrProductColumn["ELTnx"][30] = "beneficiary_address_line_1";
		arrProductColumn["ELTnx"][31] = "beneficiary_address_line_2";
		arrProductColumn["ELTnx"][32] = "beneficiary_dom";
		arrProductColumn["ELTnx"][33] = "beneficiary_reference";
		arrProductColumn["ELTnx"][34] = "sec_beneficiary_name";
		arrProductColumn["ELTnx"][35] = "sec_beneficiary_address_line_1";
		arrProductColumn["ELTnx"][36] = "sec_beneficiary_address_line_2";
		arrProductColumn["ELTnx"][37] = "sec_beneficiary_dom";
		arrProductColumn["ELTnx"][38] = "sec_beneficiary_reference";
		
		arrProductColumn["ELTnx"][39] = "applicant_name";
		arrProductColumn["ELTnx"][40] = "applicant_address_line_1";
		arrProductColumn["ELTnx"][41] = "applicant_address_line_2";
		arrProductColumn["ELTnx"][42] = "applicant_dom";
		arrProductColumn["ELTnx"][43] = "applicant_reference";
		arrProductColumn["ELTnx"][44] = "expiry_place";
		arrProductColumn["ELTnx"][45] = "inco_term";
		arrProductColumn["ELTnx"][112] = "inco_term_year";
		arrProductColumn["ELTnx"][46] = "inco_place";
		arrProductColumn["ELTnx"][47] = "part_ship_detl";
		arrProductColumn["ELTnx"][48] = "tran_ship_detl";
		arrProductColumn["ELTnx"][49] = "ship_from";
		// SWIFT 2006
		arrProductColumn["ELTnx"][50] = "ship_loading";
		arrProductColumn["ELTnx"][51] = "ship_discharge";
		// SWIFT 2006
		arrProductColumn["ELTnx"][52] = "ship_to";
		arrProductColumn["ELTnx"][53] = "draft_term";
		
		arrProductColumn["ELTnx"][54] = "neg_tol_pct";
		arrProductColumn["ELTnx"][55] = "pstv_tol_pct";
		arrProductColumn["ELTnx"][57] = "cr_avl_by_code";
		
		arrProductColumn["ELTnx"][58] = "irv_flag";
		arrProductColumn["ELTnx"][59] = "ntrf_flag";
		arrProductColumn["ELTnx"][60] = "stnd_by_lc_flag";
		arrProductColumn["ELTnx"][61] = "cfm_inst_code";
		arrProductColumn["ELTnx"][62] = "cfm_flag";
		arrProductColumn["ELTnx"][63] = "cfm_chrg_brn_by_code";
		arrProductColumn["ELTnx"][64] = "corr_chrg_brn_by_code";
		arrProductColumn["ELTnx"][65] = "open_chrg_brn_by_code";
		
		arrProductColumn["ELTnx"][70] = "IssuingBank@name";
		arrProductColumn["ELTnx"][71] = "IssuingBank@address_line_1";
		arrProductColumn["ELTnx"][72] = "IssuingBank@address_line_2";
		arrProductColumn["ELTnx"][73] = "IssuingBank@dom";
		
		arrProductColumn["ELTnx"][76] = "AdvisingBank@abbv_name";
		arrProductColumn["ELTnx"][77] = "AdvisingBank@name";
		arrProductColumn["ELTnx"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["ELTnx"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["ELTnx"][80] = "AdvisingBank@dom";
		
		arrProductColumn["ELTnx"][84] = "AdviseThruBank@name";
		arrProductColumn["ELTnx"][85] = "AdviseThruBank@address_line_1";
		arrProductColumn["ELTnx"][86] = "AdviseThruBank@address_line_2";
		arrProductColumn["ELTnx"][87] = "AdviseThruBank@dom";
		
		arrProductColumn["ELTnx"][91] = "CreditAvailableWithBank@name";
		arrProductColumn["ELTnx"][92] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["ELTnx"][93] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["ELTnx"][94] = "CreditAvailableWithBank@dom";
		
		arrProductColumn["ELTnx"][98] = "DraweeDetailsBank@name";
		arrProductColumn["ELTnx"][99] = "DraweeDetailsBank@address_line_1";
		arrProductColumn["ELTnx"][100] = "DraweeDetailsBank@address_line_2";
		arrProductColumn["ELTnx"][101] = "DraweeDetailsBank@dom";
		
		/* MPS-50897 :These 3 narrative are removed from report designer in 
		 * swift 2018 onwards. moved them to report_core.xsl to add them conditionally
		arrProductColumn["ELTnx"][104] = "Narrative@goodsDesc";
		arrProductColumn["ELTnx"][105] = "Narrative@docsRequired";
		arrProductColumn["ELTnx"][106] = "Narrative@additionalInstructions";*/
		/*arrProductColumn["ELTnx"][107] = "Narrative@chargesDetails";
		arrProductColumn["ELTnx"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["ELTnx"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["ELTnx"][110] = "Narrative@fullDetails";
		arrProductColumn["ELTnx"][111] = "Narrative@boComment";
	*/	
		arrProductColumn["ELTnx"][108] = "Narrative@periodOfPresentation";
		arrProductColumn["ELTnx"][109] = "Narrative@shipmentPeriod";
		arrProductColumn["ELTnx"][113] = "lc_ref_id";
		arrProductColumn["ELTnx"][114] = "imp_bill_ref_id";
		
		arrProductColumn["ELTnx"][130] = "Inputter@last_name";
		arrProductColumn["ELTnx"][131] = "Inputter@first_name";
		arrProductColumn["ELTnx"][132] = "inp_dttm";
		
		arrProductColumn["ELTnx"][135] = "LastController@validation_dttm";
		arrProductColumn["ELTnx"][136] = "Releaser@last_name";
		arrProductColumn["ELTnx"][137] = "Releaser@first_name";
		arrProductColumn["ELTnx"][138] = "release_dttm";

		arrProductColumn["ELTnx"][139] = "Charge@chrg_code";
		arrProductColumn["ELTnx"][140] = "Charge@amt";
		arrProductColumn["ELTnx"][141] = "Charge@cur_code";
		arrProductColumn["ELTnx"][142] = "Charge@status";
		arrProductColumn["ELTnx"][143] = "Charge@additional_comment";
		arrProductColumn["ELTnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["ELTnx"][145] = "bo_release_dttm";
		arrProductColumn["ELTnx"][146] = "maturity_date";
		
		// Object Data
		arrProductColumn["ELTnx"][147] = "ObjectDataString@mur_codes_sent";
		arrProductColumn["ELTnx"][148] = "ObjectDataString@mur_codes_ack";
		arrProductColumn["ELTnx"][149] = "ObjectDataString@mur_codes_nak";
		arrProductColumn["ELTnx"][150] = "sub_tnx_stat_code";
		arrProductColumn["ELTnx"][151] = "lc_available_amt";
		
		arrProductColumn["ELTnx"][152] = "applicable_rules";
		arrProductColumn["ELTnx"][175] = "LastController@LastControllerUser@first_name";
		arrProductColumn["ELTnx"][176] = "LastController@LastControllerUser@last_name";
		arrProductColumn["ELTnx"][177] = "adv_send_mode_text";
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["EL"][120] = "beneficiary_country";
		//arrProductColumn["EL"][122] = "applicant_country";

		//arrProductColumn["ELTnx"][150] = "beneficiary_country";
		//arrProductColumn["ELTnx"][151] = "sec_beneficiary_country";
		//arrProductColumn["ELTnx"][152] = "applicant_country";
		arrProductColumn["ELTnx"][181] = "Narrative@splPaymentBeneficiary";
		