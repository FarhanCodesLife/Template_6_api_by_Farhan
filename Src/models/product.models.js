import mongoose from "mongoose";

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
    },
    colors: {
      type: [String],
      default: [],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the User model is in your project
      required: true,
    },
    images: {
      type: String, // URL of the image stored on Cloudinary
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create and export the Product model
const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
