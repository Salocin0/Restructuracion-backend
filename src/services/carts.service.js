import { model } from 'mongoose';
import { modelCart } from '../DAO/models/db/carts.model.db.js';
//import { modelCart } from '../DAO/models/mem/carts.model.mem.js';
import { modelProduct } from '../DAO/models/db/products.model.db.js';
import { ticketsModel } from '../DAO/models/mongoose/tickects.model.js';

class CartService {
  validateId(id) {
    if (!id) {
      console.log('validation error: please complete id.');
      throw 'VALDIATION ERROR';
    }
  }
  validateProduct(pid) {
    if (!pid) {
      console.log('validation error: please complete product id.');
      throw 'VALDIATION ERROR';
    }
  }

  async validateProductInCart(cid, pid) {
    this.validateId(cid);
    this.validateProduct(pid);
    const cart = await this.getCart(cid);
    if (!cart.products.find((p) => p.id._id.toString() === pid)) {
      console.log('Validation error: Product ID is not valid');
      throw 'VALIDATION ERROR';
    }
  }

  async getAllCarts() {
    const carts = await modelCart.getAllCarts();
    return carts;
  }

  async getCart(id) {
    this.validateId(id);
    const cart = await modelCart.getCart(id);
    return cart;
  }

  async createCart(userid) {
    let product = new Array();
    let cartCreated = null;
    if (userid) {
      cartCreated = await modelCart.createCart(product, userid);
    }
    return cartCreated;
  }

  async updateCart(id, products) {
    const cartCreated = await modelCart.updateCart(id, products);
    return cartCreated;
  }

  async updateCantProd(cid, pid, quantity) {
    this.validateProductInCart(cid, pid);
    const cart = await this.getCart(cid);
    const productoIndex = cart.products.findIndex((prod) => prod.id._id.toString() === pid);
    if (productoIndex !== -1) {
      cart.products[productoIndex].quantity = quantity;
      return await this.updateCart(cid, cart.products);
    }
  }

  async deleteCart(id) {
    this.validateId(id);
    const deleted = await modelCart.deleteCart(id);
    return deleted;
  }

  async addProductToCart(cid, pid) {
    this.validateId(cid);
    this.validateProduct(pid);
    const cart = await this.getCart(cid);
    let existingProduct = cart.products.find(p => p.id._id.toString() === pid.toString());
    console.log(existingProduct);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        let newProduct = {
            id: pid.toString(),
            quantity: 1,
        };
        cart.products.push(newProduct);
    }

    const updatedCart = await this.updateCart(cid, cart.products);

    return updatedCart;
}


  async deleteProductInCart(cid, pid) {
    this.validateProductInCart(cid, pid);
    const cart = await this.getCart(cid);

    const newproducts = cart.products.filter((p) => p.id !== pid);
    this.updateCart(cid, newproducts);
    return await this.getCart(cid);
  }

  async getCartbyiduser(idUser) {
    const cart = await modelCart.getCartbyiduser(idUser);
    return cart;
  }

  async purchaseCart(id, email) {
    const ticket = {
        code: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
        purchase_datetime: new Date(),
        amount: 0,
        purchaser: email,
        products: [],
    };

    const cart = await this.getCart(id);

    const updatedProducts = [];

    for (const product of cart.products) {
        const productdb = await modelProduct.getProduct(product.id._id);

        if (productdb.stock >= product.quantity) {
            productdb.stock -= product.quantity;
            await modelProduct.updateProduct(
                productdb._id,
                productdb.title,
                productdb.description,
                productdb.code,
                productdb.price,
                productdb.status,
                productdb.stock,
                productdb.category,
                productdb.thumbnails
            );
            updatedProducts.push(productdb);
        } else {
            product.quantity -= productdb.stock;
            ticket.amount += productdb.price * productdb.stock;
            productdb.stock = 0;
            console.log("producto en base de datos antes de guardar", productdb);
            await modelProduct.updateProduct(
                productdb._id,
                productdb.title,
                productdb.description,
                productdb.code,
                productdb.price,
                productdb.status,
                productdb.stock,
                productdb.category,
                productdb.thumbnails
            );
            const index = cart.products.findIndex(p => p.id._id === product.id._id);
            if (index !== -1) {
                cart.products[index].quantity = product.quantity;
            }
        }
    }

    cart.products = cart.products.filter(p => !updatedProducts.some(updatedProduct => updatedProduct._id.toString() === p.id._id.toString()));

    if (cart.products.length === 0) {
        await this.deleteCart(id);
    } else {
        await this.updateCart(id, cart.products);
    }

    await ticketsModel.create(ticket);

    // Mandar el email aquí

    return ticket;
}


}

export const cartService = new CartService();
