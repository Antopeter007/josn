dojo.provide("misys.report.definitions.report_lt_candidate"); 


		// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// LT candidate
		//

		// Define an array which stores the LT columns
		

		arrProductColumn["LT"][0] = "ref_id";
		arrProductColumn["LT"][1] = "template_id";
		arrProductColumn["LT"][2] = "bo_ref_id";
		arrProductColumn["LT"][3] = "cust_ref_id";
		arrProductColumn["LT"][7] = "prod_stat_code";
		arrProductColumn["LT"][8] = "entity";
		arrProductColumn["LT"][17] = "line_item_number";
		arrProductColumn["LT"][18] = "po_ref_id";
		arrProductColumn["LT"][19] = "appl_date";
		arrProductColumn["LT"][20] = "qty_unit_measr_code";
		arrProductColumn["LT"][21] = "qty_other_unit_measr";
		arrProductColumn["LT"][22] = "qty_val";
		arrProductColumn["LT"][23] = "qty_factor";
		arrProductColumn["LT"][24] = "qty_tol_pstv_pct";
		arrProductColumn["LT"][25] = "qty_tol_neg_pct";
		arrProductColumn["LT"][26] = "price_unit_measr_code";
		arrProductColumn["LT"][27] = "price_other_unit_measr";
		arrProductColumn["LT"][28] = "price_amt";
		arrProductColumn["LT"][29] = "price_cur_code";
		arrProductColumn["LT"][30] = "price_factor";
		arrProductColumn["LT"][31] = "price_tol_pstv_pct";
		arrProductColumn["LT"][32] = "price_tol_neg_pct";
		arrProductColumn["LT"][33] = "product_name";
		arrProductColumn["LT"][34] = "product_orgn";
		arrProductColumn["LT"][35] = "last_ship_date";
		arrProductColumn["LT"][36] = "total_amt";
		arrProductColumn["LT"][37] = "total_cur_code";
		arrProductColumn["LT"][38] = "total_net_amt";
		arrProductColumn["LT"][39] = "total_net_cur_code";
		arrProductColumn["LT"][40] = "order_total_amt";
		arrProductColumn["LT"][41] = "order_total_cur_code";
		arrProductColumn["LT"][42] = "order_total_net_amt";
		arrProductColumn["LT"][43] = "order_total_net_cur_code";
		arrProductColumn["LT"][44] = "accpt_total_amt";
		arrProductColumn["LT"][45] = "accpt_total_cur_code";
		arrProductColumn["LT"][46] = "accpt_total_net_amt";
		arrProductColumn["LT"][47] = "accpt_total_net_cur_code";
		arrProductColumn["LT"][48] = "liab_total_amt";
		arrProductColumn["LT"][49] = "liab_total_cur_code";
		arrProductColumn["LT"][50] = "liab_total_net_amt";
		arrProductColumn["LT"][51] = "liab_total_net_cur_code";


		//
		// LT Transaction candidate
		//

		// Define an array which stores the LT Transaction columns
		

		arrProductColumn["LTTnx"][0] = "ref_id";
		arrProductColumn["LTTnx"][1] = "template_id";
		arrProductColumn["LTTnx"][2] = "bo_ref_id";
		arrProductColumn["LTTnx"][3] = "cust_ref_id";
		arrProductColumn["LTTnx"][5] = "tnx_type_code";
		arrProductColumn["LTTnx"][6] = "sub_tnx_type_code";
		arrProductColumn["LTTnx"][7] = "prod_stat_code";
		arrProductColumn["LTTnx"][14] = "tnx_val_date";
		arrProductColumn["LTTnx"][15] = "tnx_amt";
		arrProductColumn["LTTnx"][16] = "tnx_cur_code";
		
		arrProductColumn["LTTnx"][17] = "line_item_number";
		arrProductColumn["LTTnx"][18] = "po_ref_id";
		arrProductColumn["LTTnx"][19] = "appl_date";
		arrProductColumn["LTTnx"][20] = "qty_unit_measr_code";
		arrProductColumn["LTTnx"][21] = "qty_other_unit_measr";
		arrProductColumn["LTTnx"][22] = "qty_val";
		arrProductColumn["LTTnx"][23] = "qty_factor";
		arrProductColumn["LTTnx"][24] = "qty_tol_pstv_pct";
		arrProductColumn["LTTnx"][25] = "qty_tol_neg_pct";
		arrProductColumn["LTTnx"][26] = "price_unit_measr_code";
		arrProductColumn["LTTnx"][27] = "price_other_unit_measr";
		arrProductColumn["LTTnx"][28] = "price_amt";
		arrProductColumn["LTTnx"][29] = "price_cur_code";
		arrProductColumn["LTTnx"][30] = "price_factor";
		arrProductColumn["LTTnx"][31] = "price_tol_pstv_pct";
		arrProductColumn["LTTnx"][32] = "price_tol_neg_pct";
		arrProductColumn["LTTnx"][33] = "product_name";
		arrProductColumn["LTTnx"][34] = "product_orgn";
		arrProductColumn["LTTnx"][35] = "last_ship_date";
		arrProductColumn["LTTnx"][36] = "total_amt";
		arrProductColumn["LTTnx"][37] = "total_cur_code";
		arrProductColumn["LTTnx"][38] = "total_net_amt";
		arrProductColumn["LTTnx"][39] = "total_net_cur_code";
		arrProductColumn["LTTnx"][40] = "order_total_amt";
		arrProductColumn["LTTnx"][41] = "order_total_cur_code";
		arrProductColumn["LTTnx"][42] = "order_total_net_amt";
		arrProductColumn["LTTnx"][43] = "order_total_net_cur_code";
		arrProductColumn["LTTnx"][44] = "accpt_total_amt";
		arrProductColumn["LTTnx"][45] = "accpt_total_cur_code";
		arrProductColumn["LTTnx"][46] = "accpt_total_net_amt";
		arrProductColumn["LTTnx"][47] = "accpt_total_net_cur_code";
		arrProductColumn["LTTnx"][48] = "liab_total_amt";
		arrProductColumn["LTTnx"][49] = "liab_total_cur_code";
		arrProductColumn["LTTnx"][50] = "liab_total_net_amt";
		arrProductColumn["LTTnx"][51] = "liab_total_net_cur_code";

		arrProductColumn["LTTnx"][130] = "Inputter@last_name";
		arrProductColumn["LTTnx"][131] = "Inputter@first_name";
		arrProductColumn["LTTnx"][132] = "inp_dttm";
		arrProductColumn["LTTnx"][135] = "ctl_dttm";
		arrProductColumn["LTTnx"][136] = "Releaser@last_name";
		arrProductColumn["LTTnx"][137] = "Releaser@first_name";
		arrProductColumn["LTTnx"][138] = "release_dttm";

		arrProductColumn["LTTnx"][145] = "bo_release_dttm";
	