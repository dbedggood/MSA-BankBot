var builder = require('botbuilder');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/84985f51-d322-4b83-a441-b3f490c41e22?subscription-key=0ccd28813dc54c33a936be746348319f&verbose=true&timezoneOffset=720&q=');

    bot.recognizer(recognizer);

    bot.dialog('greet', function (session, args) {
        session.send("Hello!")
    }).triggerAction({
        matches: 'greet'
    });

    bot.dialog('checkBalance', function (session, args) {
        session.send("Retrieving balances...")
    }).triggerAction({
        matches: 'checkBalance'
    });

    bot.dialog('forgotPassword', function (session, args) {
        session.send("Do you want to reset your password?")
    }).triggerAction({
        matches: 'forgotPassword'
    });

    bot.dialog('requestSupport', function (session, args) {
        session.send("Fetching tech support...")
    }).triggerAction({
        matches: 'requestSupport'
    });

    bot.dialog('farewell', function (session, args) {
        session.send("Goodbye!")
    }).triggerAction({
        matches: 'farewell'
    });

    bot.dialog('transferMoney', function (session, args) {
        console.log(args.intent.entities);
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
        console.log('\n');
        console.log(args.intent.entities);
        console.log('\n');
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
