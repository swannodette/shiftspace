if(typeof console == "undefined")
{
  var console = {
    log: function() {},
    warn: function() {},
    error: function() {}
  };
}

window.addEvent("domready", initInnerChannel);

function initInnerChannel() {
  window.addEventListener("message", receiveMessage, false);
}

function receiveMessge(message) {
  if(message.origin !== "http://localhost:8080")
  {
    console.log("Message from unexpected origin");
  }
  else
  {
    $("messages").set("text", JSON.decode(message.data));
    dispatchMessage(message);
  }
}

function dispatchMessage(message) {
  switch(message.event) {
    case "loadSpace":
    break;
    case "newShift":
    break;
    default:
    break;
  }
}
