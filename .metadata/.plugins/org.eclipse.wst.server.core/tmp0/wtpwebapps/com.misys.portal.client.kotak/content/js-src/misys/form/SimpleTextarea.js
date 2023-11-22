dojo.provide("misys.form.SimpleTextarea");
dojo.experimental("misys.form.SimpleTextarea");

dojo.require("dijit.form.SimpleTextarea");
dojo.require("dijit.form.ValidationTextBox");

// our declared class
dojo.declare(
		"misys.form.SimpleTextarea",
        // we inherit from this class, which in turn mixes
        // in _Templated and _Layout
        [dijit.form.ValidationTextBox, dijit.form.SimpleTextarea],
        // class properties:
        {
            // Used for custom formatting
        	maxSize: 
        		this.maxSize,
        		
        	blnNewRow: false,
        		
        	rowCount: 0,
        	
        	postCreate: function() {
                this.inherited(arguments);
            },
            
            regExp: "(.|\\s)*",
            
            validate: function() {
            	if (arguments.length === 0) {
            		return this.validate(false);
            	}
            	return this.inherited(arguments);
            },
            
            isValid:  function(/*Boolean*/ isFocused){
            	this.invalidMessage = this.messages.invalidMessage;
            	if(!this.validator(this.textbox.value, this.constraints)){
            		return false;
            	}
            	
            	// Validate only when the field is onfocussed, or focussed but in error
            	var fieldIsValid = (this.state === 'Error') ? false : true;
            	if(false === isFocused || (true === isFocused && !fieldIsValid)){
            		fieldIsValid = true;
	            	// If the column counter is null, it means that the carriage returned
	            	// has been added. In such a case, we test if the current number of
	            	// rows is exceeding the maximum allowed:
	            	if(this.blnNewRow){
	            		if(this.rowCount >= this.maxSize){
	            			this.invalidMessage = misys.getLocalization('textareaLinesError', [this.maxSize, this.rowCount+1]);
	            			fieldIsValid = false;
	            		} 
	            	}
	            	// Test if the size of the result string is exceeding the maximum (include
	            	// the eventual linefeed to determine the maximum)
	            	var limit = (this.maxSize * this.cols) + this.maxSize;
	            	if(this.value.length > limit){
	            		this.invalidMessage =  misys.getLocalization('invalidFieldSizeError', [limit-1, this.value.length]);
	            		fieldIsValid = false;
	            	} 
            	}
            	
            	return fieldIsValid;
            },

            onBlur: function(element){
            	var el = (element == undefined) ? this : element;         	
				// Custom formatting
				if(el.value !== "") {
					var strResult = "";
					var intCountCol = 0;
					var intPosLastSpace = -1;
					var strInput = el.get('value');
					var rowCount = 0;
					var rowCountFix = 0;
					var blnNewRow = false;
					var cols = el.cols;
					var maxSize = el.maxSize;
					
					//to handle blnNewRow when the maxlines has been exceeded
					var newRowFlag = false;
					//To handle the deletion of extra line from textarea.
					var delExtraLines = misys.getLocalization('g_delExtraLinesTextarea');
					
					// We remove any trailing carriage return line feed at then end of the text
					// respectively for IE and Mozilla/Netscape
					strInput = strInput.replace(/(\r\n)+$/, "");
					strInput = strInput.replace(/(\n)+$/, "");
					
				    for (k=0; k<strInput.length; k++)
				    {
				    	strCurrentChar = strInput.charAt(k);
					
						// If the character is a carriage return or newline, we copy it
						// and reset the line counter
						if((strCurrentChar == "\r") || (strCurrentChar == "\n")){
							strResult += "\n";
							intCountCol = 0;
							rowCount++;
							blnNewRow = true;

							// Reset the position of the last space
							intPosLastSpace = -1;

							// If the character is a carriage return (IE), it will be followed
							// by a linefeed and hence we let the counter k jump by one
							if(strCurrentChar == "\r"){
								k++;
							}
						}
						
						// If the counter is equal to the maximum number of characters per line,
						// we retrieve the position of the previous blank space and add a
						// carriage return right after it. We insert a carriage return before the 
						// character and reset the counter:
						else if(intCountCol == cols){
							// If no space has so far been encountered we simply add a carriage
							// return here
							if(intPosLastSpace == -1){
								strResult += "\n";
								intCountCol = 1;
							} else{
								strResult = strResult.slice(0, strResult.length - (k - intPosLastSpace) + 1) + "\n" +
										strResult.slice(strResult.length - (k - intPosLastSpace) + 1);
								intCountCol = k - intPosLastSpace;
							}
							strResult += strCurrentChar;
							rowCount++;
							blnNewRow = true;
							// Reset the position of the last space
							intPosLastSpace = -1;
						} else{
							// Otherwise we simply copy the character and increment the counter:
							strResult += strCurrentChar;
							intCountCol++;
							blnNewRow = false;
						}

						// If the current character is a space, we store its position
						if(strCurrentChar == " "){
							intPosLastSpace = k;
						}
						
						//Fixed : blnNewRow has a scope within the for loop
						//when the current character is on the same line, blrNewRow is false
						//so when we pass blrNewRow to this.blnNewRow it doesnt validate for max no of lines
						//hence set a new flag into this.blnNewRow to indicate maxlines being exceeded 
						if(blnNewRow)
						{
							if(rowCount >= maxSize)
							{
								newRowFlag = true;
								el.set('blnNewRow', newRowFlag);
								el.set('rowCount', rowCount);
								if(delExtraLines === 'true')
								{
									el.set('value',strResult);
								}
								el.validate(false);
								//return;
	            			}
						}
				    }
					
				    if(el.maxLength != "" && el.maxLength > 0)
				    {
					    if(strResult.length > el.maxLength)
				    	{
					    	strResult = strResult.substring(0, el.maxLength);
				    	}
				    }
				    
					// Set attributes and update value
					el.set('blnNewRow', newRowFlag);
					el.set('rowCount', rowCount);
					el.set('value',strResult);
				}
				else
					{
						var newRowCount = 0;
						el.set('rowCount', newRowCount);
					}
				
				
				// Validate
				el.validate(false);
			}
        }
);