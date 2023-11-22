// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
// All Rights Reserved. 

// ---------------------------------------------------------
// Error Messages, Formats and Related Functions in ENGLISH
// ---------------------------------------------------------

// Language Code
var g_strLanguageCode = "en";


// Constants for Amount format
var g_strDecimalDelimiter = ".";
var g_strDigitGroupingDelimiter = ",";


// Constants for Date format
var g_strGlobalDateFormat = "dd/mm/yyyy";
var g_strGlobalDateTimeFormat = "dd/mm/yyyy hh:mi:ss";
var g_strGlobalDateDelimiter = "/";
var g_strGlobalDateStartWeek = 0; // First day of the week, 0 for sunday, 1 for monday, etc.
var g_arrShortDayLabel = new Array('S','M','T','W','T','F','S');


// Perform SWIFT character set checking in the transaction submissions
var g_blnSWIFTChecking = true;


// Months
g_arrMonthLabel = new Array(13);

g_arrMonthLabel[1] = "January";
g_arrMonthLabel[2] = "February";
g_arrMonthLabel[3] = "March";
g_arrMonthLabel[4] = "April";
g_arrMonthLabel[5] = "May";
g_arrMonthLabel[6] = "June";
g_arrMonthLabel[7] = "July";
g_arrMonthLabel[8] = "August";
g_arrMonthLabel[9] = "September";
g_arrMonthLabel[10] = "October";
g_arrMonthLabel[11] = "November";
g_arrMonthLabel[12] = "December";

//
// Error Messages
//
g_arrErrorMessages = new Array();

g_arrErrorMessages[1] = "The currency %s is not defined as a valid currency.";

g_arrErrorMessages[2] = "There is no '%s' in %s %s.";
g_arrErrorMessages[3] = "%s is not a valid Month.";
g_arrErrorMessages[4] = "%s is not a valid Year.";
g_arrErrorMessages[5] = "%s is not a valid date (%s).";

g_arrErrorMessages[6] = "The Issue Date (%s) must be posterior or equal \nto the Application Date (%s).";
g_arrErrorMessages[7] = "The Issue Date (%s) must be prior or equal \nto the Expiry Date (%s).";
g_arrErrorMessages[8] = "The Last Shipment Date (%s) must be posterior or equal \nto the Application Date (%s).";
g_arrErrorMessages[9] = "The Expiry Date (%s) must be posterior or equal \nto the Application Date (%s).";
g_arrErrorMessages[10] = "The Expiry Date (%s) must be posterior or equal \nto the Last Shipment Date (%s).";

g_arrErrorMessages[11] = "This field must contain a valid number.";
g_arrErrorMessages[12] = "The Positive or Negative Tolerances and the Maximum \nCredit Amount are mutually exclusive.";
g_arrErrorMessages[13] = "All mandatory fields must be populated to proceed \nwith a submission of the transaction.";

g_arrErrorMessages[14] = "The number of lines of the field is exceeding its maximum (%s lines).";
g_arrErrorMessages[15] = "The size of the field is exceeding its maximum (%s lines x %s characters).";

g_arrErrorMessages[16] = "A Stand-By LC must be Irrevocable to be Transferable.";

g_arrErrorMessages[17] = "The Amendment Date (%s) must be posterior or equal \nto the Issue Date (%s).";
g_arrErrorMessages[18] = "The amount decreased cannot be greater than the current amount.";
g_arrErrorMessages[19] = "In order for the transaction to be valid, at least \none input field must be amended.";
g_arrErrorMessages[20] = "Sorry, your browser doesn't support this feature.\n You may refer to the list of recommended browsers to workaround this issue.";

g_arrErrorMessages[21] = "The Issue Date (%s) must be prior or equal \nto the Maturity Date (%s).";
g_arrErrorMessages[22] = "The Maturity Date (%s) must be posterior or equal \nto the Application Date (%s).";

g_arrErrorMessages[23] = "The Template Id is a mandatory field if you intend to \nsave your transaction details as a template.";

g_arrErrorMessages[24] = "The new amount exceeds the maximum value authorized.";

g_arrErrorMessages[25] = "The Amendment Date (%s) must be prior or equal \nto the New Expiry Date (%s).";

g_arrErrorMessages[26] = "Based on the selected SWIFT send mode, the illegal character '%s' \nhas been found in your transaction record. Please correct the related field \nknowing that the allowed character set includes the following characters:\na..zA..Z0..9 /-?:().,'+";

g_arrErrorMessages[27] = "When increasing or decreasing the amount of the transaction,\nthe reason for such an amendment must be given in the narrative field.";

// same message g_arrErrorMessages[8]
//g_arrErrorMessages[28] = "The Last Shipment Date (%s) must be posterior or equal \nto the Application Date (%s).";

g_arrErrorMessages[29] = "The Execution Date (%s) must be posterior or equal \nto the Application Date (%s).";

g_arrErrorMessages[30] = "The character '%s' is not allowed for this field.";

g_arrErrorMessages[31] = "All mandatory fields must be populated.";

g_arrErrorMessages[32] = "Some details need to be validated to proceed \nwith a submission of the transaction.";

g_arrErrorMessages[33] = "This item already exists in your list. Please rename it.";

g_arrErrorMessages[34] = "The password length is invalid (please key between %s and %s characters).";
// Alternative error message
g_arrErrorMessages[35] = "The password is invalid (the password must be at minimum %s characters long, \nand at least include one digit and one letter).";


g_arrErrorMessages[36] = "You must define an exchange rate before computing the equivalent amount."

g_arrErrorMessages[37] = "You haven't selected the format for all presented documents.";

g_arrErrorMessages[38] = "You must choose one and only one link for this news.";

g_arrErrorMessages[39] = "Sorry, a maximum of %s entries is authorised.";
g_arrErrorMessages[40] = "This parameter is already used in a criterion with a column of different type. \nPlease choose another parameter.";
//Telex
g_arrErrorMessages[41] = "Based on the selected TELEX send mode, the illegal character '%s' \nhas been found in your transaction record. Please correct the related field \nknowing that the allowed character set includes the following characters:\nA..Z0..9'()+,-./:=?";

g_arrErrorMessages[42] = "You have chosen to use relative column widths.\nThus the sum of the widths of the columns must be equal to 100%, and all columns widths must have a value .";

g_arrErrorMessages[43] = "You must choose at least a latest shipment date \nor a shipment period.";

g_arrErrorMessages[44] = "You must populate the applicant's details.";

g_arrErrorMessages[45] = "Transfer amount can't be greater than Letter of Credit amount.";

g_arrErrorMessages[46] = "The maximum number of lines displayed \nupon execution of the report must be between 1 and 100.";

g_arrErrorMessages[47] = "The report is not multi-product. You cannot add another product.";

g_arrErrorMessages[48] = "You must choose a frequence";
g_arrErrorMessages[49] = "You must choose one day of the week";
g_arrErrorMessages[50] = "You must you one day of the month.";
g_arrErrorMessages[51] = "The size of the field is exceeding its maximum (%s characters allowed. You wrote %s characters of them.).";

// Collaboration Suite
g_arrErrorMessages[100] = "You must first choose a bank.";

//
// Confirmation Messages
//
g_arrConfirmationMessages = new Array();

g_arrConfirmationMessages[1] = "æ³¨æ„?: You are going to save the details of the current \ntransaction. Are you sure?";
g_arrConfirmationMessages[2] = "You are going to attempt a submission of the \nthe current transaction. Are you sure?";
g_arrConfirmationMessages[3] = "You are going to save the details of the \ntransaction as a template. Are you sure?";
g_arrConfirmationMessages[4] = "You are going to leave the current page. \nAre you sure?";
g_arrConfirmationMessages[5] = "You are going to be presented with a form letting you \nupdate the transaction data. Do you want to proceed?";
g_arrConfirmationMessages[6] = "You are going to delete %s transaction records. \nAre you sure?";
g_arrConfirmationMessages[7] = "You are going to delete the record '%s' \nfrom the system. Are you sure?";

g_arrConfirmationMessages[8] = "Your Description of Goods exceeds the maximum size \nallowed in a SWIFT message (100 lines). Do you wish to \nswitch to an alternate send mode instead?";
g_arrConfirmationMessages[9] = "Your list of Documents Required exceeds the maximum \nsize allowed in a SWIFT message (100 lines). Do you wish \nto switch to an alternate send mode instead?";
g_arrConfirmationMessages[10] = "Your Additional Instructions exceed the maximum size \nallowed in a SWIFT message (100 lines). Do you wish to \nswitch to an alternate send mode instead?";
g_arrConfirmationMessages[11] = "You are going to remove this item. Are you sure?";

g_arrConfirmationMessages[12] = "You are going to download a file of %s. Are you sure?";

g_arrConfirmationMessages[13] = "You are going to reject the current transaction. Are you sure?";

g_arrConfirmationMessages[14] = "You are going to version the selected documents. \nDo you want to proceed?";
g_arrConfirmationMessages[15] = "You are going to add a document. \nDo you want to proceed?";
g_arrConfirmationMessages[16] = "You are going to delete a document. \nDo you want to proceed?";
g_arrConfirmationMessages[17] = "You are going to be presented with a form letting you \nupdate the document data. Do you want to proceed?";
g_arrConfirmationMessages[18] = "You are going to be presented with a form letting you \nupdate the template data. Do you want to proceed?";
g_arrConfirmationMessages[19] = "Do you want to close the template data form?";
g_arrConfirmationMessages[20] = "You are going to change the total currency.\nYou may loose some data in your product and charge forms.\nAre you sure?";
g_arrConfirmationMessages[21] = "You are going to attempt a submission of the \nthe current transaction. Are you sure?\n\nNote: the %s being subject to the eUCP,\nmake sure you've correctly specified\nthe required electronic format.";
g_arrConfirmationMessages[22] = "You are going to submit %s transaction records. \nAre you sure?";
g_arrConfirmationMessages[23] = "Changing the product will remove your current report configuration.\nAre you sure?";
g_arrConfirmationMessages[24] = "The parameter %s is used by one or more criterion(a). \nRemoving this item will remove as well the associated criterion(a). \nDo you want to proceed?";
g_arrConfirmationMessages[25] = "You are going to load %s records. \nAre you sure?";
g_arrConfirmationMessages[26] = "The place of loading or the final desination of the \ngoods has not been entered. \nAre you sure you want to submit the transaction details ?";
g_arrConfirmationMessages[27] = "You are going to send the transaction by TELEX. \n Are you sure you want to submit the transaction details ?";
g_arrConfirmationMessages[28] = "This parameter is used by one or more criterion(a). \nRenaming this parameter will remove the associated criterion(a). \nDo you want to proceed?";
g_arrConfirmationMessages[29] = "This computed field is used by one or more aggregate(s). \nChanging the identifier will remove the associated aggregate(s). \nDo you want to proceed?";
g_arrConfirmationMessages[30] = "You are going to save your data. \nAre you sure?";

// Collaboration Suite
g_arrConfirmationMessages[100] = "You are going to associate this customer \nwith the counterparty(ies) previously selected. \nAre you sure?";

//
// Information messages
//
g_arrInformationMessages = new Array();

g_arrInformationMessages[1] = "Message from the bank upon the previous submission:\n\n%s";
g_arrInformationMessages[2] = "The date's range is not valid. It's a mandatory field and restricted to %s month(s)";
g_arrInformationMessages[3] = "Warning : 29, 30, 31 are not available for all month of the year.";
g_arrInformationMessages[4] = "The date's range is not valid. It's a mandatory field and restricted to %s day(s)";


  // Utility to substitute the %s appearing in the message definition with the actual text
  function fncPrepareMessage(strTempMessage, strText1, strText2, strText3, strText4, strText5) 
  {
    if (strText1)
    {
      strTempMessage = strTempMessage.replace(/%s/,strText1);
      if (strText2)
      {
        strTempMessage = strTempMessage.replace(/%s/,strText2);
        if (strText3) 
        {
          strTempMessage = strTempMessage.replace(/%s/,strText3);
          if (strText4) 
          {
            strTempMessage = strTempMessage.replace(/%s/,strText4);
            if (strText5) 
              strTempMessage = strTempMessage.replace(/%s/,strText5);
          }
        }
      }
    }
    return strTempMessage;
  }

  // Displays an error box for the error code passed as input parameter
  function fncShowError(intErrorCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strErrorMessage = g_arrErrorMessages[intErrorCode];
    window.alert("ERROR - " + fncPrepareMessage(strErrorMessage, strText1, strText2, strText3, strText4, strText5));
  }

  // Displays a confirmation popup window returning true if the user clicks OK
  // and false otherwise
  function fncShowConfirmation(intMessageCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strConfirmationMessage = g_arrConfirmationMessages[intMessageCode];
    return window.confirm(fncPrepareMessage(strConfirmationMessage, strText1, strText2, strText3, strText4, strText5));
  }
  // Displays an information popup window
  function fncShowInformation(intMessageCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strInformationMessage = g_arrInformationMessages[intMessageCode];
    window.alert(fncPrepareMessage(strInformationMessage, strText1, strText2, strText3, strText4, strText5));
  }

  // Get an information message
  function getInformationMessage(intMessageCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strInformationMessage = g_arrInformationMessages[intMessageCode];
    return fncPrepareMessage(strInformationMessage, strText1, strText2, strText3, strText4, strText5);;
  }  
