 export var parseUrl = (querystring) =>
{
    /**
    * Function that parses a querystring and returns a JS object in the form of 
    * (key,value) pairs
    */
    var urlparams = {};
    if (querystring === '')
        return urlparams;
    var pairs = querystring.slice(1).split('&');
    for (var it = 0; it < pairs.length;it++)
    {
        var pair = pairs[it].split('=');
        urlparams[pair[0]] = pair[1];
    }
    return urlparams;
}