dojo.provide("misys.report.definitions.report_bk_candidate");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 

//
// BK candidate
//
// Define an array which stores the BK columns

arrProductColumn["BK"].push("ref_id");		
arrProductColumn["BK"].push("bo_ref_id");
arrProductColumn["BK"].push("cust_ref_id");
arrProductColumn["BK"].push("sub_product_code");
arrProductColumn["BK"].push("prod_stat_code");
arrProductColumn["BK"].push("appl_date");
arrProductColumn["BK"].push("value_date");
arrProductColumn["BK"].push("applicant_act_name");
arrProductColumn["BK"].push("applicant_act_no");
arrProductColumn["BK"].push("applicant_act_cur_code");
arrProductColumn["BK"].push("bk_cur_code");
arrProductColumn["BK"].push("bk_total_amt");
arrProductColumn["BK"].push("IssuingBank@name");
arrProductColumn["BK"].push("bk_highest_amt");
arrProductColumn["BK"].push("bk_type");
arrProductColumn["BK"].push("ObjectDataString@payroll_type");
arrProductColumn["BK"].push("Narrative@additionalInstructions");
arrProductColumn["BK"].push("record_number");


//
// BK Transaction candidate
//
// Define an array which stores the BK Transaction columns
arrProductColumn["BKTnx"].push("ref_id");	
arrProductColumn["BKTnx"].push("tnx_id");
arrProductColumn["BKTnx"].push("bo_ref_id");
arrProductColumn["BKTnx"].push("cust_ref_id");
arrProductColumn["BKTnx"].push("sub_product_code");
arrProductColumn["BKTnx"].push("prod_stat_code");
arrProductColumn["BKTnx"].push("tnx_type_code");
arrProductColumn["BKTnx"].push("tnx_stat_code");
arrProductColumn["BKTnx"].push("sub_tnx_stat_code");
arrProductColumn["BKTnx"].push("appl_date");
arrProductColumn["BKTnx"].push("value_date");
arrProductColumn["BKTnx"].push("applicant_act_name");
arrProductColumn["BKTnx"].push("applicant_act_no");
arrProductColumn["BKTnx"].push("applicant_act_cur_code");
arrProductColumn["BKTnx"].push("bk_cur_code");
arrProductColumn["BKTnx"].push("bk_total_amt");
arrProductColumn["BKTnx"].push("IssuingBank@name");
arrProductColumn["BKTnx"].push("Inputter@last_name");
arrProductColumn["BKTnx"].push("Inputter@first_name");
arrProductColumn["BKTnx"].push("inp_dttm");
arrProductColumn["BKTnx"].push("Releaser@last_name");
arrProductColumn["BKTnx"].push("Releaser@first_name");
arrProductColumn["BKTnx"].push("release_dttm");
arrProductColumn["BKTnx"].push("bk_highest_amt");
arrProductColumn["BKTnx"].push("bk_type");
arrProductColumn["BKTnx"].push("ObjectDataString@payroll_type");
arrProductColumn["BKTnx"].push("Narrative@additionalInstructions");
arrProductColumn["BKTnx"].push("record_number");
arrProductColumn["BKTnx"].push("bo_release_dttm");

// CRITERIA: column options - starts
arrProductCriteriaColumn["BK"].push("ref_id");
arrProductCriteriaColumn["BK"].push("prod_stat_code");
arrProductCriteriaColumn["BK"].push("appl_date");
arrProductCriteriaColumn["BK"].push("value_date");
arrProductCriteriaColumn["BK"].push("applicant_act_name");
arrProductCriteriaColumn["BK"].push("applicant_act_no");
arrProductCriteriaColumn["BK"].push("applicant_act_cur_code");
arrProductCriteriaColumn["BK"].push("bk_type");
arrProductCriteriaColumn["BK"].push("bk_total_amt");
arrProductCriteriaColumn["BK"].push("sub_product_code");
arrProductCriteriaColumn["BK"].push("bo_ref_id");

arrProductCriteriaColumn["BKTnx"].push("ref_id");
arrProductCriteriaColumn["BKTnx"].push("tnx_id");
arrProductCriteriaColumn["BKTnx"].push("prod_stat_code");
arrProductCriteriaColumn["BKTnx"].push("appl_date");
arrProductCriteriaColumn["BKTnx"].push("value_date");
arrProductCriteriaColumn["BKTnx"].push("applicant_act_name");
arrProductCriteriaColumn["BKTnx"].push("applicant_act_no");
arrProductCriteriaColumn["BKTnx"].push("applicant_act_cur_code");
arrProductCriteriaColumn["BKTnx"].push("bk_type");
arrProductCriteriaColumn["BKTnx"].push("bk_total_amt");
arrProductCriteriaColumn["BKTnx"].push("sub_product_code");
arrProductCriteriaColumn["BKTnx"].push("tnx_type_code");
arrProductCriteriaColumn["BKTnx"].push("tnx_stat_code");
arrProductCriteriaColumn["BKTnx"].push("sub_tnx_stat_code");
arrProductCriteriaColumn["BKTnx"].push("Inputter@last_name");
arrProductCriteriaColumn["BKTnx"].push("Inputter@first_name");
arrProductCriteriaColumn["BKTnx"].push("inp_dttm");
arrProductCriteriaColumn["BKTnx"].push("Releaser@last_name");
arrProductCriteriaColumn["BKTnx"].push("Releaser@first_name");
arrProductCriteriaColumn["BKTnx"].push("release_dttm");
arrProductCriteriaColumn["BKTnx"].push("bo_ref_id");
arrProductCriteriaColumn["BKTnx"].push("bo_release_dttm");
// CRITERIA: column options - ends

// GROUPING: column options - starts
arrProductGroupColumn["BK"].push("prod_stat_code");
arrProductGroupColumn["BK"].push("appl_date");
arrProductGroupColumn["BK"].push("value_date");
arrProductGroupColumn["BK"].push("applicant_act_name");
arrProductGroupColumn["BK"].push("applicant_act_no");
arrProductGroupColumn["BK"].push("applicant_act_cur_code");
arrProductGroupColumn["BK"].push("bk_type");
arrProductGroupColumn["BK"].push("bk_total_amt");
arrProductGroupColumn["BK"].push("sub_product_code");

arrProductGroupColumn["BKTnx"].push("prod_stat_code");
arrProductGroupColumn["BKTnx"].push("appl_date");
arrProductGroupColumn["BKTnx"].push("value_date");
arrProductGroupColumn["BKTnx"].push("applicant_act_name");
arrProductGroupColumn["BKTnx"].push("applicant_act_no");
arrProductGroupColumn["BKTnx"].push("applicant_act_cur_code");
arrProductGroupColumn["BKTnx"].push("bk_type");
arrProductGroupColumn["BKTnx"].push("bk_total_amt");
arrProductGroupColumn["BKTnx"].push("sub_product_code");
arrProductGroupColumn["BKTnx"].push("tnx_type_code");
arrProductGroupColumn["BKTnx"].push("tnx_stat_code");
arrProductGroupColumn["BKTnx"].push("sub_tnx_stat_code");
arrProductGroupColumn["BKTnx"].push("Inputter@last_name");
arrProductGroupColumn["BKTnx"].push("Inputter@first_name");
arrProductGroupColumn["BKTnx"].push("inp_dttm");
arrProductGroupColumn["BKTnx"].push("Releaser@last_name");
arrProductGroupColumn["BKTnx"].push("Releaser@first_name");
arrProductGroupColumn["BKTnx"].push("release_dttm");
// GROUPING: column options - ends

// CHART-AXIS: column options - starts
arrProductChartXAxisColumn["BK"].push("prod_stat_code");
arrProductChartXAxisColumn["BK"].push("appl_date");
arrProductChartXAxisColumn["BK"].push("value_date");
arrProductChartXAxisColumn["BK"].push("applicant_act_name");
arrProductChartXAxisColumn["BK"].push("applicant_act_no");
arrProductChartXAxisColumn["BK"].push("applicant_act_cur_code");
arrProductChartXAxisColumn["BK"].push("bk_type");
arrProductChartXAxisColumn["BK"].push("bk_total_amt");
arrProductChartXAxisColumn["BK"].push("sub_product_code");

arrProductChartXAxisColumn["BKTnx"].push("prod_stat_code");
arrProductChartXAxisColumn["BKTnx"].push("appl_date");
arrProductChartXAxisColumn["BKTnx"].push("value_date");
arrProductChartXAxisColumn["BKTnx"].push("applicant_act_name");
arrProductChartXAxisColumn["BKTnx"].push("applicant_act_no");
arrProductChartXAxisColumn["BKTnx"].push("applicant_act_cur_code");
arrProductChartXAxisColumn["BKTnx"].push("bk_type");
arrProductChartXAxisColumn["BKTnx"].push("bk_total_amt");
arrProductChartXAxisColumn["BKTnx"].push("sub_product_code");
arrProductChartXAxisColumn["BKTnx"].push("tnx_type_code");
arrProductChartXAxisColumn["BKTnx"].push("tnx_stat_code");
arrProductChartXAxisColumn["BKTnx"].push("sub_tnx_stat_code");
arrProductChartXAxisColumn["BKTnx"].push("Inputter@last_name");
arrProductChartXAxisColumn["BKTnx"].push("Inputter@first_name");
arrProductChartXAxisColumn["BKTnx"].push("inp_dttm");
arrProductChartXAxisColumn["BKTnx"].push("Releaser@last_name");
arrProductChartXAxisColumn["BKTnx"].push("Releaser@first_name");
arrProductChartXAxisColumn["BKTnx"].push("release_dttm");
// CHART-AXIS: column options - ends

// AGGREGATE: column options - starts
arrProductAggregateColumn["BK"].push("prod_stat_code");
arrProductAggregateColumn["BK"].push("appl_date");
arrProductAggregateColumn["BK"].push("value_date");
arrProductAggregateColumn["BK"].push("applicant_act_name");
arrProductAggregateColumn["BK"].push("applicant_act_no");
arrProductAggregateColumn["BK"].push("applicant_act_cur_code");
arrProductAggregateColumn["BK"].push("bk_type");
arrProductAggregateColumn["BK"].push("bk_total_amt");
arrProductAggregateColumn["BK"].push("sub_product_code");

arrProductAggregateColumn["BKTnx"].push("prod_stat_code");
arrProductAggregateColumn["BKTnx"].push("appl_date");
arrProductAggregateColumn["BKTnx"].push("value_date");
arrProductAggregateColumn["BKTnx"].push("applicant_act_name");
arrProductAggregateColumn["BKTnx"].push("applicant_act_no");
arrProductAggregateColumn["BKTnx"].push("applicant_act_cur_code");
arrProductAggregateColumn["BKTnx"].push("bk_type");
arrProductAggregateColumn["BKTnx"].push("bk_total_amt");
arrProductAggregateColumn["BKTnx"].push("sub_product_code");
arrProductAggregateColumn["BKTnx"].push("tnx_type_code");
arrProductAggregateColumn["BKTnx"].push("tnx_stat_code");
arrProductAggregateColumn["BKTnx"].push("sub_tnx_stat_code");
arrProductAggregateColumn["BKTnx"].push("Inputter@last_name");
arrProductAggregateColumn["BKTnx"].push("Inputter@first_name");
arrProductAggregateColumn["BKTnx"].push("inp_dttm");
arrProductAggregateColumn["BKTnx"].push("Releaser@last_name");
arrProductAggregateColumn["BKTnx"].push("Releaser@first_name");
arrProductAggregateColumn["BKTnx"].push("release_dttm");
// AGGREGATE: column options - ends
