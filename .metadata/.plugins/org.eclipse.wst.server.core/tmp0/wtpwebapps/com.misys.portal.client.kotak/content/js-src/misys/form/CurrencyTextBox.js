dojo.provide("misys.form.CurrencyTextBox");
dojo.experimental("misys.form.CurrencyTextBox");

dojo.require("dijit.form.CurrencyTextBox");

dojo.declare("misys.form.CurrencyTextBox", dijit.form.CurrencyTextBox, {
	// summary:
	//		Widget that formats the currency before validating
	// Values like "1.1" or "33.2" are formatted to "1.10" or "33.20" respectively

	validator: function(/*anything*/ value, /*dijit.form.ValidationTextBox.__Constraints*/ constraints){
		// summary:
		//		Overridable function used to validate the text input against the regular expression.
		// tags:
		//		protected
		var decimalValue, amtValue = value;
		if(constraints && constraints.places && value)
		{
			//Get the type of decimal seperator
			var locale = dojo.i18n.normalizeLocale(constraints.locale),
				bundle = dojo.i18n.getLocalization("dojo.cldr", "number", locale),
				decimal = bundle.decimal;
			
			var noOfDecimals =  constraints.places;
			if(value.indexOf(decimal) >= 0)
			{
				decimalValue = value.substring(value.indexOf(decimal) + 1, value.length);
				if(noOfDecimals > decimalValue.length)
				{
					while(decimalValue.length < noOfDecimals)
					{
						amtValue = amtValue + "0";
						decimalValue = decimalValue + "0";
					}
					//this.value = amtValue;
					this.textbox.value = amtValue;
					this._set("displayedValue", this.get("displayedValue"));
				}
			}
		}
		return (new RegExp("^(?:" + this.regExpGen(constraints) + ")"+(this.required?"":"?")+"$")).test(amtValue) &&
		(!this.required || !this._isEmpty(value)) &&
		(this._isEmpty(value) || this.parse(value, constraints) !== undefined);
	}
});

