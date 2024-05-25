import { Router, json } from "express";
import productos from "../produtos/products.json" with { type: "json" };
const router = Router();
import fs, { stat } from 'fs';
//FUNCIONES

router.post('/newProduct', (req,res) => {
    class productManager {
        constructor() {
            this.path = './src/produtos/products.json';
            this.init();

        }
        async init() {
            if (fs.existsSync(this.path)) {
                console.log("El archivo de productos existe");
            }else{
                await fs.promises.writeFile(this.path, JSON.stringify([]))
            }
        }
        async createProduct({ title, description, code, price, status, stock, category, thumbnails }) {
            const newProduct = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            };
        
            let fileData;
            try {
                fileData = await fs.promises.readFile(this.path, 'utf-8');
            } catch (error) {
                console.error("Error al leer el archivo de productos:", error);
                return;
            }
        
            let productsActual;
            try {
                productsActual = JSON.parse(fileData);
            } catch (error) {
                console.error("Error al analizar JSON del archivo de productos:", error);
                productsActual = [];
            }
        
            if (productsActual.length === 0) {
                newProduct.id = 1;
            } else {
                newProduct.id = productsActual[productsActual.length - 1].id + 1;
            }
        
            productsActual.push(newProduct);
            fs.writeFileSync(this.path, JSON.stringify(productsActual));
        }
    }               
    async function context() {
        const cuerpoRaw = req.body
        const manager = new productManager;
        await manager.createProduct({
            title: cuerpoRaw.title,
            description: cuerpoRaw.description,
            code: parseInt(cuerpoRaw.code),
            price: parseInt(cuerpoRaw.price),
            status: cuerpoRaw.status,
            stock: parseInt(cuerpoRaw.stock),
            category: cuerpoRaw.category,
            thumbnails: cuerpoRaw.thumbnails
        })
    }

    context();
});
router.post('/updateProduct/:pid', (req, res) => {
    class ProductManager {
        constructor() {
            this.path = './src/produtos/products.json';
            this.init();
        }
        
        async init() {
            if (fs.existsSync(this.path)) {
                console.log("El archivo de productos existe");
            } else {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
            }
        }

        async updateProduct(productId, updatedProductData) {
            // Lista de campos que pueden ser actualizados
            const allowedFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

            let fileData;
            try {
                fileData = await fs.promises.readFile(this.path, 'utf-8');
            } catch (error) {
                console.error("Error al leer el archivo de productos:", error);
                return false; // Indica que la operación de actualización falló
            }
        
            let productsActual;
            try {
                productsActual = JSON.parse(fileData);
            } catch (error) {
                console.error("Error al analizar JSON del archivo de productos:", error);
                productsActual = [];
            }

            const index = productsActual.findIndex(product => product.id === parseInt(productId));
            if (index !== -1) {
                // Actualiza solo los campos permitidos
                for (const field in updatedProductData) {
                    if (allowedFields.includes(field)) {
                        productsActual[index][field] = updatedProductData[field];
                    }
                }
                fs.writeFileSync(this.path, JSON.stringify(productsActual));
                return true; // Indica que la operación de actualización fue exitosa
            }
            return false; // Indica que el producto no fue encontrado
        }
    }

    async function context() {
        const productIdToUpdate = req.params.pid; // Obtener el ID del producto a actualizar de los parámetros de la ruta
        if (!productIdToUpdate) {
            res.status(400).send('El ID del producto a actualizar no se proporcionó');
            return;
        }

        const updatedProductData = req.body; // Obtener los datos actualizados del producto del cuerpo de la solicitud
        if (Object.keys(updatedProductData).length === 0) {
            res.status(400).send('Los datos actualizados del producto no se proporcionaron correctamente');
            return;
        }

        const manager = new ProductManager();
        const productUpdated = await manager.updateProduct(productIdToUpdate, updatedProductData);
        if (productUpdated) {
            res.status(200).send('Producto actualizado correctamente');
        } else {
            res.status(404).send('No se encontró ningún producto con el ID proporcionado');
        }
    }

    context();
});


router.delete('/deleteProduct/:pid', (req, res) => {
    class ProductManager {
        constructor() {
            this.path = './src/produtos/products.json';
            this.init();
        }
        
        async init() {
            if (fs.existsSync(this.path)) {
                console.log("El archivo de productos existe");
            } else {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
            }
        }

        async deleteProduct(productId) {
            let fileData;
            try {
                fileData = await fs.promises.readFile(this.path, 'utf-8');
            } catch (error) {
                console.error("Error al leer el archivo de productos:", error);
                return;
            }
        
            let productsActual;
            try {
                productsActual = JSON.parse(fileData);
            } catch (error) {
                console.error("Error al analizar JSON del archivo de productos:", error);
                productsActual = [];
            }

            const index = productsActual.findIndex(product => product.id === parseInt(productId));
            if (index !== -1) {
                productsActual.splice(index, 1); // Elimina el producto del array
                fs.writeFileSync(this.path, JSON.stringify(productsActual));
                return true; // Indica que el producto fue eliminado con éxito
            }
            return false; // Indica que el producto no fue encontrado
        }
    }

    async function context() {
        const productIdToDelete = req.params.pid; // Obtener el ID del producto a eliminar de los parámetros de la ruta
        if (!productIdToDelete) {
            res.status(400).send('El ID del producto a eliminar no se proporcionó');
            return;
        }

        const manager = new ProductManager();
        const productDeleted = await manager.deleteProduct(productIdToDelete);
        if (productDeleted) {
            res.status(200).send(`El producto con la ID N° ${productIdToDelete} ha sido eliminado correctamente!`);
        } else {
            res.status(404).send(`El producto con la ID N° ${productIdToDelete} no existe intenta nuevamente mas tarde o busca otro producto para eliminar`);
        }
    }

    context();
});





router.get('/:pid', (req,res) => {
    const pid = req.params.pid;
    if(pid){
        const productId = parseInt(pid)
        const product = productos.find(p => p.id === productId)
        if(!product){
            return res.status(404).send(`El producto con la ID N° ${productId} no existe intenta nuevamente mas tarde o busca otro producto. `);
        }else{
            res.send(product)
        }
        
    }else{
        return res.status(404).send('No proporcionaste un ID');

    }
});
router.get('/', (req, res) => {
    try {
        let productsData = fs.readFileSync('./src/produtos/products.json', 'utf-8');
        let products = JSON.parse(productsData);

        // Obtener el parámetro de consulta "limit"
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

        if (limit) {
            // Si se proporciona un límite, devolver solo los primeros "limit" productos
            products = products.slice(0, limit);
            res.json(products);
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router