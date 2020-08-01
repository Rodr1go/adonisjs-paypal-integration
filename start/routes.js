'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'ShopController.index').as('book.index');
Route.get('/pay/success', 'ShopController.paySuccess').as('pay.success');
Route.get('/pay/error', 'ShopController.payError').as('pay.error');
Route.get('/pay/try', 'ShopController.tryPay').as('book.pay');
Route.get('/download', 'ShopController.download').as('book.download');