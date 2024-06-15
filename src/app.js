import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import handlebars from 'express-handlebars';
import showProducts from './routes/viewsRouter.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import fs from 'fs'

import productos from './produtos/products.json' assert { type: 'json' };
const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))
const socketServer = new Server(server);

socketServer.on('connection', (socketClient) => {
    console.log('cliente connected');
    socketServer.emit('products', productos);

    socketClient.on('deleteProduct', (data) => {
        const index = productos.findIndex(product => product.id === data);
        
        const filePath = './src/produtos/products.json';
        if (index !== -1) {
            productos.splice(index, 1);
            fs.writeFile(filePath, JSON.stringify(productos, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                } else {
                    console.log('Producto eliminado correctamente');
                    socketServer.emit('products', productos);
                }
            });
        } else {
            console.error('Producto no encontrado');
        }
    });

    socketClient.on('addProduct', (data) => {
        const newProduct = {
            id: productos.length ? productos[productos.length - 1].id + 1 : 1,
            ...data
        };
        productos.push(newProduct);
        
        const filePath = './src/produtos/products.json';
        fs.writeFile(filePath, JSON.stringify(productos, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo JSON:', err);
            } else {
                console.log('Producto agregado correctamente');
                socketServer.emit('products', productos);
            }
        });
    });
});

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.use(express.static('./src/public'));

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/', showProducts);
