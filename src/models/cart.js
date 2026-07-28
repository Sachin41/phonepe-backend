// models/cartModel.js

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    
    items: [
        {
            restaurantId: String,
            menuItemId: String,
            name: String,
            image: String,
            category: String,
            description: String,
            price: Number,
            quantity: Number
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);