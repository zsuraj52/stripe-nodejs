import express from 'express';
import { createCard, createCustomer, createSession, createCheckout, createConnect, createCharge, getCustomer, createConnectCustomer, getPaymentMethod, createPaymentMethod, getPaymentMethodsList, detachPaymentMethodById, createMSAReport, getAllPaymentsForConnectAccount, addTokenToCustomer } from './src/controller/index'
const router = express.Router();

router.post('/create/customer', createCustomer);
router.post('/create/card', createCard);
router.post('/customer/add/token', addTokenToCustomer);
router.post('/create/checkout/session', createSession);
router.post('/connect', createConnect)

//direct payment 
router.post('/direct/checkout', createCheckout);
router.post('/create/charge', createCharge);
router.get('/customer', getCustomer)
router.post('/connect/customer', createConnectCustomer);
router.post('/payment/method', createPaymentMethod)
router.get('/payment/method', getPaymentMethod)
router.get('/paymentMethod/list', getPaymentMethodsList)
router.post('/detach/paymentMethod/:id', detachPaymentMethodById)
router.get('/get/payments/:id', getAllPaymentsForConnectAccount)

router.post('/msa/report', createMSAReport)

export default router;