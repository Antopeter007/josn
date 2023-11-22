/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.common.timer"]){dojo._hasResource["misys.binding.cash.common.timer"]=true;dojo.provide("misys.binding.cash.common.timer");(function(d,dj,m){misys.countdown=null;misys.countdownProgess=null;misys.initCountdown=true;misys.progressMax=null;function _1(t){misys.countdownProgess=t;misys.progressMax=t;misys.initCountdown=false;};function _2(_3){var _4="";if(_3>60){_4=Math.floor(_3/60)+" min(s) "+_3%60+" sec(s)";}else{_4=_3+" sec(s)";}return _4;};d.mixin(m,{countDown:function(t){if(misys.initCountdown===true){_1(t);}if(t>=0){dojo.byId("validitySpan").innerHTML=" "+_2(misys.progressMax)+".";jsProgress.update({maximum:misys.progressMax,progress:misys.countdownProgess>0?--misys.countdownProgess:0});dojo.byId("countdownProgress_label").innerHTML=_2(t);t--;misys.countdown=setTimeout("misys.countDown('"+t+"')",1000);}else{m.stopCountDown(misys.countdown);}},stopCountDown:function(id){if(dijit.byId("buttonAcceptRequest")){dijit.byId("buttonAcceptRequest").set("disabled",true);}if(dijit.byId("sendRequestId")){dijit.byId("sendRequestId").set("disabled",true);}clearTimeout(id);misys.initCountdown=true;}});})(dojo,dijit,misys);}