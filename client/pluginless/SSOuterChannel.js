if(typeof console == "undefined")
{
  var console = {
    log: function() {},
    warn: function() {},
    error: function() {}
  };
}

window.addEvent("domready", initOuterChannel);

function initOuterChannel ()
{
  window.addEventListener("message", receiveMessage, false);
}

function receiveMessage(message)
{
  if(evt.origin !== "http://127.0.0.1:8080")
  {
    console.log("Message from unexpected origin");
  }
  else
  {
    dispatchMessage(message);
  }
}

function dispatchMessage(message) {
  switch(message.event) {
    default:
    break;
  }
}

function sendMessage(msg)
{
  $("unsafe-frame").contentWindow.postMessage(JSON.encode(msg), "http://127.0.0.1:8080${src}");
}

function loadSpace(spaceName)
{
  $("unsafe-frame").contentWindow.postMessage(JSON.encode({event:"loadSpace", spaceName:spaceName}), "http://127.0.0.1:8080${src}");
}

function newShift(spaceName)
{
  $("unsafe-frame").contentWindow.postMessage(JSON.encode({event:"newShift", spaceName:spaceName}), "http://127.0.0.1:8080${src}");
}
