import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const productManager = new ProductManager('./src/files/products.json');

router.get('/', async(req, res) =>{
    const products = await productManager.getProducts();
    res.render('index', {products});
});

router.get('/realtimeproducts', async(req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

router.post('/realtimeproducts', async(req, res) => {
    const product = {
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        category: req.body.category
    };
    try {
    await productManager.addProduct(product);
    res.redirect('/realtimeproducts');
    } catch (error) {
    console.error(error);
    res.status(500).send('Error creating product');
    }
});

export default router;