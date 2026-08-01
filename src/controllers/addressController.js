const Address = require("../models/address");

exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        let addresses = await Address.findOne({ userId });

        if (!addresses) {
            return res.status(404).json({
                success: false,
                message: "No address added for the user"
            })
        }

        res.status(200).json({
            success: true,
            addresses
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const newAddress = req.body;

        let user = await Address.findOne({ userId });
        if (!user) {
            user = new Address({
                userId,
                addresses: []
            })
        }
        if (newAddress.isDefault) {
            user.addresses.map(addr => addr.isDefault = false)
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(200).json({
            success: true,
            messages: "Address added successfully",
            addresses: user.addresses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;

        const user = await Address.findOne({ userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                status: false,
                message: "Address not found"
            })
        }

        // user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId.toString());
        address.deleteOne()
        await user.save();

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

exports.updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        const request = req.body;

        const user = await Address.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User Not found"
            })
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({
                status: false,
                message: "Address not found for updation"
            })
        }

        if (request.isDefault) user.addresses.map(addr => addr.isDefault = false);

        Object.assign(address, request)
        await user.save();

        res.status(200).json({
            status: true,
            addresses: user.addresses,
            message: "Address updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}