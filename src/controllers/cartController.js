const Cart = require('../models/cart');
// Find cart

// If cart doesn't exist
//     create cart

// If item already exists
//     quantity++

// Else
//     push new item

// Save

// Return updated cart

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    items: []
                }
            });
        }

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const item = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // create cart
            cart = new Cart({
                userId,
                items: []
            });
        }

        const existingItem = cart.items.find(c => c.menuItemId === item.menuItemId);

        if (existingItem) { existingItem.quantity += 1 }
        else cart.items.push({
            ...item,
            quantity: 1
        });

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.removeItemFromCart = async (req, res) => {
    try {
        //     Find cart
        // Find item
        // quantity--
        // If quantity==0
        //     remove item
        // Save
        // Return updated cart

        const userId = req.user.id;
        const item = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }

        const itemFind = cart.items.find(x => x.menuItemId === item.menuItemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" })
        }

        itemFind.quantity -= 1;

        if (itemFind.quantity <= 0) {
            cart.items = cart.items.filter(x => x.menuItemId !== item.menuItemId);
        }

        await cart.save();

        res.json(cart)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }

        cart.items = [];

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}