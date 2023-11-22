dojo.provide("misys.report.definitions.report_ir_candidate");


		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// IR candidate
		//

		// Define an array which stores the IR columns
		

	 	// Fields from the MasterInwardRemittance obj
	 	arrProductColumn["IR"][0] = "fwd_contract_no";
		arrProductColumn["IR"][1] = "act_no";
		arrProductColumn["IR"][2] = "remittance_date";

		arrProductColumn["IR"][3] = "ir_cur_code";
		arrProductColumn["IR"][4] = "ir_amt";
		arrProductColumn["IR"][5] = "ir_liab_amt";
		arrProductColumn["IR"][6] = "ir_type_code";

		arrProductColumn["IR"][7] = "beneficiary_abbv_name";
		arrProductColumn["IR"][8] = "beneficiary_name";
		arrProductColumn["IR"][9] = "beneficiary_address_line_1";
		arrProductColumn["IR"][10] = "beneficiary_address_line_2";
		arrProductColumn["IR"][11] = "beneficiary_dom";
		arrProductColumn["IR"][12] = "beneficiary_reference";
		
		arrProductColumn["IR"][13] = "remitter_name";
		arrProductColumn["IR"][14] = "remitter_address_line_1";
		arrProductColumn["IR"][15] = "remitter_address_line_2";
		arrProductColumn["IR"][16] = "remitter_dom";
		arrProductColumn["IR"][17] = "remitter_reference";

		// Fields from Product
		arrProductColumn["IR"][18] = "ref_id";
		arrProductColumn["IR"][19] = "bo_ref_id";
		arrProductColumn["IR"][20] = "entity";
		arrProductColumn["IR"][22] = "prod_stat_code";
		arrProductColumn["IR"][23] = "product_code";
		
		arrProductColumn["IR"][24] = "RemittingBank@name";
		arrProductColumn["IR"][25] = "RemittingBank@address_line_1";
		arrProductColumn["IR"][26] = "RemittingBank@address_line_2";
		arrProductColumn["IR"][27] = "RemittingBank@dom";
		
		arrProductColumn["IR"][28] = "IssuingBank@name";
		arrProductColumn["IR"][29] = "IssuingBank@address_line_1";
		arrProductColumn["IR"][30] = "IssuingBank@address_line_2";
		arrProductColumn["IR"][31] = "IssuingBank@dom";
		
	//	arrProductColumn["IR"][32] = "Narrative@paymentInstructions";

		//
		// IR Transaction candidate
		//

		// Define an array which stores the IR Transaction columns
		

		// Fields from the InwardRemittance obj
		arrProductColumn["IRTnx"][0] = "fwd_contract_no";
		arrProductColumn["IRTnx"][1] = "act_no";
		//arrProductColumn["IRTnx"][2] = "instructions_required";
		arrProductColumn["IRTnx"][2] = "fee_act_no";
		arrProductColumn["IRTnx"][3] = "remittance_date";
		arrProductColumn["IRTnx"][4] = "ir_cur_code";
		arrProductColumn["IRTnx"][5] = "ir_amt";
		arrProductColumn["IRTnx"][6] = "ir_liab_amt";
		arrProductColumn["IRTnx"][7] = "ir_type_code";
		//arrProductColumn["IRTnx"][8] = "ir_sub_type_code";
		arrProductColumn["IRTnx"][8] = "beneficiary_abbv_name";
		arrProductColumn["IRTnx"][9] = "beneficiary_name";
		arrProductColumn["IRTnx"][10] = "beneficiary_address_line_1";
		arrProductColumn["IRTnx"][11] = "beneficiary_address_line_2";
		arrProductColumn["IRTnx"][12] = "beneficiary_dom";
		arrProductColumn["IRTnx"][13] = "beneficiary_reference";
		arrProductColumn["IRTnx"][14] = "remitter_name";
		arrProductColumn["IRTnx"][15] = "remitter_address_line_1";
		arrProductColumn["IRTnx"][16] = "remitter_address_line_2";
		arrProductColumn["IRTnx"][17] = "remitter_dom";
		arrProductColumn["IRTnx"][18] = "remitter_reference";
		
		// TransactionProduct fields
		arrProductColumn["IRTnx"][19] = "tnx_type_code";
		arrProductColumn["IRTnx"][20] = "sub_tnx_type_code";
		arrProductColumn["IRTnx"][22] = "inp_dttm";
		arrProductColumn["IRTnx"][23] = "LastController@validation_dttm";
		arrProductColumn["IRTnx"][24] = "release_dttm";
		arrProductColumn["IRTnx"][25] = "tnx_val_date";
		arrProductColumn["IRTnx"][26] = "tnx_cur_code";
		arrProductColumn["IRTnx"][27] = "tnx_amt";
		
		// Product fields
		arrProductColumn["IRTnx"][28] = "ref_id";
		arrProductColumn["IRTnx"][29] = "bo_ref_id";
		arrProductColumn["IRTnx"][30] = "entity";

	    arrProductColumn["IRTnx"][32] = "prod_stat_code";
		arrProductColumn["IRTnx"][33] = "product_code";
		
		arrProductColumn["IRTnx"][34] = "RemittingBank@name";
		arrProductColumn["IRTnx"][35] = "RemittingBank@address_line_1";
		arrProductColumn["IRTnx"][36] = "RemittingBank@address_line_2";
		arrProductColumn["IRTnx"][37] = "RemittingBank@dom";
		
		arrProductColumn["IRTnx"][38] = "IssuingBank@name";
		arrProductColumn["IRTnx"][39] = "IssuingBank@address_line_1";
		arrProductColumn["IRTnx"][40] = "IssuingBank@address_line_2";
		arrProductColumn["IRTnx"][41] = "IssuingBank@dom";
		arrProductColumn["IRTnx"][53] = "tnx_stat_code";
		arrProductColumn["IRTnx"][54] = "sub_tnx_stat_code";
		arrProductColumn["IRTnx"][55] = "LastController@LastControllerUser@first_name";
		arrProductColumn["IRTnx"][56] = "LastController@LastControllerUser@last_name";
		
		//arrProductColumn["IRTnx"][42] = "Narrative@paymentDetails";
		//arrProductColumn["IRTnx"][43] = "Narrative@boComment";
		//arrProductColumn["IRTnx"][44] = "Narrative@freeFormatText";
		
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["IR"][35] = "beneficiary_country";
		//arrProductColumn["IR"][36] = "remitter_country";
		
		//arrProductColumn["IRTnx"][50] = "beneficiary_country";
		//arrProductColumn["IRTnx"][51] = "remitter_country";
		