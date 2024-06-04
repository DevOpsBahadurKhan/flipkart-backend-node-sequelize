require('dotenv').config();
// Express framework for building APIs
const express = require('express');

// Cross-Origin Resource Sharing middleware for enabling CORS
const cors = require('cors');

// Path module for working with file and directory paths
const path = require('path');


const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');

const swaggerDocument = YAML.load(fs.readFileSync('./swagger.yaml', 'utf8'));

//Import Routes
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const addressRoutes = require('./routes/address');
const cartRoutes = require('./routes/cart');
const cartItemRoutes = require('./routes/cartItem');
const orderRoutes = require('./routes/order');
const OrderItemsRoute = require('./routes/orderItems');
const WishlistRoutes = require('./routes/wishlist');
const productReviewRoutes = require('./routes/productReview');
const ratingsRoutes = require('./routes/rating');
const commentsRoutes = require('./routes/comment');



const app = express();


// Define the port number to listen on
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
const passportJwt = require('./middleware/passportJWT')(); // Passport JWT middleware
const authRoute = require('./routes/auth'); // Authentication routes
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
const errorHandler = require('./middleware/errorHandler'); // Custom error handler middleware

// Add middleware to serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Mount routes
app.use(passportJwt.initialize()); // Initialize Passport JWT
app.use('/api/auth', authRoute); // Authentication routes
app.use('/api/address', addressRoutes); // Address routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/categories', categoryRoutes); // Category routes
app.use('/api/cart', cartRoutes); //cart route
app.use('/api/cartItem', cartItemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/orderItem', OrderItemsRoute);
app.use('/api/wishlist', WishlistRoutes);
app.use('/api/product_review', productReviewRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/comments', commentsRoutes);


// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Running...`));