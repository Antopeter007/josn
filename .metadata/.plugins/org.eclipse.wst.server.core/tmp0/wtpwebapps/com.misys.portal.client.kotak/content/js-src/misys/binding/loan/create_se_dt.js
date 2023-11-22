dojo.provide("misys.binding.loan.create_se_dt");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.binding.SessionTimer");

/**
 * <h4>Summary:</h4>
 *  JavaScript Functions() or Methods() specific to Document Tracking `(DT)`.
 *  <h4>Description:</h4>
 *  This class contains methods that are used specifically for `Document Tracking`.
 *  <b>Technically</b>, Document Tracking `(DT)` is a `sub-product` of Secure Email `(SE)`.
 *  <b>Functionally</b>, it is a product under Lending Services.
 *  
 * @class create_se_dt
 * 
 */
(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
{

	"use strict"; // ECMA5 Strict Mode

	d.mixin(m._config,
	{
		
		/**
		 * Initialize re-Authentication Parameters
		 * 
		 * @method initReAuthParams
		 */
		initReAuthParams : function()
		{

			var reAuthParams =
			{
				productCode : 'SE',
				subProductCode : '',
				transactionTypeCode : '01',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : '',
				amount : '',

				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		}
	});

	/**
	 * <h4>Summary:</h4>
	 * 		Method which keeps a count of all uploaded <b>Attachments</b>.
	 *   
	 *  <h4>Description:</h4>
	 *  
	 *  	This Methods check for at-least one attachment to proceed further with Document Tracking(DT) transaction.   
	 *  	Attachment is Mandatory for DT product. 
	 *  
	 * @method _checkForAttachments
	 * @private
	 * @return {Boolean} `True`, if number of uploaded Files is greater-than-zero. i.e.,`(numOfFiles>0)`
	 */
	function _checkForAttachments()
	{

		// summary:
		// Check which attachments have been added or deleted.
		// tags:
		// private

		console.debug('[FormEvents] Checking for lost attachments');
		var attIdsField = dj.byId('attIds');
		var numOfFiles = false;
		var count = 0;
		if (attIdsField)
		{
			var grids = [ dj.byId('attachment-file'), dj.byId('attachment-fileOTHER') ];
			d.forEach(grids, function(gridContainer)
			{
				if (gridContainer && gridContainer.grid)
				{
					var arr = gridContainer.grid.store._arrayOfAllItems;
					d.forEach(arr, function(attachment, i)
					{
						if (attachment !== null)
						{
							numOfFiles = true;
							count++;
						}
					});
				}
			});
		}
		if (numOfFiles === false)
		{
			m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMinimumFileUploadTypeError");
		}
		return numOfFiles;
	}

	// Public functions & variables follow
	d.mixin(m,
	{
		/**
		 * <h4>Summary:</h4>
		 *  	
		 *  	Events or Actions that has to be `Connected and/or Binded Only` for the Document Tracking creation screen.
		 *   
		 * @method bind
		 * @override
		 **/
		bind : function()
		{

		},

		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	Events/Actions/Validations that has to be performed on Form Load.
		 * 
		 * @method onFormLoad
		 * @override
		 **/		
		onFormLoad : function()
		{
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	Validations that has to be made before Saving any Transaction.
		 *   
		 *  <h4>Description:</h4>
		 *  
		 * 		This beforeSaveValidations is a standard action method.
		 * 
		 * 		Here, if the corresponding Company of the User is associated with one or more Entities
		 * 		then we place a Mandatory check for the selection of at-least `One Entity`,
		 * 		before saving any transaction.
		 * 
		 * @method beforeSaveValidations
		 * @return {Boolean} `True`, if all before saving validations are satisfactory.
		 * 
		 **/
		beforeSaveValidations : function()
		{
			var entity = dj.byId("entity");
			if (entity && entity.get("value") === "")
			{
				return false;
			} else
			{
				return true;
			}
		},

		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	Validations that has to be made before Submitting any Transaction.
		 *   
		 *  <h4>Description:</h4>
		 *  
		 * 		This beforeSubmitValidations is a standard action method.
		 * 		Any Product specific validation checks will be coded in this method.
		 *
		 * @method beforeSubmitValidations
		 * @return {Boolean} `True`, if all before submission validations are satisfactory.
		 **/
		beforeSubmitValidations : function()
		{

			return _checkForAttachments();
		}
	});
})(dojo, dijit, misys);
// Including the client specific implementation
dojo.require('misys.client.binding.loan.create_se_dt_client');