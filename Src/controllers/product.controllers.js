import productModels from "../models/product.models.js"; // Adjust the path based on your project structure
import UserModel from "../models/user.models.js"; // Adjust the path based on your user schema
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
    cloud_name:"dwuc4qz3n" ,
    api_key:"237728971423496" ,
    api_secret: "8Q6ZLV2ouehlYs67BTGq86l2R98",
});

// Helper function to upload images to Cloudinary
const uploadImageToCloudinary = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto", // Automatically detect file type
    });
    fs.unlinkSync(localpath); // Delete the local file after upload
    return uploadResult.url; // Return the Cloudinary URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const {
    name,
    description,
    price,
    orignalPrice,
    discount,
    tags,
    sizes,
    stock,
    color,
    autorId,
  } = req.body;

  if (!name || !description || !price || !stock || !autorId) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

//   if (!req.file || !req.file.path) {
//     return res.status(400).json({ message: "No image file uploaded" });
//   }

  try {
    // const imageUrl = await uploadImageToCloudinary(req.file.path);
    // if (!imageUrl) {
    //   return res.status(500).json({ message: "Image upload failed" });
    // }

    // Check if the user exists
    const user = await UserModel.findById(autorId);
    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Create the post
    const newPost = new productModels({
      name,
      description,
      price,
      orignalPrice,
      discount,
      tags,
      sizes,
      stock,
      color,
    //   images: imageUrl,
      autorId,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all posts with pagination
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const Products = await productModels.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalproducts = await productModels.countDocuments();
    res.status(200).json({
      Products,
      totalproducts,
      currentPage: page,
      totalPages: Math.ceil(totalproducts / limit),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a post by ID
export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const Product = await productModels.findById(id);
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(Product);
  } catch (error) {
    console.error("Error fetching Product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a post by ID
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, orignalPrice, discount, tags, sizes, stock, color } = req.body;

  try {
    const product = await productModels.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    // Update the fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (orignalPrice) product.orignalPrice = orignalPrice;
    if (discount) product.discount = discount;
    if (tags) product.tags = tags;
    if (sizes) product.sizes = sizes;
    if (stock) product.stock = stock;
    if (color) product.color = color;

    // If a new image is uploaded, update it
    if (req.file && req.file.path) {
      const imageUrl = await uploadImageToCloudinary(req.file.path);
      if (!imageUrl) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      product.images = imageUrl;
    }

    await product.save();
    res.status(200).json({ message: "product updated successfully", product });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModels.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
