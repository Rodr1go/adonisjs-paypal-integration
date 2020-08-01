'use strict'

const Config = use('Config');
const Paypal = use('paypal-rest-sdk');

Paypal.configure(Config.get('paypal.configure'));

class PaypalController {
  getSuccessURL() {
    return Config.get('paypal.url_success')
  }

  getErrorURL() {
    return Config.get('paypal.url_error');
  }

  createPay(payment) {
    return new Promise((resolve, reject) => {
      Paypal.payment.create(payment, (err, payment) => {
        if(err) {
          reject(err);
        } else {
          resolve(payment);
        }
      });
    });
  }

  getPay(paymentId) {
    return new Promise((resolve, reject) => {
      Paypal.payment.get(paymentId, (err, payment) => {
        if(err) {
          reject(err);
        } else {
          resolve(payment);
        }
      });
    });
  }
}

module.exports = PaypalController;
