// "empty" FcmWidget constructor
function FcmWidget() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}
function afterWidgetScriptLoaded(widgetId, callback)
{
  if (window.WidgetLauncher && window.WidgetLauncher.getWidgetFunction(widgetId))
  {
    window.console.log("Widget[" + widgetId + "] was already registered");
    callback();
    return;
  }
  var timerId = window.setInterval(function()
  {
    if (window.WidgetLauncher === undefined || window.WidgetLauncher.getWidgetFunction(widgetId) === undefined)
    {
      window.console.log("Waiting for widget[" + widgetId + "] to get registered");
      return;
    }
    window.clearInterval(timerId);
    callback();
  }, 50);
}

function loadWidgetJS(widgetId, url, callback)
{
  if (window.WidgetResourceLoader)
  {
    window.WidgetResourceLoader.loadJS(url, function()
    {
      afterWidgetScriptLoaded(widgetId, callback);
    });
    return;
  }
  var scriptEl = document.createElement("script");
  scriptEl.type = "text/javascript";

  if (scriptEl.readyState)
  { //IE
    scriptEl.onreadystatechange = function()
    {
      if (scriptEl.readyState === "loaded" || scriptEl.readyState === "complete")
      {
        scriptEl.onreadystatechange = null;
        afterWidgetScriptLoaded(widgetId, callback);
      }
    };
  }
  else
  { //Others
    scriptEl.onload = function()
    {
      afterWidgetScriptLoaded(widgetId, callback);
    };
  }

  scriptEl.src = url;
  document.getElementsByTagName("body")[0].appendChild(scriptEl);
}

function loadWidget(widgetId, containerDivId, config)
{
  window.console.log('Loading Widget for ' + containerDivId);
  window.WidgetLauncher.load(widgetId, config, function(widget)
  {
    window.WidgetLauncher.launchWidget(widget, containerDivId);
  });
}

function initializeWidgetBaseUrl(widgetId, widgetBaseUrl)
{
	if (window.WidgetBaseUrlMap === undefined)
	{
		window.WidgetBaseUrlMap = {
			"widgetBaseUrl": widgetBaseUrl
		};
	}
	if (window.WidgetBaseUrlMap[widgetId] === undefined)
	{
		window.WidgetBaseUrlMap[widgetId] = widgetBaseUrl;
	}
}
function addWidgets(ssoTokenJson, containerElemId, scriptWidgetUrl, scriptBaseUrl)
{
  var widgetId = containerElemId;
  initializeWidgetBaseUrl(widgetId, scriptBaseUrl); 
  loadWidgetJS(widgetId, scriptBaseUrl + scriptWidgetUrl, function()
  {
    window.console.log('Add Payments Grid Widget under ' + containerElemId);
    loadWidget(widgetId, containerElemId, ssoTokenJson);
  });
}

// public
FcmWidget.prototype.fcmAddWidgets = addWidgets;