import { Router } from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import mongoRouter from './mongo.router.js';

const router = Router();

router.use('/products', productsRouter);       
router.use('/carts', cartsRouter);       
router.use('/', mongoRouter);      

export default router;