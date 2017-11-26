var rest = require('../API/RestClient');

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

    rest.getAccBal(url, session, user, function(message, session, user){
     var   allAccounts = JSON.parse(message);

        for(var i in allAccounts) {

            if (allAccounts[i].username === user) {
                var chequeReceived = allAccounts[i].cheque;
                var savingsReceived = allAccounts[i].savings;
                if (accountType === 'Cheque') {
                    chequeReceived += amount;
                    savingsReceived -= amount;
                } else {
                    chequeReceived -= amount;
                    savingsReceived += amount;
                }
                rest.tempDelete(url, session, allAccounts[i].id, updateAccount(chequeReceived, savingsReceived));

            }
        }

    });

};

function updateAccount(body, session, user, url, chequeReceived, savingsReceived){
    rest.postChanges(url, user, chequeReceived, savingsReceived)
    console.log('posted!!!??');
    
    
    }