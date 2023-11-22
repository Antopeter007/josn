dojo.provide("misys.report.definitions.report_ic_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// IC candidate
		//

		// Define an array which stores the IC columns
		

		arrProductColumn["IC"][0] = "ref_id";
		arrProductColumn["IC"][1] = "template_id";
		arrProductColumn["IC"][2] = "bo_ref_id";
		arrProductColumn["IC"][3] = "cust_ref_id";
		arrProductColumn["IC"][7] = "prod_stat_code";
		arrProductColumn["IC"][17] = "appl_date";
		arrProductColumn["IC"][24] = "ic_cur_code";
		arrProductColumn["IC"][25] = "ic_amt";
		arrProductColumn["IC"][26] = "ic_liab_amt";
		arrProductColumn["IC"][27] = "entity";
		
		arrProductColumn["IC"][29] = "drawee_name";
		arrProductColumn["IC"][30] = "drawee_address_line_1";
		arrProductColumn["IC"][31] = "drawee_address_line_2";
		arrProductColumn["IC"][32] = "drawee_dom";
		arrProductColumn["IC"][33] = "drawee_reference";
		
		arrProductColumn["IC"][35] = "drawer_name";
		arrProductColumn["IC"][36] = "drawer_address_line_1";
		arrProductColumn["IC"][37] = "drawer_address_line_2";
		arrProductColumn["IC"][38] = "drawer_dom";
		arrProductColumn["IC"][39] = "drawer_reference";
		arrProductColumn["IC"][40] = "bol_number";
		arrProductColumn["IC"][41] = "shipping_mode";
		arrProductColumn["IC"][42] = "shipping_by";
		arrProductColumn["IC"][43] = "ship_from";
		arrProductColumn["IC"][44] = "ship_to";
		arrProductColumn["IC"][45] = "inco_term";
		arrProductColumn["IC"][112] = "inco_term_year";
		arrProductColumn["IC"][46] = "inco_place";
		arrProductColumn["IC"][47] = "term_code";
		arrProductColumn["IC"][48] = "docs_send_mode";
		arrProductColumn["IC"][50] = "accpt_adv_send_mode";
		arrProductColumn["IC"][51] = "protest_non_paymt";
		arrProductColumn["IC"][52] = "protest_non_accpt";
		arrProductColumn["IC"][53] = "protest_adv_send_mode";
		arrProductColumn["IC"][54] = "accpt_defd_flag";
		arrProductColumn["IC"][55] = "store_goods_flag";
		arrProductColumn["IC"][56] = "paymt_adv_send_mode";
		arrProductColumn["IC"][57] = "tenor_desc";
		arrProductColumn["IC"][58] = "tenor";
		arrProductColumn["IC"][59] = "tenor_unit";
		arrProductColumn["IC"][60] = "tenor_event";
		arrProductColumn["IC"][61] = "tenor_start_date";
		arrProductColumn["IC"][62] = "tenor_maturity_date";
		arrProductColumn["IC"][63] = "waive_chrg_flag";
		arrProductColumn["IC"][64] = "corr_chrg_brn_by_code";
		arrProductColumn["IC"][65] = "open_chrg_brn_by_code";
		arrProductColumn["IC"][66] = "int_rate";
		arrProductColumn["IC"][67] = "int_start_date";
		arrProductColumn["IC"][68] = "int_maturity_date";
		arrProductColumn["IC"][69] = "fwd_contract_no";
		arrProductColumn["IC"][71] = "principal_act_no";
		arrProductColumn["IC"][72] = "fee_act_no";
		
		arrProductColumn["IC"][76] = "PresentingBank@abbv_name";
		arrProductColumn["IC"][77] = "PresentingBank@name";
		arrProductColumn["IC"][78] = "PresentingBank@address_line_1";
		arrProductColumn["IC"][79] = "PresentingBank@address_line_2";
		arrProductColumn["IC"][80] = "PresentingBank@dom";
		
		arrProductColumn["IC"][85] = "CollectingBank@name";
		arrProductColumn["IC"][86] = "CollectingBank@address_line_1";
		arrProductColumn["IC"][87] = "CollectingBank@address_line_2";
		arrProductColumn["IC"][88] = "CollectingBank@dom";
		
		arrProductColumn["IC"][90] = "RemittingBank@name";
		arrProductColumn["IC"][91] = "RemittingBank@address_line_1";
		arrProductColumn["IC"][92] = "RemittingBank@address_line_2";
		arrProductColumn["IC"][93] = "RemittingBank@dom";
		
	//	arrProductColumn["IC"][105] = "Narrative@additionalInstructions";

		arrProductColumn["IC"][106] = "Charge@chrg_code";
		arrProductColumn["IC"][107] = "Charge@amt";
		arrProductColumn["IC"][108] = "Charge@cur_code";
		arrProductColumn["IC"][109] = "Charge@status";
		arrProductColumn["IC"][110] = "Charge@additional_comment";
		arrProductColumn["IC"][111] = "Charge@settlement_date";

		//arrProductColumn["IC"][114] = "lc_ref_id";

		arrProductColumn["IC"][115] = "Document@code";
		arrProductColumn["IC"][116] = "Document@name";
		arrProductColumn["IC"][117] = "Document@first_mail";
		arrProductColumn["IC"][118] = "Document@second_mail";
		arrProductColumn["IC"][119] = "Document@total";
		arrProductColumn["IC"][120] = "tenor_base_date" ;
		arrProductColumn["IC"][121] = "tenor_type" ;
		arrProductColumn["IC"][122] = "tenor_days" ;
		arrProductColumn["IC"][123] = "tenor_period" ;
		arrProductColumn["IC"][124] = "tenor_from_after" ;
		arrProductColumn["IC"][125] = "tenor_days_type" ;
		arrProductColumn["IC"][126] = "tenor_type_details" ;
		arrProductColumn["IC"][127] = "ic_outstanding_amt" ;
		arrProductColumn["IC"][128] = "imp_bill_ref_id" ;
		arrProductColumn["IC"][130] = "Narrative@goodsDesc";
		//
		// IC Transaction candidate
		//

		// Define an array which stores the IC Transaction columns
		

		arrProductColumn["ICTnx"][0] = "ref_id";
		arrProductColumn["ICTnx"][1] = "template_id";
		arrProductColumn["ICTnx"][2] = "bo_ref_id";
		arrProductColumn["ICTnx"][3] = "bo_tnx_id";
		arrProductColumn["ICTnx"][4] = "cust_ref_id";
		arrProductColumn["ICTnx"][5] = "tnx_type_code";
		arrProductColumn["ICTnx"][6] = "sub_tnx_type_code";
		arrProductColumn["ICTnx"][7] = "prod_stat_code";
		arrProductColumn["ICTnx"][14] = "tnx_val_date";
		arrProductColumn["ICTnx"][15] = "tnx_amt";
		arrProductColumn["ICTnx"][16] = "tnx_cur_code";
		
		arrProductColumn["ICTnx"][17] = "tnx_stat_code";
		
		arrProductColumn["ICTnx"][18] = "appl_date";
		arrProductColumn["ICTnx"][24] = "ic_cur_code";
		arrProductColumn["ICTnx"][25] = "ic_amt";
		arrProductColumn["ICTnx"][26] = "ic_liab_amt";
		arrProductColumn["ICTnx"][27] = "entity";
		
		arrProductColumn["ICTnx"][29] = "drawee_name";
		arrProductColumn["ICTnx"][30] = "drawee_address_line_1";
		arrProductColumn["ICTnx"][31] = "drawee_address_line_2";
		arrProductColumn["ICTnx"][32] = "drawee_dom";
		arrProductColumn["ICTnx"][33] = "drawee_reference";
		
		arrProductColumn["ICTnx"][35] = "drawer_name";
		arrProductColumn["ICTnx"][36] = "drawer_address_line_1";
		arrProductColumn["ICTnx"][37] = "drawer_address_line_2";
		arrProductColumn["ICTnx"][38] = "drawer_dom";
		arrProductColumn["ICTnx"][39] = "drawer_reference";
		arrProductColumn["ICTnx"][40] = "bol_number";
		arrProductColumn["ICTnx"][41] = "shipping_mode";
		arrProductColumn["ICTnx"][42] = "shipping_by";
		arrProductColumn["ICTnx"][43] = "ship_from";
		arrProductColumn["ICTnx"][44] = "ship_to";
		arrProductColumn["ICTnx"][45] = "inco_term";
		arrProductColumn["ICTnx"][112] = "inco_term_year";
		arrProductColumn["ICTnx"][46] = "inco_place";
		arrProductColumn["ICTnx"][47] = "term_code";
		arrProductColumn["ICTnx"][48] = "docs_send_mode";
		arrProductColumn["ICTnx"][50] = "accpt_adv_send_mode";
		arrProductColumn["ICTnx"][51] = "protest_non_paymt";
		arrProductColumn["ICTnx"][52] = "protest_non_accpt";
		arrProductColumn["ICTnx"][53] = "protest_adv_send_mode";
		arrProductColumn["ICTnx"][54] = "accpt_defd_flag";
		arrProductColumn["ICTnx"][55] = "store_goods_flag";
		arrProductColumn["ICTnx"][56] = "paymt_adv_send_mode";
		arrProductColumn["ICTnx"][57] = "tenor_desc";
		arrProductColumn["ICTnx"][58] = "tenor";
		arrProductColumn["ICTnx"][59] = "tenor_unit";
		arrProductColumn["ICTnx"][60] = "tenor_event";
		arrProductColumn["ICTnx"][61] = "tenor_start_date";
		arrProductColumn["ICTnx"][62] = "tenor_maturity_date";
		arrProductColumn["ICTnx"][63] = "waive_chrg_flag";
		arrProductColumn["ICTnx"][64] = "corr_chrg_brn_by_code";
		arrProductColumn["ICTnx"][65] = "open_chrg_brn_by_code";
		arrProductColumn["ICTnx"][66] = "int_rate";
		arrProductColumn["ICTnx"][67] = "int_start_date";
		arrProductColumn["ICTnx"][68] = "int_maturity_date";
		arrProductColumn["ICTnx"][69] = "fwd_contract_no";
		arrProductColumn["ICTnx"][71] = "principal_act_no";
		arrProductColumn["ICTnx"][72] = "fee_act_no";
		
		arrProductColumn["ICTnx"][76] = "PresentingBank@abbv_name";
		arrProductColumn["ICTnx"][77] = "PresentingBank@name";
		arrProductColumn["ICTnx"][78] = "PresentingBank@address_line_1";
		arrProductColumn["ICTnx"][79] = "PresentingBank@address_line_2";
		arrProductColumn["ICTnx"][80] = "PresentingBank@dom";
		
		arrProductColumn["ICTnx"][85] = "CollectingBank@name";
		arrProductColumn["ICTnx"][86] = "CollectingBank@address_line_1";
		arrProductColumn["ICTnx"][87] = "CollectingBank@address_line_2";
		arrProductColumn["ICTnx"][88] = "CollectingBank@dom";
		
		arrProductColumn["ICTnx"][90] = "RemittingBank@name";
		arrProductColumn["ICTnx"][91] = "RemittingBank@address_line_1";
		arrProductColumn["ICTnx"][92] = "RemittingBank@address_line_2";
		arrProductColumn["ICTnx"][93] = "RemittingBank@dom";
		
		/*arrProductColumn["ICTnx"][105] = "Narrative@additionalInstructions";
		arrProductColumn["ICTnx"][106] = "Narrative@boComment";
		arrProductColumn["ICTnx"][107] = "Narrative@freeFormatText";	*/	
		//arrProductColumn["ICTnx"][114] = "lc_ref_id";

		arrProductColumn["ICTnx"][130] = "Inputter@last_name";
		arrProductColumn["ICTnx"][131] = "Inputter@first_name";
		arrProductColumn["ICTnx"][132] = "inp_dttm";
		arrProductColumn["ICTnx"][135] = "LastController@validation_dttm";
		arrProductColumn["ICTnx"][136] = "Releaser@last_name";
		arrProductColumn["ICTnx"][137] = "Releaser@first_name";
		arrProductColumn["ICTnx"][138] = "release_dttm";

		arrProductColumn["ICTnx"][139] = "Charge@chrg_code";
		arrProductColumn["ICTnx"][140] = "Charge@amt";
		arrProductColumn["ICTnx"][141] = "Charge@cur_code";
		arrProductColumn["ICTnx"][142] = "Charge@status";
		arrProductColumn["ICTnx"][143] = "Charge@additional_comment";
		arrProductColumn["ICTnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["ICTnx"][145] = "bo_release_dttm";

		arrProductColumn["ICTnx"][146] = "Document@code";
		arrProductColumn["ICTnx"][147] = "Document@name";
		arrProductColumn["ICTnx"][148] = "Document@first_mail";
		arrProductColumn["ICTnx"][149] = "Document@second_mail";
		arrProductColumn["ICTnx"][150] = "Document@total";
		
		//arrProductColumn["ICTnx"][151] = "maturity_date";
		//arrProductColumn["ICTnx"][152] = "sub_tnx_stat_code";
		arrProductColumn["ICTnx"][153] = "tenor_base_date" ;
		arrProductColumn["ICTnx"][154] = "tenor_type" ;
		arrProductColumn["ICTnx"][155] = "tenor_days" ;
		arrProductColumn["ICTnx"][156] = "tenor_period" ;
		arrProductColumn["ICTnx"][157] = "tenor_from_after" ;
		arrProductColumn["ICTnx"][158] = "tenor_days_type" ;
		arrProductColumn["ICTnx"][159] = "tenor_type_details" ;
		arrProductColumn["ICTnx"][160] = "ic_outstanding_amt" ;
		arrProductColumn["ICTnx"][162] = "maturity_date";
		arrProductColumn["ICTnx"][163] = "sub_tnx_stat_code";
		arrProductColumn["ICTnx"][168] = "LastController@LastControllerUser@first_name";
		arrProductColumn["ICTnx"][169] = "LastController@LastControllerUser@last_name";
		//arrProductColumn["ICTnx"][170] = "imp_bill_ref_id";
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["IC"][120] = "drawee_country";
		//arrProductColumn["IC"][121] = "drawer_country";
		
		//arrProductColumn["ICTnx"][170] = "drawee_country";
		//arrProductColumn["ICTnx"][171] = "drawer_country";
		arrProductColumn["ICTnx"][175] = "Narrative@goodsDesc";