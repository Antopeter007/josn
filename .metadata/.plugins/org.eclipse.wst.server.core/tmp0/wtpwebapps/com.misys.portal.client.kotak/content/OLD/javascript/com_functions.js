// Copyright (c) 2000-2005 NEOMAlogic (http://www.neomalogic.com),
// All Rights Reserved. 

  var NS4 = (document.layers) ? 1 : 0;
  var IE4 = (document.all) ? 1 : 0;
  var ver4 = (NS4 | IE4);
  var VER5UP = (document.getElementById) ? 1 : 0;

  // The variable storing the Popup Window object for the Static Data search
  var objPopList = null;

  // A temporary object to handle the focus
  var objNextFocus = null;

  // The variable storing the temporary copy of fields (needed for the dynamic display of elements)
  var arrFieldsCopies = new Array();

  // Define a function common to IE4+ and NS6 to find and return an object
  function fncGetElement(strElementId) 
  {
    if (IE4) 
      return document.all(strElementId);
    else if (VER5UP) 
      return document.getElementById(strElementId);
  }

  // Enhance the default focus() function by using a timer
  function fncSetFocus(theObj)
  {
      objNextFocus = theObj;
      setTimeout( "objNextFocus.focus()",1);
  }

  // Show the selected Tab and hide all the other layers of the same group.
  // The Tab Type is taking a value from 1 to 4 in accordance with the array arrTabs, 
  // and the prefix and suffix are the strings attached to the id of the object whose content 
  // determines if the tab has been populated or not.
  function fncShowTab(intTabType, strTabName, strPrefix, strSuffix, strForm)
  {
    // In case
    if (objPopList) 
    {
      if (!(objPopList.closed))
      {
        objPopList.close();
      }
      objPopList = null;
    }
    // We hide all the tabs, knowing that the root names of the banks are kept in the
    // first record of the arrTabs array
    for (var i=1;  i< arrTabs[intTabType].length; i++) 
    {
      fncGetElement("div_" + arrTabs[intTabType][i]).style.display = "none";
      if (strForm)
      {
      	// Manage the case when the mandatory fields are not the same in the two parts.
        if ( "S" + document.forms[strForm].elements[strPrefix + arrTabs[intTabType][i] + strSuffix].value != "S")
      	{
        	fncGetElement("cell_" + arrTabs[intTabType][i]).style.backgroundImage = "url(/content/images/tab_off_sel.gif)";
      	}
      	else 
      	{
        	fncGetElement("cell_" + arrTabs[intTabType][i]).style.backgroundImage = "url(/content/images/tab_off.gif)";
      	}
      }
      else
      {
      	if ("S" + document.forms["form_" + arrTabs[intTabType][i]].elements[strPrefix + arrTabs[intTabType][i] + strSuffix].value != "S")
      	{
        	fncGetElement("cell_" + arrTabs[intTabType][i]).style.backgroundImage = "url(/content/images/tab_off_sel.gif)";
      	}
      	else 
      	{
        	fncGetElement("cell_" + arrTabs[intTabType][i]).style.backgroundImage = "url(/content/images/tab_off.gif)";
      	}
      }
    }
    // And we show the tab of the selected bank
    fncGetElement("div_" + strTabName).style.display = "block";
   	if(strForm)
   	{
   	  if ("S" + document.forms[strForm].elements[strPrefix + strTabName + strSuffix].value != "S") 
      {
        fncGetElement("cell_" + strTabName).style.backgroundImage = "url(/content/images/tab_on_sel.gif)";
      }
      else 
      {
        fncGetElement("cell_" + strTabName).style.backgroundImage = "url(/content/images/tab_on.gif)";
      }
   	}
   	else
   	{
    	if ("S" + document.forms["form_" + strTabName].elements[strPrefix + strTabName + strSuffix].value != "S") 
    	{
      		fncGetElement("cell_" + strTabName).style.backgroundImage = "url(/content/images/tab_on_sel.gif)";
    	}
    	else 
    	{
      		fncGetElement("cell_" + strTabName).style.backgroundImage = "url(/content/images/tab_on.gif)";
    	}
  	}
  }

  // Set the image of the tab based on the content of the filename input field
  function fncSetSelectTab(strText, strTabName) 
  {
    fncGetElement("cell_" + strTabName).style.backgroundImage = ("S" + strText != "S") 
                                                                ? "url(/content/images/tab_on_sel.gif)" 
                                                                : "url(/content/images/tab_on.gif)";
  }

  // Function used to restore the normal background and color of the input fields.
  // This function is attached to all mandatory fields.
  function fncRestoreInputStyle(strFormName, strFieldName) 
  {
    // Trim the leading spaces
    eval("document.forms['" + strFormName + "'].elements['" + strFieldName + "']").value = eval("document.forms['" + strFormName + "'].elements['" + strFieldName + "']").value.replace(/^\s/,"");
    // Restore the style 
    var strStyle = ""
    if (!NS4) strStyle = ".style";
    eval("document.forms['" + strFormName + "'].elements['" + strFieldName + "']" + strStyle).color = "black";
    eval("document.forms['" + strFormName + "'].elements['" + strFieldName + "']" + strStyle).background = "white";
  }

  // Take the element of a form and returns the related XML node string
  function fncGenerateXMLNodeString(objFormElement) 
  {
    var strXMLNode = "";

    if (objFormElement.type == "radio")
    {
      if (objFormElement.checked)
      {
        strXMLNode = "<" + objFormElement.name + ">" + fncNormalizeXML(objFormElement.value) + "</" + objFormElement.name + ">";
      }
    }
    else if (objFormElement.type == "checkbox")
    {
      if (objFormElement.checked)
      {
        strXMLNode = "<" + objFormElement.name + ">Y</" + objFormElement.name + ">";
      }
      else
      {
        strXMLNode = "<" + objFormElement.name + ">N</" + objFormElement.name + ">";
      }
    }
    else if (objFormElement.type == "select-multiple") 
    {
      for (k=0;k<objFormElement.options.length;k++) 
      {
        strXMLNode = strXMLNode+"<" + objFormElement.name + ">" + fncNormalizeXML(objFormElement.options[k].value) + "</" + objFormElement.name + ">";
      } 
    }
    else
    {
      // Update the XML string
      strXMLNode = "<" + objFormElement.name + ">" + fncNormalizeXML(objFormElement.value) + "</" + objFormElement.name + ">";
    }
    
    return strXMLNode;
  }

  // Take the element of a form and returns the related XML node string
  // whose content is eventually encrypted depending on the object.
  // For GTP instances not requiring the encryption facility, the whole
  // body of this function must be replaced by a single line:
  //   return fncGenerateXMLNodeString(objFormElement);
  function fncGenerateEncryptXMLNodeString(objFormElement) 
  {
    return fncGenerateXMLNodeString(objFormElement);
  }

  // Normalize a string according to XML formatting rules
  function fncNormalizeXML(strInputString) 
  {
    var strOutputString = "";
    if (strInputString)
    {
      for (var i=0; i<strInputString.length; i++) 
      {
        var oneChar = strInputString.charAt(i);
        switch (oneChar) 
        {
          case '<': 
              strOutputString = strOutputString + "&lt;";
              break;
          case '>': 
              strOutputString = strOutputString + "&gt;";
              break;
          case '&': 
              strOutputString = strOutputString + "&amp;";
              break;
          case '"': 
              strOutputString = strOutputString + "&quot;";
              break;
          default:
              strOutputString = strOutputString + oneChar;
              break;
        }
      }
    }
    return strOutputString;
  }
 
  // Validate the content of the specified field against the SWIFT character set.
  // The logic is applied only if the global variable g_blnSWIFTChecking is set to true.
  // A specific logic is needed when dealing with tabs, and the related tab details
  // are therefore passed through the theTabReference object.
  function fncValidateSWIFTCharacter(theObj, strAdvSendMode, theTabReference) 
  {
    var strValidCharacters = "\r\n 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,'+";
    if (g_blnSWIFTChecking && (strAdvSendMode == "01") 
	//var strValidCharacters;  
	//if (strAdvSendMode == "01") //SWIFT
    // strValidCharacters = "\r\n 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,'+";
    //else if(strAdvSendMode == "02")  //Telex
    //	strValidCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'()+,-./:=? \r\n";
    //if (g_blnSWIFTChecking && ((strAdvSendMode == "01")||(strAdvSendMode == "02")) 
        && (theObj.type != "radio") 
        && (theObj.type != "checkbox")
        && (theObj.type != "select-multiple")
        && (theObj.type != "select-one")
        && (theObj.type != "hidden")
        && (theObj.type != "file")
        && (theObj.name != "entity")) 
    {
      if ("free_format_text" != theObj.name
      		&& "bo_comment" != theObj.name)
      {
      for (i = 0; i < theObj.value.length; i++) 
      {
        if (strValidCharacters.indexOf(theObj.value.charAt(i)) < 0)
        {
        	// Tabulation
        	if (theObj.value.charCodeAt(i) == 9)
        		fncShowError(88);
        	else
			          	fncShowError(26,theObj.value.charAt(i));
          if (!NS4)
          {
            if (theTabReference) 
            {
              if (theTabReference.tabType) 
              {
                fncShowTab(theTabReference.tabType, 
                           theTabReference.tabName, 
                           theTabReference.tabPrefix, 
                           theTabReference.tabSuffix); 
              }
            }
            theObj.style.color = "white";
            theObj.style.background = "blue";
          }
          else
          {
            theObj.color = "white";
            theObj.background = "blue";
          }
          theObj.focus();
          return false;
        }
      }
    }
    }
    return true;
  }

  // Function to format the content of a textarea and check that its content is within
  // its defined boundaries
  function fncFormatTextarea(theObj, intMaxLines, intMaxCols)
  {
    var strInput = theObj.value;
    var strResult = "";

    var intCountCol = 0;
    var intCountRow = 0;
    var intPosLastSpace = -1;
    var blnNewRow = false;

    // We remove any trailing carriage return line feed at then end of the text
    // respectively for IE and Mozilla/Netscape
    strInput = strInput.replace(/(\r\n)+$/,"");
    strInput = strInput.replace(/(\n)+$/,"");

    for (k=0; k<strInput.length; k++)
    {
      strCurrentChar = strInput.charAt(k);
      // If the character is a carriage return or newline, we copy it 
      // and reset the line counter
      if ((strCurrentChar == "\r") || (strCurrentChar == "\n"))
      {
        strResult += "\n";
        intCountCol = 0;
        intCountRow++;
        blnNewRow = true;
        // Reset the position of the last space
        intPosLastSpace = -1;
        // If the character is a carriage return (IE), it will be followed by 
        // a linefeed and hence we let the counter k jump by one
        if (strCurrentChar == "\r") k++;
      }
      // If the counter is equal to the maximum number of characters per line,
      // we retrieve the position of the previous blank space and add a carriage 
      // return right after it.
      // we insert a carriage return before the character and reset the counter:
      else if (intCountCol == intMaxCols)
      {
        // If no space has so far been encountered we simply add a carriage return here
        if (intPosLastSpace == -1) 
        {
          strResult += "\n";
          intCountCol = 1;
        }
        else 
        {
          strResult = strResult.slice(0,strResult.length-(k-intPosLastSpace)+1) 
                      + "\n" 
                      + strResult.slice(strResult.length-(k-intPosLastSpace)+1);
          intCountCol = k-intPosLastSpace;
        }
        strResult += strCurrentChar;
        intCountRow++;
        blnNewRow = true;
        // Reset the position of the last space
        intPosLastSpace = -1;
      }
      // Otherwise we simply copy the character and increment the counter:
      else
      {
        strResult += strCurrentChar;
        intCountCol++;
        blnNewRow = false;
      }

      // If the current character is a space, we store its position
      if (strCurrentChar == " ") intPosLastSpace = k;

      // If the column counter is null, it means that the carriage returned
      // has been added. In such a case, we test if the current number of 
      // rows is exceeding the maximum allowed:
      if (blnNewRow)
      {
        if (intCountRow == intMaxLines)
        {
          fncShowError(14, intMaxLines);
          theObj.select();
          theObj.focus();
          return false;
        }
      }
    }

    // Test if the size of the result string is exceeding the maximum (include
    // the eventual linefeed to determine the maximum)
    if (strResult.length > eval(eval(intMaxLines * intMaxCols) + intCountRow))
    {
      fncShowError(15, intMaxLines, intMaxCols);
      theObj.select();
      theObj.focus();
      return false;
    }
    else
    {
      theObj.value = strResult;
      return true;
    }

  }

  // Return the number of lines of existing text in a Textarea object
  function fncTextAreaNbLines(theObj) 
  {
    var strInput = theObj.value;
    var intCountRow = 1;
    for (k = 0; k < strInput.length; k++) 
    {
      if (strInput.charAt(k) == "\n") 
      {
        intCountRow++;
      }
    }
    return intCountRow;
  }

  // Return the object value without CRLF. Use to compare texarea
  function fncCutCRLF(theObj)
  {
  	var strInput = theObj.value;
    var strResult = "";
    for (k=0; k<strInput.length; k++)
    {
      strCurrentChar = strInput.charAt(k);
             
     	if ((strCurrentChar != "\r") && (strCurrentChar != "\n"))
      {
        strResult += strCurrentChar;
      }
    }
    
    return strResult;
  }
 

  // Open a popup window to perform the search in the available list of records
  // whose type is passed as a parameter('bank', 'beneficiary', 'phrase', 'account', 'currency', ...)
  // The screen can also be given as parameter.
  function fncSearchPopup(strType, strFormName, strFieldObjectsArray, strParameter, strScreen) 
  {
    fncSearchPopup(strType, strFormName, strFieldObjectsArray, strParameter, strScreen, '');
  }

  // Open a popup window to perform the search in the available list of records
  // whose type is passed as a parameter('bank', 'beneficiary', 'phrase', 'account', 'currency', ...)
  // The screen can also be given as parameter.
  function fncSearchPopup(strType, strFormName, strFieldObjectsArray, strParameter, strScreen, strProduct) 
  {
    var url = "";
    if (strScreen)
	    url = "/gtp/screen/" + strScreen + "?option=" + strType + "&formname=" + strFormName + "&fields=" + strFieldObjectsArray + "&parameter=" + strParameter;
	  else
    	url = "/gtp/screen/StaticDataListPopup?option=" + strType + "&formname=" + strFormName + "&fields=" + strFieldObjectsArray + "&parameter=" + strParameter;

		if (strProduct != '')
			url = url + "&productcode=" + strProduct;
		
		objPopList = window.open(url, "search" + strType, "width=640,height=480,resizable=yes,scrollbars=yes");

    if (objPopList.opener == null)
      objPopList.opener = self;
    objPopList.focus();    
  }
  
  // Open a popup window to perform the search in the available list of entity records
  // The screen can also be given as parameter.
  function fncEntityPopup(strEntity, strFormName, strFieldObjectsArray, strProduct, strResetFormName, strResetFieldObjectsArray, strEntityContext, strCompany) 
  {
    var url = "/gtp/screen/EntityListPopup?entityfield=" + strEntity ;
    if (strFormName && "S"+strFormName != "S") url = url+ "&formname=" + strFormName;
    if (strFieldObjectsArray && "S"+strFieldObjectsArray != "S") url = url+ "&fields=" + strFieldObjectsArray; 
    if (strProduct && "S"+strProduct != "S") 
		url = url+ "&productcode=" + strProduct; 
    else
    	url = url+ "&productcode=*";     
    if (strResetFormName && "S"+strResetFormName != "S") url = url+ "&resetformname=" + strResetFormName; 
    if (strResetFieldObjectsArray && "S"+strResetFieldObjectsArray != "S") url = url+ "&resetfields=" + strResetFieldObjectsArray; 
    if (strEntityContext && "S"+strEntityContext != "S") url = url+	"&entitycontext=" + strEntityContext;
    if (strCompany && "S"+strCompany != "S") url = url + "&company=" + strCompany;
    
    objPopList = window.open(url, "search" + strEntity, "width=740,height=480,resizable=yes,scrollbars=yes");
		
    if (objPopList.opener == null)
    {
      objPopList.opener = self;
    }
    objPopList.focus();    
  }
  

  // Open a popup window to perform the search in the available list of entity records (dedicated to list search pattern)
  function fncShowEntities(strEntityName, strFormName, strProduct) 
  {
    var url = "/gtp/screen/EntityListPopup?entityfield=" + strEntityName ;
    if ("S"+strFormName != "S") url = url+ "&formname=" + strFormName;
    if ("S"+strProduct != "S") url = url+ "&productcode=" + strProduct; 
    
    url = url+	"&entitycontext=LISTPATTERN";
    
    objPopList = window.open(url, "search" + strEntityName, "width=840,height=580,resizable=yes,scrollbars=yes");
		
    if (objPopList.opener == null)
    {
      objPopList.opener = self;
    }
    objPopList.focus();    
  }
  
  // Open a popup window to perform the search in the available list of template records (dedicated to list search pattern)
  function fncTemplatePopup(strProductCode, strFormName, entity, strFieldObjectsArray) 
  {
    var url = "/gtp/screen/BaseLineListPopup?option=template&productcode=" + strProductCode;
    if ("S" + strFormName != "S") url = url+ "&formname=" + strFormName + "&entity=" + entity;
    if (strFieldObjectsArray && "S" + strFieldObjectsArray != "S") url = url+ "&fields=" + strFieldObjectsArray; 
    
    objPopList = window.open(url, "search" + strProductCode, "width=840,height=580,resizable=yes,scrollbars=yes");
		
    if (objPopList.opener == null)
    {
      objPopList.opener = self;
    }
    objPopList.focus();    
  }  

  // Function used to populate the content of a layer with a string (eventually HTML formatted)
  function fncInnerHTML(strFormName, strLayerName, strLayerContent) 
  {
    if (IE4)
    {
       var theLayer = document.all[strLayerName];
       theLayer.innerHTML = strLayerContent;
    } 
    else if (VER5UP) 
    {
       var theLayer = document.getElementById(strLayerName);
       theLayer.innerHTML = strLayerContent;
    } 
    else if (NS4) 
    {
       var theLayer = document.forms[strFormName].document.layers[strLayerName].document;
       theLayer.open();
       theLayer.write(strLayerContent);
       theLayer.close();
    }
  }

  // Cross-browser way of getting the style
  function fncGetDivStyle(divname) 
  {
    var style;
    if (VER5UP) 
    { 
      style = document.getElementById(divname).style; 
    }
    else 
    {
      style = IE4 ? document.all[divname].style : document.layers[divname]; 
    }
    return style;
  }

  // Show the transaction details on the bank reporting side
  function fncEditTransactionDetails() 
  {
    if (fncGetDivStyle("divTransactionDetails").display != "block") 
    {
      if (fncShowConfirmation(5)) 
      {
        top.location = "#EditTransactionDetails";
        fncGetDivStyle("divTransactionDetails").display = "block";
      }
    }
    else
    {
      fncGetDivStyle("divTransactionDetails").display = "none";
    }
  }

  // Show the transaction details (bank reporting, document folder, ...)
  function fncEditTemplateDetails() 
  {
    if (!NS4)
    {
      if (fncGetDivStyle("divTransactionDetails").display != "block") 
      {
        if (fncShowConfirmation(18)) 
        {
          fncGetDivStyle("divTransactionDetailsEnabling").display = "none";
          top.location = "#HideTransactionDetails";
          fncGetDivStyle("divTransactionDetails").display = "block";
        } 
      }
    }
    else
    {
      if (fncGetDivStyle("divTransactionDetails").visibility != "visible") 
      {
        if (fncShowConfirmation(18)) 
        {
          if (fncGetDivStyle("divTransactionDetailsEnabling").visibility != "hidden") 
          {
            fncGetDivStyle("divTransactionDetailsEnabling").visibility = "hidden";
            fncGetDivStyle("divTransactionDetailsEnabling").position = "absolute";
          }
          top.location = "#HideTransactionDetails";
          fncGetDivStyle("divTransactionDetails").visibility = "visible";
          fncGetDivStyle("divTransactionDetails").position = "static";
        }
      }
    }
  }
  
  // Hide the transaction details (bank reporting, document folder, ...)
  function fncHideTemplateDetails() 
  {
    if (!NS4)
    {
      if (fncGetDivStyle("divTransactionDetails").display != "none") 
      {
        if (fncShowConfirmation(19)) 
        {
          top.location = "#top";
          fncGetDivStyle("divTransactionDetails").display = "none";
          fncGetDivStyle("divTransactionDetailsEnabling").display = "block";
        }
      }
    }
    else
    {
      if (fncGetDivStyle("divTransactionDetails").visibility != "hidden") 
      {
        if (fncShowConfirmation(19)) 
        {
          top.location = "#top";
          fncGetDivStyle("divTransactionDetails").visibility = "hidden";
          fncGetDivStyle("divTransactionDetails").position = "absolute";
        } 
        if (fncGetDivStyle("divTransactionDetailsEnabling").visibility != "visible") 
        {
          fncGetDivStyle("divTransactionDetailsEnabling").visibility = "visible";
          fncGetDivStyle("divTransactionDetailsEnabling").position = "static";
        }
      }
    }
  }

  // The target screen is eventually passed.
  function fncShowReporting(strType, strProductCode, strRefId, strTnxId, strScreen) 
  {
	  var objPopReporting; 
    var strParamTnxId = "";
    // Default reporting screen is ReportingPopup
    var strParamScreen = "ReportingPopup";
    if (strTnxId) 
      strParamTnxId = "&tnxid=" + strTnxId;
    // Use the target screen if passed
    if (strScreen) 
      strParamScreen = strScreen;
		objPopReporting = window.open("/gtp/screen/" + strParamScreen + "?option=" + strType + "&referenceid=" + strRefId + strParamTnxId + "&productcode=" + strProductCode,"","width=640,height=480,resizable=yes,scrollbars=yes");
    if (objPopReporting.opener == null) 
      objPopReporting.opener = self;
    objPopReporting.focus(); 
  }

  // Open a popup window showing the details of an unsigned transaction 
  // record. This is used for Preview and Print purposes. The localization
  // code INFO_MSG_PREVIEW_UNCONTROLLED is used to provide additional information
  // in the popup window.
  // The target screen is eventually passed.
  function fncShowPreview(strType, strProductCode, strRefId, strTnxId, strScreen) 
  {
	  var objPopPreview; 
    var strParamTnxId = "";
    // Default reporting screen is ReportingPopup
    var strParamScreen = "ReportingPopup";
    if (strTnxId) 
      strParamTnxId = "&tnxid=" + strTnxId;
    // Use the target screen if passed
    if (strScreen) 
      strParamScreen = strScreen;
	objPopPreview = window.open("/gtp/screen/" + strParamScreen + "?option=" + strType + "&titlecode=INFO_MSG_PREVIEW_UNCONTROLLED&referenceid=" + strRefId + strParamTnxId + "&productcode=" + strProductCode,"","width=640,height=480,resizable=yes,scrollbars=yes");
    if (objPopPreview.opener == null) 
      objPopPreview.opener = self;
    objPopPreview.focus(); 
  }
  
  // Mark all the records when the global selection box is clicked upon (default = TopForm)
  function fncSelectAllRecords(strFormName)
  {
    if (!strFormName)
    	strFormName = 'TopForm';
    
    var theForm = document.forms[strFormName];
    var blnChecked = theForm.elements["select_all_box"].checked;
    
    // Scan the form containing the list
    for (i=0;i<theForm.length;i++)
    {
      if ((theForm.elements[i].type == "checkbox") && (theForm.elements[i].name != "select_all_box"))
      {
        theForm.elements[i].checked = blnChecked;
      }
    }
  }
  
  // Reset the global selection box if a record is unchecked
  // and the checkbox of the selected group if needed
  function fncCheckSelectAll(theObj, strFormName)
  {
    if (!strFormName)
    	strFormName = 'TopForm';
    	    
    theForm = document.forms[strFormName];
	 // Number of checkbox checked      
    nbChecked = 0;
    
    if (!theObj.checked)
    {
      // Uncheck the global checbox
      theForm.elements["select_all_box"].checked = false;  
      //
      // Group managment
      //    
      // The index of the group (value that allows to gather a collection of record).
      // Get the group id of the record
      // Note the code below assumes that the last element of the object name is the groupId
      var aGroupId = theObj.name.substring(theObj.name.lastIndexOf("_") + 1);
      var regExp =  new RegExp("[0-9]{1}[0-9]*" ,"g");
      if (regExp.test(aGroupId))
   		 {
        regExp = new RegExp(".*_" + aGroupId,"");    
   		
   		// Scan the form containing the list
        for (i=0;i<theForm.length;i++)
      {
          if (theForm.elements[i].type == "checkbox"	&& theForm.elements[i].name.indexOf("select_box_") == -1 
         	  && regExp.test(theForm.elements[i].name) && theForm.elements[i].checked)
        {
          nbChecked++;
            break; // Exit since there is at least one record checked in the current group
    }
  }

      	// Check the number of checkbox checked
     	if (nbChecked == 0)
     	{
       	  // Reset the group checkbox
       	  if(theForm.elements["select_box_" + aGroupId])
        {
  					theForm.elements["select_box_" + aGroupId].checked = false;   
          }        
       	}    	  
     	}		 
    }
  }
  
  // Check/Uncheck all the records when the group selection box is clicked upon
  // @param theObj the cliecked checkbox
  // @param strFormName the name of the form
  // Note the code below assumes that the last element of the object name is the groupId
  function fncSelectRecordGroups(theObj, strFormName)
  {
    
    if (!strFormName)
    	strFormName = 'TopForm';
    	
    theForm = document.forms[strFormName];    	
    		    
    // Get the record group id from the form field name
    // pattern is [field_name]_[index]
    index = theObj.name.substring(theObj.name.lastIndexOf("_") + 1);
    
    blnChecked = theForm.elements[theObj.name].checked;
    
    // Update the checked status of the select_all_box checkbox
    if (!blnChecked)
    {
      theForm.elements["select_all_box"].checked = false;      
    }
    
    // Pattern of fields that can exist in the form when
    // the elements of the list is grouped.
    var regExp = new RegExp(".*_" + index + "$","");
            
    // Scan the form containing the list
    for (i=0;i<theForm.length;i++)
    {
      // Reset all fields associated with the current group
      if(regExp.test(theForm.elements[i].name) && theForm.elements[i].type == "text" && !blnChecked)
   		{
   		  theForm.elements[i].value='';
   		}
   		// Update the check box status that allows to select a record
   		else if (regExp.test(theForm.elements[i].name) && theForm.elements[i].type == "checkbox")
      {
   		  theForm.elements[i].checked = blnChecked;  		  
      }
    }
  }
  
  // Trigger the deletion/submission/initiation of transaction records
  function fncConcatCheckboxes(intMessageCode) 
  {
    // The list of keys specifying the records to concat (whether ref_ids, tnx_ids or product code)
    var strListKeys = "";
    var intNbKeys = 0;

    var theTopForm = document.TopForm;
    var theRealForm = document.RealForm;

    // Scan the form containing the list
    for (i=0;i<theTopForm.length;i++)
    {
      if ((theTopForm.elements[i].type == "checkbox") && (theTopForm.elements[i].name != "select_all_box"))
      {
        if (theTopForm.elements[i].checked)
	      {
          // If this is not the first element in the list, we add a comma separator
          if ("S" + strListKeys != "S") strListKeys = strListKeys + ", ";
          // And then we add the key (name of the checkbox) related to the record
          strListKeys = strListKeys +  theTopForm.elements[i].name ;
          intNbKeys++;
	      }
      }
    }

    // If the list is not empty (some records need to be deleted or submitted), 
    // we post the form with the list as a parameter
    if ("S" + strListKeys != "S")
    {
        if (fncShowConfirmation(intMessageCode,intNbKeys))
        {
          theRealForm.list_keys.value = strListKeys;
          theRealForm.submit();
        }
    }
  }

  // Trigger the deletion of transaction records
  function fncDeleteRecords() 
  {
    fncConcatCheckboxes(6);
  }

  // Trigger the load of records
  function fncLoadRecords() 
  {
    fncConcatCheckboxes(25);
  }
  
  // Trigger the submission of transaction records
  function fncSubmitRecords() 
  {
    fncConcatCheckboxes(22);
  }
  
  // Trigger the submission of transaction records
  function fncGroupRecords() 
  {
    fncConcatCheckboxes(31);
  }
  
  // Trigger the printing of transaction records
  function fncPrintRecords() 
  {
    fncConcatCheckboxes(506);
  }
  
  // BEGIN SEB specific
  // Trigger the printing of transaction records
  function fncZipRecords() 
  {
    fncConcatCheckboxes(600);
  }
  // END SEB specific
  
  
  // Trigger the processing of transaction records (standard)
  function fncProcessRecords() 
  {
    fncConcatCheckboxes(32);
  }
  
  // Show a popup of confirmation to allow the download of a file
  function fncConfirmDownload(strSize, strURL, strTitle) 
  {
    // Before redirecting the user to the event download action, we ask for a confirmation
    if (fncShowConfirmation(12,strSize))
    {
      window.open(filterURL(strURL), strTitle, '');
      return;
    }
  }
  
  // filter unsafe and reserved JS characters.
  // '/', '?', '&' are used by Turbine.
  function filterURL(strURL)
  {
    var strOutputString = "";
    if (strURL)
    {
      for (var i=0; i<strURL.length; i++) 
      {
        var oneChar = strURL.charAt(i);
        switch (oneChar) 
        {
          case '#': 
              strOutputString = strOutputString + "%23";
              break;
          //case '&':				
					//		strOutputString = strOutputString + "%26";
					//		break;
					case '+':			
							strOutputString = strOutputString + "%2B";
							break;
					//case '/':					
					//		strOutputString = strOutputString + "%2F";
					//		break;
					//case '?':		
					//		strOutputString = strOutputString + "%3F";
					//		break;
					case '%':
							strOutputString = strOutputString + "%25";
							break;
          default:
              strOutputString = strOutputString + oneChar;
              break;
        }
      }
      
      return strOutputString;
    }
  }

  // Show a popup of confirmation to allow the deletion of a record
  function fncConfirmDelete(strTitle, strURL) 
  {
    // Before redirecting the user to the event delete action, we ask for a confirmation
    if (fncShowConfirmation(7,strTitle))
    {
      document.location.href = filterURL(strURL);
      return true;
    }
  }

  // Redirect to the given URL after an eventual action
  function fncRedirectWithConfirmation(strURL, intMessageCode) 
  {
    // Before redirecting the user, we ask for a confirmation if applicable
    if (intMessageCode)
    {
      if (fncShowConfirmation(intMessageCode))
      {
        document.location.href = strURL;
        return true;
      }
    }
    else
    {
      document.location.href = filterURL(strURL);
      return true;
    }
  }

  // Populate a select box based on the content 
  // of the current bank and entity selection.
  function fncPopulateReferences(banksBox, referencesBox, applicantRefObj, entityObj) 
  {
    if (!banksBox) return;
    if (!referencesBox) return;
    
    var sourceIndex = banksBox.options[banksBox.selectedIndex].value;
    // entity may be null
    var entity;
    if (entityObj)
    {
      entity = entityObj.value;
    }
    else
    {
      entity = "";
    }
    
    var currentReferences = customerReferences[sourceIndex+"_"+entity];
		
		while (referencesBox.options.length) referencesBox.options[0] = null;
		
		if (currentReferences != null && currentReferences.length != 0)
		{

		  referencesBox.options.length = (currentReferences.length)/2;
		  
			for(i=0;i<referencesBox.options.length;i++)
			{
			 		referencesBox.options[i].value = currentReferences[2*i+1];
			  	referencesBox.options[i].text  = currentReferences[2*i];
			}
		
			// Set a default value for the target field
			if (applicantRefObj)
			{
			   if(referencesBox.options[0] != null)
			   {
			     applicantRefObj.value = (currentReferences.length>0) ? referencesBox.options[0].value : "";
			   }
			   else
			   {
			     applicantRefObj.value = "";
			   }
			}
		}
		else
		{
		  	referencesBox.options.length = 1;
		  	referencesBox.options[0].value = '';
		  	referencesBox.options[0].text = ' ';
		}
  }

  // Validate the content of the specified field against the given character set.
  function fncValidateCharacter(theObj, strValidCharacters) 
  {
    if (!strValidCharacters)
    {
      strValidCharacters = " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,+_";
    }
    for (i = 0; i < theObj.value.length; i++) 
    {
      if (strValidCharacters.indexOf(theObj.value.charAt(i)) < 0)
      {
        fncShowError(30,theObj.value.charAt(i));
        theObj.focus();
        return false;
      }
    }
    return true;
  }

  // Function used to concert or validate the login ids.
  // This function can typically be updated in order to get uppercase characters.
  function fncConvertValidateLoginId(theObj, isLogin) 
  {
    // Uncomment the following line to convert all login ids to uppercase
    //theObj.value = theObj.value.toUpperCase();
    
    // Characters validation
    if (!isLogin)
    {
      // The set of characters if the same as the default ones, 
      // with the space excluded
      return fncValidateCharacter(theObj, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,+");
    }
    return true;
 }
 
  // Function used to validate the template ids.
  function fncValidateTemplateId(theObj) 
  {
    // The set of characters if the same as the default ones, 
    // with the accentuated characters and no '&'.
    //return fncValidateCharacter(theObj, " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,+");
    // allow all characters but quote
		if (theObj.value.indexOf('\'') > 0)
    {
        fncShowError(30,' \' ');
        theObj.focus();
        return false;
  }
  }

  // Function used to apply basic validations on the password definition.
  // This prevent the user to submit a password that will be rejected on the server.
  function fncValidatePassword(theObj) 
  {
    // Uncomment the following to have the password length checked
    // First Implementation: between 4 to 10 characters
    /*if ((4>theObj.value.length) || (10<theObj.value.length))
    {
        fncShowError(34, "4", "10");
        theObj.focus();
        return false;
    }
    */
  	//Second implementation : minimum 6 chars
  	/*if (6>theObj.value.length)
    {
        fncShowError(35, "6");
        theObj.focus();
        return false;
    }
    */
    
    //
    // Uncomment the following to check there is at least one digit and one letter character
    /*
    strDigitCharacters = "0123456789";
    strLetterCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    boolDigitFound = false;
    boolLetterFound = false;
    for (i = 0; i < theObj.value.length; i++) 
    {
      if (strDigitCharacters.indexOf(theObj.value.charAt(i)) > -1)
      {
        boolDigitFound = true;
      }
      if (strLetterCharacters.indexOf(theObj.value.charAt(i)) > -1)
      {
        boolLetterFound = true;
      }
    }
    if (!(boolDigitFound && boolLetterFound))
    {
        fncShowError(35, "6");
        theObj.focus();
        return false;
    }
    */
    
    return true;
 }


	// ********************************************
	// Functions dedicated to the dynamic elements
	// ********************************************

	//
	// This function highlights the details of an item in the dynamic table
	//
  function fncDisplayElement(formName, structureName, nbElement)
  {
    // Make a copy of the fields
    eval("var regExp = /" + structureName + "_details.*_" + nbElement + "/");

		arrFieldsCopies = new Array();
	  var counter = 0;      
    for (j=0; j<document.forms[formName].elements.length; j++)
  	{
  	  if (regExp.test(document.forms[formName].elements[j].name))
  	  {
  	    arrFieldsCopies[counter] = new Array();
  	    arrFieldsCopies[counter].name = document.forms[formName].elements[j].name;
  	    arrFieldsCopies[counter].value = document.forms[formName].elements[j].value;
  	    if (document.forms[formName].elements[j].type == 'checkbox')
  	    {
  	    	arrFieldsCopies[counter].checked = document.forms[formName].elements[j].checked;
  	    }
  	    else if (document.forms[formName].elements[j].type == 'select-one')
  	    {
  	      arrFieldsCopies[counter].selected = document.forms[formName].elements[j].options[document.forms[formName].elements[j].selectedIndex].selected;
  	    }
  	    counter++;
  	  }
    }

		// Hide summary row and display details
    fncGetElement(structureName + "_header_" + nbElement).style.visibility = 'hidden';
    fncGetElement(structureName + "_display_details_" + nbElement).style.display = 'block';
  }

  //
  // Replace a pattern in a string
  //
	function fncStringReplace(source, pattern, replace)
	{
	  if ("S" + source != "S")
	  {
	    var len = pattern.length;
	    var result = "";
	    var found = -1;
	    var start = 0;
	    
	    found = source.indexOf(pattern, start);
	    while ( found != -1)
	    {
	      result = result + source.substring(start, found);
	      result = result + replace;
	      start = found + len;
	      found = source.indexOf(pattern, start);
	    }
	    
	    result = result + source.substring(start);
	    return result;
	  }
	  else
	  {
	    return "";
	  }
	}

  //
  // This function adds a new empty header/details form in the dynamic table.
  // <formName> is the name of form where the dynamic table is located.
  // <structureName> is the name of the dynamic table.
  // <fncInitName> is the name of the function to invoke that initializes the values in the new details form.
  //
  function fncAddElement(formName, structureName, fncInitName)
  {
    // Calculate the number of elements already created
    var nb = 0;
  	var currentElement = parseInt(0);
  	var arrElements = new Array();
  	eval("var regExp = /" + structureName + "_details_position_[0-9]{1}[0-9]*/");
  	for (j=0; j<document.forms[formName].elements.length; j++)
  	{
  	  if (regExp.test(document.forms[formName].elements[j].name))
  	  {
  	    nb = parseInt(document.forms[formName].elements[j].name.replace(structureName + "_details_position_", ""), 10);
  	    arrElements[arrElements.length + 1] = nb;
  	    if (nb > currentElement)
  	    {
  	      currentElement = nb;
  	    }
  	  }
  	}
  	
  	// Insert a new element only if the previous one is not empty
  	if (currentElement > 0)
  	{
  	  previousElement = eval("document.forms['" + formName + "'].elements['" + structureName + "_details_position_" + currentElement + "'].value");
  	}
  	else
  	{
  	  previousElement = "No element yet defined";
  	}
  	
  	if ("S" + previousElement != "S")
  	{
   	  currentElement++;
      	  
   	  var table = fncGetElement(structureName + "_table");

    	// IE 4+
    	if (document.all)
    	{
      	  var expression = new RegExp("nbElement", "g");
      	  
      	  // Insert Header
      	  var row = table.insertRow();
      	  
      	  row.id = structureName + "_header_" + currentElement;

          var templateTable = document.all(structureName + "_template");
          eval("var regExp = /" + structureName + "_IE_header_template_cell_.*/");
          var nbCells = 0;
          var headerCell;
          for (j=0; j<templateTable.all.length; j++)
          {
            var cell = templateTable.all[j];
            if (cell.tagName == "TD")
            {
              if (regExp.test(cell.id))
              {
                nbCells++;
                headerCell = row.insertCell();
                headerCell.innerHTML = cell.innerHTML.replace(expression, currentElement);
              }
            }
          }
          // The last cell is always the delete cell and is center-aligned
          headerCell.align = "center";
          
      	  // Insert Details
          var detailsRow = table.insertRow();
          detailsRow.id = structureName + "_details_" + currentElement;

          var templateCell = document.all(structureName + "_IE_details_template_cell_1");
          var detailsCell = detailsRow.insertCell();

          detailsCell.colSpan = nbCells;
          detailsCell.innerHTML = templateCell.innerHTML.replace(expression, currentElement);

      	  row.style.visibility = 'hidden';
    	}
      	// DOM 2 aware browsers
    	else if (document.getElementById)
    	{
          var range = document.createRange();
     	    var expression = new RegExp("nbElement", "g");
          var content = document.getElementById(structureName + "_template").innerHTML.replace(expression, currentElement);

          range.setStartAfter(table.lastChild);
          
          var docFrag = range.createContextualFragment(content);
          table.appendChild(docFrag);
    	}

			// Display details table
 		  var masterTable = fncGetElement(structureName + "_master_table");
 		  masterTable.style.position = 'static';
 		  masterTable.style.visibility = 'visible';
    		  
 		  // Set the details form display property
 		  fncGetElement(structureName + "_display_details_" + currentElement).style.display = 'block';
  	}
  	else
  	{
  	  // The empty element has first to be filled in before a new one can be added
  	}
  	
  	// As a last step, we try to call a function in charge of defaulting values
  	// The function name is fncDefault<structureName>Details and is provided by the product.
  	if ("S" + fncInitName != "S")
  	{
  	  eval(fncInitName + "('" + formName + "', '" + structureName + "', '" + currentElement + "');");
  	}
		return true;
  }
  
  
  // TODO: mandatory fields is currently a fixed  array of fields.
  // This may be limited in certain cases where the list of mandatory fields depends on some conditions.
  // A solution would be to remove the mandatory fields check from this function and to insert it into another function
  // (this function would be specific for each page).
  function fncAddElementValidate(formName, structureName, nbElement, keyFieldName, arrMandatoryFields, arrFieldNames, arrHeaderIds)
  {
    // Test that all mandatory fields have been populated
    var disabledEmptyMandatoryField = false;
    for (j=0; j<arrMandatoryFields.length; j++)
    {
      if ("S" + document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].value == "S")
      {
        if (!document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].disabled)
				{
          fncShowError(31);
		  if (document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].style.display != "none"
			&& document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].type != "hidden")
          {
          document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].focus();
          }
          document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].style.color = "white";
          document.forms[formName].elements[structureName + "_details_" + arrMandatoryFields[j] + "_" + nbElement].style.background = "blue";
          return false;
				}
				else
				{
				  disabledEmptyMandatoryField = true;
				}
      }
    }
    // If a mandatory field is disabled and empty, still trigger the error popup
    if (disabledEmptyMandatoryField)
    {
      fncShowError(31);
      return false;
    }

    // Test that the new key fields don't already exist
   	var arrElements = new Array();
    if (keyFieldName != '')
    {
    	eval("var regExp = /" + structureName + "_details_position_\d*/");
    	var counter = 0;
    	// Create an array that holds the already existing keys except the ones just inputted by the user
    	for (j=0; j<document.forms[formName].elements.length; j++)
    	{
    	  if (regExp.test(document.forms[formName].elements[j].name))
    	  {
    	    nb = parseInt(document.forms[formName].elements[j].name.replace(structureName + "_details_position_", ""), 10);
    	    if (("S" + nb) != ("S" + nbElement))
    	    {
    	      arrElements[counter] = nb;
      	    counter++;
    	    }
    	  }
    	}
    	
    	// Check if the key value is already present in the existing headers
    	var keyValue = document.forms[formName].elements[structureName + "_details_" + keyFieldName + "_" + nbElement].value;
    	for (j=0; j<arrElements.length; j++)
    	{
    	  // Retrieve header key value
   	    var headerKeyValue = fncGetElement(structureName + "_header_" + keyFieldName + "_" + arrElements[j]).innerHTML;

    	  if (headerKeyValue == keyValue)
    	  {
    	    fncShowError(33);
    	    return false;
    	  }
    	}
    }
  	
		// Add row
    for (i=0; i<arrFieldNames.length; i++)
    {
      var headerCell = fncGetElement(structureName +  "_header_" + arrFieldNames[i] + "_" + nbElement);
      var formElement = document.forms[formName].elements[structureName + "_details_" + arrFieldNames[i] + "_" + nbElement];
      var formValue;
      if ((formElement.type == "text")  || (formElement.type == "hidden") || (formElement.type == "textarea"))
  		{
  			formValue = formElement.value;
   		}
   		else if (formElement.type == "select-one")
   		{
   		  formValue = formElement.options[formElement.selectedIndex].text;
   		}
			var headerRegExp = /\n/g;
     	headerCell.innerHTML = fncNormalizeXML(formValue).replace(headerRegExp, "<br/>");
    }

		// Set the table header to visible if hidden before and hide the disclaimer
		if (arrElements.length == 0)
		{
		  fncGetElement(structureName + "_disclaimer").style.display = 'none';

     	for (j=0; j<arrHeaderIds.length; j++)
     	{
 			  fncGetElement(arrHeaderIds[j]).style.visibility = 'visible';
     	}
		}

		// Set header visible and hide details
    fncGetElement(structureName + "_display_details_" + nbElement).style.display = 'none';
    fncGetElement(structureName + "_header_" + nbElement).style.visibility = 'visible';

    return true;
  }
  
  function fncDeleteElement(formName, structureName, nbElement, arrHeaderIds)
  {
    if (fncShowConfirmation(11))
    {
      fncDeleteElementWithoutConfirmation(formName, structureName, nbElement, arrHeaderIds)
      return true;
    }
    else
    {
      return false;
  	}
  }

  function fncDeleteElementWithoutConfirmation(formName, structureName, nbElement, arrHeaderIds)
  {
    // Count the number of elements already existing
    var arrElements = new Array();
    eval("var regExp = /" + structureName + "_details_position_[0-9]{1}[0-9]*/");
    var counter = 0;
    // Create an array that holds the already existing keys except the ones just inputted by the user
    for (j=0; j<document.forms[formName].elements.length; j++)
    {
      if (regExp.test(document.forms[formName].elements[j].name))
      {
        nb = document.forms[formName].elements[j].name.replace(structureName + "_details_position_", "");
        if (("S" + nb) != ("S" + nbElement))
        {
          arrElements[counter] = nb;
     	    counter++;
        }
      }
    }
      
    // Delete row
    var table = fncGetElement(structureName + "_table");
    var header = fncGetElement(structureName + "_header_" + nbElement);
    var details = fncGetElement(structureName + "_details_" + nbElement);
    if (document.all)
    {
      table.deleteRow(header.rowIndex);
      table.deleteRow(details.rowIndex);
    }
    else if (document.getElementById)
    {
      table.removeChild(header);
      table.removeChild(details);
    }

		// Hide the table header if no elements anymore and display the disclaimer
 		if (arrElements.length == 0)
 		{
 		  fncGetElement(structureName + "_disclaimer").style.display = 'block';
  
     	 for (var j=0; j<arrHeaderIds.length; j++)
     	{
   	    fncGetElement(arrHeaderIds[j]).style.visibility = 'hidden';
     	}
   	  var masterTable = fncGetElement(structureName + "_master_table");
   	  masterTable.style.position = 'absolute';
   	  masterTable.style.visibility = 'hidden';
 		}
  }
  
  // This function deletes all the elements whose the structure name is passed in parameter.
	function  fncDeleteAllElementsWithoutConfirmation(formName, structureName,  arrHeaderIds)
	{
		 // Create an array that holds the keys
	   var baseNode = document.getElementById(structureName + '_section');
	   var testFunction = function(elt){var regExp = new RegExp(structureName + '_details_position_[0-9]{1}[0-9]*'); return regExp.test(elt.name);};
	   var arrElements =  fncGetElementsBy(testFunction, baseNode, 'input');    
	   // Delete all the elements
	    fncRemoveElementsDetails(arrElements, structureName, arrHeaderIds);
	}
	
	 // This function deletes all the elements whose the structure name is passed in parameter.
	// The user is warned before the deletion.
	function  fncDeleteAllElements(formName, structureName,  arrHeaderIds, messageCode)
	{
		 // Create an array that holds the keys
	   var baseNode = document.getElementById(structureName + '_section');
	   var testFunction = function(elt){var regExp = new RegExp(structureName + '_details_position_[0-9]{1}[0-9]*'); return regExp.test(elt.name);};
	   var arrElements =  fncGetElementsBy(testFunction, baseNode, 'input');
	   // Do not warn the user if there is no element to delete
	   	if (arrElements.length > 0)
	   	{
		    if (fncShowConfirmation(messageCode))
		    {  
		    	   // Delete all the elements
			 	 fncRemoveElementsDetails(arrElements, structureName, arrHeaderIds);
			   	  // The user has chosen to delete the elements
			   	  return true;
			  }
			  else
			  {
			  	// The user has chosen to not delete the elements
			  	return false;
			  }
		 }
		 // The function return false by default. I. e no element
		 // has been deleted
		 return false;
	}	
  
  function fncAddElementCancel(formName, structureName, nbElement, mandatoryFieldName, arrHeaderIds)
  {
    if (document.all)
    {
      var keyFieldHeader = document.all(structureName +  "_header_" + mandatoryFieldName + "_" + nbElement);
      if (keyFieldHeader.innerHTML + "S" == "S")
      {
        // The header is empty thus remove the header and the details
        var table = document.all(structureName + "_table");
        var details = document.all(structureName + "_details_" + nbElement);
        var header = document.all(structureName + "_header_" + nbElement);
        table.deleteRow(header.rowIndex);
        table.deleteRow(details.rowIndex);
      }
      else
      {
      	// The header is already filled thus put back former values, hide the details and show the summary row
        // Put back former values
        
        // Hide details
        var details = document.all(structureName + "_display_details_" + nbElement);
        details.style.display = 'none';
        
        // Show summary row
        var header = document.all(structureName + "_header_" + nbElement);
        header.style.visibility = 'visible';

        for (j=0; j<arrFieldsCopies.length; j++)
        {
          if (document.forms[formName].elements[arrFieldsCopies[j].name].type == 'checkbox')
          {
            document.forms[formName].elements[arrFieldsCopies[j].name].checked = arrFieldsCopies[j].checked;
          }
          else
          {
	          document.forms[formName].elements[arrFieldsCopies[j].name].value = arrFieldsCopies[j].value;
          }
        }
      }
    }
    else if (document.getElementById)
    {
      var keyFieldHeader = document.getElementById(structureName +  "_header_" + mandatoryFieldName +"_" + nbElement);
      if (keyFieldHeader.innerHTML + "S" == "S")
      {
        // The header is empty thus remove the header and the details
        var table = document.getElementById(structureName + "_table");
        var details = document.getElementById(structureName + "_details_" + nbElement);
        var header = document.getElementById(structureName + "_header_" + nbElement);
        table.removeChild(header);
        table.removeChild(details);
      }
      else
      {
      	// The header is already filled thus put back former values, hide the details and show the summary row
        // Put back former values

        // Hide details
        var details = document.getElementById(structureName + "_display_details_" + nbElement);
        details.setAttribute("style", "display:none;");
        
        // Show summary row
        var header = document.getElementById(structureName + "_header_" + nbElement);
        header.setAttribute("style", "visibility:visible");

        for (j=0; j<arrFieldsCopies.length; j++)
        {
          if (document.forms[formName].elements[arrFieldsCopies[j].name].type == 'checkbox')
          {
            document.forms[formName].elements[arrFieldsCopies[j].name].checked = arrFieldsCopies[j].checked;
          }
          else
          {
	          document.forms[formName].elements[arrFieldsCopies[j].name].value = arrFieldsCopies[j].value;
          }
        }

      }
    }

    // Count the number of elements already existing
   	var arrElements = new Array();
  	eval("var regExp = /" + structureName + "_details_position_[0-9]*/");
  	var counter = 0;
  	// Create an array that holds the already existing keys except the ones just inputted by the user
  	for (j=0; j<document.forms[formName].elements.length; j++)
  	{
  	  if (regExp.test(document.forms[formName].elements[j].name))
  	  {
  	    nb = parseInt(document.forms[formName].elements[j].name.replace(structureName + "_details_position_", ""), 10);
	      arrElements[counter] = nb;
  	    counter++;
  	  }
    }

 		// Hide the table header if no elements anymore and display the disclaimer
 		if (arrElements.length == 0)
 		{
 			// Hide the table headers
     	for (j=0; j<arrHeaderIds.length; j++)
     	{
        fncGetElement(arrHeaderIds[j]).style.visibility = 'hidden';
     	}
    		  
 		  var masterTable = fncGetElement(structureName + "_master_table");
 		  masterTable.style.position = 'absolute';
 		  masterTable.style.visibility = 'hidden';

		  var disclaimer = fncGetElement(structureName + "_disclaimer");
		  disclaimer.style.display = 'block';
 		}
  }
 
  // This function deletes all the elements whose the structureName is passed
  // in parameter from the page.
  //  @param arrElements The elements keys
  //  @param structureName The elements keys
  //  @param arrHeaderIds The elements keys
  function fncRemoveElementsDetails(arrElements, structureName, arrHeaderIds)
  {
    	// Delete rows
	    var nbElements = arrElements.length;
	    var table = fncGetElement(structureName + "_table");
		if (document.getElementById)
		{	
			var header, details, nb;	
			for (var i = 0; i <  nbElements; i++)
			{
				 nb = arrElements[i].name.replace(structureName + "_details_position_", "");
			  	 header = fncGetElement(structureName + "_header_" + nb);
			   	 details = fncGetElement(structureName + "_details_" + nb);
			      table.removeChild(header);
			      table.removeChild(details);
			}
		}

		// Hide the table header
 	    fncGetElement(structureName + "_disclaimer").style.display = 'block';  
     	for (var j=0; j < arrHeaderIds.length; j++)
     	{
   	   		 fncGetElement(arrHeaderIds[j]).style.visibility = 'hidden';
     	}
	     var masterTable = fncGetElement(structureName + "_master_table");
	   	 masterTable.style.position = 'absolute';
	   	 masterTable.style.visibility = 'hidden';
	 }

  // Retrieve elements from the page.
  // @param method A boolean method for testing element.
  // @param node The base node from which the elements are retrieved.
  // @param tag (optional) The type (div, table, input...) of elements to be retrieved.
  function fncGetElementsBy(method, node, tag)
  {
	    var arrElts = new Array();
	    var aNode = node || document;
	    var aTag = tag || '*';
		var elements = aNode.getElementsByTagName(aTag);
		elements = elements ? elements : aNode.all; // I.E 5 does not support getElementByTagName('*')
	    for (var i = 0, j = elements.length ; i < j; i++)
	    {
	      if (method(elements[i]))
	      {
				arrElts[arrElts.length] = elements[i];
	      }
	   } 
	   return arrElts; 
  }
     
  //
  // Function used to validate that no details forms is opened before the transaction submission.
  // @param filterRegex The regex that matches the div element id that must not be checked
  // by the method.
  // @return boolean true if all details are closed.
  //
  function fncCheckDetailsForms(filterRegex)
  {
  	var isValid = true;
	if (document.getElementById)
    {
    	var divs = document.getElementsByTagName("div");
    	var nbDivs = divs.length;
    	for (var i = 0; i < nbDivs; i++)
      {
    		isValid = checkElementDisplay(divs[i],filterRegex);
    		if(!isValid)
  	  	{
    			break;   		
  	  	  }
  	  	}
      }
    return isValid;
    }

  function checkElementDisplay(node, filterRegex)
  {
  	var isCollapsed = true;
  	if (node.nodeType == 1)
  	{
	  	var regEx =  new RegExp("display_details_[0-9]*","g");
	  	var regExBlock = new RegExp("block","g");
	  	var id = node.getAttribute("id");
	  	var style = node.getAttribute("style");
	  	if (id && style)
	  	{
	  		if (typeof style === 'object')
		  	{
		  		style = style.cssText;
		  	}
		  	
		  	if (!filterRegex ||  (filterRegex && !filterRegex.test(id)))
		  	{
		  		if (regEx.test(id) && regExBlock.test(style))
		  		{
			  		isCollapsed = false;	  		
		  		}		  	
		  	}	
	  	}
  	}
  	return isCollapsed;
  }

  //
  // Recursive function used to traverse the DOM document
  // @param node a DOM node.
  // @param filterRegex The regex that matches the div element id that must not be checked
  // by the method.
  // @return true if the node and the details under are closed.
  //
 function checkNode(node, filterRegex)
  {
  	// regex that matches the div id to check
    var regExp = /.*_display_details_[0-9]*/;

    var regExpBlock = new RegExp(".*block.*","");
    
    if (node.nodeType == 1)
    {
      if (regExp.test(node.getAttribute("id")))
      {
      	// Filter the div id whose the display must not be checked.
      	if (filterRegex) 
      	{
	      	if (!filterRegex.test(node.getAttribute("id")))
	      	{
        if (regExpBlock.test(node.getAttribute("style")))
        {
          return false;
        }
      }
    }
      	else
      	{
      		if (regExpBlock.test(node.getAttribute("style")))
	        {
	          return false;
	        }
 	
      	}
    	}
    }
  
    // And propagate the test to the node's children
    var children = node.childNodes;	
    for (var j=0; j<children.length; j++)
    {
	  if (children[j].nodeType == 1)
      {
	  	if (!checkNode(children[j], filterRegex))
	  	{
        return false;
      }
    }
    }
    return true;
  }
 

	//
	// Wrapper for fncSearchPopup function for the string parameter strFieldObjectsArray
	// is not well-handled with dynamic tables.
	//
  function fncDynamicSearchPopup(strType, strFormName, strFieldName, strParameter)
  {
    var strFieldObjectsArray = "['" + strFieldName + "']";
  	fncSearchPopup(strType, strFormName, strFieldObjectsArray, strParameter);
  }
  
	//
	// Hide/Show an object
	//
	function fncShowObject(objectName, isToBeShown)
	{
	  if (isToBeShown)
	  {
	    fncGetElement(objectName).style.display = 'block';
	  }
	  else
	  {
	    fncGetElement(objectName).style.display = 'none';
	  }
	}
  
	// Preload images (useful for the dynamic pages when the browser's cache is emptied)
  function fncPreloadImages()
  {
    var d = document;
    if(d.images)
    {
      d.MM_p = new Array();
      var i, j = d.MM_p.length, a = fncPreloadImages.arguments;
      d.imagesCounter = a.length;
      for(i=0; i<a.length; i++)
      {
        if (a[i].indexOf("#") != 0)
        {
          d.MM_p[j] = new Image;
          d.MM_p[j].onload = fncImageLoaded;
          d.MM_p[j++].src = a[i];
        }
      }
    }
  }
  
  function fncImageLoaded()
  {
    var d = document;
    d.imagesCounter--;
  }
  
  function fncLaunchProcess(functionCall)
  {
    var d = document;
    if (d.imagesCounter > 0)
    {
      setTimeout("fncLaunchProcess(" + functionCall + ")", 200);
    }
    else
    {
      eval(functionCall);
    }
  }
  
   	
  // Check if the current element is a dynamic element 
  // that is mandatory.
  // @param formObj The form object whose we check the content.
  // @param arrMandatoryElement The lis of mandatory elements.
  // @return String An ampty string if all the elements are presents
  // otherwise, it returns the missing element name to be displayed
  // in the alert window.
  function fncHasMandatoryElement(formObj, arrMandatoryElements)
  {
  	var hasMandatoryElement = false;
  	// store the errorCode of the first missing elements matched.
  	var missingMandatoryElement = "0";
  	// Go throughout all the mandatory elements the form should contain.
  	for ( var i = 1; i < arrMandatoryElements.length; i++)
  	{
  		var regex = new RegExp(arrMandatoryElements[i].name + "_details_position_[1-9][0-9]*");
  		for (var j = 0; j < formObj.elements.length; j++)
  		{
  		  	if (arrMandatoryElements[i].mandatory && regex.test(formObj.elements[j].name))
  			{
  				hasMandatoryElement = true;
  				break; 		
  			}	
		}
		// Exit as soon as it missing a mandatory element.
		if (!hasMandatoryElement)
		{
			missingMandatoryElement = arrMandatoryElements[i].errorCode;
			break;		
		}
	
  	}
  	return missingMandatoryElement;
  }
  
	// ***************************************************
	// End of Functions dedicated to the dynamic elements
	// ***************************************************
    
  // Define a function common to IE4+ and NS6 to find and return an object
  // It performs this action upon the parent window of a popup
  function fncGetElementFromOpener(strElementId) 
  {
    // Get a window opener document reference
    var opener = window.opener.document;
    if (opener != null)
    {
      if (IE4) 
        return opener.all(strElementId);
      else if (VER5UP) 
        return opener.getElementById(strElementId);
    }
  }
 
  // Change readonly attribute
  function fncInputenable(theObj,state) 
  {
 		if(!state && theObj) 
 		{
  		theObj.removeAttribute("readonly");
 		} 
 		else if(theObj) 
 		{
  		theObj.setAttribute("readonly",true);
 		}
  }
  // Check the BEI format.
  // This method is to be used in a HTML form.
  // @param BEIObj The BEI form field to check .
  // @return boolean true if the format is correct.
  function fncCheckBEIFormat(BEIObj)
  {
    // If the BEI string is empty, we return true
    if ("S" + BEIObj.value == "S")
    {
      return true;
    }
    
	// Put the BEI in uppercase
    BEIObj.value = BEIObj.value.toUpperCase();
    
  	var regex = new RegExp("^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$", "g");
  	if(regex.test(BEIObj.value))
  	{
	  	// Correct format.
  		return true;  	
  	}
  	// Incorrect format.
  	fncShowError(72,BEIObj.value);
  	// Reset the field.
    BEIObj.value = "";
    
    return false; 
  }
  
  // Check the BIC code.
  // This method is to be used in a HTML form.
  // @param BICObj The BIC form field to check.
  // @return boolean true if the format is correct.
  function fncCheckBICFormat(BICObj)
  {
      // If the BIC string is empty, we return true
    if ("S" + BICObj.value == "S")
    {
      return true;
    }
    
	// Put the BIC in uppercase
    BICObj.value = BICObj.value.toUpperCase();
    
  	var regex = new RegExp("^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$", "g");
  	if(regex.test(BICObj.value))
  	{
	  	// Correct format.
  		return true;  	
  	}
  	// Incorrect format.
  	fncShowError(73,BICObj.value);
  	// Reset the field.
    BICObj.value = "";
    
    return false; 
  }
  
  // Unlock fields
  function fncResetAndUnlock(strFormName, arrFieldObjects)
  {
    for (i=0; i<arrFieldObjects.length; i++)
    {
      var elementName = arrFieldObjects[i];
      var element = document.forms[strFormName].elements[elementName];
      if (typeof element != "undefined")
      {
        element.value = '';
	    if (element.type != 'hidden')
	    {
	      element.readOnly = false;
	    }
	  }
    }
  }  
  function fncDisplayTooltip(theObj)
  {
  	var display = fncGetElement("tooltip_box").style.display;
  	if (typeof theObj == "undefined")
  	{
	  	if(display == "block")
	  	{
	  		 fncGetElement("tooltip_box").style.display = 'none';  
	  	}
	  	else
	  	{
	  			fncGetElement("tooltip_box").style.display = 'block';  	
	  	}
  	}
  	var nb = 0;
  	var theForm = document.forms["TopForm"];
    // Scan the form containing the list
    for (var i=0 ; i < theForm.length ; i++)
    {
      // Check if the current checkbox is a "group checkbox"
      if ((theForm.elements[i].type == "checkbox"))
      {
      	if (theForm.elements[i].checked)
      	{
      		nb++;
      		break;
      	}
      }
     }
 	if (nb == 0)
 	{
 	fncGetElement("tooltip_box").style.display = 'none';  
 	}
 	else
 	{
 				fncGetElement("tooltip_box").style.display = 'block';  	
 	}
}