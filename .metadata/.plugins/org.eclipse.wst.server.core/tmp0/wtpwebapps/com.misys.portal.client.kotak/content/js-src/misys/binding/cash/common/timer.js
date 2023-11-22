dojo.provide("misys.binding.cash.common.timer");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Timer Fonction, .
  

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 author:	Pascal Marzin
 date:      10/15/10
 -----------------------------------------------------------------------------
 */



(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {

	"use strict"; // ECMA5 Strict Mode
	
	/**-------------------------------------
	 * Functions use by / for the countdown
	 ---------------------------------------*/

	/** to store timeout ID **/
	misys.countdown = null;

	/** to store the progress **/
	misys.countdownProgess = null;

	/** boolean allows to know if countdown has been already init **/
	misys.initCountdown = true;

	/** to store the maximal visual progression **/
	misys.progressMax = null;
	

	// Private functions and variables
	/** to init the countdown**/
	function _fncInitCountDown(/*int*/t)
	{
		misys.countdownProgess = t;
		misys.progressMax = t;
		misys.initCountdown = false;
		//dijit.byId("buttonAcceptRequest").set("disabled", false);
		
	}

	/** return a string representing the time value**/
	function _fncGetTimeToString(/*int*/time)
	{
		var content = "";
		if (time>60){
			content = Math.floor(time/60)+" min(s) "+ time%60+" sec(s)";
		}
		else {
			content = time+" sec(s)";
		}
		return content;
	}
	
/************ Public  Function *************************/
	
	d.mixin(m, {
		
		/** to update the countdown **/
		countDown : function(/*int*/t)
		{
			if (misys.initCountdown === true){
				_fncInitCountDown(t);
			}
			if(t>=0){
				// update validity span
				dojo.byId("validitySpan").innerHTML = " "+_fncGetTimeToString(misys.progressMax)+".";
				// update progressbar
				// artf1060350 : Do not pass a negative value (-0.8) to the update method below
				// it fails on IE8 while doing this tip.style.width = (percent * 100) + "%";
				// in ProgressBar.js				
				jsProgress.update({
			        maximum: misys.progressMax,
			        progress: misys.countdownProgess > 0?--misys.countdownProgess:0
			    });
				// update progressBar label
				dojo.byId("countdownProgress_label").innerHTML = _fncGetTimeToString(t);
				// update timer
				t--;
				misys.countdown=setTimeout("misys.countDown('"+t+"')",1000);
			}
			else
			{
				m.stopCountDown(misys.countdown);
			}
		},

		/** to stop the countdown **/
		stopCountDown : function(id)
		{
			//MPS-26516 uncommented the below code to disable Accept button if request timer expires
			if(dijit.byId("buttonAcceptRequest"))
				{
					dijit.byId("buttonAcceptRequest").set("disabled", true);
				}
			if(dijit.byId("sendRequestId"))
				{
					dijit.byId("sendRequestId").set("disabled", true);
				}
			clearTimeout(id);
			misys.initCountdown = true;
		}
		
	});
})(dojo, dijit, misys);




