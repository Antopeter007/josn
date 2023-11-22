dojo.provide("misys.binding.cash.request.Timer");
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

/** to init the countdown**/
_fncInitCountDown = function(t)
{
	misys.countdownProgess = t;
	misys.progressMax = t;
	misys.initCountdown = false;
	//dijit.byId('buttonAcceptRequest').set('disabled', false);
	
};

/** to update the countdown **/
_fncCountdown = function(/*int*/t)
{
	if (misys.initCountdown == true){
		_fncInitCountDown(t);
	}
	if(t>=0){
		// update validity span
		dojo.byId('validitySpan').innerHTML = ' '+_fncGetTimeToString(t)+'.';
		// update progressbar	
		jsProgress.update({
	        maximum: misys.progressMax,
	        progress: --misys.countdownProgess
	    });
		// update progressBar label
		dojo.byId('countdownProgress_label').innerHTML = _fncGetTimeToString(t);
		// update timer
		t--;
		misys.countdown=setTimeout("_fncCountdown('"+t+"')",1000);
	}
	else
	{
		_stopCountDown(misys.countdown);
	}
};

/** to stop the countdown **/
_stopCountDown = function(id)
{
	//dijit.byId('buttonAcceptRequest').set('disabled', true);
	clearTimeout(id);
};

/** return a string representing the time value**/
_fncGetTimeToString = function(/*int*/time)
{
	var content = "";
	if (time>60){
		content = Math.floor(time/60)+" min(s) "+ time%60+" sec(s)";
	}
	else {
		content = time+" sec(s)";
	}
	return content;
};