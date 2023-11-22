dojo.provide("misys.report.definitions.report_ft_template_candidate");


		// Copyright (c) 2000-2005 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
		
		//
		// FT Template candidate
		//
		

		// Define an array which stores the FT Transaction columns
		

		arrProductColumn["FTTemplate"][0] = "template_id";
		
		arrProductColumn["FTTemplate"][21] = "entity";
		
		
		arrProductColumn["FTTemplate"][28] = "fwd_contract_no";
		arrProductColumn["FTTemplate"][29] = "open_chrg_brn_by_code";
		
		/*arrProductColumn["FTTemplate"][35] = "beneficiary_name";
		arrProductColumn["FTTemplate"][36] = "beneficiary_address_line_1";
		arrProductColumn["FTTemplate"][37] = "beneficiary_address_line_2";
		arrProductColumn["FTTemplate"][38] = "beneficiary_dom";
		arrProductColumn["FTTemplate"][39] = "beneficiary_reference";*/
		
		arrProductColumn["FTTemplate"][41] = "applicant_name";
		arrProductColumn["FTTemplate"][42] = "applicant_address_line_1";
		arrProductColumn["FTTemplate"][43] = "applicant_address_line_2";
		arrProductColumn["FTTemplate"][44] = "applicant_dom";
		arrProductColumn["FTTemplate"][45] = "applicant_reference";
		arrProductColumn["FTTemplate"][48] = "fee_act_no";
	
		arrProductColumn["FTTemplate"][50] = "ft_type";
		
		arrProductColumn["FTTemplate"][69] = "IssuingBank@abbv_name";
		arrProductColumn["FTTemplate"][70] = "IssuingBank@name";
		arrProductColumn["FTTemplate"][71] = "IssuingBank@address_line_1";
		arrProductColumn["FTTemplate"][72] = "IssuingBank@address_line_2";
		arrProductColumn["FTTemplate"][73] = "IssuingBank@dom";
		
		arrProductColumn["FTTemplate"][77] = "AccountWithBank@name";
		arrProductColumn["FTTemplate"][78] = "AccountWithBank@address_line_1";
		arrProductColumn["FTTemplate"][79] = "AccountWithBank@address_line_2";
		arrProductColumn["FTTemplate"][80] = "AccountWithBank@dom";
		
		arrProductColumn["FTTemplate"][84] = "PayThroughBank@name";
		arrProductColumn["FTTemplate"][85] = "PayThroughBank@address_line_1";
		arrProductColumn["FTTemplate"][86] = "PayThroughBank@address_line_2";
		arrProductColumn["FTTemplate"][87] = "PayThroughBank@dom";
		
	/*	arrProductColumn["FTTemplate"][99] = "Narrative@additionalInstructions";
		arrProductColumn["FTTemplate"][100] = "Narrative@boComment";
		arrProductColumn["FTTemplate"][101] = "Narrative@freeFormatText";*/
		//arrProductColumn["FTTemplate"][111] = "beneficiary_act_no";
		
		arrProductColumn["FTTemplate"][112] = "applicant_act_no";
		//arrProductColumn["FTTemplate"][113] = "beneficiary_cur_code";
		
		arrProductColumn["FTTemplate"][120] = "TemplateObjectDataNumber@counterparty_nb";
		arrProductColumn["FTTemplate"][121] = "TemplateObjectDataString@objectdata_counterparty_name";
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["FTTemplate"][130] = "applicant_country";