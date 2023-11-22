dojo.provide("misys.form._FilteringTermSelect");

dojo.require("dijit.form.FilteringSelect");

// our declared class
dojo.declare("misys.form._FilteringTermSelect",
	[dijit.form.FilteringSelect],
	// summary:
	//		Specialized widget for DateTermField.
	//		Standard FilteringTextBox with an additional value use for xml flow.
	//		
	//		See also misys.form.DateTermField.js && misys.form.DateTermTextBox.js
	{
		_optionValue: "",

		constructor: function(params, srcNodeRef){
			this.inherited(arguments);
		},
		
		_onBlur: function(){
			this.inherited(arguments);
			this.onChange();
			
		},
		
		toXML: function(){
			return this._optionValue;
		}
	}
);