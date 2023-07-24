import { CartsModel } from '../DAO/models/carts.model.js';
import { ProductsModel } from '../DAO/models/products.model.js';

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
    const carts = await CartsModel.find({});
    return carts;
  }

  async getCart(id) {
    this.validateId(id);
    const cart = await CartsModel.findById(id).populate({
      path: "products",
      populate: {
        path: "id",
        model: ProductsModel,
      },
    });
    return cart;
  }

  async createCart() {
    let product = new Array();
    const cartCreated = await CartsModel.create({product});
    return cartCreated;
  }

  async updateCart(id,products) {
    const cartCreated = await CartsModel.updateOne({ _id: id }, { products: products });
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
    const deleted = await CartsModel.deleteOne({ _id: id });
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
  
}

export const cartService = new CartService();
