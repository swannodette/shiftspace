if(typeof console == "undefined")
{
  var console = {
    log: function() {},
    warn: function() {},
    error: function() {}
  };
}

var postMessageURL = "http://localhost:8080" + window.location.pathname;

window.addEvent("domready", initInnerChannel);


function initInnerChannel() {
  window.addEventListener("message", receiveMessage, false);
}


function receiveMessage(message) {
  if(message.origin !== "http://localhost:8080")
  {
    console.log("Message from unexpected origin");
  }
  else
  {
    dispatchMessage(JSON.decode(message.data));
  }
}

function _postMessage(message) {
  window.parent.postMessage(JSON.encode(message), postMessageURL);
}

var __spaces = {};

function dispatchMessage(message) {
  switch(message.event) {
    case "testMessage":
      $("messages").set("text", message.text);
    break;
    case "loadSpace":
      var spaceName = message.spaceName;
      if($(spaceName))
      {
        break;  
      }
      var theSpace = Asset.javascript(
        ["/spaces", spaceName, spaceName+".js"].join("/"), {
          id: spaceName,
          onload: function() {
            var spacector = window[spaceName+"Space"],
                shiftctor = window[spaceName+"Shift"];
            __spaces[spaceName] = new spacector(shiftctor);
            _postMessage({event:"spaceLoad", spaceName: spaceName});
          }
        }
      );
    break;
    case "newShift":
      var spaceName = message.spaceName,
          shift = message.shift,
          space = __spaces[spaceName];
      space.createShift(shift);
    break;
    default:
    break;
  }
}
