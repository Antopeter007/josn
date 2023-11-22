dojo.provide("misys.report.definitions.report_se_candidate");
/*jsl:ignoreall*/

		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		// SE candidate
		// Define an array which stores the SG columns
		
		
		arrProductColumn["SE"][0] = "ref_id";
		arrProductColumn["SE"][2] = "bo_ref_id";
		arrProductColumn["SE"][3] = "cust_ref_id";
		arrProductColumn["SE"][7] = "prod_stat_code";
		arrProductColumn["SE"][17] = "appl_date";
		
		
		arrProductColumn["SE"][25] = "se_cur_code";
		arrProductColumn["SE"][26] = "se_amt";
		arrProductColumn["SE"][28] = "entity";
		
		
		arrProductColumn["SE"][41] = "applicant_name";
		arrProductColumn["SE"][42] = "applicant_address_line_1";
		arrProductColumn["SE"][43] = "applicant_address_line_2";
		arrProductColumn["SE"][44] = "applicant_dom";
		arrProductColumn["SE"][45] = "applicant_reference";
		
		arrProductColumn["SE"][69] = "IssuingBank@abbv_name";
		arrProductColumn["SE"][70] = "IssuingBank@name";
		arrProductColumn["SE"][71] = "IssuingBank@address_line_1";
		arrProductColumn["SE"][72] = "IssuingBank@address_line_2";
		arrProductColumn["SE"][73] = "IssuingBank@dom";
		

		arrProductColumn["SE"][78] = "Charge@chrg_code";
		arrProductColumn["SE"][79] = "Charge@amt";
		arrProductColumn["SE"][80] = "Charge@cur_code";
		arrProductColumn["SE"][81] = "Charge@status";
		arrProductColumn["SE"][82] = "Charge@additional_comment";
		arrProductColumn["SE"][83] = "Charge@settlement_date";
		
		arrProductColumn["SE"][84] = "se_type";
		arrProductColumn["SE"][85] = "priority";
		arrProductColumn["SE"][86] = "issuer_type";
		arrProductColumn["SE"][87] = "req_read_receipt";
		arrProductColumn["SE"][88] = "read_dttm";
		
		arrProductColumn["SE"][205] = "topic";
		
		
		arrProductColumn["SE"][207] = "se_act_no";
		
		arrProductColumn["SE"][208] = "ObjectDataString@upload_file_type";
		
		arrProductColumn["SE"][209] = "ObjectDataString@file_system_name";
		arrProductColumn["SE"][210] = "ObjectDataString@file_type_name";
		arrProductColumn["SE"][211] = "ObjectDataString@tenor_days_type";
		arrProductColumn["SE"][212] = "ObjectDataString@tenor_maturity_date";
		arrProductColumn["SE"][213] = "ObjectDataString@deduct_cur_code";
		arrProductColumn["SE"][214] = "ObjectDataString@deduct_amt";
		arrProductColumn["SE"][215] = "ObjectDataString@to_act_no";
		arrProductColumn["SE"][216] = "ObjectDataString@add_cur_code";
		arrProductColumn["SE"][217] = "ObjectDataString@add_amt";
		arrProductColumn["SE"][218] = "ObjectDataString@from_act_no";
		arrProductColumn["SE"][219] = "ObjectDataString@close_act_no";
		arrProductColumn["SE"][220] = "ObjectDataString@instruction_radio";
		arrProductColumn["SE"][221] = "ObjectDataString@checkbook_no";
		arrProductColumn["SE"][222] = "ObjectDataString@chequebook_format";
		arrProductColumn["SE"][223] = "ObjectDataString@date_time";
		
		arrProductColumn["SE"][224] = "applicant_act_name";
		arrProductColumn["SE"][225] = "applicant_act_no";
		
		/*Not found in SE.xsl but available in se_core.xsl*/
		
		arrProductColumn["SE"][226] = "ObjectDataString@cheque_type";
		arrProductColumn["SE"][227] = "ObjectDataString@cheque_number_from";
		arrProductColumn["SE"][228] = "ObjectDataString@cheque_number_to";
		arrProductColumn["SE"][229] = "ObjectDataString@no_of_cheque_books";
		
		/*From Object Data, available in se_core.xsl*/
		
		arrProductColumn["SE"][230] = "ObjectDataString@format_name";
		arrProductColumn["SE"][231] = "ObjectDataString@map_code";
		arrProductColumn["SE"][232] = "ObjectDataString@format_type";
		arrProductColumn["SE"][233] = "ObjectDataString@amendable";
		arrProductColumn["SE"][234] = "ObjectDataString@file_encrypted";
		arrProductColumn["SE"][235] = "ObjectDataString@override_duplicate_reference";
		arrProductColumn["SE"][236] = "ObjectDataString@upload_description";
		arrProductColumn["SE"][237] = "ObjectDataString@reference";
		arrProductColumn["SE"][238] = "ObjectDataString@file_upload_act_name";
		arrProductColumn["SE"][239] = "ObjectDataString@value_date";
		arrProductColumn["SE"][240] = "ObjectDataString@payroll_type";
		arrProductColumn["SE"][241] = "ObjectDataString@file_upload_act_cur_code";
		arrProductColumn["SE"][242] = "sub_product_code";

		arrProductColumn["SE"][243] = "ObjectDataString@file_upload_act_description";
		
		// SG Transaction candidate
		// Define an array which stores the SE Transaction columns
		

		arrProductColumn["SETnx"][0] = "ref_id";
		arrProductColumn["SETnx"][2] = "bo_ref_id";
		arrProductColumn["SETnx"][3] = "cust_ref_id";
		arrProductColumn["SETnx"][5] = "tnx_type_code";
		arrProductColumn["SETnx"][6] = "sub_tnx_type_code";
		arrProductColumn["SETnx"][7] = "prod_stat_code";
		arrProductColumn["SETnx"][14] = "tnx_val_date";
		arrProductColumn["SETnx"][15] = "tnx_amt";
		arrProductColumn["SETnx"][16] = "tnx_cur_code";
		arrProductColumn["SETnx"][17] = "tnx_stat_code";
		
		arrProductColumn["SETnx"][18] = "appl_date";
		//arrProductColumn["SETnx"][19] = "iss_date";
		arrProductColumn["SETnx"][25] = "se_cur_code";
		arrProductColumn["SETnx"][26] = "se_amt";
		arrProductColumn["SETnx"][27] = "se_liab_amt";
		arrProductColumn["SETnx"][28] = "entity";
		
		
		arrProductColumn["SETnx"][41] = "applicant_name";
		arrProductColumn["SETnx"][42] = "applicant_address_line_1";
		arrProductColumn["SETnx"][43] = "applicant_address_line_2";
		arrProductColumn["SETnx"][44] = "applicant_dom";
		arrProductColumn["SETnx"][45] = "applicant_reference";
		arrProductColumn["SETnx"][48] = "applicant_act_no";
		
		arrProductColumn["SETnx"][69] = "IssuingBank@abbv_name";
		arrProductColumn["SETnx"][70] = "IssuingBank@name";
		arrProductColumn["SETnx"][71] = "IssuingBank@address_line_1";
		arrProductColumn["SETnx"][72] = "IssuingBank@address_line_2";
		arrProductColumn["SETnx"][73] = "IssuingBank@dom";
		
		/*arrProductColumn["SETnx"][109] = "Narrative@bo_comment";
		arrProductColumn["SETnx"][110] = "Narrative@free_format_text";
		arrProductColumn["SETnx"][111] = "Narrative@goodsDesc";
*/
		arrProductColumn["SETnx"][130] = "Inputter@last_name";
		arrProductColumn["SETnx"][131] = "Inputter@first_name";
		arrProductColumn["SETnx"][132] = "inp_dttm";
		arrProductColumn["SETnx"][133] = "Controller@last_name";
		arrProductColumn["SETnx"][134] = "Controller@first_name";
		
		arrProductColumn["SETnx"][136] = "Releaser@last_name";
		arrProductColumn["SETnx"][137] = "Releaser@first_name";
		arrProductColumn["SETnx"][138] = "release_dttm";

		arrProductColumn["SETnx"][139] = "Charge@chrg_code";
		arrProductColumn["SETnx"][140] = "Charge@amt";
		arrProductColumn["SETnx"][141] = "Charge@cur_code";
		arrProductColumn["SETnx"][142] = "Charge@status";
		arrProductColumn["SETnx"][143] = "Charge@additional_comment";
		arrProductColumn["SETnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["SETnx"][145] = "bo_release_dttm";
		
		arrProductColumn["SETnx"][146] = "se_type";
		arrProductColumn["SETnx"][147] = "priority";
		arrProductColumn["SETnx"][148] = "issuer_type";
		arrProductColumn["SETnx"][149] = "req_read_receipt";
		arrProductColumn["SETnx"][150] = "read_dttm";
		arrProductColumn["SETnx"][151] = "sub_tnx_stat_code";
		arrProductColumn["SETnx"][152] = "ObjectDataString@upload_file_type";
	
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["SE"][90] = "beneficiary_country";
		//arrProductColumn["SE"][91] = "applicant_country";
		
		//arrProductColumn["SETnx"][150] = "beneficiary_country";
		//arrProductColumn["SETnx"][151] = "applicant_country";
	
		/* SE Column definition */
	  /*Available in report_addons_core.xsl and report_core.xsl files*/