(function(){
	'use strict';
	
	angular
		.module("blocks.encryption")
		.provider('EncryptionProvider', EncryptionProvider);
	
	function EncryptionProvider(){
		var self = this;
		self.$get = Encryption;
		
		function Encryption(Session){
			var service ={
					getClientSideEncryption : getClientSideEncryption,
					encryptText : encryptText
			};
			return service;
		
			function getClientSideEncryption(){
				var isEncrypt = document.getElementById('client_side_encryption').innerHTML;
				return isEncrypt;
			}
			
			function encryptText(passPhrase)
			{
				if(document.getElementById('client_side_encryption').innerHTML==='true')
				{
					var rsa = new RSAKey();
					var htmlUsedModulus;
					var crSeq;
					if(Session.getHTMLModulusForReauth()!=='' && Session.getHTMLModulusForReauth()!==undefined){
						htmlUsedModulus = Session.getHTMLModulusForReauth();
						crSeq = Session.getCr_seqForReauth();
					}
					else{
						htmlUsedModulus = Session.getHTMLModulus(); 
						crSeq = Session.getCr_seq();	
					}
	    			rsa.setPublic(htmlUsedModulus, '10001');
	                return rsa.encrypt(passPhrase)+crSeq;						
				}
				else
				{
					return passPhrase;
				}
			}
			
		}
	}
	
})();