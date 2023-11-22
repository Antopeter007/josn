dojo.provide("misys.form.DateOrTermField");

dojo.require("misys.form._FilteringTermSelect");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form._FormWidget");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.NumberTextBox");

dojo.declare("misys.form.DateOrTermField", [dijit.form._FormValueWidget],
{
	// summary:
	//		Composite widget to get a date with different format :
	//		yyyy/mm/dd, a number of term option (ex: 15 days / 3 months)
	//		
	//		To retrieve values, use dijit.byId('').getDate() || getNumber() || getCode()
	//		To test if a date is put in, use dijit.byId('').isValidDate()
	
	///////////// class properties ///////////////
	templateString: dojo.cache("misys.form", "templates/DateOrTermField.html"),
	widgetsInTemplate : true,
	
	required: false,
	fieldsize: "small",
	displaymode: "edit",
	readOnly: false,
	_selectWidget: null,
	_calendarWidget: null,
	_numberField: null,
	
	date: "",
	code: "",
	number: "",
	
	_myStore: null,
	_optionsJson: null,
	
	////////////INITIALIZATION METHODS /////////////////////////
	
	constructor: function(params, srcNodeRef){
		this.inherited(arguments);
		console.debug("[DateOrTermField] Creating widget with params " + dojo.toJson(params) + " on node " + srcNodeRef);
		this.srcNodeRef = srcNodeRef;
		// if they are no store object, some option node exist
		if (!this.store)
		{
			// creating Json object
			var objectJson = {};
			objectJson.items = [];
			var _selectTag;
			var _childsTable;
			
			dojo.forEach(dojo.query("select", this.srcNodeRef), function(s, i){
				var type = (i === 0) ? "term" : "static";
				dojo.forEach(dojo.query("option", s), function(o){
					objectJson.items.push({
						"value":o.value, 
						"label":o.innerHTML, 
						"type": type});
				});
				dojo.destroy(s);
			});

			// create a ItemFilWriteStore for FilteringSelect widget
			_myStore = new dojo.data.ItemFileWriteStore({data:objectJson});
			// save Json object
			this.set("_optionsJson", objectJson);
		}
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
	},

	postCreate: function(){
		this.inherited(arguments);
		if (this.displaymode == "edit")
		{
			this._calendarWidget = new dijit.form.DateTextBox({
				id:this.get("id")+"_date",
				name:this.get("id")+"_date",
				"class": this.fieldsize,
				required: this.required
				}, this.calendarFieldNode);
			misys.connect(this._calendarWidget, "onChange", this, this._onChangeCalendar);
			
			// create select field
			this._selectWidget = new misys.form._FilteringTermSelect({
				id:this.get("id")+"_code",
				name:this.get("id")+"_code",
				"class": this.fieldsize,
				store: _myStore,
				_optionJson: this._optionsJson,
				searchAttr: "label",
				labelAttr: "label",
				required: this.required
				}, this.selectFieldNode);
			misys.connect(this._selectWidget, "onChange", this, this._onChangeSelect);
			
			// create hidden field number
			this._numberField = new dijit.form.NumberTextBox({
				id:this.get("id")+"_number",
				name:this.get("id")+"_number",
				"class": this.fieldsize,
				required: this.required
				}, this.numberFieldNode);
			misys.connect(this._numberField, "onChange", this, this._onChangeNumber);
			
			// insert default value if they are present
			if (this.date != "")
			{
				this._calendarWidget.set('displayedValue', this.date);
			}
			if (this.code != "")
			{
				var itemsTable = this._optionsJson.items; 
				for(var i = 0; i<itemsTable.length; i++){
					if(itemsTable[i].value == this.code)
					{
						this._selectWidget._setDisplayedValueAttr(itemsTable[i].label);
						break;
					}
				}
			}
			// disabled ?
			this.set("disabled", this.readonly == "Y" ? true : false);
		}
		// for the case of review mode, we only show value
		else 
		{
			var text = "";
			if (this.date != "")
			{
				text = text + this.date;
			}
			if (this.code != "")
			{
				var itemsTableReview = this._optionsJson.items; 
				if (text != ""){text = text + " ";}
				for(var j = 0; j<itemsTableReview.length; j++){
					if(itemsTableReview[j].value == this.code)
					{
						text = text + itemsTableReview[j].label;
						break;
					}
				}
			}
			this.dateTermFieldNode.innerHTML = text;
			dojo.addClass(this.dateTermFieldNode, "content");
			dojo.removeClass(this.dateTermFieldNode, "dijit");
			dojo.removeClass(this.dateTermFieldNode, "dijitReset");
			dojo.removeClass(this.dateTermFieldNode, "dijitInlineTable");
			dojo.removeClass(this.dateTermFieldNode, "dijitLeft");
			dojo.removeClass(this.dateTermFieldNode, "ReadOnly");
			dojo.removeClass(this.dateTermFieldNode, "dijitReadOnly");
		}
	},
	
	//////////////////MISCELLANEOUS METHODS ///////////////////
	
	_isEmpty : function(/*String*/str) {
		return (!str || str.trim().length === 0);
	},
	
	isValidCalDate: function(widget){
		var enteredValue = widget.textbox.value;
		var constraints = {"fullYear":true, "selector":"date"};
		return (new RegExp("^(?:" + widget.regExpGen(constraints) + ")"+(widget.required?"":"?")+"$")).test(enteredValue) &&
		(!widget.required || !this._isEmpty(enteredValue)) &&
		(this._isEmpty(enteredValue) || widget.parse(enteredValue, constraints) !== undefined); // Boolean
		
	},
	
	isValidCalNumber: function(widget){
		var enteredValue = widget.textbox.value;
		return (new RegExp("^[0-9\,]*$")).test(enteredValue) &&
		(!widget.required || (!this._isEmpty(enteredValue) && enteredValue !== "0"));
	},
	
	_onChangeCalendar: function(/*String*/ value){
		this.date = this._calendarWidget.get('displayedValue');
		this.value = this.date + this.code;
	},
	
	_onChangeSelect: function(){
		var selectValue = this._selectWidget.value;
		if (selectValue === ""){
			this.code = "";
			this.toggleDisabledCalendarField(true);
			this.toggleDisabledNumberField(true);
		}
		else {
			var termCode = this._optionsJson.items[selectValue].value;
			if (termCode[0] === "d" || termCode[0] === "w" || termCode[0] === "m" || termCode[0] === "y" ) {
				this.toggleDisabledCalendarField(true);
				this.toggleDisabledNumberField(false);
				this._calendarWidget.reset();
				this._numberField.reset();
				if(dojo.byId("date-value_description"))
				{
					dojo.byId("date-value_description").textContent = "";
				}
			}
			else if (this.isStaticCodeSelected())
			{
					var staticCode = this._optionsJson.items[selectValue].value;
					var description = ""; 
					this.toggleDisabledCalendarField(true);
					this.toggleDisabledNumberField(true);
					this._calendarWidget.reset();
					this._numberField.reset();
					if ((staticCode[0] === 'CASH')  && dojo.byId("date-value_description"))
					{
						description = description + misys.getLocalization("valueToday");
						dojo.byId("date-value_description").innerText = description;	
					}
					else if ((staticCode[0] === 'TOM') &&  dojo.byId("date-value_description"))
					{
						description = description + misysgetLocalization("valueOneBusinessDay");
						dojo.byId("date-value_description").innerText = description;
					}
					else if ((staticCode[0] === 'SPOT') &&  dojo.byId("date-value_description") && dojo.byId("payment_cur_code").value ==='CAD' &&
							dojo.byId("applicant_cur_code").value === 'USD')
					{
						description = description + misys.getLocalization("valueOneBusinessDayCADdeal");
						dojo.byId("date-value_description").innerText = description;
					}
					else if ((staticCode[0] === 'SPOT') &&  dojo.byId("date-value_description"))
					{
						description = description + misys.getLocalization("valueTwoBusinessDay");
						dojo.byId("date-value_description").innerText = description;
					}
			}			
			else {
				this.toggleDisabledCalendarField(false);
				this.toggleDisabledNumberField(true);
				this._numberField.reset();
				if(dojo.byId("date-value_description"))
				{
					dojo.byId("date-value_description").textContent = "";
				}
			}
			this.code = this._optionsJson.items[selectValue].value[0];
			this._selectWidget._isvalid = true;
		}
		this._selectWidget._optionValue = this.code;
		this.set('value', this.date + this.code);
	},
	
	_onChangeNumber: function() {
		this.number = this._numberField.get("value");
	},
	
	_onChange: function(){
		console.debug("[DateTermField] _onChange DateTermField");
	},
	
	// overload focus function to allow focus on sub-widget
	focus: function(){},
	
	isTermCodeSelected: function(){
		return (this._selectWidget != null && !(this._selectWidget.value === "" || this._optionsJson.items[this._selectWidget.value].value[0] === "dt")) ? this._optionsJson.items[this._selectWidget.value].type[0] === "term" : false;
	},
	isBlankSelected: function(){
		return (this._selectWidget != null && this._selectWidget.value === "" ) ? true : false;
	},
	isDateSelected: function(){
		return (this._selectWidget != null && this._selectWidget.value !== "" && this._optionsJson.items[this._selectWidget.value].value[0] === "dt" ) ? true : false;
	},
	
	isValidDate: function(){
		return this._calendarWidget != null ? (this.isValidCalDate(this._calendarWidget) && this.isDateSelected()) : false;
	},
	
	isValidNumber: function(){
		return this._numberField != null ? this.isValidCalNumber(this._numberField) : false;
	},
	
	isCorrectlyFilled: function(){
		return (this.isDateSelected() && !this._isEmpty(this._calendarWidget.textbox.value)) || (this.isTermCodeSelected() && !this._isEmpty(this._numberField.textbox.value)) ;
	},

	isStaticCodeSelected: function(){
		return (this._selectWidget != null && !(this._selectWidget.value === "")) ? this._optionsJson.items[this._selectWidget.value].type == "static" : false;
	},
	
	toggleDisabledSelectField: function(/*Boolean*/value){
		if (this._selectWidget != null){
			this._selectWidget.set('disabled', value);
			this._selectWidget.set('required', !value);
		}
	},

	toggleDisabledCalendarField: function(/*Boolean*/value){
		if (this._calendarWidget != null){
			this._calendarWidget.set('disabled', value);
			this._calendarWidget.set('required', !value);
			var calendarNode = "widget_"+this.get("id")+"_date";
			if (dojo.byId(calendarNode) && value){
				dojo.style(dojo.byId(calendarNode), "display", "none");
			}
			else if (dojo.byId(calendarNode) && !value){
				dojo.style(dojo.byId(calendarNode), "display", "inline-block");
			}
		}
	},
	
	toggleDisabledNumberField: function(/*Boolean*/value){
		if (this._numberField != null){
			this._numberField.set('disabled', value);
			this._numberField.set('required', !value);
			var numberField = "widget_"+this.get("id")+"_number";
			if (dojo.byId(numberField) && value){
				dojo.style(dojo.byId(numberField), "display", "none");
			}
			else if (dojo.byId(numberField) && !value){
				dojo.style(dojo.byId(numberField), "display", "inline-block");
			}
		}
	},
	
	////////////////// OVERLOAD GETTER / SETTER METHODS ///////////////////
	
	_setValueAttr: function(/*String*/ newValue){
		this.inherited(arguments);
		if (newValue === "")
		{
			if (this._calendarWidget != null){
				this._calendarWidget.reset();
			}
			if (this._selectWidget != null){
				this._selectWidget.reset();
			}
			if (this._numberField != null){
				this._numberField.reset();
			}
		}
	},
	
	_setRequiredAttr: function(/*Boolean*/ value){
		if (this._calendarWidget != null)
		{
			this._calendarWidget.set("required", value);
		}
		if (this._selectWidget != null){
			this._selectWidget.set("required", value);
		}
		this.inherited(arguments);
	},
	
	_setDisabledAttr: function(/*Boolean*/ value){
		this.inherited(arguments);
		this.toggleDisabledSelectField(value);
		this._onChangeCalendar();
		this._onChangeSelect();
	},
	
	_setNumberValue: function(/*String*/ newValue){
		this._numberField.set("value", newValue);
	},
	
	getNumber: function(){
		return this.get("number");
	},
	getCode: function(){
		return this.get("code");
	},
	getDate: function(){
		return this.isValidDate() ? this.get("date") : "";
	},
	getFormalValueDate: function(){
		return this.isValidDate() ? this._calendarWidget.get('value') : "";
	}
}
);

