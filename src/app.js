// IMPORTACIONES
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import indexRouter from './routes/index.router.js';
import ProductManager from './manager/ProductManager.js';
import './config/database.js';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import 'dotenv/config.js';

// CONSTANTES
const productManager = new ProductManager('./src/files/products.json');
const app = express ();

const server = app.listen(process.env.PORT, () => {
        console.log('Server up and running 👾')});

const io = new Server (server);

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded ({extended: true}));
app.use(express.static((`${__dirname}/public`)));
app.use(expressSession({
    store: MongoStore.create({
        mongoUrl:process.env.DB,
        ttl: 60*60*24*7
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}));
    
// CONFIGURACION HANDLEBARS 
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// END POINTS         
app.use('/api', indexRouter);         
    
// CONFIGURACION SOCKET.IO
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
    } catch (error) {
    console.error(error);
    }
    });
});