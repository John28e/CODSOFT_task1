import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      enum: {
        values: ['Tops', 'Bottoms', 'Dresses', 'Accessories'],
        message: '{VALUE} is not a valid category',
      },
    },
    sizes: {
      type: [String],
      required: [true, 'Please add available sizes'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image URL'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
