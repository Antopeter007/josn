dojo.provide("misys.report.definitions.report_ec_candidate");


		// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// EC candidate
		//

		// Define an array which stores the EC columns
		

		arrProductColumn["EC"][0] = "ref_id";
		arrProductColumn["EC"][1] = "template_id";
		arrProductColumn["EC"][2] = "bo_ref_id";
		arrProductColumn["EC"][3] = "cust_ref_id";
		arrProductColumn["EC"][4] = "adv_send_mode";
		arrProductColumn["EC"][7] = "prod_stat_code";
		arrProductColumn["EC"][17] = "appl_date";
		arrProductColumn["EC"][24] = "ec_cur_code";
		arrProductColumn["EC"][25] = "ec_amt";
		arrProductColumn["EC"][26] = "ec_liab_amt";
		arrProductColumn["EC"][27] = "ec_type_code";
		arrProductColumn["EC"][28] = "entity";
		arrProductColumn["EC"][29] = "drawee_name";
		arrProductColumn["EC"][30] = "drawee_address_line_1";
		arrProductColumn["EC"][31] = "drawee_address_line_2";
		arrProductColumn["EC"][32] = "drawee_dom";
		arrProductColumn["EC"][33] = "drawee_reference";
		
		arrProductColumn["EC"][35] = "drawer_name";
		arrProductColumn["EC"][36] = "drawer_address_line_1";
		arrProductColumn["EC"][37] = "drawer_address_line_2";
		arrProductColumn["EC"][38] = "drawer_dom";
		arrProductColumn["EC"][39] = "drawer_reference";
		arrProductColumn["EC"][40] = "bol_number";
		arrProductColumn["EC"][41] = "shipping_mode";
		arrProductColumn["EC"][42] = "shipping_by";
		arrProductColumn["EC"][43] = "ship_from";
		arrProductColumn["EC"][44] = "ship_to";
		arrProductColumn["EC"][45] = "inco_term";
		arrProductColumn["EC"][112] = "inco_term_year";
		arrProductColumn["EC"][46] = "inco_place";
		arrProductColumn["EC"][47] = "term_code";
		arrProductColumn["EC"][48] = "docs_send_mode";
		arrProductColumn["EC"][49] = "dir_coll_letter_flag";
		arrProductColumn["EC"][50] = "accpt_adv_send_mode";
		arrProductColumn["EC"][51] = "protest_non_paymt";
		arrProductColumn["EC"][52] = "protest_non_accpt";
		arrProductColumn["EC"][53] = "protest_adv_send_mode";
		arrProductColumn["EC"][54] = "accpt_defd_flag";
		arrProductColumn["EC"][55] = "store_goods_flag";
		
		arrProductColumn["EC"][56] = "needs_refer_to";
		arrProductColumn["EC"][57] = "needs_instr_by_code";
		
		arrProductColumn["EC"][58] = "paymt_adv_send_mode";
		arrProductColumn["EC"][59] = "tenor_desc";
		arrProductColumn["EC"][60] = "tenor";
		arrProductColumn["EC"][61] = "tenor_unit";
		arrProductColumn["EC"][62] = "tenor_event";
		arrProductColumn["EC"][63] = "tenor_start_date";
		arrProductColumn["EC"][64] = "tenor_maturity_date";
		arrProductColumn["EC"][65] = "waive_chrg_flag";
		arrProductColumn["EC"][66] = "corr_chrg_brn_by_code";
		arrProductColumn["EC"][67] = "open_chrg_brn_by_code";
		arrProductColumn["EC"][68] = "int_rate";
		arrProductColumn["EC"][69] = "int_start_date";
		arrProductColumn["EC"][70] = "int_maturity_date";
		arrProductColumn["EC"][71] = "fwd_contract_no";
		arrProductColumn["EC"][72] = "insr_req_flag";
		arrProductColumn["EC"][73] = "principal_act_no";
		arrProductColumn["EC"][74] = "fee_act_no";
		
		arrProductColumn["EC"][76] = "RemittingBank@abbv_name";
		arrProductColumn["EC"][77] = "RemittingBank@name";
		arrProductColumn["EC"][78] = "RemittingBank@address_line_1";
		arrProductColumn["EC"][79] = "RemittingBank@address_line_2";
		arrProductColumn["EC"][80] = "RemittingBank@dom";
		
		arrProductColumn["EC"][85] = "CollectingBank@name";
		arrProductColumn["EC"][86] = "CollectingBank@address_line_1";
		arrProductColumn["EC"][87] = "CollectingBank@address_line_2";
		arrProductColumn["EC"][88] = "CollectingBank@dom";
		
		arrProductColumn["EC"][90] = "PresentingBank@name";
		arrProductColumn["EC"][91] = "PresentingBank@address_line_1";
		arrProductColumn["EC"][92] = "PresentingBank@address_line_2";
		arrProductColumn["EC"][93] = "PresentingBank@dom";
		
		arrProductColumn["EC"][95] = "CorrespondentBank@name";
		arrProductColumn["EC"][96] = "CorrespondentBank@address_line_1";
		arrProductColumn["EC"][97] = "CorrespondentgBank@address_line_2";
		arrProductColumn["EC"][98] = "CorrespondentBank@dom";
		
		//arrProductColumn["EC"][105] = "Narrative@additionalInstructions";

		arrProductColumn["EC"][106] = "Charge@chrg_code";
		arrProductColumn["EC"][107] = "Charge@amt";
		arrProductColumn["EC"][108] = "Charge@cur_code";
		arrProductColumn["EC"][109] = "Charge@status";
		arrProductColumn["EC"][110] = "Charge@additional_comment";
		arrProductColumn["EC"][111] = "Charge@settlement_date";

		//arrProductColumn["EC"][114] = "lc_ref_id";

		arrProductColumn["EC"][115] = "Document@code";
		arrProductColumn["EC"][116] = "Document@name";
		arrProductColumn["EC"][117] = "Document@first_mail";
		arrProductColumn["EC"][118] = "Document@second_mail";
		arrProductColumn["EC"][119] = "Document@total";
		arrProductColumn["EC"][120] = "Document@doc_no";
		arrProductColumn["EC"][121] = "Document@doc_date";
		arrProductColumn["EC"][122] = "tenor_base_date" ;
		arrProductColumn["EC"][123] = "tenor_type" ;
		arrProductColumn["EC"][124] = "tenor_days" ;
		arrProductColumn["EC"][125] = "tenor_period" ;
		arrProductColumn["EC"][126] = "tenor_from_after" ;
		arrProductColumn["EC"][127] = "tenor_days_type" ;
		arrProductColumn["EC"][128] = "tenor_type_details" ;
		
		arrProductColumn["EC"][129] = "amd_no";
		arrProductColumn["EC"][130] = "amd_date";
		arrProductColumn["EC"][131] = "ec_outstanding_amt";
		arrProductColumn["EC"][132] = "imp_bill_ref_id";
		arrProductColumn["EC"][135] = "Narrative@goodsDesc";
		//
		// EC Transaction candidate
		//

		// Define an array which stores the EC Transaction columns
		

		arrProductColumn["ECTnx"][0] = "ref_id";
		arrProductColumn["ECTnx"][1] = "template_id";
		arrProductColumn["ECTnx"][2] = "bo_ref_id";
		arrProductColumn["ECTnx"][3] = "bo_tnx_id";
		arrProductColumn["ECTnx"][4] = "cust_ref_id";
		arrProductColumn["ECTnx"][5] = "adv_send_mode";
		arrProductColumn["ECTnx"][6] = "tnx_type_code";
		arrProductColumn["ECTnx"][7] = "sub_tnx_type_code";
		arrProductColumn["ECTnx"][8] = "prod_stat_code";
		arrProductColumn["ECTnx"][14] = "tnx_val_date";
		arrProductColumn["ECTnx"][15] = "tnx_amt";
		arrProductColumn["ECTnx"][16] = "tnx_cur_code";
		arrProductColumn["ECTnx"][17] = "tnx_stat_code";
		
		arrProductColumn["ECTnx"][18] = "appl_date";
		arrProductColumn["ECTnx"][24] = "ec_cur_code";
		arrProductColumn["ECTnx"][25] = "ec_amt";
		arrProductColumn["ECTnx"][26] = "ec_liab_amt";
		arrProductColumn["ECTnx"][27] = "ec_type_code";
		arrProductColumn["ECTnx"][28] = "entity";
		arrProductColumn["ECTnx"][29] = "drawee_name";
		arrProductColumn["ECTnx"][30] = "drawee_address_line_1";
		arrProductColumn["ECTnx"][31] = "drawee_address_line_2";
		arrProductColumn["ECTnx"][32] = "drawee_dom";
		arrProductColumn["ECTnx"][33] = "drawee_reference";
		
		arrProductColumn["ECTnx"][35] = "drawer_name";
		arrProductColumn["ECTnx"][36] = "drawer_address_line_1";
		arrProductColumn["ECTnx"][37] = "drawer_address_line_2";
		arrProductColumn["ECTnx"][38] = "drawer_dom";
		arrProductColumn["ECTnx"][39] = "drawer_reference";
		arrProductColumn["ECTnx"][40] = "bol_number";
		arrProductColumn["ECTnx"][41] = "shipping_mode";
		arrProductColumn["ECTnx"][42] = "shipping_by";
		arrProductColumn["ECTnx"][43] = "ship_from";
		arrProductColumn["ECTnx"][44] = "ship_to";
		arrProductColumn["ECTnx"][45] = "inco_term";
		arrProductColumn["ECTnx"][112] = "inco_term_year";
		arrProductColumn["ECTnx"][46] = "inco_place";
		arrProductColumn["ECTnx"][47] = "term_code";
		arrProductColumn["ECTnx"][48] = "docs_send_mode";
		arrProductColumn["ECTnx"][49] = "dir_coll_letter_flag";
		arrProductColumn["ECTnx"][50] = "accpt_adv_send_mode";
		arrProductColumn["ECTnx"][51] = "protest_non_paymt";
		arrProductColumn["ECTnx"][52] = "protest_non_accpt";
		arrProductColumn["ECTnx"][53] = "protest_adv_send_mode";
		arrProductColumn["ECTnx"][54] = "accpt_defd_flag";
		arrProductColumn["ECTnx"][55] = "store_goods_flag";
		
		arrProductColumn["ECTnx"][56] = "needs_refer_to";
		arrProductColumn["ECTnx"][57] = "needs_instr_by_code";
		
		arrProductColumn["ECTnx"][58] = "paymt_adv_send_mode";
		arrProductColumn["ECTnx"][59] = "tenor_desc";
		arrProductColumn["ECTnx"][60] = "tenor";
		arrProductColumn["ECTnx"][61] = "tenor_unit";
		arrProductColumn["ECTnx"][62] = "tenor_event";
		arrProductColumn["ECTnx"][63] = "tenor_start_date";
		arrProductColumn["ECTnx"][64] = "tenor_maturity_date";
		arrProductColumn["ECTnx"][65] = "waive_chrg_flag";
		arrProductColumn["ECTnx"][66] = "corr_chrg_brn_by_code";
		arrProductColumn["ECTnx"][67] = "open_chrg_brn_by_code";
		arrProductColumn["ECTnx"][68] = "int_rate";
		arrProductColumn["ECTnx"][69] = "int_start_date";
		arrProductColumn["ECTnx"][70] = "int_maturity_date";
		arrProductColumn["ECTnx"][71] = "fwd_contract_no";
		arrProductColumn["ECTnx"][72] = "insr_req_flag";
		arrProductColumn["ECTnx"][73] = "principal_act_no";
		arrProductColumn["ECTnx"][74] = "fee_act_no";
		
		arrProductColumn["ECTnx"][76] = "RemittingBank@abbv_name";
		arrProductColumn["ECTnx"][77] = "RemittingBank@name";
		arrProductColumn["ECTnx"][78] = "RemittingBank@address_line_1";
		arrProductColumn["ECTnx"][79] = "RemittingBank@address_line_2";
		arrProductColumn["ECTnx"][80] = "RemittingBank@dom";
		
		arrProductColumn["ECTnx"][85] = "CollectingBank@name";
		arrProductColumn["ECTnx"][86] = "CollectingBank@address_line_1";
		arrProductColumn["ECTnx"][87] = "CollectingBank@address_line_2";
		arrProductColumn["ECTnx"][88] = "CollectingBank@dom";
		
		arrProductColumn["ECTnx"][90] = "PresentingBank@name";
		arrProductColumn["ECTnx"][91] = "PresentingBank@address_line_1";
		arrProductColumn["ECTnx"][92] = "PresentingBank@address_line_2";
		arrProductColumn["ECTnx"][93] = "PresentingBank@dom";
		
		arrProductColumn["ECTnx"][95] = "CorrespondentBank@name";
		arrProductColumn["ECTnx"][96] = "CorrespondentBank@address_line_1";
		arrProductColumn["ECTnx"][97] = "CorrespondentBank@address_line_2";
		arrProductColumn["ECTnx"][98] = "CorrespondentBank@dom";
		
		/*arrProductColumn["ECTnx"][105] = "Narrative@additionalInstructions";
		arrProductColumn["ECTnx"][106] = "Narrative@boComment";
		arrProductColumn["ECTnx"][107] = "Narrative@freeFormatText";		
		*///arrProductColumn["ECTnx"][114] = "lc_ref_id";

		arrProductColumn["ECTnx"][130] = "Inputter@last_name";
		arrProductColumn["ECTnx"][131] = "Inputter@first_name";
		arrProductColumn["ECTnx"][132] = "inp_dttm";
		arrProductColumn["ECTnx"][135] = "LastController@validation_dttm";
		arrProductColumn["ECTnx"][136] = "Releaser@last_name";
		arrProductColumn["ECTnx"][137] = "Releaser@first_name";
		arrProductColumn["ECTnx"][138] = "release_dttm";

		arrProductColumn["ECTnx"][139] = "Charge@chrg_code";
		arrProductColumn["ECTnx"][140] = "Charge@amt";
		arrProductColumn["ECTnx"][141] = "Charge@cur_code";
		arrProductColumn["ECTnx"][142] = "Charge@status";
		arrProductColumn["ECTnx"][143] = "Charge@additional_comment";
		arrProductColumn["ECTnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["ECTnx"][145] = "bo_release_dttm";

		arrProductColumn["ECTnx"][146] = "Document@code";
		arrProductColumn["ECTnx"][147] = "Document@name";
		arrProductColumn["ECTnx"][148] = "Document@first_mail";
		arrProductColumn["ECTnx"][149] = "Document@second_mail";


		//GTPB 4320 id from 150 to 158 used in report.xsl to list ids present only on bank side
		arrProductColumn["ECTnx"][160] = "maturity_date";
		arrProductColumn["ECTnx"][161] = "sub_tnx_stat_code";
		arrProductColumn["ECTnx"][162] = "tenor_base_date" ;
		arrProductColumn["ECTnx"][163] = "tenor_type" ;
		arrProductColumn["ECTnx"][164] = "tenor_days" ;
		arrProductColumn["ECTnx"][165] = "tenor_period" ;
		arrProductColumn["ECTnx"][166] = "tenor_from_after" ;
		arrProductColumn["ECTnx"][167] = "tenor_days_type" ;
		arrProductColumn["ECTnx"][168] = "tenor_type_details" ;
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["EC"][120] = "drawee_country";
		//arrProductColumn["EC"][121] = "drawer_country";
		
		//arrProductColumn["ECTnx"][170] = "drawee_country";
		//arrProductColumn["ECTnx"][171] = "drawer_country";
		arrProductColumn["ECTnx"][172] = "amd_no";
		arrProductColumn["ECTnx"][173] = "amd_date";
		arrProductColumn["ECTnx"][174] = "ec_outstanding_amt";
		arrProductColumn["ECTnx"][195] = "LastController@LastControllerUser@first_name";
		arrProductColumn["ECTnx"][196] = "LastController@LastControllerUser@last_name";
		//arrProductColumn["ECTnx"][112] = "imp_bill_ref_id";

    	arrProductColumn["ECTnx"][197] = "Document@total";
		arrProductColumn["ECTnx"][198] = "Document@doc_no";
		arrProductColumn["ECTnx"][199] = "Document@doc_date";
		arrProductColumn["ECTnx"][200] = "amd_req_no";
		arrProductColumn["ECTnx"][205] = "Narrative@goodsDesc";
		
		