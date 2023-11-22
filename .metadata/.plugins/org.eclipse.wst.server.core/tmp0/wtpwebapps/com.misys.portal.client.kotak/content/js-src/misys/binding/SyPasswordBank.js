dojo.provide("misys.binding.SyPasswordBank");
/*jsl:ignoreall*/
// Copyright (c) 2000-2010 Misys (http://www.misys.com),
// All Rights Reserved. 

  // Define an array which will store the name of the mandatory fields
  // and the form they are in
  arrMandatoryFields = new Array();

  arrMandatoryFields["fakeform1"] = new Array();

  arrMandatoryFields["fakeform1"][1] = new Array();
  arrMandatoryFields["fakeform1"][1].name = "old_password_value";
  arrMandatoryFields["fakeform1"][1].mandatory = true;
  arrMandatoryFields["fakeform1"][2] = new Array();
  arrMandatoryFields["fakeform1"][2].name = "password_value";
  arrMandatoryFields["fakeform1"][2].mandatory = true;
  arrMandatoryFields["fakeform1"][3] = new Array();
  arrMandatoryFields["fakeform1"][3].name = "password_confirm";
  arrMandatoryFields["fakeform1"][3].mandatory = true;

  // The logic associated with the different actions offered to the user on the page
  function fncPerform(strType){
    var xmlString = "<static_user>";
    var theRealForm = document.realform;

    var arrFormAction = theRealForm.action.split("/");
    var strScreenName = arrFormAction[arrFormAction.length - 1];

    if(strType == "save")
    {
	    
      if(fncShowConfirmation(1))
	  	{
	  	  // Check if the password is being changed
	  	  if(document.forms['fakeform1'].change_password)
	  	  {
	        if(document.forms["fakeform1"].change_password.checked) 
	        {
      	    // Make minimum checking on the password
      	    if(!misys.validatePassword(document.forms['fakeform1'].password_value))
      	    	return;
	    
	          arrMandatoryFields["fakeform1"][1].mandatory = true;
	          arrMandatoryFields["fakeform1"][2].mandatory = true;
	          arrMandatoryFields["fakeform1"][3].mandatory = true;
	        }
	        else
	        {
	          arrMandatoryFields["fakeform1"][1].mandatory = false;
	          arrMandatoryFields["fakeform1"][2].mandatory = false;
	          arrMandatoryFields["fakeform1"][3].mandatory = false;
	        }
	  	  }
	  	  // Restore default values (yes)
	  	  else
	  	  {
          arrMandatoryFields["fakeform1"][1].mandatory = true;
          arrMandatoryFields["fakeform1"][2].mandatory = true;
          arrMandatoryFields["fakeform1"][3].mandatory = true;
	  	  }
	  	  
        // We browse through the mandatory fields array to perform the checking
        for(var i in arrMandatoryFields) 
        {
          // We check that the form exists
          if(dojo.eval("document.forms['" + i + "']"))
          {
            for(j=1;j<arrMandatoryFields[i].length;j++) 
            {
              // We check if the field exist and if it is mandatory
              if(dojo.eval("document.forms['" + i + "']." + arrMandatoryFields[i][j].name) && (arrMandatoryFields[i][j].mandatory))
              {
                if("S" + dojo.eval("document.forms['" + i + "']." + arrMandatoryFields[i][j].name).value == "S") 
                {
                  fncShowError(13); 
                  dojo.eval("document.forms['" + i + "']." + arrMandatoryFields[i][j].name).focus();
                  var strStyle = "";
                  if(!NS4) strStyle = ".style";
                  dojo.eval("document.forms['" + i + "']." + arrMandatoryFields[i][j].name + strStyle).color = "white";
                  dojo.eval("document.forms['" + i + "']." + arrMandatoryFields[i][j].name + strStyle).background = "blue";
                  return;
                } 
                
              }
            }            
          }
        }
      }
      else 
        return;
    }
    else if(strType == "cancel")
    {
      if(fncShowConfirmation(4))
        document.location.href = misys.getServletURL("/screen/" + strScreenName);
      return;
    }
    else return;

    // Scan the main form
    var theFakeForm = document.fakeform1;
    for(var i=0;i<theFakeForm.length;i++)
    {
      // Update the XML string
      xmlString = xmlString + misys.fieldToXML(theFakeForm.elements[i]);
    }

    // Populate the real form with this string and close the XML contained within
    theRealForm.TransactionData.value = xmlString + "</static_user>";

    theRealForm.submit();
  }

