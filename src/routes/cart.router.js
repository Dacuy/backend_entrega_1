import { Router, json } from "express";
import carritos from "../produtos/carts.json" with { type: "json" };
import productos from "../produtos/products.json" with { type: "json" };
const router = Router();
import fs from 'fs';


//Ruta Post para crear un carrito
router.post('/', (req,res) => {
    class cartManager {
        constructor() {
            this.path = './src/produtos/carts.json';
            this.init();

        }
        async init() {
            if (fs.existsSync(this.path)) {
                console.log("El archivo de carts existe");
            }else{
                await fs.promises.writeFile(this.path, JSON.stringify([]))
            }
        }
        async createCart({ products }) {
            const newCart = {
                products
            };
        
            let fileData;
            try {
                fileData = await fs.promises.readFile(this.path, 'utf-8');
            } catch (error) {
                console.error("Error al leer el archivo de carritos:", error);
                return;
            }
        
            let carritosActuales;
            try {
                carritosActuales = JSON.parse(fileData);
            } catch (error) {
                console.error("Error al analizar JSON del archivo de carritos:", error);
                carritosActuales = [];
            }
        
            if (carritosActuales.length === 0) {
                newCart.id = 1;
            } else {
                newCart.id = carritosActuales[carritosActuales.length - 1].id + 1;
            }
        
            carritosActuales.push(newCart);
            fs.writeFileSync(this.path, JSON.stringify(carritosActuales));
        }
    }               
    async function context() {
        const manager = new cartManager;
        await manager.createCart({
            products: []
        })
    }

    context();
});


//Ruta :cid para ver el contenido de un carrito con id Xssssss
router.get('/:cid', (req,res) => {
   const cartId = req.params.cid;
   const idDelCarrito = parseInt(cartId);
   if(idDelCarrito){
    const cart = carritos.find(u => u.id === idDelCarrito)
    if(cart){
        res.send(cart)
    }else{
        res.status(404).send("Ese carrito no existe")
    }
   }else{
    res.status(404).send("Proporciona un id para buscar un carrito")
   }
});
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        // Leer los datos del archivo de carritos
        let fileData = await fs.promises.readFile('./src/produtos/carts.json', 'utf-8');
        let carritosActuales = JSON.parse(fileData);
        
        const idDelCarrito = parseInt(req.params.cid);
        const idDelProducto = parseInt(req.params.pid);
        
        // Buscar el carrito y el producto correspondientes
        const carrito = carritosActuales.find(c => c.id === idDelCarrito);
        const producto = productos.find(p => p.id === idDelProducto);
        
        if (!carrito) {
            return res.status(404).send('Carrito no encontrado');
        }
        
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        
        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = carrito.products.findIndex(p => p.id === idDelProducto);
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar su cantidad en 1
            carrito.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo con una cantidad de 1
            carrito.products.push({
                id: idDelProducto,
                quantity: 1
            });
        }
        
        // Escribir los datos actualizados en el archivo
        await fs.promises.writeFile('./src/produtos/carts.json', JSON.stringify(carritosActuales));
        
        res.status(200).send('Producto agregado al carrito correctamente');
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send('Error interno del servidor');
    }
});




export default router;