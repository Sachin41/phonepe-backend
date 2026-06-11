const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use("/api/payment", paymentRoutes);

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("Server Running");
});

module.exports = app;