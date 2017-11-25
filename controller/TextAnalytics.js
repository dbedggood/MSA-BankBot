var https = require ('https');
var accessKey = 'f7fd205d4e934943965716e4184f1971';
var uri = 'westcentralus.api.cognitive.microsoft.com';
var path = '/text/analytics/v2.0/sentiment';

module.exports = function (input, cb) {

    var documents = {'documents': [ {'id': '1', 'language': 'en', 'text':input}]}
    var get_sentiments = function (documents) {
        var body = JSON.stringify (documents);
        
        var request_params = {
            method : 'POST',
            hostname : uri,
            path : path,
            headers : {
                'Ocp-Apim-Subscription-Key' : accessKey,
            }
        };
        
        var req = https.request (request_params, response_handler);
        req.write (body);
        req.end ();
    };

    var response_handler = function (response) {
        var body = '';
        response.on ('data', function (d) {
            body = d;
        });
        response.on ('end', function () {
            var body_ = JSON.parse (body);
            var result = body_.documents[0].score;
            cb(result);
        });
        response.on ('error', function (e) {
            console.log ('Error: ' + e.message);
        });
    };

    get_sentiments(documents);
    
}