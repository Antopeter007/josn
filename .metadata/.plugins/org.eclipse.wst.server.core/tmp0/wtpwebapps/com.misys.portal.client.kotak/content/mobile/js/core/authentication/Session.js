(function () {
    'use strict';

    angular.module('app.core')
        .service('Session', Session);

    function Session() {
        this.create = function () {
            this.user = true;
        };
        this.populatecsrftoken = function (csrfTokenHeader, csrfTokenValue) {
            this.csrfTokenHeader = csrfTokenHeader;
            this.csrfTokenValue = csrfTokenValue;
        };
        this.destroy = function () {
            this.user = false;
        };
        this.setMode = function (modeValue) {
            this.mode = modeValue;
        };
        this.getMode = function () {
            return this.mode ? this.mode : "";
        };
        this.setUserName  = function(userNameValue)
        {
     	   this.userName = userNameValue;
        };
        this.getUserName = function()
        {
     	   return this.userName? this.userName : "";
        };
        this.setCompany  = function(companyValue)
        {
     	   this.company = companyValue;
        };
        this.getCompany = function()
        {
     	   return this.company? this.company : "";
        };
        this.setMessage  = function(recievedMessage)
        {
     	   this.message = recievedMessage;
        };
        this.getMessage = function()
        {
     	   return this.message? this.message : "";
        };
        this.setFromState  = function(fromstate)
        {
     	   this.state = fromstate;
        };
        this.setCommonToken = function(token){
        	this.commonToken = token;
        };
        this.getCommonToken = function(){
        	return this.commonToken? this.commonToken:"";
        };
        this.getFromState = function()
        {
     	   return this.state? this.state : "";
        };
		this.setPBPattern  = function(pbPattern)
        {
     	   this.pbPattern = pbPattern;
        };
        this.getPBPattern = function()
        {
     	   return this.pbPattern? this.pbPattern : "";
        };
		this.setPBMin  = function(pbMin)
        {
     	   this.pbMin = pbMin;
        };
        this.getPBMin = function()
        {
     	   return this.pbMin? this.pbMin : "";
        };
		this.setPBMax  = function(pbMax)
        {
     	   this.pbMax = pbMax;
        };
        this.getPBMax = function()
        {
     	   return this.pbMax? this.pbMax : "";
        };
        this.setToken = function(token)
        {
            this.token = token;
        };
        this.getToken = function()
        {
            return this.token;
        };
        
        this.setDesktopRedirectURL = function(desktopRedirectURL)
        {
            this.desktopRedirectURL = desktopRedirectURL;
        };
        this.getDesktopRedirectURL = function()
        {
            return this.desktopRedirectURL;
        };
        this.setLoginId= function(loginid)
        {
        	this.loginid= loginid;
        }
        this.getLoginId = function()
        {
        	return this.loginid;
        }
        this.setSessionMessage = function(message){
        	this.sessionMessage = message;
        }
        this.getSessionMessage = function(){
        	return this.sessionMessage;
        }
        this.getHTMLModulus = function(){
        	return this.htmlModulus;
        }
        this.setHTMLModulus = function(htmlModulus){
        	this.htmlModulus = htmlModulus;
        }
        this.setCr_Seq = function(cr_seq){
        	this.cr_seq = cr_seq;
        }
        this.getCr_seq = function(){
        	return this.cr_seq;
        }
        this.setLanguageSelected = function(language){
        	this.language = language;
        }
        this.getLanguageSelected = function(){
        	return this.language;
        }
        
        //reauth
        this.getHTMLModulusForReauth = function(){
        	return this.htmlModulusForReauth;
        }
        this.setHTMLModulusForReauth = function(htmlModulus){
        	this.htmlModulusForReauth = htmlModulus;
        }
        this.setCr_SeqForReauth = function(cr_seq){
        	this.cr_seqForReauth = cr_seq;
        }
        this.getCr_seqForReauth = function(){
        	return this.cr_seqForReauth;
        }
        
        
        return this;
    }
})();