/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


function Calculator_OnClick(_1){var _2=document.calculator.calcResults;switch(_1){case "0":case "1":case "2":case "3":case "4":case "5":case "6":case "7":case "8":case "9":case ".":if((this.lastOp==this.opClear)||(this.lastOp==this.opOperator)){_2.value=_1;}else{if((_1!=".")||(_2.value.indexOf(".")<0)){_2.value+=_1;}}this.lastOp=this.opNumber;break;case "*":case "/":case "+":case "-":if(this.lastOp==this.opNumber){this.Calc();}this.evalStr+=_2.value+_1;this.lastOp=this.opOperator;break;case "=":this.Calc();this.lastOp=this.opClear;break;case "c":_2.value="0";this.lastOp=this.opClear;break;default:alert("'"+_1+"' not recognized.");break;}};function Calculator_Calc(){var _3=document.calculator.calcResults;if(!isNaN(_3.value)){_3.value=eval(this.evalStr+_3.value);}this.evalStr="";};function Calculator(){this.evalStr="";this.opNumber=0;this.opOperator=1;this.opClear=2;this.lastOp=this.opClear;this.OnClick=Calculator_OnClick;this.Calc=Calculator_Calc;};gCalculator=new Calculator();