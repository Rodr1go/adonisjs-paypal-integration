'use strict'

const Helpers = use('Helpers');
const PaypalController = use('App/Controllers/Http/PaypalController');
const Paypal = new PaypalController();

const book = {
  sku: 'B001',
  title: 'Aprenda desenvolver seus frontends com React',
  image: 'https://peerbits-wpengine.netdna-ssl.com/wp-content/uploads/2019/09/the-benefits-of-reactjs-main.jpg',
  description: 'Aprenda React do jeito certo.',
  author: 'Rodrigo Santos',
  price: 50.0,
  currency: 'BRL'
}

class ShopController {
  async index({ view, request }) {
    const paymentId = request.input('paymentId');
    return view.render('index', { book, paymentId });
  }

  async tryPay({ response }) {
    const success_url = Paypal.getSuccessURL();
    const error_url = Paypal.getErrorURL();

    var payment = {
      "intent": "authorize",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": success_url,
        "cancel_url": error_url
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": book.title,
            "sku": book.sku,
            "price": book.price,
            "currency": book.price,
            "quantity": 1
          }]
        },
        "amount": {
          "total": book.price,
          "currency": book.currency
        },
        "description": book.sku + ':' + book.title
      }]
    }
    
    await Paypal.createPay(payment)
      .then((transaction) => {
        var links = transaction.links;
        var counter = links.length;
        while(counter--) {
          if(links[counter].method == 'REDIRECT') {
            return response.redirect(links[counter].href);
          }
        }
      }).catch((err) => {
        var details = err.response;
        if(err.response.httpStatusCode == 401) {
          return response.redirect(
            error_url + '?name=' 
            + details.error + '&message='
            + details.error_description
          );
        } else {
          return response.redirect(
            error_url + '?name='
            + details.name + '&message='
            + details.message
          );
        }
      });
  }
  
  async paySuccess({ request, response, session }) {
    const paymentId = request.input('paymentId');
    session.flash({
      paymentId,
      notification_class: 'alert-success',
      notification_icon: 'fa-check',
      notification_message: `Obrigado pela compra! ${paymentId}`
    });

    response.redirect(`/?paymentId=${paymentId}`);
  }

  async payError({ request, response, session }) {
    const name = request.input('name');
    const message = request.input('message');
    session.flash({
      notification_class: 'alert-danger',
      notification_icon: 'fa-times-circle',
      notification_message: `Erro de pagamento! ${name}:${message}`
    })

    response.redirect('/');
  }

  async download({ request, response }) {
    const paymentId = request.input('paymentId');
    await Paypal.getPay(paymentId)
      .then((payment) => {
        const item = payment.transaction[0].item_list.items[0];
        //Download book
        const name = item.sku + ' - ' + item.name + '.pdf';
        const source = Helpers.resourcesPath('/files/Book-' + item.sku + '.pdf');
        
        response.attachment(source, name);
      })
      // Indicates that the payment does not exist
      .catch((err) => {
        var details = err.response;
        
        response.send(`ERROR: ${details.name} => ${details.message}`);
      });
  }
}

module.exports = ShopController;
