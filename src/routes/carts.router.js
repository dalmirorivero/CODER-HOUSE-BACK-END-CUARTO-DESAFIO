import { Router } from "express";
import CartManager from "../manager/CartManager.js";
import ProductManager from "../manager/ProductManager.js";
import Cart from "../DAO/models/cart.js";
import Product from "../DAO/models/product.js";

const router = Router();
const cartManager = new CartManager('./src/files/carts.json')
const productManager = new ProductManager('./src/files/products.json')

// 💣 END POINTS PARA MONGO DB

//GET /api/carts debe popularse y ordenarse por title de cada product:
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate({
        path: 'products.product',
        model: Product,
      }).exec();

      carts.forEach(cart => {
        cart.products.sort((productA, productB) => {
          const titleA = productA.product.title;
          const titleB = productB.product.title;
          return titleA.localeCompare(titleB);
        });
      });
        
    res.json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting carts' });
  }
});
//GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;       
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      res.status(404).json({ status: 'error', message: 'Cart not found' });
    } else {
      res.json({ status: 'success', cart });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting cart' });
  }
});
//POST /api/carts
router.post('/', async (req, res) => {
  try {
    const cartData = req.body;
    const newCart = await Cart.create(cartData);
    res.json({ status: 'success', cart: newCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error creating new cart' });
  }
});
//UPDATE /api/carts/:cid/product/:pid/:units
router.put('/:cid/product/:pid/:units', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const units = parseInt(req.params.units);
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(product => product.product == productId);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Product not found in the cart' });
    }

    cart.products[productIndex].quantity += units;
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating the cart' });
  }
});
//DELETE /api/carts/:cid/product/:pid/:units
router.delete('/:cid/product/:pid/:units', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const units = parseInt(req.params.units);
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(product => product.product == productId);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Product not found in the cart' });
    }

    cart.products[productIndex].quantity -= units;
    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating the cart' });
  }
});

// END POINTS PARA FILE SYSTEM

//RUTA RAIZ POST CREA UN NUEVO CARRITO
router.post('/', async (req, res) => {
  const cart = { products: [] }
  const result = await cartManager.saveCart(cart);
  res.send({ status: 'success', result });
});
//SELECCIONA UN CARRITO DEL ARREGLO POR ID Y DEVUELVE SU COTENIDO
router.get('/:cid', async (req, res) => {
  try {
    const cartid = Number(req.params.cid);
    const cart = await cartManager.getCartById(cartid);
    res.send({ status: 'success', cart });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message })
  }
});
//AGREGA UN PRODUCTO DEL ARREGLO SELECCIONA POR ID DENTRO DEL CARRITO SELECCIONADO POR ID
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      res.status(404).send({ status: 'error', message: 'Cart not found' });
      return;
    }

    const product = await productManager.getProductById(productId);

    if (!product) {
      res.status(404).send({ status: 'error', message: 'Product not found' });
      return;
    }

    const existingProductIndex = cart.products.findIndex((p) => p.id === productId);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    }
    else {
      cart.products.push({ id: productId, quantity: 1 });
    }

    await cartManager.updateCart(cartId, cart);

    res.send({ status: 'success', message: 'Product added to cart' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

export default router;