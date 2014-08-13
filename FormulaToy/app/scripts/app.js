// This file contains the only code that is specific to the app.
// Perhaps it could/should be downloaded.
// The App is provided with generic Assignment information.
// Optionally it can do a 'doGet()' to get more meta-data about the assignment (for instance: spelling words)
// If calls doPost() as needed to return results.
// The code must implement 5 functions ss_getName(), ss_initApp(), ss_assignmentCallback(), ss_canRunStandalone() ss_standaloneMode()
var _app;

// ----- API -----
function ss_canRunStandalone() { return true; }
function ss_getName() { return "FormulaToy"; }
function ss_initApp(loginID, panel, utils) {
  _app = new app();
  _app.initApp(loginID, panel, utils);
}
function ss_assignmentCallback(key, ssName, retval) { _app.assignmentCallback(key, ssName, retval); }
function ss_standaloneMode() { _app.standaloneMode(); }
// ----- END API -----
//function postFormulaTextToServer(txt) { _app.postFormulaTextToServer(txt); }

// Create IE + others compatible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(messageEvent,function(e) {
  console.log('parent received message!:  ',e.data);
  _app.postFormulaTextToServer(e.data);
},false);

var app = function() {
  var _ssPanel;
  var _ssUtil;
  var _teacherKey;
  var _ssName;
  var _emailID;
  var _words; // this is only populated when answers are returned for use by '_words' button.

  this.initApp = function(loginID, panel, utils) { 
    _ssPanel = panel; 
    _ssUtil = utils;
    _emailID = loginID; 
  }
  function htmlString() { 
    var ht = _ssPanel.getElement().height
    var ht = window.getComputedStyle(_ssPanel.getElement()).height.replace('px','');
    ht *= .85;
    ht += 'px';
    console.log(ht);
    var template = '<iframe src="sandboxed.html" style="height: $0; width: 100%;"></iframe>';
    return template.replace('$0',ht);
  }
  this.assignmentCallback = function(key, ssname, retval) {
    _teacherKey = key;
    _ssName = ssname;
    _ssPanel.setContent(htmlString());
//    startFormulaToy();
  }
  this.standaloneMode = function(key, ssname, retval) {
    _ssPanel.setContent(htmlString());
//    startFormulaToy();
  }
  this.postFormulaTextToServer = function(txt) {
    if (_teacherKey == undefined) return;
    var serializedData = "LoginID=" + _emailID + "&SpreadSheetName=" + _ssName + "&" + txt;
    _ssUtil.ss_callWebApp(_teacherKey, serializedData, "post", resultsCallback);
  }
  function resultsCallback() { console.log("Formula posted"); }
  this.initHTML = function() {
    _ssPanel.setContent(htmlString());
  }
}
