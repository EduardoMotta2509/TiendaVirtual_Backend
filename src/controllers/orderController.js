const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    let totalAmount = 0;

    // Validar stock y calcular total, actualizando el inventario transaccionalmente
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.product} no encontrado.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para el producto: ${product.name}. Stock actual: ${product.stock}` });
      }
      
      item.price = product.price;
      totalAmount += product.price * item.quantity;

      // Descontar stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: 'completed'
    });

    await newOrder.save();
    res.status(201).json({ message: 'Orden creada exitosamente y stock actualizado', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada.' });
    }
    if (order.status === 'returned') {
      return res.status(400).json({ error: 'Esta orden ya fue devuelta anteriormente.' });
    }

    // Restaurar stock de los productos
    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'returned';
    await order.save();

    res.status(200).json({ message: 'Orden devuelta exitosamente y stock restaurado', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, returnOrder };