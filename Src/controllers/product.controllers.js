import ProductModel from "../models/product.models.js"; // Adjust the path based on your project structure
import UserModel from "../models/user.models.js"; // Adjust the path based on your user schema
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dwuc4qz3n",
  api_key: "237728971423496",
  api_secret: "8Q6ZLV2ouehlYs67BTGq86l2R98",
});

// Helper function to upload images to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "image" });
    fs.unlinkSync(filePath); // Remove the local file after upload
    return result.secure_url; // Return the uploaded image URL
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

// Create a new product
export const createPost = async (req, res) => {
    const { name, description, originalPrice, discount, tags, sizes, stock, colors, authorId } = req.body;
  
    if (!name || !description  || !stock || !authorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      // Upload image if provided
      let imageUrl = null;
      if (req.file?.path) {
        imageUrl = await uploadToCloudinary(req.file.path);
      }
  
      // Process tags and sizes as arrays
      let tagsArray = [];
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map((tag) => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
  
      let sizesArray = [];
      if (typeof sizes === "string") {
        sizesArray = sizes.split(",").map((size) => size.trim());
      } else if (Array.isArray(sizes)) {
        sizesArray = sizes;
      }



      let colorArray = [];
      if (typeof colors === "string") {
        colorArray = colors.split(",").map((color) => color.trim());
      } else if (Array.isArray(colors)) {
        colorArray = colors;
      }
  
      // Validate author existence
      const user = await UserModel.findById(authorId);
      if (!user) {
        return res.status(404).json({ message: "Author not found" });
      }
let price = originalPrice
      if(originalPrice && discount){
        price = originalPrice - (originalPrice * discount / 100);
      }
  
      // Create and save the product
      const newProduct = new ProductModel({
        name,
        description,
        price,
        originalPrice,
        discount,
        tags: tagsArray,
        sizes: sizesArray,
        stock,
        colors:colorArray,
        authorId,
        images: imageUrl,
      });
  
      await newProduct.save();
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Fetch all products with pagination
export const getAllPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const products = await ProductModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await ProductModel.countDocuments();

    res.status(200).json({
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch a single product by ID
export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing product
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If a new image is provided, update it
    if (req.file?.path) {
      const newImageUrl = await uploadToCloudinary(req.file.path);
      updates.images = newImageUrl;
    }

    if (updates.sizes) {
      updates.sizes = Array.isArray(updates.sizes) ? updates.sizes : [updates.sizes]; // Ensure it's an array
    }

    Object.assign(product, updates);
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
