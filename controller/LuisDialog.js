var builder = require('botbuilder');
var analysis = require('./TextAnalytics');

var analyse = function(session, reply) {
    analysis(session.message.text, function(result) {
        if (result > 0.3) {
            session.send(reply);
        } else {
            var msg = new builder.Message(session)
            .text('I\'m sorry if you are upset, would you like me to direct you to live support?')
            .suggestedActions(
                builder.SuggestedActions.create(
                        session, [
                            builder.CardAction.postBack(session, "I need help", "Yes"),
                            builder.CardAction.postBack(session, "no", "No"),
                        ]
                    ));
            session.send(msg);
        }
    })
}

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/84985f51-d322-4b83-a441-b3f490c41e22?subscription-key=0ccd28813dc54c33a936be746348319f&verbose=true&timezoneOffset=720&q=');

    bot.recognizer(recognizer);

    bot.dialog('greet', function (session, args) {
        session.sendTyping();
        var reply = 'Hello!';
        analyse(session, reply);    
    }).triggerAction({
        matches: 'greet'
    });

    bot.dialog('anythingElse', function (session, args) {
        session.sendTyping();
        if (!session.conversationData.repeat) {
            session.conversationData.repeat = true;
            session.send('Okay, is there anything else I can help you with?');
        } else {
            session.send('Alright.');
        }
    }).triggerAction({
        matches: 'negative'
    });

    bot.dialog('checkBalance', function (session, args) {
        session.sendTyping();
        var reply = 'Retrieving balances...';
        analyse(session, reply);    
    }).triggerAction({
        matches: 'checkBalance'
    });

    bot.dialog('forgotPassword', function (session, args) {
        session.sendTyping();
        var reply = 'Do you want to reset your password?!';
        analyse(session, reply);
    }).triggerAction({
        matches: 'forgotPassword'
    });

    bot.dialog('requestSupport', function (session, args) {
        session.sendTyping();
        session.send('Fetching live support...');
    }).triggerAction({
        matches: 'requestSupport'
    });

    bot.dialog('farewell', function (session, args) {
        session.sendTyping();
        var reply = 'Goodbye!';
        analyse(session, reply)
    }).triggerAction({
        matches: 'farewell'
    });

    bot.dialog('transferMoney', function (session, args) {
        session.sendTyping();
        var moneyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        var accountEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'account');

        if (moneyEntity != null && accountEntity != null) {
            session.send('Transferring $%d to your %s account...', moneyEntity.entity, accountEntity.entity);
        } else {
            session.send('TRANSFER ERROR moneyEntity=%d accountEntity=%s', moneyEntity.entity, accountEntity.entity);
        }
    }).triggerAction({
        matches: 'transferMoney'
    });

    bot.dialog('sendMoney', function (session, args) {
        session.sendTyping();
        var moneyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        var peopleEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'people');

        if (moneyEntity != null && peopleEntity != null) {
            session.send('Sending $%d to %s...', moneyEntity.entity, peopleEntity.entity);
        } else {
            session.send('SEND ERROR moneyEntity=%d peopleEntity=%s', moneyEntity.entity, peopleEntity.entity);
        }
    }).triggerAction({
        matches: 'sendMoney'
    });
}
