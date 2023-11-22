dojo.provide("misys.report.definitions.report_io_candidate");


		// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// IO candidate
		//

		// Define an array which stores the IO columns
		

		arrProductColumn["IO"][0] = "ref_id";
		arrProductColumn["IO"][1] = "template_id";
		arrProductColumn["IO"][2] = "bo_ref_id";
		arrProductColumn["IO"][3] = "cust_ref_id";
		arrProductColumn["IO"][7] = "prod_stat_code";
		arrProductColumn["IO"][17] = "entity";
		arrProductColumn["IO"][18] = "group_id";
		arrProductColumn["IO"][19] = "appl_date";
		arrProductColumn["IO"][20] = "iss_date";
		arrProductColumn["IO"][22] = "issuer_ref_id";
		arrProductColumn["IO"][23] = "buyer_abbv_name";
		arrProductColumn["IO"][24] = "buyer_name";
		arrProductColumn["IO"][25] = "buyer_bei";
		arrProductColumn["IO"][26] = "buyer_bank_bic";
		arrProductColumn["IO"][27] = "buyer_street_name";
		arrProductColumn["IO"][28] = "buyer_post_code";
		arrProductColumn["IO"][29] = "buyer_town_name";
		arrProductColumn["IO"][30] = "buyer_country_sub_div";
		arrProductColumn["IO"][31] = "buyer_country";
		arrProductColumn["IO"][32] = "buyer_reference";
		arrProductColumn["IO"][33] = "seller_abbv_name";
		arrProductColumn["IO"][34] = "seller_name";
		arrProductColumn["IO"][35] = "seller_bei";
		arrProductColumn["IO"][36] = "seller_bank_bic";
		arrProductColumn["IO"][37] = "seller_street_name";
		arrProductColumn["IO"][38] = "seller_post_code";
		arrProductColumn["IO"][39] = "seller_town_name";
		arrProductColumn["IO"][40] = "seller_country_sub_div";
		arrProductColumn["IO"][41] = "seller_country";
		arrProductColumn["IO"][42] = "seller_reference";
		arrProductColumn["IO"][43] = "bill_to_abbv_name";
		arrProductColumn["IO"][44] = "bill_to_name";
		arrProductColumn["IO"][45] = "bill_to_bei";
		arrProductColumn["IO"][46] = "bill_to_street_name";
		arrProductColumn["IO"][47] = "bill_to_post_code";
		arrProductColumn["IO"][48] = "bill_to_town_name";
		arrProductColumn["IO"][49] = "bill_to_country_sub_div";
		arrProductColumn["IO"][50] = "bill_to_country";
		arrProductColumn["IO"][51] = "ship_to_abbv_name";
		arrProductColumn["IO"][52] = "ship_to_name";
		arrProductColumn["IO"][53] = "ship_to_bei";
		arrProductColumn["IO"][54] = "ship_to_street_name";
		arrProductColumn["IO"][55] = "ship_to_post_code";
		arrProductColumn["IO"][56] = "ship_to_town_name";
		arrProductColumn["IO"][57] = "ship_to_country_sub_div";
		arrProductColumn["IO"][58] = "ship_to_country";
		arrProductColumn["IO"][59] = "consgn_abbv_name";
		arrProductColumn["IO"][60] = "consgn_name";
		arrProductColumn["IO"][61] = "consgn_bei";
		arrProductColumn["IO"][62] = "consgn_street_name";
		arrProductColumn["IO"][63] = "consgn_post_code";
		arrProductColumn["IO"][64] = "consgn_town_name";
		arrProductColumn["IO"][65] = "consgn_country_sub_div";
		arrProductColumn["IO"][66] = "consgn_country";
		arrProductColumn["IO"][67] = "goods_desc";
		arrProductColumn["IO"][68] = "part_ship";
		arrProductColumn["IO"][69] = "tran_ship";
		arrProductColumn["IO"][70] = "last_ship_date";
		arrProductColumn["IO"][71] = "nb_mismatch";
		arrProductColumn["IO"][72] = "full_match";
		arrProductColumn["IO"][73] = "total_amt";
		arrProductColumn["IO"][74] = "total_cur_code";
		arrProductColumn["IO"][75] = "total_net_amt";
		arrProductColumn["IO"][76] = "total_net_cur_code";
		arrProductColumn["IO"][77] = "order_total_amt";
		arrProductColumn["IO"][78] = "order_total_cur_code";
		arrProductColumn["IO"][79] = "order_total_net_amt";
		arrProductColumn["IO"][80] = "order_total_net_cur_code";
		arrProductColumn["IO"][81] = "accpt_total_amt";
		arrProductColumn["IO"][82] = "accpt_total_cur_code";
		arrProductColumn["IO"][83] = "accpt_total_net_amt";
		arrProductColumn["IO"][84] = "accpt_total_net_cur_code";
		arrProductColumn["IO"][85] = "liab_total_amt";
		arrProductColumn["IO"][86] = "liab_total_cur_code";
		arrProductColumn["IO"][87] = "liab_total_net_amt";
		arrProductColumn["IO"][88] = "liab_total_net_cur_code";
		arrProductColumn["IO"][89] = "fin_inst_bic";
		arrProductColumn["IO"][90] = "fin_inst_name";
		arrProductColumn["IO"][91] = "fin_inst_street_name";
		arrProductColumn["IO"][92] = "fin_inst_post_code";
		arrProductColumn["IO"][93] = "fin_inst_town_name";
		arrProductColumn["IO"][94] = "fin_inst_country_sub_div";
		arrProductColumn["IO"][95] = "fin_inst_country";
		arrProductColumn["IO"][96] = "seller_account_name";
		arrProductColumn["IO"][97] = "seller_account_iban";
		arrProductColumn["IO"][98] = "seller_account_bban";
		arrProductColumn["IO"][99] = "seller_account_upic";
		arrProductColumn["IO"][100] = "seller_account_id";
		arrProductColumn["IO"][101] = "reqrd_commercial_dataset";
		arrProductColumn["IO"][102] = "reqrd_transport_dataset";
		arrProductColumn["IO"][103] = "last_match_date";
		//arrProductColumn["IO"][104] = "submitr_bic";
		//arrProductColumn["IO"][105] = "data_set_id";
		arrProductColumn["IO"][106] = "freight_charges_type";
		//arrProductColumn["IO"][107] = "version";

		
		arrProductColumn["IO"][108] = "BuyerBank@name";
		arrProductColumn["IO"][109] = "BuyerBank@address_line_1";
		arrProductColumn["IO"][110] = "BuyerBank@address_line_2";
		arrProductColumn["IO"][111] = "BuyerBank@dom";
		
		arrProductColumn["IO"][112] = "SellerBank@name";
		arrProductColumn["IO"][113] = "SellerBank@address_line_1";
		arrProductColumn["IO"][114] = "SellerBank@address_line_2";
		arrProductColumn["IO"][115] = "SellerBank@dom";
						
		arrProductColumn["IO"][130] = "Charge@chrg_code";
		arrProductColumn["IO"][131] = "Charge@amt";
		arrProductColumn["IO"][132] = "Charge@cur_code";
		arrProductColumn["IO"][133] = "Charge@status";
		arrProductColumn["IO"][134] = "Charge@additional_comment";
		arrProductColumn["IO"][135] = "Charge@settlement_date";

		//
		// IO Transaction candidate
		//

		// Define an array which stores the IO Transaction columns
		

		arrProductColumn["IOTnx"][0] = "ref_id";
		arrProductColumn["IOTnx"][1] = "template_id";
		arrProductColumn["IOTnx"][2] = "bo_ref_id";
		arrProductColumn["IOTnx"][3] = "cust_ref_id";
		arrProductColumn["IOTnx"][5] = "tnx_type_code";
		arrProductColumn["IOTnx"][6] = "sub_tnx_type_code";
		arrProductColumn["IOTnx"][7] = "prod_stat_code";

		
		arrProductColumn["IOTnx"][19] = "appl_date";
		arrProductColumn["IOTnx"][20] = "iss_date";
		arrProductColumn["IOTnx"][21] = "group_id";
		arrProductColumn["IOTnx"][22] = "issuer_ref_id";
		arrProductColumn["IOTnx"][23] = "buyer_abbv_name";
		arrProductColumn["IOTnx"][24] = "buyer_name";
		arrProductColumn["IOTnx"][25] = "buyer_bei";
		arrProductColumn["IOTnx"][26] = "buyer_bank_bic";
		arrProductColumn["IOTnx"][27] = "buyer_street_name";
		arrProductColumn["IOTnx"][28] = "buyer_post_code";
		arrProductColumn["IOTnx"][29] = "buyer_town_name";
		arrProductColumn["IOTnx"][30] = "buyer_country_sub_div";
		arrProductColumn["IOTnx"][31] = "buyer_country";
		arrProductColumn["IOTnx"][32] = "buyer_reference";
		arrProductColumn["IOTnx"][33] = "seller_abbv_name";
		arrProductColumn["IOTnx"][34] = "seller_name";
		arrProductColumn["IOTnx"][35] = "seller_bei";
		arrProductColumn["IOTnx"][36] = "seller_bank_bic";
		arrProductColumn["IOTnx"][37] = "seller_street_name";
		arrProductColumn["IOTnx"][38] = "seller_post_code";
		arrProductColumn["IOTnx"][39] = "seller_town_name";
		arrProductColumn["IOTnx"][40] = "seller_country_sub_div";
		arrProductColumn["IOTnx"][41] = "seller_country";
		arrProductColumn["IOTnx"][42] = "seller_reference";
		arrProductColumn["IOTnx"][43] = "bill_to_abbv_name";
		arrProductColumn["IOTnx"][44] = "bill_to_name";
		arrProductColumn["IOTnx"][45] = "bill_to_bei";
		arrProductColumn["IOTnx"][46] = "bill_to_street_name";
		arrProductColumn["IOTnx"][47] = "bill_to_post_code";
		arrProductColumn["IOTnx"][48] = "bill_to_town_name";
		arrProductColumn["IOTnx"][49] = "bill_to_country_sub_div";
		arrProductColumn["IOTnx"][50] = "bill_to_country";
		arrProductColumn["IOTnx"][51] = "ship_to_abbv_name";
		arrProductColumn["IOTnx"][52] = "ship_to_name";
		arrProductColumn["IOTnx"][53] = "ship_to_bei";
		arrProductColumn["IOTnx"][54] = "ship_to_street_name";
		arrProductColumn["IOTnx"][55] = "ship_to_post_code";
		arrProductColumn["IOTnx"][56] = "ship_to_town_name";
		arrProductColumn["IOTnx"][57] = "ship_to_country_sub_div";
		arrProductColumn["IOTnx"][58] = "ship_to_country";
		arrProductColumn["IOTnx"][59] = "consgn_abbv_name";
		arrProductColumn["IOTnx"][60] = "consgn_name";
		arrProductColumn["IOTnx"][61] = "consgn_bei";
		arrProductColumn["IOTnx"][62] = "consgn_street_name";
		arrProductColumn["IOTnx"][63] = "consgn_post_code";
		arrProductColumn["IOTnx"][64] = "consgn_town_name";
		arrProductColumn["IOTnx"][65] = "consgn_country_sub_div";
		arrProductColumn["IOTnx"][66] = "consgn_country";
		arrProductColumn["IOTnx"][67] = "goods_desc";
		arrProductColumn["IOTnx"][68] = "part_ship";
		arrProductColumn["IOTnx"][69] = "tran_ship";
		arrProductColumn["IOTnx"][70] = "last_ship_date";
		arrProductColumn["IOTnx"][71] = "nb_mismatch";
		arrProductColumn["IOTnx"][72] = "full_match";
		arrProductColumn["IOTnx"][73] = "total_amt";
		arrProductColumn["IOTnx"][74] = "total_cur_code";
		arrProductColumn["IOTnx"][75] = "total_net_amt";
		arrProductColumn["IOTnx"][76] = "total_net_cur_code";
		arrProductColumn["IOTnx"][77] = "order_total_amt";
		arrProductColumn["IOTnx"][78] = "order_total_cur_code";
		arrProductColumn["IOTnx"][79] = "order_total_net_amt";
		arrProductColumn["IOTnx"][80] = "order_total_net_cur_code";
		arrProductColumn["IOTnx"][81] = "accpt_total_amt";
		arrProductColumn["IOTnx"][82] = "accpt_total_cur_code";
		arrProductColumn["IOTnx"][83] = "accpt_total_net_amt";
		arrProductColumn["IOTnx"][84] = "accpt_total_net_cur_code";
		arrProductColumn["IOTnx"][85] = "liab_total_amt";
		arrProductColumn["IOTnx"][86] = "liab_total_cur_code";
		arrProductColumn["IOTnx"][87] = "liab_total_net_amt";
		arrProductColumn["IOTnx"][88] = "liab_total_net_cur_code";
		arrProductColumn["IOTnx"][89] = "fin_inst_bic";
		arrProductColumn["IOTnx"][90] = "fin_inst_name";
		arrProductColumn["IOTnx"][91] = "fin_inst_street_name";
		arrProductColumn["IOTnx"][92] = "fin_inst_post_code";
		arrProductColumn["IOTnx"][93] = "fin_inst_town_name";
		arrProductColumn["IOTnx"][94] = "fin_inst_country_sub_div";
		arrProductColumn["IOTnx"][95] = "fin_inst_country";
		arrProductColumn["IOTnx"][96] = "seller_account_name";
		arrProductColumn["IOTnx"][97] = "seller_account_iban";
		arrProductColumn["IOTnx"][98] = "seller_account_bban";
		arrProductColumn["IOTnx"][99] = "seller_account_upic";
		arrProductColumn["IOTnx"][100] = "seller_account_id";
		arrProductColumn["IOTnx"][101] = "reqrd_commercial_dataset";
		arrProductColumn["IOTnx"][102] = "reqrd_transport_dataset";
		arrProductColumn["IOTnx"][103] = "last_match_date";
		//arrProductColumn[IOTnx][104] = "submitr_bic";
		//arrProductColumn["IOTnx"][105] = "data_set_id";
		arrProductColumn["IOTnx"][106] = "freight_charges_type";
		//arrProductColumn["IOTnx"][107] = "version";

		
		arrProductColumn["IOTnx"][108] = "BuyerBank@name";
		arrProductColumn["IOTnx"][109] = "BuyerBank@address_line_1";
		arrProductColumn["IOTnx"][110] = "BuyerBank@address_line_2";
		arrProductColumn["IOTnx"][111] = "BuyerBank@dom";
		
		arrProductColumn["IOTnx"][112] = "SellerBank@name";
		arrProductColumn["IOTnx"][113] = "SellerBank@address_line_1";
		arrProductColumn["IOTnx"][114] = "SellerBank@address_line_2";
		arrProductColumn["IOTnx"][115] = "SellerBank@dom";
						
		arrProductColumn["IOTnx"][130] = "Inputter@last_name";
		arrProductColumn["IOTnx"][131] = "Inputter@first_name";
		arrProductColumn["IOTnx"][132] = "inp_dttm";
		arrProductColumn["IOTnx"][135] = "LastController@validation_dttm";
		arrProductColumn["IOTnx"][136] = "Releaser@last_name";
		arrProductColumn["IOTnx"][137] = "Releaser@first_name";
		arrProductColumn["IOTnx"][138] = "release_dttm";
		
		arrProductColumn["IOTnx"][140] = "Charge@chrg_code";
		arrProductColumn["IOTnx"][141] = "Charge@amt";
		arrProductColumn["IOTnx"][142] = "Charge@cur_code";
		arrProductColumn["IOTnx"][143] = "Charge@status";
		arrProductColumn["IOTnx"][144] = "Charge@additional_comment";
		arrProductColumn["IOTnx"][145] = "Charge@settlement_date";

		arrProductColumn["IOTnx"][150] = "bo_release_dttm";
		arrProductColumn["IOTnx"][151] = "LastController@LastControllerUser@first_name";
		arrProductColumn["IOTnx"][152] = "LastController@LastControllerUser@last_name";

		arrProductColumn["IOTnx"][159] = "tnx_val_date";
		arrProductColumn["IOTnx"][160] = "tnx_amt";
		arrProductColumn["IOTnx"][161] = "tnx_cur_code";
		arrProductColumn["IOTnx"][162] = "entity";
		