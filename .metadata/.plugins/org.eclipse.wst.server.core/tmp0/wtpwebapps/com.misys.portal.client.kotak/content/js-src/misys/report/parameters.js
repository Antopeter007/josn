dojo.provide("misys.report.parameters");

// dojo.require go here

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions & variables go here

	m._config = m._config || {};
    d.mixin(m._config, {
      isValid : false
    });
	
	d.mixin(m, {
	// Public functions & variables go here
		
		// The logic associated with the different actions offered to the user on the page
		Perform : function(strType) {
		    var xmlString = "<parameters_data>";
		    var theRealForm = document.realform;

		    var arrFormAction = theRealForm.action.split("/");
		    var strScreenName = arrFormAction[arrFormAction.length - 1];

		    if (strType == "save")
		    {
		      if (!fncShowConfirmation(1))
		      {
		        return;
		      }
		    }
		    else if (strType == "cancel")
		    {
		      if (fncShowConfirmation(4))
		      {
		        document.location.href = misys.getServletURL("/screen/" + strScreenName);
		      }
		      return;
		    }
		    else if (strType == "help")
		    {
		      window.open(misys.getServletURL("/screen/DisplayHelp/help_project_id/1/help_section_key/" + g_strLanguageCode + "/help_topic_key/SY_RDPDF", "OnlineHelp", "width=640,height=480,resizable=yes,scrollbars=yes"));
		      return;
		    }
		    else 
		    {
		    	return;
		    }

		    // Scan the forms (except the last one which is always the "real" hidden form)
		    for (j=0;j<document.forms.length;j++) 
		    {
		      for (i=0;i<document.forms[j].length;i++) 
		      {
		        // Update the XML string
		        xmlString = xmlString + fncGenerateEncryptXMLNodeString(document.forms[j].elements[i]);
		      }
		    }
		    // Populate the real form with this string and close the XML contained within
		    theRealForm.TransactionData.value = xmlString + "</parameters_data>";

		    theRealForm.submit();
		  }
	});

	// Onload/Unload/onWidgetLoad Events

})(dojo, dijit, misys);
