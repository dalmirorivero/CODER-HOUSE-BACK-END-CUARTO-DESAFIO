import { Router } from "express";
import CartManager from "../manager/CartManager.js";
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const cartManager = new CartManager('./src/files/carts.json')
const productManager = new ProductManager('./src/files/products.json')

// RUTA RAIZ POST CREA UN NUEVO CARRITO
router.post('/', async (req, res) => {
  const cart = { products: [] }
  const result = await cartManager.saveCart(cart);
  res.send({ status: 'success', result });
});

// SELECCIONA UN CARRITO DEL ARREGLO POR ID Y DEVUELVE SU COTENIDO
router.get('/:cid', async (req, res) => {
  try {
    const cartid = Number(req.params.cid);
    const cart = await cartManager.getCartById(cartid);
    res.send({ status: 'success', cart });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message })
  }
});

// AGREGA UN PRODUCTO DEL ARREGLO SELECCIONA POR ID DENTRO DEL CARRITO SELECCIONADO POR ID
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