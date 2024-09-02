const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

// Create Order - /api/v1/order
exports.creatOrder = async (req, res, next) => {
    try {
        const cartItems = req.body;
        
        // Calculate the total amount
        const amount = Number(cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)).toFixed(2);
        
        const status = 'pending';
        
        // Create order
        const order = await orderModel.create({ cartItems, amount, status });
        
        // Updating product stock
        const updateStockPromises = cartItems.map(async (item) => {
            const product = await productModel.findById(item.product._id);
            if (product) {
                product.stock = product.stock - item.qty;
                await product.save();
            }
        });

        // Wait for all stock updates to complete
        await Promise.all(updateStockPromises);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again later.'
        });
    }
};
