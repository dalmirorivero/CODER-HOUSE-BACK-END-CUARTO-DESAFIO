import { Router } from "express";
import Product from "../DAO/models/product.js";
import Cart from "../DAO/models/cart.js";

const router = Router();

//GET /products debe incluir un input de tipo texto para el filtro por letra/silaba/palabra
router.get('/products', async (req, res) => {
    try {
        const { filter, page = 1, limit = 6 } = req.query;
        const perPage = parseInt(limit);
        const currentPage = parseInt(page);

        let query = {};

        if (filter) {
            query.title = new RegExp(filter, 'i');
        }

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);
        const products = await Product.find(query).skip((currentPage - 1) * perPage).limit(perPage).lean();

        res.render('products', {
            products: products,
            filter: filter,
            currentPage: currentPage,
            totalPages: totalPages,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error getting products' });
    }
});
//GET / para la pagina de inicio
router.get('/', (req, res) => {
    res.render('home'); 
});
//GET /new_product para el formulario de creacion de un nuevo producto
router.get('/new_product', (req, res) => {
  res.render('newproduct'); 
});
//GET /products/:id para la pagina de detalle del producto
router.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await Product.findById(productId).lean();
      if (product) {
          res.render('productdetail', { product }); 
      } else {
          res.status(404).json({ status: 'error', message: 'Product not found' });
      }
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error getting product details' });
  }
});
//GET /carts debe incluir el monto total a pagar
router.get('/carts', async (req, res) => {
  try {
    const firstCart = await Cart.findOne().populate({
        path: 'products.product',
        model: Product,
      }).lean();
      
      if (firstCart) {
        let totalPrice = 0;
        firstCart.products.forEach(cartProduct => {
            totalPrice += cartProduct.product.price * cartProduct.quantity;
        });

        res.render('cart', { cart: firstCart, totalPrice });
      } else {
          res.status(404).json({ status: 'error', message: 'Cart not found' });
      }
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error getting cart info' });
  }
});

  export default router;