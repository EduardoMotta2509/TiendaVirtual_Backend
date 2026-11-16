const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true },
  images: [{ type: String }], // Enlaces directos a fotos del repositorio GitHub
  // Atributos flexibles permitiendo que una camisa tenga {"talla", "color", "manga"} 
  // y un pantalón tenga {"talla", "corte", "material", "elastano"} sin alterar esquemas rígidos.
  attributes: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);