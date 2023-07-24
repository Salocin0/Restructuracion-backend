import { productService } from '../services/products.service.js';
class ProductControler {
  async getAll(req, res) {
    try {
      const limit = req.query.limit || 5;
      const page = req.query.page || 1;
      const query = req.query.query;
      const sort = req.query.sort;
      const requestUrl = req.originalUrl;
      const result = await productService.getAllProducts(limit, page, query, sort, requestUrl);
      if (result.products) {
        return res.status(200).json({
          status: 'sucess',
          msg: 'Found productos',
          payload: result.products.docs,
          totalPages: result.products.totalPages,
          prevPage: result.products.prevPage,
          nextPage: result.products.nextPage,
          page: result.products.page,
          hasPrevPage: result.products.hasPrevPage,
          hasNextPage: result.products.hasNextPage,
          prevLink: result.prevlink,
          nextLink: result.nextlink,
        });
      } else {
        return res.status(404).json({
          status: 'Error',
          msg: 'Products not found',
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

  async getOne(req, res) {
    try {
      const product = await productService.getProduct(req.params.id);
      if (typeof product !== {}) {
        return res.status(200).json({
          status: 'sucess',
          msg: 'product found',
          data: product,
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

  async create(req, res) {
    try {
      const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
      const ProductCreated = await productService.createProduct(title, description, code, price, status, stock, category, thumbnails);
      if (ProductCreated.code===400) {
        return res.status(400).json({
          status: 'error',
          msg: 'code used',
          data: {},
        });
      } else {
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
  }

  async update(req, res) {
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
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      return res.status(200).json({
        status: 'success',
        msg: 'product deleted',
        data: deleted,
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
}

export const productControler = new ProductControler();
