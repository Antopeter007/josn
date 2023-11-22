dojo.provide("misys.binding.channel");

dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.ToolbarLineBreak");
dojo.require("misys.widget.Collaboration");
dojo.require("dojo.io.iframe");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function validateContent(widget)
	{
		dj.byId('addTopicButton').set('disabled',false);
		var errorMessage= null;
		if(dj.byId(widget))
		{
			var widgetContent = dj.byId(widget).get("value");
			widgetContent = widgetContent.toLowerCase();
			if((widgetContent.indexOf("<") != -1) || (widgetContent.indexOf(">") != -1) || (widgetContent.indexOf("(") != -1) || (widgetContent.indexOf(")") != -1) || (widgetContent.indexOf("javascript") != -1) || (widgetContent.indexOf("vbscript") != -1) || (widgetContent.indexOf("script") != -1) || (widgetContent.indexOf(";") != -1))
			{
				errorMessage =  m.getLocalization("invalidContent");
				// dj.byId(widget).focus();
				dj.byId(widget).set("state","Error");
				dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
				dj.byId('addTopicButton').set('disabled',true);
				var hideTT = function() {
					dj.hideTooltip(dj.byId(widget).domNode);
				};
				setTimeout(hideTT, 1500);
				return false;
			}
		}
		dj.byId("link_offsetcode_nosend").focus();
		return true;
	}
	
	function validateContentHttp(widget)
	{
		dj.byId('addTopicButton').set('disabled',false);
		var errorMessage= null;
		var expression = "^(http[s]?:\/\/){1}([a-zA-Z0-9]+[\.]{1})[a-zA-Z0-9]+";
		var re = new RegExp(expression);
		if(dj.byId(widget))
		{
			var widgetContent = dj.byId(widget).get("value");
			widgetContent = widgetContent.toLowerCase();
			if((widgetContent.indexOf("<") != -1) || (widgetContent.indexOf(">") != -1) || (widgetContent.indexOf("(") != -1) || (widgetContent.indexOf(")") != -1) || (widgetContent.indexOf("javascript") != -1) || (widgetContent.indexOf("vbscript") != -1) || (widgetContent.indexOf("script") != -1) || (widgetContent.indexOf(";") != -1))
			{
				errorMessage =  m.getLocalization("invalidContent");
				// dj.byId(widget).focus();
				dj.byId(widget).set("state","Error");
				dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
				dj.byId('addTopicButton').set('disabled',true);
				var hideTT = function() {
					dj.hideTooltip(dj.byId(widget).domNode);
				};
				setTimeout(hideTT, 1500);
				return false;
			}
			
			if((widgetContent != '') && (!re.test(widgetContent))){
				
				errorMessage =  m.getLocalization("invalidContentHttps");
				// dj.byId(widget).focus();
				dj.byId(widget).set("state","Error");
				dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
				dj.byId('addTopicButton').set('disabled',true);
				var hideTT1 = function() {
					dj.hideTooltip(dj.byId(widget).domNode);
				};
				setTimeout(hideTT1, 1500);
				return false; 
			}
		}
	}
	
	
	
	d.mixin(m, {
		
		
		bind : function() {
			m.connect("title_offsetcode_nosend","onBlur",
					function(){
				validateContent("title_offsetcode_nosend");
					});
			m.connect("link_offsetcode_nosend","onBlur",
					function(){
				validateContentHttp("link_offsetcode_nosend");
					});
			m.connect("channel_name", "onBlur",function(){
				validateContent("channel_name");
			});
			
		},
		beforeSubmitValidations : function()
	    {
			return validateContent("channel_name");
	    }
	});
		
		
	})(dojo, dijit, misys);