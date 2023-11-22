dojo.provide("misys.report.definitions.report_po_candidate");


		// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// PO candidate
		//

		// Define an array which stores the SO columns
		

		arrProductColumn["PO"][0] = "ref_id";
		arrProductColumn["PO"][1] = "template_id";
		arrProductColumn["PO"][2] = "bo_ref_id";
		arrProductColumn["PO"][3] = "cust_ref_id";
		arrProductColumn["PO"][7] = "prod_stat_code";
		arrProductColumn["PO"][17] = "entity";
		arrProductColumn["PO"][18] = "group_id";
		arrProductColumn["PO"][19] = "appl_date";
		arrProductColumn["PO"][20] = "iss_date";
		arrProductColumn["PO"][22] = "issuer_ref_id";
		arrProductColumn["PO"][23] = "buyer_abbv_name";
		arrProductColumn["PO"][24] = "buyer_name";
		arrProductColumn["PO"][25] = "buyer_bei";
		arrProductColumn["PO"][26] = "buyer_bank_bic";
		arrProductColumn["PO"][27] = "buyer_street_name";
		arrProductColumn["PO"][28] = "buyer_post_code";
		arrProductColumn["PO"][29] = "buyer_town_name";
		arrProductColumn["PO"][30] = "buyer_country_sub_div";
		arrProductColumn["PO"][31] = "buyer_country";
		arrProductColumn["PO"][32] = "buyer_reference";
		arrProductColumn["PO"][33] = "seller_abbv_name";
		arrProductColumn["PO"][34] = "seller_name";
		arrProductColumn["PO"][35] = "seller_bei";
		arrProductColumn["PO"][36] = "seller_bank_bic";
		arrProductColumn["PO"][37] = "seller_street_name";
		arrProductColumn["PO"][38] = "seller_post_code";
		arrProductColumn["PO"][39] = "seller_town_name";
		arrProductColumn["PO"][40] = "seller_country_sub_div";
		arrProductColumn["PO"][41] = "seller_country";
		arrProductColumn["PO"][42] = "seller_reference";
		arrProductColumn["PO"][43] = "bill_to_abbv_name";
		arrProductColumn["PO"][44] = "bill_to_name";
		arrProductColumn["PO"][45] = "bill_to_bei";
		arrProductColumn["PO"][46] = "bill_to_street_name";
		arrProductColumn["PO"][47] = "bill_to_post_code";
		arrProductColumn["PO"][48] = "bill_to_town_name";
		arrProductColumn["PO"][49] = "bill_to_country_sub_div";
		arrProductColumn["PO"][50] = "bill_to_country";
		arrProductColumn["PO"][51] = "ship_to_abbv_name";
		arrProductColumn["PO"][52] = "ship_to_name";
		arrProductColumn["PO"][53] = "ship_to_bei";
		arrProductColumn["PO"][54] = "ship_to_street_name";
		arrProductColumn["PO"][55] = "ship_to_post_code";
		arrProductColumn["PO"][56] = "ship_to_town_name";
		arrProductColumn["PO"][57] = "ship_to_country_sub_div";
		arrProductColumn["PO"][58] = "ship_to_country";
		arrProductColumn["PO"][59] = "consgn_abbv_name";
		arrProductColumn["PO"][60] = "consgn_name";
		arrProductColumn["PO"][61] = "consgn_bei";
		arrProductColumn["PO"][62] = "consgn_street_name";
		arrProductColumn["PO"][63] = "consgn_post_code";
		arrProductColumn["PO"][64] = "consgn_town_name";
		arrProductColumn["PO"][65] = "consgn_country_sub_div";
		arrProductColumn["PO"][66] = "consgn_country";
		arrProductColumn["PO"][67] = "goods_desc";
		arrProductColumn["PO"][68] = "part_ship";
		arrProductColumn["PO"][69] = "tran_ship";
		arrProductColumn["PO"][70] = "last_ship_date";
		arrProductColumn["PO"][71] = "nb_mismatch";
		arrProductColumn["PO"][72] = "full_match";
		arrProductColumn["PO"][73] = "total_amt";
		arrProductColumn["PO"][74] = "total_cur_code";
		arrProductColumn["PO"][75] = "total_net_amt";
		arrProductColumn["PO"][76] = "total_net_cur_code";
		arrProductColumn["PO"][77] = "order_total_amt";
		arrProductColumn["PO"][78] = "order_total_cur_code";
		arrProductColumn["PO"][79] = "order_total_net_amt";
		arrProductColumn["PO"][80] = "order_total_net_cur_code";
		arrProductColumn["PO"][81] = "accpt_total_amt";
		arrProductColumn["PO"][82] = "accpt_total_cur_code";
		arrProductColumn["PO"][83] = "accpt_total_net_amt";
		arrProductColumn["PO"][84] = "accpt_total_net_cur_code";
		arrProductColumn["PO"][85] = "liab_total_amt";
		arrProductColumn["PO"][86] = "liab_total_cur_code";
		arrProductColumn["PO"][87] = "liab_total_net_amt";
		arrProductColumn["PO"][88] = "liab_total_net_cur_code";
		arrProductColumn["PO"][89] = "fin_inst_bic";
		arrProductColumn["PO"][90] = "fin_inst_name";
		arrProductColumn["PO"][91] = "fin_inst_street_name";
		arrProductColumn["PO"][92] = "fin_inst_post_code";
		arrProductColumn["PO"][93] = "fin_inst_town_name";
		arrProductColumn["PO"][94] = "fin_inst_country_sub_div";
		arrProductColumn["PO"][95] = "fin_inst_country";
		arrProductColumn["PO"][96] = "seller_account_name";
		arrProductColumn["PO"][97] = "seller_account_iban";
		arrProductColumn["PO"][98] = "seller_account_bban";
		arrProductColumn["PO"][99] = "seller_account_upic";
		arrProductColumn["PO"][100] = "seller_account_id";
		arrProductColumn["PO"][101] = "reqrd_commercial_dataset";
		arrProductColumn["PO"][102] = "reqrd_transport_dataset";
		arrProductColumn["PO"][103] = "last_match_date";
		//arrProductColumn["PO"][104] = "submitr_bic";
		//arrProductColumn["PO"][105] = "data_set_id";
		arrProductColumn["PO"][106] = "freight_charges_type";
		//arrProductColumn["PO"][107] = "version";

		
		arrProductColumn["PO"][108] = "BuyerBank@name";
		arrProductColumn["PO"][109] = "BuyerBank@address_line_1";
		arrProductColumn["PO"][110] = "BuyerBank@address_line_2";
		arrProductColumn["PO"][111] = "BuyerBank@dom";
		
		arrProductColumn["PO"][112] = "SellerBank@name";
		arrProductColumn["PO"][113] = "SellerBank@address_line_1";
		arrProductColumn["PO"][114] = "SellerBank@address_line_2";
		arrProductColumn["PO"][115] = "SellerBank@dom";
						
		arrProductColumn["PO"][130] = "Charge@chrg_code";
		arrProductColumn["PO"][131] = "Charge@amt";
		arrProductColumn["PO"][132] = "Charge@cur_code";
		arrProductColumn["PO"][133] = "Charge@status";
		arrProductColumn["PO"][134] = "Charge@additional_comment";
		arrProductColumn["PO"][135] = "Charge@settlement_date";
		arrProductColumn["PO"][136] = "AllowanceTaxMaster@amt";
		arrProductColumn["PO"][137] = "AllowanceTaxMaster@cur_code";
		arrProductColumn["PO"][138] = "AllowanceTaxMaster@rate";
		arrProductColumn["PO"][139] = "AllowanceTaxMaster@type";

		//
		// PO Transaction candidate
		//

		// Define an array which stores the PO Transaction columns
		

		arrProductColumn["POTnx"][0] = "ref_id";
		arrProductColumn["POTnx"][1] = "template_id";
		arrProductColumn["POTnx"][2] = "bo_ref_id";
		arrProductColumn["POTnx"][3] = "cust_ref_id";
		arrProductColumn["POTnx"][5] = "tnx_type_code";
		arrProductColumn["POTnx"][6] = "sub_tnx_type_code";
		arrProductColumn["POTnx"][7] = "prod_stat_code";

		arrProductColumn["POTnx"][19] = "appl_date";
		arrProductColumn["POTnx"][20] = "iss_date";
		arrProductColumn["POTnx"][21] = "group_id";
		arrProductColumn["POTnx"][22] = "issuer_ref_id";
		arrProductColumn["POTnx"][23] = "buyer_abbv_name";
		arrProductColumn["POTnx"][24] = "buyer_name";
		arrProductColumn["POTnx"][25] = "buyer_bei";
		arrProductColumn["POTnx"][26] = "buyer_bank_bic";
		arrProductColumn["POTnx"][27] = "buyer_street_name";
		arrProductColumn["POTnx"][28] = "buyer_post_code";
		arrProductColumn["POTnx"][29] = "buyer_town_name";
		arrProductColumn["POTnx"][30] = "buyer_country_sub_div";
		arrProductColumn["POTnx"][31] = "buyer_country";
		arrProductColumn["POTnx"][32] = "buyer_reference";
		arrProductColumn["POTnx"][33] = "seller_abbv_name";
		arrProductColumn["POTnx"][34] = "seller_name";
		arrProductColumn["POTnx"][35] = "seller_bei";
		arrProductColumn["POTnx"][36] = "seller_bank_bic";
		arrProductColumn["POTnx"][37] = "seller_street_name";
		arrProductColumn["POTnx"][38] = "seller_post_code";
		arrProductColumn["POTnx"][39] = "seller_town_name";
		arrProductColumn["POTnx"][40] = "seller_country_sub_div";
		arrProductColumn["POTnx"][41] = "seller_country";
		arrProductColumn["POTnx"][42] = "seller_reference";
		arrProductColumn["POTnx"][43] = "bill_to_abbv_name";
		arrProductColumn["POTnx"][44] = "bill_to_name";
		arrProductColumn["POTnx"][45] = "bill_to_bei";
		arrProductColumn["POTnx"][46] = "bill_to_street_name";
		arrProductColumn["POTnx"][47] = "bill_to_post_code";
		arrProductColumn["POTnx"][48] = "bill_to_town_name";
		arrProductColumn["POTnx"][49] = "bill_to_country_sub_div";
		arrProductColumn["POTnx"][50] = "bill_to_country";
		arrProductColumn["POTnx"][51] = "ship_to_abbv_name";
		arrProductColumn["POTnx"][52] = "ship_to_name";
		arrProductColumn["POTnx"][53] = "ship_to_bei";
		arrProductColumn["POTnx"][54] = "ship_to_street_name";
		arrProductColumn["POTnx"][55] = "ship_to_post_code";
		arrProductColumn["POTnx"][56] = "ship_to_town_name";
		arrProductColumn["POTnx"][57] = "ship_to_country_sub_div";
		arrProductColumn["POTnx"][58] = "ship_to_country";
		arrProductColumn["POTnx"][59] = "consgn_abbv_name";
		arrProductColumn["POTnx"][60] = "consgn_name";
		arrProductColumn["POTnx"][61] = "consgn_bei";
		arrProductColumn["POTnx"][62] = "consgn_street_name";
		arrProductColumn["POTnx"][63] = "consgn_post_code";
		arrProductColumn["POTnx"][64] = "consgn_town_name";
		arrProductColumn["POTnx"][65] = "consgn_country_sub_div";
		arrProductColumn["POTnx"][66] = "consgn_country";
		arrProductColumn["POTnx"][67] = "goods_desc";
		arrProductColumn["POTnx"][68] = "part_ship";
		arrProductColumn["POTnx"][69] = "tran_ship";
		arrProductColumn["POTnx"][70] = "last_ship_date";
		arrProductColumn["POTnx"][71] = "nb_mismatch";
		arrProductColumn["POTnx"][72] = "full_match";
		arrProductColumn["POTnx"][73] = "total_amt";
		arrProductColumn["POTnx"][74] = "total_cur_code";
		arrProductColumn["POTnx"][75] = "total_net_amt";
		arrProductColumn["POTnx"][76] = "total_net_cur_code";
		arrProductColumn["POTnx"][77] = "order_total_amt";
		arrProductColumn["POTnx"][78] = "order_total_cur_code";
		arrProductColumn["POTnx"][79] = "order_total_net_amt";
		arrProductColumn["POTnx"][80] = "order_total_net_cur_code";
		arrProductColumn["POTnx"][81] = "accpt_total_amt";
		arrProductColumn["POTnx"][82] = "accpt_total_cur_code";
		arrProductColumn["POTnx"][83] = "accpt_total_net_amt";
		arrProductColumn["POTnx"][84] = "accpt_total_net_cur_code";
		arrProductColumn["POTnx"][85] = "liab_total_amt";
		arrProductColumn["POTnx"][86] = "liab_total_cur_code";
		arrProductColumn["POTnx"][87] = "liab_total_net_amt";
		arrProductColumn["POTnx"][88] = "liab_total_net_cur_code";
		arrProductColumn["POTnx"][89] = "fin_inst_bic";
		arrProductColumn["POTnx"][90] = "fin_inst_name";
		arrProductColumn["POTnx"][91] = "fin_inst_street_name";
		arrProductColumn["POTnx"][92] = "fin_inst_post_code";
		arrProductColumn["POTnx"][93] = "fin_inst_town_name";
		arrProductColumn["POTnx"][94] = "fin_inst_country_sub_div";
		arrProductColumn["POTnx"][95] = "fin_inst_country";
		arrProductColumn["POTnx"][96] = "seller_account_name";
		arrProductColumn["POTnx"][97] = "seller_account_iban";
		arrProductColumn["POTnx"][98] = "seller_account_bban";
		arrProductColumn["POTnx"][99] = "seller_account_upic";
		arrProductColumn["POTnx"][100] = "seller_account_id";
		arrProductColumn["POTnx"][101] = "reqrd_commercial_dataset";
		arrProductColumn["POTnx"][102] = "reqrd_transport_dataset";
		arrProductColumn["POTnx"][103] = "last_match_date";
		//arrProductColumn[POTnx][104] = "submitr_bic";
		//arrProductColumn["POTnx"][105] = "data_set_id";
		arrProductColumn["POTnx"][106] = "freight_charges_type";
		//arrProductColumn["POTnx"][107] = "version";

		
		arrProductColumn["POTnx"][108] = "BuyerBank@name";
		arrProductColumn["POTnx"][109] = "BuyerBank@address_line_1";
		arrProductColumn["POTnx"][110] = "BuyerBank@address_line_2";
		arrProductColumn["POTnx"][111] = "BuyerBank@dom";
		
		arrProductColumn["POTnx"][112] = "SellerBank@name";
		arrProductColumn["POTnx"][113] = "SellerBank@address_line_1";
		arrProductColumn["POTnx"][114] = "SellerBank@address_line_2";
		arrProductColumn["POTnx"][115] = "SellerBank@dom";
						
		arrProductColumn["POTnx"][130] = "Inputter@last_name";
		arrProductColumn["POTnx"][131] = "Inputter@first_name";
		arrProductColumn["POTnx"][132] = "inp_dttm";
		arrProductColumn["POTnx"][135] = "ctl_dttm";
		arrProductColumn["POTnx"][136] = "Releaser@last_name";
		arrProductColumn["POTnx"][137] = "Releaser@first_name";
		arrProductColumn["POTnx"][138] = "release_dttm";
		
		arrProductColumn["POTnx"][140] = "Charge@chrg_code";
		arrProductColumn["POTnx"][141] = "Charge@amt";
		arrProductColumn["POTnx"][142] = "Charge@cur_code";
		arrProductColumn["POTnx"][143] = "Charge@status";
		arrProductColumn["POTnx"][144] = "Charge@additional_comment";
		arrProductColumn["POTnx"][145] = "Charge@settlement_date";

		arrProductColumn["POTnx"][150] = "bo_release_dttm";
		arrProductColumn["POTnx"][151] = "AllowanceTax@amt";
		arrProductColumn["POTnx"][152] = "AllowanceTax@cur_code";
		arrProductColumn["POTnx"][153] = "AllowanceTax@rate";
		arrProductColumn["POTnx"][154] = "AllowanceTax@type";

		arrProductColumn["POTnx"][159] = "tnx_val_date";
		arrProductColumn["POTnx"][160] = "tnx_amt";
		arrProductColumn["POTnx"][161] = "tnx_cur_code";
		arrProductColumn["POTnx"][162] = "entity";
	