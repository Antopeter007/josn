dojo.provide("misys.binding.trade.select_bg");

dojo.require("dijit.form.FilteringSelect");
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
	
	var  _bgNameRegexp = new RegExp("bg_name_section_", "g"),
		
		_bgNameDivs = d.query("div[id^='bg_name_section_']");

	function _toggleGuaranteeSections(){
		// summary
		//	TODO
		
		var bgTypeCode = dj.byId("bg_type_code").get("value"),
			currentBgTypeCode,
			animationType;
		
		d.forEach(_bgNameDivs, function(div) {
			currentBgTypeCode = div.id.replace(_bgNameRegexp, "");
			if(currentBgTypeCode !== bgTypeCode) {
				d.style(div, "display", "none");
			} else {
				m.animate("wipeIn", div);
			}
			//animationType = (currentBgTypeCode === bgTypeCode) ? "wipeIn" : "wipeOut";
			
		});
	}
	
	function _filterGuaranteeSections(){
		// summary:
		//	TODO
		
		var types = "";
		
		d.forEach(_bgNameDivs, function(div) {
			types += "|" + div.id.replace("bg_name_section_", "");
		});
		
		// iterate on bg_type_code options
		// if no names of that type exist on the page, the option will be destroy.
		d.query("> option", dj.byId("bg_type_code").store.root).forEach(function(option){
			if(types.indexOf(option.value) < 0) {
				d.destroy(option);
			} 
		});
	}
	
	function _selectGuarantee(){
		//  summary:
	    //        Calls the confirmation dialog for specific actions.
		//
		//  description:e the XML first. This means that if you click submit 
		//        but cancel the confirmation dialog, the XML is still generated and written to the 
		//        Firebug console, so it 
		//        The behaviour of this function is slightly different in debug mode. In this case, we
		//        parse any bank-side fields and generatcan be used for debugging. 
		
		var guaranteeName = "",
			div,
			guaranteeNameSelect;
		
		d.some(_bgNameDivs, function(div) {
			if(d.style(div, "display") === "block") {
				 guaranteeNameSelect = 
					 dj.byId("bg_name_select_" + div.id.replace(_bgNameRegexp, ""));
				 guaranteeName = guaranteeNameSelect.get("value");
				 return true;
			}
			return false;
		});
		
		if(guaranteeName) {
			dj.byId("realform_featureid").set("value", guaranteeName);
			dj.byId("realform").submit();
		} else {
			m.dialog.show("ERROR", m.getLocalization("mustChooseGuarantee"));
		}
	}
	
	function _cancelGuarantee() {
		document.location.href = m._config.homeUrl;
	}
	
	function _openPopup( /*String*/ url,
			 /*String*/ name,
			 /*String*/ props) {
		// summary:
		//	Opens a new popup window
		//
		// description:
		//		We distinguish between Dialogs, which are in-page overlays (see misys.dialog.*) and
		//		popups, which are simply new windows (see misys.popup.*);
		//
		//		Note: Don't change the popup window name without also changing the SELENIUM
		// 		test; name is used to select the window
		
		var windowName = name || misys.getLocalization("transactionPopupWindowTitle"),
		windowProps = props || "width=800,height=500,resizable=yes,scrollbars=yes",
		popupWindow = d.global.open(url, windowName, windowProps);
		
		console.debug("[misys.common] Opening a standard popup with name", windowName, "at URL", url);
		if(!popupWindow.opener){
		popupWindow.opener = self;
		}
		
		popupWindow.focus();
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		/* Client Code: put in comment the standard code */
		/*
		bind : function() {
			m.connect("bg_type_code", "onChange", _toggleGuaranteeSections);
			m.connect("select_guarantee_button", "onClick", _selectGuarantee);
			m.connect("cancel_guarantee_button", "onClick", _cancelGuarantee);
		},

		onFormLoad : function() {
			// iterate on bg_type_code options
			_filterGuaranteeSections();
			// Show/hide BG guarantee name sections
			_toggleGuaranteeSections();
		},
		*/
		generateDocument : function(/*String*/ type,
				/*String*/ pdfOption,
	            /*String*/ refId, 
	            /*String*/ tnxId, 
	            /*String*/ prodCode, 
	            /*String*/ strFeatureId,
	            /*String*/ companyId) {
			//  summary:
			//         The logic associated with the different actions offered to the user on the page.
			//         Note: option, refId, tnxId and prodCode parameters are only used for PDF
			//         export so far.

			switch(type.toLowerCase()){
			case "bg-document":
				var url = ["/screen/ReportingPopup"];
				url.push("?option=", pdfOption);
				
				url.push("&referenceid=", refId);
				url.push("&tnxid=", tnxId);
				url.push("&featureid=", strFeatureId);
				url.push("&companyId=", companyId);
				url.push("&productcode=", prodCode);
				
				/*if(refId && refId !== "") {
					url.push("&referenceid=", refId);
				}
				if(tnxId && tnxId !== "") {
					url.push("&tnxid=", tnxId);
				}
				url.push("&productcode=", prodCode);
				if(strFeatureId && !(strFeatureId === "")){
					url.push("&featureid=", strFeatureId);
				}
				if(companyId && !(companyId === "")){
					url.push("&companyId=", companyId);
				}*/

				_openPopup(m.getServletURL(url.join(""), null, 
						m.getLocalization("pdfSummaryWindowTitle")));
				break;
			default:
				break;
			}
		}

	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.select_bg_client');