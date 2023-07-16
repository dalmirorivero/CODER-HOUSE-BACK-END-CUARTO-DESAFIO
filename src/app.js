// IMPORTACIONES
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './manager/ProductManager.js';
    
// CONSTANTES
const productManager = new ProductManager('./src/files/products.json');
const app = express ();
const server = app.listen(8080, () => console.log('Server up and running on port :8080 👾'));
const io = new Server (server);
    
// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded ({extended: true}));
app.use(express.static((`${__dirname}/public`)));
    
// CONFIGURACION HANDLEBARS 
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
    
// END POINTS
app.use('/', viewsRouter);                      
app.use('/api/products', productsRouter);       
app.use('/api/carts', cartsRouter);             
    
// CONFIGURACION SERVIDOR SOCKET.IO
io.on('connection', (socket) => {
console.log('New client connected.');
socket.on('addProduct', async (product) => {
try {
    await productManager.addProduct(product);
    io.emit('productCreated');
    } catch (error) {
    console.error(error);
    }
});
socket.on('deleteProduct', async(index) => {
console.log('Deleting product with ID:', index);
try{
    await productManager.deleteProductByIndex(index);
    io.emit('productDeleted');
    }catch(error){
    console.error(error);
    }
    });
});
