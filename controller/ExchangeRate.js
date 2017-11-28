var rest = require('../API/RestClient');

exports.exchange = function getExchange(currency, session){
  var url = "https://api.fixer.io/latest?base=NZD&symbols=NZD," + currency;
  console.log(url);
  rest.getExchangeData(url, session, currency, getCurrency);
}

function getCurrency(message, currency, session){
  var exchangeRate = JSON.parse(message);
  var ratio = exchangeRate.rates[currency];
  ratio = ratio.toString();
  session.send(ratio);
}