var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
    appId: '6b58fd70-7802-4899-9cad-acfd08e9c77f',
    appPassword: 'utcafeGWX7:$^uOKTV8319['
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});