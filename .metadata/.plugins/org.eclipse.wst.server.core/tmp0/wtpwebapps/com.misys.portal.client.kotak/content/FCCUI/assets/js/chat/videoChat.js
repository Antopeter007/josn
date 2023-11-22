function videoChat(widgetKey,scriptUrl){
    (function(s,u,r,f,l,y){s[f]=s[f]||{init:function(){s[f].q=arguments}};
  l=u.createElement(r);y=u.getElementsByTagName(r)[0];l.async=1;
  l.src=scriptUrl;y.parentNode.insertBefore(l,y);})
  (window,document,'script','Surfly');
  
  var settings = {
  // Surfly session options can be set here, or at the Company/Plan levels.
  widget_key: widgetKey,
  private_session: true, // to make sure only logged in agents can join the call
  require_password: false,
  };
  
  Surfly.init(settings, function(initResult) {
      if (initResult.success) {
          // API calls can now be made!
          if (!Surfly.isInsideSession) {
              Surfly.button();
          }
      }
      else{
          console.log("Surfly was unable to initialize properly.")
      }
  });
}  
function ChatConfiguration() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
  }
  // public
  ChatConfiguration.prototype.chat = videoChat;