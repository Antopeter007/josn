dojo.provide("misys.report.definitions.report_td_candidate");


		// Copyright (c) 2000-2010 Misys (http://www.misys.com),
		// All Rights Reserved. 
	
		// TD candidate
		// Define an array which stores the TD columns
		
		arrProductColumn["TD"].push("ref_id");
		arrProductColumn["TD"].push("prod_stat_code");
		arrProductColumn["TD"].push("appl_date");
		arrProductColumn["TD"].push("value_date");
		arrProductColumn["TD"].push("td_cur_code");
		arrProductColumn["TD"].push("td_amt");
		arrProductColumn["TD"].push("td_type");
		arrProductColumn["TD"].push("applicant_act_name");
		arrProductColumn["TD"].push("applicant_act_no");
		arrProductColumn["TD"].push("sub_product_code");
		
				
		arrProductColumn["TD"].push("bo_ref_id");
		arrProductColumn["TD"].push("ObjectDataString@maturity_instruction_name");
		arrProductColumn["TD"].push("ObjectDataString@credit_act_name");
		arrProductColumn["TD"].push("value_date_term_number");
		arrProductColumn["TD"].push("value_date_term_code");
		arrProductColumn["TD"].push("remarks");


		// TD Transaction candidate
		// Define an array which stores the TD Transaction columns
		
		arrProductColumn["TDTnx"].push("ref_id");
		arrProductColumn["TDTnx"].push("prod_stat_code");
		arrProductColumn["TDTnx"].push("tnx_type_code");
		arrProductColumn["TDTnx"].push("tnx_stat_code");
		arrProductColumn["TDTnx"].push("sub_tnx_stat_code");
		arrProductColumn["TDTnx"].push("appl_date");
		arrProductColumn["TDTnx"].push("value_date");
		arrProductColumn["TDTnx"].push("td_cur_code");
		arrProductColumn["TDTnx"].push("td_amt");
		arrProductColumn["TDTnx"].push("td_type");
		arrProductColumn["TDTnx"].push("applicant_act_name");
		arrProductColumn["TDTnx"].push("applicant_act_no");
		arrProductColumn["TDTnx"].push("sub_product_code");
				
		//arrProductColumn["TDTnx"].push("tenor_term_code");
		arrProductColumn["TDTnx"].push("bo_ref_id");
		arrProductColumn["TDTnx"].push("ObjectDataString@maturity_instruction_name");
		arrProductColumn["TDTnx"].push("ObjectDataString@credit_act_name");
		arrProductColumn["TDTnx"].push("value_date_term_number");
		arrProductColumn["TDTnx"].push("value_date_term_code");
		arrProductColumn["TDTnx"].push("remarks");

		arrProductColumn["TDTnx"].push("Inputter@last_name");
		arrProductColumn["TDTnx"].push("Inputter@first_name");
		arrProductColumn["TDTnx"].push("inp_dttm");
		arrProductColumn["TDTnx"].push("Releaser@last_name");
		arrProductColumn["TDTnx"].push("Releaser@first_name");
		arrProductColumn["TDTnx"].push("release_dttm");
		arrProductColumn["TDTnx"].push("bo_release_dttm");

		/* TD Column definition*/
		/*The column definition is present in report_core.xsl and report_addons_core.xsl.*/
		
		
		// CRITERIA: column options - starts
		arrProductCriteriaColumn["TD"].push("ref_id");
		arrProductCriteriaColumn["TD"].push("prod_stat_code");
		arrProductCriteriaColumn["TD"].push("appl_date");
		arrProductCriteriaColumn["TD"].push("value_date");
		arrProductCriteriaColumn["TD"].push("td_cur_code");
		arrProductCriteriaColumn["TD"].push("td_amt");
		arrProductCriteriaColumn["TD"].push("td_type");
		arrProductCriteriaColumn["TD"].push("applicant_act_name");
		arrProductCriteriaColumn["TD"].push("applicant_act_no");
		arrProductCriteriaColumn["TD"].push("sub_product_code");
		arrProductCriteriaColumn["TD"].push("bo_ref_id");
		arrProductCriteriaColumn["TD"].push("ObjectDataString@maturity_instruction_name");
		arrProductCriteriaColumn["TD"].push("value_date_term_number");
		arrProductCriteriaColumn["TD"].push("value_date_term_code");


		arrProductCriteriaColumn["TDTnx"].push("ref_id");
		arrProductCriteriaColumn["TDTnx"].push("prod_stat_code");
		arrProductCriteriaColumn["TDTnx"].push("appl_date");
		arrProductCriteriaColumn["TDTnx"].push("value_date");
		
		
		arrProductCriteriaColumn["TDTnx"].push("td_cur_code");
		arrProductCriteriaColumn["TDTnx"].push("td_amt");
		arrProductCriteriaColumn["TDTnx"].push("td_type");
		arrProductCriteriaColumn["TDTnx"].push("applicant_act_name");
		arrProductCriteriaColumn["TDTnx"].push("applicant_act_no");
		arrProductCriteriaColumn["TDTnx"].push("sub_product_code");
		arrProductCriteriaColumn["TDTnx"].push("tnx_type_code");
		arrProductCriteriaColumn["TDTnx"].push("tnx_stat_code");
		arrProductCriteriaColumn["TDTnx"].push("sub_tnx_stat_code");
		arrProductCriteriaColumn["TDTnx"].push("Inputter@last_name");
		arrProductCriteriaColumn["TDTnx"].push("Inputter@first_name");
		arrProductCriteriaColumn["TDTnx"].push("inp_dttm");
		arrProductCriteriaColumn["TDTnx"].push("Releaser@last_name");
		arrProductCriteriaColumn["TDTnx"].push("Releaser@first_name");
		arrProductCriteriaColumn["TDTnx"].push("release_dttm");
		arrProductCriteriaColumn["TDTnx"].push("bo_ref_id");
		arrProductCriteriaColumn["TDTnx"].push("bo_release_dttm");
		arrProductCriteriaColumn["TDTnx"].push("ObjectDataString@maturity_instruction_name");
		arrProductCriteriaColumn["TDTnx"].push("value_date_term_number");
		arrProductCriteriaColumn["TDTnx"].push("value_date_term_code");

		// CRITERIA: column options - ends

		// GROUPING: column options - starts
		arrProductGroupColumn["TD"].push("prod_stat_code");
		arrProductGroupColumn["TD"].push("appl_date");
		arrProductGroupColumn["TD"].push("value_date");
		arrProductGroupColumn["TD"].push("td_cur_code");
		arrProductGroupColumn["TD"].push("td_amt");
		arrProductGroupColumn["TD"].push("td_type");
		arrProductGroupColumn["TD"].push("applicant_act_name");
		arrProductGroupColumn["TD"].push("applicant_act_no");
		arrProductGroupColumn["TD"].push("sub_product_code");

		arrProductGroupColumn["TDTnx"].push("prod_stat_code");
		arrProductGroupColumn["TDTnx"].push("appl_date");
		arrProductGroupColumn["TDTnx"].push("value_date");
		arrProductGroupColumn["TDTnx"].push("td_cur_code");
		arrProductGroupColumn["TDTnx"].push("td_amt");
		arrProductGroupColumn["TDTnx"].push("td_type");
		arrProductGroupColumn["TDTnx"].push("applicant_act_name");
		arrProductGroupColumn["TDTnx"].push("applicant_act_no");
		arrProductGroupColumn["TDTnx"].push("sub_product_code");
		arrProductGroupColumn["TDTnx"].push("tnx_type_code");
		arrProductGroupColumn["TDTnx"].push("tnx_stat_code");
		arrProductGroupColumn["TDTnx"].push("sub_tnx_stat_code");
		arrProductGroupColumn["TDTnx"].push("Inputter@last_name");
		arrProductGroupColumn["TDTnx"].push("Inputter@first_name");
		arrProductGroupColumn["TDTnx"].push("inp_dttm");
		arrProductGroupColumn["TDTnx"].push("Releaser@last_name");
		arrProductGroupColumn["TDTnx"].push("Releaser@first_name");
		arrProductGroupColumn["TDTnx"].push("release_dttm");
		// GROUPING: column options - ends

		// CHART-AXIS: column options - starts
		arrProductChartXAxisColumn["TD"].push("prod_stat_code");
		arrProductChartXAxisColumn["TD"].push("appl_date");
		arrProductChartXAxisColumn["TD"].push("value_date");
		arrProductChartXAxisColumn["TD"].push("td_cur_code");
		arrProductChartXAxisColumn["TD"].push("td_amt");
		arrProductChartXAxisColumn["TD"].push("td_type");
		arrProductChartXAxisColumn["TD"].push("applicant_act_name");
		arrProductChartXAxisColumn["TD"].push("applicant_act_no");
		arrProductChartXAxisColumn["TD"].push("sub_product_code");

		arrProductChartXAxisColumn["TDTnx"].push("prod_stat_code");
		arrProductChartXAxisColumn["TDTnx"].push("appl_date");
		arrProductChartXAxisColumn["TDTnx"].push("value_date");
		arrProductChartXAxisColumn["TDTnx"].push("td_cur_code");
		arrProductChartXAxisColumn["TDTnx"].push("td_amt");
		arrProductChartXAxisColumn["TDTnx"].push("td_type");
		arrProductChartXAxisColumn["TDTnx"].push("applicant_act_name");
		arrProductChartXAxisColumn["TDTnx"].push("applicant_act_no");
		arrProductChartXAxisColumn["TDTnx"].push("sub_product_code");
		arrProductChartXAxisColumn["TDTnx"].push("tnx_type_code");
		arrProductChartXAxisColumn["TDTnx"].push("tnx_stat_code");
		arrProductChartXAxisColumn["TDTnx"].push("sub_tnx_stat_code");
		arrProductChartXAxisColumn["TDTnx"].push("Inputter@last_name");
		arrProductChartXAxisColumn["TDTnx"].push("Inputter@first_name");
		arrProductChartXAxisColumn["TDTnx"].push("inp_dttm");
		arrProductChartXAxisColumn["TDTnx"].push("Releaser@last_name");
		arrProductChartXAxisColumn["TDTnx"].push("Releaser@first_name");
		arrProductChartXAxisColumn["TDTnx"].push("release_dttm");
		// CHART-AXIS: column options - ends

		// AGGREGATE: column options - starts
		arrProductAggregateColumn["TD"].push("prod_stat_code");
		arrProductAggregateColumn["TD"].push("appl_date");
		arrProductAggregateColumn["TD"].push("value_date");
		arrProductAggregateColumn["TD"].push("td_cur_code");
		arrProductAggregateColumn["TD"].push("td_amt");
		arrProductAggregateColumn["TD"].push("td_type");
		arrProductAggregateColumn["TD"].push("applicant_act_name");
		arrProductAggregateColumn["TD"].push("applicant_act_no");
		arrProductAggregateColumn["TD"].push("sub_product_code");

		arrProductAggregateColumn["TDTnx"].push("prod_stat_code");
		arrProductAggregateColumn["TDTnx"].push("appl_date");
		arrProductAggregateColumn["TDTnx"].push("value_date");
		arrProductAggregateColumn["TDTnx"].push("td_cur_code");
		arrProductAggregateColumn["TDTnx"].push("td_amt");
		arrProductAggregateColumn["TDTnx"].push("td_type");
		arrProductAggregateColumn["TDTnx"].push("applicant_act_name");
		arrProductAggregateColumn["TDTnx"].push("applicant_act_no");
		arrProductAggregateColumn["TDTnx"].push("sub_product_code");
		arrProductAggregateColumn["TDTnx"].push("tnx_type_code");
		arrProductAggregateColumn["TDTnx"].push("tnx_stat_code");
		arrProductAggregateColumn["TDTnx"].push("sub_tnx_stat_code");
		arrProductAggregateColumn["TDTnx"].push("Inputter@last_name");
		arrProductAggregateColumn["TDTnx"].push("Inputter@first_name");
		arrProductAggregateColumn["TDTnx"].push("inp_dttm");
		arrProductAggregateColumn["TDTnx"].push("Releaser@last_name");
		arrProductAggregateColumn["TDTnx"].push("Releaser@first_name");
		arrProductAggregateColumn["TDTnx"].push("release_dttm");
		// AGGREGATE: column options - ends