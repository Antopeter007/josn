dojo.provide("misys.report.definitions.report_lc_template_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
		
		//
		// LC Template candidate
		//
		
		// Define an array which stores the LC Template columns
		

		arrProductColumn["LCTemplate"][0] = "template_id";
		arrProductColumn["LCTemplate"][1] = "template_description";
		arrProductColumn["LCTemplate"][27] = "lc_type";
		
		arrProductColumn["LCTemplate"][29] = "beneficiary_name";
		arrProductColumn["LCTemplate"][30] = "beneficiary_address_line_1";
		arrProductColumn["LCTemplate"][31] = "beneficiary_address_line_2";
		arrProductColumn["LCTemplate"][32] = "beneficiary_dom";
		arrProductColumn["LCTemplate"][33] = "beneficiary_reference";
		
		arrProductColumn["LCTemplate"][35] = "applicant_name";
		arrProductColumn["LCTemplate"][36] = "applicant_address_line_1";
		arrProductColumn["LCTemplate"][37] = "applicant_address_line_2";
		arrProductColumn["LCTemplate"][38] = "applicant_dom";
		arrProductColumn["LCTemplate"][39] = "applicant_reference";
		arrProductColumn["LCTemplate"][40] = "expiry_place";
		arrProductColumn["LCTemplate"][41] = "inco_term";
		arrProductColumn["LCTemplate"][112] = "inco_term_year";
		arrProductColumn["LCTemplate"][42] = "inco_place";
		arrProductColumn["LCTemplate"][43] = "part_ship_detl";
		//SWIFT 2018
		arrProductColumn["LCTemplate"][44] = "tran_ship_detl";
		arrProductColumn["LCTemplate"][45] = "ship_from";
		// SWIFT 2006
		arrProductColumn["LCTemplate"][46] = "ship_loading";
		arrProductColumn["LCTemplate"][47] = "ship_discharge";
		// SWIFT 2006
		arrProductColumn["LCTemplate"][48] = "ship_to";
		arrProductColumn["LCTemplate"][49] = "draft_term";
		arrProductColumn["LCTemplate"][50] = "cty_of_dest";
		arrProductColumn["LCTemplate"][51] = "neg_tol_pct";
		arrProductColumn["LCTemplate"][52] = "pstv_tol_pct";
		//arrProductColumn["LCTemplate"][53] = "max_cr_desc_code";
		arrProductColumn["LCTemplate"][54] = "cr_avl_by_code";
		arrProductColumn["LCTemplate"][55] = "dir_reim_flag";
		arrProductColumn["LCTemplate"][56] = "irv_flag";
		arrProductColumn["LCTemplate"][57] = "ntf_flag";
		arrProductColumn["LCTemplate"][58] = "stnd_by_lc_flag";
		arrProductColumn["LCTemplate"][59] = "cfm_inst_code";
		arrProductColumn["LCTemplate"][60] = "cfm_flag";
		arrProductColumn["LCTemplate"][61] = "cfm_chrg_brn_by_code";
		arrProductColumn["LCTemplate"][62] = "corr_chrg_brn_by_code";
		arrProductColumn["LCTemplate"][63] = "open_chrg_brn_by_code";
		arrProductColumn["LCTemplate"][69] = "IssuingBank@abbv_name";
		arrProductColumn["LCTemplate"][70] = "IssuingBank@name";
		arrProductColumn["LCTemplate"][71] = "IssuingBank@address_line_1";
		arrProductColumn["LCTemplate"][72] = "IssuingBank@address_line_2";
		arrProductColumn["LCTemplate"][73] = "IssuingBank@dom";
		
		arrProductColumn["LCTemplate"][77] = "AdvisingBank@name";
		arrProductColumn["LCTemplate"][78] = "AdvisingBank@address_line_1";
		arrProductColumn["LCTemplate"][79] = "AdvisingBank@address_line_2";
		arrProductColumn["LCTemplate"][80] = "AdvisingBank@dom";
		
		arrProductColumn["LCTemplate"][84] = "AdviseThruBank@name";
		arrProductColumn["LCTemplate"][85] = "AdviseThruBank@address_line_1";
		arrProductColumn["LCTemplate"][86] = "AdviseThruBank@address_line_2";
		arrProductColumn["LCTemplate"][87] = "AdviseThruBank@dom";
		
		arrProductColumn["LCTemplate"][91] = "CreditAvailableWithBank@name";
		arrProductColumn["LCTemplate"][92] = "CreditAvailableWithBank@address_line_1";
		arrProductColumn["LCTemplate"][93] = "CreditAvailableWithBank@address_line_2";
		arrProductColumn["LCTemplate"][94] = "CreditAvailableWithBank@dom";
		
		arrProductColumn["LCTemplate"][98] = "DraweeDetailsBank@name";
		arrProductColumn["LCTemplate"][99] = "DraweeDetailsBank@address_line_1";
		arrProductColumn["LCTemplate"][100] = "DraweeDetailsBank@address_line_2";
		arrProductColumn["LCTemplate"][101] = "DraweeDetailsBank@dom";
		
		/* MPS-50897 :These 3 narrative are removed from report designer in 
		 * swift 2018 onwards. moved them to report_core.xsl to add them conditionally
		arrProductColumn["LCTemplate"][104] = "Narrative@goodsDesc";
		arrProductColumn["LCTemplate"][105] = "Narrative@docsRequired";
		arrProductColumn["LCTemplate"][106] = "Narrative@additionalInstructions";*/
	/*	arrProductColumn["LCTemplate"][107] = "Narrative@chargesDetails";
		arrProductColumn["LCTemplate"][108] = "Narrative@additionalAmount";
		arrProductColumn["LCTemplate"][109] = "Narrative@paymentInstructions";
		arrProductColumn["LCTemplate"][110] = "Narrative@periodOfPresentation";
		arrProductColumn["LCTemplate"][111] = "Narrative@shipmentPeriod";
		arrProductColumn["LCTemplate"][112] = "Narrative@senderToReceiver";*/
		arrProductColumn["LCTemplate"][110] = "Narrative@periodOfPresentation";
		arrProductColumn["LCTemplate"][113] = "revolving_flag";
		arrProductColumn["LCTemplate"][114] = "revolve_period";
		arrProductColumn["LCTemplate"][115] = "revolve_frequency";
		arrProductColumn["LCTemplate"][116] = "revolve_time_no";
		arrProductColumn["LCTemplate"][117] = "cumulative_flag";
		arrProductColumn["LCTemplate"][118] = "next_revolve_date";
		arrProductColumn["LCTemplate"][119] = "notice_days";
		arrProductColumn["LCTemplate"][120] = "charge_upto";
		
		arrProductColumn["LCTemplate"][121] = "alt_applicant_name";
		arrProductColumn["LCTemplate"][122] = "alt_applicant_address_line_1";
		arrProductColumn["LCTemplate"][123] = "alt_applicant_address_line_2";
		arrProductColumn["LCTemplate"][124] = "alt_applicant_dom";
		arrProductColumn["LCTemplate"][125] = "alt_applicant_country";
		arrProductColumn["LCTemplate"][126] = "for_account_flag";
		arrProductColumn["LCTemplate"][134] = "adv_send_mode";
		arrProductColumn["LCTemplate"][135] = "adv_send_mode_text";
		
		arrProductColumn["LCTemplate"][150] = "PresentingBank@abbv_name";
		arrProductColumn["LCTemplate"][151] = "PresentingBank@name";
		arrProductColumn["LCTemplate"][152] = "PresentingBank@address_line_1";
		arrProductColumn["LCTemplate"][153] = "PresentingBank@address_line_2";
		arrProductColumn["LCTemplate"][154] = "PresentingBank@dom";
		
		arrProductColumn["LCTemplate"][157] = "Narrative@splPaymentBeneficiary";
		arrProductColumn["LCTemplate"][158] = "Narrative@shipmentPeriod";
		

		if (misys._config.shipment_period_standard === false) {
			arrProductColumn["LCTemplate"][155] = "ship_name";
			arrProductColumn["LCTemplate"][156] = "ship_period";
		}
		
		// Object data  
		
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["LCTemplate"][120] = "beneficiary_country";
		//arrProductColumn["LCTemplate"][121] = "applicant_country";