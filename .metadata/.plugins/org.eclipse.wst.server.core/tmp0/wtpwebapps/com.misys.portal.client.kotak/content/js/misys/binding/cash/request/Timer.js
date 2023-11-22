/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.request.Timer"]){dojo._hasResource["misys.binding.cash.request.Timer"]=true;dojo.provide("misys.binding.cash.request.Timer");misys.countdown=null;misys.countdownProgess=null;misys.initCountdown=true;misys.progressMax=null;_fncInitCountDown=function(t){misys.countdownProgess=t;misys.progressMax=t;misys.initCountdown=false;};_fncCountdown=function(t){if(misys.initCountdown==true){_fncInitCountDown(t);}if(t>=0){dojo.byId("validitySpan").innerHTML=" "+_fncGetTimeToString(t)+".";jsProgress.update({maximum:misys.progressMax,progress:--misys.countdownProgess});dojo.byId("countdownProgress_label").innerHTML=_fncGetTimeToString(t);t--;misys.countdown=setTimeout("_fncCountdown('"+t+"')",1000);}else{_stopCountDown(misys.countdown);}};_stopCountDown=function(id){clearTimeout(id);};_fncGetTimeToString=function(_1){var _2="";if(_1>60){_2=Math.floor(_1/60)+" min(s) "+_1%60+" sec(s)";}else{_2=_1+" sec(s)";}return _2;};}