var rest = require('../API/RestClient');

var url = 'https://bnkbt.azurewebsites.net/tables/accounts'
var userGlobal;
var recipientGlobal;
var chequeGlobal;
var savingsGlobal;
var receiveGlobal;

exports.displayAccBal = function getAccBal(session, user){
    var url = 'https://bnkbt.azurewebsites.net/tables/accounts';
    rest.getAccBal(url, session, user, handleAccBalResponse)
};

function handleAccBalResponse(message, session, user) {
  session.sendTyping();
  var accBalResponse = JSON.parse(message);
  var cBalance = '';
  var sBalance = '';
  for (var index in accBalResponse) {
      var userReceived = accBalResponse[index].account;
      var chequeReceived = accBalResponse[index].cheque;
      var savingsReceived = accBalResponse[index].savings;
      if (user.toLowerCase() === userReceived.toLowerCase()) {
          cBalance = 'Cheque: $' + chequeReceived;
          sBalance = 'Savings: $' + savingsReceived;
      }        
  }

  session.send(cBalance); 
  setTimeout(function(){
    session.send(sBalance)
  }, 1500);

}

exports.transfer = function transferMoney(session, user, amount, accountType){
    var url  = 'https://bnkbt.azurewebsites.net/tables/accounts';
    console.log("TRANSFER begin");
    rest.getAccBal(url, session, user, function(message, session, user){
        var allAccounts = JSON.parse(message);
        console.log("TRANSFER getdata");
        console.log(accountType);

        for(var i in allAccounts) {
            console.log('iterate accounts: ' + allAccounts[i].account);
            console.log('input: ' + user);
            console.log('accountType: ' + accountType)
            if (allAccounts[i].account.toLowerCase() === user.toLowerCase()) {
                var chequeReceived = allAccounts[i].cheque;
                var savingsReceived = allAccounts[i].savings;
                userGlobal = allAccounts[i].account.toLowerCase();
                if (accountType.toLowerCase() === 'cheque') {
                    chequeGlobal = Number(chequeReceived) + Number(amount);
                    savingsGlobal = savingsReceived - amount;
                    console.log("ADDED TO CHEQUE");
                } else {
                    chequeGlobal = chequeReceived - amount;
                    savingsGlobal = Number(savingsReceived) + Number(amount);
                    console.log("ADDED TO SAVINGS");
                }
                rest.tempDelete(url, session, allAccounts[i].id, userGlobal, updateUserAccount);

            }
        }

    });

};

exports.sendMoney = function sendMoney(session, user, amount, recipient){
    var url  = 'https://bnkbt.azurewebsites.net/tables/accounts';
    console.log("SEND begin");
    rest.getAccBal(url, session, user, function(message, session, user){
        var allAccounts = JSON.parse(message);
        console.log("TRANSFER getdata");
        console.log(recipient);

        for(var i in allAccounts) {
            console.log('iterate accounts: ' + allAccounts[i].account);
            console.log('input: ' + user);
            console.log('accountType: ' + recipient)

            if (allAccounts[i].account.toLowerCase() === user.toLowerCase()) {
                userGlobal = allAccounts[i].account.toLowerCase();
                chequeGlobal = allAccounts[i].cheque - amount;
                savingsGlobal = allAccounts[i].savings;
                rest.tempDelete(url, session, allAccounts[i].id, userGlobal, updateUserAccount);

            } else if (allAccounts[i].account.toLowerCase() === recipient.toLowerCase()) {
                recipientGlobal = allAccounts[i].account.toLowerCase();
                receiveGlobal = Number(allAccounts[i].cheque) + Number(amount);
                rSavingsGlobal = allAccounts[i].savings;
                rest.tempDelete(url, session, allAccounts[i].id, recipientGlobal, updateRecipientAccount);
            }

        }
    }

)};


function updateUserAccount(body, session, userGlobal){
    rest.postChanges(url, userGlobal, chequeGlobal, savingsGlobal)
    }

function updateRecipientAccount(body, session, recipientGlobal){
    rest.postChanges(url, recipientGlobal, receiveGlobal, rSavingsGlobal)        
    }

