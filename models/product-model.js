const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  itemName: { type: String, required:true},
  category: { type: String, required:true},
  price:{ type: Number, required:true },  
  imageUrl: { type: String },  
  description: { type: String, required:true },
})



const Product = mongoose.model('Product', productSchema);

module.exports = Product;