// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
// All Rights Reserved. 

// ----------------------------
// TSU functions and constants
// ----------------------------

  //
  // Reporting popup used to display a TSU message or a baseline
  //
  function fncShowReportingTSUMessage(strType, strRefId) 
  {
	  var objPopReporting;
		objPopReporting = window.open("/gtp/screen/TSUMessageReportingPopup?option=" + strType + "&referenceid=" + strRefId,"","width=640,height=480,resizable=yes,scrollbars=yes");
    if (objPopReporting.opener == null)
    { 
      objPopReporting.opener = self;
    }
    objPopReporting.focus(); 
  }

  function fncCheckDate(theObj)
  {
    if (fncCheckValidDate(theObj)) 
    {
      theObj.value = fncFormatDate(theObj.value,"");
    }
    else
    {
      theObj.value = "";
      theObj.focus();
    }
  }
  
  function branch(elementName, elementIndex, parent)
  {
     this.elementName = elementName;
     this.elementIndex = elementIndex;
     this.writeBranch = writeBranch;
     this.branches = new Array();
     this.addBranch = addBranch;
     this.leaf = null;
     this.addLeaf = addLeaf;
     this.contains = contains;
     this.parent = parent;
  }
  
  function addBranch(branch)
  {
    var newIndex = this.branches.length;
    this.branches[newIndex] = branch;
    return newIndex;
  }
  
  function contains(elementName, elementIndex)
  {
    if (this.branches.length != 0)
    {
      for (var i=0; i<this.branches.length; i++)
      {
        if (this.branches[i].elementName == elementName && this.branches[i].elementIndex == elementIndex)
        {
          return i;
        }
      }
    }
    return -1;
  }

  function addLeaf(leaf)
  {
    this.leaf = leaf;
  }

  function writeBranch()
  {
    /*if (strPrefix + "S" != "S")
    {
      strFullPrefix = strPrefix + ":";
    }*/
    var strXml = '';
    if (this.branches.length == 1 && this.branches[0].elementName == '@Ccy')
    {
      strXml = strXml + '<' + this.elementName + ' Ccy="' + this.branches[0].leaf + '">' + (this.leaf != null ? fncNormalizeXML(this.leaf) : "");
    }
    else
    {
      strXml = strXml + '<' + this.elementName + '>';
      if (this.leaf != null)
      {
        strXml = strXml + fncNormalizeXML(this.leaf);
      }
      if (this.branches.length != 0)
      {
        for (var i=0; i<this.branches.length; i++)
        {
          strXml = strXml + this.branches[i].writeBranch();
        }
      }
    }
    strXml = strXml + '</' + this.elementName + '>\n';
    return strXml;
  }
  

  function fncCopyTemplate(templateNode, insertBeforeNode)
  {
    node = templateNode.cloneNode(true);
    newNode = insertBeforeNode.parentNode.insertBefore(node, insertBeforeNode);
    return newNode;
  }

  function fncDelete(aNode)
  {
    // Display the associated Add button
    var nextNode = aNode.parentNode.parentNode;
    while (nextNode != null)
    {
      //alert("1 - nextNode.nodeName: " + nextNode.nodeName + " nextNode.id: " + nextNode.id + " nextNode.className: " + nextNode.className);
      if (nextNode.nodeName.toUpperCase() == "DIV" && nextNode.className == "command")
      {
        //alert("2 - nextNode.innerHTML: " + nextNode.innerHTML + " nextNode.id: " + nextNode.id + " nextNode.style: " + nextNode.style.display);
        nextNode.style.display = 'block';
        break;
        /*var nodes = nextNode.childNodes;
        for (var i=0; i<nodes.length; i++)
        {
          alert("2 - nodes[i].nodeName: " + nodes[i].nodeName);
          if (nodes[i].nodeName.toUpperCase() == "A")
          {
            alert("2 - nodes[i].nodeName: " + nodes[i].innerHTML);
            nodes[i].style.display == 'block';
          }
        }*/
      }
      nextNode = nextNode.nextSibling;
      
      /*//alert("nextNode.id : " + nextNode.id + "nextNode.name : " + nextNode.nodeName);
      if (nextNode.id &&
          nextNode.nodeName.toUpperCase() == "A")
      {
        //alert("found");
        nextNode.style.display = 'block';
        break;
      }
      nextNode = nextNode.nextSibling;*/
    }

    // Remove element
    //alert('Remove element');
    aNode.parentNode.parentNode.parentNode.removeChild(aNode.parentNode.parentNode);
    //alert('End');
  }

  /*function fncGetLastElementNumber(addObj)
  {
    var addElementId = addObj.id;
    //alert('In fncGetLastElementNumber');
    // Extract the element name
    var elementName = addElementId.substring(0, addElementId.indexOf('/neomalogic-buttonAdd'));
    //alert('elementName: ' + elementName);
    
    var maxItemNb = 0;
    
    // Extract the last item number
    var nodes = addObj.parentNode.childNodes;
    for (var i=0; i<nodes.length; i++)
    {
      //alert('Looking for node ' + nodes[i].nodeName);
      if (nodes[i].nodeName.toUpperCase() == "DIV")
      {
        var divId = nodes[i].id;
        //alert('divId: ' + divId);
      
        // Extract the item number
        if ("S" + divId != "S" && fncStringStartsWith(divId, elementName))
        {
          //alert('Found DIV with id ' + divId);
          
          var lastSlashIndex = divId.lastIndexOf('/');
          var bracketIndex = divId.lastIndexOf('[');
          if (bracketIndex != -1 && bracketIndex > lastSlashIndex)
          {
            //alert('1');
            var itemNb = divId.substring(bracketIndex + 1, divId.lastIndexOf(']'));
          }
          else
          {
            //alert('2');
            var itemNb = 1;
          }
          //alert('itemNb: ' + itemNb);
        
          if (itemNb > maxItemNb)
          {
            maxItemNb = itemNb;
          }
        }
      }
    }
    //alert('Out fncGetLastElementNumber  maxItemNb: ' + maxItemNb);
    return maxItemNb;
  }*/


  /*function fncGetNextXpath(addObj)
  {
    var addElementId = addObj.id;
    var lastItemNb = fncGetLastElementNumber(addObj);
    var nextItemNb = parseInt(lastItemNb) + 1;
    //alert('nextItemNb: ' + nextItemNb);

    // Extract the element name
    var elementName = addElementId.substring(0, addElementId.indexOf('/neomalogic-buttonAdd'));
    //alert('elementName: ' + elementName);

    if (nextItemNb > 1)
    {
      nextXpath = elementName + '[' + nextItemNb + ']';
    }
    else
    {
      nextXpath = elementName;
    }
    //alert('nextXpath: ' + nextXpath);
    return nextXpath;
  }*/
            
  function fncReplaceTextInNodes(node, textToBeReplaced, text)
  {
    //alert('fncReplaceTextInNodes  textToBeReplaced: ' + textToBeReplaced + '  text: ' + text);
    //if (node.nodeValue && 'S' + node.nodeValue != 'S')
    //{
    //  node.nodeValue = node.nodeValue.replace(textToBeReplaced, text);
    //}
    if (node.attributes && node.attributes.length != 0)
    {
      if (node.getAttribute('name') != null && node.getAttribute('name').length != 0)
      {
        node.setAttribute('name', node.getAttribute('name').replace(textToBeReplaced, text));
      }
      if (node.getAttribute('id') != null && node.getAttribute('id').length != 0)
      {
        node.setAttribute('id', node.getAttribute('id').replace(textToBeReplaced, text));
      }
      if (node.getAttribute('for') != null && node.getAttribute('for').length != 0)
      {
        node.setAttribute('for', node.getAttribute('for').replace(textToBeReplaced, text));
      }
      if (node.getAttribute('onblur') != null && node.getAttribute('onblur').length != 0)
      {
        node.setAttribute('onblur', node.getAttribute('onblur').replace(textToBeReplaced, text));
      }
    
      //for (var i=0; i<node.attributes.length; i++)
      //{
      //  if (node.attributes[i].value)
      //  {
      //    node.attributes[i].value = node.attributes[i].value.replace(textToBeReplaced, text);
      //  }
      //}
    }
    if (node.childNodes && node.childNodes.length != 0)
    {
      for (var i=0; i<node.childNodes.length; i++)
      {
        fncReplaceTextInNodes(node.childNodes[i], textToBeReplaced, text);
      }
    }
  }
            
  //
  // Add a new instance of an element
  //
  function fncAddNewInstance(addAnchor, templateName, maxNbInstances)
  {
    // Check if the maximum nb of instances is not exceeded by
    // searching for previous adjacent DIVs with same name
    var elementName = addAnchor.id.substr(0, addAnchor.id.lastIndexOf('/'));
    //var rule = eval("/^" + elementName + "(\\[[0-9]+\\])?$/");
    //var rule = new RegExp("^" + elementName + "(\[[0-9]+\])?$")
    var nbInstances = 0;
    var maxItemNb = 0;
    var previousNode = addAnchor.parentNode.previousSibling;
    while (previousNode != null)
    {
      var tempNode = previousNode.parentNode;
      //alert("previousNode.id : " + previousNode.id + "previousNode.name : " + previousNode.nodeName);
      if (previousNode.id &&
          previousNode.nodeName.toUpperCase() == "DIV" &&
          previousNode.id.indexOf(elementName) == 0)
      {
        //alert("found");
        nbInstances = nbInstances + 1;
        if (nbInstances >= maxNbInstances)
        {
          //fncShowInformation(120);
          return false;
        }
        
        // Extract the item number
        var lastSlashIndex = previousNode.id.lastIndexOf('/');
        var bracketIndex = previousNode.id.lastIndexOf('[');
        if (bracketIndex != -1 && bracketIndex > lastSlashIndex)
        {
          var itemNb = previousNode.id.substring(bracketIndex + 1, previousNode.id.lastIndexOf(']'));
        }
        else
        {
          var itemNb = 1;
        }
  
        if (itemNb > maxItemNb)
        {
          maxItemNb = itemNb;
        }
      }
      previousNode = previousNode.previousSibling;
    }
    
    // Increase the number of instances
    nbInstances = nbInstances + 1;
    
    /*var newElementId = fncGetNextXpath(addAnchor);*/
    
    // Compute new element id
    var nextItemNb = parseInt(maxItemNb) + 1;
    if (nextItemNb > 1)
    {
      newElementId = elementName + '[' + nextItemNb + ']';
    }
    else
    {
      newElementId = elementName;
    }
    
    //alert('newElementId: ' + newElementId);
    fncReplaceTextInNodes(fncCopyTemplate(document.getElementById(templateName), addAnchor.parentNode), templateName, newElementId);

    // Hide Add button if the maximum nb of instances has been reached
    //alert("nbInstances: " + nbInstances + "  maxNbInstances: " + maxNbInstances);
    if (nbInstances >= maxNbInstances)
    {
      addAnchor.parentNode.style.display = 'none';
    }

    //alert('Replace nodes');
    var newNode = fncGetElement(newElementId);
        
    //alert('Before tooltip ' + newNode.nodeType);
    //alert(newNode.innerHTML);
    //fncCreateTooltips2(newNode);
    //alert('After tooltip');
  }
            
  // Return a boolean value telling whether the first argument is an Array object.
  function fncIsArray()
  {
    if (typeof arguments[0] == 'object')
    {
      var criterion = arguments[0].constructor.toString().match(/array/i); 
      return (criterion != null);
    }
    return false;
  }
            
  // Return a boolean value telling whether the first argument is a string. 
  function fncIsString()
  {
    if (typeof arguments[0] == 'string') return true;
    if (typeof arguments[0] == 'object')
    {
      var criterion = arguments[0].constructor.toString().match(/string/i);
      return (criterion != null);
    }
    return false;
  }
            
  function fncTrimAll(str)
  {
    if (str == null) return null;
    strLeadingChar = str.substring(0,1);
    while ((strLeadingChar == ' ' || strLeadingChar == '\n' || strLeadingChar == '\r' || strLeadingChar == '\t') && str.length > 0)
    {
      str = str.substring(1, str.length);
    }
    strEndChar = str.substring(str.length-1, str.length);
    while ((strEndChar == ' ' || strEndChar == '\n' || strEndChar == '\r' || strEndChar == '\t') && str.length > 0)
    {
      str = str.substring(0, str.length-1);
    }
    return str;
  }


  function fncIsElementToBeIgnored(theObj, arrElementsToIgnore)
  {
    if (theObj.parentNode)
    {
      var parentNode = theObj.parentNode;
      if (parentNode.id)
      {
        for (var i=0; i<arrElementsToIgnore.length; i++)
        {
          if (parentNode.id == arrElementsToIgnore[i])
          {
            return true;
          }
        }
      }
      return fncIsElementToBeIgnored(parentNode, arrElementsToIgnore);
    }
    return false;
  }

  function fncPerform(strType)
  {
    if (strType == "print")
    {
      if (pr) // NS4, IE5
      {
        if (VER5UP)
        {
          document.getElementById("toolbar").style.display="none";
        }
        window.print();
        if (VER5UP)
        {
          document.getElementById("toolbar").style.display="block";
        }
      }
      else // other browsers
      {
        fncShowError(20);
      }
      return;
    }
    else if (strType == "close")
    {
      window.close();
      return;
    }    
    
    
    // Create the TSU XML message
    var xmlTree = null;
    var currentTag = null;
    var arrElementsToIgnore = new Array();
    var strXml = "";

    // Create the TSU XML string only in the draft page
    if (document.forms["xmsForm"])
    {
      for (var i=0; i<document.forms["xmsForm"].length; i++)
      {
        var element = document.forms["xmsForm"].elements[i];
        var elementName = fncTrimAll(element.name);

        if (element.type == 'checkbox')
        {
          var elementValue = '' + element.checked;
        }
        else
        {
          var elementValue = element.value;
          if (element.className && /datetime/.test(element.className))
          {
            elementValue = fncFormatTSUDateTime(elementValue);
          }
          else if (element.className && /date/.test(element.className))
          {
            elementValue = fncFormatTSUDate(elementValue);
          }
          else if (element.className && /amount/.test(element.className))
          {
            elementValue = fncFormatTSUAmount(elementValue);
          }
        }

        // Store the element
        var elementType = element.type;
        if (element.type == 'radio')
        {
          if (! element.checked)
          {
            arrElementsToIgnore[arrElementsToIgnore.length] = element.parentNode.parentNode.id;
          }
        }
        else if (! fncIsElementToBeIgnored(element, arrElementsToIgnore))
        {
          // TODO: Do not process if the form element is a radio button
          // TODO: trim element name (remove \r, \n, space, \t, etc...)
        
          if (xmlTree != null)
          {
            currentTag = xmlTree;
          }
                
          do
          {
            elementName = elementName.substring(elementName.indexOf('/') + 1, elementName.length);
            if (elementName.indexOf('/') != -1)
            {
              var xmlTag = elementName.substring(0, elementName.indexOf('/'));
            }
            else
            {
              var xmlTag = elementName;
            }
            if (xmlTag.length != 0)
            {
              if (xmlTag.indexOf('[') != -1)
              {
                elementIndex = xmlTag.substring(xmlTag.indexOf('['), xmlTag.indexOf(']'));
                xmlTag = xmlTag.substring(0, xmlTag.indexOf('['));
              }
              else
              {
                elementIndex = '1';
              }
              if (xmlTree == null) // First occurence
              {
                xmlTree = new branch(xmlTag, elementIndex, null);
                currentTag = xmlTree;
              }
              else
              {
                // Not applicable for the root element
                if (currentTag.parent != null || currentTag.elementName != xmlTag)
                {
                  var index = currentTag.contains(xmlTag, elementIndex);
                  if (index == -1)
                  {
                    var newBranch = new branch(xmlTag, elementIndex, currentTag);
                    var newIndex = currentTag.addBranch(newBranch);
                    currentTag = currentTag.branches[newIndex];
                  }
                  else
                  {
                    currentTag = currentTag.branches[index];
                  }
                }
              }
            }
          }
          while (elementName.indexOf('/') != -1)

          currentTag.addLeaf(elementValue);
        }
      }

      strXml = xmlTree.writeBranch();
      document.forms["fakeform1"].data.value = "<![CDATA[" + strXml + "]]>";
    
    
      // Check mandatory fields for SUBMIT (in the draft page only where the xmsForm exists)
      if (strType == "submit")
      {
        if (! fncCheckMandatoryFields(arrElementsToIgnore))
        {
          return;
        }
      }
    }

    // Create the main TSU record
    var xmlString = "<tu_tnx_record>";
    for (var i=0;i<document.forms["fakeform1"].length;i++) 
    {
      var elementName = document.forms["fakeform1"].elements[i].name;
      xmlString = xmlString + "<" + elementName + ">" + document.forms["fakeform1"].elements[i].value + "</" + elementName + ">";
    }
    xmlString = xmlString + "</tu_tnx_record>";
    
    var theRealForm = document.forms["realform"];
    if (strType == "save")
    {
      if (fncShowConfirmation(1))
      {
        theRealForm.elements["operation"].value = "SAVE";
      }
      else 
      {
        return;
      }
    }
    else if (strType == "submit")
    {
      theRealForm.elements["operation"].value = "SUBMIT";
    }

    // Populate the real form with this string and close the XML contained within
    theRealForm.elements["TransactionData"].value = xmlString;

    //alert(xmlString);
    theRealForm.submit();
  }
            
  function fncCheckStringPattern(theObj, strPattern)
  {
    //var rule = new RegExp(strPattern);
    var rule = eval("/" + strPattern + "/");
    var strValue = theObj.value;
    if (strValue != "" && ! (rule.test(strValue)))
    {
      fncShowError(150);
      theObj.value = "";
      theObj.focus();
      return;
    }
  }
            
  function fncCheckValidNumber(theObj, totalDigits, fractionDigits)
  {
    if (fractionDigits && fractionDigits != 0)
    {
      if (theObj.value.indexOf("'") != -1)
      {
        //alert('KO');
        //theObj.value = "";
        //theObj.focus();
      }
    }
    else
    {
      strFractionPart = theObj.value.substring(theObj.value.indexOf("'"));
      if (strFractionPart.length > fractionDigits)
      {
        //alert('KO');
        //theObj.value = "";
        //theObj.focus();
      }
    }
    if (! fncCheckRawNumber(theObj.value))
    {
      //alert('KO');
      //theObj.value = "";
      //theObj.focus();
    }
  }
  
  // Find the next node starting from the given node that has a specific name
  function fncFindNextSibling(aNode, elementTypeName)
  {
    elementTypeName = elementTypeName.toUpperCase();
    var nextNode = aNode.nextSibling;
    while (nextNode.nodeName.toUpperCase() != elementTypeName)
    {
      nextNode = nextNode.nextSibling;
    }
    return nextNode;
  }

  function fncSwitchSectionVisibility(theObj)
  {
    // Get parent DIV
    var startDiv = theObj.parentNode.parentNode.parentNode;
    
    // Search for the nearest DIV in the document
    var nextNode = fncFindNextSibling(startDiv, "DIV");
    
    var displayStyle = nextNode.style.display;
    if (displayStyle == "block" || "S" + displayStyle == "S")
    {
      nextNode.style.display = "none";
    }
    else
    {
      nextNode.style.display = "block";
    }
    
    // Toggle the collapse/expand buttons
    fncToggleButtons(theObj.parentNode);
  }

  function fncStringStartsWith(string, strChar)
  {
    if (!strChar) {return false;}
    strChar += '';
    var intLength = strChar.length;
    return (string.substr(0, intLength) == strChar);
  }
  
  function fncCheckMandatoryFields(arrElementsToIgnore)
  {
    for (var i=0; i<document.forms["xmsForm"].length; i++)
    {
      var element = document.forms["xmsForm"].elements[i];
      
      if(/mandatory/.test(element.className))
      {
        switch(element.type)
        {
          case "text":
            if ((element.value == "" || element.value == null) && ! fncIsElementToBeIgnored(element, arrElementsToIgnore))
            {
              fncShowError(13);
              element.focus();
              //element.style.color = "white";
              //element.style.background = "blue";
              return false;
            }
            break;
          case "select-one":
            if ((element.selectedIndex == -1 || element.options[element.selectedIndex].text == "") && ! fncIsElementToBeIgnored(element, arrElementsToIgnore))
            {
              fncShowError(13);
              element.focus();
              //element.style.color = "white";
              //element.style.background = "blue";
              return false;
            }
            break;
          default:
        }
      }
    }
    return true;
  }
  
  function fncCheckRadioSections(theObj)
  {
    var radioName = theObj.name;
    var radios = document.forms["xmsForm"].elements[radioName];
    for (var i=0; i<radios.length; i++)
    {
      var radio = radios[i];
      if (! radio.checked)
      {
        // Empty all form elements for a non-selected radio
        fncEmptySection(radio.parentNode.parentNode);
        // Disactivate all form elements for a non-selected radio
        fncEnableFormElementsSection(radio.parentNode.parentNode, false, 0);
        // Hide the details of a non-selected radio
        /*var detailsNode = fncFindNextSibling(radio.parentNode, "DIV");
        detailsNode.style.display = "none";*/
      }
      else
      {
        // Disactivate all form elements for a non-selected radio
        fncEnableFormElementsSection(radio.parentNode.parentNode, true, 0);
        // Display the details of a non-selected radio
        /*var detailsNode = fncFindNextSibling(radio.parentNode, "DIV");
        detailsNode.style.display = "block";*/
      }
    }
  }
  
  function fncEmptySection(aNode)
  {
    for (var i=0; i<aNode.childNodes.length; i++)
    {
      var node = aNode.childNodes[i];
      if (node.nodeName == "INPUT")
      {
        if (node.type == "text")
        {
          node.value = "";
        }
        else if (node.type == "radio")
        {
          node.checked = false;
        }
        else if (node.type == "checkbox")
        {
          node.checked = false;
        }
      }
      else if (node.nodeName == "SELECT")
      {
        node.selectedIndex = -1;
      }
      fncEmptySection(node);
    }
  }

  function fncEnableFormElementsSection(aNode, enabled, level)
  {
    level++;
    var formElementStatus = ! enabled;
    for (var i=0; i<aNode.childNodes.length; i++)
    {
      var node = aNode.childNodes[i];
      if (node.nodeName == "INPUT")
      {
        // Radios at the second level in the hierarchy should not be disabled
        // as the user should still be able to access them.
        if (!(node.type == "radio" && level == 2))
        {
          node.disabled = formElementStatus;
        }
      }
      else if (node.nodeName == "SELECT")
      {
        node.disabled = formElementStatus;
      }
      if (!(node.type == "radio" && level > 2 && enabled)) 
      {
        fncEnableFormElementsSection(node, enabled, level);
      }
    }
  }

  // Check all radio buttons upon load of the HTML page.
  // Disable/enable form elements accordingly.
  function fncCheckRadioButtons(aNode)
  {
    for (var i=0; i<aNode.childNodes.length; i++)
    {
      var node = aNode.childNodes[i];
      if (node.nodeName == "INPUT" && node.type == "radio")
      {
        if (! node.checked)
        {
          fncEnableFormElementsSection(node.parentNode.parentNode, false, 0);
        }
      }
      else
      {
        fncCheckRadioButtons(node);
      }
    }
  }


  // Check if the object is valued
  /*function fncIsObjectValued(aNode)
  {
    if (aNode.nodeName = "INPUT")
    {
        if (node.type == "text" || node.type = "textarea")
        {
          if (node.value == "" || node.value == null)
          {
            return false;
          }
        }
        return true;
    }
    else if (node.nodeName == "SELECT")
    {
      if (node.selectedIndex == -1)
      {
        return false;
      }
      return true;
    }
  }*/

  function fncGetHeaderSection(aNode)
  {
    if(/headerSection/.test(aNode.className))
    {
      return aNode;
    }
    if (aNode.parentNode)
    {
      return fncGetHeaderSection(aNode.parentNode);
    }
    else
    {
      return null;
    }
  }
  
  function fncGetEmbracingSection(aNode)
  {
    if(/embracingSection/.test(aNode.className))
    {
      return aNode;
    }
    if (aNode.parentNode)
    {
      return fncGetEmbracingSection(aNode.parentNode);
    }
    else
    {
      return null;
    }
  }

  function fncIsSectionValued(aNode)
  {
    for (var i=0; i<aNode.childNodes.length; i++)
    {
      var node = aNode.childNodes[i];
      if (node.nodeName == "INPUT")
      {
        if (node.type == "text" || node.type == "textarea")
        {
          if (node.value != "" && node.value != null)
          {
            return true;
          }
        }
      }
      else if (node.nodeName == "SELECT")
      {
        if (node.value != "" && node.value != null)
        {
          return true;
        }
      }
      if (fncIsSectionValued(node))
      {
        return true;
      }
    }
    return false;
  }
  
  function fncToggleLed(headerSection)
  {
    // Search for the DIV of class headerIcon
    var nextNode = headerSection.childNodes[0];
    while (! /headerIcon/.test(nextNode.className))
    {
      nextNode = nextNode.nextSibling;
    }
    
    // Search for the first SPAN in this DIV
    var nextNode = nextNode.childNodes[0];
    while (nextNode.nodeName.toUpperCase() != "SPAN")
    {
      nextNode = nextNode.nextSibling;
    }
    
    // Toggle led buttons
    fncToggleButtons(nextNode);
  }
  
  // Toggle buttons contained in a SPAN element
  function fncToggleButtons(parentNode)
  {
    var nodes = parentNode.childNodes;
    for (var i=0; i<nodes.length; i++)
    {
      if (nodes[i].nodeName.toUpperCase() == "IMG")
      {
        var displayStyle = nodes[i].style.display;
        if (displayStyle == "inline" || displayStyle == "block" || "S" + displayStyle == "S")
        {
          nodes[i].style.display = "none";
        }
        else
        {
          nodes[i].style.display = "inline";
        }
      }
    }
  }
  
  function fncCheckEmbracingSection(embracingSectionNode)
  {
    var previousNode = embracingSectionNode.previousSibling;
    while (previousNode != null && ! /headerSection/.test(previousNode.className))
    {
      previousNode = previousNode.previousSibling;
    }
    
    if (previousNode != null)
    {
      for (var i=0; i < previousNode.childNodes.length; i++)
      {
        var node = previousNode.childNodes[i];
        if (node.nodeName.toUpperCase() == "INPUT" && node.type == "radio" && ! node.checked)
        {
          return false;
        }
      }
    }
    return true;
  }
  
  function fncCheckLeds(aNode)
  {
    var embracingSection = fncGetEmbracingSection(aNode);
    if (embracingSection != null)
    {
      // Check if the section contains at least one input field valued
      if (fncCheckEmbracingSection(embracingSection))
      {
      if (fncIsSectionValued(embracingSection))
      {
        // If yes, activate recursively all leds
        fncActivateLeds(aNode, true);
      }
      else
      {
        // If not, desactivate led and test recursively other leds
        fncSetLed(embracingSection, false)
        if (embracingSection.parentNode)
        {
          fncDesactivateLeds(embracingSection.parentNode, false);
        }
      }
      }
    }
  }
  
  function fncCheckAllLeds()
  {
    // Iterate through each xmsForm fields and check leds for each one
    if (document.forms["xmsForm"])
    {
      for (var i=0; i<document.forms["xmsForm"].length; i++)
      {
        var element = document.forms["xmsForm"].elements[i];
        fncCheckLeds(element);
      }
    }
  }
  
  function fncActivateLeds(aNode, recursive)
  {
    var embracingSection = fncGetEmbracingSection(aNode);
    if (embracingSection != null)
    {
      // Retrieve header from here
      fncSetLed(embracingSection, true);
      
      // Activate led
      if (embracingSection.parentNode && recursive)
      {
        fncActivateLeds(embracingSection.parentNode, recursive);
      }
    }
  }
  
  function fncSetLed(embracingSectionNode, activated)
  {
    if (activated)
    {
      var ledOn = fncGetLed(embracingSectionNode, "on");
      if (ledOn != null)
      {
        ledOn.style.display = "inline";
      }
      var ledOff = fncGetLed(embracingSectionNode, "off");
      if (ledOff != null)
      {
        ledOff.style.display = "none";
      }
    }
    else
    {
      var ledOn = fncGetLed(embracingSectionNode, "on");
      if (ledOn != null)
      {
        ledOn.style.display = "none";
      }
      var ledOff = fncGetLed(embracingSectionNode, "off");
      if (ledOff != null)
      {
        ledOff.style.display = "inline";
      }
    }
  }

  function fncGetLed(embracingSectionNode, whichLed)
  {
    // Search for the DIV of class headerIcon
    var nextNode = embracingSectionNode.childNodes[0];
    while (nextNode != null && ! /headerSection/.test(nextNode.className))
    {
      nextNode = nextNode.nextSibling;
    }
    
    // If a header section has been found, set led button
    if (nextNode != null)
    {
      nextNode = nextNode.childNodes[0];
      while (! /headerIcon/.test(nextNode.className))
      {
        nextNode = nextNode.nextSibling;
      }
    
      // Search for the first SPAN in this DIV
      var nextNode = nextNode.childNodes[0];
      while (nextNode.nodeName.toUpperCase() != "SPAN")
      {
        nextNode = nextNode.nextSibling;
      }
    
      // Search for the leds images
      var nodes = nextNode.childNodes;
      for (var i=0; i<nodes.length; i++)
      {
        if (nodes[i].nodeName.toUpperCase() == "IMG")
        {
          if (whichLed == "on" && /ledon/.test(nodes[i].className))
          {
            return nodes[i];
          }
          else if (whichLed == "off" && /ledoff/.test(nodes[i].className))
          {
            return nodes[i];
          }
        }
      }
      return null;
    }
    // If not, try to find leds upper in the hierarchy
    else
    {
      if (embracingSectionNode.parentNode)
      {
        var upperEmbracingSectionNode = fncGetEmbracingSection(embracingSectionNode.parentNode);
        if (upperEmbracingSectionNode != null)
        {
          return fncGetLed(upperEmbracingSectionNode, whichLed);
        }
      }
    }
  }

  
  function fncDesactivateLeds(aNode, recursive)
  {
    var embracingSection = fncGetEmbracingSection(aNode);
    if (embracingSection != null)
    {
      // Check for the DIV of class "section"
      var nextNode = embracingSection.childNodes[0];
      while (! /section/.test(nextNode.className))
      {
        nextNode = nextNode.nextSibling;
      }
      
      // Get all embracing sections 
      var isSectionEmpty = true;
      var nodes = nextNode.childNodes;
      for (var i=0; i<nodes.length; i++)
      {
        if (/embracingSection/.test(nodes[i].className))
        {
          var ledOn = fncGetLed(nodes[i], "on");
          if (ledOn != null && ledOn.style.display == 'inline')
          {
            isSectionEmpty = false;
          }
        }
        else if (/formField/.test(nodes[i].className))
        {
          if (fncIsSectionValued(nodes[i]))
          {
            isSectionEmpty = false;
          }
        }
      }
      
      if (isSectionEmpty)
      {
        var ledOn = fncGetLed(embracingSection, "on");
        if (ledOn != null)
        {
          ledOn.style.display = "none";
        }
        var ledOff = fncGetLed(embracingSection, "off");
        if (ledOff != null)
        {
          ledOff.style.display = "inline";
        }
      }
      else
      {
        var ledOn = fncGetLed(embracingSection, "on");
        if (ledOn != null)
        {
          ledOn.style.display = "inline";
        }
        var ledOff = fncGetLed(embracingSection, "off");
        if (ledOff != null)
        {
          ledOff.style.display = "none";
        }
      }
      
      if (embracingSection.parentNode && recursive)
      {
        fncDesactivateLeds(embracingSection.parentNode, recursive);
      }
    }
  }

  /*// Add a tooltip to every help icon
  function fncCreateTooltips(aNode)
  {
    for (var i=0; i<aNode.childNodes.length; i++)
    {
      var node = aNode.childNodes[i];
      if (node.nodeName.toUpperCase() == "IMG")
      {
        if (/helpicon/.test(node.className))
        {
          new YAHOO.widget.Tooltip(node.id, { context: node.id.substring(0, node.id.lastIndexOf("/tooltip")) } );
        }
      }
      fncCreateTooltips(node);
    }
  }*/
  
  // Return the date formatted with global format into the TSU format
  function fncFormatTSUDate(l_strDateValue)
  {
    // Display an error if the Date parameter is empty.
    if (("S" + l_strDateValue) != "S") 
    {
      var day = l_strDateValue.substr(g_strGlobalDateFormat.indexOf("d"), 2);
      var month = l_strDateValue.substr(g_strGlobalDateFormat.indexOf("m"), 2);
      var year = l_strDateValue.substr(g_strGlobalDateFormat.indexOf("y"), 4);
      
      return year + "-" + month + "-" + day;
    }
    else
      return "";
  }

  // Return the date/time formatted with global format into the TSU format
  function fncFormatTSUDateTime(l_strDateTimeValue)
  {
  //alert(l_strDateTimeValue);
    // Display an error if the Date parameter is empty.
    if (("S" + l_strDateTimeValue) != "S") 
    {
      var day = l_strDateTimeValue.substr(g_strGlobalDateTimeFormat.indexOf("dd"), 2);
      var month = l_strDateTimeValue.substr(g_strGlobalDateTimeFormat.indexOf("mm"), 2);
      var year = l_strDateTimeValue.substr(g_strGlobalDateTimeFormat.indexOf("yyyy"), 4);
      var hour = l_strDateTimeValue.substr(g_strGlobalDateTimeFormat.indexOf("hh"), 2);
      var minute = l_strDateTimeValue.substr(g_strGlobalDateTimeFormat.indexOf("mi"), 2);
      var second = l_strDateTimeValue.substr(g_strGlobalDateTimeFormat.indexOf("ss"), 2);
      
      return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
    }
    else
      return "";
  }

  // Return the amount formatted with global format into the TSU format
  function fncFormatTSUAmount(l_strDateValue)
  {
    // Display an error if the Date parameter is empty.
    if (("S" + l_strDateValue) != "S") 
    {
      // Strip all grouping delimiters
      //var regGrouping = new RegExp(g_strDigitGroupingDelimiter, "g");
      //l_strDateValue = l_strDateValue.replace(reg, "");
      while (l_strDateValue.indexOf(g_strDigitGroupingDelimiter) != -1)
      {
        l_strDateValue = l_strDateValue.replace(g_strDigitGroupingDelimiter, "");
      }
      l_strDateValue = l_strDateValue.replace(g_strDecimalDelimiter, ".");

      return l_strDateValue;
    }
    else
      return "";
  }
  