dojo.provide("misys.report.definitions.report_ri_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// LI candidate
		//

		// Define an array which stores the LC columns
		

		arrProductColumn["RI"][0] = "ref_id";
		arrProductColumn["RI"][1] = "template_id";
		arrProductColumn["RI"][2] = "bo_ref_id";
		arrProductColumn["RI"][3] = "cust_ref_id";
		arrProductColumn["RI"][4] = "deal_ref_id";
		arrProductColumn["RI"][7] = "prod_stat_code";
		arrProductColumn["RI"][17] = "appl_date";
		arrProductColumn["RI"][18] = "iss_date";
		arrProductColumn["RI"][19] = "exp_date";
		arrProductColumn["RI"][20] = "ri_type_code";
		arrProductColumn["RI"][21] = "ri_type_details";
		arrProductColumn["RI"][22] = "amd_no";
		arrProductColumn["RI"][23] = "last_ship_date";
		arrProductColumn["RI"][24] = "ri_cur_code";
		arrProductColumn["RI"][25] = "ri_amt";
		arrProductColumn["RI"][26] = "ri_liab_amt";
		arrProductColumn["RI"][28] = "entity";
		arrProductColumn["RI"][29] = "beneficiary_name";
		arrProductColumn["RI"][30] = "beneficiary_address_line_1";
		arrProductColumn["RI"][31] = "beneficiary_address_line_2";
		arrProductColumn["RI"][32] = "beneficiary_dom";
		arrProductColumn["RI"][33] = "beneficiary_reference";
		
		arrProductColumn["RI"][35] = "applicant_name";
		arrProductColumn["RI"][36] = "applicant_address_line_1";
		arrProductColumn["RI"][37] = "applicant_address_line_2";
		arrProductColumn["RI"][38] = "applicant_dom";
		arrProductColumn["RI"][39] = "applicant_reference";
		arrProductColumn["RI"][40] = "expiry_place";
		arrProductColumn["RI"][41] = "bol_number";
		arrProductColumn["RI"][42] = "bol_date";
		arrProductColumn["RI"][43] = "shipping_mode";
		arrProductColumn["RI"][44] = "shipping_by";
		arrProductColumn["RI"][64] = "principal_act_no";
		arrProductColumn["RI"][65] = "fee_act_no";
		
		arrProductColumn["RI"][69] = "IssuingBank@abbv_name";
		arrProductColumn["RI"][70] = "IssuingBank@name";
		arrProductColumn["RI"][71] = "IssuingBank@address_line_1";
		arrProductColumn["RI"][72] = "IssuingBank@address_line_2";
		arrProductColumn["RI"][73] = "IssuingBank@dom";
		
//		arrProductColumn["RI"][97] = "Narrative@goodsDesc";

		arrProductColumn["RI"][100] = "Charge@chrg_code";
		arrProductColumn["RI"][101] = "Charge@amt";
		arrProductColumn["RI"][102] = "Charge@cur_code";
		arrProductColumn["RI"][103] = "Charge@status";
		arrProductColumn["RI"][104] = "Charge@additional_comment";
		arrProductColumn["RI"][105] = "Charge@settlement_date";

		//arrProductColumn["RI"][108] = "lc_ref_id";
		
		arrProductColumn["RI"][110] = "imp_bill_ref_id";
		  
		//
		// LI Transaction candidate
		//
		
		// Define an array which stores the LI Transaction columns
		

		arrProductColumn["RITnx"][0] = "ref_id";
		arrProductColumn["RITnx"][1] = "template_id";
		arrProductColumn["RITnx"][2] = "bo_ref_id";
		arrProductColumn["RITnx"][3] = "cust_ref_id";
		arrProductColumn["RITnx"][4] = "deal_ref_id";
		arrProductColumn["RITnx"][5] = "tnx_type_code";
		arrProductColumn["RITnx"][6] = "sub_tnx_type_code";
		arrProductColumn["RITnx"][7] = "prod_stat_code";
		arrProductColumn["RITnx"][14] = "tnx_val_date";
		arrProductColumn["RITnx"][15] = "tnx_amt";
		arrProductColumn["RITnx"][16] = "tnx_cur_code";
		
		arrProductColumn["RITnx"][18] = "appl_date";
		arrProductColumn["RITnx"][19] = "iss_date";
		arrProductColumn["RITnx"][20] = "exp_date";
		arrProductColumn["RITnx"][21] = "ri_type_code";
		arrProductColumn["RITnx"][22] = "ri_type_details";
		arrProductColumn["RITnx"][23] = "amd_no";
		arrProductColumn["RITnx"][24] = "last_ship_date";
		arrProductColumn["RITnx"][25] = "ri_cur_code";
		arrProductColumn["RITnx"][26] = "ri_amt";
		arrProductColumn["RITnx"][27] = "ri_liab_amt";
		arrProductColumn["RITnx"][28] = "entity";
		arrProductColumn["RITnx"][29] = "beneficiary_name";
		arrProductColumn["RITnx"][30] = "beneficiary_address_line_1";
		arrProductColumn["RITnx"][31] = "beneficiary_address_line_2";
		arrProductColumn["RITnx"][32] = "beneficiary_dom";
		arrProductColumn["RITnx"][33] = "beneficiary_reference";
		
		arrProductColumn["RITnx"][35] = "applicant_name";
		arrProductColumn["RITnx"][36] = "applicant_address_line_1";
		arrProductColumn["RITnx"][37] = "applicant_address_line_2";
		arrProductColumn["RITnx"][38] = "applicant_dom";
		arrProductColumn["RITnx"][39] = "applicant_reference";
		arrProductColumn["RITnx"][40] = "expiry_place";
		arrProductColumn["RITnx"][41] = "bol_number";
		arrProductColumn["RITnx"][42] = "bol_date";
		arrProductColumn["RITnx"][43] = "shipping_mode";
		arrProductColumn["RITnx"][44] = "shipping_by";
		arrProductColumn["RITnx"][64] = "principal_act_no";
		arrProductColumn["RITnx"][65] = "fee_act_no";
		
		arrProductColumn["RITnx"][69] = "IssuingBank@abbv_name";
		arrProductColumn["RITnx"][70] = "IssuingBank@name";
		arrProductColumn["RITnx"][71] = "IssuingBank@address_line_1";
		arrProductColumn["RITnx"][72] = "IssuingBank@address_line_2";
		arrProductColumn["RITnx"][73] = "IssuingBank@dom";
		
		/*arrProductColumn["RITnx"][97] = "Narrative@goodsDesc";
		arrProductColumn["RITnx"][98] = "Narrative@boComment";
		arrProductColumn["RITnx"][99] = "Narrative@freeFormatText";
	*/	//arrProductColumn["RITnx"][108] = "lc_ref_id";
		
		arrProductColumn["RITnx"][110] = "imp_bill_ref_id";

		arrProductColumn["RITnx"][130] = "Inputter@last_name";
		arrProductColumn["RITnx"][131] = "Inputter@first_name";
		arrProductColumn["RITnx"][132] = "inp_dttm";
		arrProductColumn["RITnx"][135] = "ctl_dttm";
		arrProductColumn["RITnx"][136] = "Releaser@last_name";
		arrProductColumn["RITnx"][137] = "Releaser@first_name";
		arrProductColumn["RITnx"][138] = "release_dttm";

		arrProductColumn["RITnx"][139] = "Charge@chrg_code";
		arrProductColumn["RITnx"][140] = "Charge@amt";
		arrProductColumn["RITnx"][141] = "Charge@cur_code";
		arrProductColumn["RITnx"][142] = "Charge@status";
		arrProductColumn["RITnx"][143] = "Charge@additional_comment";
		arrProductColumn["RITnx"][144] = "Charge@settlement_date";
		
		arrProductColumn["RITnx"][145] = "bo_release_dttm";
	