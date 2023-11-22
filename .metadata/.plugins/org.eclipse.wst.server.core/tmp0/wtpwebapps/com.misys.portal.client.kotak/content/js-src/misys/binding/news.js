dojo.provide("misys.binding.news");

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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {
	
		bind : function() {
			m.setValidation("start_display_date", m.validateNewsStartDate);
			m.setValidation("end_display_date", m.validateNewsEndDate);
		},
			
		beforeSubmitValidations : function() {
			var descriptionMaxSize = 12000,
		  		textSize = dj.byId("description").get("value").replace(/(<[^>]+>)/g, '').replace(/\n {2,}/g,'').length;
		  	if(textSize > descriptionMaxSize) {
		  		m._config.onSubmitErrorMsg =
		  			m.getLocalization("textareaLinesCharsError", [descriptionMaxSize]);
		  		return false;
		  	}
		  	if(dj.byId("attachment-file") && dj.byId("link").get("value") !== "" && dj.byId("attachment-file").store && dj.byId("attachment-file").store._arrayOfTopLevelItems.length !== 0)
		  	{
			  	m._config.onSubmitErrorMsg = m.getLocalization("tooManyNewsLinksError");
			  	return false;
		  	}

		  	return true;
		}
	});
	d.subscribe('ready',function(){
		//In IE8 WYSIWYG Editor, view won't work,to resolve that below code is added
		if(d.isIE < 9){
			var description = dj.byId("description");
			if(description.value){
				//description.onClick();
				description.execCommand("bold");
				description.undo();
			}
		}		
	});	

})(dojo, dijit, misys);