'use strict'

const book = {
  sku: 'B001',
  title: 'Aprenda desenvolver seus frontends com React',
  image: '',
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

  async download() {
    return 'Fazer download do arquivo...'
  }
}

module.exports = ShopController;
