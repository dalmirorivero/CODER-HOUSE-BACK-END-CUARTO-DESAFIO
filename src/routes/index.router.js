import { Router } from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import mongoRouter from './mongo.router.js';
import views from './views.router.js'
import sessionRouter from './sessions.router.js';
import authRouter from './auth.router.js'

const router = Router();

router.use('/products', productsRouter);       
router.use('/carts', cartsRouter);       
router.use('/', mongoRouter);     
router.use('/views', views);
// router.use('/sessions', sessionRouter);
router.use('/auth', authRouter);

export default router;