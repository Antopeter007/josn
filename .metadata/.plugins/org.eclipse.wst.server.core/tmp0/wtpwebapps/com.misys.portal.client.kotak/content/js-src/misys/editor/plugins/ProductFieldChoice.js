dojo.provide("misys.editor.plugins.ProductFieldChoice");

dojo.require("dijit._editor._Plugin");
dojo.require("dijit._editor.range");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.i18n");

dojo.requireLocalization("misys.editor.plugins", "ProductFieldChoice");

dojo.declare("misys.editor.plugins._ProductFieldDropDown",
	[dijit._Widget, dijit._Templated], {
	// summary:
	//		Dropdown to select a font; goes in editor toolbar.

	// Product for which to select fields
	product: "",

	// label: [public] String
	//		The label to apply to this particular FontDropDown.
	label: "",

	// widgetsInTemplate: [public] boolean
	//		Over-ride denoting the template has widgets to parse.
	widgetsInTemplate: true,

	// plainText: [public] boolean
	//		Flag to indicate that the returned label should be plain text
	//		instead of an example.
	plainText: false,

	// templateString: [public] String
	//		The template used to construct the labeled dropdown.
	templateString:
		"<span style='white-space: nowrap' class='dijit dijitReset dijitInline'>" +
			"<label class='dijitLeft dijitInline' for='${selectId}'>${label}</label>" +
			"<input dojoType='dijit.form.FilteringSelect' required=false labelType=html labelAttr=label searchAttr=name " +
					"tabIndex='-1' id='${selectId}' dojoAttachPoint='select' value=''/>" +
		"</span>",

	// generic: Boolean
	//		Use generic (web standard) font names
	generic: false,

	// command: [public] String
	//		The editor 'command' implemented by this plugin.
	command: "misysEditorPluginsProductFieldChoice",

	postMixInProperties: function(){
		// summary:
		//		Over-ride for the default posr mixin control
		if(!this.values){
			this.values = this.generic ?
				["serif", "sans-serif", "monospace", "cursive", "fantasy"] : // CSS font-family generics
					["Arial", "Times New Roman", "Comic Sans MS", "Courier New"];
		}
		// summary:
		//		Over-ride to mixin specific properties.
		this.inherited(arguments);
	
		this.strings = dojo.i18n.getLocalization("misys.editor.plugins", "ProductFieldChoice");
	
		// Set some substitution variables used in the template
		this.label = this.strings[this.command];
		this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		this.selectId = this.id + "_select";
	
		this.inherited(arguments);
	},

	postCreate: function(){
		// summary:
		//		Over-ride for the default postCreate action
		//		This establishes the filtering selects and the like.

		// Initialize the list of items in the drop down by creating data store with items like:
		// {value: 1, name: "xx-small", label: "<font size=1>xx-small</font-size>" }
		/*var	items = dojo.map(this.values, function(value){
				var name = this.strings[value] || value;
				return {
					label: this.getLabel(value, name),
					name: name,
					value: value
				};
			}, this);*/

		var items = [];
		if (this.product != '' && arrProductColumn[this.product])
		{
			this._availableValues = arrProductColumn[this.product];
			for (var i=0; i<arrProductColumn[this.product].length; i++)
			{
				var column = arrProductColumn[this.product][i];
				if (column && arrColumn[column])
				{
					items.push(
						{
						label: "<div>" + arrColumn[column][1] + "</div>",
						name: arrColumn[column][1],
						value: column
						});
				}
			}
		}
		this.select.store = new dojo.data.ItemFileReadStore({
			data: {
				identifier: "value",
				items: items
			}
		});

		this.select.set("value", "", false);
		this.disabled = this.select.get("disabled");
	},

	getLabel: function(value, name){
		// summary:
		//		Function used to generate the labels of the format dropdown
		//		will return a formatted, or plain label based on the value
		//		of the plainText option.
		// value: String
		//		The 'insert value' associated with a name
		// name: String
		//		The text name of the value
		if(this.plainText){
			return name;
		}else{
			return "<div style='font-family: "+value+"'>" + name + "</div>";
		}
	},

	focus: function(){
		// summary:
		//		Over-ride for focus control of this widget.  Delegates focus down to the
		//		filtering select.
		this.select.focus();
	},

	_getValueAttr: function(){
		// summary:
		//		Allow retreving the value from the composite select on
		//		call to button.get("value");
		return this.select.get('value');
	},

	_setValueAttr: function(value, priorityChange){
		// summary:
		//		Over-ride for the default action of setting the
		//		widget value, maps the input to known values

		priorityChange = priorityChange !== false?true:false;
		/*if(this.generic){
			var map = {
				"Arial": "sans-serif",
				"Helvetica": "sans-serif",
				"Myriad": "sans-serif",
				"Times": "serif",
				"Times New Roman": "serif",
				"Comic Sans MS": "cursive",
				"Apple Chancery": "cursive",
				"Courier": "monospace",
				"Courier New": "monospace",
				"Papyrus": "fantasy"
//					,"????": "fantasy" TODO: IE doesn't map fantasy font-family?
			};
			value = map[value] || value;
		}*/
		//if the value is not a permitted value, just set empty string to prevent showing the warning icon
		priorityChange = priorityChange !== false?true:false;
		this.select.set('value', dojo.indexOf(this.values,value) < 0 ? "" : value, priorityChange);
	},

	_setDisabledAttr: function(value){
		// summary:
		//		Over-ride for the button's 'disabled' attribute so that it can be
		//		disabled programmatically.

		// Save off ths disabled state so the get retrieves it correctly
		//without needing to have a function proxy it.
		this.disabled = value;
		this.select.set("disabled", value);
	}
});


// TODO: for 2.0, split into FontChoice plugin into three separate classes,
// one for each command (and change registry below)
dojo.declare("misys.editor.plugins.ProductFieldChoice", dijit._editor._Plugin,{
	// summary:
	//		This plugin provides three drop downs for setting style in the editor
	//		(font, font size, and format block), as controlled by command.
	//
	// description:
	//		The commands provided by this plugin are:
	//
	//		* fontName
	//	|		Provides a drop down to select from a list of font names
	//		* fontSize
	//	|		Provides a drop down to select from a list of font sizes
	//		* formatBlock
	//	|		Provides a drop down to select from a list of block styles
	//	|
	//
	//		which can easily be added to an editor by including one or more of the above commands
	//		in the `plugins` attribute as follows:
	//
	//	|	plugins="['fontName','fontSize',...]"
	//
	//		It is possible to override the default dropdown list by providing an Array for the `custom` property when
	//		instantiating this plugin, e.g.
	//
	//	|	plugins="[{name:'dijit._editor.plugins.FontChoice', command:'fontName', custom:['Verdana','Myriad','Garamond']},...]"
	//
	//		Alternatively, for `fontName` only, `generic:true` may be specified to provide a dropdown with
	//		[CSS generic font families](http://www.w3.org/TR/REC-CSS2/fonts.html#generic-font-families)
	//
	//		Note that the editor is often unable to properly handle font styling information defined outside
	//		the context of the current editor instance, such as pre-populated HTML.

	// useDefaultCommand: [protected] booleam
	//		Override _Plugin.useDefaultCommand...
	//		processing is handled by this plugin, not by dijit.Editor.
	useDefaultCommand: false,

	_initButton: function(){
		// summary:
		//		Overrides _Plugin._initButton(), to initialize the FilteringSelect+label in toolbar,
		//		rather than a simple button.
		// tags:
		//		protected

		// Create the widget to go into the toolbar (the so-called "button")
		/*var clazz = {
				fontName: dijit._editor.plugins._FontNameDropDown,
				fontSize: dijit._editor.plugins._FontSizeDropDown,
				formatBlock: dijit._editor.plugins._FormatBlockDropDown
			}[this.command],*/
		params = this.params;

		// For back-compat reasons support setting custom values via "custom" parameter
		// rather than "values" parameter
		if(this.params.custom){
			params.values = this.params.custom;
		}

		/*this.button = new clazz(params);*/
		this.button = new misys.editor.plugins._ProductFieldDropDown(params);

		// Reflect changes to the drop down in the editor
		this.connect(this.button.select, "onChange", function(choice){
			// User invoked change, since all internal updates set priorityChange to false and will
			// not trigger an onChange event.
			this.editor.focus();

			/*if(this.command == "fontName" && choice.indexOf(" ") != -1){ choice = "'" + choice + "'"; }

			// Invoke, the editor already normalizes commands called through its
			// execCommand.
			this.editor.execCommand(this.command, choice);*/
			if(choice.indexOf(" ") != -1)
			{
				choice = "'" + choice + "'";
			}
			console.debug("[ProductFieldChoice]  _initButton choice = " + choice);
			var index = -1;
			for(var i=0; i<arrProductColumn[this.product].length; i++)
			{
				if (arrProductColumn[this.product][i] && arrProductColumn[this.product][i] == choice)
				{
					index = i;
					break;
				}
			}
			if (index != -1)
			{
				var displayedValue = '{ ' + arrColumn[arrProductColumn[this.product][index]][1] + ' }';
				console.debug("[ProductFieldChoice]  displayedValue = " + displayedValue);
				//displayedValue = displayedValue.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
				console.debug("[ProductFieldChoice]  escaped displayedValue = " + displayedValue);
				
				var fieldType = arrColumn[arrProductColumn[this.product][index]][0];
				var id = arrProductColumn[this.product][index];
				var html = "&nbsp;<input type='button' disabled='disabled' class='rte-editor-product-field' " + 
							"value=\"" + displayedValue + "\" id='" + id + "' field-type='" + fieldType + "'/>&nbsp;";
				this.editor.execCommand('inserthtml', html);
			}
			this.button.select.set('value', '');
		});
	},
	
	_escapeQuotes: function(text)
	{
		
	}
	
	/*,

	updateState: function(){
		// summary:
		//		Overrides _Plugin.updateState().  This controls updating the menu
		//		options to the right values on state changes in the document (that trigger a
		//		test of the actions.)
		//		It set value of drop down in toolbar to reflect font/font size/format block
		//		of text at current caret position.
		// tags:
		//		protected
		var _e = this.editor;
		var _c = this.command;
		if(!_e || !_e.isLoaded || !_c.length){ return; }
		if(this.button){
			var value;
			try{
				value = _e.queryCommandValue(_c) || "";
			}catch(e){
				//Firefox may throw error above if the editor is just loaded, ignore it
				value = "";
			}

			// strip off single quotes, if any
			var quoted = dojo.isString(value) && value.match(/'([^']*)'/);
			if(quoted){ value = quoted[1]; }

			if(!value && _c === "formatBlock"){
				// Some browsers (WebKit) doesn't actually get the tag info right.
				// So ... lets double-check it.
				var elem;
				// Try to find the current element where the caret is.
				var sel = dijit.range.getSelection(this.editor.window);
				if(sel && sel.rangeCount > 0){
					var range = sel.getRangeAt(0);
					if(range){
						elem = range.endContainer;
					}
				}

				// Okay, now see if we can find one of the formatting types we're in.
				while(elem && elem !== _e.editNode && elem !== _e.document){
					var tg = elem.tagName?elem.tagName.toLowerCase():"";
					if(tg && dojo.indexOf(this.button.values, tg) > -1){
						value = tg;
						break;
					}
					elem = elem.parentNode;
				}
			}

			if(value !== this.button.get("value")){
				// Set the value, but denote it is not a priority change, so no
				// onchange fires.
				this.button.set('value', value, false);
			}
		}
	}*/
});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	/*switch(o.args.name){
	case "fontName": case "fontSize": case "formatBlock":
		o.plugin = new dijit._editor.plugins.FontChoice({
			command: o.args.name,
			plainText: o.args.plainText?o.args.plainText:false
		});
	}*/
	switch(o.args.name){
	case "misys.editor.plugins.ProductFieldChoice":
		o.plugin = new misys.editor.plugins.ProductFieldChoice({product: o.args.product});
		break;
	default:
		break;
	}
});
