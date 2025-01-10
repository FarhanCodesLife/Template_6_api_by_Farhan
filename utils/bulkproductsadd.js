import ProductModel from "../Src/models/product.models.js";
import userModels from "../Src/models/user.models.js";

// Function to bulk insert products
export const bulkInsertProducts = async (productsArray) => {
  try {
    for (const product of productsArray) {
      const {
        name,
        description,
        originalPrice,
        discount,
        tags,
        sizes,
        stock,
        colors,
        authorId,
        images,
      } = product;

      // Ensure required fields are present
      if (!name || !description || !stock || !authorId) {
        console.error(`Missing required fields for product: ${name}`);
        continue; // Skip this product and move to the next
      }

      // Validate author existence
      const user = await userModels.findById(authorId);
      if (!user) {
        console.error(`Author not found for product: ${name}`);
        continue; // Skip this product
      }

      // Process tags, sizes, and colors
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim());
      const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",").map((size) => size.trim());
      const colorsArray = Array.isArray(colors) ? colors : colors.split(",").map((color) => color.trim());

      // Calculate price after discount
      const price =
        originalPrice && discount ? originalPrice - (originalPrice * discount) / 100 : originalPrice;

      // Create a new product instance
      const newProduct = new ProductModel({
        name,
        description,
        price,
        originalPrice,
        discount,
        tags: tagsArray,
        sizes: sizesArray,
        stock,
        colors: colorsArray,
        authorId,
        images,
      });

      // Save the product to the database
      await newProduct.save();
      console.log(`Product added successfully: ${name}`);
    }

    console.log("All products have been processed.");
  } catch (error) {
    console.error("Error during bulk product insertion:", error);
  }
};
