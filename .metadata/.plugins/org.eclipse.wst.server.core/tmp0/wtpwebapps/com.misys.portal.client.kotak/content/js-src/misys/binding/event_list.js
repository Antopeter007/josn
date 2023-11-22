dojo.provide("misys.binding.event_list");

dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.form.common");
dojo.require("dijit.Tooltip");
dojo.require("misys.widget.Dialog");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	function _validateStartDate()
	{	
		var from = dj.byId('startdate'),
		to = dj.byId('enddate');
		displayMessage = misys.getLocalization('requiredToolTip');
		if((from.get("value") === "") || (from.get("value") === null))
		{
			from.set("state","Error");
			dj.showTooltip(displayMessage, from.domNode, 0);
			hideTT = function() {dj.hideTooltip(from.domNode);};
			setTimeout(hideTT, 1500);
			return false;	
		}
		if(!m.compareDateFields(from, to))
		{
				var widget = from;
				this.invalidMessage = misys.getLocalization('FromDateLesserThanToDate');
			 		widget.set("value", null);
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(this.invalidMessage, widget.domNode, 0);
			return false;
		}	
		return true;
	}
	
	function _validateEndDate()
	{
		var to = dj.byId('enddate'),
		from = dj.byId("startdate");
		displayMessage = misys.getLocalization('requiredToolTip');
		if((to.get("value") === "" ) || (to.get("value") === null ))
		{
			to.set("state","Error");
			dj.showTooltip(displayMessage, to.domNode, 0);
			hideTT = function() {dj.hideTooltip(to.domNode);};
			setTimeout(hideTT, 1500);
			return false;	
			
		}
		if(!m.compareDateFields(from, to)) 
		{
			
			var widget = to;
			this.invalidMessage = misys.getLocalization('ToDateGreaterThanFromDate');
	 		widget.set("value", null);
	 		widget.set("state","Error");
	 		dj.hideTooltip(widget.domNode);
	 		dj.showTooltip(this.invalidMessage, widget.domNode, 0);
	 		return false;
		}
		
		return true;
	}
		d.mixin(m, {
			
			bind : function() {								
				// Check for valid dates
				m.connect("startdate", "onBlur" , function(){
					_validateStartDate();
				});
				m.connect("enddate", "onBlur" , function(){
					_validateEndDate();
				});
			}
		});
	})(dojo, dijit, misys);