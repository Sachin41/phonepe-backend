// src/controllers/paymentController.js

const paymentService = require("../services/paymentService");

exports.createOrder = async (req, res) => {
  try {
    const result = await paymentService.createPhonePeOrder(req.body);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    await paymentService.verifyPayment(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};