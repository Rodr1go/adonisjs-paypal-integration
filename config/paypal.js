'use strict'

const Env = use('Env');

module.exports = {
  configure: {
    mode: Env.get('PAYPAL_MODE', 'sandbox'),
    client_id: Env.get('PAYPAL_CLIENT_ID'),
    client_secret: Env.get('PAYPAL_CLIENT_SECRET')
  },
  url_success: Env.get('APP_URL') + "/pay/success",
  url_error: Env.get('APP_URL') + "/pay/error"
}