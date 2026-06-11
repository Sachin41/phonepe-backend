// src/routes/paymentRoutes.js

const express = require("express");

const {
  createOrder,
  checkStatus,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/order", createOrder);

router.post("/status", checkStatus);

module.exports = router;