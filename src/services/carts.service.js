import { model } from 'mongoose';
import { modelCart } from '../DAO/models/db/carts.model.db.js';
//import { modelCart } from '../DAO/models/mem/carts.model.mem.js';

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
    if (!cart.products.find(p => p.id._id.toString() === pid)) {
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
    let cartCreated=null
    if(userid){
      cartCreated = await modelCart.createCart(product,userid);
    }
    return cartCreated;
  }

  async updateCart(id,products) {
    const cartCreated = await modelCart.updateCart(id,products);
    return cartCreated;
  }

  async updateCantProd(cid, pid, quantity) {
    this.validateProductInCart(cid,pid)
    const cart = await this.getCart(cid);
    const productoIndex = cart.products.findIndex((prod) => prod.id._id.toString() === pid);
    if (productoIndex !== -1) {
      cart.products[productoIndex].quantity = quantity;
      return await this.updateCart(cid,cart.products)
    }
  }

  async deleteCart(id) {
    this.validateId(id);
    const deleted = await modelCart.deleteCart( id );
    return deleted;
  }

  async addProductToCart(cid,pid){
    this.validateId(cid);
    this.validateProduct(pid)
    const cart = await this.getCart(cid)
    let existingProduct = cart.products.find(p => p.id === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    }else {
      let newProduct = {
        id: pid.toString(),
        quantity: 1
      };
    cart.products.push(newProduct);
    }
    return await this.updateCart(cid, cart.products);
  }

  async deleteProductInCart(cid,pid){
    this.validateProductInCart(cid,pid);
    const cart = await this.getCart(cid);
    const newproducts = cart.products.filter(p => p.id !== pid);
    this.updateCart(cid,newproducts);
    return await this.getCart(cid);
  }
  
  async getCartbyiduser(idUser) {
    const cart = await modelCart.getCartbyiduser(idUser);
    return cart;
  }

}

export const cartService = new CartService();
