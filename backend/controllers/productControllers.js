const productModel = require('../models/productModel');

// Get Product API - /api/v1/products
exports.getProducts = async (req, res, next) => {
    try {
        // Construct query object for searching
        const query = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i' // case insensitive
            }
        } : {};       

        // Find products based on the query
        const products = await productModel.find(query);        

        // Respond with the found products
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

// Get single Product API - /api/v1/product/:id
exports.getSingleProducts = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Unable to get product with ID: ' + req.params.id + ' - ' + error.message
        });
    }
};
