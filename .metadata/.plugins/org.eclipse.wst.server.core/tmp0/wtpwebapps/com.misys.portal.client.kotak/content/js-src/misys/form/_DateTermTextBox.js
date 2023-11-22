dojo.provide("misys.form._DateTermTextBox");

dojo.require("dijit.form.DateTextBox");

// our declared class
dojo.declare("misys.form._DateTermTextBox",
	[dijit.form.DateTextBox],
	// summary:
	//		Specialized widget for DateTermField.
	//		Allows input different of date but keep the calendar.
	//		
	//		See also misys.form.DateTermField.js && misys.form.FilteringTermSelect.js
	{
		
		_parent: "",
		
		/////////////////// OVERRIDES FUNCTIONS //////////////////////
		constructor: function(params, srcNodeRef){
			this.inherited(arguments);
		},
		
		postCreate: function(){
			this._resetValue = null;
			this.inherited(arguments);
		},
		
		validator: function(/*anything*/value, /*dijit.form.ValidationTextBox.__Constraints*/constraints){
			// return true because we don't want to do the standard validation
			// plus, this function can be overridable to set a specific validation
			// see also 
			return true;
		},
		// overload this function to save the displayed value and not only the value (which is a date)
		_setBlurValue: function(){
			this.inherited(arguments);
			if (this.isValidNumber()){this._parent._setNumberValue(this.get("displayedValue"));}
		},
		
		validate: function(/*Boolean*/ isFocused){
			// summary:
			//		Overrides function validate in dijit.form.ValidationTextBox.js
			// description:
			//		A supplementary validation has been add.
			//		See also dijit.form.ValidationTextBox.validate
			var message = "";
			var isValid = this.disabled || (this.isValid(isFocused) && this.dateTermValidator());
			if(isValid){ this._maskValidSubsetError = true; }
			var isEmpty = this._isEmpty(this.textbox.value);
			var isValidSubset = !isValid && !isEmpty && isFocused && this._isValidSubset();
			this.state = ((isValid || ((!this._hasBeenBlurred || isFocused) && isEmpty) || isValidSubset) && this._maskValidSubsetError) ? "" : "Error";
			if(this.state == "Error"){ this._maskValidSubsetError = isFocused; } // we want the error to show up afer a blur and refocus
			this._setStateClass();
			dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");
			if(isFocused){
				if(this.state == "Error"){
					message = this.getErrorMessage(true);
				}else{
					message = this.getPromptMessage(true); // show the prompt whever there's no error
				}
				this._maskValidSubsetError = true; // since we're focused, always mask warnings
			}
			this.displayMessage(message);
			return isValid;
		},
		
		//////////////////////// VALIDATION FUNCTIONS ///////////////////////////
		dateTermValidator: function(){
			if(this._parent.isStaticCodeSelected()){return true;}
			else if (this._parent.isTermCodeSelected()){return this.isValidNumber();}
			else if (this._parent.isBlankSelected()){return this.isValidNumber() || this.isValidDate();}
			else{return this.isValidDate();}
		},
		
		isValidDate: function(value){
			enteredValue = this.textbox.value;
			constraints = {"fullYear":true, "selector":"date"};
			return (new RegExp("^(?:" + this.regExpGen(constraints) + ")"+(this.required?"":"?")+"$")).test(enteredValue) &&
			(!this.required || !this._isEmpty(enteredValue)) &&
			(this._isEmpty(enteredValue) || this.parse(enteredValue, constraints) !== undefined); // Boolean
			
		},
		
		isValidNumber: function(value){
			enteredValue = this.textbox.value;
			return (new RegExp("^[0-9]*$")).test(enteredValue) &&
			(!this.required || !this._isEmpty(enteredValue));
		},
		
		////////////////////// MISCELLANEOUS FUNCTIONS //////////////////////////
		toXML: function(){
			return this.displayedValue;
		}
		
	}
);


