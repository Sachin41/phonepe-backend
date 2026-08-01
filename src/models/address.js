const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
            unique: true
        },
        addresses:[
            {
                addressType:{
                    type: String,
                    enum:['Home', 'Work', 'Other'],
                    default: 'Home'
                },
                fullName:{
                    type: String,
                    require: true
                },
                phone:{
                    type: String,
                    require: true
                },
                houseNo:{
                    type: String,
                    require: true
                },
                street:{
                    type: String,
                    require: true
                },
                landmark:{
                    type: String
                },
                city:{
                    type: String,
                    require: true
                },
                state:{
                    type: String,
                    require: true
                },
                pincode:{
                    type: String,
                    require: true
                },
                isDefault:{
                    type: Boolean,
                    default: false
                }
                
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Address', addressSchema);