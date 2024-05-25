import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});

app.use(express.json());
app.use('/api/products', productsRouter); // Corregido el prefijo de ruta
app.use('/api/cart', cartRouter); // Corregido el prefijo de ruta
