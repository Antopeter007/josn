dojo.provide("misys.form.DateTermField");

dojo.require("misys.form._DateTermTextBox");
dojo.require("misys.form._FilteringTermSelect");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form._FormWidget");
dojo.require("dijit.form.TextBox");
dojo.declare("misys.form.DateTermField", [dijit.form._FormValueWidget],
{
	// summary:
	//		Composite widget to get a date with different format :
	//		yyyy/mm/dd, a number of term option (ex: 15 days / 3 months), a static option (ex: SPOT)
	//		
	//		To retrieve values, use dijit.byId('').getDate() || getNumber() || getCode()
	//		To test if a date is put in, use dijit.byId('').isValidDate()
	
	///////////// class properties ///////////////
	templateString: dojo.cache("misys.form", "templates/DateTermField.html"),
	widgetsInTemplate : true,
	
	required: false,
	fieldsize: "small",
	displaymode: "edit",
	readOnly: false,
	_selectWidget: null,
	_calendarWidget: null,
	
	// *****************
	// this field allows to differentiate case where the calendar widget is a date
	// and case where it is a number. 
	// *Used to build xml flow.*
	_numberField: null,
	
	date: "",
	code: "",
	
	_store: "", //not use yet TODO: implements _store use
	_myStore: null,
	_optionsJson: null,
	
	////////////INITIALIZATION METHODS /////////////////////////
	
	constructor: function(params, srcNodeRef){
		this.inherited(arguments);
		console.debug("[DateTermField] Creating widget with params " + dojo.toJson(params) + " on node " + srcNodeRef);
		this.srcNodeRef = srcNodeRef;
		// if they are no store object, some option node exist
		if (!this.store)
		{
			// creating Json object
			var objectJson = {};
			objectJson.items = [];
			//objectJson.items.push({"value":"", "label":"", "type": ""});
			var _selectTag;
			var _childsTable;
			// TODO used a query here
			//debugger;
			
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
			
//			if (this.srcNodeRef.hasChildNodes() && srcNodeRef.childNodes[0].tagName.toUpperCase() === "SELECT")
//			{
//				_selectTag = this.srcNodeRef.childNodes[0];
//				_childsTable = _selectTag.childNodes;
//				// filling Json object with option data
//				dojo.forEach(_childsTable, function(optionTag){
//					objectJson.items.push({"value":optionTag.value, "label":optionTag.innerHTML, "type": "term"});
//				});
//				// destroy select tag and its children
//				this.srcNodeRef.removeChild(_selectTag);
//			}
//			if (this.srcNodeRef.hasChildNodes() && srcNodeRef.childNodes[0].tagName.toUpperCase() === "SELECT")
//			{
//				_selectTag = this.srcNodeRef.childNodes[0];
//				_childsTable = _selectTag.childNodes;
//				// filling Json object with option data
//				dojo.forEach(_childsTable, function(optionTag){
//					objectJson.items.push({"value":optionTag.value, "label":optionTag.innerHTML, "type": "static"});
//				});
//				// destroy select tag and its children
//				this.srcNodeRef.removeChild(_selectTag);
//			}
			// create a ItemFilWriteStore for FilteringSelect widget
			_myStore = new dojo.data.ItemFileWriteStore({data:objectJson}); // TODO deplace to postCreate
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
			// create calendar
			this._calendarWidget = new misys.form._DateTermTextBox({
				id:this.get("id")+"_date",
				name:this.get("id")+"_date",
				"class": this.fieldsize,
				required: this.required,
				_parent: this
				},this.calendarFieldNode);
			
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
				},this.selectFieldNode);
			misys.connect(this._selectWidget, "onChange", this, this._onChangeSelect);
			// create hidden field number
			this._numberField = new dijit.form.TextBox({
				id:this.get("id")+"_number",
				type: "hidden"
				},this.numberFieldNode);
			// insert default value if they are present
			if (this.date != "")
			{
				this._calendarWidget.set('displayedValue', this.date);
				//dijit.byId(this.get("id")+"_date").set('disabled', this.readonly == "Y" ? true : false);
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
	
	_onChangeCalendar: function(/*String*/ value){
		this.date = this._calendarWidget.get('displayedValue');
		this.value = this.date + this.code;
		if (this._calendarWidget.isValidDate() && this.date != "")
		{
			this._selectWidget.reset();
			this.toggleDisabledSelectField(true);
			// update _numberField
			this._numberField.set("value", "");
		}
		else 
		{
			if ((this._calendarWidget.isValidNumber() || this._calendarWidget.value == null) && this._selectWidget.value === "")
			{
				this._selectWidget.set("_isvalid", false);
			}
			if(!this.disabled) 
			{
				this.toggleDisabledSelectField(false);
			}
			// update _numberField
			this._numberField.set("value", this.date);
		}
	},
	
	_onChangeSelect: function(){
		var selectValue = this._selectWidget.value;
		if (selectValue === ""){
			this.code = "";
		}
		else {
			if (this.isStaticCodeSelected())
			{
				this._calendarWidget.value = "";
				this.toggleDisabledCalendarField(true);
				// update _numberField
				this._numberField.set("value", "");
			}
			else if (this.isTermCodeSelected())
			{
				this.toggleDisabledCalendarField(false);
			}
			this.code = this._optionsJson.items[selectValue].value;
			this._selectWidget._isvalid = true;
		}
		this._selectWidget._optionValue = this.code;
		this.set('value', this.date + this.code);
	},
	
	_onChange: function(){
		console.debug("[DateTermField] _onChange DateTermField");
	},
	
	// overload focus function to allow focus on sub-widget
	// TODO: add focus on subwidget....
	focus: function(){},
	
	isStaticCodeSelected: function(){
		return (this._selectWidget != null && !(this._selectWidget.value === "")) ? this._optionsJson.items[this._selectWidget.value].type == "static" : false;
	},
	isTermCodeSelected: function(){
		return (this._selectWidget != null && !(this._selectWidget.value === "")) ? this._optionsJson.items[this._selectWidget.value].type == "term" : false;
	},
	isBlankSelected: function(){
		return (this._selectWidget != null && this._selectWidget.value === "" ) ? true : false;
	},
	
	isValidDate: function(){
		return this._calendarWidget != null ? (this._calendarWidget.isValidDate() && this.isBlankSelected()) : false;
	},
	
	isValidNumber: function(){
		return this._calendarWidget != null ? this._calendarWidget.isValidNumber() : false;
	},
	
	isCorrectlyFilled: function(){
		return (this.isValidDate() || (this.isValidNumber() && this.isTermCodeSelected()) || this.isStaticCodeSelected());
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
		}
	},
	
	////////////////// OVERLOAD GETTER / SETTER METHODS ///////////////////
	
	_setValueAttr: function(/*String*/ newValue){
		this.inherited(arguments);
		if (newValue == "")
		{
			if (this._calendarWidget != null){
				this._calendarWidget.reset();
			}
			if (this._selectWidget != null){
				this._selectWidget.reset();
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
		this.toggleDisabledCalendarField(value);
		this.toggleDisabledSelectField(value);
		this.inherited(arguments);
		this._onChangeCalendar();
		this._onChangeSelect();
	},
	
	_setNumberValue: function(/*String*/ newValue){
		this._numberField.set("value", newValue);
	},
	
	getNumber: function(){
		return this._numberField.get("value");
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



