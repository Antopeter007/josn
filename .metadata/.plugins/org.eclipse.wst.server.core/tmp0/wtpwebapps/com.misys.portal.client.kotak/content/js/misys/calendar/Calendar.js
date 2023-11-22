/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.calendar.Calendar"]){dojo._hasResource["misys.calendar.Calendar"]=true;dojo.provide("misys.calendar.Calendar");dojo.experimental("misys.calendar.Calendar");dojo.require("dojo.cache");dojo.require("dijit.Tooltip");dojo.require("dijit.Calendar");dojo.declare("misys.calendar.Calendar",[dijit.Calendar],{templateString:dojo.cache("misys.calendar","templates/Calendar.html","<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\" role=\"grid\" dojoAttachEvent=\"onkeypress: _onKeyPress\" aria-labelledby=\"${id}_year calendar-instructions\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th id=\"decrement_month\" class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"decrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarDecrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"decreaseArrowNode\" class=\"dijitA11ySideArrow\">-</span>\n\t\t\t</th>\n\t\t\t\n\t\t\t<th id=\"dijit_reset\" dojoAttachPoint=\"monthLabel\" class='dijitReset' colspan=\"5\">\n\t\t\t\t<div class=\"dijitVisible\">\n\t\t\t\t\t<div class=\"dijitPopup dijitMenu dijitMenuPassive dijitHidden\" dojoAttachPoint=\"monthDropDownButton\">\n\t\t\t\t\t\t<div class=\"dijitCalendarMonthLabelTemplate dijitCalendarMonthLabel\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div dojoAttachPoint=\"monthLabelSpacer\" class=\"dijitSpacer\"></div>\n\t\t\t\t<div dojoAttachPoint=\"monthLabelNode\" class=\"dijitCalendarMonthLabel dijitInline dijitVisible\" dojoAttachEvent=\"onmousedown: _onMonthToggle\"></div>\n\t\t\t</th>\n\t\t\t\n\n\t\t\t<!--  th dojoAttachPoint=\"monthLabel\" class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\" dojoAttachPoint=\"monthDropDownButton\"\n\t\t\t\t\tid=\"${id}_mddb\" tabIndex=\"-1\">\n\t\t\t\t</div>\n\t\t\t</th>\n \t\t\t-->\n\t\t\t<th id=\"increment_month\" class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"incrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarIncrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"increaseArrowNode\" class=\"dijitA11ySideArrow\">+</span>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th id=\"header\" class=\"dijitReset dijitCalendarDayLabelTemplate\" role=\"columnheader\"><span class=\"dijitCalendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut, onmousedown: _onDayMouseDown, onmouseup: _onDayMouseUp\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t<tr class=\"dijitReset dijitCalendarWeekTemplate\" role=\"row\">\n\t\t\t<td class=\"dijitReset dijitCalendarDateTemplate\" role=\"gridcell\"><span class=\"dijitCalendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\" id=\"${id}_year\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\n"),tooltipTemplateString:"<span class='cal-event'>{content}</span>",tooltipDuration:10000,activeTooltips:[],monthOffset:0,calendarDateHasChanged:false,eventLimit:10,eventsLoaded:false,_onDayClick:function(_1){for(var _2=_1.target;_2&&!_2.dijitDateValue;_2=_2.parentNode){}if(_2&&!dojo.hasClass(_2,"dijitCalendarDisabledDate")){this.set("value",_2.dijitDateValue);}var _3=dojo.date.locale.format(this.value,{selector:"date",datePattern:"yyyyMMdd"});dojo.global.location=misys.getServletURL("/screen/FullEventsScreen?operation=LIST_FEATURES&date="+_3);},postCreate:function(){var _4=0;var _5=this.id;if(_5.indexOf("_",1)>0){currentId=_5.substring(9,_5.length);_4=parseInt(currentId,10)-1;if(_4<0){_4=11;}}if(dijit.byId("calendar_"+_4)){dojo.style(this.incrementMonth,"display","none");dojo.style(this.decrementMonth,"display","none");dojo.style(this.nextYearLabelNode,"display","none");dojo.style(this.previousYearLabelNode,"display","none");this.monthLabel.setAttribute("colSpan",7);}this.inherited(arguments);if(this.monthOffset!==0){this._adjustDisplay("month",this.monthOffset);}var _6=dojo.byId("CustomerOngoingTasksList")?true:false;var _7=dojo.byId("InternalNewsPortlet")?true:false;var _8=dojo.byId("OutstandingPerProductChartPortlet")?true:false;var _9=dojo.byId("TradeEventsGridPortlet")?true:false;var _a=dojo.byId("HomeAccountSummaryListPortlet")?true:false;var _b=dojo.byId("ActionRequiredPortlet")?true:false;var _c=dojo.byId("OpicsAccountListPortletPlusBalance")?true:false;var _d=dojo.byId("TradeCalendarPortlet")?true:false;if(!_6&&!_7&&!_8&&!_9&&!_a&&!_b&&!_c){var _e=this.id;var _f;if(_e.indexOf("_",1)>0){_f=_e.substring(9,_e.length);}var _10="calendar_"+_f;if(dijit.byId(_10)){if(_d){dojo.style(_10,"width",0);dojo.style(_10,"position","relative");dojo.style(_10,"left","100%");}}}},_onMonthToggle:function(evt){dojo.stopEvent(evt);var _11=dojo.date.locale.format(this.currentFocus,{selector:"date",datePattern:"yyyyMM"});var _12=0;var _13=0;var _14=this.id;if(_14.indexOf("_",1)>0){currentId=_14.substring(9,_14.length);_12=parseInt(currentId,10)+1;_13=parseInt(currentId,10)-1;if(_12>11){_12=0;}if(_13<0){_13=11;}}var _15="&date="+_11;dojo.global.location=misys.getServletURL("/screen/FullEventsScreen?operation=LIST_FEATURES"+_15);},_adjustDisplay:function(_16,_17){this.calendarDateHasChanged=true;this.inherited(arguments);},_updateNextDisplay:function(_18,_19,adj,_1a){var _1b=_18+1;if(dijit.byId("calendar_"+_1b)){this._updateNextDisplay(_1b,_19,adj);dijit.byId("calendar_"+_1b)._adjustDisplay(_19,adj);}},_populateGrid:function(){var _1c=new this.dateClassObj(this.currentFocus);_1c.setDate(1);var _1d=_1c.getDay(),_1e=this.dateFuncObj.getDaysInMonth(_1c),_1f=this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(_1c,"month",-1)),_20=null;if(misys&&misys._config&&misys._config.bankBusinessDate&&misys._config.bankBusinessDate!==""){var _21=misys._config.bankBusinessDate.substring(0,4);var _22=misys._config.bankBusinessDate.substring(5,7);var _23=misys._config.bankBusinessDate.substring(8,10);_20=new this.dateClassObj(_21,_22-1,_23);}else{_20=new this.dateClassObj();}var _24=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);if(_24>_1d){_24-=7;}var _25=dojo.query(".dijitCalendarDateTemplate",this.domNode);_25.forEach(function(_26,i){i+=_24;var _27=new this.dateClassObj(_1c),_28,_29="dijitCalendar",adj=0;if(i<_1d){_28=_1f-_1d+i+1;adj=-1;_29+="Previous";}else{if(i>=(_1d+_1e)){_28=i-_1d-_1e+1;adj=1;_29+="Next";}else{_28=i-_1d+1;_29+="Current";}}if(adj){_27=this.dateFuncObj.add(_27,"month",adj);}_27.setDate(_28);if(!this.dateFuncObj.compare(_27,_20,"date")){_29="dijitCalendarCurrentDate "+_29;}if(this._isSelectedDate(_27,this.lang)){_29="dijitCalendarSelectedDate "+_29;}if(this.isDisabledDate(_27,this.lang)){_29="dijitCalendarDisabledDate "+_29;}var _2a=this.getClassForDate(_27,this.lang);if(_2a){_29=_2a+" "+_29;}var _2b="";if(!this.calendarDateHasChanged&&_26.className.indexOf("calevent")!==-1){_2b=_26.className.substring(_26.className.indexOf("calevent"));}_26.className=_29+"Month dijitCalendarDateTemplate "+_2b;_26.dijitDateValue=_27.valueOf();dojo.attr(_26,"dijitDateValue",_27.valueOf());var _2c=dojo.query(".dijitCalendarDateLabel",_26)[0],_2d=_27.getDateLocalized?_27.getDateLocalized(this.lang):_27.getDate();this._setText(_2c,_2d);},this);var _2e=dojo.date.locale.getNames("months","wide","standAlone",this.lang);this._setText(this.monthLabelNode,_2e[_1c.getMonth()]);var y=_1c.getFullYear()-1;var d=new this.dateClassObj();dojo.forEach(["previous","current","next"],function(_2f){d.setFullYear(y++);this._setText(this[_2f+"YearLabelNode"],this.dateLocaleModule.format(d,{selector:"year",locale:this.lang}));},this);dojo.query(".calendarLoader").forEach(function(d){dojo.replaceClass(d,"");});var _30=this;if(!this.eventsLoaded){var _31=dojo.byId("CustomerOngoingTasksList")?true:false;var _32=dojo.byId("InternalNewsPortlet")?true:false;var _33=dojo.byId("OutstandingPerProductChartPortlet")?true:false;var _34=dojo.byId("TradeEventsGridPortlet")?true:false;var _35=dojo.byId("HomeAccountSummaryListPortlet")?true:false;var _36=dojo.byId("ActionRequiredPortlet")?true:false;var _37=dojo.byId("OpicsAccountListPortletPlusBalance")?true:false;if(!_31&&!_32&&!_33&&!_34&&!_35&&!_36&&!_37){if(dojo.byId("EventsPortlet")){dojo.style("EventsPortlet","width",10);dojo.style("EventsPortlet","position","relative");dojo.style("EventsPortlet","left","100%");}}var _38="";var _39="";var _3a=[];var _3b=misys.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/GetCalendarEvents"),handleAs:"json",content:{inputdate:this.currentFocus.getTime(),startdate:_38,enddate:_39},load:function(_3c,_3d){dojo.forEach(_3c.events,function(ev){_3a.push(ev);});}});_3b.then(function(){dojo.forEach(_30.activeTooltips,function(tId){dijit.byId(tId).destroy();});_30.activeTooltips=[];setTimeout(function(){var _3e=_30.currentFocus.getMonth();_25.forEach(function(td){var _3f=new Date(td.dijitDateValue);if(_3f.getMonth()===_3e){var _40=dojo.filter(_3a,function(_41){return (dojo.date.compare(_3f,new Date(_41.DATE),"date")===0);});if(_40.length>0){var _42="";var _43="";dojo.forEach(_40,function(_44,i){if(i<=_30.eventLimit){if(i===0){_43=_30.id+_44.DATE;td.id=_43;td.className+=" "+_44.CSS;}_42+=_44.TITLE;if(_44.REF_ID){_42+=" - "+_44.REF_ID;}_42+="<br/>";}});if(_40.length>_30.eventLimit){_42+=" ...";}var _45=_43+_3f.getTime();_30.activeTooltips.push(_45);new dijit.Tooltip({connectId:[_43],id:_45,duration:_30.tooltipDuration,label:dojo.replace(_30.tooltipTemplateString,{content:_42})});}}});},500);});this.eventsLoaded=true;}var _46=function(_47,_48,adj){_30._connects.push(dijit.typematic.addMouseListener(_30[_47],_30,function(_49){if(_49>=0){var _4a=parseInt(this.id.substring(9,this.id.length),10);_30._updateNextDisplay(_4a,_48,adj,_47);_30._adjustDisplay(_48,adj);var _4b=parseInt(_4a,10)+1;var _4c=parseInt(_4a,10)+2;var _4d=parseInt(_4a,10)-1;var _4e=dijit.byId("calendar_"+_4b);if(_4b>11){_4b=0;}if(_4d<0){_4d=11;}var _4f=dojo.date.locale.format(_30.currentFocus,{selector:"date",datePattern:"yyyyMM"});var _50=new _30.dateClassObj(_30.currentFocus);_50.setDate(1);var _51=dojo.date.locale.format(_50,{selector:"date",fullYear:true});var _52=1;if(_4e){_52=3;}var _53=dojo.date.add(_50,"month",_52);_53=dojo.date.add(_53,"day",-1);_53=dojo.date.locale.format(_53,{selector:"date",fullYear:true});var _54="";var _55="";var _56="";var _57="";if(dojo.byId("TransactionSearchForm")){_55=dijit.byId("product_code")?dijit.byId("product_code").get("value"):"";_56=dijit.byId("ref_id")?dijit.byId("ref_id").get("value"):"";_57=dijit.byId("entity")?dijit.byId("entity").get("value"):"";if(dijit.byId("startdate")&&dijit.byId("enddate")){if(adj!==-1){dijit.byId("enddate").set("displayedValue",_51);}dijit.byId("startdate").set("displayedValue",_51);dijit.byId("enddate").set("displayedValue",_53);}}misys.grid.reloadForSearchTerms();_30.eventsLoaded=false;_30._populateGrid();if(_4e){_4e.eventsLoaded=false;_4e._populateGrid();var _58=dijit.byId("calendar_"+_4c);_58.eventsLoaded=false;_58._populateGrid();}}},0.8,500));};_46("incrementMonth","month",1);_46("decrementMonth","month",-1);_46("nextYearLabelNode","year",1);_46("previousYearLabelNode","year",-1);this.calendarDateHasChanged=false;}});}