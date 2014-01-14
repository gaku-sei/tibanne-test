;(function($) {

  var currentCurrency = 'USD';
  var currencies = ['USD', 'AUD', 'CAD', 'CHF', 'CNY', 'DKK', 'EUR', 'GBP', 'HKD', 'JPY', 'NZD', 'PLN', 'RUB', 'SEK', 'SGD', 'THB', 'NOK', 'CZK'];

  var messagesCount = 0;

  var socket = MtGox.connect('wss://websocket.mtgox.com/mtgox?Channel=ticker&Currency=' + currencies.join(','));

  /*
   * UI
   */

  var fadeintime = 300;
  var displaytime = 3000;

  var clearAlert = function() {
    $('.alert').addClass('hide');
  };

  var connectionAlert = function(data) {
    $('#connection-success').fadeIn(fadeintime).removeClass('hide');
    setTimeout(clearAlert, displaytime);
  };

  var updateUI = function(data) {
    $('#messages-count').text(++messagesCount);
    if(data.channel_name.slice(-3) === currentCurrency) {
      if($('form').data('loading')) {
        $('#amount, #total, #currency').prop('disabled', false);
        clearAlert();
      }
      $('#price').text(data.ticker.avg.display_short).data('price', data.ticker.avg.value);
      $('#last-price').text(data.ticker.last.display_short);
      $('#high').text(data.ticker.high.display_short);
      $('#low').text(data.ticker.low.display_short);
      $('#volume').text(data.ticker.vol.display_short);
    }
  };

  /*
   * Events
   */

  $('#currency').on('change', function(e) {
    currentCurrency = e.target.value;
    $('#total-currency').text(currentCurrency);
    $('#amount, #total, #currency').prop('disabled', true);
    $('form').data('loading', true);
    $('#loading').fadeIn(fadeintime).removeClass('hide');
    $('#amount, #total').val('');
  });

  $('#amount').on('input', function(e) {
    $('#total').val(e.target.value * $('#price').data('price'));
  });

  $('#total').on('input', function(e) {
    $('#amount').val(e.target.value / $('#price').data('price'));
  });

  $('input').on('keypress', function(e) {
    if(!String.fromCharCode(e.charCode).match(/[\d\.]/))
      return false;
  });

  /*
   * Init
   */

  socket.on('connect', connectionAlert);
  socket.on('message', updateUI);
})(jQuery);
