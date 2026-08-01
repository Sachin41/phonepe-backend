const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { getAddresses, addAddress, deleteAddress, updateAddress } = require('../controllers/addressController');

router.get("/", authMiddleware, getAddresses);

router.post('/addAddress', authMiddleware, addAddress);

router.put('/updateAddress/:addressId', authMiddleware, updateAddress);

router.delete('/deleteAddress/:addressId', authMiddleware, deleteAddress);

module.exports = router;