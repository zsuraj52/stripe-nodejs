const stripe = require("stripe")(
  "sk_test_51McUFsSHRMOdAfZTSg1X3cVuytaBXSn9tc8JXix6j7u6iXVQjJJalILedy7DYrc1xrAfShSIfapuk17IjWeEiDpn008CNHaxai"
);

async function main() {
  try {
    // const customer = await stripe.customers.create({
    //   description: "Testing Recurring)",
    //   email: "testing-recurring@getnada.com",
    // });
    // console.log("customer created ==> ", customer);

    // if (!customer) {
    //   return "Failed to create customer";
    // }

    // const card = await stripe.customers.createSource(customer?.id, {
    //   source: "tok_1MdqfOSHRMOdAfZTOhyjInck",
    // });
    // console.log("card assigned to user ==> ", card);

    // if (!card) {
    //   return "Failed to create card for customer";
    // }

    // const subscription = await stripe.subscriptions.create({
    //   customer: customer?.id,
    //   items: [{ price: "price_1MdppvSHRMOdAfZTLgqaOGCx" }],
    //   payment_behavior: "allow_incomplete",
    // });
    // console.log("subscription created for customer ", subscription);




  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  console.log("paymentIntent ==> ",paymentIntent);

  } catch (e) {
    console.log("Error in catch ", e);
    return e;
  }
}

main();
