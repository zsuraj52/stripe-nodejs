import { Request, Response, response } from "express";
import { createCustomerService, createCardService, createCheckoutSession, createCheckoutService, createConnectService, createChargeService, getCustomerService, createConnectCustomerService, getPaymentMethodService, createPaymentMethodService, getPaymentMethodsListService, detachPaymentMethodByIdService, createMSAReportService, getAllPaymentsForConnectAccountService, addTokenToCustomerService } from "../service";

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, email } = req?.body;
        if (!name || !email) {
            return res.status(400).send({ "Status": "FAILED", "Message": "Failed to create user entry", "Response": "Please Provide name and email fields" })
        }
        console.log("🚀 createCustomer ~ name,email: ", name, email);

        return await createCustomerService(name, email).then((customer: any) => {
            console.log("🚀 createCustomerService ~ customer:", customer);
            return res.status(201).send({ "Status": "SUCCESS", "Message": "Customer Created Successfully", "Response": customer })
        })
    }
    catch (e) {
        console.log("🚀 createCustomer ~ error:", e)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed to create customer", "Response": e })
    }
}


export const createCard = async (req: Request, res: Response) => {
    try {
        const { number, exp_month, exp_year, cvc, customer } = req?.body;
        if (!number || !exp_month || !exp_year || !cvc || !customer) {
            return res.status(400).send({ "Status": "FAILED", "Message": "Failed to create user entry", "Response": "Please Provide all fields" })
        }
        console.log("🚀 createCard ~ number ,exp_month ,exp_year ,cvc ,customer: ", req?.body);
        return await createCardService(req?.body).then((card: any) => {
            console.log("🚀 createCardService ~ card: ", card)
            return res.status(201).send({ "Status": "SUCCESS", "Message": "Card Created Successfully", "Response": card })
        })
    }
    catch (e: any) {
        console.log("🚀 createCard ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed to create card", "Response": e })
    }
}

export const createSession = async (req: Request, res: Response) => {
    try {
        return await createCheckoutSession(req?.body).then((response: any) => {
            return res.status(201).send({ "Status": "SUCCESS", "Message": "Payment Has Initiated, Please complete by clicking on below link", "url": response?.url })
        })
    }
    catch (e) {
        console.log("🚀 createCharge ~ error:", e)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed to create charge", "Response": e })
    }
}

export const createCheckout = async (req: Request, res: Response) => {
    try {
        if (!req.body?.product) {
            return res.status(400).send({ "Status": "FAILED", "Message": "Failed to accept payment", "Response": "Please Provide all fields" })
        }
        return await createCheckoutService(req.body?.product).then((payment) => {
            console.log("🚀 createCheckoutService ~ payment:", payment)
            return res.status(201).send({ "Status": "SUCCESS", "Message": "Payment Has Initiated, Please complete by clicking on below link", "url": payment?.url })

        })

    } catch (e) {
        console.log("🚀 createCheckout ~ error:", e)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed to accept payment", "Response": e })
    }
}

export const createConnect = async (req: Request, res: Response) => {
    try {
        return await createConnectService(req.body?.type).then((response: any) => {
            console.log("🚀 createCheckoutService ~ payment:", response)
            return res.status(201).send({ "Status": "SUCCESS", "url": response })

        })

    } catch (e) {
        console.log("🚀 createConnect ~ error:", e)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while creating connect", "Response": e })

    }
}

export const createCharge = async (req: Request, res: Response) => {
    try {
        return await createChargeService(req.body).then((response: any) => {
            console.log("🚀 createCharge ~ response:", response)
            return res.status(201).send({ "Status": "SUCCESS", "Response": response })
        })
    } catch (e: any) {
        console.log("🚀 createCharge ~ error:", e);
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while creating bank token", "Response": e.message })
    }
}

export const getCustomer = async (req: Request, res: Response) => {
    try {
        console.log("id ", req.body);
        const customer = await getCustomerService(req.body);
        console.log("🚀 getCustomerService ~ cutomer:", customer)
        return res.status(200).send(customer);

    } catch (e: any) {
        console.log("🚀 getCustomer ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while verifying bank details", "Response": e })
    }
}

export const createConnectCustomer = async (req: Request, res: Response) => {
    try {
        return res.status(200).send(await createConnectCustomerService(req.body));
    } catch (e) {
        console.log("🚀 getCustomer ~ error:", e)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while verifying bank details", "Response": e })
    }
}

export const getPaymentMethod = async (req: Request, res: Response) => {
    try {
        return res.status(200).send(await getPaymentMethodService(req.body))
    } catch (e: any) {
        console.log("🚀 getPaymentMethod ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while fetching payment method", "Response": e.message })
    }
}

export const createPaymentMethod = async (req: Request, res: Response) => {
    try {
        return res.status(201).send(await createPaymentMethodService(req.body))
    }
    catch (e: any) {
        console.log("🚀 createPaymentMethod ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while creating payment method", "Response": e.message })
    }
}

export const getPaymentMethodsList = async (req: Request, res: Response) => {
    try {
        return res.status(200).send(await getPaymentMethodsListService(req.body))
    } catch (e: any) {
        console.log("🚀 getPaymentMethodsList ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while fetching payment method list", "Response": e.message })
    }
}

export const detachPaymentMethodById = async (req: Request, res: Response) => {
    try {
        return res.status(200).send(await detachPaymentMethodByIdService(req))
    } catch (e: any) {
        console.log("🚀 detachPaymentMethodById ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while fetching payment method list", "Response": e.message })
    }
}

export const createMSAReport = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        return res.status(201).send(await createMSAReportService(data))
    }
    catch (e: any) {
        console.log("🚀 createMSAReport ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while fetching payment method list", "Response": e.message })
    }
}

export const getAllPaymentsForConnectAccount = async (req: Request, res: Response) => {
    try {
        return res.status(200).send(await getAllPaymentsForConnectAccountService(req.params.id))
    } catch (e: any) {
        console.log("🚀 getAllPaymentsForConnectAccount ~ error:", e.message)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed while fetching payment method list", "Response": e.message })
    }
}

export const addTokenToCustomer = async (req: Request, res: Response) => {
    try {
        return res.status(200).send(await addTokenToCustomerService(req.body));
    } catch (error: any) {
        console.log("🚀 ~ file: index.ts:181 ~ addTokenToCustomer ~ error:", error)
        return res.status(400).send({ "Status": "FAILED", "Message": "Failed create and attach token to customer", "Response": error.message })

    }
}
