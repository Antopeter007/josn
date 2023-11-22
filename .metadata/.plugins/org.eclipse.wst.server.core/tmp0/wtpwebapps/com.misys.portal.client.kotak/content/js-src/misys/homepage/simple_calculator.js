function Calculator_OnClick(keyStr)
{
	var resultsField =
	document.calculator.calcResults;
	switch (keyStr)
	{
	case "0":
	case "1":
	case "2":
	case "3":
	case "4":
	case "5":
	case "6":
	case "7":
	case "8":
	case "9":
	case ".":
	if ((this.lastOp==this.opClear) || (this.lastOp==this.opOperator))
	{
	resultsField.value =
	keyStr;
	}
	else
	{
	// ignore extra decimals
	if ((keyStr!=".") || (resultsField.value.indexOf(".")<0))
	{
	resultsField.value +=
	keyStr;
	}
	}
	this.lastOp = this.opNumber;
	break;
	case "*":
	case "/":
	case "+":
	case "-":
	if (this.lastOp == this.opNumber) 
	{
		this.Calc();
	}
	this.evalStr +=
	resultsField.value + keyStr;
	this.lastOp =
	this.opOperator;
	break;
	case "=":
	this.Calc();
	this.lastOp =
	this.opClear;
	break;
	case "c":
	resultsField.value = "0";
	this.lastOp = this.opClear;
	break;
	default:
	alert("'" + keyStr + "' not recognized.");
	break;
	}
}
function Calculator_Calc()
{
	var resultsField =
	document.calculator.calcResults;
	if (!isNaN(resultsField.value)) {
		resultsField.value = eval(this.evalStr + resultsField.value);
	}
	this.evalStr = "";
}
function Calculator()
{
	this.evalStr = "";
	this.opNumber = 0;
	this.opOperator = 1;
	this.opClear = 2;
	this.lastOp = this.opClear;
	this.OnClick =
	Calculator_OnClick;
	this.Calc = Calculator_Calc;
}

gCalculator = new Calculator(); 