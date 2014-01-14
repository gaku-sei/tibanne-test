;(function($) {

  var currentCurrency = 'USD';
  var currencies = ['USD', 'AUD', 'CAD', 'CHF', 'CNY', 'DKK', 'EUR', 'GBP', 'HKD', 'JPY', 'NZD', 'PLN', 'RUB', 'SEK', 'SGD', 'THB', 'NOK', 'CZK'];

  var messagesCount = 0;

  var socket = MtGox.connect('wss://websocket.mtgox.com/mtgox?Channel=ticker&Currency=' + currencies.join(','));

  /*
   * UI
   */

  // Initial values for fade-in time and display time of messages
  var fadeintime = 300;
  var displaytime = 3000;

  // Clears messages
  var clearAlert = function() {
    $('.alert').addClass('hide');
  };

  // Displays "connection succeed" message
  var connectionAlert = function(data) {
    $('#connection-success').fadeIn(fadeintime).removeClass('hide');
    setTimeout(clearAlert, displaytime);
  };

  // Update UI every time a message is received from the websocket
  var updateUI = function(data) {
    $('#messages-count').text(++messagesCount);
    // Updates the UI only if the currency is the currency selected by the user
    if(data.channel_name.slice(-3) === currentCurrency) {
      // If the form was loading, reactivates the inputs and clear the messages
      if($('form').data('loading')) {
        $('#amount, #total, #currency').prop('disabled', false);
        clearAlert();
      }
      // Updates informations
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

  // Updates the UI when the currency is set by the user
  $('#currency').on('change', function(e) {
    currentCurrency = e.target.value;

    // Changes the current currency
    $('#total-currency').text(currentCurrency);
    // Disables the inputs
    $('#amount, #total, #currency').prop('disabled', true);

    $('form').data('loading', true);
    $('#loading').fadeIn(fadeintime).removeClass('hide');
    $('#amount, #total').val('');
  });

  // Changes the total every time the amount of bitcoin is set by the user
  $('#amount').on('input', function(e) {
    $('#total').val(e.target.value * $('#price').data('price'));
  });

  // Changes the amount of bitcoin every time the total is set by the user
  $('#total').on('input', function(e) {
    $('#amount').val(e.target.value / $('#price').data('price'));
  });

  // Blocks the non-numeric keys in inputs
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
