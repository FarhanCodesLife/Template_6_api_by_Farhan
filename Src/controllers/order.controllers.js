// import orderModels from "../models/order.models.js";
// import productModels from "../models/product.models.js";
// import userModels from "../models/user.models.js";
// import { ShipEngine } from 'shipengine';

// const SHIPENGINE_API_KEY = "TEST_SAJ8va3Kv03iRq2vpAQIrKX2h28JdhNj39RaFYuC8BY"; // Replace with your ShipEngine API key

// // Configure ShipEngine SDK
// const shipEngineClient = new ShipEngine({
//     apiKey: SHIPENGINE_API_KEY,
//     retries: 2,          // Number of retries before giving up
//     timeout: 60000,      // 60 seconds timeout
//     pageSize: 50,        // Number of items per request
//     baseURL: "https://api.shipengine.com", // ShipEngine API URL
// });

// // Create an order
// export const orderPost = async (req, res) => {
//     const { autorId, arrayofPoducts, shippingAddress } = req.body;

//     try {
//         // Validate required fields
//         if (!autorId || !arrayofPoducts || !Array.isArray(arrayofPoducts) || arrayofPoducts.length === 0) {
//             return res.status(400).json({ message: "Invalid input: autorId, arrayofPoducts, and shippingAddress are required." });
//         }

//         if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
//             return res.status(400).json({ message: "Invalid shipping address." });
//         }

//         // Fetch user
//         const user = await userModels.findById(autorId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Fetch all product details in one query
//         const productIds = arrayofPoducts.map((product) => product.productId);
//         const posts = await productModels.find({ _id: { $in: productIds } });

//         if (posts.length !== productIds.length) {
//             return res.status(404).json({ message: "Some products were not found." });
//         }

//         // Prepare items and calculate total amount
//         const items = [];
//         let totalAmount = 0;

//         for (const product of arrayofPoducts) {
//             const post = posts.find((p) => p._id.toString() === product.productId);
//             const quantity = product.quantity || 1;

//             if (!post.price) {
//                 return res.status(400).json({ message: `Product ${post.name} does not have a price.` });
//             }

//             totalAmount += post.price * quantity;

//             items.push({
//                 product: post._id,
//                 name: post.name,
//                 price: post.price,
//                 quantity,
//             });
//         }

//         // Create the order
//         const order = await orderModels.create({
//             user: user._id,
//             items,
//             totalAmount,
//             orderStatus: "Pending", // Default status
//             shippingAddress,
//         });

//         user.orders.push(order._id);
//         await user.save();

//         const shipmentDetails = {
//             service_code: 'usps_first_class_mail',
//             ship_to: mapAddress(shippingAddress), // Mapping address fields
//             ship_from: {
//                 name: 'Your Company Name',
//                 address_line1: '123 Business St',
//                 city_locality: 'Your City',
//                 state_province: 'Your State',
//                 postal_code: '12345',
//                 country_code: 'US'
//             },
//             packages: arrayofPoducts.map((product) => ({
//                 weight: {
//                     value: product.weight || 1, // Default weight if not provided
//                     unit: 'pound'
//                 },
//                 dimensions: {
//                     length: product.length || 10,
//                     width: product.width || 10,
//                     height: product.height || 10,
//                     unit: 'inch'
//                 },
//                 quantity: product.quantity || 1
//             }))
//         };

//         // Log shipment details for debugging
//         console.log("Shipment Details: ", shipmentDetails);

//         // Using ShipEngine's `createLabelFromShipmentDetails` method to create the label
//         const shipEngineResponse = await shipEngineClient.createLabelFromShipmentDetails(shipmentDetails);
        
//         // Extract shipping data from ShipEngine response
//         const shippingData = shipEngineResponse.data;

//         // Update the order with shipping data
//         order.shippingData = shippingData;
//         await order.save();

//         // Send success response
//         res.status(201).json({
//             message: "Order created successfully",
//             order,
//             shippingData,
//         });

//     } catch (error) {
//         console.error("Error creating order:", error.message);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

// // Map address data from the request body
// function mapAddress(address) {
//     return {
//         name: address.name,
//         address_line1: address.street,
//         address_line2: address.street2,
//         city_locality: address.city,
//         state_province: address.state,
//         postal_code: address.postalCode,
//         country_code: address.country,
//     };
// }

// // Get all orders
// export const allOrders = async (req, res) => {
//     try {
//         // Fetch all orders and populate user and products
//         const orders = await orderModels.find().populate("user").populate("items.product");

//         if (!orders || orders.length === 0) {
//             return res.status(404).json({ message: "No orders found." });
//         }

//         res.status(200).json({
//             orders,
//         });
//     } catch (error) {
//         console.error("Error fetching orders:", error.message);
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };
