if(typeof console == "undefined")
{
  var console = {
    log: function() {},
    warn: function() {},
    error: function() {}
  };
}

var postMessageURL = "http://127.0.0.1:8080" + window.location.pathname;
  
window.addEvent("domready", initOuterChannel);


function initOuterChannel ()
{
  window.addEventListener("message", receiveMessage, false);
}


function receiveMessage(message)
{
  if(message.origin !== "http://127.0.0.1:8080")
  {
    console.log("Message from unexpected origin");
  }
  else
  {
    dispatchMessage(JSON.decode(message.data));
  }
}

function _postMessage(message) {
  $("unsafe-frame").contentWindow.postMessage(JSON.encode(message), postMessageURL);
}

function dispatchMessage(message) {
  switch(message.event) {
    case "spaceLoad":
      console.log("spaceLoad ", message.spaceName);
    default:
    break;
  }
}


function sendTestMessage(text)
{
  _postMessage({event:"testMessage", text:text});
}


function loadSpace(spaceName)
{
  _postMessage({event:"loadSpace", spaceName:spaceName});
}


function newShift(spaceName)
{
  var tempId = 'newShift' + Math.round(Math.random(0, 1) * 1000000),
      winSize = window.getSize(),
      position = {x: winSize.x/2, y: winSize.y/2},
      shift = {
        _id: tempId,
        space: {name: spaceName},
        userName: ShiftSpace.User.getUserName(),
        content: {position: position}
      };
  _postMessage({event:"newShift", spaceName: spaceName, shift: shift});
}
