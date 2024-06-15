import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import handlebars from 'express-handlebars';
import showProducts from './routes/viewsRouter.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import productos from './produtos/products.json' assert { type: 'json' };
const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))
const socketServer = new Server(server) 
socketServer.on('connection', (socketClient) => {
    console.log('cliente connected')
    socketServer.emit('products', productos)
    


})

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.get('/', (req,res) => {
    res.render('home');
});

app.use(express.static('./src/public'))


app.use(express.json());
app.use('/api/products', productsRouter); 
app.use('/api/cart', cartRouter); 
app.use('/', showProducts);
