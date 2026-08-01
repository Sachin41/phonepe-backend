const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { addItemToCart, removeItemFromCart, getCart, clearCart } = require("../controllers/cartController");


router.get("/", authMiddleware, getCart);

router.post("/addItem", authMiddleware, addItemToCart);

router.patch("/removeItem", authMiddleware, removeItemFromCart);

router.delete("/clear", authMiddleware, clearCart);


module.exports = router;