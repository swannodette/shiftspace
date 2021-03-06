// ==Builder==
// @name              PersistenceFunctions
// @package           Core
// ==/Builder==

/*
  Function: SSSetValue
    A wrapper function for GM_setValue that handles non-string data better.

  Parameters:
    key - A unique string identifier
    value - The value to store. This will be serialized by uneval() before
      it gets passed to GM_setValue.

  Returns:
    The value passed in.
*/
function SSSetValue(key, value) 
{
  SSLog('SSSetValue ' + key, JSON.encode(value), SSLogSystem);
  if ($type(value) == 'string') 
  {
    GM_setValue(key, value);
  } 
  else 
  {
    GM_setValue(key, JSON.encode(value));
  }
}

/*
  Function: SSGetValue (private, except in debug mode)
    A wrapper function for GM_getValue that handles non-string data better.

  Parameters:
    key - A unique string identifier
    defaultValue - This value will be returned if nothing is found.
    callback - used if the call is being made from a shift/space

  Returns:
    Either the stored value, or defaultValue if none is found.
*/
function SSGetValue(key, defaultValue, callback)
{
  SSLog('SSGetValue key:', key, 'default:', JSON.encode(defaultValue), SSLogSystem);
  var result = GM_getValue(key, defaultValue);
  result = (result != defaultValue) ? JSON.decode(result) : result;
  if(result == 'null') result = null;
  if(callback && $type(callback) == 'function')
  {
    callback(result);
  }
  else
  {
    return result;
  }
  return null;
};