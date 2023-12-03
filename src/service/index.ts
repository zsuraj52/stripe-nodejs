import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const stripe = require('stripe')(process.env.stripe_secret);

export const createCustomerService = async (name: string, email: string) => {
    try {
        return await stripe.customers.create({
            name: name,
            email: email
        }).then((customer: any) => {
            console.log("🚀 createCustomerService ~ customer:", customer)
            return customer;
        })
    }
    catch (e) {
        console.log("createCustomerService | Catch ", e);
        throw (e);
    }
}

export const createCardService = async (cardData: any) => {
    try {
        console.log("🚀 createCardService ~ cardData:", cardData)

        return await stripe.tokens.create({
            card: cardData
        }).then(async (cardDetails: any) => {
            console.log("🚀 createCardService ~ cardDetails: ", cardDetails)
            return await stripe.customers.createSource(cardData?.customer, {
                source: `${cardDetails?.id}`
            }).then((card: any) => {
                console.log("🚀 createCardService ~ card:", card)
                return card;
            })
        })
    }
    catch (e) {
        console.log("createCardService | Catch ", e);
        throw (e);
    }
}

export const createCheckoutSession = async (checkoutData: any) => {
    try {
        console.log("🚀 createCheckoutSession ~ checkoutData:", checkoutData);
        const session = await stripe.checkout.sessions.create({
            customer: checkoutData?.customer_Id,
            payment_method_types: ["card"],
            invoice_creation: { enabled: true },
            mode: "payment",
            line_items: [{
                price: checkoutData?.price_Id,
                quantity: checkoutData?.quantity
            }],
            success_url: 'https://www.google.com',
            cancel_url: 'http://localhost:3000/'
        });
        console.log("🚀 createCheckoutSession ~ session:", session)
        return session;
    }
    catch (e) {
        console.log("createCheckoutSession | Catch ", e);
        throw (e);
    }
}

export const createCheckoutService = async (productData: any) => {
    try {
        console.log("🚀 createCheckoutService ~ productData:", productData)
        return await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: productData?.name,
                        },
                        unit_amount: productData?.price * 100,
                    },
                    quantity: productData?.quantity,
                }
            ],
            mode: "payment",
            success_url: "http://127.0.0.1:5500/success.html",
            cancel_url: "http://localhost:3000/cancel",
        })
    }
    catch (e) {
        console.log("🚀 createCheckoutService ~ e:", e)
        throw (e);
    }
}


export const createConnectService = async (type: string) => {
    try {
        return await stripe.accounts.create({ type: type }).then(async (account: any) => {
            console.log("account ", account);

            return await stripe.accountLinks.create({
                account: account?.id,
                refresh_url: 'https://example.com/reauth',
                return_url: 'https://stripe.com/docs/api/account_links/create',
                type: 'account_onboarding',
            }).then((accountLink: any) => {
                console.log("accountLink ", accountLink);
                return accountLink?.url
            })
        })

    } catch (e) {
        console.log("🚀 createConnectService ~ e:", e)
        throw (e);
    }
}

export const createChargeService = async (data: any) => {
    const customer = await getCustomerService(data);
    console.log("🚀 createChargeService ~ customer:", customer);

    if (!customer.default_source) {
        return await stripe.tokens.create({
            bank_account: {
                country: data.country,
                currency: data.currency,
                account_holder_name: data.fullName,
                account_holder_type: data.type,
                routing_number: data.routing_number,
                account_number: data.account_number,
            }
        })
            .then(async (bankData: any) => {
                console.log("🚀 createChargeService ~ bankData:", bankData);
                return await stripe.customers.createSource(data.customer_Id, { source: String(bankData?.id) })
            })
            .then(async (createSource: any) => {
                console.log("createSource ===> ", createSource);
                return await stripe.customers.verifySource(data.customer_Id, createSource.id, { amounts: [32, 45] })
            })
        // .then(async (source:any) => {
        //     console.log("🚀 source:", source)
        //     return await stripe.charges.create({ currency: data.currency, amount: data.amount, customer: data.customer_Id}
        //     ).then(async (charge:any ) => {
        //         console.log("🚀 createChargeService ~ charge:", charge);
        //         return charge
        //     })
        // })

        // throw new Error ('No Bank Details Found For Payment, Please Attach Details')
    }
    else {
        console.log("🚀 else condition 🚀");
        return await stripe.charges.create({
            amount: data.amount,
            currency: data.currency,
            customer: data.customer_Id
        }).then(async (charge: any) => {
            console.log("🚀 createChargeService ~ charge:", charge);
            return charge;
        })
    }
}

export const getCustomerService = async (body: any) => {
    return await stripe.customers.retrieve(body.customer_Id, { stripeAccount: body.business_Id });
}

export const createConnectCustomerService = async (data: any) => {
    const customer = await stripe.customers.create(
        {
            name: data.name,
            email: data.email,
            address: {
                city: data.address.city,
                country: data.address.country,
                line1: data.address.line1,
                line2: data.address.line2,
                postal_code: data.address.postal_code,
                state: data.address.state
            }
        },
        { stripeAccount: data.connectAccountId }
    );
    console.log("customer ", customer);
    return customer;
}

export const getPaymentMethodService = async (body: any) => {
    try {
        console.log("body ", body);
        const PaymentMethod = await stripe.paymentMethods.retrieve(
            body.paymentMethod_Id, { stripeAccount: body?.business_Id }
        );
        console.log("PaymentMethod ", PaymentMethod);
        return PaymentMethod;
    }
    catch (e) {
        throw (e)
    }
}

export const createPaymentMethodService = async (body: any) => {
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'us_bank_account',
        });
    }
    catch (e) {

    }
}

export const getPaymentMethodsListService = async (body: any) => {
    try {
        console.log("body", body);
        return await stripe.paymentMethods.list({ customer: body.customer_Id, type: 'us_bank_account' }, { stripeAccount: body.business_Id })
    } catch (e) {
        throw (e);
    }
}

export const detachPaymentMethodByIdService = async (req: any) => {
    try {
        console.log("req", req.params, req.body);
        return await stripe.paymentMethods.detach(req.params.id, { stripeAccount: req.body.business_Id })
    } catch (e) {
        throw (e);
    }
}

export const createMSAReportService = async (data: any) => {
    try {
        data = JSON.stringify(data);
        await fs.writeFileSync('msaReport.txt', data)
    }
    catch (e) {
        throw (e)
    }
}


export const getAllPaymentsForConnectAccountService = async (data: any) => {
    try {
        return await stripe.paymentIntents.list({}, { stripeAccount: data })
    }
    catch (e) {
        throw (e)
    }
}

export const addTokenToCustomerService = async (data: any) => {
    return await stripe.tokens.create({
        card: {
            number: data.number,
            exp_month: data.exp_month,
            exp_year: data.exp_year,
            cvc: data.cvv,
        }
    }).then(async (token: any) => {
        console.log("🚀 ~ file: index.ts:263 ~ addTokenToCustomerService ~ token:", token)
        return await stripe.customers.create({
            name: data.name,
            email: data.email,
            source: token.id
        })
    })
}
