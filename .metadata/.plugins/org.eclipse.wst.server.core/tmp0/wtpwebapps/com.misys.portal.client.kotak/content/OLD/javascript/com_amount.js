// Copyright (c) 2000-2005 NEOMAlogic (http://www.neomalogic.com),
// All Rights Reserved. 

  // Return true whether the string parameter strDummy is a number OR is null
  function fncCheckIsNumber(strDummy)
  {
    for (var i = 0; i < strDummy.length; i++) 
    {
      var ch = strDummy.substring(i, i + 1);
      if (ch < "0" || "9" < ch) 
      {
        return false;
      }
    }
    return true;
  }

  // Validate that the input field contains an integer
  function fncCheckInteger(theObj) 
  {
    if (!fncCheckIsNumber(theObj.value))
    {
      fncShowError(11);
      theObj.value = "";
      theObj.focus();
      return false;
    }
  }

  // fncCheckNumber: checks if the input parameter is a valid number or not
  function fncCheckNumber(theNumber)
  {
    // Initialize a variable to count the number of
    // decimal delimiter to ensure there is no more
    // than one.
    var l_intCounterDecimalDelimiter = 0;
		for (var i = 0; i < theNumber.length; i++) 
    {
      var ch = theNumber.substring(i, i + 1);
      if (((ch < "0" || "9" < ch) && ch != g_strDecimalDelimiter && ch != g_strDigitGroupingDelimiter) 
          || (l_intCounterDecimalDelimiter > 1))
      	return false;
      
      else
      {
        if (ch == g_strDecimalDelimiter)
          l_intCounterDecimalDelimiter++;
      }
    }
    return true;
  }

  // fncCheckRawNumber: checks if the input parameter is a valid raw number or not (as opposed to an amount number)
  function fncCheckRawNumber(theNumber)
  {
    // Initialize a variable to count the number of
    // decimal delimiter to ensure there is no more
    // than one.
    var l_intCounterDecimalDelimiter = 0;

    for (var i = 0; i < theNumber.length; i++) 
    {
      var ch = theNumber.substring(i, i + 1);
      if (((ch < "0" || "9" < ch) && ch != g_strDecimalDelimiter) 
          || (l_intCounterDecimalDelimiter > 1))
      	return false;
      else
      {
        if (ch == g_strDecimalDelimiter)
          l_intCounterDecimalDelimiter++;
      }
    }
    return true;
  }

 	// fncFormatRate: formats the rate found in the theObj
  function fncFormatDecimal(theObj) 
  {
    var theNumber = theObj.value;
    var theResult;
    if (fncCheckRawNumber(theNumber) == false)
    {
      theObj.value = "";
      theObj.focus();
      return false;
    }
    return true;
  }

  // fncFormatAmount: formats the amount found in the theObj with the precision 
  // given by theDigits
  function fncFormatAmount(theObj,theDigits) 
  {
    // Disable the alert box: First check if the number of decimals is correct
    if (theDigits < 0)
    {
      theObj.value = "";
      theObj.focus();
      return false;
    }

    var theNumber = theObj.value;
    var theResult;
    if (fncCheckNumber(theNumber) == false)
    {
      theObj.value = "";
      theObj.focus();
      return false;
    }
    else
    {
      if ("S" + theNumber == "S")
      {
        theObj.value = "";
        return true;
      }
      else
      {
        if (theNumber == 0)
        {
          theResult = "S" + Math.pow(10, theDigits);
          theObj.value = (theDigits>0) ? "0" + g_strDecimalDelimiter + theResult.substring(2, theDigits+2) : "0";
        }
        else
        {
         	theNumber = "0" + theNumber.replace(eval("/" + fncEscapeCharacter(g_strDigitGroupingDelimiter) + "/g"),"");
          if (g_strDecimalDelimiter != ".") 
          {
            theNumber = theNumber.replace(eval("/" + fncEscapeCharacter(g_strDecimalDelimiter) + "/g"),".");
          }
          theResult = Math.round(eval(theNumber * Math.pow(10, theDigits)));
          theResult = "S" + eval(theResult / Math.pow(10, theDigits));
          if (g_strDecimalDelimiter != ".") 
          {
            theResult = theResult.replace(/\./g,g_strDecimalDelimiter);
          }
          theDec = theResult.indexOf(g_strDecimalDelimiter);
          if (theDec > -1)
          {
            theEnd = "" + theResult.substring(theDec,theResult.length);
            for (var l = 0; l<=eval(theDigits - theEnd.length); l++)
            {
              theEnd += "0";
            }
            theResult = theResult.substring(1, theDec);
          }
          else
          {
            if (theDigits == 0)
            {
              theEnd = "";
            }
            else
            {
              theEnd = g_strDecimalDelimiter;
          for (var l = 1; l<=theDigits; l++)
          {
            theEnd += "0";
          }
            }
            theResult = theResult.substring(1,theResult.length);
          }

          var temp1 = "";
          var temp2 = "";

          var count = 0;
          for (var k = theResult.length-1; k >= 0; k--) 
          {
          var oneChar = theResult.charAt(k);
          if (count == 3) 
          {
            temp1 += g_strDigitGroupingDelimiter;
            temp1 += oneChar;
            count = 1;
            continue;
          }
            else 
          {
            temp1 += oneChar;
            count ++;
          }
          }
          for (var k = temp1.length-1; k >= 0; k--) 
          {
          var oneChar = temp1.charAt(k);
          temp2 += oneChar;
          }
          theObj.value = temp2 + theEnd;
        }
        return true;
      }
    }
  }

  // fncFormatAmount: formats the amount found in the amount with the precision 
  // given by theDigits
  // Note the difference with the format amount is that the argument is not a
  // DOM object
  function fncFormatHtmlAmount(theAmount,theDigits) 
  {
    theFormattedAmount = "";
 		// Disable the alert box: First check if the number of decimals is correct
    if (theDigits < 0)
    {
      theFormattedAmount = "";
      return false;
    }

    theResult = "";
    if (fncCheckNumber(theAmount) == false)
    {
      theFormattedAmount = "";
      return false;
    }
    else
    {
      if ("S" + theAmount == "S")
      {
        return "";
      }
      else
      {
        if (theAmount == 0)
        {
          theResult = "S" + Math.pow(10, theDigits);
          theFormattedAmount = (theDigits>0) ? "0" + g_strDecimalDelimiter + theResult.substring(2, theDigits+2) : "0";
        }
        else
        {
         	theAmount = "0" + theAmount.replace(eval("/" + fncEscapeCharacter(g_strDigitGroupingDelimiter) + "/g"),"");
          if (g_strDecimalDelimiter != ".") 
          {
            theAmount = theAmount.replace(eval("/" + fncEscapeCharacter(g_strDecimalDelimiter) + "/g"),".");
          }
          theResult = Math.round(eval(theAmount * Math.pow(10, theDigits)));
          theResult = "S" + eval(theResult / Math.pow(10, theDigits));
          if (g_strDecimalDelimiter != ".") 
          {
            theResult = theResult.replace(/\./g,g_strDecimalDelimiter);
          }
          theDec = theResult.indexOf(g_strDecimalDelimiter);
          if (theDec > -1)
          {
            theEnd = "" + theResult.substring(theDec,theResult.length);
            for (var l = 0; l<=eval(theDigits - theEnd.length); l++)
            {
              theEnd += "0";
            }
            theResult = theResult.substring(1, theDec);
          }
          else
          {
            if (theDigits == 0)
            {
              theEnd = "";
            }
            else
            {
              theEnd = g_strDecimalDelimiter;
          for (var l = 1; l<=theDigits; l++)
          {
            theEnd += "0";
          }
            }
            theResult = theResult.substring(1,theResult.length);
          }

          var temp1 = "";
          var temp2 = "";

          var count = 0;
          for (var k = theResult.length-1; k >= 0; k--) 
          {
          var oneChar = theResult.charAt(k);
          if (count == 3) 
          {
            temp1 += g_strDigitGroupingDelimiter;
            temp1 += oneChar;
            count = 1;
            continue;
          }
            else 
          {
            temp1 += oneChar;
            count ++;
          }
          }
          for (var k = temp1.length-1; k >= 0; k--) 
          {
          var oneChar = temp1.charAt(k);
          temp2 += oneChar;
          }
          theFormattedAmount = temp2 + theEnd;
        }
        return theFormattedAmount;
      }
    }    
   
  }

  // fncFormatTextAmount: formats the amount passed with the precision 
  // given by theDigits, and returns it as a string
  function fncFormatTextAmount(theUnFormattedAmount,theDigits) 
  {
    //Disable the alert box: First check if the number of decimals is correct
    if (theDigits < 0)
      return false;

    var theNumber = theUnFormattedAmount;
    var theResult;
    if (theNumber == 0)
    {
      theResult = "S" + Math.pow(10, theDigits);
      return (theDigits>0) ? "0" + g_strDecimalDelimiter + theResult.substring(2, theDigits+2) : "0";
    }
    else
    {
      theResult = Math.round(eval(theNumber * Math.pow(10, theDigits)));
      theResult = "S" + eval(theResult / Math.pow(10, theDigits));
      if (g_strDecimalDelimiter != ".") 
      {
        theResult = theResult.replace(/\./g,g_strDecimalDelimiter);
      }
      theDec = theResult.indexOf(g_strDecimalDelimiter);
      if (theDec > -1)
      {
        theEnd = "" + theResult.substring(theDec,theResult.length);
        for (var l = 0; l<=eval(theDigits - theEnd.length); l++)
          theEnd += "0";
        theResult = theResult.substring(1, theDec);
      }
      else
      {
        if (theDigits == 0)
          theEnd = "";
        else
        {
          theEnd = g_strDecimalDelimiter;
          for (var l = 1; l<=theDigits; l++)
            theEnd += "0";
        }
        theResult = theResult.substring(1,theResult.length);
      }

      var temp1 = "";
      var temp2 = "";

      var count = 0;
      for (var k = theResult.length-1; k >= 0; k--) 
      {
        var oneChar = theResult.charAt(k);
        if (count == 3) 
        {
          temp1 += g_strDigitGroupingDelimiter;
          temp1 += oneChar;
          count = 1;
          continue;
        }
        else 
        {
          temp1 += oneChar;
          count ++;
        }
      }
      for (var k = temp1.length-1; k >= 0; k--) 
      {
        var oneChar = temp1.charAt(k);
        temp2 += oneChar;
      }
      return temp2 + theEnd;
    }
  }

  //fncUnFormatTextAmount: unformats the amount string
  function fncUnFormatTextAmount(l_strFormattedAmount) 
  {
    if ("S" + l_strFormattedAmount == "S")
      return 0;
    else
    {
      // Split the string by the grouping delimiter (g_strDigitGroupingDelimiter)
      var l_arrDummy = l_strFormattedAmount.split(g_strDigitGroupingDelimiter);
      // Rebuild the string without this delimiter
      l_strFormattedAmount = l_arrDummy.join("");
      if (g_strDecimalDelimiter != ".") 
      {
        l_strFormattedAmount = l_strFormattedAmount.replace(eval("/" + fncEscapeCharacter(g_strDecimalDelimiter) + "/g"),".");
      }
      delete l_arrDummy;
      return l_strFormattedAmount;
    }
  }
  // Returns the escaped character
  function fncEscapeCharacter(theCharacter)
  {
    
    var literals = ['.', '/', '\\', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}'];
    var isLiteral = false;
    for (i=0; (!isLiteral) && (i<literals.length); i++)
    {
      if (theCharacter == literals[i])
      {
        isLiteral = true;
      }
    }
    var returnedCharacter;
    if (isLiteral)
    {
      returnedCharacter = '\\' + theCharacter;
    }
    else
    {
      returnedCharacter = theCharacter;
    }
    return returnedCharacter;
  }
  
  // fncFormatRate: formats the amount found in the theObj with the precision 
  // given by theDigits
  function fncFormatRate(theObj) 
  {
    var theNumber = theObj.value;
    var theResult;
    if (!fncCheckRawNumber(theNumber))
    {
      theObj.value = "";
      theObj.focus();
      fncShowError(11,'','','','','');
      return false;
    }
    return true;
  } 

  // Compute a percentage
  function doPercentage(total, percentage, scale) 
	{
  	var one = eval(total);
  	var two = eval(percentage)/100;  
  	var prod = one  *   two;
  	return custRound(prod,scale);
  }
  
  // Rounding function
  function custRound(x,scale) 
  {
  	return (Math.round(x*Math.pow(10,scale)))/Math.pow(10,scale);
  }

// Compute the amount of a FT
   function fncComputeFTTotalAmount(formName, structureName, strFTAmtName, strTnxAmtName, strCurCodeName)
  {
    //Montant max pour un virement (valeur non comprise)
    maxAmount = 100000000000000;
  	amount = parseFloat(0);
  
  	// Create an array that holds the existing purchase order item indexes
  	var arrElements = new Array();
  	eval("var regExp = /" + structureName + "_details_ft_amt_\d*/");
    for (j=0; j<document.forms[formName].elements.length; j++)
    {
    	if ((document.forms[formName].elements[j].name.indexOf("nbElement") == -1) && regExp.test(document.forms[formName].elements[j].name))
    	{
    	  	tempAmount = fncUnFormatTextAmount(document.forms[formName].elements[j].value);
    	  	amount = parseFloat(amount) + parseFloat(tempAmount);
    	  	}
    	}
    
    //if (!(amount < maxAmount))
    // {
    //  fncShowError(511,'100'+g_strDigitGroupingDelimiter+'000'+g_strDigitGroupingDelimiter+'000'+g_strDigitGroupingDelimiter+'000'+g_strDigitGroupingDelimiter+'000'+g_strDigitGroupingDelimiter+g_strDecimalDelimiter+'00','','','','');
		//	return false;      
   //  }
    

    if (document.forms[formName] && document.forms[formName].elements[strFTAmtName])
    {
    	amount = ''+amount;
    	amount = amount.replace(/\./g, g_strDecimalDelimiter);
    	document.forms[formName].elements[strFTAmtName].value = amount;
    	fncFormatAmount(document.forms[formName].elements[strFTAmtName], fncGetCurrencyDecNo(document.forms[formName].elements[strCurCodeName].value));
    }

    if (document.forms[formName] && document.forms[formName].elements[strTnxAmtName])
   	{
    	document.forms[formName].elements[strTnxAmtName].value = document.forms[formName].elements[strFTAmtName].value;
    }
    return true;
  }
  
    
