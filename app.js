var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');

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
    session.sendTyping();
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                
                var welc1 = new builder.Message()
                .address(message.address)
                .text('Welcome, I am Contoso Bot.')
                bot.send(welc1);

                setTimeout(function(){
                    var welc2 = new builder.Message()
                    .address(message.address)
                    .text('I can assist you in checking your balance, making transfers between accounts, sending payments, resetting your password and exchanging foreign currencies.')
                    bot.send(welc2);
                }, 2000);

                setTimeout(function(){
                    var welc2 = new builder.Message()
                    .address(message.address)
                    .text('How can I help you today?')
                    bot.send(welc2);
                }, 5000);
            }
        });
    }
});

luis.startDialog(bot);