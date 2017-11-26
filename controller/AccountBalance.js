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