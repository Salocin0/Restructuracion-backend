import { ProductsModel } from '../DAO/models/products.model.js';

class ProductService {
  validatePostProduct(title, description, code, price, status, stock, category, thumbnails) {
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validatePutProduct(id, title, description, code, price, status, stock, category, thumbnails) {
    if (!id || !title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validateId(id) {
    if (!id) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validateSort(sort){
    if (sort === 'asc' || sort === 'desc') {
      sort = { price: sort };
    }else{
      sort = {};
    }
    return sort
  }
  
  /*async getAllProducts() {
    const products = await ProductsModel.find({});
    return products;
  }*/
  
  async getAllProducts(limit,page,query,sort) {
    let products = null;
    if(typeof query === "string"){
      products = await ProductsModel.paginate({$or: [{ status: query },{ category: query }]},{limit:limit, page:page, sort: this.validateSort(sort)});
    }else{
      products = await ProductsModel.paginate({},{limit:limit, page:page, sort: this.validateSort(sort)});
    }
    return products;
  }

  async getProduct(id) {
    this.validateId(id);
    const product = await ProductsModel.findById({ _id: id });
    return product;
  }

  async createProduct(title, description, code, price, status, stock, category, thumbnails) {
    this.validatePostProduct(title, description, code, price, status, stock, category, thumbnails);
    const userCreated = await ProductsModel.create({ title, description, code, price, status, stock, category, thumbnails });
    return userCreated;
  }
  
  async updateProduct(id, title, description, code, price, status, stock, category, thumbnails) {
    this.validatePostProduct(id, title, description, code, price, status, stock, category, thumbnails);
    const userUptaded = await ProductsModel.updateOne({ _id: id }, { title, description, code, price, status, stock, category, thumbnails});
    return userUptaded;
  }

  async deleteProduct(id) {
    this.validateId(id);
    const deleted = await ProductsModel.deleteOne({ _id: id });
    return deleted;
  }

  async getNextLink(link,page,hasNextPage){
    if(hasNextPage==true){
      if (link.includes('page=')) {
        const regex = /page=(\d+)/;
        const updatedUrl = link.replace(regex, `page=${page-(-1)}`);
        return "http://localhost:8080"+updatedUrl;
      } else {
        const updatedUrl = link + `?page=${2}`;
        return "http://localhost:8080"+updatedUrl;
      }
    }else{
      return null;
    }
  }

  async getPrevLink(link,page,hasPrevPage){
    if(hasPrevPage==true){
      if (link.includes('page=')) {
        const regex = /page=(\d+)/;
        const updatedUrl = link.replace(regex, `page=${page-1}`);
        return "http://localhost:8080"+updatedUrl;
      }
    }else{
      return null;
    }
  }
}

export const productService = new ProductService();
