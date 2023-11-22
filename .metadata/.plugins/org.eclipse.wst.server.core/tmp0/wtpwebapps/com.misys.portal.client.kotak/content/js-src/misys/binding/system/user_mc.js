dojo.provide("misys.binding.system.user_mc");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	var
	_customerPermissionsOption = "CUSTOMER_PERMISSIONS_MAINTENANCE",
	
	_userStaticTypeNode = "static_user",
	
	_companyStaticTypeNode = "static_company";
	
	var entitlementIdList = [];
	
	var subsidiaryIdList = [];
	
	var subsidiaryCodeList = [];
	
	var entityList = [];
	
	var entityAbbvList = [];
	
	var selectedEntitiesList = [];

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'UP',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :'',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});

	//Private methods follow
	function _addGroupRecord(/*String*/ dom, /*String*/ abbvNodeName, /*String*/ nodeName, /*String*/ limitCurName, /*String*/ limitAmtName)
	{
		//  summary:
		//          Adds a group record to the XML
	    //  tags:
	    //         private
		var abbvNode = dom.getElementsByTagName(abbvNodeName)[0],
		
			node = dom.getElementsByTagName(nodeName)[0],
		
			abbvChildNode = "",
			
			abbvName = "",
			
			returnString = [];
		
			if(abbvNode)
			{
				abbvChildNode = abbvNode.childNodes[0];
				if(abbvChildNode && abbvChildNode.nodeValue)
				{
					abbvName = abbvChildNode.nodeValue;
				}
		    }
			returnString.push("<group_record><group_abbv_name>",abbvName,"</group_abbv_name>");
			//If the component type is a filter select then read component value
			if(dijit.byId(nodeName)){
				if((/dijit.form.FilteringSelect/.test(dijit.byId(nodeName).declaredClass)) || (/misys.form.SortedFilteringSelect/.test(dijit.byId(nodeName).declaredClass))){
					//If the field value is not empty
					if("S" + dijit.byId(nodeName).get("value") !== "S")
					{
						returnString.push("<existing_roles><role>");
						returnString.push("<name>", dijit.byId(nodeName).get("value"), "</name>");
						
						if((dijit.byId(limitCurName) && dijit.byId(limitAmtName)))
						{
							if("S" + dijit.byId(limitCurName).get("value") !== "S")
							{
								returnString.push("<limit_cur_code>", dijit.byId(limitCurName).get("value"), "</limit_cur_code>");
							}
							if("S" + dijit.byId(limitAmtName).get("value") !== "S" && !isNaN(dijit.byId(limitAmtName).get("value")))
							{
								returnString.push("<limit_amt>", dijit.byId(limitAmtName).get("value"), "</limit_amt>");
							}
						}
						
						returnString.push("</role></existing_roles>");
					}
				}else{
					dojo.forEach(dojo.query("option", dijit.byId(nodeName).domNode), function(option){
						returnString.push("<existing_roles><role>");
						returnString.push("<name>", option.value, "</name>");
						returnString.push("</role></existing_roles>");
						 
					});	
				}
			}
			returnString.push("</group_record>");
			return returnString.join("");
	}
	
	//Build user entities records for toXML operation
	function _addUserEntityRecords( /*String*/ userId) {
		//  summary:
		//          Create the user entity records XML 
		var transformedXml = [];
		
		for(var i=1; i<=misys._config.entity.count; i++)
	 	{
			var defaultEntityId = dijit.byId("default_entity").get("value"),
				entityId = dijit.byId("entity_id_nosend_".concat(i)).get('value');
			
			if(dijit.byId("entity_flag_nosend_"+entityId).checked)
			{
				var entityRecord = ["<entity_record>"];
				//entityRecord.push("<user_id>",userId,"</user_id>");
				entityRecord.push("<entity_abbv_name>", 
						dijit.byId("entity_abbv_name_nosend_"+entityId).get('value'),"</entity_abbv_name>");
				entityRecord.push("<entity_id>",entityId,"</entity_id>");
				if(defaultEntityId === entityId)
				{
					entityRecord.push("<default_entity>Y</default_entity>");
				}
				else{
					entityRecord.push("<default_entity>N</default_entity>");
				}
				var roleArray = dijit.byId("entity_roles_exist_nosend_"+entityId).get("value");
				d.forEach(roleArray, function(role){
					if(role) {
						entityRecord.push("<existing_roles><role><name>");
						entityRecord.push(role);
						entityRecord.push("</name></role></existing_roles>");
					}
				});

				entityRecord.push("</entity_record>");
				transformedXml.push(entityRecord.join(""));
			}
		}
		return transformedXml.join("");
	}
	
	//Build user entity records for toXML operation for approver(FCM)
	function _addFCMUserEntityRecords(/*String*/ userId) {
		//  summary:
		//          Create the user assigned entities records XML for FCM LOB
		var transformedXml = [];
		if(misys._config.subsidiary && misys._config.subsidiary.count > 0)
		{
			if(dijit.byId("entitlement_id_nosend_".concat(1))) {
				var entitlementId = dijit.byId("entitlement_id_nosend_".concat(1)).get("value");
				var entitlementRecord = ["<user_entities_record>"];
				entitlementRecord.push("<entity_List_approver>");
				for(var j=1; j<=misys._config.subsidiary.count; j++)
				{
					if(j !== misys._config.subsidiary.count){
						entitlementRecord.push(dijit.byId("entity_name_"+entitlementId+"_".concat(j)).get("value"),",");
					}
					else{
						entitlementRecord.push(dijit.byId("entity_name_"+entitlementId+"_".concat(j)).get("value"));
					}
				}
				entitlementRecord.push("</entity_List_approver>");
				entitlementRecord.push("</user_entities_record>");
				transformedXml.push(entitlementRecord.join(""));
			}
		}
		return transformedXml.join("");
	}
	
	//Build user entitlements records for toXML operation
	/*function _addUserEntitlementRecords( String userId) {
		//  summary:
		//          Create the user entitlements records XML 
		var transformedXml = [];
		if(misys._config.entitlement && misys._config.entitlement.count > 0)
		{
			for(var i=1; i<=misys._config.entitlement.count; i++)
		 	{	
				if(dijit.byId("entitlement_id_nosend_".concat(i))) {
				var entitlementId = dijit.byId("entitlement_id_nosend_".concat(i)).get('value');
				
				if(dijit.byId("entitlement_flag_nosend_"+entitlementId).checked)
				{
					var entitlementRecord = ["<entitlement_record>"];
					entitlementRecord.push("<entitlement_code>", 
							dijit.byId("entitlement_code_nosend_"+entitlementId).get('value'),"</entitlement_code>");
					entitlementRecord.push("<entitlement_description>", 
							dijit.byId("entitlement_name_nosend_"+entitlementId).get('value'),"</entitlement_description>");
							
					entitlementRecord.push("<entitlement_description>", 
							dijit.byId("entitlement_name_nosend_"+entitlementId).get('value'),"</entitlement_description>");
					entitlementRecord.push("<entitlement_description>", 
							dijit.byId("entitlement_name_nosend_"+entitlementId).get('value'),"</entitlement_description>");
									
					entitlementRecord.push("</entitlement_record>");
					transformedXml.push(entitlementRecord.join(""));
				}
			}
			}
		}
		return transformedXml.join("");
	}*/
	

	//Build user role template records for toXML operation
	function _addUserEntitlementSubsidiaryRecords( /*String*/ userId) {
		//  summary:
		//          Create the user entitlements records XML 
		var transformedXml = [];
		if(misys._config.entitlement && misys._config.entitlement.count > 0)
		{
			for(var i=1; i<=misys._config.entitlement.count; i++)
		 	{	
				if(dijit.byId("entitlement_id_nosend_".concat(i))) {
					var entitlementId = dijit.byId("entitlement_id_nosend_".concat(i)).get('value');
					
					
					
					if(dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId).checked)
					{
						var entitlementRecord = ["<entitlement_record>"];
						entitlementRecord.push("<entitlement_id>", 
								dijit.byId("entitlement_id_nosend_".concat(i)).get('value'),"</entitlement_id>");
						entitlementRecord.push("<entitlement_code>", 
								dijit.byId("entitlement_code_nosend_"+entitlementId).get('value'),"</entitlement_code>");
						entitlementRecord.push("<entitlement_description>", 
								dijit.byId("entitlement_name_nosend_"+entitlementId).get('value'),"</entitlement_description>");
						
						entitlementRecord.push("<subsidiaries_assigned>");
						//adding subsidiary list
						var count= dijit.byId("entitlement_subsidiary_count_"+entitlementId+"_1").get("value");
						for(var j=1; j<=count; j++){
							entitlementRecord.push("<subsidiary>");
							entitlementRecord.push("<subsidiary_id>",
									dijit.byId("subsidiary_id_nosend_"+entitlementId+"_".concat(j)).get('value'),"</subsidiary_id>");
							entitlementRecord.push("<subsidiary_code>",
									dijit.byId("subsidiary_code_nosend_"+entitlementId+"_".concat(j)).get('value'),"</subsidiary_code>");
							entitlementRecord.push("</subsidiary>");
						}
						entitlementRecord.push("</subsidiaries_assigned>"); 
						entitlementRecord.push("</entitlement_record>");
						transformedXml.push(entitlementRecord.join(""));
					}
				}
			}
		}
		return transformedXml.join("");
	}

	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	

	function _validateEmailFieldFormat(/*String*/ field)
	{
		var fieldValue = field.get('value');
		if(fieldValue === ""){
			return true;
		}

		var multiemail = fieldValue.split(";");
		var validemail = [];
		var j = 0;
		for( var i=(multiemail.length-1); i>=0; i--)
		{
			if(!dojox.validate.isEmailAddress(multiemail[i])){
				validemail[j] = multiemail[i];
				j++;
			}
	     }
		
		if(i>j){
			field.invalidMessage = m.getLocalization("invalidEmailAddressError");
			return false;
		}
		
		for( var k=(validemail.length-1); k>=0; k--)
		{
			if(!dojox.validate.isEmailAddress(validemail[k])){
				field.invalidMessage = m.getLocalization("invalidEmailAddressError");
				return false;
			}
			
		}
		
		return true;
	}
	
	function _showValidatePhoneNumberMsg(response) {
		console.debug("[Validate] Validating phone number");
		var field = dj.byId("phone");
		
		if (response.items.valid === false && response.items.checkValidation === true) {
			if (field !== undefined) {
				field.focus();
				var displayMessage = m.getLocalization("illegalCharErrorContact");
				field.set("value", "");
				field.set("state", "Error");
				dijit.hideTooltip(field.domNode);
				dijit.showTooltip(displayMessage, field.domNode, 0);
			}

		} else {
			console.debug("message is false");
		}
	}
	
	function _showValidateTelephoneNumberMsg(response) {

		console.debug("[Validate] Validating phone number");
		var field = dj.byId("telephone_number");
		
		if (response.items.valid === false && response.items.checkValidation === true) {
			if (field !== undefined) {
				field.focus();
				var displayMessage = m.getLocalization("illegalCharErrorTelephoneNumber");
				field.set("value", "");
				field.set("state", "Error");
				dijit.hideTooltip(field.domNode);
				dijit.showTooltip(displayMessage, field.domNode, 0);
			}

		} else {
			console.debug("message is false");
		}
	}
	
	
	d.mixin(m, {
		bind : function() {
			d.forEach(new Array('bank', 'company'), function(authPrefix){
				for(var i = 1; dijit.byId(authPrefix + '_limit_cur_code_' + i); i++)
			    {
			    	m.setValidation(authPrefix + "_limit_cur_code_" + i, m.validateCurrency);
			    	m.connect(authPrefix + "_limit_cur_code_" + i, "onChange", function(){
			    		var length = this.id.length;
			    		m.setCurrency(this, [authPrefix + "_limit_amt_" + this.id.substring(length-1, length)]);
			    	});	
				}
			});
			
			m.setValidation("base_cur_code", m.validateCurrency);
			m.setValidation("abbv_name", m.validateCharacters);
			m.connect('login_id', 'onChange', function(){
				m.checkUserExists();
			});

			m.setValidation("company_abbv_name", m.validateCharacters);
			m.setValidation("password_value", m.validateChangePasswordNP);
			m.setValidation("password_confirm", m.validateChangePasswordCP);
			m.setValidation("email", m.validateEmailAddr);
			m.connect("phone", "onChange", function(){
				var phone = dj.byId("phone");
				var phoneStr = phone.get("value");
				if (phoneStr !== "") {
					m.xhrPost({
						url: m.getServletURL("/screen/AjaxScreen/action/ValidatePhoneNumberAction"),
						handleAs: "json",
						sync: true,
						content: {
							phone_number: phoneStr
						},
						load: _showValidatePhoneNumberMsg
					});
				}
			});
			m.connect("telephone_number", "onChange", function() {
				var phone = dj.byId("telephone_number");
				var phoneStr = phone.get("value");
				var enableRegexValidation = dj.byId("enable_telephone_regex_validation").get("value");
				if (phoneStr !== '' && enableRegexValidation === 'true') {
					m.xhrPost({
						url: m.getServletURL("/screen/AjaxScreen/action/ValidatePhoneNumberAction"),
						handleAs: "json",
						sync: true,
						content: {
							phone_number: phoneStr
						},
						load: _showValidateTelephoneNumberMsg
					});
				}

			});
			m.connect('fax', 'onBlur', function(){
				var regex = dj.byId("contact_number_regex");
				var regexStr = regex ? dj.byId("contact_number_regex").get("value") : '';	
				var phoneRegExp = new RegExp(regexStr);
				var fax = dj.byId('fax');
				var faxStr =  fax.get('value');
				if(fax && fax.get('value') !== "" && !phoneRegExp.test(faxStr)) {
						var errorMessage = m.getLocalization("illegalCharErrorContactForFax");
						m.dialog.show("ERROR", errorMessage, "Fax Error", function(){
						fax.focus();
						fax.set("state", "Error");
						dj.hideTooltip(fax.domNode);
						dj.showTooltip(errorMessage, fax.domNode, 0);	
					});
					setTimeout(function(){
						dj.hideTooltip(fax.domNode);
					}, 5000);		
				}
			});
			m.setValidation("legal_country", m.validateCountry);
			m.setValidation("rmGroup", m.checkRMGroupExists);
			m.connect("external_lob", "onChange", function(){			
				m.showRoleTemplateTable();
			});
			
			m.connect('employee_no', 'onChange', function(){
				m.checkEmployeeNoExists();
			});
			m.connect('email', 'onBlur', function(){
				if(misys._config.unique_email_id === true){
				m.checkEmailExistence();
				}
				// Validate email format iff value exist
				var emailField = dj.byId('email');
				var isEmailFieldFormatValid = _validateEmailFieldFormat(emailField);
				
			 	if(emailField && emailField.get('value') !== "" && isEmailFieldFormatValid === false)
			 	{
					var displayMessage = m.getLocalization("invalidEmailAddressError");
					
					m.dialog.show("ERROR", displayMessage, "Email Error", function(){
						emailField.focus();
						emailField.set("state", "Error");
						dj.hideTooltip(emailField.domNode);
						dj.showTooltip(displayMessage, emailField.domNode, 0);
					});
					setTimeout(function(){
						dj.hideTooltip(emailField.domNode);
					}, 5000);
			 	 }
			});
			m.connect('pending_trans_notify', 'onChange', function(){
				m.toggleEmail();
			});
			m.connect('clone_user', 'onChange', function(){
				if(d.byId('clone_user') && d.byId('clone_user').checked){
					var name=dijit.byId("company_abbv_name").get('value');
		            var companyId=dijit.byId("company_id").get('value');
					m.showUsersDialog('users', "['clone_user']",name,companyId,'','','width:750px;height:430px;','List Of Users','');
					d.byId('clone_user').checked = false;
				}
				
			});
						
			m.connect("password_value", "onBlur", _checkConfirmPassword);
			
			//For fixing the Artifact: artf913767, artf897372 - End 
			
			misys.connect('password_type_1', 'onChange', function() {
				if(dijit.byId("password_type_1") && dijit.byId("password_type_1").get("checked"))
				{
					dijit.byId("password_value").set("value",'');
					dijit.byId("password_confirm").set("value",'');
					dijit.byId("password_value").set("disabled",true);
					dijit.byId("password_confirm").set("disabled",true);
					dijit.byId("password_value").set("required",false);
					dijit.byId("password_confirm").set("required",false);
				}
				else if(dijit.byId("password_type_2") && dijit.byId("password_type_2").get("checked"))
				{
					dijit.byId("password_value").set("disabled",false);
					dijit.byId("password_confirm").set("disabled",false);
					dijit.byId("password_value").set("required",true);
					dijit.byId("password_confirm").set("required",true);
				}
			});
			if(dijit.byId("default_entity"))
			{
				m.connect("default_entity", "onChange", function(){
					var defaultEntity = dijit.byId("default_entity").get("value");
					for(var j=1; j<=misys._config.entity.count; j++){
						var entityId = dijit.byId("entity_id_nosend_".concat(j)).get('value');
						dijit.byId("entity_flag_nosend_"+entityId).set("readOnly",false);
					}
					if(defaultEntity !== "")
					{
						dijit.byId("entity_flag_nosend_"+defaultEntity).set("checked",true);
						dijit.byId("entity_flag_nosend_"+defaultEntity).set("readOnly",true);
						var entityValue = dijit.byId("entity_abbv_name_nosend_".concat(defaultEntity)).get("value");
						dijit.byId("default_subsidiary").set("value",entityValue);
					}
				});
				for(var i=1; i<=misys._config.entity.count; i++){
					(function(value) {
						var entityId = dijit.byId("entity_id_nosend_".concat(value)).get('value');
						m.setValidation("limit_cur_code_nosend_"+entityId, m.validateCurrency);
						m.connect("limit_cur_code_nosend_"+entityId, "onChange", function(){
							m.setCurrency(dijit.byId("limit_cur_code_nosend_"+entityId), ["limit_amt_nosend_"+entityId]);
						});
						misys.connect("entity_flag_nosend_"+entityId,"onChange",function(){
							if(dijit.byId("entity_flag_nosend_"+entityId).get("checked"))
							{
								m.toggleDisplayRoles(entityId,'down');
							}
							else
							{
								m.toggleDisplayRoles(entityId,'up');
							}
						});
					})(i);
				}
			}
			
		},
		
		showRoleTemplateTable : function(){
			if (dijit.byId("external_lob") && dijit.byId("external_lob").value === "01"){
				if(dijit.byId("default_entity")){
					dijit.byId("default_entity").set("required", true);
					m.toggleRequired("default_entity", true);
				}
				m.animate("fadeIn", document.getElementById("list_of_role"));
				if(!dijit.byId("default_entity")){
					var displayMessage = m.getLocalization("mandatoryEntitySelection");
					displayMessage+= m.getLocalization("warningWithoutEntityCMSLOB");
					setTimeout(function(){
						m.dialog.show("CUSTOM-NO-CANCEL",displayMessage,"Info");
						}, 2000);
				}
			}
			else{
				if(dijit.byId("default_entity")){
					dijit.byId("default_entity").set("required", false);
					m.toggleRequired("default_entity", false);
				}
				m.animate("fadeOut", document.getElementById("list_of_role"));
				var defaultEntityArray = misys._config.defaultEntityArray;
				var defaultEntity = dijit.byId("default_entity");
				if(defaultEntityArray && selectedEntitiesList.length > 0) {
					for(var i=1; i<defaultEntityArray.length; i++)
					{
						if(!selectedEntitiesList.includes(defaultEntityArray[i].name))
						{
							var op = dojo.create("option");
							op.label = defaultEntityArray[i].name;
							op.value = defaultEntityArray[i].id;
							op.innerHTML = defaultEntityArray[i].name;
							op.innerText = defaultEntityArray[i].name;
							defaultEntity.store.root.options.add(op);
						}
					}
				}
				for(var j=1; j<=misys._config.entitlement.count; j++)
			 		{	
						if(dijit.byId("entitlement_id_nosend_".concat(j))) 
						{
							var entitlementId = dijit.byId("entitlement_id_nosend_".concat(j)).get('value');
							if(dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId).checked === true)
							{
									dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId).set("checked",false);
							}
						}
			 		}
			}
		},
		
		toggleDisplayRoles : function(/*Number*/position,/*String*/direction){
			
			var downArrow = d.byId("entity_roles_down_"+position);
			var upArrow = d.byId("entity_roles_up_"+position);
			if(direction === 'down')
			{
				if(d.style('entity_roles_div_'+position, "display") === "none" && m._config.displayMode==="view")
				{
				m.animate('wipeIn', 'entity_roles_div_'+position);
				d.style(downArrow, "display", "none");
				d.style(upArrow, "display", "inline");					
				}
				else if (d.style('entity_roles_div_'+position, "display") === "none" && dj.byId("entity_flag_nosend_"+position).get("checked"))
				{
					m.animate('wipeIn', 'entity_roles_div_'+position);
					d.style(downArrow, "display", "none");
					d.style(upArrow, "display", "inline");
				}	
			}
			else
			{
				if(d.style('entity_roles_div_'+position, "display") !== "none")
				{
					m.animate('wipeOut', 'entity_roles_div_'+position);
					d.style(upArrow, "display", "none");
					d.style(downArrow, "display", "inline");
				}	
			}
		},
		
		toggleDisplaySubsidiaries : function (/*String*/entitlementId,/*Boolean*/enableEntitlement,/*String[]*/subsidiaryIDListValue) {
			var subsidiaryIDValue;
			var defaultSubsidiary;
			if(subsidiaryIDListValue !== undefined && subsidiaryIDListValue.length > 0) {
				subsidiaryIDValue = subsidiaryIDListValue.substring(1,subsidiaryIDListValue.length-1);
			}
			var temp = new Array();
			if(subsidiaryIDValue) {
			temp = subsidiaryIDValue.split(',');
			for (var i=0 ; i < temp.length ; i++) {
				if(enableEntitlement)
				{
					m.animate('wipeIn', 'userSubsidiaryTable_'+entitlementId);
					if(temp[i].trim() !== "" && temp[i].trim() !== undefined) {
						if(dijit.byId("subsidiary_flag_nosend_".concat(temp[i].trim())))
						{
							dijit.byId("subsidiary_flag_nosend_".concat(temp[i].trim())).set("checked",true);
							dijit.byId("subsidiary_radio_flag_nosend_".concat(temp[i].trim())).set("checked",true);
							defaultSubsidiary = dijit.byId("subsidiary_code_nosend_".concat(temp[i].trim())).get("value");
							if (defaultSubsidiary === dijit.byId("default_subsidiary").get("value")) {
								dijit.byId("default_subsidiary").set("value",defaultSubsidiary);
							}
						}
					}
				} else {
					m.animate('wipeOut', 'userSubsidiaryTable_'+entitlementId);
					if(temp[i] !== "" && temp[i] !== undefined) {
						dijit.byId("subsidiary_flag_nosend_".concat(temp[i].trim())).set("checked",false);
						dijit.byId("subsidiary_radio_flag_nosend_".concat(temp[i].trim())).set("checked",false);
						dijit.byId("default_subsidiary").set("value","");
					}
				}
			}
		  }
			else {
			if(enableEntitlement)
				{
					m.animate('wipeIn', 'userSubsidiaryTable_'+entitlementId);
					if(subsidiaryIDValue !== "" && subsidiaryIDValue !== undefined) {
						if(dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue)))
						{
							dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue)).set("checked",true);
							dijit.byId("subsidiary_radio_flag_nosend_".concat(subsidiaryIDValue)).set("checked",true);
							defaultSubsidiary = dijit.byId("subsidiary_code_nosend_".concat(subsidiaryIDValue)).get("value");
							if (defaultSubsidiary === dijit.byId("default_subsidiary").get("value")) {
								dijit.byId("default_subsidiary").set("value",defaultSubsidiary);
							}
						}
					}
				} else {
					m.animate('wipeOut', 'userSubsidiaryTable_'+entitlementId);
					if(subsidiaryIDValue !== "" && subsidiaryIDValue !== undefined) {
						dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue)).set("checked",false);
						dijit.byId("subsidiary_radio_flag_nosend_".concat(subsidiaryIDValue)).set("checked",false);
						dijit.byId("default_subsidiary").set("value","");
					}
				}
		}
		},
		
		selectSubsidiary: function (/*Array*/subsidiaryID) {
			var subsidiaryIDValue = subsidiaryID.substring(1,subsidiaryID.length-1);
			if(dijit.byId("subsidiary_flag_nosend_".concat(subsidiaryIDValue))) {
					var subsidiaryIdField = dijit.byId("subsidiary_id_nosend_".concat(subsidiaryIDValue)).get("value");
					var subsidiaryId = "subsidiary_flag_nosend_".concat(subsidiaryIDValue);
					var subsidiaryCode = dijit.byId("subsidiary_code_nosend_".concat(subsidiaryIdField)).get("value");
					var subsidiaryIdSelected;
					var subsidiaryCodeSelected;
					var subsidiaryIdValSelected;
					if(dijit.byId("subsidiary_code").get("value") === subsidiaryCode)
					{
						dijit.byId(subsidiaryId).set("checked",true);
						subsidiaryIdSelected = subsidiaryId;
						subsidiaryCodeSelected = subsidiaryCode;
						subsidiaryIdValSelected = subsidiaryIdField;
						m.toggleRadioSubsidiary(subsidiaryIDValue,subsidiaryCodeSelected);
						
					}
				}	
		},
		
		toggleCheckBoxEntitlement : function (/*String*/entitlementId, /*String*/entitlementCode, /*String*/entitlementIdVal,/*Boolean*/enableSubsidiary,/*Array*/subsidiaryIDListValue){
			var arrayLength = entitlementIdList.length;
			var entitlementFlagList = [];
			var entitlementFlagEnable = false;
			for (var k = 0; k < arrayLength; k++)
			{
				var entitlementFlag = dijit.byId(entitlementIdList[k]).get("checked");
				entitlementFlagList.push(entitlementFlag);
			}
			if(entitlementFlagList.includes(true))
			{
				entitlementFlagEnable = true;
			}
			for (var i = 0; i < arrayLength; i++)
			{
				var entitlementCheck = dijit.byId(entitlementIdList[i]).get("checked");
				if(entitlementIdList[i] === entitlementId && entitlementCheck){
					dijit.byId(entitlementIdList[i]).set("checked", true);
					dijit.byId("entitlement_code").set("value",entitlementCode);
					if(enableSubsidiary)
					{
						m.toggleDisplaySubsidiaries(entitlementIdVal,true,subsidiaryIDListValue);
					}
				} else if (!entitlementCheck && !entitlementFlagEnable) {
					dijit.byId(entitlementIdList[i]).set("disabled", false);
					dijit.byId(entitlementIdList[i]).set("checked", false);
					if(enableSubsidiary)
					{
						m.toggleDisplaySubsidiaries(entitlementIdVal,false,subsidiaryIDListValue);
					}
				}else {
					dijit.byId(entitlementIdList[i]).set("disabled", true);
					dijit.byId(entitlementIdList[i]).set("checked", false);
				}
			}
		},

		toggleCheckBoxSubsidiary : function (/*String*/subsidiaryID, /*String*/subsidiaryCode, /*String*/entitlementCode, /*String*/entitlementID) {
			if(subsidiaryID !== undefined) {
				dijit.byId("subsidiary_id").set("value",subsidiaryID);
				subsidiaryIdList.push(subsidiaryID);
			}
			if(subsidiaryCode !== undefined) {
				dijit.byId("subsidiary_code").set("value",subsidiaryCode);
				subsidiaryCodeList.push(subsidiaryCode);
			}
			if(entitlementID !== undefined) {
				dijit.byId("entitlement_id").set("value",entitlementID);
			}
			if(entitlementCode !== undefined) {
				dijit.byId("entitlement_code").set("value",entitlementCode);
			}
		},
		
		toggleRadioSubsidiary : function (/*String*/subsidiaryID, /*String*/subsidiaryCode) {
			if(subsidiaryCode !== undefined){
				dijit.byId("default_role_template").set("value",subsidiaryCode);
				dijit.byId("subsidiary_radio_flag_nosend_".concat(subsidiaryID)).set("checked",true);
				subsidiaryCodeList.length = 0;
				entityList.length = 0;
				entityAbbvList.length = 0;
				subsidiaryIdList.length = 0;
				selectedEntitiesList = [];
				selectedEntitiesList.length = 0;
				if(dijit.byId("default_entity")){
					var defaultEntityValue = dijit.byId("default_entity").get("value");
				}
				var isDefaultEntitySameAsToggledSubsidiary = false;
				var count= dijit.byId("entitlement_subsidiary_count_"+subsidiaryID+"_1").get("value");
				for(var i=1; i<=count; i++) {
					var subCode = dijit.byId("subsidiary_code_fcm_nosend_"+subsidiaryID+"_".concat(i)).get("value");
					var subID = dijit.byId("subsidiary_id_nosend_"+subsidiaryID+"_".concat(i)).get("value");
					var entityName = dijit.byId("entity_name_"+subsidiaryID+"_".concat(i)).get("value");
					subsidiaryCodeList.push(subCode);
					entityList.push(entityName);
					subsidiaryIdList.push(subID);
					selectedEntitiesList.push(entityName);
					if(defaultEntityValue !== ""){
						if(dijit.byId("default_entity") && (entityName === dijit.byId("entity_name_nosend_".concat(defaultEntityValue)).get("value"))){
							isDefaultEntitySameAsToggledSubsidiary = true;
						}
					}
					for(var x=1;x<=misys._config.entity.count;x++){
							var entityId1 = dijit.byId("entity_id_nosend_".concat(x)).get("value");
		    	 			var entityName1 = dijit.byId("entity_name_nosend_".concat(entityId1)).get("value");
		    	 			if(entityName === entityName1){
		    	    	 		var entityAbbvName = dijit.byId("entity_abbv_name_nosend_".concat(entityId1)).get("value");
		    	    	 		entityAbbvList.push(entityAbbvName);
		    	 			}
					}
				}
				if(subsidiaryCodeList.length > 0) {
					dijit.byId("entitlement_id").set("value",subsidiaryID);
					dijit.byId("entitlement_code").set("value",subsidiaryCode);
					dijit.byId("subsidiary_code_List").set("value",subsidiaryCodeList);
				}
				if(entityList.length > 0) {
					dijit.byId("entity_List").set("value",entityList);
				}
				if(entityAbbvList.length > 0) {
					dijit.byId("entity_abbv_List").set("value",entityAbbvList);
				}
				if(subsidiaryIdList.length > 0) {
					dijit.byId("entitlement_id").set("value",subsidiaryID);
					dijit.byId("entitlement_code").set("value",subsidiaryCode);
					dijit.byId("subsidiary_id_List").set("value",subsidiaryIdList);
				}
				var defaultEntityArray = misys._config.defaultEntityArray;
				var defaultEntity = dijit.byId("default_entity");
				if(defaultEntityArray && selectedEntitiesList.length > 0) {
					for(var j=1; j<=misys._config.entity.count; j++){
						var entityId = dijit.byId("entity_id_nosend_".concat(j)).get('value');
						dijit.byId("entity_flag_nosend_"+entityId).set("readOnly",false);
					}
					if(!isDefaultEntitySameAsToggledSubsidiary){
						dijit.byId("default_entity").set("value","");
					}
					defaultEntity.store.root.options.length = 0;
					for(var k=1; k<defaultEntityArray.length; k++)
					{
						if(selectedEntitiesList.includes(defaultEntityArray[k].name))
						{
							var op = dojo.create("option");
							op.label = defaultEntityArray[k].name;
							op.value = defaultEntityArray[k].id;
							op.innerHTML = defaultEntityArray[k].name;
							op.innerText = defaultEntityArray[k].name;
							defaultEntity.store.root.options.add(op);
						}
					}
				}
			}
		},
		
		toggleAuthLevelSection : function(/* String */suffix, /* String */dir){
			   var downArrow = d.byId("auth_list_down_"+suffix);
			   var upArrow = d.byId("auth_list_up_"+suffix);
			   if(dir === 'down')
			   {
				   if(d.style('grp_rec_'+suffix, "display") === "none")
				   {
				     misys.animate('wipeIn', "grp_rec_"+suffix);
				     d.style(downArrow, "display", "none");
				     d.style(upArrow, "display", "inline");
				    }
			   }
			   else if (dir === 'up')
			   {
				   if(d.style('grp_rec_'+suffix, "display") !== "none")
				   {
					   misys.animate('wipeOut', "grp_rec_"+suffix);
					   d.style(upArrow, "display", "none");
					   d.style(downArrow, "display", "inline");
				   }
			   }
		},  
		
		addEntityMultiSelectItems : function( /*dijit._Widget*/ target,
				/*dijit._Widget*/ source,/*dijit._Widget*/roleIndicatorWidget,/*dijit._Widget*/roleAddedWidget) {
			//  summary:
			//        Move items from one multi-select to another
			
			var targetWidget = dijit.byId(target),
			sourceWidget = dijit.byId(source);
			
			targetWidget.addSelected(sourceWidget);
			
			// Have to call focus, otherwise sizing issues in Internet Explorer
			sourceWidget.focus();
			targetWidget.focus();
			roleIndicatorWidget.innerHTML = roleAddedWidget.get('value').length +" "+ misys.getLocalization("Role(s)");
			
		},
		
		//To make email field mandatory when pending tran notify flag is checked
		toggleEmail : function(){
			
			var pendingAuthNotify = dj.byId("pending_trans_notify");
			var emailRequired  = dj.byId("email_mandatory");
			if(emailRequired && emailRequired.get("value") === 'false')
			{
				if(pendingAuthNotify && pendingAuthNotify.get("checked"))
				{
					m.toggleRequired("email", true);
				}
				else
				{
					m.toggleRequired("email", false);
				}
			}
			else
			{
				if(emailRequired && emailRequired.get("value") === 'true')
				{
					m.toggleRequired("email", true);
				}
			}
		},
		
		onFormLoad : function(){
			d.forEach(new Array('bank', 'company'), function(authPrefix){
				for(var i = 1; dijit.byId(authPrefix + '_limit_cur_code_' + i); i++)
			    {
					m.setCurrency(dijit.byId(authPrefix + "_limit_cur_code_" + i), [authPrefix + "_limit_amt_" + i]);	
				}
			});
			if(dijit.byId("password_type_1") && dijit.byId("password_type_1").get("checked"))
			{
				dijit.byId("password_value").set("value",'');
				dijit.byId("password_confirm").set("value",'');
				dijit.byId("password_value").set("disabled",true);
				dijit.byId("password_confirm").set("disabled",true);
				dijit.byId("password_value").set("required",false);
				dijit.byId("password_confirm").set("required",false);
			}
			else if(dijit.byId("password_type_2") && dijit.byId("password_type_2").get("checked"))
			{
				dijit.byId("password_value").set("disabled",false);
				dijit.byId("password_confirm").set("disabled",false);
				dijit.byId("password_value").set("required",true);
				dijit.byId("password_confirm").set("required",true);
			}

			if(dijit.byId("default_entity"))
			{
				var defaultEntity = dijit.byId("default_entity").get("value");
				if(defaultEntity !== "")
				{
					dijit.byId("entity_flag_nosend_"+defaultEntity).set("checked",true);
					dijit.byId("entity_flag_nosend_"+defaultEntity).set("readOnly",true);
				}
				if (dijit.byId("external_lob") && (dijit.byId("external_lob").value === "01")){
					if (dijit.byId("default_entity")) {
						dijit.byId("default_entity").set("required", true);
						m.toggleRequired("default_entity", true);
					}
				}
				for(var k=1; k<=misys._config.entity.count; k++){
					var entityId = dijit.byId("entity_id_nosend_".concat(k)).get('value');
					dojo.byId("entity_roles_indicator_".concat(k)).innerHTML = dijit.byId("entity_roles_exist_nosend_".concat(entityId)).get('value').length +" "+ misys.getLocalization("Role(s)");

					if(dijit.byId("enity_flag_"+entityId).get("value") === "Y")
					{
						dijit.byId("entity_flag_nosend_"+entityId).set("checked",true);
					}
				}
			}
			if(dijit.byId("default_role_template") && dijit.byId("default_role_template").get("value") !== ""){
				var entitlementCode2 = dijit.byId("default_role_template").get("value");
				for(var x=1; x<=misys._config.entitlement.count; x++){
					
					if(dijit.byId("entitlement_id_nosend_".concat(x))) {
						var entitlementIdField1 = dijit.byId("entitlement_id_nosend_".concat(x)).get("value");
						var entitlementCode1 = dijit.byId("entitlement_code_nosend_".concat(entitlementIdField1)).get("value");
						if(entitlementCode2 === entitlementCode1){
							dijit.byId("subsidiary_radio_flag_nosend_".concat(entitlementIdField1)).set("checked",true);
							subsidiaryCodeList.length = 0;
							entityList.length = 0;
							entityAbbvList.length = 0;
							subsidiaryIdList.length = 0;
							var count= dijit.byId("entitlement_subsidiary_count_"+entitlementIdField1+"_1").get("value");
							for(var j=1; j<=count; j++) {
								var subCode = dijit.byId("subsidiary_code_fcm_nosend_"+entitlementIdField1+"_".concat(j)).get("value");
								var subID = dijit.byId("subsidiary_id_nosend_"+entitlementIdField1+"_".concat(j)).get("value");
								var entityName = dijit.byId("entity_name_"+entitlementIdField1+"_".concat(j)).get("value");
								subsidiaryCodeList.push(subCode);
								entityList.push(entityName);
								subsidiaryIdList.push(subID);
								for(var y=1;y<=misys._config.entity.count;y++){
									var entityId1 = dijit.byId("entity_id_nosend_".concat(y)).get("value");
				    	 			var entityName1 = dijit.byId("entity_name_nosend_".concat(entityId1)).get("value");
				    	 			if(entityName === entityName1){
				    	    	 		var entityAbbvName = dijit.byId("entity_abbv_name_nosend_".concat(entityId1)).get("value");
				    	    	 		entityAbbvList.push(entityAbbvName);
				    	 			}
								}
							}
							if(subsidiaryCodeList.length > 0) {
								dijit.byId("subsidiary_code_List").set("value",subsidiaryCodeList);
							}
							if(entityList.length > 0) {
								dijit.byId("entity_List").set("value",entityList);
							}
							if(entityAbbvList.length > 0) {
								dijit.byId("entity_abbv_List").set("value",entityAbbvList);
							}
							if(subsidiaryIdList.length > 0) {
								dijit.byId("subsidiary_id_List").set("value",subsidiaryIdList);
							}
							
						}
					}
				}
			}
			if (dijit.byId("external_lob") && (dijit.byId("external_lob").value === "" || dijit.byId('external_lob').value === "None")){
				m.animate("fadeOut", document.getElementById("list_of_role"));
				if(dijit.byId("default_entity")){
					dijit.byId("default_entity").set("required", false);
					m.toggleRequired("default_entity", false);
				}
				for(var i=1; i<=misys._config.entitlement.count; i++)
 		 		{	
 					if(dijit.byId("entitlement_id_nosend_".concat(i))) 
 					{
 						var entitlementId1 = dijit.byId("entitlement_id_nosend_".concat(i)).get('value');
 						if(dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId1) && dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId1).checked === true)
 						{
 							dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId1).set("checked",false);
 						}
 					}
 		 		}
			} else if (dijit.byId("external_lob") && (dijit.byId("external_lob").value === "01")){
				if(dijit.byId("default_entity")){
					dijit.byId("default_entity").set("required", true);
					m.toggleRequired("default_entity", true);
				}
			}
			m.toggleEmail();
		},
		
		beforeSaveValidations: function() {
			//var login_id = dijit.byId("login_id").get("value");
			//console.debug("login_id:",login_id);
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					if(dijit.byId('password_value')){dijit.byId('password_value').set('value', misys.encrypt(dijit.byId('password_value').get('value')));}
					if(dijit.byId('password_confirm')){dijit.byId('password_confirm').set('value', misys.encrypt(dijit.byId('password_confirm').get('value')));}
					return true; 
				}
				catch(error){
		     	/* show error to user */
					misys.dialog.show("ERROR", misys.getLocalization("passwordNotEncrypted"), "", function(){});
					return false;
				}
			}
			if(dijit.byId("login_id"))
			{
				var login_id = dijit.byId("login_id").get("value");
				console.debug("login_id:",login_id);
				
				if(!(login_id.length>0))
					{
						m._config.onSubmitErrorMsg = m.getLocalization("userLoginIdEmptyError");
						dijit.byId("login_id").focus();
						return false;
					}
				else
					{
						return true;
					}
			}
			else
			{
				return true;
			}
		},
		
		beforeSubmitValidations : function()
	     {
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				misys.encryptBeforeSubmit();
			}
			var valid = true;
	    	 if (dj.byId("company_limit_amt_1") && !isNaN(dj.byId("company_limit_amt_1").get("value")))
	    	 {
	    		 if (dj.byId("company_auth_level_1") && dj.byId("company_auth_level_1").get("value") === "")
	    			 {
		
		                m._config.onSubmitErrorMsg = m.getLocalization("Authorizationlevelrequriederror");
						console.debug("Authorization is necessary");
						valid =  false;
                     }
	    	}
	    	//MPS-21955
    	 	 if(dj.byId("legal_country") && dj.byId("legal_no") && dj.byId("legal_type"))
    		 {
		    	if(dj.byId("legal_country").get("value") !== "")
		    	{
		    		 if(dj.byId("legal_no").get("value") === "" || dj.byId("legal_type").get("value") === "")
		    		 {
		    		 	m._config.onSubmitErrorMsg = m.getLocalization("invalidIdNoFieldError");
						console.debug("Invalid Id No. field");
						valid =  false;
		    		 }
		    	 }
		    	if(dj.byId("legal_no").get("value") !== "")
		    	{
		    		 if(dj.byId("legal_country").get("value") === "" || dj.byId("legal_type").get("value") === "")
		    		 {
		    		 	m._config.onSubmitErrorMsg = m.getLocalization("invalidIdNoFieldError");
						console.debug("Invalid Id No. field");
						valid =  false;
		    		 }
		    	 }
		    	if(dj.byId("legal_type").get("value") !== "")
		    	{
		    		 if(dj.byId("legal_country").get("value") === "" || dj.byId("legal_type").get("value") === "")
		    		 {
		    		 	m._config.onSubmitErrorMsg = m.getLocalization("invalidIdNoFieldError");
						console.debug("Invalid Id No. field");
						valid =  false;
		    		 }
		    	 }
    		 }
    		 
    		 if (dijit.byId("external_lob") && dijit.byId("external_lob").value === "01"){
    			var checked1 = false;
 				var activeFlag1 = false;
 				for(var k=1; k<=misys._config.entitlement.count; k++)
 		 		{	
 					if(dijit.byId("entitlement_id_nosend_".concat(k))) 
 					{
 						var entitlementId1 = dijit.byId("entitlement_id_nosend_".concat(k)).get('value');
 						var activeFlagValue1 = dijit.byId("entitlement_valid_flag_nosend_"+entitlementId1).get("value");
 					
 						if(activeFlagValue1 === "Y" && dijit.byId("subsidiary_radio_flag_nosend_"+entitlementId1).checked === true  ) 
 							{
 								checked1 = true;
 								if(dijit.byId("default_entity")){
 								var isCMSRoleEntity = false;
 								var selectedEntities = [];
 								var count= dijit.byId("entitlement_subsidiary_count_"+entitlementId1+"_1").get("value");
 								var cmsRole = m.getLocalization("cashFcmEntityRole");
 								for(var j=1; j<=count; j++){
 									var subsidiaryCode = dijit.byId("subsidiary_code_nosend_"+entitlementId1+"_".concat(j)).get("value");
 		 							if(j === 1){
	 		 							for(var x=1;x<=misys._config.entity.count;x++){
		 									var entityId = dijit.byId("entity_id_nosend_".concat(x)).get("value");
	 		 			    	 			var entityName = dijit.byId("entity_name_nosend_".concat(entityId)).get("value");
	 		 			    	 			if(subsidiaryCode !== entityName && dijit.byId("entity_roles_exist_nosend_".concat(entityId))){
	 		 			    	 				var assignedRoles = dijit.byId("entity_roles_exist_nosend_".concat(entityId)).domNode.options;
	 		 			    	 				for(var y=0;y<assignedRoles.length;y++) {
	 		 			    	 					if(assignedRoles[y].value === cmsRole){
		 		 			    	 					selectedEntities.push(entityName);
		 		 			    	 					isCMSRoleEntity = true;
		 		 			    	 				}
	 		 			    	 				}
	 		 								}
	 		 							}
 		 							}
 		 							else{
 		 								if(selectedEntities.includes(subsidiaryCode)){
 		 									selectedEntities.splice(selectedEntities.indexOf(subsidiaryCode), 1);
 		 								}
 		 							}
 		 							// for FCM json default entity/client value
 	 								var defaultEntity = dijit.byId("default_entity").get("value");
 	 								var defaultEntityName = dijit.byId("entity_name_nosend_".concat(defaultEntity)).get("value");
 		 							if (subsidiaryCode === defaultEntityName){
 		 								var DefaultsubsidiaryCode = dijit.byId("subsidiary_code_fcm_nosend_"+entitlementId1+"_".concat(j)).get("value");
 		 								dijit.byId("default_subsidiary").set("value", DefaultsubsidiaryCode);
 		 							}
 		 						}
 								if(selectedEntities.length === 0){
 									isCMSRoleEntity = false;
 								}
 								}
 							}
 						if(dijit.byId("entitlement_valid_flag_nosend_"+entitlementId1) && activeFlagValue1 === 'Y') {
 							activeFlag1 = true;
 						}
 						if(isCMSRoleEntity === true && activeFlag1 === true) {
 							var errorMessage = m.getLocalization("entitiesNotLinkedToRoleTemplate");
 							errorMessage+= m.getLocalization("mandatoryAddCMSRole", [ selectedEntities ]);
 							m._config.onSubmitErrorMsg = errorMessage;
 								console.debug("CMS Role has to be selected for all selected entity for CMS");
 								valid =  false;
 						}	
 					}
 		 		}
 				if(checked1 === false && activeFlag1 === true) {
					m._config.onSubmitErrorMsg = m.getLocalization("mandatoryRoleTemplate");
						console.debug("Atleast one Role template has to be selected");
						valid =  false;
				}
    		 }
	    	 return valid;
	     },
	 	beforeSubmitEncryption: function (){
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					if(dijit.byId('password_value')){dijit.byId('password_value').set('value', misys.encrypt(dijit.byId('password_value').get('value')));}
					if(dijit.byId('password_confirm')){dijit.byId('password_confirm').set('value', misys.encrypt(dijit.byId('password_confirm').get('value')));}
					return true; 
				}
				catch(error){
		     	/* show error to user */
					misys.dialog.show("ERROR", misys.getLocalization("passwordNotEncrypted"), "", function(){});
					return false;
				}
			}
		}
	});
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : 'UP',
			         				subProductCode : '',
			        				transactionTypeCode : '01',
			        				entity : '',			        			
			        				currency : '',
			        				amount : '',
			        				
			        				es_field1 : '',
			        				es_field2 : ''
								  };
			return reAuthParams;
		},
	
		xmlTransform : function(/*String*/ xml) {

				var authPrefixList = new Array('bank_auth_level', 'company_auth_level'),
				
				multiSelects = new Array('company_role_list', 'bank_role_list'),
				
				staticTypeNode = "static_user_info",
				
				prefix = "", 
				
						
				// Setup the root of the XML string
				xmlRoot = m._config.xmlTagName,
				
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
				
				option = dj.byId("option").get("value"),
				
				entityTypeNode = 
					option === _customerPermissionsOption ? 
						_companyStaticTypeNode : _userStaticTypeNode,
				
				containerNode = "user_entity_record",
						
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml);
				
				// Push the entire XML into the new one
				transformedXml.push("<", staticTypeNode, ">");
				var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));
				transformedXml.push(subXML);
				transformedXml.push("</", staticTypeNode, ">");

				// 1. Retrieve the authorization levels
				d.forEach(authPrefixList, function(authPrefix){
					   for(var i = 1; dom.getElementsByTagName(authPrefix + '_' + i).length > 0; i++)
					   {
						   prefix = "bank";
						   if(authPrefix.indexOf("bank") === -1)
						   {
							   prefix = "company";
						   }
//						   transformedXml.push(_addGroupRecord(dom, prefix + "_auth_abbv_name_" + i, authPrefix+ "_" + i));

						   transformedXml.push(_addGroupRecord(dom, prefix + "_auth_abbv_name_" + i, 
								   authPrefix+ "_" + i, 
								   prefix + "_limit_cur_code_" + i, 
								   prefix + "_limit_amt_" + i));
					   }
				});
				//2. Retrieve the role list
				d.forEach(multiSelects, function(id){
					   if(dom.getElementsByTagName(id).length > 0)
					   {
						   var prefix = 'bank';
						   if(id.indexOf('bank') === -1)
						   {
							   prefix = 'company';
						   }
						   transformedXml.push(_addGroupRecord(dom, prefix  + '_group_abbv_name', id));
					   }
				});
				//3. Retrieve the entities list
				if(dj.byId("default_entity")){
					transformedXml.push("<user_entities_record>");
					transformedXml.push(m.getDomNode(dom, "brch_code"));
					transformedXml.push(m.getDomNode(dom, "company_id"));
					transformedXml.push(m.getDomNode(dom, "company_abbv_name"));
					transformedXml.push(m.getDomNode(dom, "login_id"));
					transformedXml.push(m.getDomNode(dom, "user_id"));
					
					// Format the role list
				    transformedXml.push(_addUserEntityRecords(m.getDomNode(dom, "user_id")));
					transformedXml.push("</user_entities_record>");
				}
				 // transformedXml.push(_addUserEntitlementRecords(m.getDomNode(dom, "user_id")));
				if(dj.byId("default_entity") === undefined && dijit.byId("default_role_template")){
					transformedXml.push(_addFCMUserEntityRecords(m.getDomNode(dom, "user_id")));
				}
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
			return transformedXml.join("");
		}
     });
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.user_mc_client');