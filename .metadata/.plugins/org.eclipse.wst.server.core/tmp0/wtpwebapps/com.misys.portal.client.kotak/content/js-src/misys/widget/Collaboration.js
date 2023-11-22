dojo.provide("misys.widget.Collaboration");

dojo.require("misys.widget.Dialog");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.layout.FloatingPane");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.grid._base");

// TODO This needs to be rebuilt as a proper widget, extending FloatingPane. Once done, 
// drop the "collaboration" from the function names below

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions & variables go here

	function _generateId(/*String*/ type) {
		// summary:
		//		TODO
		
		var lastId, id;
		
		// TODO Probably should find someway to avoid wrapping an XHR in a loop,
		//		even if in practice I think it will only ever be called once
		do {
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetTaskId"),
				sync : true,
				load : function(response, args){
					id = response;
				},
				error : function(response) {
					throw {
						name : "CollaborationError",
						message : "An error occurred when retrieving a Collaboration " + 
								  "task ID " + response
					};
				}
			});
			
			if(id === "false" || id === lastId) {
				// Something wrong if we return the same ID twice, could signal 
				// infinite loop. If id == "false", we also have a problem
				throw {
					name : "CollaborationError",
					message : "An error occurred when retrieving a Collaboration " + 
							  "task ID " + response
				};
			}
			lastId = id;
		} while(d.byId(type + "_row_" + id));
		
		return id;
	}
	
	function _addCollaborationItem( /*String*/ type, 
									/*String*/ id, 
									/*String*/postSave,
									/*Boolean*/ isTaskUpdate){
		//  summary:
	    //            Add an item to the task list.
		
		var publicTasks1  = dj.byId("public_task_details_assignee_type_nosend_1"),
			publicTasks2 = dj.byId("public_task_details_assignee_type_nosend_2"),
			publicTasks3 = dj.byId("public_task_details_assignee_type_nosend_3"),
			publicTasks4 = dj.byId("public_task_details_assignee_type_nosend_4"),
			xml;
		
		// This parameter is set to Y or N it allows the SaveTask portlet to know if this is 
		// post or pre save operation.
		postSave = postSave ? postSave : "N";
		type = type.toLowerCase();
		
		// Send the task to the server 
		// Extract transaction id
	    var tnxId = dj.byId("tnx_id"),
			refId = dj.byId("ref_id"),
			oldInpDttm = dj.byId("old_inp_dttm"),
			todoListId = dj.byId("todo_list_id").get("value"),
			taskInfo = [dj.byId("sentence_posted_by").get("value"), " ",
			            	dj.byId("sentence_you").get("value"), " "],
			taskType = "01",
			masterTaskList = d.byId(type + "_master_list"),
			hiddenFields, taskDescription, li, text;

		if(!tnxId || !refId || !oldInpDttm){
			m.dialog.show("ERROR", m.getLocalization("generalCollaborationError"));
			return false;
		}
		
		switch(type) {
		case "private_tasks":
			hiddenFields = _getPrivateTasksHiddenFields(id);
			taskDescription = dj.byId("private_description_nosend").get("value");
			break;
		case "public_tasks":
			hiddenFields = _getPublicTasksHiddenFields(id);
			taskType = "02";
			if(dj.byId("public_task_details_type_nosend_3").get("checked")) {
				taskType = "03";
			}
			taskDescription = dj.byId("public_task_details_description_nosend").get("value"); 
			break;
		default:
			hiddenFields = _getNotificationTasksHiddenFields(id);
			taskType = "03";
			taskInfo.push(dj.byId("sentence_to").get("value"), " ");
			taskInfo.push(dj.byId("notification_task_details_other_user_assignee_login_id_nosend").get("value"), " ");
			taskDescription = dj.byId("notification_description_nosend").get("value");
			break;
		}

		var container;
		if (d.byId(id + "_container"))
		{
			container = d.byId(id + "_container");
		}
		else
		{
			container = d.create("div", {
				id : id + "_container"
			});
		}
			
		// Add custom hidden fields
		hiddenFields.push({
	    	name : "task_id",
	    	id : "task_id_" + id,
	    	value : id
	    },
	    {
	    	name : "tnx_id",
	    	id : "tnx_id_" + id,
	    	value : tnxId.get("value")
	    },
	    {
	    	name : "ref_id",
	    	id : "ref_id_" + id,
	    	value : refId.get("value")
	    },
	    {
	    	name : "todo_list_id",
	    	id : "todo_list_id_" + id,
	    	value : todoListId
	    },
	    {
	    	name : "old_inp_dttm",
	    	id : "old_inp_dttm_" + id,
	    	value : oldInpDttm.get("value")
	    },
	    {
	    	name : "postSave",
	    	id : "postSave_" + id,
	    	value : postSave
	    });

		if (isTaskUpdate)
		{
			// In case of update, destroy hidden fields first
			d.forEach(hiddenFields, function(hiddenField){
				if (dj.byId(hiddenField.id || hiddenField.name))
				{
					dj.byId(hiddenField.id || hiddenField.name).destroy();
				}
			});
		}
		d.forEach(hiddenFields, function(hiddenField){
			new dj.form.TextBox({
				id : hiddenField.id || hiddenField.name,
				name : hiddenField.name,
				readOnly : true,
				value : hiddenField.value,
				type : "hidden"
			}).placeAt(container);
		});
		
		//if (!isTaskUpdate)
		//{
			dojo.place(container, dojo.byId(type + "_form"));
		//}
		
		// Build up the XML to send
		xml = m.formToXML({selector: "#" + type + "_form", xmlRoot : type, ignoreDisabled : true});	
		
		// Retrieve the elements of the form
		//xmlString.push("<task_id>", id, "</task_id>");
		//xmlString.push("<tnx_id>", tnxId.value, "</tnx_id>");
		//xmlString.push("<ref_id>", refId.value, "</ref_id>");
		//xmlString.push("<todo_list_id>", todoListId, "</todo_list_id>");
		//xmlString.push("<old_inp_dttm>", oldInpDttm.value, "</old_inp_dttm>");
		//xmlString.push("<postSave>", postSave, "</postSave>");
		//xmlString.push("</", type, ">");
		
		console.debug("[Collaboration] Adding Collaboration Task - Request XML", xml);	
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/SaveTask"),
			content: {xml_string : xml}
		});
		
		
		console.debug("[Collaboration] Adding Collaboration Task, TodoList ID", todoListId);
		
		if(taskType === "03") {
			taskInfo.push(dj.byId("sentence_to").get("value"), " ");
	
			if(publicTasks1 && publicTasks1.get("checked")){
				taskInfo.push(dj.byId("public_task_details_other_user_assignee_login_id_nosend").get("value"), " ");
			}
			else if(publicTasks2 && publicTasks2.get("checked")) {
				taskInfo.push(dj.byId("public_task_details_bank_assignee_name_nosend").get("value"), " ");
				taskInfo.push(dj.byId("public_task_details_bank_assignee_abbv_name_nosend").get("value"), " ");
			}
			else if(publicTasks3 && publicTasks3.get("checked")) {
				taskInfo.push(dj.byId("public_task_details_counterparty_assignee_name_nosend").get("value"), " ");
				taskInfo.push(dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend").get("value"), " ");
			}
			else if(publicTasks4 && publicTasks4.get("checked")) {
				taskInfo.push(dj.byId("public_details_bank_other_user_assignee_first_name_nosend").get("value"), " ");
				taskInfo.push(dj.byId("public_details_bank_other_user_assignee_last_name_nosend").get("value"), " ");
			}
		}
		
		// 2. Set the list to visible, if we have to
		if(d.style(masterTaskList, "display") === "none" ||
				d.style(masterTaskList, "opacity") === 0){
			d.style(masterTaskList, "opacity", 0);
			m.animate("fadeIn", masterTaskList);
		}
		
		// TODO This really should be refactored as d.create
		text =
			["<label for='", type, "_dismiss_", id, "' id='", type, "_dismiss_", id, "_label'>" , 
				"<span id='", type, "_desc_", id,  "'>", m.grid.sanitizeHTMLDataForUI(taskDescription), "</span></label>" , 
				"<span class='taskInfo'>", taskInfo.join(""), "</span>", 
				"<span class='commentInfo' id='", "task_edit_", id, "'>", " | ", 
				"<a href=\"javascript:void(0)\" onClick=\"misys.openTaskForUpdate(", id, ")\">",m.getLocalization("Edit"),"</a></span>", 				
				"<span class='commentInfo'>" , " | ",
				"<a href=\"javascript:void(0)\" onClick=\"misys.openCollaborationComment('", type, 
				"',", id, ")\">",m.getLocalization("comments")," (<span id=\"", type, 
				"_comment_count_", id, "\">0</span>)</a></span>"];

		if (!isTaskUpdate)
		{
			li = d.create("li",{
				id: type + "_item_" + id,
				style: "display:none;opacity:0",
				innerHTML: text.join("")
			}, masterTaskList);
		}
		else
		{
			dj.byId(type + "_dismiss_" + id).destroy();
			li = d.byId(type + "_item_" + id);
			li.innerHTML = text.join("");
		}
			
		new dj.form.CheckBox({
			id: type + "_dismiss_" + id,
			name: type + "_dismiss_" + id,
			onClick: function(){
				m.finishCollaborationTask(this, type, id);
			}
		}).placeAt(type+"_dismiss_"+id+"_label", "first");
			
		// 5. Add an empty hidden list, for comments
		if (!isTaskUpdate)
		{
			var ol = d.create("ol", {
				id: type + "_comments_" + id,
				style: "display:none"
			}, type + "_comment_fields", "first");
			d.addClass(ol, "comment-list");
		}
			
		// 7. Show the row
		m.animate("fadeIn", li, function(){
			// 8. Hide the notice
			d.style(d.byId(type + "_notice"), "display", "none");
		});
		
		// Destroy the hidden fields container
		d.forEach(dijit.findWidgets(container), function(w){
			if(w) {
				w.destroyRecursive();
			}
		});
		//d.destroy(container);

		return true;
	}
	
	function _checkEntityForCollaboration() {
		// summary:
		//		TODO
		
		var entityObj = dj.byId("entity");
		if(entityObj && !entityObj.get("value")){
			m.dialog.show("ERROR", m.getLocalization("mandatoryEntityMessage"));
			return false;
		}

		return true;
	}
	
	function _toggleAssigneeRadioButtons() {
		//  summary:
	    //            Display the Assignee Radio Buttons
		
		var publicTaskAssigneeType1 = dj.byId("public_task_details_assignee_type_nosend_1"),
			publicTaskAssigneeType2 = dj.byId("public_task_details_assignee_type_nosend_2"),
			publicTaskAssigneeType3 = dj.byId("public_task_details_assignee_type_nosend_3"),
			publicTaskDetailsType3 = dj.byId("public_task_details_type_nosend_3"),
			isPublicChecked = (publicTaskDetailsType3) ? 
					publicTaskDetailsType3.get("checked") : false,
			assigneeTypeFields = d.byId("assigneeTypeFields");
		
		m.toggleFields(isPublicChecked, 
				["public_task_details_assignee_type_nosend_1", 
				 "public_task_details_assignee_type_nosend_2", 
				 "public_task_details_assignee_type_nosend_3", 
				 "public_task_details_assignee_type_nosend_4"]);
		
		// Provide a hook to modify the assignee type radio buttons before display
		if(isPublicChecked)
		{
			var assigneeTypes = [
			                          {
			                        	  id : "public_task_details_assignee_type_nosend_1",
			                        	  description: "user_to_user"
			                          },
			                          {
			                        	  id : "public_task_details_assignee_type_nosend_2",
			                        	  description: "user_to_bank"
			                          },
			                          {
			                        	  id : "public_task_details_assignee_type_nosend_3",
			                        	  description: "counterparty"
			                          },
			                          {
			                        	  id : "public_task_details_assignee_type_nosend_4",
			                        	  description: "bank"
			                          }
		                        ];
			m.preDisplayAssigneeType = m.preDisplayAssigneeType || function(){ return true; };
			m.preDisplayAssigneeType(assigneeTypes);
		}	
		
		if(isPublicChecked) { 
			m.animate("fadeIn", assigneeTypeFields, function(){
				_toggleFieldsByPermissions();
				_toggleAssigneeType();
				_checkEntityForCollaboration();
			}, false, {duration: 20});
		} else {
			m.animate("fadeOut", assigneeTypeFields, function(){
				if (publicTaskAssigneeType1) {
					publicTaskAssigneeType1.set("checked", false);
				}
				if (publicTaskAssigneeType2) {
					publicTaskAssigneeType2.set("checked", false);
				}
				if (publicTaskAssigneeType3) {
					publicTaskAssigneeType3.set("checked", false);
				}
				_toggleAssigneeType();
			}, false, {duration: 20});
		}
	}
	
	function _toggleAssigneeType() {
		//  summary:
	    //            Display the assignee type
		
		var isAssignee1Checked = dj.byId("public_task_details_assignee_type_nosend_1") ?
				dj.byId("public_task_details_assignee_type_nosend_1").get("checked") : false,
			isAssignee2Checked = dj.byId("public_task_details_assignee_type_nosend_2") ?
					dj.byId("public_task_details_assignee_type_nosend_2").get("checked") : false,
			isAssignee3Checked = dj.byId("public_task_details_assignee_type_nosend_3") ?
					dj.byId("public_task_details_assignee_type_nosend_3").get("checked") : false,
			isAssignee4Checked = dj.byId("public_task_details_assignee_type_nosend_4") ?
				dj.byId("public_task_details_assignee_type_nosend_4").get("checked") : false,
			notifyBankFields = d.byId("notifyBankFields"),
			notifyUserFields = d.byId("notifyUserFields"),
			notifyCounterpartyFields = d.byId("notifyCounterpartyFields"),
			bankAssigneeTasks = d.byId("bankAssigneeTasks");
	    
		m.toggleFields(isAssignee1Checked, 
				null, ["public_task_details_other_user_assignee_login_id_nosend"]);
		m.toggleFields(isAssignee2Checked, 
				null, ["public_task_details_bank_assignee_name_nosend"], true, true);
		m.toggleFields(isAssignee3Checked, null,
					["public_task_details_counterparty_assignee_name_nosend"], true, true);
		m.toggleFields(isAssignee4Checked, null, 
				["public_task_details_bank_other_user_assignee_login_id_nosend", 
				 "public_task_details_bank_other_user_assignee_email_nosend"], true, true);
		
		dj.byId("public_task_details_other_user_assignee_login_id_nosend").set("readonly", true);
		dj.byId("public_task_details_other_user_assignee_login_id_nosend").set("disabled", true);
		
		m.animate("fadeOut", [notifyBankFields, notifyUserFields, notifyCounterpartyFields], function(){
			if(isAssignee1Checked){
				m.animate("fadeIn", notifyUserFields);
			} else if (isAssignee2Checked){
				m.animate("fadeIn", notifyBankFields, function (){
					var checked = dj.byId("public_task_details_assignee_type_nosend_2").get("checked");
					console.log("Bank field is selected : "+checked);
					if(checked){
						dj.byId("public_task_details_bank_assignee_name_nosend").set("readonly", true);
						dj.byId("public_task_details_bank_assignee_name_nosend").set("disabled", true);
					}
			}, false, {duration: 1});
		
			} else if(isAssignee3Checked) {
				m.animate("fadeIn", notifyCounterpartyFields);
				
				var accessOpened = dj.byId("access_opened"),
				collaborationCounterparty = dj.byId("public_task_details_counterparty_assignee_name_nosend"),
				//collaborationCounterpartyLookup =  dj.byId("public_task_details_counterparty_assignee_name_nosend_img"),				
				productCode= dj.byId("product_code").get('value'),
				counterpartyName=null,
				counterpartyHiddenEmail = dj.byId("counterparty_email_id_hidden"),
				collaborationCounterpartyAbbvName = dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend");
				
				if(productCode && (productCode ==="IP" || productCode ==="CR"))
				{
					counterpartyName = dj.byId("seller_name")? dj.byId("seller_name"):dj.byId("seller_abbv_name");
				}
				else if (productCode && (productCode ==="IN" || productCode ==="CN"))
				{
					counterpartyName = dj.byId("buyer_name")?dj.byId("buyer_name"):dj.byId("buyer_abbv_name");
				}
				if(accessOpened && counterpartyName)
				{
					if(counterpartyName.get('value')!=="")
					{
						if (accessOpened.get("value") === 'Y')
						{
							collaborationCounterparty.set('value',counterpartyName.get('value'));
							counterpartyHiddenEmail.set('value',dj.byId('transaction_counterparty_email').get('value'));
							collaborationCounterpartyAbbvName.set('value',dj.byId('ben_company_abbv_name').get('value'));
							//collaborationCounterpartyLookup.set('disabled',true);
						}
						else
						{
							collaborationCounterparty.set('value',"");
							collaborationCounterpartyAbbvName.set("value", "");
							m.dialog.show("ERROR", m.getLocalization("errorCounterpartyCollaborationNotEnabled"));
							m.animate("fadeOut", notifyCounterpartyFields);
						}
					}
					else
					{
						collaborationCounterparty.set('value',"");
						collaborationCounterpartyAbbvName.set("value", "");
						m.dialog.show("ERROR", m.getLocalization("errorSelectCounterpartyCollaboration"));
						m.animate("fadeOut", notifyCounterpartyFields);
					}
				}
				
			} else if(isAssignee4Checked) {
				m.animate("fadeIn", bankAssigneeTasks);
			}
			
			_getCollaborationBankName();
			_resetCollaborationFields();
		}, false, {duration: 20});
	}
	
	function _getPublicTasksMandatoryFields() {
		//  summary: 
	    //      Get mandatory public task fields
		
		var mandatoryFields = [{
		      name : "public_task_details_description_nosend",
		      value : ""
		}];

    	if(dj.byId("public_task_details_email_notification_nosend").get("checked")) {
    		mandatoryFields.push({
    			name : "public_task_details_email_nosend",
    			value :""
    		});
    	}
		                	
    	if(dj.byId("public_task_details_assignee_type_nosend_1").get("checked")) {
    		mandatoryFields.push({
    			name : "public_task_details_other_user_assignee_login_id_nosend",
    			value :""
    		});
    	}
		                	
    	if(dj.byId("public_task_details_assignee_type_nosend_2") &&
    			dj.byId("public_task_details_assignee_type_nosend_2").get("checked")) {
    		mandatoryFields.push({
    			name :"public_task_details_bank_assignee_name_nosend",
    			value :""
    		});
    	}
		                	
    	if(dj.byId("public_task_details_assignee_type_nosend_3") &&
    			dj.byId("public_task_details_assignee_type_nosend_3").get("checked")) {
    		mandatoryFields.push({
    			name : "public_task_details_counterparty_assignee_name_nosend",
    			value :""
    		});
    		
    		if(dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").get("checked")) {
    			mandatoryFields.push({
    				name :"public_task_details_counterparty_assignee_email_nosend",
    				value :""
    			});
    		}
    	}
		                	
    	if(dj.byId("public_task_details_assignee_type_nosend_4") &&
    			dj.byId("public_task_details_assignee_type_nosend_4").get("checked")) {
    		mandatoryFields.push({
    			name :"public_task_details_bank_other_user_assignee_login_id_nosend",
    			value :""
    		});
    		
    		if(dj.byId("public_task_details_bank_other_user_assignee_email_notification_nosend").get("checked")) {
    			mandatoryFields.push({
    				name :"public_task_details_bank_other_user_assignee_email_nosend",
    				value :""
    			});
    		}
    	}

		return mandatoryFields;
	}
	
	function _getNotificationTasksMandatoryFields() {
		var mandatoryFields = [{
			name : "notification_task_details_other_user_assignee_login_id_nosend",
		    value : ""
		},
		{
		    name : "notification_description_nosend",
		    value : ""
		}];

		if(dj.byId("notification_task_details_email_notification_nosend").get("checked")) {
			mandatoryFields.push({
				name :"notification_task_details_email_nosend",
				value : ""
			});
		}
		
		return mandatoryFields;
	}
	
	function _getPrivateTasksMandatoryFields() {
		return [{
		    name : "private_description_nosend",
		    value : ""
		}];
	}
	
	function _getPublicTasksHiddenFields(/*String*/ id) {
		//  summary: 
		//		Get hidden fields for public tasks
		
		var emailNotification = "N",
			taskType = "02",
			counterpartyEmailNotification = "N",
			otherUserEmailNotification = "N",
			bankEmailNotification = "N",
			assigneeType;

		if(dj.byId("public_task_details_email_notification_nosend") &&
				dj.byId("public_task_details_email_notification_nosend").get("checked")) {
			emailNotification = "Y";
		}
		
		if(dj.byId("public_task_details_type_nosend_3") &&
				dj.byId("public_task_details_type_nosend_3").get("checked")) {
			taskType = "03";
		}
		
		if(dj.byId("public_task_details_counterparty_assignee_email_notification_nosend") &&
				dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").get("checked")) {
			counterpartyEmailNotification = "Y";
		}
		
		if(dj.byId("public_task_details_other_user_assignee_email_notification_nosend") &&
				dj.byId("public_task_details_other_user_assignee_email_notification_nosend").get("checked")) {
			otherUserEmailNotification = "Y";
		}
		
		if(dj.byId("public_task_details_assignee_type_nosend_1") &&
				dj.byId("public_task_details_assignee_type_nosend_1").get("checked")) {
			assigneeType = "01";
		
		}
		else if(dj.byId("public_task_details_assignee_type_nosend_2") &&
				dj.byId("public_task_details_assignee_type_nosend_2").get("checked")) {
			assigneeType = "02";
		}
		else if(dj.byId("public_task_details_assignee_type_nosend_3") &&
				dj.byId("public_task_details_assignee_type_nosend_3").get("checked")) {
			assigneeType = "03";
		}
		else if(dj.byId("public_task_details_assignee_type_nosend_4") &&
				dj.byId("public_task_details_assignee_type_nosend_4").get("checked")) {
			assigneeType = "04";
		}
		
		if(dj.byId("public_task_details_bank_assignee_email_notification_nosend") &&
				dj.byId("public_task_details_bank_assignee_email_notification_nosend").get("checked")) {
			bankEmailNotification = "Y";
		}
		
		var hiddenFields = [
			{
				name : "public_task_details_task_id_" + id,
				value : id
			},
			{
				name : "public_task_details_issue_user_id_" + id,
				value : dj.byId("connected_user_id").get("value")
			},
			{
				name :"public_task_details_issue_company_abbv_name_" + id,
				value : dj.byId("connected_company_abbv_name").get("value")
			},
			{
				name : "public_task_details_description_" + id,
				value : dj.byId("public_task_details_description_nosend").get("value")
			},
			{
				name :"public_task_details_email_notification_" + id,
				value : emailNotification
			},
			{
				name : "public_task_details_email_" + id,
				value : dj.byId("public_task_details_email_nosend").get("value")
			}, 
			{
				name : "public_task_details_type_" + id,
				id : "",
				value : taskType
			}, 
			{
				name : "public_task_details_assignee_type_" + id,
				id : "",
				value : assigneeType
			},
			{
				name : "public_task_details_counterparty_assignee_name_" + id,
				value : dj.byId("public_task_details_counterparty_assignee_name_nosend").get("value")
			},
			{
				name : "public_task_details_counterparty_assignee_abbv_name_" + id,
				value : dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend").get("value")
			},
			{
				name : "public_task_details_counterparty_assignee_email_notification_" + id,
				value : counterpartyEmailNotification
			},
			{
				name : "public_task_details_counterparty_assignee_email_" + id,
				value : dj.byId("public_task_details_counterparty_assignee_email_nosend").get("value")
			},
			{
				name : "public_task_details_other_user_assignee_login_id_" + id,
				value : dj.byId("public_task_details_other_user_assignee_login_id_nosend").get("value")
			},
			{
				name :"public_task_details_other_user_assignee_user_id_" + id,
				value : dj.byId("public_task_details_other_user_assignee_user_id_nosend").get("value")
			},
			{
				name : "public_task_details_other_user_assignee_email_notification_" + id,
				value : otherUserEmailNotification
			},
			{
				name :"public_task_details_other_user_assignee_email_" + id,
				value :dj.byId("public_task_details_other_user_assignee_email_nosend").get("value")
			},
			{
				name :"public_task_details_bank_assignee_name_" + id,
				value : dj.byId("public_task_details_bank_assignee_name_nosend").get("value")
			},
			{
				name :"public_task_details_bank_assignee_abbv_name_" + id,
				value : dj.byId("public_task_details_bank_assignee_abbv_name_nosend").get("value")
			},
			{
				name : "public_task_details_bank_assignee_email_notification_" + id,
				value : bankEmailNotification
			},
			{
				name : "public_tasks_details_issue_date_" + id,
				value : ""
			},
			{
				name:"public_tasks_details_bank_other_user_assignee_user_id_" + id,
				value: ""//dj.byId("connected_user_id").get("value")
			}
		];
		
		if(assigneeType == "04")
		{
			hiddenFields.push( {
				name :"public_task_details_bank_other_user_assignee_login_id_" + id,
				value :dj.byId("public_task_details_bank_other_user_assignee_login_id_nosend").get("value")
			});
			
			var bankOtherEmailNotification = "N";
			if(dj.byId("public_task_details_bank_other_user_assignee_email_notification_nosend") &&
					dj.byId("public_task_details_bank_other_user_assignee_email_notification_nosend").get("checked")) {
				bankOtherEmailNotification = "Y";
			}
			
			hiddenFields.push( {
				name : "public_task_details_bank_other_user_assignee_email_notification_" + id,
				value : bankOtherEmailNotification
			});
			hiddenFields.push( {
				name : "public_task_details_bank_other_user_assignee_email_" + id,
				value : dj.byId("public_task_details_bank_other_user_assignee_email_nosend").get("value")
			});
		}
		
		return hiddenFields;
	}
	
	function _getNotificationTasksHiddenFields( /*String*/ id) {
		var emailNotification = "N",
			assigneeType = "01",
			taskType = "03";
		
		if(dj.byId("notification_task_details_email_notification_nosend") &&
				dj.byId("notification_task_details_email_notification_nosend").get("checked")) {
			emailNotification = "Y";
		}

		var hiddenFields = [
			{
				name : "public_task_details_task_id_" + id,
				id : "",
				value : id
			},
			{
				name : "public_task_details_issue_user_id_" + id,
				id : "",
				value : dj.byId("connected_user_id").get("value")
			},
			{
				name :"public_task_details_issue_company_abbv_name_" + id,
				id : "",
				value :dj.byId("connected_company_abbv_name").get("value")
			},
			{
				name :"public_task_details_description_" + id,
				id : "public_task_details_description_nosend",
				value : dj.byId("notification_description_nosend").get("value")
			},
			{
				name :"public_task_details_email_notification_" + id,
				id : "",
				value : emailNotification
			},
			{
				name :"public_task_details_email_" + id,
				id : "public_task_details_email_nosend",
				value :dj.byId("notification_task_details_email_nosend").get("value")
			}, 
			{
				name :"public_task_details_type_" + id,
				id : "",
				value :taskType
			}, 
			{
				name :"public_task_details_assignee_type_" + id,
				id : "",
				value :assigneeType
			},
			{
				name :"public_task_details_other_user_assignee_login_id_" + id,
				id : "public_task_details_other_user_assignee_login_id_nosend",
				value : dj.byId("notification_task_details_other_user_assignee_login_id_nosend").get("value")
			},
			{
				name :"public_tasks_details_issue_date_" + id,
				id : "",
				value : ""
			},
			{
				name:"public_tasks_details_bank_other_user_assignee_user_id_" + id,
				id: "public_tasks_details_bank_other_user_assignee_user_id_nosend",
				value: dj.byId("notification_task_details_other_user_assignee_user_id_nosend").get("value")
			}
		];
		
		return hiddenFields;
	}
	
	function _getPrivateTasksHiddenFields(/*String*/ id) {
		var taskType = "01";

		var hiddenFields = [
			{
				name :"private_task_details_task_id_" + id,
				id : "",
				value : id
			},
			{
				name :"public_tasks_details_issue_date_" + id,
				id : "",
				value : ""
			},
			{
				name :"private_task_details_issue_user_id_" + id,
				id : "",
				value : dj.byId("connected_user_id").get("value")
			},
			{
				name :"private_task_details_issue_company_abbv_name_" + id,
				id : "",
				value : dj.byId("connected_company_abbv_name").get("value")
			},
			{
				name :"private_task_details_description_" + id,
				id : "private_task_details_description_nosend",
				value : dj.byId("private_description_nosend").get("value")
			},
			{
				name :"public_task_details_type_" + id,
				id : "",
				value :taskType
			}
		];
		
		return hiddenFields;
	}

	function _toggleFieldsByPermissions() {
		// summary:
		//	To enable and hide or show based on the permission to the user
		
		var publicTaskAssigneeType1 = dj.byId("public_task_details_assignee_type_nosend_1"),
			publicTaskAssigneeType2 = dj.byId("public_task_details_assignee_type_nosend_2"),
			publicTaskAssigneeType3 = dj.byId("public_task_details_assignee_type_nosend_3");
		
		if(!publicTaskAssigneeType1) {
			publicTaskAssigneeType1.set("checked", false);

			if(publicTaskAssigneeType2) {
				publicTaskAssigneeType2.set("checked", true);
				publicTaskAssigneeType1.set("checked", false);
				if (publicTaskAssigneeType3) {
					publicTaskAssigneeType3.set("checked", false);
				}
			}
			else  {

				if(publicTaskAssigneeType3) {
					publicTaskAssigneeType3.set("checked", true);
					publicTaskAssigneeType1.set("checked", false);
				} else {
					publicTaskAssigneeType1.set("checked", false);
				}
			}
		} else {
			publicTaskAssigneeType1.set("checked", true);
			if (publicTaskAssigneeType2) {
				publicTaskAssigneeType2.set("checked", false);
			}
			if (publicTaskAssigneeType3) {
				publicTaskAssigneeType3.set("checked", false);
			}
		}
	}
	
	function _handleEmails( /*dj._widget*/ checkBoxWidget, 
							/*String*/emailWidgetId,
							/*String*/ emailContainingWidgetId,
							/*String*/ emailHiddenWidgetId) {
		// summary:
		//		To fadeout and fadeIn Email Input based on notification 
		
		var email = dj.byId(emailHiddenWidgetId).get("value");
		if(dj.byId(checkBoxWidget).get("checked")) {
		   m.animate("fadeIn", d.byId(emailContainingWidgetId), function(){
			   if(email) {
				   dj.byId(emailWidgetId).set("value", email);
				   dj.byId(emailWidgetId).set("readonly", true);
				   dj.byId(emailWidgetId).set("disabled", true);
			   }
		   }, false, {duration: 20});
		   
		}
		else
		{
		   m.animate("fadeOut", emailContainingWidgetId, function(){
			   dj.byId(emailWidgetId).set("value", "");
		   }, false, {duration: 20});
		}
	}
	
	function _getCollaborationBankName(){
		var bankAbbvNameFieldId,
			bankAbbvName,
			bankNameFieldId,
			bankName;
			
		if(dj.byId("public_task_details_assignee_type_nosend_2") && dj.byId("public_task_details_assignee_type_nosend_2").get("checked")) {
			if(dj.byId("bank_abbv_name_widget_id_hidden") && 
					dj.byId("bank_name_widget_id_hidden")) {
				bankAbbvNameFieldId = dj.byId("bank_abbv_name_widget_id_hidden").get("value");
				bankNameFieldId = dj.byId("bank_name_widget_id_hidden").get("value");
					
				if(dj.byId(bankAbbvNameFieldId)){
					bankAbbvName = dj.byId(bankAbbvNameFieldId);
					dj.byId(
							"public_task_details_bank_assignee_abbv_name_nosend").set("value", bankAbbvName.get("value"));
				}
				if(dj.byId(bankNameFieldId)) {
					bankName = dj.byId(bankNameFieldId);
					dj.byId(
								"public_task_details_bank_assignee_name_nosend").set("value", bankName.get("value"));
				}
			}
		} else {
			dj.byId("public_task_details_bank_assignee_name_nosend").set("value", "");
			dj.byId("public_task_details_bank_assignee_abbv_name_nosend").set("value", "");
		}
	}
	
	function _resetCollaborationFields(){
		// summary:
		//		TODO
			
		var publicTask = dj.byId("public_task_details_type_nosend_2"),
			assigneeTask = dj.byId("public_task_details_type_nosend_3"),
			publicTaskAssigneeType1 = dj.byId("public_task_details_assignee_type_nosend_1"),
			publicTaskAssigneeType2 = dj.byId("public_task_details_assignee_type_nosend_2"),
			publicTaskAssigneeType3 = dj.byId("public_task_details_assignee_type_nosend_3");
			
		if(publicTask.get("checked")) {
			m.animate("fadeOut", 
					[d.byId("counterparty_email_input_field_div"), 
							d.byId("other_user_email_input_field_div")], function(){
				dj.byId("public_task_details_other_user_assignee_login_id_nosend").reset();
				dj.byId("public_task_details_other_user_assignee_email_notification_nosend").set("checked", false);
				dj.byId("other_user_email_id_hidden").reset();
				dj.byId("public_task_details_other_user_assignee_user_id_nosend").reset();
				dj.byId("public_task_details_other_user_assignee_email_nosend").reset();
				dj.byId("public_task_details_counterparty_assignee_name_nosend").reset();
				dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend").reset();
				dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").set("checked", false);
				dj.byId("counterparty_email_id_hidden").reset();
				dj.byId("public_task_details_counterparty_assignee_email_nosend").reset();
				dj.byId("public_task_details_bank_assignee_email_notification_nosend").set("checked", false);
				dj.byId("public_task_details_bank_assignee_name_nosend").reset();
			}, false, {duration: 20});
		} else {
			if(publicTaskAssigneeType1 && !publicTaskAssigneeType1.get("checked")) {
				m.animate("fadeOut", d.byId("other_user_email_input_field_div"), function(){
					dj.byId("public_task_details_other_user_assignee_login_id_nosend").reset();
					dj.byId("public_task_details_other_user_assignee_email_notification_nosend").set("checked", false);
					dj.byId("public_task_details_other_user_assignee_user_id_nosend").reset();
					dj.byId("other_user_email_id_hidden").reset();
					dj.byId("public_task_details_other_user_assignee_email_nosend").reset();
				});
			}
			if(publicTaskAssigneeType2 && !publicTaskAssigneeType2.get("checked")) {
				dj.byId("public_task_details_bank_assignee_email_notification_nosend").set("checked", false);
				dj.byId("public_task_details_bank_assignee_name_nosend").reset();
			}
			if(publicTaskAssigneeType3 && !publicTaskAssigneeType3.get("checked")) {
				m.animate("fadeOut", d.byId("counterparty_email_input_field_div"), function(){
					dj.byId("public_task_details_counterparty_assignee_name_nosend").reset();
					dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").set("checked", false);
					dj.byId("counterparty_email_id_hidden").reset();
					dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend").reset();
					dj.byId("public_task_details_counterparty_assignee_email_nosend").reset();
				});
			}
		}
	}
	
	function validateContent(widget)
	{
		var errorMessage= null;
		if(dj.byId(widget))
		{
			var widgetContent = dj.byId(widget).get("value");
			if((widgetContent.indexOf("<") != -1) || (widgetContent.indexOf(">") != -1)) 
			{
				errorMessage =  m.getLocalization("invalidContent");
				dj.byId(widget).set("state","Error");
				dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
			}
		}
	}
	var _assigneeHandles = []; 
	
	d.mixin(m, {
		
		bindCollaboration : function(){
			m.setValidation("public_task_details_email_nosend", m.validateEmailAddr);
			m.setValidation("public_task_details_bank_other_user_assignee_email_nosend",
					m.validateEmailAddr);
			m.setValidation("public_task_details_counterparty_assignee_email_nosend",
					m.validateEmailAddr);

			m.connect("public_task_details_email_notification_nosend", "onClick", function(){
			  m.toggleFields(this.get("checked"), null, ["public_task_details_email_nosend"]);
			  _handleEmails(this, "public_task_details_email_nosend", 
					  "email_input_field_div", "user_email_id_hidden");
			});
			
			m.connect("notification_task_details_email_notification_nosend", "onClick",
					function(){
						m.toggleFields(this.get("checked"), null, 
								["notification_task_details_email_nosend"]);
					}
			);
			
			m.connect(
					"public_task_details_counterparty_assignee_email_notification_nosend", 
					"onClick", function(){
						
			  m.toggleFields(this.get("checked"), null,
								["public_task_details_counterparty_assignee_email_nosend"]);
			  if(!dj.byId("public_task_details_counterparty_assignee_name_nosend").get("value")){
				  dj.byId("counterparty_email_id_hidden").set("value", "");
				  dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").set(
						  "checked", false);
			  } else {
				  _handleEmails(this,"public_task_details_counterparty_assignee_email_nosend",
						  "counterparty_email_input_field_div","counterparty_email_id_hidden"); 
			  }
			});
			
			m.connect("public_task_details_other_user_assignee_email_notification_nosend",
					"onClick", function(){
			  m.toggleFields(this.get("checked"), null,
					  ["public_task_details_other_user_assignee_email_nosend"]);
			  if(!dj.byId("public_task_details_other_user_assignee_login_id_nosend").get("value")) {
				  dj.byId("other_user_email_id_hidden").set("value", "");
				  dj.byId("public_task_details_other_user_assignee_email_notification_nosend").set("checked", false);
			  } else {
				  _handleEmails(this,"public_task_details_other_user_assignee_email_nosend",
						  "other_user_email_input_field_div","other_user_email_id_hidden"); 
			  }	  
			});
			
			_assigneeHandles.push(m.connect("public_task_details_type_nosend_2", "onClick", 
					_toggleAssigneeRadioButtons));
			_assigneeHandles.push(m.connect("public_task_details_type_nosend_3", "onClick",
					_toggleAssigneeRadioButtons));
			_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_1", "onClick",
					_checkEntityForCollaboration));
			_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_1", "onClick", 
					_toggleAssigneeType));
			_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_2", "onClick", 
					_toggleAssigneeType));
			_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_3", "onClick", 
					_toggleAssigneeType));
			_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_4", "onClick", 
					_toggleAssigneeType));

			m.connect("public_task_details_description_nosend","onBlur",
					function(){
					validateContent("public_task_details_description_nosend");
					});
			m.connect("private_description_nosend","onBlur",
					function(){
				validateContent("private_description_nosend");
				});
			m.connect("public_tasks_description_nosend","onBlur",
					function(){
				validateContent("public_tasks_description_nosend");
				});
			m.connect("private_tasks_description_nosend","onBlur",
					function(){
				validateContent("private_tasks_description_nosend");
				});
			m.connect("notification_description_nosend","onBlur",
					function(){
				validateContent("notification_description_nosend");
				});
			m.connect("notification_tasks_description_nosend","onBlur",
					function(){
				validateContent("notification_tasks_description_nosend");
			});
			m.connect("public_task_details_description_nosend","onBlur",
					function(){
					validateContent("public_task_details_description_nosend");
					});
		},
		
		cancelCollaborationTask : function(/*String*/ type)
		{
			if(dj.byId("public_task_id_nosend"))
			{
				dj.byId("public_task_id_nosend").set("value", "");
			}
			 dj.byId('public_tasks_dialog').hide();
		},
		
		addCollaborationTask : function( /*String*/ type,
										 /*String*/ postSave) {
			// summary: 
			//		TODO
			
			if(dj.byId(type + "_description_nosend") && dj.byId(type + "_description_nosend").state !== "Error")
			{
				console.debug("[Collaboration] Adding a collaboration task of type " + type);	
				var mandatoryFields = [],
					isValid = false,
					id = "",
					isTaskUpdate = true,
					dialog = dj.byId(type + "_dialog"),
					field, declaredClass, value;
				
				type = type.toLowerCase();
				switch(type) {
				case "private_tasks":
					mandatoryFields = _getPrivateTasksMandatoryFields();
					id = dj.byId("private_task_id_nosend").get("value");
					break;
				case "public_tasks":
					mandatoryFields = _getPublicTasksMandatoryFields();
					id = dj.byId("public_task_id_nosend").get("value");
					break;
				default:
					mandatoryFields = _getNotificationTasksMandatoryFields();
					id = dj.byId("notification_task_id_nosend").get("value");
					break;
				}
				
				// Generate task if in case of new task
				if (id === "")
				{
					id = _generateId(type);
					isTaskUpdate = false;
				}
				
				// Validate fields
				isValid = d.every(mandatoryFields, function(fieldDetails){
					field = dj.byId(fieldDetails.name);
					if(field) {
						// TODO This looks a bit hacky, try to find a way to make it act like
						//		standard form validation
						
						declaredClass = field.declaredClass;
						value = field.get("displayedValue");
						if(/NumberTextBox/.test(declaredClass) ||
								(/CurrencyTextBox/.test(declaredClass))) {
							value = field.get("value");
							value = isNaN(value) ? "" : value;
						}
						else if(field.id)
						{
							validateContent(field.id);
						}
						if(type === "private_tasks" && field.state === "Error")
							{
							return false;
							}
						
						if(!value || field.state === "Error"){
							// Show the widget specific error message on click of Ok button
							m.showTooltip(field.invalidMessage,
									field.domNode);
							m.setFieldState(field, false);
							return false;
						}
					}
					return true;
				});
				
				if(!isValid) {
					return false;
				}
				
				// Add an item to the list
				_addCollaborationItem(type, id, postSave, isTaskUpdate);
				
				// If we're editing an entry, delete the original row
				if(dialog) {
					dialog.hide();
				}
				
				// Retrieve and reset all fields
				d.query("#" + type + "_fields *[id^=" + type + "]").forEach(function(node){
					var field = dj.byId(node.id);
					if(field){
						field.reset();
					}
				});
				m._config.taskEditMode = false;
				m._config.currentTaskID = "";
				//After updating an task should clear the task id from below hidden filed respectively
				//otherwise after editing an existing task, if user try to add a new task system consider the new task 
				//as an previously edited task.
				if(isTaskUpdate)
				{
					switch(type) {
					case "private_tasks":
						if(dj.byId("private_task_id_nosend"))
						{
							dj.byId("private_task_id_nosend").set("value", "");
						}
						break;
					case "public_tasks":
						if(dj.byId("public_task_id_nosend"))
						{
							dj.byId("public_task_id_nosend").set("value", "");
						}
						break;
					default:
						if(dj.byId("notification_task_id_nosend"))
						{
							dj.byId("notification_task_id_nosend").set("value", "");
						}
						break;
					}
				}
		    	return true;
			}
		},
		
		finishCollaborationTask : function( /*String || dj._widget*/ node,
											/*String*/ type, 
											/*String*/ id) {
			// summary:
			//		TODO
			
			var widget = dj.byId(node),
				inputDate = d.byId("old_inp_dttm") ? d.byId("old_inp_dttm").value : "",
				isChecked = widget.get("checked"),
				descId;
			
			if (d.byId("task_edit_" + id))
			{
				var editTaskNode = d.byId("task_edit_" + id);
				d.style(editTaskNode, "display", isChecked ? "none" : "inline");
			}
				
		    m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/SetPerformed?taskid=" +
				      id + "&performed=" + (isChecked ? "Y": "N") + "&inputdate=" + inputDate),
				load : function(response, args){
			    	descId = d.byId(type+"_desc_"+id);
			    	
			    	// TODO Should use classes
		    		if(isChecked) {
		    			d.style(descId, "textDecoration", "line-through");
		    			d.style(descId, "color", "#999");
		    		} else {
		    			d.style(descId, "textDecoration", "none");
		    			d.style(descId, "color", "black");
		    		}
				}
			});
		},
		
		openCollaborationComment : function( /*String*/ type,
											 /*String*/ id) {
			//  summary:
			//        Open the comments dialog

			var dialog = dj.byId(type + "_comments_dialog"),
				currentIdField, oldId;
			
			console.debug("[Collaboration] Opening dialog " + type + "_comments_dialog");
			if(!dialog) {
				// TODO We should just parse on page load, perf not worth doing this
				d.parser.parse(type + "_comments_div");
				dialog = dj.byId(type + "_comments_dialog");
				m.bindCollaboration();
			}
		
			currentIdField = dj.byId(type + "_comments_current_id_nosend");
			
			dj.byId(type + "_description_nosend").set("value", "");
			oldId = currentIdField.get("value");

			if(oldId) {
				d.style(d.byId(type+"_comments_" + oldId), "display", "none");
			}

			currentIdField.set("value", id);
			dialog.show();
			d.style(d.byId(type+"_comments_" + id), "display", "block");
			d.style(d.byId(type+"_comments_" + id), "width", "425px");
			d.style(d.byId(type+"_comments_" + id), "height", "173px");
			d.style(d.byId(type+"_comments_" + id), "overflow", "auto");
		}, 
		
		addCollaborationComment : function(/*String*/ type) {
			// summary:
			//		Add a comment to a task
			
			if(dj.byId(type + "_description_nosend") && dj.byId(type + "_description_nosend").state !== "Error")
			{
				var comment = dj.byId(type + "_description_nosend").get("value"),
					xml = ["<?xml version='1.0' encoding='UTF-8'?><comment>"],
					oldInpDttm = dj.byId("old_inp_dttm").get("value"),
					xmlComment, id;
	
				if((comment)&&(comment.length <= 204)) {
					id = dj.byId(type + "_comments_current_id_nosend").get("value");
					xml.push("<description>", m.grid.sanitizeHTMLDataForUI(dj.byId(type + "_description_nosend").get("value")), "</description>");
					xml.push("<task_id>", id, "</task_id>");
					xml.push("<old_inp_dttm>", oldInpDttm, "</old_inp_dttm></comment>");
					
					console.debug("[Collaboration] Adding Collaboration Task Comment - Request XML");
					console.debug("[Collaboration] " + xml.join(""));
					
					xml = xml.join("");
					// TODO Refactor, defer changing DOM until later
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/SaveComment"),
						content: {xml_string : xml},
						load : function(response, args){
							console.debug("[Collaboration] Adding Collaboration Task Comment - Response = " + xml);
							 
							// Add a new comment
							var masterOl = d.byId(type + "_comments_" + id),
								lastId = masterOl.getElementsByTagName("li").length,
								desc = dj.byId(type+"_description_nosend"),
								taskInfo =  dj.byId("sentence_posted_by").get("value")+ " " +
												dj.byId("sentence_you").get("value");
					
							d.create("li", {
								id: type + "_comment_" + id + "_" + lastId,
								innerHTML: desc.get("value") + "<br><div class='taskInfo'>" +
												taskInfo + "</div>"
							}, masterOl);
					
							// Update the number of comments
							var count =
								parseInt(d.byId(type + "_comment_count_" + id).innerHTML, 10);
							count++;
							d.byId(type  + "_comment_count_" + id).innerHTML = count;
								
							// Clear box
							desc.set("value", "");
						},
						error : function(response, args){
							console.error("[collaboration] Technical error while saving Comment");
							console.error(response);
						}
					});
				}
			}
		}, 
			
		openPublicTaskDialog : function() {
			//  summary:
			//            Reset all task fields
			    
			var dialog = dj.byId("public_tasks_dialog");
			if(!dialog) {
				d.parser.parse("public-tasks-fields");
				dialog = dj.byId("public_tasks_dialog");
				m.bindCollaboration();
			}
			
			var nodes = [];
			nodes.push(d.byId("collaboration_type_view_div"));
			nodes.push(d.byId("email_input_field_div"));
			nodes.push(d.byId("counterparty_email_input_field_div"));
			nodes.push(d.byId("other_user_email_input_field_div"));
			
			m.animate("fadeOut", nodes, function(){
				dialog.show();
			}, false, {duration: 20});

			dj.byId("public_task_details_description_nosend").reset();
			dj.byId("public_task_details_other_user_assignee_user_id_nosend").reset();
			dj.byId("public_task_details_email_nosend").reset();
			dj.byId("public_task_details_email_notification_nosend").set("checked", false);
			if(dj.byId("public_task_details_email_notification_nosend")) {
				m.toggleFields(
						dj.byId("public_task_details_email_notification_nosend").get("checked"),
						null, ["public_task_details_email_nosend"]);
			}
					
			dj.byId("public_task_details_type_nosend_2").set("checked", true);
			dj.byId("public_task_details_type_nosend_3").set("checked", false);
				
			_toggleAssigneeRadioButtons();

			dj.byId("public_task_details_other_user_assignee_login_id_nosend").reset();
			dj.byId("public_task_details_bank_assignee_name_nosend").reset();
			dj.byId("public_task_details_bank_assignee_abbv_name_nosend").reset();
			dj.byId("public_task_details_bank_assignee_email_notification_nosend").set(
						"checked", false);
			dj.byId("public_task_details_counterparty_assignee_name_nosend").reset();
			dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").set(
						"checked", false);
		//	dj.byId("public_task_details_counterparty_assignee_email_nosend").reset();
			dj.byId("public_task_details_counterparty_assignee_email_nosend").set(
						"disabled", true);	
		}, 
			
		openNotificationTaskDialog : function() {
			//  summary:
		    //        Open a dialog to add a notification (after product submission by the client)

			var dialog = dj.byId("notification_tasks_dialog");
			if(!dialog) {
				d.parser.parse("notification-task-fields");
				dialog = dj.byId("notification_tasks_dialog");
				m.bindCollaboration();
			}
				
			if(dj.byId("notification_task_details_email_notification_nosend")) {
				m.toggleFields(
						dj.byId("notification_task_details_email_notification_nosend").get("checked"), 
						null, ["notification_task_details_email_nosend"]);
			}
				
			dj.byId("notification_task_details_other_user_assignee_login_id_nosend").reset();
			dj.byId("notification_description_nosend").reset();
			dialog.show();
		},
			
		openPrivateTaskDialog : function() {
			//  summary:
		    //        Open a dialog to add a private task
				
			var dialog = dj.byId("private_tasks_dialog");
			if(!dialog) {
				d.parser.parse("private-task-fields");
				dialog = dj.byId("private_tasks_dialog");
				m.bindCollaboration();
			}
				
			dialog.show();
			dj.byId("private_description_nosend").reset();
		},
		
		openTaskForUpdate : function(taskId) {
			//  summary:
		    //        Open a dialog to update a task

			console.log("openTaskForUpdate: " + taskId);
		    m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetTask?taskid=" + taskId),
				load : function(response, args){
					response = d.fromJson(response);
					if (response.type[1] === "01")
					{
						m.openPrivateTaskDialog();
						dj.byId("private_task_id_nosend").set("value", response.task_id);
						dj.byId("private_description_nosend").set("value", response.description);
					}
					else
					{
						_toggleAssigneeRadioButtons = function(){
							console.log("_toggleAssigneeRadioButtonsSave");
						};
						_toggleAssigneeType = function(){
							console.log("_toggleAssigneeTypeSave");
						};
						m.openPublicTaskDialog();
						d.forEach(_assigneeHandles, function(handle){
							d.disconnect(handle);
						});
						dj.byId("public_task_id_nosend").set("value", response.task_id);
						dj.byId("public_task_details_description_nosend").set("value", response.description);
						dj.byId("public_task_details_email_notification_nosend").set("checked", response.email_notification === "Y");
						dj.byId("public_task_details_email_nosend").set("value", response.email);

						dj.byId("public_task_details_type_nosend_2").set("checked", response.type[1] === "02");
						dj.byId("public_task_details_type_nosend_3").set("checked", response.type[1] === "03");
						if (response.type[1] === "03")
						{
							m.toggleFields(true, 
									["public_task_details_assignee_type_nosend_1", 
									 "public_task_details_assignee_type_nosend_2",
									 "public_task_details_assignee_type_nosend_3"]);

							d.style("assigneeTypeFields", "display", "block");

							if(dj.byId("public_task_details_assignee_type_nosend_1"))
							{
								dj.byId("public_task_details_assignee_type_nosend_1").set("checked", response.assignee_type[1] === "01");
							}
							if(dj.byId("public_task_details_assignee_type_nosend_2"))
							{
								dj.byId("public_task_details_assignee_type_nosend_2").set("checked", response.assignee_type[1] === "02");
							}
							if(dj.byId("public_task_details_assignee_type_nosend_3"))
							{
								dj.byId("public_task_details_assignee_type_nosend_3").set("checked", response.assignee_type[1] === "03");
							}
							if (response.assignee_type[1] === "01")
							{
								d.style("notifyUserFields", "display", "block");
								dj.byId("public_task_details_other_user_assignee_login_id_nosend").set("value", response.dest_user_login_id);
								dj.byId("public_task_details_other_user_assignee_user_id_nosend").set("value", response.dest_user_id);
								dj.byId("public_task_details_other_user_assignee_email_notification_nosend").set("value", response.dest_user_email_notif === "Y");
								dj.byId("public_task_details_other_user_assignee_email_nosend").set("value", response.dest_user_email);
								dj.byId("other_user_email_id_hidden").set("value", response.dest_user_email);
								if(response.dest_user_email_notif === "Y")
								{
									d.style("other_user_email_input_field_div", "display", "block");
									m.toggleFields(true, null,
										["public_task_details_other_user_assignee_email_nosend"]);
									_handleEmails(dj.byId("public_task_details_other_user_assignee_email_notification_nosend"),
										"public_task_details_other_user_assignee_email_nosend",
										"other_user_email_input_field_div",
										"other_user_email_id_hidden");
								}	
							}
							if (response.assignee_type[1] === "02")
							{
								d.style("notifyBankFields", "display", "block");
								dj.byId("public_task_details_bank_assignee_name_nosend").set("value", response.dest_company_name);
								dj.byId("public_task_details_bank_assignee_abbv_name_nosend").set("value", response.dest_company_abbv_name);
								dj.byId("public_task_details_bank_assignee_email_notification_nosend").set("checked", response.dest_company_email_notif === "Y");
							}
							if (response.assignee_type[1] === "03")
							{
								d.style("notifyCounterpartyFields", "display", "block");
								dj.byId("public_task_details_counterparty_assignee_name_nosend").set("value", response.dest_company_name);
								dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend").set("value", response.dest_company_abbv_name);
								dj.byId("public_task_details_counterparty_assignee_email_notification_nosend").set("checked", response.dest_company_email_notif === "Y");
							}
							//added the below block of code to modify the assignee type radio buttons before display when task is opened in edit mode
							//fix for MPS-23593
							var publicTaskAssigneeType1 = dj.byId("public_task_details_assignee_type_nosend_1"),
							publicTaskAssigneeType2 = dj.byId("public_task_details_assignee_type_nosend_2"),
							publicTaskAssigneeType3 = dj.byId("public_task_details_assignee_type_nosend_3"),
							publicTaskDetailsType3 = dj.byId("public_task_details_type_nosend_3"),
							isPublicChecked = (publicTaskDetailsType3) ? 
									publicTaskDetailsType3.get("checked") : false,
							assigneeTypeFields = d.byId("assigneeTypeFields");

							//Provide a hook to modify the assignee type radio buttons before display
							if(isPublicChecked)
							{
								var assigneeTypes = [
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_1",
								                        	  description: "user_to_user"
								                          },
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_2",
								                        	  description: "user_to_bank"
								                          },
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_3",
								                        	  description: "counterparty"
								                          },
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_4",
								                        	  description: "bank"
								                          }
							                        ];
								m.preDisplayAssigneeType = m.preDisplayAssigneeType || function(){ return true; };
								m.preDisplayAssigneeType(assigneeTypes);
							}	
						}
						
						// TODO: find a way to not duplicate this function
						_toggleAssigneeRadioButtons = function() {
							//  summary:
						    //            Display the Assignee Radio Buttons
							
							var publicTaskAssigneeType1 = dj.byId("public_task_details_assignee_type_nosend_1"),
								publicTaskAssigneeType2 = dj.byId("public_task_details_assignee_type_nosend_2"),
								publicTaskAssigneeType3 = dj.byId("public_task_details_assignee_type_nosend_3"),
								publicTaskDetailsType3 = dj.byId("public_task_details_type_nosend_3"),
								isPublicChecked = (publicTaskDetailsType3) ? 
										publicTaskDetailsType3.get("checked") : false,
								assigneeTypeFields = d.byId("assigneeTypeFields");
							
							m.toggleFields(isPublicChecked, 
									["public_task_details_assignee_type_nosend_1", 
									 "public_task_details_assignee_type_nosend_2", 
									 "public_task_details_assignee_type_nosend_3", 
									 "public_task_details_assignee_type_nosend_4"]);
							//added the below block of code to modify the assignee type(Bank, User) radio buttons on toggling the Assignee radio button
							//fix for MPS-23593
							if(isPublicChecked)
							{
								var assigneeTypes = [
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_1",
								                        	  description: "user_to_user"
								                          },
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_2",
								                        	  description: "user_to_bank"
								                          },
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_3",
								                        	  description: "counterparty"
								                          },
								                          {
								                        	  id : "public_task_details_assignee_type_nosend_4",
								                        	  description: "bank"
								                          }
							                        ];
								m.preDisplayAssigneeType = m.preDisplayAssigneeType || function(){ return true; };
								m.preDisplayAssigneeType(assigneeTypes);
							}	
							
							if(isPublicChecked) { 
								m.animate("fadeIn", assigneeTypeFields, function(){
									if (publicTaskAssigneeType2 && publicTaskAssigneeType2.get("checked")) {
										publicTaskAssigneeType2.set("checked", true);
										m.animate("fadeOut",  d.byId("notifyUserFields"),function(){},false,{duration: 20});
										m.animate("fadeOut", d.byId("notifyCounterpartyFields"),function(){},false,{duration: 20});
										m.animate("fadeIn", d.byId("notifyBankFields"));
									}
									else if (publicTaskAssigneeType1 && publicTaskAssigneeType1.get("checked")) {
										publicTaskAssigneeType1.set("checked", true);
										m.animate("fadeOut",  d.byId("notifyBankFields"),function(){},false,{duration: 20});
										m.animate("fadeOut", d.byId("notifyCounterpartyFields"),function(){},false,{duration: 20});
										m.animate("fadeIn", d.byId("notifyUserFields"));
									}
									else if (publicTaskAssigneeType3 && publicTaskAssigneeType3.get("checked")) {
										publicTaskAssigneeType3.set("checked", true);
										m.animate("fadeOut",  d.byId("notifyUserFields"),function(){},false,{duration: 20});
										m.animate("fadeOut",  d.byId("notifyBankFields"),function(){},false,{duration: 20});
										m.animate("fadeIn", d.byId("notifyCounterpartyFields"));
									}
									else{
										publicTaskAssigneeType1.set("checked", true);
										m.animate("fadeOut",  d.byId("notifyBankFields"),function(){},false,{duration: 20});
										m.animate("fadeOut", d.byId("notifyCounterpartyFields"),function(){},false,{duration: 20});
										m.animate("fadeIn", d.byId("notifyUserFields"));
									}
									//_toggleFieldsByPermissions();
									//_toggleAssigneeType();
								}, false, {duration: 20});
							} else {
								m.animate("fadeOut", assigneeTypeFields, function(){
									if (publicTaskAssigneeType1) {
										publicTaskAssigneeType1.set("checked", false);
									}
									if (publicTaskAssigneeType2) {
										publicTaskAssigneeType2.set("checked", false);
									}
									if (publicTaskAssigneeType3) {
										publicTaskAssigneeType3.set("checked", false);
									}
									_toggleAssigneeType();
								}, false, {duration: 20});
							}
						};
						
						// TODO: find a way to not duplicate this function
						_toggleAssigneeType = function() {
							//  summary:
						    //            Display the assignee type
							
							var isAssignee1Checked = dj.byId("public_task_details_assignee_type_nosend_1") ?
									dj.byId("public_task_details_assignee_type_nosend_1").get("checked") : false,
								isAssignee2Checked = dj.byId("public_task_details_assignee_type_nosend_2") ?
										dj.byId("public_task_details_assignee_type_nosend_2").get("checked") : false,
								isAssignee3Checked = dj.byId("public_task_details_assignee_type_nosend_3") ?
										dj.byId("public_task_details_assignee_type_nosend_3").get("checked") : false,
								isAssignee4Checked = dj.byId("public_task_details_assignee_type_nosend_4") ?
									dj.byId("public_task_details_assignee_type_nosend_4").get("checked") : false,
								notifyBankFields = d.byId("notifyBankFields"),
								notifyUserFields = d.byId("notifyUserFields"),
								notifyCounterpartyFields = d.byId("notifyCounterpartyFields"),
								bankAssigneeTasks = d.byId("bankAssigneeTasks");
						    
							m.toggleFields(isAssignee1Checked, 
									null, ["public_task_details_other_user_assignee_login_id_nosend"]);
							m.toggleFields(isAssignee2Checked, 
									null, ["public_task_details_bank_assignee_name_nosend"], true, true);
							m.toggleFields(isAssignee3Checked, null,
										["public_task_details_counterparty_assignee_name_nosend"], true, true);
							m.toggleFields(isAssignee4Checked, null, 
									["public_task_details_bank_other_user_assignee_login_id_nosend", 
									 "public_task_details_bank_other_user_assignee_email_nosend"], true, true);
							
							dj.byId("public_task_details_other_user_assignee_login_id_nosend").set("readonly", true);
							dj.byId("public_task_details_other_user_assignee_login_id_nosend").set("disabled", true);
							
							m.animate("fadeOut", [notifyBankFields, notifyUserFields, notifyCounterpartyFields], function(){
								if(isAssignee1Checked){
									m.animate("fadeIn", notifyUserFields);
								} else if (isAssignee2Checked){
									m.animate("fadeIn", notifyBankFields);
								} else if(isAssignee3Checked) {
									m.animate("fadeIn", notifyCounterpartyFields);
									var accessOpened = dj.byId("access_opened"),
									collaborationCounterparty = dj.byId("public_task_details_counterparty_assignee_name_nosend"),		
									productCode= dj.byId("product_code").get('value'),
									counterpartyName=null,
									counterpartyHiddenEmail = dj.byId("counterparty_email_id_hidden"),
									collaborationCounterpartyAbbvName = dj.byId("public_task_details_counterparty_assignee_abbv_name_nosend");
									if(productCode && productCode=="IP")
										{
											counterpartyName=dj.byId("seller_name") ? dj.byId("seller_name") : dj.byId("seller_abbv_name");
										}
									else if (productCode && productCode=="IN")
										{
											counterpartyName=dj.byId("buyer_name") ? dj.byId("buyer_name") : dj.byId("buyer_abbv_name");
										}
										if(accessOpened && counterpartyName)
										{
											if(counterpartyName.get('value')!=="")
											{
												if (accessOpened.get("value") === 'Y')
												{
													collaborationCounterparty.set('value',counterpartyName.get('value'));
													counterpartyHiddenEmail.set('value',dj.byId('transaction_counterparty_email').get('value'));
													collaborationCounterpartyAbbvName.set('value',dj.byId('ben_company_abbv_name').get('value'));
													//collaborationCounterpartyLookup.set('disabled',true);
												}
												else
												{
													collaborationCounterparty.set('value',"");
													collaborationCounterpartyAbbvName.set("value", "");
													m.dialog.show("ERROR", m.getLocalization("errorCounterpartyCollaborationNotEnabled"));
													m.animate("fadeOut", notifyCounterpartyFields);
												}
											}
											else
											{
												collaborationCounterparty.set('value',"");
												collaborationCounterpartyAbbvName.set("value", "");
												m.dialog.show("ERROR", m.getLocalization("errorSelectCounterpartyCollaboration"));
												m.animate("fadeOut", notifyCounterpartyFields);
											}
										}
								} else if(isAssignee4Checked) {
									m.animate("fadeIn", bankAssigneeTasks);
								}
								
								_getCollaborationBankName();
								_resetCollaborationFields();
							}, false, {duration: 20});
						};
						
						_assigneeHandles = [];
						_assigneeHandles.push(m.connect("public_task_details_type_nosend_2", "onClick", 
								_toggleAssigneeRadioButtons));
						_assigneeHandles.push(m.connect("public_task_details_type_nosend_3", "onClick",
								_toggleAssigneeRadioButtons));
						_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_1", "onClick",
								_checkEntityForCollaboration));
						_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_1", "onClick", 
								_toggleAssigneeType));
						_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_2", "onClick", 
								_toggleAssigneeType));
						_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_3", "onClick", 
								_toggleAssigneeType));
						_assigneeHandles.push(m.connect("public_task_details_assignee_type_nosend_4", "onClick", 
								_toggleAssigneeType));
						
						if(response.type[1] === "02")
						{
							dj.byId("public_task_details_type_nosend_2").onClick();
						}else{
							dj.byId("public_task_details_type_nosend_3").onClick();
						}
					}
				}
		    });
		},

		showCollaborationTaskDetails : function() {
			m.animate("fadeIn", d.byId("collaboration-more-tasks"), function(){
				m.animate("fadeOut", d.byId("show-tasks-details-link"), false, {duration: 20});
			}, false, {duration: 20});
				}
	});
})(dojo, dijit, misys);
