dojo.provide("misys.report.definitions.report_all_candidates");
 
		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// All master candidates
		//
		

		arrProductColumn["AllMaster"][0] = "ref_id";
		arrProductColumn["AllMaster"][1] = "template_id";
		arrProductColumn["AllMaster"][2] = "bo_ref_id";
		arrProductColumn["AllMaster"][3] = "cust_ref_id";
		arrProductColumn["AllMaster"][4] = "prod_stat_code";
		arrProductColumn["AllMaster"][5] = "appl_date";
		arrProductColumn["AllMaster"][6] = "iss_date";
		arrProductColumn["AllMaster"][7] = "cur_code";
		arrProductColumn["AllMaster"][8] = "amt";
		arrProductColumn["AllMaster"][9] = "liab_amt";
		arrProductColumn["AllMaster"][10] = "entity";
		arrProductColumn["AllMaster"][11] = "product_code";
		arrProductColumn["AllMaster"][12] = "customer_name";
		arrProductColumn["AllMaster"][13] = "customer_address_line_1";
		arrProductColumn["AllMaster"][14] = "customer_address_line_2";
		arrProductColumn["AllMaster"][15] = "customer_dom";
		arrProductColumn["AllMaster"][16] = "customer_reference";
		arrProductColumn["AllMaster"][17] = "counterparty_name";
		arrProductColumn["AllMaster"][18] = "counterparty_address_line_1";
		arrProductColumn["AllMaster"][19] = "counterparty_address_line_2";
		arrProductColumn["AllMaster"][20] = "counterparty_dom";
		arrProductColumn["AllMaster"][21] = "counterparty_reference";
		arrProductColumn["AllMaster"][22] = "MainBank@name";
		arrProductColumn["AllMaster"][23] = "MainBank@address_line_1";
		arrProductColumn["AllMaster"][24] = "MainBank@address_line_2";
		arrProductColumn["AllMaster"][25] = "MainBank@dom";
		arrProductColumn["AllMaster"][26] = "Charge@chrg_code";
		arrProductColumn["AllMaster"][27] = "Charge@amt";
		arrProductColumn["AllMaster"][28] = "Charge@cur_code";
		arrProductColumn["AllMaster"][29] = "Charge@status";
		arrProductColumn["AllMaster"][30] = "Charge@additional_comment";
		arrProductColumn["AllMaster"][31] = "Charge@settlement_date";
		arrProductColumn["AllMaster"][32] = "Charge@chrg_type";
		arrProductColumn["AllMaster"][33] = "sub_product_code";

		//
		// All transaction candidates
		//
		

		arrProductColumn["AllTnx"][0] = "ref_id";
		arrProductColumn["AllTnx"][1] = "template_id";
		arrProductColumn["AllTnx"][2] = "bo_ref_id";
		arrProductColumn["AllTnx"][3] = "cust_ref_id";
		arrProductColumn["AllTnx"][4] = "tnx_type_code";
		arrProductColumn["AllTnx"][5] = "sub_tnx_type_code";
		arrProductColumn["AllTnx"][6] = "prod_stat_code";
		arrProductColumn["AllTnx"][7] = "tnx_val_date";
		arrProductColumn["AllTnx"][8] = "tnx_amt";
		arrProductColumn["AllTnx"][9] = "tnx_cur_code";
		arrProductColumn["AllTnx"][10] = "tnx_stat_code";
		arrProductColumn["AllTnx"][11] = "appl_date";
		arrProductColumn["AllTnx"][12] = "iss_date";
		arrProductColumn["AllTnx"][13] = "cur_code";
		arrProductColumn["AllTnx"][14] = "amt";
		arrProductColumn["AllTnx"][15] = "liab_amt";
		arrProductColumn["AllTnx"][16] = "entity";
		arrProductColumn["AllTnx"][17] = "product_code";
		arrProductColumn["AllTnx"][18] = "customer_name";
		arrProductColumn["AllTnx"][19] = "customer_address_line_1";
		arrProductColumn["AllTnx"][20] = "customer_address_line_2";
		arrProductColumn["AllTnx"][21] = "customer_dom";
		arrProductColumn["AllTnx"][22] = "customer_reference";
		arrProductColumn["AllTnx"][23] = "counterparty_name";
		arrProductColumn["AllTnx"][24] = "counterparty_address_line_1";
		arrProductColumn["AllTnx"][25] = "counterparty_address_line_2";
		arrProductColumn["AllTnx"][26] = "counterparty_dom";
		arrProductColumn["AllTnx"][27] = "counterparty_reference";
		arrProductColumn["AllTnx"][28] = "principal_act_no";
		arrProductColumn["AllTnx"][29] = "fee_act_no";
		arrProductColumn["AllTnx"][30] = "MainBank@name";
		arrProductColumn["AllTnx"][31] = "MainBank@address_line_1";
		arrProductColumn["AllTnx"][32] = "MainBank@address_line_2";
		arrProductColumn["AllTnx"][33] = "MainBank@dom";
		/*arrProductColumn["AllTnx"][34] = "Narrative@boComment";
		arrProductColumn["AllTnx"][35] = "Narrative@freeFormatText";
		*/arrProductColumn["AllTnx"][36] = "Inputter@last_name";
		arrProductColumn["AllTnx"][37] = "Inputter@first_name";
		arrProductColumn["AllTnx"][38] = "inp_dttm";
		/*arrProductColumn["AllTnx"][39] = "Controller@last_name";
		arrProductColumn["AllTnx"][40] = "Controller@first_name";*/
		arrProductColumn["AllTnx"][41] = "LastController@validation_dttm";
		arrProductColumn["AllTnx"][42] = "Releaser@last_name";
		arrProductColumn["AllTnx"][43] = "Releaser@first_name";
		arrProductColumn["AllTnx"][44] = "release_dttm";
		arrProductColumn["AllTnx"][45] = "Charge@chrg_code";
		arrProductColumn["AllTnx"][46] = "Charge@amt";
		arrProductColumn["AllTnx"][47] = "Charge@cur_code";
		arrProductColumn["AllTnx"][48] = "Charge@status";
		arrProductColumn["AllTnx"][49] = "Charge@additional_comment";
		arrProductColumn["AllTnx"][50] = "Charge@settlement_date";
		
		arrProductColumn["AllTnx"][51] = "bo_release_dttm";
		arrProductColumn["AllTnx"][52] = "sub_product_code";
		arrProductColumn["AllTnx"][53] = "bo_tnx_id";
		arrProductColumn["AllTnx"][54] = "company_name";
		arrProductColumn["AllTnx"][57] = "BOReleaser@last_name";
		arrProductColumn["AllTnx"][55] = "BOInputter@last_name";
		arrProductColumn["AllTnx"][56] = "BOInputter@first_name";
		arrProductColumn["AllTnx"][58] = "BOReleaser@first_name";
		arrProductColumn["AllTnx"][59] = "bo_inp_dttm";
		arrProductColumn["AllTnx"][61] = "LastController@LastControllerUser@first_name";
		arrProductColumn["AllTnx"][62] = "LastController@LastControllerUser@last_name";
		//
		// All template candidates
		//
		

		arrProductColumn["AllTemplate"][1] = "template_id";
		arrProductColumn["AllTemplate"][2] = "template_description";
		arrProductColumn["AllTemplate"][3] = "iss_date";
		arrProductColumn["AllTemplate"][4] = "customer_name";
		arrProductColumn["AllTemplate"][5] = "customer_address_line_1";
		arrProductColumn["AllTemplate"][6] = "customer_address_line_2";
		arrProductColumn["AllTemplate"][7] = "customer_dom";
		arrProductColumn["AllTemplate"][8] = "customer_reference";
		arrProductColumn["AllTemplate"][9] = "counterparty_name";
		arrProductColumn["AllTemplate"][10] = "counterparty_address_line_1";
		arrProductColumn["AllTemplate"][11] = "counterparty_address_line_2";
		arrProductColumn["AllTemplate"][12] = "counterparty_dom";
		arrProductColumn["AllTemplate"][13] = "counterparty_reference";
		arrProductColumn["AllTemplate"][14] = "MainBank@name";
		arrProductColumn["AllTemplate"][15] = "MainBank@address_line_1";
		arrProductColumn["AllTemplate"][16] = "MainBank@address_line_2";
		arrProductColumn["AllTemplate"][17] = "MainBank@dom";
		
		//
		// Definition of computation
		//
		arrComputation = [];
		arrComputation["+"] = "sum";
		arrComputation["-"] = "subtract";
		arrComputation["*"] = "multiplication";
		arrComputation["/"] = "division";
		
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["AllTemplate"][20] = "counterparty_country";
		
		//arrProductColumn["AllTnx"][60] = "counterparty_country";
		
		//arrProductColumn["AllMaster"][40] = "counterparty_country";
		
		
	