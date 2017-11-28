var request = require('request');

exports.getExchangeData = function getData(url, session, currency, callback){
        request.get(url, function(err,res,body){
            if(err){
                console.log(err);
            }else {
                console.log('REST: ' + url + session + currency + callback)
                callback(body, currency, session);
                console.log('################');
                console.log(body);
                console.log('################');
            }
        });
    };

exports.getAccBal = function getData(url, session, user, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, user);
        }
    });
};

exports.tempDelete = function deleteData(url, session, id, user, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body, session, user);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};

exports.postChanges = function postData(url, user, cheque, savings){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "account" : user,
            "cheque" : cheque,
            "savings" : savings
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};