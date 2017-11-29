var rest = require('../API/RestClient');

exports.exchange = function getExchange(currency, amount, session){
  var url = "https://api.fixer.io/latest?base=NZD&symbols=NZD," + currency;
  rest.getExchangeData(url, session, currency, amount, getCurrency);
}

function getCurrency(message, currency, amount, session){
  var exchangeRate = JSON.parse(message);
  var result = exchangeRate.rates[currency] * amount;
  result = Math.floor(result).toString();
  session.send(amount + 'NZD will exchange to about ' + result + currency + '.');
  session.send('Head over to the Exchange page on our website to process the transaction.')
}