import express from "express";
import { productControler } from "../controllers/products.controller.js";
export const routerProductos = express.Router();

routerProductos.get('/', productControler.getAll());
  
routerProductos.get('/:id', productControler.getOne());

routerProductos.delete("/:id", productControler.delete());

routerProductos.put("/:id", productControler.update());

routerProductos.post("/", productControler.create());