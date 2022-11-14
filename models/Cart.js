const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        products: [
            {
                productId:{
                    type: String
                },
                quantity:{
                    type:Number,
                    default: 1
                }
            }
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.model("Cart", CartSchema)