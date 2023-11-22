// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
// All Rights Reserved. 

//Create a generic Date object.
var g_objDate = new Object();
var nbMillisInDay  = 86400000;      // 1000 x 60 x 60 x 24

// fncGetDaysInMonth(): calendar function to get the number of days in a given
// month of a given year.
function fncGetDaysInMonth(month,year)  {
    var days = 0;
    month = parseInt(month,10);
    year = parseInt(year,10);
    if (month==1 || month==3 || month==5 || month==7 || month==8 ||
        month==10 || month==12)  days=31;
    else if (month==4 || month==6 || month==9 || month==11) days=30;
    else if (month==2)  {
        if (fncIsLeapYear(year)) {
            days=29;
        }
        else {
            days=28;
        }
    }
    return (days);
}


// fncIsLeapYear(): calendar function to check if the year passed is a leap
// year or not.
function fncIsLeapYear (Year) {
    if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
        return (true);
    }
    else {
        return (false);
    }
}

// Check the parameter is a valid date.
function fncCheckValidDate(l_objDateToCheck)
{
  l_strDateToCheck = l_objDateToCheck.value;
  // Return false if the parameter is null
  if ("S" + l_strDateToCheck != "S")
  {
    // If there is no delimiter and 6 (ddmmyy) or 8 (ddmmyyyy) digits,
  	// add delimiter every 2 digits.
  	if (((l_strDateToCheck.length == 6) || (l_strDateToCheck.length == 8)) && l_strDateToCheck.indexOf(g_strGlobalDateDelimiter) <= 0)
  	{
  	   l_strDateToCheck = l_strDateToCheck.slice(0,2)+g_strGlobalDateDelimiter+l_strDateToCheck.substr(2,2)+g_strGlobalDateDelimiter+l_strDateToCheck.slice(4);
  	}
		// Test globally the format is valid
    if (fncSetObjectDate(l_strDateToCheck, g_strGlobalDateFormat))
    {
      // Test year is a valid integer
      if (!isNaN(parseInt(g_objDate.Year,10)) )
      {
		// Test month exists
		var l_intMaxDays = fncGetDaysInMonth(g_objDate.Month, g_objDate.Year);
        if (l_intMaxDays != 0)
        {
			// Test day is valid for this month
			var l_intDays = parseInt(g_objDate.Day,10);
			if (!isNaN(l_intDays) && l_intDays >= 1 && l_intDays <= l_intMaxDays)
			{
				if (fncGetElement("hidden_" + l_objDateToCheck.name + "_ID"))
				{
					eval("hidden_" + l_objDateToCheck.name + "_Object").changeFullDate(g_objDate.Day, g_objDate.Month, g_objDate.Year);
				}
				return true;
			}
			else
			{
	            fncShowError(2,g_objDate.Day,g_arrMonthLabel[parseInt(g_objDate.Month,10)],g_objDate.Year);
	            return false;
		  	}
        }
        else
        {
          fncShowError(3,g_objDate.Month);
          return false;
	    }
     }
	 else
     {
        fncShowError(4,g_objDate.Year);
        return false;
	 }
    }
    else
    {
      fncShowError(5,g_objDate.Year,g_strGlobalDateFormat);
      return false;
    }
  }
  else
  {
    return true;
  }
}

//Shorten a Date format
function fncShortenFormat(l_strLongFormat)
{
  // Split Format by delimiters into an array.
  var l_arrFormat = l_strLongFormat.split(g_strGlobalDateDelimiter);

  // Retain only the first character of each element of the Format array...
  l_arrFormat[0] = l_arrFormat[0].charAt(0);
  l_arrFormat[1] = l_arrFormat[1].charAt(0);
  l_arrFormat[2] = l_arrFormat[2].charAt(0);
  // ... and build a very short version of the format string
  // where each of d m and y, respectively Day Month and Year, is located
  // at its position in the Format array.

  return  l_arrFormat.join("");
}

// Return the date formatted with global format into the format given
// in the second parameter or the Global Date Format if omitted.
function fncFormatDate(l_strDateValue, l_strDateFormat)
{
  // Display an error if the Date parameter is empty.
  if (("S" + l_strDateValue) != "S") 
  {
    // If there is no delimiter and 6 (ddmmyy) or 8 (ddmmyyyy) digits,
  	// add delimiter every 2 digits.
  	if (((l_strDateValue.length == 6) || (l_strDateValue.length == 8)) && l_strDateValue.indexOf(g_strGlobalDateDelimiter) <= 0)
  	{
  	   l_strDateValue = l_strDateValue.slice(0,2)+g_strGlobalDateDelimiter+l_strDateValue.substr(2,2)+g_strGlobalDateDelimiter+l_strDateValue.slice(4);
  	}
    // Use the Global Date Format if the Format parameter is empty
    if (("S" + l_strDateFormat) == "S")
    {
      l_strDateFormat = g_strGlobalDateFormat;
		}
    // Split the Date parameter into an array.
    var l_arrDate = l_strDateValue.split(g_strGlobalDateDelimiter);
    // Get a short version of the format.
    var l_strShortFormat = fncShortenFormat(l_strDateFormat);
    // Get a short version of the GLOBAL format.
    var l_strShortGlobalFormat = fncShortenFormat(g_strGlobalDateFormat);

    // Build another array following the Date Format order for its element.
    var l_arrFormattedDate = new Array(3);
    l_arrFormattedDate[l_strShortFormat.indexOf("d")] = l_arrDate[l_strShortGlobalFormat.indexOf("d")];
    l_arrFormattedDate[l_strShortFormat.indexOf("m")] = l_arrDate[l_strShortGlobalFormat.indexOf("m")];
    l_arrFormattedDate[l_strShortFormat.indexOf("y")] = l_arrDate[l_strShortGlobalFormat.indexOf("y")];

    //Build a pre-formatted string.
    l_strTempoDate = l_arrFormattedDate.join(g_strGlobalDateDelimiter);

    //Set Date object attribute
	fncSetObjectDate(l_strTempoDate, l_strDateFormat);

		//Format the Date object attribute
    fncCheckObjectDate;
	
    //Update the array
		l_arrFormattedDate[l_strShortFormat.indexOf("d")] = g_objDate.Day;
    l_arrFormattedDate[l_strShortFormat.indexOf("m")] = g_objDate.Month;
    l_arrFormattedDate[l_strShortFormat.indexOf("y")] = g_objDate.Year;

    //Eventually build a formatted string.
    return l_arrFormattedDate.join(g_strGlobalDateDelimiter);
  }
  else
   return "";
}

// Check Day and Month of g_objDate are 2-digits length
// and Year is 4-digits.
function fncCheckObjectDate()
{
  var l_strDay = "" + g_objDate.Day;
  var l_strMonth = "" + g_objDate.Month;

  // Be sure the year is set on 4 digits.
  if ("S" + g_objDate.Year != "S")
  {
    if(g_objDate.Year.length == 3)
    {
      g_objDate.Year = 0+g_objDate.Year;
    }
    else if (parseInt(g_objDate.Year,10) < 80 )
    {
      g_objDate.Year = parseInt(g_objDate.Year,10) + 2000;
    }
    else
    {
      if (parseInt(g_objDate.Year,10) < 100 )
      {
        g_objDate.Year = parseInt(g_objDate.Year,10) + 1900;
      }
    }
  }
  // Be sure Month is 2 digits
  if ("S" + l_strMonth != "S")
  {
    if ( l_strMonth.length == 1 )
    {
       g_objDate.Month = "0" + l_strMonth;
    }
  }
  // Be sure Day is 2 digits
  if ("S" + l_strDay != "S")
  {
    if ( l_strDay.length == 1 )
    {
       g_objDate.Day = "0" + l_strDay;
    }
  }
}

// Set attribute Day, Month and Year of the generic
// Date Object from a string as first parameter following
// a date format given as a second parameter.
function fncSetObjectDate(l_strDateValue, l_strDateFormat)
{
  if (("S" + l_strDateValue) != "S") 
  {
    if (("S" + l_strDateFormat) != "S")
    {  
      // Split the Date parameter into an array.
      var l_arrDate = l_strDateValue.split(g_strGlobalDateDelimiter);
      if (l_arrDate.length == 3)
      {
        // Get a short version of the format.
        var l_strShortFormat = fncShortenFormat(l_strDateFormat);

        // Set attributes following the Date Format order for its element.
        g_objDate.Day   = "" + l_arrDate[l_strShortFormat.indexOf("d")];
        g_objDate.Month = "" + l_arrDate[l_strShortFormat.indexOf("m")];
        g_objDate.Year  = "" + l_arrDate[l_strShortFormat.indexOf("y")];

        // Check lengths are valid.
	    fncCheckObjectDate();

	    return true;
      }
	  else
	  {
	    g_objDate.Day = "";
	    g_objDate.Month = "";
	    g_objDate.Year = l_strDateValue;
	    return false;
	  }
    }
	else
	{
	  return false;
	}
  }
  else
  {
    return false;
  }
}

// Return a date from the attribute Day, Month and Year of
// the generic Date Object following the Date Format parameter.
function fncBuildDate(l_strDateFormat)
{
  if ("S" + l_strDateFormat != "S")
  {
    if ( (("S" + g_objDate.Day) != "S") && (("S" + g_objDate.Month) != "S") &&(("S" + g_objDate.Year) != "S") )
    {
      // Check attribute length
	  fncCheckObjectDate();
	  
	  // Get a short version of the GENERAL format.
      var l_strShortFormat = fncShortenFormat(l_strDateFormat);

	  // Get each attribute from its position in the very short format.
      var l_arrFormattedDate = new Array(3);
      l_arrFormattedDate[l_strShortFormat.indexOf("d")] = "" + g_objDate.Day;
      l_arrFormattedDate[l_strShortFormat.indexOf("m")] = "" + g_objDate.Month;
      l_arrFormattedDate[l_strShortFormat.indexOf("y")] = "" + g_objDate.Year;

      //Eventually build a formatted string.
      return l_arrFormattedDate.join(g_strGlobalDateDelimiter);
    }
    else
    {
      return false;
    }
  }
  else
  {
    return false;
  }
}

// Check if strToDateName - strFromDateName <= nbMonth. 
function fncCheckMonthRangeDate(strFormName, strFromDateName, strToDateName, nbMonth)
{
	var fromDate;
	var toDate;
	if(document.forms[strFormName] && document.forms[strFormName].elements[strFromDateName])
  {
	 	fncSetObjectDate(document.forms[strFormName].elements[strFromDateName].value, g_strGlobalDateFormat);
		fromDate = new Date(g_objDate.Year, g_objDate.Month - 1, g_objDate.Day, 0, 0, 0, 0);
	}
	else
	{
	  	fromDate = new Date();
	 }
    
	if(document.forms[strFormName] && document.forms[strFormName].elements[strToDateName])
	{
		fncSetObjectDate(document.forms[strFormName].elements[strToDateName].value, g_strGlobalDateFormat);
		toDate = new Date(g_objDate.Year, g_objDate.Month - 1, g_objDate.Day, 0, 0, 0, 0);
	}
	else
	{
	 	toDate = new Date();
	}
  
    // Both are not null
	if(fromDate.value !="" && toDate.value !="")
    {
      fromDate.setHours(0);
    	fromDate.setMinutes(0);
    	fromDate.setSeconds(0);
    	fromDate.setMilliseconds(0);
    	
    	toDate.setHours(0);
    	toDate.setMinutes(0);
    	toDate.setSeconds(0);
    	toDate.setMilliseconds(0);
	  
	  	var diff = Math.floor(12*((Math.floor(toDate.getFullYear())-Math.floor(fromDate.getFullYear())))
	    		+  (Math.floor(toDate.getMonth())-Math.floor(fromDate.getMonth())));
      
		if ((diff >=0 && diff <= (parseInt(nbMonth, 10)))
			||(diff == parseInt(nbMonth, 10) && (Math.floor(fromDate.getDate()) >= (Math.floor(toDate.getDate())))))
		{
		  return true;
		}
	}

  	fncShowInformation(2,nbMonth);
  	return false;
}

// Check if strToDateName - strFromDateName <= nbDay.
// If strFromDateName (or strToDateName), test is done against current date.
function fncCheckDayRangeDate(strFormName, strFromDateName, strToDateName, nbDay)
{
	var fromDate;
	var toDate;
	var messageInformation = 4;
	if(document.forms[strFormName] && document.forms[strFormName].elements[strFromDateName])
	{
	 	fncSetObjectDate(document.forms[strFormName].elements[strFromDateName].value, g_strGlobalDateFormat);
		fromDate = new Date(g_objDate.Year, g_objDate.Month - 1, g_objDate.Day, 0, 0, 0, 0);
	}
	else
	{
	  	messageInformation = 10;
	  	fromDate = new Date();
	 }
      
	if(document.forms[strFormName] && document.forms[strFormName].elements[strToDateName])
    	{
		fncSetObjectDate(document.forms[strFormName].elements[strToDateName].value, g_strGlobalDateFormat);
		toDate = new Date(g_objDate.Year, g_objDate.Month - 1, g_objDate.Day, 0, 0, 0, 0);
    	}
	else
	{
	  messageInformation = 11;
	 	toDate = new Date();
    }
   
    // Both are not null
    if(fromDate.value !="" && toDate.value !="")
    {
      	fromDate.setHours(0);
      	fromDate.setMinutes(0);
      	fromDate.setSeconds(0);
      	fromDate.setMilliseconds(0);
        
      	toDate.setHours(0);
      	toDate.setMinutes(0);
      	toDate.setSeconds(0);
      	toDate.setMilliseconds(0);
      	
      	var diff = Math.floor((toDate.getTime() - fromDate.getTime()) / nbMillisInDay)
		if (diff >=0 && diff <= (parseInt(nbDay, 10)))
    	{
    	  return true;
  }
}
   
    if(messageInformation == 10)
    {
      fncShowInformation(messageInformation,nbDay,fncFormatDate(fromDate.getDate()+''+(fromDate.getMonth()+1)+''+fromDate.getFullYear(), g_strGlobalDateFormat));
    }
    else if(messageInformation == 11)
    {
       fncShowInformation(messageInformation,nbDay,fncFormatDate(toDate.getDate()+''+(toDate.getMonth()+1)+''+toDate.getFullYear(), g_strGlobalDateFormat));
    }
    else
    {
      fncShowInformation(messageInformation,nbDay);
    }
    return false;
}

// CALENDAR

var HideWait = 3; // Number of seconds before the calendar will disappear
var Y2kPivotPoint = 76; // 2-digit years before this point will be created in the 21st century
var FontSize = 11; // In pixels
var FontFamily = 'Tahoma';
var CellWidth = 18;
var CellHeight = 16;
var ImageURL = '/content/images/pic_calendar.gif';
var NextURL = '/content/images/pic_next.gif';
var PrevURL = '/content/images/pic_prev.gif';
var CalBGColor = 'white';
var DayBGColor = 'lightgrey';

var ZCounter = 100;
var Today = new Date();
var MonthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

// Write out the stylesheet definition for the calendar
with (document) {
   writeln('<style>');
   writeln('td.calendarDateInput {letter-spacing:normal;line-height:normal;font-family:' + FontFamily + ',Sans-Serif;font-size:' + FontSize + 'px;}');
   writeln('</style>');
}

function DayCellHover(Cell, Over, Color, HoveredDay) {
   Cell.style.backgroundColor = (Over) ? DayBGColor : Color;
   return true;
}

// Sets the form elements after a day has been picked from the calendar
function PickDisplayDay(ClickedDay) {
   this.show();
   this.setPicked(this.displayed.yearValue, this.displayed.monthIndex, ClickedDay);
   this.getPrimaryField().focus();
}

// Builds the HTML for the calendar days
function BuildCalendarDays() {
   var Rows = 5;
   if (((this.displayed.dayCount == 31) && ((this.displayed.firstDay == ((6 + g_strGlobalDateStartWeek) % 7)) || (this.displayed.firstDay == ((5 + g_strGlobalDateStartWeek) % 7)))) 
		|| 
		((this.displayed.dayCount == 30) && (this.displayed.firstDay == ((6 + g_strGlobalDateStartWeek) % 7)))) Rows = 6;
   else if ((this.displayed.dayCount == 28) && (this.displayed.firstDay == g_strGlobalDateStartWeek)) Rows = 4;
   var HTML = '<table width="' + (CellWidth * 7) + '" cellspacing="0" cellpadding="1" style="cursor:default">';
   for (var j=0;j<Rows;j++) {
      HTML += '<tr>';
      for (var i=1;i<=7;i++) {
         Day = (j * 7) + (i - ((7 + this.displayed.firstDay - g_strGlobalDateStartWeek) % 7));
         if ((Day >= 1) && (Day <= this.displayed.dayCount)) {
            if ((this.displayed.yearValue == this.picked.yearValue) && (this.displayed.monthIndex == this.picked.monthIndex) && (Day == this.picked.day)) {
               TextStyle = 'color:white;font-weight:bold;'
               BackColor = DayBGColor;
            }
            else {
               TextStyle = 'color:black;'
               BackColor = CalBGColor;
            }
            if ((this.displayed.yearValue == Today.getFullYear()) && (this.displayed.monthIndex == Today.getMonth()) && (Day == Today.getDate())) TextStyle += 'border:1px solid darkred;padding:0px;';
            HTML += '<td align="center" class="calendarDateInput" style="cursor:default;height:' + CellHeight + ';width:' + CellWidth + ';' + TextStyle + ';background-color:' + BackColor + '" onClick="' + this.objName + '.pickDay(' + Day + ')" onMouseOver="return ' + this.objName + '.displayed.dayHover(this,true,\'' + BackColor + '\',' + Day + ')" onMouseOut="return ' + this.objName + '.displayed.dayHover(this,false,\'' + BackColor + '\')">' + Day + '</td>';
         }
         else HTML += '<td class="calendarDateInput" style="height:' + CellHeight + '">&nbsp;</td>';
      }
      HTML += '</tr>';
   }
   return HTML += '</table>';
}

// Determines which century to use (20th or 21st) when dealing with 2-digit years
function GetGoodYear(YearDigits) {
   if (YearDigits.length == 4) return YearDigits;
   else {
      var Millennium = (YearDigits < Y2kPivotPoint) ? 2000 : 1900;
      return Millennium + parseInt(YearDigits,10);
   }
}

// Returns the number of days in a month (handles leap-years)
function GetDayCount(SomeYear, SomeMonth) {
   return ((SomeMonth == 1) && ((SomeYear % 400 == 0) || ((SomeYear % 4 == 0) && (SomeYear % 100 != 0)))) ? 29 : MonthDays[SomeMonth];
}

// Highlights the buttons
function VirtualButton(Cell, ButtonDown) {
   if (ButtonDown) {
      Cell.style.borderLeft = 'buttonshadow 1px solid';
      Cell.style.borderTop = 'buttonshadow 1px solid';
      Cell.style.borderBottom = 'buttonhighlight 1px solid';
      Cell.style.borderRight = 'buttonhighlight 1px solid';
   }
   else {
      Cell.style.borderLeft = 'buttonhighlight 1px solid';
      Cell.style.borderTop = 'buttonhighlight 1px solid';
      Cell.style.borderBottom = 'buttonshadow 1px solid';
      Cell.style.borderRight = 'buttonshadow 1px solid';
   }
}

// Mouse-over for the previous/next month buttons
function NeighborHover(Cell, Over, DateObj) {
   if (Over) {
      VirtualButton(Cell, false);
   }
   else {
      Cell.style.border = 'buttonface 1px solid';
   }
   return true;
}

function CalIconHover(Over) {
   self.status = '';
   return true;
}

// Starts the timer over from scratch
function CalTimerReset() {
   eval('clearTimeout(' + this.timerID + ')');
   eval(this.timerID + '=setTimeout(\'' + this.objName + '.show()\',' + (HideWait * 1000) + ')');
}

// The timer for the calendar
function DoTimer(CancelTimer) {
   if (CancelTimer) eval('clearTimeout(' + this.timerID + ')');
   else {
      eval(this.timerID + '=null');
      this.resetTimer();
   }
}

// Show or hide the calendar
function ShowCalendar() {
   if (this.isShowing()) {
      var StopTimer = true;
      this.getCalendar().style.zIndex = --ZCounter;
      this.getCalendar().style.visibility = 'hidden';
   }
   else {
      var StopTimer = false;
      this.getCalendar().style.zIndex = ++ZCounter;
      this.getCalendar().style.visibility = 'visible';
   }
   this.handleTimer(StopTimer);
   self.status = '';
}


// Sets the date, based on the day, month and year selected
function CheckFullDateChange(strDay, strMonth, strYear) {
   if (this.isShowing()) this.show();
   this.setPicked(strYear, strMonth-1, strDay);
}

// Holds characteristics about a date
function dateObject() {
   if (Function.call) { // Used when 'call' method of the Function object is supported
      var ParentObject = this;
      var ArgumentStart = 0;
   }
   else { // Used with 'call' method of the Function object is NOT supported
      var ParentObject = arguments[0];
      var ArgumentStart = 1;
   }
   ParentObject.date = (arguments.length == (ArgumentStart+1)) ? new Date(arguments[ArgumentStart+0]) : new Date(arguments[ArgumentStart+0], arguments[ArgumentStart+1], arguments[ArgumentStart+2]);
   ParentObject.yearValue = ParentObject.date.getFullYear();
   ParentObject.monthIndex = ParentObject.date.getMonth();
   ParentObject.monthName = g_arrMonthLabel[ParentObject.monthIndex+1];
   ParentObject.fullName = ParentObject.monthName + ' ' + ParentObject.yearValue;
   ParentObject.day = ParentObject.date.getDate();
   ParentObject.dayCount = GetDayCount(ParentObject.yearValue, ParentObject.monthIndex);
   var FirstDate = new Date(ParentObject.yearValue, ParentObject.monthIndex, 1);
   ParentObject.firstDay = FirstDate.getDay();
}

// Keeps track of the date that goes into the hidden field
function storedMonthObject(DateFormat, DateYear, DateMonth, DateDay) {
   (Function.call) ? dateObject.call(this, DateYear, DateMonth, DateDay) : dateObject(this, DateYear, DateMonth, DateDay);
   this.yearPad = this.yearValue.toString();
   this.monthPad = (this.monthIndex < 9) ? '0' + String(this.monthIndex + 1) : this.monthIndex + 1;
   this.dayPad = (this.day < 10) ? '0' + this.day.toString() : this.day;
   this.monthShort = this.monthName.substr(0,3).toUpperCase();
   // Formats the year with 2 digits instead of 4
   if (DateFormat.indexOf('YYYY') == -1) this.yearPad = this.yearPad.substr(2);
   // Define the date-part delimiter
   if (DateFormat.indexOf('/') >= 0) var Delimiter = '/';
   else if (DateFormat.indexOf('-') >= 0) var Delimiter = '-';
   else var Delimiter = '';
   // Determine the order of the months and days
   if (/DD?.?((MON)|(MM?M?))/.test(DateFormat)) {
      this.formatted = this.dayPad + Delimiter;
      this.formatted += (RegExp.$1.length == 3) ? this.monthShort : this.monthPad;
   }
   else if (/((MON)|(MM?M?))?.?DD?/.test(DateFormat)) {
      this.formatted = (RegExp.$1.length == 3) ? this.monthShort : this.monthPad;
      this.formatted += Delimiter + this.dayPad;
   }
   // Either prepend or append the year to the formatted date
   this.formatted = (DateFormat.substr(0,2) == 'YY') ? this.yearPad + Delimiter + this.formatted : this.formatted + Delimiter + this.yearPad;
}

// Object for the current displayed month
function displayMonthObject(ParentObject, DateYear, DateMonth, DateDay) {
   (Function.call) ? dateObject.call(this, DateYear, DateMonth, DateDay) : dateObject(this, DateYear, DateMonth, DateDay);
   this.displayID = ParentObject.hiddenFieldName + '_Current_ID';
   this.getDisplay = new Function('return document.getElementById(this.displayID)');
   this.dayHover = DayCellHover;
   this.goCurrent = new Function(ParentObject.objName + '.getCalendar().style.zIndex=++ZCounter;' + ParentObject.objName + '.setDisplayed(Today.getFullYear(),Today.getMonth());');
   if (ParentObject.formNumber >= 0) this.getDisplay().innerHTML = this.fullName;
}

// Object for the previous/next buttons
function neighborMonthObject(ParentObject, IDText, DateMS) {
   (Function.call) ? dateObject.call(this, DateMS) : dateObject(this, DateMS);
   this.buttonID = ParentObject.hiddenFieldName + '_' + IDText + '_ID';
   this.hover = new Function('C','O','NeighborHover(C,O,this)');
   this.getButton = new Function('return document.getElementById(this.buttonID)');
   this.go = new Function(ParentObject.objName + '.getCalendar().style.zIndex=++ZCounter;' + ParentObject.objName + '.setDisplayed(this.yearValue,this.monthIndex);');
   if (ParentObject.formNumber >= 0) this.getButton().title = this.monthName;
}

// Sets the currently-displayed month object
function SetDisplayedMonth(DispYear, DispMonth) {
   this.displayed = new displayMonthObject(this, DispYear, DispMonth, 1);
   // Creates the previous and next month objects
   this.previous = new neighborMonthObject(this, 'Previous', this.displayed.date.getTime() - 86400000);
   this.next = new neighborMonthObject(this, 'Next', this.displayed.date.getTime() + (86400000 * (this.displayed.dayCount + 1)));
   // Creates the HTML for the calendar
   if (this.formNumber >= 0) this.getDayTable().innerHTML = this.buildCalendar();
}

// Sets the current selected date
function SetPickedMonth(PickedYear, PickedMonth, PickedDay) {
   this.picked = new storedMonthObject(this.format, PickedYear, PickedMonth, PickedDay);
   this.setHidden(this.picked.formatted);
   this.setDisplayed(PickedYear, PickedMonth);
}

// The calendar object
function calendarObject(PrimaryDateName, DateName, DateFormat, DefaultDate) {

   this.primaryFieldName = PrimaryDateName;
   this.hiddenFieldName = DateName;
   this.monthDisplayID = DateName + '_Current_ID';
   this.calendarID = DateName + '_ID';
   this.dayTableID = DateName + '_DayTable_ID';
   this.timerID = this.calendarID + '_Timer';
   this.objName = DateName + '_Object';
   this.format = DateFormat;
   this.formNumber = -1;
   this.picked = null;
   this.displayed = null;
   this.previous = null;
   this.next = null;

   this.setPicked = SetPickedMonth;
   this.setDisplayed = SetDisplayedMonth;
   this.changeFullDate = CheckFullDateChange;
   this.resetTimer = CalTimerReset;
   this.show = ShowCalendar;
   this.handleTimer = DoTimer;
   this.iconHover = CalIconHover;
   this.buildCalendar = BuildCalendarDays;
   this.pickDay = PickDisplayDay;
   this.setHidden = new Function('D','if (this.formNumber >= 0) { this.getHiddenField().value=D; this.getPrimaryField().value=D;}');
   // Returns a reference to these elements
   this.getHiddenField = new Function('return document.forms[this.formNumber].elements[this.hiddenFieldName]');
   this.getPrimaryField = new Function('return document.forms[this.formNumber].elements[this.primaryFieldName]');
   this.getCalendar = new Function('return document.getElementById(this.calendarID)');
   this.getDayTable = new Function('return document.getElementById(this.dayTableID)');
   this.getMonthDisplay = new Function('return document.getElementById(this.monthDisplayID)');
   this.isShowing = new Function('return !(this.getCalendar().style.visibility != \'visible\')');

   /* Constructor */
   // Functions used only by the constructor
   function getMonthIndex(MonthAbbr) { // Returns the index (0-11) of the supplied month abbreviation
      for (var MonPos=1;MonPos<g_arrMonthLabel.length;MonPos++) {
         if (g_arrMonthLabel[MonPos].substr(0,3).toUpperCase() == MonthAbbr.toUpperCase()) break;
      }
      return MonPos;
   }
   function SetGoodDate(CalObj, Notify) { // Notifies the user about their bad default date, and sets the current system date
      CalObj.setPicked(Today.getFullYear(), Today.getMonth(), Today.getDate());
      if (Notify) alert('WARNING: The supplied date is not in valid \'' + DateFormat + '\' format: ' + DefaultDate + '.\nTherefore, the current system date will be used instead: ' + CalObj.picked.formatted);
   }
   // Main part of the constructor
   if (DefaultDate != '') {
      if ((this.format == 'YYYYMMDD') && (/^(\d{4})(\d{2})(\d{2})$/.test(DefaultDate))) this.setPicked(RegExp.$1, parseInt(RegExp.$2,10)-1, RegExp.$3);
      else {
         // Get the year
         if ((this.format.substr(0,2) == 'YY') && (/^(\d{2,4})(-|\/)/.test(DefaultDate))) { // Year is at the beginning
            var YearPart = GetGoodYear(RegExp.$1);
            // Determine the order of the months and days
            if (/(-|\/)(\w{1,3})(-|\/)(\w{1,3})$/.test(DefaultDate)) {
               var MidPart = RegExp.$2;
               var EndPart = RegExp.$4;
               if (/D$/.test(this.format)) { // Ends with days
                  var DayPart = EndPart;
                  var MonthPart = MidPart;
               }
               else {
                  var DayPart = MidPart;
                  var MonthPart = EndPart;
               }
               MonthPart = (/\d{1,2}/i.test(MonthPart)) ? parseInt(MonthPart,10)-1 : getMonthIndex(MonthPart);
               this.setPicked(YearPart, MonthPart, DayPart);
            }
            else SetGoodDate(this, true);
         }
         else if (/(-|\/)(\d{2,4})$/.test(DefaultDate)) { // Year is at the end
            var YearPart = GetGoodYear(RegExp.$2);
            // Determine the order of the months and days
            if (/^(\w{1,3})(-|\/)(\w{1,3})(-|\/)/.test(DefaultDate)) {
               if (this.format.substr(0,1) == 'D') { // Starts with days
                  var DayPart = RegExp.$1;
                  var MonthPart = RegExp.$3;
               }
               else { // Starts with months
                  var MonthPart = RegExp.$1;
                  var DayPart = RegExp.$3;
               }
               MonthPart = (/\d{1,2}/i.test(MonthPart)) ? parseInt(MonthPart,10)-1 : getMonthIndex(MonthPart);
               this.setPicked(YearPart, MonthPart, DayPart);
            }
            else SetGoodDate(this, true);
         }
         else SetGoodDate(this, true);
      }
   }
}

// Main function that creates the form elements
function DateInput(PrimaryDateName, DefaultDate, DateFormat) 
{
	if (arguments.length < 1) document.writeln('<span style="color:red;font-size:' + FontSize + 'px;font-family:' + FontFamily + ';">ERROR: Missing required parameters in call to \'DateInput\': [name of primary date field].</span>');
	else 
	{
		DateName = "hidden_" + PrimaryDateName;
		if (arguments.length < 3) DateFormat = g_strGlobalDateFormat.toUpperCase();
		var CurrentDate = new storedMonthObject(DateFormat, Today.getFullYear(), Today.getMonth(), Today.getDate());
		if ("S" + DefaultDate == "S") DefaultDate = CurrentDate.formatted;

		// Creates the calendar object!
		eval(DateName + '_Object=new calendarObject(\'' + PrimaryDateName + '\',\'' + DateName + '\',\'' + DateFormat + '\',\'' + DefaultDate + '\')');
		var InitialStatus = '';
		var InitialDate = eval(DateName + '_Object.picked.formatted');

		// Create the form elements
		with (document) 
		{
			writeln('<input type="hidden" name="' + DateName + '" value="' + InitialDate + '">');
			// Find this form number
			for (var f=0;f<forms.length;f++) {
	            for (var e=0;e<forms[f].elements.length;e++) {
	               if (typeof forms[f].elements[e].type == 'string') {
	                  if ((forms[f].elements[e].type == 'hidden') && (forms[f].elements[e].name == DateName)) {
	                     eval(DateName + '_Object.formNumber='+f);
	                     break;
	                  }
	               }
	            }
			}
			write('<a' + InitialStatus + ' id="' + DateName + '_ID_Link" href="javascript:' + DateName + '_Object.show()" onMouseOver="return ' + DateName + '_Object.iconHover(true)" onMouseOut="return ' + DateName + '_Object.iconHover(false)"><img src="' + ImageURL + '" align="baseline" title="" border="0"></a>&nbsp;');
			writeln('<span id="' + DateName + '_ID" style="position:absolute;visibility:hidden;width:' + (CellWidth * 7) + 'px;background-color:' + CalBGColor + ';border:1px solid dimgray;" onMouseOver="' + DateName + '_Object.handleTimer(true)" onMouseOut="' + DateName + '_Object.handleTimer(false)">');
			writeln('<table width="' + (CellWidth * 7) + '" cellspacing="0" cellpadding="1">' + String.fromCharCode(13) + '<tr class="FORMH1">');
			writeln('<td id="' + DateName + '_Previous_ID" style="cursor:default" align="center" class="calendarDateInput" style="height:' + CellHeight + '" onClick="' + DateName + '_Object.previous.go()" onMouseDown="VirtualButton(this,true)" onMouseUp="VirtualButton(this,false)" onMouseOver="return ' + DateName + '_Object.previous.hover(this,true)" onMouseOut="return ' + DateName + '_Object.previous.hover(this,false)" title="' + eval(DateName + '_Object.previous.monthName') + '"><img src="' + PrevURL + '"></td>');
			writeln('<td id="' + DateName + '_Current_ID" style="cursor:pointer" align="center" class="calendarDateInput" style="height:' + CellHeight + '" colspan="5" onClick="' + DateName + '_Object.displayed.goCurrent()">' + eval(DateName + '_Object.displayed.fullName') + '</td>');
			writeln('<td id="' + DateName + '_Next_ID" style="cursor:default" align="center" class="calendarDateInput" style="height:' + CellHeight + '" onClick="' + DateName + '_Object.next.go()" onMouseDown="VirtualButton(this,true)" onMouseUp="VirtualButton(this,false)" onMouseOver="return ' + DateName + '_Object.next.hover(this,true)" onMouseOut="return ' + DateName + '_Object.next.hover(this,false)" title="' + eval(DateName + '_Object.next.monthName') + '"><img src="' + NextURL + '"></td></tr>' + String.fromCharCode(13) + '<tr>');
			for (var w=0;w<7;w++) writeln('<td width="' + CellWidth + '" align="center" class="calendarDateInput" style="height:' + CellHeight + ';width:' + CellWidth + ';font-weight:bold;border-top:1px solid dimgray;border-bottom:1px solid dimgray;">' + g_arrShortDayLabel[w] + '</td>');
			writeln('</tr>' + String.fromCharCode(13) + '</table>' + String.fromCharCode(13) + '<span id="' + DateName + '_DayTable_ID">' + eval(DateName + '_Object.buildCalendar()') + '</span>' + String.fromCharCode(13) + '</span>');
		}
	}
}
