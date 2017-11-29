var builder = require('botbuilder');
var analysis = require('./TextAnalytics');
var money = require('./HandleMoney');
var rates = require('./ExchangeRate');

var analyse = function(session, reply) {
    analysis(session.message.text, function(result) {
        if (result > 0.3) {
            session.send(reply);
        } else {
            var msg = new builder.Message(session)
            .text('I\'m sorry if you are upset, would you like me to direct you to Contoso customer service?')
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

exports.analyse;

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/84985f51-d322-4b83-a441-b3f490c41e22?subscription-key=0ccd28813dc54c33a936be746348319f&verbose=true&timezoneOffset=720&q=');

    bot.recognizer(recognizer);


    bot.dialog('exchange', [ function (session, args) {
        session.sendTyping();
        builder.Prompts.choice(session, "Here are the currencies that Contoso's exchange service currently supports:", "USD|CAD|AUD|JPY|CNY", { listStyle: 3 });
    },
    function (session, results) {
        session.conversationData["currency"] = results.response.entity;
        builder.Prompts.number(session, "How much do you plan to exchange?");
    },
    function (session, results) {
        session.sendTyping();
        rates.exchange(session.conversationData["currency"], results.response, session);
    }]).triggerAction({
        matches: 'exchange'
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

    bot.dialog('greet', function (session, args) {
        session.sendTyping();
        var reply = 'Hello!';
        analyse(session, reply);    
    }).triggerAction({
        matches: 'greet'
    });

    bot.dialog('checkBalance', [ function (session, args, next) {
        session.sendTyping();
        session.dialogData.args = args || {};
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to login to your account.");                
        } else {
            session.send('Sure thing, %s!', session.conversationData["username"].charAt(0).toUpperCase() + session.conversationData["username"].slice(1))
            next();
        }
    },
    function (session, results) {

        if (results.response) {
            session.conversationData["username"] = results.response;
        }
        session.send("Retrieving your account balances...");
        money.displayAccBal(session, session.conversationData["username"]);

    }]).triggerAction({
        matches: 'checkBalance'
    });


    bot.dialog('forgotPassword', function (session, args) {
        session.sendTyping();
        var reply = 'Do you want to reset your password?';
        analyse(session, reply);
    }).triggerAction({
        matches: 'forgotPassword'
    });

    bot.dialog('requestSupport', [ function (session, args) {
        session.sendTyping();
        builder.Prompts.choice(session, "Have you checked our FAQ?", "Yes|No", { listStyle: 3 });

    },
    function (session, results) {
        if (results.response.entity === "Yes") {
            session.send('Fetching Contoso customer service, one moment please.')
        } else {
            session.send('Please check it out on our website!')
        } 
    }]).triggerAction({
        matches: 'requestSupport'
    });

    bot.dialog('farewell', function (session, args) {
        session.sendTyping();
        var reply = 'Goodbye!';
        analyse(session, reply)
    }).triggerAction({
        matches: 'farewell'
    });

    bot.dialog('transferMoney', [ function (session, args, next) {
        session.sendTyping();
        session.dialogData.args = args || {};
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to login to your account.");                
        } else {
            session.send('Sure thing, %s!', session.conversationData["username"].charAt(0).toUpperCase() + session.conversationData["username"].slice(1))
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.conversationData["username"] = results.response;
        }
        builder.Prompts.choice(session, "Which account do you want to transfer to?", "Cheque|Savings", { listStyle: 3 });
    },
    function (session, results) {
        session.conversationData["accountType"] = results.response.entity;
        builder.Prompts.number(session, "How much would you like to transfer?");
    },
    function (session, results) {
        session.sendTyping();
        session.send('Transferring $%d to your %s account...', results.response, session.conversationData["accountType"]);
        money.transfer(session, session.conversationData["username"], results.response, session.conversationData["accountType"]);
    }]).triggerAction({
        matches: 'transferMoney'
    });

    bot.dialog('sendMoney', [ function (session, args, next) {
        session.sendTyping();
        session.dialogData.args = args || {};
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to login to your account.");                
        } else {
            session.send('Sure thing, %s!', session.conversationData["username"].charAt(0).toUpperCase() + session.conversationData["username"].slice(1))
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.conversationData["username"] = results.response;
        }
        builder.Prompts.text(session, "Who do you want to send a payment to?");
    },
    function (session, results) {
        session.conversationData["recipient"] = results.response;
        builder.Prompts.number(session, "How much would you like to send?");
    },
    function (session, results) {
        session.sendTyping();
        session.send('Sending $%d to %s...', results.response, session.conversationData["recipient"]);
        money.sendMoney(session, session.conversationData["username"], results.response, session.conversationData["recipient"]);
    }]).triggerAction({
        matches: 'sendMoney'
    });
}