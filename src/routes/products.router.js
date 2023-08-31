import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";
import Product from "../DAO/models/product.js";
import is_admin from "../middlewares/is_admin.js";

const router = Router();
const productManager = new ProductManager('./src/files/products.json');

// 💣 END POINTS PARA MONGO DB

//GET /api/products debe indexarse title para poder filtrar y debe paginarse de a 6 productos
router.get('/', async (req, res) => {
  try {
    const titleFilter = req.query.title;
    const page = parseInt(req.query.page) || 1; 
    const perPage = 6;
    const query = {};

    if (titleFilter) {
      query.title = new RegExp(titleFilter, 'i');
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / perPage);
    const products = await Product.find(query)
      .skip((page - 1) * perPage).limit(perPage);

    res.json({
      status: 'success',
      products,
      page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting products' });
  }
});
//GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    } else {
      res.json({ status: 'success', product });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting product' });
  }
});
//POST /api/products
router.post('/', is_admin, async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await Product.create(productData);
    
    res.json({ status: 'success', product: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error creating product' });
  }
});
//UPDATE /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
    
    if (!updatedProduct) {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    } else {
      res.json({ status: 'success', product: updatedProduct });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error updating product' });
  }
});
//DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    } else {
      res.json({ status: 'success', message: 'Product deleted' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error deleting product' });
  }
});

// 💣 END POINTS PARA FILE SYSTEM

//RUTA RAIZ GET TRAE TODOS LOS PRODUCTOS DEL ARREGLO
router.get('/', async(req, res) => {
    const products = await productManager.getProducts();
    res.send({ status: 'success', products});
});
//TRAE UN PRODUCTO SELECCIONADO POR ID DEL ARREGLO
router.get('/:pid', async (req, res) => {
    try {
      const productid = Number(req.params.pid);
      const product = await productManager.getProductById(productid);
      res.send({ status: 'success', product });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  });
//RUTA RAIZ POST AGREGA UN NUEVO PRODUCTO AL ARREGLO
router.post('/', async(req, res) => {
    try{
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res.send({ status: 'success', product: newProduct});
    } catch (error){
      res.status(400).send({ status: 'error', message: error.message });
    }
});
//SELECCIONA UN PRODUCTO DEL ARREGLO POR ID Y LO ACTUALIZA
router.put('/:pid', async (req, res) => {
    try {
      const productId = Number(req.params.pid);
      const updatedFields = req.body; 
      const updatedProduct = await productManager.updateProduct(productId, updatedFields);
  
      if (!updatedProduct) {
        res.status(400).send({ status: 'error', message: error.message });
      } else {
        res.send({ status: 'success', product: updatedProduct });
      }
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  });
//SELECCIONA UN PRODUCTO DEL ARREGLO POR ID Y LO ELIMINA
  router.delete('/:pid', async(req, res) => {
    try{
    const productid = Number(req.params.pid);
    await productManager.deleteProductById(productid);
    res.send({ status: 'success', message: "Product deleted successfully."});
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  });

  export default router;