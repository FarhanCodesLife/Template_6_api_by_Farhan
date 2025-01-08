import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
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
  orignalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String], // Array of strings
    default: [], // Default value is an empty array
  },
  sizes: {
    type: [String], // Array of enumerated strings
    default: [],
    enum: ["S", "M", "L", "XL", "XXL"],
  },
  images: {
    type: String, // Single image as a string
  },
  rating: {
    type: Number,
    default: 0, // Default rating is 0
    max: 5, // Maximum value is 5
  },
  stock: {
    type: Number,
    required: true,
  },
  color: {
    type: [String], // Array of enumerated strings
    default: [],
    enum: ["black", "blue", "green", "red", "yellow", "white"],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set current date
  },
  autorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a User
    ref: "User",
  },
});

export default mongoose.model("Post", postSchema);
