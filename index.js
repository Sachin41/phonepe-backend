const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
const bodyParser = require("body-parser");



require("dotenv").config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));



let salt_key = process.env.SALT_KEY
let merchant_id = process.env.MERCHANT_ID

app.get("/", (req, res) => {
    res.send("server is running");
})


app.post("/order", async (req, res) => {

    try {
        console.log("Order Request:", req.body);

        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `https://foodapp-backend-si51.onrender.com/status/?id=${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: `https://foodapp-backend-si51.onrender.com/status/?id=${merchantTransactionId}`,
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        // const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            console.log("order data", response.data)

            return res.json(response.data)
        })
            .catch(function (error) {
                console.error(error);
            });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }

})


app.post("/status", async (req, res) => {

    const merchantTransactionId = req.query.id
    const merchantId = merchant_id

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    // CHECK PAYMENT STATUS
    axios.request(options).then(async (response) => {
        if (response.data.success === true) {
            console.log("payment completed", response.data);
            res.cookie("orderData", JSON.stringify(response.data), {
                httpOnly: false,      // allow frontend JS access
                secure: false,        // true only in HTTPS production
                sameSite: "lax"
            });

            const orderId = response.data.data.transactionId;
            // const orderId = "12345";
            console.log("orderIDs", orderId);

            // ✅ UPDATE ORDER IN DB
            // await Order.findOneAndUpdate(
            //     { transactionId: orderId },
            //     {
            //         status: "SUCCESS",
            //         paymentId: response.data.data.transactionId,
            //         paymentResponse: response.data
            //     },
            //     { new: true }
            // );
            const url = `https://foodportdelivery.netlify.app/ordersummary?orderId=${orderId}`
            return res.redirect(url)
        } else {
            // await Order.findOneAndUpdate(
            //     { transactionId: merchantTransactionId },
            //     { status: "FAILED" }
            // );
            const url = `https://foodportdelivery.netlify.app/failure`
            return res.redirect(url)
        }
    })
        .catch((error) => {
            console.error(error);
        });

})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
