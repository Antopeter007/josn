dojo.provide("misys.openaccount.StringUtils");

//Copyright (c) 2000-20121 Misys (http://www.misys.com),
//All Rights Reserved. 
//
//summary:
//
//
//version:   1.2
//date:      24/03/2011
//author:    Sam Sundar K

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	d.mixin(m, {
		replaceCarriageReturn :function(content,replaceWith)  
		{   
			 content = escape(content);  
			 //encode all characters in text to find carriage return character  
			 for(var i=0; i < content.length; i++)  
			 {   
			  //loop through string, replacing carriage return   
			  //encoding with HTML break tag  
			  if(content.indexOf("%0D%0A") > -1)  
			  {   
			   //Windows encodes returns as \r\n hex  
			   content = content.replace("%0D%0A",replaceWith);  
			  }  
			  else if(content.indexOf("%0A") > -1)  
			  {   
			   //Unix encodes returns as \n hex  
			   content=content.replace("%0A",replaceWith);  
			  }  
			  else if(content.indexOf("%0D") > -1)  
			  {   
			   //Macintosh encodes returns as \r hex  
			   content=content.replace("%0D",replaceWith);  
			  }  
			 }  
			 content=unescape(content);  
			 //decode all characters in text area back  
			 return content;
		} 
	});
})(dojo, dijit, misys);	