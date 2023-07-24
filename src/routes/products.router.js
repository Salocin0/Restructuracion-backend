import express from "express";
import {productService} from "../services/products.service.js";
export const routerProductos = express.Router();

routerProductos.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const query = req.query.query;
    const sort = req.query.sort;
    const requestUrl = req.originalUrl;
    const products = await productService.getAllProducts(limit,page,query,sort);
    const previusLink = await productService.getPrevLink(requestUrl,page,products.hasPrevPage)
    const postLink = await productService.getNextLink(requestUrl,page,products.hasNextPage)
    if(products){
      return res.status(200).json({
        status: "sucess",
        msg: "Found productos",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage:products.prevPage,
        nextPage:products.nextPage,
        page:products.page,
        hasPrevPage:products.hasPrevPage,
        hasNextPage:products.hasNextPage,
        prevLink: previusLink,
        nextLink: postLink
      })
    }else{
      return res.status(404).json({
        status: "Error",
        msg: "Products not found",
        data: {},
      })
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});
  
routerProductos.get('/:id', async(req, res) => {
  try {
    const product = await productService.getProduct(req.params.id)
    if (typeof product !== {}) {
      return res.status(200).json({
        status: "sucess",
        msg: "product found",
        data: product,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Cart with id " + req.params.id + " not found",
        data: {},
      })
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});


routerProductos.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    return res.status(200).json({
      status: 'success',
      msg: 'product deleted',
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerProductos.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const productUptaded = await productService.updateProduct(id, title, description, code, price, status, stock, category, thumbnails);
    return res.status(201).json({
      status: 'success',
      msg: 'user uptaded',
      data: productUptaded,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  } 
});

routerProductos.post("/", async (req, res) => {
  try {
    const { title,description,code,price,status= true,stock,category, thumbnails } = req.body;
    const products = await productService.getAllProducts();
    let existcode = products.docs.find(p => p.code === code);
    if(existcode){
      return res.status(400).json({
        status: 'error',
        msg: 'code used',
        data: {},
      });
    }else{
      const ProductCreated = await productService.createProduct(title,description,code,price,status,stock,category, thumbnails);
      return res.status(201).json({
        status: 'success',
        msg: 'product created',
        data: ProductCreated,
      });
    }
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});