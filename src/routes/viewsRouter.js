import { Router, json } from "express";
import carritos from "../produtos/carts.json" with { type: "json" };
import productos from "../produtos/products.json" with { type: "json" };
const router = Router();
import fs from 'fs';

router.get('/productos', (req, res) => {
    res.render('index', {
        productos: productos,
        css: 'index'
    });
});

router.get('/realtimeproducts', (req,res) => {

    res.render('realTime', )
});




export default router;