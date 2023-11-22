dojo.provide("misys.report.definitions.report_ln_candidate");


		// Copyright (c) 2000-2010 Misys (http://www.misys.com),
		// All Rights Reserved. 
	
		//
		// LN candidate
		//

		// Define an array which stores the LN columns
		

		arrProductColumn["LN"][0] = "ref_id";
		arrProductColumn["LN"][1] = "cust_ref_id";
		arrProductColumn["LN"][2] = "prod_stat_code";
		arrProductColumn["LN"][3] = "appl_date";
		arrProductColumn["LN"][4] = "iss_date";
		arrProductColumn["LN"][5] = "maturity_date";
		arrProductColumn["LN"][6] = "ln_maturity_date";		
		arrProductColumn["LN"][7] = "ln_cur_code";
		arrProductColumn["LN"][8] = "ln_amt";
		arrProductColumn["LN"][9] = "ln_liab_amt";
		arrProductColumn["LN"][10] = "pricing_option";
		arrProductColumn["LN"][11] = "rate";
		arrProductColumn["LN"][12] = "repricing_date";

		arrProductColumn["LN"][13] = "risk_type";
		arrProductColumn["LN"][14] = "entity";
		arrProductColumn["LN"][15] = "borrower_name";
		arrProductColumn["LN"][16] = "borrower_address_line_1";
		arrProductColumn["LN"][17] = "borrower_address_line_2";
		arrProductColumn["LN"][18] = "borrower_dom";
		arrProductColumn["LN"][19] = "borrower_reference";
		arrProductColumn["LN"][20] = "IssuingBank@name";
		arrProductColumn["LN"][21] = "IssuingBank@address_line_1";
		arrProductColumn["LN"][22] = "IssuingBank@address_line_2";
		arrProductColumn["LN"][23] = "IssuingBank@dom";
		arrProductColumn["LN"][24] = "effective_date";
		arrProductColumn["LN"][25] = "bo_ref_id";

		arrProductColumn["LN"][121] = "repricing_frequency";
		

		//
		// LN Transaction candidate
		//

		// Define an array which stores the LN Transaction columns
		

		arrProductColumn["LNTnx"][0] = "ref_id";
		arrProductColumn["LNTnx"][1] = "cust_ref_id";
		arrProductColumn["LNTnx"][2] = "tnx_type_code";
		arrProductColumn["LNTnx"][3] = "sub_tnx_type_code";
		arrProductColumn["LNTnx"][4] = "prod_stat_code";
		arrProductColumn["LNTnx"][5] = "tnx_val_date";
		arrProductColumn["LNTnx"][6] = "tnx_amt";
		arrProductColumn["LNTnx"][7] = "tnx_cur_code";
		
		arrProductColumn["LNTnx"][8] = "appl_date";
		//arrProductColumn["LNTnx"][9] = "iss_date";
		arrProductColumn["LNTnx"][10] = "maturity_date";
		arrProductColumn["LNTnx"][11] = "ln_maturity_date";		
		arrProductColumn["LNTnx"][12] = "ln_cur_code";
		arrProductColumn["LNTnx"][13] = "ln_amt";
		arrProductColumn["LNTnx"][14] = "ln_liab_amt";
		arrProductColumn["LNTnx"][15] = "pricing_option";
		arrProductColumn["LNTnx"][16] = "rate";
		arrProductColumn["LNTnx"][17] = "repricing_date";
		arrProductColumn["LNTnx"][18] = "repricing_frequency";
		arrProductColumn["LNTnx"][19] = "risk_type";
		
		arrProductColumn["LNTnx"][20] = "entity";
		arrProductColumn["LNTnx"][21] = "borrower_name";
		arrProductColumn["LNTnx"][22] = "borrower_address_line_1";
		arrProductColumn["LNTnx"][23] = "borrower_address_line_2";
		
		arrProductColumn["LNTnx"][24] = "borrower_dom";
		arrProductColumn["LNTnx"][25] = "borrower_reference";
				
		arrProductColumn["LNTnx"][26] = "IssuingBank@name";
		arrProductColumn["LNTnx"][27] = "IssuingBank@address_line_1";
		arrProductColumn["LNTnx"][28] = "IssuingBank@address_line_2";
		arrProductColumn["LNTnx"][29] = "IssuingBank@dom";
		
		arrProductColumn["LNTnx"][30] = "Inputter@last_name";
		arrProductColumn["LNTnx"][31] = "Inputter@first_name";
		arrProductColumn["LNTnx"][32] = "inp_dttm";
		//arrProductColumn["LNTnx"][33] = "Controller@last_name";
		//arrProductColumn["LNTnx"][34] = "Controller@first_name";
		arrProductColumn["LNTnx"][35] = "LastController@validation_dttm";
		arrProductColumn["LNTnx"][36] = "Releaser@last_name";
		arrProductColumn["LNTnx"][37] = "Releaser@first_name";
		arrProductColumn["LNTnx"][38] = "release_dttm";
		arrProductColumn["LNTnx"][39] = "bo_release_dttm";
		arrProductColumn["LNTnx"][40] = "LastController@LastControllerUser@first_name";
		arrProductColumn["LNTnx"][41] = "LastController@LastControllerUser@last_name";
		