dojo.provide("misys.form.PercentNumberTextBox");

dojo.require("dijit.form.NumberTextBox");

/*=====
dojo.declare(
	"dijit.form.NumberTextBox.__Constraints",
	[dijit.form.RangeBoundTextBox.__Constraints, dojo.number.__FormatOptions, dojo.number.__ParseOptions], {
	// summary:
	//		Specifies both the rules on valid/invalid values (minimum, maximum,
	//		number of required decimal places), and also formatting options for
	//		displaying the value when the field is not focused.
	// example:
	//		Minimum/maximum:
	//		To specify a field between 0 and 120:
	//	|		{min:0,max:120}
	//		To specify a field that must be an integer:
	//	|		{fractional:false}
	//		To specify a field where 0 to 3 decimal places are allowed on input,
	//		but after the field is blurred the value is displayed with 3 decimal places:
	//	|		{places:'0,3'}
});
=====*/

dojo.declare("misys.form.PercentNumberTextBox",
	[dijit.form.NumberTextBox],
	{


	startup: function(){
			if (!this._started)
			{		
				this.inherited(arguments);
				this.set('value',this.get('value') * 100);
			}
			this._started = true;
		},

		toXML: function(){
			return this.get('value') ? this.get('value')/100 : '';
		}
	}
);

