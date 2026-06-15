const express = require("express");
const router = express.Router();
const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getOrders,
} = require("../controllers/orderController");

router.get(
  "/",
  authMiddleware,
  getOrders
);

module.exports = router;