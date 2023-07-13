import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const productManager = new ProductManager('./src/files/products.json');

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

// RUTA RAIZ POST AGREGA UN NUEVO PRODUCTO AL ARREGLO
router.post('/', async(req, res) => {
    try{
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res.send({ status: 'success', product: newProduct});
    } catch (error){
      res.status(400).send({ status: 'error', message: error.message });
    }
});

// SELECCIONA UN PRODUCTO DEL ARREGLO POR ID Y LO ACTUALIZA
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

// SELECCIONA UN PRODUCTO DEL ARREGLO POR ID Y LO ELIMINA
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