import { cartService } from '../services/carts.service.js';
class CartController {
  async getAll(req, res) {
    try {
      const limit = req.query.limit || -1;
      const carts = await cartService.getAllCarts();
      if (limit == -1 && carts.length > 0) {
        return res.status(200).json({
          status: 'sucess',
          msg: 'Found all carts',
          data: carts,
        });
      } else if (limit != -1 && carts.length > 0) {
        return res.status(200).json({
          status: 'sucess',
          msg: 'Found ' + limit + ' carts',
          data: carts.slice(0, limit),
        });
      } else {
        return res.status(404).json({
          status: 'Error',
          msg: 'Carts not found',
          data: carts.slice(0, limit),
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
  }

  async getOne(req, res) {
    try {
      const cart = await cartService.getCart(req.params.id);
      if (typeof cart !== {}) {
        return res.status(200).json({
          status: 'sucess',
          msg: 'Cart found',
          data: cart,
        });
      } else {
        return res.status(404).json({
          status: 'Error',
          msg: 'Cart with id ' + req.params.id + ' not found',
          data: {},
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
  }

  async update(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await cartService.updateCart(cid, products);
      return res.status(200).json({
        status: 'success',
        msg: 'product in cart updated',
        data: cart,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async updateProductoToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateCantProd(cid, pid, quantity);
      if (cart) {
        return res.status(200).json({
          status: 'success',
          msg: 'product quantity updated',
          data: cart,
        });
      } else {
        return res.status(200).json({
          status: 'success',
          msg: 'bad card id or product id',
          data: {},
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
  }

  async deleteCart(req, res) {
    try {
      const cid = req.params.cid;
      let products = new Array();
      const cart = await cartService.updateCart(cid, products);
      return res.status(200).json({
        status: 'success',
        msg: 'products deleted in cart',
        data: cart,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async deleteProductInCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.deleteProductInCart(cid, pid);
      return res.status(200).json({
        status: 'success',
        msg: 'product deleted in cart',
        data: cart,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async create(req, res) {
    try {
      const cartCreated = await cartService.createCart(req.user?.id);
      return res.status(201).json({
        status: 'success',
        msg: 'cart created',
        data: cartCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async addProductoToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cartUptaded = await cartService.addProductToCart(cid, pid);
      if (typeof cart !== {}) {
        return res.status(200).json({
          status: 'sucess',
          msg: 'Product added',
          data: cartUptaded,
        });
      } else {
        return res.status(404).json({
          status: 'Error',
          msg: 'error to add product: ' + productId + ' to cart: ' + cartId,
          data: { cart },
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
  }
}

export const cartController = new CartController();
